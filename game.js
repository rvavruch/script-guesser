// Game logic. Depends on the global SCRIPTS array from data.js.
// State lives in module-level variables; no persistence across reloads.

const ROUND_SIZE = 5;
const OPTION_COUNT = 6;
const WEIGHTS = [300, 400, 700];
const ITALIC_PROBABILITY = 0.33; // only applies to scripts with latinScript: true

let round = null; // { challenges: [...], index: 0, score: 0 }

const stage = document.getElementById("stage");
const statusBar = document.getElementById("status-bar");

// ---------- helpers ----------

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function fontFamilyRoot(name) {
  // "Noto Sans KR" / "Noto Sans Tamil" → "Noto Sans" (cross-script counterpart match).
  // "Noto Serif Hebrew" / "Noto Serif Devanagari" → "Noto Serif".
  // Other fonts have no cross-script counterparts in the catalog, so return full name.
  const parts = name.split(" ");
  if (parts[0] === "Noto" && parts.length >= 2) return parts[0] + " " + parts[1];
  return name;
}

function findCounterpartFont(originalFont, candidateFonts) {
  const root = fontFamilyRoot(originalFont);
  return candidateFonts.find((f) => fontFamilyRoot(f) === root) || null;
}

function findGuessedScript(ch) {
  if (!ch.guess) return null;
  return ch.mode === "name"
    ? SCRIPTS.find((s) => s.name === ch.guess)
    : SCRIPTS.find((s) => s.region === ch.guess);
}

// ---------- map (Leaflet + bundled country GeoJSON) ----------

// HKG, MAC, SGP are absent from the simplified world.geo.json (city-states /
// SARs are commonly omitted at country-level resolution). Use small bbox
// rectangles so they still render as a highlighted shape on the map.
const SUPPLEMENTAL_GEOMETRIES = {
  HKG: { type: "Polygon", coordinates: [[[113.83, 22.15], [114.45, 22.15], [114.45, 22.55], [113.83, 22.55], [113.83, 22.15]]] },
  MAC: { type: "Polygon", coordinates: [[[113.53, 22.09], [113.60, 22.09], [113.60, 22.22], [113.53, 22.22], [113.53, 22.09]]] },
  SGP: { type: "Polygon", coordinates: [[[103.60, 1.20],  [104.05, 1.20],  [104.05, 1.48],  [103.60, 1.48],  [103.60, 1.20]]] }
};

let _countriesGeoPromise = null;
function loadCountriesGeo() {
  if (!_countriesGeoPromise) {
    _countriesGeoPromise = fetch("countries.geo.json").then((r) => r.json());
  }
  return _countriesGeoPromise;
}
loadCountriesGeo(); // pre-fetch at boot so the first map render is fast

let _currentMap = null;
function disposeMap() {
  if (_currentMap) {
    _currentMap.remove();
    _currentMap = null;
  }
}

async function renderMap(elementId, ch) {
  if (typeof L === "undefined") return; // Leaflet failed to load
  const el = document.getElementById(elementId);
  if (!el) return;

  const geo = await loadCountriesGeo();
  // `code` may be a string or array of strings (e.g. Devanagari spans many states).
  const codes = ch.correct.countries.flatMap((c) =>
    Array.isArray(c.code) ? c.code : c.code ? [c.code] : []
  );
  const features = [];
  for (const code of codes) {
    const f = geo.features.find((ff) => ff.id === code);
    if (f) {
      features.push(f);
    } else if (SUPPLEMENTAL_GEOMETRIES[code]) {
      features.push({
        type: "Feature",
        id: code,
        properties: { name: code },
        geometry: SUPPLEMENTAL_GEOMETRIES[code]
      });
    }
  }

  // Replace any prior map (re-renders during the same feedback view).
  disposeMap();
  const map = L.map(el, { attributionControl: true, scrollWheelZoom: false });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
    maxZoom: 8
  }).addTo(map);

  // Cap auto-zoom so small countries (Sri Lanka, Singapore, Israel) still show
  // surrounding regional context — useful for GeoGuessr orientation. Large
  // multi-country spans (Hindi belt + Nepal, Arabic across MENA) need wider
  // views than this anyway, so the cap rarely engages there.
  const fitOpts = { padding: [12, 12], maxZoom: 4 };

  if (features.length > 0) {
    const layer = L.geoJSON(
      { type: "FeatureCollection", features },
      { style: { color: "#3ddc97", weight: 2, fillColor: "#3ddc97", fillOpacity: 0.35 } }
    ).addTo(map);
    try {
      map.fitBounds(layer.getBounds(), fitOpts);
    } catch (_e) {
      const [minLon, minLat, maxLon, maxLat] = ch.correct.mapBbox.split(",").map(Number);
      map.fitBounds([[minLat, minLon], [maxLat, maxLon]], fitOpts);
    }
  } else {
    const [minLon, minLat, maxLon, maxLat] = ch.correct.mapBbox.split(",").map(Number);
    map.fitBounds([[minLat, minLon], [maxLat, maxLon]], fitOpts);
  }

  _currentMap = map;
}

function buildRound() {
  // 5 distinct scripts.
  const chosen = shuffle(SCRIPTS).slice(0, ROUND_SIZE);

  const challenges = chosen.map((correct) => {
    const sample = pick(correct.samples);
    const font = pick(correct.fonts);
    const weight = pick(WEIGHTS);
    const italic = Boolean(correct.latinScript) && Math.random() < ITALIC_PROBABILITY;
    const mode = Math.random() < 0.5 ? "name" : "region";

    // Distractors: scripts whose displayed label (name or region) differs from correct's,
    // de-duplicated by displayed label so the visible 6 buttons are unique.
    // Family rule: if any same-family script is available, pin one as a distractor
    // so the player has to actually distinguish similar scripts (e.g. Telugu vs Tamil),
    // not just rule out the obvious other clusters.
    const labelOf = (s) => (mode === "name" ? s.name : s.region);
    const correctLabel = labelOf(correct);

    const seen = new Set([correctLabel]);
    const pool = [];
    for (const s of SCRIPTS) {
      if (s.id === correct.id) continue;
      const lbl = labelOf(s);
      if (seen.has(lbl)) continue;
      seen.add(lbl);
      pool.push(s);
    }

    const family = pool.filter((s) => correct.family && s.family === correct.family);
    const others = pool.filter((s) => !family.includes(s));

    const distractors = [];
    if (family.length > 0) distractors.push(pick(family));
    const fillers = shuffle([
      ...others,
      ...family.filter((s) => !distractors.includes(s)),
    ]);
    for (const s of fillers) {
      if (distractors.length >= OPTION_COUNT - 1) break;
      distractors.push(s);
    }

    const optionScripts = shuffle([correct, ...distractors]);
    const options = optionScripts.map(labelOf);

    return {
      correct,
      sample,
      font,
      weight,
      italic,
      mode,
      options,
      correctLabel,
      // Filled in after the player guesses:
      guess: null,
      isCorrect: null,
    };
  });

  return { challenges, index: 0, score: 0 };
}

function renderStatus() {
  if (!round) {
    statusBar.textContent = "";
    return;
  }
  statusBar.innerHTML =
    `<span>Challenge ${round.index + 1} of ${ROUND_SIZE}</span>` +
    `<span>Score: ${round.score}</span>`;
}

// ---------- screens ----------

function renderStart() {
  disposeMap();
  round = null;
  renderStatus();
  stage.innerHTML = `
    <div class="start">
      <h2>Spot the script.</h2>
      <p>Five challenges per round. Each shows a real word or phrase in one Asian script. Pick which script (or which region) it's from. Built for GeoGuessr practice.</p>
      <button class="btn" id="start-btn">Start round</button>
    </div>
  `;
  document.getElementById("start-btn").addEventListener("click", () => {
    round = buildRound();
    renderChallenge();
  });
}

function sampleStyle(ch) {
  return `font-family: '${ch.font}', sans-serif; font-weight: ${ch.weight}; font-style: ${ch.italic ? "italic" : "normal"}`;
}

function comparisonHtml(ch) {
  if (ch.isCorrect) return "";
  const guessed = findGuessedScript(ch);
  if (!guessed) return "";

  // Try to render the comparison in the same font family as the original (e.g.
  // both as Noto Sans or both as Noto Serif). Fall back to a random font from
  // the guessed script's list when no counterpart exists.
  const compFont = findCounterpartFont(ch.font, guessed.fonts) || pick(guessed.fonts);
  const compSample = pick(guessed.samples);
  const compItalic = ch.italic && Boolean(guessed.latinScript);
  const style = `font-family: '${compFont}', sans-serif; font-weight: ${ch.weight}; font-style: ${compItalic ? "italic" : "normal"}`;

  return `
    <div class="comparison">
      <div class="prompt">For comparison — ${escapeHtml(guessed.name)} (${escapeHtml(guessed.region)}):</div>
      <div class="sample comparison-sample" dir="auto" style="${style}">${escapeHtml(compSample)}</div>
    </div>
  `;
}

function renderChallenge() {
  disposeMap();
  renderStatus();
  const ch = round.challenges[round.index];
  const promptText =
    ch.mode === "name" ? "Which script is this?" : "Where is this from?";

  stage.innerHTML = `
    <div class="prompt">${promptText}</div>
    <div class="sample" id="sample" dir="auto" style="${sampleStyle(ch)}">${escapeHtml(ch.sample)}</div>
    <div class="options" id="options"></div>
    <div class="actions">
      <button class="btn" id="guess-btn" disabled>Guess</button>
    </div>
  `;

  const optionsEl = document.getElementById("options");
  let selected = null;

  ch.options.forEach((label) => {
    const b = document.createElement("button");
    b.className = "option";
    b.type = "button";
    b.textContent = label;
    b.addEventListener("click", () => {
      if (b.disabled) return;
      [...optionsEl.children].forEach((c) => c.classList.remove("selected"));
      b.classList.add("selected");
      selected = label;
      document.getElementById("guess-btn").disabled = false;
    });
    optionsEl.appendChild(b);
  });

  document.getElementById("guess-btn").addEventListener("click", () => {
    if (!selected) return;
    ch.guess = selected;
    ch.isCorrect = selected === ch.correctLabel;
    if (ch.isCorrect) round.score++;
    renderFeedback();
  });
}

function renderFeedback() {
  renderStatus();
  const ch = round.challenges[round.index];
  const promptText =
    ch.mode === "name" ? "Which script is this?" : "Where is this from?";

  const tipsHtml = ch.correct.tips.map((t) => `<li>${escapeHtml(t)}</li>`).join("");
  const countriesHtml = ch.correct.countries
    .map((c) => `<span class="country">${c.flag} ${escapeHtml(c.name)}</span>`)
    .join("");

  // Re-render same sample in same font so the player can re-look at exactly what they failed on.
  stage.innerHTML = `
    <div class="prompt">${promptText}</div>
    <div class="sample" dir="auto" style="${sampleStyle(ch)}">${escapeHtml(ch.sample)}</div>
    <div class="options" id="options"></div>
    <div class="feedback ${ch.isCorrect ? "correct" : "wrong"}">
      <h3>${ch.isCorrect ? "Correct!" : "Not quite."}</h3>
      <div>That was <strong>${escapeHtml(ch.correct.name)}</strong> — ${escapeHtml(ch.correct.region)}.</div>
      ${comparisonHtml(ch)}
      <ul>${tipsHtml}</ul>
      <div class="history"><strong>History:</strong> ${escapeHtml(ch.correct.history)}</div>
      <div class="regions"><strong>Used in:</strong> ${countriesHtml}</div>
      <div class="map-canvas" id="result-map" aria-label="Map showing where ${escapeHtml(ch.correct.name)} is used"></div>
    </div>
    <div class="actions">
      <button class="btn" id="next-btn">${round.index + 1 < ROUND_SIZE ? "Next" : "See score"}</button>
    </div>
  `;

  const optionsEl = document.getElementById("options");
  ch.options.forEach((label) => {
    const b = document.createElement("button");
    b.className = "option";
    b.type = "button";
    b.disabled = true;
    b.textContent = label;
    if (label === ch.correctLabel) b.classList.add("correct");
    else if (label === ch.guess) b.classList.add("wrong");
    optionsEl.appendChild(b);
  });

  document.getElementById("next-btn").addEventListener("click", () => {
    round.index++;
    if (round.index >= ROUND_SIZE) renderSummary();
    else renderChallenge();
  });

  // Render the map after the DOM is in place. Async (waits for GeoJSON fetch).
  renderMap("result-map", ch);
}

function renderSummary() {
  disposeMap();
  statusBar.innerHTML = `<span>Round complete</span>`;
  const items = round.challenges.map((ch) => {
    const right = ch.isCorrect;
    const detail = right
      ? `${escapeHtml(ch.correct.name)}`
      : `${escapeHtml(ch.correct.name)} — you said <em>${escapeHtml(ch.guess ?? "—")}</em>`;
    return `<li class="${right ? "right" : "wrong"}"><span>${right ? "✓" : "✗"} ${detail}</span><span>${escapeHtml(ch.correct.region)}</span></li>`;
  }).join("");

  stage.innerHTML = `
    <div class="summary">
      <h2>Round complete</h2>
      <div class="score">${round.score} / ${ROUND_SIZE}</div>
      <ul class="breakdown">${items}</ul>
      <div class="actions">
        <button class="btn" id="again-btn">Play again</button>
      </div>
    </div>
  `;

  document.getElementById("again-btn").addEventListener("click", () => {
    round = buildRound();
    renderChallenge();
  });
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// ---------- boot ----------

renderStart();

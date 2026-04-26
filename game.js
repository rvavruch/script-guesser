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

function buildChallenge() {
  // Pick the script to be tested. (Caller decides which script via index into round.challenges.)
  // This function only constructs a challenge object given a chosen correct script.
  throw new Error("buildChallenge is built inline in startRound; do not call directly.");
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

function renderChallenge() {
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

  // Re-render same sample in same font so the player can re-look at exactly what they failed on.
  stage.innerHTML = `
    <div class="prompt">${promptText}</div>
    <div class="sample" dir="auto" style="${sampleStyle(ch)}">${escapeHtml(ch.sample)}</div>
    <div class="options" id="options"></div>
    <div class="feedback ${ch.isCorrect ? "correct" : "wrong"}">
      <h3>${ch.isCorrect ? "Correct!" : "Not quite."}</h3>
      <div>That was <strong>${escapeHtml(ch.correct.name)}</strong> — ${escapeHtml(ch.correct.region)}.</div>
      <ul>${tipsHtml}</ul>
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
}

function renderSummary() {
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

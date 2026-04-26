// Script catalog. Source: "Asian script examples.xlsx" (rows 1-12) plus four
// additions for GeoGuessr-relevant Asian countries the spreadsheet missed:
// Bengali (Bangladesh), Sinhala (Sri Lanka), Hebrew (Israel), Arabic (UAE/Jordan/Egypt).
//
// `family` groups visually-confusable scripts. The game guarantees that at least
// one wrong option per challenge comes from the same family, when at least one
// family-mate exists in the catalog. Families:
//   - cjk:           Korean, Japanese, Chinese (Traditional)
//   - se-asian:      Thai, Lao, Khmer, Burmese
//   - brahmic-north: Devanagari, Bengali, Gujarati
//   - brahmic-south: Telugu, Tamil, Sinhala
//   - semitic:       Hebrew, Arabic
//   - latin:         Vietnamese (alone — no family pinning applied)
//
// `latinScript: true` opts a script into italic variation. Italic doesn't apply
// to non-Latin scripts and synthesised italic on RTL/syllabic scripts looks broken.
//
// `tips` are written for cross-family discrimination — each script's tips note
// how to distinguish it from its closest visual cousins, since that's the harder
// teaching task than spotting a CJK script vs an RTL one.
//
// `history` is a 2–3 sentence note that explains *why* the script looks the way
// it does — invented vs evolved, palm-leaf vs stone inscription, etc.
//
// `countries` and `mapBbox` drive the OpenStreetMap embed shown after each guess.
// mapBbox format: "minLon,minLat,maxLon,maxLat" (ready to insert into the
// /export/embed.html?bbox= URL).

const SCRIPTS = [
  {
    id: "korean",
    name: "Korean",
    region: "South Korea",
    family: "cjk",
    samples: [
      "시작이 반이다. 날씨가 아주 좋네요.",
      "안녕하세요, 만나서 반갑습니다.",
      "서울특별시 강남구 역삼동",
      "김치찌개 한 그릇 주세요",
      "관계자 외 출입을 금합니다",
      "지하철 2호선 강남역 출구",
      "오늘 비빔밥과 막걸리를 먹었습니다",
      "여기는 주차 금지 구역입니다"
    ],
    fonts: ["Noto Sans KR", "Noto Serif KR", "Nanum Pen Script", "Black Han Sans"],
    tips: [
      "Square syllable blocks with circles (ㅇ) and squares — very geometric and modular.",
      "Each block packs 2–4 jamo (letter parts) into a roughly square shape, like a tiny grid.",
      "vs Japanese: Korean has no curly cursive characters (の) and no Han ideographs in modern signage. Pure Hangul is a flat field of square blocks.",
      "vs Chinese: Chinese is dense ideographs without any circles. Korean's circles ㅇ are the easiest tell."
    ],
    history: "Created in 1443 by King Sejong the Great, designed as a phonetic alphabet to replace Chinese characters and lift commoner literacy. Hangul is one of the few writing systems with a known inventor — and the consonant shapes deliberately mimic the position of the mouth and tongue when producing each sound.",
    countries: [{ flag: "🇰🇷", name: "South Korea" }],
    mapBbox: "124.5,33.0,131.0,39.0"
  },
  {
    id: "japanese",
    name: "Japanese",
    region: "Japan",
    family: "cjk",
    samples: [
      "石の上にも三年。日本語を勉強します。",
      "東京都渋谷区桜丘町",
      "いらっしゃいませ、何名様ですか",
      "ラーメンと寿司を食べました",
      "新宿駅の東口で待っています",
      "立入禁止区域につき注意してください",
      "コンビニで弁当を買いました",
      "桜の季節になりました"
    ],
    fonts: ["Noto Sans JP", "Noto Serif JP", "Sawarabi Mincho", "Yusei Magic"],
    tips: [
      "Three scripts at once — Kanji (complex), Hiragana (curly の), Katakana (angular ナ).",
      "If you see all three together, it's Japan. The signature swirly の almost always appears.",
      "vs Korean: Korean's blocks are uniform; Japanese mixes complex characters with simple kana.",
      "vs Chinese: mainland Chinese has only Han characters; if any kana (の, ナ, ロ) is mixed in, it's Japanese.",
      "Real-world: white license plates with green or black text."
    ],
    history: "Imported Chinese characters (Kanji) arrived in Japan around the 5th century AD. Hiragana and Katakana were developed in the 9th–10th centuries — Hiragana from cursive Kanji shorthand used by court women, Katakana from Kanji fragments used by Buddhist monks. Modern Japanese mixes all three deliberately, with each script taking different roles in a sentence.",
    countries: [{ flag: "🇯🇵", name: "Japan" }],
    mapBbox: "129.0,30.0,146.0,46.0"
  },
  {
    id: "chinese-traditional",
    name: "Chinese (Traditional)",
    region: "Taiwan / Hong Kong",
    family: "cjk",
    samples: [
      "知己知彼，百戰不殆。歡迎來到台灣。",
      "請勿吸菸，謝謝合作",
      "臺北市信義區忠孝東路",
      "茶餐廳今日特餐三十元",
      "出口請走樓梯謝謝",
      "九龍灣站下車轉乘地鐵",
      "中華民國國慶日快樂",
      "牛肉麵店今晚不營業"
    ],
    fonts: ["Noto Sans TC", "Noto Serif TC", "ZCOOL XiaoWei", "Long Cang"],
    tips: [
      "Dense, uniform Han characters — no circles like Korean, no curly kana like Japanese.",
      "Traditional has many strokes packed in (灣, 龜, 體) compared to Simplified's reduced forms (湾, 龟, 体).",
      "Mainland China is NOT on Street View — Han you see in GeoGuessr is almost always Traditional (Taiwan, Hong Kong, Macau).",
      "vs Japanese: if there's any の, ナ, ロ kana mixed in, it's not Chinese."
    ],
    history: "Han characters have been in continuous use for over 3,000 years — one of the oldest writing systems still in everyday use. The PRC introduced Simplified Chinese in the 1950s to raise literacy, but Taiwan, Hong Kong, and Macau retained Traditional forms. Since mainland China isn't on Street View, GeoGuessr's Han is nearly always Traditional.",
    countries: [
      { flag: "🇹🇼", name: "Taiwan" },
      { flag: "🇭🇰", name: "Hong Kong" },
      { flag: "🇲🇴", name: "Macau" }
    ],
    mapBbox: "113.0,21.0,123.0,26.0"
  },
  {
    id: "thai",
    name: "Thai",
    region: "Thailand",
    family: "se-asian",
    samples: [
      "รักวัวให้ผูก รักลูกให้ตี ยินดีที่ได้รู้จักครับ",
      "กรุงเทพมหานคร เมืองหลวงของประเทศไทย",
      "ขอบคุณมากครับ ขอให้โชคดี",
      "ส้มตำไทย รสชาติเผ็ดมาก",
      "ห้ามจอดรถ บริเวณนี้ตลอดเวลา",
      "สวัสดีครับ ยินดีที่ได้รู้จัก",
      "ทางเข้าด้านหลังของอาคาร",
      "ข้าวผัดกระเพราหมูกรอบ ห้าสิบบาท"
    ],
    fonts: ["Noto Sans Thai", "Noto Serif Thai", "Sarabun", "Prompt"],
    tips: [
      "Tone marks above the line (◌่ ◌้ ◌๊ ◌๋) are almost always present — Thai is heavily tonal and these survive in any Thai font.",
      "Two font styles in real life: looped (Sarabun, traditional — tiny terminal head-loop on every consonant) and loopless (Prompt, Kanit, modern — clean opens). Both appear on Thai signage; the loops disappear in modern fonts.",
      "Mix of angular AND rounded letters in one phrase (ก ข ค vs ส ม น). This shape variety is Thai-specific.",
      "vs Lao: Lao is uniformly rounder, has internal bubbles in letters (ມ ບ ດ), and shows less variety per phrase (27 letters vs Thai's 44).",
      "vs Khmer: Khmer is busier — subscripts hang below the baseline and many letters wear 'wavy crowns' (ស). Thai's baseline stays clean.",
      "vs Burmese: Burmese is almost all circles. If you see angular strokes, it's not Burmese.",
      "Real-world: blue/white street signs, left-hand drive."
    ],
    history: "Created in 1283 by King Ramkhamhaeng of Sukhothai, derived from the Old Khmer script. Designed deliberately to fit Thai's tonal nature with explicit tone marks above the line. The traditional looped style mirrors the Sukhothai stone inscriptions; the loopless modern style (Prompt, Kanit) is a 20th–21st century convention for cleaner branding.",
    countries: [{ flag: "🇹🇭", name: "Thailand" }],
    mapBbox: "97.0,5.6,105.6,20.5"
  },
  {
    id: "lao",
    name: "Lao",
    region: "Laos",
    family: "se-asian",
    samples: [
      "ສະບາຍດີ ກິນເຂົ້າແລ້ວບໍ່ ຍິນດີທີ່ໄດ້ຮູ້ຈັກ",
      "ນະຄອນຫຼວງວຽງຈັນ ປະເທດລາວ",
      "ຂອບໃຈຫຼາຍໆ ສຳລັບການຊ່ວຍເຫຼືອ",
      "ຫ້າມຈອດລົດ ຢູ່ບໍລິເວນນີ້",
      "ທາງເຂົ້າ ຮ້ານອາຫານລາວ",
      "ຮ້ານອາຫານ ເປີດທຸກວັນ"
    ],
    fonts: ["Noto Sans Lao", "Noto Serif Lao"],
    tips: [
      "Bubbly/rounded — like a softer, simpler Thai. Notice closed circles INSIDE letters (ມ ບ ດ have round bowls).",
      "Fewer letters than Thai (27 vs 44), so a Lao phrase shows less shape variety.",
      "vs Thai: Thai mixes angular and rounded; Lao is uniformly rounded. Tone marks appear but less densely.",
      "vs Khmer: Khmer has wavy crowns (ស) and dangles bits below the line. Lao stays clean above and below.",
      "Real-world tell: yellow private-car license plates, right-hand drive."
    ],
    history: "Closely related to Thai — both descended from Old Khmer via the Sukhothai inscription style. The Lao alphabet was simplified during 20th-century reforms (silent etymological consonants were dropped), giving it 27 letters compared to Thai's 44. That's why Lao text often looks 'simpler' than Thai of the same length.",
    countries: [{ flag: "🇱🇦", name: "Laos" }],
    mapBbox: "100.0,13.5,108.0,22.5"
  },
  {
    id: "khmer",
    name: "Khmer",
    region: "Cambodia",
    family: "se-asian",
    samples: [
      "ធ្វើស្រែនឹងទឹក ធ្វើសឹកនឹងបាយ សួស្តីឆ្នាំថ្មី",
      "រាជធានីភ្នំពេញ ប្រទេសកម្ពុជា",
      "អរគុណច្រើន សម្រាប់ការជួយ",
      "ហាមជក់បារី ក្នុងបន្ទប់នេះ",
      "ច្រកចូល ភោជនីយដ្ឋានខ្មែរ",
      "សៀមរាប ប្រាសាទអង្គរវត្ត",
      "សួស្ដី ខ្ញុំសុខសប្បាយ"
    ],
    fonts: ["Noto Sans Khmer", "Noto Serif Khmer", "Battambang", "Moul"],
    tips: [
      "Wavy crowns on top of many letters (ស ដ) — ornate, decorative.",
      "Subscript consonants hang below the baseline — text feels 'busy' both above AND below the line.",
      "vs Thai/Lao: those have clean baselines with marks only above. Khmer dangles bits below the line.",
      "vs Burmese: Burmese is all circles; Khmer has angular and decorated forms.",
      "Khmer is the parent of Thai and Lao — Sukhothai's Ramkhamhaeng adapted Old Khmer in the 13th century. That's why Thai/Lao basic shapes feel familiar."
    ],
    history: "One of the oldest Brahmic-derived scripts in SE Asia, used since around the 7th century AD during the early Khmer Empire (Angkor period). Old Khmer is the parent of both Thai and Lao — Sukhothai's King Ramkhamhaeng modified it when designing Thai in 1283. The ornate temple-inscription style is preserved in modern Khmer signage today.",
    countries: [{ flag: "🇰🇭", name: "Cambodia" }],
    mapBbox: "102.0,10.0,108.0,15.0"
  },
  {
    id: "burmese",
    name: "Burmese",
    region: "Myanmar",
    family: "se-asian",
    samples: [
      "မင်္ဂလာပါ လူပျိုကြီး နေကောင်းလားခင်ဗျာ",
      "ရန်ကုန်မြို့ မြန်မာနိုင်ငံ",
      "ကျေးဇူးတင်ပါတယ် အကူအညီအတွက်",
      "မန္တလေးမြို့ ဒုတိယမြို့တော်",
      "ဝန်ထမ်းသာ ဝင်ခွင့်ပြုသည်",
      "ဆေးလိပ်မသောက်ရ ကျေးဇူးပြု၍"
    ],
    fonts: ["Noto Sans Myanmar", "Noto Serif Myanmar", "Padauk"],
    tips: [
      "Almost entirely circles and C-shapes — like a row of soap bubbles or Cheerios.",
      "Very few straight lines anywhere. If you see angular strokes, it's NOT Burmese.",
      "vs Thai/Lao/Khmer: those have angular consonants too. Burmese has none — that's the cleanest single tell in the SE Asian family.",
      "Real-world: rare in GeoGuessr (limited Street View coverage of Myanmar)."
    ],
    history: "Descends from the Pyu/Mon scripts (~11th century), Brahmic offshoots brought to Burma by Buddhist missionaries. The very rounded forms come from palm-leaf writing — straight lines split the leaf when carved with a stylus, so scribes made everything curved. Sinhala and Telugu share the same palm-leaf origin story and the same circular tendency.",
    countries: [{ flag: "🇲🇲", name: "Myanmar" }],
    mapBbox: "92.0,9.0,101.0,28.5"
  },
  {
    id: "devanagari",
    name: "Devanagari",
    region: "North India / Nepal",
    family: "brahmic-north",
    samples: [
      "वसुधैव कुटुम्बकम्। आप कैसे हैं?",
      "नई दिल्ली भारत की राजधानी",
      "धन्यवाद आपकी मदद के लिए",
      "नमस्ते आप कैसे हैं",
      "मुंबई महाराष्ट्र की राजधानी",
      "धूम्रपान निषेध है यहाँ",
      "प्रवेश द्वार बंद है",
      "रेलवे स्टेशन इस तरफ है"
    ],
    fonts: ["Noto Sans Devanagari", "Noto Serif Devanagari", "Hind", "Mukta"],
    tips: [
      "Continuous horizontal headstroke (shirorekha) along the top of words — नमस्ते.",
      "Letters hang from the headstroke like clothes on a line. Blocky, upright shapes below.",
      "vs Bengali: Bengali also has the headstroke but with curvier, flame-shaped letters and triangular hooks below.",
      "vs Gujarati: Gujarati looks like Devanagari with the headstroke removed.",
      "Used for Hindi, Marathi, Sanskrit, Nepali — your North India + Nepal signal."
    ],
    history: "Descends from Brahmi (~3rd century BC, the script of Ashoka's edicts) via the Gupta script and Nāgarī. Took its modern form around 1000 years ago. The 'headstroke' is a relic of scribes drawing a guideline first to keep characters aligned during palm-leaf or paper writing.",
    countries: [
      { flag: "🇮🇳", name: "India (north)" },
      { flag: "🇳🇵", name: "Nepal" }
    ],
    mapBbox: "68.0,22.0,89.0,32.0"
  },
  {
    id: "gujarati",
    name: "Gujarati",
    region: "Gujarat (India)",
    family: "brahmic-north",
    samples: [
      "તમે કેમ છો? ગુજરાતમાં તમારું સ્વાગત છે.",
      "અમદાવાદ ગુજરાતનું મોટું શહેર",
      "આભાર તમારી મદદ માટે",
      "નમસ્તે કેમ છો તમે",
      "પ્રવેશ માટે ટિકિટ જરૂરી",
      "સ્વાગત છે અમારા ઘરે"
    ],
    fonts: ["Noto Sans Gujarati", "Noto Serif Gujarati", "Hind Vadodara", "Mukta Vaani"],
    tips: [
      "Looks like Devanagari but with NO headstroke. \"Broken clothesline\".",
      "Letters round at the top instead of being capped flat — curvier than Devanagari.",
      "vs Devanagari: same letter skeletons, missing the top bar.",
      "vs Bengali: Bengali keeps the headstroke and adds flame-shaped curves; Gujarati is rounder and bar-less.",
      "Used in Gujarat — coastal NW India."
    ],
    history: "Diverged from Devanagari around the 16th century. The 'missing headstroke' is widely attributed to Gujarat's mercantile culture: traders wanted faster handwriting, and dropping the top bar saved time per character. The script crystallised in the 19th century with the rise of printed Gujarati literature.",
    countries: [{ flag: "🇮🇳", name: "Gujarat (India)" }],
    mapBbox: "68.0,20.0,75.0,25.0"
  },
  {
    id: "telugu",
    name: "Telugu",
    region: "South India",
    family: "brahmic-south",
    samples: [
      "నమస్కారం, మీరు ఎలా ఉన్నారు? తెలుగు భాష.",
      "హైదరాబాద్ తెలంగాణ రాష్ట్ర రాజధాని",
      "ధన్యవాదాలు మీ సహాయానికి",
      "విజయవాడ ఆంధ్రప్రదేశ్ లోని నగరం",
      "ప్రవేశం ఉచితం అందరికీ",
      "మా ఇంటికి స్వాగతం"
    ],
    fonts: ["Noto Sans Telugu", "Noto Serif Telugu", "Hind Guntur", "Ramaraja"],
    tips: [
      "Very rounded letters with a small \"check-mark\" or v-tick on top of nearly every character.",
      "Nothing angular — pure curves. Looks like 'O's wearing tiny party hats'.",
      "vs Tamil: Tamil is boxy and angular; Telugu is round with the distinctive top tick.",
      "vs Sinhala: Sinhala is loop-heavy (often double-looped); Telugu uses single loops with the top tick.",
      "Used in the Telugu-speaking states (Andhra Pradesh, Telangana)."
    ],
    history: "Derived from the Kadamba script (~5th century AD), a southern offshoot of Brahmi. The distinctive 'check-mark' on top of letters comes from palm-leaf inscription technique — strokes had to avoid splitting the leaf, producing rounded shapes with delicate top hooks. Kannada (a sister script) shares the same origin and looks very similar.",
    countries: [{ flag: "🇮🇳", name: "Andhra Pradesh / Telangana" }],
    mapBbox: "76.0,12.0,85.0,20.0"
  },
  {
    id: "tamil",
    name: "Tamil",
    region: "South India / Sri Lanka",
    family: "brahmic-south",
    samples: [
      "யாதும் ஊரே யாவரும் கேளிர். வணக்கம்.",
      "சென்னை தமிழ்நாட்டின் தலைநகரம்",
      "நன்றி உங்கள் உதவிக்கு",
      "வணக்கம் எப்படி இருக்கிறீர்கள்",
      "மதுரை மீனாட்சி அம்மன் கோயில்",
      "சென்னை மெட்ரோ ரயில் நிலையம்",
      "தயவுசெய்து இங்கே புகைப்பிடிக்க வேண்டாம்"
    ],
    fonts: ["Noto Sans Tamil", "Noto Serif Tamil", "Hind Madurai", "Catamaran"],
    tips: [
      "Boxy/angular letterforms — square-looking, mechanical, no top features.",
      "Far fewer loops than other South Indian scripts — the most rectilinear of the family.",
      "vs Telugu: Telugu is round with checkmarks; Tamil is angular without.",
      "vs Sinhala: Sinhala is loop-heavy and curvy; Tamil is straight-edged.",
      "Used in Tamil Nadu, parts of Sri Lanka, and Singapore signage."
    ],
    history: "One of the oldest continuously-used scripts in India, with a distinct lineage from Tamil-Brahmi (~3rd century BC). The angular, boxy shapes survived because Tamil was often inscribed on stone or metal, where curves were harder to carve cleanly than straight lines — the opposite trade-off from Telugu and Sinhala's palm-leaf curves.",
    countries: [
      { flag: "🇮🇳", name: "Tamil Nadu (India)" },
      { flag: "🇱🇰", name: "Sri Lanka (north)" },
      { flag: "🇸🇬", name: "Singapore" }
    ],
    mapBbox: "76.0,5.0,82.0,14.0"
  },
  {
    id: "vietnamese",
    name: "Vietnamese",
    region: "Vietnam",
    family: "latin",
    latinScript: true,
    samples: [
      "Chúc mừng năm mới! Bạn có khỏe không?",
      "Thành phố Hồ Chí Minh hiện đại",
      "Phở bò Hà Nội rất ngon",
      "Cảm ơn bạn rất nhiều",
      "Cấm hút thuốc trong khu vực",
      "Đường Lê Lợi quận một",
      "Bún chả Hà Nội nổi tiếng",
      "Vịnh Hạ Long tuyệt đẹp lắm"
    ],
    fonts: ["Be Vietnam Pro", "Lora", "Roboto Slab", "Playfair Display"],
    tips: [
      "Latin alphabet + heavy diacritics: stacked accent marks (ồ, ắ, ễ, ự).",
      "If you see Latin text with multiple accents on the same vowel, it's Vietnamese.",
      "Six tones plus distinctive vowels (ư, ơ, đ) — no other Latin-script Asian language uses these.",
      "Real-world: tons of motorbikes, red/yellow flag everywhere."
    ],
    history: "The current Latin-based alphabet (Quốc Ngữ, 'national language') was developed by 17th-century Portuguese and French Jesuit missionaries — most notably Alexandre de Rhodes — to romanise Vietnamese. It replaced Chữ Nôm (a Chinese-character-based system) in official use after French colonisation in the 19th century. The diacritics encode Vietnamese's six tones plus distinctive vowels (ư, ơ, đ).",
    countries: [{ flag: "🇻🇳", name: "Vietnam" }],
    mapBbox: "102.0,8.0,110.0,24.0"
  },
  {
    id: "bengali",
    name: "Bengali",
    region: "Bangladesh / West Bengal",
    family: "brahmic-north",
    samples: [
      "নমস্কার, আপনি কেমন আছেন?",
      "ঢাকা শহর বাংলাদেশের রাজধানী",
      "ধন্যবাদ আপনার সাহায্যের জন্য",
      "আমি বাংলায় কথা বলি",
      "চট্টগ্রাম বাংলাদেশের বন্দর শহর",
      "এখানে প্রবেশ নিষেধ",
      "কলকাতা পশ্চিমবঙ্গের রাজধানী"
    ],
    fonts: ["Noto Sans Bengali", "Noto Serif Bengali", "Hind Siliguri", "Galada"],
    tips: [
      "Headstroke like Devanagari, BUT with curvier, flame-shaped letterforms.",
      "Triangular wedges and hooks hang below the baseline — distinctive.",
      "vs Devanagari: Devanagari is blocky and upright; Bengali is curvier and wedgier.",
      "vs Gujarati: Gujarati has no headstroke; Bengali has one.",
      "Used in Bangladesh and West Bengal — Bangladesh is the GeoGuessr Street View country."
    ],
    history: "Descends from the Eastern Nagari branch of Brahmic, sharing common ancestry with Devanagari but diverging visually around the 11th century. The flame-shaped curves and triangular hooks below the line are what distinguish it from Devanagari's blocky uprights. Bengali is the seventh most-spoken language in the world by native speakers.",
    countries: [
      { flag: "🇧🇩", name: "Bangladesh" },
      { flag: "🇮🇳", name: "West Bengal (India)" }
    ],
    mapBbox: "85.0,20.0,93.0,27.0"
  },
  {
    id: "sinhala",
    name: "Sinhala",
    region: "Sri Lanka",
    family: "brahmic-south",
    samples: [
      "ආයුබෝවන්, ඔබට කොහොමද?",
      "ශ්‍රී ලංකාව සුන්දර රටක්",
      "කොළඹ ශ්‍රී ලංකාවේ අගනුවර",
      "ස්තූතියි ඔබගේ උදව්වට",
      "මහනුවර ලස්සන නගරයක්",
      "මෙතැනින් ඇතුල් වන්න",
      "කරුණාකර ඉදිරියට යන්න"
    ],
    fonts: ["Noto Sans Sinhala", "Noto Serif Sinhala"],
    tips: [
      "Loops, loops, loops — even more than Lao or Burmese. Many letters are double-looped.",
      "If it looks like Lao but somehow even rounder and more cursive, it's Sinhala.",
      "vs Tamil: Tamil is angular; Sinhala is all loops. Both appear in Sri Lanka — north uses Tamil, south uses Sinhala.",
      "vs Telugu: both rounded, but Sinhala lacks the top check-mark and uses more curls.",
      "Sri Lanka also has Tamil signage in the north — both can appear on the same sign."
    ],
    history: "Among the oldest scripts in South Asia — descended from Brahmi (~3rd century BC) via the southern Brahmic branch. Its highly rounded forms come from the same palm-leaf tradition as Burmese and Telugu: curves don't split the leaf when inscribed with a stylus. Sri Lanka's Buddhist monastic tradition preserved the script through centuries of copying religious texts.",
    countries: [{ flag: "🇱🇰", name: "Sri Lanka" }],
    mapBbox: "79.0,5.5,82.0,10.0"
  },
  {
    id: "hebrew",
    name: "Hebrew",
    region: "Israel",
    family: "semitic",
    samples: [
      "שלום, מה שלומך היום?",
      "תל אביב היא עיר יפה",
      "ירושלים בירת מדינת ישראל",
      "תודה רבה על העזרה",
      "חיפה עיר נמל יפה",
      "כניסה חופשית לכולם",
      "אסור לעשן בתוך הבניין",
      "בית קפה פתוח עכשיו"
    ],
    fonts: ["Noto Sans Hebrew", "Noto Serif Hebrew", "Frank Ruhl Libre", "Heebo"],
    tips: [
      "Square, blocky letters with strong horizontal tops — like little gates and hooks.",
      "Reads right-to-left. No ascenders or descenders — everything sits on one band.",
      "vs Arabic: Hebrew letters stand alone and are square; Arabic letters connect into flowing cursive.",
      "If you also see Arabic on the same sign, you're almost certainly in Israel."
    ],
    history: "One of the oldest continuously-used alphabets — descended from Phoenician via Aramaic. The square 'Aramaic' form became standard for Hebrew during the Babylonian exile (6th century BC) and is what's used today. Modern Israeli Hebrew uses the same script as the Hebrew Bible.",
    countries: [{ flag: "🇮🇱", name: "Israel" }],
    mapBbox: "33.5,29.0,36.5,33.5"
  },
  {
    id: "arabic",
    name: "Arabic",
    region: "UAE / Jordan / Egypt",
    family: "semitic",
    samples: [
      "مرحبا، كيف حالك اليوم؟",
      "السلام عليكم ورحمة الله",
      "دبي الإمارات العربية المتحدة",
      "شكرا جزيلا على مساعدتك",
      "أهلا وسهلا في بلدنا",
      "ممنوع التدخين في المبنى",
      "عمّان عاصمة المملكة الأردنية",
      "القاهرة مدينة الألف مئذنة"
    ],
    fonts: ["Noto Sans Arabic", "Noto Serif Arabic", "Cairo", "Tajawal", "Amiri"],
    tips: [
      "Flowing connected cursive, reads right-to-left — letters merge into each other.",
      "Lots of dots above and below the baseline — that's how letters are distinguished.",
      "vs Hebrew: Hebrew letters stand alone and are blocky; Arabic letters connect and curve.",
      "GeoGuessr Street View: UAE, Jordan, Egypt, Lebanon, Israel (alongside Hebrew). Note: Turkey uses Latin, not Arabic."
    ],
    history: "Developed from Nabataean Aramaic in the 4th–5th century AD. Spread rapidly with the rise of Islam from the 7th century onward. The cursive connected style is itself a major Islamic art form — Arabic calligraphy carries religious significance, which is why even modern signage retains the flowing aesthetic rather than adopting blockier forms.",
    countries: [
      { flag: "🇪🇬", name: "Egypt" },
      { flag: "🇯🇴", name: "Jordan" },
      { flag: "🇦🇪", name: "UAE" },
      { flag: "🇱🇧", name: "Lebanon" }
    ],
    mapBbox: "25.0,12.0,57.0,38.0"
  }
];

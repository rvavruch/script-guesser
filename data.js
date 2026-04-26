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
// Sample texts target ≥3 words (or equivalent length for non-spaced scripts).
// The first sample for the original 12 entries is the xlsx-verified text.

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
      "The \"Circle\" Test: look for circles (ㅇ) and squares. Very geometric and modular blocks.",
      "Each syllable is a roughly square block of 2–4 jamo (letter parts).",
      "No top \"clothesline\" bar (that's Devanagari) and no curls/loops (that's Thai/Lao)."
    ]
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
      "The \"Mix\": look for the swirly の (Hiragana) mixed with complex Han characters.",
      "Three scripts at once — Hiragana (curly), Katakana (angular), Kanji (complex). If you see all three, it's Japan.",
      "Real-world tell: white license plates with green/black text."
    ]
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
      "Uniform dense blocks: no circles like Korean, no swirls like Japanese の.",
      "Mainland China is NOT on Street View — Han characters you see in GeoGuessr are almost always Traditional (Taiwan, HK, Macau).",
      "Traditional characters have many strokes packed in (e.g. 灣, 龜, 體) compared to Simplified."
    ]
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
      "The \"Loops\": almost every letter has a tiny terminal loop (small circle).",
      "Tone marks and vowel marks stack above/below the consonant line — busy vertically.",
      "Real-world tell: blue/white street signs, left-hand drive."
    ]
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
      "Bubbly/rounded — looks like \"soft Thai\" with simpler, rounder letterforms.",
      "Fewer letters than Thai (Lao dropped many redundant consonants), so the alphabet looks less varied.",
      "Real-world tell: yellow license plates on private cars, right-hand drive."
    ]
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
      "\"Wavy Hats\": very ornate, with wavy horizontal caps on letters like ស.",
      "Looks \"busy\" — many subscript consonants hang below the baseline.",
      "If text looks like Thai but with more decorative flourishes and dangling bits, it's Khmer."
    ]
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
      "The \"Bubbles\": almost entirely interlocking circles and C-shapes. Very few straight lines.",
      "If a script looks like a row of soap bubbles or Cheerios, it's Burmese.",
      "Big C that looks like it is surrounding another letter.",
      "Real-world tell: rare in GeoGuessr (limited Street View coverage of Myanmar)."
    ]
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
      "The \"Clothesline\": a continuous horizontal bar runs along the top of words (e.g. नमस्ते).",
      "Used for Hindi, Marathi, Sanskrit, Nepali — so this is your North India + Nepal signal.",
      "Real-world tell: India = white/yellow license plates."
    ]
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
      "\"Broken Clothesline\": shapes look like Devanagari/Hindi, but the top horizontal bar is missing.",
      "If it feels like Hindi without the headstroke, you're in Gujarat.",
      "Curvier than Devanagari — letters round at the top instead of being capped flat."
    ]
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
      "The \"Check-mark\": very circular. Almost every character has a small \"v\" or tick on top.",
      "Very rounded overall — no straight tops like Devanagari, no missing-headstroke look like Gujarati.",
      "Used in the Telugu-speaking states (Andhra Pradesh, Telangana). If everything looks like little O's wearing tiny party hats, it's Telugu."
    ]
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
      "Boxy/angular: no top bar, very square-looking letterforms.",
      "Far fewer loops than Telugu or Kannada — feels mechanical and rectilinear.",
      "Used in Tamil Nadu, parts of Sri Lanka, and Singapore signage."
    ]
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
      "Real-world tell: tons of motorbikes, Vietnamese flag red/yellow everywhere."
    ]
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
      "Headstroke like Devanagari, BUT with more triangular wedges and hooks hanging below the line.",
      "Letters look more curved and \"flame-shaped\" than Devanagari's blocky uprights.",
      "Used in Bangladesh and West Bengal — Bangladesh is the GeoGuessr Street View country."
    ]
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
      "Sri Lanka also has Tamil signage in the north — both can appear on the same sign."
    ]
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
      "Square, blocky letters with a strong horizontal top — looks like little gates and hooks.",
      "Reads right-to-left. No ascenders or descenders (everything sits on one band).",
      "If you also see Arabic on the same sign, you're almost certainly in Israel."
    ]
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
      "Flowing connected cursive, reads right-to-left.",
      "Lots of dots above and below the baseline — that's how letters are distinguished.",
      "GeoGuessr countries with Arabic Street View: UAE, Jordan, Egypt, Lebanon, Israel (alongside Hebrew). Note: Turkey uses Latin script, not Arabic."
    ]
  }
];

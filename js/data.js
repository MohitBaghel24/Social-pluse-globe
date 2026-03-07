// ============================================================
//  Social Pulse Globe — Static Data Module
//  Source: DataReportal 2024, WorldPopulationReview, Statista
//  Values in MILLIONS of users; updated manually ~monthly
// ============================================================

const SOCIAL_DATA = {
  US: {
    name: "United States",
    totalUsers: 302,
    platforms: {
      YouTube: 238,
      Facebook: 179,
      Instagram: 143,
      TikTok: 113,
      WhatsApp: 79,
      Snapchat: 106,
      "X/Twitter": 95,
      LinkedIn: 87,
      Pinterest: 84,
    },
    trending: ["#SuperBowl2026", "AI Act", "TechLayoffs", "NASA Artemis", "ElectionPoll"],
  },
  IN: {
    name: "India",
    totalUsers: 900,
    platforms: {
      YouTube: 476,
      WhatsApp: 535,
      Facebook: 378,
      Instagram: 362,
      TikTok: 170,
      Snapchat: 144,
      "X/Twitter": 25,
      LinkedIn: 130,
    },
    trending: ["#IPL2026", "Budget2026", "AI Tools", "BharatBandh", "MoonMission"],
  },
  CN: {
    name: "China",
    totalUsers: 1050,
    platforms: {
      WeChat: 1327,
      Douyin: 755,
      Weibo: 588,
      QQ: 554,
      Bilibili: 336,
      Kuaishou: 692,
    },
    trending: ["春节2026", "AI芯片", "月球计划", "经济复苏", "科技创新"],
  },
  BR: {
    name: "Brazil",
    totalUsers: 144,
    platforms: {
      YouTube: 144,
      WhatsApp: 139,
      Instagram: 113,
      Facebook: 109,
      TikTok: 82,
      "X/Twitter": 24,
      Snapchat: 10,
    },
    trending: ["#Carnaval2026", "Lula", "FIFA2026", "Amazonia", "CriptoReal"],
  },
  ID: {
    name: "Indonesia",
    totalUsers: 167,
    platforms: {
      YouTube: 139,
      WhatsApp: 112,
      Instagram: 89,
      Facebook: 70,
      TikTok: 157,
      "X/Twitter": 20,
      Telegram: 89,
    },
    trending: ["#Indonesia2026", "Jokowi", "Mudik", "Rupiah", "IKN"],
  },
  PH: {
    name: "Philippines",
    totalUsers: 73,
    platforms: {
      Facebook: 95,
      YouTube: 72,
      TikTok: 43,
      Instagram: 19,
      WhatsApp: 10,
    },
    trending: ["#Piso", "Typhoon", "OFW", "BBM", "MigrantWorkers"],
  },
  VN: {
    name: "Vietnam",
    totalUsers: 72,
    platforms: {
      YouTube: 63,
      Facebook: 73,
      TikTok: 50,
      Instagram: 12,
      Zalo: 74,
    },
    trending: ["TetHoliday", "TCB", "VinFast", "DiDong", "CongNghe"],
  },
  MX: {
    name: "Mexico",
    totalUsers: 83,
    platforms: {
      YouTube: 83,
      Facebook: 93,
      Instagram: 35,
      TikTok: 57,
      WhatsApp: 87,
      "X/Twitter": 14,
    },
    trending: ["#Mexico2026", "AMLO", "FIFA", "Peso", "Narcos"],
  },
  BD: {
    name: "Bangladesh",
    totalUsers: 51,
    platforms: {
      Facebook: 56,
      YouTube: 37,
      TikTok: 21,
      Instagram: 8,
      WhatsApp: 42,
    },
    trending: ["Eid2026", "Dhaka", "Garment", "Cricket", "Flood"],
  },
  PK: {
    name: "Pakistan",
    totalUsers: 71,
    platforms: {
      YouTube: 56,
      Facebook: 49,
      WhatsApp: 58,
      TikTok: 34,
      Instagram: 17,
      "X/Twitter": 9,
    },
    trending: ["#CPEC", "Imran", "PSL2026", "PTI", "Rupee"],
  },
  NG: {
    name: "Nigeria",
    totalUsers: 43,
    platforms: {
      WhatsApp: 51,
      YouTube: 28,
      Facebook: 28,
      TikTok: 14,
      Instagram: 20,
      "X/Twitter": 12,
    },
    trending: ["#Naira", "Tinubu", "NNPC", "Jollof", "AfconFinal"],
  },
  TH: {
    name: "Thailand",
    totalUsers: 60,
    platforms: {
      YouTube: 55,
      Facebook: 55,
      TikTok: 40,
      Instagram: 16,
      LINE: 52,
      "X/Twitter": 9,
    },
    trending: ["SongkranFestival", "Baht", "Tourism", "Muay Thai", "ElephantDay"],
  },
  RU: {
    name: "Russia",
    totalUsers: 106,
    platforms: {
      YouTube: 90,
      VKontakte: 73,
      Telegram: 80,
      TikTok: 45,
      Instagram: 37,
      "X/Twitter": 14,
    },
    trending: ["Россия2026", "Telegram", "Рубль", "СВО", "Луна25"],
  },
  TR: {
    name: "Turkey",
    totalUsers: 60,
    platforms: {
      YouTube: 57,
      Instagram: 51,
      WhatsApp: 46,
      Facebook: 37,
      TikTok: 30,
      "X/Twitter": 21,
    },
    trending: ["#Deprem", "Erdogan", "Lira", "Galatasaray", "TRT"],
  },
  JP: {
    name: "Japan",
    totalUsers: 100,
    platforms: {
      YouTube: 75,
      LINE: 95,
      "X/Twitter": 73,
      Instagram: 53,
      TikTok: 26,
      Facebook: 27,
    },
    trending: ["桜2026", "AI技術", "日銀", "五輪", "アニメ"],
  },
  DE: {
    name: "Germany",
    totalUsers: 72,
    platforms: {
      YouTube: 60,
      Instagram: 29,
      Facebook: 35,
      WhatsApp: 61,
      TikTok: 20,
      "X/Twitter": 12,
      LinkedIn: 20,
    },
    trending: ["Bundesliga", "Ampel", "Ukraine", "Tesla", "Oktoberfest"],
  },
  GB: {
    name: "United Kingdom",
    totalUsers: 57,
    platforms: {
      YouTube: 49,
      Instagram: 32,
      Facebook: 40,
      WhatsApp: 43,
      TikTok: 24,
      Snapchat: 22,
      "X/Twitter": 24,
    },
    trending: ["RoyalFamily", "LabourParty", "BrexitDeal", "PL2026", "NHS"],
  },
  FR: {
    name: "France",
    totalUsers: 52,
    platforms: {
      YouTube: 49,
      Instagram: 26,
      Facebook: 37,
      WhatsApp: 35,
      TikTok: 23,
      Snapchat: 27,
      "X/Twitter": 11,
    },
    trending: ["Macron", "Greve", "TourDeFrance", "Ligue1", "IA"],
  },
  IT: {
    name: "Italy",
    totalUsers: 44,
    platforms: {
      YouTube: 39,
      Instagram: 26,
      Facebook: 34,
      WhatsApp: 36,
      TikTok: 16,
      "X/Twitter": 8,
    },
    trending: ["Meloni", "Serie A", "Juventus", "PizzaDay", "Mafia"],
  },
  AR: {
    name: "Argentina",
    totalUsers: 37,
    platforms: {
      YouTube: 35,
      Instagram: 28,
      Facebook: 30,
      WhatsApp: 37,
      TikTok: 16,
      "X/Twitter": 11,
    },
    trending: ["Messi", "Milei", "Peso", "Mate", "Tango"],
  },
  KR: {
    name: "South Korea",
    totalUsers: 49,
    platforms: {
      YouTube: 46,
      KakaoTalk: 47,
      Instagram: 22,
      "X/Twitter": 11,
      TikTok: 10,
      NaverBlog: 25,
    },
    trending: ["K-Drama", "BLACKPINK", "Samsung", "KBO", "BTS"],
  },
  SA: {
    name: "Saudi Arabia",
    totalUsers: 32,
    platforms: {
      YouTube: 32,
      Snapchat: 21,
      Instagram: 21,
      "X/Twitter": 23,
      WhatsApp: 30,
      TikTok: 17,
    },
    trending: ["NEOM", "Vision2030", "Aramco", "Hajj2026", "Saudi League"],
  },
  EG: {
    name: "Egypt",
    totalUsers: 40,
    platforms: {
      Facebook: 41,
      YouTube: 38,
      WhatsApp: 33,
      Instagram: 23,
      TikTok: 14,
      "X/Twitter": 7,
    },
    trending: ["Sisi", "Pound", "Ramadan", "Suez", "ElAhly"],
  },
  CO: {
    name: "Colombia",
    totalUsers: 37,
    platforms: {
      YouTube: 36,
      Instagram: 26,
      Facebook: 34,
      WhatsApp: 38,
      TikTok: 22,
    },
    trending: ["Petro", "Shakira", "COP30", "Cartagena", "Narcos"],
  },
  UA: {
    name: "Ukraine",
    totalUsers: 28,
    platforms: {
      YouTube: 24,
      Instagram: 12,
      Facebook: 14,
      TikTok: 9,
      Telegram: 20,
      "X/Twitter": 5,
    },
    trending: ["Zelensky", "Reconstruction", "NATO", "Hryvnia", "ArmyDrones"],
  },
  MY: {
    name: "Malaysia",
    totalUsers: 29,
    platforms: {
      YouTube: 26,
      Facebook: 22,
      Instagram: 14,
      WhatsApp: 25,
      TikTok: 17,
      "X/Twitter": 7,
    },
    trending: ["Anwar", "Ringgit", "Badminton", "Petronas", "CNY2026"],
  },
  PE: {
    name: "Peru",
    totalUsers: 19,
    platforms: {
      YouTube: 18,
      Facebook: 20,
      Instagram: 14,
      WhatsApp: 20,
      TikTok: 9,
    },
    trending: ["Boluarte", "LimaCentenario", "Machu Picchu", "Sol", "Mining"],
  },
  AU: {
    name: "Australia",
    totalUsers: 21,
    platforms: {
      YouTube: 19,
      Instagram: 11,
      Facebook: 16,
      WhatsApp: 10,
      TikTok: 9,
      Snapchat: 7,
      LinkedIn: 8,
    },
    trending: ["AussieDay", "NRL2026", "Cricket", "BushFire", "AI Policy"],
  },
  CA: {
    name: "Canada",
    totalUsers: 31,
    platforms: {
      YouTube: 29,
      Instagram: 17,
      Facebook: 24,
      WhatsApp: 17,
      TikTok: 16,
      Snapchat: 14,
      LinkedIn: 17,
    },
    trending: ["Trudeau", "NHLPlayoffs", "Housing", "CAD", "TechBoom"],
  },
  NL: {
    name: "Netherlands",
    totalUsers: 14,
    platforms: {
      YouTube: 13,
      Instagram: 8,
      Facebook: 9,
      WhatsApp: 13,
      TikTok: 6,
      LinkedIn: 6,
    },
    trending: ["Koningsdag", "Ajax", "Tulip", "EuroVision", "ASML"],
  },
  ES: {
    name: "Spain",
    totalUsers: 42,
    platforms: {
      YouTube: 38,
      Instagram: 22,
      Facebook: 27,
      WhatsApp: 37,
      TikTok: 18,
      "X/Twitter": 9,
    },
    trending: ["LaLiga", "Sanchez", "Ibiza", "Corrida", "Renfe"],
  },
  ZA: {
    name: "South Africa",
    totalUsers: 26,
    platforms: {
      YouTube: 23,
      Facebook: 18,
      WhatsApp: 24,
      Instagram: 11,
      TikTok: 9,
      "X/Twitter": 7,
    },
    trending: ["Ramaphosa", "Rand", "Rugby", "Loadshedding", "ANC"],
  },
  PL: {
    name: "Poland",
    totalUsers: 27,
    platforms: {
      YouTube: 25,
      Instagram: 12,
      Facebook: 19,
      WhatsApp: 14,
      TikTok: 12,
      "X/Twitter": 4,
    },
    trending: ["Tusk", "PLN", "EU Elections", "Lewandowski", "NATO"],
  },
  IQ: {
    name: "Iraq",
    totalUsers: 18,
    platforms: {
      Facebook: 22,
      YouTube: 17,
      TikTok: 11,
      WhatsApp: 19,
      Instagram: 10,
    },
    trending: ["Baghdad", "Dinar", "Kurdistan", "OilExport", "Ramadan"],
  },
  DZ: {
    name: "Algeria",
    totalUsers: 22,
    platforms: {
      Facebook: 24,
      YouTube: 20,
      WhatsApp: 21,
      Instagram: 12,
      TikTok: 10,
    },
    trending: ["Tebboune", "Sahara", "Gas", "Algeria2025", "Football"],
  },
  MA: {
    name: "Morocco",
    totalUsers: 18,
    platforms: {
      Facebook: 18,
      YouTube: 17,
      WhatsApp: 17,
      Instagram: 10,
      TikTok: 8,
      Snapchat: 5,
    },
    trending: ["AtlasLions", "FIFA2026", "Ramadan", "Dirham", "Marrakech"],
  },
  UZ: {
    name: "Uzbekistan",
    totalUsers: 14,
    platforms: {
      YouTube: 13,
      Telegram: 13,
      Instagram: 9,
      TikTok: 8,
      Facebook: 4,
    },
    trending: ["Tashkent", "Som", "Silk Road", "Uzbek Arts", "Energy"],
  },
  GH: {
    name: "Ghana",
    totalUsers: 10,
    platforms: {
      Facebook: 9,
      YouTube: 7,
      WhatsApp: 10,
      TikTok: 4,
      Instagram: 4,
    },
    trending: ["Akufo-Addo", "Cedi", "Afrobeats", "Ghana vs Nigeria", "Cocoa"],
  },
  KE: {
    name: "Kenya",
    totalUsers: 11,
    platforms: {
      YouTube: 9,
      Facebook: 8,
      WhatsApp: 11,
      TikTok: 5,
      Instagram: 5,
      "X/Twitter": 4,
    },
    trending: ["Ruto", "Shilling", "Nairobi", "Safari", "Gen Z Revolution"],
  },
  MM: {
    name: "Myanmar",
    totalUsers: 19,
    platforms: {
      Facebook: 24,
      YouTube: 14,
      TikTok: 9,
      Viber: 18,
      Instagram: 4,
    },
    trending: ["MilitaryCoup", "Kyat", "Yangon", "Buddhism", "Refugees"],
  },
  NP: {
    name: "Nepal",
    totalUsers: 10,
    platforms: {
      Facebook: 12,
      YouTube: 9,
      TikTok: 7,
      Instagram: 4,
      WhatsApp: 10,
    },
    trending: ["Everest2026", "Kathmandu", "Rupee", "Earthquake", "Sherpa"],
  },
  CM: {
    name: "Cameroon",
    totalUsers: 5,
    platforms: {
      Facebook: 5,
      YouTube: 4,
      WhatsApp: 5,
      TikTok: 2,
      Instagram: 1,
    },
    trending: ["Biya", "CFA", "LionsIndomptables", "Cacao", "Yaoundé"],
  },
  CI: {
    name: "Côte d'Ivoire",
    totalUsers: 7,
    platforms: {
      Facebook: 7,
      YouTube: 6,
      WhatsApp: 7,
      TikTok: 3,
      Instagram: 2,
    },
    trending: ["AFCON", "Cacao", "Abidjan", "Ouattara", "CFA"],
  },
  UG: {
    name: "Uganda",
    totalUsers: 4,
    platforms: {
      Facebook: 4,
      YouTube: 3,
      WhatsApp: 4,
      TikTok: 2,
      Instagram: 1,
    },
    trending: ["Museveni", "Kampala", "Shilling", "Gorillas", "Nilefest"],
  },
  TZ: {
    name: "Tanzania",
    totalUsers: 6,
    platforms: {
      Facebook: 6,
      YouTube: 5,
      WhatsApp: 6,
      TikTok: 2,
      Instagram: 1,
    },
    trending: ["HassanPresidency", "Shilling", "Kilimanjaro", "Safari", "Dar"],
  },
  SN: {
    name: "Senegal",
    totalUsers: 4,
    platforms: {
      Facebook: 4,
      YouTube: 3,
      WhatsApp: 4,
      TikTok: 2,
      Instagram: 1,
    },
    trending: ["Faye", "CFA", "Dakar", "Teranga Lions", "Wrestling"],
  },
  ET: {
    name: "Ethiopia",
    totalUsers: 7,
    platforms: {
      Facebook: 6,
      YouTube: 5,
      TikTok: 3,
      WhatsApp: 7,
      Telegram: 5,
    },
    trending: ["Abiy", "Birr", "Addis", "Tigray", "Nile Dam"],
  },
  ID2: {
    name: "Iran",
    totalUsers: 47,
    platforms: {
      Instagram: 27,
      YouTube: 33,
      Telegram: 42,
      "X/Twitter": 7,
      WhatsApp: 15,
    },
    trending: ["Pezeshkian", "Rial", "Tehran", "Nowruz2026", "Nuclear"],
  },
  IR: {
    name: "Iran",
    totalUsers: 47,
    platforms: {
      Instagram: 27,
      YouTube: 33,
      Telegram: 42,
      "X/Twitter": 7,
      WhatsApp: 15,
    },
    trending: ["Pezeshkian", "Rial", "Tehran", "Nowruz2026", "Nuclear"],
  },
  PL2: {
    name: "Poland",
    totalUsers: 27,
    platforms: {
      YouTube: 25,
      Instagram: 12,
      Facebook: 19,
      WhatsApp: 14,
      TikTok: 12,
    },
    trending: ["Warsaw", "Poland2026", "UEFA", "Economy", "NATO"],
  },
  TW: {
    name: "Taiwan",
    totalUsers: 22,
    platforms: {
      YouTube: 20,
      LINE: 21,
      Instagram: 13,
      Facebook: 17,
      TikTok: 5,
    },
    trending: ["Taiwan2026", "TSMC", "Lai", "Strait", "Semiconductor"],
  },
  SE: {
    name: "Sweden",
    totalUsers: 9,
    platforms: {
      YouTube: 8,
      Instagram: 5,
      Facebook: 6,
      Snapchat: 4,
      LinkedIn: 4,
      TikTok: 4,
    },
    trending: ["Krona", "IKEA", "AbbaRevival", "NATOSweden", "ClimateAct"],
  },
  CH: {
    name: "Switzerland",
    totalUsers: 8,
    platforms: {
      YouTube: 7,
      Instagram: 5,
      Facebook: 5,
      LinkedIn: 4,
      WhatsApp: 7,
    },
    trending: ["WEF2026", "Franc", "FIFA HQ", "Federer", "Davos"],
  },
  SG: {
    name: "Singapore",
    totalUsers: 5,
    platforms: {
      YouTube: 5,
      Instagram: 3,
      Facebook: 4,
      LinkedIn: 3,
      TikTok: 2,
    },
    trending: ["SGD", "LKY", "GrandPrix", "FinTech", "ASEAN"],
  },
  NZ: {
    name: "New Zealand",
    totalUsers: 4,
    platforms: {
      YouTube: 4,
      Facebook: 3,
      Instagram: 2,
      TikTok: 2,
      LinkedIn: 2,
    },
    trending: ["AllBlacks", "Luxon", "kiwi", "Climate", "Hobbit"],
  },
};

// Remove duplicate keys (ID2, PL2)
delete SOCIAL_DATA["ID2"];
delete SOCIAL_DATA["PL2"];

// Compute colour scale (log10 of totalUsers → 0–1)
function getCountryColor(totalUsers) {
  if (!totalUsers) return "rgba(15, 15, 40, 0.6)";
  const min = Math.log10(4);   // ~4M (min in dataset)
  const max = Math.log10(1200); // ~1.2B (China)
  const t = Math.max(0, Math.min(1, (Math.log10(totalUsers) - min) / (max - min)));

  // Palette: pale yellow → teal → dark navy  (like worldpopulationreview)
  if (t < 0.5) {
    // pale yellow (#fffacd) → teal (#00c8b4)
    const s = t / 0.5;
    const r = Math.round(255 + (0 - 255) * s);
    const g = Math.round(250 + (200 - 250) * s);
    const b = Math.round(205 + (180 - 205) * s);
    return `rgba(${r},${g},${b},0.85)`;
  } else {
    // teal (#00c8b4) → dark navy (#0a1a5e)
    const s = (t - 0.5) / 0.5;
    const r = Math.round(0 + (10 - 0) * s);
    const g = Math.round(200 + (26 - 200) * s);
    const b = Math.round(180 + (94 - 180) * s);
    return `rgba(${r},${g},${b},0.85)`;
  }
}

// Platform brand colours for charts
const PLATFORM_COLORS = {
  Facebook:   "#1877F2",
  Instagram:  "#E4405F",
  YouTube:    "#FF0000",
  TikTok:     "#69C9D0",
  WhatsApp:   "#25D366",
  Snapchat:   "#FFFC00",
  "X/Twitter":"#1DA1F2",
  LinkedIn:   "#0A66C2",
  WeChat:     "#07C160",
  Telegram:   "#26A5E4",
  Pinterest:  "#E60023",
  Weibo:      "#E6162D",
  Douyin:     "#010101",
  VKontakte:  "#4C75A3",
  LINE:       "#00B900",
  KakaoTalk:  "#FEE500",
  Viber:      "#7360F2",
  NaverBlog:  "#03C75A",
  Bilibili:   "#00A1D6",
  QQ:         "#12B7F5",
  Kuaishou:   "#FF4906",
  Zalo:       "#0068FF",
  Default:    "#00f5ff",
};

window.SocialData = { SOCIAL_DATA, getCountryColor, PLATFORM_COLORS };



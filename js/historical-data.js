// ============================================================
//  Social Pulse Globe — Historical Platform Dominance Data
//  2018–2026 · Per country · Dominant platform per year
//  Based on publicly reported platform active-user data
// ============================================================

(function () {

  // ── Key timeline events with markers ───────────────────────────────
  const TIMELINE_EVENTS = [
    {
      year: 2020,
      label: "TikTok ban attempts",
      detail: "The Trump administration issued executive orders attempting to ban TikTok in the USA, citing national security. The bans were blocked by courts, but TikTok's US future became politically fraught — and rival platforms rushed to launch short-form features (YouTube Shorts, Instagram Reels).",
      icon: "🚫",
      impact: "Accelerated YouTube Shorts & Instagram Reels adoption across 30+ markets.",
    },
    {
      year: 2021,
      label: "Instagram Reels launched globally",
      detail: "Instagram rolled out Reels to 50+ countries in 2021, directly imitating TikTok's feed. Meta reported Reels as the fastest-growing content format. In markets like Brazil, India, Indonesia, and Southern Europe, Instagram overtook Facebook as the most-used Meta platform.",
      icon: "🎬",
      impact: "Instagram gained ~200M new monthly active users in 2021, primarily in 18–34 demographic.",
    },
    {
      year: 2022,
      label: "Twitter → X rebrand begins",
      detail: "Elon Musk acquired Twitter in October 2022 for $44 billion and immediately began mass layoffs (~75% staff), reversed bans on controversial accounts, and signalled a platform-wide rebrand to 'X'. Advertiser exodus drove a ~50% revenue drop. Large-scale user exodus began.",
      icon: "✕",
      impact: "Twitter/X lost estimated 30M+ active monthly users by end of 2022. Mastodon gained 2.5M+ signups in a single week.",
    },
    {
      year: 2023,
      label: "Threads launched by Meta",
      detail: "Meta launched Threads on July 5 2023 as a direct Twitter/X competitor, reaching 100M signups in 5 days — the fastest app launch in history. Integration with Instagram drove rapid adoption, though daily active usage settled at ~10% of signups within 60 days.",
      icon: "🧵",
      impact: "Threads absorbed significant Twitter refugee traffic. X/Twitter territory contracted further in Europe, LatAm, and Australia.",
    },
    {
      year: 2024,
      label: "TikTok ban in USA",
      detail: "US Congress passed the Protecting Americans from Foreign Adversary Controlled Applications Act (April 2024), giving ByteDance 270 days to divest TikTok or face a ban. The Supreme Court upheld the law in January 2025. TikTok went dark for ~14 hours on Jan 19 before a temporary reprieve. YouTube Shorts and Instagram Reels absorbed the majority of displaced users.",
      icon: "⚖",
      impact: "US TikTok MAUs dropped ~40% in H1 2025. YouTube Shorts surpassed 100B daily views globally.",
    },
  ];

  // ── Historical dominant platform per country per year ───────────────
  // Format: YEAR → ISO2 → platform key (must match PLATFORM_COLORS)
  // Countries not listed in a year fall back to nearest previous year,
  // then ultimately to current SOCIAL_DATA.

  const HISTORICAL_DOMINANT = {
    2018: {
      US:"Facebook", IN:"Facebook", CN:"WeChat", BR:"Facebook", RU:"Facebook",
      JP:"X/Twitter", DE:"Facebook", GB:"Facebook", FR:"Facebook", AU:"Facebook",
      CA:"Facebook", MX:"Facebook", KR:"Facebook", ID:"Facebook", NG:"Facebook",
      EG:"Facebook", ZA:"Facebook", AR:"Facebook", PH:"Facebook", VN:"Facebook",
      TH:"Facebook", TR:"Facebook", PL:"Facebook", ES:"Facebook", IT:"Facebook",
      NL:"Facebook", SE:"Facebook", UA:"Facebook", PK:"Facebook", BD:"Facebook",
      MY:"WhatsApp", SG:"Facebook", SA:"YouTube",  IR:"Instagram", TW:"Facebook",
      CO:"Facebook", PE:"Facebook", NZ:"Facebook",
    },
    2019: {
      US:"Facebook", IN:"WhatsApp", CN:"WeChat", BR:"WhatsApp", RU:"Facebook",
      JP:"X/Twitter", DE:"Facebook", GB:"Facebook", FR:"Facebook", AU:"Facebook",
      CA:"Facebook", MX:"Facebook", KR:"Instagram", ID:"WhatsApp", NG:"Facebook",
      EG:"Facebook", ZA:"Facebook", AR:"Facebook", PH:"Facebook", VN:"Facebook",
      TH:"Facebook", TR:"Facebook", PL:"Facebook", ES:"WhatsApp", IT:"Instagram",
      NL:"Facebook", SE:"Facebook", UA:"Facebook", PK:"Facebook", BD:"Facebook",
      MY:"WhatsApp", SG:"Facebook", SA:"YouTube",  IR:"Instagram", TW:"YouTube",
      CO:"Facebook", PE:"Facebook", NZ:"Facebook",
    },
    2020: {
      US:"Facebook", IN:"YouTube",   CN:"WeChat",   BR:"WhatsApp", RU:"Facebook",
      JP:"YouTube",  DE:"Facebook",  GB:"Facebook",  FR:"Facebook",  AU:"Facebook",
      CA:"Facebook", MX:"Facebook",  KR:"Instagram", ID:"YouTube",  NG:"YouTube",
      EG:"Facebook", ZA:"Facebook",  AR:"Facebook",  PH:"Facebook",  VN:"Facebook",
      TH:"TikTok",   TR:"YouTube",   PL:"Facebook",  ES:"WhatsApp",  IT:"Instagram",
      NL:"YouTube",  SE:"YouTube",   UA:"Facebook",  PK:"YouTube",   BD:"Facebook",
      MY:"WhatsApp", SG:"YouTube",   SA:"YouTube",   IR:"Instagram", TW:"YouTube",
      CO:"Facebook", PE:"Facebook",  NZ:"Facebook",
    },
    2021: {
      US:"YouTube",  IN:"YouTube",   CN:"WeChat",   BR:"Instagram", RU:"YouTube",
      JP:"YouTube",  DE:"Instagram", GB:"Instagram", FR:"Instagram", AU:"Instagram",
      CA:"YouTube",  MX:"TikTok",   KR:"Instagram", ID:"YouTube",  NG:"YouTube",
      EG:"YouTube",  ZA:"Facebook",  AR:"Instagram", PH:"Facebook",  VN:"Facebook",
      TH:"TikTok",   TR:"YouTube",   PL:"Instagram", ES:"TikTok",   IT:"TikTok",
      NL:"Instagram",SE:"Instagram", UA:"Facebook",  PK:"YouTube",   BD:"Facebook",
      MY:"YouTube",  SG:"YouTube",   SA:"Snapchat",  IR:"Instagram", TW:"YouTube",
      CO:"Instagram",PE:"Instagram", NZ:"Instagram",
    },
    2022: {
      US:"YouTube",  IN:"YouTube",   CN:"WeChat",   BR:"Instagram", RU:"YouTube",
      JP:"X/Twitter",DE:"Instagram", GB:"TikTok",   FR:"TikTok",   AU:"TikTok",
      CA:"TikTok",   MX:"TikTok",   KR:"TikTok",   ID:"YouTube",  NG:"TikTok",
      EG:"YouTube",  ZA:"YouTube",  AR:"TikTok",   PH:"Facebook",  VN:"TikTok",
      TH:"TikTok",   TR:"Instagram", PL:"TikTok",   ES:"TikTok",   IT:"TikTok",
      NL:"TikTok",   SE:"TikTok",   UA:"YouTube",  PK:"YouTube",   BD:"YouTube",
      MY:"TikTok",   SG:"TikTok",   SA:"Snapchat",  IR:"Instagram", TW:"YouTube",
      CO:"TikTok",   PE:"TikTok",   NZ:"TikTok",
    },
    2023: {
      US:"TikTok",   IN:"YouTube",   CN:"WeChat",   BR:"TikTok",   RU:"YouTube",
      JP:"X/Twitter",DE:"Instagram", GB:"TikTok",   FR:"TikTok",   AU:"TikTok",
      CA:"TikTok",   MX:"TikTok",   KR:"TikTok",   ID:"YouTube",  NG:"TikTok",
      EG:"YouTube",  ZA:"TikTok",   AR:"TikTok",   PH:"Facebook",  VN:"TikTok",
      TH:"TikTok",   TR:"Instagram", PL:"TikTok",   ES:"Instagram", IT:"TikTok",
      NL:"Instagram",SE:"TikTok",   UA:"YouTube",  PK:"YouTube",   BD:"YouTube",
      MY:"TikTok",   SG:"TikTok",   SA:"Snapchat",  IR:"Instagram", TW:"YouTube",
      CO:"TikTok",   PE:"TikTok",   NZ:"TikTok",
    },
    2024: {
      US:"YouTube",  IN:"Instagram", CN:"WeChat",   BR:"TikTok",   RU:"YouTube",
      JP:"X/Twitter",DE:"Instagram", GB:"Instagram", FR:"Instagram", AU:"Instagram",
      CA:"YouTube",  MX:"TikTok",   KR:"Instagram", ID:"YouTube",  NG:"TikTok",
      EG:"YouTube",  ZA:"TikTok",   AR:"Instagram", PH:"Facebook",  VN:"TikTok",
      TH:"TikTok",   TR:"Instagram", PL:"Instagram", ES:"Instagram", IT:"Instagram",
      NL:"Instagram",SE:"Instagram", UA:"YouTube",  PK:"YouTube",   BD:"YouTube",
      MY:"Instagram",SG:"Instagram", SA:"Snapchat",  IR:"Instagram", TW:"YouTube",
      CO:"Instagram",PE:"Instagram", NZ:"Instagram",
    },
    2025: {
      US:"YouTube",  IN:"Instagram", CN:"WeChat",   BR:"Instagram", RU:"YouTube",
      JP:"X/Twitter",DE:"Instagram", GB:"Instagram", FR:"Instagram", AU:"Instagram",
      CA:"Instagram",MX:"TikTok",   KR:"Instagram", ID:"YouTube",  NG:"YouTube",
      EG:"YouTube",  ZA:"Instagram", AR:"Instagram", PH:"Facebook",  VN:"YouTube",
      TH:"TikTok",   TR:"Instagram", PL:"Instagram", ES:"Instagram", IT:"Instagram",
      NL:"Instagram",SE:"Instagram", UA:"Instagram", PK:"YouTube",   BD:"YouTube",
      MY:"Instagram",SG:"Instagram", SA:"Instagram",  IR:"Instagram", TW:"Instagram",
      CO:"Instagram",PE:"Instagram", NZ:"Instagram",
    },
    2026: {
      // Current year — mirrors live SOCIAL_DATA dominant
      US:"Instagram",IN:"Instagram", CN:"WeChat",   BR:"TikTok",   RU:"YouTube",
      JP:"X/Twitter",DE:"Instagram", GB:"Instagram", FR:"Instagram", AU:"Instagram",
      CA:"Instagram",MX:"TikTok",   KR:"Instagram", ID:"YouTube",  NG:"YouTube",
      EG:"Instagram",ZA:"Instagram", AR:"Instagram", PH:"Facebook",  VN:"YouTube",
      TH:"TikTok",   TR:"Instagram", PL:"Instagram", ES:"Instagram", IT:"Instagram",
      NL:"Instagram",SE:"Instagram", UA:"Instagram", PK:"YouTube",   BD:"YouTube",
      MY:"Instagram",SG:"Instagram", SA:"Snapchat",  IR:"Instagram", TW:"YouTube",
      CO:"Instagram",PE:"Instagram", NZ:"Instagram",
    },
  };

  // ── Build synthetic platform object for a country+year ──────────────
  // Returns a fake `platforms` map with the dominant platform having
  // a high score and others having minimal scores (drives globe colors).
  function buildSyntheticPlatforms(iso2, year) {
    const { SOCIAL_DATA } = window.SocialData;
    const real = SOCIAL_DATA[iso2];
    const dominant = HISTORICAL_DOMINANT[year]?.[iso2];
    if (!dominant) return real?.platforms || {};

    // Base on real 2026 data, scaled so dominant always wins clearly
    const base = real?.platforms ? { ...real.platforms } : {};
    const platforms = {};

    const allKnown = ["Facebook","YouTube","WhatsApp","Instagram","TikTok","X/Twitter","WeChat","Snapchat"];
    allKnown.forEach(p => {
      if (p === dominant) {
        // dominant gets the highest real value OR a baseline
        platforms[p] = Math.max(base[dominant] || 0, 15);
      } else if (base[p]) {
        // Others get 40-70% of their real value
        platforms[p] = Math.round(base[p] * 0.45);
      }
    });

    // Make sure dominant clearly wins
    const others = Object.values(platforms).filter((_,i) => Object.keys(platforms)[i] !== dominant);
    const maxOther = Math.max(0, ...others);
    if (platforms[dominant] <= maxOther) {
      platforms[dominant] = maxOther + 8;
    }

    return platforms;
  }

  // ── Get resolved dominant for a country+year ────────────────────────
  // Falls back year by year until it finds data, then falls to 2026.
  function getDominantForYear(iso2, year) {
    for (let y = year; y >= 2018; y--) {
      if (HISTORICAL_DOMINANT[y]?.[iso2]) {
        return HISTORICAL_DOMINANT[y][iso2];
      }
    }
    return null;
  }

  // ── Build full historical data object for a given year ──────────────
  // Returns an override map: ISO2 → { platforms, name, totalUsers }
  function buildYearData(year) {
    const { SOCIAL_DATA } = window.SocialData;
    const result = {};
    Object.keys(SOCIAL_DATA).forEach(iso2 => {
      result[iso2] = {
        ...SOCIAL_DATA[iso2],
        platforms: buildSyntheticPlatforms(iso2, year),
        _historicalYear: year,
      };
    });
    return result;
  }

  // ── Public API ────────────────────────────────────────────────────────
  window.HistoricalData = {
    TIMELINE_EVENTS,
    HISTORICAL_DOMINANT,
    getDominantForYear,
    buildYearData,
    YEARS: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026],
  };

})();



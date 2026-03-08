<div align="center">

<img src="https://img.shields.io/badge/STATUS-LIVE-brightgreen?style=for-the-badge&labelColor=03050e&color=c9ff3b" />
<img src="https://img.shields.io/badge/MOBILE-RESPONSIVE-blue?style=for-the-badge&labelColor=03050e&color=3be8ff" />
<img src="https://img.shields.io/badge/GLOBE.GL-POWERED-orange?style=for-the-badge&labelColor=03050e&color=9f6fff" />

<br/><br/>

```
  ███████╗ ██████╗  ██████╗██╗ █████╗ ██╗      ██████╗ ██╗      ██████╗ ██████╗ ███████╗
  ██╔════╝██╔═══██╗██╔════╝██║██╔══██╗██║     ██╔════╝ ██║     ██╔═══██╗██╔══██╗██╔════╝
  ███████╗██║   ██║██║     ██║███████║██║     ██║  ███╗██║     ██║   ██║██████╔╝█████╗  
  ╚════██║██║   ██║██║     ██║██╔══██║██║     ██║   ██║██║     ██║   ██║██╔══██╗██╔══╝  
  ███████║╚██████╔╝╚██████╗██║██║  ██║███████╗╚██████╔╝███████╗╚██████╔╝██████╔╝███████╗
  ╚══════╝ ╚═════╝  ╚═════╝╚═╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚══════╝ ╚═════╝ ╚═════╝╚══════╝
```

### 🌍 Real-Time World Social Media Intelligence Dashboard

**An interactive 3D globe visualising social media dominance across 195 countries.**  
Track platform wars, trending topics, live stats, and viral content migration — all in one screen.

<br/>

[![Live Demo](https://img.shields.io/badge/🌐_LIVE_DEMO-mohitbaghel24.github.io-c9ff3b?style=for-the-badge&labelColor=03050e)](https://mohitbaghel24.github.io/Social-pluse-globe/)
[![GitHub](https://img.shields.io/badge/GitHub-mohitbaghel24-white?style=for-the-badge&logo=github&labelColor=03050e)](https://github.com/mohitbaghel24)

<br/>

> **Built by [Mohit Baghel](https://github.com/mohitbaghel24)** · Freelance Web Developer · Bhilai, India  
> `@mohitbaghel24` on GitHub

</div>

---

## ✦ What is Social Pulse Globe?

Social Pulse Globe is a **single-file, zero-dependency** intelligence dashboard that renders a 3D Earth and visualises which social media platform dominates each country — updated live. Click any country to explore platform breakdowns, trending topics, AI-generated insights, and regional buzz.

Think: *"What if every country's internet had a live heartbeat — and you could see it rotating in space."*

---

## ⚡ Features

### 🌐 Interactive 3D Globe
- Fully rotatable globe rendered with **Globe.gl + Three.js**
- Country heatmaps coloured by dominant social platform
- Click any country → instant stats panel with flag, platform breakdown, trends
- Auto-rotation when idle · Momentum-based drag controls
- Geolocation detection — highlights your country on load

### ☠ WAR ROOM — Platform Battle Mode
- Real-time territory dominance scoreboard
- Fighter HP bars for every platform (WhatsApp, Facebook, TikTok, YouTube, Instagram, WeChat, X)
- Live Territory Feed — shows which platform just "seized" which country
- AI-powered Next Battle Prediction with probability scores

### 📊 Country Intelligence Panel
- Platform usage breakdown bar chart per country
- Trending topics (localised per country)
- AI Insight card with regional social media analysis
- Platform Buzz tab with post activity data

### 📡 Live Ticker + Stats
- Bottom scrolling news ticker — 14 global social media headlines
- Live posts/sec counter (updates every 750ms)
- 195 countries tracked

### 🎯 Platform Switcher
- 9 platforms: All · Facebook · YouTube · WhatsApp · Instagram · TikTok · WeChat · X · Snapchat
- Globe recolours instantly on switch
- Kill Feed overlay (COD-style) — live platform dominance alerts

### ⬡ Viral Tracker
- Visual arc map of how viral content migrated between countries (2020–2026)

---

## 🗂 Country Coverage

| Region | Countries Tracked |
|---|---|
| 🌏 Asia | India, China, Japan, South Korea, Indonesia, Saudi Arabia |
| 🌍 Africa | Nigeria, South Africa, Egypt |
| 🌎 Americas | USA, Brazil |
| 🌐 Europe | Germany, United Kingdom |
| 🌊 Oceania | Australia |

*Globe.gl renders all 195 countries with polygon data — the above have full data panels.*

---

## 🛠 Tech Stack

```
Frontend      →  Vanilla HTML · CSS · JavaScript (no framework)
3D Globe      →  Globe.gl v2.27 · Three.js r128
Charts        →  Chart.js (bar charts inside country panel)
Fonts         →  Cabinet Grotesk · DM Mono (Google Fonts)
Hosting       →  GitHub Pages (static, zero backend)
Data          →  100% static JSON (no blocked API calls)
```

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| Background | `#03050e` | Deep space black |
| Primary | `#c9ff3b` | Acid yellow-green — active states |
| Secondary | `#3be8ff` | Ice cyan — data highlights |
| Danger | `#ff4f6d` | Rose red — war room / kills |
| Violet | `#9f6fff` | Ambient glow |
| Font Stack | Cabinet Grotesk + DM Mono | Headings + data |

- All panels: `backdrop-filter: blur(12px)` glass morphism
- Custom cursor: 6px gold dot + 28px ring with `mix-blend-mode: difference`
- Background: radial gradient + CSS grid + SVG noise + 3 animated blur blobs

---

## 🚀 Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/mohitbaghel24/Social-pluse-globe.git

# 2. Open in browser — no build step needed
cd Social-pluse-globe
open index.html

# Or serve with any static server
npx serve .
python -m http.server 8000
```

No npm install. No build. No backend. One file.

---

## 📁 Project Structure

```
Social-pluse-globe/
│
├── index.html          ← Entire app (HTML + CSS + JS in one file)
├── README.md           ← This file
└── assets/             ← (optional) images, icons
```

---

## 📱 Mobile Support

Fully responsive across iPhone, Android, and tablets:

- Globe fills screen with touch drag support
- Country panel opens as bottom sheet (not fullscreen modal)
- Platform dock collapses to single compact row
- Header minimises to logo + essential controls only
- Safe area support for iPhone notch / Dynamic Island / home bar

---

## 🔮 Roadmap

- [ ] **Social Media Twin Finder** — 5-question quiz that matches you to a country twin
- [ ] **Guess the Country Game** — globe-based geography game with intel briefing cards
- [ ] **Since-You-Opened Counter** — tracks posts/messages/accounts created while you browse
- [ ] **Historical Timeline Scrubber** — replay platform dominance from 2018 → 2026
- [ ] **Backend proxy** — enable live Reddit/Google Trends data

---

## 🙋 About the Developer

<div align="center">

**Mohit Baghel**  
Freelance Web Developer · Data Analyst · Video Editor  
📍 Bhilai, Chhattisgarh, India

[![GitHub](https://img.shields.io/badge/GitHub-@mohitbaghel24-black?style=flat-square&logo=github)](https://github.com/mohitbaghel24)

*Building cool stuff with HTML, CSS, JavaScript, Python, and FastAPI.*  
*Open to freelance projects — web development, data analytics, photo/video editing.*

</div>

---

## 📄 License

```
MIT License — free to use, modify, and distribute.
Built with ♥ by Mohit Baghel (@mohitbaghel24)
```

---

<div align="center">

**If this project impressed you, drop a ⭐ on the repo.**

[![Star on GitHub](https://img.shields.io/github/stars/mohitbaghel24/Social-pluse-globe?style=social)](https://github.com/mohitbaghel24/Social-pluse-globe)

*Made in Bhilai · Powered by caffeine and Globe.gl*

</div>

# 🏎️ F1 Chief Engineer

A browser-based F1 management game where you play as **Chief Engineer** — taking briefs from your Team Principal and making the engineering calls that determine your season.

## 🎮 How to Play

1. **Enter a seed** (or generate a random one) — the seed determines your team, Team Principal, budget, calendar events, and rival strengths
2. **Read your brief** — your TP gives you circuit-specific demands and budget constraints
3. **Allocate your budget** — spread development spend across Chassis, Aero, Power Unit, Suspension, Brakes, and Tyre Strategy
4. **Race** — your choices are simulated against the circuit demands and rival teams
5. **Debrief** — your TP reacts to the result, then on to the next round

## 🌱 The Seed System

The **season seed** is the key feature. Type any word/number combination and the game deterministically generates:

- Your team and livery colour
- Team Principal archetype (Glory Hunter / Budget Hawk / Tactician / Maverick)
- Driver lineup
- Starting budget
- Full 23-race calendar with weather and random events
- Rival team strengths and trajectories
- Mid-season pressure points and crises

**Same seed = same season every time.** Share seeds with friends to compare your engineering decisions.

**Example seeds to try:**
- `APEX24` — a technical, budget-constrained season
- `PODIUM7` — aggressive TP, high-downforce calendar
- `SENNA99` — maverick TP, unpredictable events

## 🏗️ How to Run

**Option 1 — Just open it:**
```
Open index.html in any modern browser
```

**Option 2 — Local server (recommended):**
```bash
# Python
python -m http.server 8000

# Node
npx serve .
```
Then visit `http://localhost:8000`

**Option 3 — GitHub Pages:**
1. Push to a GitHub repo
2. Go to Settings → Pages
3. Set source to `main` branch, root folder
4. Your game will be live at `https://yourusername.github.io/repo-name`

## 📁 Project Structure

```
f1-chief-engineer/
├── index.html          # All game screens (title, intro, game, end)
├── css/
│   └── styles.css      # Design system — carbon/titanium/red palette
└── js/
    ├── engine.js       # Game logic: seed RNG, season generator, race sim
    └── ui.js           # Screen rendering and event handling
```

## 🛠️ Built With

- **Vanilla HTML/CSS/JS** — no frameworks, no build step
- **Seeded RNG** — deterministic pseudo-random generation from any string
- **CSS custom properties** — full design token system for easy theming
- **Google Fonts** — Orbitron (display), Inter (body), JetBrains Mono (data)

## 🚀 Planned Features

- [ ] AI-powered Team Principal (Claude API) for dynamic briefs
- [ ] Upgrade tree — unlock advanced components
- [ ] Rival team standings table
- [ ] Season history log
- [ ] Driver morale system — your choices affect driver performance
- [ ] Weather strategy decisions during races
- [ ] Sound effects and music

## 📖 Learning This Project

This project was built to explore:
- **Game state management** in vanilla JS
- **Deterministic random generation** from string seeds
- **CSS design systems** without a framework
- **Simulation mechanics** — translating car specs to race results
- **Multi-screen apps** without a router library

Each file is heavily commented to explain the decisions. A great next step is reading `engine.js` and tweaking the `simulateRace()` function to change how car specs translate to finishing positions.

---

*Built with Claude — an experiment in AI-assisted game development.*

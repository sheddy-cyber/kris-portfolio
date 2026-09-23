# Kris Shedrach — Portfolio OS (v2.4.0 Titanium Edition)
### Built with Vue 3 (Composition API) + Vite 5 + Web Audio DSP

A next-generation interactive operating system personal portfolio workstation for **Kris Shedrach** — Full-Stack Web Architect and Mobile Engineer.

---

## ⚡ Key Upgrades & Architecture

1. **Titanium Glass & Cyber Aesthetic**:
   - Modern glassmorphic surfaces (`backdrop-filter: blur(24px) saturate(180%)`), glowing focused borders, and dynamic ambient background canvas (Interactive Constellation Particles / Cyber 3D Grid / Phosphor Matrix).
   - **5 Swappable System Themes**:
     - `Cyber Cyan` (Default)
     - `Neo Tokyo` (Cyberpunk Magenta & Violet)
     - `Matrix` (Phosphor Terminal Green)
     - `Obsidian Gold` (Solar Flare / Luxury Amber)
     - `Titanium` (Monochromatic Stealth Silver)

2. **Web Audio Sound Synthesis Engine (`src/audio/soundFx.js`)**:
   - Zero external audio assets; synthesizes real-time futuristic UI sound effects using the Web Audio API (window sweeps, mechanical keystrokes, laser blasts, explosion rumble, and system boot chimes).
   - Master volume slider and instant sound toggle in Quick Settings.

3. **Procedural Synthwave Radio (`src/audio/synthMusic.js` & `synthwave.fm`)**:
   - Procedural synthwave music generator featuring 3 original chill ambient tracks (*Quantum Drift*, *Neon Horizon*, *Obsidian Protocol*) with a live 24-band FFT audio spectrum visualizer.

4. **Hacker CLI Terminal (`terminal.sh`)**:
   - Interactive shell with autocomplete (Tab), history navigation (Arrow Up/Down), keystroke sounds, and commands:
     - `help`, `about`, `skills`, `projects`, `neofetch`, `theme <name>`, `music <play|stop|next>`, `matrix`, `ping <host>`, `contact`, `hire`, `clear`, `sudo rm -rf /`.

5. **Technical Blog & Publications (`articles.md` / `blog.app`)**:
   - Interactive knowledge base and technical writings showcase across Dev.to, Medium, Hashnode, Substack, and LinkedIn, featuring live search, platform filtering, quick takeaway summaries, and external publication links.

6. **Interactive Project Case Studies (`works.dir`)**:
   - Deep-dive case studies with architecture breakdown, key metrics, engineering challenges, stack pills, live demo links, and search & category filtering.

7. **Quantum Pilot Laser Game (`game.exe`)**:
   - Thruster flight mechanics, laser blaster cannons, multiplier streak combos, particle explosions, and local storage high score leaderboard.

8. **Encrypted Message Dispatcher (`contact.msg`)**:
   - Simulated RSA-4096 PGP encryption stream on message dispatch, one-click email copying, and social coordinates.

9. **CyberPhone OS Mobile Shell (`src/components/MobileShell.vue`)**:
   - Dedicated mobile cyberpunk interface with top Dynamic Island notification notch, bottom glass dock, and touch-optimized navigation.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or later recommended)

### Step 1 — Install Dependencies
```bash
npm install
```

### Step 2 — Start Development Server
```bash
npm run dev
```
Open **http://localhost:5173** in your browser.

---

## 🏗️ Production Build

```bash
npm run build
```
Outputs optimized production assets in `dist/`. Deploy to **Vercel**, **Netlify**, **Cloudflare Pages**, or **GitHub Pages**.

---

## ⌨️ Global Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt + A` | Open About Me (`about.exe`) |
| `Alt + W` | Open Works & Portfolio (`works.dir`) |
| `Alt + T` | Open Hacker Terminal (`terminal.sh`) |
| `Alt + B` / `Alt + S` | Open Technical Blog & Articles (`articles.md`) |
| `Alt + M` | Open Synthwave Radio (`radio.app`) |
| `Alt + G` | Open Quantum Pilot Game (`game.exe`) |
| `Alt + C` | Open Encrypted Contact (`contact.msg`) |
| `Escape`  | Close menus, modals, and flyouts |

---

## 📁 Project Structure

```
kris-portfolio/
├── index.html                   ← Enhanced typography (Orbitron, JetBrains Mono, Syne)
├── vite.config.js               ← Vite configuration
├── package.json
└── src/
    ├── main.js                  ← Vue entrypoint
    ├── App.vue                  ← Master OS Desktop shell & Aero Snap manager
    ├── audio/
    │   ├── soundFx.js           ← Web Audio synthesized UI sound effects
    │   └── synthMusic.js        ← Procedural synthwave audio engine & FFT analyzer
    ├── assets/
    │   ├── themes.css           ← 5 distinct theme variable definitions
    │   └── global.css           ← Titanium glassmorphism & OS styles
    ├── data/
    │   └── articles.js          ← Technical articles data store & platforms
    └── components/
        ├── CustomCursor.vue     ← Reticle crosshair cyber cursor with magnetic hover
        ├── OsWindow.vue         ← Draggable/resizable window with Aero Snap
        ├── QuickSettings.vue    ← Control Center (audio, themes, wallpaper modes)
        ├── ProjectModal.vue     ← Deep-dive case study inspector
        ├── AboutApp.vue         ← Multi-tab bio, career timeline, and skills matrix
        ├── ServicesApp.vue      ← 3D hover cards with deliverables breakdown
        ├── WorksApp.vue         ← Searchable portfolio with grid/list modes
        ├── TerminalApp.vue      ← Full-featured hacker CLI terminal
        ├── BlogApp.vue          ← Technical blog & multi-platform article showcase
        ├── SynthRadioApp.vue    ← Ambient radio player with audio visualizer
        ├── GameApp.vue          ← Quantum pilot space flight game
        ├── ContactApp.vue       ← Encrypted message console
        └── MobileShell.vue      ← CyberPhone OS interface for mobile devices
```

---

KRIS SHEDRACH PORTFOLIO OS © 2025 // CRAFTED WITH OBSESSIVE PRECISION

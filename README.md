# Kris Shedrach — Portfolio OS
### Built with Vue 3 + Vite

A fake operating system personal portfolio website for Kris Shedrach.

---

## 🚀 How to Run

### Prerequisites
You need **Node.js** installed (v18 or later recommended).
Download it from: https://nodejs.org

### Step 1 — Install dependencies
Open a terminal inside this folder and run:

```bash
npm install
```

This installs Vue 3 and Vite (only takes a few seconds).

### Step 2 — Start the dev server

```bash
npm run dev
```

Then open your browser to: **http://localhost:5173**

---

## 🏗️ Build for Production

```bash
npm run build
```

This outputs a `dist/` folder. Deploy it to **Vercel**, **Netlify**, or any static host.

### Deploy to Vercel (fastest)
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
Drag and drop the `dist/` folder into https://app.netlify.com/drop

---

## 📁 Project Structure

```
kris-portfolio/
├── index.html                  ← HTML entry point
├── vite.config.js              ← Vite config
├── package.json                ← Dependencies
└── src/
    ├── main.js                 ← Vue app mount
    ├── App.vue                 ← Main OS shell (boot, desktop, taskbar, windows)
    ├── assets/
    │   └── global.css          ← All styles
    └── components/
        ├── OsWindow.vue        ← Draggable/resizable window component
        ├── AboutApp.vue        ← About Me window
        ├── ServicesApp.vue     ← Services window
        ├── WorksApp.vue        ← Portfolio works grid (filterable)
        ├── GameApp.vue         ← Space Invaders game
        └── ContactApp.vue      ← Contact form
```

---

## ✏️ Customisation

### Update your info
- **About:** edit `src/components/AboutApp.vue` — update name, bio, skills, location
- **Services:** edit `src/components/ServicesApp.vue` — update service cards
- **Works:** edit `src/components/WorksApp.vue` — add/edit project cards in the `projects` array
- **Contact:** edit `src/components/ContactApp.vue` — update email, social links
- **Game score:** edit `src/components/GameApp.vue` — change `const KRIS_SCORE = 2847`

### Replace the cartoon avatar
Replace the inline SVG in `AboutApp.vue` and `ContactApp.vue` with an `<img>` tag:

```html
<div class="avatar-pic">
  <img src="/your-photo.jpg" alt="Kris Shedrach" style="width:100%;height:100%;object-fit:cover;" />
</div>
```

Put your photo in the `public/` folder and reference it as `/your-photo.jpg`.

### Connect the contact form
In `ContactApp.vue`, replace the `send()` function with a real API call:

```js
// Example using Formspree
async function send() {
  sending.value = true
  await fetch('https://formspree.io/f/YOUR_ID', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form.value),
  })
  sending.value = false
  sent.value = true
}
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt + A` | Open About |
| `Alt + W` | Open Works |
| `Alt + G` | Open Game |
| `Escape`  | Close start menu |

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Vue 3 (Composition API) |
| Build tool | Vite 5 |
| Styling | CSS3 custom properties |
| Fonts | Google Fonts (Orbitron, Rajdhani, Share Tech Mono) |
| Game | Canvas API (vanilla JS inside Vue component) |
| Animation | CSS animations + Canvas RAF |

---

KRIS SHEDRACH PORTFOLIO OS © 2025

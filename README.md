# 🎈 FunnyDoom

**🕹️ [Play online → dawidkreft.github.io/funnyDoom](https://dawidkreft.github.io/funnyDoom/)**

A browser-based FPS game inspired by Doom (1993), featuring cartoon monsters and absurd humor. Built entirely in vanilla JavaScript with zero runtime dependencies.

![FunnyDoom](public/favicon.svg)

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Requirements
- Node.js ≥ 20.18.1
- npm

> **Note:** Vite 5 is required (Vite 8 requires Node ≥ 20.19+)

## 🏗️ Production Build

```bash
npm run build     # outputs to dist/
npm run preview   # preview the build locally
```

Bundle size: ~47 kB (13 kB gzip).

---

## 🎮 Controls

| Action | Keys |
|---|---|
| Move | `W` `A` `S` `D` |
| Turn | `←` `→` or **mouse** |
| Shoot | `LMB` or `Space` |
| Switch weapon | `1` `2` `3` `4` |
| Pause | `Esc` |
| Toggle music | `M` |
| Toggle SFX | `N` |

---

## ⚔️ Weapons

| # | Weapon | Projectile | Ammo |
|---|---|---|---|
| 1 | 🎈 Balloon Cannon | Balloon | Infinite |
| 2 | 🍦 Ice Blaster | Ice cone | Ice creams (pickup) |
| 3 | 🧸 Mega Plushie | Teddy bear | Infinite |
| 4 | 💨 Super Stinker | Stink cloud | Spray cans (pickup) |

---

## 👾 Enemies

| Enemy | HP | Description |
|---|---|---|
| 🥔 Angry Potato | 20 | Fast, charges straight at you |
| 🍩 Flying Donut | 15 | Very fast, airborne |
| 🌵 Dancing Cactus | 40 | Slow but hits hard |
| 🐸 Giant Frog | 80 | Boss — slow, massive damage |
| ☁️ Sad Cloud | 30 | Shoots tears |

---

## 📦 Tech Stack

| | |
|---|---|
| Rendering | Canvas 2D API + DDA raycasting |
| Audio | Web Audio API (procedural synthesis) |
| Sprites | Offscreen Canvas 2D (procedurally generated, 64×64 px) |
| Bundler | Vite 5 |
| Runtime dependencies | **None** |

---

## 📁 Project Structure

```
funnydoom/
├── index.html
├── vite.config.js
├── SPEC.md               ← full technical spec & game design document
├── README.md
├── public/
│   └── favicon.svg
└── src/
    ├── main.js           # entry point, game loop, state machine
    ├── engine/
    │   ├── raycaster.js  # DDA raycasting
    │   ├── renderer.js   # walls, floor/ceiling, sprite billboarding
    │   └── camera.js     # player movement, FOV, collision
    ├── game/
    │   ├── constants.js  # game constants
    │   ├── player.js     # HP, weapons, effects
    │   ├── enemy.js      # FSM AI
    │   ├── projectile.js # projectile physics
    │   ├── powerup.js    # pickups
    │   └── sprites.js    # procedurally generated sprites
    ├── map/
    │   ├── map.js
    │   └── levels/       # level1–level4
    ├── ui/
    │   ├── hud.js
    │   └── menu.js
    └── audio/
        └── soundmanager.js  # music + SFX (Web Audio API)
```

---  

## 📖 Specification

Full game design document and technical architecture: [`SPEC.md`](SPEC.md).


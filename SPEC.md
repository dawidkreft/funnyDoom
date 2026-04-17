# FunnyDoom — Game Specification

> **Status: v1.0 — Implemented and playable**
> Last updated: 2026-04-17

## 1. Product Overview

**FunnyDoom** is a browser-based FPS game inspired by the original Doom (1993), rendered via **raycasting** on an HTML `<canvas>` element. Instead of a demonic atmosphere — a colorful, cartoon world full of absurd monsters and silly humor.

The game runs entirely in the browser with zero external runtime dependencies. Enemy, weapon, and pickup sprites are generated procedurally in memory using the offscreen Canvas 2D API.

---

## 2. Platform

| | |
|---|---|
| **Platform** | Browser (Chrome 110+, Firefox 110+, Safari 16+) |
| **Technology** | Vanilla JavaScript (ES2022) + Canvas API |
| **Bundler** | Vite 5 (Node ≥ 20.18) |
| **Runtime dependencies** | None (zero dependencies) |
| **Base resolution** | 640×400 px (scales to window) |
| **Target FPS** | 60 FPS |
| **Build size** | ~47 kB (13 kB gzip) |
| **Favicon** | `public/favicon.svg` — angry balloon face SVG |

---

## 3. Game Design

### 3.1 Perspective & Movement
- First-person pseudo-3D via raycasting — Doom 1993 style
- Movement: `WASD` + `←→` — walk and turn
- Mouse (pointer lock): horizontal rotation
- No jumping (like the original Doom)
- Wall collision: bounding-box with radius `r = 0.28`, checked at 4 player corners
- Safe spawn: enemies cannot spawn inside walls (runtime safety filter)

### 3.2 Weapons

| Weapon | Key | Description | Projectile | Ammo |
|---|---|---|---|---|
| Balloon Cannon | `1` | Fast, low damage | Pink balloon | Infinite |
| Ice Blaster | `2` | Freezes enemies for 2s | Ice cone | Ice creams (pickup) |
| Mega Plushie | `3` | High damage, knock-back | Teddy bear | Infinite |
| Super Stinker | `4` | AoE green stink cloud | Smoke cloud | Spray cans (pickup) |

### 3.3 Enemies

Sprites are drawn procedurally (Canvas 2D arcs/bezier curves) and rendered via billboarding.

| Enemy | HP | Speed | Damage | Appearance |
|---|---|---|---|---|
| Angry Potato | 20 | 1.5 | 8 | Yellow potato with eyes and tiny arms |
| Flying Donut | 15 | 2.0 | 6 | Pink donut with icing and a hole |
| Dancing Cactus | 40 | 0.8 | 15 | Green cactus with spikes and a grin |
| Giant Frog | 80 | 1.2 | 20 | Green frog with huge eyes (boss) |
| Sad Cloud | 30 | 1.0 | 10 | White cloud with tears and a frown |

AI: **Finite State Machine** `IDLE → ALERT → CHASE → ATTACK → DEAD`
- Player detection: ray cast line-of-sight
- Pathfinding: direct pursuit (v1.0), aims and fires projectiles at player

### 3.4 Levels

| Level | Map Size | Enemies | Notes |
|---|---|---|---|
| 1 — Fun Fair | 16×13 | 5 (mixed) | Intro, 1 weapon pickup |
| 2 — Chaos Kitchen | 24×18 | 12 (mixed) | Denser layout, many corridors |
| 3 — Disco Dungeon | 28×20 | 18 (mixed) | Maze-like, multiple pickups |
| 4 — Veggie Garden | 32×22 | 25 + Frog boss | Largest arena, boss at the end |

Level clear condition: **all enemies must be defeated**.

### 3.5 Power-ups & Weapon Pickups

| Item | Effect |
|---|---|
| 🍕 Pizza | +25 HP |
| 🛡️ Rainbow Shield | Invincibility for 5s (`shielded`) |
| ⚡ Turbo Sneakers | +50% speed for 8s (`speed`) |
| 💥 Mega Balloons | Double damage for 10s (`damage`) |
| 🔫 Ice Blaster (pickup) | Unlocks weapon + 20 ice creams |
| 🔫 Super Stinker (pickup) | Unlocks weapon + 15 spray cans |

Pickup sprites rendered with a bobbing animation (sine wave).

---

## 4. Technical Architecture

### 4.1 File Structure

```
funnydoom/
├── index.html                  # Canvas + meta + favicon link
├── vite.config.js
├── public/
│   └── favicon.svg             # Angry balloon face SVG
└── src/
    ├── main.js                 # Entry point: canvas, input, game loop, state machine
    ├── engine/
    │   ├── raycaster.js        # DDA raycasting — walls, z-buffer
    │   ├── renderer.js         # Walls, flat floor/ceiling, sprite billboarding
    │   └── camera.js           # Position, angle, FOV, tryMove() with bounding-box
    ├── game/
    │   ├── constants.js        # Constants (TILE_*, WEAPON_*, POWERUP_TYPES)
    │   ├── player.js           # HP, weapons, ammo, effects, _justHit flag
    │   ├── enemy.js            # FSM AI, drawColumn(), _justHit/_justDied flags
    │   ├── projectile.js       # Projectile physics, drawColumn() with sprite
    │   ├── powerup.js          # Pickup logic, bobbing animation, drawColumn()
    │   └── sprites.js          # Procedural sprites 64×64 (offscreen canvas)
    ├── map/
    │   ├── map.js              # GameMap: 2D grid, isWall(), playerStart, spawns
    │   └── levels/
    │       ├── level1.js       # 16×13
    │       ├── level2.js       # 24×18
    │       ├── level3.js       # 28×20
    │       └── level4.js       # 32×22 + boss
    ├── ui/
    │   ├── hud.js              # HP, ammo, weapon, score, sound toggles
    │   └── menu.js             # Screens: main, pause, levelclear, gameover
    └── audio/
        └── soundmanager.js     # Web Audio API: synthesized music + SFX
```

### 4.2 Game Loop

```
requestAnimationFrame(loop)
  │
  ├─► input handling            # Keyboard (WASD, arrows, 1-4, M, N, Esc, Space)
  │                             # Mouse (rotation, LMB = shoot)
  ├─► update(dt)
  │   ├─► camera.rotate / tryMove()
  │   ├─► player.update(dt)
  │   ├─► enemies[].update(dt)
  │   ├─► powerups[].update + tryPickup()
  │   ├─► projectiles[].update(dt)
  │   ├─► sound flags: _justHit, _justDied → SoundManager
  │   ├─► score: +100 per enemy kill
  │   └─► state: levelclear / gameover check
  └─► render()
      ├─► raycaster.castAll()   # Hits + z-buffer
      ├─► renderer.drawScene()  # Walls + flat floor/ceiling
      ├─► renderer.drawSprites()# Billboarding (z-sorted)
      ├─► hud.draw()            # Overlay UI + sound toggles
      └─► menu.draw()           # Menu screen (if active)
```

### 4.3 Raycasting

- **DDA algorithm** — Digital Differential Analyzer (standard Doom/Wolfenstein approach)
- FOV: 66°, 1 ray per screen column
- Wall color depends on orientation (N/S darker, E/W lighter)
- Sprite billboarding: z-sorted by distance, clipped to z-buffer (never drawn behind walls)
- Floor and ceiling: flat shading (solid color)
- No pixelation (`image-rendering` not overridden)

### 4.4 Sprite Rendering

All sprites are generated procedurally at startup in offscreen `<canvas>` elements (64×64 px):
- **Enemies**: 5 types — drawn with arcs, bezier curves, emoji-like faces
- **Projectiles**: 4 types matching each weapon (balloon, ice cone, teddy bear, stink cloud)
- **Pickups**: 7 types (pizza, shield, lightning, mega balloons, ice blaster, stinker)

Column-based rendering: `ctx.drawImage(sprite, texX, 0, 1, 64, stripe, drawY, 1, height)`

### 4.5 Enemy AI

FSM states: `idle → alert → chase → attack → dead`

| State | Behavior |
|---|---|
| `idle` | Stands still |
| `alert` | Spots player via LOS ray, turns toward them |
| `chase` | Moves directly toward player |
| `attack` | In range — shoots or melee hits, with cooldown |
| `dead` | Falls, removed from collision and rendering |

---

## 5. UI / HUD

- **Bottom**: HP bar (number), active weapon icon, ammo counter
- **Top left**: score, current level
- **Top right**: ♪M (music) and SFX toggle buttons — green = on, red = off
- **Center**: crosshair
- **Player hit**: red vignette flash
- **Pickup notification**: banner with item name (3s display)
- **Screens**: Main Menu, Pause (`Esc`), Level Clear, Game Over

---

## 6. Audio

All sound is **procedurally synthesized** via the Web Audio API — no audio files required.

| Sound | Trigger | Implementation |
|---|---|---|
| Music (loop) | Level start | Upbeat D-major chiptune melody: square/triangle oscillators, bass line, kick + snare + hihat, 126 BPM |
| Shot (4 variants) | `onShoot` | Per-weapon sound (pop, ice sweep, thud, stink spray) |
| Enemy hit | `onEnemyHit` | Short cartoon squeak |
| Enemy death | `onEnemyDead` | Descending "wah" |
| Player hit | `onPlayerHit` | Heavy distorted thud |
| Pickup | `onPickup` | Ascending 4-note chime |

**Audio controls:**
- `M` — toggle music
- `N` — toggle SFX
- AudioContext created on first user gesture (Chrome autoplay policy requirement)

---

## 7. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Language | JavaScript ES2022 | No TypeScript |
| Rendering | Canvas 2D API | Raycasting + sprite billboarding |
| Audio | Web Audio API | Procedural synthesis, no files |
| Sprites | Offscreen Canvas 2D | Procedurally generated, 64×64 px |
| Bundler | Vite 5 | Node ≥ 20.18.1 (Vite 8 requires 20.19+) |
| Runtime dependencies | None | Zero dependencies |

---

## 8. Implementation Status (v1.0)

### ✅ Implemented

- [x] DDA raycasting engine (walls, z-buffer, billboard sprites)
- [x] Player movement (WASD + mouse, pointer lock)
- [x] Wall collision (bounding-box, r=0.28)
- [x] 4 weapons with individual projectile sprites
- [x] 5 enemies with FSM AI and procedural sprites
- [x] 4 levels (escalating difficulty: 5 → 12 → 18 → 25+ enemies)
- [x] Power-ups with bobbing animation and sprites
- [x] Weapon pickups (unlock new weapons)
- [x] HUD: HP, ammo, weapon, score, level, sound toggles
- [x] Menus: main, pause, level clear, game over
- [x] Audio: synthesized music (D-major chiptune) + 6 SFX types
- [x] Sound toggles (M = music, N = SFX) with visual indicator
- [x] Favicon (angry balloon face SVG)
- [x] Safety filter: enemies cannot spawn inside walls
- [x] Smooth rendering (no pixelation)

### 🔜 Possible Extensions (v1.1+)

- [ ] Minimap (toggle `Tab`)
- [ ] Highscore (localStorage)
- [ ] Mobile touch controls
- [ ] Animated enemy sprites (frame animation)
- [ ] Doors (open with `E`)
- [ ] Per-level music themes
- [ ] Particle effects on enemy death


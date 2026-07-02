# Build & Crush Garage (v4)

A kids' (ages ~3–8) sticker-builder game for iPad Safari first, iPhone second,
desktop third. Drag SVG sticker parts onto a dashed silhouette to build 15
trucks and dinosaurs, then paint them, photograph them, and drive them around
a physics sandbox.

No frameworks, no build step, no accounts, no ads, no network after first
load. Vanilla JS + SVG + Canvas + WebAudio only.

## Project structure

The game is no longer a single HTML file — it's a proper installable PWA:

```
index.html            app shell + screen markup
styles.css            all styles (self-hosted fonts for offline play)
manifest.webmanifest  PWA manifest (fullscreen, landscape)
sw.js                 service worker — cache-first, 100% offline after first load
js/
  parts.js            vehicle/part art data, tinting, decals, scene backdrops
  audio.js            synthesized sounds + engine loop whose RPM follows speed
  save.js             localStorage persistence, up to 4 sibling profiles
  speech.js           spoken encouragement (Web Speech API, optional polish)
  fx.js               fireworks/confetti canvas + cheer banner
  surprises.js        tap-surprise reactions on finished vehicles
  paint.js            Paint Shop (recolor parts, drag-on decals)
  photo.js            Photo mode + Trophy Garage (share/save PNGs)
  drive.js            Drive Mode — endless side-scroller with ramps & crushables
  game.js             profiles, garage, build engine, finale, settings, boot
fonts/                self-hosted Luckiest Guy + Nunito (latin woff2)
icons/                PWA icons (192/512 + apple-touch-icon)
legacy/               previous single-file games kept for reference
```

Script load order matters (`index.html` bottom): they're plain scripts sharing
globals, by design — zero tooling required.

## What's new in v4 (vs the single-file v3)

- **Persistence + profiles** — everything (unlocks, stars, paint, photos,
  difficulty, mute) survives reload, per builder, up to 4 siblings.
  Versioned key `bcg_save_v1`, try/catch around all storage access.
- **Paint Shop** — 12 swatches + 6 decal stickers; painted vehicles render
  everywhere (garage, build stage, finale, photos, drive mode).
- **Photo mode + Trophy Garage** — license-plate photo cards on 3 backdrops,
  saved into the profile (max 12), shareable via `navigator.share({files})`
  with a download fallback.
- **Drive Mode** — the realism centerpiece: acceleration/friction physics,
  ramps with real gravity launches, wheels that actually roll at road speed,
  suspension bob, burnout smoke + skids, crushable cars, boinging cones,
  toppling barrels, parallax scenery, and a synthesized engine whose RPM
  follows the throttle (dinos stomp with footstep thumps instead).
  Controls: hold right half = go, left half = back up. That's it.
- **Tap surprises** — wheels spin, horns honk (per-vehicle: siren blip,
  jingle, air horn), exhaust puffs, dino jaws chomp, eyes blink.
- **Difficulty modes** — Little Builder (ages 2–4: 7 biggest parts, 1.6× snap
  radius, big tray tiles, auto "finishing touches", no timer) vs Pro Builder
  (ages 5+: all parts + challenge stars). Chosen per profile, changeable in
  settings.
- **Builder Levels (Pro)** — every build earns XP (+bonus for stars); the
  garage shows a level badge and progress bar. As levels rise the game
  quietly advances the child: level 3 fades the ghost outlines and tightens
  the snap radius, level 4 more so, and level 5+ unlocks **Memory Builds** —
  a 6-second peek at the blueprint, then it fades and they build from
  memory (a near-miss drop briefly relights that part's ghost so it stays
  fair). Part names are also spoken on pickup for early-reader vocabulary.
- **Spoken encouragement** — Web Speech praise/greetings, separate voice
  toggle, silent during finale/drive, fully optional.
- **PWA** — installable, fullscreen landscape, works in airplane mode
  (fonts self-hosted, cache-first service worker, versioned cache).
- **Finale upgrades** — headlight beams at night, skid marks, crash sound +
  camera shake, painted vehicle stars in its own finale.

## Run locally

Any static server works (a service worker requires http(s), not `file://`):

```
npx http-server -p 8080
# or: python3 -m http.server 8080
```

## Deploy

**Firebase Hosting** (config included):

```
firebase deploy
```

**GitHub Pages**: enable Pages on the main branch — no build step needed.

**Every deploy:** bump the `CACHE` version string at the top of `sw.js`
(e.g. `bcg-v4.0.1`) so installed iPads pick up the new content.

## iPad Safari notes

- Audio + speech start lazily on first user gesture (iOS requirement) — don't
  add autoplay.
- `height:100vh` fallback precedes `100dvh` everywhere.
- Drags listen for `pointercancel` and keep `touch-action:none`.
- localStorage writes are try/caught (private browsing throws).
- Home-screen installs get a separate storage partition from the Safari tab —
  progress won't carry across; build in the installed app.

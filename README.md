# Ronograd Field Atlas

Buildless interactive SVG map for BRM5 Ronograd only. Five loot-room compounds, eighteen key spawn descriptions, possible loot with quantities and major landmarks. Wiki research checked 2026-11-02. See [research.md](research.md) for provenance and unresolved source conflicts.

## Website

https://vinhelysia.github.io/ronograd-field-atlas/

Pushes to `main` run the existing self-check and deploy `dist/` through GitHub Actions. No build step, package installation or deployment secret is needed. Repository Pages settings must use GitHub Actions as the source.

## Run

From this directory: `python -m http.server 5173 --bind 127.0.0.1 --directory dist`, then open http://127.0.0.1:5173. No npm install or build is needed. Run `npm test` for data and map-math checks.

Drag, wheel/pinch, zoom buttons, or focus the map and use arrows / + / - / Home. Select a room to read loot and key directions; checklist ticks are temporary. Search by place, key or loot. Landmarks/grid can be toggled. Export SVG downloads the vector atlas; the active layer choices are preserved.

## Scope and precision

Pins are approximate compound anchors. They are not measured door/key coordinates. Room directions carry the indoor detail; no floor plan or key coordinates were fabricated. The terrain reference predates the research: January 2025 orthographic imagery vs November 2026 Wiki text. There is no game integration, live player tracking, guaranteed loot, routing or respawn timer.

`dist/terrain.svg` is actual vector geometry, with no embedded raster. `scripts/trace-map.py` regenerates it from `../references/ronograd-wiki.png` using Pillow, NumPy, Matplotlib and contourpy. To regenerate, download the credited original image from https://static.wikia.nocookie.net/roblox-blackhawk-rescue-mission-5/images/1/19/Rono16k10mb.png/revision/latest?cb=20250124002707 to that path first; the reference image is not bundled in this repository. Those Python packages are only needed to regenerate the trace. Markers/anchors are in `dist/map-data.js`; facts and their sources are in `dist/rooms.json`.

## Attribution

Terrain adapted from Gravity_Defier’s orthographic image at https://roblox-blackhawk-rescue-mission-5.fandom.com/wiki/Map:Operation_Phoenix_-_Ronograd_Island (image dated January 2025). Landmarks cross-checked with AGuyNamedMinh’s annotated map at https://roblox-blackhawk-rescue-mission-5.fandom.com/wiki/File:Ronograd_Island_map.png. Research paraphrased from the BRM5 Fandom Wiki with per-room links. Wiki-derived map/data adaptation is shared under CC BY-SA 3.0 unless the source states otherwise: https://creativecommons.org/licenses/by-sa/3.0/. Changes: colour simplification, vector tracing, approximate compound anchors, interface and research annotations. The game’s content and trademarks remain with their owners. Unofficial fan tool.

The layout takes inspiration from Tarkov Pilot’s interactive-map workflow, with no copied interface code or game integration. Fonts use Google Fonts, with local system fallbacks.

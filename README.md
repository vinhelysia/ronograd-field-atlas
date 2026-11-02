# Ronograd Field Atlas

Buildless interactive map for BRM5 Ronograd only, using the unchanged full-resolution Wiki orthographic image with vector markers. Five loot-room compounds, eighteen key spawn descriptions, possible loot with quantities and major landmarks. Wiki research checked 2026-11-02. See [research.md](research.md) for provenance and unresolved source conflicts.

## Website

https://vinhelysia.github.io/ronograd-field-atlas/

Pushes to `main` run the existing self-check and deploy `dist/` through GitHub Actions. No build step, package installation or deployment secret is needed. Repository Pages settings must use GitHub Actions as the source.

## Run

From this directory: `python -m http.server 5173 --bind 127.0.0.1 --directory dist`, then open http://127.0.0.1:5173. No npm install or build is needed. Run `npm test` for data and map-math checks.

Drag, wheel/pinch, zoom buttons, or focus the map and use arrows / + / - / Home. The **1:1** button shows one source-image pixel per CSS pixel. Select a room to read loot, directions and available Wiki key diagrams; checklist ticks are temporary. Search by place, key or loot. Landmarks, room pins and the grid can be toggled. Export SVG downloads a standalone SVG containing the unchanged raster image plus vector markers; the active layer choices are preserved.

## Scope and precision

Terrain matches the published reference image without colour simplification, tracing, downsampling or aspect-ratio distortion. The Wiki calls this a “16k” map, but the published PNG is actually **7,187 × 7,382 px**. The image file is bundled unchanged and its SHA-256 is checked by `npm test`.

Compound pins are approximate. Wiki key diagrams retain the source's floor callouts; source diagram projections are not surveyed indoor coordinates. Rooms without a verified diagram keep directional descriptions rather than invented precise pins. The terrain reference predates the research: January 2025 orthographic imagery vs November 2026 Wiki text. There is no game integration, live player tracking, guaranteed loot, routing or respawn timer.

Kozlovka's six key descriptions and Quarry's two key descriptions have **Locate on map** controls calibrated to the Wiki diagrams. Kozlovka's room callout is also mapped. Three Kozlovka descriptions share one projected building point; Quarry points are labelled underground. Naval Base, Ronograd City and Sochraina have original door-reference photos and directional guidance, with no invented door/key pins. See [research-map-alignment.md](research-map-alignment.md) for measured image alignment and its limits.

`dist/assets/ronograd.png` is the original map: https://static.wikia.nocookie.net/roblox-blackhawk-rescue-mission-5/images/1/19/Rono16k10mb.png/revision/latest?cb=20250124002707&format=original . Its unmodified SHA-256 is `d4d2c300734646229ad1254f8def2cf56b8f8d665b0e1474cade9a40cc087b46`. Marker anchors and diagram sources are in `dist/map-data.js`; facts and their sources are in `dist/rooms.json`. No image tracing toolchain is needed. Loading the original costs about 10 MB of transfer and more image memory than a reduced basemap.

## Attribution

Terrain is Gravity_Defier’s original orthographic image at https://roblox-blackhawk-rescue-mission-5.fandom.com/wiki/Map:Operation_Phoenix_-_Ronograd_Island (image dated January 2025). Landmarks cross-checked with AGuyNamedMinh’s annotated map at https://roblox-blackhawk-rescue-mission-5.fandom.com/wiki/File:Ronograd_Island_map.png. Key diagrams are preserved from their linked BRM5 Wiki file pages. Research is paraphrased with per-room links. Wiki-derived map/data adaptation is shared under CC BY-SA 3.0 unless the source states otherwise: https://creativecommons.org/licenses/by-sa/3.0/. Changes: interactive vector overlays, source diagram alignment and research annotations; source raster pixels are unchanged. The game’s content and trademarks remain with their owners. Unofficial fan tool.

The layout takes inspiration from Tarkov Pilot’s interactive-map workflow, with no copied interface code or game integration. Fonts use Google Fonts, with local system fallbacks.

# Source-image alignment receipt

Research date: 2026-11-02 (Asia/Saigon). This receipt concerns image registration against the same Wiki orthographic island image. It does **not** establish surveyed world coordinates or the physical accuracy of the contributor-drawn markers.

## Original source files

The app bundles the original island image, both key diagrams and three door photos in `dist/assets/`. Additional research images and registration outputs are retained in the local workspace's `../references/` directory. CDN requests include `format=original`; the default CDN delivery returned lossy WebP despite PNG/JPG filenames.

| Local filename | Original dimensions | Source |
| --- | --- | --- |
| `ronograd-original.png` | 7187 × 7382 | [Original island raster](https://static.wikia.nocookie.net/roblox-blackhawk-rescue-mission-5/images/1/19/Rono16k10mb.png/revision/latest?cb=20250124002707&format=original); SHA-256 `d4d2c300734646229ad1254f8def2cf56b8f8d665b0e1474cade9a40cc087b46` |
| `kozlovka-key-spawns.png` | 745 × 580 | [Kozlovka_Key_Spawn_Locations.png](https://static.wikia.nocookie.net/roblox-blackhawk-rescue-mission-5/images/8/85/Kozlovka_Key_Spawn_Locations.png/revision/latest?cb=20260926162848&format=original) |
| `quarry-key-spawns.png` | 1102 × 955 | [QuarryKeySpawnLocations.png](https://static.wikia.nocookie.net/roblox-blackhawk-rescue-mission-5/images/c/ce/QuarryKeySpawnLocations.png/revision/latest?cb=20260722082746&format=original) |
| `kozlovka-compound-map.png` | 711 × 474 | [Kozlovka_Map.png](https://static.wikia.nocookie.net/roblox-blackhawk-rescue-mission-5/images/b/bd/Kozlovka_Map.png/revision/latest?cb=20250811182519&format=original) |

The Kozlovka diagram labels itself Release 9.8.5. Both diagrams were observed on the live corresponding location articles in the earlier research pass. Their background layouts match the original island image. Re-fetching main Wiki HTML by public HTTP was blocked by a Cloudflare challenge; no challenge was bypassed and no browser workaround was used for this calibration pass.

## Coordinate convention

Native coordinates use image pixels, origin at the upper left. Canonical coordinates preserve aspect ratio:

```text
canonicalX = nativeX * 1460 / 7187
canonicalY = nativeY * 1460 / 7187
canonical size = 1460 × 1499.6131904828162
```

Do not stretch the image to height 1500 if matching these coordinates exactly. Floor labels remain necessary: a top-down point cannot identify an indoor floor.

## Kozlovka registration

The underlying map is the same scale and orientation: a translation is sufficient. Seven unannotated 28 × 28 background patches were compared after a Gaussian high-pass transform. Diagram patch centers were `(234,150)`, `(486,279)`, `(557,145)`, `(581,267)`, `(108,219)`, `(356,178)`, `(238,393)`. Joint normalized correlation with bilinear resampling is **0.9988551267** against the original PNG. The fitted transform is:

```text
nativeX = diagramX + 475.5237588892637
nativeY = diagramY + 5630.344491624186
```

A separate integer-pixel comparison over the same unscaled patches selected offset `(132,68)` within the native crop beginning `(344,5562)`. Independent patch NCC searches produced center agreement within approximately one pixel. Earlier integer patch centers gave a numerically zero affine residual because the match grid quantizes centers; that is not meaningful physical accuracy and is not used as a precision claim.

Conservative registration allowance is ±1 native pixel. Marker centers were manually digitized from circles approximately 10–12 diagram pixels wide: allow an additional ±2 diagram pixels. These allowances cover registration/digitization only; the source contributor's actual placement error is unknown.

| Target | JSON `keySpawns` index | Floor | Diagram center | Native image point | Canonical point |
| --- | --- | --- | --- | --- | --- |
| Entrance house table | 0 | 1 | 453, 138 | 928.523759, 5768.344492 | 188.624557, 1171.807842 |
| VIP white table | 1 | 4 | 177.5, 367.5 | 653.023759, 5997.844492 | 132.658228, 1218.429520 |
| VIP kitchen counter | 2 | 4 | **Same shared diagram circle** | **Same point** | **Same point** |
| Main apartment wooden table | 3 | Wiki/diagram: 1 | **Same shared diagram circle** | **Same point** | **Same point** |
| Eastern apartment white table | 4 | 3 | 294, 375 | 769.523759, 6005.344492 | 156.324570, 1219.953104 |
| Eastern apartment bed | 5 | 3 | 284, 366 | 759.523759, 5996.344492 | 154.293125, 1218.124803 |
| Locked-room annotation | — | 4 | 149.5, 351.5 | 625.023759, 5981.844492 | 126.970181, 1215.179207 |

The source places three descriptions at a shared projected marker. It does **not** distinguish the precise table-versus-counter coordinates. Do not fan them out into falsely precise geographic points: one marker can list the three checks, with their floors. The room annotation also denotes an interior area on the roof projection, not a surveyed navigable door threshold.

## Quarry registration

The source is a darker in-game map with a grid and inset screenshots. Unannotated building and terrain patches were matched using normalized high-pass correlation over scales 0.80–1.04. RANSAC with a 2-pixel inlier threshold retained six of seven candidate matches. The rejected patch had a visually ambiguous dark building and disagreed with the common transform.

The native crop origin is `(2953,4184)`. Matrix notation uses row vector `[diagramX, diagramY, 1]`:

```text
[cropX, cropY] = [diagramX, diagramY, 1] ×
  [ 0.8387142352349328,    -0.00028480159701380477 ]
  [ 0.0003537360486530229,  0.8392187614522407     ]
  [10.97448862289797,     -12.143710045089355     ]

nativeX = cropX + 2953
nativeY = cropY + 4184
```

| Diagram control center | Matched native-crop center | NCC | Fit residual, native px |
| --- | --- | ---: | ---: |
| 741, 252 | 632.5, 199.5 | 0.6496 | 0.3751 |
| 758, 431 | 647, 349 | 0.7185 | 0.3666 |
| 596, 639 | 511, 523 | 0.5306 | 0.9502 |
| 434, 744 | 375, 613 | 0.5954 | 0.9203 |
| 316, 784 | 276.5, 645.5 | 0.4315 | 0.3028 |
| 947, 680 | 805.5, 558.5 | 0.5751 | 0.2457 |

RMS residual is **0.6023721126 native pixels**, with maximum residual 0.9503 pixels. Source red-square centers are manually digitized with approximately ±2 diagram-pixel uncertainty; each square spans roughly 30–35 pixels. This is an approximate source-diagram projection, not a precise player location.

| Target | JSON `keySpawns` index | Floor | Diagram square center | Native image point | Canonical point |
| --- | --- | --- | --- | --- | --- |
| VIP room chair | 0 | Underground VIP area | 347, 560 | 3255.206420, 4641.719970 | 661.277497, 942.940192 |
| Table near deep elevator | 1 | Deepest underground level | 451.5, 396 | 3342.794045, 4504.058332 | 679.070447, 914.974978 |

The diagram gives **no locked-room door map marker**. Its two squares are surface projections of underground positions. They must be labelled underground/approximate, and must not be shown as surface entrances or usable GPS coordinates.

## Original door photographs for all five compounds

These photographs identify the appearance of the indoor doors. They provide no global map coordinates. Existing room text still supplies the floor/directional guidance, including the unresolved Naval floor. No exact geographic markers for Naval, Ronograd City or Sochraina were inferred from photographs.

| Local filename | Dimensions | Original URL / Wiki File ID |
| --- | --- | --- |
| `kozlovka-locked-room.jpg` | 2381 × 1573 | [KozlovkaLockedRoom.jpg — d/d7](https://static.wikia.nocookie.net/roblox-blackhawk-rescue-mission-5/images/d/d7/KozlovkaLockedRoom.jpg/revision/latest?cb=20260722115416&format=original) |
| `quarry-locked-room.jpg` | 2246 × 1490 | [QuarryLockedRoom.jpg — e/e4](https://static.wikia.nocookie.net/roblox-blackhawk-rescue-mission-5/images/e/e4/QuarryLockedRoom.jpg/revision/latest?cb=20260722113807&format=original) |
| `NavalBaseLockedRoom.jpg` | 2274 × 1472 | [NavalBaseLockedRoom.jpg — b/be](https://static.wikia.nocookie.net/roblox-blackhawk-rescue-mission-5/images/b/be/NavalBaseLockedRoom.jpg/revision/latest?format=original) |
| `RonogradCityLockedRoom.jpg` | 1982 × 1459 | [RonogradCityLockedRoom.jpg — 1/13](https://static.wikia.nocookie.net/roblox-blackhawk-rescue-mission-5/images/1/13/RonogradCityLockedRoom.jpg/revision/latest?format=original) |
| `SochrainaLockedRoom.jpg` | 2534 × 1579 | [SochrainaLockedRoom.jpg — 7/7a](https://static.wikia.nocookie.net/roblox-blackhawk-rescue-mission-5/images/7/7a/SochrainaLockedRoom.jpg/revision/latest?format=original) |

The room-photo filenames were already observed on the live Locked Room article. MediaWiki's deterministic MD5 directory convention resolved the three remaining original CDN paths; downloads were verified as images. No speculative key-diagram filenames were used.

## Reproducibility and limits

Files in the references directory: `register-kozlovka.py`, `register-quarry.py`, `finalize-map-registration.py`; JSON outputs `kozlovka-registration-matches.json`, `kozlovka-registration-translation.json`, `quarry-registration-matches.json`, and **`map-registration.json`**. The final script asserts original dimensions, Kozlovka correlation >0.98, six Quarry inliers and Quarry RMS <1 native pixel. It completed successfully.

The last script uses `numpy`, `scipy`, and `Pillow` already installed. It performs research registration only and changes no app files. Decimal values are retained for reproducibility, not as a claim of corresponding in-game precision. Other three compounds remain indoor directional guidance plus source door photos until similarly grounded spatial evidence is obtained. No in-game verification was performed.

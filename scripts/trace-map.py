"""Rebuild the vector basemap from the credited Wiki orthographic reference."""
from pathlib import Path
import contourpy
import numpy as np
from PIL import Image, ImageFilter
from matplotlib.path import Path as MplPath

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent / "references" / "ronograd-wiki.png"
im = Image.open(SOURCE).convert("RGBA")
im.thumbnail((1800, 1850))
rgba = np.asarray(im)
land = rgba[:, :, 3] > 150
rgb = rgba[:, :, :3].copy()
rgb[~land] = (72, 78, 63)
indexed = Image.fromarray(rgb).quantize(colors=10)
palette = np.array(indexed.getpalette()[:30]).reshape(-1, 3)
luma = palette @ np.array([.2126, .7152, .0722])
values = luma[np.asarray(indexed)]
sx, sy = 1460 / im.width, 1500 / im.height

def paths(mask, minimum=2.5):
    contours = contourpy.contour_generator(z=np.pad(mask.astype(float), 1)).lines(.5)
    result = []
    for line in contours:
        area = abs(np.sum(line[:-1, 0] * line[1:, 1] - line[1:, 0] * line[:-1, 1])) / 2
        if area < minimum:
            continue
        p = MplPath(line).cleaned(simplify=True)
        points = p.vertices[p.codes != MplPath.STOP]
        if len(points) > 3:
            result.append("M" + "L".join(f"{(x-1)*sx:.1f},{(y-1)*sy:.1f}" for x,y in points) + "Z")
    return "".join(result)

coast = paths(land, 12)
svg = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1460 1500" role="img" aria-labelledby="map-title map-desc">',
       '<title id="map-title">Ronograd vector terrain</title>',
       '<desc id="map-desc">Simplified vector adaptation of Gravity_Defier’s orthographic map on the BRM5 Wiki. Terrain reference dated January 2025; room research November 2026. CC BY-SA 3.0. Area anchors are approximate.</desc>',
       '<metadata>Source: https://roblox-blackhawk-rescue-mission-5.fandom.com/wiki/Map:Operation_Phoenix_-_Ronograd_Island ; Gravity_Defier / BRM5 Wiki contributors; colour simplification and vector tracing. License: https://creativecommons.org/licenses/by-sa/3.0/</metadata>',
       '<rect width="1460" height="1500" fill="#101e26"/>',
       f'<path d="{coast}" fill="#303b32" stroke="#6c7f78" stroke-width="1.2" fill-rule="evenodd"/>']
# Cumulative masks keep adjacent colour regions free of hairline gaps.
for threshold, color in [(51,"#394539"),(63,"#414d3d"),(73,"#4a5441"),(83,"#59604d"),(96,"#737769"),(120,"#8c9085"),(157,"#b8c1b8"),(193,"#d0d7cc")]:
    mask = Image.fromarray(((values > threshold) & land).astype("uint8") * 255).filter(ImageFilter.MedianFilter(3))
    d = paths(np.asarray(mask) > 127)
    if d:
        svg.append(f'<path d="{d}" fill="{color}" fill-rule="evenodd"/>')
svg.append('</svg>')
target = ROOT / "dist" / "terrain.svg"
target.write_text("\n".join(svg), encoding="utf-8")
assert '<image' not in target.read_text(encoding="utf-8")
print(f"Vector basemap: {target.stat().st_size:,} bytes; {len(svg)-6} terrain layers")

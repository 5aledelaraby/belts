"""Builds the Vicuna seal logo as pure vector SVG (text converted to outlines).

Run: python3 brand/make_logo.py  →  writes brand/*.svg
"""
import math, pathlib
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

HERE = pathlib.Path(__file__).parent
FONT = TTFont(pathlib.Path.home() / ".fonts/Marcellus-Regular.ttf")
GS, CMAP, UPM = FONT.getGlyphSet(), FONT.getBestCmap(), FONT["head"].unitsPerEm

PLUM, BERRY, BLUSH, GOLD, PETAL = "#3A1F26", "#B5476A", "#FFF5F3", "#C9A46A", "#F9D6DC"

def glyph(ch):
    return CMAP[ord(ch)]

def advance(ch, size):
    return GS[glyph(ch)].width * size / UPM

def glyph_path(ch, size, transform):
    """SVG path data for one glyph scaled to `size`, y flipped, then `transform` (a,b,c,d,e,f)."""
    pen = SVGPathPen(GS)
    s = size / UPM
    a, b, c, d, e, f = transform
    # font units → (scale, flip y) → user transform
    m = (a * s, b * s, -c * s, -d * s, e, f)
    GS[glyph(ch)].draw(TransformPen(pen, m))
    return pen.getCommands()

def text_line(text, size, x, y, tracking=0.0, anchor="middle"):
    total = sum(advance(c, size) for c in text) + tracking * (len(text) - 1)
    cx = x - total / 2 if anchor == "middle" else x
    out = []
    for ch in text:
        if ch != " ":
            out.append(glyph_path(ch, size, (1, 0, 0, 1, cx, y)))
        cx += advance(ch, size) + tracking
    return " ".join(out), total

def ring_text(text, size, r, cx=100, cy=100):
    """Glyphs placed clockwise around a circle, baseline on radius r, starting at the top."""
    adv = [advance(c, size) for c in text]
    circ = 2 * math.pi * r
    gap = (circ - sum(adv)) / len(text)      # spread to close the ring evenly
    first = text.split(" ")[0]                # centre the first word (the name) at the top
    offset = (sum(adv[:len(first)]) + gap * (len(first) - 1)) / 2
    out, pos = [], 0.0
    for ch, w in zip(text, adv):
        mid = pos + w / 2 - offset
        ang = mid / r - math.pi / 2           # radians, 0 = top
        if ch != " ":
            ca, sa = math.cos(ang + math.pi / 2), math.sin(ang + math.pi / 2)
            px, py = cx + r * math.cos(ang), cy + r * math.sin(ang)
            # rotate glyph so its baseline is tangent; shift by -w/2 along tangent
            ox, oy = px - ca * w / 2, py - sa * w / 2
            out.append(glyph_path(ch, size, (ca, sa, -sa, ca, ox, oy)))
        pos += w + gap
    return " ".join(out)

def bow(color, sw=3.2):
    return (f'<path fill="none" stroke="{color}" stroke-width="{sw}" stroke-linejoin="round" '
            'd="M50 50C38 30 16 24 14 38C12 52 34 56 50 50ZM50 50C62 30 84 24 86 38C88 52 66 56 50 50Z"/>'
            f'<rect x="44" y="44" width="12" height="12" rx="3.5" fill="{color}"/>'
            f'<path d="M47 56C42 66 36 74 30 82M53 56C58 66 64 74 70 82" fill="none" stroke="{color}" stroke-width="{sw}" stroke-linecap="round"/>')

RING = "VICUNA · BELTS · CAIRO · EST. 2022 · "

def seal(ring_c, bow_c, bg=None):
    bgr = f'<rect width="200" height="200" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">{bgr}'
            f'<circle cx="100" cy="100" r="94" fill="none" stroke="{ring_c}" stroke-width="2"/>'
            f'<circle cx="100" cy="100" r="62" fill="none" stroke="{ring_c}" stroke-width="1"/>'
            f'<path fill="{ring_c}" d="{ring_text(RING, 16.5, 72.5)}"/>'
            f'<g transform="translate(60 56) scale(.8)">{bow(bow_c)}</g></svg>')

def mark(ring_c, bow_c, bg=None, rounded=False):
    bgr = (f'<rect width="200" height="200" rx="{44 if rounded else 0}" fill="{bg}"/>' if bg else "")
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">{bgr}'
            f'<circle cx="100" cy="100" r="86" fill="none" stroke="{ring_c}" stroke-width="5"/>'
            f'<g transform="translate(34 30) scale(1.32)">{bow(bow_c, 3.6)}</g></svg>')

def lockup(ink, accent, sub, bg=None):
    word, w = text_line("VICUNA", 56, 0, 0, tracking=12, anchor="start")
    tag, tw = text_line("BELTS · CAIRO", 14, 0, 0, tracking=7, anchor="start")
    width = 120 + 22 + w + 26
    bgr = f'<rect width="{width:.0f}" height="140" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width:.0f} 140">{bgr}'
            f'<g transform="translate(4 14) scale(1.12)">{bow(accent, 3.4)}</g>'
            f'<path fill="{ink}" transform="translate(142 84)" d="{word}"/>'
            f'<path fill="{sub}" transform="translate({142 + (w - tw) / 2:.1f} 116)" d="{tag}"/></svg>')

files = {
    "vicuna-seal.svg": seal(PLUM, BERRY),
    "vicuna-seal-dark.svg": seal(GOLD, GOLD, PLUM),
    "vicuna-seal-blush.svg": seal(PLUM, BERRY, BLUSH),
    "vicuna-mark.svg": mark(PLUM, BERRY),
    "vicuna-mark-favicon.svg": mark(PLUM, BERRY, BLUSH, rounded=True),
    "vicuna-lockup.svg": lockup(PLUM, BERRY, BERRY),
    "vicuna-lockup-dark.svg": lockup(BLUSH, PETAL, GOLD, PLUM),
}
for name, svg in files.items():
    (HERE / name).write_text(svg)
print("wrote", ", ".join(files))

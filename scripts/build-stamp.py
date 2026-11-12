#!/usr/bin/env python3
"""Složí vektorové razítko Ecomo z údajů v src/site.config.ts a wordmarku.

Výstup je public/brand/ecomo-razitko.svg (obrysy písma, průhledné pozadí).
Po změně sídla, IČO nebo zápisu v rejstříku spusť znovu z kořene repa.
"""

from __future__ import annotations

import re
import subprocess
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "src" / "site.config.ts"
WORDMARK = Path(__file__).with_name("wordmark.path")
BOLD = ROOT / "src" / "fonts" / "Sansation-Bold.woff2"
LIGHT = ROOT / "src" / "fonts" / "Sansation-Light.woff2"
OUT = ROOT / "public" / "brand" / "ecomo-razitko.svg"

INK = "#111111"
BRAND = "#D8E716"
UPEM = 2048
WIDTH = 72.0
WORDMARK_H = 5.7


def field(name: str, text: str) -> str:
    match = re.search(rf'{name}: "([^"]+)"', text)
    if not match:
        raise SystemExit(f"V site.config.ts chybí {name}")
    return match.group(1)


def load_facts() -> dict[str, str]:
    text = CONFIG.read_text(encoding="utf-8")
    return {
        "legal": field("legalName", text),
        "line1": field("line1", text),
        "line2": field("line2", text),
        "zip": field("zip", text),
        "city": field("city", text),
        "ico": field("ico", text),
        "dic": field("dic", text),
        "court": field("court", text),
        "section": field("section", text),
        "insert": field("insert", text),
    }


class Face:
    def __init__(self, path: Path) -> None:
        self.font = TTFont(path)
        self.glyphs = self.font.getGlyphSet()
        self.cmap = self.font.getBestCmap()

    def width(self, text: str, size: float, tracking: float) -> float:
        scale = size / UPEM
        extra = tracking * size
        total = 0.0
        for index, char in enumerate(text):
            total += self.glyphs[self.cmap[ord(char)]].width * scale
            if index < len(text) - 1:
                total += extra
        return total

    def draw(self, text: str, size: float, x: float, baseline: float, tracking: float) -> str:
        scale = size / UPEM
        extra = tracking * size
        parts: list[str] = []
        cursor = x
        for index, char in enumerate(text):
            glyph = self.glyphs[self.cmap[ord(char)]]
            pen = SVGPathPen(self.glyphs)
            glyph.draw(pen)
            commands = pen.getCommands()
            if commands:
                parts.append(
                    f'<g transform="translate({cursor:.3f} {baseline:.3f}) scale({scale:.6f} {-scale:.6f})">'
                    f'<path d="{commands}"/></g>'
                )
            cursor += glyph.width * scale
            if index < len(text) - 1:
                cursor += extra
        return "\n".join(parts)


def centered(face: Face, text: str, size: float, baseline: float, tracking: float) -> str:
    x = (WIDTH - face.width(text, size, tracking)) / 2
    return face.draw(text, size, x, baseline, tracking)


def run(face: Face, text: str, size: float, x: float, baseline: float, tracking: float) -> tuple[str, float]:
    drawn = face.draw(text, size, x, baseline, tracking)
    return drawn, x + face.width(text, size, tracking)


def build() -> str:
    facts = load_facts()
    bold = Face(BOLD)
    light = Face(LIGHT)
    wordmark = WORDMARK.read_text(encoding="utf-8").strip()

    address_size = 2.55
    address_track = 0.012
    id_size = 2.45
    id_track = 0.02
    eye_size = 1.72
    eye_track = 0.2
    court_size = 2.22
    court_track = 0.008
    form_size = 4.85
    form_track = 0.02

    address_1 = f"{facts['line1']}, {facts['line2']}"
    address_2 = f"{facts['zip']} {facts['city']}"
    eye = "OBCHODNÍ REJSTŘÍK"
    court = f"{facts['court']}, oddíl {facts['section']}, vložka {facts['insert']}"
    form = "s.r.o."

    wordmark_w = WORDMARK_H * 947 / 163
    form_w = bold.width(form, form_size, form_track)
    lockup_w = wordmark_w + 1.85 + form_w
    lockup_x = (WIDTH - lockup_w) / 2
    wordmark_y = 3.15
    wordmark_scale = WORDMARK_H / 163
    form_baseline = wordmark_y + WORDMARK_H - 0.08

    address_1_y = 12.15
    address_2_y = 15.05
    id_y = 18.05
    eye_y = 21.15
    court_y = 23.85
    height = 27.4

    ico_label, ico_num = "IČO ", facts["ico"]
    dic_label, dic_num = "DIČ ", facts["dic"]
    dot = "  ·  "
    id_w = (
        bold.width(ico_label, id_size, id_track)
        + light.width(ico_num, id_size, id_track)
        + bold.width(dot, id_size, 0)
        + bold.width(dic_label, id_size, id_track)
        + light.width(dic_num, id_size, id_track)
    )
    id_x = (WIDTH - id_w) / 2
    id_parts: list[str] = []
    for face, text, tracking in (
        (bold, ico_label, id_track),
        (light, ico_num, id_track),
        (bold, dot, 0),
        (bold, dic_label, id_track),
        (light, dic_num, id_track),
    ):
        drawn, id_x = run(face, text, id_size, id_x, id_y, tracking)
        id_parts.append(drawn)

    desc = (
        f"{facts['legal']}, {address_1}, {address_2}. "
        f"IČO {facts['ico']}. DIČ {facts['dic']}. {court}."
    )

    inner_x = 1.9
    inner_y = 1.9
    inner_w = WIDTH - 3.8
    inner_h = height - 3.8

    def num(value: float) -> str:
        return f"{value:.2f}".rstrip("0").rstrip(".")

    return f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{num(WIDTH)}mm" height="{num(height)}mm" viewBox="0 0 {num(WIDTH)} {num(height)}" role="img" aria-labelledby="razitko-title razitko-desc">
  <title id="razitko-title">Razítko {facts['legal']}</title>
  <desc id="razitko-desc">{desc}</desc>
  <g fill="none">
    <rect x="0.7" y="0.7" width="{WIDTH - 1.4:.2f}" height="{height - 1.4:.2f}" stroke="{INK}" stroke-width="0.62"/>
    <rect x="{inner_x}" y="{inner_y}" width="{inner_w:.2f}" height="{inner_h:.2f}" stroke="{BRAND}" stroke-width="0.34"/>
  </g>
  <g fill="{INK}" fill-rule="evenodd" transform="translate({lockup_x:.3f} {wordmark_y:.3f}) scale({wordmark_scale:.6f})">
    <g transform="translate(0 163) scale(0.1 -0.1)">
      <path d="{wordmark}"/>
    </g>
  </g>
  <g fill="{INK}">
    {bold.draw(form, form_size, lockup_x + wordmark_w + 1.85, form_baseline, form_track)}
    {centered(light, address_1, address_size, address_1_y, address_track)}
    {centered(light, address_2, address_size, address_2_y, address_track)}
    {''.join(id_parts)}
    {centered(bold, eye, eye_size, eye_y, eye_track)}
    {centered(light, court, court_size, court_y, court_track)}
  </g>
</svg>
"""


def main() -> None:
    svg = build()
    OUT.write_text(svg, encoding="utf-8")
    png = OUT.with_suffix(".png")
    subprocess.run(
        ["rsvg-convert", "-d", "600", "-p", "600", "-f", "png", "-o", str(png), str(OUT)],
        check=True,
    )
    print(f"wrote {OUT.relative_to(ROOT)} ({len(svg)} bytes)")
    print(f"wrote {png.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

"""Render public/og-card.png (1200x630) and PNG icons. Run from repo root: python3 scripts/og/render.py (Playwright)."""
import pathlib
from playwright.sync_api import sync_playwright
R = pathlib.Path(__file__).resolve().parents[2]
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
    pg = b.new_page(viewport={'width': 1200, 'height': 630})
    pg.goto((R / 'scripts/og/og-card.html').as_uri()); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(300)
    pg.screenshot(path=str(R / 'public/og-card.png'))
    svg = (R / 'public/favicon.svg').read_text()
    for size, name in [(180, 'apple-touch-icon.png'), (512, 'icon-512.png')]:
        pg = b.new_page(viewport={'width': size, 'height': size})
        pg.set_content(f'<style>*{{margin:0}}svg{{width:{size}px;height:{size}px;display:block}}</style>{svg}')
        pg.screenshot(path=str(R / 'public' / name))
    b.close()

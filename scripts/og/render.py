"""Render public/og-card-blueprint.png (1200x630) , PNG icons and favicon.ico; also copies the card to og-card.png (legacy URL kept for cached shares). Run from repo root: python3 scripts/og/render.py (Playwright)."""
import pathlib
from playwright.sync_api import sync_playwright
R = pathlib.Path(__file__).resolve().parents[2]
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
    pg = b.new_page(viewport={'width': 1200, 'height': 630})
    pg.goto((R / 'scripts/og/og-card-blueprint.html').as_uri()); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(300)
    pg.screenshot(path=str(R / 'public/og-card-blueprint.png'))
    (R / 'public/og-card.png').write_bytes((R / 'public/og-card-blueprint.png').read_bytes())
    svg = (R / 'public/favicon.svg').read_text()
    def png(size):
        pg = b.new_page(viewport={'width': size, 'height': size})
        pg.set_content(f'<style>*{{margin:0}}svg{{width:{size}px;height:{size}px;display:block}}</style>{svg}')
        return pg.screenshot()
    for size, name in [(180, 'apple-touch-icon.png'), (512, 'icon-512.png')]:
        (R / 'public' / name).write_bytes(png(size))
    # favicon.ico: 16/32/48 PNG-compressed entries (valid ICO since Vista; all modern browsers)
    import struct
    imgs = [(s, png(s)) for s in (16, 32, 48)]
    head = struct.pack('<HHH', 0, 1, len(imgs)); off = 6 + 16 * len(imgs); dirs = b''
    for s, d in imgs:
        dirs += struct.pack('<BBBBHHII', s, s, 0, 0, 1, 32, len(d), off); off += len(d)
    (R / 'public/favicon.ico').write_bytes(head + dirs + b''.join(d for _, d in imgs))
    b.close()

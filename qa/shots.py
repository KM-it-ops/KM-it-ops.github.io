"""Screenshots for concept-3-rich. Needs npm run preview (port 4181)."""
import pathlib
from playwright.sync_api import sync_playwright
import os
OUT = pathlib.Path(os.environ.get('QA_SHOTS', '/workspace/portfolio-blueprint-shots')); OUT.mkdir(parents=True, exist_ok=True)
URL = os.environ.get('QA_URL', 'http://127.0.0.1:4181/')
CH = dict(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])

def prep(pg, full=True):
    pg.goto(URL); pg.wait_for_timeout(700)
    if full:
        H = pg.evaluate('document.body.scrollHeight')
        for y in range(0, H + 400, 350): pg.evaluate(f"scrollTo({{top:{y},behavior:'instant'}})"); pg.wait_for_timeout(40)
        pg.wait_for_timeout(800); pg.evaluate("scrollTo({top:0,behavior:'instant'})"); pg.wait_for_timeout(200)

def goto_el(pg, sel, off=64):
    pg.evaluate(f"(()=>{{const e=document.querySelector('{sel}');scrollTo({{top:e.getBoundingClientRect().top+scrollY-{off},behavior:'instant'}})}})()"); pg.wait_for_timeout(350)

with sync_playwright() as p:
    b = p.chromium.launch(**CH)
    def page(w, h, theme, prm='no-preference', touch=False, js=True):
        ctx = b.new_context(viewport={'width': w, 'height': h}, color_scheme=theme, reduced_motion=prm, has_touch=touch, java_script_enabled=js)
        return ctx, ctx.new_page()
    for theme in ['dark', 'light']:
        # desktop
        ctx, pg = page(1280, 800, theme); prep(pg)
        pg.screenshot(path=str(OUT / f'{theme}-fold-desktop.png'))
        pg.screenshot(path=str(OUT / f'{theme}-full-desktop.png'), full_page=True)
        goto_el(pg, '.titleblock', 90); pg.screenshot(path=str(OUT / f'{theme}-titleblock-desktop.png'))
        goto_el(pg, '#sheet-03', 60); pg.locator('#p-attcklens summary').click(); pg.wait_for_timeout(500)
        goto_el(pg, '#sheet-03 .asm', 70); pg.screenshot(path=str(OUT / f'{theme}-exploded-expanded-desktop.png'))
        goto_el(pg, '#sheet-04', 60); pg.screenshot(path=str(OUT / f'{theme}-details-desktop.png'))
        goto_el(pg, '#sheet-05', 60); pg.screenshot(path=str(OUT / f'{theme}-path-desktop.png'))
        ctx.close()
        ctx, pg = page(1280, 1000, theme); prep(pg)
        goto_el(pg, '#schem', 80); pg.locator('#b-s-py').click(); pg.wait_for_timeout(400)
        pg.screenshot(path=str(OUT / f'{theme}-diagram-selected-desktop.png'))
        pg.locator('#b-l-vm').click(); pg.wait_for_timeout(400)
        pg.screenshot(path=str(OUT / f'{theme}-diagram-lane-selected-desktop.png'))
        ctx.close()
        # phone
        ctx, pg = page(390, 844, theme, touch=True); prep(pg)
        pg.screenshot(path=str(OUT / f'{theme}-fold-phone.png'))
        pg.screenshot(path=str(OUT / f'{theme}-full-phone.png'), full_page=True)
        goto_el(pg, '.titleblock', 70); pg.screenshot(path=str(OUT / f'{theme}-titleblock-phone.png'))
        goto_el(pg, '#col-skill', 70); pg.locator('#b-s-py').tap(); pg.wait_for_timeout(500)
        goto_el(pg, '#b-s-py', 300); pg.screenshot(path=str(OUT / f'{theme}-diagram-selected-phone.png'))
        goto_el(pg, '#sheet-03 .asm', 64); pg.locator('.pw .pl').nth(4).tap(); pg.wait_for_timeout(600)
        goto_el(pg, '#sheet-03 .asm', 64); pg.screenshot(path=str(OUT / f'{theme}-exploded-phone.png'))
        goto_el(pg, '#p-attcklens', 70); pg.screenshot(path=str(OUT / f'{theme}-exploded-expanded-phone.png'))
        ctx.close()
    # reduced motion: no scroll-through; everything must already be drawn
    for theme in ['dark', 'light']:
        ctx, pg = page(1280, 800, theme, 'reduce'); pg.goto(URL); pg.wait_for_timeout(150)
        pg.screenshot(path=str(OUT / f'reduced-motion-{theme}-full-desktop.png'), full_page=True)
        goto_el(pg, '#sheet-02', 60); pg.screenshot(path=str(OUT / f'reduced-motion-{theme}-schematic-desktop.png')); ctx.close()
    ctx, pg = page(390, 844, 'dark', 'reduce', True); pg.goto(URL); pg.wait_for_timeout(150)
    pg.screenshot(path=str(OUT / 'reduced-motion-dark-fold-phone.png')); ctx.close()
    # 360 overflow proof (QA overlay added only for the screenshot)
    for theme in ['dark', 'light']:
        ctx, pg = page(360, 740, theme, touch=True); prep(pg)
        sw = pg.evaluate("document.documentElement.scrollWidth")
        pg.evaluate(f"""(()=>{{const d=document.createElement('div');d.textContent='QA overlay · viewport 360px · scrollWidth {sw}px · overflow '+({sw}-360)+'px';
          d.style.cssText='position:fixed;left:0;right:0;bottom:0;z-index:99;background:#000;color:#fff;font:600 14px monospace;padding:8px;text-align:center';document.body.append(d)}})()""")
        pg.screenshot(path=str(OUT / f'{theme}-360-overflow-proof-fold.png'))
        pg.screenshot(path=str(OUT / f'{theme}-360-overflow-proof-full.png'), full_page=True)
        ctx.close()
    # no-JS
    for (w, h, n) in [(1280, 800, 'desktop'), (390, 844, 'phone')]:
        ctx, pg = page(w, h, 'dark', js=False); pg.goto(URL); pg.wait_for_timeout(300)
        pg.screenshot(path=str(OUT / f'nojs-dark-fold-{n}.png'))
        goto_el(pg, '#sheet-02', 10); pg.screenshot(path=str(OUT / f'nojs-dark-schematic-{n}.png'))
        goto_el(pg, '#sheet-03', 10); pg.screenshot(path=str(OUT / f'nojs-dark-assembly-{n}.png'))
        ctx.close()
    b.close()
print('done')

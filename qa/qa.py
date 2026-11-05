"""QA gate for the Blueprint Schematic build. Run: npm run build && npm run preview, then
   QA_URL=http://127.0.0.1:4181/ python3 qa/qa.py   (Playwright + Chrome).
Matrix: 5 viewports x 2 themes x reduced-motion on/off, plus interaction, no-JS, theme persistence, live PRM change, tab order, axe-core."""
import json, os, pathlib, sys, time
from playwright.sync_api import sync_playwright
HERE = pathlib.Path(__file__).parent
URL = os.environ.get('QA_URL', 'http://127.0.0.1:4181/')
SHOTS = pathlib.Path(os.environ.get('QA_SHOTS', '/workspace/portfolio-blueprint-shots')); SHOTS.mkdir(parents=True, exist_ok=True)
VIEWS = {'360': (360, 740), '390': (390, 844), '768': (768, 1024), '1280': (1280, 800), '1920': (1920, 1080)}
CHROME = dict(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
AXE = (HERE / 'axe.min.js').read_text()

METRICS = r"""() => {
 const parse=c=>{const srgb=c.startsWith('color(srgb');const m=(c.replace('color(srgb','').match(/[\d.]+/g)||[0,0,0]).map(Number);const k=srgb?255:1;return {r:m[0]*k,g:m[1]*k,b:m[2]*k,a:m.length>3?m[3]:1}};
 const hex=h=>{h=h.trim().replace('#','');return {r:parseInt(h.slice(0,2),16),g:parseInt(h.slice(2,4),16),b:parseInt(h.slice(4,6),16),a:1}};
 const L=({r,g,b})=>{const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)};return .2126*f(r)+.7152*f(g)+.0722*f(b)};
 const CR=(a,b)=>{const x=L(a),y=L(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
 const worst=hex(getComputedStyle(document.documentElement).getPropertyValue('--grid-worst'));
 const bgOf=e=>{let stack=[],grid=false;for(let n=e;n;n=n.parentElement){const s=getComputedStyle(n);const c=parse(s.backgroundColor);if(s.backgroundImage.includes('gradient')&&c.a>=1)grid=true;if(c.a>0){stack.push(c);if(c.a>=1)break;}}
   let base={r:255,g:255,b:255};for(let i=stack.length-1;i>=0;i--){const c=stack[i];base={r:c.r*c.a+base.r*(1-c.a),g:c.g*c.a+base.g*(1-c.a),b:c.b*c.a+base.b*(1-c.a)}}return {base,grid}};
 const opac=e=>{let o=1;for(let n=e;n;n=n.parentElement)o*=+getComputedStyle(n).opacity;return o};
 const vis=e=>{const r=e.getBoundingClientRect();const s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'};
 const out={overflow:document.documentElement.scrollWidth-window.innerWidth,minBody:99,minUI:99,minLabel:99,sizeFails:[],displayAsBody:[],lowContrast:[],minContrast:99,minContrastGrid:99,dimmedText:[],smallTargets:[]};
 for(const e of document.querySelectorAll('body *')){
   if(!vis(e))continue;
   const own=[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim().length>0); if(!own)continue;
   const s=getComputedStyle(e), fs=parseFloat(s.fontSize), tag=e.tagName.toLowerCase(), fam=s.fontFamily, txt=e.textContent.trim().slice(0,28);
   const mono=/Roboto Mono/.test(fam), ui=!!e.closest('a,button,summary,label');
   if(mono){out.minLabel=Math.min(out.minLabel,fs);if(fs<13)out.sizeFails.push('label '+fs+' '+txt)}
   else if(ui){out.minUI=Math.min(out.minUI,fs);if(fs<15)out.sizeFails.push('ui '+fs+' '+txt)}
   else if(!/^h[1-6]$/.test(tag)){out.minBody=Math.min(out.minBody,fs);if(fs<16)out.sizeFails.push('body '+fs+' '+tag+' '+txt)}
   if(['p','li','dd','td'].includes(tag)&&/Unbounded/.test(fam.split(',')[0]))out.displayAsBody.push(txt);
   const o=opac(e); if(o<0.999)out.dimmedText.push(o.toFixed(2)+' '+txt);
   const fg=parse(s.color),{base,grid}=bgOf(e); const fgc={r:fg.r*fg.a+base.r*(1-fg.a),g:fg.g*fg.a+base.g*(1-fg.a),b:fg.b*fg.a+base.b*(1-fg.a)};
   let cr=CR(fgc,base); out.minContrast=Math.min(out.minContrast,+cr.toFixed(2));
   if(grid){const cg=CR(fgc,worst);out.minContrastGrid=Math.min(out.minContrastGrid,+cg.toFixed(2));cr=Math.min(cr,cg)}
   if(cr<4.5) out.lowContrast.push(cr.toFixed(2)+' '+tag+' '+txt);
 }
 for(const e of document.querySelectorAll('a,button,summary,input')){
   if(!vis(e))continue; const r=e.getBoundingClientRect();
   const inline=e.tagName==='A'&&e.closest('p,li,td,dd')&&!e.classList.contains('btn')&&!e.classList.contains('plink')&&!e.classList.contains('open');
   if(inline)continue;
   if(r.height<44-0.5||r.width<44-0.5)out.smallTargets.push(e.tagName+' '+Math.round(r.width)+'x'+Math.round(r.height)+' '+(e.textContent||e.id).trim().slice(0,24));
 }
 const h=document.querySelector('h1'); out.h1=h.textContent.replace(/\s+/g,' ').trim();
 out.role=document.querySelector('.role').textContent.trim();
 const need=[new URL('resume.html',location.href).href,'https://km-it-ops.github.io/#contact','https://github.com/KM-it-ops','https://www.linkedin.com/in/mahmoud-michael-al-kurdi','https://github.com/KM-it-ops/security-log-anomaly-detection','https://km-it-ops.github.io/#labs','https://ofg-sites.vercel.app/','https://github.com/KM-it-ops/AgentForge'];
 const hrefs=[...document.querySelectorAll('a')].map(a=>a.href); out.missingLinks=need.filter(u=>!hrefs.includes(u));
 out.parts=document.querySelectorAll('#parts .part').length;
 out.agentforgeArchived=/Archived/.test(document.querySelector('#p-agentforge').textContent);
 out.rvHidden=[...document.querySelectorAll('.rv')].filter(e=>+getComputedStyle(e).opacity<0.99).length;
 out.renderedFamilies=[...new Set([...document.querySelectorAll('h1,h2,p,.lbl')].map(e=>getComputedStyle(e).fontFamily.split(',')[0].replace(/"/g,'')))];
 out.fontsReady=[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family.replace(/"/g,''));
 return out}"""

FOLD = r"""() => {const vh=innerHeight;const ok=e=>{if(!e)return false;const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=vh&&+getComputedStyle(e).opacity>0.5};
 return {h1:ok(document.querySelector('h1')),role:ok(document.querySelector('.role')),resume:ok(document.querySelector('.ident .btn-pri')),proof:ok(document.querySelector('.ident .proof'))}}"""

def scroll_through(pg):
    H = pg.evaluate('document.body.scrollHeight')
    for y in range(0, H + 400, 350):
        pg.evaluate(f'scrollTo(0,{y})'); pg.wait_for_timeout(40)
    pg.wait_for_timeout(750); pg.evaluate('scrollTo(0,0)'); pg.wait_for_timeout(200)

def main():
    res = {'matrix': {}, 'interaction': {}, 'nojs': {}, 'axe': {}, 'misc': {}}
    with sync_playwright() as p:
        b = p.chromium.launch(**CHROME)
        for vk, (w, h) in VIEWS.items():
            for theme in ['dark', 'light']:
                for prm in ['no-preference', 'reduce']:
                    ctx = b.new_context(viewport={'width': w, 'height': h}, color_scheme=theme, reduced_motion=prm, has_touch=w < 800)
                    pg = ctx.new_page(); ext = []; errs = []
                    pg.on('request', lambda r: ext.append(r.url) if not r.url.startswith(URL) else None)
                    pg.on('pageerror', lambda e: errs.append(str(e)))
                    pg.goto(URL); pg.wait_for_timeout(250 if prm == 'reduce' else 800)
                    r = {'fold': pg.evaluate(FOLD), 'theme': pg.evaluate("document.documentElement.dataset.theme")}
                    if prm == 'reduce':
                        r['rvHiddenAtLoad'] = pg.evaluate("[...document.querySelectorAll('.rv')].filter(e=>+getComputedStyle(e).opacity<0.99).length")
                        r['sheetsInAtLoad'] = pg.evaluate("document.querySelectorAll('.sheet.in').length")
                        pg.evaluate('scrollTo(0,2000)'); pg.wait_for_timeout(50)
                        r['animatingDuringScroll'] = pg.evaluate("document.getAnimations().length")
                        r['parallaxTransform'] = pg.evaluate("document.querySelector('.deep').style.transform")
                        pg.evaluate('scrollTo(0,0)')
                    else:
                        r['sheetsInBeforeScroll'] = pg.evaluate("document.querySelectorAll('.sheet.in').length")
                    scroll_through(pg)
                    r['sheetsInAfterScroll'] = pg.evaluate("document.querySelectorAll('.sheet.in').length")
                    r.update(pg.evaluate(METRICS))
                    r['externalRequests'] = ext; r['errors'] = errs
                    res['matrix'][f'{vk}-{theme}-{prm}'] = r
                    ctx.close()
        # ---------- interactions ----------
        for vk in ['1280', '390']:
            w, h = VIEWS[vk]
            for prm in ['no-preference', 'reduce']:
                ctx = b.new_context(viewport={'width': w, 'height': h}, color_scheme='dark', reduced_motion=prm, has_touch=(vk == '390'))
                pg = ctx.new_page(); pg.goto(URL); pg.wait_for_timeout(500)
                t = {}
                pg.locator('#b-s-py').focus(); pg.keyboard.press('Enter')
                t['enterPins'] = pg.get_attribute('#b-s-py', 'aria-pressed') == 'true'
                t['panelTitle'] = pg.inner_text('#panel-title')
                t['litNodes'] = pg.evaluate("[...document.querySelectorAll('.node.lit')].map(b=>b.querySelector('.nn').textContent)")
                t['wiresOn'] = pg.evaluate("document.querySelectorAll('.wire.on').length")
                t['panelLinks'] = pg.evaluate("[...document.querySelectorAll('#panel-body a')].map(a=>a.href)")
                pg.wait_for_timeout(700)
                t['panelVisibleInViewport'] = pg.evaluate("(()=>{const r=document.querySelector('#schem-panel').getBoundingClientRect();return r.top<innerHeight&&r.bottom>0})()")
                pg.keyboard.press('Escape')
                t['escClears'] = pg.get_attribute('#b-s-py', 'aria-pressed') == 'false' and pg.evaluate("document.querySelectorAll('.wire.on').length") == 0
                pg.locator('#b-s-net').focus(); pg.keyboard.press('ArrowDown'); t['arrowDown'] = pg.evaluate("document.activeElement.id")
                pg.locator('#b-s-py').focus(); pg.keyboard.press('ArrowRight'); t['arrowRight'] = pg.evaluate("document.activeElement.id")
                pg.keyboard.press('ArrowRight'); t['arrowRight2'] = pg.evaluate("document.activeElement.id")
                # tap / click
                if vk == '390': pg.locator('#b-l-vm').tap()
                else: pg.locator('#b-l-vm').click()
                t['tapLanePins'] = pg.get_attribute('#b-l-vm', 'aria-pressed') == 'true'
                t['laneLit'] = pg.evaluate("[...document.querySelectorAll('.node.lit')].map(b=>b.querySelector('.nn').textContent)")
                pg.locator('#panel-body [data-go]').first.click()
                t['chipNavigates'] = pg.inner_text('#panel-title')
                pg.click('#schem-clear'); t['clearBtn'] = pg.evaluate("document.querySelectorAll('[aria-pressed=true].node').length") == 0
                # exploded
                pg.locator('#p-logdetect summary').focus(); pg.keyboard.press('ArrowDown')
                t['partsArrow'] = pg.evaluate("document.activeElement.closest('details').id")
                pg.keyboard.press('Enter'); pg.wait_for_timeout(50)
                t['partsEnterOpens'] = pg.evaluate("document.querySelector('#p-phishing').open")
                t['plateMarked'] = pg.evaluate("[...document.querySelectorAll('.pw')].findIndex(w=>w.classList.contains('on'))")
                pl = pg.locator('.pw .pl').nth(3)
                if vk == '390': pl.tap()
                else: pl.click()
                pg.wait_for_timeout(100)
                t['plateClickOpens'] = pg.evaluate("document.querySelector('#p-sniffoutpro').open")
                pg.fill('#explode', '100'); t['rangeEx'] = pg.evaluate("document.querySelector('#asm-stage').style.getPropertyValue('--ex')")
                if vk == '1280':
                    pg.fill('#explode', '20'); pg.evaluate("document.querySelector('#asm-stage').scrollIntoView({block:'center',behavior:'instant'})"); pg.wait_for_timeout(300); bb = pg.locator('#asm-stage').bounding_box()
                    pg.mouse.move(bb['x'] + 60, bb['y'] + 40); pg.mouse.down(); pg.mouse.move(bb['x'] + 60, bb['y'] + 200, steps=8); pg.mouse.up()
                    t['dragChangesRange'] = pg.evaluate("+document.querySelector('#explode').value")
                pg.click('#parts-all'); t['openAll'] = pg.evaluate("[...document.querySelectorAll('#parts details')].every(d=>d.open)")
                # theme toggle + persistence
                pg.click('#paper'); t['toggleLight'] = pg.evaluate("[document.documentElement.dataset.theme, document.querySelector('#paper').getAttribute('aria-pressed'), localStorage.getItem('kmBlueprintPaper')]")
                pg.reload(); pg.wait_for_timeout(300); t['persistAfterReload'] = pg.evaluate("document.documentElement.dataset.theme")
                pg.evaluate("localStorage.clear()")
                res['interaction'][f'{vk}-{prm}'] = t; ctx.close()
        # live PRM change
        ctx = b.new_context(viewport={'width': 1280, 'height': 800}, reduced_motion='no-preference'); pg = ctx.new_page(); pg.goto(URL); pg.wait_for_timeout(400)
        before = pg.evaluate("[document.documentElement.classList.contains('motion-ok'), document.querySelectorAll('.sheet.in').length]")
        pg.emulate_media(reduced_motion='reduce'); pg.wait_for_timeout(100)
        after = pg.evaluate("[document.documentElement.classList.contains('motion-ok'), document.querySelectorAll('.sheet.in').length]")
        res['misc']['livePRMChange'] = {'before[motionOk,sheetsIn]': before, 'after': after}
        # focus ring
        pg.keyboard.press('Tab'); pg.keyboard.press('Tab')
        res['misc']['focusRing'] = pg.evaluate("(()=>{const s=getComputedStyle(document.activeElement);return [document.activeElement.className, s.outlineStyle, s.outlineWidth, s.outlineColor]})()")
        # tab order
        pg.goto(URL); pg.wait_for_timeout(300); seq = []
        for i in range(40):
            pg.keyboard.press('Tab')
            seq.append(pg.evaluate("(()=>{const a=document.activeElement;return a.tagName+(a.id?'#'+a.id:'')+' '+(a.textContent||'').trim().replace(/\\s+/g,' ').slice(0,30)})()"))
        res['misc']['tabOrderFirst40'] = seq
        # print emulation
        pg.emulate_media(media='print'); pg.wait_for_timeout(100)
        res['misc']['printHidesChrome'] = pg.evaluate("['.bar','.asm-vis','.panel'].map(s=>getComputedStyle(document.querySelector(s)).display)")
        pg.pdf(path=str(SHOTS / 'plot-print.pdf'), format='Letter', print_background=True)
        ctx.close()
        # ---------- no JS ----------
        for vk in ['360', '1280']:
            for theme in ['dark', 'light']:
                w, h = VIEWS[vk]
                ctx = b.new_context(viewport={'width': w, 'height': h}, color_scheme=theme, java_script_enabled=False)
                pg = ctx.new_page(); pg.goto(URL); pg.wait_for_timeout(300)
                r = pg.evaluate(METRICS)
                r['notesVisible'] = pg.evaluate("[...document.querySelectorAll('.ni .note')].filter(e=>e.offsetHeight>0).length")
                r['toggleHidden'] = pg.evaluate("document.querySelector('#paper').hidden")
                r['bodyBg'] = pg.evaluate("getComputedStyle(document.body).backgroundColor")
                r['fold'] = pg.evaluate(FOLD)
                res['nojs'][f'{vk}-{theme}'] = r; ctx.close()
        # ---------- axe ----------
        for vk in ['1280', '390']:
            for theme in ['dark', 'light']:
                for js in [True, False]:
                    w, h = VIEWS[vk]
                    ctx = b.new_context(viewport={'width': w, 'height': h}, color_scheme=theme, reduced_motion='reduce', java_script_enabled=js)
                    pg = ctx.new_page(); pg.goto(URL); pg.wait_for_timeout(300)
                    if js: pg.click('#b-s-py'); pg.click('#p-logdetect summary')
                    if js:
                        pg.add_script_tag(content=AXE)
                        out = pg.evaluate("async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}});return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length,targets:v.nodes.slice(0,4).map(n=>n.target.join(' '))})),passes:r.passes.length,incomplete:r.incomplete.map(v=>v.id)}}")
                    else:
                        # axe needs JS: run it from a JS-enabled page that loads the no-JS DOM snapshot
                        html = pg.content(); ctx.close()
                        ctx = b.new_context(viewport={'width': w, 'height': h}, color_scheme=theme, reduced_motion='reduce'); pg = ctx.new_page()
                        pg.route('**/assets/index-*.js', lambda r: r.fulfill(body='', content_type='application/javascript'))
                        pg.goto(URL); pg.wait_for_timeout(200)
                        pg.evaluate("document.documentElement.classList.remove('js','motion-ok')")
                        pg.add_script_tag(content=AXE)
                        out = pg.evaluate("async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}});return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length,targets:v.nodes.slice(0,4).map(n=>n.target.join(' '))})),passes:r.passes.length,incomplete:r.incomplete.map(v=>v.id)}}")
                    res['axe'][f'{vk}-{theme}-{"js" if js else "nojs"}'] = out; ctx.close()
        b.close()
    # sizes
    root = HERE.parent / 'docs'
    res['misc']['bytes'] = {f.name: f.stat().st_size for f in [root / 'index.html', *(root / 'assets').glob('index-*')]}
    res['misc']['bytesTotalExFonts'] = sum(res['misc']['bytes'].values())
    res['misc']['fontBytes'] = {f.name: f.stat().st_size for f in (root / 'fonts').glob('*.woff2')}
    (HERE.parent / 'reports' / 'qa-results.json').parent.mkdir(exist_ok=True); (HERE.parent / 'reports' / 'qa-results.json').write_text(json.dumps(res, indent=1))
    # summary
    fails = []
    for k, r in res['matrix'].items():
        if r['overflow'] > 0: fails.append(f'{k} overflow {r["overflow"]}')
        if r['sizeFails']: fails.append(f'{k} size {r["sizeFails"][:3]}')
        if r['lowContrast']: fails.append(f'{k} contrast {r["lowContrast"][:3]}')
        if r['displayAsBody']: fails.append(f'{k} displayAsBody')
        if r['dimmedText']: fails.append(f'{k} dimmed {r["dimmedText"][:3]}')
        if not all(r['fold'].values()): fails.append(f'{k} fold {r["fold"]}')
        if r['missingLinks']: fails.append(f'{k} links {r["missingLinks"]}')
        if r['externalRequests']: fails.append(f'{k} ext {r["externalRequests"][:2]}')
        if r['errors']: fails.append(f'{k} errors {r["errors"]}')
        if r['h1'] != 'Mahmoud Al Kurdi (Michael Kurdi)': fails.append(f'{k} h1 {r["h1"]}')
        if r['role'] != 'Junior Security Analyst / Security Operations / Vulnerability Management': fails.append(f'{k} role {r["role"]}')
        if r['rvHidden']: fails.append(f'{k} rvHidden {r["rvHidden"]}')
        if r['sheetsInAfterScroll'] != 5: fails.append(f'{k} reveal')
        if 'reduce' in k and (r['rvHiddenAtLoad'] or r['animatingDuringScroll'] or r['sheetsInAtLoad'] != 5 or r['parallaxTransform']): fails.append(f'{k} PRM {r["rvHiddenAtLoad"], r["animatingDuringScroll"], r["sheetsInAtLoad"], r["parallaxTransform"]}')
        if r['smallTargets']: fails.append(f'{k} targets {r["smallTargets"][:4]}')
    for k, r in res['nojs'].items():
        if r['overflow'] > 0 or r['lowContrast'] or r['sizeFails'] or r['notesVisible'] < 31 or not all(r['fold'].values()): fails.append(f'nojs {k} {r["overflow"], r["lowContrast"][:2], r["sizeFails"][:2], r["notesVisible"], r["fold"]}')
    for k, a in res['axe'].items():
        for v in a['violations']: fails.append(f'axe {k} {v["id"]} {v["impact"]} {v["targets"][:2]}')
    print(json.dumps(res['interaction'], indent=1)); print(json.dumps(res['misc'], indent=1)[:3000])
    print('FAILS:', len(fails)); [print(' -', f) for f in fails]

if __name__ == '__main__':
    main()

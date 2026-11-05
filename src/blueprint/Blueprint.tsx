import type { ReactNode } from 'react'
import {
  CASE_FILES,
  CONTACT_FORM,
  CREDENTIALS,
  ETHOS,
  EXPERIENCE,
  HIRE_BRIEF,
  OPERATING,
  PERSON,
  RESUME_LABEL,
  RESUME_PDF,
  THROUGHLINE,
} from '../content'
import { EVIDENCE_NODES, FEATURED, LANE_NODES, PARTS, SKILL_NODES, firstSentence, shortId, type Node } from './model'

const SHEETS = [
  ['01', 'Cover'],
  ['02', 'Schematic'],
  ['03', 'Assembly'],
  ['04', 'Details'],
  ['05', 'Path'],
] as const
const TOTAL = '05'
const where = `${PERSON.city}${PERSON.remote ? ' · Remote' : ''}`
const fullName = `${PERSON.name} (${PERSON.short})`
/** Same-page / relative forms of content.ts URLs (data untouched): works on any sub-path preview. */
const MESSAGE_HREF = /#contact$/.test(PERSON.contactUrl) ? '#contact' : PERSON.contactUrl
const RESUME_HREF = RESUME_PDF.startsWith('/') ? `.${RESUME_PDF}` : RESUME_PDF

function Chrome() {
  const six = [1, 2, 3, 4, 5, 6].map((n) => <i key={n}>{n}</i>)
  const abcd = ['A', 'B', 'C', 'D'].map((n) => <i key={n}>{n}</i>)
  return (
    <div className="chrome" aria-hidden="true">
      <span className="zones zt">{six}</span>
      <span className="zones zb">{six}</span>
      <span className="zones zl">{abcd}</span>
      <span className="zones zr">{abcd}</span>
      <span className="reg tl" /><span className="reg tr" /><span className="reg bl" /><span className="reg br" />
      <span className="fl fl-t" /><span className="fl fl-r" /><span className="fl fl-b" /><span className="fl fl-l" />
    </div>
  )
}

function SheetFrame(props: { no: string; name: string; labelledBy: string; children: ReactNode }) {
  return (
    <section className="sheet" tabIndex={-1} id={`sheet-${props.no}`} aria-labelledby={props.labelledBy} data-sheet={props.no}>
      <Chrome />
      <p className="sheet-tag"><span>Sheet {props.no} / {TOTAL}</span><span>{props.name}</span></p>
      {props.children}
    </section>
  )
}

function Cta({ message = true }: { message?: boolean }) {
  return (
    <div className="cta">
      <a className="btn btn-pri" href={RESUME_HREF} download="Mahmoud_Al_Kurdi_Resume.pdf">{RESUME_LABEL}</a>
      {message ? <a className="btn" href={MESSAGE_HREF}>Message</a> : null}
      <a className="btn" href={PERSON.github}>GitHub</a>
      <a className="btn" href={PERSON.linkedin}>LinkedIn</a>
    </div>
  )
}

const nameParts = PERSON.name.split(' ')
function Cover() {
  const aa = EXPERIENCE[0]
  const fossa = EXPERIENCE[EXPERIENCE.length - 1]
  const secDate = CREDENTIALS.secPlusDates.split(' · ')[0].replace(/^Issued /, '')
  return (
    <SheetFrame no="01" name="General arrangement" labelledBy="h-name">
      <div className="cover">
        <div className="ident rv">
          <p className="kicker"><span className="lbl">{PERSON.available}</span><span className="lbl">{where}</span></p>
          <h1 id="h-name">
            <span className="n1">{nameParts[0]} <span className="nw">{nameParts.slice(1).join(' ')}</span></span>{' '}
            <span className="n2">({PERSON.short})</span>
          </h1>
          <div className="dim dim-h" aria-hidden="true"><span className="dim-line" /><span className="dim-lbl">{THROUGHLINE.title}</span></div>
          <p className="role">{PERSON.role}</p>
          <Cta />
          <a className="proof" href={FEATURED.href}>
            <span className="lbl">Start here · public repo</span>
            <span className="proof-name">{FEATURED.name} <span aria-hidden="true">→</span></span>
            <span className="proof-line">{firstSentence(FEATURED.line)}</span>
          </a>
          <p className="seek">{THROUGHLINE.seeking}</p>
        </div>

        <aside className="titleblock rv" aria-labelledby="tb-h">
          <h2 className="tb-h" id="tb-h"><span className="lbl">Title block</span></h2>
          <div className="stamp" aria-hidden="true"><span>CompTIA</span><b>Security+ ce</b><span>SY0-701</span></div>
          <dl className="tb">
            <div className="tb-row"><dt className="lbl">Drawn by</dt><dd>{fullName}</dd></div>
            <div className="tb-row"><dt className="lbl">Credential</dt><dd>{CREDENTIALS.secPlus}<span className="sub">{CREDENTIALS.secPlusDates}</span></dd></div>
            <div className="tb-row"><dt className="lbl">Degree</dt><dd>{CREDENTIALS.degree}<span className="sub">{CREDENTIALS.degreeDates}</span><span className="sub">{CREDENTIALS.honors}</span></dd></div>
            <div className="tb-row"><dt className="lbl">Background</dt><dd>{aa.title}, {aa.org}<span className="sub">{aa.dates} · {aa.loc}</span></dd></div>
            <div className="tb-row tb-warn"><dt className="lbl">{HIRE_BRIEF[2].label}</dt><dd>{HIRE_BRIEF[2].text}</dd></div>
            <div className="tb-row tb-half"><dt className="lbl">Location</dt><dd>{where}</dd></div>
            <div className="tb-row tb-half tb-half2"><dt className="lbl">Sheet</dt><dd>01 of {TOTAL}</dd></div>
          </dl>
          <div className="rev">
            <h3 className="lbl rev-h" id="rev-h">Revision block · career milestones</h3>
            <table className="rev-t" aria-labelledby="rev-h">
              <thead><tr><th scope="col">Rev</th><th scope="col">Date</th><th scope="col">Description</th></tr></thead>
              <tbody>
                <tr><td>A</td><td>{aa.dates}</td><td>{aa.title}, {aa.org}</td></tr>
                <tr><td>B</td><td>{secDate}</td><td>{CREDENTIALS.secPlus} issued</td></tr>
                <tr><td>C</td><td>Dec 2025</td><td>B.S. completed, {CREDENTIALS.honorsShort} · conferred Jan 1, 2026</td></tr>
                <tr><td>D</td><td>{fossa.dates}</td><td>{fossa.title}, {fossa.org}, alongside the security portfolio</td></tr>
              </tbody>
            </table>
          </div>
        </aside>

        <div className="cover-foot" aria-hidden="true">
          <svg className="north" viewBox="0 0 40 52"><path d="M20 4 L30 40 L20 33 L10 40 Z" className="na-f" /><path d="M20 4 L20 33" className="na-l" /><text x="20" y="51" textAnchor="middle">N</text></svg>
          <div className="scale"><span className="scale-bar"><i /><i /><i /><i /></span><span className="lbl">Scale 1:1 · not to be scaled</span></div>
        </div>
      </div>
      <div className="xhair" aria-hidden="true"><i className="xh-x" /><i className="xh-y" /><span className="xh-r">X 0000 · Y 0000</span></div>
    </SheetFrame>
  )
}

function NodeItem({ n }: { n: Node }) {
  return (
    <li className="ni" id={`n-${n.id}`} data-id={n.id} data-kind={n.kind} data-level={n.level} data-l={n.l} data-to={n.to.join(' ')} data-href={n.href}>
      <span className="nn">{n.name}</span>{' '}
      {n.level ? <span className="lvl" data-l={n.l}>{n.level}</span> : null}
      <p className="note">{n.note}</p>
      {n.kind === 'Skill' ? (
        <p className="conn">
          {n.ev && n.ev.length ? (
            <>Evidence: {n.ev.map((e, i) => <span key={e.href}>{i ? ', ' : ''}<a href={e.href}>{e.label}</a></span>)}</>
          ) : (
            'No public repo linked on this site.'
          )}
        </p>
      ) : n.href ? (
        <p className="conn"><a href={n.href}>{n.connLabel ?? 'Open repo →'}</a></p>
      ) : null}
    </li>
  )
}

function Schematic() {
  const col = (cls: string, id: string, title: string, nodes: Node[]) => (
    <div className={`col ${cls}`}>
      <h3 className="col-h lbl" id={id}>{title}</h3>
      <ol className="nodes" aria-labelledby={id}>{nodes.map((n) => <NodeItem key={n.id} n={n} />)}</ol>
    </div>
  )
  return (
    <SheetFrame no="02" name="Schematic" labelledBy="h-schem">
      <div className="sheet-head rv">
        <h2 id="h-schem">Skills → evidence → lanes</h2>
        <p className="lede">{ETHOS}</p>
        <ul className="legend" aria-label="Legend: how skill levels are drawn">
          {(['hands', 'acad', 'exp'] as const).map((l, i) => (
            <li key={l}><svg viewBox="0 0 40 8" aria-hidden="true"><path d="M0 4H40" className={`lg lg-${l}`} /></svg><span className="lvl" data-l={l}>{['Hands-on lab', 'Academic writing', 'Exposure'][i]}</span></li>
          ))}
        </ul>
        <p className="hint" id="schem-hint">Select any skill, project, or lane to trace what it connects to. Arrow keys move between nodes; Enter pins a node; Escape clears.</p>
      </div>
      <div className="schem" id="schem">
        <div className="schem-cols">
          {col('col-skill', 'col-skill', 'Skills (my own levels)', SKILL_NODES)}
          {col('col-ev', 'col-ev', 'Evidence (repos + labs)', EVIDENCE_NODES)}
          {col('col-lane', 'col-lane', 'Lanes (project tags)', LANE_NODES)}
          <svg className="wires" aria-hidden="true" focusable="false" />
        </div>
        <aside className="panel" id="schem-panel" aria-labelledby="panel-title" hidden>
          <div className="panel-in">
            <p className="lbl panel-kind" id="panel-kind">Detail callout</p>
            <h3 className="panel-title" id="panel-title" tabIndex={-1}>Select a node</h3>
            <div className="panel-body" id="panel-body" aria-live="polite"><p>Pick a skill to see the public evidence behind it, or pick a project to see which skills and lane it belongs to.</p></div>
            <button className="btn btn-ghost" type="button" id="schem-clear" disabled>Clear selection <span className="kbd" aria-hidden="true">Esc</span></button>
          </div>
        </aside>
      </div>
    </SheetFrame>
  )
}

function Assembly() {
  return (
    <SheetFrame no="03" name="Exploded assembly" labelledBy="h-asm">
      <div className="sheet-head rv">
        <h2 id="h-asm">Projects, exploded</h2>
        <p className="lede">{THROUGHLINE.body[1].slice(THROUGHLINE.body[1].indexOf('I have published'))}</p>
      </div>
      <div className="asm">
        <div className="asm-vis" aria-hidden="true"><div className="asm-stage" id="asm-stage"><span className="axis" /></div></div>
        <div className="asm-controls" hidden>
          <label className="lbl" htmlFor="explode">Explode view</label>
          <input type="range" id="explode" min="0" max="100" defaultValue="40" step="5" aria-describedby="explode-hint" />
          <button className="btn btn-ghost" type="button" id="parts-all" aria-pressed="false">Open all parts</button>
          <p className="hint" id="explode-hint">Drag the stack, use the slider, or pick a part from the list. Arrow keys move between parts.</p>
        </div>
        <ol className="parts" id="parts" aria-label="Project parts list">
          {PARTS.map((x, i) => (
            <li key={x.p.id} className={`part${x.archived ? ' part-arch' : ''}`} data-p={i + 1}>
              <details id={`p-${shortId(x.p.id)}`}>
                <summary>
                  <span className="pno">{x.no}</span>
                  <span className="pname">{x.p.name}</span>
                  <span className={`ptag${x.archived ? ' ptag-arch' : ''}`}>{x.p.tag}{x.start ? ' · Start here' : ''}</span>
                </summary>
                <div className="pbody"><p>{x.p.line}</p><a className="plink" href={x.href}>{x.linkLabel}</a></div>
              </details>
            </li>
          ))}
        </ol>
      </div>
    </SheetFrame>
  )
}

function Details() {
  const a = CASE_FILES[0]
  const rest = THROUGHLINE.body[2].split('. ')
  return (
    <SheetFrame no="04" name="Details + labs" labelledBy="h-det">
      <div className="sheet-head rv">
        <h2 id="h-det">Detail A: case file {a.course}</h2>
        <p className="lede">{rest.slice(2).join('. ')}</p>
      </div>
      <article className="detail rv" id="detail-a" aria-labelledby="h-case">
        <div className="detail-mark" aria-hidden="true"><span>A</span></div>
        <header className="detail-h">
          <p className="lbl">{a.course} · Best for: {a.bestFor} · Coursework lab</p>
          <h3 id="h-case">{a.name}</h3>
        </header>
        <div className="detail-grid">
          <section className="dg dg-prob"><h4 className="lbl">Problem</h4><p>{a.problem}</p></section>
          <section className="dg dg-meth"><h4 className="lbl">Method</h4><ol className="steps">{a.method.map((m) => <li key={m}>{m}</li>)}</ol></section>
          <section className="dg dg-ev"><h4 className="lbl">Evidence</h4><ul className="files">{a.evidence.map((e) => {
            const [f, ...d] = e.split(': ')
            return <li key={e}>{d.length ? <><code>{f}</code>: {d.join(': ')}</> : e}</li>
          })}</ul></section>
          <section className="dg dg-res"><h4 className="lbl">Result</h4><p>{a.result}</p></section>
          <section className="dg dg-sig"><h4 className="lbl">Hire signal</h4><p className="sig">{a.hireSignal}</p></section>
        </div>
      </article>
      <div className="det-2">
        <section className="labs rv" id="labs" aria-labelledby="h-labs">
          <h3 id="h-labs">Lab schedule</h3>
          <div className="tbl-wrap" role="region" aria-label="Lab schedule table, scrollable" tabIndex={0}>
            <table className="labs-t">
              <thead><tr><th scope="col">Course</th><th scope="col">Lab</th><th scope="col">Best for</th></tr></thead>
              <tbody>
                {CASE_FILES.map((c, i) => (
                  <tr key={c.id} id={`lab-${c.id}`}>
                    <td className="code">{c.course}</td>
                    <td>{i === 0 ? <a href="#detail-a">{c.name}</a> : <>{c.name}<span className="sub">{c.problem}</span></>}</td>
                    <td>{c.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <a className="btn btn-ghost" href="https://km-it-ops.github.io/#labs">All lab write-ups on the live site →</a>
        </section>
        <section className="notes rv" aria-labelledby="h-notes">
          <h3 id="h-notes">General notes · how I work</h3>
          <ol className="gn">
            {OPERATING.map((o, i) => (
              <li key={o.title} id={`note-${i + 1}`}><h4>{o.title}</h4><p className="lbl">{o.source}</p><p>{o.body}</p></li>
            ))}
          </ol>
        </section>
      </div>
    </SheetFrame>
  )
}

/* Year axis 2015 → present (2026). Positions are presentation geometry. */
const Y0 = 2015
const Y1 = 2026
const pos = (y: number) => ((y - Y0) / (Y1 - Y0)).toFixed(3)
const span = (dates: string) => {
  const [a, b] = dates.split('–')
  return [pos(+a), b === 'present' ? '1' : pos(+b)]
}

function Path() {
  return (
    <SheetFrame no="05" name="Path + contact" labelledBy="h-path">
      <div className="sheet-head rv"><h2 id="h-path">{THROUGHLINE.title}</h2></div>
      <div className="path-grid">
        <div className="through rv">{THROUGHLINE.body.map((p) => <p key={p}>{p}</p>)}</div>
        <dl className="brief rv">{HIRE_BRIEF.map((h) => <div key={h.label}><dt className="lbl">{h.label}</dt><dd>{h.text}</dd></div>)}</dl>
      </div>
      <section className="tl rv" aria-labelledby="h-exp">
        <h3 id="h-exp">Experience, to scale</h3>
        <div className="tl-axis" aria-hidden="true">
          <div className="tl-ticks">
            {[2015, 2017, 2019, 2021, 2023].map((y) => <span key={y} style={{ ['--x' as string]: pos(y) }}>{y}</span>)}
            <span style={{ ['--x' as string]: '1' }}>present</span>
          </div>
          <div className="tl-bars">
            {EXPERIENCE.map((e, i) => {
              const [a, b] = span(e.dates)
              return (
                <span key={e.org} className="tlb" style={{ ['--a' as string]: a, ['--b' as string]: b }}>
                  <i className="dl-h" /><em>{i === 0 ? `${e.org} · ${e.dates}` : e.org.split(' ')[0]}</em>
                </span>
              )
            })}
          </div>
        </div>
        <ol className="jobs">
          {EXPERIENCE.map((e) => (
            <li key={e.org}>
              <p className="lbl">{e.dates} · {e.loc}</p>
              <h4>{e.title} · {e.org}</h4>
              <p>{e.detail}</p>
              <ul className="xfer">{e.transfer.map((t) => <li key={t}>{t}</li>)}</ul>
            </li>
          ))}
        </ol>
      </section>
      <div className="contact rv" id="contact">
        <h3>Contact</h3>
        <p>{THROUGHLINE.seeking}</p>
        <Cta message={false} />
        <form className="bp-form" action={CONTACT_FORM.endpoint} method="POST" aria-describedby="bp-form-status">
          <input type="hidden" name="access_key" value={CONTACT_FORM.accessKey} />
          <input type="hidden" name="subject" value="New message from km-it-ops.github.io" />
          <input type="hidden" name="from_name" value="KM-it-ops portfolio" />
          <input type="checkbox" name="botcheck" className="bp-trap" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <label className="bp-field"><span className="lbl">Name</span><input type="text" name="name" required maxLength={120} autoComplete="name" /></label>
          <label className="bp-field"><span className="lbl">Your email</span><input type="email" name="email" required maxLength={200} autoComplete="email" /></label>
          <label className="bp-field bp-wide"><span className="lbl">Message</span><textarea name="message" required rows={5} maxLength={4000} /></label>
          <div className="bp-foot">
            <button type="submit" className="btn btn-pri">Send message</button>
            <p id="bp-form-status" className="bp-status" role="status" aria-live="polite" />
          </div>
        </form>
      </div>
    </SheetFrame>
  )
}

export default function Blueprint() {
  return (
    <>
      <a className="skip" href="#sheet-01">Skip to content</a>
      <div className="deep" aria-hidden="true" />
      <header className="bar">
        <div className="bar-in">
          <a className="mark" href="#sheet-01" aria-label={`MK, ${PERSON.name}, back to cover sheet`}><span aria-hidden="true">MK</span></a>
          <nav className="index-nav" aria-label="Sheet index">
            <ol>
              {SHEETS.map(([no, nm], i) => (
                <li key={no}><a href={`#sheet-${no}`} aria-current={i === 0 ? 'true' : undefined}><span className="no">{no}</span><span className="nm">{nm}</span></a></li>
              ))}
            </ol>
          </nav>
          <button className="paper" type="button" id="paper" aria-pressed="false" hidden>
            <span className="sw" aria-hidden="true" /><span className="pl-long">Light paper</span><span className="pl-short">Light</span>
          </button>
        </div>
      </header>
      <main id="main">
        <Cover />
        <Schematic />
        <Assembly />
        <Details />
        <Path />
      </main>
      <footer className="foot">
        <p className="lbl">{fullName} · {where} · Sheet set 01–{TOTAL}</p>
        <p className="foot-links"><a href="fonts/LICENSES.txt">Font licenses</a></p>
        <p className="lbl foot-note">Sheet names, zone letters, and the revision-block heading are presentation labels; all other copy is from the site's content file.</p>
      </footer>
    </>
  )
}

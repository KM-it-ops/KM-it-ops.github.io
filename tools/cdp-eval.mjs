import fs from 'node:fs'
const PORT = Number(process.env.CDP_PORT || 9222)
const URL = process.env.SITE_URL || process.env.LAB_URL || 'http://127.0.0.1:5173/'
const W = Number(process.argv[2]||375), H = Number(process.argv[3]||812), DPR = Number(process.argv[4]||3)
const EXPR = fs.readFileSync(process.argv[5], 'utf8')
const sleep = ms => new Promise(r=>setTimeout(r,ms))
const t = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, {method:'PUT'})).json()
const ws = new WebSocket(t.webSocketDebuggerUrl)
let id=0; const pending=new Map(); const events=[]
ws.addEventListener('message', ev=>{const m=JSON.parse(ev.data)
  if(m.id&&pending.has(m.id)){const{resolve,reject}=pending.get(m.id);pending.delete(m.id);if (m.error) { reject(new Error(JSON.stringify(m.error))) } else { resolve(m.result) }}
  else if(m.method) events.push(m.method)})
await new Promise((res,rej)=>{ws.addEventListener('open',res);ws.addEventListener('error',rej)})
const send=(method,params={})=>new Promise((resolve,reject)=>{const i=++id;pending.set(i,{resolve,reject});ws.send(JSON.stringify({id:i,method,params}))})
await send('Page.enable'); await send('Runtime.enable')
await send('Emulation.setDeviceMetricsOverride',{width:W,height:H,deviceScaleFactor:DPR,mobile:W<768})
if(W<768) await send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5})
if(process.argv[6]==='reduced') await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
await send('Page.navigate',{url:URL})
for(let i=0;i<60&&!events.includes('Page.loadEventFired');i++) await sleep(200)
await sleep(6000)
const r = await send('Runtime.evaluate',{expression:EXPR, returnByValue:true, awaitPromise:true})
console.log(r.result.value ?? JSON.stringify(r))
ws.close(); process.exit(0)

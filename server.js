// EduVerse Arena server — npm kerak emas: faqat `node server.js`
const http=require('http'),fs=require('fs'),os=require('os'),path=require('path'),cr=require('crypto');
const PORT=process.env.PORT||3000,F=path.join(__dirname,'data.json');
let D={join:'EDU2026',users:{admin:{p:'admin123',role:'admin',n:'Boshqaruvchi'},dilnoza:{p:'t1234',role:'teacher',n:'Dilnoza opa'},jasur:{p:'t1234',role:'teacher',n:'Jasur aka'}},players:{},tok:{},chat:[],hs:{}};
try{D={...D,...JSON.parse(fs.readFileSync(F))}}catch{}
const save=()=>fs.writeFile(F,JSON.stringify(D),()=>{}),rid=()=>cr.randomBytes(9).toString('hex'),R=a=>a[Math.random()*a.length|0];
const QS=[["O'zbekiston poytaxti?",["Samarqand","Toshkent","Buxoro","Xiva"],1],["7 × 8 = ?",["54","56","64","48"],1],["Suvning formulasi?",["CO2","O2","H2O","NaCl"],2],["Eng katta sayyora?",["Mars","Yupiter","Yer","Venera"],1],["HTML nima?",["Belgilash tili","Operatsion tizim","O'yin","Brauzer"],0],["Yilda necha oy bor?",["10","11","12","13"],2],["Quyosh qaysi tomondan chiqadi?",["G'arb","Shimol","Janub","Sharq"],3],["√144 = ?",["10","11","12","14"],2],["Eng tez quruqlik hayvoni?",["Sher","Gepard","Ot","Yo'lbars"],1],["Internetni kim ochgan?",["Hech kim bitta","Bill Geyts","Ilon Mask","Aynan Tesla"],0],["15% of 200 = ?",["20","25","30","35"],2],["Python — bu...",["Dasturlash tili","Mashina","Brauzer","Sayyora"],0]].map(([q,o,c])=>({q,o,c}));
const TX=["Bilim olish eng katta boylikdir, uni hech kim o'g'irlay olmaydi va har kuni ko'payib boraveradi.","Jamoa bo'lib ishlagan odamlar yolg'iz ishlagandan ko'ra ancha uzoqqa borishadi va ko'proq quvonishadi.","Dasturlash o'rganish uchun har kuni oz-ozdan yozish va xatolardan qo'rqmaslik juda muhimdir."];
const WD=['maktab','kitob','daftar','qalam','kompyuter','dasturlash','internet','robot','yulduz','quyosh','daraxt','tezlik','bilim','jamoa','galaba','shahar','mehnat','sinf'];
const mk=k=>{if(k==='math'){const a=2+Math.random()*18|0,b=2+Math.random()*12|0,o=R(['+','−','×']);return{q:a+' '+o+' '+b,a:String(o==='+'?a+b:o==='−'?a-b:a*b)}}const w=R(WD),s=[...w].sort(()=>Math.random()-.5).join('');return{q:s===w?[...w].reverse().join(''):s,a:w}};
const clients=new Set();let L=null,pt=0,RX=[],rxi=0;
const onl=()=>[...new Set([...clients].filter(c=>!c.st).map(c=>c.id))],add=(id,n)=>{if(D.players[id])D.players[id].s+=n};
function push(){if(pt)return;pt=setTimeout(()=>{pt=0;const b={now:Date.now(),on:onl(),P:Object.entries(D.players).map(([id,p])=>({id,n:p.n,a:p.a,s:p.s})),chat:D.chat.slice(-40),hs:D.hs,live:view(),join:D.join,rx:RX};for(const c of clients)c.r.write('data:'+JSON.stringify({...b,me:c.me})+'\n\n')},120)}
function view(){if(!L)return null;const o={type:L.type,ph:L.ph,t0:L.t0,dur:L.dur};
 if(L.type==='quiz'){o.q=L.q;o.n=QS.length;o.ac=Object.keys(L.ans).length;o.g=L.gain;if(L.ph!=='end'){o.Q=QS[L.q].q;o.o=QS[L.q].o;if(L.ph==='show')o.c=QS[L.q].c}}
 if(L.type==='type'){o.text=L.text;o.pr=L.pr;o.done=L.done}
 if(L.type==='blitz'){o.kind=L.kind;o.q=L.p.q;o.sc=L.sc}
 if(L.type==='tap'){o.tp=L.tp;o.tm=L.tm;o.w=L.w}return o}
const endL=()=>{if(L){L.ph='end';save();push()}};
function qNext(){L.q++;L.ans={};L.gain={};if(L.q>=QS.length)return endL();L.ph='ask';L.t0=Date.now();L.dur=15000;L.timer=setTimeout(qShow,L.dur);push()}
function qShow(){if(!L||L.ph!=='ask')return;clearTimeout(L.timer);L.ph='show';const c=QS[L.q].c;for(const[id,a]of Object.entries(L.ans))if(a.i===c){const g=100+Math.round(Math.max(0,L.dur-a.t)/100);L.gain[id]=g;add(id,g)}save();L.timer=setTimeout(qNext,4000);push()}
function start(g){if(L)clearTimeout(L.timer);const t0=Date.now()+4000;
 if(g==='quiz'){L={type:'quiz',q:-1,ans:{},gain:{}};qNext()}
 else if(g==='type'){L={type:'type',ph:'run',t0,dur:60000,text:R(TX),pr:{},done:[]};L.timer=setTimeout(endL,64500)}
 else if(g==='math'||g==='word'){L={type:'blitz',kind:g,ph:'run',t0,dur:60000,p:mk(g),sc:{}};L.timer=setTimeout(endL,64500)}
 else if(g==='tap'){L={type:'tap',ph:'run',t0,dur:15000,tp:{r:0,b:0},tm:{}};onl().forEach((id,i)=>L.tm[id]=i%2?'b':'r');
  L.timer=setTimeout(()=>{const w=L.tp.r===L.tp.b?'d':L.tp.r>L.tp.b?'r':'b';if(w!=='d')for(const id in L.tm)if(L.tm[id]===w)add(id,30);L.w=w;endL()},19200)}push()}
const body=q=>new Promise(r=>{let s='';q.on('data',c=>s+=c);q.on('end',()=>{try{r(JSON.parse(s||'{}'))}catch{r({})}})});
const J=(r,c,o)=>{r.writeHead(c,{'Content-Type':'application/json'});r.end(JSON.stringify(o))};
const meOf=tk=>({id:tk.id,role:tk.role,n:tk.role==='student'?D.players[tk.id].n:D.users[tk.id].n});
http.createServer(async(q,r)=>{const u=new URL(q.url,'http://x'),p=u.pathname,tk=D.tok[u.searchParams.get('t')];r.setHeader('Access-Control-Allow-Origin','*');r.setHeader('Access-Control-Allow-Headers','*');if(q.method==='OPTIONS'){r.writeHead(204);return r.end()}
 if(p==='/')return fs.readFile(path.join(__dirname,'index.html'),(e,d)=>{r.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});r.end(d)});
 if(p==='/api/join'){const b=await body(q),n=String(b.n||'').trim().slice(0,16);
  if(String(b.pw||'').trim().toLowerCase()!==D.join.toLowerCase())return J(r,403,{e:"Kirish paroli noto'g'ri"});
  if(n.length<2)return J(r,400,{e:'Ism kamida 2 harf bo\'lsin'});
  if(Object.values(D.players).some(x=>x.n.toLowerCase()===n.toLowerCase()))return J(r,409,{e:'Bu ism band. Boshqa ism tanlang'});
  const id=rid(),t=rid();D.players[id]={n,a:String(b.a||'🙂').slice(0,4),s:0};D.tok[t]={id,role:'student'};save();push();return J(r,200,{t})}
 if(p==='/api/login'){const b=await body(q),x=D.users[b.u];if(!x||x.p!==b.p)return J(r,403,{e:"Login yoki parol noto'g'ri"});const t=rid();D.tok[t]={id:b.u,role:x.role};save();return J(r,200,{t})}
 if(!tk||(tk.role==='student'&&!D.players[tk.id])){return J(r,401,{})}
 if(p==='/api/events'){r.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache',Connection:'keep-alive'});const c={r,id:tk.id,st:tk.role!=='student',me:meOf(tk)};clients.add(c);q.on('close',()=>{clients.delete(c);push()});return push()}
 if(p==='/api/act'){const b=await body(q),st=tk.role!=='student',adm=tk.role==='admin',pl=D.players[tk.id],id=tk.id;
  switch(b.a){
  case'chat':{const m=String(b.m||'').trim().slice(0,200);if(m)D.chat=[...D.chat,{n:st?D.users[id].n:pl.n,a:st?'🎓':pl.a,st,m}].slice(-60);break}
  case'score':if(pl){const s=Math.max(0,Math.min(200,Math.round(+b.s)||0)),g=String(b.g).slice(0,8),h=D.hs[g]=D.hs[g]||[];pl.s+=s;h.push({n:pl.n,s});h.sort((x,y)=>y.s-x.s);h.length=Math.min(h.length,5)}break;
  case'ans':if(L&&L.type==='quiz'&&L.ph==='ask'&&pl&&!L.ans[id]){L.ans[id]={i:b.i,t:Date.now()-L.t0};if(Object.keys(L.ans).length>=onl().length)qShow()}break;
  case'prog':if(L&&L.type==='type'&&pl&&Date.now()>L.t0&&L.ph==='run'){const v=Math.min(100,+b.p||0);L.pr[id]=Math.max(L.pr[id]||0,v);if(v>=100&&!L.done.includes(id)){L.done.push(id);add(id,[50,35,25,15][L.done.length-1]||8)}}break;
  case'tap':if(L&&L.type==='tap'&&pl&&L.ph==='run'&&Date.now()>L.t0&&Date.now()<L.t0+L.dur){const t=L.tm[id]=L.tm[id]||(Object.keys(L.tm).length%2?'b':'r');L.tp[t]+=Math.min(30,+b.n||0)}break;
  case'bans':if(L&&L.type==='blitz'&&L.ph==='run'&&pl&&Date.now()>L.t0&&String(b.v).trim().toLowerCase()===L.p.a){L.sc[id]=(L.sc[id]||0)+1;add(id,10);L.p=mk(L.kind)}break;
  case'react':if(String(b.e).length<6){RX=[...RX,{i:++rxi,e:String(b.e),n:st?'🎓':pl.a}].slice(-8)}break;
  case'live':if(st)start(b.g);break;
  case'stop':if(st){if(L)clearTimeout(L.timer);L=null}break;
  case'kick':if(st&&D.players[b.id]){delete D.players[b.id];for(const k in D.tok)if(D.tok[k].id===b.id)delete D.tok[k]}break;
  case'award':if(st&&D.players[b.id])D.players[b.id].s=Math.max(0,D.players[b.id].s+(+b.n||0));break;
  case'join':if(adm&&b.p)D.join=String(b.p).trim().slice(0,24);break;
  case'pw':if(adm&&D.users[b.u]&&b.p)D.users[b.u].p=String(b.p).slice(0,30);break;
  case'reset':if(adm){for(const k in D.players)D.players[k].s=0;D.hs={}}break}
  save();push();return J(r,200,{})}
 J(r,404,{})}).listen(PORT,()=>{console.log('EduVerse Arena: http://localhost:'+PORT);for(const a of Object.values(os.networkInterfaces()).flat())if(a.family==='IPv4'&&!a.internal)console.log("Do'stlar uchun (bir tarmoq): http://"+a.address+':'+PORT)});
setInterval(()=>clients.forEach(c=>c.r.write(':\n\n')),20000);

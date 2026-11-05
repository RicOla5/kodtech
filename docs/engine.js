/* ===================================================================
   Kódolástechnika — közös feladatmotor (engine.js)
   Önálló, keretrendszer nélküli JS. Minden feladat véletlen generált.
   A képletek MathJax-formátumban: \( ... \) inline.
   Használja: gyakorlo.html (1 kérdés), teszt.html (minta teszt).
   Export: window.KT = { GEN, GENBYTOPIC, ALLGENS, TOPICS, helpers... }
=================================================================== */
(function(){
'use strict';

/* ---------- Segédfüggvények ---------- */
const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const choice = arr => arr[Math.floor(Math.random() * arr.length)];
const floor = Math.floor;

/* GF(p) prím test */
function gfpMul(a, b, p){ return ((a % p) * (b % p)) % p; }
function gfpPow(a, e, p){ let r=1; a%=p; while(e>0){ if(e&1) r=(r*a)%p; a=(a*a)%p; e>>=1;} return r; }

/* primitív elem — ZH-konvenció: GF(5)→3, GF(7)→5, GF(11)→6 */
const PREFERRED_PRIM = {5:3, 7:5, 11:6};
function isPrimitive(g,p){
  const seen=new Set(); let x=1;
  for(let i=0;i<p-1;i++){ x=(x*g)%p; if(i<p-2 && x===1) return false; seen.add(x); }
  return seen.size===p-1;
}
function primitiveRoot(p){
  if(PREFERRED_PRIM[p] && isPrimitive(PREFERRED_PRIM[p],p)) return PREFERRED_PRIM[p];
  for(let g=2; g<p; g++) if(isPrimitive(g,p)) return g;
  return 2;
}

/* GF(8), primitív polinom x^3+x+1 (y^3=y+1) */
const GF8 = (()=>{
  const exp=new Array(7), log={}; let a=1;
  for(let i=0;i<7;i++){ exp[i]=a; log[a]=i; a<<=1; if(a & 0b1000) a^=0b1011; }
  const poly=['1','y','y^2','y+1','y^2+y','y^2+y+1','y^2+1'];
  return { exp, log, mul:(x,y)=>(x===0||y===0)?0:exp[(log[x]+log[y])%7],
    el:i=>exp[((i%7)+7)%7], polyName:i=>poly[((i%7)+7)%7] };
})();

const vstr = arr => '(' + arr.join('') + ')';
function normVec(s){ return (s||'').replace(/[()\s]/g,''); }
function normNums(s){ return (s||'').replace(/[()\s]/g,'').split(',').map(x=>x.trim()).filter(x=>x!=='').join(','); }
function matVecMod2(M, v){ return M.map(row => row.reduce((acc,b,i)=>acc ^ (b & v[i]), 0)); }

/* MathJax inline rövidítés */
const M = s => '\\(' + s + '\\)';

/* ===================================================================
   FELADATGENERÁTOROK
   { topic, type, question(HTML+MathJax), hint, answer(string),
     check(input)->bool, solution(HTML+MathJax) }
=================================================================== */
const GEN = {};

/* ---- T1: BSC hibaminta valószínűség ---- */
GEN.bsc = () => {
  const n = randInt(4,7), w = randInt(1,2);
  const pb = choice([0.1,0.2,0.05,0.01]);
  const val = Math.pow(pb,w)*Math.pow(1-pb,n-w);
  /* Annyi tizedesjegyet választunk, hogy a kerekített válasz NE legyen 0 —
     kis valószínűségeknél (pl. P_b=0.01, w=2) a 2 tizedes 0.00-ra kerekülne,
     ami értelmetlen feladat. A tűrés igazodik a megjelenített pontossághoz. */
  let dec = 2;
  while(dec < 8 && Math.round(val * Math.pow(10,dec)) === 0) dec++;
  const ans = val.toFixed(dec);
  const tol = 0.5 * Math.pow(10, -dec);           /* fél egység az utolsó jegyen */
  const q1me = 1 - pb;                             /* (1-P_b) pontos értéke */
  return {
    topic:'bsc', type:'BSC — hibaminta valószínűsége',
    question:`Egy <b>${w}</b> súlyú hibaminta fordul elő egy <b>C(${n},k)</b> kód cosetjében. A BSC bithiba-valószínűsége ${M('P_b = '+pb)}. Mennyi ennek a hibamintának az előfordulási valószínűsége? <i>(${dec} tizedesre)</i>`,
    hint:'Képlet: '+M('P = P_b^{\\,w}\\cdot(1-P_b)^{\\,n-w}'),
    answer:ans,
    check:inp=>{ const x=parseFloat((inp||'').replace(',','.')); return isFinite(x) && Math.abs(x-val)<=tol; },
    solution:`<ol>
      <li>A hibás bitek száma (súly) ${M('w='+w)}, a hibátlanoké ${M('n-w='+(n-w))}, mert a kódszó hossza ${M('n='+n)}.</li>
      <li>Minden hibás bit ${M('P_b='+pb)}, minden hibátlan ${M('(1-P_b)='+q1me)} valószínűséggel fordul elő, és a bitek függetlenek, ezért szorzunk:</li>
      <li>${M('P = P_b^{'+w+'}\\cdot(1-P_b)^{'+(n-w)+'} = '+pb+'^{'+w+'}\\cdot '+q1me+'^{'+(n-w)+'}')}</li>
      <li>Pontos érték: ${M('P = '+val.toPrecision(6))}, ${dec} tizedesre kerekítve ≈ <b>${ans}</b>.</li></ol>`
  };
};

/* ---- T2: jelzés / javítás ---- */
GEN.jelzesjavitas = () => {
  const d = randInt(2,7);
  const askCorrect = Math.random()<0.5;
  const t = floor((d-1)/2), s = d-1;
  const ans = askCorrect? t : s;
  return {
    topic:'alap', type:'Jelző- / javítóképesség',
    question:`Egy kód minimális kódtávolsága ${M('d_{min} = '+d)}. Hány hibát tud a kód <b>${askCorrect?'JAVÍTANI':'JELEZNI (detektálni)'}</b>?`,
    hint: askCorrect? 'Javít: '+M('t = \\lfloor (d-1)/2 \\rfloor') : 'Jelez: '+M('s = d-1'),
    answer:String(ans),
    check:inp=>parseInt(inp,10)===ans,
    solution:`<ol>
      <li>A javításhoz a hibás szónak a helyes kódszóhoz kell maradnia legközelebb, ehhez a hibák száma legfeljebb ${M('t=\\lfloor(d_{min}-1)/2\\rfloor')} lehet: ${M('t=\\lfloor('+d+'-1)/2\\rfloor='+t)}.</li>
      <li>A jelzéshez elég, hogy a hibás szó ne essen egy másik kódszóra, ehhez a hibák száma legfeljebb ${M('s=d_{min}-1')} lehet: ${M('s='+d+'-1='+s)}.</li>
      <li>A kérdés a <b>${askCorrect?'javítás':'jelzés'}</b>ra vonatkozik → <b>${ans}</b></li></ol>`
  };
};

/* ---- T2: min-távolság dekóder séma ---- */
GEN.scheme = () => {
  const base={'00':'00000','01':'01011','10':'10101','11':'11110'};
  const u=choice(Object.keys(base)); const cw=base[u];
  const epos=randInt(0,4); const e=Array(5).fill('0'); e[epos]='1'; const estr=e.join('');
  const v=cw.split('').map((b,i)=>(+b)^(+e[i])).join('');
  let best=null,bd=99; const dist={};
  for(const key in base){ const c=base[key]; const d=c.split('').reduce((a,b,i)=>a+((+b)^(+v[i])),0); dist[key]=d; if(d<bd){bd=d;best=key;} }
  const cprime=base[best]; const uprime=best;
  const which=choice(['v','cprime','uprime']);
  const ansMap={v:'('+v+')', cprime:'('+cprime+')', uprime:'('+uprime+')'};
  const qMap={v:'a csatorna kimenetén megjelenő <b>v</b> vektort', cprime:'a dekódolt <b>c\u2032</b> kódszót', uprime:'a dekódolt <b>u\u2032</b> üzenetet'};
  const tab=Object.entries(base).map(([a,b])=>`${a} \u2192 ${b}`).join('\n');
  return {topic:'alap',type:'Min-távolság dekóder séma',
    question:`Kódtáblázat:<div class="matrix">${tab}</div>A <b>${u}</b> üzenetet küldjük, a csatorna hibavektora <b>(${estr})</b>. Add meg ${qMap[which]}!`,
    hint:'c = kódszó; '+M('v = c \\oplus \\text{hiba}')+'; '+M('c\\prime')+' = v-hez legközelebbi kódszó; '+M('u\\prime')+' = c\u2032 üzenete.',
    answer:ansMap[which],
    check:inp=> which==='uprime'? normVec(inp)===uprime : normVec(inp)===ansMap[which].replace(/[()]/g,''),
    solution:`<ol>
      <li>A küldött ${M('u='+u)} üzenet kódszava a táblából: ${M('c = '+cw)}.</li>
      <li>A vett vektor a kódszó és a hibavektor mod-2 összege: ${M('v = c \\oplus '+estr+' = '+v)}.</li>
      <li>Kiszámoljuk minden kódszó Hamming-távolságát a vett ${M('v='+v)} vektortól:
        <div class="matrix">${Object.entries(base).map(([a,b])=>`${a} -> ${b}   d(v,c)=${dist[a]}`).join('\n')}</div></li>
      <li>A legkisebb távolságú (${bd}) kódszó: ${M('c\\prime = '+cprime)} — ezért erre dekódolunk.</li>
      <li>A kódtáblából visszaolvasva az üzenet: ${M('u\\prime = '+uprime)}.</li></ol>`};
};

/* ---- T3: coset / darabszám ---- */
GEN.darabszam = () => {
  const k = randInt(2,5), nk = randInt(2,5), n=k+nk;
  const kind = choice(['coset-meret','coset-szam','osszes','tabla-bit']);
  let q,ans,sol;
  if(kind==='coset-meret'){ ans=Math.pow(2,k);
    q=`Hány hibavektor van egy <b>C(${n},${k})</b> bináris lineáris kód <b>egy</b> hibacsoportjában?`;
    sol=`Egy coset annyi vektort tartalmaz, ahány kódszó van, mert minden kódszóhoz a coset-vezetőt hozzáadva kapjuk a coset egy-egy elemét. Kódszavak száma = ${M('2^k = 2^{'+k+'} = '+ans)}`;
  } else if(kind==='coset-szam'){ ans=Math.pow(2,nk);
    q=`Hány <b>hibacsoport</b> (coset) van egy <b>C(${n},${k})</b> bináris lineáris kódnál?`;
    sol=`Minden cosethez pontosan egy szindróma tartozik, a szindrómák ${M('n-k')} bitesek, ezért a cosetek száma = szindrómák száma = ${M('2^{n-k} = 2^{'+nk+'} = '+ans)}`;
  } else if(kind==='osszes'){ ans=Math.pow(2,n);
    q=`Hány hibavektor van <b>összesen</b> egy <b>C(${n},${k})</b> kódnál (a csupa-0-t is beleértve)?`;
    sol=`Egy hibavektor tetszőleges ${M('n')}-bites bináris vektor lehet, ezért az összes lehetőség = ${M('2^n = 2^{'+n+'} = '+ans)}`;
  } else { ans=Math.pow(2,nk)*(n+nk);
    q=`Hány <b>bit</b> kerül tárolásra egy <b>C(${n},${k})</b> kód szindróma-dekódolási táblázatában?`;
    sol=`A tábla minden sora egy coset-vezetőt (hibaminta, ${M('n='+n)} bit) és a hozzá tartozó szindrómát (${M('n-k='+nk)} bit) tárolja, azaz ${M(n+'+'+nk)} bitet soronként. A sorok száma a cosetek száma: ${M('2^{'+nk+'}')}.<br>${M('2^{'+nk+'}\\cdot('+n+'+'+nk+') = '+Math.pow(2,nk)+'\\cdot'+(n+nk)+' = '+ans)}`;
  }
  return { topic:'linearis', type:'Darabszám / táblázatméret', question:q,
    hint:'coset-méret '+M('2^k')+' · coset-szám '+M('2^{n-k}')+' · összes '+M('2^n')+' · tábla-bit '+M('2^{n-k}(n+(n-k))'),
    answer:String(ans), check:inp=>parseInt(inp,10)===ans, solution:`<ol><li>${sol}</li></ol>` };
};

/* ---- T3: szisztematikus G -> H sor ---- */
GEN.systGH = () => {
  const k = randInt(2,3), nk = randInt(2,3), n=k+nk;
  const P=[]; for(let i=0;i<k;i++){ let r; do{ r=Array.from({length:nk},()=>randInt(0,1)); }while(r.every(x=>x===0)); P.push(r); }
  const I = s => Array.from({length:s},(_,i)=>Array.from({length:s},(_,j)=>i===j?1:0));
  const Ik=I(k), Ink=I(nk);
  const G = Ik.map((r,i)=>r.concat(P[i]));
  const Pt = Ink.map((_,c)=>P.map(r=>r[c]));
  const H = Pt.map((r,i)=>r.concat(Ink[i]));
  const which = choice([
    {idx:0,label:'generátormátrix ELSŐ', Mt:G},
    {idx:k-1,label:'generátormátrix UTOLSÓ', Mt:G},
    {idx:0,label:'paritásellenőrző mátrix ELSŐ', Mt:H},
    {idx:nk-1,label:'paritásellenőrző mátrix UTOLSÓ', Mt:H},
  ]);
  const row = which.Mt[which.idx];
  const Gs = G.map(r=>r.join(' ')).join('\n');
  const isG = which.Mt===G;
  const rowNum = which.idx+1;
  return { topic:'linearis', type:'Szisztematikus G/H sor',
    question:`Adott egy szisztematikus <b>C(${n},${k})</b> kód generátormátrixa ${M('G=[I\\mid P]')}:<div class="matrix">${Gs}</div>Add meg a <b>${which.label} sorát</b>!`,
    hint:M('G=[I_k\\mid P]')+', és '+M('H=[P^{T}\\mid I_{n-k}]')+'. A P-t transzponálni kell a H-hoz!',
    answer:vstr(row), check:inp=>normVec(inp)===row.join(''),
    solution:`<ol>
      <li>A G szisztematikus alakja ${M('G=[I_'+k+'\\mid P]')}, ezért a P mátrix a G utolsó ${nk} oszlopa (${k}×${nk}):
        <div class="matrix">${P.map(r=>r.join(' ')).join('\n')}</div></li>
      <li>A H-hoz a P-t transzponáljuk: ${M('P^{T}')} sorai a P oszlopai (${nk}×${k}):
        <div class="matrix">${Pt.map(r=>r.join(' ')).join('\n')}</div></li>
      <li>${M('H=[P^{T}\\mid I_{'+nk+'}]')} (${nk}×${n}):
        <div class="matrix">${H.map(r=>r.join(' ')).join('\n')}</div></li>
      <li>A kért sor a ${isG?'G':'H'} mátrix ${rowNum}. sora: <b>${vstr(row)}</b></li></ol>` };
};

/* ---- T3: szindróma számítás ---- */
GEN.szindroma = () => {
  const k = randInt(2,3), nk = randInt(3,4), n=k+nk;
  const P=[]; for(let i=0;i<k;i++){ let r; do{r=Array.from({length:nk},()=>randInt(0,1));}while(r.every(x=>x===0)); P.push(r); }
  const Ink=Array.from({length:nk},(_,i)=>Array.from({length:nk},(_,j)=>i===j?1:0));
  const Pt=Ink.map((_,c)=>P.map(r=>r[c]));
  const H=Pt.map((r,i)=>r.concat(Ink[i]));
  const e=Array(n).fill(0); const w=randInt(1,2);
  const pos=[...Array(n).keys()].sort(()=>Math.random()-.5).slice(0,w); pos.forEach(i=>e[i]=1);
  const s=matVecMod2(H,e);
  const Hs=H.map(r=>r.join(' ')).join('\n');
  /* A hozzáadandó H-oszlopok (az e 1-es pozíciói szerint), fentről-lentre olvasva. */
  const onePos = pos.slice().sort((a,b)=>a-b);
  const colVec = j => H.map(r=>r[j]);                 /* a j. H-oszlop fölülről lefelé */
  const colList = onePos.map(j=>colVec(j));
  const colLines = onePos.map(j=>`<li>${j+1}. oszlop: ${M('('+colVec(j).join(',')+')^{T}')}</li>`).join('');
  /* Lépésenkénti mod-2 XOR összegzés komponensenként. */
  const xorRows = Array.from({length:nk},(_,r)=>{
    const bits = colList.map(c=>c[r]);
    return `<li>${r+1}. komponens: ${M(bits.join(' \\oplus ')+' = '+s[r])}</li>`;
  }).join('');
  return { topic:'linearis', type:'Szindróma számítása',
    question:`Adott a <b>C(${n},${k})</b> kód paritásellenőrző mátrixa:<div class="matrix">${Hs}</div>Add meg a <b>${vstr(e)}</b> hibavektorhoz tartozó szindrómavektort!`,
    hint:M('s = H\\cdot e^{T}')+' (mod 2) — az e 1-es pozícióihoz tartozó H-oszlopok XOR-ja.',
    answer:vstr(s), check:inp=>normVec(inp)===s.join(''),
    solution:`<ol>
      <li>${M('s = H\\cdot e^{T}')} (mod 2): mivel az e csak a(z) <code>${onePos.map(p=>p+1).join(', ')}</code>. pozíción 1-es, a szindróma ezen oszlopok mod-2 összege.</li>
      <li>A hozzáadandó H-oszlopok:<ol>${colLines}</ol></li>
      <li>Komponensenkénti XOR (mod 2):<ol>${xorRows}</ol></li>
      <li>A szindrómavektor: <b>${vstr(s)}</b></li></ol>` };
};

/* ---- T4: Hamming paraméterek ---- */
GEN.hamming = () => {
  const m = randInt(3,5), n=Math.pow(2,m)-1, k=n-m;
  const kind=choice(['n','k','t','jelez']);
  let q,ans,sol;
  if(kind==='n'){ans=n;q=`Egy bináris Hamming-kódnak <b>${m}</b> paritásbitje van. Mi a kód <b>n</b> paramétere?`;sol='A H oszlopai az összes nemzérus '+M('m')+'-bites vektor, ezért a kódhossz '+M('n = 2^m - 1 = 2^{'+m+'} - 1 = '+n)+'.';}
  else if(kind==='k'){ans=k;q=`Egy bináris Hamming-kód <b>n=${n}</b>. Mi a kód <b>k</b> paramétere?`;sol='Az üzenetbitek száma a kódhossz mínusz a paritásbitek száma: '+M('k = n - m = '+n+' - '+m+' = '+k)+'.';}
  else if(kind==='t'){ans=1;q=`Hány hibát tud <b>javítani</b> egy C(${n},${k}) Hamming-kód?`;sol='Minden Hamming-kód minimális távolsága '+M('d_{min}=3')+', mert bármely két H-oszlop különböző és nemzérus, így '+M('t=\\lfloor(3-1)/2\\rfloor = 1')+' hibát javít.';}
  else{ans=2;q=`Hány hibát tud <b>jelezni</b> egy C(${n},${k}) Hamming-kód?`;sol='Mivel '+M('d_{min}=3')+', a jelzőképesség '+M('s=d_{min}-1 = 2')+'.';}
  return {topic:'hamming',type:'Hamming paraméterek',question:q,
    hint:M('n=2^m-1')+', '+M('k=n-m')+', '+M('d=3')+', javít '+M('t=1')+', jelez 2.',
    answer:String(ans),check:inp=>parseInt(inp,10)===ans,solution:`<ol><li>${sol}</li></ol>`};
};

/* ---- T4: Hamming hiányzó oszlop ---- */
GEN.hammingMiss = () => {
  const all=[]; for(let v=1;v<=7;v++){ all.push([(v>>2)&1,(v>>1)&1,v&1]); }
  const missCount=randInt(1,2);
  const idxs=[...all.keys()].sort(()=>Math.random()-.5);
  const missIdx=idxs.slice(0,missCount).sort((a,b)=>a-b);
  const present=all.filter((_,i)=>!missIdx.includes(i));
  const miss=missIdx.map(i=>all[i]);
  const cols = present.concat(miss.map(()=>['*','*','*']));
  const Hrows=[0,1,2].map(r=> cols.map(c=>c[r]).join(' ')).join('\n');
  const target = miss[0];
  const presentSet = new Set(present.map(c=>c.join('')));
  const missSet = new Set(miss.map(c=>c.join('')));
  const tableLines = all.map(c=>{
    const key=c.join('');
    const mark = missSet.has(key) ? 'HIÁNYZIK' : 'jelen van';
    return `${key} — ${mark}`;
  }).join('\n');
  return {topic:'hamming',type:'Hamming — hiányzó oszlop',
    question:`Adott egy C(7,4) Hamming-kód paritásmátrixa, amelyből ${missCount} oszlop hiányzik (a <b>*</b> helyeken):<div class="matrix">${Hrows}</div>Add meg az <b>első hiányzó oszlopvektort</b>!`,
    hint:'A Hamming H oszlopai az ÖSSZES nemzérus m-bites vektort tartalmazzák, egyszer. A hiányzó = a még nem szereplő minta.',
    answer:vstr(target), check:inp=>normVec(inp)===target.join(''),
    solution:`<ol>
      <li>A C(7,4) Hamming-kód paritásmátrixának oszlopai az összes nemzérus 3-bites vektort tartalmazzák pontosan egyszer (7 db): 001, 010, 011, 100, 101, 110, 111.</li>
      <li>Megnézzük, melyik minta szerepel már a mátrixban, és melyik hiányzik:<div class="matrix">${tableLines}</div></li>
      <li>A teljes halmazból a jelenlévőket kivonva marad a hiányzó(k): <code>${miss.map(c=>c.join('')).join(', ')}</code>.</li>
      <li>Az első hiányzó oszlop: <b>${vstr(target)}</b></li></ol>`};
};

/* ---- T5: GF(8) szorzás ---- */
GEN.gf8mul = () => {
  const a=randInt(1,6), b=randInt(1,6); const res=(a+b)%7;
  return {topic:'gfq',type:'GF(8) szorzás (hatványtábla)',
    question:`A GF(8) hatványtáblában az elemeket y-kitevőkkel jelöljük (0..6). Mennyi ${M(a+' \\times '+b)} a GF(8)-ban? <i>(a válasz is y-kitevő, 0..6)</i>`,
    hint:'GF(2^m)-ben a szorzás = a kitevők összege mod (2^m−1) = mod 7.',
    answer:String(res), check:inp=>parseInt(inp,10)===res,
    solution:`<ol>
      <li>A GF(${8})-ban a nemzérus elemeket az ${M('y')} primitív elem hatványaiként írjuk, és a szorzás a kitevők összeadására egyszerűsödik:</li>
      <li>${M('y^{'+a+'}\\cdot y^{'+b+'} = y^{'+a+'+'+b+'} = y^{'+(a+b)+'}')}</li>
      <li>A kitevőket mod ${M('2^m-1 = 7')} vesszük, mert ${M('y^7=1')}: ${M((a+b)+' \\bmod 7 = '+res)} → ${M('y^{'+res+'}')} (${GF8.polyName(res)}) → <b>${res}</b></li></ol>`};
};

/* ---- T6: RS paraméterek ---- */
GEN.rsParam = () => {
  const q=choice([5,7,11]); const n=q-1;
  const t=randInt(1, Math.max(1,floor((n-1)/2))); const k=n-2*t;
  const kind=choice(['n','k','t']);
  let qq,ans,sol;
  if(kind==='n'){ans=n;qq=`Egy GF(${q}) feletti RS-kódot minden <b>${t}</b> hiba javítására terveznek. Mi a kód <b>n</b> paramétere?`;sol='Egy GF('+q+') feletti RS-kód hossza a nemzérus testelemek száma, ezért '+M('n = q - 1 = '+q+' - 1 = '+n)+'.';}
  else if(kind==='k'){ans=k;qq=`Egy GF(${q}) feletti, minden <b>${t}</b> hibát javító RS-kód. Mi a <b>k</b> paramétere?`;sol='Az RS-kód MDS, így a paritásszimbólumok száma '+M('n-k=2t='+(2*t))+'. Innen '+M('n='+n)+' mellett '+M('k = n-2t = '+n+'-'+(2*t)+' = '+k)+'.';}
  else{ans=t;qq=`Egy GF(${q}) feletti RS-kód paraméterei: C(${n},${k}). Hány hibát tud javítani?`;sol='Az RS-kód '+M('n-k')+' paritásszimbólumával '+M('t=\\lfloor(n-k)/2\\rfloor')+' hibát javít: '+M('\\lfloor('+n+'-'+k+')/2\\rfloor = '+t)+'.';}
  return {topic:'rs',type:'RS paraméterek',question:qq,
    hint:M('n=q-1')+', '+M('n-k=2t')+', '+M('t=\\lfloor(n-k)/2\\rfloor'),
    answer:String(ans),check:inp=>parseInt(inp,10)===ans,solution:`<ol><li>${sol}</li></ol>`};
};

/* ---- T6: RS H/G sor (α-hatványsor) ---- */
GEN.rsRow = () => {
  const p=choice([5,7,11]); const n=p-1; const alpha=primitiveRoot(p);
  const i=randInt(1, Math.min(3,n-1));
  const base=gfpPow(alpha,i,p);
  const row=[]; for(let j=0;j<n;j++) row.push(gfpPow(base,j,p));
  /* A base = α^i lépésenkénti kiszámítása ismételt szorzással (mod p). */
  const baseSteps=[]; let acc=1;
  for(let k2=1;k2<=i;k2++){ const prev=acc; acc=(acc*alpha)%p; baseSteps.push(M('\\alpha^{'+k2+'} = '+prev+'\\cdot '+alpha+' = '+(prev*alpha)+' \\equiv '+acc+' \\pmod{'+p+'}')); }
  const baseLine = i===0 ? M('\\text{base} = \\alpha^{0} = 1') : baseSteps.map(s=>`<li>${s}</li>`).join('');
  /* A base hatványai: base^0, base^1, ... mod p. */
  const powSteps=[]; let pacc=1;
  for(let j=0;j<n;j++){
    if(j===0){ powSteps.push(`<li>${M('\\text{base}^{0} = 1')}</li>`); }
    else { const prev=pacc; pacc=(pacc*base)%p; powSteps.push(`<li>${M('\\text{base}^{'+j+'} = '+prev+'\\cdot '+base+' = '+(prev*base)+' \\equiv '+pacc+' \\pmod{'+p+'}')}</li>`); }
  }
  return {topic:'rs',type:'RS mátrix sora (α-hatványsor)',
    question:`Egy GF(${p}) feletti RS-kód, a primitív elem ${M('\\alpha='+alpha)}. Add meg a paritásellenőrző mátrix <b>${i}. sorát</b>! <i>(vesszővel, pl. 1,${alpha},...)</i>`,
    hint:'Az i-edik sor: '+M('(\\alpha^0, \\alpha^i, \\alpha^{2i}, \\dots)')+' a GF('+p+')-ben.',
    answer:row.join(','), check:inp=>normNums(inp)===row.join(','),
    solution:`<ol>
      <li>A sor alapja ${M('\\text{base} = \\alpha^{'+i+'}')}, amit az ${M('\\alpha='+alpha)} ismételt szorzásával kapunk (mod ${p}):${i===0?' '+baseLine:'<ol>'+baseLine+'</ol>'}</li>
      <li>Tehát ${M('\\text{base} = '+base)}.</li>
      <li>A sor a base egymás utáni hatványai ${M('(\\text{base}^0,\\text{base}^1,\\dots,\\text{base}^{'+(n-1)+'})')} mod ${p}:<ol>${powSteps.join('')}</ol></li>
      <li>A keresett sor: <b>${row.join(',')}</b></li></ol>`};
};

/* ---- T6: RS generátorpolinom (t=1) ---- */
GEN.rsGen = () => {
  const p=choice([5,7]); const alpha=primitiveRoot(p);
  const a1=alpha, a2=gfpPow(alpha,2,p);
  const b=((-(a1+a2))%p+p)%p; const c=gfpMul(a1,a2,p);
  const ask=choice(['b','c']); const ans= ask==='b'? b : c;
  return {topic:'rs',type:'RS generátorpolinom (t=1)',
    question:`Egy GF(${p}) feletti, minden egyszeres hibát javító ciklikus RS-kód (primitív elem ${M('\\alpha='+alpha)}). A generátorpolinom ${M('g(x)=x^2+bx+c')}. Mi a(z) <b>${ask}</b> értéke?`,
    hint:M('g(x)=(x-\\alpha)(x-\\alpha^2)')+'. Viète: '+M('b = -(\\alpha+\\alpha^2)')+', '+M('c = \\alpha\\cdot\\alpha^2')+' (mod p).',
    answer:String(ans), check:inp=>parseInt(inp,10)===ans,
    solution:`<ol>
      <li>A generátorpolinom gyökei a primitív elem hatványai: ${M('\\alpha')} és ${M('\\alpha^2')}.</li>
      <li>${M('\\alpha = '+a1)}, ${M('\\alpha^2 = \\alpha\\cdot\\alpha = '+a1+'\\cdot'+a1+' = '+(a1*a1)+' \\equiv '+a2+' \\pmod{'+p+'}')}.</li>
      <li>Mivel ${M('g(x)=(x-\\alpha)(x-\\alpha^2)=x^2-(\\alpha+\\alpha^2)x+\\alpha\\cdot\\alpha^2')}, Viète alapján:</li>
      <li>${M('b = -(\\alpha+\\alpha^2) = -('+a1+'+'+a2+') = '+(-(a1+a2))+' \\equiv '+b+' \\pmod{'+p+'}')}</li>
      <li>${M('c = \\alpha\\cdot\\alpha^2 = '+a1+'\\cdot'+a2+' = '+(a1*a2)+' \\equiv '+c+' \\pmod{'+p+'}')}</li>
      <li>A kért ${ask} értéke: <b>${ans}</b></li></ol>`};
};

/* ---- T6: RS kódolás u·G ---- */
GEN.rsEncode = () => {
  const p=7; const alpha=primitiveRoot(p); const n=p-1; const k=2;
  const G=[ Array(n).fill(1), Array.from({length:n},(_,j)=>gfpPow(alpha,j,p)) ];
  const u=[randInt(1,p-1), randInt(1,p-1)];
  const c=Array.from({length:n},(_,j)=> (gfpMul(u[0],G[0][j],p)+gfpMul(u[1],G[1][j],p))%p );
  /* Oszloponkénti, behelyettesített levezetés mind az n oszlopra. */
  const steps = Array.from({length:n},(_,j)=>{
    const raw = u[0]*G[0][j] + u[1]*G[1][j];
    return `<li>${M('c_'+(j+1)+' = '+u[0]+'\\cdot '+G[0][j]+' + '+u[1]+'\\cdot '+G[1][j]+' = '+raw+' \\equiv '+c[j]+' \\pmod{'+p+'}')}</li>`;
  }).join('');
  return {topic:'rs',type:'RS kódolás u·G',
    question:`GF(${p}) feletti RS-kód, C(${n},${k}), primitív elem ${M('\\alpha='+alpha)}. A generátormátrix:<div class="matrix">${G.map(r=>r.join(' ')).join('\n')}</div>Add meg az <b>u=(${u.join(',')})</b> üzenethez tartozó kódszót! <i>(vesszővel)</i>`,
    hint:M('c = u\\cdot G')+' a GF(p)-ben: a G sorainak u-együtthatós kombinációja (mod p).',
    answer:c.join(','), check:inp=>normNums(inp)===c.join(','),
    solution:`<ol>
      <li>A kódszó ${M('c = u\\cdot G')}, azaz minden ${M('j')}-edik oszlopra: ${M('c_j = u_1\\cdot G_{1j} + u_2\\cdot G_{2j} \\pmod{'+p+'}')}, ahol ${M('u_1='+u[0])}, ${M('u_2='+u[1])}.</li>
      ${steps}
      <li>Így a teljes kódszó: ${M('c = ('+c.join(',')+')')} → <b>${c.join(',')}</b></li></ol>`};
};

/* ---- T6: shiftregiszter méretezés ---- */
GEN.shiftreg = () => {
  const q=choice([5,7,8,11]); const n=(q===8?7:q-1);
  const t=randInt(1,Math.max(1,floor((n-1)/2))); const degg=2*t;
  const kind=choice(['keslelteto','szorzo']); const ans= kind==='keslelteto'? degg : degg+1;
  return {topic:'rs',type:'Shiftregiszter méretezése',
    question:`Egy GF(${q}) feletti, minden <b>${t}</b> hibát javító ciklikus RS-kódot kódolunk előrecsatolt shiftregiszterrel. Hány <b>${kind==='keslelteto'?'késleltetőt (rekeszt)':'szorzót (együtthatót, az 1-est is számolva)'}</b> tartalmaz?`,
    hint:'Késleltetők = '+M('\\deg g = n-k = 2t')+'. Szorzók = '+M('\\deg g + 1')+'.',
    answer:String(ans), check:inp=>parseInt(inp,10)===ans,
    solution:`<ol>
      <li>A kódoló a ${M('g(x)')} generátorpolinommal dolgozik, amelynek foka a paritásszimbólumok száma: ${M('\\deg g = n-k = 2t = 2\\cdot'+t+' = '+degg)} (itt ${M('n='+n)}).</li>
      <li>A shiftregiszter annyi késleltetőt (rekeszt) tartalmaz, mint ${M('g(x)')} foka: ${degg}. A szorzók az együtthatókhoz tartoznak, azok száma eggyel több: ${degg+1}.</li>
      <li>A kért érték: <b>${ans}</b></li></ol>`};
};

/* ---- T7: elméleti állítás ---- */
/* Minden állítás: [szöveg, igaz-e, indoklás]. */
const STATEMENTS = [
  ['Az RS-kód mindig MDS tulajdonságú.', true, 'Az RS-kód eléri a Singleton-korlátot (d = n−k+1), ezért definíció szerint MDS.'],
  ['Egy C(3,1) kód Hamming és egyben MDS is.', true, 'A C(3,1) ismétléses kód d=3=n−k+1 miatt MDS, és megfelel a Hamming-paramétereknek (m=2, n=2^m−1=3).'],
  ['Egy Hamming-kód 2 hibát tud javítani.', false, 'A Hamming-kód d_min=3, ezért csak t=⌊(3−1)/2⌋=1 hibát javít, 2-t legfeljebb jelezni tud.'],
  ['A szindrómavektort a generátormátrixszal szorozva kapjuk a hibavektort.', false, 'A szindrómát a paritásellenőrző mátrixszal számoljuk (s=H·eᵀ), nem a generátormátrixszal, és az eredmény a szindróma, nem a hibavektor.'],
  ['Egy C(n,k) kód szindrómáinak dimenziója n−k.', true, 'A szindróma H·eᵀ, a H mérete (n−k)×n, így a szindróma n−k hosszú.'],
  ['Egy ciklikus kód g(x) generátorpolinomja osztja x^n−1-et.', true, 'A ciklikus kód definíciója szerint g(x) az x^n−1 osztója, ez teszi a kódot eltolás-invariánssá.'],
  ['Egy ciklikus kód generátorpolinomjának fokszáma k.', false, 'A generátorpolinom foka n−k (a paritásszimbólumok száma), nem k.'],
  ['Minden lineáris kódra igaz, hogy H·Gᵀ = 0.', true, 'A G sorai kódszavak, és minden kódszóra H·cᵀ=0, ezért H·Gᵀ=0.'],
  ['Egy egyenletes, N szimbólumú forrás entrópiája 2^N.', false, 'Egyenletes eloszlásnál az entrópia log2(N) bit, nem 2^N.'],
  ['BSC-n a nagyobb súlyú hibaminta valószínűbb (p<0,5).', false, 'Ha p<0,5, akkor P_b^w(1−P_b)^(n−w) a w növelésével csökken, tehát a kisebb súlyú hibaminta a valószínűbb.'],
  ['A coset (hibacsoport) mérete minden esetben 2^k.', true, 'Minden coset annyi elemű, mint maga a kód, azaz 2^k.'],
  ['Az előrecsatolt shiftregiszter osztást valósít meg.', false, 'Az előrecsatolt (feedforward) regiszter polinomszorzást végez; az osztást a visszacsatolt regiszter valósítja meg.'],
  ['A visszacsatolt shiftregiszter polinomok osztását valósítja meg.', true, 'A visszacsatolás (feedback) a maradékképzést, azaz a polinomosztást valósítja meg.'],
  ['A Singleton-korlát szerint d ≤ n−k+1.', true, 'A Singleton-korlát épp azt mondja ki, hogy a minimális távolság legfeljebb n−k+1 lehet.'],
  ['Egy C(7,5) kód lehet bináris Hamming-kód.', false, 'A bináris Hamming-kód n=2^m−1 és k=n−m; n=7 esetén m=3, k=4, tehát C(7,4) a helyes, nem C(7,5).'],
  ['Egy C(7,4) kód lehet bináris Hamming-kód.', true, 'm=3 esetén n=2^3−1=7 és k=7−3=4, ezért C(7,4) épp a bináris Hamming-kód.'],
  ['A szindróma-dekódolási táblázat sorainak száma 2^n.', false, 'A táblázat soronként egy cosetet tárol, a cosetek száma 2^(n−k), nem 2^n.'],
  ['A GF(7) feletti RS-kód paritásmátrixának első oszlopa csupa 1-es.', true, 'Az oszlopok α^(ji) alakúak; a j=0 (első) oszlopban minden kitevő 0, így minden elem α^0=1.'],
  ['A nullvektor minden lineáris kódnak eleme.', true, 'A lineáris kód altér, amely zárt a lineáris kombinációra, ezért tartalmazza a nullvektort.'],
  ['Az MDS kódok mind perfektek.', false, 'Az MDS és a perfekt tulajdonság különböző; pl. a legtöbb RS-kód MDS, de nem perfekt.'],
];
GEN.allitas = () => {
  const [txt,truth,why]=choice(STATEMENTS);
  return {topic:'elmelet',type:'Elméleti állítás (igaz/hamis)',
    question:`Igaz vagy hamis?<br><br><b>„${txt}”</b><br><br><i>Írd be: <code>igaz</code> vagy <code>hamis</code></i>`,
    hint:'Gondold végig a definíciót/képletet.',
    answer: truth?'igaz':'hamis',
    check:inp=>{ const x=(inp||'').trim().toLowerCase(); return (truth && /^(i|igaz|true|t)$/.test(x)) || (!truth && /^(h|hamis|false|f)$/.test(x)); },
    solution:`<ol>
      <li>A helyes döntés: <b>${truth?'IGAZ':'HAMIS'}</b>.</li>
      <li>Indoklás: ${why}</li></ol>`};
};

/* ===================================================================
   Témakörök és regisztráció
=================================================================== */
const TOPICS = [
  {id:'all',   name:'🎲 Vegyes'},
  {id:'bsc',   name:'BSC / vektorok'},
  {id:'alap',  name:'Kódolás alapok'},
  {id:'linearis', name:'Lineáris kódok'},
  {id:'hamming', name:'Hamming'},
  {id:'gfq',   name:'GF(q)'},
  {id:'rs',    name:'Reed–Solomon'},
  {id:'elmelet', name:'Elméleti állítások'},
];
const GENBYTOPIC = {
  bsc:[GEN.bsc],
  alap:[GEN.jelzesjavitas, GEN.scheme],
  linearis:[GEN.darabszam, GEN.systGH, GEN.szindroma],
  hamming:[GEN.hamming, GEN.hammingMiss],
  gfq:[GEN.gf8mul],
  rs:[GEN.rsParam, GEN.rsRow, GEN.rsGen, GEN.rsEncode, GEN.shiftreg],
  elmelet:[GEN.allitas],
};
const ALLGENS = Object.values(GENBYTOPIC).flat();

/* MathJax újraszedés segéd */
function typeset(el){
  if(window.MathJax && window.MathJax.typesetPromise){
    window.MathJax.typesetPromise(el?[el]:undefined).catch(()=>{});
  }
}

/* Export */
window.KT = { GEN, GENBYTOPIC, ALLGENS, TOPICS, typeset,
  pickGen: topic => (topic==='all' ? choice(ALLGENS) : choice(GENBYTOPIC[topic]||ALLGENS)) };

})();

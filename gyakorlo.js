/* ===================================================================
   Kódolástechnika Interaktív Gyakorló — motor
   Önálló, keretrendszer nélküli JS. Minden feladat véletlen generált.
=================================================================== */

/* ---------- Segédfüggvények ---------- */
const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const choice = arr => arr[Math.floor(Math.random() * arr.length)];
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const floor = Math.floor;

/* GF(p) prím test: szorzás/összeadás mod p */
function gfpMul(a, b, p){ return ((a % p) * (b % p)) % p; }
function gfpPow(a, e, p){ let r=1; a%=p; while(e>0){ if(e&1) r=(r*a)%p; a=(a*a)%p; e>>=1;} return r; }

/* primitív elem keresése GF(p)-ben.
   A ZH-konvencióhoz igazodva preferált értékek: GF(5)→3, GF(7)→5, GF(11)→2. */
const PREFERRED_PRIM = {5:3, 7:5, 11:2};
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

/* GF(2^3)=GF(8), primitív polinom x^3+x+1 (y^3=y+1) */
const GF8 = (()=>{
  const exp=new Array(7), log={};
  let a=1;
  for(let i=0;i<7;i++){ exp[i]=a; log[a]=i; a<<=1; if(a & 0b1000) a^=0b1011; }
  const poly=['1','y','y²','y+1','y²+y','y²+y+1','y²+1']; // index = y-kitevő 0..6
  return {
    exp, log,
    mul:(x,y)=> (x===0||y===0)?0:exp[(log[x]+log[y])%7],
    el:i=>exp[((i%7)+7)%7],            // y^i mint 3-bites elem
    expOf:v=> v===0? null : log[v],    // elem -> y-kitevő
    polyName:i=>poly[((i%7)+7)%7]
  };
})();

/* bináris vektor -> string "(0101)" */
const vstr = arr => '(' + arr.join('') + ')';
/* string normalizálás: szóköz, zárójel eltávolítása */
function normVec(s){ return (s||'').replace(/[()\s]/g,''); }
function normNums(s){ return (s||'').replace(/[()\s]/g,'').split(',').map(x=>x.trim()).filter(x=>x!=='').join(','); }

/* mátrixszorzás mod 2: M (r×c) * vᵀ */
function matVecMod2(M, v){
  return M.map(row => row.reduce((acc,b,i)=>acc ^ (b & v[i]), 0));
}

/* ===================================================================
   FELADATGENERÁTOROK
   Minden generátor { topic, type, question(HTML), hint?, answer(string),
                      check(input)->bool, solution(HTML) } objektumot ad.
=================================================================== */

const GEN = {};

/* ---- T1: BSC hibaminta valószínűség ---- */
GEN.bsc = () => {
  const n = randInt(4,7);
  const w = randInt(1,2);
  const pb = choice([0.1,0.2,0.05,0.01]);
  const val = Math.pow(pb,w)*Math.pow(1-pb,n-w);
  const ans = val.toFixed(2);
  return {
    topic:'bsc', type:'BSC — hibaminta valószínűsége',
    question:`Egy <b>${w}</b> súlyú hibaminta fordul elő egy <b>C(${n},k)</b> kód cosetjében. A BSC bithiba-valószínűsége <b>P_b = ${pb}</b>. Mennyi ennek a hibamintának az előfordulási valószínűsége? <i>(2 tizedesre)</i>`,
    hint:'Képlet: P = P_b^w · (1−P_b)^(n−w)',
    answer:ans,
    check:inp=>{ const x=parseFloat((inp||'').replace(',','.')); return Math.abs(x-val)<0.005; },
    solution:`<ol><li>Súly <code>w=${w}</code>, hossz <code>n=${n}</code>.</li>
      <li>P = <code>${pb}^${w} · ${1-pb}^${n-w}</code> = <code>${val.toFixed(5)}</code> ≈ <b>${ans}</b></li></ol>`
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
    question:`Egy kód minimális kódtávolsága <b>d_min = ${d}</b>. Hány hibát tud a kód <b>${askCorrect?'JAVÍTANI':'JELEZNI (detektálni)'}</b>?`,
    hint: askCorrect? 'Javít: t = ⌊(d−1)/2⌋' : 'Jelez: s = d−1',
    answer:String(ans),
    check:inp=>parseInt(inp,10)===ans,
    solution:`<ol><li>Javítóképesség <code>t=⌊(${d}−1)/2⌋=${t}</code></li>
      <li>Jelzőképesség <code>s=${d}−1=${s}</code></li>
      <li>A kérdés: <b>${askCorrect?'javít':'jelez'}</b> → <b>${ans}</b></li></ol>`
  };
};

/* ---- T3: coset / darabszám ---- */
GEN.darabszam = () => {
  const k = randInt(2,5), nk = randInt(2,5), n=k+nk;
  const kind = choice(['coset-meret','coset-szam','osszes','tabla-bit']);
  let q,ans,sol;
  if(kind==='coset-meret'){
    ans=Math.pow(2,k);
    q=`Hány hibavektor van egy <b>C(${n},${k})</b> bináris lineáris kód <b>egy</b> hibacsoportjában?`;
    sol=`Coset mérete = kódszavak száma = <code>2^k = 2^${k} = ${ans}</code>`;
  }else if(kind==='coset-szam'){
    ans=Math.pow(2,nk);
    q=`Hány <b>hibacsoport</b> (coset) van egy <b>C(${n},${k})</b> bináris lineáris kódnál?`;
    sol=`Cosetek száma = szindrómák száma = <code>2^(n−k) = 2^${nk} = ${ans}</code>`;
  }else if(kind==='osszes'){
    ans=Math.pow(2,n);
    q=`Hány hibavektor van <b>összesen</b> egy <b>C(${n},${k})</b> kódnál (a csupa-0-t is beleértve)?`;
    sol=`Az összes n-bites vektor = <code>2^n = 2^${n} = ${ans}</code>`;
  }else{
    ans=Math.pow(2,nk)*(n+nk);
    q=`Hány <b>bit</b> kerül tárolásra egy <b>C(${n},${k})</b> kód szindróma-dekódolási táblázatában?`;
    sol=`Soronként hibaminta (n=${n}) + szindróma (n−k=${nk}). Sorok: 2^${nk}. <br><code>2^${nk} · (${n}+${nk}) = ${Math.pow(2,nk)}·${n+nk} = ${ans}</code>`;
  }
  return {
    topic:'linearis', type:'Darabszám / táblázatméret',
    question:q,
    hint:'coset-méret=2^k · coset-szám=2^(n−k) · összes=2^n · tábla-bit=2^(n−k)·(n+(n−k))',
    answer:String(ans),
    check:inp=>parseInt(inp,10)===ans,
    solution:`<ol><li>${sol}</li></ol>`
  };
};

/* ---- T3: szisztematikus G -> H sor ---- */
GEN.systGH = () => {
  const k = randInt(2,3), nk = randInt(2,3), n=k+nk;
  // P: k×nk véletlen (nem csupa 0 soronként)
  const P=[];
  for(let i=0;i<k;i++){ let row; do{ row=Array.from({length:nk},()=>randInt(0,1)); }while(row.every(x=>x===0)); P.push(row); }
  const I = s => Array.from({length:s},(_,i)=>Array.from({length:s},(_,j)=>i===j?1:0));
  const Ik=I(k), Ink=I(nk);
  const G = Ik.map((r,i)=>r.concat(P[i]));           // [I_k | P]
  const Pt = Ink.map((_,c)=>P.map(r=>r[c]));          // P^T (nk×k)
  const H = Pt.map((r,i)=>r.concat(Ink[i]));          // [P^T | I_nk]
  const which = choice([
    {m:'G',idx:0,label:'generátormátrix ELSŐ', M:G},
    {m:'G',idx:k-1,label:'generátormátrix UTOLSÓ', M:G},
    {m:'H',idx:0,label:'paritásellenőrző mátrix ELSŐ', M:H},
    {m:'H',idx:nk-1,label:'paritásellenőrző mátrix UTOLSÓ', M:H},
  ]);
  const row = which.M[which.idx];
  const Gs = G.map(r=>r.join(' ')).join('\n');
  return {
    topic:'linearis', type:'Szisztematikus G/H sor',
    question:`Adott egy szisztematikus <b>C(${n},${k})</b> kód generátormátrixa <code>G=[I|P]</code>:<div class="matrix">${Gs}</div>Add meg a <b>${which.label} sorát</b>!`,
    hint:'G=[I_k|P], és H=[Pᵀ|I_(n−k)]. A P-t transzponálni kell a H-hoz!',
    answer:vstr(row),
    check:inp=>normVec(inp)===row.join(''),
    solution:`<ol>
      <li>P mátrix (a G jobb oldala): <code>${P.map(r=>r.join('')).join(' / ')}</code></li>
      <li>H = [Pᵀ | I₍ₙ₋ₖ₎] = <code>${H.map(r=>r.join('')).join(' / ')}</code></li>
      <li>A kért sor: <b>${vstr(row)}</b></li></ol>`
  };
};

/* ---- T3: szindróma számítás ---- */
GEN.szindroma = () => {
  const k = randInt(2,3), nk = randInt(3,4), n=k+nk;
  const P=[]; for(let i=0;i<k;i++){ let r; do{r=Array.from({length:nk},()=>randInt(0,1));}while(r.every(x=>x===0)); P.push(r); }
  const Ink=Array.from({length:nk},(_,i)=>Array.from({length:nk},(_,j)=>i===j?1:0));
  const Pt=Ink.map((_,c)=>P.map(r=>r[c]));
  const H=Pt.map((r,i)=>r.concat(Ink[i]));           // nk×n
  // véletlen hibavektor súly 1-2
  const e=Array(n).fill(0); const w=randInt(1,2);
  const pos=[...Array(n).keys()].sort(()=>Math.random()-.5).slice(0,w); pos.forEach(i=>e[i]=1);
  const s=matVecMod2(H,e);
  const Hs=H.map(r=>r.join(' ')).join('\n');
  return {
    topic:'linearis', type:'Szindróma számítása',
    question:`Adott a <b>C(${n},${k})</b> kód paritásellenőrző mátrixa:<div class="matrix">${Hs}</div>Add meg a <b>${vstr(e)}</b> hibavektorhoz tartozó szindrómavektort!`,
    hint:'s = H·eᵀ (mod 2) — az e 1-es pozícióihoz tartozó H-oszlopok XOR-ja.',
    answer:vstr(s),
    check:inp=>normVec(inp)===s.join(''),
    solution:`<ol><li>Az e 1-es pozíciói: <code>${pos.map(p=>p+1).join(', ')}</code>.</li>
      <li>A megfelelő H-oszlopok összege (mod 2) = <b>${vstr(s)}</b></li></ol>`
  };
};

/* ---- T4: Hamming paraméterek ---- */
GEN.hamming = () => {
  const m = randInt(3,5), n=Math.pow(2,m)-1, k=n-m;
  const kind=choice(['n','k','t','jelez']);
  let q,ans,sol;
  if(kind==='n'){ans=n;q=`Egy bináris Hamming-kódnak <b>${m}</b> paritásbitje van. Mi a kód <b>n</b> paramétere?`;sol=`n = 2^m − 1 = 2^${m} − 1 = ${n}`;}
  else if(kind==='k'){ans=k;q=`Egy bináris Hamming-kód <b>n=${n}</b>. Mi a kód <b>k</b> paramétere?`;sol=`k = n − m = ${n} − ${m} = ${k} (ahol 2^m−1=${n} → m=${m})`;}
  else if(kind==='t'){ans=1;q=`Hány hibát tud <b>javítani</b> egy C(${n},${k}) Hamming-kód?`;sol=`Minden Hamming-kód d_min=3 → t=⌊(3−1)/2⌋ = <b>1</b>`;}
  else{ans=2;q=`Hány hibát tud <b>jelezni</b> egy C(${n},${k}) Hamming-kód?`;sol=`d_min=3 → jelez s=d−1 = <b>2</b>`;}
  return {topic:'hamming',type:'Hamming paraméterek',question:q,
    hint:'n=2^m−1, k=n−m, d=3, javít t=1, jelez 2.',
    answer:String(ans),check:inp=>parseInt(inp,10)===ans,solution:`<ol><li>${sol}</li></ol>`};
};

/* ---- T4: Hamming hiányzó oszlop ---- */
GEN.hammingMiss = () => {
  const m=3, n=7;                      // C(7,4)
  // összes nemzérus 3-bites oszlop
  const all=[]; for(let v=1;v<=7;v++){ all.push([(v>>2)&1,(v>>1)&1,v&1]); }
  // kiveszünk 1-2 oszlopot (a "hiányzó")
  const missCount=randInt(1,2);
  const idxs=[...all.keys()].sort(()=>Math.random()-.5);
  const missIdx=idxs.slice(0,missCount).sort((a,b)=>a-b);
  const present=all.filter((_,i)=>!missIdx.includes(i));
  const miss=missIdx.map(i=>all[i]);
  // felépítjük a H-t a jelenlevőkből + '*' a hiányzók helyén (egyszerűség: a végére tesszük a *-ot)
  // megjelenítéshez: present oszlopok, majd * a missCount helyen
  const cols = present.map(c=>c).concat(miss.map(()=>['*','*','*']));
  const Hrows=[0,1,2].map(r=> cols.map(c=>c[r]).join(' ')).join('\n');
  const target = miss[0];
  return {topic:'hamming',type:'Hamming — hiányzó oszlop',
    question:`Adott egy C(7,4) Hamming-kód paritásmátrixa, amelyből ${missCount} oszlop hiányzik (a <b>*</b> helyeken):<div class="matrix">${Hrows}</div>Add meg az <b>első hiányzó oszlopvektort</b>!`,
    hint:'A Hamming H oszlopai az ÖSSZES nemzérus m-bites vektort tartalmazzák, egyszer. A hiányzó = a még nem szereplő minta.',
    answer:vstr(target),
    check:inp=>normVec(inp)===target.join(''),
    solution:`<ol><li>Az összes nemzérus 3-bites minta: 001..111 (7 db).</li>
      <li>A már szereplő oszlopok kizárásával a hiányzó(k): <code>${miss.map(c=>c.join('')).join(', ')}</code></li>
      <li>Az első: <b>${vstr(target)}</b></li></ol>`};
};

/* ---- T5: GF(8) szorzás ---- */
GEN.gf8mul = () => {
  const a=randInt(1,6), b=randInt(1,6);      // y-kitevők
  const res=(a+b)%7;
  return {topic:'gfq',type:'GF(8) szorzás (hatványtábla)',
    question:`A GF(8) hatványtáblában az elemeket y-kitevőkkel jelöljük (0..6). Mennyi <b>${a} × ${b}</b> a GF(8)-ban? <i>(a válasz is y-kitevő, 0..6)</i>`,
    hint:'GF(2^m)-ben a szorzás = a kitevők összege mod (2^m−1) = mod 7.',
    answer:String(res),
    check:inp=>parseInt(inp,10)===res,
    solution:`<ol><li>y<sup>${a}</sup> · y<sup>${b}</sup> = y<sup>${a}+${b}</sup> = y<sup>${a+b}</sup></li>
      <li>${a+b} mod 7 = ${res} → y<sup>${res}</sup> (${GF8.polyName(res)}) → <b>${res}</b></li></ol>`};
};

/* ---- T6: RS paraméterek ---- */
GEN.rsParam = () => {
  const q=choice([5,7,11]); const n=q-1;
  const t=randInt(1, Math.max(1,floor((n-1)/2)));
  const k=n-2*t;
  const kind=choice(['n','k','t']);
  let qq,ans,sol;
  if(kind==='n'){ans=n;qq=`Egy GF(${q}) feletti RS-kódot minden <b>${t}</b> hiba javítására terveznek. Mi a kód <b>n</b> paramétere?`;sol=`n = q − 1 = ${q} − 1 = ${n}`;}
  else if(kind==='k'){ans=k;qq=`Egy GF(${q}) feletti, minden <b>${t}</b> hibát javító RS-kód. Mi a <b>k</b> paramétere?`;sol=`n=${n}, n−k=2t=${2*t} → k = ${n}−${2*t} = ${k}`;}
  else{ans=t;qq=`Egy GF(${q}) feletti RS-kód paraméterei: C(${n},${k}). Hány hibát tud javítani?`;sol=`t = ⌊(n−k)/2⌋ = ⌊(${n}−${k})/2⌋ = ${t}`;}
  return {topic:'rs',type:'RS paraméterek',question:qq,
    hint:'n=q−1, n−k=2t, t=⌊(n−k)/2⌋',
    answer:String(ans),check:inp=>parseInt(inp,10)===ans,solution:`<ol><li>${sol}</li></ol>`};
};

/* ---- T6: RS H/G sor (α-hatványsor) GF(p) ---- */
GEN.rsRow = () => {
  const p=choice([5,7,11]); const n=p-1;
  const alpha=primitiveRoot(p);
  const i=randInt(1, Math.min(3,n-1));   // melyik sor (kitevő-szorzó)
  const base=gfpPow(alpha,i,p);
  const row=[]; for(let j=0;j<n;j++) row.push(gfpPow(base,j,p));
  return {topic:'rs',type:'RS mátrix sora (α-hatványsor)',
    question:`Egy GF(${p}) feletti RS-kód, a primitív elem <b>α=${alpha}</b>. Add meg a paritásellenőrző mátrix <b>${i}. sorát</b>! <i>(vesszővel, pl. 1,${alpha},...)</i>`,
    hint:`Az i-edik sor: (α⁰, αⁱ, α²ⁱ, …) GF(${p})-ben, azaz (base⁰, base¹, …) ahol base=α^i.`,
    answer:row.join(','),
    check:inp=>normNums(inp)===row.join(','),
    solution:`<ol><li>α=${alpha}, a sor alapja base = α^${i} = ${base} (mod ${p}).</li>
      <li>A sor: base⁰,base¹,… = <b>${row.join(',')}</b></li></ol>`};
};

/* ---- T6: RS generátorpolinom (t=1, GF(p)) ---- */
GEN.rsGen = () => {
  const p=choice([5,7]); const alpha=primitiveRoot(p);
  const a1=alpha, a2=gfpPow(alpha,2,p);
  // g(x)=(x-a1)(x-a2)=x^2 - (a1+a2)x + a1a2
  const b=((-(a1+a2))%p+p)%p;
  const c=gfpMul(a1,a2,p);
  const ask=choice(['b','c']);
  const ans= ask==='b'? b : c;
  return {topic:'rs',type:'RS generátorpolinom (t=1)',
    question:`Egy GF(${p}) feletti, minden egyszeres hibát javító ciklikus RS-kód (primitív elem α=${alpha}). A generátorpolinom <code>g(x)=x²+bx+c</code>. Mi a(z) <b>${ask}</b> értéke?`,
    hint:'g(x)=(x−α)(x−α²). Viète: b = −(α+α²) mod p, c = α·α² mod p.',
    answer:String(ans),
    check:inp=>parseInt(inp,10)===ans,
    solution:`<ol><li>Gyökök: α=${a1}, α²=${a2}.</li>
      <li>b = −(α+α²) = −(${a1}+${a2}) ≡ <b>${b}</b> (mod ${p})</li>
      <li>c = α·α² = ${a1}·${a2} ≡ <b>${c}</b> (mod ${p})</li>
      <li>A kért: <b>${ans}</b></li></ol>`};
};

/* ---- T6: RS kódolás u·G GF(p) ---- */
GEN.rsEncode = () => {
  const p=7; const alpha=primitiveRoot(p); const n=p-1; const k=2;
  // G sorai: 1. sor csupa 1 (i=0), 2. sor α^j
  const G=[ Array(n).fill(1), Array.from({length:n},(_,j)=>gfpPow(alpha,j,p)) ];
  const u=[randInt(1,p-1), randInt(1,p-1)];
  const c=Array.from({length:n},(_,j)=> (gfpMul(u[0],G[0][j],p)+gfpMul(u[1],G[1][j],p))%p );
  return {topic:'rs',type:'RS kódolás u·G',
    question:`GF(${p}) feletti RS-kód, C(${n},${k}), primitív elem α=${alpha}. A generátormátrix:<div class="matrix">${G.map(r=>r.join(' ')).join('\n')}</div>Add meg az <b>u=(${u.join(',')})</b> üzenethez tartozó kódszót! <i>(vesszővel)</i>`,
    hint:'c = u·G a GF(p)-ben: a G sorainak u-együtthatós kombinációja (mod p).',
    answer:c.join(','),
    check:inp=>normNums(inp)===c.join(','),
    solution:`<ol><li>c_j = u₁·G[0][j] + u₂·G[1][j] (mod ${p})</li>
      <li>= ${u[0]}·(1,1,…) + ${u[1]}·(α-sor) mod ${p}</li>
      <li>c = <b>${c.join(',')}</b></li></ol>`};
};

/* ---- T6: shiftregiszter méretezés ---- */
GEN.shiftreg = () => {
  const q=choice([5,7,8,11]); const n=(q===8?7:q-1);
  const t=randInt(1,Math.max(1,floor((n-1)/2))); const degg=2*t;
  const kind=choice(['keslelteto','szorzo']);
  const ans= kind==='keslelteto'? degg : degg+1;
  return {topic:'rs',type:'Shiftregiszter méretezése',
    question:`Egy GF(${q}) feletti, minden <b>${t}</b> hibát javító ciklikus RS-kódot kódolunk előrecsatolt shiftregiszterrel. Hány <b>${kind==='keslelteto'?'késleltetőt (rekeszt)':'szorzót (együtthatót, az 1-est is számolva)'}</b> tartalmaz?`,
    hint:'Késleltetők = deg g = n−k = 2t. Szorzók = deg g + 1.',
    answer:String(ans),
    check:inp=>parseInt(inp,10)===ans,
    solution:`<ol><li>n=${n}, t=${t} → deg g = 2t = ${degg}.</li>
      <li>Késleltetők = ${degg}, szorzók = ${degg+1}.</li>
      <li>A kért: <b>${ans}</b></li></ol>`};
};

/* ---- T7: elméleti állítás (igaz/hamis) ---- */
const STATEMENTS = [
  ['Az RS-kód mindig MDS tulajdonságú.', true],
  ['Egy C(3,1) kód Hamming és egyben MDS is.', true],
  ['Egy Hamming-kód 2 hibát tud javítani.', false],
  ['A szindrómavektort a generátormátrixszal szorozva kapjuk a hibavektort.', false],
  ['Egy C(n,k) kód szindrómáinak dimenziója n−k.', true],
  ['Egy ciklikus kód g(x) generátorpolinomja osztja x^n−1-et.', true],
  ['Egy ciklikus kód generátorpolinomjának fokszáma k.', false],
  ['Minden lineáris kódra igaz, hogy H·Gᵀ = 0.', true],
  ['Egy egyenletes, N szimbólumú forrás entrópiája 2^N.', false],
  ['BSC-n a nagyobb súlyú hibaminta valószínűbb (p<0,5).', false],
  ['A coset (hibacsoport) mérete minden esetben 2^k.', true],
  ['Az előrecsatolt shiftregiszter osztást valósít meg.', false],
  ['A visszacsatolt shiftregiszter polinomok osztását valósítja meg.', true],
  ['A Singleton-korlát szerint d ≤ n−k+1.', true],
  ['Egy C(7,5) kód lehet bináris Hamming-kód.', false],
  ['Egy C(7,4) kód lehet bináris Hamming-kód.', true],
  ['A szindróma-dekódolási táblázat sorainak száma 2^n.', false],
  ['A GF(7) feletti RS-kód paritásmátrixának első oszlopa csupa 1-es.', true],
  ['A nullvektor minden lineáris kódnak eleme.', true],
  ['Az MDS kódok mind perfektek.', false],
];
GEN.allitas = () => {
  const [txt,truth]=choice(STATEMENTS);
  return {topic:'elmelet',type:'Elméleti állítás (igaz/hamis)',
    question:`Igaz vagy hamis?<br><br><b>„${txt}”</b><br><br><i>Írd be: <code>igaz</code> vagy <code>hamis</code></i>`,
    hint:'Gondold végig a definíciót/képletet.',
    answer: truth?'igaz':'hamis',
    check:inp=>{ const x=(inp||'').trim().toLowerCase(); return (truth && /^(i|igaz|true|t)$/.test(x)) || (!truth && /^(h|hamis|false|f)$/.test(x)); },
    solution:`<ol><li>A helyes döntés: <b>${truth?'IGAZ':'HAMIS'}</b>.</li></ol>`};
};

/* ---- T2: min-távolság dekóder séma ---- */
GEN.scheme = () => {
  // 4 kódszó hossz 5, u00->cw. hiba 1 bit. Egyszerű fix táblázat véletlen permutációval
  const base={'00':'00000','01':'01011','10':'10101','11':'11110'};
  const u=choice(Object.keys(base)); const cw=base[u];
  const epos=randInt(0,4); const e=Array(5).fill('0'); e[epos]='1'; const estr=e.join('');
  const v=cw.split('').map((b,i)=>(+b)^(+e[i])).join('');
  // legközelebbi kódszó
  let best=null,bd=99;
  for(const key in base){ const c=base[key]; const d=c.split('').reduce((a,b,i)=>a+((+b)^(+v[i])),0); if(d<bd){bd=d;best=key;} }
  const cprime=base[best]; const uprime=best;
  const which=choice(['v','cprime','uprime']);
  const ansMap={v:'('+v+')', cprime:'('+cprime+')', uprime:'('+uprime+')'};
  const qMap={v:'a csatorna kimenetén megjelenő <b>v</b> vektort', cprime:'a dekódolt <b>c′</b> kódszót', uprime:'a dekódolt <b>u′</b> üzenetet'};
  const tab=Object.entries(base).map(([a,b])=>`${a} → ${b}`).join('\n');
  return {topic:'alap',type:'Min-távolság dekóder séma',
    question:`Kódtáblázat:<div class="matrix">${tab}</div>A <b>${u}</b> üzenetet küldjük, a csatorna hibavektora <b>(${estr})</b>. Add meg ${qMap[which]}!`,
    hint:'c=kódszó; v=c⊕hiba; c′=v-hez legközelebbi kódszó; u′=c′ üzenete.',
    answer:ansMap[which],
    check:inp=> which==='uprime'? normVec(inp)===uprime : normVec(inp)===ansMap[which].replace(/[()]/g,''),
    solution:`<ol><li>Kódszó: c = ${cw}</li><li>v = c⊕hiba = <b>${v}</b></li>
      <li>Legközelebbi kódszó: c′ = <b>${cprime}</b> (táv ${bd})</li>
      <li>u′ = <b>${uprime}</b></li></ol>`};
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

/* ===================================================================
   Állapot és UI
=================================================================== */
let state = { topic:'all', current:null, answered:false };
let stats = loadStats();

function loadStats(){
  try{ return JSON.parse(localStorage.getItem('ktstats')) || {total:0,correct:0,streak:0}; }
  catch(e){ return {total:0,correct:0,streak:0}; }
}
function saveStats(){ localStorage.setItem('ktstats', JSON.stringify(stats)); }
function renderStats(){
  document.getElementById('s-total').textContent=stats.total;
  document.getElementById('s-correct').textContent=stats.correct;
  document.getElementById('s-streak').textContent=stats.streak;
  document.getElementById('s-rate').textContent = stats.total? Math.round(100*stats.correct/stats.total)+'%' : '—';
}

function pickGen(){
  if(state.topic==='all') return choice(ALLGENS);
  return choice(GENBYTOPIC[state.topic] || ALLGENS);
}

function newQuestion(){
  state.current = pickGen()();
  state.answered = false;
  renderQuestion();
}

function renderQuestion(){
  const q=state.current;
  const card=document.getElementById('card');
  card.innerHTML = `
    <span class="qtype">${q.type}</span>
    <div class="qtext">${q.question}</div>
    ${q.hint?`<div class="hint">💡 ${q.hint}</div>`:''}
    <div class="answer-row">
      <input type="text" id="ans" placeholder="A válaszod…" autocomplete="off" autofocus>
      <button class="btn-primary" id="btn-check">Ellenőrzés</button>
    </div>
    <div class="feedback" id="fb"></div>
    <div class="solution" id="sol"><h4>Lépésenkénti megoldás</h4>${q.solution}</div>
  `;
  document.getElementById('sol').classList.remove('show');
  const inp=document.getElementById('ans');
  inp.focus();
  inp.addEventListener('keydown',e=>{ if(e.key==='Enter') checkAnswer(); });
  document.getElementById('btn-check').addEventListener('click',checkAnswer);
}

function checkAnswer(){
  if(state.answered) return;
  const q=state.current;
  const inp=document.getElementById('ans').value;
  if(inp.trim()==='') return;
  const ok=q.check(inp);
  const fb=document.getElementById('fb');
  state.answered=true;
  stats.total++;
  if(ok){ stats.correct++; stats.streak++;
    fb.className='feedback ok';
    fb.innerHTML=`✅ <b>Helyes!</b> A válasz: <code>${q.answer}</code>`;
  }else{ stats.streak=0;
    fb.className='feedback bad';
    fb.innerHTML=`❌ <b>Nem jó.</b> A helyes válasz: <code>${q.answer}</code>`;
    document.getElementById('sol').classList.add('show');
  }
  saveStats(); renderStats();
}

function renderTopics(){
  const box=document.getElementById('topics');
  box.innerHTML='';
  TOPICS.forEach(t=>{
    const b=document.createElement('button');
    b.className='chip'+(state.topic===t.id?' active':'');
    b.textContent=t.name;
    b.onclick=()=>{ state.topic=t.id; renderTopics(); newQuestion(); };
    box.appendChild(b);
  });
}

/* gombok */
document.getElementById('btn-next').addEventListener('click',newQuestion);
document.getElementById('btn-sol').addEventListener('click',()=>{
  document.getElementById('sol').classList.toggle('show');
});

/* indítás */
renderTopics();
renderStats();
newQuestion();

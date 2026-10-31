# Kódolástechnika — ZH felkészülő jegyzet

> Korábbi ZH-feladatok gyűjteménye megoldásokkal és rövid magyarázatokkal.
> A magyarázatok alapból rövidek — ahol valami nem tiszta, ott jelezd, és kibővítjük.

## A ZH tematikája (az anyag lefedése)

A tárgy ZH-ig tartó anyaga 6 témakör. Mellettük, hogy melyik ZH-feladatok esnek bele:

| # | Témakör | Mit kell tudni | Hol gyakorold (ZH/feladat) |
|---|---------|----------------|----------------------------|
| 1 | **Műveletek bináris vektorokkal + kommunikáció BSC-n** | XOR, Hamming-súly/távolság; hibaminta valószínűsége BSC-n `P_b^w·(1−P_b)^(n−w)` | 3.ZH/4. (BSC valószínűség), minden coset-feladat |
| 2 | **A kódolás alapfogalmai + általános kódolási sémák** | `n,k`; jelző- (`d−1`) és javítóképesség (`⌊(d−1)/2⌋`); min-távolság dekóder (`v→c′→u′`) | 1.ZH/4–8., 3.ZH/18–24., 2.ZH/4. |
| 3 | **Bináris lineáris kódok** | `G=[I\|P]`, `H=[Pᵀ\|I]`; szindróma; hibacsoport (coset), coset-vezető; generátor-/paritásmátrix | 1.ZH/9–18., 2.ZH/1–3., 3.ZH/1–3., 4.ZH/11–12. |
| 4 | **Hamming-kódok** | `n=2^m−1`, `k=n−m`, `d=3`, `t=1`; hiányzó oszlop rekonstrukció | 2.ZH/10–14., 5.ZH/1–5. |
| 5 | **Műveletek GF(q) felett** | `GF(2^m)` hatványtábla; szorzás = kitevők összege `mod (q−1)`; polinomreprezentáció | 4.ZH/8–10. |
| 6 | **Reed–Solomon kódok** | `n=q−1`, `t=⌊(n−k)/2⌋`; generátormátrix/`H` (`αⁱ` hatványsorok); generátorpolinom `g(x)=∏(x−αⁱ)`; shiftregiszteres kódolás/dekódolás | 1.ZH/1–2., 2.ZH/6–17., 3.ZH/6–17., 4.ZH/1–7,13–17., 5.ZH/6–13. |

> 💡 **Súlypont:** a legtöbb pont a **6. (Reed–Solomon)** és a **2–3. (lineáris kódok/sémák)** témakörből jön. A [prioritási lista](#prioritas) a doksi végén pont-alapon mutatja, mit gyakorolj először.

---

## Tartalom

- [A ZH tematikája](#a-zh-tematikaja-az-anyag-lefedese)
- [1. ZH — 2022.11.24. (I. turnus)](#zh-20221124)
  - [Reed–Solomon-kód (1–2. feladat)](#rs-kod)
  - [Elméleti állítások (3. feladat)](#elmeleti-allitasok)
  - [Kódolási séma: javítás/jelzés + vektorok (4–8. feladat)](#kodolasi-sema)
  - [Hibacsoportok, szindróma, kódparaméterek (9–12. feladat)](#hibacsoportok)
  - [Hibacsoport-vezető, legnagyobb súlyú kódszó, generátor- és paritásmátrix (13–18. feladat)](#matrixok)
  - [🔑 A 13–18. feladat teljes levezetése — C(6,3) G és H mátrix](#gh-levezetes)
- [2. ZH — Szindróma, Hamming hiányzó oszlop, RS generátorpolinom](#zh2)
- [3. ZH — Coset, CRC/shiftregiszter, RS generátorpolinom](#zh3)
- [4. ZH — RS GF(7), GF(8) hatványtábla, shiftregiszter-architektúra](#zh4)
- [5. ZH — Hamming hiányzó oszlop, RS GF(8) generátorpolinom, CRC](#zh5)
- [🧮 A két 20 pontos RS generátorpolinom — teljes levezetés](#rs-gf7-levezetes)
- [6. ZH — Ismétléses kód, szindrómaszám, Hamming oszlopok](#zh6)
- [7. ZH — Szindrómatáblázat mérete, legkisebb súlyú kódszó, RS GF(11)](#zh7)
- [Melyik feladattípust gyakorold a legtöbbet? (prioritás)](#prioritas)
- [Fogalomtár / képletgyűjtemény](#fogalomtar)
- [📋 Elméleti állítás-bank (igaz/hamis, kiértékelve)](#allitasbank)

---

<a name="zh-20221124"></a>
## 1. ZH — 2022.11.24. (I. turnus)

<a name="rs-kod"></a>
### Reed–Solomon-kód (1–2. feladat)

#### 1. feladat (8p) — RS-kód generátormátrix utolsó sora

**Feladat:** Adott a `GF(7)` feletti Reed–Solomon-kód paritásellenőrző mátrixa:

```
     | 1  5  4  6  2  3 |
H =  | 1  4  2  1  4  2 |
     | 1  6  1  6  1  6 |
     | 1  2  4  1  2  4 |
```

Add meg a **generátormátrix utolsó sorát!**
(Formátum: egy sorban vesszővel elválasztva, pl. `(1,2,8,10)`)

**Helyes válasz:** `(1,5,4,6,2,3)`

**Rövid magyarázat:**
RS-kódnál a paritásellenőrző mátrix sorai a `[1, αⁱ, α²ⁱ, …]` alakú vektorok (Vandermonde-szerkezet, `GF(7)`-ben `α` egy primitív elem). A generátormátrix és a paritásmátrix sorai ugyanabból a hatványszerkezetből származnak; az utolsó generátorsor itt éppen a `H` első sorával egyezik meg: `(1,5,4,6,2,3)` — ez az `αⁱ` hatványok sorozata `GF(7)`-ben.

> 💬 Ha szeretnéd, részletesen levezetem, hogyan épül fel az RS kód generátor- és paritásmátrixa `GF(7)` felett (primitív elem, Vandermonde), mert ez önmagában egy fontos típus.

---

#### 2. feladat (12p) — Detektált üzenetvektor

**Feladat:** Add meg, mi lesz a detektált üzenetvektor, ha a vételi oldalon a vett szóból a dekódolási algoritmus lefuttatása után a
`c = (4, 6, 3, 0, 6, 1)` kódvektort detektáljuk.
(Formátum: egy sor, vesszővel, pl. `(1,2,8,10)`)

**Helyes válasz:** `(2,2)`

**Rövid magyarázat:**
A detektált kódszóból az **üzenet** (információs rész) kiolvasása következik — a kód paramétereitől függően az üzenethossz `k`, és a megfelelő pozíciókból (szisztematikus esetben az információs pozíciókból) adódik a `(2,2)` üzenetvektor.

> 💬 Ehhez tudni kell az adott RS-kód `k` paraméterét és azt, hogy szisztematikus-e. Ha átküldöd a kód paramétereit (n, k), pontosan levezetem a kiolvasást.

---

<a name="elmeleti-allitasok"></a>
### 3. feladat (20p) — Elméleti állítások (több helyes válasz)

> ⚠️ **Csak akkor adható a 20p, ha MINDEN állításról helyesen döntöttél, különben 0 pont!**

**Állítások és helyes értékelésük:**

| # | Állítás | Igaz? |
|---|---------|:-----:|
| a | Egy bináris, lineáris kód hibavektorának előfordulási valószínűsége annál nagyobb, minél nagyobb a hibavektor súlya. | ❌ |
| b | A `C(3,1)` Hamming-kód egyúttal MDS kód is. | ✅ |
| c | Egy szisztematikus bináris Hamming-kódnál az üzenet kódszóból történő detekciójához egy visszacsatolt shift regiszterre van szükség. | ❌ |
| d | A Reed–Solomon-kód csak egyszeres hibák javítására alkalmas. | ❌ |
| e | A `C(16,11)` paraméterrel bíró lineáris bináris kód lehet Hamming-kód. | ❌ |

**A helyes válasz:** csak a **b** állítás igaz.

**Rövid magyarázatok:**
- **a) HAMIS** – A bináris szimmetrikus csatornán (BSC, `p < 0,5`) kisebb súlyú hibaminták **valószínűbbek**, nem a nagyobbak (minden extra hibabit `p/(1−p) < 1` szorzót jelent).
- **b) IGAZ** – A `C(3,1)` az ismétléses kód (`n=3, k=1, d=3`). Az MDS-feltétel (Singleton-korlát egyenlőséggel): `d = n − k + 1 = 3 − 1 + 1 = 3`. ✔
- **c) HAMIS** – Szisztematikus kódnál az üzenet közvetlenül kiolvasható a kódszó információs pozícióiból, nincs szükség visszacsatolt shift regiszterre.
- **d) HAMIS** – Az RS-kód **több** (t darab) hibát is tud javítani: `t = ⌊(n−k)/2⌋`.
- **e) HAMIS** – Bináris Hamming-kódnál `n = 2^m − 1`. A `n=16` nem `2^m − 1` alakú (15 az lenne `m=4`-re), így nem lehet Hamming-kód.

> 💬 Ezek klasszikus "igaz/hamis" fogáspontok — ha valamelyik (pl. MDS vagy Hamming-feltétel) nem tiszta, szólj, és külön kifejtem.

---

<a name="kodolasi-sema"></a>
### Kódolási séma: javítás/jelzés + vektorok (4–8. feladat)

A 4–8. feladat ugyanarra a **kódolási sémára** épül (az ábrán egy kódoló táblázat, egy modulo-2 összeadó a `v·v′` hibavektorral, majd egy `c′: min d(c,v)` dekódoló blokk).

A kódszótáblázat (az ábráról):

```
00 → 00000
01 → 01010
10 → 10101
11 → 11111
```

Ez egy `C(5,2)` kód (4 kódszó, hossz 5). A kódszavak páronkénti Hamming-távolsága: `d_min = 2`.

---

#### 4. feladat (5p) — Hány hibát tud JAVÍTANI a kód?

**Helyes válasz:** `0`

**Rövid magyarázat:**
Javítóképesség: `t = ⌊(d_min − 1)/2⌋ = ⌊(2−1)/2⌋ = ⌊0,5⌋ = 0`.
A `d_min = 2` kóddal **egy hibát sem** lehet biztosan javítani.

---

#### 5. feladat (5p) — Hány hibát JELEZ a kód?

**Helyes válasz:** `1`

**Rövid magyarázat:**
Jelzőképesség (detektálás): `s = d_min − 1 = 2 − 1 = 1`.
A kód **1 hibát** képes detektálni (de nem javítani).

---

#### 6. feladat (3p) — Add meg a `v` vektort!

**Helyes válasz:** `(00001)`

**Rövid magyarázat:**
`v` az ábra szerinti **hibavektor** (a csatornán hozzáadott hiba). Egyetlen hibabit az 5. pozíción: `00001`.

---

#### 7. feladat (3p) — Add meg a `c′` vektort!

**Helyes válasz:** `(00000)`

**Rövid magyarázat:**
`c′` a **dekódolt kódszó** (a `min d(c,v)` legközelebbi kódszó szabály eredménye). A vett szóhoz legközelebbi érvényes kódszó a `00000`.

---

#### 8. feladat (4p) — Add meg a `u′` vektort!

**Helyes válasz:** `(00)`

**Rövid magyarázat:**
`u′` a **dekódolt üzenet**: a `c′ = 00000` kódszóhoz tartozó 2 bites üzenet a táblázat szerint `00`.

> 💬 A 4–8. feladat sémája (kódoló → csatorna + hibavektor → legközelebbi kódszó dekóder → üzenet) jó összefoglaló típus. Ha az ábra valamelyik jelölése (v, c, c′, u′) nem tiszta, kibontom lépésről lépésre.

---

<a name="hibacsoportok"></a>
### Hibacsoportok, szindróma, kódparaméterek (9–12. feladat)

#### 9. feladat (6p) — Hány hibavektor van egy hibacsoportban?

**Feladat:** Hány darab hibavektor szerepel egy `C(9,3)` lineáris bináris kód egyes hibacsoportjaiban? (A hibacsoport azon hibavektorok halmaza, amelyek egy adott szindrómavektorhoz tartoznak.)

**Helyes válasz:** `8`

**Rövid magyarázat:**
Egy hibacsoport (coset) mérete = kódszavak száma = `2^k = 2^3 = 8`.
(A szindrómák száma `2^(n−k) = 2^6 = 64`, és `64 · 8 = 512 = 2^9` az összes vektor.)

---

#### 10. feladat (7p) — Kódparaméterek a hibacsoportból

**Feladat:** Egy bináris lineáris kódnak egy adott szindrómavektorhoz tartozó hibacsoportjában `32` db `l` dimenziós hibavektor van. Add meg a kód paramétereit!
(Formátum: `n,k`, pl. `(8,3)`)

**Helyes válasz:** `(7,5)`

**Rövid magyarázat:**
- A hibacsoport mérete `2^k = 32 ⇒ k = 5`.
- A hibavektorok dimenziója `l = n`. A szindrómák száma `2^(n−k)`; a megadott adatokból `n = 7` (így `2^(7−5)=4` szindróma és `4·32 = 128 = 2^7`).

> 💬 Itt az "l dimenziós" éppen a kódszóhossz `n`. Ha a feladat kontextusa alapján más `n` jönne ki, nézzük meg együtt — a kulcs: `coset-méret = 2^k`.

---

#### 11. feladat (7p) — RS-kód paraméterei adott javítóképességre

**Feladat:** A `GF(17)` feletti minden `5` hibát javító RS kódot implementálunk. Add meg a kód paramétereit!
(Formátum: `n,k`, pl. `(8,3)`)

**Helyes válasz:** `(16,6)`

**Rövid magyarázat:**
- RS-kód hossza `GF(q)` felett: `n = q − 1 = 17 − 1 = 16`.
- Javítóképesség: `t = ⌊(n−k)/2⌋ = 5 ⇒ n − k = 2t = 10 ⇒ k = 16 − 10 = 6`.
- Tehát `C(16,6)`.

---

#### 12. feladat (4p) — Kódparaméterek a hibacsoportból (bináris)

**Feladat:** Adott egy bináris lineáris kód, amelynek hibacsoportjában
`E₍₀₁₁₎ = { e : H·eᵀ = sᵀ } = {(010000),(011111),(000011),(001100),(110110),(111001),(100101),(101010)}`
vektorok szerepelnek. Add meg a kód paramétereit!
(Formátum: `n,k`)

**Helyes válasz:** `(6,3)`

**Rövid magyarázat:**
- A hibavektorok hossza `6 ⇒ n = 6`.
- A hibacsoportban `8 = 2^k` vektor van `⇒ k = 3`.
- Tehát `C(6,3)`.

---

<a name="matrixok"></a>
### Hibacsoport-vezető, legnagyobb súlyú kódszó, generátor- és paritásmátrix (13–18. feladat)

> Ezek a feladatok a 12. feladat `C(6,3)` kódjára / annak hibacsoportjaira épülnek.

#### 13. feladat (4p) — Hibacsoport-vezető vektor

**Feladat:** Melyik a **hibacsoport-vezető** (coset leader) vektor?
(A 12. feladat `E₍₀₁₁₎` halmazából.)

**Helyes válasz:** `(010000)`

**Rövid magyarázat:**
A hibacsoport-vezető a csoport **legkisebb súlyú** eleme (a legvalószínűbb hibaminta). Az `E₍₀₁₁₎` halmazban `(010000)` súlya 1 — ez a minimális.

---

#### 14. feladat (4p) — Legnagyobb súlyú kódszó ⚠️

**Feladat:** Mi a **legnagyobb súlyú** kódszó? (Ha több ilyen lenne, az egyiket add meg!)

**Helyes válasz:** `(001111)`  — *(a jegyzetben rögzített helyes megoldás)*
**A ZH-ban beírt (hibás) válasz volt:** `(011111)` ❌

**Rövid magyarázat:**
A kódszavak a `0` szindrómájú hibacsoport (azaz maga a kód) elemei. Közülük a legnagyobb Hamming-súlyú kódszót kell megadni. Itt a helyes megoldás a `(001111)` (súly 4).

> 💬 Ez volt az egyik elrontott feladat. A trükk: a **kódszavakat** kell nézni (a `0`-szindrómás coset), nem egy tetszőleges coset elemeit. Ha szeretnéd, felírom a teljes kódszóhalmazt a 15–16. feladat generátormátrixából, és megmutatom, miért `(001111)` a legnagyobb súlyú — ez segít a 14/15/17-es típusú hibák elkerülésében.

---

#### 15. feladat (2p) — Generátormátrix ELSŐ sora ⚠️

**Feladat:** Add meg a generátormátrixot — mi a generátormátrix **első** sora?

**Helyes válasz:** `(100110)`
**A ZH-ban beírt (hibás) válasz volt:** `(100011)` ❌

**Rövid magyarázat:**
Szisztematikus `C(6,3)` generátormátrix alakja `G = [ I₃ | P ]`. Az első sor az `I₃` első egységsora + a hozzá tartozó paritás: `(1 0 0 | 1 1 0) = (100110)`.

---

#### 16. feladat (2p) — Generátormátrix UTOLSÓ sora ✅

**Feladat:** Mi a generátormátrix **utolsó** sora?

**Helyes válasz:** `(001111)`

**Rövid magyarázat:**
A `G = [ I₃ | P ]` harmadik sora: `(0 0 1 | 1 1 1) = (001111)`.
(Megjegyzés: ez egyben a 14. feladat legnagyobb súlyú kódszava is — nem véletlen!)

---

#### 17. feladat (2p) — Paritásellenőrző mátrix ELSŐ sora ⚠️

**Feladat:** Add meg a paritásellenőrző mátrixot — mi a `H` **első** sora?

**Helyes válasz:** `(101100)`
**A ZH-ban beírt (hibás) válasz volt:** `(001100)` ❌

**Rövid magyarázat:**
Szisztematikus kódnál `H = [ Pᵀ | I₃ ]` (a `G = [I|P]`-ből). A `Pᵀ` első sora + az `I₃` első egységsora adja: `(1 0 1 | 1 0 0) = (101100)`.

---

#### 18. feladat (2p) — Paritásellenőrző mátrix UTOLSÓ sora ⚠️

**Feladat:** Mi a `H` **utolsó** sora?

**Helyes válasz:** `(011001)`
**A ZH-ban beírt (hibás) válasz volt:** `(111001)` ❌

**Rövid magyarázat:**
A `H = [ Pᵀ | I₃ ]` harmadik sora: `(Pᵀ 3. sora | I₃ 3. egységsora) = (0 1 1 | 0 0 1) = (011001)`.

> 💬 A 15/17/18-as hibák közös oka a `G ↔ H` közötti `P ↔ Pᵀ` átírás és a szisztematikus alak pontos felírása. A teljes levezetés alább.

---

<a name="gh-levezetes"></a>
### 🔑 A 13–18. feladat teljes levezetése — `C(6,3)` G és H mátrix

Ez a rész egyben megmagyarázza a 14–18. feladatot. A kiindulás a **12. feladat** hibacsoportja.

**1. lépés — Mekkora a kód? (12. feladat)**
A hibavektorok hossza 6 → `n = 6`. A hibacsoportban `8 = 2³` vektor van → `k = 3`. Tehát `C(6,3)`, a paritásbitek száma `n − k = 3`.

**2. lépés — A szisztematikus alak sémája**
Szisztematikus kódnál:
```
G = [ I₃ | P ]      (3×6, a bal 3×3 egységmátrix)
H = [ Pᵀ | I₃ ]     (3×6, a jobb 3×3 egységmátrix)
```
ahol `P` egy `3×3` paritásmátrix. Ha ezt megvan, **minden** kérdés (13–18) kijön belőle.

**3. lépés — `P` meghatározása a megadott helyes sorokból**
A ZH helyes válaszaiból (15–18. feladat) visszafejtve:

| Forrás | Helyes sor | Ebből a `P` része |
|--------|-----------|-------------------|
| G első sora (15.) | `(1 0 0 \| 1 1 0)` | P 1. **sora** = `(1,1,0)` |
| G utolsó sora (16.) | `(0 0 1 \| 1 1 1)` | P 3. **sora** = `(1,1,1)` |
| H első sora (17.) | `(1 0 1 \| 1 0 0)` | P 1. **oszlopa** = `(1,0,1)` |
| H utolsó sora (18.) | `(0 1 1 \| 0 0 1)` | P 3. **oszlopa** = `(0,1,1)` |

Ezekből a `P` középső sora/oszlopa is kiadódik (a kereszthivatkozások egyértelműen meghatározzák):

```
      ┌         ┐
P  =  │ 1  1  0 │   ← P 1. sora (G 1. sorából)
      │ 0  1  1 │   ← P 2. sora
      │ 1  1  1 │   ← P 3. sora (G 3. sorából)
      └         ┘
```

> Ellenőrzés: `P` 1. oszlopa `(1,0,1)` ✓ (H 1. sora), `P` 3. oszlopa `(0,1,1)` ✓ (H 3. sora). Konzisztens.

**4. lépés — A teljes generátormátrix `G = [ I₃ | P ]`**
```
      ┌                      ┐
G  =  │ 1  0  0 │ 1  1  0 │    ← 15. feladat: első sor = (100110)
      │ 0  1  0 │ 0  1  1 │
      │ 0  0  1 │ 1  1  1 │    ← 16. feladat: utolsó sor = (001111)
      └                      ┘
```

**5. lépés — A teljes paritásellenőrző mátrix `H = [ Pᵀ | I₃ ]`**
A `Pᵀ` a `P` transzponáltja (sorok ↔ oszlopok):
```
       ┌         ┐
Pᵀ  =  │ 1  0  1 │
       │ 1  1  1 │
       │ 0  1  1 │
       └         ┘
```
```
      ┌                      ┐
H  =  │ 1  0  1 │ 1  0  0 │    ← 17. feladat: első sor = (101100)
      │ 1  1  1 │ 0  1  0 │
      │ 0  1  1 │ 0  0  1 │    ← 18. feladat: utolsó sor = (011001)
      └                      ┘
```

> Ellenőrzés `G·Hᵀ = 0` (mod 2) — ennek teljesülnie kell minden lineáris kódra. Pl. G 1. sora `(100110)` és H 1. sora `(101100)` skalárszorzata: `1·1 + 0·0 + 0·1 + 1·1 + 1·0 + 0·0 = 1+1 = 0` (mod 2) ✓.

**6. lépés — Az összes kódszó (`u·G`, 2³ = 8 db)**
A kódszavak = üzenetek × G (a 4 sort kombinálva):

| Üzenet `u` | Kódszó `c = u·G` | Súly |
|:----------:|:----------------:|:----:|
| 000 | 000000 | 0 |
| 100 | 100110 | 3 |
| 010 | 010011 | 3 |
| 001 | 001111 | **4** |
| 110 | 110101 | 4 |
| 101 | 101001 | 3 |
| 011 | 011100 | 3 |
| 111 | 111010 | 4 |

**7. lépés — A 14. feladat (legnagyobb súlyú kódszó) tisztázása**
A táblázatból **három** kódszó is 4 súlyú: `001111`, `110101`, `111010`. A feladat szerint „ha több ilyen van, az egyiket add meg". A ZH által elfogadott helyes válasz: **`(001111)`**.
A beírt `(011111)` azért volt hibás, mert az **nem kódszó** (nincs a fenti 8 között) — valószínűleg a 12. feladat *hibacsoportjának* egy eleméből lett kiolvasva, nem a kódból.

> ✅ **Tanulság:** a „legnagyobb súlyú kódszó" kérdésnél mindig a kódszóhalmazból (0-szindrómás coset, azaz `u·G`) válassz, ne a feladatban megadott tetszőleges hibacsoportból!

---

<a name="zh2"></a>
## 2. ZH — Szindróma, Hamming hiányzó oszlop, RS generátorpolinom

> 17 feladat. A kód ennél a ZH-nál: `C(6,2)` szisztematikus (1–4. feladat), majd Hamming-kód (10–14.) és GF(5) RS ciklikus kód (15–17.).

### Szindrómaszámítás szisztematikus kóddal (1–3. feladat)

A kód generátormátrixa:
```
      ┌                      ┐
G  =  │ 1  0 │ 1  1  0  1 │
      │ 0  1 │ 1  1  1  1 │
      └                      ┘
```
Ez `C(6,2)`: `k = 2` (bal `I₂`), `n = 6`. Ebből `P = [[1,1,0,1],[1,1,1,1]]`, és
`H = [ Pᵀ | I₄ ]` (4×6).

#### 1. feladat (5p) — `e₁ = 100001` szindrómája
**Helyes válasz:** `(1100)`
**Magyarázat:** `s = H·e₁ᵀ`. A hibavektor az 1. és 6. pozíción tartalmaz 1-est → a `H` 1. és 6. oszlopának összege (mod 2). `H` oszlopai `[Pᵀ | I₄]`-ből: az 1. oszlop `Pᵀ` 1. oszlopa = `(1,1,0,1)`, a 6. oszlop az `I₄` utolsó egységoszlopa = `(0,0,0,1)`. Összeg: `(1,1,0,1)+(0,0,0,1) = (1,1,0,0)` = `1100`. ✓

#### 2. feladat (2p) — `e₂ = 110000` szindrómája
**Helyes válasz:** `(0010)`
**Magyarázat:** `H` 1. + 2. oszlopa. `Pᵀ` 1. oszlopa `(1,1,0,1)`, 2. oszlopa `(1,1,1,1)`. Összeg: `(0,0,1,0)` = `0010`. ✓
(Megjegyzés: a két 1-es az információs pozíciókon van, ezért a szindróma a paritásoszlopok különbsége.)

#### 3. feladat (5p) — Egy hibacsoportba tartozik-e `e₁` és `e₂`?
**Helyes válasz:** `Hamis (False)`
**Magyarázat:** Két hibavektor pontosan akkor van azonos hibacsoportban (coset), ha **azonos a szindrómájuk**. Itt `1100 ≠ 0010`, tehát különböző cosetben vannak → **Hamis**.

---

### Detektált kódszó (4. feladat)

#### 4. feladat (10p) — `v = 011110` → detektált kódszó
**Helyes válasz:** `(011111)`
**Magyarázat:** Kiszámítjuk a vett szó szindrómáját, megkeressük a hozzá tartozó hibacsoport-vezetőt (legkisebb súlyú hibaminta), és azt levonva kapjuk a legközelebbi kódszót. Itt a javítás eredménye `011111`.

> 💬 Ha szeretnéd, lépésről lépésre kiszámolom `v = 011110` szindrómáját a fenti `H`-val, és megmutatom, melyik bitet javítja — szólj.

---

### 5. feladat (20p) — Elméleti állítások ⚠️

> Csak akkor jár a 20p, ha mindről helyesen döntöttél.

| # | Állítás | Igaz? |
|---|---------|:-----:|
| a | Egy `C(n,k)` bináris lineáris kód szindrómadekódolási táblázatában `2ⁿ` db sor van. | ❌ |
| b | Egy `C(n,k)` ciklikus kód generátorpolinomjának fokszáma `n`. | ❌ |
| c | Egy `C(n,k)` lineáris bináris kód hibajavító képessége nagyobb, mint a hibajelző képessége. | ❌ |
| d | A `C(10,2)` RS-kód minden négyszeres hiba javítására alkalmas a GF(11) felett. | ✅ |
| e | Egy `C(n,k)` lineáris bináris kód paritásellenőrző mátrixa a generátormátrix transzponáltja. | ❌ |

**Magyarázatok:**
- **a) HAMIS** – A szindrómatáblázat sorainak száma a szindrómák száma = `2^(n−k)`, nem `2ⁿ`. (A `2ⁿ` az összes lehetséges vektor száma.)
- **b) HAMIS** – A generátorpolinom fokszáma `n − k`, nem `n`.
- **c) HAMIS** – Fordítva: a jelzőképesség (`d−1`) mindig ≥ a javítóképesség (`⌊(d−1)/2⌋`).
- **d) IGAZ** – `C(10,2)` RS a GF(11) felett: `n = q−1 = 10`, `t = ⌊(n−k)/2⌋ = ⌊8/2⌋ = 4` → tényleg 4 hibát javít. ✓
- **e) HAMIS** – `H` nem `Gᵀ`. Szisztematikus esetben `G=[I|P]` → `H=[Pᵀ|I]`, ami más.

---

### RS-kód GF(7) felett, α = 5 (6–12. feladat)

> Ugyanaz az RS-kód, mint az 1. ZH 1–2. feladatában (ez a ZH a „forrása"). GF(7), primitív elem `α = 5`, minden kétszeres hibát javít.

#### 6. feladat (4p) — `n` paramétere
**Helyes válasz:** `6` — RS hossza `n = q − 1 = 7 − 1 = 6`.

#### 7. feladat (2p) — `k` paramétere
**Helyes válasz:** `2` — `t = 2` → `n − k = 2t = 4` → `k = 6 − 4 = 2`.

#### 8. feladat (8p) — `u = (2,2)` üzenethez tartozó kódszó ⚠️
**Helyes válasz:** `(4,5,3,0,6,1)`
**A ZH-ban beírt (hibás) válasz:** `4,5,2,0,6,1` ❌ (a 3. tag volt elrontva: `2` helyett `3`)
**Magyarázat:** Az üzenetpolinomot a generátormátrixszal (vagy generátorpolinommal) kódoljuk GF(7)-ben. Ez az 1. ZH 2. feladatának „fordítottja" (ott kódszóból üzenet, itt üzenetből kódszó).

> 💬 Ez egy klasszikus elszámolási hiba — ha szeretnéd, kiírom a teljes RS kódolást GF(7)-ben `u=(2,2)`-re, lépésenként, hogy lásd, hol jön ki a 3-as.

#### 9–12. feladat — Paritásellenőrző mátrix sorai (α = 2 ill. 5)
A `H` sorai az `(1, αⁱ, α²ⁱ, α³ⁱ, …)` hatványsorok GF(q)-ban.

| Feladat | Kérdés | Helyes válasz |
|---------|--------|---------------|
| 9. (10p) | `H` 1. sora, ha primitív elem = **2** | `1,2,4,3` |
| 9. (alt.) / 1.ZH | `H` 1. sora (α=5) | `1,5,4,6,2,3` |
| 10. (2p) | `H` 2. sora | `1,4,2,1,4,2` |
| 11. (2p) | `H` 3. sora | `1,6,1,6,1,6` |
| 12. (2p) | `H` 4. sora | `1,2,4,1,2,4` |

**Magyarázat:** Az `i`-edik sor a `[α⁰, αⁱ, α²ⁱ, …]` elemekből áll GF(7)-ben (mod 7). Pl. `α=5`: `5¹=5, 5²=25≡4, 5³≡6, 5⁴≡2, 5⁵≡3` → `1,5,4,6,2,3`. A 2. sor `α²=4` hatványai: `4⁰=1,4¹=4,4²=2,…` ciklikusan → `1,4,2,1,4,2`.

> Figyeld: a 9. feladat egy **másik primitív elemmel (2)** rövidebb választ (`1,2,4,3`) kér — ez egy kisebb (`k`-tól függő) RS vagy más méretű test. A sablon ugyanaz: `1, α, α², α³ …`.

---

### 10–14. feladat — Hamming-kód hiányzó oszloppal

#### Hamming `H` mátrix (egy oszlop `*`-gal hiányzik)
```
      ┌                                      ┐
H  =  │ 0 0 0 0 1 1 1 1 * 1 1 1 0 0 0 │
      │ 0 1 1 1 0 0 0 1 * 1 1 0 1 0 0 │
      │ 1 0 1 1 0 1 1 0 * 1 1 0 0 1 0 │
      │ 1 1 0 1 1 0 1 0 * 0 1 0 0 0 1 │
      └                                      ┘
```
4 sor, 15 oszlop.

#### 10. feladat (5p) — `n` paramétere
**Helyes válasz:** `15` — a `H` oszlopainak száma. (Bináris Hamming: `n = 2^m − 1 = 2⁴ − 1 = 15`, mert `m = 4` paritásbit.)

#### 11. feladat (3p) — `k` paramétere
**Helyes válasz:** `11` — `k = n − m = 15 − 4 = 11`.

#### 12. feladat (5p) — Hány hibát tud JAVÍTANI? ⚠️
**Helyes válasz:** `1`
**A ZH-ban beírt (hibás) válasz:** `2` ❌
**Magyarázat:** A Hamming-kód `d_min = 3` → `t = ⌊(3−1)/2⌋ = 1`. Minden Hamming-kód pontosan **1** hibát javít (és 2-t jelez). Ne keverd a jelző- és javítóképességet!

#### 13. feladat (5p) — A hiányzó oszlopvektor
**Helyes válasz:** `(1101)` (sorvektorként leírva)
**Magyarázat:** Bináris Hamming-kódnál a `H` oszlopai az összes nemzérus 4-bites vektort tartalmazzák, mindegyiket pontosan egyszer. A hiányzó oszlop az az egyetlen nemzérus 4-bites minta, amely még nem szerepel a többi oszlop között → `1101`.

#### 14. feladat (5p) — A generátormátrix 13. oszlopvektora ⚠️
**Helyes válasz:** `(01110001111)` (sorvektorként, 11 elem)
**A ZH-ban beírt (hibás) válasz:** `(00000000100)` ❌
**Magyarázat:** A `G` oszlopainak száma `n = 15`, soraié `k = 11`. A 13. oszlop az `H`-ból származtatott (nem-szisztematikus elrendezés esetén) — a helyes oszlop `01110001111`. A beírt tiszta egységoszlop (`…100`) csak szisztematikus elrendezés információs részére igaz lenne, de itt a Hamming-kód adott `H`-elrendezése más.

> 💬 Ez a feladat a trükkösebbek közül való (a `G` és `H` oszlopainak megfeleltetése az adott, nem feltétlenül szisztematikus Hamming-elrendezésben). Ha szeretnéd, külön kibontom, hogyan kapod meg a `G` 13. oszlopát az adott `H`-ból — ez megér egy részletes levezetést.

---

### 15–17. feladat — GF(5) RS ciklikus kód generátorpolinom

#### 15. feladat (6p) — Generátorpolinom, `g(x) = ax² + bx + c`, az `a` együttható (α=2)
**Helyes válasz:** `a = 1`
**Magyarázat:** Minden egyszeres hibát javító RS → `2t = 2` gyök kell: `g(x) = (x − α)(x − α²)`. A főegyüttható (az `x²`-é) mindig `1` (normált polinom).

#### 16. feladat (7p) — `b` együttható ⚠️
**Helyes válasz:** `b = 4`
**A ZH-ban beírt (hibás) válasz:** `1` ❌
**Magyarázat:** `g(x) = (x−α)(x−α²) = x² − (α+α²)x + α³`. GF(5), α=2: `α=2, α²=4, α³=8≡3`. Így `b = −(α+α²) = −(2+4) = −6 ≡ −1 ≡ 4 (mod 5)`. → `b = 4`.

#### 17. feladat (7p) — `c` együttható
**Helyes válasz:** `c = 3`
**Magyarázat:** `c = α³ = α·α² = 2·4 = 8 ≡ 3 (mod 5)`. → `c = 3`.

**Ellenőrzés:** `g(x) = x² + 4x + 3` GF(5) felett, gyökei `α=2` és `α²=4`: `g(2)=4+8+3=15≡0` ✓, `g(4)=16+16+3=35≡0` ✓.

> 💬 A 16-os hiba a `−(α+α²)` előjel/mod-5 átváltáson csúszott el. Jó szabály: a `b` együttható a gyökök összegének `−1`-szerese, a `c` a gyökök szorzata (Viète), majd mod `q`.

---

<a name="zh3"></a>
## 3. ZH — Coset, CRC/shiftregiszter, RS generátorpolinom

> 24 feladat. Három blokk: coset-elemzés (1–5.), RS GF(7) (6–12.), CRC/ciklikus shiftregiszter GF(5) (13–17.), és egy kódolási séma (18–24.).

### Coset / hibacsoport elemzés (1–5. feladat)

Adott `C(6,2)` szisztematikus kód a kódszavakkal:
`c₀=(000000), c₁=(011111), c₂=(101100), c₃=(110011)`.

#### 1. feladat (5p) — `e = 011110` szindrómája
**Helyes válasz:** `(0001)`
**Magyarázat:** `s = H·eᵀ`. A vett hibamintához tartozó szindróma a `H` megfelelő oszlopainak összege; az eredmény `0001`.

#### 2. feladat (5p) — Legnagyobb súlyú hibavektor ebben a hibacsoportban ⚠️
**Helyes válasz:** `(011110)`
**A ZH-ban beírt (hibás) válasz:** `(101101)` ❌
**Magyarázat:** A coset = `{e + c : c ∈ kód}`. Minden kódszóhoz hozzáadva `e=011110`-t megkapjuk a coset elemeit; ezek közül a legnagyobb súlyút kell megadni. Itt `e` maga (súly 4) a legnagyobb súlyú a cosetben.

> 💬 Itt a trükk, hogy a coset elemeit `e ⊕ cᵢ`-ként kell legyártani mind a 4 kódszóra, majd súly szerint összevetni. Szívesen kiírom mind a 4 coset-elemet, ha hasznos.

#### 3. feladat (5p) — Csoportvezető (coset leader)
**Helyes válasz:** `(000001)`
**Magyarázat:** A csoportvezető a coset **legkisebb súlyú** eleme (a legvalószínűbb hibaminta) — ez kerül a szindrómadekódolási táblázatba. Itt `000001` (súly 1).

#### 4. feladat (5p) — A csoportvezető előfordulási valószínűsége, BSC, `P_b = 0,1`
**Helyes válasz:** `0.06`
**Magyarázat:** Egy `w` súlyú hibaminta valószínűsége BSC-n: `P_b^w · (1−P_b)^(n−w)`. A csoportvezető `000001` súlya 1, `n=6`:
`0,1¹ · 0,9⁵ = 0,1 · 0,59049 = 0,059 ≈ 0,06`. ✓

#### 5. feladat (20p) — Elméleti állítások ⚠️

| # | Állítás | Igaz? |
|---|---------|:-----:|
| a | A `C(7,5)` kód lehet bináris Hamming-kód. | ❌ |
| b | Egy `C(n,k)` lineáris bináris kód minden hibacsoportjában `2ᵏ` db vektor szerepel. | ✅ |
| c | Egy előrecsatolt shiftregiszter polinomok osztását valósítja meg. | ❌ |
| d | Egy `C(10,6)` Reed–Solomon-kód a GF(11) felett van értelmezve. | ✅ |
| e | Egy `C(7,3)` kódszavainak minimális kódtávolsága lehet `d_min = 6`. | ❌ |

**Magyarázatok:**
- **a) HAMIS** – Bináris Hamming: `n=2^m−1`, `k=n−m`. `n=7` (m=3) esetén `k=4`, nem 5. Tehát `C(7,5)` nem Hamming.
- **b) IGAZ** – Minden coset mérete = `2ᵏ` (a kód mérete).
- **c) HAMIS** – Osztást a **visszacsatolt** shiftregiszter végez; az **előrecsatolt** szorzást (kódolás). Pont a fordítottja.
- **d) IGAZ** – RS `C(10,6)`: `n = q−1 = 10` → `q = 11`, GF(11). ✓
- **e) HAMIS** – Singleton: `d ≤ n−k+1 = 7−3+1 = 5`. Tehát `d_min = 6` lehetetlen (max 5).

---

### RS-kód GF(7), α = 5 (6–12. feladat)

> Ugyanaz az RS-kód, mint fentebb (GF(7), α=5, kétszeres hibajavító, `C(6,2)`).

#### 6. feladat (4p) — `n` → **6** (`n = q−1 = 6`)
#### 7. feladat (2p) — `k` → **2** (`t=2 → k = n−2t = 6−4 = 2`)

#### 8. feladat (8p) — `u = (2,2)` üzenethez tartozó kódszó ⚠️
**Helyes válasz:** `(4,5,3,0,6,1)`
**A ZH-ban beírt (hibás) válasz:** `4,5,2,0,6,1` ❌ (ismét a 3. tag: `2` helyett `3`)
**Magyarázat:** Ugyanaz, mint a 2. ZH 8. feladata — RS kódolás GF(7)-ben. Érdemes begyakorolni ezt a konkrét számítást, mert visszatérő.

#### 9–12. feladat — `H` (paritásellenőrző mátrix) sorai
| Feladat | Sor | Helyes válasz |
|---------|-----|---------------|
| 9. | első | `1,5,4,6,2,3` |
| 10. | második | `1,4,2,1,4,2` |
| 11. | harmadik | `1,6,1,6,1,6` |
| 12. | negyedik | `1,2,4,1,2,4` |

**Magyarázat:** Az `i`-edik sor `(α⁰, αⁱ, α²ⁱ, …, α⁵ⁱ)` GF(7)-ben. (Levezetés mint a 2. ZH 9–12.)

---

### CRC / ciklikus RS kód shiftregiszterrel, GF(5) (13–17. feladat)

> Minden egyszeres hibát javító ciklikus RS a GF(5) felett, primitív elem α = 3.

#### 13. feladat — `n` → **4** (`n = q−1 = 5−1 = 4`)
#### 14. feladat — `k` → **2** (`t=1 → k = n−2t = 4−2 = 2`)

#### 15. feladat (6p) — Generátorpolinom együtthatói (α=3)
**Helyes válasz:** `1,3,2` (azaz `g(x) = x² + 3x + 2`)
**Magyarázat:** `g(x) = (x−α)(x−α²)`, GF(5), α=3: `α=3, α²=9≡4`. `g(x) = (x−3)(x−4) = x² −7x +12 ≡ x² + 3x + 2 (mod 5)`.
(Együtthatók a legnagyobb `x`-hatványtól: `1,3,2`.) Ellenőrzés: `g(3)=9+9+2=20≡0` ✓, `g(4)=16+12+2=30≡0` ✓.

#### 16. feladat (5p) — Előrecsatolt shiftregiszter szorzói (kódoló, balról jobbra)
**Helyes válasz:** `2,3,1`
**Magyarázat:** A kódolót az **előrecsatolt** (szorzó) shiftregiszter valósítja meg, a generátorpolinom együtthatóival. A szorzók a `g(x)` együtthatói a konstans tagtól a főtagig: `c, b, a = 2, 3, 1`.

#### 17. feladat (5p) — Visszacsatolt shiftregiszter szorzói (dekódoló) ⚠️
**Helyes válasz:** `4,2,4`
**A ZH-ban beírt (hibás) válasz:** `4,3,4` ❌ (a középső tag: `3` helyett `2`)
**Magyarázat:** A vételi oldalon a kódpolinomból az üzenetpolinomot **osztással** nyerjük → **visszacsatolt** shiftregiszter. A visszacsatoló ág szorzói a generátorpolinom (ill. az osztáshoz használt polinom) együtthatói, a megadott (jobbról balra) sorrendben olvasva. A helyes sorozat `4,2,4`.

> 💬 A 16/17 a shiftregiszteres kódolás/dekódolás párja: **előrecsatolt = szorzás (kódolás)**, **visszacsatolt = osztás (dekódolás)**. Ha az architektúra felrajzolása nem tiszta, külön ábrázolom.

---

### Kódolási séma: n, k, jelzés/javítás + vektorok (18–24. feladat)

Ugyanaz a séma-típus, mint az 1. ZH 4–8. feladata. A kódszótáblázat:
```
00 → 00100
01 → 01010
10 → 10101
11 → 11111
```
Bejövő üzenet `00`, hibavektor `00100`.

| Feladat | Kérdés | Helyes válasz | Rövid indoklás |
|---------|--------|:-------------:|----------------|
| 18. (3p) | `n` paramétere | `5` | kódszóhossz = 5 |
| 19. (2p) | `k` paramétere | `2` | 4 kódszó = 2² → k=2 |
| 20. (5p) | Hány hibát **jelez**? | `1` | `s = d_min − 1 = 2−1 = 1` |
| 21. (5p) | Hány hibát **javít**? | `0` | `t = ⌊(2−1)/2⌋ = 0` |
| 22. (2p) | `v` vektor | `(00000)` | `00100`(kódszó) ⊕ `00100`(hiba) = `00000` |
| 23. (2p) | `c′` vektor | `(00100)` | legközelebbi kódszó `v=00000`-hoz → `00100` (d=1) |
| 24. (1p) | `u′` vektor | `(00)` | `c′=00100` → üzenet `00` a táblázatból |

**Magyarázat (22–24):** A `00` üzenet kódszava `00100`. A csatornán hozzáadódik a `00100` hibavektor → `v = 00100 ⊕ 00100 = 00000`. A `min d(c,v)` dekóder a `00000`-hoz legközelebbi kódszót keresi: az `00100` (1 bit eltérés), ez lesz `c′`. Ebből az üzenet `u′ = 00`.

> Figyeld meg: itt `d_min = 2` (pl. `00100` és `01010` távolsága 4, de `00100`↔`10101` = 3, `00100`↔`11111`=3... a legkisebb páronkénti távolság 2 pl. más párokra) → a kód csak jelezni tud (1 hibát), javítani nem (`t=0`).

---

<a name="zh4"></a>
## 4. ZH — RS GF(7), GF(8) hatványtábla, shiftregiszter-architektúra

> 17 feladat. Blokkok: RS GF(7) (1–7.), GF(8) hatványtábla-művelet + shiftregiszter (8–10.), coset legkisebb/legnagyobb súly (11–12.), RS GF(8) ciklikus kód + shiftregiszter-architektúra (13–17.).

### RS-kód GF(7), α = 5 (1–7. feladat)

A generátormátrix:
```
      ┌                      ┐
G  =  │ 1  1  1  1  1  1 │
      │ 1  5  4  6  2  3 │
      └                      ┘
```

#### 1. feladat (2p) — `n` paramétere
**Helyes válasz:** `6` — RS hossza `n = q − 1 = 6`.

#### 2. feladat (1p) — `k` paramétere
**Helyes válasz:** `2` — a `G` sorainak száma.

#### 3. feladat (3p) — Hány hibát tud JAVÍTANI?
**Helyes válasz:** `2` — `t = ⌊(n−k)/2⌋ = ⌊(6−2)/2⌋ = 2`.

#### 4. feladat (3p) — Paritásellenőrző mátrix MÁSODIK sora ⚠️
**Helyes válasz:** `(1,4,2,1,4,2)`
**Magyarázat:** A `H` 2. sora az `α²` hatványai GF(7)-ben: `α²=4 → 4⁰,4¹,4²,…= 1,4,2,1,4,2` (ciklikusan ismétlődik, mert `4³=64≡1`).

#### 5. feladat (4p) — Paritásellenőrző mátrix HARMADIK sora ⚠️
**Helyes válasz:** `(1,6,1,6,1,6)`
**Magyarázat:** A `H` 3. sora `α³` hatványai: `α³=6≡−1 → 1,6,1,6,1,6` (mert `6²=36≡1`).

#### 6. feladat (7p) — `u = (6,6)` üzenethez tartozó kódszó
**Helyes válasz:** `(5,1,2,0,4,3)`
**Magyarázat:** RS kódolás GF(7)-ben: `c = u·G`. Az `u=(6,6)` esetén a generátormátrix két sorának 6-szorosát adjuk össze GF(7)-ben. (Ugyanaz a kódolási művelet, mint korábban — gyakorlásra kiváló.)

#### 7. feladat (20p) — Elméleti állítások ⚠️

| # | Állítás | Igaz? |
|---|---------|:-----:|
| a | Egy `C(8,3)` bináris lineáris kód minden egyes hibacsoportjában a hibavektorok száma 8. | ✅ |
| b | Ha egy ciklikus RS-kód generátorpolinomjának fokszáma 6, akkor maximum minden hármas hibát tud javítani. | ✅ |
| c | Egy bináris lineáris kód hibavektorának minél nagyobb a súlya, annál nagyobb az előfordulási valószínűsége. | ❌ |
| d | Egy `C(n,k)` ciklikus kód generátorpolinomjának fokszáma `k`. | ❌ |
| e | Egy N szimbólumot egyenletes valószínűséggel kibocsátó forrás entrópiája `2^N`. | ❌ |

**Magyarázatok:**
- **a) IGAZ** – A coset mérete `2ᵏ = 2³ = 8`. ✓
- **b) IGAZ** – `deg g = n−k = 6 = 2t → t = 3`. Tehát max 3 hibát javít. ✓
- **c) HAMIS** – BSC-n a nagyobb súlyú hibaminta **kevésbé** valószínű (`p<0,5`).
- **d) HAMIS** – A generátorpolinom foka `n−k`, nem `k`.
- **e) HAMIS** – Egyenletes forrás entrópiája `H = log₂ N` (bit), nem `2^N`.

---

### GF(8) hatványtábla-művelet + shiftregiszter (8–10. feladat)

A GF(8) hatványtábla (a polinomreprezentáció `y`-ban, a hatvány `yⁱ`):

| Polinom | Hatvány |
|---------|:-------:|
| 1 | 1 (= y⁰) |
| y | y¹ |
| y² | y² |
| y+1 | y³ |
| y²+y | y⁴ |
| y²+y+1 | y⁵ |
| y²+1 | y⁶ |
| 1 | y⁷ (=1) |

A hatványkitevők indexelése: `1↔0, y↔1, y²↔2, y+1↔3, y²+y↔4, y²+y+1↔5, y²+1↔6`.

#### 8. feladat (10p) — Mennyi `4 × 5` a GF(8)-ban? ⚠️
**Helyes válasz:** `2`
**A ZH-ban ezt elrontottad.** ❌
**Magyarázat:** GF(8)-ban a „4" és „5" a **hatványkitevőket** jelölik (nem a számértéket!): `y⁴ · y⁵ = y⁹ = y^(9 mod 7) = y²`. A `y²` a táblázatban a **2**-es indexű elem → a válasz `2`.

> 💡 **Kulcs:** GF(2^m)-ben a szorzás = **a hatványkitevők összeadása mod (2^m − 1)**. Itt `2^m−1 = 7`, így `4+5 = 9 ≡ 2 (mod 7)` → `y²` → `2`.

#### 9. feladat (5p) — Milyen hosszúságú shiftregiszterrel hajtható végre a művelet?
**Helyes válasz:** `3`
**Magyarázat:** GF(8) = GF(2³), az elemek 3-bites (3-fokszámú polinomtér) reprezentációjúak → `3` tárolórekesz (a definiáló polinom foka `m=3`).

#### 10. feladat (5p) — Hány mod 2 összeadót tartalmaz a szorzás shiftregiszteres megvalósítása, ha a szorzótényező regiszterstruktúráját a 4 (mint szorzótényező) határozza meg? ⚠️
**Helyes válasz:** `2`
**A ZH-ban ezt elrontottad.** ❌
**Magyarázat:** A `4` a `y⁴ = y²+y` elemnek felel meg (lásd tábla). Az `y²+y` polinom **két** nemzérus együtthatóval bír (y² és y) → a szorzóáramkör **2** darab mod-2 (XOR) összeadót igényel. (A nemzérus együtthatók száma − a struktúra alapján.)

---

### Coset legkisebb/legnagyobb súlyú hibavektor (11–12. feladat)

Adott a lineáris bináris kód generátormátrixa:
```
      ┌                      ┐
G  =  │ 1  0  0  1  1  0 │
      │ 0  1  0  0  1  1 │
      │ 0  0  1  1  1  1 │
      └                      ┘
```
Ez `C(6,3)` — **ugyanaz, mint az 1. ZH 13–18. feladatának kódja!** A szindróma `s = (011)`.

#### 11. feladat (10p) — A LEGKISEBB súlyú hibavektor (`s=011`)
**Helyes válasz:** `(010000)`
**Magyarázat:** A `s=011` szindrómájú coset vezetője (legkisebb súlyú eleme) `010000` — ugyanaz, mint az 1. ZH 13. feladatának hibacsoport-vezetője. (A szindróma = a `H` azon oszlopa, amely `011`; ez a 2. pozícióhoz tartozik.)

#### 12. feladat (10p) — A LEGNAGYOBB súlyú hibavektor (`s=011`)
**Helyes válasz:** `(011111)`
**Magyarázat:** A coset = `{e_leader ⊕ c : c ∈ kód}`. A `010000`-hoz adva az összes kódszót, a legnagyobb súlyú eredmény `011111` (súly 5).

> 💬 Itt derül ki, miért volt az 1. ZH 14. feladatában `(011111)` csábító rossz válasz: az **a coset legnagyobb súlyú eleme**, de ott **kódszót** kértek (`001111`). Itt most épp a coset legnagyobb eleme a kérdés, tehát `011111` a helyes! Ügyelj a kérdés pontos szövegére: „kódszó" vs. „hibavektor a hibacsoportban".

---

### RS GF(8) ciklikus kód + shiftregiszter-architektúra (13–17. feladat)

Adott egy ciklikus RS-kód GF(8) felett, a generátorpolinom gyökei: `y, y², y³, y⁴, y⁵, y⁶`.

#### 13. feladat (3p) — `n` paramétere
**Helyes válasz:** `7` — RS GF(8) felett: `n = q − 1 = 8 − 1 = 7`.

#### 14. feladat (2p) — `k` paramétere
**Helyes válasz:** `1`
**Magyarázat:** A generátorpolinomnak 6 gyöke van → `deg g = 6 = n − k → k = 7 − 6 = 1`.

#### 15. feladat (5p) — Hány hibát tud JAVÍTANI?
**Helyes válasz:** `3` — `t = ⌊(n−k)/2⌋ = ⌊6/2⌋ = 3`.

#### 16. feladat (5p) — Hány KÉSLELTETŐT (rekeszt) tartalmaz a kódoló előrecsatolt shiftregiszter? ⚠️
**Helyes válasz:** `6`
**A ZH-ban ezt elrontottad.** ❌
**Magyarázat:** A kódoló (előrecsatolt, szorzó) shiftregiszter késleltetőinek száma = a generátorpolinom foka = `deg g = n − k = 6`.

#### 17. feladat (5p) — Hány EGYÜTTHATÓT (szorzót) tartalmaz a kódoló előrecsatolt shiftregiszter? (az 1-gyel való szorzást is beleszámítva) ⚠️
**Helyes válasz:** `7`
**A ZH-ban ezt elrontottad.** ❌
**Magyarázat:** A szorzók száma = a generátorpolinom együtthatóinak száma = `deg g + 1 = 6 + 1 = 7` (a konstans tagtól a főtagig, az 1-es főegyütthatót is beleszámítva).

> 💡 **Shiftregiszter-összefoglaló (kódoló, előrecsatolt):**
> - **késleltetők (rekeszek) száma = `deg g = n − k`**
> - **szorzók (együtthatók) száma = `deg g + 1`**
> - **mod-2 összeadók száma** = a nemzérus együtthatók száma − 1 (bináris esetben)

---

<a name="zh5"></a>
## 5. ZH — Hamming hiányzó oszlop, RS GF(8) generátorpolinom, CRC

> 13 feladat (a látható rész). Blokkok: Hamming `C(7,4)` hiányzó oszlopok (1–5.), RS GF(8) generátorpolinom (6–8.), RS GF(5) ciklikus + shiftregiszter (9–13.).

### Hamming `C(7,4)` hiányzó oszlopokkal (1–5. feladat)

A paritásellenőrző mátrix (két oszlop `*`-gal hiányzik):
```
      ┌                      ┐
H  =  │ 0  1  1  *  *  0  0 │
      │ 1  0  1  *  *  1  0 │
      │ 1  1  0  *  *  0  1 │
      └                      ┘
```
`C(7,4)` Hamming-kód: 3 sor, 7 oszlop.

#### 1. feladat (3p) — Az ELSŐ hiányzó oszlop
**Helyes válasz:** `(111)`
**Magyarázat:** Bináris Hamming-kódnál a `H` oszlopai az összes nemzérus 3-bites vektort tartalmazzák, egyszer. A meglévő oszlopok: `011,101,110,001,010` (az utolsó kettő az egységoszlop). A hiányzók a még nem szereplő `111` és `100`. Az első `*` helyére (a sorrend szerint) `111` kerül.

#### 2. feladat (2p) — A MÁSODIK hiányzó oszlop
**Helyes válasz:** `(100)`
**Magyarázat:** A másik hiányzó nemzérus 3-bites minta: `100`.

#### 3. feladat (5p) — Csupa 1-es üzenethez tartozó kódszó
**Helyes válasz:** `(1111111)`
**Magyarázat:** A csupa 1-es üzenet (`1111`) kódszava — mivel a Hamming-kódban a csupa-1 vektor is kódszó (a sorok összege páros paritást ad) — `1111111`.

#### 4. feladat (5p) — Detektált hibavektor, `e = 1100000` ⚠️
**Helyes válasz:** `(0010000)`
**A ZH-ban ezt elrontottad.** ❌
**Magyarázat:** Kiszámítjuk `e = 1100000` szindrómáját (`H` 1.+2. oszlopának összege), majd megkeressük az ehhez tartozó coset-vezetőt (egyetlen hibabit, mert Hamming `t=1`). A szindróma egy `H`-oszloppal egyezik → az a pozíció a javítandó. Itt a 3. pozíció → detektált (javító) hibavektor `0010000`.

#### 5. feladat (5p) — Max hány hibát JAVÍT? ⚠️
**Helyes válasz:** `1`
**A ZH-ban ezt elrontottad.** ❌
**Magyarázat:** Hamming-kód: `d_min = 3 → t = 1`. (Megint a klasszikus jelzés/javítás buktató!)

---

### RS GF(8) generátorpolinom (6–8. feladat)

A GF(8) hatványtábla (polinom ↔ hatvány ↔ egész index):

| Polinom | Hatvány | Index |
|---------|:-------:|:-----:|
| 1 | 1 | 7 (vagy 0) |
| y | y¹ | 8→1 |
| y² | y² | 9→2 |
| y+1 | y³ | 10→3 |
| y²+y | y⁴ | 11→4 |
| y²+y+1 | y⁵ | 12→5 |
| y²+1 | y⁶ | 13→6 |

> A feladatban a hatványtábla oszlopai: a polinomalak, a `yⁱ` alak, és a 7..13 / 21..27 egész indexek — ezek a különböző reprezentációk egymáshoz rendelését adják.

#### 6. feladat (20p) — Minden KÉTSZERES hibát javító RS GF(8), standard alak ⚠️
**Helyes válasz:** `0,3,0,1,3` (azaz `g(x) = x⁴ + y³·x³ + x² + x + y³` típusú, együtthatók y-hatványkitevőként)
**A ZH-ban ezt elrontottad.** ❌
**Magyarázat:** Kétszeres hibajavító → `2t = 4` gyök: `g(x) = (x−y)(x−y²)(x−y³)(x−y⁴)`. A szorzatot GF(8)-ban kifejtve az együtthatók (standard alak, mindegyik a primitív elem egy hatványa) → a hatványkitevők sorban: `0,3,0,1,3`.

> 📐 **Teljes lépésenkénti levezetés** lentebb: [RS GF(8) generátorpolinom](#rs-gf8-levezetes).

#### 7. feladat (20p) — Minden KÉTSZERES hibát javító RS GF(7), α=5, együtthatók ⚠️
**Helyes válasz:** `1,4,6,5,2`
**A ZH-ban ezt elrontottad.** ❌
**Magyarázat:** `g(x) = (x−α)(x−α²)(x−α³)(x−α⁴)` GF(7)-ben, α=5: `α=5, α²=4, α³=6, α⁴=2`. Kifejtve `g(x) = x⁴ + 4x³ + 6x² + 5x + 2` → együtthatók `1,4,6,5,2`.

> 📐 **Teljes lépésenkénti levezetés** lentebb: [RS GF(7) generátorpolinom](#rs-gf7-levezetes).

#### 8. feladat (20p) — Elméleti állítások ⚠️

| # | Állítás | Igaz? |
|---|---------|:-----:|
| a | Egyértelműen dekódolható forráskódolás esetén a forrás átlagos kódszóhossza nem lehet kisebb, mint a forrás entrópiája. | ✅ |
| b | Egy `C(15,11)` Reed–Solomon-kód minden kettős hiba javítására alkalmas. | ✅ |
| c | Egy `C(8,2)` bináris lineáris kód minden egyes hibacsoportjában 4 db hibavektor szerepel. | ✅ |
| d | Egy lineáris bináris kód a szindróma dekódolási táblázatában nem szereplő hibavektorokat nem tudja javítani. | ✅ |
| e | A bináris szisztematikus Hamming-kód paritásellenőrző mátrixában szerepel két egyforma oszlopvektor. | ❌ |

**Magyarázatok:**
- **a) IGAZ** – Ez a forráskódolási tétel (Shannon): `L̄ ≥ H`. ✓
- **b) IGAZ** – `C(15,11)`: `n−k = 4 = 2t → t = 2`. Kettős hibajavító. ✓ (Megjegyzés: ez RS-ként GF(16)-ra utal, `n=15=q−1`.)
- **c) IGAZ** – A coset mérete `2ᵏ = 2² = 4`. ✓
- **d) IGAZ** – A szindrómadekódolás csak a táblázatban szereplő (coset-vezető) hibamintákat javítja. ✓
- **e) HAMIS** – Hamming `H` oszlopai **mind különböznek** (az összes nemzérus minta egyszer). Nincs két egyforma. ✗

---

### RS GF(5) ciklikus kód + shiftregiszter (9–13. feladat)

> Minden egyszeres hibát javító ciklikus RS a GF(5) felett, primitív elem α = 3. (Ugyanaz, mint a 3. ZH 13–17. feladata.)

#### 9. feladat (2p) — `n` → **4** (`n = q−1 = 4`)
#### 10. feladat (2p) — `k` → **2** (`t=1 → k = 4−2 = 2`)

#### 11. feladat (6p) — Generátorpolinom együtthatói (α=3)
**Helyes válasz:** `1,3,2` (`g(x) = x² + 3x + 2`)
**Magyarázat:** `g(x) = (x−3)(x−4) = x² −7x +12 ≡ x² + 3x + 2 (mod 5)`. (Lásd 3. ZH 15.)

#### 12. feladat (5p) — Előrecsatolt shiftregiszter szorzói (kódoló, balról jobbra) ⚠️
**Helyes válasz:** `2,3,1`
**A ZH-ban ezt elrontottad.** ❌
**Magyarázat:** A kódoló előrecsatolt regiszter szorzói a `g(x)` együtthatói a konstans tagtól a főtagig: `c,b,a = 2,3,1`.

#### 13. feladat (5p) — Visszacsatolt shiftregiszter szorzói (dekódoló, jobbról balra)
**Helyes válasz:** `4,2,4`
**Magyarázat:** A vevő oldali osztó (visszacsatolt) regiszter szorzói, a megadott sorrendben: `4,2,4`. (Lásd 3. ZH 17. — ott pont ezt rontottad el, itt most jó!)

---

<a name="fogalomtar"></a>
## Fogalomtár / képletgyűjtemény

> Ez a gyors referencia-rész. **Utána** még jön: a [két 20 pontos RS levezetés](#rs-gf7-levezetes), a [6. ZH](#zh6), a [prioritási lista](#prioritas) és az [elméleti állítás-bank](#allitasbank).

| Fogalom | Képlet / szabály |
|---------|------------------|
| Javítóképesség | `t = ⌊(d_min − 1)/2⌋` |
| Jelző- (detektáló) képesség | `s = d_min − 1` |
| Singleton-korlát | `d ≤ n − k + 1` |
| MDS kód | egyenlőség a Singletonban: `d = n − k + 1` |
| Bináris Hamming-kód | `n = 2^m − 1`, `k = n − m`, `d = 3` |
| Ismétléses kód `C(n,1)` | `d = n`; `C(3,1)` MDS is |
| Kódszavak száma | `2^k` (bináris), `q^k` (`GF(q)` felett) |
| Szindrómák száma = cosetek száma | `2^(n−k)` (bináris) |
| Hibacsoport (coset) mérete | `2^k` = kódszavak száma |
| Összes hibavektor | `2ⁿ` (az összes `n`-bites vektor) |
| Szindróma-dekódolási táblázat **bitjei** | `2^(n−k) · (n + (n−k))` — soronként: hibaminta (`n`) + szindróma (`n−k`) |
| Hibacsoport-vezető | a coset legkisebb súlyú eleme |
| RS-kód hossza `GF(q)` felett | `n = q − 1` |
| RS-kód javítóképessége | `t = ⌊(n−k)/2⌋` |
| Szisztematikus generátormátrix | `G = [ I_k | P ]` |
| Szisztematikus paritásmátrix | `H = [ Pᵀ | I_{n−k} ]` |
| Kódfeltétel | `H · cᵀ = 0` |
| Szindróma | `s = H · vᵀ` (vett szóra) |
| Azonos coset feltétele | két hibavektor akkor, ha **azonos a szindrómájuk** |
| Hibaminta valószínűsége (BSC) | `P_b^w · (1−P_b)^(n−w)`, `w` = a hibaminta súlya |
| Ciklikus kód generátorpolinom foka | `deg g(x) = n − k` |
| RS generátorpolinom | `g(x) = (x−α)(x−α²)…(x−α^(2t))`, főegyüttható 1 |
| Viète (RS, t=1) | `g(x)=x²+bx+c`: `b = −(α+α²)`, `c = α·α²`, majd mod `q` |
| Előrecsatolt shiftregiszter | **szorzás** → kódolás (adó oldal) |
| Visszacsatolt shiftregiszter | **osztás** → dekódolás (vevő oldal) |
| RS `t` hibajavítás | `t = ⌊(n−k)/2⌋`, és `n = q−1` |
| GF(2^m) szorzás | hatványkitevők **összeadása mod (2^m−1)**: `yⁱ·yʲ = y^((i+j) mod (2^m−1))` |
| GF(8) | `2^m−1 = 7`, elemek 3-bites polinomok (`m=3`) |
| Egyenletes forrás entrópiája | `H = log₂ N` (bit), **nem** `2^N` |
| Forráskódolási tétel | átlagos kódszóhossz `L̄ ≥ H` (entrópia) |
| Kódoló regiszter: késleltetők | `deg g = n − k` darab rekesz |
| Kódoló regiszter: szorzók | `deg g + 1` darab (együtthatók, az 1-est is számolva) |
| Szorzó regiszter mod-2 összeadói | a nemzérus együtthatók száma − 1 (bináris) |
| RS generátorpolinom (t hiba) | `g(x) = (x−α)(x−α²)…(x−α^(2t))` |

### Gyakori buktatók (a ZH-kban elrontott feladatok tanulságai)

- **Jelzés ≠ javítás.** Hamming-kód: jelez 2-t, javít **1**-et (`t = ⌊(d−1)/2⌋`). (2.ZH/12., 1.ZH/4–5.)
- **„Legnagyobb súlyú kódszó" vs. „coset elem".** Kódszónál a `0`-szindrómás halmazból (`u·G`) válassz; cosetnél `e ⊕ cᵢ` az összes kódszóra. (1.ZH/14., 3.ZH/2.)
- **`H ≠ Gᵀ`.** Szisztematikusan `G=[I|P]` → `H=[Pᵀ|I]`. A `P`-t transzponálni kell! (1.ZH/17–18.)
- **Előre- vs. visszacsatolt regiszter.** Előre = szorzás/kódolás, vissza = osztás/dekódolás. (3.ZH/17., 2.ZH 5/c.)
- **RS kódolás GF(q)-ben.** Az `u=(2,2)` → `(4,5,3,0,6,1)` konkrét számítást gyakorold be — kétszer is elrontottad a 3. tagnál. (2.ZH/8., 3.ZH/8.)
- **Viète-előjel és mod.** `b = −(α+α²)`, a mínuszt a test szerint vidd vissza (pl. `−6 ≡ 4 mod 5`). (2.ZH/16.)
- **Singleton felső korlát.** `d_min ≤ n−k+1` — ennél nagyobb távolság lehetetlen. (3.ZH 5/e.)
- **Szindrómatáblázat sorai:** `2^(n−k)` (nem `2ⁿ`). (2.ZH 5/a.)
- **GF(2^m) szorzás = kitevők összege mod (2^m−1).** `4×5` GF(8)-ban: `y⁴·y⁵=y⁹=y²`→`2`. (4.ZH/8., 10.)
- **„Kódszó" vs. „hibavektor a hibacsoportban".** Ugyanaz a `C(6,3)` kód: legnagyobb súlyú **kódszó** = `001111` (1.ZH/14.), de legnagyobb súlyú **coset-elem** (s=011) = `011111` (4.ZH/12.). Olvasd a kérdést pontosan! 🎯
- **Shiftregiszter méretezése.** Kódoló: késleltetők = `deg g = n−k`, szorzók = `deg g + 1`. (4.ZH/16–17.)
- **Entrópia ≠ 2^N.** Egyenletes N-szimbólumú forrás: `H = log₂ N`. (4.ZH 7/e.)
- **GF(8)/GF(7) generátorpolinom-szorzás** (20 pontos!): `(x−α)…(x−α^(2t))` gondos kifejtése. Kétszer is elrontottad. (5.ZH/6–7.)
- **Előre- vs. visszacsatolt szorzók.** Kódoló (előre, balról jobbra) = `g` együtthatói a konstanstól; dekódoló (vissza, jobbról balra) külön sorozat. (5.ZH/12., 3.ZH/16–17.)

---

## 🧮 A két 20 pontos RS generátorpolinom — teljes levezetés

> Az RS-kód generátorpolinomja `g(x) = (x−α¹)(x−α²)…(x−α^(2t))`, ahol `t` a hibajavító képesség. **Kétszeres** hibajavítónál `2t = 4` gyök. A főegyüttható mindig 1. A trükk a gyöktényezők **páronkénti** összeszorzása, mindig az adott testben számolva.

<a name="rs-gf7-levezetes"></a>
### A) RS GF(7), α = 5, kétszeres hibajavító (5.ZH/7.)

**Gyökök:** `α=5, α²=25 mod 7=4, α³=5·4=20 mod 7=6, α⁴=5·6=30 mod 7=2`.
Tehát `g(x) = (x−5)(x−4)(x−6)(x−2)` GF(7) felett.

**1. lépés — `(x−5)(x−4)`:**
`= x² −(5+4)x + 5·4 = x² − 9x + 20`. Mod 7: `−9 ≡ −2 ≡ 5`, `20 ≡ 6`.
→ `x² + 5x + 6`.

**2. lépés — `(x−6)(x−2)`:**
`= x² −(6+2)x + 6·2 = x² − 8x + 12`. Mod 7: `−8 ≡ −1 ≡ 6`, `12 ≡ 5`.
→ `x² + 6x + 5`.

**3. lépés — a két másodfokú szorzata** `(x²+5x+6)(x²+6x+5)` mod 7:

| | `x²` | `6x` | `5` |
|-----|------|------|-----|
| `x²` | x⁴ | 6x³ | 5x² |
| `5x` | 5x³ | 30x² | 25x |
| `6` | 6x² | 36x | 30 |

Összegyűjtve (mod 7):
- `x⁴`: 1
- `x³`: `6 + 5 = 11 ≡ 4`
- `x²`: `5 + 30 + 6 = 41 ≡ 6` (41 = 5·7+6)
- `x¹`: `25 + 36 = 61 ≡ 5` (61 = 8·7+5)
- `x⁰`: `30 ≡ 2`

**Eredmény:** `g(x) = x⁴ + 4x³ + 6x² + 5x + 2`
**Együtthatók (a legnagyobb hatványtól):** `1,4,6,5,2` ✅

**Ellenőrzés:** `g(5) = 625 + 500 + 150 + 25 + 2 = 1302 ; 1302 mod 7 = 0` ✓ (gyök). Hasonlóan `g(4)=g(6)=g(2)=0`.

---

<a name="rs-gf8-levezetes"></a>
### B) RS GF(8), kétszeres hibajavító, standard alak (5.ZH/6.)

GF(8)-ban a `primitív polinom x³ + x + 1`, azaz `y³ = y + 1`. A hatványtábla (elem ↔ y-kitevő):

| y-kitevő | polinom | 3-bites |
|:--------:|---------|:-------:|
| y⁰ | 1 | 001 |
| y¹ | y | 010 |
| y² | y² | 100 |
| y³ | y+1 | 011 |
| y⁴ | y²+y | 110 |
| y⁵ | y²+y+1 | 111 |
| y⁶ | y²+1 | 101 |

**Kulcs:** GF(8)-ban az **összeadás = XOR** (bitenkénti), a **szorzás = y-kitevők összege mod 7**. És mivel karakterisztika 2: `−r = r`, tehát `(x−αⁱ) = (x+αⁱ)`.

**Gyökök:** `y¹, y², y³, y⁴`. Így `g(x) = (x+y)(x+y²)(x+y³)(x+y⁴)`.

**1. lépés — `(x+y)(x+y²)`:**
`= x² + (y+y²)x + y·y² = x² + (y+y²)x + y³`.
`y+y² = 010 ⊕ 100 = 110 = y⁴`. `y·y² = y³`.
→ `x² + y⁴·x + y³`.

**2. lépés — `(x+y³)(x+y⁴)`:**
`= x² + (y³+y⁴)x + y³·y⁴ = x² + (y³+y⁴)x + y⁷`.
`y³+y⁴ = 011 ⊕ 110 = 101 = y⁶`. `y⁷ = y⁰ = 1`.
→ `x² + y⁶·x + 1`.

**3. lépés — `(x² + y⁴x + y³)(x² + y⁶x + 1)`:**

- `x⁴`: 1
- `x³`: `y⁶ + y⁴` = `101 ⊕ 110 = 011 = y³`
- `x²`: `1 + y⁴·y⁶ + y³` = `1 + y¹⁰ + y³` ; `y¹⁰ = y³`, tehát `1 ⊕ y³ ⊕ y³ = 1 ⊕ (y³⊕y³) = 1 = y⁰`
  - (bitben: `001 ⊕ 011 ⊕ 011 = 001`)
- `x¹`: `y⁴·1 + y³·y⁶` = `y⁴ + y⁹` = `y⁴ + y²` = `110 ⊕ 100 = 010 = y¹`
- `x⁰`: `y³·1 = y³`

**Eredmény (y-kitevőkben):** `g(x) = x⁴ + y³·x³ + y⁰·x² + y¹·x + y³`
**Együtthatók standard alakban (y-kitevők, a legnagyobb hatványtól):** `0,3,0,1,3` ✅

> A feladat „standard alak"-ot kér: minden együttható a primitív elem egy hatványa, és csak a **kitevőt** írjuk be (a főegyüttható `y⁰=1 → 0`).

> 💡 **Általános recept mindkét típusra:**
> 1. Írd fel a `2t` gyököt `α` hatványaiként.
> 2. Párosítsd a gyöktényezőket, és szorozd össze **párban** (2 db másodfokú).
> 3. Szorozd össze a két másodfokút.
> 4. Minden lépésben a **testben** számolj: GF(p)-ben mod p; GF(2^m)-ben XOR (összeadás) és kitevő-összeadás mod (2^m−1) (szorzás).
> 5. Ellenőrzés: helyettesítsd be a gyököket — 0-t kell adniuk.

---

<a name="zh6"></a>
## 6. ZH — Ismétléses kód, szindrómaszám, Hamming oszlopok

> A 6. doksi (vegyes blokk). Típusok: ismétléses kód `d_min`, szindróma-/hibacsoportszám, Hamming oszlopvektorok, nem-szisztematikus `G`/`H`. Több feladatot elrontottál — alább a helyes megoldásokkal. (Az eredeti doksi RSA-feladatait kihagytam — lásd lentebb.)

> ⚠️ Itt két külön kísérlet feladatai keverednek a doksiban; a kódok nem mind ugyanazok. A lényeg a **típusok** gyakorlása.

### Elméleti állítások (1. feladat) ⚠️

| # | Állítás | Igaz? |
|---|---------|:-----:|
| a | Egy `C(12,6)` MDS kód legfeljebb 3 hibát tud javítani. | ✅ |
| b | Egy `C(9,4)` kód `d_min`-je lehet 6. | ✅ |
| c | Egy `C(8,2)` bináris lineáris kód szindrómavektorai 8 dimenziós vektorok. | ❌ |
| d | Bináris lineáris kódnál egy adott szindrómavektorhoz tartozó hibacsoportban a legkisebb súlyú hibavektor fordul elő a legnagyobb valószínűséggel. | ✅ |
| e | Egy szindrómavektort a generátormátrixszal szorozva megkapjuk a hibavektort. | ❌ |

**Magyarázatok:**
- **a) IGAZ** – MDS: `d = n−k+1 = 12−6+1 = 7 → t = ⌊(7−1)/2⌋ = 3`. ✓
- **b) IGAZ** – Singleton: `d ≤ n−k+1 = 9−4+1 = 6`. A 6 épp a felső határ, tehát **lehet** 6 (MDS esetén). ✓
- **c) HAMIS** – A szindróma dimenziója `n−k = 8−2 = 6`, nem 8.
- **d) IGAZ** – A coset-vezető (legkisebb súly) a legvalószínűbb hibaminta BSC-n. ✓
- **e) HAMIS** – A szindrómát a **paritásellenőrző** mátrix adja (`s=H·vᵀ`), nem a generátormátrix; és a hibavektort a szindróma-táblázatból (coset-vezető) kapjuk, nem egyszerű szorzással.

> 💬 Ezt a feladatot elrontottad (a c. és e. hamisakat is bejelölted). A szabály: **szindróma dimenziója = n−k**, és **szindróma = H·vᵀ** (nem G!).

---

### Bináris lineáris kód kódszavakból (2–5. feladat)

Adott kódszavak: `c₀=(00000), c₁=(01111), c₂=(10110), c₃=(11001)`. Ez `C(5,2)`.

#### 2. feladat (5p) — Hány hibát tud javítani?
**Helyes válasz:** `1`
**Magyarázat:** A legkisebb páronkénti Hamming-távolság `d_min = 3` (pl. `c₀↔c₂` = 3). `t = ⌊(3−1)/2⌋ = 1`.

#### 3. feladat (3p) — Generátormátrix ELSŐ sora ⚠️
**Helyes válasz:** `10110`
**A ZH-ban beírt (hibás):** `(0000000)` ❌
**Magyarázat:** A `G` sorai a kód bázisát adó (nemzérus, független) kódszavak. Az első sor `c₂ = 10110` (szisztematikus-szerű elrendezésben az első információs bit-hez tartozó kódszó).

#### 4. feladat (2p) — Generátormátrix UTOLSÓ sora ⚠️
**Helyes válasz:** `01111`
**A ZH-ban beírt (hibás):** `(1100110)` ❌
**Magyarázat:** A második bázis-kódszó `c₁ = 01111`.

#### 5. feladat (3p) — Paritásellenőrző mátrix ELSŐ sora ⚠️
**Helyes válasz:** `11100`
**A ZH-ban beírt (hibás):** `(11111)` ❌
**Magyarázat:** A `G = [kódszavak]`-ból `H`-t a `H·cᵀ=0` feltételből kapjuk; az első `H`-sor `11100`.

#### 6. feladat (2p) — Paritásellenőrző mátrix UTOLSÓ sora ⚠️
**Helyes válasz:** `01001`
**A ZH-ban beírt (hibás):** `(0110110)` ❌
**Magyarázat:** A `H` utolsó sora `01001`.

#### 7. feladat (5p) — Hibavektor a „csupa 1-es szindrómájú" hibacsoportból ⚠️
**Helyes válasz:** `(01000)`
**A ZH-ban beírt (hibás):** `(00000)` ❌
**Magyarázat:** Keresd meg azt az egy hibabites mintát, amelynek szindrómája a csupa-1 vektor (`H` azon oszlopa, amely `111…`). Az a pozíció adja a hibavektort: `01000`.

---

### Hamming-kód `n=15` (8–13. feladat)

> Egy minden egyszeres hibát javító bináris szisztematikus Hamming-kód, `n = 15`.

#### 8. feladat (6p) — Üzenetvektor hossza (`k`) ⚠️
**Helyes válasz:** `11`
**A ZH-ban beírt (hibás):** `34` ❌
**Magyarázat:** Hamming: `n = 2^m − 1 = 15 → m = 4` paritásbit. `k = n − m = 15 − 4 = 11`.

#### 9. feladat (4p) — `H` UTOLSÓ ELŐTTI oszlopvektora ⚠️
**Helyes válasz:** `(0010)`
**A ZH-ban beírt (hibás):** `(0101)` ❌
**Magyarázat:** Szisztematikus Hamming `H = [Pᵀ | I₄]`-nél a jobb oldali rész egységmátrix; az utolsó előtti oszlop az `I₄` 3. egységoszlopa → `0010`.

#### 10. feladat (3p) — `H` UTOLSÓ oszlopvektora ⚠️
**Helyes válasz:** `(0001)`
**A ZH-ban beírt (hibás):** `(1010)` ❌
**Magyarázat:** Az `I₄` utolsó egységoszlopa → `0001`.

#### 11. feladat (4p) — `G` ELSŐ oszlopvektora ⚠️
**Helyes válasz:** `(10000000000)` (11 bites)
**A ZH-ban beírt (hibás):** `(0011)` ❌
**Magyarázat:** Szisztematikus `G = [I₁₁ | P]`-nél az első oszlop az `I₁₁` első egységoszlopa (11 hosszú) → `10000000000`.

#### 12. feladat (3p) — `G` MÁSODIK oszlopvektora ⚠️
**Helyes válasz:** `(01000000000)`
**A ZH-ban beírt (hibás):** `(0011)` ❌
**Magyarázat:** Az `I₁₁` második egységoszlopa → `01000000000`.

#### 13. feladat (5p) — Hány hibát javít `C(7,4)` Hamming? ⚠️
**Helyes válasz:** `1`
**A ZH-ban beírt (hibás):** `0` ❌
**Magyarázat:** Minden Hamming-kód `d_min=3 → t=1`. (A klasszikus buktató ismét!)

---

### Ismétléses kód + szindróma-/hibacsoportszám (14–16. feladat)

#### 14. feladat (5p) — Ötszörös ismétléses kód `d_min`-je ⚠️
**Helyes válasz:** `5`
**A ZH-ban beírt (hibás):** `10` ❌
**Magyarázat:** Ha minden bitet 5-ször ismételsz, az `C(5,1)` ismétléses kód: `d_min = n = 5`. (Két kódszó `00000` és `11111` távolsága 5.)

#### 15. feladat (5p) — `C(12,8)` szindrómavektorainak száma ⚠️
**Helyes válasz:** `16`
**A ZH-ban beírt (hibás):** `5` ❌
**Magyarázat:** A szindrómák száma `2^(n−k) = 2^(12−8) = 2⁴ = 16` (a csupa-0 szindrómát is beleértve).

#### 16. feladat (5p) — `C(15,11)` hibacsoportjainak száma ⚠️
**Helyes válasz:** `16`
**A ZH-ban beírt (hibás):** `5` ❌
**Magyarázat:** A hibacsoportok (cosetek) száma = a szindrómák száma = `2^(n−k) = 2^(15−11) = 2⁴ = 16`.

---

> ℹ️ **RSA / titkosítás: NEM ZH-anyag.** A 6. doksiban voltak RSA-feladatok (17–19.), de az RSA **nem szerepel** a tárgy ZH-tematikájában (1–6. témakör). Ezért ezeket **kivettem** a jegyzetből. Ugyanígy kimaradt a „lineáris blokk-rejtjelező" (`y=Ax+b`) is, ami szintén titkosítás — ha mégis kell, szólj.

---

<a name="zh7"></a>
## 7. ZH — Új típusok: szindrómatáblázat mérete, legkisebb súlyú kódszó, RS GF(11)

> A legújabb anyagokból (8–12. doksi) kigyűjtött **új vagy megerősített** típusok. Az ismétlődőket (RS GF(7), Hamming hiányzó oszlop, coset-vektorok) nem duplikálom — azok a 1–6. ZH-ban már szerepelnek. Itt a tényleg újak + a hivatalos kulccsal **megerősített/javított** válaszok vannak.

### ⭐ ÚJ: „Hány bit kerül tárolásra a szindróma-dekódolási táblázatban?"

Ez **nem** a szindrómák száma! A táblázat minden sorában tárolódik: a **szindróma** (`n−k` bit) **és** a hozzá tartozó **coset-vezető hibaminta** (`n` bit). Sorok száma = `2^(n−k)`.

**Képlet:** `bitek száma = 2^(n−k) · (n + (n−k))`  *(a csupa-0 szindróma sorát is beleértve)*

| Feladat | Kód | Számítás | Válasz |
|---------|-----|----------|:------:|
| 7.ZH (C(8,3)) | `n=8, k=3` | `2⁵ · (8+5) = 32 · 13` | **416** |
| 10.doksi (C(15,11)) | `n=15, k=11` | `2⁴ · (15+4) = 16 · 19` | **304** |

> ⚠️ Vigyázz: van, ahol a feladat csak a **szindrómavektorok számát** kérdezi (az `2^(n−k)`), van, ahol a **tárolt biteket** (a fenti képlet). Olvasd pontosan!

### ⭐ ÚJ: Legkisebb / legnagyobb súlyú kódszó (a csupa-0 kivételével)

A `C(6,3)` kódnál (a 12. feladat `E₍₀₁₁₎` hibacsoportjához tartozó kód, lásd 1.ZH):

| Kérdés | Helyes válasz | Megjegyzés |
|--------|:-------------:|------------|
| Legnagyobb súlyú kódszó | `(001111)` | súly 4 (vagy `110101`, `111010`) |
| **Legkisebb súlyú kódszó** | `(010011)` | súly 3 — ⚠️ a `100110` is súly 3, de a kulcs `010011`-et fogad el |

> 💬 A 10.doksiban a legkisebb súlyú kódszóra `(100110)`-t írtál, de a kulcs `(010011)`. **Mindkettő súly 3** — valószínűleg a feladat a *konkrét* generátorsorrend szerinti elsőt várja. A lényeg: a **kódszavak** (`u·G`) közül válassz, ne a cosetből. (Az összes kódszó táblázata az [1.ZH G/H levezetésben](#gh-levezetes).)

### ⭐ ÚJ: Teljes hibavektorszám (az összes vektor)

#### „Hány darab hibavektora van egy `C(6,3)` kódnak (a csupa-0-t is beleértve)?"
**Helyes válasz:** `64`
**Magyarázat:** Ez **az összes** `n`-bites vektor: `2ⁿ = 2⁶ = 64`. (Nem tévesztendő össze a *coset méretével* `2ᵏ=8`, vagy a *cosetek számával* `2^(n−k)=8`.)

> 📊 **Három különböző „darab" kérdés — ne keverd:**
> | Kérdés | Képlet | C(6,3) |
> |--------|--------|:------:|
> | Hány vektor **egy** hibacsoportban? | `2ᵏ` | 8 |
> | Hány hibacsoport (coset) van? | `2^(n−k)` | 8 |
> | Hány hibavektor **összesen**? | `2ⁿ` | 64 |

### ⭐ ÚJ: RS GF(11), minden 3 hibát javító (8.doksi/8–10.)

> `GF(11)`, test mérete prím, minden **hármas** hibát javít.

| Feladat | Kérdés | Válasz | Indok |
|---------|--------|:------:|-------|
| 8. (5p) | `n` | `10` | `n = q−1 = 11−1 = 10` |
| 9. (5p) | `k` | `4` | `t=3 → n−k=2t=6 → k=10−6=4` |
| 10. (10p) | `G` 2. sora (α=2) | `(1,2,4,8,5,10,9,7,3,6)` | `2ⁱ mod 11`: `2⁰=1,2,4,8,16≡5,10,20≡9,18≡7,14≡3,6` |

**A GF(11) hatványsor levezetése (α=2):** `1, 2, 4, 8, 5 (16−11), 10, 9 (20−11), 7 (18−11), 3 (14−11), 6 (12−11)` — 10 elem, a teljes nemzérus GF(11). ✓

### Megerősített elméleti állítások (a legújabb ZH-kból)

> Ezek a hivatalos kulccsal **megerősített** döntések — érdemes megjegyezni, mert visszatérnek.

| Állítás | I/H | Indok |
|---------|:---:|-------|
| A GF(7) feletti RS-kód `H` első oszlopa csupa 1-es | ✅ | A `H` oszlopai `(1, αⁱ, α²ⁱ, …)` — az első oszlop (`i=0`) mind 1. |
| `C(3,1)` Hamming egyúttal MDS is | ✅ | `d=3=n−k+1` → MDS; és Hamming is. |
| `C(6,2)` lineáris bináris kód `H`-ja 6 sort tartalmaz | ❌ | `H` sorainak száma `n−k = 6−2 = 4`, nem 6. |
| Minden bináris lineáris kódra `H·Gᵀ = 0` | ✅ | A `G` és `H` ortogonalitása (alaptétel). |
| `C(12,6)` MDS kód legfeljebb 3 hibát javít | ✅ | `d=n−k+1=7 → t=3`. |
| `C(9,4)` kód `d_min`-je lehet 6 | ✅ | Singleton: `d ≤ 9−4+1 = 6` → a 6 elérhető (MDS). |
| `C(8,2)` szindrómavektorai 8 dimenziósak | ❌ | A szindróma `n−k = 6` dimenziós. |
| `C(7,2)` hibacsoportjainak száma 32 | ✅ | `2^(n−k) = 2⁵ = 32`. |
| `C(20,14)` MDS kód legfeljebb 3 hibát javít | ✅ | `d=n−k+1=7 → t=3`. |
| Ha `H` max 4 kiválasztott oszlopa lin. független → min. 3 hibát javít | ❌ | 4 független oszlop → `d_min ≥ 5`? Valójában `d_min = (max. lin. független oszlopok)+1` határ; a „minden hármas hiba" `d≥7`-et követelne. A kulcs szerint HAMIS. |

---

<a name="prioritas"></a>
## Melyik feladattípust gyakorold a legtöbbet? (pont-alapú prioritás)

A ZH-kban elrontott feladatok összpontszám szerint rangsorolva — ezekkel nyersz a legtöbbet:

1. **RS generátorpolinom GF(8)/GF(7), standard alak** — 2×20p (5.ZH/6–7.) 🔴 → [levezetés itt](#rs-gf7-levezetes)
2. **Elméleti állítások (mind vagy semmi)** — 20p/ZH, apró tévedés = 0 pont → [állítás-bank](#allitasbank)
3. **„Hány bit a szindróma-dekódolási táblázatban"** — 10p (7.ZH/7.: 416), új, trükkös típus ⭐
4. **GF(8) hatványtábla-szorzás** — 10p (4.ZH/8.)
5. **RS kódolás `u·G` GF(7)-ben** — 8p, kétszer elrontva (2.ZH/8., 3.ZH/8.)
6. **Szisztematikus `G`/`H` oszlop- és sorvektorok** — sok 2–4p-s feladat, Hamming + lineáris (6.ZH/9–12., 1.ZH/15–18.)
7. **Szindróma-/hibacsoportszám** `2^(n−k)` — 5p-k (6.ZH/15–16.)
8. **Legnagyobb/legkisebb súlyú kódszó** — a kódból (`u·G`), nem a cosetből! (8.ZH/10–11.)
9. **Shiftregiszter méretezés** (késleltetők/szorzók/összeadók) — 5p-k (4.ZH/16–17., 5.ZH/12.)
10. **Jelzés vs. javítás** (Hamming `t=1`) — ismétlődő 5p-k

> A „mind vagy semmi" elméleti feladatokból a legkönnyebb pontot bukni — a Fogalomtár + Buktatók + Állítás-bank szekció pont ezekre készít fel.


---

<a name="allitasbank"></a>
## 📋 Elméleti állítás-bank (igaz/hamis gyűjtemény kiértékelve)

> A „csak igaz állítások" listából (115 tétel) kiértékelve. **Figyelem:** a cím félrevezető — a lista **sok hamis állítást is tartalmaz**, és egymásnak ellentmondó párokat. Ez gyakorló-gyűjtemény, nem „mind igaz" tényhalmaz. Minden állításnál ott az **I/H** döntés és a rövid indok.
>
> A tárgy 6 témaköréhez tartozó állításokat emeltem ki. A **konvolúciós kódok, trellis, spektrális/Fourier-kódolás, forráskódolás (Huffman, Shannon-Fano, LZ77), hibacsapda, PGZ, sokfelhasználós rendszerek** témák a jelenlegi tematikádon (1–6. témakör) **kívül esnek** — ezeket ⏭️-vel jelölöm; ha az oktató szerint nem kell, ugord át.

### A) GF(q) és testelmélet

| Állítás | I/H | Indok |
|---------|:---:|-------|
| A minimálpolinomok irreducibilisek | ✅ | Definíció szerint a minimálpolinom irreducibilis. |
| Az irreducibilis polinom nem bontható fel két (nemtriviális) polinom szorzatára | ✅ | Ez az irreducibilitás definíciója. |
| A főpolinom (normált) legnagyobb hatványú együtthatója 1 | ✅ | A „monic" polinom definíciója. |
| GF(q)-ban modulo aritmetikánál `q` csak prím lehet | ❌ | `q = p^m` is lehet (pl. GF(8)), de akkor **polinom** mod aritmetika kell, nem egész mod. |
| GF(q), `q=p^m`: az egész modulo aritmetika **nem** teljesíti a testaxiómákat | ✅ | Igaz: `p^m`-re a sima egész mod nem test (vannak nullosztók); irreducibilis polinom kell. |
| GF(q), `q=p^m`: a modulo aritmetika teljesíti a testaxiómákat | ❌ | Lásd előző — egész mod `p^m`-re **nem** test. |
| GF(q^m)-ben az aritmetikát vektorokkal is leírhatjuk | ✅ | Az elemek `m`-dimenziós vektorok GF(q) felett. |
| GF(q^m)-ben az aritmetikához egy irreducibilis polinom kell | ✅ | A szorzás a definiáló irreducibilis polinom szerinti maradék. |
| GF(q), `q=p^m`: a testelemeket reprezentáló polinomok együtthatói GF(p) elemei | ✅ | A reprezentáció GF(p) feletti polinom. |
| GF(q)-ban a primitív elem `q−1`-edik hatványa 1 | ✅ | `α^(q−1) = 1` (a multiplikatív csoport rendje `q−1`). |
| GF(q)-ban minden elem rendjére felső korlát `q−1` | ✅ | A nemzérus elemek csoportja `q−1` rendű. |
| GF(8)-ban 2 konjugált gyökcsoport van | ✅* | A nemzérus elemek ciklotomikus cosetjei `{1,2,4}` és `{3,6,5}` → 2 db (a `{0}` triviális). |
| Minimálpolinom együtthatói GF(2^m) felett 0 vagy 1 | ✅ | GF(2) feletti minimálpolinom → bináris együtthatók. |

### B) Bináris lineáris kódok

| Állítás | I/H | Indok |
|---------|:---:|-------|
| Lineáris kódnál a kódszavak bármely lineáris kombinációja is kódszó | ✅ | A kód altér → zárt a lineáris kombinációra. |
| A nullvektor minden lineáris kód eleme | ✅ | Altér → tartalmazza a 0-t. |
| Szisztematikus kódnál az üzenet része a kódszónak | ✅ | A szisztematikus alak definíciója (`c = [u | paritás]`). |
| Lineáris kódoknál a kódszavak a `G` sorai által kifeszített térben vannak | ✅ | A kód = a `G` sorterének (row space). |
| `C(n,k)` lineáris bináris kód: `G` típusa `k×n`, `H` típusa `(n−k)×n` | ✅ | Standard méretek. |
| `C(n,k)` paritásellenőrző mátrixa `(n−k)×n` típusú | ✅ | Ugyanaz. |
| `C(n,k)` bináris lineáris kód szabványos elrendezése `2^k` oszlopot tartalmaz | ✅ | Oszlopok = kódszavak = `2^k`; sorok = cosetek = `2^(n−k)`. |
| `C(n,k)` oszlopai `2^k`, sorai `2^(n−k)` | ✅ | A szabványos elrendezés (standard array) mérete. |
| Nem-szisztematikus, de lineáris kódnál az üzenet a kódszóból **mátrixinverzióval** megkapható | ✅ | A `G` megfelelő részmátrixának inverzével. (A „mátrixkonverzió" megfogalmazás pongyola, de a lényeg az inverz.) |
| Egy adott szindrómához tartozó cosetben a kisebb súlyú hibavektorra érdemes detektálni | ✅ | BSC-n a kisebb súly valószínűbb → coset-vezető. |
| Lineáris kód a szindróma-táblázatban nem szereplő hibamintát nem tudja javítani | ✅ | Csak a coset-vezetőket javítja. |
| Szindrómát a generátormátrixszal szorozva kapjuk a hibavektort | ❌ | Szindróma = `H·vᵀ` (paritásmátrix!), és a hibát a táblázatból kapjuk. |

### C) Minimális távolság, MDS, perfekt, Hamming

| Állítás | I/H | Indok |
|---------|:---:|-------|
| MDS kódoknál jobb (nagyobb `d`) blokk-kód nem létezik | ✅ | MDS eléri a Singleton-korlátot `d=n−k+1`, ennél nagyobb lehetetlen. |
| MDS: `d_min = n−k+1` | ✅ | Az MDS definíciója. |
| MDS kódnál `d_min` nagyobb, mint a redundancia | ❌ | Redundancia `= n−k`, és `d_min = n−k+1 = redundancia+1`, tehát pontosan **eggyel** nagyobb — az „nagyobb" igaz, de a szokásos csapda-megfogalmazás szerint HAMIS, mert nem „sokkal", hanem pont +1. ⚠️ *Lásd lenti megjegyzés.* |
| A perfekt kódok nem biztos, hogy MDS kódok | ✅ | Pl. a Hamming-kódok perfektek, de általában nem MDS. |
| Az MDS kódok mind perfektek | ❌ | Nem; MDS ↛ perfekt (pl. sok RS nem perfekt). |
| Minden `q`-áris `C(n,n−2)` Hamming-kód MDS | ❌ | A `C(n,n−2)` paraméter inkább egyszeres paritásra/duálra utal; általánosan nem igaz Hamming-MDS. ⚠️ |
| `C(7,4)` lehet Hamming | ✅ | `n=2³−1=7, k=7−3=4` → épp Hamming. |
| `C(3,1)` Hamming és MDS | ✅ | `C(3,1)` ismétléses, `d=3=n−k+1` → MDS; és `n=2²−1`? nem (3=2²−1 igen, m=2, k=n−m=1) → Hamming is. |
| RS-kód mindig MDS | ✅ | Az RS mindig eléri a Singleton-korlátot. |
| RS-kód lineáris | ✅ | Igen, az RS lineáris (és ciklikus). |

> ⚠️ **„`d_min` > redundancia" csapda:** MDS-nél `d_min = (n−k)+1`, ami szigorúan nagyobb, mint `n−k`. Önmagában a matematikai „nagyobb" **igaz**. A ZH-kban viszont ezt gyakran **hamisként** várják, mert a szándék az, hogy `d_min` nem „meghaladja jelentősen" a redundanciát, hanem pont +1. **Itt kérdezd meg az oktató szándékát / nézd a korábbi hivatalos megoldókulcsot** — a 3.ZH 5/e.-nél és az 1.ZH 3.-nál is látszott, hogy ezt az adott kulcs hogyan kezeli.

### D) Ciklikus kódok és RS

| Állítás | I/H | Indok |
|---------|:---:|-------|
| Ciklikus kódban bármely kódszó ciklikus eltoltja is kódszó | ✅ | A ciklikus kód definíciója. |
| Léteznek ciklikus, de nemlineáris kódok | ✅ | Igen, a ciklikusság nem feltételez linearitást. |
| `C(n,k)` ciklikus kód generátorpolinomja osztja `xⁿ−1`-et | ✅ | `g(x) | xⁿ−1` — alaptétel. |
| Ciklikus kód `g(x)` fokszáma `n−k` | ✅ | A generátorpolinom foka `n−k`. |
| `C(n,k)` RS-kód generátorpolinomjának fokszáma `n−k` | ✅ | Ugyanaz. |
| `C(n,k)` ciklikus kód paritásellenőrző polinomja osztja `xⁿ−1`-et | ✅ | `h(x) | xⁿ−1` és `g(x)·h(x)=xⁿ−1`. |
| Ciklikus kód paritásellenőrző polinomjának fokszáma `k` | ✅ | `deg h = k`. |
| `C(n,k)` RS-kód paritásellenőrző polinomjának fokszáma `k` | ✅ | `deg h = k`. |
| RS-kódnak létezik shiftregiszteres implementációja | ✅ | Igen (ciklikus → shiftregiszter). |
| Polinomok szorzata előrecsatolt shiftregiszterrel implementálható | ✅ | Szorzás = előrecsatolt (FIR) regiszter. |
| Polinomiális osztás implementálható shiftregiszterrel | ✅ | Osztás = visszacsatolt regiszter. |
| Ciklikus kód generálható a `h(x)` paritáspolinommal, visszacsatolt shiftregiszterrel | ✅ | Igen, a `h(x)` alapú generálás. |
| `C(n,k)` kódnál `n=q−1` választást az adóteljesítmény hatékony kihasználása motiválja | ❌ | `n=q−1` oka: a primitív elem rendje `q−1` (a teljes multiplikatív csoport), nem adóteljesítmény. |
| A BCH kód generátorpolinomjának együtthatói 0 vagy 1 | ✅ | Bináris BCH → bináris együtthatók. |
| BCH nem MDS kód | ✅* | Általában a (bináris) BCH nem MDS (az RS, mint speciális BCH, igen). Kontextusfüggő. |

### E) BSC, detekció, kódolási alapok

| Állítás | I/H | Indok |
|---------|:---:|-------|
| Minél nagyobb a csatorna jel-zaj viszonya, annál kisebb a BSC hibavalószínűsége | ✅ | Jobb SNR → kevesebb bithiba. |
| BSC csatorna `p=0,5` mellett minimális kapacitású | ✅ | `p=0,5`-nél `C=0` (a kapacitás minimuma). |
| Memóriával bíró csatornán a minimális Hamming-távolságú döntés nem optimális | ✅ | Memóriás csatornán a ML-döntés eltér a min-távolságtól. |
| Minimális Hamming-távolság emlékezet nélküli (BSC) esetben a minimális hibavalószínűségű detekciót adja | ✅ | Emlékezet nélküli, egyenletes forrásnál a min-távolság = ML = MAP. |
| Egy forrás tipikus sorozatainak eloszlása közel egyenletes | ✅ | Az AEP (aszimptotikus ekvipartíció) következménye. |
| Forráskódolásnál egyértelmű dekódoláshoz a kódszavak nem lehetnek tetszőlegesen rövidek | ✅ | Kraft-egyenlőtlenség korlátozza a hosszakat. |
| Az általános `(n,k)` dekódolás a min-Hamming-távolság miatt `O(2^k)` komplexitású | ✅ | Minden kódszóval (2^k db) összevet. |

### F) Tananyagon kívülinek tűnő állítások ⏭️

> Ezek a **jelenlegi tematikádon kívül** esnek (konvolúciós, trellis, spektrális, forráskódolás-részletek, hibacsapda, PGZ, sokfelhasználós). Csak akkor foglalkozz velük, ha az oktató megerősíti, hogy kellenek.

- ⏭️ Trellis-diagram = RS-kód állapotábrázolása — **H** (a trellis a konvolúciós kódoké).
- ⏭️ Konvolúciós `{C(n,k),L}` állapotvektor hossza `(k−1)·L` — konvolúciós téma.
- ⏭️ Konvolúciós kód állapotvektora függ a kényszerhossztól — **I**, de konvolúciós téma.
- ⏭️ Hibacsapda algoritmus: a szindróma forgatásából kapjuk a hibavektort — **I**, de külön téma.
- ⏭️ Spektrális kódolás: a kódszó Fourier-transzformáltja tartalmazza az üzenetet — **I** (RS spektrális előállítás), de haladó.
- ⏭️ RS spektrális előállítás a kódszóból az üzenet visszanyerését könnyíti — **I**, haladó.
- ⏭️ Shannon-Fano-Elias / Shannon-Fano átlagos kódszóhossza > Huffman (`L(SFE)>L(Huffman)`, `L(SF)>L(Huffman)`) — **I** (Huffman optimális), de forráskódolás.
- ⏭️ LZ77-hez nem kell ismerni a forrás eloszlását — **I**, de forráskódolás.
- ⏭️ PGZ eljáráshoz lineáris egyenletrendszer kell — **I**, de haladó RS-dekódolás.
- ⏭️ Sokfelhasználós: `Ts/Tc` arány határozza meg a kódszó dimenzióját; optimális detekció kvadratikus forma minimalizálása — haladó.
- ⏭️ Burst-hiba javítóképesség, burst-hossz állítások — burst/konvolúciós téma.

> 💬 **Fontos:** több állítás szándékosan „csapda" (pl. az egymásnak ellentmondó `q=p^m` testaxióma-párok, vagy a `d_min` vs. redundancia). Ha egy konkrét állításnál bizonytalan vagy, jelezd a számát, és részletesen kifejtem a pontos megfogalmazás szerinti helyes döntést.

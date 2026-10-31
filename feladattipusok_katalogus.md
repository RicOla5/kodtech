# Kódolástechnika — Feladattípus-katalógus

> Minden előforduló ZH-feladattípus **általános megoldási recepttel**. Ez a „hogyan oldom meg bármelyik ilyen feladatot" referencia — a konkrét ZH-példányok a `kodolastechnika_zh.md`-ben vannak.
>
> Minden típusnál: **mit kérdeznek → képlet/recept → minta → gyakori hiba**.

## Témakörönkénti index

1. [Bináris vektorok + BSC](#t1)
2. [Kódolás alapfogalmai + kódolási sémák](#t2)
3. [Bináris lineáris kódok](#t3)
4. [Hamming-kódok](#t4)
5. [Műveletek GF(q) felett](#t5)
6. [Reed–Solomon kódok](#t6)
7. [Elméleti állítások](#t7)

---

<a name="t1"></a>
## 1. Bináris vektorok + BSC

### 1.1 Hibaminta előfordulási valószínűsége BSC-n
- **Kérdés:** Mi a valószínűsége egy adott `w` súlyú hibamintának, ha a BSC bithiba-valószínűsége `P_b`?
- **Recept:** `P = P_b^w · (1 − P_b)^(n−w)`, ahol `w` = a hibaminta Hamming-súlya (1-esek száma), `n` = a kódszóhossz.
- **Minta:** coset-vezető `000001` (súly 1), `n=6`, `P_b=0,1` → `0,1¹·0,9⁵ = 0,059 ≈ 0,06`.
- **Hiba:** a `(1−P_b)^(n−w)` tagot elfelejteni. A csoportvezető a **legkisebb** súlyú (legvalószínűbb) minta.

### 1.2 Hamming-távolság és -súly
- **Súly** `w(v)` = az 1-esek száma. **Távolság** `d(a,b)` = az eltérő pozíciók száma = `w(a⊕b)`.
- **Minimális kódtávolság** `d_min` = a legkisebb páronkénti távolság a kódszavak között (lineáris kódnál = a legkisebb nemzérus kódszó súlya).

---

<a name="t2"></a>
## 2. Kódolás alapfogalmai + kódolási sémák

### 2.1 Jelző- és javítóképesség
- **Javít:** `t = ⌊(d_min − 1)/2⌋`
- **Jelez (detektál):** `s = d_min − 1`
- **Minta:** `d_min=3` → javít `1`, jelez `2`. `d_min=2` → javít `0`, jelez `1`.
- **Hiba:** a kettő felcserélése! A jelzőképesség mindig ≥ a javítóképesség.

### 2.2 Min-távolság dekóder séma (`v → c′ → u′`)
- **Kérdés:** adott kódtáblázat + bejövő üzenet + hibavektor; add meg `v`, `c′`, `u′`-t.
- **Recept:**
  1. Kódold az üzenetet a táblázat szerint → `c`.
  2. `v = c ⊕ hibavektor` (a csatorna kimenete).
  3. `c′` = a `v`-hez **legközelebbi** kódszó (minimális Hamming-távolság).
  4. `u′` = a `c′`-höz tartozó üzenet a táblázatból.
- **Minta:** `00→00100`, hiba `00100` → `v=00000`, legközelebbi kódszó `c′=00100`, `u′=00`.
- **Hiba:** a `v`-t és `c′`-t összekeverni; nem a legközelebbi kódszót választani.

### 2.3 Kódparaméterek `(n,k)` meghatározása
- `n` = kódszóhossz; `k` = üzenethossz; `2ᵏ` = kódszavak száma (bináris).
- Ha a kódszavak adottak: `k = log₂(kódszavak száma)`, `n` = a kódszó hossza.

---

<a name="t3"></a>
## 3. Bináris lineáris kódok

### 3.1 Szisztematikus G és H felírása
- **Recept:** `G = [ I_k | P ]` (méret `k×n`), ebből `H = [ Pᵀ | I_{n−k} ]` (méret `(n−k)×n`).
- **A `P`-t transzponálni kell** a `H`-hoz! Ez a leggyakoribb hiba.
- **Ellenőrzés:** `G·Hᵀ = 0` (mod 2).

### 3.2 Szindróma számítása
- **Recept:** `s = H · vᵀ` (a vett szó/hibavektor és a `H` szorzata mod 2). Egyszerűbben: a `v` 1-es pozícióihoz tartozó `H`-oszlopok összege (XOR).
- **Minta:** `e=100001`, `H=[Pᵀ|I₄]` → az 1. és 6. `H`-oszlop összege.

### 3.3 Hibacsoport (coset) és coset-vezető
- **Coset:** azonos szindrómájú hibavektorok halmaza. **Méret:** `2ᵏ`.
- **Coset-vezető:** a coset **legkisebb súlyú** eleme (a legvalószínűbb hibaminta).
- **Coset generálása:** `{ e_vezető ⊕ c : c ∈ kód }`.
- **Két vektor egy cosetben ⟺ azonos a szindrómájuk.**

### 3.4 „Darabszám" kérdések — NE keverd!
| Kérdés | Képlet | példa C(6,3) |
|--------|--------|:---:|
| Hány vektor **egy** cosetben? | `2ᵏ` | 8 |
| Hány coset (= szindróma) van? | `2^(n−k)` | 8 |
| Hány hibavektor **összesen**? | `2ⁿ` | 64 |
| Kódszavak száma | `2ᵏ` | 8 |

### 3.5 Szindróma-dekódolási táblázat MÉRETE (bitben)
- **Recept:** `2^(n−k) · (n + (n−k))` — soronként egy hibaminta (`n` bit) + egy szindróma (`n−k` bit).
- **Minta:** C(8,3) → `2⁵·(8+5) = 32·13 = 416`. C(15,11) → `16·19 = 304`.
- **Hiba:** összekeverni a sorok számával (`2^(n−k)`).

### 3.6 Legnagyobb / legkisebb súlyú KÓDSZÓ
- **A kódszavak = `u·G` (az összes `2ᵏ` üzenetre), vagy a 0-szindrómás coset.**
- **Hiba:** a feladatban megadott *coset* elemeiből választani! Mindig a kódszavak közül válassz (hacsak nem „hibavektor a hibacsoportban" a kérdés).

### 3.7 Generátor-/paritásmátrix sor- vagy oszlopvektora
- Szisztematikusnál: `G` sorai `= [egységsor | paritás]`, `H` sorai `= [Pᵀ sor | egységsor]`.
- Oszlopvektor kérdésnél figyelj: a `G` oszlopa `k` hosszú, a `H` oszlopa `(n−k)` hosszú.

---

<a name="t4"></a>
## 4. Hamming-kódok

### 4.1 Paraméterek
- `n = 2^m − 1`, `k = n − m`, `d_min = 3`, **javít `t = 1`**, jelez `2`.
- **Minta:** `m=4 → n=15, k=11`. `m=3 → n=7, k=4`.
- **Hiba:** `t=2`-t írni (az a jelzőképesség fele). Hamming mindig `t=1`!

### 4.2 Hiányzó oszlop rekonstrukciója
- **Recept:** a bináris Hamming `H` oszlopai az **összes nemzérus** `m`-bites vektort tartalmazzák, mindegyiket pontosan egyszer. A hiányzó oszlop(ok) az(ok), amely(ek) még nem szerepel(nek).
- **Minta:** C(7,4), `H` oszlopai közül hiányzik 2 → a 2 még nem szereplő nemzérus 3-bites minta (pl. `111` és `100`).

### 4.3 Üzenet-/kódszóvektorok
- Szisztematikus `G=[I_k|P]`: az `i`-edik oszlop (információs részben) az `I_k` `i`-edik egységoszlopa (`k` hosszú).

---

<a name="t5"></a>
## 5. Műveletek GF(q) felett

### 5.1 GF(p) (p prím) — modulo aritmetika
- Összeadás/szorzás **mod p**. A primitív elem `α` hatványai kiadják az összes nemzérus elemet.
- **Minta (GF(7), α=5):** `5⁰=1, 5¹=5, 5²=25≡4, 5³≡6, 5⁴≡2, 5⁵≡3`.

### 5.2 GF(2^m) — hatványtábla, szorzás
- Az elemek `m`-bites polinomok. **Szorzás = hatványkitevők összege mod (2^m−1).** Összeadás = XOR.
- **Minta (GF(8), 2^m−1=7):** `y⁴·y⁵ = y⁹ = y^(9 mod 7) = y²`.
- **Hiba:** a kitevőket mod `2^m` venni (helyesen mod `2^m−1`).

### 5.3 Shiftregiszter a GF(2^m) szorzáshoz
- **Rekeszek (késleltetők) száma** = a definiáló polinom foka = `m`.
- **Mod-2 összeadók száma** egy adott szorzótényezőhöz = a tényező polinomalakjának nemzérus együtthatói alapján (az `y^i`-ben lévő 1-esek szerinti struktúra).

---

<a name="t6"></a>
## 6. Reed–Solomon kódok

### 6.1 Paraméterek
- **Hossz:** `n = q − 1` (a `GF(q)` nemzérus elemeinek száma).
- **Javítóképesség:** `t = ⌊(n−k)/2⌋`, azaz `n − k = 2t`.
- **Mindig MDS:** `d_min = n − k + 1`.
- **Minta:** GF(7), 2 hibát javít → `n=6, n−k=4, k=2`. GF(11), 3 hibát → `n=10, k=4`.

### 6.2 Paritásellenőrző mátrix `H` sorai
- Az `i`-edik sor: `(α⁰, αⁱ, α²ⁱ, …, α^((n−1)i))` a `GF(q)`-ban.
- **Minta (GF(7), α=5), 1. sor (i=1):** `1,5,4,6,2,3`. 2. sor (i=2, α²=4): `1,4,2,1,4,2`.
- **Az első oszlop mindig csupa 1** (mert `i=0 → α⁰=1`).

### 6.3 Generátormátrix sora (GF(q), α-hatványsor)
- A `G` sorai is `α`-hatványsorok. GF(11), α=2, 2. sor: `1,2,4,8,5,10,9,7,3,6` (a `2ʲ mod 11`).

### 6.4 Üzenet kódolása `c = u·G`
- **Recept:** a `G` sorainak `u`-együtthatós lineáris kombinációja a `GF(q)`-ban (mod q).
- **Minta:** GF(7), `u=(2,2)` → `c=(4,5,3,0,6,1)`. ⚠️ Ezt gyakorold — visszatérő, könnyen elrontható!

### 6.5 Generátorpolinom `g(x)`
- **Recept:** `g(x) = (x−α¹)(x−α²)…(x−α^(2t))`, főegyüttható mindig 1.
- `t=1` (2 gyök): `g(x)=x²+bx+c`, Viète: `b = −(α+α²)`, `c = α·α²`, majd mod q.
- `t=2` (4 gyök): páronként szorozz, majd a két másodfokút össze. (Teljes levezetés: lásd a fő doksi RS-szekcióját.)
- **Minta (GF(5), α=3):** `g(x)=(x−3)(x−4)=x²+3x+2`. (GF(7), α=5, t=2): `x⁴+4x³+6x²+5x+2`.

### 6.6 Shiftregiszteres kódolás/dekódolás
- **Előrecsatolt** (szorzó) regiszter = **kódolás** (adó). Szorzói a `g(x)` együtthatói a konstanstól a főtagig.
- **Visszacsatolt** (osztó) regiszter = **dekódolás** (vevő).
- **Késleltetők száma** = `deg g = n−k`; **szorzók száma** = `deg g + 1`.

### 6.7 Detektált üzenet a vett kódszóból
- A dekódolási algoritmus után kapott kódszóból az üzenet kiolvasása (szisztematikusnál az információs pozíciókból).

---

<a name="t7"></a>
## 7. Elméleti állítások (igaz/hamis)

> „Mind vagy semmi" — egyetlen rossz döntés = 0 pont. A leggyakoribb tételek:

| Tétel | Igaz megfogalmazás |
|-------|-------------------|
| Singleton-korlát | `d ≤ n−k+1` (ennél nagyobb lehetetlen) |
| MDS | `d = n−k+1`; az RS mindig MDS |
| Hamming | `n=2^m−1`, `t=1`, perfekt (de nem feltétlenül MDS) |
| `C(3,1)` | ismétléses, Hamming **és** MDS |
| Coset-méret | `2ᵏ` minden hibacsoportban |
| Szindróma dimenziója | `n−k` (nem `n`!) |
| Szindróma = `H·vᵀ` | **nem** `G`-vel! |
| `H·Gᵀ = 0` | minden lineáris kódra igaz |
| Ciklikus `g(x)` | osztja `xⁿ−1`-et, foka `n−k` |
| Ciklikus `h(x)` | foka `k` |
| Előrecsatolt reg. | szorzás (kódolás); visszacsatolt = osztás (dekódolás) |
| Entrópia (egyenletes N forrás) | `log₂ N` (nem `2^N`!) |
| Forráskódolási tétel | `L̄ ≥ H` (átlagos hossz ≥ entrópia) |
| BSC `p=0,5` | kapacitás minimális (= 0) |
| Nagyobb súlyú hibaminta | **kevésbé** valószínű BSC-n (p<0,5) |

> Részletes, kiértékelt állítás-bank (115 tétel): lásd `kodolastechnika_zh.md` → Elméleti állítás-bank.

---

> **Tananyagon kívül** (ennél a ZH-nál NEM kell): RSA/titkosítás, konvolúciós kódok, trellis, spektrális/Fourier-kódolás, Huffman/Shannon-Fano/LZ77 forráskódolás, hibacsapda, PGZ, sokfelhasználós rendszerek.

# Kódolástechnika ZH — felkészítő csomag

Interaktív felkészítő weboldal + részletes jegyzetek a Kódolástechnika ZH-ra.

## 🌐 Weboldal (GitHub Pages)

Három mód, közös feladatmotorral és szép matematikai képletszedéssel (MathJax):

| Oldal | Mi ez? |
|-------|--------|
| **`index.html`** | Kezdőlap — innen érhető el minden. |
| **`tanulas.html`** | 📚 **Tanulás** — a 6 témakör képletei és lényege, szépen szedve. |
| **`gyakorlo.html`** | 🎮 **Gyakorló** — véletlen feladatok egyesével, azonnali ellenőrzés, lépésenkénti megoldás, pontozás. |
| **`teszt.html`** | 📝 **Minta teszt** — ZH-szerű teszt (5–20 feladat), a végén pontszám + megoldások. |

Technikai fájlok: `engine.js` (közös feladatmotor), `style.css` (közös stílus), `favicon.svg` (logó).

## 📄 Jegyzetek

| Fájl | Mi ez? |
|------|--------|
| **`kodolastechnika_zh.md`** | Részletes jegyzet: 7 korábbi ZH minden feladata megoldással, a két 20 pontos RS generátorpolinom teljes levezetésével, fogalomtárral, buktatókkal és 115 elemű kiértékelt állítás-bankkal. |
| **`feladattipusok_katalogus.md`** | Feladattípus-katalógus általános megoldási receptekkel. |

## 🚀 Pages beállítás

Settings → Pages → Source: `Deploy from a branch`, branch: `main`, mappa: `/ (root)`.
Utána: `https://ricola5.github.io/kodtech/`

## 🧮 Technikai megjegyzések

- A feladatok **kliens-oldalon, véletlenszerűen** generálódnak (nincs szerver).
- A GF-aritmetika a ZH-konvenció szerint: GF(5)→α=3, GF(7)→α=5, GF(11)→α=2.
- A motort 4500 automatikus teszt validálja (minden generátor saját válaszát elfogadja a saját ellenőrzője).

## ⏭️ Tananyagon kívül (ennél a ZH-nál NEM kell)
RSA/titkosítás, konvolúciós kódok, trellis, spektrális/Fourier-kódolás, Huffman/Shannon-Fano/LZ77, hibacsapda, PGZ, sokfelhasználós rendszerek.

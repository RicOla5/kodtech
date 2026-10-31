# Kódolástechnika ZH — felkészülő csomag

Három anyag a ZH-ra való felkészüléshez:

## 📄 Fájlok

| Fájl | Mi ez? |
|------|--------|
| **`kodolastechnika_zh.md`** | A **részletes jegyzet**: 7 korábbi ZH minden feladata megoldással, magyarázattal, a 2 db 20 pontos RS generátorpolinom teljes levezetésével, fogalomtárral, buktatókkal és 115 elemű kiértékelt állítás-bankkal. |
| **`feladattipusok_katalogus.md`** | A **feladattípus-katalógus**: minden előforduló típus általános megoldási recepttel (nem konkrét példányok, hanem „hogyan oldom meg bármelyik ilyet"). Gyors átnézéshez. |
| **`gyakorlo.html` + `gyakorlo.js`** | Az **interaktív gyakorló weboldal**: véletlen generált feladatok, automatikus ellenőrzés, lépésenkénti megoldás, pontozás. |

## 🎮 Az interaktív gyakorló használata

1. Nyisd meg a **`gyakorlo.html`**-t bármelyik böngészőben (nem kell internet, szerver vagy telepítés).
   - Fontos: a `gyakorlo.html` és a `gyakorlo.js` **egy mappában** legyen.
2. Válassz témakört a felső gombokkal (vagy hagyd „🎲 Vegyes"-en).
3. Írd be a választ, nyomj <kbd>Enter</kbd>-t vagy az „Ellenőrzés" gombot.
4. Hibás válasznál automatikusan megjelenik a lépésenkénti megoldás.
5. A „💡 Megoldás mutatása" bármikor felfedi a megoldást.
6. A haladásod (megoldva / helyes / sorozat / arány) a böngészőben mentődik.

### Mit gyakorol?
- **BSC** hibaminta-valószínűség
- **Jelzés/javítás**, min-távolság dekóder séma (`v→c′→u′`)
- **Lineáris kódok**: darabszámok, táblázatméret, szisztematikus G/H sorok, szindróma
- **Hamming**: paraméterek, hiányzó oszlop
- **GF(8)** hatványtábla-szorzás
- **Reed–Solomon**: paraméterek, H/G sorok, generátorpolinom, u·G kódolás, shiftregiszter méretezés
- **Elméleti állítások** igaz/hamis

Minden GF-aritmetika a ZH-konvenció szerint (GF(5)→α=3, GF(7)→α=5, GF(11)→α=2).

## ⏭️ Tananyagon kívül (ennél a ZH-nál NEM kell)
RSA/titkosítás, konvolúciós kódok, trellis, spektrális/Fourier-kódolás, Huffman/Shannon-Fano/LZ77, hibacsapda, PGZ, sokfelhasználós rendszerek.

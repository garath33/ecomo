# Ecomo

Prezentační web [Ecomo s.r.o.](https://www.ecomo.cz) — fotovoltaika a tepelná čerpadla.

## Jak to teď běží

- **`main`** je ostří. Nic sem nejde přímo, jen schváleným pull requestem.
- Člověk pracuje na `feature/<nazev-funkce>`, cloud agent na `cursor/<nazev>-<id>`. Každá změna má vlastní PR, CI a náhled.
- Náhled: [https://garath33.github.io/ecomo/](https://garath33.github.io/ecomo/) (z feature větve s pruhem „Náhledové prostředí“, z `main` bez něj).
- Plán práce je v [docs/PLAN.md](docs/PLAN.md). Pipeline je v [CONTRIBUTING.md](CONTRIBUTING.md).

## Lokálně

```bash
npm install
npm run dev
```

Testy, které má projít každá změna:

```bash
npm run test:all
```

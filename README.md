# Ecomo

Prezentační web [Ecomo s.r.o.](https://www.ecomo.cz) — fotovoltaika a tepelná čerpadla.

## Jak to teď běží

- **`main`** je ostří. Nic sem nejde přímo, jen schváleným pull requestem.
- Člověk pracuje na `feature/<nazev-funkce>`, cloud agent na `cursor/<nazev>-<id>`. Každá změna má vlastní PR, CI a náhled.
- Náhled pracovní větve: [https://garath33.github.io/ecomo/preview/](https://garath33.github.io/ecomo/preview/) (žluto-černá lišta). Ostří po merge do `main`: [https://garath33.github.io/ecomo/](https://garath33.github.io/ecomo/) (bez lišty).
- Stav funkcí je v [docs/ROADMAP.md](docs/ROADMAP.md), historie v [docs/CHANGELOG.md](docs/CHANGELOG.md), struktura v [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
- Zásady práce jsou v [docs/PLAN.md](docs/PLAN.md). Pipeline je v [CONTRIBUTING.md](CONTRIBUTING.md).

## Lokálně

```bash
npm install
npm run dev
```

Testy, které má projít každá změna (postup je v [docs/TESTING.md](docs/TESTING.md)):

```bash
npm run test:all
```

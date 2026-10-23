# Ecomo

Prezentační web [Ecomo s.r.o.](https://www.ecomo.cz) — fotovoltaika a tepelná čerpadla.

## Jak to teď běží

- **`main`** je ostří. Nic sem nejde přímo, jen schváleným pull requestem.
- Každá změna je na větvi `cursor/...`, má vlastní PR, CI a náhled.
- Náhled: [https://garath33.github.io/ecomo/](https://garath33.github.io/ecomo/) (z feature větve s pruhem „Náhledové prostředí“, z `main` bez něj).
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

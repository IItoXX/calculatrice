# Atelier Jest — Calculatrice API + Tests automatiques

API REST en Node.js + Express, conteneurisée Docker, testée avec Jest.

## Routes attendues

| Opération | URL |
|---|---|
| Addition | `GET /add?a=4&b=2` |
| Soustraction | `GET /sub?a=9&b=3` |
| Multiplication | `GET /mul?a=5&b=4` |
| Division | `GET /div?a=12&b=2` |

Réponse JSON : `{ "result": 6 }`

## Lancement

```powershell
docker compose up
```

## Tests

```powershell
docker compose exec api npm test
```

# Atelier Pytest — Calculatrice API + Tests automatiques

API REST en Python + Flask, conteneurisée Docker, testée avec Pytest.

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
docker compose exec api pytest
```

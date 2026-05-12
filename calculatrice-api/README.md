# Calculatrice API (HTTP + curl)

Version HTTP de la calculatrice : le conteneur expose un serveur sur `localhost:3000` et chaque opération est appelable avec `curl`.

## Lancement

```powershell
docker compose up --build -d
```

Le serveur écoute sur `http://localhost:3000`.

Pour arrêter :

```powershell
docker compose down
```

## Endpoints

- `GET /` ou `GET /health` → infos + liste des opérations
- `GET /calc/<op>?a=<n>&b=<n>` → opérations binaires
- `GET /calc/sqrt?a=<n>` → racine carrée (unaire)

Opérations binaires : `add`, `sub`, `mul`, `div`, `pow`, `mod`, `pct`
Opération unaire : `sqrt`

## Exemples curl

```powershell
# Healthcheck
curl http://localhost:3000/

# Addition : 5 + 3
curl "http://localhost:3000/calc/add?a=5&b=3"

# Soustraction : 10 - 4
curl "http://localhost:3000/calc/sub?a=10&b=4"

# Multiplication : 6 * 7
curl "http://localhost:3000/calc/mul?a=6&b=7"

# Division : 20 / 4
curl "http://localhost:3000/calc/div?a=20&b=4"

# Puissance : 2^10
curl "http://localhost:3000/calc/pow?a=2&b=10"

# Racine carrée : √144
curl "http://localhost:3000/calc/sqrt?a=144"

# Modulo : 17 % 5
curl "http://localhost:3000/calc/mod?a=17&b=5"

# Pourcentage : 15% de 200
curl "http://localhost:3000/calc/pct?a=200&b=15"
```

## Réponse type

```json
{
  "operation": "add",
  "a": 5,
  "b": 3,
  "resultat": 8
}
```

En cas d'erreur :

```json
{ "error": "Division par zéro impossible" }
```

## Logs

```powershell
docker compose logs -f
```

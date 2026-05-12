# Calculatrice TypeScript dockerisée

## Build

```bash
docker compose build
```

## Utilisation

Démonstration de toutes les fonctions :
```bash
docker compose run --rm calculatrice
```

Opérations spécifiques :
```bash
docker compose run --rm calculatrice add 5 3      # 8
docker compose run --rm calculatrice sub 10 4     # 6
docker compose run --rm calculatrice mul 6 7      # 42
docker compose run --rm calculatrice div 20 4     # 5
docker compose run --rm calculatrice pow 2 10     # 1024
docker compose run --rm calculatrice sqrt 144     # 12
docker compose run --rm calculatrice mod 17 5     # 2
docker compose run --rm calculatrice pct 200 15   # 30
```

## Fonctions disponibles

- `addition(a, b)`
- `soustraction(a, b)`
- `multiplication(a, b)`
- `division(a, b)` — erreur si b = 0
- `puissance(base, exposant)`
- `racineCarree(n)` — erreur si n < 0
- `modulo(a, b)` — erreur si b = 0
- `pourcentage(valeur, pourcent)`

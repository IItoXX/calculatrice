# Calculatrice Web (interface graphique)

Même backend que `calculatrice-api`, mais avec une **interface web** servie par le même conteneur. Le serveur expose à la fois :

- l'UI sur `http://localhost:8080/`
- l'API JSON sur `http://localhost:8080/calc/<op>` (testable avec `curl`)

## Lancement

```powershell
docker compose up --build -d
```

Ensuite ouvre **http://localhost:8080** dans le navigateur.

Pour arrêter :

```powershell
docker compose down
```

## Interface

- Champs `a` et `b`
- Menu déroulant des opérations (le champ `b` se cache automatiquement pour `√`)
- Bouton **Calculer** → affiche le résultat ou l'erreur
- Historique des derniers calculs (les 20 plus récents)

## API JSON (identique à `calculatrice-api`)

```powershell
curl "http://localhost:8080/calc/add?a=5&b=3"
curl "http://localhost:8080/calc/sqrt?a=144"
curl http://localhost:8080/health
```

Opérations : `add`, `sub`, `mul`, `div`, `pow`, `mod`, `pct`, `sqrt`.

## Logs

```powershell
docker compose logs -f
```

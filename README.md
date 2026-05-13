# Calculatrice — projet complet

Repo qui regroupe plusieurs versions d'une même calculatrice, faites au fil des ateliers : CLI, API HTTP, version web, version avec base de données, tests automatiques (Jest et Pytest), CI GitHub Actions, déploiement Vercel/Render et monitoring Prometheus/Grafana.

Le code des fonctions de calcul est volontairement dupliqué dans chaque dossier pour que chaque atelier reste autonome.

## Les dossiers

| Dossier | Ce que c'est |
|---|---|
| `./` (racine) | Calculatrice en CLI (TypeScript, conteneur jetable lancé avec `docker compose run`) |
| `calculatrice-api/` | Même calcul mais exposée en HTTP, testable avec `curl` |
| `calculatrice-web/` | Version avec interface graphique + API. C'est celle qui est déployée sur Render + Vercel |
| `calculatrice-bddweb/` | Version qui stocke l'historique des opérations dans MySQL, avec phpMyAdmin pour visualiser |
| `atelier-jest/` | API Node/Express minimaliste + tests Jest |
| `atelier-pytest/` | Même API mais en Python/Flask + tests Pytest |
| `calculatrice-monitoring/` | Prometheus + Grafana qui surveillent `calculatrice-web` (mode API only) |
| `.github/workflows/` | Pipelines GitHub Actions qui lancent les tests à chaque push |

Tous les dossiers ont leur propre `Dockerfile` et `docker-compose.yml`. Les versions sont indépendantes, on ne peut pas en lancer plusieurs en même temps si elles utilisent le même port hôte.

---

## 1. CLI (racine)

Version la plus simple, pas de serveur HTTP. Le conteneur exécute une commande puis s'arrête.

```powershell
docker compose build
docker compose run --rm calculatrice add 5 3        # 8
docker compose run --rm calculatrice sqrt 144       # 12
docker compose run --rm calculatrice                # démo de toutes les fonctions
```

Opérations : `add`, `sub`, `mul`, `div`, `pow`, `sqrt`, `mod`, `pct`.

## 2. API JSON (`calculatrice-api/`)

API HTTP qui répond du JSON. Le frontend n'existe pas, tout se fait via `curl` ou le navigateur.

```powershell
cd calculatrice-api
docker compose up --build -d
```

Endpoints :
- `GET /calc/add?a=5&b=3` → `{"resultat": 8}`
- `GET /calc/sqrt?a=144`
- `GET /health` → liste des opérations dispos

Port : `3000`.

## 3. Web (`calculatrice-web/`)

Même backend que l'API mais avec en plus une page HTML/CSS/JS qui appelle les endpoints. Le serveur peut tourner en deux modes :

- complet (UI + API) → comportement par défaut
- API only → mettre `SERVE_STATIC=false` dans l'env, utile pour le monitoring et le déploiement back séparé

```powershell
cd calculatrice-web
docker compose up --build -d
```

Puis http://localhost:8080.

C'est cette version qui est **déployée en production** :
- Front sur Vercel (le dossier `public/` avec un `vercel.json` qui proxifie `/calc/*` vers Render)
- Back sur Render (le serveur Node en mode API only)

## 4. Web + base de données (`calculatrice-bddweb/`)

Pareil que `calculatrice-web` mais chaque calcul est enregistré dans une table MySQL. Un bouton dans l'UI permet de vider l'historique, et phpMyAdmin est inclus pour regarder la base directement.

```powershell
cd calculatrice-bddweb
docker compose up --build -d
```

| Service | URL | Login |
|---|---|---|
| App | http://localhost:8082 | — |
| phpMyAdmin | http://localhost:8083 | root / root |
| MySQL | non exposé sur l'hôte | — |

Le port MySQL n'est pas mappé côté hôte (conflit possible avec XAMPP sur 3306). L'app et phpMyAdmin communiquent via le réseau Docker interne.

Le premier `up` met une bonne trentaine de secondes : MySQL s'initialise, l'app attend via un retry de 30 tentatives avant d'abandonner.

## 5. Tests Jest (`atelier-jest/`)

API Express minimale (4 routes : `/add`, `/sub`, `/mul`, `/div`) + 5 tests Jest sur les fonctions pures.

```powershell
cd atelier-jest
docker compose up --build -d
docker compose exec api npm test
```

Réponse JSON : `{"result": 6}`.

## 6. Tests Pytest (`atelier-pytest/`)

Équivalent en Python/Flask + 5 tests Pytest.

```powershell
cd atelier-pytest
docker compose up --build -d
docker compose exec api pytest -v
```

Port : `5000`.

## 7. CI GitHub Actions

Deux workflows séparés dans `.github/workflows/` :

- `test-jest.yml` → se déclenche sur push qui touche `atelier-jest/**`, installe Node 20, lance `npm test`
- `test-pytest.yml` → se déclenche sur push qui touche `atelier-pytest/**`, installe Python 3.12, lance `pytest -v`

Les workflows utilisent un `paths` filter donc ils ne tournent que si le bon sous-dossier a été modifié, pas à chaque commit. Résultats visibles dans l'onglet Actions du repo.

## 8. Monitoring (`calculatrice-monitoring/`)

Stack Prometheus + Grafana pour surveiller `calculatrice-web` en mode API. Le compose construit l'image depuis `../calculatrice-web` et la lance avec `SERVE_STATIC=false`.

```powershell
cd calculatrice-monitoring
docker compose up --build -d
```

| Service | URL | Login |
|---|---|---|
| App API | http://localhost:8080 | — |
| Prometheus | http://localhost:9090 | — |
| Grafana | http://localhost:3001 | admin / admin |

Le dashboard `Calculatrice — Monitoring` est auto-importé via le provisioning de Grafana. Il affiche :
- gauge CPU (%)
- gauge RAM (MB)
- requêtes/sec par route
- RAM dans le temps (résidente + heap V8)
- CPU dans le temps (total / user / system)
- latence p50 et p95 par route

L'app expose ses métriques sur `/metrics` grâce au package `prom-client` (compteurs, histogrammes, métriques par défaut de Node).

Pour générer du trafic et voir les courbes bouger :

```powershell
while ($true) {
  Invoke-WebRequest -UseBasicParsing "http://localhost:8080/calc/add?a=5&b=3" | Out-Null
  Invoke-WebRequest -UseBasicParsing "http://localhost:8080/calc/div?a=10&b=2" | Out-Null
  Start-Sleep -Milliseconds 200
}
```

Note : cAdvisor a été retiré du compose. Il marche mal sur Docker Desktop Windows (il ne voit pas les conteneurs individuellement à cause de la VM Linux intermédiaire) et les métriques natives Node de `prom-client` suffisent pour CPU/RAM.

---

## Conflits de port à connaître

Beaucoup de dossiers utilisent le port 8080 ou similaire. Avant de lancer un dossier, faire `docker compose down` dans celui qui tournait avant.

| Port hôte | Utilisé par |
|---|---|
| 3000 | `calculatrice-api` |
| 3001 | Grafana (`calculatrice-monitoring`) |
| 5000 | `atelier-pytest` |
| 8080 | `calculatrice-web` **et** `calculatrice-monitoring` (un seul à la fois) |
| 8082 | `calculatrice-bddweb` |
| 8083 | phpMyAdmin (`calculatrice-bddweb`) |
| 9090 | Prometheus (`calculatrice-monitoring`) |

## Stack technique

- TypeScript / JavaScript (Node 20)
- Python 3.12 (atelier Pytest)
- Docker + Docker Compose
- MySQL 8 + phpMyAdmin
- Prometheus + Grafana
- prom-client (lib Node pour les métriques)
- Jest, Pytest
- GitHub Actions
- Render (back), Vercel (front)

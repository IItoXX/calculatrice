# Calculatrice BDD Web

Calculatrice avec interface web + historique persistant dans MySQL. phpMyAdmin inclus pour visualiser/éditer la base.

## Services

| Service | URL | Port |
|---|---|---|
| Application web | http://localhost:8082 | 8082 |
| phpMyAdmin | http://localhost:8083 | 8083 |
| MySQL | interne au réseau Docker | non exposé |

MySQL n'est accessible que depuis le réseau Docker (par l'app et phpMyAdmin). Pour y accéder depuis l'hôte, utilise phpMyAdmin sur http://localhost:8083.

## Lancement

```powershell
cd "c:\Users\allan\Desktop\calculatrice docker\calculatrice-bddweb"
docker compose up --build -d
```

Le premier démarrage est plus long (init MySQL). L'app attend que MySQL soit prêt avant de servir.

Suivre les logs :

```powershell
docker compose logs -f app
```

Arrêt :

```powershell
docker compose down
```

Tout supprimer (y compris les données BDD) :

```powershell
docker compose down -v
```

## Accès phpMyAdmin

- URL : http://localhost:8083
- Utilisateur : `root`
- Mot de passe : `root`
- Base : `calculatrice`
- Table : `historique`

## Schéma de la table

```sql
CREATE TABLE historique (
  id INT AUTO_INCREMENT PRIMARY KEY,
  operation VARCHAR(10) NOT NULL,
  a DOUBLE NOT NULL,
  b DOUBLE NULL,
  resultat DOUBLE NULL,
  erreur VARCHAR(255) NULL,
  cree_a TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API

- `GET /calc/<op>?a=&b=` → calcul + enregistrement
- `GET /history` → liste les 20 derniers calculs
- `GET /history?limite=50` → personnaliser la limite (max 200)
- `DELETE /history` → vider la table
- `GET /health` → statut

## Exemples curl

```powershell
curl "http://localhost:8082/calc/add?a=5&b=3"
curl "http://localhost:8082/calc/div?a=10&b=0"
curl http://localhost:8082/history
curl -X DELETE http://localhost:8082/history
```

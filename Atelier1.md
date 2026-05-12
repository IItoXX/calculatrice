# Mini-Projet : BDD et tests manuels sur une application e-commerce

## Introduction

Ce projet porte sur une application e-commerce simplifiée, inspirée d'un site comme Amazon.
L'objectif est de partir de besoins utilisateurs, de les transformer en user stories, puis de définir des critères d'acceptation, des scénarios BDD en syntaxe **Given / When / Then** et des procédures de tests manuels.

Les fonctionnalités étudiées sont :

- Recherche d'un produit
- Consultation de la fiche produit
- Ajout d'un produit au panier
- Gestion du panier
- Application d'un code promo
- Passage de commande
- Confirmation de commande

---

## 1. Recherche d'un produit

### A. User story

> En tant que client, je veux rechercher un produit à partir d'un mot-clé afin de trouver rapidement les articles qui m'intéressent.

### B. Critères d'acceptation

- L'utilisateur peut saisir un mot-clé dans la barre de recherche.
- Le système affiche une liste de produits correspondant au mot-clé saisi.
- Les résultats affichent au minimum le nom du produit, son prix et son image.
- Si aucun produit ne correspond à la recherche, un message clair est affiché.
- La recherche ne doit pas être sensible aux majuscules ou minuscules.

### C. Scénario BDD

```gherkin
Scenario: Recherche d'un produit avec un mot-clé valide
  Given l'utilisateur est sur la page d'accueil du site
  When l'utilisateur saisit "casque Bluetooth" dans la barre de recherche
  And il clique sur le bouton de recherche
  Then une liste de produits correspondant à "casque Bluetooth" s'affiche
  And chaque produit affiche un titre, un prix et une image
```

### D. Test manuel

**Préconditions :**

- L'utilisateur est sur la page d'accueil du site.
- Des produits correspondant au mot-clé "casque Bluetooth" existent dans la base de données.

**Actions à réaliser :**

1. Aller sur la page d'accueil du site.
2. Cliquer dans la barre de recherche.
3. Saisir le mot-clé "casque Bluetooth".
4. Cliquer sur le bouton de recherche.
5. Observer la page de résultats.

**Résultat attendu :**

- Une liste de produits correspondant à "casque Bluetooth" est affichée.
- Chaque résultat contient au moins un nom, un prix et une image.
- Les produits affichés sont cohérents avec la recherche.

---

## 2. Consultation de la fiche produit

### A. User story

> En tant que client, je veux consulter la fiche détaillée d'un produit afin d'obtenir toutes les informations nécessaires avant de l'acheter.

### B. Critères d'acceptation

- L'utilisateur peut cliquer sur un produit depuis la liste des résultats.
- Le système affiche une fiche produit détaillée.
- La fiche produit contient le titre, le prix, la description, l'image, les avis et la disponibilité.
- Un bouton "Ajouter au panier" est visible si le produit est disponible.
- Si le produit est indisponible, l'information doit être clairement affichée.

### C. Scénario BDD

```gherkin
Scenario: Consultation de la fiche d'un produit
  Given l'utilisateur consulte une liste de résultats de recherche
  When l'utilisateur clique sur un produit
  Then la fiche détaillée du produit s'affiche
  And le titre, le prix, la description, les avis et la disponibilité sont visibles
```

### D. Test manuel

**Préconditions :**

- L'utilisateur a effectué une recherche.
- La liste des résultats contient au moins un produit.

**Actions à réaliser :**

1. Effectuer une recherche de produit.
2. Cliquer sur un produit dans la liste.
3. Vérifier l'affichage de la fiche produit.
4. Observer les informations présentes sur la page.

**Résultat attendu :**

- La fiche produit s'ouvre correctement.
- Le titre du produit est visible.
- Le prix est affiché.
- La description est présente.
- Les avis clients sont visibles.
- La disponibilité du produit est indiquée.

---

## 3. Ajout d'un produit au panier

### A. User story

> En tant que client, je veux ajouter un produit à mon panier afin de pouvoir l'acheter plus tard.

### B. Critères d'acceptation

- L'utilisateur peut ajouter un produit disponible au panier.
- Le produit ajouté apparaît dans le panier.
- La quantité par défaut est égale à 1.
- Le prix du produit est correctement pris en compte dans le total.
- Le nombre d'articles dans le panier est mis à jour.
- Un message de confirmation apparaît après l'ajout.

### C. Scénario BDD

```gherkin
Scenario: Ajout d'un produit disponible au panier
  Given l'utilisateur consulte la fiche d'un produit disponible
  When l'utilisateur clique sur "Ajouter au panier"
  Then le produit est ajouté au panier avec la quantité 1
  And le total du panier est mis à jour
  And un message de confirmation s'affiche
```

### D. Test manuel

**Préconditions :**

- L'utilisateur est sur la fiche d'un produit disponible en stock.
- Le panier est vide ou accessible.

**Actions à réaliser :**

1. Aller sur la fiche produit.
2. Vérifier que le produit est disponible.
3. Cliquer sur "Ajouter au panier".
4. Ouvrir le panier.
5. Vérifier le contenu du panier.

**Résultat attendu :**

- Le produit est présent dans le panier.
- La quantité affichée est 1.
- Le prix du produit est correct.
- Le total du panier est mis à jour.
- Un message confirme l'ajout au panier.

---

## 4. Gestion du panier

### A. User story

> En tant que client, je veux consulter et modifier mon panier afin de gérer les produits que je souhaite acheter.

### B. Critères d'acceptation

- L'utilisateur peut voir la liste des produits ajoutés au panier.
- L'utilisateur peut modifier la quantité d'un produit.
- L'utilisateur peut supprimer un produit du panier.
- Le total du panier est recalculé après chaque modification.
- Si le panier est vide, un message l'indique clairement.
- Les modifications sont visibles immédiatement.

### C. Scénario BDD

```gherkin
Scenario: Modification de la quantité d'un produit dans le panier
  Given l'utilisateur a un produit dans son panier avec la quantité 1
  When l'utilisateur change la quantité à 2
  Then la quantité du produit est mise à jour
  And le total du panier est recalculé
```

### D. Test manuel

**Préconditions :**

- L'utilisateur a ajouté au moins un produit au panier.

**Actions à réaliser :**

1. Ouvrir le panier.
2. Vérifier que le produit ajouté est présent.
3. Modifier la quantité du produit de 1 à 2.
4. Observer le total du panier.
5. Supprimer le produit du panier.
6. Vérifier l'état du panier.

**Résultat attendu :**

- La quantité du produit passe bien à 2.
- Le total du panier est recalculé correctement.
- Après suppression, le produit disparaît du panier.
- Si aucun produit ne reste, un message indique que le panier est vide.

---

## 5. Application d'un code promo

### A. User story

> En tant que client, je veux appliquer un code promo valide afin de bénéficier d'une réduction sur le montant total de mon panier.

### B. Critères d'acceptation

- L'utilisateur peut saisir un code promo dans le panier.
- Si le code promo est valide, la réduction est appliquée.
- Le montant de la réduction est affiché.
- Le nouveau total du panier est affiché.
- Si le code promo est invalide, un message d'erreur est affiché.
- Un même code promo ne doit pas être appliqué plusieurs fois sur la même commande.

### C. Scénario BDD

```gherkin
Scenario: Application d'un code promo valide
  Given l'utilisateur a un panier contenant au moins un produit
  And le code promo "PROMO10" est valide
  When l'utilisateur saisit "PROMO10" dans le champ code promo
  And il clique sur "Appliquer"
  Then une réduction de 10% est appliquée au total du panier
  And le nouveau total est affiché
```

### D. Test manuel

**Préconditions :**

- Le panier contient au moins un produit.
- Le code promo "PROMO10" existe et donne une réduction de 10%.

**Actions à réaliser :**

1. Ouvrir le panier.
2. Repérer le champ de saisie du code promo.
3. Saisir le code "PROMO10".
4. Cliquer sur "Appliquer".
5. Observer le total du panier.

**Résultat attendu :**

- Le code promo est accepté.
- Une réduction de 10% est appliquée.
- Le montant de la réduction est visible.
- Le total final du panier est mis à jour.

---

## 6. Passage de commande

### A. User story

> En tant que client, je veux passer commande à partir de mon panier afin d'acheter les produits sélectionnés.

### B. Critères d'acceptation

- L'utilisateur peut accéder au checkout depuis le panier.
- Le système affiche un formulaire de commande.
- L'utilisateur peut saisir son adresse de livraison.
- L'utilisateur peut choisir un mode de livraison.
- L'utilisateur peut renseigner ses informations de paiement.
- La commande ne peut être validée que si les informations obligatoires sont complètes.
- Un récapitulatif de commande est affiché avant validation.

### C. Scénario BDD

```gherkin
Scenario: Passage d'une commande avec des informations valides
  Given l'utilisateur a un panier contenant au moins un produit
  When l'utilisateur clique sur "Passer la commande"
  And il saisit une adresse de livraison valide
  And il choisit un mode de livraison
  And il saisit des informations de paiement valides
  And il valide la commande
  Then la commande est enregistrée
  And l'utilisateur est redirigé vers la page de confirmation
```

### D. Test manuel

**Préconditions :**

- L'utilisateur a au moins un produit dans son panier.
- Le produit est disponible.
- L'utilisateur est connecté ou peut passer commande en tant qu'invité.

**Actions à réaliser :**

1. Ouvrir le panier.
2. Cliquer sur "Passer la commande".
3. Saisir une adresse de livraison valide.
4. Choisir un mode de livraison.
5. Saisir les informations de paiement.
6. Vérifier le récapitulatif de commande.
7. Cliquer sur "Valider la commande".

**Résultat attendu :**

- Le formulaire accepte les informations valides.
- Le récapitulatif de commande est correct.
- La commande est bien enregistrée.
- L'utilisateur est redirigé vers une page de confirmation.

---

## 7. Confirmation de commande

### A. User story

> En tant que client, je veux recevoir une confirmation claire après ma commande afin d'être sûr que mon achat a bien été pris en compte.

### B. Critères d'acceptation

- Après validation de la commande, une page de confirmation s'affiche.
- La page contient un numéro de commande.
- La page contient un récapitulatif des produits achetés.
- Le montant total payé est affiché.
- L'adresse de livraison est affichée.
- Un message de confirmation clair est visible.
- Le panier est vidé après la validation de la commande.

### C. Scénario BDD

```gherkin
Scenario: Affichage de la confirmation après une commande validée
  Given l'utilisateur a validé une commande avec succès
  When la commande est enregistrée par le système
  Then une page de confirmation s'affiche
  And un numéro de commande est visible
  And le récapitulatif des achats est affiché
  And le panier est vidé
```

### D. Test manuel

**Préconditions :**

- L'utilisateur a terminé le processus de commande.
- La commande a été validée avec succès.

**Actions à réaliser :**

1. Valider une commande complète.
2. Observer la page affichée après validation.
3. Vérifier la présence du numéro de commande.
4. Vérifier le récapitulatif des produits.
5. Vérifier le montant total payé.
6. Retourner dans le panier.

**Résultat attendu :**

- Une page de confirmation est affichée.
- Un message indique que la commande est confirmée.
- Un numéro de commande est visible.
- Le récapitulatif contient les bons produits.
- Le montant total est correct.
- Le panier est vide après la commande.

---

## Conclusion

Ce mini-projet m'a permis de mieux comprendre l'importance de la démarche BDD dans le développement d'une application.
En partant des besoins utilisateurs, il devient plus simple de définir ce que l'application doit faire et de vérifier si chaque fonctionnalité fonctionne correctement.

La rédaction des **user stories** permet de rester centré sur l'utilisateur. Les **critères d'acceptation** permettent de préciser les résultats attendus de manière testable. Les **scénarios BDD** facilitent la communication entre les développeurs, les testeurs et les personnes métier grâce à une syntaxe claire : *Given / When / Then*.

Enfin, les **tests manuels** permettent de vérifier concrètement le comportement de l'application à l'écran. La principale difficulté a été de formuler des critères précis et observables, mais cette étape est essentielle pour éviter les ambiguïtés et garantir la qualité du produit final.

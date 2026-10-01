# Accueil TPC Summit, Edge of AI

App web mobile pour pointer les arrivées à l'accueil. Un seul fichier (`index.html`), aucune configuration.

## Comment ça marche

- La liste des invités et les pointages sont dans la base Notion **« Accueil TPC Summit, Edge of AI »**.
- L'app passe par le workflow n8n **« Accueil TPC Summit (API Notion) »** (instance n8n de TPC), qui lit et écrit dans Notion.
- Plusieurs personnes peuvent pointer en même temps depuis leur téléphone, sans compte. L'app se met à jour toutes les 6 secondes. Rien n'est perdu si on ferme l'app.
- Au premier lancement, l'app demande le **code d'accès** de l'équipe.

## Mettre en ligne

**GitHub Pages** : pousser `index.html` dans un dépôt, puis Settings > Pages > Deploy from a branch > `main` / `root`.

**Vercel** : importer le dépôt, preset « Other », aucune variable à configurer.

## Prérequis côté Notion (une seule fois)

La connexion Notion **« n8n automation »** doit avoir accès à la base : dans la base, menu ••• > Connexions > ajouter « n8n automation ».

## Changer le code d'accès

Dans n8n, workflow « Accueil TPC Summit (API Notion) » : modifier `ACCESS_CODE` dans les 4 nœuds « Vérifier… », puis publier.

## Ajouter un invité avant l'événement

Créer une ligne dans la base Notion avec Prénom, Nom, Statut « Pas venu », Source « Liste ». Elle apparaît dans l'app dans les secondes qui suivent.

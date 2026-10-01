# Accueil TPC Summit, Edge of AI

App web mobile pour pointer les arrivées à l'accueil. Toutes les données vivent dans la base Notion **« Accueil TPC Summit, Edge of AI »** : l'app lit la liste dans Notion et y écrit le statut (Venu / Pas venu), l'heure d'arrivée et le nombre d'accompagnants. Plusieurs personnes peuvent pointer en même temps, rien n'est perdu si l'app est fermée, et la base Notion reste consultable et modifiable à la main.

Aucun nom de participant n'est stocké dans ce dépôt.

## Contenu

- `index.html` : l'interface (mobile first).
- `api/guests.js` : lit la liste dans Notion.
- `api/checkin.js` : pointe / dépointe une personne, met à jour ses accompagnants.
- `api/walkin.js` : ajoute ou supprime une personne hors liste.
- `lib/notion.js` : appels à l'API Notion.
- `.env.example` : variables à configurer dans Vercel.

## Mise en place (10 minutes)

### 1. Créer l'intégration Notion
1. Aller sur https://www.notion.so/profile/integrations, cliquer **New integration**.
2. Type **Internal**, choisir l'espace de travail TPC, capacités : *Read content*, *Update content*, *Insert content*.
3. Copier le **secret** (commence par `ntn_`).

### 2. Donner accès à la base
Ouvrir la base « Accueil TPC Summit, Edge of AI » dans Notion, menu **•••** en haut à droite, **Connections**, ajouter l'intégration créée.

### 3. Déployer sur Vercel
1. Pousser ce dossier sur GitHub (dépôt privé).
2. Sur vercel.com : **Add New > Project**, importer le dépôt. Framework preset : **Other**, pas de commande de build.
3. **Settings > Environment Variables** :
   - `NOTION_TOKEN` : le secret de l'intégration.
   - `NOTION_DATABASE_ID` : `b08a8e113dae474ca3d2187c6c6b2d41`
   - `ACCESS_CODE` : un code simple à communiquer à l'équipe (recommandé, voir plus bas).
4. Déployer (ou **Redeploy** si le projet existait déjà, pour prendre en compte les variables).

### 4. Tester avant le jour J
Ouvrir l'URL sur deux téléphones, saisir le code. En haut à droite : point vert **Synchronisé**. Pointer une personne sur le premier : elle passe en vert sur le second en quelques secondes et apparaît en « Venu » dans Notion avec l'heure. Fermer et rouvrir l'app, puis annuler le pointage de test.

## Fonctionnement

- L'app relit la base toutes les 5 secondes : un pointage fait sur un téléphone apparaît sur les autres en 5 à 10 secondes.
- Les modifications faites directement dans Notion (changer un statut, ajouter une ligne) apparaissent aussi dans l'app.
- Une personne ajoutée « hors liste » crée une ligne dans Notion avec la source **Hors liste**.
- « Annuler » sur un inscrit le repasse en « Pas venu » ; sur une personne hors liste, sa ligne est supprimée (corbeille Notion).
- Ajouter un inscrit avant l'événement : créer une ligne dans Notion avec le prénom, le nom, Statut « Pas venu » et Source « Liste ».

## Sécurité

- Le secret Notion reste côté serveur (variables Vercel), jamais dans le navigateur ni dans le dépôt.
- Le site Vercel est public : sans `ACCESS_CODE`, toute personne qui a l'URL voit les noms et peut pointer. Avec `ACCESS_CODE`, l'app demande le code à l'ouverture (il est ensuite mémorisé sur le téléphone).

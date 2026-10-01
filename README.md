# Accueil TPC Summit

Petite app web pour pointer les arrivées à l'accueil d'un événement : recherche d'un invité par nom, prénom ou entreprise, enregistrement de l'arrivée, ajout d'accompagnants (+1) et de personnes hors liste, puis export CSV des présences.

Un seul fichier (`index.html`), sans dépendance ni étape de build. Pensée pour le téléphone, fonctionne aussi sur tablette et ordinateur.

## Utilisation

1. Ouvrir la page (en local ou via GitHub Pages).
2. Importer la liste des participants au format CSV. Colonnes reconnues : `Prénom`, `Nom`, `Entreprise`, `Poste`, `Email pro` ou `Email d'inscription`. Séparateur virgule ou point-virgule. Voir `exemple-participants.csv`.
3. À l'accueil : taper quelques lettres, appuyer sur **Arrivé**, ajuster les accompagnants avec − / +.
4. En fin d'événement : **Exporter les présences (CSV)**.

## Données et confidentialité

- La liste importée et les arrivées sont stockées dans le navigateur (`localStorage`) de l'appareil. Rien n'est envoyé à un serveur.
- Aucune liste de participants n'est incluse dans ce dépôt, et le `.gitignore` empêche de committer des fichiers CSV par erreur. Un site GitHub Pages est public : ne jamais y déposer de données personnelles.
- Chaque appareil a sa propre liste et ses propres pointages. Si plusieurs personnes tiennent l'accueil, exporter le CSV de chaque appareil en fin de soirée et les fusionner.

## Publier sur GitHub Pages

1. Créer un dépôt et y pousser ces fichiers.
2. Dans le dépôt : **Settings → Pages → Build and deployment**, source **Deploy from a branch**, branche `main`, dossier `/ (root)`.
3. L'app est disponible à `https://<utilisateur>.github.io/<depot>/` après une minute ou deux.

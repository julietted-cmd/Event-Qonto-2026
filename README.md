# Accueil TPC Summit, Edge of AI

App web mobile pour pointer les arrivées : recherche par nom ou prénom, bouton **Arrivé**, accompagnants (+1), ajout de personnes hors liste, export CSV. Les pointages sont partagés en temps réel entre tous les téléphones et conservés si l'app est fermée, grâce à Supabase.

## Contenu

- `index.html` : l'app, avec la liste des 374 inscrits intégrée (prénom et nom uniquement).
- `config.js` : URL et clé publique Supabase à renseigner.
- `supabase/schema.sql` : tables et règles à créer dans Supabase.

## Mise en place (15 minutes)

### 1. Supabase
1. Créer un projet sur supabase.com (ou en réutiliser un).
2. **SQL Editor > New query**, coller le contenu de `supabase/schema.sql`, cliquer **Run**.
3. **Project Settings > API** : copier la *Project URL* et la clé *anon public*.

### 2. Configuration
Coller ces deux valeurs dans `config.js`, puis committer.

### 3. Vercel
1. Pousser le dépôt sur GitHub (privé).
2. Sur vercel.com : **Add New > Project**, importer le dépôt. Framework preset : **Other**, aucune commande de build, dossier de sortie : racine.
3. Déployer, puis envoyer l'URL à l'équipe.

### 4. Vérifier
Ouvrir l'URL sur deux téléphones. En haut à droite, chacun doit afficher un point vert **Synchronisé**. Pointer une personne sur l'un : elle doit passer en vert sur l'autre en une ou deux secondes. Fermer et rouvrir l'app : le pointage est toujours là. Annuler le pointage de test.

Si l'app affiche « Sur cet appareil », `config.js` n'est pas rempli ou la connexion à Supabase échoue.

## Bon à savoir

- Le dépôt GitHub est privé, mais le site Vercel est accessible à toute personne qui a l'URL : elle voit les prénoms et noms des inscrits et peut pointer. Ne pas diffuser le lien au-delà de l'équipe d'accueil, et activer si besoin la protection d'accès dans les réglages Vercel du projet.
- Les emails et postes ne sont volontairement pas dans le dépôt.
- Les pointages restent dans Supabase après l'événement. Pour les effacer : `truncate public.checkins, public.walkins;`.
- Ajouter un inscrit : ajouter une entrée `{"id":"gXXX","p":"Prénom","n":"Nom"}` dans la liste `GUESTS` de `index.html`, avec un identifiant jamais utilisé, puis pousser. Vercel redéploie automatiquement.

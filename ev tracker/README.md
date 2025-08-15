# Suivi Conso EV - Instructions de Déploiement

Ce guide vous aidera à déployer l'application sur Netlify.

## Problème Courant : "Please drop a folder containing an index.html file"

Cette erreur se produit généralement lorsque vous déposez un dossier sur Netlify qui ne contient pas le fichier `index.html` à sa racine. Par exemple, si tous vos fichiers sont dans un sous-dossier `mon-projet/` et que vous déposez ce sous-dossier, Netlify ne trouvera pas le `index.html` attendu.

## Méthode 1 : Déploiement par Glisser-Déposer (Drag and Drop) - La solution simple

C'est la méthode la plus simple pour mettre votre site en ligne rapidement.

1.  **Créez un dossier** sur votre ordinateur, par exemple `site-a-deployer`.
2.  **Copiez TOUS les fichiers de l'application** (`index.html`, `index.tsx`, `sw.js`, `manifest.json`, etc.) et les dossiers (`components`, `context`, etc.) **directement à l'intérieur** de `site-a-deployer`. La structure doit ressembler à ceci :
    ```
    site-a-deployer/
    ├── index.html
    ├── index.tsx
    ├── App.tsx
    ├── components/
    ├── context/
    └── ... autres fichiers et dossiers
    ```
3.  **Connectez-vous à Netlify**.
4.  Allez dans la section "Sites" de votre tableau de bord.
5.  **Faites glisser le dossier `site-a-deployer`** (et non un fichier zip) et déposez-le dans la zone indiquée.

Netlify va maintenant déployer votre site.

## Méthode 2 : Déploiement via Git (Recommandé)

Cette méthode est plus robuste et permet des mises à jour automatiques lorsque vous modifiez votre code.

1.  **Poussez votre code sur un dépôt Git** (GitHub, GitLab, ou Bitbucket). Assurez-vous que tous les fichiers sont à la racine du dépôt.
2.  **Connectez-vous à Netlify** et cliquez sur "Add new site" -> "Import an existing project".
3.  **Connectez votre fournisseur Git** et sélectionnez le dépôt de votre application.
4.  **Configurez les paramètres de build** :
    *   **Build command** : Laissez ce champ vide. Votre application n'a pas besoin d'étape de compilation.
    *   **Publish directory** : Mettez `.` (un simple point) ou laissez-le vide. Cela indique que votre `index.html` est à la racine.
5.  Cliquez sur **"Deploy site"**.

Netlify déploiera votre site et le mettra à jour automatiquement à chaque fois que vous pousserez des modifications sur votre branche principale.

## Fichier de configuration `netlify.toml`

Un fichier `netlify.toml` a été ajouté au projet pour rendre ces paramètres explicites. Il indique à Netlify qu'il n'y a pas de commande de build et que le contenu à publier se trouve à la racine du projet. Grâce à ce fichier, vous ne devriez pas avoir à modifier les paramètres de build si vous utilisez la méthode Git.

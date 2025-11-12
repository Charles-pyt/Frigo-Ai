# Frigo IA 🥦

Votre assistant nutrition intelligent et anti-gaspillage. Scannez le contenu de votre frigo, suivez la fraîcheur des aliments et obtenez des recettes personnalisées pour ne plus jamais rien jeter.

## ✨ Fonctionnalités

Ce prototype d'application web (construit avec React et Vite) inclut :

* **Inventaire Visuel :** Uploadez une photo de votre frigo ou de vos courses, et l'IA (Gemini) identifie les aliments.
* **Gestion du Frigo :** Ajoutez/supprimez des aliments de votre inventaire.
* **Suivi de la Fraîcheur :** Spécifiez une date d'expiration pour vos aliments et visualisez rapidement leur état (Frais, À consommer, Expiré).
* **Générateur de Recettes IA :** Obtenez des suggestions de recettes créatives basées *uniquement* sur les ingrédients que vous possédez.
* **Tableau de Bord :** Une vue d'ensemble de votre frigo et de vos recettes.
* **Système de Compte :** Une simulation de connexion/inscription (utilisant le `localStorage` du navigateur) pour gérer les inventaires plus volumineux.

## 🛠️ Technologies Utilisées

* **Frontend :** [React](https://react.dev/)
* **Outils de Build :** [Vite](https://vitejs.dev/)
* **Langage :** [TypeScript](https://www.typescriptlang.org/)
* **Styling :** [Tailwind CSS](https://tailwindcss.com/) (utilisé via CDN dans `index.html`)
* **IA :** [Google Gemini API](https://ai.google.dev/) (via le package `@google/genai`)
* **Icônes :** Composants SVG personnalisés

## 🚀 Démarrage Rapide (Installation)

Pour lancer ce projet localement :

1.  **Prérequis :** Assurez-vous d'avoir [Node.js](https://nodejs.org/) (v18 ou plus récent) installé.

2.  **Cloner le projet :**
    ```bash
    git clone [https://github.com/ton-nom-user/Frigo-Ai.git](https://github.com/ton-nom-user/Frigo-Ai.git)
    cd Frigo-Ai
    ```

3.  **Installer les dépendances :**
    ```bash
    npm install
    ```

4.  **Configurer votre Clé API :**
    * Créez une clé API sur [Google AI Studio](https://ai.studio.google.com/).
    * À la racine du projet, créez un fichier nommé `.env.local`
    * Ajoutez votre clé API dans ce fichier :
        ```
        GEMINI_API_KEY=VOTRE_CLE_API_GEMINI_ICI
        ```

5.  **Lancer le serveur de développement :**
    ```bash
    npm run dev
    ```

6.  Ouvrez votre navigateur et allez sur `http://localhost:3000` (ou le port indiqué dans votre terminal).

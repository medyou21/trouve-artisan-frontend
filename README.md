🎨 Trouve-Artisan – Frontend

Frontend du projet Trouve-Artisan, une plateforme permettant de rechercher des artisans par catégorie, ville, département et spécialité.

Cette application consomme l’API REST du backend Trouve-Artisan et est conçue pour une expérience mobile-first, accessible et performante.

🚀 Technologies utilisées

React

Vite

JavaScript (ES6+)


React Router DOM

Bootstrap / CSS

ESLint

📁 Structure du projet
trouve-artisan-frontend/
│
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ArtisanCard.jsx
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── ArtisanDetail.jsx
│   │   └── Search.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── .env
├── index.html
├── package.json
└── README.md

⚙️ Installation
1️⃣ Cloner le projet
git clone https://github.com/TON_REPO/trouve-artisan-frontend.git
cd trouve-artisan-frontend

2️⃣ Installer les dépendances
npm install

🔧 Configuration des variables d’environnement

Créer un fichier .env à la racine du projet :

VITE_API_URL=http://localhost:8080


📌 Important

Avec Vite, seules les variables commençant par VITE_ sont accessibles dans le code frontend.

Ne jamais commit le fichier .env.

▶️ Lancer l’application
Mode développement
npm run dev


L’application sera accessible sur :

http://localhost:5173

🔗 Connexion à l’API Backend

Exemple d’appel API :

import api from "../services/api";

api.get("/api/artisans").then(response => {
  console.log(response.data);
});

🌐 Fonctionnalités principales

✅ Affichage de la liste des artisans

✅ Consultation du détail d’un artisan

✅ Filtrage par catégorie

✅ Recherche par nom

✅ Mise en avant des artisans “top”

✅ Connexion dynamique à l’API backend

🚀 Déploiement sur Vercel
1️⃣ Créer un projet Vercel

Se connecter à Vercel

Importer le dépôt GitHub du frontend

Framework détecté automatiquement : Vite / React

2️⃣ Variables d’environnement (Vercel)

Dans Project Settings → Environment Variables :

VITE_API_URL=https://ton-backend.up.railway.app


ou

VITE_API_URL=https://ton-backend.cleverapps.io


📌 Après modification des variables → redeployer le projet.

3️⃣ Build

Commande utilisée par Vercel :

npm run build


Dossier de sortie :

dist/

🔐 CORS – Configuration Backend requise

Côté backend, autoriser le frontend Vercel :

app.use(
  cors({
    origin: process.env.FRONT_URL,
    credentials: true,
  })
);


Variable backend :

FRONT_URL=https://ton-frontend.vercel.app

🧪 Tests rapides

Tester l’API directement :

https://ton-backend.up.railway.app/api/artisans


Tester le frontend :

https://ton-frontend.vercel.app

⚠️ Problèmes fréquents
❌ Blocked by CORS policy

➡️ Vérifier :

FRONT_URL côté backend

VITE_API_URL côté frontend

Redéploiement effectué

❌ Uncaught ReferenceError: React is not defined

➡️ Avec Vite + React 17+ :

Ne pas importer React inutilement

Vérifier la présence de @vitejs/plugin-react

❌ Page blanche en production

➡️ Vérifier :

URL API correcte

Backend accessible en HTTPS

Console navigateur

🔗 Lien avec le Backend

Backend API : https://github.com/TON_REPO/backend-trouve-artisan

Frontend : https://github.com/TON_REPO/trouve-artisan-frontend

📌 Auteur

👤 Mohamed Hamdi
💼 Développeur Web & Ingénieur Systèmes
📍 France

📄 Licence

Projet open-source, libre d’utilisation à des fins pédagogiques ou professionnelles.

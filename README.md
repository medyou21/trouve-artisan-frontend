# 🎨 Trouve-Artisan – Frontend

Frontend du projet **Trouve-Artisan**, une plateforme permettant de rechercher des artisans par **catégorie, ville, département et spécialité**, et de les contacter directement via un formulaire.

Cette application consomme l’API REST du backend Trouve-Artisan et est conçue pour une expérience mobile-first, accessible et performante.

---

## 🚀 Technologies utilisées
- React + Vite
- React Router DOM
- Bootstrap / CSS
- JavaScript (ES6+)
- ESLint
- Sass (SCSS)

---

## 📁 Structure du projet

frontend/
│
├── fonts/
├── node_modules/
├── public/
├── src/
│ │ ├── components/
│ │ ├── artisan/
│ │ │ ├── ArtisanCard.jsx
│ │ │ 
│ │ ├── home/
│ │ │ ├── FeaturedArtisans.jsx
│ │ │ ├── Hero.jsx
│ │ │ └── HowItWorks.jsx
│ │ └── layout/
│ ├── pages/
│ │ ├── AlimentationList.jsx
│ │ ├── Artisan.jsx
│ │ ├── BatimentList.jsx
│ │ ├── Category.jsx
│ │ ├── FabricationList.jsx
│ │ ├── Home.jsx
│ │ ├── Legal.jsx
│ │ ├── NotFound.jsx
│ │ ├── Recherche.jsx
│ │ └── ServicesList.jsx
│ ├── services/
│ │ ├── api.js
│ │ └── artisan.service.js
│ ├── styles/
│ │ ├── abstracts/
│ │ ├── base/
│ │ ├── components/
│ │ ├── layout/
│ │ ├── pages/
│ │ ├── themes/
│ │ ├── vendors/
│ │ └── main.scss
│ ├── App.css
│ ├── App.jsx
│ ├── index.css
│ ├── main.jsx
│ └── router.jsx
├── index.html
├── package-lock.json
├── package.json
├── README.md



---

## ⚙️ Installation

### 1️⃣ Cloner le projet
```bash
git clone https://github.com/TON_REPO/trouve-artisan-frontend.git
cd trouve-artisan-frontend
2️⃣ Installer les dépendances
npm install
3️⃣ Configuration des variables d’environnement
Créer un fichier .env à la racine :

VITE_API_URL=http://localhost:8080
Avec Vite, seules les variables commençant par VITE_ sont accessibles dans le code frontend.
Ne jamais commit le fichier .env.

4️⃣ Lancer l’application
npm run dev
Application accessible sur : http://localhost:5173

🌐 Fonctionnalités principales
✅ Affichage de la liste des artisans
✅ Consultation du détail d’un artisan
✅ Filtrage par catégorie
✅ Recherche par nom
✅ Mise en avant des artisans “top”
✅ Formulaire de contact avec artisan_id
✅ Connexion dynamique à l’API backend

🔗 Connexion à l’API Backend
Exemple d’appel API :

import api from "../services/api";

api.get("/api/artisans").then(response => {
  console.log(response.data);
});
🚀 Déploiement sur Vercel
1️⃣ Créer un projet Vercel et importer le dépôt GitHub du frontend.
2️⃣ Définir les variables d’environnement :

VITE_API_URL=https://ton-backend.up.railway.app
ou

VITE_API_URL=https://ton-backend.cleverapps.io
3️⃣ Lancer le build :

npm run build
Dossier de sortie : dist/

🔐 CORS – Configuration Backend requise
Autoriser le frontend Vercel côté backend :

app.use(
  cors({
    origin: process.env.FRONT_URL,
    credentials: true,
  })
);
Variable backend :

FRONT_URL=https://ton-frontend.vercel.app
🧪 Tests rapides
API : https://ton-backend.up.railway.app/api/artisans

Frontend : https://ton-frontend.vercel.app


📌 Auteur
👤 Mohamed Hamdi
💼 Développeur Web & Ingénieur Systèmes
📍 France

📄 Licence : Projet open-source, libre d’utilisation à des fins pédagogiques ou professionnelles.






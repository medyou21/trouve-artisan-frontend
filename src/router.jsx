import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Category from "./pages/Category.jsx";
import Artisan from "./pages/Artisan.jsx";
import Legal from "./pages/Legal.jsx";
import NotFound from "./pages/NotFound.jsx";
import Batiment from "./pages/BatimentList.jsx";
import Alimentation from "./pages/AlimentationList.jsx";
import Fabrication from "./pages/FabricationList.jsx";
import Services from "./pages/ServicesList.jsx";
import Recherche from "./pages/Recherche.jsx";

// Définition du router
export const router = createBrowserRouter([
  {
    path: "/",                  // racine du site
    element: <App />,           // wrapper général
    errorElement: <NotFound />, // page 404
    children: [
      { index: true, element: <Home /> }, // page d'accueil
      { path: "categorie/:id", element: <Category /> },
      { path: "artisan/:id", element: <Artisan /> },

      // Pages légales / informations
      { path: "mentions-legales", element: <Legal /> },
      { path: "donnees-personnelles", element: <Legal /> },
      { path: "accessibilite", element: <Legal /> },
      { path: "cookies", element: <Legal /> },

      // Pages par catégorie
      { path: "batiment", element: <Batiment /> },
      { path: "alimentation", element: <Alimentation /> },
      { path: "fabrication", element: <Fabrication /> },
      { path: "services", element: <Services /> },

      // Page de recherche
      { path: "recherche", element: <Recherche /> }
    ],
  },
]);

import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Category from "./pages/Category.jsx";
import Artisan from "./pages/Artisan.jsx";
import Legal from "./pages/Legal.jsx";
import NotFound from "./pages/NotFound.jsx";
import Batiment from "./pages/BatimentList";
import Alimentation from "./pages/AlimentationList";
import Fabrication from "./pages/FabricationList";
import Services from "./pages/ServicesList";
import Recherche from "./pages/Recherche";










export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "categorie/:id", element: <Category /> },
      { path: "artisan/:id", element: <Artisan /> },
      { path: "mentions-legales", element: <Legal /> },
      { path: "donnees-personnelles", element: <Legal /> },
      { path: "accessibilite", element: <Legal /> },
      { path: "cookies", element: <Legal /> },

      { path: "batiment", element: <Batiment /> },
      { path: "alimentation", element: <Alimentation /> },
      { path: "fabrication", element: <Fabrication /> },
      { path: "services", element: <Services /> },

      { path: "recherche", element: <Recherche /> }
    ],
  },
]);

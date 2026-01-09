import { useLocation } from "react-router-dom";

export default function Legal() {
  const location = useLocation();

  // Déterminer le titre selon l'URL
  let title = "Page en construction";
  switch (location.pathname) {
    case "/mentions-legales":
      title = "Mentions légales";
      break;
    case "/donnees-personnelles":
      title = "Données personnelles";
      break;
    case "/accessibilite":
      title = "Accessibilité";
      break;
    case "/cookies":
      title = "Cookies";
      break;
  }

  return (
    <main className="container py-5 text-center">
      <h1 className="fw-bold mb-4">{title}</h1>
      <p>Cette page est en construction. Merci de revenir plus tard !</p>
    </main>
  );
}

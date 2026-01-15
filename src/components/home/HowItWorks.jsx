/**
 * Composant HowItWorks
 * Présente les étapes pour trouver et contacter un artisan
 */
export default function HowItWorks() {
  // Liste des étapes du parcours utilisateur
  const steps = [
    "Choisir la catégorie d’artisan dans le menu.",
    "Choisir un artisan.",
    "Le contacter via le formulaire de contact.",
    "Une réponse sera apportée sous 48h."
  ];

  return (
    <section
      className="py-5 bg-white"
      aria-labelledby="how-it-works-title"
    >
      <div className="container">
        <h2
          id="how-it-works-title"
          className="text-center text-blue fw-bold mb-4"
        >
          Comment trouver mon artisan ?
        </h2>

        <div className="row g-4">
          {steps.map((step, index) => (
            <div className="col-12 col-sm-6 col-md-3" key={index}>
              <div className="p-4 bg-light rounded h-100 text-center">
                {/* Numéro de l’étape */}
                <span
                  className="badge bg-blue fs-6 mb-2"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Description de l’étape */}
                <p className="mt-2 mb-0">{step}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

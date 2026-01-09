export default function HowItWorks() {
  const steps = [
    "Choisir la catégorie d’artisan dans le menu.",
    "Choisir un artisan.",
    "Le contacter via le formulaire de contact.",
    "Une réponse sera apportée sous 48h."
  ];

  return (
    <section className="py-5 bg-white">
      <div className="container">
        <h2 className="text-center text-blue fw-bold mb-4">
          Comment trouver mon artisan ?
        </h2>

        <div className="row g-4">
          {steps.map((step, i) => (
            <div className="col-md-3" key={i}>
              <div className="p-4 bg-light rounded h-100">
                <span className="badge bg-blue fs-6 mb-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-2">{step}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

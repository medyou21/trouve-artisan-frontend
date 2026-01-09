import { useParams } from "react-router-dom";

export default function Category() {
  const { id } = useParams();

  return (
    <>
      <h1>Catégorie {id}</h1>
      <p>Liste des artisans de cette catégorie.</p>
    </>
  );
}

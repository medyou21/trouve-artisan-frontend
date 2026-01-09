export default function ArtisanStars({ rating = 0 }) {
  return (
    <div>
      {"★".repeat(Math.round(rating))}
      {"☆".repeat(5 - Math.round(rating))}
    </div>
  );
}

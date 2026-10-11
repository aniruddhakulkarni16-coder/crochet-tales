export const API_URL = "https://crochet-tales-server.onrender.com";

export function availabilityLabel(availability) {
  if (availability === "out_of_stock") return "Out of Stock";
  if (availability === "coming_soon") return "Coming Soon";
  return "Available";
}
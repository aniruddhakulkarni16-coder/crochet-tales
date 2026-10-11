export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export function availabilityLabel(availability) {
  if (availability === "out_of_stock") return "Out of Stock";
  if (availability === "coming_soon") return "Coming Soon";
  return "Available";
}
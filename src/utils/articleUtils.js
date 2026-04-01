/**
 * Utility functions for article display logic.
 */

export const getCategoryLabel = (category) => {
  const labels = {
    deposito: "Venta Directa",
    remate: "A Rematar",
    inmueble: "Inmuebles",
    vehiculo: "Vehículos",
  };
  return labels[category] || category || "Sin Categoría";
};

export const getPriceLabel = (article) => {
  if (article.category === "remate") {
    return "Precio Base";
  }
  return "Precio";
};

export const getCurrencySymbol = (currency, category) => {
  // Fallback and Priority for vehicles and real estate
  if (category === "inmueble" || category === "vehiculo") {
    return "U$S";
  }

  if (currency === "USD" || currency === "U$S") return "U$S";
  if (currency === "UYU") return "UYU";

  return "UYU";
};

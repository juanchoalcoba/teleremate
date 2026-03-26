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

export const getImageUrl = (url) => {
  if (!url) return url;

  // Si ya es una URL absoluta (Cloudinary, Unsplash, etc), devolverla tal cual
  if (
    url.startsWith("http") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }

  // Solo prefijamos con la URL del backend si la ruta comienza con /uploads/
  // Las rutas que no empiezan con /uploads/ suelen ser assets locales en la carpeta /public del frontend
  if (url.startsWith("/uploads/")) {
    const baseUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace(/\/api$/, "")
      : "";
    return `${baseUrl}${url}`;
  }

  // De lo contrario, devolver como asset relativo al frontend
  return url;
};


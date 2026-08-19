export const getImageUrl = (inputUrl) => {
  if (!inputUrl) return "";

  // Si el argumento es un objeto (ej. Cloudinary object { url, secure_url }), extraer la propiedad string
  let url = inputUrl;
  if (typeof inputUrl === "object" && inputUrl !== null) {
    url = inputUrl.url || inputUrl.secure_url || inputUrl.path || inputUrl.location || "";
  }

  if (typeof url !== "string" || !url) return "";

  // Si ya es una URL absoluta (Cloudinary, Unsplash, etc), devolverla tal cual
  if (
    url.startsWith("http") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }

  // Solo prefijamos con la URL del backend si la ruta comienza con /uploads/
  if (url.startsWith("/uploads/")) {
    const baseUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace(/\/api$/, "")
      : "";
    return `${baseUrl}${url}`;
  }

  // De lo contrario, devolver como asset relativo al frontend
  return url;
};


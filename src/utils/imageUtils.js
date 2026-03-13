export const getImageUrl = (url) => {
  if (!url) return url;
  if (url.startsWith("http") || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }

  // If VITE_API_URL is "https://backend.com/api", we want "https://backend.com" for images
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace(/\/api$/, "") 
    : "";
  
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};

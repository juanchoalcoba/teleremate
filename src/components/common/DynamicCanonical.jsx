import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Component that hooks into the React Router and updates the document's
 * <link rel="canonical" href="..."> on every location change.
 * Forces the canonical URL to be https://teleremate.org.
 */
export default function DynamicCanonical() {
  const location = useLocation();

  useEffect(() => {
    const baseUrl = "https://teleremate.org";
    let url = baseUrl + location.pathname;

    let link = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = url;
  }, [location]);

  return null;
}

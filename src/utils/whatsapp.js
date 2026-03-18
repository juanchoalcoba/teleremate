/**
 * Utility to generate standardized WhatsApp links with the correct Uruguay prefix (+598)
 * and pre-filled, context-aware messages.
 */

const ADMIN_PHONE = "59899626385";

/**
 * Formats a phone number for WhatsApp:
 * - Removes non-numeric characters
 * - Ensures 598 prefix
 * - Strips leading 0 if present (e.g. 099 -> 99)
 */
export const formatPhoneForWA = (phone) => {
  if (!phone) return "";
  let cleaned = phone.toString().replace(/[^0-9]/g, "");
  
  // If it starts with 0 (like 099...), remove it
  if (cleaned.startsWith("0")) {
    cleaned = cleaned.substring(1);
  }
  
  // If it doesn't already start with 598, prepend it
  if (!cleaned.startsWith("598")) {
    cleaned = "598" + cleaned;
  }
  
  return cleaned;
};

/**
 * Generates a WhatsApp link
 * @param {string} phone - Target phone number
 * @param {string} message - Pre-filled message
 */
export const getWALink = (phone, message = "") => {
  const formattedPhone = formatPhoneForWA(phone);
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}${encodedMsg ? `?text=${encodedMsg}` : ""}`;
};

/**
 * Predefined message templates
 */
export const WAMessages = {
  // Public -> Admin
  inquiry: (lot, title) => 
    `Hola Teleremate, estoy interesado en el artículo ID ${lot}: ${title}. ¿Me podrían dar más información?`,
  
  general: "Hola Teleremate, tengo una consulta sobre sus remates.",

  // Admin -> Seller
  sellerFollowup: (name, title) => 
    `Hola ${name}, te contacto de Teleremate por tu pedido de venta de '${title}'. ¿Podemos conversar sobre los detalles?`,

  // Admin -> Client (Reservation)
  reservationFollowup: (name, lot, title) => 
    `Hola ${name}, te contacto de Teleremate por tu reserva del artículo ID ${lot}: ${title}. ¿Cómo te gustaría proceder?`,

  // Admin -> Client (Purchase)
  purchaseFollowup: (name, lot, title) => 
    `Hola ${name}, te contacto de Teleremate por tu compra del artículo ID ${lot}: ${title}. ¿Cómo coordinamos el pago y la entrega?`,
};

export const TELEREMATE_WA = ADMIN_PHONE;

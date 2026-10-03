const configuredBaseUrl = process.env.BASE_API?.trim();

export const API_BASE_URL = (
  configuredBaseUrl || "https://ecommerce.routemisr.com"
).replace(/\/+$/, "");

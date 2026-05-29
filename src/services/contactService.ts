// services/contactService.ts

const backendUrl = import.meta.env.VITE_API_URL;
const BASE_PATH = "/InvestigationServices/Website/front";

const fetchWithTimeout = async (url: string, options: any = {}, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return response;
  } finally {
    clearTimeout(id);
  }
};

/**
 * GET: Fetches contact information (Addresses, Phones, etc.)
 */
export const getContactInfo = async () => {
  try {
    const res = await fetchWithTimeout(`${backendUrl}${BASE_PATH}/contact`);
    if (!res.ok) throw new Error(`GET Error: ${res.status}`);
    return res.json();
  } catch (err: any) {
    if (err.name === 'AbortError') throw new Error('Request timed out after 10 seconds');
    throw err;
  }
};

/**
 * POST (Send Contact): {{BaseUrl}}/InvestigationServices/Website/front/contact/send
 */
export const sendContact = async (data: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  "g-recaptcha-response": string;
}) => {
  const url = `${backendUrl}${BASE_PATH}/contact/send`;
  try {
    const res = await fetchWithTimeout(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data),
    });

    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.message || `POST Error: ${res.status}`);
    return result;
  } catch (err: any) {
    if (err.name === 'AbortError') throw new Error('Request timed out after 10 seconds');
    throw err;
  }
};

/**
 * POST (Submit contact form): {{BaseUrl}}/InvestigationServices/Website/front/sendmail
 */
export const submitContactForm = async (data: {
  name: string;
  email: string;
  mobile: string;
  address: string;
  details: string;
  "g-recaptcha-response": string;
}) => {
  const url = `${backendUrl}${BASE_PATH}/sendmail`;
  try {
    const res = await fetchWithTimeout(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data),
    });

    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.message || `POST Error: ${res.status}`);
    return result;
  } catch (err: any) {
    if (err.name === 'AbortError') throw new Error('Request timed out after 10 seconds');
    throw err;
  }
};

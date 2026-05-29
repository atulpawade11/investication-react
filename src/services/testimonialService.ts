import { API_BASE_URL } from '@/lib/config';

export const getTestimonials = async (page: number = 1) => {
  try {
    const cleanBaseUrl = API_BASE_URL?.replace(/\/$/, "");
    
    // Matched exactly to your successful Postman URL
    // Adding limit=10 to match your working request
    const url = `${cleanBaseUrl}/InvestigationServices/Website/front/testimonials?page=${page}&limit=10`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(`❌ Fetch failed! Status: ${response.status} for URL: ${url}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Service Error:", error);
    return null;
  }
};
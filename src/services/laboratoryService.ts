// services/laboratoryService.ts
const backendUrl = import.meta.env.VITE_API_URL;
const BASE_PATH = "/InvestigationServices/Website/front";

export const getLaboratoryDetails = async (slug: string) => {
    const cleanBaseUrl = backendUrl?.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
    // Standard endpoint for laboratory pages
    const url = `${cleanBaseUrl}${BASE_PATH}/laboratory/${slug}`;
  
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: { "Accept": "application/json" } 
        });

        if (!res.ok) return null;

        const result = await res.json();
        return result.data.page; // Returning the 'page' object directly
    } catch (error) {
        console.error("Laboratory API Error:", error);
        return null;
    }
};
const backendUrl = import.meta.env.VITE_API_URL;
const BASE_PATH = "/InvestigationServices/Website/front";

export const getPageBySlug = async (slug: string) => {
    const cleanBaseUrl = backendUrl?.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
    
    // Updated to use /page/ instead of /pages/ to match your Postman results
    const url = `${cleanBaseUrl}${BASE_PATH}/page/${slug}`;
  
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("API Fetch Error:", error);
        throw error;
    }
};
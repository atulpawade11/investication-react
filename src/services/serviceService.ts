const backendUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, ""); 

export const getServiceBySlug = async (slug: string) => {
    try {
        const res = await fetch(`${backendUrl}/InvestigationServices/Website/front/investigation`, {
            method: "GET",
            headers: { "Accept": "application/json" },
        });
        const result = await res.json();
        
        if (result.success) {
            // Find the specific service that matches the URL slug
            const service = result.data.data.find((s: any) => s.slug === slug);
            return { 
                success: !!service, 
                data: service, 
                allCategories: result.data.categories 
            };
        }
        return { success: false };
    } catch (error) {
        return { success: false };
    }
};
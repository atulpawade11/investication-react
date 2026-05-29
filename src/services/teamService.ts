const backendUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, ""); 
const TEAM_PATH = "/InvestigationServices/Website/front/team";

export const getTeamMembers = async () => {
    try {
        const res = await fetch(`${backendUrl}${TEAM_PATH}`, {
            method: "GET",
            headers: { "Accept": "application/json" }
        });
        return await res.json();
    } catch (error) {
        return { success: false, data: { members: [] } };
    }
};

export const getTeamMemberById = async (id: string | number) => {
    try {
        const res = await fetch(`${backendUrl}${TEAM_PATH}/${id}`, {
            method: "GET",
            headers: { "Accept": "application/json" },
            cache: 'no-store'
        });
        const data = await res.json();
        
        // If the specific ID fetch fails (returns empty or success: false), 
        // we return a special flag so the page knows to look in the main list.
        if (!data || !data.success || !data.data?.member) {
            return { fallback: true };
        }
        return data;
    } catch (error) {
        return { fallback: true };
    }
};
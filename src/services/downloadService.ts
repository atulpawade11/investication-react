import { API_BASE_URL } from '@/lib/config';

export const getDownloads = async () => {
  try {
    // We use 'no-store' to ensure you see the dynamic changes immediately
    const response = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/downloads`, {
        cache: 'no-store' 
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const result = await response.json();
    return result; 
  } catch (error) {
    console.error("Download Service Error:", error);
    return null;
  }
};
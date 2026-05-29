import { API_BASE_URL } from '@/lib/config';

const backendUrl = API_BASE_URL;
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
 * GET: Fetches quote form data (categories, inputs, etc.)
 */
export const getQuoteData = async () => {
    try {
        const res = await fetchWithTimeout(`${backendUrl}${BASE_PATH}/quote`);
        if (!res.ok) throw new Error(`GET Error: ${res.status}`);
        return res.json();
    } catch (err: any) {
        if (err.name === 'AbortError') throw new Error('Request timed out after 10 seconds');
        throw err;
    }
};

/**
 * GET: Fetches sample report form fields
 */
export const getSampleReportForm = async () => {
    try {
        const res = await fetchWithTimeout(`${backendUrl}${BASE_PATH}/sample-report`);
        if (!res.ok) throw new Error(`GET Error: ${res.status}`);
        return res.json();
    } catch (err: any) {
        if (err.name === 'AbortError') throw new Error('Request timed out after 10 seconds');
        throw err;
    }
};

/**
 * POST: Submits sample report request (Quote)
 */
export const submitSampleReport = async (data: FormData) => {
    const url = `${backendUrl}${BASE_PATH}/sendquote`;
    try {
        const res = await fetchWithTimeout(url, {
            method: "POST",
            headers: {
                "Accept": "application/json"
                // Note: Do not set Content-Type for FormData, let the browser set it with boundary
            },
            body: data,
        });

        const result = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(result.message || `POST Error: ${res.status}`);
        return result;
    } catch (err: any) {
        if (err.name === 'AbortError') throw new Error('Request timed out after 10 seconds');
        throw err;
    }
};

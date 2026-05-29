// services/webService.ts

import { API_BASE_URL } from '@/lib/config';
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
 * GET: Fetches website boot data (socials, favicon, contact, etc.)
 * Endpoint: {{BaseUrl}}/InvestigationServices/Website/front/boot
 */
export const getBootData = async () => {
    try {
        const res = await fetchWithTimeout(`${API_BASE_URL}${BASE_PATH}/boot`);
        if (!res.ok) throw new Error(`GET Error: ${res.status}`);
        return res.json();
    } catch (err: any) {
        if (err.name === 'AbortError') throw new Error('Request timed out after 10 seconds');
        throw err;
    }
};

/**
 * GET: Fetches Products list
 * Endpoint: {{BaseUrl}}/InvestigationServices/Website/front/products
 */
export const getProducts = async () => {
    try {
        const res = await fetchWithTimeout(`${API_BASE_URL}${BASE_PATH}/products`);
        if (!res.ok) throw new Error(`GET Error: ${res.status}`);
        return res.json();
    } catch (err: any) {
        if (err.name === 'AbortError') throw new Error('Request timed out after 10 seconds');
        throw err;
    }
};

/**
 * GET: Fetches Departments list (Dynamic Menu)
 * Endpoint: {{BaseUrl}}/InvestigationServices/Website/front/departments
 */
export const getDepartments = async () => {
    try {
        const res = await fetchWithTimeout(`${API_BASE_URL}${BASE_PATH}/departments`);
        if (!res.ok) throw new Error(`GET Error: ${res.status}`);
        return res.json();
    } catch (err: any) {
        if (err.name === 'AbortError') throw new Error('Request timed out after 10 seconds');
        throw err;
    }
};

/**
 * GET: Fetches Services/Categories list (Dynamic Menu)
 * Endpoint: {{BaseUrl}}/InvestigationServices/Website/front/services
 * 
 * Response structure:
 * {
 *   success: boolean,
 *   message: string,
 *   statusCode: number,
 *   timestamp: string,
 *   data: {
 *     categories: Array<{
 *       id: number,
 *       language_id: number,
 *       name: string,
 *       image: string,
 *       short_text: string,
 *       status: number,
 *       serial_number: number,
 *       service_count: number
 *     }>,
 *     searchTerm: string
 *   }
 * }
 */
export const getServices = async () => {
    try {
        const res = await fetchWithTimeout(`${API_BASE_URL}${BASE_PATH}/services`);
        if (!res.ok) throw new Error(`GET Error: ${res.status}`);
        return res.json();
    } catch (err: any) {
        if (err.name === 'AbortError') throw new Error('Request timed out after 10 seconds');
        throw err;
    }
};

/**
 * GET: Fetches single service details by ID
 * Endpoint: {{BaseUrl}}/InvestigationServices/Website/front/services/{id}
 */
export const getServiceById = async (id: number | string) => {
    try {
        const res = await fetchWithTimeout(`${API_BASE_URL}${BASE_PATH}/services/${id}`);
        if (!res.ok) throw new Error(`GET Error: ${res.status}`);
        return res.json();
    } catch (err: any) {
        if (err.name === 'AbortError') throw new Error('Request timed out after 10 seconds');
        throw err;
    }
};

/**
 * GET: Fetches services with optional filters
 * Endpoint: {{BaseUrl}}/InvestigationServices/Website/front/services?language_id=169&status=1
 */
export const getServicesWithFilters = async (filters?: { language_id?: number, status?: number }) => {
    try {
        const queryParams = new URLSearchParams();
        if (filters?.language_id) queryParams.append('language_id', filters.language_id.toString());
        if (filters?.status !== undefined) queryParams.append('status', filters.status.toString());
        
        const url = `${API_BASE_URL}${BASE_PATH}/services${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const res = await fetchWithTimeout(url);
        if (!res.ok) throw new Error(`GET Error: ${res.status}`);
        return res.json();
    } catch (err: any) {
        if (err.name === 'AbortError') throw new Error('Request timed out after 10 seconds');
        throw err;
    }
};

/**
 * GET: Fetches Laboratories list
 * Endpoint: {{BaseUrl}}/InvestigationServices/Website/front/laboratories
 */
export const getLaboratories = async () => {
    try {
        console.log("Fetching laboratories from:", `${API_BASE_URL}${BASE_PATH}/laboratories`);
        const res = await fetchWithTimeout(`${API_BASE_URL}${BASE_PATH}/laboratories`);
        if (!res.ok) throw new Error(`GET Error: ${res.status}`);
        const data = await res.json();
        console.log("Laboratories API response:", data);
        return data;
    } catch (err: any) {
        if (err.name === 'AbortError') throw new Error('Request timed out after 10 seconds');
        console.error("Error fetching laboratories:", err);
        return { success: false, data: [] };
    }
};

/**
 * GET: Fetches single laboratory details by slug
 * Endpoint: {{BaseUrl}}/InvestigationServices/Website/front/laboratory/{slug}
 */
export const getLaboratoryBySlug = async (slug: string) => {
    try {
        const res = await fetchWithTimeout(`${API_BASE_URL}${BASE_PATH}/laboratory/${slug}`);
        if (!res.ok) throw new Error(`GET Error: ${res.status}`);
        return res.json();
    } catch (err: any) {
        if (err.name === 'AbortError') throw new Error('Request timed out after 10 seconds');
        console.error("Error fetching laboratory by slug:", err);
        return { success: false, data: null };
    }
};
// services/menuService.ts
import { API_BASE_URL } from '@/lib/config';

export interface MenuCategory {
  id: number;
  name: string;
  image?: string;
  short_text?: string;
  services: MenuService[];
  service_count: number;
}

export interface MenuService {
  id: number;
  title: string;
  slug: string;
  category_id: number;
  serial_number?: number;
}

// Function to fetch all services from all pages
async function fetchAllServices(): Promise<any[]> {
  let allServices: any[] = [];
  let currentPage = 1;
  let totalPages = 1;
  
  try {
    console.log("🔍 Fetching services from API...");
    console.log("API_BASE_URL:", API_BASE_URL);
    
    // Fetch first page to get total pages
    const firstRes = await fetch(
      `${API_BASE_URL}/InvestigationServices/Website/front/services?page=${currentPage}&per_page=50`
    );
    const firstData = await firstRes.json();
    
    console.log("📦 First page response:", {
      success: firstData.success,
      servicesCount: firstData.data?.data?.length,
      totalPages: firstData.data?.pagination?.total_pages,
      totalServices: firstData.data?.pagination?.total
    });
    
    if (!firstData.success) {
      console.error("❌ API returned success: false", firstData);
      return [];
    }
    
    // Add services from first page
    allServices = [...(firstData.data?.data || [])];
    
    // Get total pages
    totalPages = firstData.data?.pagination?.total_pages || 1;
    
    // Fetch remaining pages if any
    if (totalPages > 1) {
      const remainingPages = [];
      for (let page = 2; page <= totalPages; page++) {
        remainingPages.push(
          fetch(`${API_BASE_URL}/InvestigationServices/Website/front/services?page=${page}&per_page=50`)
            .then(res => res.json())
        );
      }
      
      const remainingResults = await Promise.all(remainingPages);
      
      remainingResults.forEach(result => {
        if (result.success && result.data?.data) {
          allServices = [...allServices, ...result.data.data];
        }
      });
    }
    
    console.log(`✅ Total services fetched: ${allServices.length}`);
    return allServices;
    
  } catch (error) {
    console.error("❌ Error fetching services:", error);
    return [];
  }
}

export async function getMenuData(): Promise<MenuCategory[]> {
  try {
    console.log("🚀 Starting getMenuData...");
    
    // Fetch all services
    const allServices = await fetchAllServices();
    
    if (allServices.length === 0) {
      console.warn("⚠️ No services found from API");
      return [];
    }
    
    // Log unique category IDs from services
    const uniqueCatIds = [...new Set(allServices.map(s => s.scategory_id))];
    console.log("📋 Unique category IDs from services:", uniqueCatIds);
    
    // Fetch categories from the API - Use the categories endpoint if available
    console.log("🔍 Fetching categories...");
    
    // Try to fetch categories directly if there's an endpoint
    let allCategories: any[] = [];
    
    try {
      // First try to get categories from the categories endpoint
      const categoriesRes = await fetch(
        `${API_BASE_URL}/InvestigationServices/Website/front/service-categories`
      );
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        if (categoriesData.success && categoriesData.data) {
          allCategories = categoriesData.data;
          console.log(`📦 Categories fetched from categories endpoint: ${allCategories.length}`);
        }
      }
    } catch (err) {
      console.log("Categories endpoint not available, falling back to services endpoint");
    }
    
    // If no categories from dedicated endpoint, get from services endpoint
    if (allCategories.length === 0) {
      const servicesRes = await fetch(
        `${API_BASE_URL}/InvestigationServices/Website/front/services?page=1&per_page=1`
      );
      const servicesResult = await servicesRes.json();
      allCategories = servicesResult.data?.categories || [];
      console.log(`📦 Categories fetched from services endpoint: ${allCategories.length}`);
    }
    
    // Remove duplicate categories
    const uniqueCategories = Array.from(
      new Map(allCategories.map(cat => [cat.id, cat])).values()
    );
    console.log(`✅ Unique categories: ${uniqueCategories.length}`);
    
    // Group services by category - Only include categories that have services
    const menuCategories: MenuCategory[] = uniqueCategories
      .filter((cat: any) => cat.status === 1) // Only active categories
      .map((cat: any) => {
        const categoryServices = allServices.filter(
          (service: any) => service.scategory_id === cat.id
        );
        
        console.log(`  📂 Category "${cat.name}" (ID: ${cat.id}): ${categoryServices.length} services`);
        
        return {
          id: cat.id,
          name: cat.name,
          image: cat.image,
          short_text: cat.short_text,
          service_count: categoryServices.length,
          services: categoryServices
            .map((service: any) => ({
              id: service.id,
              title: service.title,
              slug: service.slug,
              category_id: cat.id,
              serial_number: service.serial_number || 999
            }))
            .sort((a, b) => a.serial_number - b.serial_number)
        };
      })
      .filter(cat => cat.services.length > 0); // Only show categories with services
    
    console.log(`🎉 Final menu categories: ${menuCategories.length}`);
    console.log("📊 Categories:", menuCategories.map(c => `${c.name} (${c.services.length})`));
    
    return menuCategories;
    
  } catch (error) {
    console.error("❌ Error in getMenuData:", error);
    return [];
  }
}
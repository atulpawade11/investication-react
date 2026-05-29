// services/DataService.ts
import { API_BASE_URL } from '@/lib/config';

class DataService {
  private static instance: DataService;
  private data: any = null;
  private promise: Promise<any> | null = null;
  private timestamp: number | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  async getFrontData() {
    // Return cached data if valid
    if (this.data && this.timestamp && (Date.now() - this.timestamp < this.CACHE_DURATION)) {
      return this.data;
    }

    // If fetch is in progress, return the same promise
    if (this.promise) {
      return this.promise;
    }

    // Start new fetch
    this.promise = this.fetchData();
    this.data = await this.promise;
    this.timestamp = Date.now();
    this.promise = null;
    
    return this.data;
  }

  private async fetchData() {
    const response = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch data');
    }
    return data;
  }
}

export const dataService = DataService.getInstance();
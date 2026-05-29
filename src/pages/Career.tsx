import { useEffect, useState } from "react";
import CareerClient from "./CareerClient";
import { API_BASE_URL } from '@/lib/config';

export default function CareerPage() {
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCareerData() {
      try {
        const response = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/career/`);
        const result = await response.json();
        if (result.success && result.data) {
          setInitialData({
            success: result.success,
            data: result.data.careers || result.data.data || [],
            be: result.data.be || {},
            jcats: result.data.jcats || []
          });
        }
      } catch (error) {
        console.error("Error fetching career data:", error);
      } finally {
        setLoading(false);
      }
    }
    getCareerData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return <CareerClient initialData={initialData || { success: false, data: [], be: {}, jcats: [] }} />;
}
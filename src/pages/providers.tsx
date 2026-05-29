// app/providers.tsx
import { ReactNode, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/config';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Set the data immediately in the cache
if (typeof window !== 'undefined') {
  // This runs once on client side
  queryClient.prefetchQuery({
    queryKey: ['frontData'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/InvestigationServices/Website/front/`);
      const data = await response.json();
      return data;
    },
  });
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
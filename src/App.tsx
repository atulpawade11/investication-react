import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { BootProvider } from './context/BootContext';
import { getBootData } from './services/webService';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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

// Import Pages
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogSlug from './pages/BlogSlug';
import Career from './pages/Career';
import CareerSlug from './pages/CareerSlug';
import Clientele from './pages/Clientele';
import Contact from './pages/Contact';
import DepartmentSlug from './pages/DepartmentSlug';
import Faq from './pages/Faq';
import GalleryImages from './pages/GalleryImages';
import GalleryVideos from './pages/GalleryVideos';
import LaboratorySlug from './pages/LaboratorySlug';
import ProductSlug from './pages/ProductSlug';
import SampleReport from './pages/SampleReport';
import Services from './pages/Services';
import ServicesCategory from './pages/ServicesCategory';
import ServicesCategoryService from './pages/ServicesCategoryService';
import SubmitCase from './pages/SubmitCase';
import Team from './pages/Team';
import TeamSlug from './pages/TeamSlug';
import Testimonials from './pages/Testimonials';
import AlliancesPage from './pages/Alliances';
import ServiceDetailNew from './pages/ServiceDetailNew';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const [breadcrumbImage, setBreadcrumbImage] = useState("/about/about-banner.png");

  useEffect(() => {
    const fetchBootData = async () => {
      try {
        const res = await getBootData();
        if (res?.success && res?.data?.bs?.breadcrumb) {
          setBreadcrumbImage(res.data.bs.breadcrumb);
        }
      } catch (error) {
        console.error("Boot data fetch error:", error);
      }
    };
    fetchBootData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ScrollToTop />
        <Toaster position="top-right" richColors />
        <Header />
        <BootProvider breadcrumbImage={breadcrumbImage}>
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about-us" element={<About />} />
              <Route path="/blogs" element={<Blog />} />
              <Route path="/blogs/:slug" element={<BlogSlug />} />
              <Route path="/career" element={<Career />} />
              <Route path="/career/:slug" element={<CareerSlug />} />
              <Route path="/portfolios" element={<Clientele />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/department/:slug" element={<DepartmentSlug />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/image-gallery" element={<GalleryImages />} />
              <Route path="/video-gallery" element={<GalleryVideos />} />
              <Route path="/laboratory/:slug" element={<LaboratorySlug />} />
              <Route path="/product/:slug" element={<ProductSlug />} />
              <Route path="/sample-report" element={<SampleReport />} />
              <Route path="/services" element={<Services />} />
              <Route path="/service/:slug" element={<ServiceDetailNew />} />
              <Route path="/services/:category" element={<Navigate to="/services" replace />} />
              <Route path="/services/:category/:slug" element={<Navigate to="/service/:slug" replace />} />   
              <Route path="/submit-case" element={<SubmitCase />} />
              <Route path="/team" element={<Team />} />
              <Route path="/team/:slug" element={<TeamSlug />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/alliances" element={<AlliancesPage />} />
            </Routes>
          </main>
        </BootProvider>
        <Footer />
      </Router>
    </QueryClientProvider>
  );
}

export default App;

import { useParams } from "react-router-dom";
import ServiceDetailClient from './ServiceDetailClient';

export default function ServiceDetailPage() { 
    const { category, slug } = useParams<{ category: string; slug: string }>(); 
    return <ServiceDetailClient categorySlug={category || ""} serviceSlug={slug || ""} />; 
}
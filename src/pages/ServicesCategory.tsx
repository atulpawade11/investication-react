import { useParams } from "react-router-dom";
import ServiceListingClient from './ServiceListingClient';

export default function ServiceListingPage() { 
    const { category } = useParams<{ category: string }>(); 
    return <ServiceListingClient categorySlug={category || ""} />; 
}
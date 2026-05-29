import { useParams } from "react-router-dom";
import CareerDetailsClient from "./CareerDetailsClient";

export default function CareerDetailPage() { 
    const { slug } = useParams<{ slug: string }>(); 
    return <CareerDetailsClient slug={slug || ""} />; 
}
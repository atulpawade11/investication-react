import { useParams } from "react-router-dom";
import TeamDetailClient from "./TeamDetailClient";

export default function TeamDetailPage() { 
    const { slug } = useParams<{ slug: string }>(); 
    return <TeamDetailClient idFromUrl={slug || ""} />; 
}
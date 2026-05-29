import { useParams } from "react-router-dom";
import SketchCopProductClient from './SketchCopProductClient';

export default function ProductPage() { 
    const { slug } = useParams<{ slug: string }>(); 
    return <SketchCopProductClient slug={slug || ""} />; 
}
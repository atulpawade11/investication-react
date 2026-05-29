export interface TabItem {
  title: string;
  description: string;
  image: string;
}

export interface AccordionItem {
  title: string;
  content: string;
}
  
  export type PageData = {
    banner: {
      title: string;
      subtitle?: string;
      bgImage: string;
    };
    content: {
      overview: string;
      services: any[]; 
    };
    title: string;
    overview: {
      heading: string;
      description: string[];
      image: string;
    };
    pillLabel: string;
    tabs: TabItem[];
    accordions: {
      title: string;
      content: string;
    }[];
    cta: {
      title: string;
      description: string;
      image: string;
    };
  };
  
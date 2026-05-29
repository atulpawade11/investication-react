export interface ProductHighlight {
    title: string;
    description: string;
  }
  
  export interface ProductAccordion {
    title: string;
    content: string;
  }
  
  export interface ProductData {
    title: string;
    subtitle: string;
    bannerImage: string;
    introText: string;
    highlights: ProductHighlight[];
    demoText: string;
    videoUrl: string; 
    accordions: ProductAccordion[];
  }
  
  export const sketchCopData: ProductData = {
    title: "SketchCop Facial Composite System",
    subtitle: "Revolutionary Forensic Imaging Tool",
    bannerImage: "/about/about-banner.png",
    introText: "SketchCop Facial Composite System, by SketchCop® Solutions, is a revolutionary facial imaging software tool. It is designed by IAI-certified forensic artist Michael W. Streed to bridge the gap between eyewitness memory and forensic imaging. This tool produces sketches similar to and with a much shorter duration than those by forensic sketch artists, thereby reducing investigative cycle times.",
    highlights: [
      { title: "Cost-Effective Technology", description: "Provides a sophisticated and cost-effective solution combining technology with expertise." },
      { title: "No Art Skills Required", description: "Even a first-timer can get trained. It's designed with a simple-to-use interface." },
      { title: "Unmatched Precision", description: "Images created are no less than those created by manual forensic artists." },
      { title: "Combating Eyewitness Challenges", description: "Creates facial composites that align with the complexities of human memory." },
      { title: "Subscription-Free Software", description: "Comes with a one-time payment model. No recurring subscription fees." },
      { title: "Reduced Investigative Cycle Times", description: "Easily make changes or undo actions, saving time and money." }
    ],
    demoText: "SIFS India, in agreement with Michael W. Streed, has opened the country's first forensic facial imaging laboratory to assist law enforcement bodies. If you are interested in getting a detailed working demo of this system before purchase, contact our executive.",
    videoUrl: "https://www.youtube.com/embed/WexxJiajry4?si=kqoHb249geAMG_Wa", 
    accordions: [
      { title: "Features & Benefits", content: "Detailed list of technical features..." },
      { title: "Sample Images", content: "Gallery of composites generated..." },
      { title: "System Requirements", content: "Windows 10/11, 8GB RAM..." },
      { title: "Frequently Asked Questions", content: "Common questions about licensing..." }
    ]
  };

  
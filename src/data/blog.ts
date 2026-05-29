export type Blog = {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content?: string;
    image: string;
    category: string;
    author: string;
    date: string;
    readTime: string;
    headerSubtitle: string;
  };
  
  export const BLOGS: Blog[] = [
    {
      id: 1,
      title: "Role of Forensic Science in Criminal Investigation",
      slug: "role-of-forensic-science",
      excerpt:
        "Forensic science plays a crucial role in modern criminal investigations by providing scientific evidence that supports legal proceedings.",
      image: "/blog/blog1.png",
      category: "Forensics",
      author: "SIFS India",
      date: "12 Jan 2025",
      readTime: "5 min read",
      headerSubtitle: "Forensic Discoveries: From Lab to Field",
    },
    {
      id: 2,
      title: "How Cyber Forensics Helps in Digital Crime",
      slug: "cyber-forensics-digital-crime",
      excerpt:
        "With the rise of digital crimes, cyber forensics has become essential for identifying, preserving, and analyzing electronic evidence.",
      image: "/blog/blog2.png",
      category: "Cyber Forensics",
      author: "SIFS India",
      date: "18 Jan 2025",
      readTime: "4 min read",
      headerSubtitle: "Forensic Discoveries: From Lab to Field",
    },
    {
      id: 3,
      title: "Importance of Document Examination in Legal Cases",
      slug: "document-examination-legal-cases",
      excerpt:
        "Document examination helps verify authenticity and detect forgery in disputed documents used in courts.",
      image: "/blog/blog3.png",
      category: "Document Examination",
      author: "SIFS India",
      date: "25 Jan 2025",
      readTime: "6 min read",
      headerSubtitle: "Forensic Discoveries: From Lab to Field",
    },
    {
      id: 4,
      title: "Fingerprint Analysis: A Powerful Identification Tool",
      slug: "fingerprint-analysis-identification",
      excerpt:
        "Fingerprint analysis remains one of the most reliable methods for personal identification in forensic investigations.",
      image: "/blog/blog4.png",
      category: "Fingerprint Analysis",
      author: "SIFS India",
      date: "30 Jan 2025",
      readTime: "3 min read",
      headerSubtitle: "Forensic Discoveries: From Lab to Field",
    },
  ];
  
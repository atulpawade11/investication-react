export type Job = {
    id: number;
    title: string;
    education: string;
    experience: string;
    deadline: string;
    category: string;
    icon: string; 
    description: string; 
};
  
  
export const JOBS: Job[] = [
    {
        id: 1,
        title: "Fire Forensic Investigator",
        category: "Forensic",
        experience: "1-2 Year",
        education: "Master’s degree in forensic science or related field",
        deadline: "31st March, 2025",
        description:
            "Responsible for investigating fire scenes, identifying origin and cause, collecting evidence, and preparing detailed reports for legal proceedings.",
        icon: "/career/job1.png",
    },
    {
        id: 2,
        title: "Multimedia Forensic examiner",
        category: "Media",
        experience: "1-2 Year",
        education: "Master’s degree in forensic science or related field",
        deadline: "31st March, 2025",
        description:
          "Analyze digital evidence from computers and mobile devices, recover deleted data, and support cybercrime investigations.",
        icon: "/career/job2.png",
    },
    {
        id: 3,
        title: "Digital Forensic Analyst",
        category: "Cyber",
        experience: "1-2 Year",
        education: "Bachelor’s degree in forensic science with specialization",
        deadline: "31st March, 2025",
        description:
            "Analyze digital evidence from computers and mobile devices, recover deleted data, and support cybercrime investigations.",
        icon: "/career/job3.png",
    },
    {
        id: 4,
        title: "Questioned Document Examiner",
        category: "Docs",
        experience: "1-2 Year",
        education: "Bachelor’s degree in forensic science with specialization",
        deadline: "31st March, 2025",
        description:
            "Analyze digital evidence from computers and mobile devices, recover deleted data, and support cybercrime investigations.",
        icon: "/career/job4.png",
    },
    {
        id: 5,
        title: "Fire Forensic Investigator",
        category: "Forensic",
        experience: "1-2 Year",
        education: "Master’s degree in forensic science or related field",
        deadline: "31st March, 2025",
        description:
            "Responsible for investigating fire scenes, identifying origin and cause, collecting evidence, and preparing detailed reports for legal proceedings.",
        icon: "/career/job1.png",
    },
    {
        id: 6,
        title: "Multimedia Forensic examiner",
        category: "Media",
        experience: "1-2 Year",
        education: "Master’s degree in forensic science or related field",
        deadline: "31st March, 2025",
        description:
          "Analyze digital evidence from computers and mobile devices, recover deleted data, and support cybercrime investigations.",
        icon: "/career/job2.png",
    },
  ];
  
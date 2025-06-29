export interface ContactInfo {
  phone: string;
  email: string;
  github: string;
  linkedin: string;
}

export interface Education {
  id: string;
  year: string;
  degree: string;
  institute: string;
  score: string;
}

export interface Publication {
  id: string;
  title: string;
  details: string;
  date: string;
  points: string[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  duration: string;
  points: string[];
}

export interface Project {
  id:string;
  title: string;
  details: string;
  date: string;
  points: string[];
}

export interface Competition {
    id: string;
    title: string;
    date: string;
    points: string[];
}

export interface Award {
    id: string;
    point: string;
}

export interface Skill {
    id: string;
    category: string;
    list: string;
}

export interface Responsibility {
    id: string;
    role: string;
    group: string;
    duration: string;
    points: string[];
}

export interface CustomSectionItem {
    id: string;
    title: string;
    subtitle: string;
    date: string;
    points: string[];
}

export interface CustomSection {
    id: string;
    title: string;
    items: CustomSectionItem[];
}

export interface ResumeSettings {
  fontFamily: 'Merriweather' | 'Lato' | 'Raleway' | 'Roboto Slab';
  fontSize: string; // store as string e.g., '10'
  accentColor: string; // hex color
}

export interface ResumeData {
  name: string;
  title: string;
  specialization: string;
  logoUrl: string;
  profileUrl: string;
  contact: ContactInfo;
  education: Education[];
  publications: Publication[];
  internships: Experience[];
  projects: Project[];
  competitions: Competition[];
  awards: Award[];
  skills: Skill[];
  responsibilities: Responsibility[];
  customSections: CustomSection[];
  sectionOrder: string[];
  settings: ResumeSettings;
}

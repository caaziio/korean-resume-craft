export interface PersonalInfo {
  fullNameKor: string;
  fullNameEng: string;
  dob: string;
  country: string;
  phone: string;
  email: string;
  address: string;
  visaType: string;
  visaOther: string;
  photo: string;
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  startDate: string;
  endDate: string;
  notes: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description: string;
}

export interface Language {
  id: string;
  language: string;
  proficiency: string;
  score: string;
}

export interface SelfIntroduction {
  intro: string;
  experiences: string;
  value: string;
  motivation: string;
}

export interface CV {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  personalInfo: PersonalInfo;
  summary: string;
  skills: string[];
  experiences: WorkExperience[];
  education: Education[];
  certifications: Certification[];
  languages: Language[];
  selfIntro: SelfIntroduction;
  portfolioLinks: string[];
  selectedTemplate: string;
}

export const VISA_TYPES = [
  'D-2 (Student)',
  'D-4 (Language Student)',
  'D-10 (Job Seeker)',
  'E-7 (Professional Worker)',
  'F-2',
  'F-4',
  'F-5',
  'F-6',
  'Other'
];

export const PROFICIENCY_LEVELS = [
  'Beginner',
  'Intermediate',
  'Business Level',
  'Native'
];

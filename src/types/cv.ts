
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
  order: number;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  startDate: string;
  endDate: string;
  notes: string;
  order: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description: string;
  order: number;
}

export interface Language {
  id: string;
  language: string;
  proficiency: string;
  score: string;
  order: number;
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
  isKorean: boolean;
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

// Korean translations
export const TRANSLATIONS = {
  en: {
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    country: 'Country',
    dateOfBirth: 'Date of Birth',
    visa: 'Visa',
    careerSummary: 'Career Summary',
    skills: 'Skills',
    workExperience: 'Work Experience',
    education: 'Education',
    certifications: 'Certifications',
    languages: 'Languages',
    selfIntroduction: 'Self Introduction',
    portfolioLinks: 'Portfolio & Links',
    present: 'Present',
    introduction: 'Introduction',
    experiences: 'Experiences',
    valueProp: 'Value Proposition',
    motivation: 'Motivation',
    score: 'Score'
  },
  ko: {
    fullName: '성명',
    email: '이메일',
    phone: '전화번호',
    address: '주소',
    country: '국가',
    dateOfBirth: '생년월일',
    visa: '비자',
    careerSummary: '경력 요약',
    skills: '기술',
    workExperience: '경력사항',
    education: '학력사항',
    certifications: '자격증',
    languages: '어학능력',
    selfIntroduction: '자기소개',
    portfolioLinks: '포트폴리오 & 링크',
    present: '현재',
    introduction: '소개',
    experiences: '경험',
    valueProp: '가치 제안',
    motivation: '지원동기',
    score: '점수'
  }
};

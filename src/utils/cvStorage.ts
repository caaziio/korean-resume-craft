import { CV, PersonalInfo, SelfIntroduction } from '@/types/cv';

const CV_STORAGE_KEY = 'acafo_cvs';

export const createEmptyCV = (name: string): CV => {
  const now = new Date().toISOString();
  
  const personalInfo: PersonalInfo = {
    fullNameKor: '',
    fullNameEng: '',
    dob: '',
    country: '',
    phone: '',
    email: '',
    address: '',
    visaType: '',
    visaOther: '',
    photo: ''
  };

  const selfIntro: SelfIntroduction = {
    intro: '',
    experiences: '',
    value: '',
    motivation: ''
  };

  return {
    id: `cv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    createdAt: now,
    updatedAt: now,
    personalInfo,
    summary: '',
    skills: [],
    experiences: [],
    education: [],
    certifications: [],
    languages: [],
    selfIntro,
    portfolioLinks: [],
    selectedTemplate: ''
  };
};

export const saveCV = (cv: CV) => {
  const cvs = loadAllCVs();
  cvs[cv.id] = cv;
  localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(cvs));
};

export const loadCV = (id: string): CV | null => {
  const cvs = loadAllCVs();
  return cvs[id] || null;
};

export const loadAllCVs = (): { [id: string]: CV } => {
  const storedCvs = localStorage.getItem(CV_STORAGE_KEY);
  return storedCvs ? JSON.parse(storedCvs) : {};
};

export const deleteCV = (id: string) => {
  const cvs = loadAllCVs();
  delete cvs[id];
  localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(cvs));
};

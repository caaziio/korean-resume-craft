
import { CV } from '@/types/cv';

const STORAGE_KEY = 'acafo_cvs';

export const loadCVs = (): CV[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading CVs:', error);
    return [];
  }
};

export const saveCVs = (cvs: CV[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cvs));
  } catch (error) {
    console.error('Error saving CVs:', error);
  }
};

export const createEmptyCV = (name: string): CV => {
  const now = new Date().toISOString();
  return {
    id: `cv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    createdAt: now,
    updatedAt: now,
    personalInfo: {
      fullNameKor: '',
      fullNameEng: '',
      dob: '',
      country: '',
      phone: '',
      email: '',
      address: '',
      visaType: '',
      visaOther: ''
    },
    summary: '',
    skills: [],
    experiences: [],
    education: [],
    certifications: [],
    languages: [],
    selfIntro: {
      intro: '',
      experiences: '',
      value: '',
      motivation: ''
    },
    portfolioLinks: [],
    selectedTemplate: 'template1'
  };
};

export const saveCV = (cv: CV): void => {
  const cvs = loadCVs();
  const index = cvs.findIndex(existing => existing.id === cv.id);
  
  cv.updatedAt = new Date().toISOString();
  
  if (index >= 0) {
    cvs[index] = cv;
  } else {
    cvs.push(cv);
  }
  
  saveCVs(cvs);
};

export const loadCV = (id: string): CV | null => {
  const cvs = loadCVs();
  return cvs.find(cv => cv.id === id) || null;
};

export const deleteCV = (id: string): void => {
  const cvs = loadCVs();
  const filtered = cvs.filter(cv => cv.id !== id);
  saveCVs(filtered);
};

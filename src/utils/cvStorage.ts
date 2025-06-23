
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
  console.log('Saving CV:', cv.id, cv.name);
  cv.updatedAt = new Date().toISOString();
  const cvs = loadAllCVs();
  cvs[cv.id] = cv;
  localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(cvs));
  console.log('CV saved successfully');
};

export const loadCV = (id: string): CV | null => {
  console.log('Loading CV with ID:', id);
  const cvs = loadAllCVs();
  console.log('All CVs in storage:', Object.keys(cvs));
  const cv = cvs[id];
  console.log('Found CV:', cv ? cv.name : 'Not found');
  return cv || null;
};

export const loadAllCVs = (): { [id: string]: CV } => {
  const storedCvs = localStorage.getItem(CV_STORAGE_KEY);
  const result = storedCvs ? JSON.parse(storedCvs) : {};
  console.log('Loading all CVs from storage:', Object.keys(result));
  return result;
};

export const loadCVs = (): CV[] => {
  const cvs = loadAllCVs();
  return Object.values(cvs);
};

export const deleteCV = (id: string) => {
  console.log('Deleting CV with ID:', id);
  const cvs = loadAllCVs();
  delete cvs[id];
  localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(cvs));
  console.log('CV deleted successfully');
};

// Add reorder functions for experiences
export const reorderExperiences = (cv: CV, fromIndex: number, toIndex: number): CV => {
  const updatedExperiences = [...cv.experiences];
  const [movedItem] = updatedExperiences.splice(fromIndex, 1);
  updatedExperiences.splice(toIndex, 0, movedItem);
  
  return {
    ...cv,
    experiences: updatedExperiences,
    updatedAt: new Date().toISOString()
  };
};

// Add reorder functions for education
export const reorderEducation = (cv: CV, fromIndex: number, toIndex: number): CV => {
  const updatedEducation = [...cv.education];
  const [movedItem] = updatedEducation.splice(fromIndex, 1);
  updatedEducation.splice(toIndex, 0, movedItem);
  
  return {
    ...cv,
    education: updatedEducation,
    updatedAt: new Date().toISOString()
  };
};

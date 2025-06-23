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
  
  try {
    const cvs = loadAllCVs();
    cvs[cv.id] = cv;
    const serialized = JSON.stringify(cvs);
    localStorage.setItem(CV_STORAGE_KEY, serialized);
    console.log('CV saved successfully to localStorage');
    
    // Verify the save worked
    const verification = loadCV(cv.id);
    if (verification) {
      console.log('CV save verification successful');
    } else {
      console.error('CV save verification failed');
    }
  } catch (error) {
    console.error('Error saving CV:', error);
    throw new Error('Failed to save CV');
  }
};

export const loadCV = (id: string): CV | null => {
  console.log('Loading CV with ID:', id);
  try {
    const cvs = loadAllCVs();
    console.log('All CVs in storage:', Object.keys(cvs));
    const cv = cvs[id];
    console.log('Found CV:', cv ? cv.name : 'Not found');
    return cv || null;
  } catch (error) {
    console.error('Error loading CV:', error);
    return null;
  }
};

export const loadAllCVs = (): { [id: string]: CV } => {
  try {
    const storedCvs = localStorage.getItem(CV_STORAGE_KEY);
    if (!storedCvs) {
      console.log('No CVs found in localStorage, returning empty object');
      return {};
    }
    
    const parsed = JSON.parse(storedCvs);
    console.log('Loading all CVs from storage:', Object.keys(parsed));
    return parsed;
  } catch (error) {
    console.error('Error loading CVs from localStorage:', error);
    return {};
  }
};

export const loadCVs = (): CV[] => {
  const cvs = loadAllCVs();
  const cvArray = Object.values(cvs);
  console.log('Returning CV array with length:', cvArray.length);
  return cvArray;
};

export const deleteCV = (id: string) => {
  console.log('Deleting CV with ID:', id);
  try {
    const cvs = loadAllCVs();
    delete cvs[id];
    localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(cvs));
    console.log('CV deleted successfully');
  } catch (error) {
    console.error('Error deleting CV:', error);
    throw new Error('Failed to delete CV');
  }
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

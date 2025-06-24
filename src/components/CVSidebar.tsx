
import { cn } from '@/lib/utils';
import { CV } from '@/types/cv';
import { 
  User, 
  FileText, 
  Award, 
  Briefcase, 
  GraduationCap, 
  Medal, 
  Languages, 
  MessageSquare, 
  Link,
  CheckCircle2
} from 'lucide-react';

interface CVSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  cv: CV;
}

const CVSidebar = ({ activeSection, onSectionChange, cv }: CVSidebarProps) => {
  const isKorean = cv.language === 'korean';

  const sections = [
    {
      id: 'personal-info',
      label: isKorean ? '개인정보' : 'Personal Info',
      icon: User,
      required: true
    },
    {
      id: 'career-summary',
      label: isKorean ? '경력 요약' : 'Career Summary',
      icon: FileText,
      required: false
    },
    {
      id: 'skills',
      label: isKorean ? '기술' : 'Skills',
      icon: Award,
      required: false
    },
    {
      id: 'work-experience',
      label: isKorean ? '경력 사항' : 'Work Experience',
      icon: Briefcase,
      required: false
    },
    {
      id: 'education',
      label: isKorean ? '학력' : 'Education',
      icon: GraduationCap,
      required: false
    },
    {
      id: 'certifications',
      label: isKorean ? '자격증' : 'Certifications',
      icon: Medal,
      required: false
    },
    {
      id: 'languages',
      label: isKorean ? '언어' : 'Languages',
      icon: Languages,
      required: false
    },
    {
      id: 'self-introduction',
      label: isKorean ? '자기소개' : 'Self Introduction',
      icon: MessageSquare,
      required: true
    },
    {
      id: 'portfolio-links',
      label: isKorean ? '포트폴리오 링크' : 'Portfolio Links',
      icon: Link,
      required: false
    }
  ];

  const isPersonalInfoComplete = !!(cv.personalInfo.fullNameEng && cv.personalInfo.email);
  const isSelfIntroComplete = !!(cv.selfIntro.intro && cv.selfIntro.experiences && cv.selfIntro.value && cv.selfIntro.motivation);

  const getSectionCompletion = (sectionId: string): boolean => {
    switch (sectionId) {
      case 'personal-info':
        return isPersonalInfoComplete;
      case 'career-summary':
        return !!cv.summary;
      case 'skills':
        return cv.skills.length > 0;
      case 'work-experience':
        return cv.experiences.length > 0;
      case 'education':
        return cv.education.length > 0;
      case 'certifications':
        return cv.certifications.length > 0;
      case 'languages':
        return cv.languages.length > 0;
      case 'self-introduction':
        return isSelfIntroComplete;
      case 'portfolio-links':
        return cv.portfolioLinks.some(link => link.trim() !== '');
      default:
        return false;
    }
  };

  return (
    <div className="w-80 bg-white border-r border-slate-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          {isKorean ? 'CV 섹션' : 'CV Sections'}
        </h2>
        <p className="text-sm text-slate-600">
          {isKorean ? '각 섹션을 완료하여 이력서를 작성하세요' : 'Complete each section to build your resume'}
        </p>
      </div>
      
      <nav className="space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          const isCompleted = getSectionCompletion(section.id);
          
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                isActive 
                  ? "bg-blue-50 text-blue-700 border border-blue-200" 
                  : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className={cn(
                "h-5 w-5",
                isActive ? "text-blue-600" : "text-slate-500"
              )} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{section.label}</span>
                  {isCompleted && (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  )}
                </div>
                {section.required && (
                  <span className="text-xs text-slate-500">
                    {isKorean ? '필수' : 'Required'}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>
      
      <div className="mt-8 p-4 bg-slate-50 rounded-lg">
        <h3 className="text-sm font-medium text-slate-900 mb-2">
          {isKorean ? '완료 상태' : 'Completion Status'}
        </h3>
        <div className="space-y-1">
          {sections.filter(s => s.required).map(section => (
            <div key={section.id} className="flex items-center justify-between text-xs">
              <span className="text-slate-600">{section.label}</span>
              <span className={cn(
                "font-medium",
                getSectionCompletion(section.id) ? "text-green-600" : "text-amber-600"
              )}>
                {getSectionCompletion(section.id) ? 
                  (isKorean ? "완료" : "Complete") : 
                  (isKorean ? "미완료" : "Incomplete")
                }
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CVSidebar;

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Save } from 'lucide-react';
import { CV } from '@/types/cv';
import { loadCV, saveCV } from '@/utils/cvStorage';
import { toast } from '@/hooks/use-toast';
import CVSidebar from '@/components/CVSidebar';
import PersonalInfoForm from '@/components/forms/PersonalInfoForm';
import CareerSummaryForm from '@/components/forms/CareerSummaryForm';
import SkillsForm from '@/components/forms/SkillsForm';
import WorkExperienceForm from '@/components/forms/WorkExperienceForm';
import EducationForm from '@/components/forms/EducationForm';
import CertificationsForm from '@/components/forms/CertificationsForm';
import LanguagesForm from '@/components/forms/LanguagesForm';
import SelfIntroductionForm from '@/components/forms/SelfIntroductionForm';
import PortfolioLinksForm from '@/components/forms/PortfolioLinksForm';
import LanguageToggle from '@/components/LanguageToggle';

const CVBuilder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cv, setCv] = useState<CV | null>(null);
  const [activeSection, setActiveSection] = useState('personal-info');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (id) {
      const loadedCV = loadCV(id);
      if (loadedCV) {
        setCv(loadedCV);
      } else {
        toast({
          title: "CV not found",
          description: "The requested CV could not be found",
          variant: "destructive"
        });
        navigate('/');
      }
    }
  }, [id, navigate]);

  const handleSave = () => {
    if (cv) {
      saveCV(cv);
      setHasUnsavedChanges(false);
      toast({
        title: "Saved",
        description: "Your CV has been saved successfully"
      });
    }
  };

  const handleCVChange = (updatedCV: CV) => {
    setCv(updatedCV);
    setHasUnsavedChanges(true);
  };

  const renderActiveForm = () => {
    if (!cv) return null;

    switch (activeSection) {
      case 'personal-info':
        return <PersonalInfoForm cv={cv} onChange={handleCVChange} />;
      case 'career-summary':
        return <CareerSummaryForm cv={cv} onChange={handleCVChange} />;
      case 'skills':
        return <SkillsForm cv={cv} onChange={handleCVChange} />;
      case 'work-experience':
        return <WorkExperienceForm cv={cv} onChange={handleCVChange} />;
      case 'education':
        return <EducationForm cv={cv} onChange={handleCVChange} />;
      case 'certifications':
        return <CertificationsForm cv={cv} onChange={handleCVChange} />;
      case 'languages':
        return <LanguagesForm cv={cv} onChange={handleCVChange} />;
      case 'self-introduction':
        return <SelfIntroductionForm cv={cv} onChange={handleCVChange} />;
      case 'portfolio-links':
        return <PortfolioLinksForm cv={cv} onChange={handleCVChange} />;
      default:
        return <PersonalInfoForm cv={cv} onChange={handleCVChange} />;
    }
  };

  if (!cv) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading CV...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-korean">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {cv?.language === 'korean' ? '이력서 목록으로' : 'Back to CVs'}
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">{cv?.name}</h1>
              <p className="text-sm text-slate-500">
                {cv?.language === 'korean' ? '이력서 세부사항 편집' : 'Edit your CV details'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {cv && <LanguageToggle cv={cv} onChange={handleCVChange} />}
            {hasUnsavedChanges && (
              <span className="text-sm text-amber-600 font-medium">
                {cv?.language === 'korean' ? '저장되지 않은 변경사항' : 'Unsaved changes'}
              </span>
            )}
            <Button
              onClick={handleSave}
              variant="outline"
              size="sm"
              className="border-green-200 text-green-700 hover:bg-green-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {cv?.language === 'korean' ? '저장' : 'Save'}
            </Button>
            <Button
              onClick={() => navigate(`/cv/${cv?.id}/preview`)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              {cv?.language === 'korean' ? '미리보기' : 'Preview'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex max-w-7xl mx-auto">
        <CVSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
          cv={cv}
        />
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            {renderActiveForm()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVBuilder;

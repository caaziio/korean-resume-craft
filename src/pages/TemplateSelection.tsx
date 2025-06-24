
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';
import { CV } from '@/types/cv';
import { loadCV, saveCV } from '@/utils/cvStorage';
import { toast } from '@/hooks/use-toast';

const TemplateSelection = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cv, setCv] = useState<CV | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('template1');

  useEffect(() => {
    if (id) {
      const loadedCV = loadCV(id);
      if (loadedCV) {
        setCv(loadedCV);
        setSelectedTemplate(loadedCV.selectedTemplate);
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

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleSaveAndDownload = () => {
    if (cv) {
      const updatedCV = { ...cv, selectedTemplate };
      saveCV(updatedCV);
      const isKorean = cv.language === 'korean';
      toast({
        title: isKorean ? "템플릿 선택됨" : "Template selected",
        description: isKorean ? "템플릿이 저장되었습니다. PDF 생성 중..." : "Your template has been saved. Generating PDF...",
      });
      // Here you would trigger PDF generation
    }
  };

  if (!cv) {
    const isKorean = cv?.language === 'korean';
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">
            {isKorean ? '템플릿 로딩 중...' : 'Loading Templates...'}
          </p>
        </div>
      </div>
    );
  }

  const isKorean = cv.language === 'korean';

  const templates = [
    { 
      id: 'template1', 
      name: isKorean ? '클래식' : 'Classic', 
      description: isKorean ? '깔끔하고 전문적인 레이아웃' : 'Clean and professional layout' 
    },
    { 
      id: 'template2', 
      name: isKorean ? '모던' : 'Modern', 
      description: isKorean ? '강조 색상이 있는 현대적인 디자인' : 'Contemporary design with accent colors' 
    },
    { 
      id: 'template3', 
      name: isKorean ? '미니멀' : 'Minimal', 
      description: isKorean ? '단순하고 우아한 타이포그래피' : 'Simple and elegant typography' 
    },
    { 
      id: 'template4', 
      name: isKorean ? '기업용' : 'Corporate', 
      description: isKorean ? '전통적인 비즈니스 형식' : 'Traditional business format' 
    },
    { 
      id: 'template5', 
      name: isKorean ? '창의적' : 'Creative', 
      description: isKorean ? '창의적 분야를 위한 독특한 레이아웃' : 'Unique layout for creative fields' 
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-korean">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/cv/${cv.id}/preview`)}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isKorean ? '미리보기로 돌아가기' : 'Back to Preview'}
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                {isKorean ? '템플릿 선택' : 'Choose Template'}
              </h1>
              <p className="text-sm text-slate-500">
                {isKorean ? 'CV용 템플릿을 선택하세요' : 'Select a template for your CV'}
              </p>
            </div>
          </div>
          
          <Button
            onClick={handleSaveAndDownload}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            {isKorean ? 'PDF 다운로드' : 'Download PDF'}
          </Button>
        </div>
      </div>

      {/* Template Grid */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`bg-white rounded-lg border-2 p-6 cursor-pointer transition-all ${
                selectedTemplate === template.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => handleTemplateSelect(template.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">{template.name}</h3>
                {selectedTemplate === template.id && (
                  <Check className="h-5 w-5 text-blue-600" />
                )}
              </div>
              <p className="text-slate-600 text-sm mb-4">{template.description}</p>
              <div className="bg-slate-100 h-32 rounded flex items-center justify-center">
                <span className="text-slate-500 text-sm">
                  {isKorean ? '템플릿 미리보기' : 'Template Preview'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateSelection;

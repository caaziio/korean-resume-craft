
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Edit, Download, ChevronUp, ChevronDown } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CV } from '@/types/cv';
import { loadCV, saveCV, reorderExperiences, reorderEducation } from '@/utils/cvStorage';
import { generatePDF } from '@/utils/pdfGenerator';
import { toast } from '@/hooks/use-toast';

const CVPreview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cv, setCv] = useState<CV | null>(null);
  const [language, setLanguage] = useState<'en' | 'ko'>('en');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

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

  const formatText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
    } catch {
      return dateString;
    }
  };

  const labels = language === 'ko' ? {
    email: '이메일',
    phone: '전화번호',
    address: '주소',
    country: '국가',
    dob: '생년월일',
    visa: '비자',
    careerSummary: '경력 요약',
    skills: '기술',
    workExperience: '경력',
    education: '학력',
    languages: '언어',
    selfIntroduction: '자기소개',
    portfolioLinks: '포트폴리오 & 링크',
    present: '현재',
    backToEdit: '편집으로 돌아가기',
    edit: '편집',
    downloadPDF: 'PDF 다운로드',
    reviewCV: 'CV를 확인하고 템플릿을 선택하세요',
    chooseTemplate: '템플릿 선택',
    korean: '한국어',
    english: '영어'
  } : {
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    country: 'Country',
    dob: 'Date of Birth',
    visa: 'Visa',
    careerSummary: 'Career Summary',
    skills: 'Skills',
    workExperience: 'Work Experience',
    education: 'Education',
    languages: 'Languages',
    selfIntroduction: 'Self Introduction',
    portfolioLinks: 'Portfolio & Links',
    present: 'Present',
    backToEdit: 'Back to Edit',
    edit: 'Edit',
    downloadPDF: 'Download PDF',
    reviewCV: 'Review your CV before choosing a template',
    chooseTemplate: 'Choose Template',
    korean: 'Korean',
    english: 'English'
  };

  const handleDownloadPDF = async () => {
    if (!cv) return;
    
    setIsGeneratingPDF(true);
    try {
      await generatePDF(cv, language);
      toast({
        title: "PDF Generated",
        description: "Your CV has been downloaded successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const moveExperience = (index: number, direction: 'up' | 'down') => {
    if (!cv) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= cv.experiences.length) return;
    
    const updatedCV = reorderExperiences(cv, index, newIndex);
    setCv(updatedCV);
    saveCV(updatedCV);
  };

  const moveEducation = (index: number, direction: 'up' | 'down') => {
    if (!cv) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= cv.education.length) return;
    
    const updatedCV = reorderEducation(cv, index, newIndex);
    setCv(updatedCV);
    saveCV(updatedCV);
  };

  if (!cv) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading CV Preview...</p>
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
              onClick={() => navigate(`/cv/${cv.id}`)}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {labels.backToEdit}
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">{cv.name} - Preview</h1>
              <p className="text-sm text-slate-500">{labels.reviewCV}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <div className="flex items-center space-x-2">
              <Label htmlFor="language-toggle" className="text-sm font-medium">
                {labels.english}
              </Label>
              <Switch
                id="language-toggle"
                checked={language === 'ko'}
                onCheckedChange={(checked) => setLanguage(checked ? 'ko' : 'en')}
              />
              <Label htmlFor="language-toggle" className="text-sm font-medium">
                {labels.korean}
              </Label>
            </div>
            
            <Button
              onClick={() => navigate(`/cv/${cv.id}`)}
              variant="outline"
              size="sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              {labels.edit}
            </Button>
            <Button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              {isGeneratingPDF ? 'Generating...' : labels.downloadPDF}
            </Button>
            <Button
              onClick={() => navigate(`/cv/${cv.id}/templates`)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              {labels.chooseTemplate}
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <div className="space-y-8">
            {/* Header with Photo */}
            <div className="flex items-start gap-6 border-b pb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {cv.personalInfo.fullNameEng || 'Full Name'}
                  {cv.personalInfo.fullNameKor && (
                    <span className="text-xl text-slate-600 ml-2 font-korean">
                      ({cv.personalInfo.fullNameKor})
                    </span>
                  )}
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700 mt-4">
                  {cv.personalInfo.email && (
                    <div><strong>{labels.email}:</strong> {cv.personalInfo.email}</div>
                  )}
                  {cv.personalInfo.phone && (
                    <div><strong>{labels.phone}:</strong> {cv.personalInfo.phone}</div>
                  )}
                  {cv.personalInfo.address && (
                    <div><strong>{labels.address}:</strong> {cv.personalInfo.address}</div>
                  )}
                  {cv.personalInfo.country && (
                    <div><strong>{labels.country}:</strong> {cv.personalInfo.country}</div>
                  )}
                  {cv.personalInfo.dob && (
                    <div><strong>{labels.dob}:</strong> {cv.personalInfo.dob}</div>
                  )}
                  {cv.personalInfo.visaType && (
                    <div><strong>{labels.visa}:</strong> {cv.personalInfo.visaType}{cv.personalInfo.visaOther && ` - ${cv.personalInfo.visaOther}`}</div>
                  )}
                </div>
              </div>
              
              {cv.personalInfo.photo && (
                <div className="flex-shrink-0">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={cv.personalInfo.photo} alt="Profile photo" className="object-cover" />
                    <AvatarFallback className="text-2xl">
                      {cv.personalInfo.fullNameEng?.charAt(0) || 'N'}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>

            {/* Career Summary */}
            {cv.summary && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-3 border-b border-slate-200 pb-1">{labels.careerSummary}</h2>
                <div className="text-slate-700 leading-relaxed">{formatText(cv.summary)}</div>
              </div>
            )}

            {/* Skills */}
            {cv.skills.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-3 border-b border-slate-200 pb-1">{labels.skills}</h2>
                <div className="flex flex-wrap gap-2">
                  {cv.skills.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Work Experience with reorder controls */}
            {cv.experiences.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-1">{labels.workExperience}</h2>
                <div className="space-y-6">
                  {cv.experiences.map((exp, index) => (
                    <div key={exp.id} className="border-l-4 border-blue-200 pl-6 relative group">
                      <div className="absolute left-[-20px] top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {index > 0 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveExperience(index, 'up')}
                            className="h-6 w-6 p-0 hover:bg-blue-100"
                          >
                            <ChevronUp className="h-3 w-3" />
                          </Button>
                        )}
                        {index < cv.experiences.length - 1 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveExperience(index, 'down')}
                            className="h-6 w-6 p-0 hover:bg-blue-100"
                          >
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{exp.title}</h3>
                          <p className="text-blue-700 font-medium">{exp.company}</p>
                        </div>
                        <div className="text-sm text-slate-500">
                          {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : labels.present}
                        </div>
                      </div>
                      {exp.description && (
                        <div className="text-slate-700 leading-relaxed">{formatText(exp.description)}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education with reorder controls */}
            {cv.education.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-1">{labels.education}</h2>
                <div className="space-y-4">
                  {cv.education.map((edu, index) => (
                    <div key={edu.id} className="border-l-4 border-green-200 pl-6 relative group">
                      <div className="absolute left-[-20px] top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {index > 0 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveEducation(index, 'up')}
                            className="h-6 w-6 p-0 hover:bg-green-100"
                          >
                            <ChevronUp className="h-3 w-3" />
                          </Button>
                        )}
                        {index < cv.education.length - 1 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveEducation(index, 'down')}
                            className="h-6 w-6 p-0 hover:bg-green-100"
                          >
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{edu.degree}</h3>
                          <p className="text-green-700 font-medium">{edu.school}</p>
                        </div>
                        <div className="text-sm text-slate-500">
                          {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                        </div>
                      </div>
                      {edu.notes && (
                        <div className="text-slate-700 leading-relaxed">{formatText(edu.notes)}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages - 4 per row with level in parenthesis */}
            {cv.languages.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-1">{labels.languages}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {cv.languages.map((lang) => (
                    <div key={lang.id} className="border border-slate-200 rounded-lg p-4 text-center">
                      <h3 className="font-semibold text-slate-900 mb-1">{lang.language} ({lang.proficiency})</h3>
                      {lang.score && (
                        <p className="text-sm text-slate-500">Score: {lang.score}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Self Introduction */}
            {(cv.selfIntro.intro || cv.selfIntro.experiences || cv.selfIntro.value || cv.selfIntro.motivation) && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-1">{labels.selfIntroduction}</h2>
                <div className="space-y-4">
                  {cv.selfIntro.intro && (
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-2">Introduction</h3>
                      <div className="text-slate-700 leading-relaxed">{formatText(cv.selfIntro.intro)}</div>
                    </div>
                  )}
                  {cv.selfIntro.experiences && (
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-2">Experiences</h3>
                      <div className="text-slate-700 leading-relaxed">{formatText(cv.selfIntro.experiences)}</div>
                    </div>
                  )}
                  {cv.selfIntro.value && (
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-2">Value Proposition</h3>
                      <div className="text-slate-700 leading-relaxed">{formatText(cv.selfIntro.value)}</div>
                    </div>
                  )}
                  {cv.selfIntro.motivation && (
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-2">Motivation</h3>
                      <div className="text-slate-700 leading-relaxed">{formatText(cv.selfIntro.motivation)}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Portfolio Links */}
            {cv.portfolioLinks.filter(link => link.trim()).length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-1">{labels.portfolioLinks}</h2>
                <div className="space-y-2">
                  {cv.portfolioLinks.filter(link => link.trim()).map((link, index) => (
                    <div key={index}>
                      <a 
                        href={link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline break-all"
                      >
                        {link}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVPreview;


import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Download } from 'lucide-react';
import { CV } from '@/types/cv';
import { loadCV } from '@/utils/cvStorage';
import { toast } from '@/hooks/use-toast';
import LanguageToggle from '@/components/LanguageToggle';
import { saveCV } from '@/utils/cvStorage';

const CVPreview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cv, setCv] = useState<CV | null>(null);

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

  const handleCVChange = (updatedCV: CV) => {
    setCv(updatedCV);
    saveCV(updatedCV);
  };

  const formatText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
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

  const isKorean = cv.language === 'korean';

  return (
    <div className="min-h-screen bg-slate-50 font-korean">
      {/* Fixed Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/cv/${cv.id}`)}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isKorean ? '편집으로 돌아가기' : 'Back to Edit'}
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                {cv.name} - {isKorean ? '미리보기' : 'Preview'}
              </h1>
              <p className="text-sm text-slate-500">
                {isKorean ? '템플릿을 선택하기 전에 이력서를 검토하세요' : 'Review your CV before choosing a template'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <LanguageToggle cv={cv} onChange={handleCVChange} />
            <Button
              onClick={() => navigate(`/cv/${cv.id}`)}
              variant="outline"
              size="sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              {isKorean ? '편집' : 'Edit'}
            </Button>
            <Button
              onClick={() => navigate(`/cv/${cv.id}/templates`)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              {isKorean ? '템플릿 선택' : 'Choose Template'}
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <div className="space-y-8">
            {/* Personal Info */}
            <div className="flex items-start gap-6 border-b pb-6">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  {cv.personalInfo.fullNameEng}
                  {cv.personalInfo.fullNameKor && (
                    <span className="text-lg font-normal text-slate-600 ml-2">
                      ({cv.personalInfo.fullNameKor})
                    </span>
                  )}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600">
                  {cv.personalInfo.email && (
                    <p><strong>{isKorean ? '이메일:' : 'Email:'}</strong> {cv.personalInfo.email}</p>
                  )}
                  {cv.personalInfo.phone && (
                    <p><strong>{isKorean ? '전화:' : 'Phone:'}</strong> {cv.personalInfo.phone}</p>
                  )}
                  {cv.personalInfo.address && (
                    <p><strong>{isKorean ? '주소:' : 'Address:'}</strong> {cv.personalInfo.address}</p>
                  )}
                  {cv.personalInfo.dob && (
                    <p><strong>{isKorean ? '생년월일:' : 'Date of Birth:'}</strong> {cv.personalInfo.dob}</p>
                  )}
                  {cv.personalInfo.country && (
                    <p><strong>{isKorean ? '국가:' : 'Country:'}</strong> {cv.personalInfo.country}</p>
                  )}
                  {cv.personalInfo.visaType && (
                    <p><strong>{isKorean ? '비자:' : 'Visa:'}</strong> {cv.personalInfo.visaType}</p>
                  )}
                </div>
              </div>
              {cv.personalInfo.photo && (
                <div className="flex-shrink-0">
                  <img
                    src={cv.personalInfo.photo}
                    alt="Profile"
                    className="w-32 h-32 object-cover rounded-lg border border-slate-200"
                  />
                </div>
              )}
            </div>

            {/* Career Summary */}
            {cv.summary && (
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {isKorean ? '경력 요약' : 'Career Summary'}
                </h3>
                <p className="text-slate-700 leading-relaxed">{formatText(cv.summary)}</p>
              </div>
            )}

            {/* Skills */}
            {cv.skills.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {isKorean ? '기술' : 'Skills'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cv.skills.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Work Experience */}
            {cv.experiences.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  {isKorean ? '경력 사항' : 'Work Experience'}
                </h3>
                <div className="space-y-6">
                  {cv.experiences.map((exp) => (
                    <div key={exp.id} className="border-l-4 border-blue-200 pl-6">
                      <h4 className="text-lg font-semibold text-slate-900">{exp.title}</h4>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                      <p className="text-sm text-slate-500 mb-3">
                        {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : (isKorean ? '현재' : 'Present')}
                      </p>
                      {exp.description && (
                        <div className="text-slate-700 leading-relaxed">
                          {formatText(exp.description)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {cv.education.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  {isKorean ? '학력' : 'Education'}
                </h3>
                <div className="space-y-4">
                  {cv.education.map((edu) => (
                    <div key={edu.id} className="border-l-4 border-green-200 pl-6">
                      <h4 className="text-lg font-semibold text-slate-900">{edu.degree}</h4>
                      <p className="text-green-600 font-medium">{edu.school}</p>
                      <p className="text-sm text-slate-500 mb-2">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </p>
                      {edu.notes && (
                        <div className="text-slate-700 leading-relaxed">
                          {formatText(edu.notes)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {cv.languages.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  {isKorean ? '언어' : 'Languages'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {cv.languages.map((lang) => (
                    <div key={lang.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <h4 className="font-semibold text-slate-900 mb-1">
                        {lang.language}
                      </h4>
                      <p className="text-xs text-slate-600 mb-1">
                        ({lang.proficiency})
                      </p>
                      {lang.score && (
                        <p className="text-sm text-slate-600">{lang.score}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {cv.certifications.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  {isKorean ? '자격증' : 'Certifications'}
                </h3>
                <div className="space-y-4">
                  {cv.certifications.map((cert) => (
                    <div key={cert.id} className="border-l-4 border-purple-200 pl-6">
                      <h4 className="text-lg font-semibold text-slate-900">{cert.name}</h4>
                      <p className="text-purple-600 font-medium">{cert.issuer}</p>
                      <p className="text-sm text-slate-500 mb-2">{formatDate(cert.date)}</p>
                      {cert.description && (
                        <div className="text-slate-700 leading-relaxed">
                          {formatText(cert.description)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Self Introduction */}
            {(cv.selfIntro.intro || cv.selfIntro.experiences || cv.selfIntro.value || cv.selfIntro.motivation) && (
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  {isKorean ? '자기소개' : 'Self Introduction'}
                </h3>
                <div className="space-y-4">
                  {cv.selfIntro.intro && (
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">
                        {isKorean ? '소개' : 'Introduction'}
                      </h4>
                      <div className="text-slate-700 leading-relaxed">
                        {formatText(cv.selfIntro.intro)}
                      </div>
                    </div>
                  )}
                  {cv.selfIntro.experiences && (
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">
                        {isKorean ? '경험' : 'Experiences'}
                      </h4>
                      <div className="text-slate-700 leading-relaxed">
                        {formatText(cv.selfIntro.experiences)}
                      </div>
                    </div>
                  )}
                  {cv.selfIntro.value && (
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">
                        {isKorean ? '가치' : 'Value'}
                      </h4>
                      <div className="text-slate-700 leading-relaxed">
                        {formatText(cv.selfIntro.value)}
                      </div>
                    </div>
                  )}
                  {cv.selfIntro.motivation && (
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">
                        {isKorean ? '동기' : 'Motivation'}
                      </h4>
                      <div className="text-slate-700 leading-relaxed">
                        {formatText(cv.selfIntro.motivation)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Portfolio Links */}
            {cv.portfolioLinks.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  {isKorean ? '포트폴리오 링크' : 'Portfolio Links'}
                </h3>
                <div className="space-y-2">
                  {cv.portfolioLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline block"
                    >
                      {link}
                    </a>
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

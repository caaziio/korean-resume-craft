
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Edit, Download } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CV, TRANSLATIONS } from '@/types/cv';
import { loadCV, saveCV } from '@/utils/cvStorage';
import { generatePDF } from '@/utils/pdfGenerator';
import { toast } from '@/hooks/use-toast';

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

  const handleLanguageToggle = (isKorean: boolean) => {
    if (cv) {
      const updatedCV = { ...cv, isKorean };
      setCv(updatedCV);
      saveCV(updatedCV);
    }
  };

  const handleDownloadPDF = async () => {
    if (cv) {
      try {
        await generatePDF('cv-content', `${cv.name}_CV.pdf`);
        toast({
          title: "PDF Downloaded",
          description: "Your CV has been downloaded successfully"
        });
      } catch (error) {
        toast({
          title: "Download Failed",
          description: "Failed to generate PDF. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

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
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
    } catch {
      return dateString;
    }
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

  const t = cv.isKorean ? TRANSLATIONS.ko : TRANSLATIONS.en;
  const sortedExperiences = [...cv.experiences].sort((a, b) => (a.order || 0) - (b.order || 0));
  const sortedEducation = [...cv.education].sort((a, b) => (a.order || 0) - (b.order || 0));
  const sortedCertifications = [...cv.certifications].sort((a, b) => (a.order || 0) - (b.order || 0));
  const sortedLanguages = [...cv.languages].sort((a, b) => (a.order || 0) - (b.order || 0));

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
              Back to Edit
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">{cv.name} - Preview</h1>
              <p className="text-sm text-slate-500">Review your CV before choosing a template</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="language-toggle" className="text-sm font-medium">
                English
              </Label>
              <Switch
                id="language-toggle"
                checked={cv.isKorean}
                onCheckedChange={handleLanguageToggle}
              />
              <Label htmlFor="language-toggle" className="text-sm font-medium">
                한국어
              </Label>
            </div>
            
            <Button
              onClick={() => navigate(`/cv/${cv.id}`)}
              variant="outline"
              size="sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              onClick={handleDownloadPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div id="cv-content" className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <div className="space-y-8">
            {/* Header with Photo */}
            <div className="flex items-start gap-6 border-b pb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {cv.personalInfo.fullNameEng || t.fullName}
                  {cv.personalInfo.fullNameKor && (
                    <span className="text-xl text-slate-600 ml-2 font-korean">
                      ({cv.personalInfo.fullNameKor})
                    </span>
                  )}
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700 mt-4">
                  {cv.personalInfo.email && (
                    <div><strong>{t.email}:</strong> {cv.personalInfo.email}</div>
                  )}
                  {cv.personalInfo.phone && (
                    <div><strong>{t.phone}:</strong> {cv.personalInfo.phone}</div>
                  )}
                  {cv.personalInfo.address && (
                    <div><strong>{t.address}:</strong> {cv.personalInfo.address}</div>
                  )}
                  {cv.personalInfo.country && (
                    <div><strong>{t.country}:</strong> {cv.personalInfo.country}</div>
                  )}
                  {cv.personalInfo.dob && (
                    <div><strong>{t.dateOfBirth}:</strong> {cv.personalInfo.dob}</div>
                  )}
                  {cv.personalInfo.visaType && (
                    <div><strong>{t.visa}:</strong> {cv.personalInfo.visaType}{cv.personalInfo.visaOther && ` - ${cv.personalInfo.visaOther}`}</div>
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
                <h2 className="text-xl font-semibold text-slate-900 mb-3 border-b border-slate-200 pb-1">{t.careerSummary}</h2>
                <div className="text-slate-700 leading-relaxed">{formatText(cv.summary)}</div>
              </div>
            )}

            {/* Skills */}
            {cv.skills.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-3 border-b border-slate-200 pb-1">{t.skills}</h2>
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
            {sortedExperiences.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-1">{t.workExperience}</h2>
                <div className="space-y-6">
                  {sortedExperiences.map((exp) => (
                    <div key={exp.id} className="border-l-4 border-blue-200 pl-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{exp.title}</h3>
                          <p className="text-blue-700 font-medium">{exp.company}</p>
                        </div>
                        <div className="text-sm text-slate-500">
                          {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : t.present}
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

            {/* Education */}
            {sortedEducation.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-1">{t.education}</h2>
                <div className="space-y-4">
                  {sortedEducation.map((edu) => (
                    <div key={edu.id} className="border-l-4 border-green-200 pl-6">
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

            {/* Certifications */}
            {sortedCertifications.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-1">{t.certifications}</h2>
                <div className="space-y-4">
                  {sortedCertifications.map((cert) => (
                    <div key={cert.id} className="border-l-4 border-purple-200 pl-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{cert.name}</h3>
                          <p className="text-purple-700 font-medium">{cert.issuer}</p>
                        </div>
                        <div className="text-sm text-slate-500">{formatDate(cert.date)}</div>
                      </div>
                      {cert.description && (
                        <div className="text-slate-700 leading-relaxed">{formatText(cert.description)}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {sortedLanguages.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-1">{t.languages}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {sortedLanguages.map((lang) => (
                    <div key={lang.id} className="border border-slate-200 rounded-lg p-4">
                      <h3 className="font-semibold text-slate-900 mb-1">
                        {lang.language} ({lang.proficiency})
                      </h3>
                      {lang.score && (
                        <p className="text-sm text-slate-500">{t.score}: {lang.score}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Self Introduction */}
            {(cv.selfIntro.intro || cv.selfIntro.experiences || cv.selfIntro.value || cv.selfIntro.motivation) && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-1">{t.selfIntroduction}</h2>
                <div className="space-y-4">
                  {cv.selfIntro.intro && (
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-2">{t.introduction}</h3>
                      <div className="text-slate-700 leading-relaxed">{formatText(cv.selfIntro.intro)}</div>
                    </div>
                  )}
                  {cv.selfIntro.experiences && (
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-2">{t.experiences}</h3>
                      <div className="text-slate-700 leading-relaxed">{formatText(cv.selfIntro.experiences)}</div>
                    </div>
                  )}
                  {cv.selfIntro.value && (
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-2">{t.valueProp}</h3>
                      <div className="text-slate-700 leading-relaxed">{formatText(cv.selfIntro.value)}</div>
                    </div>
                  )}
                  {cv.selfIntro.motivation && (
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-2">{t.motivation}</h3>
                      <div className="text-slate-700 leading-relaxed">{formatText(cv.selfIntro.motivation)}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Portfolio Links */}
            {cv.portfolioLinks.filter(link => link.trim()).length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-1">{t.portfolioLinks}</h2>
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

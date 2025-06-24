
import { CV } from '@/types/cv';

interface KoreanTemplateProps {
  cv: CV;
}

const KoreanTemplate = ({ cv }: KoreanTemplateProps) => {
  const isKorean = cv.language === 'korean';

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const formatText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="resume-container max-w-[210mm] mx-auto p-8 bg-white shadow-lg">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        {cv.experiences[0]?.title || (isKorean ? '소프트웨어 엔지니어' : 'Software Engineer')}
      </h1>

      {/* Header */}
      <div className="header-container flex flex-col md:flex-row bg-blue-50 p-6 rounded-2xl mb-6">
        <div className="w-full md:w-1/4 text-center md:text-left">
          {cv.personalInfo.photo ? (
            <img 
              src={cv.personalInfo.photo} 
              alt="Profile Photo" 
              className="w-32 h-32 rounded-full mx-auto md:mx-0 mb-4 object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full mx-auto md:mx-0 mb-4 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm">{isKorean ? '사진 없음' : 'No Photo'}</span>
            </div>
          )}
        </div>
        <div className="w-full md:w-3/4 flex flex-col justify-center md:pl-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {cv.personalInfo.fullNameKor && cv.personalInfo.fullNameEng
              ? `${cv.personalInfo.fullNameKor} (${cv.personalInfo.fullNameEng})`
              : cv.personalInfo.fullNameEng || cv.personalInfo.fullNameKor
            }
          </h2>
          <div className="personal-info grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
            <ul className="space-y-1">
              {cv.personalInfo.country && (
                <li><span className="font-medium">{isKorean ? '국적:' : 'Nationality:'}</span> {cv.personalInfo.country}</li>
              )}
              {cv.personalInfo.visaType && (
                <li><span className="font-medium">{isKorean ? '비자 유형:' : 'Visa Type:'}</span> {cv.personalInfo.visaType}</li>
              )}
            </ul>
            <ul className="space-y-1">
              {cv.personalInfo.phone && (
                <li><span className="font-medium">{isKorean ? '전화:' : 'Phone:'}</span> {cv.personalInfo.phone}</li>
              )}
              {cv.personalInfo.email && (
                <li><span className="font-medium">{isKorean ? '이메일:' : 'Email:'}</span> {cv.personalInfo.email}</li>
              )}
            </ul>
            <ul className="space-y-1">
              {cv.personalInfo.address && (
                <li><span className="font-medium">{isKorean ? '주소:' : 'Address:'}</span> {cv.personalInfo.address}</li>
              )}
              {cv.portfolioLinks.length > 0 && (
                <li><span className="font-medium">LinkedIn:</span> {cv.portfolioLinks[0]}</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Personal Summary */}
        {cv.summary && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 border-b-2 border-blue-200 pb-2">
              {isKorean ? '개인 요약' : 'Personal Summary'}
            </h3>
            <p className="text-sm text-gray-600 mt-4">
              {formatText(cv.summary)}
            </p>
          </div>
        )}

        {/* Skills */}
        {cv.skills.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 border-b-2 border-blue-200 pb-2">
              {isKorean ? '기술' : 'Skills'}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {cv.skills.map((skill, index) => (
                <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Work Experience */}
        {cv.experiences.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 border-b-2 border-blue-200 pb-2">
              {isKorean ? '경력 사항' : 'Work Experience'}
            </h3>
            <div className="mt-4 space-y-6">
              {cv.experiences.map((exp) => (
                <div key={exp.id}>
                  <h4 className="text-base font-semibold text-gray-800">{exp.title}</h4>
                  <p className="text-sm text-gray-600">
                    {exp.company} | {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : (isKorean ? '현재' : 'Present')}
                  </p>
                  {exp.description && (
                    <div className="text-sm text-gray-600 mt-2">
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
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 border-b-2 border-blue-200 pb-2">
              {isKorean ? '학력' : 'Education'}
            </h3>
            <div className="mt-4 space-y-4">
              {cv.education.map((edu) => (
                <div key={edu.id}>
                  <h4 className="text-base font-semibold text-gray-800">{edu.degree}</h4>
                  <p className="text-sm text-gray-600">
                    {edu.school} | {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                  </p>
                  {edu.notes && (
                    <p className="text-sm text-gray-600">{formatText(edu.notes)}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {cv.languages.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 border-b-2 border-blue-200 pb-2">
              {isKorean ? '언어' : 'Languages'}
            </h3>
            <div className="languages-grid grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mt-4">
              <ul className="space-y-1">
                {cv.languages.map((lang, index) => (
                  <li key={lang.id}>
                    {lang.language}: {lang.proficiency} {lang.score && `(${lang.score})`}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Certifications */}
        {cv.certifications.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-800 border-b-2 border-blue-200 pb-2">
              {isKorean ? '자격증 및 교육' : 'Certificates & Training'}
            </h3>
            <div className="mt-4 space-y-6">
              {cv.certifications.map((cert) => (
                <div key={cert.id}>
                  <h4 className="text-base font-semibold text-gray-800">{cert.name}</h4>
                  <p className="text-sm text-gray-600">{cert.issuer} | {formatDate(cert.date)}</p>
                  {cert.description && (
                    <p className="text-sm text-gray-600">{formatText(cert.description)}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KoreanTemplate;

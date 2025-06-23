
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Download } from 'lucide-react';
import { CV } from '@/types/cv';
import { loadCV } from '@/utils/cvStorage';
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
              Back to Edit
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">{cv.name} - Preview</h1>
              <p className="text-sm text-slate-500">Review your CV before choosing a template</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate(`/cv/${cv.id}`)}
              variant="outline"
              size="sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              onClick={() => navigate(`/cv/${cv.id}/templates`)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Choose Template
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <div className="space-y-6">
            {/* Personal Info */}
            <div className="border-b pb-4">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {cv.personalInfo.fullNameEng || 'Full Name'}
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                <p>Email: {cv.personalInfo.email}</p>
                <p>Phone: {cv.personalInfo.phone}</p>
                <p>Country: {cv.personalInfo.country}</p>
                <p>Visa: {cv.personalInfo.visaType}</p>
              </div>
            </div>

            {/* Career Summary */}
            {cv.summary && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Career Summary</h3>
                <p className="text-slate-700">{cv.summary}</p>
              </div>
            )}

            {/* Skills */}
            {cv.skills.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {cv.skills.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Work Experience */}
            {cv.experiences.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Work Experience</h3>
                <div className="space-y-3">
                  {cv.experiences.map((exp) => (
                    <div key={exp.id} className="border-l-2 border-blue-200 pl-4">
                      <h4 className="font-medium text-slate-900">{exp.title}</h4>
                      <p className="text-slate-600">{exp.company}</p>
                      <p className="text-sm text-slate-500">{exp.startDate} - {exp.endDate}</p>
                      <p className="text-slate-700 mt-1">{exp.description}</p>
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

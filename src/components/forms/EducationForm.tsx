
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { CV, Education } from '@/types/cv';

interface EducationFormProps {
  cv: CV;
  onChange: (cv: CV) => void;
}

const EducationForm = ({ cv, onChange }: EducationFormProps) => {
  const [education, setEducation] = useState<Education[]>(cv.education);

  const addEducation = () => {
    const newEducation: Education = {
      id: `edu_${Date.now()}`,
      degree: '',
      school: '',
      startDate: '',
      endDate: '',
      notes: ''
    };
    const updatedEducation = [...education, newEducation];
    setEducation(updatedEducation);
    onChange({ ...cv, education: updatedEducation });
  };

  const removeEducation = (id: string) => {
    const updatedEducation = education.filter(edu => edu.id !== id);
    setEducation(updatedEducation);
    onChange({ ...cv, education: updatedEducation });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    const updatedEducation = education.map(edu =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    setEducation(updatedEducation);
    onChange({ ...cv, education: updatedEducation });
  };

  const isKorean = cv.language === 'korean';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {isKorean ? '학력' : 'Education'}
        </h2>
        <p className="text-slate-600">
          {isKorean ? '학력 배경을 추가하세요' : 'Add your educational background'}
        </p>
      </div>

      <div className="space-y-6">
        {education.map((edu) => (
          <div key={edu.id} className="border border-slate-200 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-slate-900">
                {isKorean ? '학력 항목' : 'Education Entry'}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeEducation(edu.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`degree-${edu.id}`}>
                  {isKorean ? '학위' : 'Degree'}
                </Label>
                <Input
                  id={`degree-${edu.id}`}
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  placeholder={isKorean ? '학사' : 'Bachelor of Science'}
                />
              </div>
              <div>
                <Label htmlFor={`school-${edu.id}`}>
                  {isKorean ? '학교/대학교' : 'School/University'}
                </Label>
                <Input
                  id={`school-${edu.id}`}
                  value={edu.school}
                  onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                  placeholder={isKorean ? '서울대학교' : 'Seoul National University'}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`start-date-${edu.id}`}>
                  {isKorean ? '시작 날짜' : 'Start Date'}
                </Label>
                <Input
                  id={`start-date-${edu.id}`}
                  type="date"
                  value={edu.startDate}
                  onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`end-date-${edu.id}`}>
                  {isKorean ? '졸업 날짜' : 'End Date'}
                </Label>
                <Input
                  id={`end-date-${edu.id}`}
                  type="date"
                  value={edu.endDate}
                  onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`notes-${edu.id}`}>
                {isKorean ? '비고/전공 (선택사항)' : 'Notes/Major (Optional)'}
              </Label>
              <Textarea
                id={`notes-${edu.id}`}
                value={edu.notes}
                onChange={(e) => updateEducation(edu.id, 'notes', e.target.value)}
                placeholder={isKorean ? '컴퓨터공학, 평점: 3.8' : 'Computer Science, GPA: 3.8'}
                rows={2}
              />
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addEducation}
          className="w-full border-dashed border-2 border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isKorean ? '학력 추가' : 'Add Education'}
        </Button>
      </div>
    </div>
  );
};

export default EducationForm;

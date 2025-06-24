
import { useState } from 'react';
import { CV } from '@/types/cv';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface SkillsFormProps {
  cv: CV;
  onChange: (updatedCV: CV) => void;
}

const SkillsForm = ({ cv, onChange }: SkillsFormProps) => {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim() && !cv.skills.includes(newSkill.trim())) {
      const updatedCV = {
        ...cv,
        skills: [...cv.skills, newSkill.trim()]
      };
      onChange(updatedCV);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedCV = {
      ...cv,
      skills: cv.skills.filter(skill => skill !== skillToRemove)
    };
    onChange(updatedCV);
  };

  const isKorean = cv.language === 'korean';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {isKorean ? '기술' : 'Skills'}
        </h2>
        <p className="text-slate-600">
          {isKorean 
            ? '목표 직무와 관련된 기술 및 전문 능력을 추가하세요.' 
            : 'Add your technical and professional skills relevant to your target position.'
          }
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="newSkill">
              {isKorean ? '기술 추가' : 'Add a skill'}
            </Label>
            <Input
              id="newSkill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder={isKorean 
                ? "예: JavaScript, 프로젝트 관리, 한국어" 
                : "e.g., JavaScript, Project Management, Korean Language"
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />
          </div>
          <div className="pt-6">
            <Button onClick={addSkill} disabled={!newSkill.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              {isKorean ? '추가' : 'Add'}
            </Button>
          </div>
        </div>

        {cv.skills.length > 0 && (
          <div>
            <Label>{isKorean ? '보유 기술' : 'Your Skills'}</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {cv.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-2 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
        <h3 className="font-medium text-green-900 mb-2">
          {isKorean ? '💡 한국 취업을 위한 기술 제안:' : '💡 Skill suggestions for Korea:'}
        </h3>
        <ul className="text-sm text-green-800 space-y-1">
          {isKorean ? (
            <>
              <li>• 한국어 능력 수준을 포함하세요 (예: "한국어 (비즈니스 레벨)")</li>
              <li>• 기술적 능력과 소프트 스킬 모두 추가하세요</li>
              <li>• 업계별 도구와 기술을 언급하세요</li>
              <li>• 문화 간 의사소통 능력을 포함하세요</li>
            </>
          ) : (
            <>
              <li>• Include Korean language proficiency (e.g., "Korean (Business Level)")</li>
              <li>• Add both technical and soft skills</li>
              <li>• Mention industry-specific tools and technologies</li>
              <li>• Include cross-cultural communication skills</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SkillsForm;

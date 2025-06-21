
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Skills</h2>
        <p className="text-slate-600">Add your technical and professional skills relevant to your target position.</p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="newSkill">Add a skill</Label>
            <Input
              id="newSkill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="e.g., JavaScript, Project Management, Korean Language"
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
              Add
            </Button>
          </div>
        </div>

        {cv.skills.length > 0 && (
          <div>
            <Label>Your Skills</Label>
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
        <h3 className="font-medium text-green-900 mb-2">💡 Skill suggestions for Korea:</h3>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Include Korean language proficiency (e.g., "Korean (Business Level)")</li>
          <li>• Add both technical and soft skills</li>
          <li>• Mention industry-specific tools and technologies</li>
          <li>• Include cross-cultural communication skills</li>
        </ul>
      </div>
    </div>
  );
};

export default SkillsForm;

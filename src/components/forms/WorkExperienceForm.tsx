import { CV, WorkExperience } from '@/types/cv';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Briefcase, ArrowUp, ArrowDown } from 'lucide-react';

interface WorkExperienceFormProps {
  cv: CV;
  onChange: (updatedCV: CV) => void;
}

const WorkExperienceForm = ({ cv, onChange }: WorkExperienceFormProps) => {
  const addExperience = () => {
    const maxOrder = cv.experiences.length > 0 ? Math.max(...cv.experiences.map(exp => exp.order || 0)) : 0;
    const newExperience: WorkExperience = {
      id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      description: '',
      order: maxOrder + 1
    };

    const updatedCV = {
      ...cv,
      experiences: [...cv.experiences, newExperience]
    };
    onChange(updatedCV);
  };

  const updateExperience = (id: string, field: keyof WorkExperience, value: string | number) => {
    const updatedCV = {
      ...cv,
      experiences: cv.experiences.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    };
    onChange(updatedCV);
  };

  const removeExperience = (id: string) => {
    const updatedCV = {
      ...cv,
      experiences: cv.experiences.filter(exp => exp.id !== id)
    };
    onChange(updatedCV);
  };

  const moveExperience = (id: string, direction: 'up' | 'down') => {
    const sortedExperiences = [...cv.experiences].sort((a, b) => (a.order || 0) - (b.order || 0));
    const currentIndex = sortedExperiences.findIndex(exp => exp.id === id);
    
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === sortedExperiences.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const temp = sortedExperiences[currentIndex].order;
    sortedExperiences[currentIndex].order = sortedExperiences[newIndex].order;
    sortedExperiences[newIndex].order = temp;

    const updatedCV = {
      ...cv,
      experiences: cv.experiences.map(exp => {
        const updated = sortedExperiences.find(se => se.id === exp.id);
        return updated || exp;
      })
    };
    onChange(updatedCV);
  };

  const sortedExperiences = [...cv.experiences].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Work Experience</h2>
        <p className="text-slate-600">Add your professional work experience, starting with the most recent position.</p>
      </div>

      <div className="space-y-4">
        {sortedExperiences.map((experience, index) => (
          <Card key={experience.id} className="border-slate-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  Experience {index + 1}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveExperience(experience.id, 'up')}
                    disabled={index === 0}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveExperience(experience.id, 'down')}
                    disabled={index === sortedExperiences.length - 1}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperience(experience.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`title-${experience.id}`}>Job Title</Label>
                  <Input
                    id={`title-${experience.id}`}
                    value={experience.title}
                    onChange={(e) => updateExperience(experience.id, 'title', e.target.value)}
                    placeholder="Software Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`company-${experience.id}`}>Company Name</Label>
                  <Input
                    id={`company-${experience.id}`}
                    value={experience.company}
                    onChange={(e) => updateExperience(experience.id, 'company', e.target.value)}
                    placeholder="Samsung Electronics"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`start-${experience.id}`}>Start Date</Label>
                  <Input
                    id={`start-${experience.id}`}
                    type="date"
                    value={experience.startDate}
                    onChange={(e) => updateExperience(experience.id, 'startDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`end-${experience.id}`}>End Date</Label>
                  <Input
                    id={`end-${experience.id}`}
                    type="date"
                    value={experience.endDate}
                    onChange={(e) => updateExperience(experience.id, 'endDate', e.target.value)}
                    placeholder="Leave blank for current position"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`desc-${experience.id}`}>Job Description</Label>
                <Textarea
                  id={`desc-${experience.id}`}
                  value={experience.description}
                  onChange={(e) => updateExperience(experience.id, 'description', e.target.value)}
                  placeholder="Describe your key responsibilities, achievements, and impact in this role..."
                  className="min-h-[100px] resize-none"
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Button onClick={addExperience} variant="outline" className="w-full border-dashed border-blue-300 text-blue-700 hover:bg-blue-50">
          <Plus className="h-4 w-4 mr-2" />
          Add Work Experience
        </Button>
      </div>

      {cv.experiences.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-slate-300 rounded-lg">
          <Briefcase className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-700 mb-2">No work experience added</h3>
          <p className="text-slate-500 mb-4">Add your professional experience to showcase your career progression</p>
          <Button onClick={addExperience}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Experience
          </Button>
        </div>
      )}
    </div>
  );
};

export default WorkExperienceForm;

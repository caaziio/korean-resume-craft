
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { CV, Language, PROFICIENCY_LEVELS } from '@/types/cv';

interface LanguagesFormProps {
  cv: CV;
  onChange: (cv: CV) => void;
}

const LanguagesForm = ({ cv, onChange }: LanguagesFormProps) => {
  const [languages, setLanguages] = useState<Language[]>(cv.languages);

  const addLanguage = () => {
    const newLanguage: Language = {
      id: `lang_${Date.now()}`,
      language: '',
      proficiency: '',
      score: ''
    };
    const updatedLanguages = [...languages, newLanguage];
    setLanguages(updatedLanguages);
    onChange({ ...cv, languages: updatedLanguages });
  };

  const removeLanguage = (id: string) => {
    const updatedLanguages = languages.filter(lang => lang.id !== id);
    setLanguages(updatedLanguages);
    onChange({ ...cv, languages: updatedLanguages });
  };

  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    const updatedLanguages = languages.map(lang =>
      lang.id === id ? { ...lang, [field]: value } : lang
    );
    setLanguages(updatedLanguages);
    onChange({ ...cv, languages: updatedLanguages });
  };

  const isKorean = cv.language === 'korean';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {isKorean ? '언어' : 'Languages'}
        </h2>
        <p className="text-slate-600">
          {isKorean ? '언어 능력과 숙련도 수준을 추가하세요' : 'Add your language skills and proficiency levels'}
        </p>
      </div>

      <div className="space-y-6">
        {languages.map((lang) => (
          <div key={lang.id} className="border border-slate-200 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-slate-900">
                {isKorean ? '언어' : 'Language'}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeLanguage(lang.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor={`language-${lang.id}`}>
                  {isKorean ? '언어' : 'Language'}
                </Label>
                <Input
                  id={`language-${lang.id}`}
                  value={lang.language}
                  onChange={(e) => updateLanguage(lang.id, 'language', e.target.value)}
                  placeholder={isKorean ? '한국어' : 'Korean'}
                />
              </div>
              <div>
                <Label htmlFor={`proficiency-${lang.id}`}>
                  {isKorean ? '숙련도 수준' : 'Proficiency Level'}
                </Label>
                <Select
                  value={lang.proficiency}
                  onValueChange={(value) => updateLanguage(lang.id, 'proficiency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isKorean ? '수준 선택' : 'Select level'} />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFICIENCY_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`score-${lang.id}`}>
                  {isKorean ? '점수 (선택사항)' : 'Score (Optional)'}
                </Label>
                <Input
                  id={`score-${lang.id}`}
                  value={lang.score}
                  onChange={(e) => updateLanguage(lang.id, 'score', e.target.value)}
                  placeholder="TOPIK 6, TOEIC 900"
                />
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addLanguage}
          className="w-full border-dashed border-2 border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isKorean ? '언어 추가' : 'Add Language'}
        </Button>
      </div>
    </div>
  );
};

export default LanguagesForm;

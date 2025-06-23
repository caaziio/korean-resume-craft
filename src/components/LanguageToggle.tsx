
import { Button } from '@/components/ui/button';
import { CV } from '@/types/cv';

interface LanguageToggleProps {
  cv: CV;
  onChange: (updatedCV: CV) => void;
}

const LanguageToggle = ({ cv, onChange }: LanguageToggleProps) => {
  const toggleLanguage = () => {
    const newLanguage = cv.language === 'english' ? 'korean' : 'english';
    onChange({ ...cv, language: newLanguage });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-600">Language:</span>
      <Button
        onClick={toggleLanguage}
        variant={cv.language === 'english' ? 'default' : 'outline'}
        size="sm"
        className="h-8"
      >
        EN
      </Button>
      <Button
        onClick={toggleLanguage}
        variant={cv.language === 'korean' ? 'default' : 'outline'}
        size="sm"
        className="h-8"
      >
        한국어
      </Button>
    </div>
  );
};

export default LanguageToggle;

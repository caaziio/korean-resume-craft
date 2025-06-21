
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CV, SelfIntroduction } from '@/types/cv';

interface SelfIntroductionFormProps {
  cv: CV;
  onChange: (cv: CV) => void;
}

const SelfIntroductionForm = ({ cv, onChange }: SelfIntroductionFormProps) => {
  const [selfIntro, setSelfIntro] = useState<SelfIntroduction>(cv.selfIntro);

  const updateSelfIntro = (field: keyof SelfIntroduction, value: string) => {
    const updatedSelfIntro = { ...selfIntro, [field]: value };
    setSelfIntro(updatedSelfIntro);
    onChange({ ...cv, selfIntro: updatedSelfIntro });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Self Introduction</h2>
        <p className="text-slate-600">Complete all four sections to create a comprehensive self-introduction</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="intro" className="text-base font-medium">
            Self Introduction <span className="text-red-500">*</span>
          </Label>
          <p className="text-sm text-slate-500 mb-2">Introduce yourself briefly</p>
          <Textarea
            id="intro"
            value={selfIntro.intro}
            onChange={(e) => updateSelfIntro('intro', e.target.value)}
            placeholder="Hello, I am..."
            rows={4}
            className="resize-none"
          />
        </div>

        <div>
          <Label htmlFor="experiences" className="text-base font-medium">
            Experiences <span className="text-red-500">*</span>
          </Label>
          <p className="text-sm text-slate-500 mb-2">Highlight your relevant experiences</p>
          <Textarea
            id="experiences"
            value={selfIntro.experiences}
            onChange={(e) => updateSelfIntro('experiences', e.target.value)}
            placeholder="I have experience in..."
            rows={4}
            className="resize-none"
          />
        </div>

        <div>
          <Label htmlFor="value" className="text-base font-medium">
            Value Proposition <span className="text-red-500">*</span>
          </Label>
          <p className="text-sm text-slate-500 mb-2">What value can you bring to the company?</p>
          <Textarea
            id="value"
            value={selfIntro.value}
            onChange={(e) => updateSelfIntro('value', e.target.value)}
            placeholder="I can contribute to your company by..."
            rows={4}
            className="resize-none"
          />
        </div>

        <div>
          <Label htmlFor="motivation" className="text-base font-medium">
            Motivation <span className="text-red-500">*</span>
          </Label>
          <p className="text-sm text-slate-500 mb-2">Why do you want to work at this company?</p>
          <Textarea
            id="motivation"
            value={selfIntro.motivation}
            onChange={(e) => updateSelfIntro('motivation', e.target.value)}
            placeholder="I am motivated to join this company because..."
            rows={4}
            className="resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default SelfIntroductionForm;

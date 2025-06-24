
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

  const isKorean = cv.language === 'korean';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {isKorean ? '자기소개' : 'Self Introduction'}
        </h2>
        <p className="text-slate-600">
          {isKorean 
            ? '포괄적인 자기소개를 위해 네 섹션을 모두 완성하세요' 
            : 'Complete all four sections to create a comprehensive self-introduction'
          }
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="intro" className="text-base font-medium">
            {isKorean ? '자기소개' : 'Self Introduction'} <span className="text-red-500">*</span>
          </Label>
          <p className="text-sm text-slate-500 mb-2">
            {isKorean ? '자신을 간략하게 소개하세요' : 'Introduce yourself briefly'}
          </p>
          <Textarea
            id="intro"
            value={selfIntro.intro}
            onChange={(e) => updateSelfIntro('intro', e.target.value)}
            placeholder={isKorean ? "안녕하세요, 저는..." : "Hello, I am..."}
            rows={4}
            className="resize-none"
          />
        </div>

        <div>
          <Label htmlFor="experiences" className="text-base font-medium">
            {isKorean ? '경험' : 'Experiences'} <span className="text-red-500">*</span>
          </Label>
          <p className="text-sm text-slate-500 mb-2">
            {isKorean ? '관련 경험을 강조하세요' : 'Highlight your relevant experiences'}
          </p>
          <Textarea
            id="experiences"
            value={selfIntro.experiences}
            onChange={(e) => updateSelfIntro('experiences', e.target.value)}
            placeholder={isKorean ? "저는 다음과 같은 경험이 있습니다..." : "I have experience in..."}
            rows={4}
            className="resize-none"
          />
        </div>

        <div>
          <Label htmlFor="value" className="text-base font-medium">
            {isKorean ? '가치 제안' : 'Value Proposition'} <span className="text-red-500">*</span>
          </Label>
          <p className="text-sm text-slate-500 mb-2">
            {isKorean ? '회사에 어떤 가치를 제공할 수 있나요?' : 'What value can you bring to the company?'}
          </p>
          <Textarea
            id="value"
            value={selfIntro.value}
            onChange={(e) => updateSelfIntro('value', e.target.value)}
            placeholder={isKorean ? "저는 다음과 같은 방식으로 회사에 기여할 수 있습니다..." : "I can contribute to your company by..."}
            rows={4}
            className="resize-none"
          />
        </div>

        <div>
          <Label htmlFor="motivation" className="text-base font-medium">
            {isKorean ? '지원 동기' : 'Motivation'} <span className="text-red-500">*</span>
          </Label>
          <p className="text-sm text-slate-500 mb-2">
            {isKorean ? '왜 이 회사에서 일하고 싶나요?' : 'Why do you want to work at this company?'}
          </p>
          <Textarea
            id="motivation"
            value={selfIntro.motivation}
            onChange={(e) => updateSelfIntro('motivation', e.target.value)}
            placeholder={isKorean ? "저는 다음과 같은 이유로 이 회사에 지원하게 되었습니다..." : "I am motivated to join this company because..."}
            rows={4}
            className="resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default SelfIntroductionForm;

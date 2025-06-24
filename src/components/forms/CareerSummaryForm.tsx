
import { CV } from '@/types/cv';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CareerSummaryFormProps {
  cv: CV;
  onChange: (updatedCV: CV) => void;
}

const CareerSummaryForm = ({ cv, onChange }: CareerSummaryFormProps) => {
  const updateSummary = (value: string) => {
    const updatedCV = {
      ...cv,
      summary: value
    };
    onChange(updatedCV);
  };

  const isKorean = cv.language === 'korean';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {isKorean ? '경력 요약' : 'Career Summary'}
        </h2>
        <p className="text-slate-600">
          {isKorean 
            ? '전문적인 경력과 핵심 강점을 간략하게 작성하세요.' 
            : 'Write a brief overview of your professional background and key strengths.'
          }
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">
          {isKorean ? '전문 요약' : 'Professional Summary'}
        </Label>
        <Textarea
          id="summary"
          value={cv.summary}
          onChange={(e) => updateSummary(e.target.value)}
          placeholder={isKorean 
            ? "웹 개발 분야에서 5년 이상의 경험을 가진 소프트웨어 엔지니어로, React와 Node.js를 전문으로 합니다. 확장 가능한 애플리케이션 제공과 크로스 펑셔널 팀 리딩에 검증된 실적을 보유하고 있습니다..."
            : "Experienced software engineer with 5+ years in web development, specializing in React and Node.js. Proven track record of delivering scalable applications and leading cross-functional teams..."
          }
          className="min-h-[120px] resize-none"
          maxLength={500}
        />
        <div className="flex justify-between text-sm text-slate-500">
          <span>
            {isKorean 
              ? '간결하게 작성하고 가장 관련성 높은 경험을 강조하세요' 
              : 'Keep it concise and highlight your most relevant experience'
            }
          </span>
          <span>{cv.summary.length}/500</span>
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">
          {isKorean ? '💡 훌륭한 경력 요약을 위한 팁:' : '💡 Tips for a great career summary:'}
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          {isKorean ? (
            <>
              <li>• 전문 직책과 경력 연수로 시작하세요</li>
              <li>• 핵심 기술과 전문 분야를 언급하세요</li>
              <li>• 가능하면 구체적인 성과나 지표를 포함하세요</li>
              <li>• 최대 임팩트를 위해 2-3문장으로 유지하세요</li>
            </>
          ) : (
            <>
              <li>• Start with your professional title and years of experience</li>
              <li>• Mention your key skills and areas of expertise</li>
              <li>• Include specific achievements or metrics when possible</li>
              <li>• Keep it to 2-3 sentences for maximum impact</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CareerSummaryForm;

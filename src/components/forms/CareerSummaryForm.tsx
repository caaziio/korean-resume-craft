
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Career Summary</h2>
        <p className="text-slate-600">Write a brief overview of your professional background and key strengths.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea
          id="summary"
          value={cv.summary}
          onChange={(e) => updateSummary(e.target.value)}
          placeholder="Experienced software engineer with 5+ years in web development, specializing in React and Node.js. Proven track record of delivering scalable applications and leading cross-functional teams..."
          className="min-h-[120px] resize-none"
          maxLength={500}
        />
        <div className="flex justify-between text-sm text-slate-500">
          <span>Keep it concise and highlight your most relevant experience</span>
          <span>{cv.summary.length}/500</span>
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">💡 Tips for a great career summary:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Start with your professional title and years of experience</li>
          <li>• Mention your key skills and areas of expertise</li>
          <li>• Include specific achievements or metrics when possible</li>
          <li>• Keep it to 2-3 sentences for maximum impact</li>
        </ul>
      </div>
    </div>
  );
};

export default CareerSummaryForm;

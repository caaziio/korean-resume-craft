
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { CV } from '@/types/cv';

interface PortfolioLinksFormProps {
  cv: CV;
  onChange: (cv: CV) => void;
}

const PortfolioLinksForm = ({ cv, onChange }: PortfolioLinksFormProps) => {
  const [portfolioLinks, setPortfolioLinks] = useState<string[]>(
    cv.portfolioLinks.length > 0 ? cv.portfolioLinks : ['']
  );

  const addLink = () => {
    const updatedLinks = [...portfolioLinks, ''];
    setPortfolioLinks(updatedLinks);
    onChange({ ...cv, portfolioLinks: updatedLinks });
  };

  const removeLink = (index: number) => {
    const updatedLinks = portfolioLinks.filter((_, i) => i !== index);
    setPortfolioLinks(updatedLinks);
    onChange({ ...cv, portfolioLinks: updatedLinks });
  };

  const updateLink = (index: number, value: string) => {
    const updatedLinks = portfolioLinks.map((link, i) =>
      i === index ? value : link
    );
    setPortfolioLinks(updatedLinks);
    onChange({ ...cv, portfolioLinks: updatedLinks });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Portfolio Links</h2>
        <p className="text-slate-600">Add links to your portfolio, LinkedIn, GitHub, or other professional profiles</p>
      </div>

      <div className="space-y-4">
        {portfolioLinks.map((link, index) => (
          <div key={index} className="flex gap-3 items-end">
            <div className="flex-1">
              <Label htmlFor={`link-${index}`}>
                Portfolio Link {index + 1}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id={`link-${index}`}
                  type="url"
                  value={link}
                  onChange={(e) => updateLink(index, e.target.value)}
                  placeholder="https://linkedin.com/in/yourname"
                />
                {link && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(link, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            {portfolioLinks.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeLink(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addLink}
          className="w-full border-dashed border-2 border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Portfolio Link
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Portfolio Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Include your LinkedIn profile URL</li>
          <li>• Add GitHub if you're in tech</li>
          <li>• Link to your personal website or portfolio</li>
          <li>• Include relevant social media (professional only)</li>
        </ul>
      </div>
    </div>
  );
};

export default PortfolioLinksForm;

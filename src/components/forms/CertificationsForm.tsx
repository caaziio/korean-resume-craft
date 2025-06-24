
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { CV, Certification } from '@/types/cv';

interface CertificationsFormProps {
  cv: CV;
  onChange: (cv: CV) => void;
}

const CertificationsForm = ({ cv, onChange }: CertificationsFormProps) => {
  const [certifications, setCertifications] = useState<Certification[]>(cv.certifications);

  const addCertification = () => {
    const newCertification: Certification = {
      id: `cert_${Date.now()}`,
      name: '',
      issuer: '',
      date: '',
      description: ''
    };
    const updatedCertifications = [...certifications, newCertification];
    setCertifications(updatedCertifications);
    onChange({ ...cv, certifications: updatedCertifications });
  };

  const removeCertification = (id: string) => {
    const updatedCertifications = certifications.filter(cert => cert.id !== id);
    setCertifications(updatedCertifications);
    onChange({ ...cv, certifications: updatedCertifications });
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    const updatedCertifications = certifications.map(cert =>
      cert.id === id ? { ...cert, [field]: value } : cert
    );
    setCertifications(updatedCertifications);
    onChange({ ...cv, certifications: updatedCertifications });
  };

  const moveCertification = (index: number, direction: 'up' | 'down') => {
    const newCertifications = [...certifications];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newCertifications.length) {
      [newCertifications[index], newCertifications[targetIndex]] = [newCertifications[targetIndex], newCertifications[index]];
      setCertifications(newCertifications);
      onChange({ ...cv, certifications: newCertifications });
    }
  };

  const isKorean = cv.language === 'korean';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {isKorean ? '자격증' : 'Certifications'}
        </h2>
        <p className="text-slate-600">
          {isKorean ? '전문 자격증과 라이선스를 추가하세요' : 'Add your professional certifications and licenses'}
        </p>
      </div>

      <div className="space-y-6">
        {certifications.map((cert, index) => (
          <div key={cert.id} className="border border-slate-200 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-slate-900">
                {isKorean ? '자격증' : 'Certification'} {index + 1}
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveCertification(index, 'up')}
                  disabled={index === 0}
                  className="text-slate-600 hover:text-slate-900"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveCertification(index, 'down')}
                  disabled={index === certifications.length - 1}
                  className="text-slate-600 hover:text-slate-900"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeCertification(cert.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`name-${cert.id}`}>
                  {isKorean ? '자격증명' : 'Certificate Name'}
                </Label>
                <Input
                  id={`name-${cert.id}`}
                  value={cert.name}
                  onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                  placeholder={isKorean ? 'AWS 솔루션스 아키텍트' : 'AWS Solutions Architect'}
                />
              </div>
              <div>
                <Label htmlFor={`issuer-${cert.id}`}>
                  {isKorean ? '발급 기관' : 'Issuing Organization'}
                </Label>
                <Input
                  id={`issuer-${cert.id}`}
                  value={cert.issuer}
                  onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                  placeholder={isKorean ? '아마존 웹 서비스' : 'Amazon Web Services'}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`date-${cert.id}`}>
                  {isKorean ? '취득 날짜' : 'Date Obtained'}
                </Label>
                <Input
                  id={`date-${cert.id}`}
                  type="date"
                  value={cert.date}
                  onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`description-${cert.id}`}>
                {isKorean ? '설명 (선택사항)' : 'Description (Optional)'}
              </Label>
              <Textarea
                id={`description-${cert.id}`}
                value={cert.description}
                onChange={(e) => updateCertification(cert.id, 'description', e.target.value)}
                placeholder={isKorean ? '자격증에 대한 세부사항...' : 'Details about the certification...'}
                rows={2}
              />
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addCertification}
          className="w-full border-dashed border-2 border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isKorean ? '자격증 추가' : 'Add Certification'}
        </Button>
      </div>
    </div>
  );
};

export default CertificationsForm;

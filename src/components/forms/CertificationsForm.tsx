
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Certifications</h2>
        <p className="text-slate-600">Add your professional certifications and licenses</p>
      </div>

      <div className="space-y-6">
        {certifications.map((cert) => (
          <div key={cert.id} className="border border-slate-200 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-slate-900">Certification</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeCertification(cert.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`name-${cert.id}`}>Certificate Name</Label>
                <Input
                  id={`name-${cert.id}`}
                  value={cert.name}
                  onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                  placeholder="AWS Solutions Architect"
                />
              </div>
              <div>
                <Label htmlFor={`issuer-${cert.id}`}>Issuing Organization</Label>
                <Input
                  id={`issuer-${cert.id}`}
                  value={cert.issuer}
                  onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                  placeholder="Amazon Web Services"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`date-${cert.id}`}>Date Obtained</Label>
                <Input
                  id={`date-${cert.id}`}
                  type="date"
                  value={cert.date}
                  onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`description-${cert.id}`}>Description (Optional)</Label>
              <Textarea
                id={`description-${cert.id}`}
                value={cert.description}
                onChange={(e) => updateCertification(cert.id, 'description', e.target.value)}
                placeholder="Details about the certification..."
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
          Add Certification
        </Button>
      </div>
    </div>
  );
};

export default CertificationsForm;


import { CV, VISA_TYPES } from '@/types/cv';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { useRef } from 'react';

interface PersonalInfoFormProps {
  cv: CV;
  onChange: (updatedCV: CV) => void;
}

const PersonalInfoForm = ({ cv, onChange }: PersonalInfoFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updatePersonalInfo = (field: string, value: string) => {
    const updatedCV = {
      ...cv,
      personalInfo: {
        ...cv.personalInfo,
        [field]: value
      }
    };
    onChange(updatedCV);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoData = e.target?.result as string;
        updatePersonalInfo('photo', photoData);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    updatePersonalInfo('photo', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Personal Information</h2>
        <p className="text-slate-600">Enter your basic personal details as they should appear on your resume.</p>
      </div>

      {/* Photo Upload Section */}
      <div className="space-y-4">
        <Label>Profile Photo</Label>
        <div className="flex items-center gap-4">
          {cv.personalInfo.photo ? (
            <div className="relative">
              <img
                src={cv.personalInfo.photo}
                alt="Profile"
                className="w-24 h-24 object-cover rounded-lg border border-slate-200"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={removePhoto}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
              <Upload className="h-6 w-6 text-slate-400" />
            </div>
          )}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              {cv.personalInfo.photo ? 'Change Photo' : 'Upload Photo'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullNameKor">Full Name (Korean) *</Label>
          <Input
            id="fullNameKor"
            value={cv.personalInfo.fullNameKor}
            onChange={(e) => updatePersonalInfo('fullNameKor', e.target.value)}
            placeholder="한국어 이름"
            className="font-korean"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullNameEng">Full Name (English) *</Label>
          <Input
            id="fullNameEng"
            value={cv.personalInfo.fullNameEng}
            onChange={(e) => updatePersonalInfo('fullNameEng', e.target.value)}
            placeholder="John Smith"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input
            id="dob"
            type="date"
            value={cv.personalInfo.dob}
            onChange={(e) => updatePersonalInfo('dob', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={cv.personalInfo.country}
            onChange={(e) => updatePersonalInfo('country', e.target.value)}
            placeholder="United States"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={cv.personalInfo.phone}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            placeholder="010-1234-5678"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={cv.personalInfo.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            placeholder="john.smith@email.com"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={cv.personalInfo.address}
            onChange={(e) => updatePersonalInfo('address', e.target.value)}
            placeholder="123 Main Street, Gangnam-gu, Seoul, South Korea"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="visaType">Visa Type</Label>
          <Select value={cv.personalInfo.visaType} onValueChange={(value) => updatePersonalInfo('visaType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select visa type" />
            </SelectTrigger>
            <SelectContent>
              {VISA_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {cv.personalInfo.visaType === 'Other' && (
          <div className="space-y-2">
            <Label htmlFor="visaOther">Other Visa Type</Label>
            <Input
              id="visaOther"
              value={cv.personalInfo.visaOther}
              onChange={(e) => updatePersonalInfo('visaOther', e.target.value)}
              placeholder="Please specify your visa type"
            />
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-200">
        <p className="text-sm text-slate-500">
          * Required fields. This information will appear at the top of your resume.
        </p>
      </div>
    </div>
  );
};

export default PersonalInfoForm;

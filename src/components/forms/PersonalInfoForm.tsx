
import { useState } from 'react';
import { CV, VISA_TYPES } from '@/types/cv';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Upload, User } from 'lucide-react';

interface PersonalInfoFormProps {
  cv: CV;
  onChange: (updatedCV: CV) => void;
}

const PersonalInfoForm = ({ cv, onChange }: PersonalInfoFormProps) => {
  const [photoPreview, setPhotoPreview] = useState<string>(cv.personalInfo.photo || '');

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
        const photoUrl = e.target?.result as string;
        setPhotoPreview(photoUrl);
        updatePersonalInfo('photo', photoUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Personal Information</h2>
        <p className="text-slate-600">Enter your basic personal details as they should appear on your resume.</p>
      </div>

      {/* Photo Upload Section */}
      <div className="flex items-center gap-6 p-4 border border-slate-200 rounded-lg bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Avatar className="w-24 h-24">
            <AvatarImage src={photoPreview} alt="Profile photo" />
            <AvatarFallback>
              <User className="w-12 h-12 text-slate-400" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center gap-2">
            <Label htmlFor="photo-upload" className="cursor-pointer">
              <Button type="button" variant="outline" size="sm" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </span>
              </Button>
            </Label>
            <Input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <p className="text-xs text-slate-500 text-center">JPG, PNG up to 10MB</p>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-slate-900 mb-2">Professional Photo</h3>
          <p className="text-sm text-slate-600">
            Upload a professional headshot that will appear on your resume. A clear, well-lit photo with a neutral background works best.
          </p>
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
          <Label htmlFor="dob">Date of Birth / Age</Label>
          <Input
            id="dob"
            value={cv.personalInfo.dob}
            onChange={(e) => updatePersonalInfo('dob', e.target.value)}
            placeholder="1990.01.01 (33세)"
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

        <div className="space-y-2">
          <Label htmlFor="address">Address (District only)</Label>
          <Input
            id="address"
            value={cv.personalInfo.address}
            onChange={(e) => updatePersonalInfo('address', e.target.value)}
            placeholder="Gangnam-gu, Seoul"
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
          <div className="space-y-2 md:col-span-2">
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

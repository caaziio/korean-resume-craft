
import { CV, VISA_TYPES } from '@/types/cv';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Upload, X, Camera, Crop } from 'lucide-react';
import { useRef, useState } from 'react';
import PhotoCropper from '@/components/PhotoCropper';

interface PersonalInfoFormProps {
  cv: CV;
  onChange: (updatedCV: CV) => void;
}

const PersonalInfoForm = ({ cv, onChange }: PersonalInfoFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tempImageSrc, setTempImageSrc] = useState<string>('');
  const [isCropperOpen, setIsCropperOpen] = useState(false);

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
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(isKorean ? '파일 크기는 5MB 미만이어야 합니다' : 'File size should be less than 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert(isKorean ? '이미지 파일을 선택해주세요' : 'Please select an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setTempImageSrc(imageData);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImageData: string) => {
    updatePersonalInfo('photo', croppedImageData);
    setTempImageSrc('');
  };

  const removePhoto = () => {
    updatePersonalInfo('photo', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isKorean = cv.language === 'korean';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {isKorean ? '개인정보' : 'Personal Information'}
        </h2>
        <p className="text-slate-600">
          {isKorean 
            ? '이력서에 표시될 기본 개인정보를 입력하세요.' 
            : 'Enter your basic personal details as they should appear on your resume.'
          }
        </p>
      </div>

      {/* Photo Upload Section */}
      <div className="space-y-4">
        <Label className="text-base font-medium">
          {isKorean ? '프로필 사진' : 'Profile Photo'}
        </Label>
        <div className="flex items-center gap-6">
          {cv.personalInfo.photo ? (
            <div className="relative">
              <img
                src={cv.personalInfo.photo}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-lg border-2 border-slate-200 shadow-sm"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={removePhoto}
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full p-0 shadow-md"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="w-32 h-32 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors">
              <Camera className="h-8 w-8 text-slate-400 mb-2" />
              <span className="text-sm text-slate-500">
                {isKorean ? '사진 없음' : 'No Photo'}
              </span>
            </div>
          )}
          <div className="space-y-3">
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
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {cv.personalInfo.photo 
                ? (isKorean ? '사진 변경' : 'Change Photo')
                : (isKorean ? '사진 업로드' : 'Upload Photo')
              }
            </Button>
            <p className="text-xs text-slate-500">
              {isKorean 
                ? 'JPG, PNG 파일만 업로드 가능 (최대 5MB)'
                : 'JPG, PNG files only (max 5MB)'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullNameKor">
            {isKorean ? '한국어 이름 *' : 'Full Name (Korean) *'}
          </Label>
          <Input
            id="fullNameKor"
            value={cv.personalInfo.fullNameKor}
            onChange={(e) => updatePersonalInfo('fullNameKor', e.target.value)}
            placeholder={isKorean ? '홍길동' : '한국어 이름'}
            className="font-korean"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullNameEng">
            {isKorean ? '영어 이름 *' : 'Full Name (English) *'}
          </Label>
          <Input
            id="fullNameEng"
            value={cv.personalInfo.fullNameEng}
            onChange={(e) => updatePersonalInfo('fullNameEng', e.target.value)}
            placeholder="John Smith"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dob">
            {isKorean ? '나이' : 'Age'}
          </Label>
          <Input
            id="dob"
            type="date"
            value={cv.personalInfo.dob}
            onChange={(e) => updatePersonalInfo('dob', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">
            {isKorean ? '국가' : 'Country'}
          </Label>
          <Input
            id="country"
            value={cv.personalInfo.country}
            onChange={(e) => updatePersonalInfo('country', e.target.value)}
            placeholder={isKorean ? '대한민국' : 'United States'}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            {isKorean ? '전화번호 *' : 'Phone Number *'}
          </Label>
          <Input
            id="phone"
            value={cv.personalInfo.phone}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            placeholder="010-1234-5678"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            {isKorean ? '이메일 *' : 'Email *'}
          </Label>
          <Input
            id="email"
            type="email"
            value={cv.personalInfo.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            placeholder="john.smith@email.com"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">
            {isKorean ? '주소' : 'Address'}
          </Label>
          <Input
            id="address"
            value={cv.personalInfo.address}
            onChange={(e) => updatePersonalInfo('address', e.target.value)}
            placeholder={isKorean ? '서울특별시 강남구 테헤란로 123' : '123 Main Street, Gangnam-gu, Seoul, South Korea'}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="visaType">
            {isKorean ? '비자 유형' : 'Visa Type'}
          </Label>
          <Select value={cv.personalInfo.visaType} onValueChange={(value) => updatePersonalInfo('visaType', value)}>
            <SelectTrigger>
              <SelectValue placeholder={isKorean ? '비자 유형 선택' : 'Select visa type'} />
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
            <Label htmlFor="visaOther">
              {isKorean ? '기타 비자 유형' : 'Other Visa Type'}
            </Label>
            <Input
              id="visaOther"
              value={cv.personalInfo.visaOther}
              onChange={(e) => updatePersonalInfo('visaOther', e.target.value)}
              placeholder={isKorean ? '비자 유형을 입력하세요' : 'Please specify your visa type'}
            />
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-200">
        <p className="text-sm text-slate-500">
          {isKorean 
            ? '* 필수 입력 항목입니다. 이 정보는 이력서 상단에 표시됩니다.'
            : '* Required fields. This information will appear at the top of your resume.'
          }
        </p>
      </div>

      {/* Photo Cropper Dialog */}
      <PhotoCropper
        isOpen={isCropperOpen}
        onClose={() => setIsCropperOpen(false)}
        imageSrc={tempImageSrc}
        onCropComplete={handleCropComplete}
        isKorean={isKorean}
      />
    </div>
  );
};

export default PersonalInfoForm;

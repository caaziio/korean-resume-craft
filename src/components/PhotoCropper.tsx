
import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Crop, X } from 'lucide-react';

interface PhotoCropperProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedImageData: string) => void;
  isKorean?: boolean;
}

const PhotoCropper = ({ isOpen, onClose, imageSrc, onCropComplete, isKorean = false }: PhotoCropperProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cropArea, setCropArea] = useState({ x: 50, y: 50, width: 200, height: 200 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = imageRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - rect.left - cropArea.x,
      y: e.clientY - rect.top - cropArea.y
    });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const newX = Math.max(0, Math.min(e.clientX - rect.left - dragStart.x, rect.width - cropArea.width));
    const newY = Math.max(0, Math.min(e.clientY - rect.top - dragStart.y, rect.height - cropArea.height));
    
    setCropArea(prev => ({ ...prev, x: newX, y: newY }));
  }, [isDragging, dragStart, cropArea.width, cropArea.height]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const cropImage = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = 200;
    canvas.height = 200;

    ctx.drawImage(
      image,
      cropArea.x * scaleX,
      cropArea.y * scaleY,
      cropArea.width * scaleX,
      cropArea.height * scaleY,
      0,
      0,
      200,
      200
    );

    const croppedImageData = canvas.toDataURL('image/jpeg', 0.8);
    onCropComplete(croppedImageData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isKorean ? '사진 자르기' : 'Crop Photo'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative inline-block">
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop preview"
              className="max-w-full max-h-96 object-contain"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
            
            {/* Crop overlay */}
            <div
              className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20 cursor-move"
              style={{
                left: cropArea.x,
                top: cropArea.y,
                width: cropArea.width,
                height: cropArea.height,
              }}
              onMouseDown={handleMouseDown}
            >
              <div className="absolute inset-0 border border-white border-dashed" />
            </div>
          </div>

          <p className="text-sm text-slate-600">
            {isKorean 
              ? '파란색 영역을 드래그하여 자를 부분을 선택하세요'
              : 'Drag the blue area to select the crop region'
            }
          </p>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              {isKorean ? '취소' : 'Cancel'}
            </Button>
            <Button onClick={cropImage} className="bg-blue-600 hover:bg-blue-700">
              <Crop className="h-4 w-4 mr-2" />
              {isKorean ? '자르기' : 'Crop'}
            </Button>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
};

export default PhotoCropper;

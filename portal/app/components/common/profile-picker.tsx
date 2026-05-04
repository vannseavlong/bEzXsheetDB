import { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Image } from 'lucide-react';
import IconAssets from '@/asset/icons/icon-assets';

type Props = {
  image?: string | undefined;
  setImage: (payload: { url: string; file: File }) => void;
};
export default function ProfilePicker({ image, setImage }: Props) {
  const [previewImage, setPreviewImage] = useState<string | undefined>();
  const [, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
        setIsUploading(false);
      };
      setImage({
        url: URL.createObjectURL(file),
        file
      });
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // const handleSave = async () => {
  //   // Here you would implement the actual upload logic to your backend
  //   // For example using a fetch call or a form submission
  //   console.log('Saving profile image:', image);
  //   // Example implementation:
  //   // const response = await fetch('/api/upload-profile-image', {
  //   //   method: 'POST',
  //   //   headers: { 'Content-Type': 'application/json' },
  //   //   body: JSON.stringify({ image })
  //   // })
  // };

  return (
    <div
      onClick={triggerFileInput}
      className="relative size-20 border border-gray-100 rounded-full items-center justify-center flex shadow-sm"
    >
      {previewImage || image ? (
        <Avatar className="size-20">
          <AvatarImage src={previewImage || image} className="object-cover" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ) : (
        <Image className="size-10 text-gray-500" />
      )}
      <div className="absolute bottom-0 right-0 bg-background size-6 rounded-full flex items-center justify-center">
        <IconAssets.Camera />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

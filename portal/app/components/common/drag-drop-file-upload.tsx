import { X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Uploader } from './uploader';

type Props = {
  placeholder?: string;
  value?: string[];
  existingUrls?: string[];
  onChange?: (files: string[]) => void;
  onFilesChange?: (files: File[]) => void;
  onExistingUrlRemoved?: (remaining: string[]) => void;
  className?: string;
};

export default function DragDropFileUpload({
  placeholder,
  value,
  existingUrls,
  onChange,
  onFilesChange,
  onExistingUrlRemoved,
  className
}: Props) {
  const [imgs, setImgs] = useState<File[]>([]);
  const [urlImgs, setUrlImgs] = useState<string[]>(existingUrls ?? []);
  const [uploaderKey, setUploaderKey] = useState(0);
  const previewUrls = useMemo(() => imgs.map((file) => URL.createObjectURL(file)), [imgs]);
  const prevExistingUrlsKey = useRef('');

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  useEffect(() => {
    if (value && value.length === 0 && imgs.length > 0) {
      setImgs([]);
      setUploaderKey((prev) => prev + 1);
    }
  }, [value, imgs.length]);

  // Sync urlImgs only when existingUrls content actually changes (avoids resetting on every render)
  useEffect(() => {
    const key = (existingUrls ?? []).join('\x00');
    if (key !== prevExistingUrlsKey.current) {
      prevExistingUrlsKey.current = key;
      setUrlImgs(existingUrls ?? []);
    }
  }, [existingUrls]);

  const handleFilesChange = (files: File[]) => {
    setImgs(files);
    onFilesChange?.(files);
    onChange?.(files.map((file) => file.name));
  };

  const handleRemove = (index: number) => {
    const updated = imgs.filter((_, i) => i !== index);
    setImgs(updated);
    onFilesChange?.(updated);
    onChange?.(updated.map((file) => file.name));
    setUploaderKey((prev) => prev + 1);
  };

  const handleRemoveUrl = (index: number) => {
    const remaining = urlImgs.filter((_, i) => i !== index);
    setUrlImgs(remaining);
    onExistingUrlRemoved?.(remaining);
  };

  const hasImages = imgs.length > 0 || urlImgs.length > 0;

  return (
    <div className={className || 'flex flex-col gap-2'}>
      <span>{placeholder}</span>
      {hasImages && (
        <div className="grid grid-cols-5 gap-4">
          {urlImgs.map((src, index) => (
            <Image key={`url-${index}`} src={src} onRemove={() => handleRemoveUrl(index)} />
          ))}
          {previewUrls.map((src, index) => (
            <Image
              key={`${imgs[index]?.name}-${index}`}
              src={src}
              onRemove={() => handleRemove(index)}
            />
          ))}
        </div>
      )}
      <Uploader
        key={uploaderKey}
        className="w-full h-36 border border-dashed border-border space-y-2 rounded-sm"
        onUploaded={handleFilesChange}
      >
        <p className="text-sm font-semibold text-primary">Select a file or drag and drop here</p>
        <p className="text-sm text-muted-foreground">
          JPG, PNG or PDF, file size no more than 10MB
        </p>
      </Uploader>
    </div>
  );
}

const Image = ({ src, onRemove }: { src: string; onRemove: () => void }) => {
  return (
    <div className="relative bg-gray-100 rounded-lg overflow-hidden shadow-sm aspect-square">
      <img src={src} alt={src} className="object-cover w-full h-full rounded-sm" />
      <div
        className="absolute top-2 right-2 cursor-pointer z-10 bg-white/30 rounded-full size-8 items-center flex justify-center"
        onClick={onRemove}
      >
        <X className="text-destructive" />
      </div>
    </div>
  );
};

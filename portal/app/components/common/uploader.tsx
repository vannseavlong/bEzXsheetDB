import clsx from 'clsx';
import { Upload } from 'lucide-react';
import { useState, useRef, type ChangeEvent, type DragEvent } from 'react';

export const Uploader = ({
  onUploaded,
  multiple = true,
  className,
  children,
  file,
  disabled
}: {
  onUploaded: (files: File[]) => void; // 👈 now returns File[]
  multiple?: boolean;
  className?: string;
  children?: React.ReactNode;
  file?: File;
  disabled?: boolean;
}) => {
  const [dragging, setDragging] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: FileList) => {
    const validFiles: File[] = [];

    Array.from(files).forEach((file: File) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} exceeds the 10MB limit.`);
        return;
      }
      if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
        alert(`File ${file.name} is not a JPG, PNG, or PDF.`);
        return;
      }

      console.log('Selected file:', file.name, 'Type:', file.type, 'Size:', file.size);

      validFiles.push(file);
    });

    // merge or replace based on multiple
    const updatedFiles = multiple ? [...uploadedFiles, ...validFiles] : validFiles;

    setUploadedFiles(updatedFiles);
    onUploaded(updatedFiles); // 👈 return File[]

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={clsx(
        'border-dashed rounded-lg text-center cursor-pointer flex flex-col justify-center items-center transition-all duration-200 ease-in-out',
        {
          'border-blue-500 bg-blue-50': dragging,
          'border-gray-300 bg-gray-50': !dragging
        },
        className
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={disabled ? undefined : handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileInputChange}
        accept=".jpg,.jpeg,.png,.pdf"
        multiple={multiple} // 👈 respect prop
      />
      {!file && <Upload className="text-gray-400" />}
      {children}
    </div>
  );
};

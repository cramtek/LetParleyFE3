import { useEffect, useRef, useState } from 'react';
import { uploadImage } from '../../services/fileService';
import { useToastStore } from '../../store/toastStore';

interface ImageUploaderProps {
  label: string;
  name: string;
  value: string;
  onChange: (url: string) => void;
}

const ImageUploader = ({ label, name, value, onChange }: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(value);
  const { addToast } = useToastStore();

  useEffect(() => {
    setPreview(value);
  }, [value]);

  const handleFiles = async (files: FileList | null) => {
    const file = files && files[0];
    if (!file) return;

    try {
      const result = await uploadImage(file);
      if (!result.file_url) throw new Error(result.message || 'Upload failed');
      setPreview(result.file_url);
      onChange(result.file_url);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error al subir imagen';
      addToast({ type: 'error', message: msg });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={name}>
        {label}
      </label>
      {preview && <img src={preview} alt="Preview" className="mb-2 h-16 w-auto rounded" />}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="w-full px-3 py-6 border-2 border-dashed border-gray-300 rounded-md text-center cursor-pointer"
      >
        <p className="text-sm text-gray-500">Arrastra una imagen o haz clic para seleccionar</p>
        <input
          id={name}
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    </div>
  );
};

export default ImageUploader;

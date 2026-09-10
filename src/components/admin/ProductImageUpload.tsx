import { useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import * as adminShopApi from '@/lib/api/adminShop.api';
import { getApiErrorMessage } from '@/lib/api/client';

export interface ProductImageValue {
  url: string;
  publicId: string;
}

interface PendingUpload {
  id: string;
  previewUrl: string;
  progress: number;
}

const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
// Keep in sync with MAX_IMAGE_SIZE_BYTES in server/src/middlewares/upload.ts (kept under
// Vercel's hard 4.5MB serverless function request-body limit).
const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024;

interface ProductImageUploadProps {
  value: ProductImageValue[];
  onChange: (images: ProductImageValue[]) => void;
  disabled?: boolean;
}

const ProductImageUpload = ({ value, onChange, disabled }: ProductImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  // Only images uploaded *this session* get deleted immediately on remove — an image that was
  // already part of the saved product is left alone here; product.service.ts diffs and cleans
  // those up on save instead, so cancelling the whole dialog never deletes a still-saved image.
  const sessionUploadedPublicIds = useRef<Set<string>>(new Set());
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const uploadOne = (file: File) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const previewUrl = URL.createObjectURL(file);
    setPending((prev) => [...prev, { id, previewUrl, progress: 0 }]);

    adminShopApi
      .uploadProductImage(file, (percent) => {
        setPending((prev) => prev.map((p) => (p.id === id ? { ...p, progress: percent } : p)));
      })
      .then((uploaded) => {
        sessionUploadedPublicIds.current.add(uploaded.publicId);
        onChange([...value, uploaded]);
      })
      .catch((err) => {
        toast.error(getApiErrorMessage(err, `Could not upload ${file.name}`));
      })
      .finally(() => {
        setPending((prev) => prev.filter((p) => p.id !== id));
        URL.revokeObjectURL(previewUrl);
      });
  };

  const handleFiles = (files: FileList | File[]) => {
    Array.from(files).forEach((file) => {
      if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
        toast.error(`${file.name}: only JPG, PNG, and WebP images are allowed.`);
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error(`${file.name}: image must be smaller than 4MB.`);
        return;
      }
      uploadOne(file);
    });
  };

  const handleRemove = (index: number) => {
    const image = value[index];
    onChange(value.filter((_, i) => i !== index));
    if (sessionUploadedPublicIds.current.has(image.publicId)) {
      sessionUploadedPublicIds.current.delete(image.publicId);
      adminShopApi.deleteProductImage(image.publicId).catch(() => {
        /* best-effort cleanup only */
      });
    }
  };

  return (
    <div>
      <div
        className={`flex flex-wrap gap-3 rounded-xl border p-3 transition-colors ${
          isDragging ? 'border-[#1a3d1a]/40 bg-[#F7FFF8]' : 'border-[#1a3d1a]/15'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (!disabled && e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
        }}
      >
        {value.map((image, index) => (
          <div
            key={image.publicId || image.url}
            className="group relative w-20 h-20 rounded-xl overflow-hidden border border-[#1a3d1a]/[0.08] bg-[#F7FFF8] flex-shrink-0"
          >
            <img src={image.url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              disabled={disabled}
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity disabled:opacity-0"
              aria-label="Remove image"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {pending.map((p) => (
          <div
            key={p.id}
            className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#1a3d1a]/[0.08] bg-[#F7FFF8] flex-shrink-0"
          >
            <img src={p.previewUrl} alt="" className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/30 text-[10px] text-white">
              <Loader2 className="w-4 h-4 animate-spin" />
              {p.progress > 0 && <span>{p.progress}%</span>}
            </div>
          </div>
        ))}

        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="flex w-20 h-20 flex-shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#1a3d1a]/20 text-[#1a3d1a]/50 transition-colors hover:border-[#1a3d1a]/40 hover:bg-[#F7FFF8] hover:text-[#1a3d1a] disabled:opacity-50"
        >
          <ImagePlus className="w-5 h-5" />
          <span className="text-[10px]">Add Image</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files);
          e.target.value = '';
        }}
      />

      <p className="mt-1.5 text-xs text-[#1a3d1a]/40">JPG, PNG, or WebP. Max 4MB each.</p>
    </div>
  );
};

export default ProductImageUpload;

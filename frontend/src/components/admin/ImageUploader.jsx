import { useRef, useState } from 'react';
import { uploadService } from '../../services/uploadService.js';

export default function ImageUploader({ images, folder, label, multiple = false, onUploaded, onRemove }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setUploading(true);
    setError('');
    try {
      const { images: uploaded } = await uploadService.upload(files, folder);
      onUploaded(multiple ? uploaded : uploaded.slice(0, 1));
    } catch (uploadError) {
      setError(uploadError?.response?.data?.message || 'Image upload failed. Check the Cloudinary configuration and try again.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-dashed border-graphite/20 p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-body text-sm font-medium text-char">{label}</p>
          <p className="mt-0.5 font-mono text-[11px] text-char/50">JPG, PNG, WebP or GIF · up to 5 MB each</p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-full border border-graphite/15 px-3.5 py-2 font-mono text-xs text-char transition-colors hover:border-char disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? 'Uploading…' : 'Choose files'}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        multiple={multiple}
        className="sr-only"
        onChange={handleChange}
      />

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((url) => (
            <div key={url} className="group relative aspect-square overflow-hidden rounded-lg bg-graphite/5">
              <img src={url} alt="Selected upload" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onRemove(url)}
                className="absolute right-1 top-1 rounded-full bg-graphite/80 px-2 py-1 font-mono text-[10px] text-chalk opacity-100 transition-opacity focus:opacity-100 md:opacity-0 md:group-hover:opacity-100"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="font-mono text-xs text-ember">{error}</p>}
    </div>
  );
}

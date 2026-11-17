import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface VenueImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function VenueImage({ src, alt, className = '', fallbackTitle }: VenueImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-[#1C1E1B] via-[#26231D] to-[#141513] text-[#FAF8F5] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-10 h-10 rounded-full border border-[#C8A86B]/40 flex items-center justify-center mb-3">
          <Sparkles className="w-5 h-5 text-[#C8A86B]" aria-hidden="true" />
        </div>
        <p className="font-editorial text-lg tracking-wide text-[#FAF8F5]">
          {fallbackTitle || 'Al Razzaq Royal Marquee'}
        </p>
        <p className="text-xs text-[#FAF8F5]/65 mt-1">Pasrur Rd · Daska, Pakistan</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
}

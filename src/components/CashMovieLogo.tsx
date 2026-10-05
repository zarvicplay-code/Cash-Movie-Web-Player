import React, { useState, useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';

interface CashMovieLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  lightMode?: boolean;
  enableUploadOnClick?: boolean;
}

const STORAGE_KEY = 'cash_movie_custom_logo';
const EVENT_NAME = 'cash_movie_logo_changed';

export const setCustomLogo = (dataUrl: string | null) => {
  if (dataUrl) {
    localStorage.setItem(STORAGE_KEY, dataUrl);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: dataUrl }));
};

export const getCustomLogo = (): string | null => {
  return localStorage.getItem(STORAGE_KEY);
};

export const CashMovieLogo: React.FC<CashMovieLogoProps> = ({
  className = '',
  size = 'md',
  lightMode = false,
  enableUploadOnClick = true,
}) => {
  const [customLogo, setCustomLogoState] = useState<string | null>(() => getCustomLogo());
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setCustomLogoState(getCustomLogo());
    };
    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCustomLogo(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const heights = {
    sm: 'h-6 sm:h-7',
    md: 'h-8 sm:h-10',
    lg: 'h-11 sm:h-14',
    xl: 'h-16 sm:h-20',
  };

  const handleContainerClick = () => {
    if (enableUploadOnClick && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div 
      onClick={enableUploadOnClick ? handleContainerClick : undefined}
      title={enableUploadOnClick ? 'Clique para trocar a logo' : 'Cash Movie'}
      className={`relative group flex items-center select-none ${heights[size]} ${enableUploadOnClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Hidden file picker for direct upload */}
      {enableUploadOnClick && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />
      )}

      {/* Render Custom Uploaded Logo Image */}
      {customLogo ? (
        <div className="relative h-full flex items-center">
          <img
            src={customLogo}
            alt="Cash Movie"
            className="h-full w-auto max-h-full object-contain drop-shadow-md"
          />
          {enableUploadOnClick && (
            <div className="absolute inset-0 bg-black/40 rounded opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-mono">
              <Camera className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      ) : (
        /* Default Cash Movie SVG Vector Logo */
        <div className="relative h-full flex items-center">
          <svg 
            viewBox="0 0 800 160" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-auto drop-shadow-md"
          >
            <defs>
              <filter id="logoGlow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.7"/>
              </filter>
            </defs>

            <g filter="url(#logoGlow)">
              {/* CASH (White) */}
              <g fill="#ffffff">
                <path d="M 124 50 C 112 36, 94 28, 72 28 C 38 28, 14 52, 14 80 C 14 108, 38 132, 72 132 C 94 132, 112 124, 124 110 L 110 98 C 101 108, 88 116, 72 116 C 48 116, 30 99, 30 80 C 30 61, 48 44, 72 44 C 88 44, 101 52, 110 62 Z"/>
                <path d="M 166 28 L 128 132 L 146 132 L 156 103 L 194 103 L 204 132 L 222 132 L 184 28 Z M 175 48 L 189 90 L 161 90 Z"/>
                <path d="M 280 52 C 274 37, 258 28, 236 28 C 214 28, 200 40, 200 56 C 200 72, 214 80, 236 84 L 258 88 C 275 92, 284 99, 284 109 C 284 122, 266 132, 241 132 C 218 132, 203 121, 197 108 L 213 101 C 217 110, 227 117, 241 117 C 255 117, 267 110, 267 101 C 267 88, 254 82, 234 78 L 212 74 C 196 70, 185 62, 185 48 C 185 34, 201 28, 224 28 C 246 28, 264 36, 270 48 Z"/>
                <path d="M 294 28 L 311 28 L 311 72 L 351 72 L 351 28 L 368 28 L 368 132 L 351 132 L 351 88 L 311 88 L 311 132 L 294 132 Z"/>
              </g>

              {/* MOVIE (Crimson Red) */}
              <g fill="#B81419">
                <path d="M 377 28 L 403 28 L 421 88 L 439 28 L 465 28 L 465 132 L 448 132 L 448 57 L 428 122 L 414 122 L 394 57 L 394 132 L 377 132 Z"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M 524 28 C 553 28, 576 51, 576 80 C 576 109, 553 132, 524 132 C 495 132, 472 109, 472 80 C 472 51, 495 28, 524 28 Z M 524 45 C 505 45, 489 61, 489 80 C 489 99, 505 115, 524 115 C 543 115, 559 99, 559 80 C 559 61, 543 45, 524 45 Z"/>
                <path d="M 584 28 L 602 28 L 625 106 L 648 28 L 666 28 L 634 132 L 616 132 Z"/>
                <path d="M 674 28 L 692 28 L 692 132 L 674 132 Z"/>
                <path d="M 700 28 L 748 28 L 748 45 L 718 45 L 718 72 L 744 72 L 744 88 L 718 88 L 718 115 L 748 115 L 748 132 L 700 132 Z"/>
              </g>

              {/* WHITE PLAY TRIANGLE (▶) */}
              <polygon points="514,59 514,101 547,80" fill="#ffffff"/>
            </g>
          </svg>
          {enableUploadOnClick && (
            <div className="absolute inset-0 bg-black/40 rounded opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-mono gap-1">
              <Camera className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden sm:inline">Trocar logo</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

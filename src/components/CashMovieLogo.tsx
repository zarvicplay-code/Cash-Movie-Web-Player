import React from 'react';

interface CashMovieLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  lightMode?: boolean;
}

export const setCustomLogo = (_dataUrl: string | null) => {};
export const getCustomLogo = (): string | null => null;

export const CashMovieLogo: React.FC<CashMovieLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const heights = {
    sm: 'h-6 sm:h-7',
    md: 'h-8 sm:h-10',
    lg: 'h-10 sm:h-12',
    xl: 'h-14 sm:h-18',
  };

  return (
    <div 
      title="Cash Movie"
      className={`relative flex items-center select-none ${heights[size]} ${className}`}
    >
      <picture className="h-full flex items-center">
        <source srcSet="/cash-logo.webp" type="image/webp" />
        <img
          src="/cash-logo.png"
          alt="Cash Movie"
          className="h-full w-auto max-h-full object-contain drop-shadow-md select-none pointer-events-none"
          loading="eager"
          decoding="async"
        />
      </picture>
    </div>
  );
};

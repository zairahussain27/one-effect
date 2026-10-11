import React from 'react';
import { motion } from 'framer-motion';

interface ImagePreviewProps {
  imageSrc: string;
  altText?: string;
  onRemove?: () => void;
  className?: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageSrc,
  altText = 'Uploaded environmental item',
  onRemove,
  className = ''
}) => {
  return (
    <div className={`img-preview-container ${className}`}>
      <div className="img-frame">
        <img src={imageSrc} alt={altText} className="preview-img" />
      </div>
      {onRemove && (
        <button
          type="button"
          className="link btn-change-img"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          Change image
        </button>
      )}
    </div>
  );
};

export default ImagePreview;

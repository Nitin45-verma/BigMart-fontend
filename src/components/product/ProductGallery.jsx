import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';

const ProductGallery = ({ images = [], productName }) => {
  const fallbackImage = 'https://via.placeholder.com/600x600?text=No+Image';
  const primaryIndex = images.findIndex(img => img.isPrimary);
  const initialIndex = primaryIndex !== -1 ? primaryIndex : 0;
  
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const displayImages = images.length > 0 ? images : [{ url: fallbackImage, isPrimary: true }];

  const currentImage = displayImages[currentIndex]?.url || fallbackImage;

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
    setImageError(false);
  };

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
    setImageError(false);
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails (Left on desktop, bottom on mobile) */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:w-24 scrollbar-hide py-1">
        {displayImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentIndex(idx);
              setImageError(false);
            }}
            className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-md border-2 overflow-hidden ${
              currentIndex === idx ? 'border-primary-600' : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <img 
              src={img.url} 
              alt={`${productName} thumbnail ${idx + 1}`} 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = fallbackImage; }}
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 relative aspect-w-1 aspect-h-1 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
        <img
          src={imageError ? fallbackImage : currentImage}
          alt={productName}
          className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-contain cursor-zoom-in p-4"
          onClick={() => setLightboxOpen(true)}
          onError={() => setImageError(true)}
        />
        
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow text-gray-800 hover:bg-white focus:outline-none"
              aria-label="Previous image"
            >
              <FiChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow text-gray-800 hover:bg-white focus:outline-none"
              aria-label="Next image"
            >
              <FiChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 text-white hover:text-gray-300 focus:outline-none"
            aria-label="Close fullscreen"
          >
            <FiX size={32} />
          </button>
          
          <img
            src={imageError ? fallbackImage : currentImage}
            alt={productName}
            className="max-h-[90vh] max-w-full object-contain"
          />
          
          {displayImages.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/75 focus:outline-none"
                aria-label="Previous image"
              >
                <FiChevronLeft size={32} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/75 focus:outline-none"
                aria-label="Next image"
              >
                <FiChevronRight size={32} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;

import React, { useState, useEffect } from 'react';
import { resolveFoodImage, BRANDED_FALLBACK_SVG } from '../utils/imageResolver';

/**
 * Reusable FoodImage component with automatic dish-specific resolution
 * and resilient error fallback handling.
 */
export default function FoodImage({
  item,
  alt = 'Food presentation',
  style = {},
  className = '',
  loading = 'lazy'
}) {
  const targetSrc = resolveFoodImage(item);
  const [src, setSrc] = useState(targetSrc);
  const [hasError, setHasError] = useState(false);

  // Sync if item changes
  useEffect(() => {
    setSrc(resolveFoodImage(item));
    setHasError(false);
  }, [item?.id, item?.name, item?.category]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setSrc(BRANDED_FALLBACK_SVG);
    }
  };

  return (
    <img
      src={src}
      alt={alt}
      onError={handleError}
      loading={loading}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
        backgroundColor: 'var(--bg-subtle)',
        ...style
      }}
    />
  );
}

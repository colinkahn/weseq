import React, { useEffect, useRef } from 'react';
import './Led.css';

export interface LedProps {
  isOn?: boolean;
  size?: number;
  onColor?: string;
  offColor?: string;
  intensity?: number;
  className?: string;
}

const Led: React.FC<LedProps> = ({
  isOn = false,
  size = 12,
  onColor = '#ff0000',
  offColor = '#3a0000',
  intensity = 1,
  className = '',
}) => {
  const ledRef = useRef<HTMLDivElement>(null);

  // Update CSS custom properties
  useEffect(() => {
    if (ledRef.current) {
      ledRef.current.style.setProperty('--led-size', `${size}px`);
      ledRef.current.style.setProperty('--led-on-color', onColor);
      ledRef.current.style.setProperty('--led-off-color', offColor);
      ledRef.current.style.setProperty('--led-intensity', intensity.toString());
    }
  }, [size, onColor, offColor, intensity]);

  return (
    <div
      ref={ledRef}
      className={`Led-root ${isOn ? 'is-on' : ''} ${className}`}
    />
  );
};

export default React.memo(Led);

import React, { useEffect, useRef, useState } from 'react';
import debounce from 'lodash/debounce';
import './Slider.css';

export interface SliderProps {
  value: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  width?: number;
  height?: number;
  handleWidth?: number;
  handleHeight?: number;
  trackWidth?: number;
  className?: string;
  debounceMs?: number;
}

const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  width = 40,
  height = 200,
  handleWidth = 32,
  handleHeight = 16,
  trackWidth = 5,
  className = '',
  debounceMs = 100,
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startValue, setStartValue] = useState(value);
  const [localValue, setLocalValue] = useState(value);

  // Create a debounced version of onChange
  const debouncedOnChange = useRef(
    debounce((newValue: number) => {
      onChange?.(newValue);
    }, debounceMs)
  ).current;

  // Update local value when controlled value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Update CSS variables
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.setProperty('--slider-width', `${width}px`);
      sliderRef.current.style.setProperty('--slider-height', `${height}px`);
      sliderRef.current.style.setProperty('--slider-handle-width', `${handleWidth}px`);
      sliderRef.current.style.setProperty('--slider-handle-height', `${handleHeight}px`);
      sliderRef.current.style.setProperty('--slider-track-width', `${trackWidth}px`);
      sliderRef.current.style.setProperty(
        '--slider-value',
        `${(localValue - min) / (max - min)}`
      );
    }
  }, [width, height, handleWidth, handleHeight, trackWidth, localValue, min, max]);

  // Handle drag events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const availableHeight = rect.height - handleHeight;
      const deltaY = startY - e.clientY;
      const deltaValue = (deltaY / availableHeight) * (max - min);

      const newValue = Math.round(
        Math.min(max, Math.max(min, startValue + deltaValue))
      );

      setLocalValue(newValue);  // Update visual immediately
      debouncedOnChange(newValue);  // Debounce the callback
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startY, startValue, min, max, handleHeight, debouncedOnChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartValue(localValue);
  };

  return (
    <div
      ref={sliderRef}
      className={`Slider-root ${className}`}
    >
      <div className="Slider-track" />
      <div
        className={`Slider-handle ${isDragging ? 'is-dragging' : ''}`}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

export default React.memo(Slider);

import React, { useEffect, useRef, useState } from 'react';
import debounce from 'lodash/debounce';
import './Knob.css';

export interface KnobProps {
  value: number;
  min?: number;
  max?: number;
  size?: number;
  onChange?: (value: number) => void;
  className?: string;
  debounceMs?: number;
}

const Knob: React.FC<KnobProps> = ({
  value,
  min = 0,
  max = 100,
  size = 32,
  onChange,
  className = '',
  debounceMs = 100,
}) => {
  const knobRef = useRef<HTMLDivElement>(null);
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

  // Calculate rotation based on value
  const getRotation = (val: number): number => {
    const range = max - min;
    const percentage = (val - min) / range;
    return -135 + (percentage * 270);
  };

  // Calculate value based on Y movement
  const getValueFromDrag = (currentY: number): number => {
    const sensitivity = 200; // Pixels per full range
    const delta = (startY - currentY) / sensitivity;
    const range = max - min;
    let newValue = startValue + (delta * range);

    // Constrain to min/max
    return Math.min(max, Math.max(min, Math.round(newValue)));
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();

      const newValue = getValueFromDrag(e.clientY);
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
  }, [isDragging, startY, startValue, min, max, debouncedOnChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartValue(localValue);
  };

  // Update CSS custom properties
  useEffect(() => {
    if (knobRef.current) {
      knobRef.current.style.setProperty('--knob-size', `${size}px`);
      knobRef.current.style.setProperty('--knob-rotation', `${getRotation(localValue)}deg`);
    }
  }, [size, localValue]);

  return (
    <div
      ref={knobRef}
      className={`Knob-root ${className} ${isDragging ? 'is-dragging' : ''}`}
      onMouseDown={handleMouseDown}
    />
  );
};

export default React.memo(Knob);

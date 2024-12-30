import { useState, useEffect, useRef, useCallback } from 'react';

const useClock = (bpm = 120, division = '1/4') => {
  const [counter, setCounter] = useState(0);
  const animationFrameId = useRef<number>(null);
  const startTimeRef = useRef<number>(null);

  // Convert division string to decimal (e.g., '1/4' -> 0.25)
  const getDivisionValue = useCallback((divStr: string) => {
    const [num, denom] = divStr.split('/').map(Number);
    return num / denom;
  }, []);

  // Calculate interval in milliseconds based on BPM and division
  const getIntervalMs = useCallback((bpm: number, divStr: string) => {
    const minuteToMs = 60 * 1000;
    const divValue = getDivisionValue(divStr);
    return (minuteToMs / bpm) * divValue;
  }, [getDivisionValue]);

  useEffect(() => {
    if (!['1/32', '1/16', '1/8', '1/4'].includes(division)) {
      console.error('Invalid division. Must be one of: 1/32, 1/16, 1/8, 1/4');
      return;
    }

    const intervalMs = getIntervalMs(bpm, division);

    const tick = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const ticks = Math.floor(elapsed / intervalMs);

      if (ticks !== counter) {
        setCounter(ticks);
      }

      animationFrameId.current = requestAnimationFrame(tick);
    };

    animationFrameId.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [bpm, division, counter, getIntervalMs]);

  const reset = useCallback(() => {
    startTimeRef.current = null;
    setCounter(0);
  }, []);

  return { counter, reset };
};

export default useClock;

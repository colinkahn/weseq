import { useState, useEffect, useCallback } from 'react';

const useSteps = (clockCounter: number, steps = 16) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const stepNumber = clockCounter % steps;
    setCurrentStep(stepNumber);
  }, [clockCounter, steps]);

  const reset = useCallback(() => {
    setCurrentStep(0);
  }, []);

  return { currentStep, reset };
};

export default useSteps;

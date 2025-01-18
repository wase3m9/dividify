import { useState, useEffect, useCallback } from 'react';

export const useTypewriter = (text: string, speed: number = 50): [string, () => void] => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const resetAnimation = useCallback(() => {
    setDisplayText('');
    setCurrentIndex(0);
  }, []);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return [displayText, resetAnimation];
};
import { useEffect, useState } from 'react';

type LoadResult = {
  src: string;
  status: 'loaded' | 'error';
};

export const useLoaded = (src: string | undefined) => {
  const [result, setResult] = useState<LoadResult | null>(null);

  useEffect(() => {
    if (!src) return;

    let effectActive = true;
    const image = new Image();

    image.onload = () => {
      if (!effectActive) {
        return;
      }
      setResult({ src, status: 'loaded' });
    };

    image.onerror = () => {
      if (!effectActive) {
        return;
      }
      setResult({ src, status: 'error' });
    };

    image.src = src;

    return () => {
      effectActive = false;
    };
  }, [src]);

  return result && result.src === src ? result.status : false;
};

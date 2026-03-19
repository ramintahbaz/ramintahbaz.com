'use client';

import { useState, useLayoutEffect, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSplash } from '@/contexts/SplashContext';

const NeuralPortfolio = dynamic(() => import('@/components/NeuralPortfolio'), {
  ssr: false,
  loading: () => null,
});

export default function NeuralPortfolioLayer() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { splashDone } = useSplash();
  const showNeural = pathname === '/';
  const isSplashMode = pathname === '/' && !splashDone;
  const [pastFirstFrame, setPastFirstFrame] = useState(false);
  const [canInitThree, setCanInitThree] = useState(false);

  useLayoutEffect(() => {
    setPastFirstFrame(true);
  }, []);

  useEffect(() => {
    if (!splashDone) {
      setCanInitThree(false);
      return;
    }
    const id = window.setTimeout(() => setCanInitThree(true), 500);
    return () => clearTimeout(id);
  }, [splashDone]);

  const showLayer = showNeural && (!isSplashMode || pastFirstFrame);
  const isExplicitNeuralView = searchParams.get('view') === 'neural';
  const splashMode = pathname === '/' && !splashDone;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: showLayer && isExplicitNeuralView ? 2 : 0,
        display: showLayer ? 'block' : 'none',
      }}
    >
      {canInitThree && (
        <NeuralPortfolio isLayerVisible={showLayer} splashMode={splashMode} />
      )}
    </div>
  );
}

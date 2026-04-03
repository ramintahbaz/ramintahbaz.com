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
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    setPastFirstFrame(true);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const showLayer = showNeural && (!isSplashMode || pastFirstFrame);
  const isExplicitNeuralView = searchParams.get('view') === 'neural';
  const splashMode = pathname === '/' && !splashDone;

  /**
   * Mobile home after splash is craft/masonry only (`/` aliases `/craft`). Do not keep NeuralPortfolio mounted
   * full-screen at z-index 0 — it bleeds through the translucent TopBar in the `pt-12` band above `#main-scroll`.
   * Mount when: explicit `?view=neural`, or mobile splash (pre-grid). Desktop: same as before (`?view=neural` only).
   */
  const renderNeuralPortfolio =
    showLayer &&
    pastFirstFrame &&
    (isExplicitNeuralView || (isMobile && isSplashMode));

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: showLayer && isExplicitNeuralView ? 2 : 0,
        display: showLayer ? 'block' : 'none',
        pointerEvents: renderNeuralPortfolio ? 'auto' : 'none',
      }}
    >
      {renderNeuralPortfolio ? (
        <NeuralPortfolio isLayerVisible={showLayer} splashMode={splashMode} />
      ) : null}
    </div>
  );
}

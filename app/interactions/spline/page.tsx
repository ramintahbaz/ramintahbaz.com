'use client';

import { useEffect, useRef, useState } from 'react';
import AnimatedPage from '@/components/AnimatedPage';
import ProjectPageShell from '@/components/ProjectPageShell';

export const splineMetadata = {
  id: 'spline',
  title: 'Data wave animation',
  date: 'March 2025',
  cardDate: 'Mar 2025',
  cardDescription: 'A 3D brand asset visualizing data flow across Promise\'s platform with hidden easter eggs.',
  href: '/interactions/spline',
  shareTitle: 'Data wave animation — Ramin — Designer',
  shareText: 'A custom 3D brand asset built in Spline that visualizes data flowing through Promise\'s product ecosystem.',
};

export default function SplinePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load Spline viewer script
  useEffect(() => {
    // Check if script is already loaded
    if (customElements.get('spline-viewer')) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.12.43/build/spline-viewer.js';
    script.async = true;
    script.onload = () => {
      setScriptLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 640;
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Allow page scrolling when hovering over animation
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const handleWheel = (e: WheelEvent) => {
      // Always allow page scrolling when scrolling vertically
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        window.scrollBy({
          top: e.deltaY,
          behavior: 'auto'
        });
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      // If multi-touch (pinch), let it pass through to spline-viewer
      if (e.touches.length > 1) {
        // Don't prevent multi-touch - let spline-viewer handle it
        return;
      }
      // Single touch - allow page scrolling via touchAction
    };

    overlay.addEventListener('wheel', handleWheel, { passive: false });
    // Don't add touchstart listener - let touchAction handle it

    return () => {
      overlay.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const description = (
    <>
      <p className="mb-2 sm:mb-3">
        A custom 3D brand asset that visualizes data flowing through Promise's product ecosystem. The undulating wave integrates iridescent materials, running code streams, and hidden ducks (the company's internal mascot), creating a layered visual identity that bridges technical systems with approachable character.
      </p>
      <p className="mb-2 sm:mb-3">
        Built in Spline with custom materials, lighting, and animation curves.
      </p>
    </>
  );

  return (
    <AnimatedPage variant="dramatic">
        <ProjectPageShell
          title={splineMetadata.title}
          date={splineMetadata.date}
          description={description}
          backHref="/craft"
          backLabel="Craft"
          shareConfig={{
            title: splineMetadata.shareTitle,
            text: splineMetadata.shareText,
          }}
          extraSpacing={-16}
        >
          <div className="w-full max-w-[680px] mx-auto relative px-4 sm:px-0" style={{ overflow: 'hidden' }}>
            <div 
              ref={containerRef}
              className="w-full rounded-lg overflow-hidden relative mt-8 sm:mt-12" 
              style={{ 
                overflow: 'hidden',
                transform: 'translateZ(0)',
                willChange: 'transform',
                height: isMobile ? '450px' : '600px',
                WebkitTransform: 'translateZ(0)',
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden',
                touchAction: 'pan-y',
                backgroundColor: '#0E1014',
              }}
            >
              {scriptLoaded ? (
                // @ts-ignore - spline-viewer is a custom web component
                <spline-viewer
                  url="https://prod.spline.design/6I6XxvKovDyeAwTs/scene.splinecode"
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    transform: isMobile ? 'scale(1.1) translateY(10%)' : 'scale(1.6) translateY(15%)', 
                    transformOrigin: 'center',
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    WebkitTransform: isMobile 
                      ? 'scale3d(1.1, 1.1, 1) translate3d(0, 10%, 0)' 
                      : 'scale3d(1.6, 1.6, 1) translate3d(0, 15%, 0)',
                    transformStyle: 'preserve-3d',
                    pointerEvents: 'auto',
                    touchAction: 'pan-y pinch-zoom',
                    display: 'block',
                    position: 'relative',
                    zIndex: 20,
                  } as React.CSSProperties}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#0E1014' }}>
                  <p className="text-gray-500">Loading 3D scene...</p>
                </div>
              )}
              {/* Transparent overlay to capture scroll events while allowing multi-touch for zoom */}
              <div 
                ref={overlayRef}
                className="absolute inset-0 z-30"
                style={{ 
                  pointerEvents: 'auto',
                  cursor: 'default',
                  touchAction: 'pan-y pinch-zoom',
                }}
              />
            </div>
            {/* Spacer for bottom padding */}
            <div className="h-2 sm:h-4" />
          </div>
        </ProjectPageShell>
      </AnimatedPage>
  );
}


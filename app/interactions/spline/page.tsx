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
  const iframeContainerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isMobile, setIsMobile] = useState(false);

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

  // Allow page scrolling when hovering over iframe
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

    // For mobile, we rely on touchAction: 'pan-y' CSS property for native scrolling
    // No manual touch handling needed - the browser will handle it natively

    // No need to handle mouse down since iframe is not interactive

    overlay.addEventListener('wheel', handleWheel, { passive: false });

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
            ref={iframeContainerRef}
            className="w-full rounded-lg overflow-hidden bg-gray-100 relative mt-8 sm:mt-12" 
            style={{ 
              overflow: 'hidden',
              transform: 'translateZ(0)',
              willChange: 'transform',
              height: '600px',
              WebkitTransform: 'translateZ(0)',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
              touchAction: 'pan-y',
            }}
          >
            {/* Top border/frame to create intentional boundary */}
            <div 
              className="absolute top-0 left-0 right-0 h-1 pointer-events-none z-10"
              style={{ borderRadius: '0.5rem', backgroundColor: '#0E1014' }}
            />
            {/* Transparent overlay to capture scroll events while allowing clicks through */}
            <div 
              ref={overlayRef}
              className="absolute inset-0 z-30"
              style={{ 
                pointerEvents: 'auto',
                cursor: 'default',
                touchAction: 'pan-y',
              }}
            />
            <iframe
              ref={iframeRef}
              src="https://my.spline.design/promise1-XHxvyba8ET1rLcT2QmEJJxu0/"
              title="Spline 3D Scene"
              className="w-full h-full"
              allow="fullscreen"
              style={{ 
                border: 'none', 
                transform: 'scale(1.6) translateY(15%)', 
                transformOrigin: 'center',
                imageRendering: '-webkit-optimize-contrast',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                WebkitTransform: 'scale3d(1.6, 1.6, 1) translate3d(0, 15%, 0)',
                transformStyle: 'preserve-3d',
                pointerEvents: 'none',
              } as React.CSSProperties}
            />
            {/* Bottom border/frame to create intentional boundary */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none z-10"
              style={{ borderRadius: '0.5rem', backgroundColor: '#0E1014' }}
            />
          </div>
          {/* Spacer for bottom padding */}
          <div className="h-2 sm:h-4" />
        </div>
      </ProjectPageShell>
    </AnimatedPage>
  );
}


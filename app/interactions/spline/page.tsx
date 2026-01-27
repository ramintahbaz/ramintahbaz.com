'use client';

import { useEffect, useRef } from 'react';
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

  // Allow page scrolling when hovering over iframe
  useEffect(() => {
    const container = iframeContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Only allow vertical scrolling to pass through
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        // Check if we're at the top or bottom of the page
        const isAtTop = window.scrollY === 0;
        const isAtBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10;
        
        // If scrolling down at top or scrolling up at bottom, allow it
        if ((e.deltaY > 0 && isAtTop) || (e.deltaY < 0 && isAtBottom)) {
          return; // Let the iframe handle it
        }
        
        // Otherwise, allow page scrolling
        window.scrollBy(0, e.deltaY);
        e.preventDefault();
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  const description = (
    <>
      <p className="mb-2 sm:mb-3">
        A custom 3D brand asset that visualizes data flowing through Promise's product ecosystem. The undulating wave integrates running code streams and hidden ducks (the company's internal mascot), creating a layered visual identity that bridges technical systems with approachable character.
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
            }}
          >
            {/* Top border/frame to create intentional boundary */}
            <div 
              className="absolute top-0 left-0 right-0 h-1 pointer-events-none z-10"
              style={{ borderRadius: '0.5rem', backgroundColor: '#0E1014' }}
            />
            <iframe
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
              }}
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


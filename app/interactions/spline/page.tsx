'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPage from '@/components/AnimatedPage';
import ProjectPageShell from '@/components/ProjectPageShell';

export const splineMetadata = {
  id: 'spline',
  title: 'Promise in motion',
  date: 'March 2025',
  cardDate: 'Mar 2025',
  cardDescription: '3D brand asset showing data moving through Promise\'s systems.',
  href: '/interactions/spline',
  shareTitle: 'Promise in motion — Ramin — Designer',
  shareText: 'A custom 3D brand asset built in Spline that visualizes data flowing through Promise\'s product ecosystem.',
};

export default function SplinePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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
          {/* Video */}
          <div className="mt-4 sm:mt-16 w-full max-w-full -mx-4 sm:mx-0">
            <div 
              className="relative w-full rounded-lg overflow-hidden min-h-[270px] sm:min-h-[400px]" 
              style={{ maxHeight: 'calc(100vh - 200px)', backgroundColor: '#0E1014', cursor: isMobile ? 'default' : 'pointer' }}
              onClick={() => !isMobile && setIsModalOpen(true)}
            >
              <video
                src="/images/data wave/promise-1080p_5seconds.mp4"
                className="w-full h-full object-contain rounded-lg"
                style={{ pointerEvents: 'none', objectPosition: 'center bottom', transform: `translateY(${isMobile ? '20%' : '15%'})` }}
                muted
                loop
                playsInline
                autoPlay
                disablePictureInPicture
                controlsList="nodownload nofullscreen noremoteplayback"
              />
            </div>
          </div>

          {/* Modal */}
          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12"
                onClick={() => setIsModalOpen(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-[90vw] sm:w-[95vw] max-w-[90vw] sm:max-w-[95vw] h-auto max-h-[70vh] sm:max-h-[90vh] aspect-video flex items-center justify-center bg-[#0E1014] rounded-lg shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative w-full h-full rounded-lg overflow-hidden">
                    <video
                      src="/images/data wave/promise-1080p_5seconds.mp4"
                      className="w-full h-full object-contain rounded-lg"
                      style={{ objectPosition: 'center bottom', transform: 'translateY(15%)' }}
                      muted
                      loop
                      playsInline
                      autoPlay
                      disablePictureInPicture
                      controlsList="nodownload nofullscreen noremoteplayback"
                    />
                  </div>
                  {/* Close button - positioned on top of video */}
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute right-2 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black/80 hover:bg-black text-white transition-colors z-[100] cursor-pointer shadow-lg"
                    style={{ top: 'calc(0.5rem + 2px)' }}
                    aria-label="Close modal"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </ProjectPageShell>
      </AnimatedPage>
  );
}

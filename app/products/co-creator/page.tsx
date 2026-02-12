'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPage from '@/components/AnimatedPage';
import ProjectPageShell from '@/components/ProjectPageShell';

export const coCreatorMetadata = {
  id: 'co-creator',
  title: 'Co-Creator',
  date: 'February 2026',
  cardDate: 'Feb 2026',
  cardDescription: 'AI co-designer that turns taste into system.',
  href: '/products/co-creator',
  shareTitle: 'Co-Creator — Ramin — Designer',
  shareText: 'AI co-designer that turns taste into system. Design inspiration that starts anywhere and scales from your vision.',
};

export default function CoCreatorPage() {
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
        What if design inspiration started anywhere, like it naturally does? You see something in a bazaar that catches your eye and think &quot;that would be perfect for the product I&apos;m building.&quot; You capture it, bring it to your canvas, describe what you love about it, and a complete system builds from your vision. What if your taste could scale faster than you could execute it yourself?
      </p>
    </>
  );

  return (
    <AnimatedPage variant="dramatic">
      <ProjectPageShell
        title={coCreatorMetadata.title}
        date={coCreatorMetadata.date}
        description={description}
        backHref="/craft"
        backLabel="Craft"
        shareConfig={{
          title: coCreatorMetadata.shareTitle,
          text: coCreatorMetadata.shareText,
        }}
      >
        {/* Video */}
        <div className="mt-4 sm:mt-16 w-full max-w-full -mx-4 sm:mx-0">
          <div 
            className="relative w-full rounded-lg overflow-hidden min-h-[500px] sm:min-h-[800px]" 
            style={{ maxHeight: 'calc(100vh - 200px)', backgroundColor: '#E2DEDB', cursor: isMobile ? 'default' : 'pointer' }}
            onClick={() => !isMobile && setIsModalOpen(true)}
          >
            <video
              src="/images/co-creator/taste%20%E2%86%92%20system%20demo.mp4"
              className="w-full h-full object-contain rounded-lg"
              style={{ pointerEvents: 'none' }}
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
                className="relative w-[90vw] sm:w-[600px] max-w-[90vw] sm:max-w-[600px] h-auto max-h-[70vh] sm:max-h-[500px] aspect-video flex items-center justify-center bg-[#E2DEDB] rounded-lg shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative w-full h-full rounded-lg overflow-hidden">
                  <video
                    src="/images/co-creator/taste%20%E2%86%92%20system%20demo.mp4"
                    className="w-full h-full object-contain rounded-lg"
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

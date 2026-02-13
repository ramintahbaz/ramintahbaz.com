'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPage from '@/components/AnimatedPage';
import ProjectPageShell from '@/components/ProjectPageShell';

const VIDEO_SRC = '/images/co-creator/taste%20%E2%86%92%20system%20demo.mp4';

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
  const [modalSize, setModalSize] = useState({ width: 800, height: 450 });
  const [modalStartTime, setModalStartTime] = useState(0);
  const inlineVideoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const openModal = () => {
    if (isMobile) return;
    const el = containerRef.current;
    const video = inlineVideoRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const maxW = window.innerWidth * 0.9;
      const maxH = window.innerHeight;
      let w = rect.width * 2;
      let h = rect.height * 2;
      if (video && video.videoWidth && video.videoHeight) {
        const videoAspect = video.videoWidth / video.videoHeight;
        const containerAspect = rect.width / rect.height;
        let displayW = rect.width;
        let displayH = rect.height;
        if (videoAspect > containerAspect) {
          displayH = rect.width / videoAspect;
        } else {
          displayW = rect.height * videoAspect;
        }
        w = Math.min(displayW * 2, maxW);
        h = Math.min(displayH * 2, maxH);
      } else {
        w = Math.min(w, maxW);
        h = Math.min(h, maxH);
      }
      setModalSize({ width: w, height: h });
    }
    setModalStartTime(inlineVideoRef.current?.currentTime ?? 0);
    inlineVideoRef.current?.pause();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    const modalTime = modalVideoRef.current?.currentTime;
    modalVideoRef.current?.pause();
    if (inlineVideoRef.current != null && typeof modalTime === 'number') {
      inlineVideoRef.current.currentTime = modalTime;
    }
    inlineVideoRef.current?.play();
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!isModalOpen) return;
    const video = modalVideoRef.current;
    if (!video) return;
    const seekAndPlay = () => {
      video.currentTime = modalStartTime;
      video.play();
    };
    if (video.readyState >= 2) {
      seekAndPlay();
    } else {
      video.addEventListener('loadeddata', seekAndPlay, { once: true });
      return () => video.removeEventListener('loadeddata', seekAndPlay);
    }
  }, [isModalOpen, modalStartTime]);

  const description = (
    <>
      <p className="mb-2 sm:mb-3">
        What if design inspiration started anywhere, like it naturally does? You see something in a bazaar that catches your eye and think &quot;that would be perfect for the product I&apos;m building.&quot; You capture it, bring it to your canvas, describe what you love about it, and a complete system builds from your vision.
      </p>
      <p className="mb-2 sm:mb-3">
        What if your taste could scale faster than you could execute it yourself?
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
            ref={containerRef}
            className="relative w-full rounded-lg overflow-hidden min-h-[500px] sm:min-h-[800px]"
            style={{ maxHeight: 'calc(100vh - 200px)', backgroundColor: '#E2DEDB', cursor: isMobile ? 'default' : 'pointer' }}
            onClick={openModal}
          >
            <video
              ref={inlineVideoRef}
              src={VIDEO_SRC}
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

        {/* Modal - 2x size, video only with overlaid close */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-0"
              onClick={closeModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative rounded-lg shadow-lg overflow-hidden bg-[#E2DEDB]"
                style={{
                  width: modalSize.width,
                  height: modalSize.height,
                  maxWidth: '90vw',
                  maxHeight: '100vh',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <video
                  ref={modalVideoRef}
                  src={VIDEO_SRC}
                  className="w-full h-full object-contain rounded-lg"
                  muted
                  loop
                  playsInline
                  disablePictureInPicture
                  controlsList="nodownload nofullscreen noremoteplayback"
                />
                <button
                  onClick={closeModal}
                  className="absolute right-2 top-2 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black/80 hover:bg-black text-white transition-colors z-10 cursor-pointer"
                  aria-label="Close modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
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

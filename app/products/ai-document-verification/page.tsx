'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPage from '@/components/AnimatedPage';
import ProjectPageShell from '@/components/ProjectPageShell';

export const aiDocumentVerificationMetadata = {
  id: 'ai-document-verification',
  title: 'AI-Assisted Document Verification',
  date: 'January 2026',
  cardDate: 'Jan 2026',
  cardDescription: 'AI-powered eligibility verification that keeps humans in the loop.',
  href: '/products/ai-document-verification',
  shareTitle: 'AI-Assisted Document Verification — Ramin — Designer',
  shareText: 'An end-to-end product concept for scaling eligibility verification in government benefit programs using AI.',
};

export default function AIDocumentVerificationPage() {
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
        An end-to-end product for scaling eligibility verification in government benefit programs. The system uses AI to extract and verify information from uploaded documents like utility bills, IDs, and award letters, automatically processing 94% of cases. Edge case reviews and corrections feed back into the model, continuously improving accuracy over time. Real-time validation reduces errors and eliminates redundant questions for residents.
      </p>
      <p className="mb-2 sm:mb-3">
        Built in React, including the upload flow, extraction interface, review workflow, and guidance system.
      </p>
    </>
  );

  return (
    <AnimatedPage variant="dramatic">
      <ProjectPageShell
        title={aiDocumentVerificationMetadata.title}
        date={aiDocumentVerificationMetadata.date}
        description={description}
        backHref="/craft"
        backLabel="Craft"
        shareConfig={{
          title: aiDocumentVerificationMetadata.shareTitle,
          text: aiDocumentVerificationMetadata.shareText,
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
              src="/images/ai-document-verification/ritle_demo1.mp4"
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
                    src="/images/ai-document-verification/ritle_demo1.mp4"
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


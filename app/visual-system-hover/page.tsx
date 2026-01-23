'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import Image from 'next/image';
import AnimatedPage from '@/components/AnimatedPage';
import ProjectPageShell from '@/components/ProjectPageShell';

export const visualSystemHoverMetadata = {
  id: 'visual-system-hover',
  title: 'Visual system hover',
  date: 'January 15, 2025',
  cardDate: 'Jan 2025',
  cardDescription: 'A bento-style grid exploring hover interactions and visual feedback.',
  href: '/visual-system-hover',
  shareTitle: 'Visual system hover — Ramin — Designer',
  shareText: 'A bento-style grid exploring hover interactions and visual feedback.',
};

type GridItem = {
  id: string;
  title: string;
  subtitle?: string;
  year: string;
  category: string;
  bgColor: string;
  image: string;
  video?: string;
};

// Grid items - 2 columns, 2 rows, all same size
const gridItems: GridItem[] = [
  { 
    id: '1', 
    title: 'Michael Jordan Dunk Contest', 
    subtitle: 'Nverse', 
    year: '1987', 
    category: 'BD',
    bgColor: 'rgba(42, 42, 42, 0.5)', // Dark grey with more transparency
    image: '/images/image1.jpeg',
    video: '/videos/Michael_Jordan.mp4',
  },
  { 
    id: '2', 
    title: 'Steve Jobs iPhone unveiling', 
    subtitle: 'Sodo', 
    year: '2007', 
    category: 'BD',
    bgColor: 'rgba(58, 42, 26, 0.5)', // Dark brown with more transparency
    image: '/images/image2.jpeg',
    video: '/videos/Steve Jobs introduces iPhone in 2007.mp4',
  },
  { 
    id: '3', 
    title: 'Robin Williams (The Parkinson Show)', 
    subtitle: 'Sodo Athletic Lab', 
    year: '2001', 
    category: 'WD',
    bgColor: 'rgba(42, 42, 42, 0.5)',
    image: '/images/image3.jpeg',
    video: '/videos/Robin Williams.mp4',
  },
  { 
    id: '4', 
    title: 'Mr Rogers Emmy Speech', 
    subtitle: 'MarsLofi', 
    year: '1997', 
    category: 'WD',
    bgColor: 'rgba(42, 42, 42, 0.5)',
    image: '/images/image4.jpeg',
    video: '/videos/Mr_Rogers.mp4',
  },
];

export default function VisualSystemHoverPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [previewVideoLoading, setPreviewVideoLoading] = useState<Record<string, boolean>>({});
  const [modalVideoLoading, setModalVideoLoading] = useState<Record<string, boolean>>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  
  const width = useMotionValue(400);
  const height = useMotionValue(300);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Set mounted state after component mounts and ensure no initial hover
  useEffect(() => {
    setIsMounted(true);
    setHoveredCard(null); // Explicitly reset hover state on mount
  }, []);

  // Preload metadata for all videos in the background for instant hover previews
  useEffect(() => {
    const preloadVideos: HTMLVideoElement[] = [];
    
    gridItems.forEach((item) => {
      if (item.video) {
        const video = document.createElement('video');
        video.src = item.video;
        video.preload = 'metadata'; // Only load metadata (first frame)
        video.muted = true;
        video.playsInline = true;
        video.style.display = 'none';
        video.style.position = 'absolute';
        video.style.width = '1px';
        video.style.height = '1px';
        video.style.opacity = '0';
        video.style.pointerEvents = 'none';
        document.body.appendChild(video);
        preloadVideos.push(video);
      }
    });

    // Cleanup: remove preload videos when component unmounts
    return () => {
      preloadVideos.forEach((video) => {
        if (video.parentNode) {
          document.body.removeChild(video);
        }
      });
    };
  }, []);

  // Handle preview video setup when hover changes
  useEffect(() => {
    if (hoveredCard) {
      const video = previewVideoRefs.current[hoveredCard];
      if (video) {
        setPreviewVideoLoading((prev) => ({ ...prev, [hoveredCard]: true }));
        video.currentTime = 0;
        video.play().catch(() => {
          // Ignore play errors
        });
      }
    } else {
      // Reset all preview videos when hover ends
      Object.values(previewVideoRefs.current).forEach((video) => {
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      });
    }
  }, [hoveredCard]);

  // Handle modal video setup when modal opens
  useEffect(() => {
    if (openModal && videoRef.current) {
      setModalVideoLoading((prev) => ({ ...prev, [openModal]: true }));
      const video = videoRef.current;
      video.currentTime = 0;
      
      // Try to play, and if it fails, wait for enough data
      const tryPlay = () => {
        video.play().catch(() => {
          // If play fails, wait for canplay event
          const handleCanPlay = () => {
            video.play().catch(() => {
              // Ignore play errors
            });
            video.removeEventListener('canplay', handleCanPlay);
          };
          video.addEventListener('canplay', handleCanPlay);
        });
      };
      
      // If video already has some data, try playing immediately
      if (video.readyState >= 2) {
        tryPlay();
      } else {
        // Otherwise wait for loadeddata
        const handleLoadedData = () => {
          tryPlay();
          video.removeEventListener('loadeddata', handleLoadedData);
        };
        video.addEventListener('loadeddata', handleLoadedData);
      }
    }
  }, [openModal]);

  // Reset position when modal closes
  useEffect(() => {
    if (!openModal) {
      x.set(0);
      y.set(0);
      setIsMuted(true); // Reset to muted when modal closes
    }
  }, [openModal, x, y]);

  // Update video mute state when isMuted changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const description = (
    <>
      <p className="mb-2 sm:mb-3">
        An exploration of hover interactions within a bento-style grid layout, featuring visuals of people who inspire me. Each card responds to hover (on desktop) with subtle scale, opacity, and border transitions, creating a cohesive visual system that feels responsive and intentional.
      </p>
      <p className="mb-2 sm:mb-3">
        Built using Next.js, Framer Motion, and Tailwind CSS.
      </p>
    </>
  );

  return (
    <AnimatedPage variant="dramatic">
      <ProjectPageShell
        title={visualSystemHoverMetadata.title}
        date={visualSystemHoverMetadata.date}
        description={description}
        backHref="/craft"
        backLabel="Craft"
        shareConfig={{
          title: visualSystemHoverMetadata.shareTitle,
          text: visualSystemHoverMetadata.shareText,
        }}
        extraSpacing={{ mobile: -16, desktop: 48 }}
      >
        {/* Grid - 2 columns, 3 rows */}
        <div className="w-full max-w-full">
          <div className="grid grid-cols-2 gap-1 w-full" style={{ gridAutoRows: 'minmax(70px, auto)' }}>
            {gridItems.map((item, index) => {
              // Determine if card is on left (even index) or right (odd index)
              const isLeftColumn = index % 2 === 0;
              
              return (
              <motion.div
                key={item.id}
                className="rounded-lg p-3 sm:p-4 cursor-pointer relative overflow-visible group min-h-[70px] sm:min-h-[80px] w-full"
                style={{ backgroundColor: item.bgColor, perspective: '1000px' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: hoveredCard === item.id ? 1 : hoveredCard ? 0.6 : 1,
                }}
                whileHover={{ 
                  scale: 0.98,
                  zIndex: 10,
                }}
                transition={{
                  type: 'tween',
                  duration: 0.2,
                  ease: 'easeOut',
                }}
                onHoverStart={() => {
                  if (isMounted) {
                    setHoveredCard(item.id);
                  }
                }}
                onHoverEnd={() => {
                  if (isMounted) {
                    setHoveredCard(null);
                  }
                }}
                onClick={() => setOpenModal(item.id)}
              >
                {/* Border that appears on hover */}
                <motion.div
                  className="absolute inset-0 rounded-lg border border-white/20"
                  animate={{
                    borderColor: hoveredCard === item.id ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)',
                    boxShadow: hoveredCard === item.id 
                      ? 'inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.1)' 
                      : 'none',
                  }}
                  transition={{ duration: 0.2 }}
                />
                
                {/* Left side white stroke on hover */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-[1px] bg-white rounded-l-lg"
                  animate={{
                    opacity: hoveredCard === item.id ? 0.6 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                />
                
                {/* Video preview on hover - positioned outside card */}
                <AnimatePresence>
                  {hoveredCard === item.id && item.video && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, x: isLeftColumn ? 20 : -20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8, x: isLeftColumn ? 20 : -20 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute top-1/2 -translate-y-1/2 z-20 ${
                        isLeftColumn ? 'left-full ml-2' : 'right-full mr-2'
                      }`}
                    >
                      <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-lg overflow-hidden bg-black">
                        {/* Video - 10 second clip */}
                        <video
                          ref={(el) => {
                            previewVideoRefs.current[item.id] = el;
                          }}
                          src={item.video}
                          autoPlay
                          muted
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover"
                          onLoadedData={() => {
                            setPreviewVideoLoading((prev) => ({ ...prev, [item.id]: false }));
                            const video = previewVideoRefs.current[item.id];
                            if (video) {
                              video.currentTime = 0;
                              video.play().catch(() => {
                                // Ignore play errors
                              });
                            }
                          }}
                          onCanPlay={() => {
                            setPreviewVideoLoading((prev) => ({ ...prev, [item.id]: false }));
                          }}
                          onWaiting={() => {
                            setPreviewVideoLoading((prev) => ({ ...prev, [item.id]: true }));
                          }}
                          onTimeUpdate={(e) => {
                            const video = e.currentTarget;
                            // Stop at 10 seconds and reset to start
                            if (video.currentTime >= 10) {
                              video.pause();
                              video.currentTime = 0;
                              video.play().catch(() => {
                                // Ignore play errors
                              });
                            }
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Content */}
                <div className="relative z-10 h-full" style={{ fontFamily: 'var(--font-ibm-plex-mono), monospace' }}>
                  {/* Title (H1) - top aligned */}
                  <h1 className="absolute top-0 left-0 text-white text-[11px] sm:text-[12px] font-medium leading-tight line-clamp-1">
                    {item.title}
                  </h1>
                  
                  {/* Year - bottom left */}
                  <span className="absolute bottom-0 left-0 text-white/60 text-[9px] sm:text-[10px]">
                    {item.year}
                  </span>
                </div>
              </motion.div>
              );
            })}
          </div>
        </div>

        {/* Modal - jinsupark.com style */}
        <AnimatePresence>
          {openModal && (() => {
            const selectedItem = gridItems.find(item => item.id === openModal);
            if (!selectedItem) return null;

            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3 pointer-events-none"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setOpenModal(null);
                  }
                }}
              >
                <motion.div
                  ref={modalRef}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                  style={{
                    width: width,
                    height: height,
                    minWidth: 400,
                    minHeight: 300,
                    border: '1px solid #3C3C3C',
                    borderRadius: '8px',
                    pointerEvents: 'auto',
                    x: x,
                    y: y,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  
                  {/* Vintage Mac window - beveled border and header integrated */}
                  <div
                    className="w-full h-full bg-white flex flex-col relative"
                    style={{
                      border: '8px solid #1A1A1A',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.15), inset 0 -1px 2px rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    {/* Title bar - integrated with bevel, draggable */}
                    <div 
                      className="h-[44px] flex items-center justify-between flex-shrink-0 relative cursor-grab active:cursor-grabbing"
                      style={{ 
                        backgroundColor: '#1A1A1A',
                        fontFamily: 'var(--font-ibm-plex-mono), monospace',
                        marginTop: '-8px',
                        marginLeft: '-8px',
                        marginRight: '-8px',
                        paddingTop: '8px',
                        paddingLeft: '12px',
                        paddingRight: '12px',
                      }}
                      onMouseDown={(e) => {
                        // Prevent dragging if clicking on close button
                        const target = e.target as HTMLElement;
                        if (target.closest('button')) {
                          return;
                        }
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const startX = e.clientX;
                        const startY = e.clientY;
                        const startModalX = x.get();
                        const startModalY = y.get();

                        const handleMouseMove = (moveEvent: MouseEvent) => {
                          moveEvent.preventDefault();
                          moveEvent.stopPropagation();
                          const deltaX = moveEvent.clientX - startX;
                          const deltaY = moveEvent.clientY - startY;
                          const newX = startModalX + deltaX;
                          const newY = startModalY + deltaY;
                          x.set(newX);
                          y.set(newY);
                        };

                        const handleMouseUp = () => {
                          document.removeEventListener('mousemove', handleMouseMove);
                          document.removeEventListener('mouseup', handleMouseUp);
                        };

                        document.addEventListener('mousemove', handleMouseMove, { passive: false });
                        document.addEventListener('mouseup', handleMouseUp);
                      }}
                    >
                      {/* Left dots - 6 dots vertical - draggable area */}
                      <div 
                        className="flex items-center gap-2 absolute left-4 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
                        style={{ pointerEvents: 'auto' }}
                      >
                        <div className="grid grid-cols-2" style={{ gap: '4px' }}>
                          <div className="w-0.5 h-0.5 rounded-full" style={{ backgroundColor: '#8D8D8D' }} />
                          <div className="w-0.5 h-0.5 rounded-full" style={{ backgroundColor: '#8D8D8D' }} />
                          <div className="w-0.5 h-0.5 rounded-full" style={{ backgroundColor: '#8D8D8D' }} />
                          <div className="w-0.5 h-0.5 rounded-full" style={{ backgroundColor: '#8D8D8D' }} />
                          <div className="w-0.5 h-0.5 rounded-full" style={{ backgroundColor: '#8D8D8D' }} />
                          <div className="w-0.5 h-0.5 rounded-full" style={{ backgroundColor: '#8D8D8D' }} />
                        </div>
                      </div>
                      
                      {/* Centered title */}
                      <span 
                        className="text-gray-300 text-[12px] font-medium absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ fontFamily: 'var(--font-ibm-plex-mono), monospace' }}
                      >
                        {selectedItem.title}
                      </span>
                      
                      {/* Close button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenModal(null);
                              }}
                              onMouseDown={(e) => e.stopPropagation()}
                              className="text-gray-300 hover:text-white text-[12px] font-medium transition-colors absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                              style={{ fontFamily: 'var(--font-ibm-plex-mono), monospace' }}
                            >
                              [CLOSE]
                            </button>
                    </div>

                    {/* Content area */}
                    <div className="flex-1 relative overflow-hidden bg-black">
                      {selectedItem.video ? (
                        <>
                          {/* Loading animation */}
                          {modalVideoLoading[selectedItem.id] && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-20">
                              <div className="flex flex-col items-center gap-3">
                                {/* Spinner */}
                                <div className="relative w-12 h-12">
                                  <div className="absolute inset-0 border-2 border-white/20 rounded-full"></div>
                                  <div className="absolute inset-0 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
                                </div>
                              </div>
                            </div>
                          )}
                          <video
                            ref={videoRef}
                            src={selectedItem.video}
                            autoPlay
                            loop
                            muted={isMuted}
                            playsInline
                            preload="auto"
                            className="w-full h-full object-cover"
                            poster={selectedItem.image}
                            onLoadedData={() => {
                              setModalVideoLoading((prev) => ({ ...prev, [selectedItem.id]: false }));
                            }}
                            onCanPlay={() => {
                              setModalVideoLoading((prev) => ({ ...prev, [selectedItem.id]: false }));
                            }}
                            onCanPlayThrough={() => {
                              setModalVideoLoading((prev) => ({ ...prev, [selectedItem.id]: false }));
                            }}
                            onWaiting={() => {
                              setModalVideoLoading((prev) => ({ ...prev, [selectedItem.id]: true }));
                            }}
                            onLoadStart={() => {
                              setModalVideoLoading((prev) => ({ ...prev, [selectedItem.id]: true }));
                            }}
                          />
                          {/* Mute/Unmute toggle button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsMuted(!isMuted);
                            }}
                            className="absolute bottom-2 left-2 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors backdrop-blur-sm cursor-pointer"
                            aria-label={isMuted ? 'Unmute' : 'Mute'}
                          >
                            {isMuted ? (
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                                <line x1="23" y1="9" x2="17" y2="15" />
                                <line x1="17" y1="9" x2="23" y2="15" />
                              </svg>
                            ) : (
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                              </svg>
                            )}
                          </button>
                        </>
                      ) : (
                        <Image
                          src={selectedItem.image}
                          alt={selectedItem.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    {/* Resize handle - bottom right triangle dots - integrated with bevel */}
                    <div
                      ref={resizeHandleRef}
                      className="absolute bottom-0 right-0 w-10 h-10 cursor-nwse-resize z-20 flex items-end justify-end"
                      style={{
                        marginBottom: '-8px',
                        marginRight: '-8px',
                        paddingBottom: '8px',
                        paddingRight: '8px',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        const startX = e.clientX;
                        const startY = e.clientY;
                        const startWidth = width.get();
                        const startHeight = height.get();

                        const handleMouseMove = (moveEvent: MouseEvent) => {
                          const deltaX = moveEvent.clientX - startX;
                          const deltaY = moveEvent.clientY - startY;
                          width.set(Math.max(400, startWidth + deltaX));
                          height.set(Math.max(300, startHeight + deltaY));
                        };

                        const handleMouseUp = () => {
                          window.removeEventListener('mousemove', handleMouseMove);
                          window.removeEventListener('mouseup', handleMouseUp);
                        };

                        window.addEventListener('mousemove', handleMouseMove);
                        window.addEventListener('mouseup', handleMouseUp);
                      }}
                    >
                      <div 
                        className="flex flex-col items-end relative" 
                        style={{ 
                          padding: '2px',
                          gap: '4px',
                        }}
                      >
                        {/* Triangle background behind dots */}
                        <div
                          className="absolute"
                          style={{
                            backgroundColor: '#1A1A1A',
                            clipPath: 'polygon(100% 0%, 100% 100%, 0% 100%)',
                            borderRadius: '0 0 8px 0',
                            top: '-160px',
                            right: '-160px',
                            bottom: '-160px',
                            left: '-192px',
                          }}
                        />
                        {/* Inner stroke on triangle */}
                        <div
                          className="absolute"
                          style={{
                            clipPath: 'polygon(calc(100% - 1px) 1px, calc(100% - 1px) calc(100% - 1px), 1px calc(100% - 1px))',
                            top: '-159px',
                            right: '-159px',
                            bottom: '-159px',
                            left: '-191px',
                            border: '1px solid #3C3C3C',
                            borderRadius: '0 0 8px 0',
                            pointerEvents: 'none',
                          }}
                        />
                        <div className="flex relative z-10" style={{ gap: '4px' }}>
                          <div className="w-0.5 h-0.5 rounded-full" style={{ backgroundColor: '#8D8D8D' }} />
                        </div>
                        <div className="flex relative z-10" style={{ gap: '4px' }}>
                          <div className="w-0.5 h-0.5 rounded-full" style={{ backgroundColor: '#8D8D8D' }} />
                          <div className="w-0.5 h-0.5 rounded-full" style={{ backgroundColor: '#8D8D8D' }} />
                        </div>
                        <div className="flex relative z-10" style={{ gap: '4px' }}>
                          <div className="w-0.5 h-0.5 rounded-full" style={{ backgroundColor: '#8D8D8D' }} />
                          <div className="w-0.5 h-0.5 rounded-full" style={{ backgroundColor: '#8D8D8D' }} />
                          <div className="w-0.5 h-0.5 rounded-full" style={{ backgroundColor: '#8D8D8D' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </ProjectPageShell>
    </AnimatedPage>
  );
}


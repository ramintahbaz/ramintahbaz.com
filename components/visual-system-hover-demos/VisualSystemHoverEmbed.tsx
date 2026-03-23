'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';

type GridItem = {
  id: string;
  title: string;
  year: string;
  bgColor: string;
  image: string;
  video?: string;
};

const gridItems: GridItem[] = [
  {
    id: '1',
    title: 'Michael Jordan Dunk Contest',
    year: '1987',
    bgColor: 'rgba(42, 42, 42, 0.5)',
    image: '/images/image1.jpeg',
    video: 'https://xt6vyscb1zzon7fs.public.blob.vercel-storage.com/videos/Michael_Jordan.mp4',
  },
  {
    id: '2',
    title: 'Steve Jobs iPhone unveiling',
    year: '2007',
    bgColor: 'rgba(58, 42, 26, 0.5)',
    image: '/images/image2.jpeg',
    video: '/videos/Steve Jobs.mp4?v=2',
  },
  {
    id: '3',
    title: 'Robin Williams (The Parkinson Show)',
    year: '2001',
    bgColor: 'rgba(42, 42, 42, 0.5)',
    image: '/images/image3.jpeg',
    video: '/videos/Robin Williams.mp4?v=2',
  },
  {
    id: '4',
    title: 'Mr Rogers Emmy Speech',
    year: '1997',
    bgColor: 'rgba(42, 42, 42, 0.5)',
    image: '/images/image4.jpeg',
    video: 'https://xt6vyscb1zzon7fs.public.blob.vercel-storage.com/videos/Mr_Rogers.mp4',
  },
];

export default function VisualSystemHoverEmbed() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [canHover, setCanHover] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const width = useMotionValue(320);
  const height = useMotionValue(240);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    setIsMounted(true);
    setHoveredCard(null);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover)');
    setCanHover(mq.matches);
    const listener = () => setCanHover(mq.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    if (hoveredCard) {
      const video = previewVideoRefs.current[hoveredCard];
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    } else {
      Object.values(previewVideoRefs.current).forEach((video) => {
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      });
    }
  }, [hoveredCard]);

  useEffect(() => {
    if (openModal && videoRef.current) {
      const video = videoRef.current;
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }, [openModal]);

  useEffect(() => {
    if (!openModal) {
      x.set(0);
      y.set(0);
      setIsMuted(true);
    }
  }, [openModal, x, y]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const selectedItem = openModal ? gridItems.find(item => item.id === openModal) : null;

  return (
    <div className="w-full rounded-xl overflow-hidden bg-neutral-900">
      <div className="relative px-4 py-8">
        <div className="grid grid-cols-2 gap-1 w-full" style={{ gridAutoRows: 'minmax(100px, auto)' }}>
          {gridItems.map((item, index) => {
            const isLeftColumn = index % 2 === 0;
            return (
              <motion.div
                key={item.id}
                className="rounded-lg p-3 cursor-pointer relative overflow-visible min-h-[100px] w-full"
                style={{ backgroundColor: item.bgColor, perspective: '1000px' }}
                animate={{
                  opacity: hoveredCard === item.id ? 1 : hoveredCard ? 0.6 : 1,
                }}
                whileHover={{ scale: 0.98, zIndex: 10 }}
                transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
                onHoverStart={() => { if (isMounted) setHoveredCard(item.id); }}
                onHoverEnd={() => { if (isMounted) setHoveredCard(null); }}
                onClick={() => setOpenModal(item.id)}
              >
                <motion.div
                  className="absolute inset-0 rounded-lg border"
                  animate={{
                    borderColor: hoveredCard === item.id ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.1)',
                  }}
                  transition={{ duration: 0.2 }}
                />

                {canHover && (
                  <AnimatePresence>
                    {hoveredCard === item.id && item.video && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: isLeftColumn ? 10 : -10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: isLeftColumn ? 10 : -10 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute top-1/2 -translate-y-1/2 z-20 ${
                          isLeftColumn ? 'left-full ml-2' : 'right-full mr-2'
                        }`}
                      >
                        <div
                          className="relative w-48 h-48 rounded-lg overflow-hidden"
                          style={{ background: '#16213e', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                          <video
                            ref={(el) => { previewVideoRefs.current[item.id] = el; }}
                            src={item.video}
                            autoPlay
                            muted
                            playsInline
                            preload="metadata"
                            className="w-full h-full object-cover"
                            onTimeUpdate={(e) => {
                              const v = e.currentTarget;
                              if (v.currentTime >= 10) {
                                v.pause();
                                v.currentTime = 0;
                                v.play().catch(() => {});
                              }
                            }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}

                <div className="relative z-10 h-full" style={{ fontFamily: 'monospace' }}>
                  <span className="absolute top-0 left-0 right-0 text-white text-[13px] font-medium leading-tight line-clamp-2">
                    {item.title}
                  </span>
                  <span className="absolute bottom-0 left-0 text-white/60 text-[11px]">
                    {item.year}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {openModal && selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center"
              onClick={() => setOpenModal(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  width: width,
                  height: height,
                  border: '1px solid #3C3C3C',
                  borderRadius: 8,
                  x, y,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="w-full h-full flex flex-col"
                  style={{
                    border: '6px solid #1A1A1A',
                    borderRadius: 8,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    className="flex items-center justify-between flex-shrink-0 relative cursor-grab active:cursor-grabbing"
                    style={{
                      height: 32,
                      backgroundColor: '#1A1A1A',
                      marginTop: -6, marginLeft: -6, marginRight: -6,
                      paddingTop: 6, paddingLeft: 8, paddingRight: 8,
                    }}
                    onMouseDown={(e) => {
                      if ((e.target as HTMLElement).closest('button')) return;
                      e.preventDefault();
                      const startX = e.clientX;
                      const startY = e.clientY;
                      const sx = x.get();
                      const sy = y.get();
                      const onMove = (ev: MouseEvent) => {
                        x.set(sx + ev.clientX - startX);
                        y.set(sy + ev.clientY - startY);
                      };
                      const onUp = () => {
                        document.removeEventListener('mousemove', onMove);
                        document.removeEventListener('mouseup', onUp);
                      };
                      document.addEventListener('mousemove', onMove, { passive: false });
                      document.addEventListener('mouseup', onUp);
                    }}
                  >
                    <div className="grid grid-cols-2" style={{ gap: 3 }}>
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-0.5 h-0.5 rounded-full" style={{ backgroundColor: '#8D8D8D' }} />
                      ))}
                    </div>
                    <span className="text-gray-300 text-[10px] font-medium pointer-events-none absolute left-1/2 -translate-x-1/2" style={{ fontFamily: 'monospace' }}>
                      {selectedItem.title}
                    </span>
                    <button
                      onClick={() => setOpenModal(null)}
                      className="text-gray-300 hover:text-white text-[10px] font-medium transition-colors cursor-pointer"
                      style={{ fontFamily: 'monospace' }}
                    >
                      [CLOSE]
                    </button>
                  </div>

                  <div className="flex-1 relative overflow-hidden bg-[#292929]">
                    {selectedItem.video && (
                      <>
                        <video
                          ref={videoRef}
                          src={selectedItem.video}
                          autoPlay
                          loop
                          muted={isMuted}
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover"
                          poster={selectedItem.image}
                        />
                        <button
                          onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                          className="absolute bottom-1.5 left-1.5 z-30 w-6 h-6 rounded-full bg-[#292929]/60 hover:bg-[#292929]/80 flex items-center justify-center transition-colors backdrop-blur-sm cursor-pointer"
                          aria-label={isMuted ? 'Unmute' : 'Mute'}
                        >
                          {isMuted ? (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 5L6 9H2v6h4l5 4V5z" />
                              <line x1="23" y1="9" x2="17" y2="15" />
                              <line x1="17" y1="9" x2="23" y2="15" />
                            </svg>
                          ) : (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 5L6 9H2v6h4l5 4V5z" />
                              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                            </svg>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

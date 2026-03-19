'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useCallback, useState, memo } from 'react';
import { motion } from 'framer-motion';
import { WORK_ITEMS } from '@/lib/work-items';
import type { WorkItem } from '@/lib/work-items';

type FilterValue = 'all' | WorkItem['category'];

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'interaction', label: 'Interaction' },
  { value: 'product', label: 'Product' },
  { value: 'film', label: 'Film' },
  { value: 'writing', label: 'Writing' },
];

// ─────────────────────────────────────────────────────────────
// Scroll restoration: run before paint, re-apply after layout, don't clear key immediately
// ─────────────────────────────────────────────────────────────
const MAIN_SCROLL_ID = 'main-scroll';

function applyScroll(el: HTMLElement | null, top: number) {
  if (!el) {
    window.scrollTo({ top, behavior: 'auto' });
    return;
  }
  el.scrollTop = top;
}

function useCraftScrollRestore() {
  useLayoutEffect(() => {
    const saved = sessionStorage.getItem('craft-scroll');
    if (saved == null) return;
    const top = parseInt(saved, 10);
    if (Number.isNaN(top) || top < 0) return;

    const el = document.getElementById(MAIN_SCROLL_ID);

    // Apply immediately (before paint) so we win any race with Next.js or layout
    applyScroll(el, top);

    // Re-apply after layout settles so we're correct once masonry/media have height
    const getEl = () => document.getElementById(MAIN_SCROLL_ID);
    const t1 = setTimeout(() => applyScroll(getEl(), top), 100);
    const t2 = setTimeout(() => applyScroll(getEl(), top), 300);

    // Clear key only after delay so a second mount (e.g. after /craft → / redirect) can still restore
    const tClear = setTimeout(() => sessionStorage.removeItem('craft-scroll'), 600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(tClear);
    };
  }, []);
}

// ─────────────────────────────────────────────────────────────
// Neural preview card: fixed 4/3 frame, lazy video, blur reveal
// ─────────────────────────────────────────────────────────────
function NeuralPreviewCard({
  onNavigate,
  dimmed,
  hideWhenFiltered,
  isMobile,
}: {
  onNavigate: () => void;
  dimmed?: boolean;
  hideWhenFiltered?: boolean;
  isMobile: boolean;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const srcSetRef = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    const video = videoRef.current;
    if (!card || !video) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            if (!srcSetRef.current) {
              video.src = '/videos/neural.mp4';
              srcSetRef.current = true;
            }
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.2, rootMargin: '200px' }
    );
    io.observe(card);
    return () => io.disconnect();
  }, []);

  return (
    <a
      ref={cardRef}
      href="/?view=neural"
      onClick={(e) => {
        e.preventDefault();
        onNavigate();
      }}
      style={{
        display: hideWhenFiltered ? 'none' : 'inline-block',
        width: '100%',
        marginBottom: '12px',
        breakInside: 'avoid',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
        verticalAlign: 'top',
        textDecoration: 'none',
        color: 'inherit',
        opacity: dimmed ? 0.25 : 1,
        transition: 'opacity 0.2s ease',
        background: '#0a0a0a',
        border: '3px solid #1C1C1C',
        boxShadow: '0 0 0 1px #2E2E2E, 0 0 12px rgba(0,0,0,0.2)',
      }}
      className="work-masonry-card"
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4/3',
          overflow: 'hidden',
          background: '#0a0a0a',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={() => {
            if (videoRef.current) videoRef.current.style.opacity = '1';
            setIsLoaded(true);
          }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit: 'cover',
            opacity: 0,
            transition: 'opacity 0.4s ease',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            opacity: isLoaded ? 0 : 1,
            transition: 'opacity 0.4s ease',
            pointerEvents: 'none',
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: 52,
          zIndex: 2,
          opacity: 0,
          transition: 'opacity 0.2s',
        }}
        className="work-view-production-btn"
      >
        <span
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            fontSize: 12,
            color: '#fff',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 6,
            padding: '6px 14px',
            display: 'inline-block',
          }}
        >
          Explore
        </span>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: '20px 16px 18px',
          minHeight: 56,
          background: isMobile
            ? 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.6) 85%, rgba(0,0,0,0.85) 100%)'
            : 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.08) 70%, rgba(0,0,0,0.22) 80%, rgba(0,0,0,0.45) 90%, rgba(0,0,0,0.7) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>
          Neural network
        </span>
        <span
          style={{
            fontSize: 12,
            fontFamily: 'var(--font-geist-mono), monospace',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          Explore
        </span>
      </div>
    </a>
  );
}

// ─────────────────────────────────────────────────────────────
// Masonry card: video (or placeholder for writing without video) + overlay
// ─────────────────────────────────────────────────────────────
const MasonryCard = memo(function MasonryCard({
  item,
  onNavigate,
  dimmed,
  hideWhenFiltered,
  isMobile,
}: {
  item: WorkItem;
  onNavigate: () => void;
  dimmed: boolean;
  hideWhenFiltered?: boolean;
  isMobile: boolean;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const srcSetRef = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasVideo = !!item.video;
  const cardImage = item.cardImage;
  const useImageOnCard = !!cardImage;

  // Both observers: attach after one frame so scroll restore has run; reset video on unmount
  useEffect(() => {
    if (!hasVideo) return;
    let raf: number;
    let io1: IntersectionObserver | undefined;
    let io2: IntersectionObserver | undefined;

    raf = requestAnimationFrame(() => {
      const card = cardRef.current;
      if (!card) return;
      io1 = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            const video = videoRef.current;
            if (!srcSetRef.current && video && item.video) {
              const start = item.videoStart ?? 0;
              video.src = `${item.video}#t=${start === 0 ? 0.01 : start}`;
              srcSetRef.current = true;
            }
            io1?.disconnect();
          }
        },
        { rootMargin: '400px', threshold: 0 }
      );
      io1.observe(card);

      io2 = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            const video = videoRef.current;
            if (e.isIntersecting) {
              video?.play().catch(() => {});
            } else {
              video?.pause();
            }
          }
        },
        { threshold: 0.2 }
      );
      io2.observe(card);
    });

    return () => {
      cancelAnimationFrame(raf);
      io1?.disconnect();
      io2?.disconnect();
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
        videoRef.current.load();
      }
      srcSetRef.current = false;
    };
  }, [hasVideo, item.video]);

  const year = item.year ?? '';

  return (
    <a
      ref={cardRef}
      href={item.href}
      onClick={(e) => {
        e.preventDefault();
        onNavigate();
      }}
      style={{
        display: hideWhenFiltered ? 'none' : 'inline-block',
        width: '100%',
        marginBottom: '12px',
        breakInside: 'avoid',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
        verticalAlign: 'top',
        textDecoration: 'none',
        color: 'inherit',
        opacity: dimmed ? 0.25 : 1,
        transition: 'opacity 0.2s ease',
        background: '#111',
        border: '3px solid #1C1C1C',
        boxShadow: '0 0 0 1px #2E2E2E, 0 0 12px rgba(0,0,0,0.2)',
      }}
      className="work-masonry-card"
    >
      {useImageOnCard ? (
        <div
          style={{
            width: '100%',
            aspectRatio: isMobile ? '4/3' : (item.cardAspectRatio ?? '4/3'),
            overflow: 'hidden',
            display: 'block',
          }}
        >
          <img
            src={cardImage!}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              objectFit: 'cover',
              aspectRatio: isMobile ? '4/3' : (item.cardAspectRatio ?? '4/3'),
              ...(cardImage === '/images/essays/retro_vintage.png'
                ? { transform: `scale(${isMobile ? 1.2 : 1.1})`, transformOrigin: 'center center' }
                : {}),
            }}
          />
        </div>
      ) : hasVideo ? (
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: isMobile ? '4/3' : (item.cardAspectRatio ?? '4/3'),
            overflow: 'hidden',
            background: '#0a0a0a',
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop={item.videoLoopSec == null}
            playsInline
            preload="none"
            onCanPlay={() => {
              if (videoRef.current) videoRef.current.style.opacity = '1';
              setIsLoaded(true);
            }}
            onTimeUpdate={() => {
              const v = videoRef.current;
              const start = item.videoStart ?? 0;
              const loopSec = item.videoLoopSec;
              if (v && loopSec != null && v.currentTime >= start + loopSec) {
                v.currentTime = start;
              }
            }}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              display: 'block',
              objectFit: 'cover',
              opacity: 0,
              transition: 'opacity 0.4s ease',
              ...(item.videoScale != null
                ? {
                    transform: `scale(${item.videoScale})`,
                    transformOrigin: 'center center',
                  }
                : {}),
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              opacity: isLoaded ? 0 : 1,
              transition: 'opacity 0.4s ease',
              pointerEvents: 'none',
            }}
          />
        </div>
      ) : (
        <div
          style={{
            width: '100%',
            aspectRatio: '4/3',
            background: '#1a1a1a',
            display: 'block',
          }}
        />
      )}
      {/* View Production button — above overlay, visible on hover (desktop) or always (mobile); hide when card shows image */}
      {hasVideo && !useImageOnCard && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            bottom: 52,
            zIndex: 2,
            opacity: 0,
            transition: 'opacity 0.2s',
          }}
          className="work-view-production-btn"
        >
          <span
            style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: 12,
              color: '#fff',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 6,
              padding: '6px 14px',
              display: 'inline-block',
            }}
          >
            View Production
          </span>
        </div>
      )}
      {/* Bottom overlay: gradient + title + year */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: '20px 16px 18px',
          minHeight: 56,
          background: isMobile
            ? 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.6) 85%, rgba(0,0,0,0.85) 100%)'
            : 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.08) 70%, rgba(0,0,0,0.22) 80%, rgba(0,0,0,0.45) 90%, rgba(0,0,0,0.7) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: '#fff',
          }}
        >
          {item.title}
        </span>
        {year ? (
          <span
            style={{
              fontSize: 12,
              fontFamily: 'var(--font-geist-mono), monospace',
              color: 'rgba(255,255,255,0.5)',
              flexShrink: 0,
            }}
          >
            {year}
          </span>
        ) : null}
      </div>
    </a>
  );
});

export default function CraftPage() {
  const router = useRouter();
  useCraftScrollRestore();

  const [isMobile, setIsMobile] = useState(false);
  const [filter, setFilter] = useState<FilterValue>('all');

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let last = 0;
    const throttleMs = 150;
    const check = () => {
      const now = Date.now();
      if (now - last >= throttleMs || last === 0) {
        last = now;
        setIsMobile(window.innerWidth < 768);
      } else if (timeout == null) {
        timeout = setTimeout(() => {
          timeout = null;
          last = Date.now();
          setIsMobile(window.innerWidth < 768);
        }, throttleMs - (now - last));
      }
    };
    setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('resize', check);
      if (timeout != null) clearTimeout(timeout);
    };
  }, []);

  const saveCraftScroll = useCallback(() => {
    if (typeof document === 'undefined') return;
    const el = document.getElementById(MAIN_SCROLL_ID);
    const top = el ? el.scrollTop : window.scrollY;
    sessionStorage.setItem('craft-scroll', String(top));
  }, []);

  const handleCardClick = useCallback(
    (item: WorkItem) => {
      saveCraftScroll();
      router.push(item.href);
    },
    [router, saveCraftScroll]
  );

  const handleNeuralPreviewClick = useCallback(() => {
    saveCraftScroll();
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('splashDone', 'true');
    router.push('/?view=neural');
  }, [router, saveCraftScroll]);

  const handleFilterClick = useCallback((value: FilterValue) => {
    setFilter((prev) => (prev === value ? 'all' : value));
  }, []);

  return (
    <>
      <style>{`
        .work-masonry-card:hover .work-view-production-btn {
          opacity: 1;
        }
        @media (max-width: 767px) {
          .work-view-production-btn {
            display: none !important;
          }
        }
      `}</style>
      <div
        style={{
          background: '#0a0a0a',
          minHeight: '100dvh',
        }}
      >
        {/* Filter bar — fixed at bottom like neural view */}
        <div
          role="group"
          aria-label="Filter by category"
          style={{
            position: 'fixed',
            left: 24,
            bottom: 48,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            backdropFilter: 'blur(16px)',
            background: 'rgba(28,28,32,0.92)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 8,
            padding: '5px 10px 5px 8px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.15)',
            fontFamily: 'var(--font-geist-sans), sans-serif',
          }}
        >
              {FILTER_OPTIONS.map(({ value, label }) => {
                const isAll = value === 'all';
                const selected = (isAll && filter === 'all') || (!isAll && filter === value);
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleFilterClick(value)}
                    aria-pressed={selected}
                    aria-label={isAll ? 'Show all' : `Filter by ${label}`}
                    style={{
                      padding: '4px 12px',
                      borderRadius: 8,
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: 11,
                      fontWeight: 500,
                      background: selected ? '#fff' : 'transparent',
                      color: selected ? '#1a1a1a' : 'rgba(255,255,255,0.65)',
                      transition: 'background 0.15s ease, color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!selected) e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = selected ? '#fff' : 'transparent';
                    }}
                  >
                    {label}
                  </button>
                );
              })}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            columns: isMobile ? 1 : 3,
            columnGap: '12px',
            padding: '72px 24px 24px',
          }}
        >
          {isMobile ? (
            <>
              {WORK_ITEMS[0] && (
                <MasonryCard
                  key={WORK_ITEMS[0].id}
                  item={WORK_ITEMS[0]}
                  onNavigate={() => handleCardClick(WORK_ITEMS[0]!)}
                  dimmed={filter !== 'all' && WORK_ITEMS[0].category !== filter}
                  hideWhenFiltered={filter !== 'all' && WORK_ITEMS[0].category !== filter}
                  isMobile={true}
                />
              )}
              {WORK_ITEMS[15] && (
                <MasonryCard
                  key={WORK_ITEMS[15].id}
                  item={WORK_ITEMS[15]}
                  onNavigate={() => handleCardClick(WORK_ITEMS[15]!)}
                  dimmed={filter !== 'all' && WORK_ITEMS[15].category !== filter}
                  hideWhenFiltered={filter !== 'all' && WORK_ITEMS[15].category !== filter}
                  isMobile={true}
                />
              )}
              {WORK_ITEMS[2] && (
                <MasonryCard
                  key={WORK_ITEMS[2].id}
                  item={WORK_ITEMS[2]}
                  onNavigate={() => handleCardClick(WORK_ITEMS[2]!)}
                  dimmed={filter !== 'all' && WORK_ITEMS[2].category !== filter}
                  hideWhenFiltered={filter !== 'all' && WORK_ITEMS[2].category !== filter}
                  isMobile={true}
                />
              )}
              <NeuralPreviewCard
                onNavigate={handleNeuralPreviewClick}
                dimmed={filter !== 'all' && filter !== 'interaction'}
                hideWhenFiltered={filter !== 'all' && filter !== 'interaction'}
                isMobile={isMobile}
              />
              {/* Rest: FedCaddy (5) ↔ Engineering at Promise (11) swapped */}
              {[1, 3, 4, 11, 6, 7, 8, 9, 10, 5, 12, 13, 14, 16, 17, 18, 19, 20].map((i) => {
                const item = WORK_ITEMS[i];
                return item ? (
                  <MasonryCard
                    key={item.id}
                    item={item}
                    onNavigate={() => handleCardClick(item)}
                    dimmed={filter !== 'all' && item.category !== filter}
                    hideWhenFiltered={filter !== 'all' && item.category !== filter}
                    isMobile={true}
                  />
                ) : null;
              })}
            </>
          ) : (
            <>
              {WORK_ITEMS[0] && (
                <MasonryCard
                  key={WORK_ITEMS[0].id}
                  item={WORK_ITEMS[0]}
                  onNavigate={() => handleCardClick(WORK_ITEMS[0]!)}
                  dimmed={filter !== 'all' && WORK_ITEMS[0].category !== filter}
                  hideWhenFiltered={filter !== 'all' && WORK_ITEMS[0].category !== filter}
                  isMobile={false}
                />
              )}
              <NeuralPreviewCard
                onNavigate={handleNeuralPreviewClick}
                dimmed={filter !== 'all' && filter !== 'interaction'}
                hideWhenFiltered={filter !== 'all' && filter !== 'interaction'}
                isMobile={isMobile}
              />
              {WORK_ITEMS[2] && (
                <MasonryCard
                  key={WORK_ITEMS[2].id}
                  item={WORK_ITEMS[2]}
                  onNavigate={() => handleCardClick(WORK_ITEMS[2]!)}
                  dimmed={filter !== 'all' && WORK_ITEMS[2].category !== filter}
                  hideWhenFiltered={filter !== 'all' && WORK_ITEMS[2].category !== filter}
                  isMobile={false}
                />
              )}
              {WORK_ITEMS[1] && (
                <MasonryCard
                  key={WORK_ITEMS[1].id}
                  item={WORK_ITEMS[1]}
                  onNavigate={() => handleCardClick(WORK_ITEMS[1]!)}
                  dimmed={filter !== 'all' && WORK_ITEMS[1].category !== filter}
                  hideWhenFiltered={filter !== 'all' && WORK_ITEMS[1].category !== filter}
                  isMobile={false}
                />
              )}
              {WORK_ITEMS.slice(3).map((item) => (
                <MasonryCard
                  key={item.id}
                  item={item}
                  onNavigate={() => handleCardClick(item)}
                  dimmed={filter !== 'all' && item.category !== filter}
                  hideWhenFiltered={filter !== 'all' && item.category !== filter}
                  isMobile={false}
                />
              ))}
            </>
          )}
        </motion.div>
      </div>
    </>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useCallback, useState, memo } from 'react';
import { motion } from 'framer-motion';
import { WORK_ITEMS } from '@/lib/work-items';
import type { WorkItem } from '@/lib/work-items';

type FilterValue = 'all' | WorkItem['category'];

/** Last in WORK_ITEMS; craft renders this card first without renumbering other indices */
const CRAFT_RAMIN_SKILL_INDEX = WORK_ITEMS.findIndex((w) => w.id === 'ramin-skill');

/** Featured early in masonry; excluded from tail so it doesn’t render twice */
const CRAFT_PROMISE_CONSOLE_INDEX = WORK_ITEMS.findIndex((w) => w.id === 'promise-console');

/** Indices pinned in the first row (after neural); must not appear again in tail (avoids duplicate keys + duplicate cards). */
function filterTailExcludedFromFeatured(i: number): boolean {
  if (CRAFT_PROMISE_CONSOLE_INDEX >= 0 && i === CRAFT_PROMISE_CONSOLE_INDEX) return false;
  if (CRAFT_RAMIN_SKILL_INDEX >= 0 && i === CRAFT_RAMIN_SKILL_INDEX) return false;
  return true;
}

/** FedCaddy + Slice of Pie: same relative order as the rest, but rendered last in the masonry tails */
const CRAFT_FILM_TO_BOTTOM: number[] = [WORK_ITEMS.findIndex((w) => w.id === 'film-02'), WORK_ITEMS.findIndex((w) => w.id === 'film-04')].filter((i) => i >= 0);

const CRAFT_DESKTOP_TAIL_INDICES = (() => {
  // Indices 0–3 are covered by the fixed desktop row (0, 2, 3, 1); tail starts at 4 to avoid duplicates.
  const tail = Array.from({ length: WORK_ITEMS.length - 5 }, (_, i) => i + 4);
  const move = new Set(CRAFT_FILM_TO_BOTTOM);
  const arr = [...tail.filter((i) => !move.has(i)), ...CRAFT_FILM_TO_BOTTOM.slice().sort((a, b) => a - b)];
  // Swap ai-document (16) ↔ m8 Commercial (19) in desktop masonry only; all other relative order unchanged.
  const iDoc = arr.indexOf(16);
  const iM8 = arr.indexOf(19);
  if (iDoc >= 0 && iM8 >= 0) {
    [arr[iDoc], arr[iM8]] = [arr[iM8], arr[iDoc]];
  }
  return arr.filter(filterTailExcludedFromFeatured);
})();

/** Index `2` (Promise website) is pinned early in the mobile slot list, not in the tail. */
const CRAFT_MOBILE_TAIL_BASE = [1, 4, 5, 12, 7, 8, 9, 10, 11, 6, 13, 14, 15, 17, 18, 19, 20, 21] as const;
const CRAFT_MOBILE_TAIL_INDICES = (() => {
  const move = new Set(CRAFT_FILM_TO_BOTTOM);
  return [
    ...CRAFT_MOBILE_TAIL_BASE.filter(
      (i) => !move.has(i) && filterTailExcludedFromFeatured(i)
    ),
    ...CRAFT_FILM_TO_BOTTOM.slice().sort((a, b) => a - b),
  ];
})();

const CRAFT_DESKTOP_PROMISE_IDX = WORK_ITEMS.findIndex((w) => w.id === 'promise-website');
const CRAFT_DESKTOP_M8_IDX = WORK_ITEMS.findIndex((w) => w.id === 'film-03');

type CraftMasonrySlot =
  | { type: 'work'; index: number }
  | { type: 'neural' };

/** Desktop only: exchange Promise website and m8 Commercial masonry positions (work slots only; neural passes through). */
function swapPromiseM8DesktopSlots(slots: CraftMasonrySlot[]): CraftMasonrySlot[] {
  const a = CRAFT_DESKTOP_PROMISE_IDX;
  const b = CRAFT_DESKTOP_M8_IDX;
  if (a < 0 || b < 0) return slots;
  return slots.map((s) => {
    if (s.type !== 'work') return s;
    if (s.index === a) return { type: 'work' as const, index: b };
    if (s.index === b) return { type: 'work' as const, index: a };
    return s;
  });
}

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
              video.src = 'https://xt6vyscb1zzon7fs.public.blob.vercel-storage.com/videos/neural_video.mp4';
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
        background: '#161616',
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
          background: '#161616',
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
  gridIndex,
}: {
  item: WorkItem;
  onNavigate: () => void;
  dimmed: boolean;
  hideWhenFiltered?: boolean;
  isMobile: boolean;
  gridIndex: number;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const srcSetRef = useRef(false);
  const shouldPlayRef = useRef(false);
  const canPlayHandlerRef = useRef<(() => void) | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasVideo = !!item.video;
  const cardImage = item.cardImage;
  const useImageOnCard = !!cardImage;
  const eagerVideo = gridIndex < 6;

  const tryPlayIfAppropriate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!shouldPlayRef.current) return;
    if (!video.paused) return;
    if (video.readyState < 3) return;
    void video.play().catch(() => {});
  }, []);

  // Lazy src (below fold) + play/pause by visibility; attach after one frame so scroll restore has run
  useEffect(() => {
    if (!hasVideo) return;
    let raf: number;
    let io1: IntersectionObserver | undefined;
    let io2: IntersectionObserver | undefined;

    raf = requestAnimationFrame(() => {
      const card = cardRef.current;
      if (!card) return;

      if (!eagerVideo) {
        io1 = new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (!e.isIntersecting) continue;
              const video = videoRef.current;
              if (!srcSetRef.current && video && item.video) {
                video.src = `${item.video}#t=${(item.videoStart ?? 0) === 0 ? 0.001 : item.videoStart}`;
                srcSetRef.current = true;
              }
              io1?.disconnect();
            }
          },
          { rootMargin: '400px', threshold: 0 }
        );
        io1.observe(card);
      }

      io2 = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            const video = videoRef.current;
            if (e.isIntersecting) {
              shouldPlayRef.current = true;
              tryPlayIfAppropriate();
              if (video && video.paused) {
                if (canPlayHandlerRef.current) {
                  video.removeEventListener('canplay', canPlayHandlerRef.current);
                  canPlayHandlerRef.current = null;
                }
                const handler = () => tryPlayIfAppropriate();
                canPlayHandlerRef.current = handler;
                video.addEventListener('canplay', handler);
              }
            } else {
              shouldPlayRef.current = false;
              video?.pause();
              if (video && canPlayHandlerRef.current) {
                video.removeEventListener('canplay', canPlayHandlerRef.current);
                canPlayHandlerRef.current = null;
              }
            }
          }
        },
        { threshold: 0 }
      );
      io2.observe(card);
    });

    return () => {
      shouldPlayRef.current = false;
      cancelAnimationFrame(raf);
      io1?.disconnect();
      io2?.disconnect();
      if (videoRef.current && canPlayHandlerRef.current) {
        videoRef.current.removeEventListener('canplay', canPlayHandlerRef.current);
        canPlayHandlerRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.pause();
        if (!eagerVideo) {
          videoRef.current.src = '';
          videoRef.current.load();
          srcSetRef.current = false;
        }
      }
    };
  }, [hasVideo, gridIndex, eagerVideo, item.video, item.videoStart, tryPlayIfAppropriate]);

  const year = item.year ?? '';
  const cardFrameAspect = item.cardAspectRatio ?? '4/3';
  const videoFit = item.videoObjectFit ?? 'cover';

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
            aspectRatio: cardFrameAspect,
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
              aspectRatio: cardFrameAspect,
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
            aspectRatio: cardFrameAspect,
            overflow: 'hidden',
            background: '#161616',
          }}
        >
          <video
            ref={videoRef}
            src={
              eagerVideo && item.video
                ? `${item.video}#t=${(item.videoStart ?? 0) === 0 ? 0.001 : item.videoStart}`
                : undefined
            }
            autoPlay
            muted
            loop={item.videoLoopSec == null}
            playsInline
            preload={eagerVideo ? 'metadata' : 'none'}
            onCanPlay={() => {
              if (videoRef.current) videoRef.current.style.opacity = '1';
              setIsLoaded(true);
              tryPlayIfAppropriate();
            }}
            onLoadedData={() => {
              tryPlayIfAppropriate();
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
              objectFit: videoFit,
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

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
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
          background: '#161616',
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
          {(isMobile
            ? [
                ...(CRAFT_PROMISE_CONSOLE_INDEX >= 0
                  ? [{ type: 'work' as const, index: CRAFT_PROMISE_CONSOLE_INDEX }]
                  : []),
                { type: 'neural' as const },
                ...(CRAFT_RAMIN_SKILL_INDEX >= 0
                  ? [{ type: 'work' as const, index: CRAFT_RAMIN_SKILL_INDEX }]
                  : []),
                { type: 'work' as const, index: 0 },
                { type: 'work' as const, index: 2 },
                { type: 'work' as const, index: 16 },
                { type: 'work' as const, index: 3 },
                ...CRAFT_MOBILE_TAIL_INDICES.map((index) => ({
                  type: 'work' as const,
                  index,
                })),
              ]
            : swapPromiseM8DesktopSlots([
                ...(CRAFT_PROMISE_CONSOLE_INDEX >= 0
                  ? [{ type: 'work' as const, index: CRAFT_PROMISE_CONSOLE_INDEX }]
                  : []),
                { type: 'neural' as const },
                ...(CRAFT_RAMIN_SKILL_INDEX >= 0
                  ? [{ type: 'work' as const, index: CRAFT_RAMIN_SKILL_INDEX }]
                  : []),
                { type: 'work' as const, index: 0 },
                { type: 'work' as const, index: 2 },
                { type: 'work' as const, index: 3 },
                { type: 'work' as const, index: 1 },
                ...CRAFT_DESKTOP_TAIL_INDICES.map((index) => ({
                  type: 'work' as const,
                  index,
                })),
              ])
          ).map((slot, gridIndex) =>
            slot.type === 'neural' ? (
              <NeuralPreviewCard
                key="neural-preview"
                onNavigate={handleNeuralPreviewClick}
                dimmed={filter !== 'all' && filter !== 'interaction'}
                hideWhenFiltered={filter !== 'all' && filter !== 'interaction'}
                isMobile={isMobile}
              />
            ) : WORK_ITEMS[slot.index] ? (
              <MasonryCard
                key={`craft-${gridIndex}-${WORK_ITEMS[slot.index].id}`}
                item={WORK_ITEMS[slot.index]}
                onNavigate={() => handleCardClick(WORK_ITEMS[slot.index]!)}
                dimmed={filter !== 'all' && WORK_ITEMS[slot.index].category !== filter}
                hideWhenFiltered={filter !== 'all' && WORK_ITEMS[slot.index].category !== filter}
                isMobile={isMobile}
                gridIndex={gridIndex}
              />
            ) : null
          )}
        </motion.div>
      </div>
    </>
  );
}

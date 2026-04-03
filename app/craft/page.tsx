'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useCallback, useState, memo } from 'react';
import { motion } from 'framer-motion';
import {
  CraftMetafizzyMasonry,
  CRAFT_MASONRY_GUTTER_PX,
  craftMasonryColumnWidthCss,
} from '@/components/CraftMetafizzyMasonry';
import { WORK_ITEMS } from '@/lib/work-items';
import type { WorkItem } from '@/lib/work-items';

type FilterValue = 'all' | WorkItem['category'];

/** Last in WORK_ITEMS; craft renders this card first without renumbering other indices */
const CRAFT_RAMIN_SKILL_INDEX = WORK_ITEMS.findIndex((w) => w.id === 'ramin-skill');

/** Featured early in masonry; excluded from tail so it doesn’t render twice */
const CRAFT_PROMISE_CONSOLE_INDEX = WORK_ITEMS.findIndex((w) => w.id === 'promise-console');

/** Featured directly after Promise Console; excluded from tail */
const CRAFT_NACHA_INDEX = WORK_ITEMS.findIndex((w) => w.id === 'nacha');

/** Rendered last in craft masonry (desktop + mobile); excluded from tail so it isn’t duplicated */
const CRAFT_THISTRACKISCRACK_INDEX = WORK_ITEMS.findIndex((w) => w.id === 'thistrackiscrack');

/** Appended after masonry tail (desktop + mobile); excluded from tail list via featured filter */
const CRAFT_DORITOS_INDEX = WORK_ITEMS.findIndex((w) => w.id === 'doritos-loaded');

/** Tuesday night heartbreak — appended toward bottom; excluded from tail */
const CRAFT_ESSAY03_TUESDAY_INDEX = WORK_ITEMS.findIndex((w) => w.id === 'essay-03');

/** Indices pinned in the first row (after neural); must not appear again in tail (avoids duplicate keys + duplicate cards). */
function filterTailExcludedFromFeatured(i: number): boolean {
  if (CRAFT_PROMISE_CONSOLE_INDEX >= 0 && i === CRAFT_PROMISE_CONSOLE_INDEX) return false;
  if (CRAFT_NACHA_INDEX >= 0 && i === CRAFT_NACHA_INDEX) return false;
  if (CRAFT_RAMIN_SKILL_INDEX >= 0 && i === CRAFT_RAMIN_SKILL_INDEX) return false;
  if (CRAFT_THISTRACKISCRACK_INDEX >= 0 && i === CRAFT_THISTRACKISCRACK_INDEX) return false;
  if (CRAFT_DORITOS_INDEX >= 0 && i === CRAFT_DORITOS_INDEX) return false;
  if (CRAFT_ESSAY03_TUESDAY_INDEX >= 0 && i === CRAFT_ESSAY03_TUESDAY_INDEX) return false;
  return true;
}

/** Film + writing cards render after product/interaction in masonry tails (desktop + mobile). */
const CRAFT_DEPRIORITIZED_INDICES = WORK_ITEMS.map((w, i) =>
  w.category === 'film' || w.category === 'writing' ? i : -1
).filter((i) => i >= 0);

/** Pinned row after neural + ramin-skill: Operator leads, then Promise site, payment status, Craft. */
const CRAFT_PINNED_AFTER_NEURAL = (
  ['operator', 'promise-website', 'payment-status', 'craft'] as const
)
  .map((id) => WORK_ITEMS.findIndex((w) => w.id === id))
  .filter((i) => i >= 0);

const CRAFT_AI_DOC_INDEX = WORK_ITEMS.findIndex((w) => w.id === 'ai-document-verification');
const CRAFT_DESKTOP_M8_IDX = WORK_ITEMS.findIndex((w) => w.id === 'film-03');

/** Rendered right after the pinned row (desktop + mobile); excluded from tail so it isn’t duplicated. */
function filterAiDocFeaturedEarly(i: number): boolean {
  if (CRAFT_AI_DOC_INDEX >= 0 && i === CRAFT_AI_DOC_INDEX) return false;
  return true;
}

const CRAFT_DESKTOP_TAIL_INDICES = (() => {
  const pinned = new Set(CRAFT_PINNED_AFTER_NEURAL);
  // Indices 0–3 sit in the pinned row; tail starts at 4 — same length heuristic as before.
  const tail = Array.from({ length: WORK_ITEMS.length - 5 }, (_, i) => i + 4);
  const move = new Set(CRAFT_DEPRIORITIZED_INDICES);
  const arr = [...tail.filter((i) => !move.has(i)), ...CRAFT_DEPRIORITIZED_INDICES.slice().sort((a, b) => a - b)];
  return arr.filter(
    (i) => filterTailExcludedFromFeatured(i) && !pinned.has(i) && filterAiDocFeaturedEarly(i)
  );
})();

const CRAFT_MOBILE_TAIL_INDICES = (() => {
  const early = new Set(CRAFT_PINNED_AFTER_NEURAL);
  const move = new Set(CRAFT_DEPRIORITIZED_INDICES);
  const rest: number[] = [];
  for (let i = 0; i < WORK_ITEMS.length; i++) {
    if (early.has(i)) continue;
    if (!filterTailExcludedFromFeatured(i)) continue;
    if (!filterAiDocFeaturedEarly(i)) continue;
    rest.push(i);
  }
  return [...rest.filter((i) => !move.has(i)), ...rest.filter((i) => move.has(i)).sort((a, b) => a - b)];
})();

/** Desktop: Zeke Sanders story — tail reorder still references m8 slot handling. */
const CRAFT_FILM05_ZEKE_INDEX = WORK_ITEMS.findIndex((w) => w.id === 'film-05');

type CraftMasonrySlot =
  | { type: 'work'; index: number }
  | { type: 'neural' }
  /** Single masonry cell: Tuesday essay above Thistrackiscrack (avoids horizontalOrder splitting them across columns). */
  | { type: 'work-stack'; indices: readonly [number, number] };

function craftTuesdayThistrackStackSlots(): CraftMasonrySlot[] {
  const t = CRAFT_ESSAY03_TUESDAY_INDEX;
  const tr = CRAFT_THISTRACKISCRACK_INDEX;
  if (t >= 0 && tr >= 0) return [{ type: 'work-stack', indices: [t, tr] as const }];
  const out: CraftMasonrySlot[] = [];
  if (t >= 0) out.push({ type: 'work', index: t });
  if (tr >= 0) out.push({ type: 'work', index: tr });
  return out;
}

function craftSlotLayoutSignature(slots: CraftMasonrySlot[]): string {
  return slots
    .map((s) => {
      if (s.type === 'neural') return 'neural';
      if (s.type === 'work-stack')
        return `stack:${s.indices.map((i) => WORK_ITEMS[i]?.id ?? `i${i}`).join('+')}`;
      return WORK_ITEMS[s.index]?.id ?? `i${s.index}`;
    })
    .join('|');
}

function craftMasonrySlotGridSpan(slot: CraftMasonrySlot): number {
  return slot.type === 'work-stack' ? 2 : 1;
}

/**
 * Desktop tail: Promise website (via swap, index 19) moves up into Zeke’s former position; remove the old Promise
 * tail slot (first m8 index) so it doesn’t duplicate; Zeke is appended after Doritos, before Thistrackiscrack.
 */
function reorderDesktopTailPromiseWebsiteWithZeke(tailIndices: readonly number[]): number[] {
  const zeke = CRAFT_FILM05_ZEKE_INDEX;
  const m8 = CRAFT_DESKTOP_M8_IDX;
  const out: number[] = [];
  let removedFirstM8 = false;
  for (const i of tailIndices) {
    if (m8 >= 0 && i === m8 && !removedFirstM8) {
      removedFirstM8 = true;
      continue;
    }
    if (zeke >= 0 && i === zeke) {
      out.push(m8 >= 0 ? m8 : i);
      continue;
    }
    out.push(i);
  }
  return out;
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
  packInMasonry,
}: {
  onNavigate: () => void;
  dimmed?: boolean;
  hideWhenFiltered?: boolean;
  isMobile: boolean;
  /** Metafizzy Masonry: outer wrapper owns vertical gap. */
  packInMasonry?: boolean;
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
              video.src = 'https://cdn.ramintahbaz.com/videos/neural_video.mp4#t=0.01';
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
        display: hideWhenFiltered ? 'none' : 'block',
        width: '100%',
        marginBottom: packInMasonry ? 0 : '12px',
        breakInside: packInMasonry ? undefined : 'avoid',
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
  packInMasonry,
}: {
  item: WorkItem;
  onNavigate: () => void;
  dimmed: boolean;
  hideWhenFiltered?: boolean;
  isMobile: boolean;
  gridIndex: number;
  packInMasonry?: boolean;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const srcSetRef = useRef(false);
  const shouldPlayRef = useRef(false);
  const canPlayHandlerRef = useRef<(() => void) | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasVideo = !!item.video;
  /** Strip #fragment so we can append `#t=` for start time without duplicating fragments from data URLs. */
  const videoBase = item.video ? item.video.split('#')[0] : '';
  const masonryVideoSrc =
    item.videoOmitSeekFragment || !item.video
      ? videoBase
      : `${videoBase}#t=${(item.videoStart ?? 0) === 0 ? 0.01 : item.videoStart}`;
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
                video.src = masonryVideoSrc;
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
  }, [hasVideo, gridIndex, eagerVideo, item.video, item.videoStart, item.videoOmitSeekFragment, masonryVideoSrc, tryPlayIfAppropriate]);

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
        display: hideWhenFiltered ? 'none' : 'block',
        width: '100%',
        marginBottom: packInMasonry ? 0 : '12px',
        breakInside: packInMasonry ? undefined : 'avoid',
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
            src={eagerVideo && item.video ? masonryVideoSrc : undefined}
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
              ...(item.videoObjectPosition != null
                ? { objectPosition: item.videoObjectPosition }
                : {}),
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

  const mobileSlots: CraftMasonrySlot[] = [
    ...(CRAFT_PROMISE_CONSOLE_INDEX >= 0
      ? [{ type: 'work' as const, index: CRAFT_PROMISE_CONSOLE_INDEX }]
      : []),
    ...(CRAFT_NACHA_INDEX >= 0 ? [{ type: 'work' as const, index: CRAFT_NACHA_INDEX }] : []),
    { type: 'neural' as const },
    ...(CRAFT_RAMIN_SKILL_INDEX >= 0 ? [{ type: 'work' as const, index: CRAFT_RAMIN_SKILL_INDEX }] : []),
    ...CRAFT_PINNED_AFTER_NEURAL.map((index) => ({ type: 'work' as const, index })),
    ...(CRAFT_AI_DOC_INDEX >= 0 ? [{ type: 'work' as const, index: CRAFT_AI_DOC_INDEX }] : []),
    ...CRAFT_MOBILE_TAIL_INDICES.map((index) => ({ type: 'work' as const, index })),
    ...(CRAFT_DORITOS_INDEX >= 0 ? [{ type: 'work' as const, index: CRAFT_DORITOS_INDEX }] : []),
    ...craftTuesdayThistrackStackSlots(),
  ];

  const desktopSlotsOrdered: CraftMasonrySlot[] = [
    ...(CRAFT_PROMISE_CONSOLE_INDEX >= 0
      ? [{ type: 'work' as const, index: CRAFT_PROMISE_CONSOLE_INDEX }]
      : []),
    ...(CRAFT_NACHA_INDEX >= 0 ? [{ type: 'work' as const, index: CRAFT_NACHA_INDEX }] : []),
    { type: 'neural' as const },
    ...(CRAFT_RAMIN_SKILL_INDEX >= 0 ? [{ type: 'work' as const, index: CRAFT_RAMIN_SKILL_INDEX }] : []),
    ...CRAFT_PINNED_AFTER_NEURAL.map((index) => ({ type: 'work' as const, index })),
    ...(CRAFT_AI_DOC_INDEX >= 0 ? [{ type: 'work' as const, index: CRAFT_AI_DOC_INDEX }] : []),
    ...reorderDesktopTailPromiseWebsiteWithZeke(CRAFT_DESKTOP_TAIL_INDICES).map((index) => ({
      type: 'work' as const,
      index,
    })),
    ...(CRAFT_DORITOS_INDEX >= 0 ? [{ type: 'work' as const, index: CRAFT_DORITOS_INDEX }] : []),
    ...(CRAFT_FILM05_ZEKE_INDEX >= 0 ? [{ type: 'work' as const, index: CRAFT_FILM05_ZEKE_INDEX }] : []),
    ...craftTuesdayThistrackStackSlots(),
  ];

  const masonryColumnCount = isMobile ? 1 : 3;
  const masonryItemWidthCss = craftMasonryColumnWidthCss(masonryColumnCount);

  const mobileMasonryKey = `${filter}::${craftSlotLayoutSignature(mobileSlots)}`;
  const desktopMasonryKey = `${filter}::${craftSlotLayoutSignature(desktopSlotsOrdered)}`;

  const renderMasonrySlot = (slot: CraftMasonrySlot, gridIndex: number) => {
    if (slot.type === 'work-stack') {
      const [iTop, iBottom] = slot.indices;
      const topItem = WORK_ITEMS[iTop];
      const bottomItem = WORK_ITEMS[iBottom];
      if (!topItem || !bottomItem) return null;
      return (
        <div
          key="tuesday-thistrack-stack"
          className="craft-masonry-item"
          style={{ width: masonryItemWidthCss, marginBottom: 12 }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: CRAFT_MASONRY_GUTTER_PX,
              width: '100%',
            }}
          >
            <MasonryCard
              item={topItem}
              onNavigate={() => handleCardClick(topItem)}
              dimmed={filter !== 'all' && topItem.category !== filter}
              hideWhenFiltered={filter !== 'all' && topItem.category !== filter}
              isMobile={isMobile}
              gridIndex={gridIndex}
              packInMasonry
            />
            <MasonryCard
              item={bottomItem}
              onNavigate={() => handleCardClick(bottomItem)}
              dimmed={filter !== 'all' && bottomItem.category !== filter}
              hideWhenFiltered={filter !== 'all' && bottomItem.category !== filter}
              isMobile={isMobile}
              gridIndex={gridIndex + 1}
              packInMasonry
            />
          </div>
        </div>
      );
    }

    const reactKey =
      slot.type === 'neural' ? 'neural-preview' : WORK_ITEMS[slot.index]?.id ?? `slot-${gridIndex}`;
    const inner =
      slot.type === 'neural' ? (
        <NeuralPreviewCard
          onNavigate={handleNeuralPreviewClick}
          dimmed={filter !== 'all' && filter !== 'interaction'}
          hideWhenFiltered={filter !== 'all' && filter !== 'interaction'}
          isMobile={isMobile}
          packInMasonry
        />
      ) : WORK_ITEMS[slot.index] ? (
        <MasonryCard
          item={WORK_ITEMS[slot.index]}
          onNavigate={() => handleCardClick(WORK_ITEMS[slot.index]!)}
          dimmed={filter !== 'all' && WORK_ITEMS[slot.index].category !== filter}
          hideWhenFiltered={filter !== 'all' && WORK_ITEMS[slot.index].category !== filter}
          isMobile={isMobile}
          gridIndex={gridIndex}
          packInMasonry
        />
      ) : null;

    if (!inner) return null;

    return (
      <div
        key={reactKey}
        className="craft-masonry-item"
        style={{ width: masonryItemWidthCss, marginBottom: 12 }}
      >
        {inner}
      </div>
    );
  };

  const mapSlotsWithGridIndex = (slots: CraftMasonrySlot[]) => {
    let g = 0;
    return slots.map((slot) => {
      const el = renderMasonrySlot(slot, g);
      g += craftMasonrySlotGridSpan(slot);
      return el;
    });
  };

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
        {isMobile ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{ padding: '72px 24px 24px' }}
          >
            <CraftMetafizzyMasonry layoutKey={mobileMasonryKey} columnCount={1}>
              {mapSlotsWithGridIndex(mobileSlots)}
            </CraftMetafizzyMasonry>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{ padding: '72px 24px 24px' }}
          >
            <CraftMetafizzyMasonry layoutKey={desktopMasonryKey} columnCount={3}>
              {mapSlotsWithGridIndex(desktopSlotsOrdered)}
            </CraftMetafizzyMasonry>
          </motion.div>
        )}
      </div>
    </>
  );
}

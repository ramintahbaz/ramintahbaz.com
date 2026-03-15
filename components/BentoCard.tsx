'use client';
import { useState, useRef, useEffect } from 'react';

interface WorkItem {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  href: string;
  excerpt?: string;
  year?: string;
}

interface BentoCardProps {
  item: WorkItem;
  index: number;
  active: boolean;
  visited?: boolean;
  year?: string;
  minHeight?: number;
  isMobile?: boolean;
  skipEntryAnimation?: boolean;
  startEntryAnimation?: boolean;
  onSelect: () => void;
  onHoverChange?: (item: WorkItem | null, e?: React.MouseEvent<HTMLDivElement>, cardRect?: DOMRect) => void;
}

const ENTRY_DURATION_MS = 500;
const ENTRY_DELAY_PER_INDEX_MS = 60;
const VISITED_PURPLE = 'rgb(153, 51, 255)'; // matches neural view visited node color
const FILTER_OPACITY_DURATION_MS = 200; // fast opacity when changing category filter only

export function BentoCard({ item, index, active, visited = false, year, minHeight = 130, isMobile = false, skipEntryAnimation = false, startEntryAnimation = true, onSelect, onHoverChange }: BentoCardProps) {
  const [hovered, setHovered] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);
  const [useFastFilterTransition, setUseFastFilterTransition] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const rawYear = year ?? item.year;
  const displayYear = rawYear ? (rawYear.match(/\d{4}/)?.[0] ?? '--') : '--';

  useEffect(() => {
    setHovered(false);
  }, []);

  useEffect(() => {
    if (skipEntryAnimation || !startEntryAnimation) return;
    const delay = ENTRY_DURATION_MS + index * ENTRY_DELAY_PER_INDEX_MS;
    const t = setTimeout(() => setAnimationDone(true), delay);
    return () => clearTimeout(t);
  }, [index, skipEntryAnimation, startEntryAnimation]);

  // Fast opacity only for filter changes; keep 2.2s for entry. When skipEntryAnimation, use fast immediately.
  useEffect(() => {
    if (skipEntryAnimation) {
      setUseFastFilterTransition(true);
      return;
    }
    if (!(skipEntryAnimation || animationDone)) return;
    const t = setTimeout(() => setUseFastFilterTransition(true), 2200);
    return () => clearTimeout(t);
  }, [skipEntryAnimation, animationDone]);

  useEffect(() => {
    (document.activeElement as HTMLElement)?.blur();
  }, []);

  useEffect(() => {
    if (!active) setHovered(false);
  }, [active]);

  const entryDelayMs = index * ENTRY_DELAY_PER_INDEX_MS;
  const effectiveDone = skipEntryAnimation || animationDone;
  const runEntryAnimation = !skipEntryAnimation && startEntryAnimation;
  const waitingToStart = !skipEntryAnimation && !startEntryAnimation;

  const showVisitedState = visited && effectiveDone;
  const opacityDuration = useFastFilterTransition ? `${FILTER_OPACITY_DURATION_MS}ms` : '2.2s';

  return (
    <div
      ref={cardRef}
      data-work-id={item.id}
      onMouseEnter={(e) => {
        setHovered(true);
        onHoverChange?.(item, e, cardRef.current?.getBoundingClientRect());
      }}
      onMouseLeave={() => {
        setHovered(false);
        onHoverChange?.(null);
      }}
      onClick={onSelect}
      onTouchEnd={() => setHovered(false)}
      style={{
        position: 'relative',
        cursor: 'pointer',
        gridColumn: 'span 1',
        gridRow: 'span 1',
        minHeight,
        isolation: 'isolate',
        opacity: effectiveDone ? (active ? (showVisitedState ? 0.6 : 1) : 0.29) : (waitingToStart || runEntryAnimation) ? 0 : undefined,
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
        pointerEvents: effectiveDone ? 'auto' : 'none',
        borderRadius: 8,
        overflow: 'hidden',
        animation: runEntryAnimation ? `bentoCardEntry ${ENTRY_DURATION_MS}ms ease-out ${entryDelayMs}ms both` : 'none',
        transform: effectiveDone ? (hovered && !isMobile ? 'translateY(0) scale(0.982)' : 'translateY(0) scale(1)') : waitingToStart ? 'translateY(20px)' : undefined,
        transition: `opacity ${opacityDuration} ease-out, transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease`,
      }}
    >
      {/* Glass layer — separate so year can cut through with mix-blend-mode */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 8,
          boxShadow: hovered && !isMobile
            ? 'inset 0 2px 12px rgba(0,0,0,0.5), inset 0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.28)'
            : 'inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 8px rgba(0,0,0,0.3)',
          background: hovered && !isMobile
            ? 'rgba(255,255,255,0.07)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: hovered && !isMobile ? '1px solid rgba(255,255,255,0.28)' : '1px solid rgba(255,255,255,0.07)',
          borderTop: hovered && !isMobile ? '1px solid rgba(255,255,255,0.32)' : '1px solid rgba(255,255,255,0.11)',
          transition: 'box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease',
        }}
      />
      {/* Thumbnail — absolute, left, always collapsed (no slide-in on hover) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: 0,
        overflow: 'hidden',
        zIndex: 0,
        background: '#000',
      }}>
        {item.thumbnail ? (
          item.thumbnail.match(/\.(mp4|mov|MOV)$/) ? (
            <video
              src={item.thumbnail}
              muted
              loop
              playsInline
              preload="none"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <img
              src={item.thumbnail}
              alt={item.title}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )
        ) : (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: item.category === 'product'
              ? 'linear-gradient(135deg, #3a1520, #1a0a10)'
              : item.category === 'interaction'
              ? 'linear-gradient(135deg, #3a2010, #1a1008)'
              : item.category === 'film'
              ? 'linear-gradient(135deg, #20103a, #10081a)'
              : 'linear-gradient(135deg, #251510, #120a08)',
          }} />
        )}
      </div>

      {/* Content — grid with equal rowGap: category, title, year */}
      <div style={{
        position: 'absolute',
        inset: 0,
        paddingTop: isMobile ? 8 : 12,
        paddingRight: isMobile ? 12 : 14,
        paddingBottom: isMobile ? 8 : 18,
        paddingLeft: 14,
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        gridTemplateColumns: '1fr auto',
        rowGap: isMobile ? 8 : 10,
        zIndex: 2,
        pointerEvents: 'none',
      }}>
          {/* Row 1: category — softer but still readable */}
          <div style={{
            fontSize: isMobile ? 8 : 9,
            fontFamily: 'var(--font-geist-mono), monospace',
            letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
            gridColumn: '2',
            gridRow: '1',
            textAlign: 'right' as const,
            userSelect: 'none' as const,
            color: 'rgba(255,255,255,0.4)',
          }}>
            {item.category}
          </div>

          {/* Row 2: title — left-aligned; purple dot when visited (matches neural view) */}
          <div style={{
            gridColumn: '1 / -1',
            gridRow: '2',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            {visited && (
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: VISITED_PURPLE,
                  boxShadow: `0 0 8px ${VISITED_PURPLE}`,
                  opacity: showVisitedState ? 1 : 0,
                  transition: 'opacity 2.2s ease-in-out',
                }}
                aria-hidden
              />
            )}
            <div style={{
              fontSize: isMobile ? 12 : 14,
              fontWeight: 500,
              color: hovered && !isMobile ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.85)',
              fontFamily: 'var(--font-geist-mono), monospace',
              lineHeight: 1.4,
              transition: 'color 0.2s ease',
            }}>
              {item.title}
            </div>
          </div>

          {/* Row 3: year — same rowGap below title; softer but still readable */}
          <div style={{
            gridColumn: '1',
            gridRow: '3',
            fontSize: isMobile ? 10 : 12,
            fontWeight: 500,
            fontFamily: 'var(--font-geist-mono), monospace',
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.4)',
            alignSelf: 'end',
            userSelect: 'none',
          }}>{displayYear}</div>
        </div>
    </div>
  );
}

'use client';

import { useEffect, useCallback, useState, useRef, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { WorkPageSections, FilmEmbed } from '@/components/WorkPageSections';

const Bloom = dynamic(() => import('@/components/Bloom'), { ssr: false });
const BloomMorphDemo = dynamic(() => import('@/components/bloom-demos/BloomMorphDemo'), { ssr: false });
const BloomDirectionDemo = dynamic(() => import('@/components/bloom-demos/BloomDirectionDemo'), { ssr: false });
const BloomAlignmentDemo = dynamic(() => import('@/components/bloom-demos/BloomAlignmentDemo'), { ssr: false });
const BloomTriggerDemo = dynamic(() => import('@/components/bloom-demos/BloomTriggerDemo'), { ssr: false });
const BloomAccessibilityDemo = dynamic(() => import('@/components/bloom-demos/BloomAccessibilityDemo'), { ssr: false });
const ElectricBorder = dynamic(() => import('@/components/ElectricBorder'), { ssr: false });
const ElectricBorderRawDemo = dynamic(() => import('@/components/electric-border-demos/ElectricBorderRawDemo'), { ssr: false });
const ElectricBorderChaosDemo = dynamic(() => import('@/components/electric-border-demos/ElectricBorderChaosDemo'), { ssr: false });
const ElectricBorderColorDemo = dynamic(() => import('@/components/electric-border-demos/ElectricBorderColorDemo'), { ssr: false });
const ElectricBorderPipelineDemo = dynamic(() => import('@/components/electric-border-demos/ElectricBorderPipelineDemo'), { ssr: false });
const PhotoBoom = dynamic(() => import('@/components/PhotoBoom'), { ssr: false });
const PhotoBoomPeekDemo = dynamic(() => import('@/components/photoboom-demos/PhotoBoomPeekDemo'), { ssr: false });
const PhotoBoomSpringDemo = dynamic(() => import('@/components/photoboom-demos/PhotoBoomSpringDemo'), { ssr: false });
const PhotoBoomCascadeDemo = dynamic(() => import('@/components/photoboom-demos/PhotoBoomCascadeDemo'), { ssr: false });
const CarouselEmbed = dynamic(() => import('@/components/carousel-demos/CarouselEmbed'), { ssr: false });
const CarouselHoverDemo = dynamic(() => import('@/components/carousel-demos/CarouselHoverDemo'), { ssr: false });
const CarouselScrollDemo = dynamic(() => import('@/components/carousel-demos/CarouselScrollDemo'), { ssr: false });
const CarouselMobileDemo = dynamic(() => import('@/components/carousel-demos/CarouselMobileDemo'), { ssr: false });
const PaymentStatus = dynamic(() => import('@/components/PaymentStatus'), { ssr: false });
const PaymentStatusIconsDemo = dynamic(() => import('@/components/payment-status-demos/PaymentStatusIconsDemo'), { ssr: false });
const PaymentStatusShakeDemo = dynamic(() => import('@/components/payment-status-demos/PaymentStatusShakeDemo'), { ssr: false });
const VisualSystemHoverEmbed = dynamic(() => import('@/components/visual-system-hover-demos/VisualSystemHoverEmbed'), { ssr: false });
const GridHoverDemo = dynamic(() => import('@/components/visual-system-hover-demos/GridHoverDemo'), { ssr: false });
const PreviewPositionDemo = dynamic(() => import('@/components/visual-system-hover-demos/PreviewPositionDemo'), { ssr: false });
const WindowDemo = dynamic(() => import('@/components/visual-system-hover-demos/WindowDemo'), { ssr: false });
const AIDocVerificationEmbed = dynamic(() => import('@/components/ai-document-verification-demos/AIDocVerificationEmbed'), { ssr: false });
const ReviewQueueDemo = dynamic(() => import('@/components/ai-document-verification-demos/ReviewQueueDemo'), { ssr: false });
const CoCreatorEmbed = dynamic(() => import('@/components/co-creator-demos/CoCreatorEmbed'), { ssr: false });
const FingerprintDemo = dynamic(() => import('@/components/co-creator-demos/FingerprintDemo'), { ssr: false });
const SunsetEmbed = dynamic(() => import('@/components/sunset-demos/SunsetEmbed'), { ssr: false });
const SunsetCardDemo = dynamic(() => import('@/components/sunset-demos/SunsetCardDemo'), { ssr: false });
const NotificationDemo = dynamic(() => import('@/components/sunset-demos/NotificationDemo'), { ssr: false });
const CraftEmbed = dynamic(() => import('@/components/craft-demos/CraftEmbed'), { ssr: false });
const ComponentPreviewDemo = dynamic(() => import('@/components/craft-demos/ComponentPreviewDemo'), { ssr: false });
const ControlsPanelDemo = dynamic(() => import('@/components/craft-demos/ControlsPanelDemo'), { ssr: false });
const KeycadetsEmbed = dynamic(() => import('@/components/keycadets-demos/KeycadetsEmbed'), { ssr: false });
const RetailMapDemo = dynamic(() => import('@/components/keycadets-demos/RetailMapDemo'), { ssr: false });
const ThisTrackIsCrackEmbed = dynamic(() => import('@/components/thistrackiscrack-demos/ThisTrackIsCrackEmbed'), { ssr: false });
const DoritosEmbed = dynamic(() => import('@/components/doritos-demos/DoritosEmbed'), { ssr: false });
const OrderingFlowDemo = dynamic(() => import('@/components/doritos-demos/OrderingFlowDemo'), { ssr: false });
const OrderingFlowImages = dynamic(() => import('@/components/doritos-demos/OrderingFlowImages'), { ssr: false });
const PromiseWebsiteHero = dynamic(
  () => import('@/components/work/PromiseWebsiteHero').then((m) => ({ default: m.PromiseWebsiteHero })),
  { ssr: false }
);
const PromiseWebsiteDashboard = dynamic(
  () => import('@/components/work/PromiseWebsiteDashboard').then((m) => ({ default: m.PromiseWebsiteDashboard })),
  { ssr: false }
);

// Word timestamps JSON shape (from generate-audio.mjs)
interface WordTimestampsJson {
  words: { word: string; startTime: number; endTime: number }[];
}

const READ_ALOUD_ENABLED = false; // TTS / read-aloud in writing modals (set true when audio is available)

function useReadAloud(project: ProjectModalProject) {
  const [hasAudio, setHasAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [wordTimes, setWordTimes] = useState<{ start: number; end: number }[]>([]);
  const wordTimesRef = useRef<{ start: number; end: number }[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isWriting = project?.category === 'writing' && project?.id;

  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!isWriting || !READ_ALOUD_ENABLED) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/audio/${project!.id}.json`);
        if (!res.ok || cancelled) return;
        const data: WordTimestampsJson = await res.json();
        if (!data.words || !Array.isArray(data.words) || cancelled) return;
        const times = data.words.map((w) => ({ start: w.startTime, end: w.endTime }));
        wordTimesRef.current = times;
        if (!cancelled) setWordTimes(times);
        const audio = new Audio(`/audio/${project!.id}.mp3`);
        audio.playbackRate = 0.85; // Slower playback for all writings: highlight feels in sync, easy to follow
        audioRef.current = audio;

        const onEnded = () => {
          setIsPlaying(false);
          setCurrentWordIndex(-1);
        };

        audio.addEventListener('ended', onEnded);
        if (!cancelled) setHasAudio(true);

        cleanupRef.current = () => {
          audio.removeEventListener('ended', onEnded);
          audio.pause();
          audioRef.current = null;
        };
      } catch {
        if (!cancelled) setHasAudio(false);
      }
    })();

    return () => {
      cancelled = true;
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [isWriting, project?.id]);

  // requestAnimationFrame loop for tight sync with display; optional lead so highlight feels ahead of audio
  const SYNC_LEAD_S = 0.04; // seconds to show word slightly before it's spoken (tune if still off)
  useEffect(() => {
    if (!isPlaying || !audioRef.current) return;
    let rafId: number;
    const tick = () => {
      const audio = audioRef.current;
      if (!audio || audio.paused) return;
      const t = audio.currentTime;
      setCurrentTime(t);
      const times = wordTimesRef.current;
      const tWithLead = t + SYNC_LEAD_S;
      let idx = times.findIndex((w) => tWithLead >= w.start && tWithLead <= w.end);
      if (idx < 0) {
        // In a gap: keep highlight on last word that has started
        for (let i = times.length - 1; i >= 0; i--) {
          if (times[i].start <= t) {
            idx = i;
            break;
          }
        }
      }
      setCurrentWordIndex(idx >= 0 ? idx : -1);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying((p) => !p);
  }, [isPlaying]);

  return { hasAudio, isPlaying, currentWordIndex, currentTime, wordTimes, toggle };
}

export type ProjectModalProject = {
  id: string;
  title: string;
  category: 'product' | 'film' | 'interaction' | 'writing';
  description: string;
  year: string;
  thumbnail: string;
  tags: string[];
  link?: string;
  content?: {
    sections: {
      type: 'text' | 'image' | 'code' | 'heading' | 'component' | 'video';
      content?: string;
      language?: string;
      caption?: string;
      componentId?: string;
      variant?: 'body' | 'caption';
      showCopy?: boolean;
      copyContent?: string;
    }[];
  };
} | null;

/** Category label color — matches BentoCard (rgba(255,255,255,0.4)) */
const CATEGORY_LABEL_COLOR = 'rgba(255,255,255,0.4)';

interface ProjectModalProps {
  project: ProjectModalProject;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const readAloud = useReadAloud(project);
  const [modalDragOffset, setModalDragOffset] = useState({ x: 0, y: 0 });
  const [modalDragging, setModalDragging] = useState(false);
  const modalDragStartRef = useRef<{ mouseX: number; mouseY: number; offsetX: number; offsetY: number } | null>(null);
  const [modalSize, setModalSize] = useState<{ w: number; h: number } | null>(null);
  const [modalResizing, setModalResizing] = useState(false);
  const modalResizeStartRef = useRef<{ mouseX: number; mouseY: number; startW: number; startH: number } | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isScrollingRef = useRef(false);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!project) return;
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [project, handleEscape]);

  useEffect(() => {
    if (!modalDragging) return;
    const onMove = (e: MouseEvent) => {
      const start = modalDragStartRef.current;
      if (start) {
        setModalDragOffset({
          x: start.offsetX + (e.clientX - start.mouseX),
          y: start.offsetY + (e.clientY - start.mouseY),
        });
      }
    };
    const onUp = () => {
      modalDragStartRef.current = null;
      setModalDragging(false);
    };
    const onTouchMove = (e: TouchEvent) => {
      const start = modalDragStartRef.current;
      if (start && e.touches.length === 1) {
        setModalDragOffset({
          x: start.offsetX + (e.touches[0].clientX - start.mouseX),
          y: start.offsetY + (e.touches[0].clientY - start.mouseY),
        });
      }
    };
    const onTouchEnd = () => {
      modalDragStartRef.current = null;
      setModalDragging(false);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [modalDragging]);

  if (project == null) return null;

  const categoryColor = CATEGORY_LABEL_COLOR;
  const sections = project.content?.sections ?? [];
  const isWriting = project.category === 'writing';
  const showPlayButton = isWriting && readAloud.hasAudio;
  return (
    <>
      <style>{`
        .project-modal-scroll { scrollbar-color: transparent transparent; scrollbar-width: thin; }
        .project-modal-scroll.project-modal-scroll--scrolling { scrollbar-color: rgba(255,255,255,0.25) transparent; }
        .project-modal-scroll::-webkit-scrollbar { width: 6px; }
        .project-modal-scroll::-webkit-scrollbar-track { background: transparent; }
        .project-modal-scroll::-webkit-scrollbar-thumb { background: transparent; border-radius: 3px; transition: background 0.2s ease; }
        .project-modal-scroll.project-modal-scroll--scrolling::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.25); }
      `}</style>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Project details"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          display: 'flex',
          alignItems: isMobile ? 'flex-end' : 'center',
          justifyContent: 'center',
          padding: isMobile ? 0 : 24,
          paddingTop: isMobile ? 0 : 56,
          background: 'transparent',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.82)',
            pointerEvents: 'none',
          }}
          aria-hidden
        />
        <div
          style={{
            transform: `translate(${modalDragOffset.x}px, ${modalDragOffset.y}px)`,
            transition: modalDragging ? 'none' : 'transform 0.2s ease',
            width: isMobile ? '100%' : 'auto',
            position: 'relative',
            zIndex: 1,
          }}
        >
        <motion.div
          initial={{ opacity: 0, y: isMobile ? 20 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            position: 'relative',
            width: isMobile ? '100%' : 680,
            maxWidth: isMobile ? '100%' : '96vw',
            maxHeight: isMobile ? 'calc(100dvh - 52px)' : '92vh',
            height: isMobile ? 'calc(100dvh - 52px)' : undefined,
            margin: isMobile ? '0' : undefined,
            borderRadius: isMobile ? '16px 16px 0 0' : 14,
            marginTop: isMobile ? 'env(safe-area-inset-top, 0px)' : undefined,
            padding: '7px 14px 14px',
            background: '#1b1b1b',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 48px 120px rgba(0,0,0,0.92), 0 12px 40px rgba(0,0,0,0.7)',
            display: 'flex',
            flexDirection: 'column',
            color: 'rgba(255,255,255,0.9)',
            fontFamily: 'inherit',
            overflow: 'hidden',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              background: '#080808',
              borderRadius: 8,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              minHeight: 0,
            }}
          >
            <div
              style={{
                background: '#1b1b1b',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                padding: '10px 16px 12px',
                minHeight: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                flexShrink: 0,
              }}
            >
              <div
                role="button"
                tabIndex={0}
                aria-label="Drag to move modal"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 3,
                  marginRight: 4,
                  flexShrink: 0,
                  cursor: modalDragging ? 'grabbing' : 'grab',
                  touchAction: 'none',
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  modalDragStartRef.current = {
                    mouseX: e.clientX,
                    mouseY: e.clientY,
                    offsetX: modalDragOffset.x,
                    offsetY: modalDragOffset.y,
                  };
                  setModalDragging(true);
                }}
                onTouchStart={(e) => {
                  if (e.touches.length !== 1) return;
                  modalDragStartRef.current = {
                    mouseX: e.touches[0].clientX,
                    mouseY: e.touches[0].clientY,
                    offsetX: modalDragOffset.x,
                    offsetY: modalDragOffset.y,
                  };
                  setModalDragging(true);
                }}
              >
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 3,
                      height: 3,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.45)',
                    }}
                  />
                ))}
              </div>
              <div style={{ flex: 1, minWidth: 0 }} aria-hidden />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '6px 10px',
                  margin: '-6px -10px',
                  fontFamily: 'ui-monospace, SF Mono, monospace',
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                }}
              >
                [CLOSE]
              </button>
            </div>

            <div
              className={`project-modal-scroll${isScrolling ? ' project-modal-scroll--scrolling' : ''}`}
              style={{
                flex: 1,
                minHeight: 0,
                padding: isMobile
                  ? '24px 20px 40px'
                  : 'clamp(20px, 4vw, 36px) clamp(20px, 5vw, 52px) clamp(20px, 5vw, 52px)',
                height: 'auto',
                maxHeight: isMobile ? 'calc(100vh - 52px - 56px)' : 'calc(92vh - 56px)',
                overflowY: 'auto',
                overflowX: 'visible',
                scrollbarWidth: 'thin',
                transform: 'translateZ(0)',
                contain: 'paint',
                WebkitOverflowScrolling: 'touch',
              }}
              onScroll={() => {
                if (!isScrollingRef.current) {
                  isScrollingRef.current = true;
                  setIsScrolling(true);
                }
                if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
                scrollTimeoutRef.current = setTimeout(() => {
                  isScrollingRef.current = false;
                  setIsScrolling(false);
                  scrollTimeoutRef.current = null;
                }, 1000);
              }}
            >
              <div style={{ maxWidth: 680, margin: '0 auto' }}>
              {isWriting ? (
                <>
                  <p
                    style={{
                      margin: '0 0 8px',
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      flexWrap: 'nowrap',
                      whiteSpace: 'nowrap',
                      fontFamily: 'inherit',
                    }}
                  >
                    <span style={{ color: categoryColor }}>{project.category}</span>
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
                    <span style={{ color: categoryColor }}>{project.year}</span>
                  </p>
                  <h2
                    style={{
                      margin: '0 0 6px',
                      fontSize: 34,
                      fontWeight: 500,
                      letterSpacing: '-0.02em',
                      color: 'rgba(255,255,255,0.95)',
                      fontFamily: 'inherit',
                    }}
                  >
                    {project.title}
                  </h2>
                  <div style={{ marginBottom: 24, height: 1, background: 'rgba(255,255,255,0.05)' }} />
                  {showPlayButton && (
                    <button
                      type="button"
                      onClick={readAloud.toggle}
                      aria-label={readAloud.isPlaying ? 'Pause' : 'Play'}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 16px',
                        borderRadius: 9999,
                        border: '1px solid rgba(184,153,140,0.25)',
                        background: 'rgba(184,153,140,0.05)',
                        color: 'rgba(255,255,255,0.85)',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        fontSize: 13,
                        marginBottom: 28,
                      }}
                    >
                      {readAloud.isPlaying ? (
                        <span style={{ fontSize: 10 }}>‖‖</span>
                      ) : (
                        <span style={{ width: 0, height: 0, borderLeft: '6px solid currentColor', borderTop: '4px solid transparent', borderBottom: '4px solid transparent', marginLeft: 2 }} />
                      )}
                      Listen to essay
                    </button>
                  )}

                  <div style={{ maxWidth: 600 }}>
                    {(() => {
                      let globalWordIndex = 0;
                      return sections.map((section, i) => {
                        if (section.type === 'text') {
                          if ('desktopOnly' in section && (section as { desktopOnly?: boolean }).desktopOnly && isMobile) return null;
                          const paragraphStartIndex = globalWordIndex;
                          const parts = (section.content ?? '').split(/(\s+)/);
                          const nodes: ReactNode[] = [];
                          parts.forEach((part) => {
                            if (/\S/.test(part)) {
                              const idx = globalWordIndex++;
                              const isCurrent =
                                readAloud.isPlaying && idx === readAloud.currentWordIndex;
                              nodes.push(
                                <span
                                  key={idx}
                                  data-word-index={idx}
                                  style={
                                    isCurrent
                                      ? {
                                          background: 'rgba(184, 153, 140, 0.50)',
                                          borderRadius: 3,
                                          padding: '0 3px',
                                          color: 'rgba(255,255,255,0.98)',
                                          transition: 'background 0.1s ease',
                                        }
                                      : undefined
                                  }
                                >
                                  {part}
                                </span>
                              );
                            } else {
                              nodes.push(part);
                            }
                          });
                          const paragraphEndIndex = globalWordIndex;
                          const paragraphStartTime = readAloud.wordTimes[paragraphStartIndex]?.start ?? 0;
                          const paragraphEndTime = readAloud.wordTimes[paragraphEndIndex - 1]?.end ?? 0;
                          const isParagraphActive =
                            readAloud.isPlaying &&
                            readAloud.wordTimes.length > 0 &&
                            paragraphEndIndex > paragraphStartIndex &&
                            readAloud.currentTime >= paragraphStartTime &&
                            readAloud.currentTime <= paragraphEndTime;
                          return (
                            <div
                              key={i}
                              style={{
                                marginBottom: 26,
                                ...(isParagraphActive
                                  ? {
                                      background: 'rgba(184, 153, 140, 0.12)',
                                      outline: '1px solid rgba(184,153,140,0.1)',
                                      borderRadius: 8,
                                      padding: '12px 14px',
                                      transition: 'background 0.3s ease',
                                    }
                                  : {}),
                              }}
                            >
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: 17,
                                  lineHeight: 1.8,
                                  color: 'rgba(255,255,255,0.7)',
                                }}
                              >
                                {nodes}
                              </p>
                            </div>
                          );
                        }
                        if (section.type === 'image') {
                          return (
                            <figure key={i} style={{ margin: '0 0 24px' }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={section.content}
                                alt={section.caption ?? ''}
                                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }}
                              />
                              {section.caption && (
                                <figcaption style={{ marginTop: 8, fontSize: 13, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
                                  {section.caption}
                                </figcaption>
                              )}
                            </figure>
                          );
                        }
                        if (section.type === 'code') {
                          return (
                            <pre
                              key={i}
                              style={{
                                background: '#050505',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                boxShadow: 'inset 0 6px 24px rgba(0,0,0,0.95), inset 0 2px 6px rgba(0,0,0,0.75), inset 0 -2px 0 rgba(255,255,255,0.07), inset 2px 0 8px rgba(0,0,0,0.5), inset -2px 0 8px rgba(0,0,0,0.5)',
                                borderRadius: '10px',
                                padding: '16px 20px',
                                fontFamily: "'SF Mono', 'Fira Code', monospace",
                                fontSize: '13px',
                                lineHeight: '1.6',
                                color: 'rgba(255,255,255,0.75)',
                                overflowX: 'auto',
                                margin: '8px 0 24px',
                                display: 'block',
                                whiteSpace: 'pre',
                              }}
                            >
                              <code>{section.content}</code>
                            </pre>
                          );
                        }
                        if (section.type === 'heading') {
                          return (
                            <h3
                              key={i}
                              style={{
                                fontSize: 15,
                                fontWeight: 600,
                                color: 'rgba(255,255,255,0.9)',
                                margin: '28px 0 8px',
                                letterSpacing: '-0.01em',
                              }}
                            >
                              {section.content}
                            </h3>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'bloom') {
                          return (
                            <div key={i} style={{ margin: '24px 0' }}>
                              <Bloom />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'bloom-morph') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <BloomMorphDemo />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'bloom-direction') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <BloomDirectionDemo />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'bloom-alignment') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <BloomAlignmentDemo />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'bloom-trigger') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <BloomTriggerDemo />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'bloom-accessibility') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <BloomAccessibilityDemo />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'electric-border') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <ElectricBorder />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'electric-border-raw') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <ElectricBorderRawDemo />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'electric-border-chaos') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <ElectricBorderChaosDemo />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'electric-border-color') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <ElectricBorderColorDemo />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'electric-border-pipeline') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <ElectricBorderPipelineDemo />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'photoboom') {
                          return (
                            <div
                              key={i}
                              style={{
                                height: 320,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'visible',
                                margin: '0 0 24px'
                              }}
                            >
                              <div style={{ transform: 'scale(1)', width: '100%', height: '100%', position: 'relative' }}>
                                <PhotoBoom
                                  modalMode
                                  images={[
                                    { id: '1', src: '/images/image1.jpeg', alt: 'Photo 1' },
                                    { id: '2', src: '/images/image2.jpeg', alt: 'Photo 2' },
                                    { id: '3', src: '/images/image3.jpeg', alt: 'Photo 3' },
                                    { id: '4', src: '/images/image4.jpeg', alt: 'Photo 4' },
                                  ]}
                                />
                              </div>
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'photoboom-peek') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <PhotoBoomPeekDemo />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'photoboom-spring') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <PhotoBoomSpringDemo />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'photoboom-cascade') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <PhotoBoomCascadeDemo />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'payment-status') {
                          return (
                            <div key={i} style={{ margin: '24px 0' }}>
                              <PaymentStatus />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'payment-status-icons') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <PaymentStatusIconsDemo />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'payment-status-shake') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <PaymentStatusShakeDemo />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'carousel') {
                          return (
                            <div key={i} style={{ margin: '24px 0' }}>
                              <CarouselEmbed />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'carousel-hover') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <CarouselHoverDemo />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'carousel-scroll') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <CarouselScrollDemo />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'carousel-mobile') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <CarouselMobileDemo />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'visual-system-hover') {
                          return (
                            <div key={i} style={{ margin: '24px 0' }}>
                              <VisualSystemHoverEmbed />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'visual-system-hover-grid') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <GridHoverDemo />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'visual-system-hover-preview') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <PreviewPositionDemo />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'visual-system-hover-window') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <WindowDemo />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'ai-document-verification') {
                          return (
                            <div key={i} style={{ margin: '24px 0' }}>
                              <AIDocVerificationEmbed />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'ai-document-verification-review') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <ReviewQueueDemo />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'promise-website-hero') {
                          return (
                            <div key={i} style={{ margin: '24px 0' }}>
                              <PromiseWebsiteHero />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'promise-website-dashboard') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <PromiseWebsiteDashboard />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'co-creator') {
                          return (
                            <div key={i} style={{ margin: '24px 0' }}>
                              <CoCreatorEmbed />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'co-creator-fingerprint') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <FingerprintDemo />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'sunset') {
                          return (
                            <div key={i} style={{ margin: '24px 0' }}>
                              <SunsetEmbed />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'sunset-card') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <SunsetCardDemo />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'sunset-notification') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <NotificationDemo />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'craft') {
                          return (
                            <div key={i} style={{ margin: '24px 0' }}>
                              <CraftEmbed />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'craft-preview') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <ComponentPreviewDemo />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'craft-controls') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <ControlsPanelDemo />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'keycadets') {
                          return (
                            <div key={i} style={{ margin: '24px 0' }}>
                              <KeycadetsEmbed />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'keycadets-retail') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <RetailMapDemo />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'thistrackiscrack') {
                          return (
                            <div key={i} style={{ margin: '24px 0' }}>
                              <ThisTrackIsCrackEmbed />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'doritos-loaded') {
                          return (
                            <div key={i} style={{ margin: '24px 0' }}>
                              <DoritosEmbed />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'doritos-flow') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <OrderingFlowDemo />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'doritos-flow-images') {
                          return (
                            <div key={i} style={{ margin: '16px 0 32px' }}>
                              <OrderingFlowImages />
                            </div>
                          );
                        }
                        if (section.type === 'component' && section.componentId === 'film-embed') {
                          const src = section.content ?? '';
                          const isVimeo = src.includes('vimeo');
                          return <FilmEmbed key={i} src={src} isVimeo={isVimeo} />;
                        }
                        return null;
                      });
                    })()}
                  </div>
                </>
              ) : (
                <>
                  {(() => {
                    const hasBloomDemo = sections.some((s) => s.type === 'component' && s.componentId === 'bloom');
                    const contentSections = sections.filter((s) => !(s.type === 'component' && s.componentId === 'bloom'));
                    return (
                      <>
                        <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
                          <span style={{ color: categoryColor }}>{project.category}</span>
                          <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
                          <span style={{ color: categoryColor }}>{project.year}</span>
                        </p>
                        <h2 style={{ margin: '0 0 8px', fontSize: 32, fontWeight: 500, lineHeight: 1.2, color: 'rgba(255,255,255,0.95)' }}>
                          {project.title}
                        </h2>
                        {project.tags.length > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: isMobile ? 8 : 20 }}>
                            {project.tags.map((tag) => (
                              <span key={tag} style={{ fontSize: 12, padding: '2px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.65)' }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div style={{ marginTop: isMobile ? 8 : 0 }}>
                          {hasBloomDemo && <Bloom embedBackground />}
                          <WorkPageSections sections={contentSections} />
                        </div>
                      </>
                    );
                  })()}
                </>
              )}
              </div>
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    </>
  );
}

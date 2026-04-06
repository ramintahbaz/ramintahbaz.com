'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

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
const PromiseConsoleDashboard = dynamic(() => import('@/components/demos/PromiseConsoleDashboard'), { ssr: false });
const PromiseConsoleActivity = dynamic(() => import('@/components/demos/PromiseConsoleActivity'), { ssr: false });

export type WorkPageSection = {
  type: 'text' | 'image' | 'code' | 'heading' | 'component' | 'video';
  content?: string;
  language?: string;
  caption?: string;
  componentId?: string;
  /** When true, this section is not rendered on viewports < 768px (e.g. desktop-only copy) */
  desktopOnly?: boolean;
  /** Body copy vs smaller muted line (e.g. under install command) */
  variant?: 'body' | 'caption';
  /** Code row: flex + copy control (e.g. npx install) */
  showCopy?: boolean;
  /** String written to clipboard when showCopy; defaults to content */
  copyContent?: string;
};

export function FilmEmbed({ src, isVimeo }: { src: string; isVimeo: boolean }) {
  const [visible, setVisible] = useState(false);
  return (
    <div
      className="rounded-xl bg-neutral-900"
      style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '56.25%',
        overflow: 'hidden',
        margin: '0 0 32px',
        visibility: visible ? 'visible' : 'hidden',
      }}
    >
      <iframe
        src={isVimeo
          ? `${src}?autoplay=0&title=0&byline=0&portrait=0`
          : `${src}?modestbranding=1&rel=0`}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          border: 'none',
          background: 'transparent',
        }}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        onLoad={() => setVisible(true)}
      />
    </div>
  );
}

interface WorkPageSectionsProps {
  sections: WorkPageSection[];
  /** Work page id — used for per-project video stage styling (letterboxing vs page bg). */
  projectId?: string;
}

function CopyCodeButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? 'Copied' : 'Copy command'}
      style={{
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        margin: 0,
        border: 'none',
        background: 'transparent',
        color: 'rgba(255,255,255,0.65)',
        cursor: 'pointer',
        transition: 'color 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'rgba(255,255,255,0.95)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'rgba(255,255,255,0.65)';
      }}
    >
      {copied ? (
        <span style={{ fontSize: 11, fontFamily: 'var(--font-geist-mono), monospace', letterSpacing: '0.02em' }}>OK</span>
      ) : (
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          style={{ transform: 'scaleX(-1)' }}
        >
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}

export function WorkPageSections({ sections, projectId }: WorkPageSectionsProps) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <>
      {sections.map((section, i) => {
        const firstSectionNoTop = isMobile && i === 0 ? { marginTop: 0 } : {};
        if (section.type === 'text') {
          if (section.desktopOnly && isMobile) return null;
          const caption = section.variant === 'caption';
          return (
            <p
              key={i}
              style={
                caption
                  ? {
                      margin: '10px 0 16px',
                      fontSize: 13,
                      lineHeight: 1.55,
                      color: 'rgba(255,255,255,0.48)',
                      fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
                    }
                  : {
                      margin: '0 0 16px',
                      fontSize: 15,
                      lineHeight: 1.7,
                      color: 'rgba(255,255,255,0.75)',
                      fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
                    }
              }
            >
              {section.content}
            </p>
          );
        }
        if (section.type === 'image') {
          return (
            <figure key={i} style={{ margin: '0 0 24px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={section.content} alt={section.caption ?? ''} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }} />
              {section.caption && <figcaption style={{ marginTop: 8, fontSize: 13, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>{section.caption}</figcaption>}
            </figure>
          );
        }
        if (section.type === 'video' && section.content) {
          const raw = section.content;
          const src = raw.includes('#') ? raw : `${raw}#t=0.01`;
          const videoStageBg =
            projectId === 'spatial-glass' ? '#161616' : '#0a0a0a';
          const videoStageBorder =
            projectId === 'spatial-glass'
              ? 'none'
              : '1px solid rgba(255,255,255,0.08)';
          return (
            <div
              key={i}
              style={{
                margin: '0 0 28px',
                borderRadius: 10,
                overflow: 'hidden',
                background: videoStageBg,
                aspectRatio: '1',
                position: 'relative',
                border: videoStageBorder,
                ...firstSectionNoTop,
              }}
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                src={src}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>
          );
        }
        if (section.type === 'code') {
          const copyTarget = (section.copyContent ?? section.content) ?? '';
          if (section.showCopy) {
            return (
              <div key={i} style={{ margin: '8px 0 0' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    padding: '14px 16px 14px 18px',
                    borderRadius: 10,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: '#050505',
                    boxShadow:
                      '0 4px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)',
                  }}
                >
                  <code
                    style={{
                      flex: 1,
                      minWidth: 0,
                      fontFamily: "'SF Mono', 'Fira Code', ui-monospace, monospace",
                      fontSize: 13,
                      lineHeight: 1.55,
                      color: 'rgba(255,255,255,0.88)',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {section.content}
                  </code>
                  <CopyCodeButton text={copyTarget} />
                </div>
              </div>
            );
          }
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
          if (section.desktopOnly && isMobile) return null;
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
        if (section.type === 'component') {
          if (section.desktopOnly && isMobile) return null;
          const id = section.componentId;
          if (id === 'bloom') return (<div key={i} style={{ margin: '24px 0', ...firstSectionNoTop }}><Bloom /></div>);
          if (id === 'bloom-morph') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><BloomMorphDemo /></div>);
          if (id === 'bloom-direction') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><BloomDirectionDemo /></div>);
          if (id === 'bloom-alignment') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><BloomAlignmentDemo /></div>);
          if (id === 'bloom-trigger') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><BloomTriggerDemo /></div>);
          if (id === 'bloom-accessibility') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><BloomAccessibilityDemo /></div>);
          if (id === 'electric-border') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><ElectricBorder /></div>);
          if (id === 'electric-border-raw') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><ElectricBorderRawDemo /></div>);
          if (id === 'electric-border-chaos') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><ElectricBorderChaosDemo /></div>);
          if (id === 'electric-border-color') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><ElectricBorderColorDemo /></div>);
          if (id === 'electric-border-pipeline') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><ElectricBorderPipelineDemo /></div>);
          if (id === 'photoboom') return (<div key={i} style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible', margin: '0 0 24px', ...firstSectionNoTop }}><div style={{ transform: 'scale(1)', width: '100%', height: '100%', position: 'relative' }}><PhotoBoom modalMode images={[{ id: '1', src: '/images/image1.jpeg', alt: 'Photo 1' }, { id: '2', src: '/images/image2.jpeg', alt: 'Photo 2' }, { id: '3', src: '/images/image3.jpeg', alt: 'Photo 3' }, { id: '4', src: '/images/image4.jpeg', alt: 'Photo 4' }]} /></div></div>);
          if (id === 'photoboom-peek') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><PhotoBoomPeekDemo /></div>);
          if (id === 'photoboom-spring') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><PhotoBoomSpringDemo /></div>);
          if (id === 'photoboom-cascade') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><PhotoBoomCascadeDemo /></div>);
          if (id === 'payment-status') return (<div key={i} style={{ margin: '24px 0', ...firstSectionNoTop }}><PaymentStatus /></div>);
          if (id === 'payment-status-icons') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><PaymentStatusIconsDemo /></div>);
          if (id === 'payment-status-shake') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><PaymentStatusShakeDemo /></div>);
          if (id === 'carousel') return (<div key={i} style={{ margin: '24px 0', ...firstSectionNoTop }}><CarouselEmbed /></div>);
          if (id === 'carousel-hover') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><CarouselHoverDemo /></div>);
          if (id === 'carousel-scroll') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><CarouselScrollDemo /></div>);
          if (id === 'carousel-mobile') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><CarouselMobileDemo /></div>);
          if (id === 'visual-system-hover') return (<div key={i} style={{ margin: '24px 0', ...firstSectionNoTop }}><VisualSystemHoverEmbed /></div>);
          if (id === 'visual-system-hover-grid') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><GridHoverDemo /></div>);
          if (id === 'visual-system-hover-preview') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><PreviewPositionDemo /></div>);
          if (id === 'visual-system-hover-window') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><WindowDemo /></div>);
          if (id === 'ai-document-verification') return (<div key={i} style={{ margin: '24px 0', ...firstSectionNoTop }}><AIDocVerificationEmbed /></div>);
          if (id === 'ai-document-verification-review') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><ReviewQueueDemo /></div>);
          if (id === 'promise-website-hero') return (<div key={i} style={{ margin: '24px 0', ...firstSectionNoTop }}><PromiseWebsiteHero /></div>);
          if (id === 'promise-website-dashboard') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><PromiseWebsiteDashboard /></div>);
          if (id === 'promise-console-dashboard') return (<div key={i} style={{ margin: '24px 0', ...firstSectionNoTop }}><PromiseConsoleDashboard /></div>);
          if (id === 'promise-console-activity') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><PromiseConsoleActivity /></div>);
          if (id === 'co-creator') return (<div key={i} style={{ margin: '24px 0', ...firstSectionNoTop }}><CoCreatorEmbed /></div>);
          if (id === 'co-creator-fingerprint') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><FingerprintDemo /></div>);
          if (id === 'sunset') return (<div key={i} style={{ margin: '24px 0', ...firstSectionNoTop }}><SunsetEmbed /></div>);
          if (id === 'sunset-card') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><SunsetCardDemo /></div>);
          if (id === 'sunset-notification') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><NotificationDemo /></div>);
          if (id === 'craft') return (<div key={i} style={{ margin: '24px 0', ...firstSectionNoTop }}><CraftEmbed /></div>);
          if (id === 'craft-preview') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><ComponentPreviewDemo /></div>);
          if (id === 'craft-controls') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><ControlsPanelDemo /></div>);
          if (id === 'keycadets') return (<div key={i} style={{ margin: '24px 0', ...firstSectionNoTop }}><KeycadetsEmbed /></div>);
          if (id === 'keycadets-retail') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><RetailMapDemo /></div>);
          if (id === 'thistrackiscrack') return (<div key={i} style={{ margin: '24px 0', ...firstSectionNoTop }}><ThisTrackIsCrackEmbed /></div>);
          if (id === 'doritos-loaded') return (<div key={i} style={{ margin: '24px 0', ...firstSectionNoTop }}><DoritosEmbed /></div>);
          if (id === 'doritos-flow') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><OrderingFlowDemo /></div>);
          if (id === 'doritos-flow-images') return (<div key={i} style={{ margin: '16px 0 32px', ...firstSectionNoTop }}><OrderingFlowImages /></div>);
          if (id === 'film-embed') {
            const src = section.content ?? '';
            const isVimeo = src.includes('vimeo');
            return <FilmEmbed key={i} src={src} isVimeo={isVimeo} />;
          }
        }
        return null;
      })}
    </>
  );
}

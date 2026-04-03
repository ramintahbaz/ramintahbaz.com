'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PROJECT_DETAILS } from '@/components/NeuralPortfolio';
import { WorkPageSections } from '@/components/WorkPageSections';

type WorkPageClientProps = {
  id: string | undefined;
};

export function WorkPageClient({ id }: WorkPageClientProps) {
  const router = useRouter();
  const project = id ? PROJECT_DETAILS[id] : undefined;
  const [isDesktop, setIsDesktop] = useState(false);

  if (typeof window !== 'undefined') {
    localStorage.setItem('leftForWork', 'true');
  }

  useEffect(() => {
    if (!project) router.replace('/');
  }, [project, router]);

  useEffect(() => {
    const check = () => setIsDesktop(typeof window !== 'undefined' && window.innerWidth >= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        background: '#161616',
        minHeight: '100dvh',
        color: 'rgba(255,255,255,0.85)',
        padding: isDesktop
          ? '0 0 80px'
          : '0 0 max(104px, calc(80px + env(safe-area-inset-bottom, 0px)))',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr min(720px, 100%) 1fr',
          padding: '32px 20px 0',
          boxSizing: 'border-box',
        }}
      >
        {/* Left gutter — back button lives here, sticky on desktop */}
        <div className="gutter-col" style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 192, paddingTop: 2 }}>
          <div
            style={{
              position: isDesktop ? ('sticky' as const) : undefined,
              top: isDesktop ? 24 : undefined,
              zIndex: isDesktop ? 1 : undefined,
              alignSelf: 'flex-start',
            }}
          >
            <button
              type="button"
              onClick={() => router.push('/craft', { scroll: false })}
              style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontSize: 12,
                letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.65)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                whiteSpace: 'nowrap',
                transition: 'color 0.15s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,1)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
            >
              <svg data-testid="geist-icon" height={12} width={12} viewBox="0 0 16 16" fill="currentColor" style={{ color: 'currentColor', flexShrink: 0 }} strokeLinejoin="round">
                <path fillRule="evenodd" clipRule="evenodd" d="M6.46966 13.7803L6.99999 14.3107L8.06065 13.25L7.53032 12.7197L3.56065 8.75001H14.25H15V7.25001H14.25H3.56065L7.53032 3.28034L8.06065 2.75001L6.99999 1.68935L6.46966 2.21968L1.39644 7.2929C1.00592 7.68342 1.00592 8.31659 1.39644 8.70711L6.46966 13.7803Z" />
              </svg>
              Craft
            </button>
          </div>
        </div>

        {/* Center column — all content */}
        <div className="work-page-center-col">
          <div style={{
            fontSize: 11,
            fontFamily: 'var(--font-geist-mono), monospace',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: 10,
          }}>
            {project.category} · {project.year}
          </div>
          <h1 style={{
            fontSize: 34,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.95)',
            lineHeight: 1.15,
            marginBottom: 8,
          }}>
            {project.title}
          </h1>
          <WorkPageSections sections={project.content?.sections ?? []} />
        </div>

        {/* Right gutter — empty */}
        <div className="gutter-col" />
      </div>

      {!isDesktop ? (
        <div
          style={{
            position: 'fixed',
            left: '50%',
            bottom: 'max(24px, env(safe-area-inset-bottom, 0px))',
            transform: 'translateX(-50%)',
            zIndex: 50,
            pointerEvents: 'auto',
          }}
        >
          <motion.button
            type="button"
            aria-label="Back to craft"
            onClick={() => router.push('/craft', { scroll: false })}
            whileTap={{ scale: 0.9, opacity: 0.82 }}
            transition={{ type: 'spring', stiffness: 520, damping: 28, mass: 0.12 }}
            style={{
              width: 46,
              height: 46,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 0,
              padding: 0,
              cursor: 'pointer',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              color: '#fff',
              background: '#111',
              border: '1px solid #1A1A1A',
              boxShadow: 'none',
            }}
          >
            <svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </motion.button>
        </div>
      ) : null}
    </motion.div>
  );
}

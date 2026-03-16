'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { PROJECT_DETAILS } from '@/components/NeuralPortfolio';
import { WorkPageSections } from '@/components/WorkPageSections';

type WorkPageClientProps = {
  id: string | undefined;
};

export function WorkPageClient({ id }: WorkPageClientProps) {
  const router = useRouter();
  const project = id ? PROJECT_DETAILS[id] : undefined;

  if (typeof window !== 'undefined') {
    localStorage.setItem('leftForWork', 'true');
  }

  useEffect(() => {
    if (!project) router.replace('/');
  }, [project, router]);

  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        background: '#000',
        minHeight: '100dvh',
        color: 'rgba(255,255,255,0.85)',
        padding: '0 0 80px',
      }}
    >
      {/* Content — responsive: narrow on mobile, centered max-width on desktop */}
      <div
        style={{
          padding: '32px 20px 0',
          maxWidth: 720,
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
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
    </motion.div>
  );
}

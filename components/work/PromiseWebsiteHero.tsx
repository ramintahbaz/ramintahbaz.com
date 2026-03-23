'use client';

import { PROMISE_WEBSITE_DEMO_VIDEO } from '@/lib/work-items';

export function PromiseWebsiteHero() {
  const raw = PROMISE_WEBSITE_DEMO_VIDEO;
  const src = raw.includes('#') ? raw : `${raw}#t=0.01`;

  return (
    <div
      style={{
        borderRadius: 10,
        overflow: 'hidden',
        background: '#0a0a0a',
        aspectRatio: '1',
        position: 'relative',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        fontFamily: 'var(--font-geist-sans), sans-serif',
      }}
    >
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
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

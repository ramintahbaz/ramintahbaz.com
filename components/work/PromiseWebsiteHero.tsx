'use client';

import { PROMISE_WEBSITE_DEMO_VIDEO } from '@/lib/work-items';

export function PromiseWebsiteHero() {
  return (
    <div
      style={{
        background: '#0c0c0f',
        border: '1px solid #2E3033',
        borderRadius: 12,
        overflow: 'hidden',
        fontFamily: 'var(--font-geist-sans), sans-serif',
      }}
    >
      <video
        src={PROMISE_WEBSITE_DEMO_VIDEO}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        controls
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
        }}
      />
    </div>
  );
}

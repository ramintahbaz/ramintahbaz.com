'use client';

import { useEffect } from 'react';

/**
 * Preloads the first 2 mobile grid card videos during splash (mobile only).
 * Must match the first 2 items in WORK_ITEMS that have a video (payment-status, craft).
 */
const MOBILE_PRELOAD_VIDEOS = [
  'https://xt6vyscb1zzon7fs.public.blob.vercel-storage.com/videos/payment_processing.mp4',
  'https://xt6vyscb1zzon7fs.public.blob.vercel-storage.com/videos/craft_video.mp4',
];

const PRELOAD_CLEANUP_MS = 4000; // After splash (~3.2s), remove preload elements

export default function MobileVideoPreloader() {
  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth >= 768) return;

    const videos: HTMLVideoElement[] = [];
    let readyCount = 0;
    const onReady = () => {
      readyCount += 1;
      if (readyCount >= MOBILE_PRELOAD_VIDEOS.length && typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('mobilePreloadVideosReady', 'true');
      }
    };

    for (const src of MOBILE_PRELOAD_VIDEOS) {
      const video = document.createElement('video');
      video.preload = 'auto';
      video.muted = true;
      video.playsInline = true;
      video.src = src;
      video.setAttribute('aria-hidden', 'true');
      video.style.position = 'absolute';
      video.style.width = '1px';
      video.style.height = '1px';
      video.style.opacity = '0';
      video.style.pointerEvents = 'none';
      video.style.left = '-9999px';
      video.addEventListener('canplay', onReady, { once: true });
      document.body.appendChild(video);
      videos.push(video);
    }

    const cleanup = () => {
      for (const v of videos) {
        v.src = '';
        v.load();
        v.remove();
      }
    };

    const timeout = setTimeout(cleanup, PRELOAD_CLEANUP_MS);
    return () => {
      clearTimeout(timeout);
      cleanup();
    };
  }, []);

  return null;
}

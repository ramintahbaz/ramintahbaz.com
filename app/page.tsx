'use client';
import { useState, useEffect, useCallback } from 'react';
import SplashScreen from '@/components/SplashScreen';

export const photoboomMetadata = {
  id: 'photoboom',
  title: 'Photo boom',
  date: 'March 23, 2025',
  cardDate: 'Mar 2025',
  cardDescription: 'An exploding image gallery interaction.',
  href: '/photoboom',
  shareTitle: 'Photo boom — Ramin — Designer',
  shareText: 'An exploding image gallery interaction exploring motion as feedback.',
};

export default function Home() {
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    (document.activeElement as HTMLElement)?.blur();
  }, []);

  useEffect(() => {
    if (localStorage.getItem('leftForWork') === 'true') {
      localStorage.removeItem('leftForWork');
      setSplashDone(true);
    }
  }, []);

  const handleComplete = useCallback(() => {
    setSplashDone(true);
  }, []);

  return (
    <>
      {!splashDone && <SplashScreen onComplete={handleComplete} />}
      <div className={!splashDone ? 'splash-hidden' : ''} />
    </>
  );
}

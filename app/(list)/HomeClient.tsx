'use client';

import { useEffect, useCallback } from 'react';
import SplashScreen from '@/components/SplashScreen';
import MobileVideoPreloader from '@/components/MobileVideoPreloader';
import { useSplash } from '@/contexts/SplashContext';

// Prefetch URLs (must match TopBar and GitHubCommitBadge)
const DC_LAT = 38.9072;
const DC_LON = -77.0369;
const OPEN_METEO_URL = `https://api.open-meteo.com/v1/forecast?latitude=${DC_LAT}&longitude=${DC_LON}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`;
const GITHUB_USERNAME = 'ramintahbaz23';
const GITHUB_REPO = 'ramin-design-engineer';
const COMMITS_URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/commits?per_page=1`;

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

export default function HomeClient() {
  const { splashDone, setSplashDone } = useSplash();

  useEffect(() => {
    (document.activeElement as HTMLElement)?.blur();
  }, []);

  // Prefetch weather and commit during splash so TopBar can read from sessionStorage
  useEffect(() => {
    if (!splashDone) return;
    if (typeof window === 'undefined') return;
    fetch(OPEN_METEO_URL)
      .then((res) => res.json())
      .then((data) => {
        const c = data?.current;
        if (c != null) {
          sessionStorage.setItem(
            'weather-cache',
            JSON.stringify({ temp: Math.round(c.temperature_2m), code: c.weather_code })
          );
        }
      })
      .catch(() => {});
    fetch(COMMITS_URL)
      .then((res) => (res.ok ? res.json() : null))
      .then((list) => {
        const first = Array.isArray(list) && list[0];
        if (!first) return;
        const sha = (first.sha as string).slice(0, 7);
        const date = (first.commit?.author?.date as string) || '';
        return fetch(
          `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/commits/${first.sha}`
        )
          .then((r) => (r.ok ? r.json() : null))
          .then((commitData) => {
            if (!commitData) return;
            const stats = commitData.stats ?? {};
            const additions = typeof stats.additions === 'number' ? stats.additions : 0;
            const deletions = typeof stats.deletions === 'number' ? stats.deletions : 0;
            sessionStorage.setItem(
              'commit-cache',
              JSON.stringify({ sha, date, additions, deletions })
            );
          });
      })
      .catch(() => {});
  }, [splashDone]);

  useEffect(() => {
    if (localStorage.getItem('leftForWork') === 'true') {
      localStorage.removeItem('leftForWork');
      setSplashDone(true);
    }
  }, [setSplashDone]);

  const handleComplete = useCallback(() => {
    setSplashDone(true);
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('splashDone', 'true');
  }, [setSplashDone]);

  // List (CraftPage) is rendered by (list)/layout when splashDone; we only render splash here
  return (
    <>
      {!splashDone && <SplashScreen onComplete={handleComplete} />}
      {splashDone && <MobileVideoPreloader />}
      <div className={!splashDone ? 'splash-hidden' : ''} />
    </>
  );
}

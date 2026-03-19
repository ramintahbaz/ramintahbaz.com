'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import GitHubCommitBadge from '@/components/GitHubCommitBadge';
import SignalIcon from '@/components/SignalIcon';
import { useSplash } from '@/contexts/SplashContext';

// Washington, DC coordinates for Open-Meteo
const DC_LAT = 38.9072;
const DC_LON = -77.0369;
const OPEN_METEO_URL = `https://api.open-meteo.com/v1/forecast?latitude=${DC_LAT}&longitude=${DC_LON}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`;

type WeatherState = {
  temp: number;
  code: number;
} | null;

// Apple Weather app icons (iPhone) — https://support.apple.com/guide/iphone/learn-the-weather-icons-iph4305794fb/ios
const APPLE_WEATHER_ICONS_BASE = 'https://help.apple.com/assets/693899389D19086B5004838C/69389944B6DF764AE804D048/en_US';
const APPLE_WEATHER_ICONS: Record<string, string> = {
  clear: `${APPLE_WEATHER_ICONS_BASE}/575900edccbc7def167f7874c02aeb0b.png`,
  partlyCloudy: `${APPLE_WEATHER_ICONS_BASE}/67aaf9dbe30989c25cbde6c6ec099213.png`,
  haze: `${APPLE_WEATHER_ICONS_BASE}/73ae8300a30e895e3739cd50ade0dfe1.png`,
  fog: `${APPLE_WEATHER_ICONS_BASE}/d35bb25d12281cd9ee5ce78a98cd2aa7.png`,
  windy: `${APPLE_WEATHER_ICONS_BASE}/ad9e41c68b6a2671d2bcd843be1baa86.png`,
  cloudy: `${APPLE_WEATHER_ICONS_BASE}/66117fab0f288a2867b340fa2fcde31b.png`,
  thunderstorm: `${APPLE_WEATHER_ICONS_BASE}/efffb1e26f6de5bf5c8adbd872a2933a.png`,
  rain: `${APPLE_WEATHER_ICONS_BASE}/4417bf88c7bbcd8e24fb78ee6479b362.png`,
  heavyRain: `${APPLE_WEATHER_ICONS_BASE}/451d37e6cea3af4a568110863a1adcf7.png`,
  drizzle: `${APPLE_WEATHER_ICONS_BASE}/a55fef55bbeb0762a8dd329b4b8ad342.png`,
  snow: `${APPLE_WEATHER_ICONS_BASE}/00171e3b54b97dee8c1a2f6a62272640.png`,
  heavySnow: `${APPLE_WEATHER_ICONS_BASE}/e95fb90fc5a4aac111be78770921beb1.png`,
  freezingRain: `${APPLE_WEATHER_ICONS_BASE}/9189cb49e806d1ebfeed24f33367143c.png`,
};

function getAppleWeatherIconKey(code: number): string {
  if (code === 0) return 'clear';
  if (code >= 1 && code <= 2) return 'partlyCloudy';
  if (code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if (code === 51 || code === 53 || code === 55) return 'drizzle';
  if (code === 56 || code === 57) return 'freezingRain';
  if (code === 61 || code === 63) return 'rain';
  if (code === 65) return 'heavyRain';
  if (code === 66 || code === 67) return 'freezingRain';
  if (code >= 71 && code <= 75) return 'snow';
  if (code === 77) return 'heavySnow';
  if (code >= 80 && code <= 82) return code === 82 ? 'heavyRain' : 'rain';
  if (code >= 85 && code <= 86) return 'snow';
  if (code >= 95 && code <= 99) return 'thunderstorm';
  return 'cloudy';
}

const WEATHER_DESCRIPTIONS: Record<string, string> = {
  clear: 'Clear',
  partlyCloudy: 'Partly cloudy',
  cloudy: 'Cloudy',
  haze: 'Haze',
  fog: 'Foggy',
  windy: 'Windy',
  rain: 'Rainy',
  heavyRain: 'Heavy rain',
  drizzle: 'Drizzling',
  snow: 'Snowy',
  heavySnow: 'Heavy snow / Blizzard',
  freezingRain: 'Freezing rain / Sleet',
  thunderstorm: 'Thunderstorms',
};

function getWeatherDescription(code: number): string {
  return WEATHER_DESCRIPTIONS[getAppleWeatherIconKey(code)] ?? 'Cloudy';
}

function WeatherIcon({ code }: { code: number }) {
  const key = getAppleWeatherIconKey(code);
  const src = APPLE_WEATHER_ICONS[key] ?? APPLE_WEATHER_ICONS.cloudy;
  return (
    <img
      src={src}
      alt=""
      width={14}
      height={14}
      className="shrink-0 w-3.5 h-3.5 object-contain"
    />
  );
}

function formatTime(date: Date, tz: string, withSeconds: boolean) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    second: withSeconds ? '2-digit' : undefined,
    hour12: false,
  }).format(date);
}

// X (Twitter) logo - minimal
function XLogo({ className }: { className?: string }) {
  return (
    <svg data-testid="geist-icon" height="16" width="16" viewBox="0 0 16 16" className={className} style={{ color: 'currentColor' }} strokeLinejoin="round" aria-hidden>
      <path fillRule="evenodd" clipRule="evenodd" d="M1.60022 2H5.80022L8.78759 6.16842L12.4002 2H14.0002L9.5118 7.17895L14.4002 14H10.2002L7.21285 9.83158L3.60022 14H2.00022L6.48864 8.82105L1.60022 2ZM10.8166 12.8L3.93657 3.2H5.18387L12.0639 12.8H10.8166Z" fill="currentColor" />
    </svg>
  );
}

export default function TopBar() {
  const pathname = usePathname();
  const { splashDone } = useSplash();
  const showTopBar = splashDone || pathname !== '/';
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = (searchParams.get('view') === 'neural' ? 'neural' : 'grid') as 'neural' | 'grid';
  const [mounted, setMounted] = useState(false);
  const VIEW_TOGGLE_USED_KEY = 'viewToggleUsed';
  const [viewToggleUsed, setViewToggleUsed] = useState(false);
  const viewToggledByTouchRef = useRef(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const nav = performance.getEntriesByType?.('navigation')?.[0] as { type?: string } | undefined;
    const isReload = nav?.type === 'reload';
    if (isReload) {
      sessionStorage.removeItem(VIEW_TOGGLE_USED_KEY);
    } else if (sessionStorage.getItem(VIEW_TOGGLE_USED_KEY) === 'true') {
      setViewToggleUsed(true);
    }
  }, []);
  useEffect(() => {
    if (view === 'neural' && typeof window !== 'undefined') {
      sessionStorage.setItem(VIEW_TOGGLE_USED_KEY, 'true');
      setViewToggleUsed(true);
    }
  }, [view]);
  const isProjectPage = pathname !== '/' && pathname !== '';
  const [weather, setWeather] = useState<WeatherState>(null);
  const [now, setNow] = useState(new Date());
  const [showWeatherTooltip, setShowWeatherTooltip] = useState(false);
  const [weatherTooltipPos, setWeatherTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const weatherTriggerRef = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    if (!showWeatherTooltip || !weatherTriggerRef.current) {
      setWeatherTooltipPos(null);
      return;
    }
    const rect = weatherTriggerRef.current.getBoundingClientRect();
    setWeatherTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.bottom + 6,
    });
  }, [showWeatherTooltip]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const cached = sessionStorage.getItem('weather-cache');
    if (cached) {
      try {
        const { temp, code } = JSON.parse(cached);
        if (typeof temp === 'number' && typeof code === 'number') {
          setWeather({ temp, code });
          return;
        }
      } catch {
        // invalid cache, fall through to fetch
      }
    }
    fetch(OPEN_METEO_URL)
      .then((res) => res.json())
      .then((data) => {
        const c = data?.current;
        if (c) setWeather({ temp: Math.round(c.temperature_2m), code: c.weather_code });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!showTopBar) {
    return <div className="h-12 shrink-0" aria-hidden />;
  }

  if (typeof document !== 'undefined' && showWeatherTooltip && weatherTooltipPos && weather) {
    createPortal(
      <span
        role="tooltip"
        className="px-2 py-1 rounded text-[11px] font-medium whitespace-nowrap"
        style={{
          position: 'fixed',
          left: weatherTooltipPos.x,
          top: weatherTooltipPos.y,
          transform: 'translate(-50%, 0)',
          zIndex: 9999,
          background: 'rgba(0,0,0,0.92)',
          color: '#fff',
          boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
          pointerEvents: 'none',
        }}
      >
        {getWeatherDescription(weather.code)}
      </span>,
      document.body
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: '@keyframes viewIconShimmer { 0% { opacity: 0.55; } 25% { opacity: 1; } 50% { opacity: 0.7; } 75% { opacity: 1; } 100% { opacity: 1; } }' }} />
      <header
        className="fixed inset-x-0 top-0 z-[100] flex items-center justify-between px-4 py-2 text-white font-sans"
        style={{
          backgroundColor: 'rgba(22, 22, 22, 0.55)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
        }}
      >
      {/* Mobile: avatar + GitHub · Connect · X left-aligned, filter right — avatar uses client nav to avoid refresh and keep view preference */}
      <div className="flex md:hidden items-center justify-between w-full text-[11px] font-medium">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              if (isProjectPage) {
                const params = new URLSearchParams();
                params.set('view', view);
                router.push(`/?${params.toString()}`);
              }
            }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Home"
          >
            <Image
              src="/images/avatar.png"
              alt="Avatar"
              width={96}
              height={96}
              className="h-full w-full rounded-full object-cover translate-x-[2px]"
              sizes="32px"
            />
          </button>
          <Link href="https://github.com/ramintahbaz23/" target="_blank" rel="noopener noreferrer" className="shrink-0 flex items-center hover:opacity-80" aria-label="GitHub">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/GitHub_Invertocat_White.svg" alt="" className="h-3.5 w-3.5" />
          </Link>
          <Link href="https://www.linkedin.com/in/ramin-tahbaz/" target="_blank" rel="noopener noreferrer" className="shrink-0 flex items-center hover:opacity-80" aria-label="LinkedIn">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/linkedin-icon.png" alt="" className="h-3.5 w-3.5" />
          </Link>
          <Link href="https://x.com/ramintahbaz" target="_blank" rel="noopener noreferrer" className="flex items-center hover:opacity-80" aria-label="X profile">
            <XLogo className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Right: View swap (mobile only) — hidden on project pages; filter lives in NeuralPortfolio floating menu */}
        {!isProjectPage && (
        <button
          type="button"
          onTouchStartCapture={(e) => {
            const next = view === 'neural' ? 'grid' : 'neural';
            const params = new URLSearchParams(searchParams.toString());
            params.set('view', next);
            router.replace(`/?${params.toString()}`);
            viewToggledByTouchRef.current = true;
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={() => {
            if (viewToggledByTouchRef.current) {
              viewToggledByTouchRef.current = false;
              return;
            }
            const next = view === 'neural' ? 'grid' : 'neural';
            const params = new URLSearchParams(searchParams.toString());
            params.set('view', next);
            router.replace(`/?${params.toString()}`);
          }}
          title={view === 'neural' ? 'Grid view' : 'Neural view'}
          className="flex items-center gap-1 font-mono text-[11px] text-white/70 hover:text-white transition-colors pr-4"
          aria-label={view === 'neural' ? 'Switch to grid view' : 'Switch to network view'}
        >
          {view === 'neural' ? (
            <svg data-testid="geist-icon" height="16" width="16" viewBox="0 0 16 16" style={{ color: 'currentColor' }} strokeLinejoin="round">
              <path fillRule="evenodd" clipRule="evenodd" d="M2.5 5.5V2.5H5.5V5.5H2.5ZM1 2C1 1.44772 1.44772 1 2 1H6C6.55228 1 7 1.44772 7 2V6C7 6.55228 6.55228 7 6 7H2C1.44772 7 1 6.55228 1 6V2ZM2.5 13.5V10.5H5.5V13.5H2.5ZM1 10C1 9.44772 1.44772 9 2 9H6C6.55228 9 7 9.44772 7 10V14C7 14.5523 6.55228 15 6 15H2C1.44772 15 1 14.5523 1 14V10ZM10.5 2.5V5.5H13.5V2.5H10.5ZM10 1C9.44772 1 9 1.44772 9 2V6C9 6.55228 9.44772 7 10 7H14C14.5523 7 15 6.55228 15 6V2C15 1.44772 14.5523 1 14 1H10ZM10.5 13.5V10.5H13.5V13.5H10.5ZM9 10C9 9.44772 9.44772 9 10 9H14C14.5523 9 15 9.44772 15 10V14C15 14.5523 14.5523 15 14 15H10C9.44772 15 9 14.5523 9 14V10Z" fill="currentColor" />
            </svg>
          ) : viewToggleUsed ? (
            <svg data-testid="geist-icon" height="16" width="16" viewBox="0 0 16 16" style={{ color: 'currentColor' }} strokeLinejoin="round" fill="none">
              <path d="M3 10.25C4.51878 10.25 5.75 11.4812 5.75 13C5.75 14.5188 4.51878 15.75 3 15.75C1.48122 15.75 0.25 14.5188 0.25 13C0.25 11.4812 1.48122 10.25 3 10.25ZM13 10.25C14.5188 10.25 15.75 11.4812 15.75 13C15.75 14.5188 14.5188 15.75 13 15.75C11.4812 15.75 10.25 14.5188 10.25 13C10.25 11.4812 11.4812 10.25 13 10.25ZM3 11.75C2.30964 11.75 1.75 12.3096 1.75 13C1.75 13.6904 2.30964 14.25 3 14.25C3.69036 14.25 4.25 13.6904 4.25 13C4.25 12.3096 3.69036 11.75 3 11.75ZM13 11.75C12.3096 11.75 11.75 12.3096 11.75 13C11.75 13.6904 12.3096 14.25 13 14.25C13.6904 14.25 14.25 13.6904 14.25 13C14.25 12.3096 13.3096 11.75 13 11.75ZM8 12C8.55228 12 9 12.4477 9 13C9 13.5523 8.55228 14 8 14C7.44772 14 7 13.5523 7 13C7 12.4477 7.44772 12 8 12ZM2.5 7C3.05228 7 3.5 7.44772 3.5 8C3.5 8.55228 3.05228 9 2.5 9C1.94772 9 1.5 8.55228 1.5 8C1.5 7.44772 1.94772 7 2.5 7ZM8 7C8.55228 7 9 7.44772 9 8C9 8.55228 8.55228 9 8 9C7.44772 9 7 8.55228 7 8C7 7.44772 7.44772 7 8 7ZM13.5 7C14.0523 7 14.5 7.44772 14.5 8C14.5 8.55228 14.0523 9 13.5 9C12.9477 9 12.5 8.55228 12.5 8C12.5 7.44772 12.9477 7 13.5 7ZM8 0.25C9.51878 0.25 10.75 1.48122 10.75 3C10.75 4.51878 9.51878 5.75 8 5.75C6.48122 5.75 5.25 4.51878 5.25 3C5.25 1.48122 6.48122 0.25 8 0.25ZM8 1.75C7.30964 1.75 6.75 2.30964 6.75 3C6.75 3.69036 7.30964 4.25 8 4.25C8.69036 4.25 9.25 3.69036 9.25 3C9.25 2.30964 8.69036 1.75 8 1.75ZM2.5 2C3.05228 2 3.5 2.44772 3.5 3C3.5 3.55228 3.05228 4 2.5 4C1.94772 4 1.5 3.55228 1.5 3C1.5 2.44772 1.94772 2 2.5 2ZM13.5 2C14.0523 2 14.5 2.44772 14.5 3C14.5 3.55228 14.0523 4 13.5 4C12.9477 4 12.5 3.55228 12.5 3C12.5 2.44772 12.9477 2 13.5 2Z" fill="currentColor" />
            </svg>
          ) : (
            <SignalIcon size={16} />
          )}
        </button>
        )}
      </div>

      {/* Desktop: full header — single gap for consistent spacing */}
      <div className="hidden md:flex items-center gap-4 text-[10px] sm:text-[12px] font-medium overflow-x-auto scrollbar-hide shrink-0">
        <Link href="/" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden" aria-label="Home">
          <Image
            src="/images/avatar.png"
            alt="Avatar"
            width={96}
            height={96}
            className="h-full w-full rounded-full object-cover translate-x-[2px] sm:translate-x-[1px]"
            sizes="32px"
          />
        </Link>
        <span className="shrink-0">Washington, DC</span>
        {weather && (
          <span
            ref={weatherTriggerRef}
            className="relative flex items-center gap-2 shrink-0 cursor-default"
            onMouseEnter={() => setShowWeatherTooltip(true)}
            onMouseLeave={() => setShowWeatherTooltip(false)}
          >
            <WeatherIcon code={weather.code} />
            <span>{weather.temp}°F</span>
          </span>
        )}
        <span className="shrink-0 font-mono" suppressHydrationWarning>
          {mounted ? `DCA ${formatTime(now, 'America/New_York', true)}` : 'DCA --:--:--'}
        </span>
        <span className="shrink-0 font-mono" suppressHydrationWarning>
          {mounted ? `SFO ${formatTime(now, 'America/Los_Angeles', true)}` : 'SFO --:--:--'}
        </span>
        <Link href="https://github.com/ramintahbaz23/" target="_blank" rel="noopener noreferrer" className="shrink-0 flex items-center hover:opacity-80" aria-label="GitHub">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/GitHub_Invertocat_White.svg" alt="" className="h-3.5 w-3.5" />
        </Link>
        <Link href="https://www.linkedin.com/in/ramin-tahbaz/" target="_blank" rel="noopener noreferrer" className="shrink-0 flex items-center hover:opacity-80" aria-label="LinkedIn">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/linkedin-icon.png" alt="" className="h-3.5 w-3.5" />
        </Link>
        <span className="shrink-0 text-white/60 cursor-default hidden">Resume</span>
        <Link
          href="https://x.com/ramintahbaz"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center shrink-0 hover:opacity-80"
          aria-label="X profile"
        >
          <XLogo className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-3 sm:gap-4 text-[11px] sm:text-[13px] font-medium shrink-0 pl-4">
        <GitHubCommitBadge />
      </div>
    </header>
    </>
  );
}

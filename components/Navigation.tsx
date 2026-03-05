'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed inset-x-0 bottom-4 sm:bottom-6 z-20 px-5 sm:px-6">
      <div className="max-w-[680px] mx-auto">
        <div className="flex items-center justify-center gap-4 px-3.5 sm:px-4">
          {/* Middle pill menu */}
          <div className="flex h-12 items-center rounded-full px-5 sm:px-7 shadow-lg gap-4 sm:gap-6" style={{ backgroundColor: '#292929' }}>
            <Link
              href="/"
              className={`text-xs sm:text-sm font-medium tracking-wide transition-colors ${
                isActive('/')
                  ? 'text-white'
                  : 'text-white/50 sm:hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              href="/craft"
              className={`text-xs sm:text-sm font-medium tracking-wide transition-colors ${
                isActive('/craft')
                  ? 'text-white'
                  : 'text-white/50 sm:hover:text-white'
              }`}
            >
              Craft
            </Link>
            <Link
              href="/elsewhere"
              className={`text-xs sm:text-sm font-medium tracking-wide transition-colors ${
                isActive('/elsewhere')
                  ? 'text-white'
                  : 'text-white/50 sm:hover:text-white'
              }`}
            >
              Elsewhere
            </Link>
          </div>

          {/* Right circular X profile button */}
          <Link
            href="https://x.com/ratahbaz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-colors overflow-hidden"
            aria-label="Go to X profile"
            style={{ backgroundColor: '#292929' }}
          >
            <Image
              src="/images/avatar.png"
              alt="Avatar"
              width={96}
              height={96}
              className="h-full w-full rounded-full object-cover translate-x-[2px] sm:translate-x-[1px]"
              priority
              quality={100}
              sizes="48px"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}


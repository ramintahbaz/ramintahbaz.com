'use client';

import Link from 'next/link';
import AnimatedPage from '@/components/AnimatedPage';
import AISummarySection from '@/components/AISummarySection';

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
  return (
    <AnimatedPage variant="dramatic">
      <div className="min-h-screen" style={{ backgroundColor: '#E2DEDB' }}>
        <main className="relative px-5 sm:px-6 flex items-center justify-center min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)] py-8">
          <div className="max-w-[680px] mx-auto w-full">
            <div className="max-w-[560px] mx-auto">
              <h1 className="text-[16px] font-medium text-black mb-3 sm:mb-4">
                I&apos;m Ramin [rah-MEEN], a DC-based designer who codes.
              </h1>
              <div className="text-[16px] sm:text-[17px] text-gray-700 leading-relaxed space-y-3 sm:space-y-4">
                <p>
                  I create across product, film, hardware, and writing. This is where I share the work and what I&apos;m learning along the way.
                </p>
                <p>
                  Currently at{' '}
                  <Link
                    href="https://joinpromise.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline sm:no-underline hover:underline underline-offset-2"
                  >
                    Promise
                  </Link>
                  , building intelligent financial systems that work for millions of people.
                </p>
              </div>
              
              {/* AI Summary section */}
              <div className="-mx-3.5 sm:-mx-4 mt-8 sm:mt-10">
                <AISummarySection />
              </div>
            </div>
          </div>
        </main>
      </div>
    </AnimatedPage>
  );
}

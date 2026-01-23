'use client';

import { useEffect, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import AnimatedPage from '@/components/AnimatedPage';
import { photoboomMetadata } from '@/app/page';
import { essay01Metadata } from '@/app/essays/essay-01/page';
import { essay02Metadata } from '@/app/essays/essay-02/page';
import { essay03Metadata } from '@/app/essays/essay-03/page';
import { paymentStatusMetadata } from '@/app/paymentstatus/page';
import { visualSystemHoverMetadata } from '@/app/visual-system-hover/page';
import { carouselMetadata } from '@/app/interactions/carousel/page';
import { electricBorderMetadata } from '@/app/interactions/electric-border/page';
import { bloomMetadata } from '@/app/interactions/bloom/page';
import { keycadetsMetadata } from '@/app/products/keycadets/page';
import { doritosLoadedMetadata } from '@/app/products/doritos-loaded/page';
import { craftMetadata } from '@/app/products/craft/page';
import { sunsetMetadata } from '@/app/products/sunset/page';
import { thisTrackisCrackMetadata } from '@/app/products/thistrackiscrack/page';
import { aiDocumentVerificationMetadata } from '@/app/products/ai-document-verification/page';
import { film01Metadata } from '@/app/films/film-01/page';
import { film02Metadata } from '@/app/films/film-02/page';
import { film03Metadata } from '@/app/films/film-03/page';
import { film04Metadata } from '@/app/films/film-04/page';
import { film05Metadata } from '@/app/films/film-05/page';

type WorkItem = {
  id: string;
  date?: string;
  title: string;
  description: string;
  badge?: string;
  href?: string;
};


const fragments: WorkItem[] = [
  {
    id: photoboomMetadata.id,
    date: photoboomMetadata.cardDate,
    title: photoboomMetadata.title,
    description: photoboomMetadata.cardDescription,
    href: photoboomMetadata.href,
  },
  {
    id: paymentStatusMetadata.id,
    date: paymentStatusMetadata.cardDate,
    title: paymentStatusMetadata.title,
    description: paymentStatusMetadata.cardDescription,
    href: paymentStatusMetadata.href,
  },
  {
    id: visualSystemHoverMetadata.id,
    date: visualSystemHoverMetadata.cardDate,
    title: visualSystemHoverMetadata.title,
    description: visualSystemHoverMetadata.cardDescription,
    href: visualSystemHoverMetadata.href,
  },
  {
    id: carouselMetadata.id,
    date: carouselMetadata.cardDate,
    title: carouselMetadata.title,
    description: carouselMetadata.cardDescription,
    href: carouselMetadata.href,
  },
  {
    id: electricBorderMetadata.id,
    date: electricBorderMetadata.cardDate,
    title: electricBorderMetadata.title,
    description: electricBorderMetadata.cardDescription,
    href: electricBorderMetadata.href,
  },
  {
    id: bloomMetadata.id,
    date: bloomMetadata.cardDate,
    title: bloomMetadata.title,
    description: bloomMetadata.cardDescription,
    href: bloomMetadata.href,
  },
].sort((a, b) => {
  // Sort by date descending (most recent first)
  const dateA = parseDate(a.date || '');
  const dateB = parseDate(b.date || '');
  return dateB - dateA;
});

const products: WorkItem[] = [
  {
    id: keycadetsMetadata.id,
    date: keycadetsMetadata.cardDate,
    title: keycadetsMetadata.title,
    description: keycadetsMetadata.cardDescription,
    href: keycadetsMetadata.href,
  },
  {
    id: doritosLoadedMetadata.id,
    date: doritosLoadedMetadata.cardDate,
    title: doritosLoadedMetadata.title,
    description: doritosLoadedMetadata.cardDescription,
    href: doritosLoadedMetadata.href,
  },
  {
    id: craftMetadata.id,
    date: craftMetadata.cardDate,
    title: craftMetadata.title,
    description: craftMetadata.cardDescription,
    href: craftMetadata.href,
  },
  {
    id: sunsetMetadata.id,
    date: sunsetMetadata.cardDate,
    title: sunsetMetadata.title,
    description: sunsetMetadata.cardDescription,
    href: sunsetMetadata.href,
  },
  {
    id: thisTrackisCrackMetadata.id,
    date: thisTrackisCrackMetadata.cardDate,
    title: thisTrackisCrackMetadata.title,
    description: thisTrackisCrackMetadata.cardDescription,
    href: thisTrackisCrackMetadata.href,
  },
  {
    id: aiDocumentVerificationMetadata.id,
    date: aiDocumentVerificationMetadata.cardDate,
    title: aiDocumentVerificationMetadata.title,
    description: aiDocumentVerificationMetadata.cardDescription,
    href: aiDocumentVerificationMetadata.href,
  },
];

const films: WorkItem[] = [
  {
    id: film01Metadata.id,
    date: film01Metadata.cardDate,
    title: film01Metadata.title,
    description: film01Metadata.cardDescription,
    href: film01Metadata.href,
  },
  {
    id: film02Metadata.id,
    date: film02Metadata.cardDate,
    title: film02Metadata.title,
    description: film02Metadata.cardDescription,
    href: film02Metadata.href,
  },
  {
    id: film03Metadata.id,
    date: film03Metadata.cardDate,
    title: film03Metadata.title,
    description: film03Metadata.cardDescription,
    href: film03Metadata.href,
  },
  {
    id: film04Metadata.id,
    date: film04Metadata.cardDate,
    title: film04Metadata.title,
    description: film04Metadata.cardDescription,
    href: film04Metadata.href,
  },
  {
    id: film05Metadata.id,
    date: film05Metadata.cardDate,
    title: film05Metadata.title,
    description: film05Metadata.cardDescription,
    href: film05Metadata.href,
  },
];

const essays: WorkItem[] = [
  {
    id: essay01Metadata.id,
    date: essay01Metadata.cardDate,
    title: essay01Metadata.title,
    description: essay01Metadata.cardDescription,
    href: essay01Metadata.href,
  },
  {
    id: essay02Metadata.id,
    date: essay02Metadata.cardDate,
    title: essay02Metadata.title,
    description: essay02Metadata.cardDescription,
    href: essay02Metadata.href,
  },
  {
    id: essay03Metadata.id,
    date: essay03Metadata.cardDate,
    title: essay03Metadata.title,
    description: essay03Metadata.cardDescription,
    href: essay03Metadata.href,
  },
];

const caseStudies: WorkItem[] = [
  {
    id: 'selected-case-studies',
    title: 'Curious about something else?',
    description:
      "Deep dives into specific products, problems, and outcomes. Reach out if you'd like to see examples tailored to your interests.",
    badge: 'By request',
  },
];

// Helper function to parse date strings and convert to sortable format
function parseDate(dateStr: string | undefined): number {
  if (!dateStr) return 0;
  
  // Handle year-only formats (e.g., "2024")
  if (/^\d{4}$/.test(dateStr)) {
    return parseInt(dateStr, 10) * 100;
  }
  
  // Handle month + year formats (e.g., "July 2025", "Nov 2016", "Jan 2019")
  const monthNames: { [key: string]: number } = {
    'january': 1, 'jan': 1,
    'february': 2, 'feb': 2,
    'march': 3, 'mar': 3,
    'april': 4, 'apr': 4,
    'may': 5,
    'june': 6, 'jun': 6,
    'july': 7, 'jul': 7,
    'august': 8, 'aug': 8,
    'september': 9, 'sep': 9, 'sept': 9,
    'october': 10, 'oct': 10,
    'november': 11, 'nov': 11,
    'december': 12, 'dec': 12,
  };
  
  const parts = dateStr.toLowerCase().split(/\s+/);
  let month = 0;
  let year = 0;
  
  for (const part of parts) {
    if (monthNames[part]) {
      month = monthNames[part];
    } else if (/^\d{4}$/.test(part)) {
      year = parseInt(part, 10);
    }
  }
  
  // Return as YYYYMM format for sorting (most recent first = higher numbers)
  return year * 100 + month;
}

// Sort arrays by date (most recent first)
const sortedFragments = [...fragments].sort((a, b) => parseDate(b.date) - parseDate(a.date));
const sortedProducts = [...products].sort((a, b) => parseDate(b.date) - parseDate(a.date));
const sortedFilms = [...films].sort((a, b) => parseDate(b.date) - parseDate(a.date));
const sortedEssays = [...essays].sort((a, b) => parseDate(b.date) - parseDate(a.date));

const sectionVariants = {
  hidden: { opacity: 0, filter: 'blur(28px)' },
  visible: { opacity: 1, filter: 'blur(0px)' },
};

export default function CraftPage() {
  // Restore scroll position on mount - use useLayoutEffect to run before paint
  useLayoutEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('craftPageScrollPosition');
    if (savedScrollPosition) {
      // Restore immediately to prevent visual jump
      const scrollY = parseInt(savedScrollPosition, 10);
      window.scrollTo(0, scrollY);
      sessionStorage.removeItem('craftPageScrollPosition');
    }
  }, []);

  // Continuously save scroll position as user scrolls
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem('craftPageScrollPosition', window.scrollY.toString());
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, []);

  // Save scroll position when clicking on links
  const handleLinkClick = () => {
    sessionStorage.setItem('craftPageScrollPosition', window.scrollY.toString());
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen" style={{ backgroundColor: '#E2DEDB' }}>
        <main className="relative px-5 sm:px-6 pt-24 sm:pt-32 pb-28 sm:pb-32">
          <div className="max-w-[680px] mx-auto">
          {/* Intro copy (no explicit page title text) */}
          <motion.section
            className="mb-14"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{
              opacity: {
                type: 'tween',
                duration: 1.1,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              },
              filter: {
                type: 'tween',
                duration: 1.6,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
          >
            <div className="text-[16px] sm:text-[17px] text-gray-700 leading-relaxed max-w-[560px] mx-auto space-y-3 sm:space-y-4">
              <p>
                I practice my craft through product, film, hardware, and writing. Each form offers a different way to tell a story.
              </p>
              <p>
                I&apos;m entirely self-taught, learning by doing over years of practice.
              </p>
              <p>
                This is a curated collection of my work I&apos;m proud to share.
              </p>
            </div>
          </motion.section>

          {/* Interactions */}
          <motion.section
            className="mb-10 sm:mb-12"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{
              opacity: {
                type: 'tween',
                duration: 1.1,
                delay: 0.22,
                ease: [0.22, 1, 0.36, 1],
              },
              filter: {
                type: 'tween',
                duration: 1.6,
                delay: 0.22,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
          >
            <div
              className="flex items-baseline justify-between mb-8 max-w-[560px] mx-auto"
            >
              <h2 className="text-[16px] font-medium text-black">
                Interactions
              </h2>
            </div>

            <div className="space-y-1.5 sm:space-y-2 max-w-[560px] mx-auto">
              {sortedFragments.map((item, index) => (
                <div
                  key={item.id}
                  className="group rounded-lg px-3.5 py-2.5 sm:px-4 sm:py-3 cursor-pointer bg-transparent hover:bg-[#E0DCD7] border border-transparent hover:border-[#D0CECA] shadow-none hover:shadow-sm transition-all duration-200"
                >
                  <Link
                    href={item.href ?? '#'}
                    className="flex items-baseline gap-6 w-full"
                    aria-label={item.title}
                    onClick={handleLinkClick}
                  >
                    {item.date && (
                      <p className="text-[13px] sm:text-[14px] text-gray-500 min-w-[72px]">
                        {item.date}
                      </p>
                    )}
                    <div className="flex-1">
                      <p className="text-[14px] font-medium text-gray-900 underline sm:no-underline">
                        {item.title}
                      </p>
                      <p className="text-[14px] sm:text-[15px] text-gray-600 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Products */}
          <motion.section
            className="mb-10 sm:mb-12"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{
              opacity: {
                type: 'tween',
                duration: 1.1,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              },
              filter: {
                type: 'tween',
                duration: 1.6,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
          >
            <div className="flex items-baseline justify-between mb-8 max-w-[560px] mx-auto">
              <h2 className="text-[16px] font-medium text-black">
                Products
              </h2>
            </div>

            <div className="space-y-1.5 sm:space-y-2 max-w-[560px] mx-auto">
              {sortedProducts.map((item, index) => (
                <div
                  key={item.id}
                  className="group rounded-lg px-3.5 py-2.5 sm:px-4 sm:py-3 cursor-pointer bg-transparent hover:bg-[#E0DCD7] border border-transparent hover:border-[#D0CECA] shadow-none hover:shadow-sm transition-all duration-200"
                >
                  <Link
                    href={item.href ?? '#'}
                    className="flex items-baseline gap-6 w-full"
                    aria-label={item.title}
                    onClick={handleLinkClick}
                  >
                    {item.date && (
                      <p className="text-[13px] sm:text-[14px] text-gray-500 min-w-[72px]">
                        {item.date}
                      </p>
                    )}
                    <div className="flex-1">
                      <p className="text-[14px] font-medium text-gray-900 underline sm:no-underline">
                        {item.title}
                      </p>
                      <p className="text-[14px] sm:text-[15px] text-gray-600 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Film */}
          <motion.section
            className="mb-10 sm:mb-12"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{
              opacity: {
                type: 'tween',
                duration: 1.1,
                delay: 0.34,
                ease: [0.22, 1, 0.36, 1],
              },
              filter: {
                type: 'tween',
                duration: 1.6,
                delay: 0.34,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
          >
            <div className="flex items-baseline justify-between mb-8 max-w-[560px] mx-auto">
              <h2 className="text-[16px] font-medium text-black">
                Film
              </h2>
            </div>

            <div className="space-y-1.5 sm:space-y-2 max-w-[560px] mx-auto">
              {sortedFilms.map((item, index) => (
                <div
                  key={item.id}
                  className="group rounded-lg px-3.5 py-2.5 sm:px-4 sm:py-3 cursor-pointer bg-transparent hover:bg-[#E0DCD7] border border-transparent hover:border-[#D0CECA] shadow-none hover:shadow-sm transition-all duration-200"
                >
                  <Link
                    href={item.href ?? '#'}
                    className="flex items-baseline gap-6 w-full"
                    aria-label={item.title}
                    onClick={handleLinkClick}
                  >
                    {item.date && (
                      <p className="text-[13px] sm:text-[14px] text-gray-500 min-w-[72px]">
                        {item.date}
                      </p>
                    )}
                    <div className="flex-1">
                      <p className="text-[14px] font-medium text-gray-900 underline sm:no-underline">
                        {item.title}
                      </p>
                      <p className="text-[14px] sm:text-[15px] text-gray-600 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Essays */}
          <motion.section
            className="mb-10 sm:mb-12"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{
              opacity: {
                type: 'tween',
                duration: 1.1,
                delay: 0.38,
                ease: [0.22, 1, 0.36, 1],
              },
              filter: {
                type: 'tween',
                duration: 1.6,
                delay: 0.38,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
          >
            <div className="flex items-baseline justify-between mb-8 max-w-[560px] mx-auto">
              <h2 className="text-[16px] font-medium text-black">
                Essays
              </h2>
            </div>

            <div className="space-y-1.5 sm:space-y-2 max-w-[560px] mx-auto">
              {sortedEssays.map((item, index) => (
                <div
                  key={item.id}
                  className="group rounded-lg px-3.5 py-2.5 sm:px-4 sm:py-3 cursor-pointer bg-transparent hover:bg-[#E0DCD7] border border-transparent hover:border-[#D0CECA] shadow-none hover:shadow-sm transition-all duration-200"
                >
                  <Link
                    href={item.href ?? '#'}
                    className="flex items-baseline gap-6 w-full"
                    aria-label={item.title}
                    onClick={handleLinkClick}
                  >
                    {item.date && (
                      <p className="text-[13px] sm:text-[14px] text-gray-500 min-w-[72px]">
                        {item.date}
                      </p>
                    )}
                    <div className="flex-1">
                      <p className="text-[14px] font-medium text-gray-900 underline sm:no-underline">
                        {item.title}
                      </p>
                      <p className="text-[14px] sm:text-[15px] text-gray-600 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Case studies */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            transition={{
              opacity: {
                type: 'tween',
                duration: 1.1,
                delay: 0.38,
                ease: [0.22, 1, 0.36, 1],
              },
              filter: {
                type: 'tween',
                duration: 1.6,
                delay: 0.38,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
          >
            <div className="flex items-baseline justify-between mb-4 max-w-[560px] mx-auto">
              <h2 className="text-[16px] font-medium text-black">
                Curious about something else?
              </h2>
            </div>

            <div className="space-y-3 sm:space-y-4 text-[15px] sm:text-[16px] text-gray-700 leading-relaxed max-w-[560px] mx-auto">
              <p>
                If you want to see how I approach problems or go deeper on specific work,{' '}
                <Link
                  href="/elsewhere"
                  className="underline underline-offset-2"
                >
                  let&apos;s talk.
                </Link>
                {' '}I&apos;m happy to walk through projects that match what you&apos;re curious about.
              </p>
            </div>
          </motion.section>
          </div>
        </main>
      </div>
    </AnimatedPage>
  );
}





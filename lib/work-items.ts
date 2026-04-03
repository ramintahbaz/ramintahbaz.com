/**
 * Single source of truth for portfolio work items.
 * Used by the craft page and NeuralPortfolio so the craft page does not load the full NeuralPortfolio module.
 */
export type CardAspectRatio = '4/3' | '1/1' | '3/4' | '16/9';

export interface WorkItem {
  id: string;
  title: string;
  category: 'product' | 'film' | 'interaction' | 'writing';
  thumbnail: string;
  video?: string;
  cardImage?: string;
  /** If true, craft masonry uses `video` URL as-is (no `#t=` seek fragment). */
  videoOmitSeekFragment?: boolean;
  videoStart?: number;
  videoLoopSec?: number;
  videoFullLoop?: boolean;
  videoObjectFit?: 'cover' | 'contain';
  /** CSS `object-position` for video in card/hover previews (e.g. `center top`). */
  videoObjectPosition?: string;
  videoScale?: number;
  /** Card frame aspect ratio in masonry; defaults to 4/3 when omitted */
  cardAspectRatio?: CardAspectRatio;
  href: string;
  excerpt?: string;
  year?: string;
}

/** Masonry + neural hover preview for Promise Console. */
export const PROMISE_COMMERCIAL_PREVIEW_VIDEO =
  'https://cdn.ramintahbaz.com/videos/promise-console_preview_new.mp4#t=0.01';

/** Promise marketing-site hero (`PromiseWebsiteHero` / promise-website work page). Bump URL or add `?v=` when replacing the file so cached responses invalidate. */
export const PROMISE_WEBSITE_DEMO_VIDEO =
  'https://cdn.ramintahbaz.com/videos/promise_website_demo.mp4#t=0.01';

/** Lead video on the Promise Console product work page only — not shared with promise-website. */
export const PROMISE_CONSOLE_WORK_PAGE_VIDEO =
  'https://cdn.ramintahbaz.com/videos/Promise_Console_new.mp4#t=0.01';

/** Craft masonry / grid card — lighter clip; hero on the work page uses `PROMISE_WEBSITE_DEMO_VIDEO`. */
export const PROMISE_WEBSITE_MASONRY_VIDEO =
  'https://cdn.ramintahbaz.com/videos/preview_promisewebsite.mp4';

/** Masonry / neural card preview for Photo boom. */
export const PHOTOBOOM_PREVIEW_VIDEO =
  'https://cdn.ramintahbaz.com/videos/preview_photoboom.mp4';

/** Craft / neural card preview for Operator. */
export const OPERATOR_PREVIEW_VIDEO =
  'https://cdn.ramintahbaz.com/videos/preview_promisepay.mp4';

/** Lead video on `/products/operator` only. Bump `?v=` when replacing file at same path; remove when stable. */
export const OPERATOR_WORK_PAGE_VIDEO =
  'https://cdn.ramintahbaz.com/videos/promisepay.mp4?v=2';

/** Masonry + card thumbnail for Disbursement ledger. */
export const NACHA_PREVIEW_VIDEO = 'https://cdn.ramintahbaz.com/videos/nacha_preview.mp4#t=0.01';

/** Lead video on `/products/nacha` only. */
export const NACHA_DEMO_VIDEO = 'https://cdn.ramintahbaz.com/videos/nacha_demo.mp4#t=0.01';

export const WORK_ITEMS: WorkItem[] = [
  {
    id: 'payment-status',
    title: 'Payment status',
    category: 'interaction',
    thumbnail: '',
    video: 'https://cdn.ramintahbaz.com/videos/payment_processing.mp4#t=0.01',
    cardAspectRatio: '1/1',
    href: '/payment-status',
    excerpt: 'A button that cycles through payment states. Each state gets its own motion.',
    year: 'January 2026',
  },
  {
    id: 'craft',
    title: 'Craft',
    category: 'product',
    thumbnail: '/thumbnails/craft.png',
    video: 'https://cdn.ramintahbaz.com/videos/preview_craft.mp4#t=0.01',
    videoFullLoop: true,
    cardAspectRatio: '4/3',
    href: '/products/craft',
    excerpt: 'A concept for refining AI-generated components with live controls and immediate visual feedback.',
    year: 'July 2025',
  },
  {
    id: 'promise-website',
    title: 'Promise website',
    category: 'product' as const,
    year: 'December 2025',
    href: '/products/promise-website',
    video: PROMISE_WEBSITE_MASONRY_VIDEO,
    thumbnail: 'https://cdn.ramintahbaz.com/videos/thumbnails/promise_website_preview.mp4#t=0.01',
    videoObjectPosition: 'center top',
    excerpt: 'A coded redesign of Promise\'s marketing site. An unreleased direction.',
  },
  {
    id: 'operator',
    title: 'Operator',
    category: 'product',
    thumbnail: '',
    video: OPERATOR_PREVIEW_VIDEO,
    cardAspectRatio: '16/9',
    href: '/products/operator',
    excerpt:
      'Agent assist dashboard — live call transcription, predicted intents inline, and action shortcuts. The AI layer stays additive.',
    year: 'April 2026',
  },
  {
    id: 'photoboom',
    title: 'Photo boom',
    category: 'interaction',
    thumbnail: '',
    video: PHOTOBOOM_PREVIEW_VIDEO,
    videoOmitSeekFragment: true,
    cardAspectRatio: '3/4',
    videoObjectPosition: 'center top',
    href: '/photoboom',
    excerpt: 'A photo stack that explodes from wherever you click.',
    year: 'January 2026',
  },
  {
    id: 'electric-border',
    title: 'Electric border',
    category: 'interaction',
    thumbnail: '',
    video: 'https://cdn.ramintahbaz.com/videos/preview_electricborder.mp4#t=0.01',
    cardAspectRatio: '16/9',
    href: '/interactions/electric-border',
    excerpt: 'A card border that writhes. Driven by SVG displacement maps and animated turbulence noise.',
    year: 'June 2025',
  },
  {
    id: 'visual-system-hover',
    title: 'Visual system hover',
    category: 'interaction',
    thumbnail: '',
    video: 'https://cdn.ramintahbaz.com/videos/visal_hover.mp4#t=0.01',
    videoFullLoop: true,
    cardAspectRatio: '1/1',
    href: '/visual-system-hover',
    excerpt: 'A bento grid where each card previews a video on hover. Clicking opens a draggable, resizable vintage Mac window.',
    year: 'January 2025',
  },
  {
    id: 'film-02',
    title: 'FedCaddy commercial',
    category: 'film',
    thumbnail: '/thumbnails/film-02.jpg',
    video: 'https://cdn.ramintahbaz.com/videos/fedcaddy_video_1%20(1).mp4#t=0.01',
    videoFullLoop: true,
    cardAspectRatio: '4/3',
    href: '/films/film-02',
    excerpt: 'Brief description of the project.',
    year: 'November 2016',
  },
  {
    id: 'bloom',
    title: 'Bloom',
    category: 'interaction',
    thumbnail: '',
    video: 'https://cdn.ramintahbaz.com/videos/preview_bloom.mp4#t=0.01',
    videoFullLoop: true,
    cardAspectRatio: '16/9',
    href: '/interactions/bloom',
    excerpt: 'iOS-inspired pull-down menu, reverse-engineered and packaged.',
    year: 'January 2026',
  },
  {
    id: 'co-creator',
    title: 'Co-creator',
    category: 'product',
    thumbnail: '/thumbnails/co-creator.jpg',
    video: 'https://cdn.ramintahbaz.com/videos/taste_demo.mp4#t=0.01',
    cardAspectRatio: '4/3',
    href: '/products/co-creator',
    excerpt: 'AI co-designer that turns taste into a complete design system.',
    year: 'February 2026',
  },
  {
    id: 'essay-01',
    title: "We've been here before",
    category: 'writing',
    thumbnail: '/thumbnails/essay-01.jpg',
    cardImage: '/images/essays/retro_vintage.png',
    href: '/essays/essay-01',
    excerpt: "Every generation believes it is living through the most consequential technological moment in history. Usually they're right.",
    year: 'December 2024',
  },
  {
    id: 'carousel',
    title: 'Netflix film scroll',
    category: 'interaction',
    thumbnail: '/thumbnails/carousel.jpg',
    video: 'https://cdn.ramintahbaz.com/videos/netflix_scroll.mp4#t=0.01',
    href: '/interactions/carousel',
    excerpt: 'A horizontal scroll with hover lift, parallax drift, and mobile focus scaling.',
    year: 'November 2024',
  },
  {
    id: 'keycadets',
    title: 'Keycadets (acquired)',
    category: 'product',
    thumbnail: '/thumbnails/keycadets.png',
    video: '/images/keycadets/248285912_4711445322210021_8637902604872814185_n.MOV',
    href: '/products/keycadets',
    excerpt: 'Founded, designed, and scaled a premium mechanical keyboard brand to national retail. Acquired 2024.',
    year: '2019–2024',
  },
  {
    id: 'film-01',
    title: 'Engineering at Promise',
    category: 'film',
    thumbnail: '/thumbnails/film-01.jpg',
    video: 'https://cdn.ramintahbaz.com/videos/promise_commercial_preview.mp4#t=0.01',
    videoFullLoop: true,
    href: '/films/film-01',
    excerpt: 'Brief description of the project.',
    year: 'July 2025',
  },
  {
    id: 'sunset',
    title: 'Sunset chaser',
    category: 'product',
    thumbnail: '/thumbnails/sunset.png',
    video: 'https://cdn.ramintahbaz.com/videos/preview_sunchaser.mp4#t=0.01',
    videoStart: 1,
    videoFullLoop: true,
    href: '/products/sunset',
    excerpt: 'A location-aware iOS concept that tells you exactly when to step outside.',
    year: 'December 2025',
  },
  {
    id: 'thistrackiscrack',
    title: 'Thistrackiscrack (acquired)',
    category: 'product',
    thumbnail: '/thumbnails/thistrackiscrack.jpg',
    video: '/images/thistrackiscrack/trackiscrack.MOV',
    href: '/products/thistrackiscrack',
    excerpt: 'A music discovery blog I built in high school. It went viral. It was acquired.',
    year: '2008',
  },
  {
    id: 'film-04',
    title: 'Zeke Sanders: Slice of pie',
    category: 'film',
    thumbnail: '/thumbnails/film-04.jpg',
    video: 'https://cdn.ramintahbaz.com/videos/slice%20of%20pie.mp4#t=0.01',
    videoFullLoop: true,
    videoObjectFit: 'cover',
    videoScale: 1.15,
    href: '/films/film-04',
    excerpt: 'Brief description of the project.',
    year: 'June 2023',
  },
  {
    id: 'ai-document-verification',
    title: 'Intelligent document review',
    category: 'product',
    thumbnail: '/thumbnails/ai-document-verification.jpg',
    video: 'https://cdn.ramintahbaz.com/videos/preview_intelligent_document_review.mp4#t=0.01',
    videoObjectFit: 'cover',
    videoFullLoop: true,
    cardAspectRatio: '3/4',
    href: '/products/ai-document-verification',
    excerpt: 'AI-powered eligibility verification that keeps humans in the loop.',
    year: 'January 2026',
  },
  {
    id: 'doritos-loaded',
    title: 'Doritos loaded',
    category: 'product',
    thumbnail: '/thumbnails/doritos-loaded.jpg',
    video: '/images/doritos/231215_The-Garage_Doritos_S01_1x1_H264.mp4',
    cardImage: '/images/doritos/DOR001_PBD_Shot_33_V2_4x5.jpg',
    cardAspectRatio: '1/1',
    href: '/products/doritos-loaded',
    excerpt: 'End-to-end brand activation for Doritos at Coachella — digital ordering, physical booth, and event capture.',
    year: 'June 2023',
  },
  {
    id: 'essay-03',
    title: 'Tuesday night heartbreak',
    category: 'writing',
    thumbnail: '',
    cardImage: '/images/essays/tuesday_night.png',
    href: '/essays/essay-03',
    excerpt: "The loneliness isn't from being alone. It's from never letting yourself fully arrive.",
    year: 'January 2026',
  },
  {
    id: 'film-03',
    title: 'M8 commercial',
    category: 'film',
    thumbnail: '/thumbnails/film-03.jpg',
    video: 'https://cdn.ramintahbaz.com/videos/m8_video_preview.mp4#t=0.01',
    videoFullLoop: true,
    cardAspectRatio: '3/4',
    href: '/films/film-03',
    excerpt: 'Brief description of the project.',
    year: 'November 2013',
  },
  {
    id: 'essay-02',
    title: "Amara's law",
    category: 'writing',
    thumbnail: '',
    cardImage: "/images/essays/Amara's Law.png",
    href: '/essays/essay-02',
    excerpt: "Amara's Law says we overestimate technology in the short term and underestimate it in the long term. We're in the short term right now.",
    year: 'January 2025',
  },
  {
    id: 'film-05',
    title: 'The Zeke Sanders story',
    category: 'film',
    thumbnail: '/thumbnails/film-05.jpg',
    video: 'https://cdn.ramintahbaz.com/videos/zeke%20sanders.mp4#t=0.01',
    videoFullLoop: true,
    videoObjectFit: 'cover',
    videoScale: 1.15,
    href: '/films/film-05',
    excerpt: 'Brief description of the project.',
    year: 'June 2021',
  },
  {
    id: 'ramin-skill',
    title: 'Design engineer skill',
    category: 'interaction',
    thumbnail: '',
    /** Bump `v` when replacing the file so clients don’t keep a cached copy */
    video: 'https://cdn.ramintahbaz.com/videos/payment_plan_skill.mp4#t=0.01',
    cardAspectRatio: '1/1',
    videoObjectFit: 'contain',
    href: '/interactions/ramin-skill',
    excerpt:
      'A CLI skill for design and engineering review—animation, forms, mobile, and hierarchy in one pass.',
    year: 'March 2026',
  },
  {
    id: 'promise-console',
    title: 'Promise Console',
    category: 'product' as const,
    href: '/products/promise-console',
    excerpt: 'An agentic ops console for government benefit payment infrastructure.',
    year: 'January 2026',
    video: PROMISE_COMMERCIAL_PREVIEW_VIDEO,
    thumbnail: PROMISE_CONSOLE_WORK_PAGE_VIDEO,
    cardAspectRatio: '4/3',
  },
  {
    id: 'nacha',
    title: 'Disbursement ledger',
    category: 'product' as const,
    href: '/products/nacha',
    excerpt:
      'Reconciliation infrastructure for relief disbursement — append-only ledger, NACHA generation, and automated returns parsing.',
    year: 'March 2026',
    video: NACHA_PREVIEW_VIDEO,
    thumbnail: NACHA_PREVIEW_VIDEO,
    cardAspectRatio: '4/3',
  },
];

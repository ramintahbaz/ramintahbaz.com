'use client';

import type * as THREE from 'three';
import { useEffect, useLayoutEffect, useRef, useState, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCategoryFilter } from '@/contexts/CategoryFilterContext';
import { useSplash } from '@/contexts/SplashContext';
import type { ProjectModalProject } from '@/components/ProjectModal';
import { BentoCard } from '@/components/BentoCard';
import SignalIcon from '@/components/SignalIcon';

const ProjectModal = dynamic(
  () => import('@/components/ProjectModal').then((m) => ({ default: m.ProjectModal })),
  { ssr: false, loading: () => null }
);

// ─────────────────────────────────────────────────────────────
// WORK ITEMS CONFIG
// Add / remove / edit items here to manage your portfolio.
// thumbnail: path relative to /public  (e.g. '/thumbnails/foo.jpg')
// video:     optional looping mp4 preview (also in /public)
// ─────────────────────────────────────────────────────────────
export const WORK_ITEMS: WorkItem[] = [
  {
    id: 'photoboom',
    title: 'PhotoBoom',
    category: 'interaction',
    thumbnail: '',
    video: '/videos/photo_boom_video.mp4',
    href: '/photoboom',
    excerpt: 'A photo stack that explodes from wherever you click.',
  },
  {
    id: 'ai-document-verification',
    title: 'Intelligent Document Review',
    category: 'product',
    thumbnail: '/thumbnails/ai-document-verification.jpg',
    video: '/images/ai-document-verification/demo_ritl.mp4',
    videoObjectFit: 'contain',
    href: '/products/ai-document-verification',
    excerpt: 'AI-powered eligibility verification that keeps humans in the loop.',
  },
  {
    id: 'co-creator',
    title: 'Co-Creator',
    category: 'product',
    thumbnail: '/thumbnails/co-creator.jpg',
    video: '/images/co-creator/taste%20%E2%86%92%20system%20demo.mp4',
    href: '/products/co-creator',
    excerpt: 'AI co-designer that turns taste into a complete design system.',
  },
  {
    id: 'keycadets',
    title: 'keycadets (acquired)',
    category: 'product',
    thumbnail: '/thumbnails/keycadets.png',
    video: '/images/keycadets/248285912_4711445322210021_8637902604872814185_n.MOV',
    href: '/products/keycadets',
    excerpt: 'Founded, designed, and scaled a premium mechanical keyboard brand to national retail. Acquired 2024.',
  },
  {
    id: 'film-01',
    title: 'Engineering at Promise',
    category: 'film',
    thumbnail: '/thumbnails/film-01.jpg',
    video: '/videos/promise_commercial_preview.mp4',
    videoFullLoop: true,
    href: '/films/film-01',
    excerpt: 'Brief description of the project.',
  },
  {
    id: 'film-02',
    title: 'FedCaddy Commercial',
    category: 'film',
    thumbnail: '/thumbnails/film-02.jpg',
    video: '/videos/fedcaddy_video_1%20(1).mp4',
    videoFullLoop: true,
    href: '/films/film-02',
    excerpt: 'Brief description of the project.',
  },
  {
    id: 'essay-01',
    title: "We've Been Here Before",
    category: 'writing',
    thumbnail: '/thumbnails/essay-01.jpg',
    href: '/essays/essay-01',
    excerpt: "Every generation believes it is living through the most consequential technological moment in history. Usually they're right.",
  },
  {
    id: 'carousel',
    title: 'Netflix Film Scroll',
    category: 'interaction',
    thumbnail: '/thumbnails/carousel.jpg',
    video: '/videos/netflix_scroll.mp4',
    href: '/interactions/carousel',
    excerpt: 'A horizontal scroll with hover lift, parallax drift, and mobile focus scaling.',
  },
  {
    id: 'electric-border',
    title: 'Electric Border',
    category: 'interaction',
    thumbnail: '',
    video: '/videos/electric_border.mp4',
    href: '/interactions/electric-border',
    excerpt: 'A card border that writhes. Driven by SVG displacement maps and animated turbulence noise.',
  },
  {
    id: 'bloom',
    title: 'Bloom',
    category: 'interaction',
    thumbnail: '',
    video: '/videos/bloom_video.mp4',
    videoFullLoop: true,
    href: '',
    excerpt: 'iOS-inspired pull-down menu, reverse-engineered and packaged.',
  },
  {
    id: 'payment-status',
    title: 'Payment Status',
    category: 'interaction',
    thumbnail: '',
    video: '/videos/payment_processing.mp4',
    href: '',
    excerpt: 'A button that cycles through payment states. Each state gets its own motion.',
  },
  {
    id: 'visual-system-hover',
    title: 'Visual System Hover',
    category: 'interaction',
    thumbnail: '',
    video: '/videos/visal_hover.mp4',
    videoFullLoop: true,
    href: '/visual-system-hover',
    excerpt: 'A bento grid where each card previews a video on hover. Clicking opens a draggable, resizable vintage Mac window.',
  },
  {
    id: 'essay-04',
    title: "The Great Flattening",
    category: 'writing',
    thumbnail: '',
    href: '',
    excerpt: "The tools got good enough to close the gap. That's when everything got complicated.",
  },
  {
    id: 'film-03',
    title: 'm8 Commercial',
    category: 'film',
    thumbnail: '/thumbnails/film-03.jpg',
    video: '/videos/m8_video_preview.mp4',
    videoFullLoop: true,
    href: '/films/film-03',
    excerpt: 'Brief description of the project.',
  },
  {
    id: 'film-04',
    title: 'Zeke Sanders: Slice of Pie',
    category: 'film',
    thumbnail: '/thumbnails/film-04.jpg',
    video: '/videos/slice%20of%20pie.mp4',
    videoFullLoop: true,
    videoObjectFit: 'cover',
    videoScale: 1.15,
    href: '/films/film-04',
    excerpt: 'Brief description of the project.',
  },
  {
    id: 'film-05',
    title: 'The Zeke Sanders Story',
    category: 'film',
    thumbnail: '/thumbnails/film-05.jpg',
    video: '/videos/zeke%20sanders.mp4',
    videoFullLoop: true,
    videoObjectFit: 'cover',
    videoScale: 1.15,
    href: '/films/film-05',
    excerpt: 'Brief description of the project.',
  },
  {
    id: 'craft',
    title: 'Craft',
    category: 'product',
    thumbnail: '/thumbnails/craft.png',
    video: '/videos/craft_video.mp4',
    videoFullLoop: true,
    href: '/products/craft',
    excerpt: 'A concept for refining AI-generated components with live controls and immediate visual feedback.',
  },
  {
    id: 'sunset',
    title: 'Sunset Chaser',
    category: 'product',
    thumbnail: '/thumbnails/sunset.png',
    video: '/videos/sunset_chaser.mp4',
    videoStart: 1,
    videoFullLoop: true,
    href: '/products/sunset',
    excerpt: 'A location-aware iOS concept that tells you exactly when to step outside.',
  },
  {
    id: 'thistrackiscrack',
    title: 'ThisTrackisCrack (acquired)',
    category: 'product',
    thumbnail: '/thumbnails/thistrackiscrack.jpg',
    video: '/images/thistrackiscrack/trackiscrack.MOV',
    href: '/products/thistrackiscrack',
    excerpt: 'A music discovery blog I built in high school. It went viral. It was acquired.',
  },
  {
    id: 'doritos-loaded',
    title: 'Doritos Loaded',
    category: 'product',
    thumbnail: '/thumbnails/doritos-loaded.jpg',
    video: '/images/doritos/231215_The-Garage_Doritos_S01_1x1_H264.mp4',
    href: '/products/doritos-loaded',
    excerpt: 'End-to-end brand activation for Doritos at Coachella — digital ordering, physical booth, and event capture.',
  },
  {
    id: 'essay-02',
    title: "Amara's Law",
    category: 'writing',
    thumbnail: '',
    href: '',
    excerpt: "Amara's Law says we overestimate technology in the short term and underestimate it in the long term. We're in the short term right now.",
  },
  {
    id: 'essay-03',
    title: "Tuesday Night Heartbreak",
    category: 'writing',
    thumbnail: '',
    href: '',
    excerpt: "The loneliness isn't from being alone. It's from never letting yourself fully arrive.",
  },
];

// Full essay text for essay-01 (paragraphs as sections)
const ESSAY_01_SECTIONS = [
  { type: 'text' as const, content: "In 1961, IBM installed one of its first commercial computers inside an American office. For the people who worked there, it was not introduced as a helpful tool. It arrived as a signal. A machine that could calculate faster than any human raised immediate questions about replacement, relevance, and control. Entire job categories were suddenly uncertain. And in many cases, they disappeared." },
  { type: 'text' as const, content: 'Every major technological shift begins the same way: with excitement from the people building it, and anxiety from the people living alongside it.' },
  { type: 'text' as const, content: "To the workers of 1961, this moment felt unprecedented. Computers were genuinely new. There was no playbook, no established pattern for how to integrate machines that could perform cognitive work. The complexity was real, both technical and social. The fear was rational." },
  { type: 'text' as const, content: "And yet, looking back, we can see it wasn't the first time. The industrial revolution introduced machines that replaced physical labor. The telegraph compressed time and distance in ways that felt destabilizing. Each wave of automation sparked the same questions: What happens to human work? What gets lost? Who controls these new systems?" },
  { type: 'text' as const, content: 'The pattern repeats because the pattern is structural.' },
  { type: 'text' as const, content: 'New forms of compute arrive. They perform tasks that were previously human. They operate at speeds and scales that feel overwhelming. The people building them see possibility. The people living alongside them see uncertainty. And for a period, sometimes brief, sometimes generational, there is friction.' },
  { type: 'text' as const, content: "Eventually, the technology becomes normalized. Not because the anxiety was irrational, but because society adapts. New roles emerge. Systems become more predictable. The thing that once felt incomprehensible becomes mundane." },
  { type: 'text' as const, content: "Today, we are at the beginning of another cycle. Artificial intelligence and robotics are no longer confined to labs or industrial settings. They are moving into homes, workplaces, and public spaces. And once again, the dominant conversation is about displacement. Will machines replace workers? Will they remove agency? Will they make human roles obsolete?" },
  { type: 'text' as const, content: 'These questions echo almost perfectly those asked sixty years ago.' },
  { type: 'text' as const, content: "To anyone living through this moment, it feels uniquely complex. And it is. AI operates differently than previous forms of compute. It learns, adapts, and makes decisions in ways that are less predictable than deterministic code. The opacity is real. The uncertainty is real." },
  { type: 'text' as const, content: "But the shape of the moment is familiar. What we're experiencing is not a rupture. It's a repetition. The technology is new. The human response is not." },
  { type: 'text' as const, content: 'History suggests that this friction is temporary, not because the concerns are unfounded, but because they always resolve, one way or another. Society adjusts. Systems evolve. The boundaries between human work and machine work shift, as they always have.' },
  { type: 'text' as const, content: "We've Been Here Before." },
];

// Full essay text for essay-02 (Amara's Law)
const ESSAY_02_SECTIONS = [
  { type: 'text' as const, content: `In the mid-2010s, artificial intelligence was everywhere.` },
  { type: 'text' as const, content: `DeepMind's AlphaGo defeated the world champion at Go, a game previously thought to be beyond machine capability. Self-driving cars were being tested on public roads. Every major technology company announced AI research divisions. Venture capital poured into machine learning startups. The consensus was clear: AI was about to change everything, and it was about to happen fast.` },
  { type: 'text' as const, content: `By 2017, predictions were circulating that truck drivers would be obsolete within five years. Radiologists would be replaced by image recognition systems. Customer service would be entirely automated. The transformation was imminent.` },
  { type: 'text' as const, content: `We are now past that five-year mark.` },
  { type: 'text' as const, content: `Truck drivers are still employed. Radiologists still read scans. Customer service still involves humans. The revolution that seemed inevitable has not arrived on the predicted timeline. And predictably, a new narrative has emerged: maybe AI was overhyped. Maybe the limitations are more fundamental than we thought. Maybe this will take much longer than anyone expected.` },
  { type: 'text' as const, content: `This is exactly where we should be.` },
  { type: 'text' as const, content: `In the 1960s, a computer scientist named Roy Amara observed a pattern in how people respond to new technology. We overestimate its impact in the short term, he said, but underestimate it in the long term. The pattern is so consistent it became known as Amara's Law.` },
  { type: 'text' as const, content: `Every major technological shift follows this curve. Initial excitement leads to inflated expectations. When those expectations aren't met quickly, disappointment sets in. The technology gets written off as hype. And then, quietly, it becomes ubiquitous.` },
  { type: 'text' as const, content: `Electricity followed this pattern. The light bulb was perfected in the 1880s, but factories didn't fundamentally reorganize around electric power until the 1920s. The delay wasn't technical. It was social, organizational, and infrastructural.` },
  { type: 'text' as const, content: `Personal computers followed the same curve. By the 1970s, computing had been around for decades, but the machines were still basement-dwelling mainframes that most people never interacted with. "There is no reason anyone would want a computer in their home," said the CEO of Digital Equipment Corporation in 1977. Within fifteen years, personal computers were standard.` },
  { type: 'text' as const, content: `The internet followed it too. In 1998, an economist wrote that the internet's economic impact would be no greater than the fax machine's. By 2005, he predicted, the phrase "information economy" would sound silly. That was written just as the internet was beginning to reshape nearly every sector of the economy.` },
  { type: 'text' as const, content: `The pattern repeats because the gap between technical capability and social integration is real.` },
  { type: 'text' as const, content: `A technology can work in a lab, or even in controlled deployment, and still take years to become embedded in daily life. Systems need to be built around it. Regulations need to adapt. People need to learn new behaviors. Industries need to reorganize. All of this takes time. More time than the initial excitement accounts for.` },
  { type: 'text' as const, content: `AI is currently in the trough.` },
  { type: 'text' as const, content: `The capabilities demonstrated in the mid-2010s were real. AlphaGo did win. Image recognition did improve dramatically. Natural language processing did advance. But translating those capabilities into widespread, reliable, economically transformative applications has been slower than predicted.` },
  { type: 'text' as const, content: `This doesn't mean the technology failed. It means we're in the part of the cycle where the gap between what's technically possible and what's practically deployed becomes visible.` },
  { type: 'text' as const, content: `The question is not whether AI will become ubiquitous. The question is what happens during the years it takes to get there.` },
  { type: 'text' as const, content: `If Amara's Law holds, and history suggests it does, we are likely underestimating what AI will look like in 2035. Not because the technology will suddenly leap forward, but because the slow work of integration will compound in ways that are hard to see from inside the trough.` },
  { type: 'text' as const, content: `The hype was premature. The disappointment is predictable. And the transformation is still coming.` },
];

// Full essay text for essay-03 (Tuesday Night Heartbreak)
const ESSAY_03_SECTIONS = [
  { type: 'text' as const, content: `We talk about loneliness like it's a sudden thing—like it strikes when you're thirty-five and alone at dinner. But it's not. It's residue. Left behind from years of "almost" and "close enough."` },
  { type: 'text' as const, content: `There's a kind of broken heart nobody talks about. Not the kind from a breakup where someone leaves and you're left picking up the pieces. This one is quieter. This one builds slowly, from saying no to someone who would have loved you completely because they had the wrong job, the wrong look, the wrong background. From walking away from someone who was obsessed with you in the best way because they didn't fit the image in your head. From passing on someone who could have made you happy for the rest of your life because of some quirk or flaw that wouldn't have mattered six months in.` },
  { type: 'text' as const, content: `You were choosing the fantasy of someone better over the reality of someone good. You were protecting yourself so well you forgot what you were protecting yourself for.` },
  { type: 'text' as const, content: `Some people end up married but still carry this broken heart. They settled for someone safe while thinking about the one they passed on. Most don't even realize they're hurting till one anniversary, one quiet fight, and they catch their mind drifting to someone who wasn't "the type," but somehow felt like oxygen. The broken heart followed them down the aisle.` },
  { type: 'text' as const, content: `And then there are the ones who never made it that far. They wake up single one day and realize the protection became the problem. The possibility of connection starts to feel like a threat. Depression creeps in. They see the person they passed on with someone else and compare themselves. That hurts even more. They feel more isolated. It compounds.` },
  { type: 'text' as const, content: `This is becoming more common. Maybe because we have more options now. The illusion of infinite choice making it easier to always think something better is around the corner. Maybe because it's easier to protect yourself when connection is optional.` },
  { type: 'text' as const, content: `But the truth is harder than that. This is a broken heart that comes not from loving and losing, but from never letting yourself love at all.` },
];

// Full essay text for essay-04 (The Great Flattening)
const ESSAY_04_SECTIONS = [
  { type: 'text' as const, content: `Everyone can do everything now, and it's making us worse.` },
  { type: 'text' as const, content: `PMs who learn to prompt think they've learned to design. Designers who generate code think they've learned to build. Developers who architect features think they've learned to product. Everyone's reaching across boundaries that used to require depth to cross, armed with nothing but confidence and a chatbot.` },
  { type: 'text' as const, content: `This impulse isn't new. Putting a camera in everyone's pocket didn't make us all photographers. It just made us all think we were.` },
  { type: 'text' as const, content: `What made great product teams work wasn't division of labor—it was respect for what lay on the other side of the wall. Developers who understood they couldn't pixel-push their way to beauty. Designers who knew their Figma prototypes weren't technical architecture. PMs who recognized that knowing what to build isn't the same as knowing how.` },
  { type: 'text' as const, content: `These tools are powerful. They do collapse timelines. A designer can ship a working prototype now. A developer can mock up interfaces that don't look broken. A PM can explore technical approaches without waiting for a sprint. This is real progress.` },
  { type: 'text' as const, content: `But somewhere in that acceleration, collaboration turned into competition. Your coworker isn't your complement anymore—they're your threat. I can do your job now. You're not special. Watch me. Tools that were supposed to make us powerful have made us paranoid instead.` },
  { type: 'text' as const, content: `Craft dissolves. Respect dissolves. What's left is a workplace of people who've mistaken capability for mastery, each one convinced AI has closed a gap that actually runs deeper than they realize.` },
  { type: 'text' as const, content: `But here's what they're missing, what no amount of prompting can teach: taste isn't a skill you acquire. It's not in the training data. You either see it or you don't. You either feel the wrongness of a bad gradient, the weight of a clumsy interaction, the hollowness of a feature nobody wanted—or you don't.` },
  { type: 'text' as const, content: `These tools can't give you that. They can only reveal who never had it to begin with.` },
];

// Bloom project content (component first so modal renders demo at top)
const BLOOM_SECTIONS = [
  { type: 'component' as const, componentId: 'bloom' },
  { type: 'text' as const, content: `Josh Puckett posted a clip on X. A menu that bloomed outward from a trigger — up, down, left, right — with a physicality web dropdowns never have. It felt native in a way that's hard to fake. I wanted to know how it worked, so I reverse-engineered it and built my own version. Then I packaged it.` },
  { type: 'heading' as const, content: 'The problem with web menus' },
  { type: 'text' as const, content: `Dropdowns fall. Always downward, anchored left, clipped by their container. iOS menus don't work this way — they know where they are on screen, expand toward available space, and feel like they belong to the element that triggered them. Not floating above the DOM. Attached to it.` },
  { type: 'text' as const, content: `Bloom brings that spatial awareness to React. A menu that knows where it is and opens accordingly.` },
  { type: 'heading' as const, content: 'The morph' },
  { type: 'text' as const, content: `What makes Bloom feel different isn't the direction — it's that the button becomes the menu. The container doesn't appear on top of the trigger. It transforms into it, animating width, height, borderRadius, x, y, scale, and boxShadow simultaneously as a single spring-driven shape.` },
  { type: 'text' as const, content: `Two spring configs run in parallel. The container morphs at stiffness 382, damping 29 — snappy without overshooting. Content uses stiffness 403, damping 36, with a 30ms delay so it trails just behind. The container arrives first. The content follows.` },
  { type: 'code' as const, content: `{\n  morphStiffness: 382,\n  morphDamping: 29,\n  contentStiffness: 403,\n  contentDamping: 36,\n  contentDelay: 0.03,\n}` },
  { type: 'component' as const, componentId: 'bloom-morph' },
  { type: 'heading' as const, content: 'The blur' },
  { type: 'text' as const, content: `The trigger blurs out as the menu opens. The content blurs in as it arrives. 8px on the trigger fading out, 10px on the content clearing as it settles. Neither side simply toggles opacity — both pass through a blurred state, which is what gives the transition its softness.` },
  { type: 'code' as const, content: `{\n  triggerBlur: 8,\n  contentBlur: 10,\n}` },
  { type: 'text' as const, content: `That's the detail that makes it feel native. iOS menus don't just appear — they resolve.` },
  { type: 'heading' as const, content: 'Direction' },
  { type: 'text' as const, content: `The core primitive is direction — top, bottom, left, or right. The menu expands along that axis from the trigger's edge, not the menu's corner. Each direction maps to a different x/y offset in the content variants, so the content always feels like it's emerging from the trigger rather than materializing in space.` },
  { type: 'code' as const, content: `<Menu.Root direction="top">` },
  { type: 'component' as const, componentId: 'bloom-direction' },
  { type: 'heading' as const, content: 'Alignment' },
  { type: 'text' as const, content: `Vertical menus can align to the start, center, or end of the trigger. Start sits flush left. Center sits symmetrically. End hangs right.` },
  { type: 'text' as const, content: `When direction is left or right, alignment locks to center. There's no meaningful start or end along that axis, so the option disappears rather than becoming a no-op.` },
  { type: 'code' as const, content: `<Menu.Root direction="bottom" anchor="start">` },
  { type: 'component' as const, componentId: 'bloom-alignment' },
  { type: 'heading' as const, content: 'Accessibility' },
  { type: 'text' as const, content: `When prefers-reduced-motion is active, Bloom swaps the spring entirely — a near-instant config at stiffness 1000, damping 100. The shape still transforms, but without perceptible motion. Blur transitions are removed too. The interaction stays functional without relying on animation to communicate state.` },
  { type: 'code' as const, content: `{ stiffness: 1000, damping: 100 }` },
  { type: 'component' as const, componentId: 'bloom-accessibility' },
  { type: 'heading' as const, content: 'The trigger' },
  { type: 'text' as const, content: `The trigger is whatever you put inside Menu.Trigger — icon, text, avatar, anything. Container size adjusts via buttonSize, accepting a number for square buttons or a { width, height } object for custom shapes.` },
  { type: 'component' as const, componentId: 'bloom-trigger' },
  { type: 'code' as const, content: `<Menu.Container buttonSize={40}>\n<Menu.Container buttonSize={{ width: 100, height: 40 }}>` },
  { type: 'heading' as const, content: 'Credit' },
  { type: 'text' as const, content: `Inspired by @joshpuckett. Built with React and Framer Motion.` },
];

const THISTRACKISCRACK_SECTIONS = [
  { type: 'component' as const, componentId: 'thistrackiscrack' },
  { type: 'text' as const, content: `In 2008 I built a music blog in high school because I couldn't stop finding songs I wanted to share. This Track Is Crack covered emerging EDM and hip hop — reviews, embeds, playlists, a comments section. It found an audience.` },
  { type: 'heading' as const, content: 'The artists' },
  { type: 'text' as const, content: `Krewella, Skrillex, Diplo, Kid Cudi, Wiz Khalifa all showed up on the site early. I wasn't connected — I was just listening to a lot of music and writing about what I found.` },
  { type: 'heading' as const, content: 'The build' },
  { type: 'text' as const, content: `PHP and MySQL. Flash audio players because that's what existed in 2008. HTML and CSS designed in Photoshop. None of it was taught. All of it was figured out along the way.` },
  { type: 'heading' as const, content: 'The acquisition' },
  { type: 'text' as const, content: `It was eventually acquired. I was still in high school. It's here because it's where the building started.` },
];

const DORITOS_SECTIONS = [
  { type: 'component' as const, componentId: 'doritos-loaded' },
  { type: 'text' as const, content: `Coachella runs across two weekends in the California desert. Heat, direct sun, crowds, and patchy connectivity. PepsiCo brought Doritos in as an activation and I was the solo designer on the full experience — the in-app ordering flow, the physical booth environment, and the photography and video that documented it. One brief, one designer, end to end.` },
  { type: 'heading' as const, content: 'The constraint' },
  { type: 'text' as const, content: `Festival environments are hostile to digital interfaces. Screens wash out in direct sunlight. Users are distracted, moving, often holding a drink. Connectivity drops under crowd density. Every design decision had to account for a context that most app work never considers — high ambient brightness, low attention, unreliable data. The interface had to work in a single glance.` },
  { type: 'heading' as const, content: 'The ordering flow' },
  { type: 'text' as const, content: `The in-app flow was built around speed and legibility. Large tap targets, high-contrast type, minimal steps between entry and confirmation. Two SKUs — Base and Protein — meant the menu could be a single screen. No scrolling, no nested categories, no edge cases to navigate. The splash screen set the energy; the menu closed the loop in two taps.` },
  { type: 'component' as const, componentId: 'doritos-flow-images' },
  { type: 'heading' as const, content: 'The booth' },
  { type: 'text' as const, content: `The physical environment had to match the digital one. The booth design carried the same visual language — the red, the bold type, the loaded energy of the brand — into a three-dimensional space. Signage was sized for legibility from a distance in bright light. The layout accounted for queue flow across both weekends.` },
  { type: 'image' as const, content: '/images/doritos/Doritos_Loaded_VIS_FINAL copy_Page_2.png' },
  { type: 'heading' as const, content: 'Photography and video' },
  { type: 'text' as const, content: `Brand activations live or die by their documentation. The photography and video from the event weren't an afterthought — they were scoped into the brief from the start. Two videos, shot on location, captured the product and the environment. The stills covered the booth, the crowd, and the food. The full asset library came back to PepsiCo as part of the deliverable.` },
  { type: 'heading' as const, content: 'Scope' },
  { type: 'text' as const, content: `Solo designer on a PepsiCo brand activation means owning everything: the UX, the visual design, the environmental design, the art direction on set, and the final asset delivery. No handoffs, no waiting. The constraint was also the advantage — every touchpoint was coherent because the same person made all of them.` },
];

const KEYCADETS_SECTIONS = [
  { type: 'component' as const, componentId: 'keycadets' },
  { type: 'text' as const, content: `Keycadets was acquired in 2024. Before that, it was a mechanical keyboard brand I founded from nothing — no investors, no co-founders, no manufacturing background. I designed the full product line, sourced factories, and built the business until it was on shelves at Target, Walmart, Best Buy, MicroCenter, and Drop.com.` },
  { type: 'heading' as const, content: 'The product line' },
  { type: 'text' as const, content: `Over 20 SKUs across five categories: deskmats, keyboards, metal trays, artisan keycap cases, and accessories. Every product was designed from scratch — dimensions, materials, colorways, packaging. The deskmat line came first: large-format, stitched-edge, with surface textures tuned for both mouse glide and aesthetics. The metal trays were a personal obsession — desk organization as an object worth owning.` },
  { type: 'heading' as const, content: 'Design process' },
  { type: 'text' as const, content: `I had no industrial design training. The process was: find a gap in the market, spec the product, find a factory willing to work at small MOQs, iterate on samples until it was right, then launch. Most products went through three to five sample rounds before hitting production. The keyboard line was the hardest — tolerances, switch compatibility, plate materials, case resonance. All of it learned on the job.` },
  { type: 'heading' as const, content: 'Manufacturing' },
  { type: 'text' as const, content: `Everything was sourced and managed directly — no middlemen, no fulfillment partners until scale demanded it. I negotiated tooling costs, managed production timelines, handled quality control on incoming inventory. Getting to national retail requires certifications, barcodes, EDI compliance, vendor portals. I built that infrastructure myself.` },
  { type: 'heading' as const, content: 'Retail' },
  { type: 'text' as const, content: `National retail placement isn't handed to small brands. Target, Walmart, Best Buy, MicroCenter, and Drop.com each have their own vendor requirements, margin expectations, and replenishment processes. Getting on those shelves meant meeting all of it — packaging that scanned correctly, product that didn't generate returns, logistics that could handle purchase orders at scale.` },
  { type: 'component' as const, componentId: 'keycadets-retail' },
  { type: 'heading' as const, content: 'Acquisition' },
  { type: 'text' as const, content: `The company was acquired in 2024. The acquirer got the brand, the SKUs, the retail relationships, and the supplier network. What I got was five years of building something real — a product company with physical goods, national distribution, and a community of customers who actually cared about what we made. It's the foundation everything since has been built on.` },
];

const CRAFT_SECTIONS = [
  { type: 'component' as const, componentId: 'craft' },
  { type: 'text' as const, content: `AI can write a button. What it can't do is know that the scale feels slightly too aggressive, or that 300ms is just a bit slow for this interaction. Craft is a concept for the gap between generated code and finished component — a live editing layer that lets you adjust, preview, and apply changes back to the source without leaving the output.` },
  { type: 'heading' as const, content: 'The problem' },
  { type: 'text' as const, content: `AI-generated code is a starting point, not a finish line. The output is usually structurally sound but visually untuned — wrong radius, stiff animation, spacing that's close but not quite right. The current workflow is: copy the code, paste it into your editor, tweak values manually, reload, repeat. Craft collapses that loop.` },
  { type: 'heading' as const, content: 'Live preview' },
  { type: 'text' as const, content: `Every component renders live inside the panel. The preview reacts to control changes in real time — no save, no reload. You see the scale animation before you commit it. The "Live edit" indicator makes the state explicit: what you're looking at is what the code will produce.` },
  { type: 'component' as const, componentId: 'craft-preview' },
  { type: 'heading' as const, content: 'Interactive controls' },
  { type: 'text' as const, content: `Properties are exposed as typed controls — stepper inputs for numeric values like scale amount and animation speed, color pickers for tokens, radius selectors for shape. Each control maps directly to a code value. Incrementing scale amount from 1.10 to 1.15 updates the Framer Motion prop, not a CSS override.` },
  { type: 'component' as const, componentId: 'craft-controls' },
  { type: 'heading' as const, content: 'Design system layer' },
  { type: 'text' as const, content: `Below the component controls, Craft surfaces the design system context: primary color, border radius, padding values. These aren't read-only — they're the token layer. Changing Button Radius here propagates to every instance, not just the one in front of you. The component and the system stay in sync.` },
  { type: 'heading' as const, content: 'Apply to code' },
  { type: 'text' as const, content: `"Apply to code" writes the changes back. Not a new file, not a diff — the source updates with the adjusted values in place. For a design engineer, it's a faster way to tune. For someone building their first interface, it's a way to understand what each property does by watching it change.` },
  { type: 'heading' as const, content: 'Who it\'s for' },
  { type: 'text' as const, content: `Craft isn't trying to replace the editor. It's for the moment after generation — when the structure is right but the feel isn't. The controls surface what matters without requiring you to know where in the file to look. The feedback is immediate. The output is real code.` },
];

const SUNSET_SECTIONS = [
  { type: 'component' as const, componentId: 'sunset' },
  { type: 'text' as const, content: `My partner is always chasing the perfect sunset. The problem isn't caring — it's timing. You look up and it's already peaked, or you step outside five minutes too late and the color is gone. Sunset Chaser is a concept app that solves exactly that. Location-aware, weather-informed, and built around one question: is tonight worth it, and when do I need to leave?` },
  { type: 'heading' as const, content: 'The screen' },
  { type: 'text' as const, content: `The main screen is built around a single moment: today's peak. A large arc traces the sun's path across the sky, with a glowing orb marking its current position. Below it, a glassmorphic card surfaces everything you need — sunset time, golden hour window, quality rating, cloud cover, temperature, and a gradient bar that visualizes the golden hour score as a spectrum from deep amber to cool blue.` },
  { type: 'text' as const, content: `The bottom row anchors the three moments that matter: when golden hour starts, when peak hits, and when dusk falls. Peak is highlighted in orange — the moment the whole app is built around.` },
  { type: 'heading' as const, content: 'The visual system' },
  { type: 'text' as const, content: `The background is the UI. A rendered sunset gradient — scarlet bleeding into orange bleeding into blue — fills the entire screen and changes with the time of day and forecast quality. The glassmorphic card sits over it with enough translucency to let the gradient breathe through. The app doesn't describe the sunset. It shows it.` },
  { type: 'text' as const, content: `Color palette reads directly from the forecast. Scarlet, Orange, Blue — surfaced as a descriptor under the date, but also expressed through every surface in the app. An excellent sunset means warm dominant tones. A poor one shifts cooler. The UI is a preview of what you're about to see outside.` },
  { type: 'component' as const, componentId: 'sunset-card' },
  { type: 'heading' as const, content: 'Quality' },
  { type: 'text' as const, content: `Sunset quality is a composite score — cloud cover, cloud position, atmospheric conditions, and time of year all factor in. The golden hour bar renders that score as a gradient fill, so 83% looks different from 40% without needing to read the number. The quality label — Excellent, Good, Fair, Poor — gives it a single word to anchor on.` },
  { type: 'heading' as const, content: 'Notifications' },
  { type: 'text' as const, content: `The whole concept runs on a single notification, timed to arrive at the start of golden hour. Not at sunset — at golden hour, when the light is still building and there's time to get somewhere good. The notification carries the quality score and peak time so you can decide in two seconds whether it's worth stepping out.` },
  { type: 'component' as const, componentId: 'sunset-notification' },
];

const CO_CREATOR_SECTIONS = [
  { type: 'component' as const, componentId: 'co-creator' },
  { type: 'text' as const, content: `Design systems start from taste. You see something — a product in a market, a photo, a screenshot — and you know immediately: that's the feeling I want. Co-Creator starts there. Drop in a reference image, describe what you love about it, and the system extracts a full design fingerprint: color palette, typography, border radius, spacing, iconography style, and material properties. Taste becomes system.` },
  { type: 'heading' as const, content: 'The fingerprint' },
  { type: 'text' as const, content: `The core output is a TasteFingerprint — a structured object that describes every design primitive needed to build a coherent visual system. Palette splits into primary, accent, and neutral. Typography captures font family, weight, scale, and line height. Material captures eight physical properties: translucency, blur, gloss, texture, softness, elevation, contrast, and edge highlight. Each one is a number between 0 and 1.` },
  { type: 'code' as const, content: `type TasteFingerprint = {\n  palette: { primary: string[]; accent: string[]; neutral: string[]; contrast: 'low' | 'medium' | 'high' };\n  typography: { category: 'serif' | 'sans-serif' | 'mono'; weight: 'light' | 'regular' | 'medium' | 'bold'; fontFamily?: string };\n  radius: 'sharp' | 'subtle' | 'rounded' | 'pill';\n  spacing: 'tight' | 'medium' | 'airy';\n  material: { translucency: number; blur: number; gloss: number; texture: number; softness: number; elevation: number; contrast: number; edgeHighlight: number };\n  materialStyle: 'flat' | 'glass' | 'neuo' | 'skeuo' | 'solid' | string;\n}` },
  { type: 'heading' as const, content: 'Extraction' },
  { type: 'text' as const, content: `Images are sent to GPT-4o with a structured prompt that instructs the model to think in seven stages: identify content type, extract colors directly, extract typography if visible, infer typography from color mood if not, extract iconography, extract UI-specific details if applicable, and finally infer material style. Temperature is set to 0.2 to keep outputs consistent.` },
  { type: 'text' as const, content: `When typography exists in the image, the model extracts it directly — font family, category, weight, scale. When it doesn't, the model infers what typography would feel right based on the color mood. Earthy browns map to serif fonts. Futuristic blues map to mono. Luxury golds map to elegant display faces. The system derives taste even from images with no text.` },
  { type: 'code' as const, content: `const response = await client.chat.completions.create({\n  model: 'gpt-4o',\n  temperature: 0.2,\n  response_format: { type: 'json_object' },\n  messages: [{\n    role: 'user',\n    content: [\n      { type: 'text', text: prompt },\n      ...imageBuffers.map(b => ({\n        type: 'image_url',\n        image_url: { url: \`data:\${b.mimeType};base64,\${b.base64}\` }\n      }))\n    ]\n  }]\n});` },
  { type: 'heading' as const, content: 'The style modifier' },
  { type: 'text' as const, content: `Alongside the image, users can describe what they love in plain text — "glass-like", "soft shadows", "3D depth". The style text is injected into the prompt as a modifier that nudges specific material properties. Glass-like increases translucency and blur. Matte decreases gloss. 3D depth increases elevation and contrast. The image sets the baseline. The description steers the details.` },
  { type: 'heading' as const, content: 'Material' },
  { type: 'text' as const, content: `Material is the most novel part of the fingerprint. Beyond color and typography, Co-Creator captures the physical feel of a surface — how translucent it is, how much it blurs what's behind it, how glossy, how elevated. These eight values feed a MaterialShowcase component that renders the extracted aesthetic as a live preview: a card surface that reflects the exact material spec extracted from the reference.` },
  { type: 'component' as const, componentId: 'co-creator-fingerprint' },
  { type: 'heading' as const, content: 'Typography inference' },
  { type: 'text' as const, content: `Mood-to-font mapping runs across thirteen categories. Earthy and organic images get Crimson Text or Lora. Futuristic and tech images get JetBrains Mono or Fira Code. Luxury and elegant images get Playfair Display or Cormorant Garamond. The selected font is loaded dynamically via Google Fonts and applied to the output UI, so the result looks and feels like the reference — not just structurally, but typographically.` },
];

const AI_DOC_VERIFICATION_SECTIONS = [
  { type: 'component' as const, componentId: 'ai-document-verification' },
  { type: 'text' as const, content: `Government benefit programs run on documents. Utility bills, IDs, award letters, lease agreements — caseworkers manually review each one to confirm eligibility. At scale, that backlog breaks the system. This is an end-to-end product concept for automating that verification with AI while keeping humans in the loop for everything the model isn't confident about.` },
  { type: 'heading' as const, content: 'The problem' },
  { type: 'text' as const, content: `SNAP, LIHEAP, and similar programs require residents to submit proof documents at application and renewal. A caseworker reviews each submission, extracts the relevant data, and makes an eligibility determination. The process is slow, error-prone, and doesn't scale — a single caseworker might process dozens of cases a day, and any backlog directly delays benefits reaching people who need them.` },
  { type: 'text' as const, content: `The goal was to automate the routine cases entirely, surface edge cases for human review, and make the human review workflow fast enough that caseworkers could handle higher volume without higher headcount.` },
  { type: 'heading' as const, content: 'The pipeline' },
  { type: 'text' as const, content: `Documents are uploaded by residents and routed through Google Cloud Document AI, which extracts structured fields — name, address, amount, date, issuing entity. The extracted data is validated against the case record: does the name match? Is the address in the service area? Is the document dated within the required window?` },
  { type: 'text' as const, content: `Cases where all fields extract cleanly and pass validation are auto-approved. Cases where extraction confidence falls below threshold, or where validation fails, are flagged for human review. In testing, the model auto-processed 94% of submissions.` },
  { type: 'code' as const, content: `const confidence = result.pages[0].formFields\n  .every(field => field.valueDetectedLanguages[0].confidence > 0.85);\n\nif (confidence && validationPassed) {\n  return { status: 'auto-approved' };\n} else {\n  return { status: 'needs-review', flags };\n}` },
  { type: 'heading' as const, content: 'The review interface' },
  { type: 'text' as const, content: `Flagged cases surface in a review queue. The caseworker sees the document on the left, the extracted fields on the right, and any validation failures highlighted inline. They can accept the extracted value, correct it, or mark the document as insufficient. Corrections feed back into the model as labeled training data.` },
  { type: 'text' as const, content: `The feedback loop is the product. Every correction improves extraction accuracy for that document type. Over time, the model handles more edge cases automatically — the human review queue shrinks as the model gets better at the cases it used to flag.` },
  { type: 'component' as const, componentId: 'ai-document-verification-review' },
  { type: 'heading' as const, content: 'Resident experience' },
  { type: 'text' as const, content: `On the resident side, real-time validation catches problems at upload rather than days later. If a document is blurry, expired, or the wrong type, the resident is told immediately with a plain-language explanation and a specific ask. No waiting for a rejection letter. No calling the helpline. The system tells you what it needs.` },
  { type: 'text' as const, content: `Redundant questions disappear. If the document confirms the address, the form doesn't ask for the address again. The AI pre-fills what it can extract and flags only what it can't confirm.` },
  { type: 'heading' as const, content: 'Stack' },
  { type: 'text' as const, content: `React 18 on the front end, Node.js/Express for the API layer, Google Cloud Document AI for extraction. The review queue is a separate interface from the resident-facing upload flow — caseworkers and residents never share the same surface.` },
];

const VISUAL_SYSTEM_HOVER_SECTIONS = [
  { type: 'component' as const, componentId: 'visual-system-hover' },
  { type: 'text' as const, content: `Four people who shaped how I think about what it means to show up fully — Jordan, Jobs, Robin Williams, Mr. Rogers. On desktop, hover a card and a video preview appears beside it. Click and it opens in a window you can move and resize. On mobile, tap to watch. The grid is the navigation. The window is the player.` },
  { type: 'heading' as const, content: 'The grid' },
  { type: 'text' as const, content: `Cards sit at full opacity by default. When any card is hovered, the others dim to 0.6. The hovered card scales to 0.98 — a subtle inward press that signals focus without breaking the layout. Border opacity lifts from 0.1 to 0.5, and a 1px white stroke appears on the left edge. All transitions run at 0.2s easeOut, fast enough to feel instant.` },
  { type: 'component' as const, componentId: 'visual-system-hover-grid' },
  { type: 'heading' as const, content: 'The preview' },
  { type: 'text' as const, content: `On hover, a video popover appears beside the card — to the right for left-column cards, to the left for right-column cards, so it never overlaps the grid. It enters at scale 0.8 with a 20px x-offset and springs to full size in 0.2s. The clip plays from the start and loops at 10 seconds, reset via onTimeUpdate rather than the native loop attribute so the cutoff stays consistent.` },
  { type: 'text' as const, content: `Videos preload as metadata-only on mount — a hidden 1px element appended to the body for each clip. This means the first frame is available instantly when hover fires, with no visible loading delay.` },
  { type: 'code' as const, content: `video.preload = 'metadata';\nvideo.style.width = '1px';\nvideo.style.opacity = '0';\ndocument.body.appendChild(video);` },
  { type: 'component' as const, componentId: 'visual-system-hover-preview' },
  { type: 'heading' as const, content: 'The window' },
  { type: 'text' as const, content: `Clicking a card opens a vintage Mac-style modal. Dark title bar with centered filename, a 6-dot drag handle on the left, and a [CLOSE] button on the right. The window is draggable via mousedown on the title bar — delta from click origin applied directly to Framer Motion values x and y, no state updates, no re-renders. Position resets to center on close.` },
  { type: 'text' as const, content: `The resize handle sits in the bottom-right corner — a triangle of dots cut from the same dark chrome as the title bar. Dragging it updates width and height motion values directly, clamped to a 400×300 minimum. The video fills the content area and scales with the window.`, desktopOnly: true },
  { type: 'code' as const, content: `const deltaX = moveEvent.clientX - startX;\nconst deltaY = moveEvent.clientY - startY;\nx.set(startModalX + deltaX);\ny.set(startModalY + deltaY);` },
  { type: 'component' as const, componentId: 'visual-system-hover-window' },
];

// Carousel project content
const CAROUSEL_SECTIONS = [
  { type: 'component' as const, componentId: 'carousel' },
  { type: 'text' as const, content: `Netflix carousels have a specific feel — cards that lift when you hover them, a row that breathes as you move through it. This is a recreation of that interaction. Horizontal scroll, per-card parallax, hover lift with shadow, and a mobile focus mode where the centered card scales up. Four films. All favorites.` },
  { type: 'heading' as const, content: 'The scroll' },
  { type: 'text' as const, content: `Scrolling is handled in state, not via native overflow. A scrollLeft value drives a CSS transform on the card container, giving precise control over position without any scroll snapping or browser interference. Wheel events fire when horizontal delta exceeds vertical — or when shift is held. The container translates by 120px initially so the first card sits centered rather than flush left.` },
  { type: 'code' as const, content: `const newScroll = Math.max(0, Math.min(maxScroll, scrollLeft + (e.deltaX || e.deltaY)));\nsetScrollLeft(newScroll);` },
  { type: 'component' as const, componentId: 'carousel-scroll' },
  { type: 'heading' as const, content: 'The parallax' },
  { type: 'text' as const, content: `Each card calculates its distance from the viewport center on every render. That distance is multiplied by 0.03 to produce a subtle x offset — cards near the center drift less, cards at the edges drift more. The effect is slight enough to feel ambient rather than mechanical. It gives the row a sense of depth without announcing itself.` },
  { type: 'code' as const, content: `const parallaxOffset = (cardCenter - viewportCenter) * 0.03;` },
  { type: 'heading' as const, content: 'Hover' },
  { type: 'text' as const, content: `On desktop, hovering a card scales it to 1.15 and lifts it 20px on the y-axis. Shadow deepens from 4px to 40px. The spring runs at stiffness 300, damping 30, mass 0.8 — fast enough to feel responsive, heavy enough to feel physical. z-index bumps to 50 so the lifted card clears its neighbors.` },
  { type: 'code' as const, content: `animate={{\n  scale: isHovered ? 1.15 : scrollStyles.scale,\n  y: isHovered ? -20 : 0,\n}}\ntransition={{\n  type: 'spring',\n  stiffness: 300,\n  damping: 30,\n  mass: 0.8,\n}}` },
  { type: 'component' as const, componentId: 'carousel-hover' },
  { type: 'heading' as const, content: 'Mobile focus' },
  { type: 'text' as const, content: `On mobile there's no hover, so the centered card becomes the focal point. A focus zone of cardWidth × 0.6 determines which card is in focus. The focused card scales to 1.1 and lifts 15px. Cards outside the zone scale down to 0.9, with a smooth progress value interpolating between them as you scroll. Transitions switch from spring to a 0.4s tween with a cubic-bezier ease — more predictable on touch.` },
  { type: 'code' as const, content: `const scaleProgress = Math.max(0, Math.min(1, 1 - (distanceFromCenter / focusZone)));\nconst baseScale = isInFocus ? 1.1 : 0.9 + (scaleProgress * 0.2);` },
  { type: 'component' as const, componentId: 'carousel-mobile' },
  { type: 'heading' as const, content: 'Touch' },
  { type: 'text' as const, content: `Touch handling distinguishes horizontal from vertical gestures by comparing deltas. Horizontal movement must exceed vertical by 1.5× and cross a 15px threshold before the carousel claims the gesture. Below that threshold, touch events pass through untouched so the page scrolls normally. Once a horizontal gesture is confirmed, preventDefault fires and the carousel takes over.` },
  { type: 'code' as const, content: `if (!isHorizontalScroll && absDeltaX > absDeltaY * 1.5 && absDeltaX > 15) {\n  isHorizontalScroll = true;\n}` },
];

// Full project data for the modal (one per work item)
export const PROJECT_DETAILS: Record<string, NonNullable<ProjectModalProject>> = Object.fromEntries(
  WORK_ITEMS.map((item) => {
    if (item.id === 'essay-01') {
      return [
        item.id,
        {
          id: item.id,
          title: item.title,
          category: item.category,
          description: "We've Been Here Before.",
          year: 'December 2024',
          thumbnail: '',
          tags: ['Essay', 'AI', 'Technology', 'History'],
          content: { sections: ESSAY_01_SECTIONS },
        },
      ];
    }
    if (item.id === 'essay-02') {
      return [
        item.id,
        {
          id: item.id,
          title: item.title,
          category: item.category,
          description: 'AI hype, disappointment, and inevitable transformation ahead.',
          year: 'January 2025',
          thumbnail: '',
          tags: [],
          content: { sections: ESSAY_02_SECTIONS },
        },
      ];
    }
    if (item.id === 'essay-03') {
      return [
        item.id,
        {
          id: item.id,
          title: item.title,
          category: item.category,
          description: 'The broken heart that comes from never letting yourself love at all.',
          year: 'January 2026',
          thumbnail: '',
          tags: [],
          content: { sections: ESSAY_03_SECTIONS },
        },
      ];
    }
    if (item.id === 'essay-04') {
      return [
        item.id,
        {
          id: item.id,
          title: item.title,
          category: item.category,
          description: "Everyone can do everything now, and it's making us worse.",
          year: 'February 2026',
          thumbnail: '',
          tags: [],
          content: { sections: ESSAY_04_SECTIONS },
        },
      ];
    }
    if (item.id === 'bloom') {
      return [
        item.id,
        {
          id: item.id,
          title: item.title,
          category: item.category,
          description: 'iOS-inspired pull-down menu, reverse-engineered and packaged.',
          year: 'January 2026',
          thumbnail: '',
          tags: [],
          content: { sections: BLOOM_SECTIONS },
        },
      ];
    }
    if (item.id === 'electric-border') {
      return [
        item.id,
        {
          id: item.id,
          title: item.title,
          category: item.category,
          description: 'A card border that writhes. Driven by SVG displacement maps and animated turbulence noise.',
          year: 'January 2026',
          thumbnail: item.thumbnail,
          tags: [],
          link: '/interactions/electric-border',
          content: {
            sections: [
              { type: 'component', componentId: 'electric-border' },
              { type: 'text', content: `Most border effects are cosmetic. A gradient that rotates, a glow that pulses, a shimmer that loops. They look alive but aren't — they're scheduled. Electric Border is different. The edge is physically distorted by a displacement map driven by animated turbulence noise. The border doesn't animate. It writhes.` },
              { type: 'heading', content: 'The filter pipeline' },
              { type: 'text', content: `The entire effect lives inside a single SVG filter. No canvas, no WebGL, no JavaScript running on every frame. A declarative pipeline of filter primitives the browser evaluates continuously.` },
              { type: 'text', content: `Four stages. First, two pairs of feTurbulence nodes generate fractal noise at slightly different frequencies — 0.018 for vertical movement, 0.022 for horizontal. Each is wrapped in a feOffset with an animated dx or dy value, scrolling the noise fields continuously in opposite directions. Two scrolling up, two scrolling down and sideways.` },
              { type: 'code', content: `<feTurbulence type="turbulence" baseFrequency="0.018" numOctaves="8" seed="3" />\n<feOffset>\n  <animate attributeName="dy" values="650; 0" dur="6s" repeatCount="indefinite" />\n</feOffset>` },
              { type: 'component', componentId: 'electric-border-raw' },
              { type: 'heading', content: 'Combining the noise' },
              { type: 'text', content: `The four offset noise fields composite in pairs, then the two pairs blend together using color-dodge. That's the key — color-dodge amplifies bright regions and creates the hot, electric quality in the combined field. A simple blend gives you soft fog. Color-dodge gives you lightning.` },
              { type: 'code', content: `<feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />\n<feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />\n<feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />` },
              { type: 'component', componentId: 'electric-border-chaos' },
              { type: 'heading', content: 'The displacement' },
              { type: 'text', content: `The combined noise field feeds into feDisplacementMap, which takes the source graphic — the card's border div — and displaces each pixel based on the red and blue channels of the noise. Scale controls how far pixels are pushed. At the default of 30, the edge wobbles. At 100, it tears.` },
              { type: 'code', content: `<feDisplacementMap\n  in="SourceGraphic"\n  in2="combinedNoise"\n  scale="30"\n  xChannelSelector="R"\n  yChannelSelector="B"\n/>` },
              { type: 'component', componentId: 'electric-border-pipeline' },
              { type: 'heading', content: 'Live DOM updates' },
              { type: 'text', content: `Changing speed or chaos doesn't trigger a React re-render. Filter attributes update directly on the SVG DOM via refs and requestAnimationFrame — no flicker, no reset, no reconciliation. React owns the state. The browser owns the filter.` },
              { type: 'code', content: `const animates = filter.querySelectorAll('animate');\nanimates[0].setAttribute('dur', \`\${speed}s\`);\n\nconst displacementMap = filter.querySelector('feDisplacementMap');\ndisplacementMap.setAttribute('scale', String(chaos));` },
              { type: 'heading', content: 'The glow layers' },
              { type: 'text', content: `The displacement handles the edge distortion. The glow is separate — two concentric border divs at blur(1px) and blur(4px), driven by CSS variables that update on color change. A background glow div sits behind everything at blur(32px) and scale(1.1), giving the card its ambient halo. Color is driven by oklch, keeping the glow perceptually consistent across the color wheel.` },
              { type: 'code', content: `--electric-light-color: oklch(from var(--electric-border-color) l c h);\n--gradient-color: oklch(from var(--electric-border-color) 0.3 calc(c / 2) h / 0.4);` },
              { type: 'component', componentId: 'electric-border-color' },
              { type: 'heading', content: 'Mobile' },
              { type: 'text', content: `The desktop filter uses 8 and 9 octaves of turbulence with displacement values up to 650. On mobile, octaves drop to 5 and 6, displacement halves to 300 and 250, and each noise field passes through feGaussianBlur before compositing. Smoother and cheaper, without changing the fundamental character of the effect.` },
              { type: 'heading', content: 'The controls' },
              { type: 'text', content: `Speed scales animation duration across all four animate elements simultaneously, with staggered begin offsets maintained proportionally so noise fields stay out of phase. Chaos maps directly to displacement scale. Color updates two CSS custom properties — the hex value and its RGB decomposition — cascading through every glow layer without touching the filter.` },
            ],
          },
        },
      ];
    }
    if (item.id === 'photoboom') {
      return [
        item.id,
        {
          id: item.id,
          title: item.title,
          category: item.category,
          description: 'A photo stack that explodes from wherever you click.',
          year: 'January 2026',
          thumbnail: item.thumbnail,
          tags: [],
          content: {
            sections: [
              { type: 'component', componentId: 'photoboom' },
              { type: 'text', content: `A stack of photos sitting on a surface. You click and they explode outward — fanning across the screen from the exact point you touched, each card landing with its own rotation and vertical drift. Click again and they collapse back into the pile. The interaction is the whole point.` },
              { type: 'heading', content: 'The stack' },
              { type: 'text', content: `At rest, the photos sit in a tight pile. Each card is offset by index * -3 pixels from the one below it, creating visible depth without spreading out. The front card gets a subtle scale on hover — 1.03 — just enough to signal the stack is interactive without giving away what happens next.` },
              { type: 'text', content: `The peek is the second signal. On hover, each card shifts 10 pixels in a different direction — right, left, up-right, down-left — so the stack opens slightly like a hand of cards being fanned. It hints at the explosion before it happens.` },
              { type: 'code', content: `const peekAmount = 10;\nconst directions = [\n  { x: 1, y: 0 },   // right\n  { x: -1, y: 0 },  // left\n  { x: 0.7, y: -0.7 },\n  { x: -0.7, y: 0.7 },\n];` },
              { type: 'component', componentId: 'photoboom-peek' },
              { type: 'heading', content: 'The explosion' },
              { type: 'text', content: `Click lands at a specific point. That point becomes the explosion origin. The cards fan outward from it — not from the center of the stack, but from wherever you clicked. If you click the top-left corner, they spread from there. If you click the bottom-right, they spread from there.` },
              { type: 'text', content: `Desktop layout spaces cards with 160px between centers (200px wide with 40px overlap), starting from the horizontal center. Each card gets a per-index vertical variation — [-22, 14, -12, 20] pixels — and a slight horizontal nudge, so the fanned layout looks natural rather than mechanical.` },
              { type: 'code', content: `const overlap = 40;\nconst spacing = imageWidth - overlap; // 160px\nconst verticalVariation = [-22, 14, -12, 20, -18];\nconst rotation = (index % 2 === 0 ? -3 : 2) + (index * 0.5);` },
              { type: 'heading', content: 'The spring' },
              { type: 'text', content: `The explosion uses three separate spring configurations running in parallel. Position uses stiffness 180 and damping 12 with a mass of 0.6 — low mass makes it feel light and fast, the low damping lets it overshoot slightly before settling. Scale uses a tighter spring at 260/18 so the cards grow crisply. Rotation uses the loosest spring at 150/10, so each card settles into its angle with a slight wobble.` },
              { type: 'code', content: `// explosion\nx: { type: 'spring', stiffness: 180, damping: 12, mass: 0.6 },\nscale: { type: 'spring', stiffness: 260, damping: 18 },\nrotate: { type: 'spring', stiffness: 150, damping: 10 },\ndelay: index * 0.04,` },
              { type: 'component', componentId: 'photoboom-spring' },
              { type: 'text', content: `The collapse is different — it uses easeOut with a 0.5s duration and a fixed 0.08s delay, so all cards begin moving back together rather than cascading in reverse. The stack reforms as a unit.` },
              { type: 'heading', content: 'The cascade' },
              { type: 'text', content: `Each card is delayed by index * 0.04 seconds, so the explosion radiates outward in a cascade rather than all at once. The difference is subtle but meaningful — without it the explosion feels mechanical. With it, the cards feel like they have individual weight.` },
              { type: 'component', componentId: 'photoboom-cascade' },
              { type: 'heading', content: 'Touch' },
              { type: 'text', content: `On mobile the explosion becomes a 2x2 grid centered at x: -84. Tap detection distinguishes a tap from a scroll by measuring total touch movement — anything under 10 pixels is a tap, anything over is a scroll that passes through. This means the interaction never accidentally fires while the user is scrolling the page.` },
              { type: 'code', content: `const isTap = totalMovement < 10;\nif (!isTap) return; // let scroll pass through` },
            ],
          },
        },
      ];
    }
    if (item.id === 'carousel') {
      return [
        item.id,
        {
          id: item.id,
          title: item.title,
          category: item.category,
          description: 'A horizontal scroll with hover lift, parallax drift, and mobile focus scaling.',
          year: 'November 2024',
          thumbnail: '/thumbnails/carousel.jpg',
          tags: [],
          content: { sections: CAROUSEL_SECTIONS },
        },
      ];
    }
    if (item.id === 'thistrackiscrack') {
      return [
        item.id,
        {
          id: item.id,
          title: item.title,
          category: item.category,
          description: 'A music discovery blog I built in high school. It went viral. It was acquired.',
          year: '2008',
          thumbnail: '/thumbnails/thistrackiscrack.jpg',
          tags: [],
          content: { sections: THISTRACKISCRACK_SECTIONS },
        },
      ];
    }
    if (item.id === 'doritos-loaded') {
      return [
        item.id,
        {
          id: item.id,
          title: item.title,
          category: item.category,
          description: 'End-to-end brand activation for Doritos at Coachella — digital ordering, physical booth, and event capture.',
          year: 'June 2023',
          thumbnail: '/thumbnails/doritos-loaded.jpg',
          tags: [],
          content: { sections: DORITOS_SECTIONS },
        },
      ];
    }
    if (item.id === 'keycadets') {
      return [
        item.id,
        {
          id: item.id,
          title: item.title,
          category: item.category,
          description: 'Founded, designed, and scaled a premium mechanical keyboard brand to national retail. Acquired 2024.',
          year: '2019–2024',
          thumbnail: '/thumbnails/keycadets.png',
          tags: [],
          content: { sections: KEYCADETS_SECTIONS },
        },
      ];
    }
    if (item.id === 'craft') {
      return [
        item.id,
        {
          id: item.id,
          title: item.title,
          category: item.category,
          description: 'A concept for refining AI-generated components with live controls and immediate visual feedback.',
          year: 'July 2025',
          thumbnail: '/thumbnails/craft.png',
          tags: [],
          content: { sections: CRAFT_SECTIONS },
        },
      ];
    }
    if (item.id === 'sunset') {
      return [
        item.id,
        {
          id: item.id,
          title: item.title,
          category: item.category,
          description: 'A location-aware iOS concept that tells you exactly when to step outside.',
          year: 'December 2025',
          thumbnail: '/thumbnails/sunset.png',
          tags: [],
          content: { sections: SUNSET_SECTIONS },
        },
      ];
    }
    if (item.id === 'co-creator') {
      return [
        item.id,
        {
          id: item.id,
          title: item.title,
          category: item.category,
          description: 'AI co-designer that turns taste into a complete design system.',
          year: 'February 2026',
          thumbnail: '/thumbnails/co-creator.jpg',
          tags: [],
          content: { sections: CO_CREATOR_SECTIONS },
        },
      ];
    }
    if (item.id === 'ai-document-verification') {
      return [
        item.id,
        {
          id: item.id,
          title: item.title,
          category: item.category,
          description: 'AI-powered eligibility verification that keeps humans in the loop.',
          year: 'January 2026',
          thumbnail: '/thumbnails/ai-document-verification.jpg',
          tags: [],
          content: { sections: AI_DOC_VERIFICATION_SECTIONS },
        },
      ];
    }
    if (item.id === 'visual-system-hover') {
      return [
        item.id,
        {
          id: item.id,
          title: item.title,
          category: item.category,
          description: 'A bento grid where each card previews a video on hover. Clicking opens a draggable, resizable vintage Mac window.',
          year: 'January 2025',
          thumbnail: '',
          tags: [],
          content: { sections: VISUAL_SYSTEM_HOVER_SECTIONS },
        },
      ];
    }
    if (item.id === 'payment-status') {
      return [
        item.id,
        {
          id: item.id,
          title: item.title,
          category: item.category,
          description: 'A payment button that cycles through processing, failed, and complete states.',
          year: 'January 2026',
          thumbnail: '',
          tags: [],
          content: {
            sections: [
              { type: 'component', componentId: 'payment-status' },
              { type: 'text', content: `A button that cycles through payment states. Processing, failed, complete. Each state gets its own color, icon, and motion.` },
              { type: 'text', content: `The button is a single motion.button. Color and background transition on a spring so the shift between states has weight instead of just swapping values.` },
              { type: 'code', content: `transition={{\n  type: 'spring',\n  stiffness: 200,\n  damping: 20,\n}}` },
              { type: 'heading', content: 'Processing' },
              { type: 'text', content: `A quarter-arc SVG path rotating around its center. The full circle sits behind it at 20% opacity to give the arc something to travel along.` },
              { type: 'code', content: `<animateTransform\n  attributeName="transform"\n  type="rotate"\n  dur="1.5s"\n  values="0 12 12;360 12 12"\n  repeatCount="indefinite"\n/>` },
              { type: 'component', componentId: 'payment-status-icons' },
              { type: 'heading', content: 'Failed' },
              { type: 'text', content: `The X scales up to 1.15x and shakes. The delay is intentional — color changes at 0ms, motion starts at 200ms. You see red first, then the icon reacts.` },
              { type: 'code', content: `animate={{ \n  scale: 1.15,\n  x: [0, -3, 3, -3, 0]\n}}\ntransition={{ \n  scale: { type: 'spring', stiffness: 300, damping: 15, delay: 0.2 },\n  x: { duration: 0.4, delay: 0.2 }\n}}` },
              { type: 'component', componentId: 'payment-status-shake' },
              { type: 'heading', content: 'Complete' },
              { type: 'text', content: `strokeDasharray and strokeDashoffset both set to 15 — the full path length. An SVG animate drives the offset to 0 over 0.6s. The checkmark draws itself.` },
              { type: 'code', content: `strokeDasharray="15"\nstrokeDashoffset="15"\n\n<animate\n  attributeName="stroke-dashoffset"\n  values="15;0"\n  dur="0.6s"\n  fill="freeze"\n/>` },
            ],
          },
        },
      ];
    }
    if (item.id === 'film-01') {
      return [item.id, {
        id: item.id,
        title: item.title,
        category: item.category,
        description: 'A documentary portrait of the engineering team at Promise.',
        year: 'July 2025',
        thumbnail: '/thumbnails/film-01.jpg',
        tags: [],
        content: {
          sections: [
            {
              type: 'component',
              componentId: 'film-embed',
              content: 'https://www.youtube.com/embed/_Z3JNDgOLn0',
            },
            { type: 'text', content: `Promise builds payment infrastructure for government. This is a short doc about the engineering team behind it.` },
            { type: 'text', content: `The goal was to show what it actually feels like to work there. Shot over a day at the DC office with a small crew. I handled everything from concept through the final cut.` },
          ],
        },
      }];
    }
    if (item.id === 'film-02') {
      return [item.id, {
        id: item.id,
        title: item.title,
        category: item.category,
        description: 'A commercial for a civic accountability app. Later acquired.',
        year: 'November 2016',
        thumbnail: '/thumbnails/film-02.jpg',
        tags: [],
        content: {
          sections: [
            {
              type: 'component',
              componentId: 'film-embed',
              content: 'https://www.youtube.com/embed/NuDO8lSTBm0',
            },
            { type: 'text', content: `FedCaddy was a civic tech app that gave people visibility into what their elected officials were doing after they got into office. Tracking the bills they voted on, the committees they sat on, and giving constituents a direct line to weigh in before decisions were made. It was later acquired.` },
            { type: 'text', content: `This is the launch commercial. I also designed the full product. The film and the app were built around the same idea. Scouted locations, ran the shoot, cut the edit.` },
          ],
        },
      }];
    }
    if (item.id === 'film-03') {
      return [item.id, {
        id: item.id,
        title: item.title,
        category: item.category,
        description: 'A commercial for a proximity dating app.',
        year: 'November 2013',
        thumbnail: '/thumbnails/film-03.jpg',
        tags: [],
        content: {
          sections: [
            {
              type: 'component',
              componentId: 'film-embed',
              content: 'https://www.youtube.com/embed/NGgevfz9RAs',
            },
            { type: 'text', content: `m8 was a proximity dating app. The premise: you're somewhere like a bar where people are there to meet other people, and the app took care of the hardest part. Breaking the ice. Once that was handled, what followed was real conversation and genuine interaction instead of the superficial back-and-forth of messaging through a phone.` },
            { type: 'text', content: `The commercial was about that moment right before two people meet. I ran the shoot and cut the edit.` },
          ],
        },
      }];
    }
    if (item.id === 'film-04') {
      return [item.id, {
        id: item.id,
        title: item.title,
        category: item.category,
        description: 'A short comedy about a filmmaker trying to carve out his first real break.',
        year: 'June 2023',
        thumbnail: '/thumbnails/film-04.jpg',
        tags: [],
        content: {
          sections: [
            {
              type: 'component',
              componentId: 'film-embed',
              content: 'https://player.vimeo.com/video/819241296',
            },
            { type: 'text', content: `A short comedy about a filmmaker chasing his first real break. The title is pretty literal. A small, hard-won piece of something. The film follows Zeke through the messy, funny, grinding work of trying to get there.` },
            { type: 'text', content: `Associate producer on this one.` },
          ],
        },
      }];
    }
    if (item.id === 'film-05') {
      return [item.id, {
        id: item.id,
        title: item.title,
        category: item.category,
        description: 'A 35-minute comedy about low-budget filmmaking and creative ambition.',
        year: 'June 2021',
        thumbnail: '/thumbnails/film-05.jpg',
        tags: [],
        content: {
          sections: [
            {
              type: 'component',
              componentId: 'film-embed',
              content: 'https://player.vimeo.com/video/712222470',
            },
            { type: 'text', content: `35 minutes. Zeke tries to make his first film on no budget. High points, setbacks, the chaos of low-budget filmmaking. Character-driven and funny throughout.` },
            { type: 'text', content: `Associate producer on this one.` },
          ],
        },
      }];
    }
    return [
      item.id,
      {
        id: item.id,
        title: item.title,
        category: item.category,
        description: 'Brief description of the project.',
        year: '2024',
        thumbnail: item.thumbnail,
        tags: ['Design', 'React'],
        link: item.href,
        content: {
          sections: [
            { type: 'text', content: 'Placeholder intro. This project explores design and engineering at the intersection of product and craft.' },
            { type: 'text', content: 'Additional context and outcomes can be described here. Use the content sections to build out the full case study.' },
          ],
        },
      },
    ];
  })
);

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
export interface WorkItem {
  id: string;
  title: string;
  category: 'product' | 'film' | 'interaction' | 'writing';
  thumbnail: string;
  video?: string;
  videoStart?: number; // start time in seconds when using item.video
  videoLoopSec?: number; // loop duration in seconds (default from HOVER_VIDEO_LOOP_SEC)
  videoFullLoop?: boolean; // when true, play and loop the entire video (no segment)
  videoObjectFit?: 'cover' | 'contain'; // how video fits in the hover card (default cover)
  videoScale?: number; // scale video in hover card to fill (e.g. 1.15 = 15% larger, crops edges)
  href: string;
  excerpt?: string;
  year?: string;
}

interface HoveredWork {
  item: WorkItem;
  screenX: number;
  screenY: number;
}

const CATEGORY_CSS_COLORS: Record<WorkItem['category'], string> = {
  product:     '#c77a88',
  film:        '#9e6b8c',
  interaction: '#c9927a',
  writing:     '#c48a6e',
};

const CATEGORY_LABELS: Record<WorkItem['category'], string> = {
  product:     'Product',
  film:        'Film',
  interaction: 'Interaction',
  writing:     'Writing',
};

const CATEGORY_GL_COLORS: Record<WorkItem['category'], [number, number, number]> = {
  product:     [0.78, 0.47, 0.53],   // distinct rose
  film:        [0.62, 0.42, 0.55],   // distinct mauve
  interaction: [0.79, 0.57, 0.48],   // distinct warm blush
  writing:     [0.77, 0.54, 0.43],   // distinct peach
};

// Visited node: high-contrast purple (classic link style), lit, no flash (session-only)
const VISITED_GL_COLOR: [number, number, number] = [0.6, 0.2, 1];

// All unvisited work nodes use one uniform color (warm blush)
const UNVISITED_WORK_NODE_COLOR: [number, number, number] = [0.79, 0.57, 0.48];

// Shader filter: 0 = all, 1 = product, 2 = film, 3 = interaction, 4 = writing
const CATEGORY_FILTER_INDEX: Record<'all' | WorkItem['category'], number> = {
  all: 0, product: 1, film: 2, interaction: 3, writing: 4,
};

// Hover preview card (neural + grid) — square, media only (no text/tags except writing)
const HOVER_CARD_SIZE = 220;
const HOVER_CARD_PADDING = 16;
const HOVER_CARD_GAP = 8;
const HOVER_VIDEO_LOOP_SEC = 4; // when item.video is set, loop only first N seconds

// ─────────────────────────────────────────────────────────────
// Shaders
// ─────────────────────────────────────────────────────────────
const noiseFn = `
vec3 mod289v3(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289v4(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute4(vec4 x){return mod289v4(((x*34.)+1.)*x);}
vec4 taylorInvSqrt4(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289v3(i);
  vec4 p=permute4(permute4(permute4(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt4(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const NODE_VERT = `${noiseFn}
attribute float nodeSize;attribute float nodeType;attribute vec3 nodeColor;
attribute float distanceFromRoot;attribute float isWorkNode;attribute float workPhaseOffset;attribute float categoryIndex;attribute float workItemIndex;attribute float visited;
uniform float uTime;uniform vec3 uPulsePositions[3];uniform float uPulseTimes[3];
uniform float uPulseSpeed;uniform float uBaseNodeSize;uniform float uFilterCategory;uniform float uWorkNodeSizeMult;uniform float uSelectedWorkItemIndex;
varying vec3 vColor;varying float vIsWorkNode;varying float vPulseIntensity;
varying float vDistanceFromRoot;varying float vGlow;varying float vWorkPhaseOffset;varying float vCategoryIndex;varying float vSelected;varying float vVisited;
float getPulse(vec3 wp,vec3 pp,float pt){
  if(pt<0.)return 0.;float ts=uTime-pt;if(ts<0.||ts>4.)return 0.;
  float pr=ts*uPulseSpeed;float d=distance(wp,pp);
  return smoothstep(3.,0.,abs(d-pr))*smoothstep(4.,0.,ts);}
void main(){
  vVisited=visited;vColor=nodeColor;vIsWorkNode=isWorkNode;vDistanceFromRoot=distanceFromRoot;vWorkPhaseOffset=workPhaseOffset;vCategoryIndex=categoryIndex;
  float sel=(isWorkNode>0.5&&workItemIndex>=0.0&&workItemIndex==uSelectedWorkItemIndex)?1.0:0.0;vSelected=sel;
  vec3 worldPos=(modelMatrix*vec4(position,1.)).xyz;
  float tp=0.;for(int i=0;i<3;i++)tp+=getPulse(worldPos,uPulsePositions[i],uPulseTimes[i]);
  vPulseIntensity=visited>0.5?0.0:min(tp,1.);
  float bf=1.8;float ba=0.25;
  float breathe=visited>0.5?0.95:(isWorkNode>0.5?(sin(uTime*bf+workPhaseOffset)*ba+0.85):0.95);
  float base=nodeSize*breathe;float pulse=base*(1.+vPulseIntensity*2.5);
  vGlow=visited>0.5?0.0:(isWorkNode>0.5?(0.5+0.5*sin(uTime*0.5+distanceFromRoot*0.2)):0.0);
  vec3 modPos=position;
  if(nodeType>0.5){float n=snoise(position*0.08+uTime*0.08);modPos+=normal*n*0.15;}
  vec4 mv=modelViewMatrix*vec4(modPos,1.);
  float sz=pulse*uBaseNodeSize*(1000./-mv.z)*(isWorkNode>0.5?uWorkNodeSizeMult:0.6);
  gl_PointSize=sz*(1.0+sel*0.3);gl_Position=projectionMatrix*mv;}`;

const NODE_FRAG = `
uniform float uTime;uniform vec3 uPulseColors[3];uniform float uFilterCategory;uniform float uWorkNodeBrightness;uniform float uNonWorkOpacity;uniform vec3 uVisitedColor;
varying vec3 vColor;varying float vIsWorkNode;varying float vPulseIntensity;
varying float vDistanceFromRoot;varying float vGlow;varying float vWorkPhaseOffset;varying float vCategoryIndex;varying float vSelected;varying float vVisited;
void main(){
  vec2 c=2.*gl_PointCoord-1.;float d=length(c);if(d>1.)discard;
  float g1=1.-smoothstep(0.,.5,d);float g2=1.-smoothstep(0.,1.,d);float gs=pow(g1,1.2)+g2*0.3;
  vec3 col;float alpha=gs*(0.95-0.3*d);
  if(vVisited>0.5){col=uVisitedColor*1.8;col+=vec3(1.)*smoothstep(0.4,0.,d)*0.3;}
  else{
  float bc=vIsWorkNode>0.5?(0.9+0.1*sin(uTime*0.6+vDistanceFromRoot*0.25)):0.95;
  col=vColor*bc;
  if(vIsWorkNode>0.5){col=vColor*1.4;}
  if(vPulseIntensity>0.){vec3 pc=mix(vec3(1.),uPulseColors[0],0.4);col=mix(col,pc,vPulseIntensity*0.8);col*=(1.+vPulseIntensity*1.2);gs*=(1.+vPulseIntensity);}
  col+=vec3(1.)*smoothstep(0.4,0.,d)*0.3;col*=(1.+vGlow*0.1);
  if(uFilterCategory>0.0&&abs(vCategoryIndex-uFilterCategory)>0.5)alpha*=0.12;
  if(vSelected>0.5){col*=(1.0+0.08*sin(uTime*2.0));alpha*=1.1;}
  }
  if(vIsWorkNode<0.5){gl_FragColor=vec4(col*0.3,alpha*uNonWorkOpacity);return;}
  gl_FragColor=vec4(col*uWorkNodeBrightness,alpha);}`;

const CONN_VERT = `${noiseFn}
attribute vec3 startPoint;
attribute vec3 endPoint;
attribute float connectionStrength;
attribute float pathIndex;
attribute vec3 connectionColor;
uniform float uTime;
uniform vec3 uPulsePositions[3];
uniform float uPulseTimes[3];
uniform float uPulseSpeed;
varying vec3 vColor;
varying float vConnectionStrength;
varying float vPulseIntensity;
varying float vPathPosition;
varying float vDistanceFromCamera;
float getPulse(vec3 wp, vec3 pp, float pt) {
  if (pt < 0.0) return 0.0;
  float ts = uTime - pt;
  if (ts < 0.0 || ts > 4.0) return 0.0;
  float pr = ts * uPulseSpeed;
  float dist = distance(wp, pp);
  return smoothstep(3.0, 0.0, abs(dist - pr)) * smoothstep(4.0, 0.0, ts);
}
void main() {
  float t = position.x;
  vPathPosition = t;
  vec3 finalPos = mix(startPoint, endPoint, t);
  vec3 worldPos = (modelMatrix * vec4(finalPos, 1.0)).xyz;
  float tp = 0.0;
  for (int i = 0; i < 3; i++) tp += getPulse(worldPos, uPulsePositions[i], uPulseTimes[i]);
  vPulseIntensity = min(tp, 1.0);
  vColor = connectionColor;
  vConnectionStrength = connectionStrength;
  vDistanceFromCamera = length(worldPos - cameraPosition);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
}`;

const CONN_FRAG = `
uniform float uTime;
uniform vec3 uPulseColors[3];
varying vec3 vColor;
varying float vConnectionStrength;
varying float vPulseIntensity;
varying float vPathPosition;
varying float vDistanceFromCamera;
void main() {
  vec3 finalColor = vColor * 0.5;
  float alpha = 0.15 * vConnectionStrength;
  if (vPulseIntensity > 0.0) {
    vec3 pulseColor = mix(vec3(1.0), uPulseColors[0], 0.3);
    finalColor = mix(finalColor, pulseColor * 1.2, vPulseIntensity * 0.7);
    alpha = mix(alpha, min(1.0, alpha * 4.0), vPulseIntensity);
  }
  float distanceFade = smoothstep(100.0, 15.0, vDistanceFromCamera);
  gl_FragColor = vec4(finalColor, alpha * distanceFade);
}`;

// ─────────────────────────────────────────────────────────────
// Dev control panel (?dev=true)
// ─────────────────────────────────────────────────────────────
type DevParams = {
  lineOpacity: number;
  lineBrightness: number;
  workNodeSizeMult: number;
  workNodeBrightness: number;
  nonWorkOpacity: number;
  bloomStrength: number;
  autoRotateSpeed: number;
};

const DEV_PARAMS_DEFAULTS: DevParams = {
  lineOpacity: 0.06,
  lineBrightness: 0.5,
  workNodeSizeMult: 1.0,
  workNodeBrightness: 1.0,
  nonWorkOpacity: 0.15,
  bloomStrength: 1.8,
  autoRotateSpeed: 0.2,
};

function DevPanel({
  devParams,
  setDevParams,
}: {
  devParams: DevParams;
  setDevParams: React.Dispatch<React.SetStateAction<DevParams>>;
}) {
  const copyValues = () => {
    navigator.clipboard.writeText(JSON.stringify(devParams, null, 2));
  };
  const resetToDefaults = () => setDevParams({ ...DEV_PARAMS_DEFAULTS });
  const update = (key: keyof DevParams, value: number) =>
    setDevParams((p) => ({ ...p, [key]: value }));
  const slider = (
    key: keyof DevParams,
    min: number,
    max: number,
    step: number,
    label: string
  ) => (
    <div key={key} style={{ marginBottom: 10 }}>
      <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>
        {label}: {Number(devParams[key]).toFixed(3)}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={devParams[key]}
        onChange={(e) => update(key, Number(e.target.value))}
        style={{ width: '100%', accentColor: '#43e97b' }}
      />
    </div>
  );
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 100,
        width: 260,
        padding: '14px 16px',
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        fontFamily: 'var(--font-geist-sans), sans-serif',
        fontSize: 12,
        color: '#fff',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 13 }}>Dev controls</div>
      {slider('lineOpacity', 0, 0.3, 0.01, 'Line opacity')}
      {slider('lineBrightness', 0, 1, 0.05, 'Line brightness')}
      {slider('workNodeSizeMult', 0.5, 3, 0.1, 'Work node size')}
      {slider('workNodeBrightness', 0.5, 2, 0.05, 'Work node brightness')}
      {slider('nonWorkOpacity', 0, 0.5, 0.01, 'Non-work opacity')}
      {slider('bloomStrength', 0.5, 3, 0.1, 'Bloom strength')}
      {slider('autoRotateSpeed', 0, 2, 0.05, 'Auto-rotate speed')}
      <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
        <button
          type="button"
          onClick={resetToDefaults}
          style={{
            flex: 1,
            padding: '8px 12px',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 8,
            color: '#fff',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          Reset to defaults
        </button>
        <button
          type="button"
          onClick={copyValues}
          style={{
            flex: 1,
            padding: '8px 12px',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 8,
            color: '#fff',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          Copy values
        </button>
      </div>
    </div>
  );
}

function DevPanelWrapper({
  devParams,
  setDevParams,
}: {
  devParams: DevParams;
  setDevParams: React.Dispatch<React.SetStateAction<DevParams>>;
}) {
  const searchParams = useSearchParams();
  if (searchParams.get('dev') !== 'true') return null;
  return <DevPanel devParams={devParams} setDevParams={setDevParams} />;
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
// Hit-test: find closest work node at pointer (returns item or null)
function hitTestWorkNode(
  clientX: number,
  clientY: number,
  camera: any,
  nodes: any[],
  meshRotation: number
): WorkItem | null {
  const px = (clientX / window.innerWidth) * 2 - 1;
  const py = -(clientY / window.innerHeight) * 2 + 1;
  let closest: { item: WorkItem; dist: number } | null = null;
  nodes.forEach((node: any) => {
    if (node.workItemIndex < 0) return;
    const worldPos = node.position.clone();
    worldPos.applyEuler({ x: 0, y: meshRotation, z: 0 } as any);
    const projected = worldPos.clone().project(camera);
    const dist = Math.sqrt((projected.x - px) ** 2 + (projected.y - py) ** 2);
    if (dist < 0.07 && (!closest || dist < closest.dist)) {
      closest = { item: WORK_ITEMS[node.workItemIndex], dist };
    }
  });
  if (closest) return (closest as { item: WorkItem; dist: number }).item;
  return null;
}

export default function NeuralPortfolio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const [hovered, setHovered] = useState<HoveredWork | null>(null);
  const [cardVisible, setCardVisible] = useState(false);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHoveringNodeRef = useRef(false);

  // Touch device detection (SSR-safe)
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    setIsTouchDevice(typeof window !== 'undefined' && 'ontouchstart' in window);
  }, []);

  const [isMobile, setIsMobile] = useState(false);
  useLayoutEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Transition: zoom + fade to black then navigate
  const [transitioningToHref, setTransitioningToHref] = useState<string | null>(null);
  const transitionDurationMs = 500;
  useEffect(() => {
    if (!transitioningToHref) return;
    const t = setTimeout(() => {
      if (transitioningToHref.startsWith('/work/')) sessionStorage.setItem('splashDone', 'true');
      router.push(transitioningToHref);
      setTransitioningToHref(null);
    }, transitionDurationMs);
    return () => clearTimeout(t);
  }, [transitioningToHref, router]);

  // Category filter menu: draggable position (null = default left/bottom)
  const [view, setView] = useState<'neural' | 'grid'>('grid');
  const viewRef = useRef<'neural' | 'grid'>('grid');
  const [neuralRevealed, setNeuralRevealed] = useState(false);
  const [gridRevealed, setGridRevealed] = useState(() => typeof window !== 'undefined' && sessionStorage.getItem('gridRevealedBefore') === 'true');
  const [hasSeenGridBefore, setHasSeenGridBefore] = useState(false);
  const [returnedFromProject, setReturnedFromProject] = useState(() => typeof window !== 'undefined' && sessionStorage.getItem('gridVisited') === 'true');
  const searchParams = useSearchParams();
  useEffect(() => {
    if (returnedFromProject && typeof window !== 'undefined') {
      sessionStorage.removeItem('gridVisited');
      setHasSeenGridBefore(true);
      setReturnedFromProject(false);
    }
  }, [returnedFromProject]);
  useEffect(() => {
    const v = searchParams.get('view');
    if (v === 'neural' || v === 'grid') {
      setView(v);
      viewRef.current = v;
    }
  }, [searchParams]);
  // When switching views (grid ↔ neural), close the mobile preview drawer so it doesn't stay open in the new view.
  useEffect(() => {
    setMobilePreviewVisible(false);
    const t = setTimeout(() => setMobilePreview(null), 250);
    return () => clearTimeout(t);
  }, [view]);
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
  // Calm entrance: neural view fades in on load; returning visitors skip delay (avoids re-init glitch on mobile)
  useEffect(() => {
    if (view === 'neural') {
      const visited = typeof window !== 'undefined' && sessionStorage.getItem('neuralVisited') === 'true';
      if (visited) {
        setNeuralRevealed(true);
        return;
      }
      const t = setTimeout(() => {
        setNeuralRevealed(true);
        if (typeof window !== 'undefined') sessionStorage.setItem('neuralVisited', 'true');
      }, 80);
      return () => clearTimeout(t);
    } else {
      setNeuralRevealed(false);
    }
  }, [view]);
  const [gridRevealQuick, setGridRevealQuick] = useState(false);
  // When returning to grid (gridRevealedBefore set): run before paint so grid snaps in at full opacity and no flicker
  useLayoutEffect(() => {
    if (view !== 'grid') return;
    const revealedBefore = typeof window !== 'undefined' && sessionStorage.getItem('gridRevealedBefore') === 'true';
    if (revealedBefore) {
      setGridRevealQuick(true);
      setGridRevealed(true);
    }
  }, [view]);
  // First-time grid load: fade in after delay; when leaving grid, reset
  useEffect(() => {
    if (view === 'grid') {
      const revealedBefore = typeof window !== 'undefined' && sessionStorage.getItem('gridRevealedBefore') === 'true';
      if (!revealedBefore) {
        const t = setTimeout(() => {
          setGridRevealed(true);
          if (typeof window !== 'undefined') sessionStorage.setItem('gridRevealedBefore', 'true');
        }, 80);
        return () => clearTimeout(t);
      }
    } else {
      setGridRevealed(false);
      setGridRevealQuick(false);
    }
  }, [view]);

  const [filterRevealed, setFilterRevealed] = useState(false);
  useEffect(() => {
    if (view === 'neural') {
      setFilterRevealed(true);
      return;
    }
    // view === 'grid': entrance from bottom on first load, else immediate
    const revealedBefore = typeof window !== 'undefined' && sessionStorage.getItem('gridRevealedBefore') === 'true';
    if (revealedBefore) {
      setFilterRevealed(true);
    } else {
      const t = setTimeout(() => setFilterRevealed(true), 500);
      return () => clearTimeout(t);
    }
  }, [view]);

  const [filterMenuPosition, setFilterMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [filterMenuDragging, setFilterMenuDragging] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const gridScrollRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; left: number; top: number } | null>(null);

  const [activeProject, setActiveProject] = useState<ProjectModalProject>(null);
  const activeProjectRef = useRef<ProjectModalProject>(null);
  useEffect(() => {
    activeProjectRef.current = activeProject;
  }, [activeProject]);

  // Session-only: which project nodes/cards have been viewed (reset on refresh; survives in-tab navigation for mobile back)
  const CRAFT_VISITED_IDS_KEY = 'craftVisitedIds';
  const [visitedProjectIds, setVisitedProjectIds] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    const nav = performance.getEntriesByType?.('navigation')?.[0] as { type?: string } | undefined;
    if (nav?.type === 'reload') {
      try { sessionStorage.removeItem(CRAFT_VISITED_IDS_KEY); } catch { /* ignore */ }
      return new Set();
    }
    try {
      const raw = sessionStorage.getItem(CRAFT_VISITED_IDS_KEY);
      if (!raw) return new Set();
      const arr = JSON.parse(raw) as string[];
      return new Set(Array.isArray(arr) ? arr : []);
    } catch {
      return new Set();
    }
  });
  const visitedProjectIdsRef = useRef<Set<string>>(new Set());
  const visitedDelayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    visitedProjectIdsRef.current = visitedProjectIds;
  }, [visitedProjectIds]);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(CRAFT_VISITED_IDS_KEY, JSON.stringify([...visitedProjectIds]));
    } catch { /* ignore */ }
  }, [visitedProjectIds]);
  useEffect(() => {
    return () => {
      if (visitedDelayTimeoutRef.current) clearTimeout(visitedDelayTimeoutRef.current);
    };
  }, []);
  const markProjectViewed = useCallback((projectId: string | undefined) => {
    if (projectId) setVisitedProjectIds(prev => new Set(prev).add(projectId));
  }, []);
  const openProject = useCallback((project: ProjectModalProject) => {
    setActiveProject(project);
    if (project?.id) {
      if (visitedDelayTimeoutRef.current) clearTimeout(visitedDelayTimeoutRef.current);
      visitedDelayTimeoutRef.current = setTimeout(() => {
        visitedDelayTimeoutRef.current = null;
        setVisitedProjectIds(prev => new Set(prev).add(project.id));
      }, 500);
    }
  }, []);

  // Push history when opening project modal so browser back closes modal instead of leaving the page
  useEffect(() => {
    if (!activeProject) return;
    const url = window.location.pathname + window.location.search;
    window.history.pushState({ modal: activeProject.id }, '', url);
  }, [activeProject]);

  // Handle browser back: close modal without full page navigation
  useEffect(() => {
    const onPopState = () => {
      setActiveProject(null);
      setSelectedNodeId(null);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (view !== 'grid' || !gridScrollRef.current) return;
    const saved = sessionStorage.getItem('gridScroll');
    if (!saved) return;
    const scrollTop = Number(saved);
    const raf = requestAnimationFrame(() => {
      if (gridScrollRef.current) gridScrollRef.current.scrollTop = scrollTop;
    });
    return () => cancelAnimationFrame(raf);
  }, [view]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const [mobilePreview, setMobilePreview] = useState<WorkItem | null>(null);
  const [mobilePreviewVisible, setMobilePreviewVisible] = useState(false);

  const [gridHovered, setGridHovered] = useState<{ item: WorkItem; screenX: number; screenY: number } | null>(null);
  const [gridCardVisible, setGridCardVisible] = useState(false);
  const gridHoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // When a project modal opens, hide grid hover card and disable grid hover until modal closes
  useEffect(() => {
    if (!activeProject) return;
    if (gridHoverTimeout.current) clearTimeout(gridHoverTimeout.current);
    setGridCardVisible(false);
    setGridHovered(null);
  }, [activeProject]);

  // Filter menu drag: window move/up listeners
  useEffect(() => {
    if (!filterMenuDragging) return;
    const onMove = (e: MouseEvent) => {
      const start = dragStartRef.current;
      if (start) setFilterMenuPosition({ x: start.left + (e.clientX - start.mouseX), y: start.top + (e.clientY - start.mouseY) });
    };
    const onUp = () => {
      dragStartRef.current = null;
      setFilterMenuDragging(false);
    };
    const onTouchMove = (e: TouchEvent) => {
      const start = dragStartRef.current;
      if (start && e.touches.length === 1) setFilterMenuPosition({ x: start.left + (e.touches[0].clientX - start.mouseX), y: start.top + (e.touches[0].clientY - start.mouseY) });
    };
    const onTouchEnd = () => {
      dragStartRef.current = null;
      setFilterMenuDragging(false);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [filterMenuDragging]);

  const startTransitionThenNavigate = useCallback((href: string) => {
    setTransitioningToHref(href);
  }, []);

  // Store mutable scene refs — updated inside useEffect, read in event handlers
  const networkNodesRef = useRef<any[]>([]);
  const meshRotationRef = useRef(0);
  const cameraRef = useRef<any>(null);
  const triggerPulseRef = useRef<((x: number, y: number) => void) | null>(null);
  const nodeMaterialRef = useRef<any>(null);
  const nodesMeshRef = useRef<any>(null);
  const connMaterialRef = useRef<any>(null);
  const bloomPassRef = useRef<any>(null);
  const controlsRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);

  const { categoryFilter, setCategoryFilter } = useCategoryFilter();
  const { splashDone } = useSplash();
  const categoryFilterRef = useRef(categoryFilter);
  useEffect(() => {
    categoryFilterRef.current = categoryFilter;
  }, [categoryFilter]);
  // After splash is done and we're on grid, mark "seen grid" so switching neural→grid later doesn't re-animate cards
  useEffect(() => {
    if (splashDone && view === 'grid') {
      const t = setTimeout(() => setHasSeenGridBefore(true), 2000);
      return () => clearTimeout(t);
    }
  }, [splashDone, view]);

  const [devParams, setDevParams] = useState<DevParams>(DEV_PARAMS_DEFAULTS);

  useEffect(() => {
    if (!canvasRef.current) return;
    let animId = 0;

    // ── dynamic import so Three.js never runs on the server ──
    async function init() {
      const THREE = await import('three');
      const { OrbitControls } = await import('three/addons/controls/OrbitControls.js' as any);
      const { EffectComposer } = await import('three/addons/postprocessing/EffectComposer.js' as any);
      const { RenderPass } = await import('three/addons/postprocessing/RenderPass.js' as any);
      const { UnrealBloomPass } = await import('three/addons/postprocessing/UnrealBloomPass.js' as any);
      const { OutputPass } = await import('three/addons/postprocessing/OutputPass.js' as any);

      const canvas = canvasRef.current!;
      const W = window.innerWidth, H = window.innerHeight;

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000);
      rendererRef.current = renderer;

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x080506, 0.003);

      const camera = new THREE.PerspectiveCamera(65, W / H, 0.1, 1000);
      // Initial zoom: desktop 22; mobile a bit more zoomed out (28)
      const initialZ = window.innerWidth < 768 ? 28 : 22;
      camera.position.set(0, 4, initialZ);
      cameraRef.current = camera;

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.rotateSpeed = 0.6;
      controls.minDistance = 8;
      controls.maxDistance = 80;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.2;
      controls.enablePan = false;
      controlsRef.current = controls;

      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloomPass = new UnrealBloomPass(new THREE.Vector2(W, H), 1.8, 0.6, 0.7);
      composer.addPass(bloomPass);
      bloomPassRef.current = bloomPass;
      composer.addPass(new OutputPass());

      // ── Starfield ──────────────────────────────────────────
      {
        const count = 6000;
        const pos: number[] = [], col: number[] = [], sz: number[] = [];
        for (let i = 0; i < count; i++) {
          const r = THREE.MathUtils.randFloat(50, 150);
          const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
          const theta = Math.random() * Math.PI * 2;
          pos.push(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
          const c = Math.random();
          if (c < 0.7) col.push(1, 1, 1);
          else if (c < 0.85) col.push(0.7, 0.8, 1);
          else col.push(1, 0.9, 0.8);
          sz.push(THREE.MathUtils.randFloat(0.1, 0.3));
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
        geo.setAttribute('size', new THREE.Float32BufferAttribute(sz, 1));
        const mat = new THREE.ShaderMaterial({
          uniforms: { uTime: { value: 0 } },
          vertexShader: `attribute float size;attribute vec3 color;varying vec3 vColor;uniform float uTime;
            void main(){vColor=color;vec4 mv=modelViewMatrix*vec4(position,1.);
            float tw=sin(uTime*2.+position.x*100.)*.3+.7;
            gl_PointSize=size*tw*(300./-mv.z);gl_Position=projectionMatrix*mv;}`,
          fragmentShader: `varying vec3 vColor;void main(){vec2 c=gl_PointCoord-.5;if(length(c)>.5)discard;
            float a=1.-smoothstep(0.,.5,length(c));gl_FragColor=vec4(vColor,a*.8);}`,
          transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        });
        const stars = new THREE.Points(geo, mat);
        scene.add(stars);
        // animate stars in loop below
        (stars as any)._isStars = true;
        scene.userData.stars = stars;
      }

      // ── Network ────────────────────────────────────────────
      // Generate sphere network
      interface NetNode {
        position: THREE.Vector3;
        connections: { node: NetNode; strength: number }[];
        level: number; type: number; size: number;
        distanceFromRoot: number; workItemIndex: number;
      }

      function makeNode(pos: THREE.Vector3, level = 0, type = 0): NetNode {
        return {
          position: pos, connections: [], level, type,
          size: type === 0 ? THREE.MathUtils.randFloat(0.3, 0.6) : THREE.MathUtils.randFloat(0.3, 0.6),
          distanceFromRoot: 0, workItemIndex: -1,
        };
      }
      function connect(a: NetNode, b: NetNode, s = 1.0) {
        if (!a.connections.some(c => c.node === b)) {
          a.connections.push({ node: b, strength: s });
          b.connections.push({ node: a, strength: s });
        }
      }

      const nodes: NetNode[] = [];
      const root = makeNode(new THREE.Vector3(0, 0, 0), 0, 0);
      root.size = 2.0;
      nodes.push(root);

      const goldenRatio = (1 + Math.sqrt(5)) / 2;
      for (let layer = 1; layer <= 5; layer++) {
        const radius = layer * 2.5;
        const numPts = Math.floor(layer * 14);
        for (let i = 0; i < numPts; i++) {
          const phi = Math.acos(1 - 2 * (i + 0.5) / numPts);
          const theta = 2 * Math.PI * i / goldenRatio;
          const pos = new THREE.Vector3(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
          );
          const isLeaf = layer === 5 || Math.random() < 0.3;
          const node = makeNode(pos, layer, isLeaf ? 1 : 0);
          node.distanceFromRoot = radius;
          nodes.push(node);

          if (layer > 1) {
            const prev = nodes.filter(n => n.level === layer - 1 && n !== root)
              .sort((a, b) => pos.distanceTo(a.position) - pos.distanceTo(b.position));
            for (let j = 0; j < Math.min(3, prev.length); j++) {
              connect(node, prev[j], Math.max(0.3, 1.0 - pos.distanceTo(prev[j].position) / (radius * 2)));
            }
          } else {
            connect(root, node, 0.9);
          }
          const layerNodes = nodes.filter(n => n.level === layer && n !== root);
          for (const other of layerNodes.filter(n => n !== node)
            .sort((a, b) => pos.distanceTo(a.position) - pos.distanceTo(b.position))) {
            if (pos.distanceTo(other.position) < radius * 0.8 && !node.connections.some(c => c.node === other))
              connect(node, other, 0.6);
          }
        }
      }

      // Assign work items to most-connected mid-layer nodes
      const candidates = nodes
        .filter(n => n !== root && n.level >= 2 && n.level <= 4)
        .sort((a, b) => b.connections.length - a.connections.length);
      const picked = candidates.slice(0, WORK_ITEMS.length);
      for (let i = picked.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [picked[i], picked[j]] = [picked[j], picked[i]];
      }
      picked.forEach((node, i) => {
        node.workItemIndex = i;
        node.size = THREE.MathUtils.randFloat(1.4, 1.8);
      });

      networkNodesRef.current = nodes;

      // ── Node geometry ──────────────────────────────────────
      const nPos: number[] = [], nType: number[] = [], nSize: number[] = [];
      const nColor: number[] = [], nDist: number[] = [], nIsWork: number[] = [], nPhase: number[] = [], nCategoryIdx: number[] = [], nWorkItemIdx: number[] = [], nVisited: number[] = [];

      nodes.forEach(node => {
        nPos.push(node.position.x, node.position.y, node.position.z);
        nType.push(node.type);
        nSize.push(node.size);
        nDist.push(node.distanceFromRoot);
        nWorkItemIdx.push(node.workItemIndex >= 0 ? node.workItemIndex : -1);
        nVisited.push(0); // updated when visitedProjectIds changes
        if (node.workItemIndex >= 0) {
          const cat = WORK_ITEMS[node.workItemIndex].category;
          const [r, g, b] = UNVISITED_WORK_NODE_COLOR;
          nColor.push(r, g, b);
          nIsWork.push(1.0);
          nPhase.push(node.workItemIndex * 0.63);
          nCategoryIdx.push(CATEGORY_FILTER_INDEX[cat]);
        } else {
          const bc = [0.45, 0.38, 0.42]; // muted mauve-grey for all non-work nodes
          nColor.push(bc[0], bc[1], bc[2]);
          nIsWork.push(0.0);
          nPhase.push(0.0);
          nCategoryIdx.push(0.0);
        }
      });

      const pulseUniforms = {
        uTime: { value: 0 },
        uPulsePositions: { value: [new THREE.Vector3(1e3,1e3,1e3), new THREE.Vector3(1e3,1e3,1e3), new THREE.Vector3(1e3,1e3,1e3)] },
        uPulseTimes: { value: [-1e3, -1e3, -1e3] },
        uPulseColors: { value: [new THREE.Color(1,1,1), new THREE.Color(1,1,1), new THREE.Color(1,1,1)] },
        uPulseSpeed: { value: 18.0 },
      };

      const nGeo = new THREE.BufferGeometry();
      nGeo.setAttribute('position', new THREE.Float32BufferAttribute(nPos, 3));
      nGeo.setAttribute('nodeType', new THREE.Float32BufferAttribute(nType, 1));
      nGeo.setAttribute('nodeSize', new THREE.Float32BufferAttribute(nSize, 1));
      nGeo.setAttribute('nodeColor', new THREE.Float32BufferAttribute(nColor, 3));
      nGeo.setAttribute('distanceFromRoot', new THREE.Float32BufferAttribute(nDist, 1));
      nGeo.setAttribute('isWorkNode', new THREE.Float32BufferAttribute(nIsWork, 1));
      nGeo.setAttribute('workPhaseOffset', new THREE.Float32BufferAttribute(nPhase, 1));
      nGeo.setAttribute('categoryIndex', new THREE.Float32BufferAttribute(nCategoryIdx, 1));
      nGeo.setAttribute('workItemIndex', new THREE.Float32BufferAttribute(nWorkItemIdx, 1));
      nGeo.setAttribute('visited', new THREE.Float32BufferAttribute(nVisited, 1));

      const visitedColorVec = new THREE.Vector3(VISITED_GL_COLOR[0], VISITED_GL_COLOR[1], VISITED_GL_COLOR[2]);
      const nMat = new THREE.ShaderMaterial({
        uniforms: { ...pulseUniforms, uBaseNodeSize: { value: 0.6 }, uFilterCategory: { value: 0 }, uWorkNodeSizeMult: { value: 1.0 }, uWorkNodeBrightness: { value: 1.0 }, uNonWorkOpacity: { value: 0.15 }, uSelectedWorkItemIndex: { value: -1 }, uVisitedColor: { value: visitedColorVec } },
        vertexShader: NODE_VERT, fragmentShader: NODE_FRAG,
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      });
      const nodesMesh = new THREE.Points(nGeo, nMat);
      scene.add(nodesMesh);
      nodeMaterialRef.current = nMat;
      nodesMeshRef.current = nodesMesh;
      nMat.uniforms.uFilterCategory.value = CATEGORY_FILTER_INDEX[categoryFilterRef.current];

      // Sync visited attribute from ref (may have been updated before init completed)
      const visitedAttr = nGeo.getAttribute('visited') as THREE.BufferAttribute;
      const visitedArr = visitedAttr.array as Float32Array;
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        visitedArr[i] = node.workItemIndex >= 0 && visitedProjectIdsRef.current.has(WORK_ITEMS[node.workItemIndex].id) ? 1 : 0;
      }
      visitedAttr.needsUpdate = true;

      // ── Connection geometry ────────────────────────────────
      const cPos: number[] = [], cColor: number[] = [], cStr: number[] = [];
      const cStart: number[] = [], cEnd: number[] = [], cPath: number[] = [];
      const seen = new Set<string>();
      let pathIdx = 0;

      nodes.forEach((node, ni) => {
        node.connections.forEach(({ node: other, strength }) => {
          const oi = nodes.indexOf(other);
          if (oi < 0) return;
          const key = `${Math.min(ni,oi)}-${Math.max(ni,oi)}`;
          if (seen.has(key)) return;
          seen.add(key);
          for (let i = 0; i < 20; i++) {
            const t = i / 19;
            cPos.push(t, 0, 0);
            cStart.push(node.position.x, node.position.y, node.position.z);
            cEnd.push(other.position.x, other.position.y, other.position.z);
            cPath.push(pathIdx);
            cStr.push(strength);
            cColor.push(0.55, 0.42, 0.48);
          }
          pathIdx++;
        });
      });

      const cGeo = new THREE.BufferGeometry();
      cGeo.setAttribute('position', new THREE.Float32BufferAttribute(cPos, 3));
      cGeo.setAttribute('startPoint', new THREE.Float32BufferAttribute(cStart, 3));
      cGeo.setAttribute('endPoint', new THREE.Float32BufferAttribute(cEnd, 3));
      cGeo.setAttribute('connectionStrength', new THREE.Float32BufferAttribute(cStr, 1));
      cGeo.setAttribute('connectionColor', new THREE.Float32BufferAttribute(cColor, 3));
      cGeo.setAttribute('pathIndex', new THREE.Float32BufferAttribute(cPath, 1));

      const cMat = new THREE.ShaderMaterial({
        uniforms: { ...pulseUniforms, uLineOpacity: { value: 0.06 }, uLineBrightness: { value: 0.5 } },
        vertexShader: CONN_VERT, fragmentShader: CONN_FRAG,
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      });
      const connMesh = new THREE.LineSegments(cGeo, cMat);
      scene.add(connMesh);
      connMaterialRef.current = cMat;

      // ── Pulse trigger (exposed to pointer handler via ref) ──
      let lastPulseIdx = 0;
      triggerPulseRef.current = (clientX: number, clientY: number) => {
        const px = (clientX / window.innerWidth) * 2 - 1;
        const py = -(clientY / window.innerHeight) * 2 + 1;
        const ray = new THREE.Raycaster();
        ray.setFromCamera(new THREE.Vector2(px, py), camera);
        const plane = new THREE.Plane();
        plane.normal.copy(camera.position).normalize();
        plane.constant = -plane.normal.dot(camera.position) + camera.position.length() * 0.5;
        const pt = new THREE.Vector3();
        if (!ray.ray.intersectPlane(plane, pt)) return;
        const t = clock.getElapsedTime();
        const idx = (lastPulseIdx + 1) % 3;
        lastPulseIdx = idx;
        nMat.uniforms.uPulsePositions.value[idx].copy(pt);
        nMat.uniforms.uPulseTimes.value[idx] = t;
        cMat.uniforms.uPulsePositions.value[idx].copy(pt);
        cMat.uniforms.uPulseTimes.value[idx] = t;
      };

      // ── Animation loop ─────────────────────────────────────
      const clock = new THREE.Clock();
      let rotationPhase = 0;
      const ROTATION_PHASE_RATE = 0.04;
      function animate() {
        animId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        const dt = clock.getDelta();

        if (viewRef.current === 'grid') {
          nMat.uniforms.uTime.value = t;
          cMat.uniforms.uTime.value = t;
          rotationPhase += dt * ROTATION_PHASE_RATE;
          const ry = Math.sin(rotationPhase) * 0.05;
          nodesMesh.rotation.y = ry;
          connMesh.rotation.y = ry;
          meshRotationRef.current = ry;
          const stars = scene.userData.stars as THREE.Points;
          stars.rotation.y += 0.0002;
          (stars.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
          controls.update();
          composer.render();
          return;
        }

        nMat.uniforms.uTime.value = t;
        cMat.uniforms.uTime.value = t;
        if (isHoveringNodeRef.current) {
          controls.autoRotate = false;
          // phase and stars rotation unchanged — no jump when we resume
        } else {
          controls.autoRotate = true;
          rotationPhase += dt * ROTATION_PHASE_RATE;
          const ry = Math.sin(rotationPhase) * 0.05;
          nodesMesh.rotation.y = ry;
          connMesh.rotation.y = ry;
          meshRotationRef.current = ry;
          const stars = scene.userData.stars as THREE.Points;
          stars.rotation.y += 0.0002;
          (stars.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
        }
        controls.update();
        composer.render();
      }
      animate();

      // ── Resize ─────────────────────────────────────────────
      const onResize = () => {
        const W = window.innerWidth, H = window.innerHeight;
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
        renderer.setSize(W, H);
        composer.setSize(W, H);
      };
      window.addEventListener('resize', onResize);

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', onResize);
        renderer.dispose();
        rendererRef.current = null;
      };
    }

    const cleanup = init();
    return () => { cleanup.then(fn => fn?.()); };
  }, []);

  useEffect(() => {
    const mat = nodeMaterialRef.current;
    if (!mat?.uniforms?.uFilterCategory) return;
    mat.uniforms.uFilterCategory.value = CATEGORY_FILTER_INDEX[categoryFilter];
  }, [categoryFilter]);

  useEffect(() => {
    viewRef.current = view;
    if (!rendererRef.current) return;
    if (view === 'grid') {
      rendererRef.current.setPixelRatio(0.5);
    } else {
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
  }, [view]);

  useEffect(() => {
    const mat = nodeMaterialRef.current;
    if (!mat?.uniforms?.uSelectedWorkItemIndex) return;
    mat.uniforms.uSelectedWorkItemIndex.value = selectedNodeId != null ? WORK_ITEMS.findIndex(w => w.id === selectedNodeId) : -1;
  }, [selectedNodeId]);

  // Sync visited node attribute when visitedProjectIds changes (desktop + mobile)
  useEffect(() => {
    const mesh = nodesMeshRef.current;
    const nodes = networkNodesRef.current;
    if (!mesh?.geometry || !nodes?.length) return;
    const geo = mesh.geometry as THREE.BufferGeometry;
    const attr = geo.getAttribute('visited') as THREE.BufferAttribute | undefined;
    if (!attr) return;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      arr[i] = node.workItemIndex >= 0 && visitedProjectIds.has(WORK_ITEMS[node.workItemIndex].id) ? 1 : 0;
    }
    attr.needsUpdate = true;
  }, [visitedProjectIds]);

  useEffect(() => {
    const nMat = nodeMaterialRef.current;
    const cMat = connMaterialRef.current;
    const bloom = bloomPassRef.current;
    const controls = controlsRef.current;
    if (nMat?.uniforms) {
      nMat.uniforms.uWorkNodeSizeMult.value = devParams.workNodeSizeMult;
      nMat.uniforms.uWorkNodeBrightness.value = devParams.workNodeBrightness;
      nMat.uniforms.uNonWorkOpacity.value = devParams.nonWorkOpacity;
    }
    if (cMat?.uniforms) {
      cMat.uniforms.uLineOpacity.value = devParams.lineOpacity;
      cMat.uniforms.uLineBrightness.value = devParams.lineBrightness;
    }
    if (bloom) bloom.strength = devParams.bloomStrength;
    if (controls) controls.autoRotateSpeed = devParams.autoRotateSpeed;
  }, [devParams]);

  // Document-level mousemove: hover works even when cursor is over the floating WorkCard (grid + neural)
  useEffect(() => {
    if (isTouchDevice) return;
    const onDocMouseMove = (e: MouseEvent) => {
      const v = viewRef.current;
      const clientX = e.clientX;
      const clientY = e.clientY;

      if (v === 'grid') {
        if (activeProjectRef.current) {
          if (gridHoverTimeout.current) clearTimeout(gridHoverTimeout.current);
          setGridCardVisible(false);
          setGridHovered(null);
          return;
        }
        const elements = document.elementsFromPoint(clientX, clientY);
        const cardEl = elements.find((el) => el.getAttribute?.('data-work-id'));
        const workId = cardEl?.getAttribute?.('data-work-id');
        const item = workId ? WORK_ITEMS.find((w) => w.id === workId) : null;
        if (item) {
          if (gridHoverTimeout.current) clearTimeout(gridHoverTimeout.current);
          const rect = cardEl!.getBoundingClientRect();
          const cx = Math.max(24, rect.left - HOVER_CARD_SIZE - HOVER_CARD_GAP);
          const cy = Math.max(10, Math.min(rect.top, window.innerHeight - 200));
          setGridHovered({ item, screenX: cx, screenY: cy });
          setGridCardVisible(true);
        } else {
          if (gridHoverTimeout.current) clearTimeout(gridHoverTimeout.current);
          gridHoverTimeout.current = setTimeout(() => {
            setGridCardVisible(false);
            setTimeout(() => setGridHovered(null), 150);
          }, 40);
        }
        return;
      }

      if (v === 'neural') {
        const camera = cameraRef.current;
        const nodes = networkNodesRef.current;
        if (!camera || !nodes.length) {
          if (canvasRef.current) canvasRef.current.style.cursor = 'default';
          return;
        }
        const px = (clientX / window.innerWidth) * 2 - 1;
        const py = -(clientY / window.innerHeight) * 2 + 1;
        const pointer = { x: px, y: py };
        let closest: { item: WorkItem; dist: number } | null = null;
        nodes.forEach((node: any) => {
          if (node.workItemIndex < 0) return;
          const worldPos = node.position.clone();
          worldPos.applyEuler({ x: 0, y: meshRotationRef.current, z: 0 } as any);
          const projected = worldPos.clone().project(camera);
          const dx = projected.x - pointer.x;
          const dy = projected.y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 0.07 && (!closest || dist < closest.dist)) {
            const workItem = WORK_ITEMS[node.workItemIndex];
            if (workItem) closest = { item: workItem, dist };
          }
        });
        const hoverItem: WorkItem | undefined = (closest as { item: WorkItem; dist: number } | null)?.item;
        const sid = selectedNodeId;
        if (hoverItem && hoverItem.id !== sid) {
          if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
          isHoveringNodeRef.current = true;
          const cx = Math.max(24, clientX - HOVER_CARD_SIZE - HOVER_CARD_GAP);
          const cy = Math.max(10, Math.min(clientY, window.innerHeight - 200));
          setHovered({ item: hoverItem, screenX: cx, screenY: cy });
          setCardVisible(true);
          if (canvasRef.current) canvasRef.current.style.cursor = 'pointer';
        } else {
          if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
          hoverTimeout.current = setTimeout(() => {
            isHoveringNodeRef.current = false;
            setCardVisible(false);
            setTimeout(() => setHovered(null), 150);
          }, 40);
          if (canvasRef.current) canvasRef.current.style.cursor = 'default';
        }
      }
    };
    document.addEventListener('mousemove', onDocMouseMove);
    return () => document.removeEventListener('mousemove', onDocMouseMove);
  }, [isTouchDevice, selectedNodeId]);

  const onClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (view === 'grid') return;
    const camera = cameraRef.current;
    const nodes = networkNodesRef.current;
    const hit = camera && nodes.length ? hitTestWorkNode(e.clientX, e.clientY, camera, nodes, meshRotationRef.current) : null;

    if (hit) {
      e.preventDefault();
      e.stopPropagation();
      isHoveringNodeRef.current = false;
      setHovered(null);
      setCardVisible(false);
      if (isMobile) {
        if (visitedDelayTimeoutRef.current) clearTimeout(visitedDelayTimeoutRef.current);
        visitedDelayTimeoutRef.current = setTimeout(() => {
          visitedDelayTimeoutRef.current = null;
          setVisitedProjectIds(prev => new Set(prev).add(hit.id));
        }, 500);
        setMobilePreview(hit);
        setMobilePreviewVisible(true);
        return;
      }
      setSelectedNodeId(hit.id);
      openProject(PROJECT_DETAILS[hit.id] ?? null);
      return;
    }
    triggerPulseRef.current?.(e.clientX, e.clientY);
  }, [view, isTouchDevice, isMobile, router, markProjectViewed, openProject]);

  const dismissMobilePreview = useCallback(() => {
    setMobilePreviewVisible(false);
    setTimeout(() => setMobilePreview(null), 250);
  }, []);

  const isTransitioning = !!transitioningToHref;

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#050508', fontFamily: "'Outfit', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: '@keyframes gridFadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } } @keyframes bentoCardEntry { from { transform: translateY(20px); } to { transform: translateY(0); } }' }} />
      {/* Neural network wrapper — dimmed in grid view, non-interactive; calm fade-in on load */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: view === 'grid' ? (splashDone ? 0.22 : 0) : (neuralRevealed ? 1 : 0),
          transition: 'opacity 1.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
          pointerEvents: view === 'grid' ? 'none' : 'auto',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: 'default' }}
          onClick={onClick}
          onTouchStart={() => { if (view === 'grid') return; }}
          onTouchEnd={() => { if (view === 'grid') return; }}
        />
      </div>

      {/* Grid view overlay — only mounted when grid is active; sibling of neural wrapper so no opacity inheritance */}
      {view === 'grid' && (
        <div
          ref={gridScrollRef}
          onScroll={() => {
            sessionStorage.setItem('gridScroll', String(gridScrollRef.current?.scrollTop ?? 0));
          }}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? '72px 12px 100px' : '80px 24px 120px',
            opacity: gridRevealed ? 1 : 0,
            transform: gridRevealed ? 'translateY(0)' : 'translateY(16px)',
            transition: gridRevealQuick
              ? 'none'
              : 'opacity 1s cubic-bezier(0.25, 0.1, 0.25, 1), transform 1s cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
        >
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
              gridAutoFlow: 'row',
              gap: isMobile ? 8 : 6,
              width: isMobile ? '100%' : '90vw',
              maxWidth: isMobile ? '100%' : 1400,
            }}
          >
            {WORK_ITEMS.map((item, i) => (
              <BentoCard
                key={item.id}
                  item={item}
                  index={i}
                  active={categoryFilter === 'all' || item.category === categoryFilter}
                  visited={visitedProjectIds.has(item.id)}
                  year={PROJECT_DETAILS[item.id]?.year}
                  minHeight={100}
                  isMobile={isMobile}
                  skipEntryAnimation={hasSeenGridBefore || returnedFromProject}
                  startEntryAnimation={splashDone}
                  onSelect={() => {
                    if (isMobile) {
                      setMobilePreview(item);
                      setMobilePreviewVisible(true);
                      const id = item.id;
                      setTimeout(() => {
                        setVisitedProjectIds(prev => new Set(prev).add(id));
                        try {
                          const raw = sessionStorage.getItem(CRAFT_VISITED_IDS_KEY);
                          const set = new Set(raw ? (JSON.parse(raw) as string[]) : []);
                          set.add(id);
                          sessionStorage.setItem(CRAFT_VISITED_IDS_KEY, JSON.stringify([...set]));
                        } catch { /* ignore */ }
                      }, 500);
                    } else {
                      openProject(PROJECT_DETAILS[item.id] ?? null);
                    }
                  }}
                  onHoverChange={(hoverItem, _e, cardRect) => {
                    if (hoverItem && cardRect) {
                      if (gridHoverTimeout.current) clearTimeout(gridHoverTimeout.current);
                      const cx = Math.max(24, cardRect.left - HOVER_CARD_SIZE - HOVER_CARD_GAP);
                      const cy = Math.max(10, Math.min(cardRect.top, window.innerHeight - 200));
                      setGridHovered({ item: hoverItem as WorkItem, screenX: cx, screenY: cy });
                      setGridCardVisible(true);
                    } else {
                      if (gridHoverTimeout.current) clearTimeout(gridHoverTimeout.current);
                      gridHoverTimeout.current = setTimeout(() => {
                        setGridCardVisible(false);
                        setTimeout(() => setGridHovered(null), 150);
                      }, 40);
                    }
                  }}
                />
            ))}
          </div>

          {/* Bio block — mobile only: inline below cards, grid view only; padding above fixed menu */}
          {isMobile && view === 'grid' && (
            <div style={{
              width: '100%',
              marginTop: 32,
              paddingBottom: 40,
            }}>
              <p style={{
                margin: 0,
                fontSize: 11,
                color: 'rgba(255,255,255,0.9)',
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontWeight: 400,
                lineHeight: 1.7,
                transition: 'opacity 0.4s ease',
              }}>
                {categoryFilter === 'all' && `Building fintech interfaces and experimenting with the details that make software feel invisible. Design engineer at Promise.`}
                {categoryFilter === 'interaction' && `Interactions are the punctuation in a product. Easy to miss when they're right, impossible to ignore when they're off. The best ones feel like the interface already knew what you were going to do.`}
                {categoryFilter === 'product' && `Good product stays quiet. It gets out of the way so the person using it feels capable. From idea to shipped, full ownership of every decision.`}
                {categoryFilter === 'film' && `Film is just another way to control what someone feels and when. Swap a component for a lens, a transition for a cut. The problem is the same. Earn attention, hold it, leave the audience somewhere they didn't expect.`}
                {categoryFilter === 'writing' && `These pieces move across technology, craft, and sometimes love. None of them are conclusions — just thoughts that needed somewhere to go. A way to think out loud, share what's on my mind, and see where it lands.`}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Bio block — desktop: fixed bottom-left (both views); padding above filter menu */}
      {!isMobile && (
        <div style={{
          position: 'fixed',
          bottom: 95,
          left: 32,
          zIndex: 10,
          maxWidth: 950,
          pointerEvents: 'none',
        }}>
          <p style={{
            margin: 0,
            fontSize: 12,
            color: 'rgba(255,255,255,0.9)',
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontWeight: 400,
            lineHeight: 1.7,
            transition: 'opacity 0.4s ease',
          }}>
            {categoryFilter === 'all' && `Building fintech interfaces and experimenting with the details that make software feel invisible. Design engineer at Promise.`}
            {categoryFilter === 'interaction' && `Interactions are the punctuation in a product. Easy to miss when they're right, impossible to ignore when they're off. The best ones feel like the interface already knew what you were going to do.`}
            {categoryFilter === 'product' && `Good product stays quiet. It gets out of the way so the person using it feels capable. From idea to shipped, full ownership of every decision.`}
            {categoryFilter === 'film' && `Film is just another way to control what someone feels and when. Swap a component for a lens, a transition for a cut. The problem is the same. Earn attention, hold it, leave the audience somewhere they didn't expect.`}
            {categoryFilter === 'writing' && `These pieces move across technology, craft, and sometimes love. None of them are conclusions — just thoughts that needed somewhere to go. A way to think out loud, share what's on my mind, and see where it lands.`}
          </p>
        </div>
      )}
      {/* Bio block — mobile neural view: fixed, same horizontal padding as grid/filter; above menu */}
      {isMobile && view === 'neural' && (
        <div style={{
          position: 'fixed',
          left: 12,
          right: 12,
          bottom: 100,
          zIndex: 10,
          pointerEvents: 'none',
        }}>
          <p style={{
            margin: 0,
            fontSize: 11,
            color: 'rgba(255,255,255,0.9)',
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontWeight: 400,
            lineHeight: 1.7,
            transition: 'opacity 0.4s ease',
          }}>
            {categoryFilter === 'all' && `Building fintech interfaces and experimenting with the details that make software feel invisible. Design engineer at Promise.`}
            {categoryFilter === 'interaction' && `Interactions are the punctuation in a product. Easy to miss when they're right, impossible to ignore when they're off. The best ones feel like the interface already knew what you were going to do.`}
            {categoryFilter === 'product' && `Good product stays quiet. It gets out of the way so the person using it feels capable. From idea to shipped, full ownership of every decision.`}
            {categoryFilter === 'film' && `Film is just another way to control what someone feels and when. Swap a component for a lens, a transition for a cut. The problem is the same. Earn attention, hold it, leave the audience somewhere they didn't expect.`}
            {categoryFilter === 'writing' && `These pieces move across technology, craft, and sometimes love. None of them are conclusions — just thoughts that needed somewhere to go. A way to think out loud, share what's on my mind, and see where it lands.`}
          </p>
        </div>
      )}
      {/* Black overlay: fade in over 500ms during transition */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          background: '#000',
          opacity: isTransitioning ? 1 : 0,
          transition: `opacity ${transitionDurationMs}ms ease`,
          pointerEvents: isTransitioning ? 'auto' : 'none',
        }}
      />

      {/* Category filter menu — desktop: full menu with drag; mobile: view toggle only; in grid view use fixed + higher z so it always receives clicks above the scroll overlay */}
      <div
          ref={filterMenuRef}
          role="group"
          aria-label="Filter by category"
          style={{
            position: isMobile || (view === 'grid' && !isMobile) ? 'fixed' : 'absolute',
            ...(filterMenuPosition ? { left: filterMenuPosition.x, top: filterMenuPosition.y } : { left: isMobile ? 12 : 32, bottom: 48 }),
            zIndex: isMobile || (view === 'grid' && !isMobile) ? 25 : 10,
            display: 'flex', alignItems: 'center',
            gap: isMobile ? 2 : 4,
            backdropFilter: 'blur(16px)',
            background: 'rgba(28,28,32,0.92)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 8,
            padding: isMobile ? '4px 6px' : '5px 10px 5px 8px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.15)',
            pointerEvents: 'auto',
            fontFamily: 'var(--font-geist-sans), sans-serif',
            opacity: filterRevealed ? 1 : 0,
            transform: filterRevealed ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
        >
          {/* 6-dot drag handle — desktop only; hidden on mobile */}
          {!isMobile && (
          <div
            role="button"
            tabIndex={0}
            aria-label="Drag to move filter menu"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 3,
              marginRight: 4,
              cursor: filterMenuDragging ? 'grabbing' : 'grab',
              touchAction: 'none',
            }}
            aria-hidden={false}
            onMouseDown={(e) => {
              e.preventDefault();
              const el = filterMenuRef.current;
              if (!el) return;
              const r = el.getBoundingClientRect();
              const pos = filterMenuPosition ?? { x: r.left, y: r.top };
              setFilterMenuPosition(pos);
              dragStartRef.current = { mouseX: e.clientX, mouseY: e.clientY, left: pos.x, top: pos.y };
              setFilterMenuDragging(true);
            }}
            onTouchStart={(e) => {
              if (e.touches.length !== 1) return;
              const el = filterMenuRef.current;
              if (!el) return;
              const r = el.getBoundingClientRect();
              const pos = filterMenuPosition ?? { x: r.left, y: r.top };
              setFilterMenuPosition(pos);
              dragStartRef.current = { mouseX: e.touches[0].clientX, mouseY: e.touches[0].clientY, left: pos.x, top: pos.y };
              setFilterMenuDragging(true);
            }}
          >
            {[0,1,2,3,4,5].map(i => (
              <div key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.45)' }} />
        ))}
      </div>
          )}

          {/* Filter pills — desktop: full size; mobile: condensed (no handle, separator, or view swap) */}
          {!isMobile && (
          <>
          {(['all', 'interaction', 'product', 'film', 'writing'] as const).map(key => {
            const isAll = key === 'all';
            const label = isAll ? 'All' : CATEGORY_LABELS[key];
            const selected = (isAll && categoryFilter === 'all') || (!isAll && categoryFilter === key);
            return (
              <button
                key={key}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCategoryFilter(isAll ? 'all' : key);
                }}
                aria-pressed={selected}
                aria-label={isAll ? 'Show all' : `Filter by ${label}`}
                style={{
                  padding: '4px 12px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 11,
                  fontWeight: 500,
                  background: selected ? '#fff' : 'transparent',
                  color: selected ? '#1a1a1a' : 'rgba(255,255,255,0.65)',
                  transition: 'background 0.15s ease, color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!selected) e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = selected ? '#fff' : 'transparent';
                }}
              >
                {label}
              </button>
            );
          })}

          {/* Separator — desktop only; hidden on mobile */}
          <span style={{ color: 'rgba(255,255,255,0.15)', margin: '0 8px', fontSize: 11 }}>|</span>

          {/* View swap (bento grid ↔ neural) — desktop only; hidden on mobile (view swap is in TopBar on mobile) */}
          <button
            onTouchStartCapture={(e) => {
              const next = view === 'neural' ? 'grid' : 'neural';
              setView(next);
              const params = new URLSearchParams(window.location.search);
              params.set('view', next);
              window.history.replaceState(null, '', `?${params.toString()}`);
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
              setView(next);
              const params = new URLSearchParams(window.location.search);
              params.set('view', next);
              window.history.replaceState(null, '', `?${params.toString()}`);
            }}
            title={view === 'neural' ? 'Grid view' : 'Network view'}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 6px',
              borderRadius: 6,
              color: 'rgba(255,255,255,0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 9,
              transition: 'color 0.2s ease',
            }}
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
          </>
          )}

          {/* Mobile only: condensed inline filter pills (no drag handle, no separator, no view swap) */}
          {isMobile && (
            <>
              {(['all', 'interaction', 'product', 'film', 'writing'] as const).map(key => {
                const isAll = key === 'all';
                const label = isAll ? 'All' : CATEGORY_LABELS[key];
                const selected = (isAll && categoryFilter === 'all') || (!isAll && categoryFilter === key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCategoryFilter(isAll ? 'all' : key);
                    }}
                    aria-pressed={selected}
                    aria-label={isAll ? 'Show all' : `Filter by ${label}`}
                    style={{
                      padding: '3px 6px',
                      borderRadius: 6,
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: 10,
                      fontWeight: 500,
                      background: selected ? '#fff' : 'transparent',
                      color: selected ? '#1a1a1a' : 'rgba(255,255,255,0.65)',
                      transition: 'background 0.15s ease, color 0.15s ease',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </>
          )}
        </div>

      {/* Hover card (desktop only); neural view — hide when this node is selected */}
      {!isTouchDevice && view === 'neural' && hovered && hovered.item.id !== selectedNodeId && (
        <WorkCard
          item={hovered.item}
          x={hovered.screenX}
          y={hovered.screenY}
          visible={cardVisible}
          onNavigate={() => openProject(PROJECT_DETAILS[hovered.item.id] ?? null)}
        />
      )}
      {/* Hover card in grid view — same WorkCard style */}
      {!isTouchDevice && view === 'grid' && gridHovered && (
        <WorkCard
          item={{ ...gridHovered.item, year: PROJECT_DETAILS[gridHovered.item.id]?.year ?? gridHovered.item.year }}
          x={gridHovered.screenX}
          y={gridHovered.screenY}
          visible={gridCardVisible}
          onNavigate={() => openProject(PROJECT_DETAILS[gridHovered!.item.id] ?? null)}
        />
      )}
      {isTouchDevice && mobilePreview && (
        <MobilePreviewCard
          item={mobilePreview}
          visible={mobilePreviewVisible}
          onNavigate={() => {
            dismissMobilePreview();
            sessionStorage.setItem('splashDone', 'true');
            if (view === 'grid') sessionStorage.setItem('gridVisited', 'true');
            router.push(`/work/${mobilePreview.id}`);
          }}
          onDismiss={dismissMobilePreview}
        />
      )}

      <ProjectModal project={activeProject} onClose={() => window.history.back()} />

      <Suspense fallback={null}>
        <DevPanelWrapper devParams={devParams} setDevParams={setDevParams} />
      </Suspense>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Hover preview card — square (2× BentoCard height), media or typewriter
// ─────────────────────────────────────────────────────────────
const TYPEWRITER_MS_PER_CHAR = 28;

function WorkCard({ item, x, y, visible, onNavigate }: {
  item: WorkItem; x: number; y: number; visible: boolean; onNavigate: () => void;
}) {
  const excerpt = item.excerpt ?? '';
  const [typewriterLen, setTypewriterLen] = useState(0);
  const isWriting = item.category === 'writing';

  // Typewriter: run when visible and writing; reset when hidden or item changes
  useEffect(() => {
    if (!visible || !isWriting) {
      setTypewriterLen(0);
      return;
    }
    setTypewriterLen(0);
    let idx = 0;
    const id = setInterval(() => {
      idx += 1;
      setTypewriterLen(idx);
      if (idx >= excerpt.length) clearInterval(id);
    }, TYPEWRITER_MS_PER_CHAR);
    return () => clearInterval(id);
  }, [visible, isWriting, excerpt, item.id]);

  const hasMedia = !isWriting && (item.video || (item.thumbnail && item.thumbnail.length > 0));
  const videoSrc = item.video ?? (item.thumbnail && /\.(mp4|mov|MOV)$/.test(item.thumbnail) ? item.thumbnail : null);
  const isVideo = !!videoSrc;
  const loopSegment = !!item.video && !item.videoFullLoop;
  const videoStartSec = item.videoStart ?? 0;
  const loopDurationSec = item.videoLoopSec ?? HOVER_VIDEO_LOOP_SEC;
  const loopEndSec = videoStartSec + loopDurationSec;
  const fallbackGradient =
    item.category === 'product' ? 'linear-gradient(135deg, #3a1520, #1a0a10)'
    : item.category === 'interaction' ? 'linear-gradient(135deg, #3a2010, #1a1008)'
    : item.category === 'film' ? 'linear-gradient(135deg, #20103a, #10081a)'
    : 'linear-gradient(135deg, #251510, #120a08)';

  return (
    <div
      onClick={onNavigate}
      style={{
        position: 'fixed',
        left: x,
        top: y,
        zIndex: 50,
        width: HOVER_CARD_SIZE,
        height: HOVER_CARD_SIZE,
        boxSizing: 'border-box',
        borderRadius: 14,
        cursor: 'pointer',
        background: isWriting ? '#000' : 'rgba(22,22,26,0.96)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 24px 48px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)',
        backdropFilter: isWriting ? 'none' : 'blur(20px)',
        WebkitBackdropFilter: isWriting ? 'none' : 'blur(20px)',
        overflow: 'hidden',
        transform: `translateY(${visible ? 0 : 8}px) scale(${visible ? 1 : 0.97})`,
        opacity: visible ? 1 : 0,
        transition: visible ? 'opacity 0.12s ease, transform 0.12s ease' : 'opacity 0.06s ease, transform 0.06s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {isWriting ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            padding: HOVER_CARD_PADDING,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            background: '#000',
            color: '#fff',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 13,
              fontWeight: 400,
              lineHeight: 1.5,
              color: '#fff',
              display: '-webkit-box',
              WebkitLineClamp: 6,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {excerpt.slice(0, typewriterLen)}
            {typewriterLen < excerpt.length && (
              <span style={{ opacity: 0.7 }}>|</span>
            )}
          </p>
        </div>
      ) : hasMedia ? (
        <>
          {isVideo ? (
            <video
              src={videoSrc!}
              muted
              loop={!loopSegment}
              playsInline
              autoPlay
              preload="metadata"
              onLoadedMetadata={(loopSegment || videoStartSec > 0) ? (e) => { e.currentTarget.currentTime = videoStartSec; } : undefined}
              onTimeUpdate={loopSegment ? (e) => {
                const v = e.currentTarget;
                if (v.currentTime >= loopEndSec) v.currentTime = videoStartSec;
              } : undefined}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                transform: item.videoScale != null ? `scale(${item.videoScale})` : undefined,
                transformOrigin: 'center',
              }}
            />
          ) : (
            <img
              src={item.thumbnail!}
              alt=""
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}
        </>
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: fallbackGradient,
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Mobile preview card (bottom sheet) — redesigned
// ─────────────────────────────────────────────────────────────
const MOBILE_PREVIEW_CATEGORY_LABELS: Record<string, string> = {
  product: 'Product',
  film: 'Film',
  interaction: 'Interaction',
  writing: 'Writing',
};

const MOBILE_PREVIEW_CATEGORY_COLORS: Record<string, string> = {
  product: 'rgba(99,102,241,0.85)',
  film: 'rgba(239,68,68,0.85)',
  interaction: 'rgba(16,185,129,0.85)',
  writing: 'rgba(245,158,11,0.85)',
};

function MobilePreviewCard({ item, visible, onNavigate, onDismiss }: {
  item: WorkItem;
  visible: boolean;
  onNavigate: () => void;
  onDismiss: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaReady, setMediaReady] = useState(false);
  const [typewriterLen, setTypewriterLen] = useState(0);
  const excerpt = item.excerpt ?? '';

  useEffect(() => {
    if (!visible) {
      setMediaReady(false);
      return;
    }
    const t = setTimeout(() => setMediaReady(true), 280);
    return () => clearTimeout(t);
  }, [visible]);

  useEffect(() => {
    if (!visible || item.category !== 'writing') {
      setTypewriterLen(0);
      return;
    }
    setTypewriterLen(0);
    let idx = 0;
    const id = setInterval(() => {
      idx += 1;
      setTypewriterLen(idx);
      if (idx >= excerpt.length) clearInterval(id);
    }, TYPEWRITER_MS_PER_CHAR);
    return () => clearInterval(id);
  }, [visible, item.category, item.excerpt, item.id]);

  const videoSrc = item.video ?? (
    item.thumbnail && /\.(mp4|mov|MOV)$/.test(item.thumbnail)
      ? item.thumbnail
      : null
  );
  const isVideo = !!videoSrc;
  const loopSegment = !!item.video && !item.videoFullLoop;
  const videoStartSec = item.videoStart ?? 0;
  const loopEndSec = videoStartSec + (item.videoLoopSec ?? 4);

  // Mobile preview: Intelligent Document Review video fills the card (override contain)
  const mobileObjectFit = item.id === 'ai-document-verification' ? 'cover' : (item.videoObjectFit ?? 'cover');
  const mobileVideoScale = item.id === 'ai-document-verification' ? 1.1 : (item.videoScale ?? undefined);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (visible && mediaReady) {
      v.currentTime = videoStartSec;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [visible, mediaReady, videoStartSec]);

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !loopSegment) return;
    if (v.currentTime >= loopEndSec) v.currentTime = videoStartSec;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onDismiss}
        style={{
          position: 'fixed', inset: 0, zIndex: 48,
          background: 'rgba(0,0,0,0.5)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: visible ? 'auto' : 'none',
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: 'fixed',
          bottom: 0, left: 0, right: 0,
          zIndex: 49,
          borderRadius: '24px 24px 0 0',
          overflow: 'hidden',
          background: 'rgba(10,10,14,0.97)',
          boxShadow: '0 -24px 80px rgba(0,0,0,0.9)',
          transform: `translateY(${visible ? '0' : '110%'})`,
          transition: 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
          pointerEvents: visible ? 'auto' : 'none',
        }}
      >
        {/* Video / image area */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: 220,
          overflow: 'hidden',
          background: '#0a0a0e',
        }}>
          {/* Writing: typewriter (no mediaReady gate) */}
          {item.category === 'writing' ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(10,10,14,0.97)',
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: '#fff',
                  display: '-webkit-box',
                  WebkitLineClamp: 7,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {excerpt.slice(0, typewriterLen)}
                {typewriterLen < excerpt.length && (
                  <span style={{ opacity: 0.7 }}>|</span>
                )}
              </p>
            </div>
          ) : (
            <>
              {/* Media (mediaReady gate) */}
              {mediaReady ? (
                isVideo ? (
                  <video
                    ref={videoRef}
                    src={videoSrc!}
                    muted
                    playsInline
                    loop={!loopSegment}
                    preload="metadata"
                    onTimeUpdate={handleTimeUpdate}
                    style={{
                      position: 'absolute', inset: 0,
                      width: '100%', height: '100%',
                      objectFit: mobileObjectFit,
                      transform: mobileVideoScale ? `scale(${mobileVideoScale})` : undefined,
                    }}
                  />
                ) : item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    style={{
                      position: 'absolute', inset: 0,
                      width: '100%', height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(255,255,255,0.03)',
                  }} />
                )
              ) : (
                <div style={{ position: 'absolute', inset: 0, background: '#0a0a0e' }} />
              )}

              {/* Gradient scrim */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) 50%, rgba(10,10,14,0.6) 85%, rgba(10,10,14,1) 100%)',
              }} />
            </>
          )}
        </div>

        {/* Bottom section: category, title+year, button */}
        <div style={{ padding: '14px 20px 36px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Title (left) + category (right) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
            <div style={{
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: 17,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.9)',
              letterSpacing: '-0.02em',
              flex: 1,
              minWidth: 0,
            }}>
              {item.title}
            </div>
            <div style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: 10,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              flexShrink: 0,
            }}>
              {MOBILE_PREVIEW_CATEGORY_LABELS[item.category] ?? item.category}
            </div>
          </div>

          {/* View Project — full-width glass button */}
          <button
            onClick={onNavigate}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.02)',
              border: '0.5px solid rgba(255,255,255,0.04)',
              borderRadius: 12,
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.9)',
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: 11,
              letterSpacing: '0.12em',
              fontWeight: 500,
              padding: '12px 20px',
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            View project
          </button>
        </div>
      </div>
    </>
  );
}

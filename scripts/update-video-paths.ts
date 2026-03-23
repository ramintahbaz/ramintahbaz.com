/**
 * Replace local /videos/... URLs with Vercel Blob URLs using scripts/video-blob-urls.json.
 * Only keys under videos/ are applied (paths starting with "videos/").
 *
 * Usage: npx tsx scripts/update-video-paths.ts
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const MAP_PATH = resolve(process.cwd(), 'scripts', 'video-blob-urls.json');

const TARGET_FILES = [
  'lib/work-items.ts',
  'components/NeuralPortfolio.tsx',
  'components/MobileVideoPreloader.tsx',
  'components/ai-document-verification-demos/AIDocVerificationEmbed.tsx',
  'components/visual-system-hover-demos/VisualSystemHoverEmbed.tsx',
  'app/craft/page.tsx',
];

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Public URL path: / + encodeURIComponent each segment. */
function encodedPublicPath(relFromPublic: string): string {
  const rel = relFromPublic.replace(/^\/+/, '');
  return '/' + rel.split('/').map((seg) => encodeURIComponent(seg)).join('/');
}

function main() {
  const raw = readFileSync(MAP_PATH, 'utf8');
  const map: Record<string, string> = JSON.parse(raw);

  const byUrl = new Map<string, Set<string>>();
  for (const [k, url] of Object.entries(map)) {
    if (!k.startsWith('videos/')) continue;
    if (!byUrl.has(url)) byUrl.set(url, new Set());
    byUrl.get(url)!.add(k);
  }

  type Row = { path: string; url: string };
  const rows: Row[] = [];
  for (const [url, keys] of byUrl) {
    for (const relKey of keys) {
      rows.push({ path: encodedPublicPath(relKey), url });
    }
  }
  rows.sort((a, b) => b.path.length - a.path.length);

  const patterns = rows.map(({ path, url }) => ({
    re: new RegExp(escapeRegex(path) + '(?:\\?v=\\d+)?', 'g'),
    url,
  }));

  for (const rel of TARGET_FILES) {
    const filePath = resolve(process.cwd(), rel);
    let text = readFileSync(filePath, 'utf8');
    const before = text;
    for (const { re, url } of patterns) {
      text = text.replace(re, url);
    }
    writeFileSync(filePath, text, 'utf8');
    console.log(rel, before === text ? '(no changes)' : '(updated)');
  }
}

main();

/**
 * Upload all .mp4 / .MP4 under public/ to Vercel Blob.
 * Requires BLOB_READ_WRITE_TOKEN in .env.local (or .env).
 *
 * Usage: npx tsx scripts/upload-videos.ts
 */
import { put } from '@vercel/blob';
import { config } from 'dotenv';
import { createReadStream, readdirSync, existsSync, writeFileSync } from 'fs';
import { resolve, join, relative } from 'path';
import { pathToFileURL } from 'url';

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

const PUBLIC_DIR = resolve(process.cwd(), 'public');
const OUT_JSON = resolve(process.cwd(), 'scripts', 'video-blob-urls.json');

/** Blob key: path relative to public/; spaces/special chars → underscores per segment. */
export function normalizeBlobKey(relPath: string): string {
  const rel = relPath.replace(/\\/g, '/').replace(/^\/+/, '');
  return rel
    .split('/')
    .map((segment) => segment.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_+/g, '_'))
    .join('/');
}

function* walkMp4(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, name.name);
    if (name.isDirectory()) yield* walkMp4(full);
    else if (/\.mp4$/i.test(name.name)) yield full;
  }
}

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.error('Missing BLOB_READ_WRITE_TOKEN. Add it to .env.local');
    process.exit(1);
  }

  const flatMap: Record<string, string> = {};

  for (const abs of walkMp4(PUBLIC_DIR)) {
    const relFromPublic = relative(PUBLIC_DIR, abs).replace(/\\/g, '/');
    const normalizedKey = normalizeBlobKey(relFromPublic);
    const body = createReadStream(abs);

    const blob = await put(normalizedKey, body, {
      access: 'public',
      token,
      addRandomSuffix: false,
    });

    flatMap[relFromPublic] = blob.url;
    flatMap[normalizedKey] = blob.url;
    console.error(relFromPublic, '→', normalizedKey, '→', blob.url);
  }

  writeFileSync(OUT_JSON, JSON.stringify(flatMap, null, 2), 'utf8');
  console.log('Wrote', OUT_JSON, `(${Object.keys(flatMap).length} keys)`);
}

const isMain =
  typeof process.argv[1] === 'string' &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMain) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

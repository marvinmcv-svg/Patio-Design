// One-off media pipeline: downloads scraped Instagram media once, optimizes, writes src/media.json.
// Usage: node scripts/fetch-media.mjs .raw/ig-posts.json
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const posts = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const OUT = 'public/media/ig', TMP = '.raw/dl';
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(TMP, { recursive: true });
const run = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] });
const get = (url, file) => { for (let i = 0; i < 3; i++) { try { run('curl', ['-sSfL', '--max-time', '60', '-o', file, url]); if (fs.statSync(file).size > 500) return true; } catch {} } return false; };
const manifest = { posts: {} };
for (const p of Object.values(posts)) {
  const entry = { code: p.code, date: p.date, type: p.type, plays: p.plays || 0, caption: p.caption, images: [], video: null, poster: null };
  p.images.forEach((url, i) => {
    const base = `${p.code}-${i}`, raw = `${TMP}/${base}.jpg`;
    if (!fs.existsSync(`${OUT}/${base}.webp`)) {
      if (!get(url, raw)) return console.warn('img fail', base);
      run('convert', [raw, '-resize', '1200x1200>', '-strip', '-quality', '72', `${OUT}/${base}.webp`]);
      run('convert', [raw, '-resize', '640x640>', '-strip', '-quality', '70', `${OUT}/${base}-sm.webp`]);
    }
    const [w, h] = run('identify', ['-format', '%w %h', `${OUT}/${base}.webp`]).toString().split(' ').map(Number);
    entry.images.push({ src: `/media/ig/${base}.webp`, w, h });
  });
  if (p.video) {
    const raw = `${TMP}/${p.code}.mp4`, out = `${OUT}/${p.code}.mp4`;
    if (!fs.existsSync(out) && get(p.video, raw)) {
      try { run('ffmpeg', ['-y', '-i', raw, '-t', '20', '-vf', 'scale=-2:540', '-c:v', 'libx264', '-preset', 'slow', '-crf', '30', '-c:a', 'aac', '-b:a', '48k', '-ac', '1', '-movflags', '+faststart', out]); } catch { console.warn('ffmpeg fail', p.code); }
    }
    if (fs.existsSync(out)) entry.video = `/media/ig/${p.code}.mp4`;
  }
  entry.poster = entry.images[0]?.src || null;
  if (entry.images.length || entry.video) manifest.posts[p.code] = entry;
}
fs.writeFileSync('src/media.json', JSON.stringify(manifest, null, 1));
console.log('posts', Object.keys(manifest.posts).length);

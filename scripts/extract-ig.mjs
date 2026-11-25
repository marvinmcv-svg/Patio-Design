// One-off: parse PDP/PDI/PDV lines (scraper output) from a text dump into raw/ig-posts.json
import fs from 'node:fs';
const [,, src, out] = process.argv;
const txt = fs.readFileSync(src, 'utf8');
const posts = fs.existsSync(out) ? JSON.parse(fs.readFileSync(out, 'utf8')) : {};
// lines are embedded in JSON strings: split on literal \n
const chunks = [...txt.matchAll(/"stdout":"((?:[^"\\]|\\.)*)"/g)].map(m => JSON.parse('"' + m[1] + '"'));
for (const c of chunks) {
  let cur = null;
  for (const line of c.split('\n')) {
    const p = line.split('\t');
    if (p[0] === 'PDP') { cur = posts[p[1]] ||= {}; Object.assign(cur, { code: p[1], date: p[2], type: +p[3], plays: +p[4], caption: p.slice(5).join(' '), images: [], video: null }); }
    else if (p[0] === 'PDI' && cur) cur.images.push(p[2]);
    else if (p[0] === 'PDV' && cur) cur.video = p[1];
    else if (p[0] === 'PDX' && posts[p[1]]) posts[p[1]].images.unshift(p[2]);
    else if (p[0] === 'P' && p.length >= 5) { cur = posts[p[1]] ||= {}; if (!cur.images?.length) Object.assign(cur, { code: p[1], date: p[2], type: +p[3], plays: 0, caption: p.slice(4).join(' '), images: [], video: null, lowres: true }); else cur = null; }
    else if (p[0] === 'I' && cur && p.length === 3) cur.images.push(p[2]);
    else if (p[0] === 'V' && cur && p.length === 3) cur.video = p[2];
  }
}
fs.writeFileSync(out, JSON.stringify(posts, null, 1));
console.log(Object.keys(posts).length, 'posts');

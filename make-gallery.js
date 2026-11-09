// Run:  node make-gallery.js
// Scans images/gallery/ and rebuilds the photo grid inside gallery.html.
// Name photos like:  sem-my-photo.jpg  (seminars) | edu-...  (education) | out-...  (outreach)
// The words after the prefix become the caption. No prefix = shown under "All" only.
const fs = require("fs"), path = require("path");
const dir = path.join(__dirname, "images", "gallery");
const cats = { sem: "sem", edu: "edu", out: "out" };
const esc = s => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const files = fs.readdirSync(dir).filter(f => /\.(jpe?g|png|webp|gif|avif)$/i.test(f)).sort();
const items = files.map(f => {
  const base = f.replace(/\.[^.]+$/, ""), [first, ...rest] = base.split("-");
  const cat = cats[first] || "misc";
  const words = (cats[first] ? rest : [first, ...rest]).join(" ").replace(/\b(\d) (\d)\b/g, "$1.$2");
  const cap = words.replace(/\b\w/g, c => c.toUpperCase());
  const src = "images/gallery/" + encodeURI(f);
  return `<a class="g-item reveal" href="${src}" data-cat="${cat}" data-cap="${esc(cap)}"><img src="${src}" alt="${esc(cap)}" loading="lazy" onerror="this.style.display='none'"><span>${esc(cap)}</span></a>`;
});
const file = path.join(__dirname, "gallery.html");
let html = fs.readFileSync(file, "utf8");
const block = `<!--GALLERY-START-->\n<div class="gallery">\n${items.join("\n")}\n</div>\n<!--GALLERY-END-->`;
html = html.replace(/<!--GALLERY-START-->[\s\S]*<!--GALLERY-END-->/, block);
fs.writeFileSync(file, html);
console.log(items.length + " photos added to gallery.html");

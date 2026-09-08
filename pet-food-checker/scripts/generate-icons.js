const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#4CAF50"/>
  <g fill="#ffffff">
    <ellipse cx="256" cy="330" rx="110" ry="90"/>
    <ellipse cx="140" cy="210" rx="48" ry="58"/>
    <ellipse cx="230" cy="150" rx="48" ry="58"/>
    <ellipse cx="330" cy="150" rx="48" ry="58"/>
    <ellipse cx="400" cy="230" rx="42" ry="52"/>
  </g>
</svg>
`;

const outDir = path.join(__dirname, "..", "public", "icons");
fs.mkdirSync(outDir, { recursive: true });

const sizes = [192, 512];

Promise.all(
  sizes.map((size) =>
    sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(path.join(outDir, `icon-${size}.png`))
  )
).then(() => {
  console.log("icons generated:", sizes.join(", "));
});

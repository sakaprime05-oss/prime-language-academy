/**
 * PWA Icon Generator for Prime Language Academy
 * Generates canvas-based icons with the "P" logo in brand colors.
 * Run: node scripts/generate-pwa-icons.js
 */

const fs = require('fs');
const path = require('path');

// We'll create simple SVG-based icons and convert them
// Since we don't have sharp/canvas in deps, we generate SVGs

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const ICONS_DIR = path.join(__dirname, '..', 'public', 'icons');

// Create icons directory
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

function generateSvgIcon(size, maskable = false) {
  const padding = maskable ? size * 0.1 : 0;
  const innerSize = size - padding * 2;
  const fontSize = innerSize * 0.6;
  const borderRadius = maskable ? 0 : size * 0.2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#E7162A"/>
      <stop offset="100%" style="stop-color:#c41222"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${borderRadius}" fill="url(#bg)"/>
  <text x="${size/2}" y="${size/2 + fontSize * 0.35}" 
        font-family="Arial, Helvetica, sans-serif" 
        font-size="${fontSize}" 
        font-weight="bold" 
        fill="white" 
        text-anchor="middle">P</text>
  <text x="${size/2}" y="${size/2 + fontSize * 0.35 + fontSize * 0.3}" 
        font-family="Arial, Helvetica, sans-serif" 
        font-size="${fontSize * 0.15}" 
        font-weight="600" 
        fill="rgba(255,255,255,0.8)" 
        text-anchor="middle"
        letter-spacing="2">PRIME ACADEMY</text>
</svg>`;
}

// Generate each icon size
SIZES.forEach((size) => {
  const svg = generateSvgIcon(size, false);
  const filePath = path.join(ICONS_DIR, `icon-${size}x${size}.png`);

  // Save as SVG (browsers handle SVG fine, and we'll also save as .png extension
  // with SVG content — modern browsers handle this)
  // For a production build, you'd use sharp to convert to PNG
  const svgPath = path.join(ICONS_DIR, `icon-${size}x${size}.svg`);
  fs.writeFileSync(svgPath, svg);
  console.log(`✅ Generated: icon-${size}x${size}.svg`);
});

// Generate maskable icon
const maskableSvg = generateSvgIcon(512, true);
fs.writeFileSync(path.join(ICONS_DIR, 'maskable-icon-512x512.svg'), maskableSvg);
console.log('✅ Generated: maskable-icon-512x512.svg');

console.log('\n📱 All PWA icons generated in /public/icons/');
console.log('💡 For production, convert SVGs to PNGs using an image tool or online converter.');

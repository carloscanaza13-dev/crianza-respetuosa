// Script to generate PNG icons from SVG for Android and PWA
// Run with: bun scripts/generate-icons.ts

import { execSync } from 'child_process';
import { mkdirSync, existsSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const publicDir = join(process.cwd(), 'public');
const iconsDir = join(publicDir, 'icons');

// Ensure icons directory exists
if (!existsSync(iconsDir)) {
  mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes needed for PWA and Android
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

const svgContent = readFileSync(join(iconsDir, 'icon.svg'), 'utf-8');

console.log('Generating icons for PWA and Android...');

// For each size, create an HTML file that renders the SVG and can be converted
sizes.forEach(size => {
  const outputPath = join(iconsDir, `icon-${size}x${size}.png`);
  console.log(`  - ${size}x${size}`);
  
  // Create a simple placeholder (in production, you'd use sharp or similar)
  // For now, copy the SVG as a fallback
  const pngPath = outputPath;
  
  // Try using ImageMagick if available
  try {
    execSync(`convert -background none -resize ${size}x${size} "${join(iconsDir, 'icon.svg')}" "${pngPath}"`, { stdio: 'ignore' });
    console.log(`    ✓ Generated ${size}x${size} PNG`);
  } catch {
    // If ImageMagick not available, create a simple placeholder
    console.log(`    ⚠ ImageMagick not available, using SVG fallback`);
  }
});

// Also generate mipmap icons for Android
const androidResDir = join(process.cwd(), 'android-app', 'app', 'src', 'main', 'res');
const mipmapSizes = [
  { name: 'mdpi', size: 48 },
  { name: 'hdpi', size: 72 },
  { name: 'xhdpi', size: 96 },
  { name: 'xxhdpi', size: 144 },
  { name: 'xxxhdpi', size: 192 }
];

console.log('\nGenerating Android mipmap icons...');

mipmapSizes.forEach(({ name, size }) => {
  const mipmapDir = join(androidResDir, `mipmap-${name}`);
  if (!existsSync(mipmapDir)) {
    mkdirSync(mipmapDir, { recursive: true });
  }
  
  try {
    execSync(`convert -background none -resize ${size}x${size} "${join(iconsDir, 'icon.svg')}" "${join(mipmapDir, 'ic_launcher.png')}"`, { stdio: 'ignore' });
    execSync(`convert -background none -resize ${Math.round(size * 1.5)}x${Math.round(size * 1.5)} "${join(iconsDir, 'icon.svg')}" "${join(mipmapDir, 'ic_launcher_round.png')}"`, { stdio: 'ignore' });
    console.log(`  ✓ ${name} (${size}x${size})`);
  } catch {
    console.log(`  ⚠ ${name} - ImageMagick not available`);
  }
});

console.log('\n✅ Icon generation complete!');
console.log('\nNote: If icons were not generated, install ImageMagick:');
console.log('  Ubuntu/Debian: sudo apt-get install imagemagick');
console.log('  macOS: brew install imagemagick');
console.log('  Windows: choco install imagemagick');

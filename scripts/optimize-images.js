const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.join(__dirname, '../public/DESIGN ARCHIVE FOR WEBSITE-20251126T045719Z-1-001');
const OUTPUT_DIR = path.join(__dirname, '../public/images-optimized');

const MAX_WIDTH = 1920;
const QUALITY = 80;

async function optimizeImages() {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Get all image files
  const files = fs.readdirSync(INPUT_DIR).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });

  console.log(`Found ${files.length} images to optimize...\n`);

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const inputPath = path.join(INPUT_DIR, file);
    const outputFileName = path.parse(file).name + '.webp';
    const outputPath = path.join(OUTPUT_DIR, outputFileName);

    try {
      const originalStats = fs.statSync(inputPath);
      totalOriginalSize += originalStats.size;

      await sharp(inputPath)
        .resize(MAX_WIDTH, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: QUALITY })
        .toFile(outputPath);

      const optimizedStats = fs.statSync(outputPath);
      totalOptimizedSize += optimizedStats.size;

      const savings = ((1 - optimizedStats.size / originalStats.size) * 100).toFixed(1);
      console.log(`[${i + 1}/${files.length}] ${file} -> ${outputFileName} (${savings}% smaller)`);
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }

  const totalSavings = ((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1);
  console.log(`\n✓ Done!`);
  console.log(`  Original: ${(totalOriginalSize / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  Optimized: ${(totalOptimizedSize / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  Saved: ${totalSavings}%`);
  console.log(`\nOptimized images saved to: public/images-optimized/`);
}

optimizeImages().catch(console.error);

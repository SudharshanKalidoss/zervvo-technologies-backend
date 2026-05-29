const sharp = require('sharp')
const fs = require('fs').promises

const resizeImage = async (
  inputPath,
  outputPath,
  width,
  height,
  fit = sharp.fit.inside,
  withoutEnlargement = true,
  format = 'jpeg',
  quality = 100
) => {
  await sharp(inputPath)
    .resize({ width, height, fit, withoutEnlargement })
    .toFormat(format, { quality })
    .toFile(outputPath)
}
exports.generateBookImages = async (inputPath, outputDir, filename) => {
  await fs.mkdir(outputDir, { recursive: true })
  await Promise.all([
    resizeImage(inputPath, `${outputDir}/${filename}.webp`, 250 , 250 ,sharp.fit.cover, false, 'webp', 80),
  ])
}

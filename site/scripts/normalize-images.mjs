import { access, readdir, rename, stat, unlink } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, extname, join, resolve } from 'node:path'
import sharp from 'sharp'

/**
 * Padroniza as imagens que a loja sobe em `public/`.
 *
 * O problema que ele resolve: cada foto de catálogo vem com um enquadramento
 * diferente (uma em retrato, outra deitada, outra com meio quilômetro de fundo
 * branco em volta). Na grade, isso faz o mesmo card mostrar relógios de
 * tamanhos diferentes, mesmo com todos os quadros do mesmo tamanho.
 *
 * A receita, por foto:
 *   1. Achata a transparência em branco, então PNG recortado não fica cinza
 *   2. Corta o fundo uniforme em volta da peça (`trim`)
 *   3. Encaixa num quadrado de 1200px com margem igual em todo mundo
 *   4. Salva em `.webp`, que pesa uma fração do PNG com a mesma aparência
 *
 * Banner só é redimensionado e convertido: recorte de banner é decisão de
 * arte, não de script.
 *
 * Uso: `npm run images:normalize`
 */

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CATALOG_DIR = join(ROOT, 'public/catalogo')
const BANNERS_DIR = join(ROOT, 'public/banners')

const CATALOG_SIZE = 1200
/** Fração do quadrado reservada como respiro em cada lado. */
const CATALOG_MARGIN = 0.06
const BANNER_MAX_WIDTH = 1920
const WHITE = { r: 255, g: 255, b: 255 }

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp'])

// Sem cache o sharp fecha o arquivo de origem assim que termina de ler. No
// Windows, um arquivo ainda aberto não pode ser sobrescrito.
sharp.cache(false)

function isImage(file) {
  return IMAGE_EXTENSIONS.has(extname(file).toLowerCase())
}

function webpNameOf(file) {
  return `${file.slice(0, file.length - extname(file).length)}.webp`
}

async function exists(filePath) {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

/** Escreve em arquivo temporário: sharp não lê e grava o mesmo caminho. */
async function writeThenReplace(pipeline, targetPath) {
  const tempPath = `${targetPath}.tmp`
  await pipeline.toFile(tempPath)
  if (await exists(targetPath)) await unlink(targetPath)
  await rename(tempPath, targetPath)
}

/**
 * Foto que já passou por aqui não é reprocessada: cada volta de `webp` perde um
 * fio de qualidade, e rodar o script depois de subir uma foto nova é o caso
 * normal de uso.
 */
async function isAlreadyNormalized(filePath) {
  const { format, width, height } = await sharp(filePath).metadata()
  return format === 'webp' && width === CATALOG_SIZE && height === CATALOG_SIZE
}

async function normalizeCatalogImage(file) {
  const inputPath = join(CATALOG_DIR, file)
  const outputPath = join(CATALOG_DIR, webpNameOf(file))
  const inner = Math.round(CATALOG_SIZE * (1 - CATALOG_MARGIN * 2))

  if (await isAlreadyNormalized(inputPath)) return null

  const piece = await sharp(inputPath)
    .flatten({ background: WHITE })
    // `threshold` alto o bastante para tolerar fundo "quase branco" de foto de
    // estúdio, e baixo o bastante para não comer a pulseira prateada.
    .trim({ background: WHITE, threshold: 12 })
    .resize(inner, inner, { fit: 'inside' })
    .toBuffer()

  const canvas = sharp({
    create: { width: CATALOG_SIZE, height: CATALOG_SIZE, channels: 3, background: WHITE },
  })
    .composite([{ input: piece, gravity: 'center' }])
    .webp({ quality: 82 })

  await writeThenReplace(canvas, outputPath)
  if (inputPath !== outputPath) await unlink(inputPath)

  return outputPath
}

async function normalizeBanner(file) {
  const inputPath = join(BANNERS_DIR, file)
  const outputPath = join(BANNERS_DIR, webpNameOf(file))

  const { format, width = 0 } = await sharp(inputPath).metadata()
  if (format === 'webp' && width <= BANNER_MAX_WIDTH) return null

  const banner = sharp(inputPath)
    .resize({ width: BANNER_MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80 })

  await writeThenReplace(banner, outputPath)
  if (inputPath !== outputPath) await unlink(inputPath)

  return outputPath
}

async function run(dir, handler, label) {
  const files = (await readdir(dir)).filter(isImage)

  for (const file of files) {
    const output = await handler(file)

    if (output === null) {
      console.log(`${label} ${file} (já padronizada, pulei)`)
      continue
    }

    const { size } = await stat(output)
    console.log(`${label} ${file} -> ${output.split(/[\\/]/).pop()} (${Math.round(size / 1024)} KB)`)
  }
}

await run(CATALOG_DIR, normalizeCatalogImage, 'catálogo:')
await run(BANNERS_DIR, normalizeBanner, 'banner:  ')

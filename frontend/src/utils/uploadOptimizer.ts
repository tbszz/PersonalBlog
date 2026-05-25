const DEFAULT_MAX_IMAGE_DIMENSION = 1920
const DEFAULT_IMAGE_QUALITY = 0.82
const MIN_IMAGE_SIZE_TO_OPTIMIZE = 350_000
const RASTER_IMAGE_PATTERN = /^image\/(png|jpe?g|webp)$/i

type FileLike = Pick<File, 'type' | 'size'>

export interface UploadPreparation {
  file: File
  optimized: boolean
  originalSize: number
  uploadedSize: number
}

export interface ImageOptimizationOptions {
  maxDimension?: number
  quality?: number
}

export function shouldTryImageOptimization(file: FileLike): boolean {
  return RASTER_IMAGE_PATTERN.test(file.type) && file.size >= MIN_IMAGE_SIZE_TO_OPTIMIZE
}

export function getOptimizedImageFileName(originalName: string): string {
  const baseName = originalName
    .replace(/\.[^.]+$/, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${baseName || 'image'}.webp`
}

export async function prepareFileForUpload(
  file: File,
  options: ImageOptimizationOptions = {},
): Promise<UploadPreparation> {
  if (!shouldTryImageOptimization(file)) {
    return {
      file,
      optimized: false,
      originalSize: file.size,
      uploadedSize: file.size,
    }
  }

  try {
    const optimized = await optimizeImage(file, options)

    if (!optimized || optimized.size >= file.size) {
      return {
        file,
        optimized: false,
        originalSize: file.size,
        uploadedSize: file.size,
      }
    }

    return {
      file: optimized,
      optimized: true,
      originalSize: file.size,
      uploadedSize: optimized.size,
    }
  } catch (error) {
    console.warn('Image optimization failed, uploading original file.', error)
    return {
      file,
      optimized: false,
      originalSize: file.size,
      uploadedSize: file.size,
    }
  }
}

async function optimizeImage(
  file: File,
  { maxDimension = DEFAULT_MAX_IMAGE_DIMENSION, quality = DEFAULT_IMAGE_QUALITY }: ImageOptimizationOptions,
): Promise<File | null> {
  const image = await loadImage(file)
  const { width, height } = scaleDimensions(image.width, image.height, maxDimension)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) return null

  context.drawImage(image, 0, 0, width, height)
  const blob = await canvasToBlob(canvas, 'image/webp', quality)
  if (!blob) return null

  return new File([blob], getOptimizedImageFileName(file.name), {
    type: 'image/webp',
    lastModified: Date.now(),
  })
}

function scaleDimensions(width: number, height: number, maxDimension: number) {
  const longest = Math.max(width, height)
  if (longest <= maxDimension) return { width, height }

  const ratio = maxDimension / longest
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  }
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Unable to decode image before upload'))
    }
    image.src = url
  })
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality)
  })
}

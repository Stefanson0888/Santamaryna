import fs from 'node:fs/promises'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { loadEnvConfig } from '@next/env'
import { buildRenderPlan } from './buildRenderPlan'

loadEnvConfig(process.cwd())

const execFileAsync = promisify(execFile)

const FFMPEG_PATH = '/opt/homebrew/opt/ffmpeg-full/bin/ffmpeg'
const MEDIA_BUCKET = 'greeting-media'
const RENDERS_BUCKET = 'greeting-renders'

type GreetingOrder = {
  id: string
  automation_key: string
  personalization: Record<string, unknown> | null
  media: Record<string, string> | null
  payment_status: string
  render_status: string
}

function escapeDrawtext(text: string) {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/:/g, '\\:')
    .replace(/'/g, "\\\\'")
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/,/g, '\\,')
}

async function getOrder(orderId: string): Promise<GreetingOrder> {
  const { supabaseAdmin } = await import('../supabaseAdmin')

  const { data, error } = await supabaseAdmin
    .from('greeting_orders')
    .select(
      'id, automation_key, personalization, media, payment_status, render_status'
    )
    .eq('id', orderId)
    .single()

  if (error || !data) {
    throw new Error(error?.message || 'Order not found')
  }

  return data as GreetingOrder
}

async function downloadMedia(
  orderId: string,
  media: Record<string, string>
) {
  const { supabaseAdmin } = await import('../supabaseAdmin')

  const tempDir = path.join('tmp', 'render', orderId)
  await fs.mkdir(tempDir, { recursive: true })

  const localMedia: Record<string, string> = {}

  for (const [mediaKey, storagePath] of Object.entries(media)) {
    const { data, error } = await supabaseAdmin.storage
      .from(MEDIA_BUCKET)
      .download(storagePath)

    if (error) {
      throw new Error(`Failed to download ${mediaKey}: ${error.message}`)
    }

    const buffer = Buffer.from(await data.arrayBuffer())
    const ext = path.extname(storagePath) || '.jpg'
    const localPath = path.join(tempDir, `${mediaKey}${ext}`)

    await fs.writeFile(localPath, buffer)
    localMedia[mediaKey] = localPath
  }

  return localMedia
}

async function setRenderStatus(
  orderId: string,
  status: 'rendering' | 'completed' | 'failed',
  extra: Record<string, unknown> = {}
) {
  const { supabaseAdmin } = await import('../supabaseAdmin')

  const { error } = await supabaseAdmin
    .from('greeting_orders')
    .update({
      render_status: status,
      updated_at: new Date().toISOString(),
      ...extra,
    })
    .eq('id', orderId)

  if (error) {
    throw new Error(`Failed to update render status: ${error.message}`)
  }
}

async function renderOrder(orderId: string) {
  const order = await getOrder(orderId)
  const localMedia = await downloadMedia(order.id, order.media || {})

  const plan = buildRenderPlan(order)

  await setRenderStatus(order.id, 'rendering')
  await fs.mkdir('renders', { recursive: true })

  const outputPath = path.join('renders', `${order.id}.mp4`)

  const ffmpegInputs: string[] = ['-i', plan.masterVideo]
  const filterParts: string[] = []

  let currentVideoLabel = '[0:v]'
  let inputIndex = 1
  let visualStep = 0
  let textStep = 0

  for (const layer of plan.layers) {
    if (layer.type === 'text') {
      if (!layer.source) continue

      const escaped = escapeDrawtext(String(layer.source))
      const outLabel = `[text${textStep}]`

      filterParts.push(
        `${currentVideoLabel}drawtext=` +
          `fontfile=/System/Library/Fonts/Supplemental/Arial.ttf:` +
          `text='${escaped}':` +
          `fontcolor=white:` +
          `fontsize=54:` +
          `x=${layer.x}:` +
          `y=${layer.y}:` +
          `enable='between(t,${layer.start},${layer.start + layer.duration})'` +
          `${outLabel}`
      )

      currentVideoLabel = outLabel
      textStep++
      continue
    }

    const localSource = localMedia[layer.sourceKey]

    if (!localSource) {
      continue
    }

    if (layer.type === 'image') {
      ffmpegInputs.push('-loop', '1', '-i', localSource)
    } else if (layer.type === 'video') {
      ffmpegInputs.push('-i', localSource)
    }

    const inputLabel = `[${inputIndex}:v]`
    const assetLabel = `[asset${visualStep}]`
    const outLabel = `[video${visualStep}]`

    const fitFilter =
      layer.fit === 'contain'
        ? `scale=${layer.width}:${layer.height}:force_original_aspect_ratio=decrease,pad=${layer.width}:${layer.height}:(ow-iw)/2:(oh-ih)/2`
        : `scale=${layer.width}:${layer.height}:force_original_aspect_ratio=increase,crop=${layer.width}:${layer.height}`

    if (layer.type === 'video') {
      filterParts.push(
        `${inputLabel}` +
          `trim=duration=${layer.duration},` +
          `setpts=PTS-STARTPTS+${layer.start}/TB,` +
          `${fitFilter}` +
          `${assetLabel}`
      )
    } else {
      filterParts.push(
        `${inputLabel}${fitFilter}${assetLabel}`
      )
    }

    filterParts.push(
      `${currentVideoLabel}${assetLabel}` +
        `overlay=${layer.x}:${layer.y}:` +
        `enable='between(t,${layer.start},${layer.start + layer.duration})'` +
        `${outLabel}`
    )

    currentVideoLabel = outLabel
    inputIndex++
    visualStep++
  }

  if (filterParts.length === 0) {
    throw new Error('No render layers were generated')
  }

  const args = [
    ...ffmpegInputs,
    '-filter_complex',
    filterParts.join(';'),
    '-map',
    currentVideoLabel,
    '-map',
    '0:a?',
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-c:a',
    'aac',
    '-t',
    '35',
    '-y',
    outputPath,
  ]

  console.log(`Template: ${plan.templateId}`)
  console.log(`Master: ${plan.masterVideo}`)
  console.log(`Layers: ${plan.layers.length}`)
  console.log('Running FFmpeg...')

  await execFileAsync(FFMPEG_PATH, args)

  const { supabaseAdmin } = await import('../supabaseAdmin')

  const videoBuffer = await fs.readFile(outputPath)
  const storagePath = `${order.id}/final.mp4`

  const { error: uploadError } = await supabaseAdmin.storage
    .from(RENDERS_BUCKET)
    .upload(storagePath, videoBuffer, {
      contentType: 'video/mp4',
      upsert: true,
    })

  if (uploadError) {
    throw new Error(`Render upload failed: ${uploadError.message}`)
  }

  await setRenderStatus(order.id, 'completed', {
    video_url: storagePath,
  })

  console.log(`Done: ${outputPath}`)
  console.log(`Uploaded: ${RENDERS_BUCKET}/${storagePath}`)
}

const orderId = process.argv[2]

if (!orderId) {
  console.error(
    'Usage: npx tsx src/lib/render/renderRealOrder.ts <order-id>'
  )
  process.exit(1)
}

renderOrder(orderId).catch(async error => {
  console.error(error)

  if (orderId) {
    try {
      await setRenderStatus(orderId, 'failed')
    } catch (statusError) {
      console.error('Could not set failed status:', statusError)
    }
  }

  process.exit(1)
})

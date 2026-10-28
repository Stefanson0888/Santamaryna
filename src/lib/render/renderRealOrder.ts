import fs from 'node:fs/promises'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd())

const execFileAsync = promisify(execFile)

const FFMPEG_PATH = '/opt/homebrew/opt/ffmpeg-full/bin/ffmpeg'
const MEDIA_BUCKET = 'greeting-media'
const MASTER_VIDEO = 'templates/christmas-santa-v1/master.mp4'

type GreetingOrder = {
  id: string
  automation_key: string
  personalization: any
  media: Record<string, string>
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

async function downloadMedia(orderId: string, media: Record<string, string>) {
  const { supabaseAdmin } = await import('../supabaseAdmin')

  const tempDir = path.join('tmp', 'render', orderId)
  await fs.mkdir(tempDir, { recursive: true })

  const localMedia: Record<string, string> = {}

  for (const [mediaKey, storagePath] of Object.entries(media || {})) {
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

async function getOrder(orderId: string): Promise<GreetingOrder> {
  const { supabaseAdmin } = await import('../supabaseAdmin')

  const { data, error } = await supabaseAdmin
    .from('greeting_orders')
    .select('id, automation_key, personalization, media, payment_status, render_status')
    .eq('id', orderId)
    .single()

  if (error || !data) {
    throw new Error(error?.message || 'Order not found')
  }

  return data as GreetingOrder
}

async function renderOrder(orderId: string) {
  const order = await getOrder(orderId)

  if (order.automation_key !== 'christmas-santa-v1') {
    throw new Error(`Unsupported automation_key: ${order.automation_key}`)
  }

  const localMedia = await downloadMedia(order.id, order.media || {})
  await fs.mkdir('renders', { recursive: true })

  const outputPath = path.join('renders', `${order.id}.mp4`)

  const ffmpegInputs = ['-i', MASTER_VIDEO]
  const filterParts: string[] = []
  let currentVideoLabel = '[0:v]'
  let inputIndex = 1
  let videoStep = 0
  let textStep = 0

  const childPhoto = localMedia['childPhoto']
  if (childPhoto) {
    ffmpegInputs.push('-loop', '1', '-i', childPhoto)
    filterParts.push(
      `[${inputIndex}:v]scale=420:520:force_original_aspect_ratio=increase,crop=420:520[img${videoStep}]`
    )
    filterParts.push(
      `${currentVideoLabel}[img${videoStep}]overlay=1180:280:enable='between(t,8,13)'[v${videoStep}]`
    )
    currentVideoLabel = `[v${videoStep}]`
    inputIndex++
    videoStep++
  }

  const importantPerson1 = localMedia['importantPerson-1']
  if (importantPerson1) {
    ffmpegInputs.push('-loop', '1', '-i', importantPerson1)
    filterParts.push(
      `[${inputIndex}:v]scale=460:520:force_original_aspect_ratio=increase,crop=460:520[img${videoStep}]`
    )
    filterParts.push(
      `${currentVideoLabel}[img${videoStep}]overlay=390:300:enable='between(t,20,25)'[v${videoStep}]`
    )
    currentVideoLabel = `[v${videoStep}]`
    inputIndex++
    videoStep++
  }

  const childName = order.personalization?.childName
  if (childName) {
    const escaped = escapeDrawtext(String(childName))
    filterParts.push(
      `${currentVideoLabel}drawtext=fontfile=/System/Library/Fonts/Supplemental/Arial.ttf:text='${escaped}':fontcolor=white:fontsize=54:x=680:y=760:enable='between(t,14,18)'[t${textStep}]`
    )
    currentVideoLabel = `[t${textStep}]`
    textStep++
  }

  const favoriteActivity = order.personalization?.favoriteActivity
  if (favoriteActivity) {
    const escaped = escapeDrawtext(String(favoriteActivity))
    filterParts.push(
      `${currentVideoLabel}drawtext=fontfile=/System/Library/Fonts/Supplemental/Arial.ttf:text='${escaped}':fontcolor=white:fontsize=54:x=640:y=760:enable='between(t,27,31)'[t${textStep}]`
    )
    currentVideoLabel = `[t${textStep}]`
    textStep++
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
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-t',
    '35',
    '-y',
    outputPath,
  ]

  console.log('Running command:')
  console.log([FFMPEG_PATH, ...args].join(' '))

  await execFileAsync(FFMPEG_PATH, args)

  const { supabaseAdmin } = await import('../supabaseAdmin')

  const videoBuffer = await fs.readFile(outputPath)
  const storagePath = `${order.id}/final.mp4`

  const { error: uploadError } = await supabaseAdmin.storage
    .from('greeting-renders')
    .upload(storagePath, videoBuffer, {
      contentType: 'video/mp4',
      upsert: true,
    })

  if (uploadError) {
    throw new Error(`Render upload failed: ${uploadError.message}`)
  }

  const { error: updateError } = await supabaseAdmin
    .from('greeting_orders')
    .update({
      video_url: storagePath,
      render_status: 'completed',
      updated_at: new Date().toISOString(),
    })
    .eq('id', order.id)

  if (updateError) {
    throw new Error(`Order update failed: ${updateError.message}`)
  }

  console.log(`Done: ${outputPath}`)
  console.log(`Uploaded: greeting-renders/${storagePath}`)
}

const orderId = process.argv[2]

if (!orderId) {
  console.error('Usage: npx tsx src/lib/render/renderRealOrder.ts <order-id>')
  process.exit(1)
}

renderOrder(orderId).catch((error) => {
  console.error(error)
  process.exit(1)
})

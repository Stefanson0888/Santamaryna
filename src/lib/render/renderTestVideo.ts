import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { buildRenderPlan } from './buildRenderPlan'

const execFileAsync = promisify(execFile)

function escapeDrawtext(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/:/g, '\\:')
    .replace(/'/g, "\\\\'")
}

async function main() {
  const order = {
    id: 'test-order',
    automation_key: 'christmas-santa-v1',
    personalization: {
      childName: 'Emma',
      favoriteActivity: 'Drawing',
    },
    media: {
      childPhoto: 'test/child.jpg',
      'importantPerson-1': 'test/mom.jpg',
    },
  }

  const plan = buildRenderPlan(order)

  const ffmpegBin = '/opt/homebrew/opt/ffmpeg-full/bin/ffmpeg'
  const args: string[] = ['-i', plan.masterVideo]

  const imageLayers = plan.layers.filter((layer: any) => layer.type === 'image' && layer.source)
  const textLayers = plan.layers.filter((layer: any) => layer.type === 'text' && layer.source)

  for (const layer of imageLayers) {
    args.push('-loop', '1', '-i', layer.source!)
  }

  const filters: string[] = []
  let currentStream = '[0:v]'

  imageLayers.forEach((layer: any, index: number) => {
    const inputLabel = `[${index + 1}:v]`
    const scaledLabel = `[img${index}]`
    const outLabel = `[v${index}]`

    filters.push(
      `${inputLabel}scale=${layer.width}:${layer.height}:force_original_aspect_ratio=increase,crop=${layer.width}:${layer.height}${scaledLabel}`
    )

    filters.push(
      `${currentStream}${scaledLabel}overlay=${layer.x}:${layer.y}:enable='between(t,${layer.start},${layer.start + layer.duration})'${outLabel}`
    )

    currentStream = outLabel
  })

  textLayers.forEach((layer: any, index: number) => {
    const outLabel = `[t${index}]`
    const text = escapeDrawtext(String(layer.source))

    filters.push(
      `${currentStream}drawtext=fontfile=/System/Library/Fonts/Supplemental/Arial.ttf:text='${text}':fontcolor=white:fontsize=54:x=${layer.x}:y=${layer.y}:enable='between(t,${layer.start},${layer.start + layer.duration})'${outLabel}`
    )

    currentStream = outLabel
  })

  args.push(
    '-filter_complex',
    filters.join(';'),
    '-map',
    currentStream,
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-t',
    '35',
    '-y',
    'test/rendered-from-plan.mp4'
  )

  console.log('Running command:')
  console.log(ffmpegBin, args.join(' '))

  const { stdout, stderr } = await execFileAsync(ffmpegBin, args)
  if (stdout) console.log(stdout)
  if (stderr) console.log(stderr)

  console.log('Done: test/rendered-from-plan.mp4')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

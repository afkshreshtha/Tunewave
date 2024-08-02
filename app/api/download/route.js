import { exec } from 'child_process'
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { NextResponse } from 'next/server'
import ffmpegStatic from 'ffmpeg-static'

const execPromise = promisify(exec)

export async function POST(req, res) {
  let payload = await req.json()
  const { audioUrl, imageUrl, artists, filename } = payload
  const tempDir = path.join(process.cwd(), 'tmp')
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir)
  }

  // Fallback to environment variable if ffmpeg-static path is undefined
  const ffmpegPath = ffmpegStatic?.path || process.env.FFMPEG_PATH || 'ffmpeg'
  const audioFilePath = path.join(tempDir, `${filename}.m4a`)
  const imageFilePath = path.join(tempDir, 'cover.jpg')
  const mp3FilePath = path.join(tempDir, `${filename}.mp3`)
  console.log('FFmpeg Path:', ffmpegPath)

  try {
    // Download the audio file
    try {
      const audioResponse = await axios.get(audioUrl, {
        responseType: 'arraybuffer',
      })
      const audioBuffer = Buffer.from(audioResponse.data, 'binary')
      fs.writeFileSync(audioFilePath, audioBuffer)
      console.log(
        `Audio file downloaded: ${audioFilePath} (${audioBuffer.length} bytes)`,
      )
    } catch (audioError) {
      console.error('Error downloading audio file:', audioError)
      return new NextResponse('Error during download audio file', {
        status: 500,
      })
    }

    // Download the cover image
    try {
      const imageResponse = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      })
      const imageBuffer = Buffer.from(imageResponse.data, 'binary')
      fs.writeFileSync(imageFilePath, imageBuffer)
      console.log(
        `Image file downloaded: ${imageFilePath} (${imageBuffer.length} bytes)`,
      )
    } catch (imageError) {
      console.error('Error downloading cover image:', imageError)
      return new NextResponse('Error during downloading image ', {
        status: 500,
      })
    }

    const artistString = Array.isArray(artists) ? artists.join(', ') : artists

    // Convert the M4A file to MP3 using ffmpeg
    const ffmpegCommand = `"${ffmpegPath}" -i "${audioFilePath}" -i "${imageFilePath}" -map 0:a -map 1:v -c:a libmp3lame -b:a 192k -id3v2_version 3 -metadata:s:v title="Album cover" -metadata:s:v comment="Cover (front)" -metadata artist="${artistString}" "${mp3FilePath}"`
    console.log('FFmpeg Command:', ffmpegCommand)
    await execPromise(ffmpegCommand)
    console.log(`MP3 file created: ${mp3FilePath}`)

    const mp3Buffer = fs.readFileSync(mp3FilePath)
    return new NextResponse(mp3Buffer, {
      headers: {
        'Content-Disposition': `attachment; filename="${filename}.mp3"`,
        'Content-Type': 'audio/mpeg',
      },
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return new NextResponse('Unexpected error during processing', {
      status: 500,
    })
  } finally {
    // Ensure files are properly deleted
    try {
      fs.unlinkSync(audioFilePath)
      fs.unlinkSync(imageFilePath)
      fs.unlinkSync(mp3FilePath)
    } catch (err) {
      console.error('Error deleting files:', err)
    }
  }
}

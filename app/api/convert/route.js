import StreamPot from '@streampot/client'
import { NextResponse } from 'next/server'
import fetch from 'node-fetch'

export async function POST(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const url = require('url')
  const urlObj = url.parse(req.url, true)
  const { downloadURL, coverImageUrl, artists, album, filename } = urlObj.query

  try {
    const streampot = new StreamPot({
      secret: 'vplsETg2rrYT8xnNKQNS5ilK3zp1NSqtrsxRD3Z203d7adc6',
    })

    const mp3File = await streampot
      .input(downloadURL)
      .input(coverImageUrl)
      .outputOptions('-map', '0:a')
      .outputOptions('-map', '1')
      .outputOptions('-c:v', 'mjpeg')
      .outputOptions('-id3v2_version', '3')
      .outputOptions('-metadata:s:v', 'title="Album cover"')
      .outputOptions('-metadata:s:v', 'comment="Cover (front)"')
      .outputOptions('-metadata', `artist=${artists}`)
      .outputOptions('-metadata', `album=${album}`)
      .output(`${filename}.mp3`)
      .runAndWait()

    const fileUrl = mp3File.outputs[`${filename}.mp3`]

    // Fetch the file from the URL
    const response = await fetch(fileUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const fileBuffer = Buffer.from(arrayBuffer)

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="${filename}.mp3"`,
        'Content-Length': fileBuffer.length,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({
      status: 500,
      message: 'Internal Error',
      error: error.message,
    })
  }
}

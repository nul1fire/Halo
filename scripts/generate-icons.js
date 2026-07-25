import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import toIco from 'to-ico'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const buildDir = path.join(__dirname, '..', 'build')
const iconPath = path.join(buildDir, 'icon.ico')

const svg = `<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" rx="40" ry="40" fill="black"/><circle cx="128" cy="128" r="60" fill="#00FF00"/></svg>`

const img256 = await sharp(Buffer.from(svg)).resize(256, 256).png().toBuffer()
const img16 = await sharp(img256).resize(16, 16).png().toBuffer()
const img32 = await sharp(img256).resize(32, 32).png().toBuffer()
const icoBuffer = await toIco([img16, img32, img256])

fs.mkdirSync(buildDir, { recursive: true })
fs.writeFileSync(iconPath, icoBuffer)

console.log(`Icon saved to ${iconPath}`)

/**
 * Create Sample Banner for Hearts and Beats Event
 * Downloads a sample image and uploads it as the event banner
 */

require('dotenv').config()
const { Pool } = require('pg')
const https = require('https')
const fs = require('fs')
const path = require('path')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// Sample Valentine's Day themed image URL (placeholder)
const SAMPLE_IMAGE_URL = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200&h=600&fit=crop'

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath)
    https.get(url, (response) => {
      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve()
      })
    }).on('error', (err) => {
      fs.unlink(filepath, () => {})
      reject(err)
    })
  })
}

async function createAndUploadBanner() {
  try {
    console.log('\n🎨 Creating sample banner for Hearts and Beats event...\n')
    
    // Create a simple colored banner using Canvas (Node.js doesn't have native image creation)
    // Instead, we'll create a simple SVG and convert it to PNG using a library
    // For now, let's create a simple placeholder
    
    const bannerPath = path.join(__dirname, 'hearts-and-beats-banner.jpg')
    
    console.log('📥 Downloading sample image...')
    try {
      await downloadImage(SAMPLE_IMAGE_URL, bannerPath)
      console.log('✅ Sample image downloaded')
    } catch (error) {
      console.log('⚠️  Could not download sample image, creating simple banner instead...')
      
      // Create a simple SVG banner
      const svgBanner = `
<svg width="1200" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(255,20,147);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(255,105,180);stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="600" fill="url(#grad1)" />
  <text x="600" y="250" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="white" text-anchor="middle">
    Hearts and Beats
  </text>
  <text x="600" y="350" font-family="Arial, sans-serif" font-size="40" fill="white" text-anchor="middle" opacity="0.9">
    Valentine's Day Celebration 2026
  </text>
  <text x="600" y="420" font-family="Arial, sans-serif" font-size="30" fill="white" text-anchor="middle" opacity="0.8">
    February 14, 2026 • Hill View Hall, Dublin, CA
  </text>
</svg>
      `.trim()
      
      // Save SVG (we'll use this as a fallback)
      fs.writeFileSync(bannerPath.replace('.jpg', '.svg'), svgBanner)
      console.log('✅ SVG banner created')
      
      // For demo purposes, create a simple text file as placeholder
      // In production, you'd use a proper image
      const placeholderData = Buffer.from(svgBanner)
      fs.writeFileSync(bannerPath, placeholderData)
    }
    
    // Read the image
    const imageBuffer = fs.readFileSync(bannerPath)
    const imageSize = imageBuffer.length
    const imageType = 'image/jpeg'
    
    console.log(`📊 Image size: ${(imageSize / 1024).toFixed(2)} KB`)
    
    // Get event ID
    const eventResult = await pool.query(
      'SELECT id, title FROM events WHERE slug = $1',
      ['hearts-and-beats']
    )
    
    if (eventResult.rows.length === 0) {
      console.error('❌ Event not found')
      process.exit(1)
    }
    
    const event = eventResult.rows[0]
    console.log(`✅ Found event: ${event.title}`)
    
    // Check if banner exists
    const existingBanner = await pool.query(
      'SELECT id FROM event_banners WHERE event_id = $1',
      [event.id]
    )
    
    if (existingBanner.rows.length > 0) {
      console.log('🔄 Updating existing banner...')
      await pool.query(
        `UPDATE event_banners 
         SET image_data = $1, image_type = $2, image_size = $3, updated_at = now()
         WHERE event_id = $4`,
        [imageBuffer, imageType, imageSize, event.id]
      )
    } else {
      console.log('➕ Inserting new banner...')
      await pool.query(
        `INSERT INTO event_banners (event_id, image_data, image_type, image_size, alt_text)
         VALUES ($1, $2, $3, $4, $5)`,
        [event.id, imageBuffer, imageType, imageSize, 'Hearts and Beats Valentine\'s Day Event']
      )
    }
    
    console.log('✅ Banner uploaded to database!')
    console.log('\n🎉 Done! You can now view the event with its banner.')
    
    // Clean up
    if (fs.existsSync(bannerPath)) {
      fs.unlinkSync(bannerPath)
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error(error)
  } finally {
    await pool.end()
  }
}

createAndUploadBanner()


/**
 * Upload Event Banner Script
 * Uploads a banner image for an event to the database
 * 
 * Usage: node upload_event_banner.js <event-slug> <image-path>
 */

require('dotenv').config()
const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function uploadBanner(eventSlug, imagePath) {
  try {
    console.log(`\n📤 Uploading banner for event: ${eventSlug}`)
    console.log(`📁 Image path: ${imagePath}`)
    
    // Check if image file exists
    if (!fs.existsSync(imagePath)) {
      console.error(`❌ Error: Image file not found: ${imagePath}`)
      process.exit(1)
    }
    
    // Read image file
    const imageBuffer = fs.readFileSync(imagePath)
    const imageSize = imageBuffer.length
    
    // Determine MIME type from file extension
    const ext = path.extname(imagePath).toLowerCase()
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
    }
    const imageType = mimeTypes[ext] || 'image/jpeg'
    
    console.log(`📊 Image size: ${(imageSize / 1024).toFixed(2)} KB`)
    console.log(`🎨 Image type: ${imageType}`)
    
    // Get event ID from slug
    const eventResult = await pool.query(
      'SELECT id, title FROM events WHERE slug = $1',
      [eventSlug]
    )
    
    if (eventResult.rows.length === 0) {
      console.error(`❌ Error: Event not found with slug: ${eventSlug}`)
      process.exit(1)
    }
    
    const event = eventResult.rows[0]
    console.log(`✅ Found event: ${event.title} (${event.id})`)
    
    // Check if banner already exists
    const existingBanner = await pool.query(
      'SELECT id FROM event_banners WHERE event_id = $1',
      [event.id]
    )
    
    if (existingBanner.rows.length > 0) {
      console.log(`🔄 Updating existing banner...`)
      await pool.query(
        `UPDATE event_banners 
         SET image_data = $1, image_type = $2, image_size = $3, updated_at = now()
         WHERE event_id = $4`,
        [imageBuffer, imageType, imageSize, event.id]
      )
      console.log(`✅ Banner updated successfully!`)
    } else {
      console.log(`➕ Inserting new banner...`)
      await pool.query(
        `INSERT INTO event_banners (event_id, image_data, image_type, image_size, alt_text)
         VALUES ($1, $2, $3, $4, $5)`,
        [event.id, imageBuffer, imageType, imageSize, event.title]
      )
      console.log(`✅ Banner uploaded successfully!`)
    }
    
    console.log(`\n🎉 Done!`)
  } catch (error) {
    console.error('❌ Error uploading banner:', error.message)
    console.error(error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Parse command line arguments
const args = process.argv.slice(2)

if (args.length < 2) {
  console.log(`
Usage: node upload_event_banner.js <event-slug> <image-path>

Example:
  node upload_event_banner.js hearts-and-beats ./banner.jpg

Supported formats: .jpg, .jpeg, .png, .webp, .gif
  `)
  process.exit(1)
}

const [eventSlug, imagePath] = args

uploadBanner(eventSlug, imagePath)


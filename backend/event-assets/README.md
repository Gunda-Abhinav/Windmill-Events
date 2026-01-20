# Event Assets

This directory contains banner images for events.

## Upload Banner for Hearts and Beats Event

1. **Place your banner image in this directory** with the name:
   - `hearts-and-beats-banner.jpg` (or .png, .webp)

2. **Run the upload script:**
   ```bash
   cd backend
   node upload_event_banner.js hearts-and-beats ./event-assets/hearts-and-beats-banner.jpg
   ```

## Recommended Banner Specifications

- **Dimensions:** 1200x600 pixels (2:1 aspect ratio)
- **Format:** JPG, PNG, or WebP
- **File size:** Under 500KB for optimal performance
- **Content:** Should include event name, date, and be visually appealing

## Example

If you have a banner image called `my-banner.png`, rename it to `hearts-and-beats-banner.jpg` (or keep as .png) and place it in this directory, then run:

```bash
node upload_event_banner.js hearts-and-beats ./event-assets/hearts-and-beats-banner.png
```

The script will:
- ✅ Read the image file
- ✅ Upload it to the database
- ✅ Associate it with the Hearts and Beats event
- ✅ Make it available via the API


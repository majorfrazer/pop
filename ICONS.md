# PopDarts Icon Requirements

## Overview
Your app icon will appear on home screens, app launchers, and in the browser tab. A good icon should be simple, recognizable, and work at all sizes.

## Required Icon Files

### Minimum Required (for basic PWA)
| File | Size | Purpose |
|------|------|---------|
| `icon-192.png` | 192×192 px | Android home screen, Chrome install |
| `icon-512.png` | 512×512 px | Splash screen, Play Store listing |

### Recommended (full compatibility)
| File | Size | Purpose |
|------|------|---------|
| `icon-72.png` | 72×72 px | Android legacy |
| `icon-96.png` | 96×96 px | Android legacy |
| `icon-128.png` | 128×128 px | Chrome Web Store |
| `icon-144.png` | 144×144 px | Windows tiles |
| `icon-152.png` | 152×152 px | iPad |
| `icon-180.png` | 180×180 px | iPhone (as apple-touch-icon) |
| `icon-192.png` | 192×192 px | Android primary |
| `icon-384.png` | 384×384 px | Android high-res |
| `icon-512.png` | 512×512 px | Splash screens |

### Maskable Icons (Android Adaptive Icons)
| File | Size | Purpose |
|------|------|---------|
| `icon-maskable-192.png` | 192×192 px | Android adaptive |
| `icon-maskable-512.png` | 512×512 px | Android adaptive |

## Design Guidelines

### Standard Icons
- **Format:** PNG with transparency OR solid background
- **Shape:** Any shape (circles, rounded squares work well)
- **Safe zone:** Main content should be visible even when cropped to circle
- **Background:** Can be transparent or solid color matching theme (#0a0a12)

### Maskable Icons
- **Format:** PNG with solid background (NO transparency)
- **Shape:** Square, but design for circular crop
- **Safe zone:** Keep important content within center 80% (inner circle)
- **Background:** Must be solid color (#0a0a12 or your brand color)

```
┌─────────────────────┐
│                     │
│   ┌───────────┐     │
│   │   SAFE    │     │  ← Safe zone: 80% of width/height
│   │   ZONE    │     │     centered in the image
│   │   🎯      │     │
│   └───────────┘     │
│                     │
└─────────────────────┘
```

## Creating Your Own Icons

### Option 1: Use an Online Tool
1. **Figma** (free): Design at 512×512, export at multiple sizes
2. **Canva** (free): Create 512×512, download and resize
3. **PWA Asset Generator**: https://www.pwabuilder.com/imageGenerator

### Option 2: Create from Existing Image
1. Start with a square image (at least 512×512)
2. Use an image editor to create all sizes
3. For maskable: add solid background and ensure content is in center 80%

### Option 3: Quick Generation Script
```bash
# Using ImageMagick (install: brew install imagemagick or apt install imagemagick)

# From a 512x512 source image:
convert icon-512.png -resize 192x192 icon-192.png
convert icon-512.png -resize 144x144 icon-144.png
convert icon-512.png -resize 96x96 icon-96.png
convert icon-512.png -resize 72x72 icon-72.png

# For maskable (add padding for safe zone):
convert icon-512.png -gravity center -background "#0a0a12" -extent 640x640 -resize 512x512 icon-maskable-512.png
convert icon-maskable-512.png -resize 192x192 icon-maskable-192.png
```

## Color Reference
- **Background:** `#0a0a12` (dark navy/black)
- **Accent:** `#f5a623` (gold/orange)
- **Success:** `#00d68f` (green)

## File Checklist
After creating your icons, ensure you have:

```
popdarts/
├── icon-72.png         (optional)
├── icon-96.png         (optional)
├── icon-128.png        (optional)
├── icon-144.png        (optional)
├── icon-152.png        (optional)
├── icon-192.png        ✓ REQUIRED
├── icon-384.png        (optional)
├── icon-512.png        ✓ REQUIRED
├── icon-maskable-192.png   (recommended)
└── icon-maskable-512.png   (recommended)
```

## Testing Your Icons
1. **Chrome DevTools:** Application > Manifest > Check icons display correctly
2. **Android:** Install PWA and check home screen icon
3. **iOS:** Add to home screen and verify apple-touch-icon

## Current Default Icon
The included icons are placeholder dartboard designs. Replace them with your custom design following the guidelines above.

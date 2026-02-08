# PopDarts v5.5 Final

Live multi-device dart scoring app with real-time sync.

## Features
- 🎯 **SVG Dart Renders** - Beautiful dart graphics with gradient progress bars
- 📱 **Responsive** - Works in portrait, landscape, and desktop browsers
- ☁️ **Live Sync** - All devices share game state in real-time
- 🏆 **Championship Mode** - Round-robin with auto Grand Final
- 🎮 **Quick Match** - Casual games that don't affect stats

## Quick Start
1. Upload all files to your web host (GitHub Pages, Netlify, etc.)
2. Open in browser
3. Add players in Settings
4. Generate a draw
5. Play!

## Files
| File | Purpose |
|------|---------|
| `index.html` | Main app (all-in-one) |
| `manifest.json` | PWA configuration |
| `sw.js` | Service worker for offline |
| `icon-192.png` | App icon (required) |
| `icon-512.png` | App icon (required) |
| `ICONS.md` | Guide for custom icons |

## Google Apps Script
Update the API URL in `index.html` if using your own backend.
The script handles: Players, Stats, Draw, and Live Game sync.

## Browser Support
- Chrome (desktop & mobile) ✓
- Safari (desktop & mobile) ✓
- Firefox ✓
- Edge ✓

## Install as App
- **Android:** Menu → "Install app" or "Add to Home Screen"
- **iOS:** Share → "Add to Home Screen"
- **Desktop:** Chrome address bar → Install icon


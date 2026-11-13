# Star Track | Official website logo assets

Approved master artwork: the **navy star**, **teal swoosh**, and **bold navy “Star Track” wordmark**, with no gold sparkle. These assets are cropped or traced from the user-approved source image, not redesigned.

## Install in your `star_track` repository

Copy the contents of this package's `public/` folder into your web app's `public/` folder (Vite, React or Next.js public assets).

## Which asset to use

| Asset | Usage |
| --- | --- |
| `assets/brand/logo-horizontal.svg` | Main navbar logo on light backgrounds (recommended) |
| `assets/brand/logo-horizontal-reversed.svg` | Navbar on navy/dark backgrounds |
| `assets/brand/logo-stacked.svg` | Landing page, login, splash pages |
| `assets/brand/logo-stacked-reversed.svg` | Landing page with dark backgrounds |
| `assets/brand/logo-mark.svg` | Sidebar collapsed state, smaller brand marks |
| `assets/brand/logo-mark-reversed.svg` | Sidebar collapsed on dark backgrounds |
| `assets/brand/logo-wordmark.svg` | Text-only wordmark |
| `assets/brand/*.png` | Transparent raster alternatives, suitable for integrations |
| `favicon.ico`, `favicon.svg` | Browser tab icons |
| `apple-touch-icon.png` | Apple home screen icon |
| `icon-192.png`, `icon-512.png` | Installed app / PWA icons |
| `icon-maskable-512.png` | Maskable PWA icon (extra safe area) |
| `og-star-track.png` | Social sharing card (1200 x 630) |
| `site.webmanifest` | Web app metadata |

The SVG files have real vector paths (including the wordmark glyph outlines) and do not depend on installed fonts or embedded bitmaps. For the closest pixel-accurate rendition of the approved artwork, use the transparent PNG.

## Example React header

```jsx
<a href="/" aria-label="Star Track home">
  <img src="/assets/brand/logo-horizontal.svg" alt="Star Track" style={{height: 56, width: 'auto'}} />
</a>
```

For a dark header change the `src` to `/assets/brand/logo-horizontal-reversed.svg`.

## Paste into `index.html` inside `<head>`

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="alternate icon" type="image/x-icon" href="/favicon.ico" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<meta name="theme-color" content="#00284F" />
<meta property="og:image" content="/og-star-track.png" />
```

For the OG image on a deployed site, use the full absolute URL (`https://yourdomain.com/og-star-track.png`) in `og:image`.

## Brand color tokens

```css
:root {
  --star-track-navy: #00284F;
  --star-track-teal: #00A09B;
  --star-track-surface: #F6FAFC;
  --star-track-white: #FFFFFF;
}
```

## File integrity and source

The approved source has been copied as `source/approved-original.png`. Do not add a gold sparkle back to the logo or change the star/swoosh geometry. Navy and teal HEX values are sampled approximations of the original slightly shaded artwork.

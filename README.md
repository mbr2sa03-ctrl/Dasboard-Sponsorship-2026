# MBR2 Sponsorship Management — PWA package

This folder turns your dashboard into an installable app (Progressive Web App):

- `index.html` — your dashboard, now a full page with a manifest link and service worker registration
- `manifest.json` — app name, icons, and colors used by the "Install app" prompt
- `sw.js` — service worker that caches the app shell so it opens instantly and works even with a spotty connection
- `icon-192.png`, `icon-512.png`, `icon-512-maskable.png` — app icons (teal/gold, matching your dashboard)

## Important: it must be served over HTTPS

Browsers only allow installing an app (and only let the service worker run) when the
files are served over **HTTPS** — opening `index.html` directly from your computer
(`file://...`) will **not** show an install option. The easiest free option, since your
app already uses Firebase, is **GitHub Pages**:

1. Create a GitHub repo (or reuse the one your Firebase-connected dashboard already lives in).
2. Upload all 6 files in this folder to the root of that repo.
3. In the repo's **Settings → Pages**, set the source to your main branch, root folder.
4. GitHub gives you a URL like `https://yourname.github.io/your-repo/` — open that link.

Any other static HTTPS host works too (Netlify, Cloudflare Pages, Firebase Hosting itself, etc.) — just upload the same 6 files together.

## Installing on a phone (Android)

1. Open the HTTPS link in Chrome.
2. Tap the **⋮** menu → **Install app** (or you'll see an automatic "Add MBR2 to Home screen" banner).
3. It now opens full-screen from the home screen, no browser bar.

## Installing on a phone (iPhone/iPad)

1. Open the HTTPS link in **Safari** (must be Safari, not Chrome).
2. Tap the **Share** icon → **Add to Home Screen**.
3. Confirm — it now behaves like a native app icon.

## Installing on a computer (Windows/Mac/Linux)

1. Open the HTTPS link in Chrome or Edge.
2. Click the **install icon** in the address bar (a monitor with a down arrow), or open the **⋮** menu → **Install MBR2 Sponsorship Management…**.
3. It opens in its own window, pinned to your taskbar/dock/start menu like a desktop app.

## The CVC App is now built in

The standalone phone app for CVC volunteers (`cvc-app.html`) is no longer a
separate file — it's embedded directly inside `index.html`, so there's only
one file to host and keep in sync.

- Inside the dashboard, open the **CVC App** tab (📱) for a "Preview it here"
  / "Open in new tab" button that launches the exact same phone app.
- The **link and QR code** shown on that tab now point to this same file with
  `?view=cvc` on the end. Opening that link jumps straight to the full-screen
  CVC app and skips the admin dashboard entirely — that's the link to share
  with CVC volunteers for their own phones.
- Both experiences read and write the same shared Firebase data, so nothing
  about how CVCs work in the field changes.

## Notes

- The app still needs an internet connection for anything that talks to Firebase
  (saving/loading shared data). The service worker only caches the app's own
  interface files, so it opens instantly and the screen isn't blank if the
  connection briefly drops.
- If you update `index.html` later, bump the version number in `sw.js`
  (change `mbr2-shell-v1` to `mbr2-shell-v2`) so installed devices pick up the change.

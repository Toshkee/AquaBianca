#!/bin/sh
# Sklapa folder deploy/ (samo fajlovi koje sajt koristi) i objavljuje ga na Vercel.
set -e
cd "$(dirname "$0")"
mkdir -p deploy && find deploy -mindepth 1 -maxdepth 1 ! -name .vercel -exec rm -rf {} + && mkdir -p deploy/assets
cp index.html styles.css main.js chrome.js story.js b2b.js i18n.js deploy/
rsync -a assets/web assets/cutouts-web assets/instagram-web deploy/assets/
cat > deploy/vercel.json <<'JSON'
{
  "redirects": [
    { "source": "/en", "destination": "/?lang=en", "permanent": false },
    { "source": "/en/", "destination": "/?lang=en", "permanent": false },
    { "source": "/prototip/partneri.html", "destination": "/#partneri", "permanent": true },
    { "source": "/prototip", "destination": "/", "permanent": true },
    { "source": "/prototip/", "destination": "/", "permanent": true },
    { "source": "/prototip/:path*", "destination": "/", "permanent": true }
  ],
  "headers": [{ "source": "/(.*)", "headers": [{ "key": "X-Robots-Tag", "value": "noindex, nofollow" }] }]
}
JSON
printf 'User-agent: *\nDisallow: /\n' > deploy/robots.txt
du -sh deploy
[ "$1" = "--build-only" ] && exit 0
cd deploy
[ -d .vercel ] || vercel link --yes --project aquabianca-prototip
vercel deploy --prod --yes

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { PORTFOLIO_SPA_ROUTES, SITE_URL } from './siteConfig.mjs';

const portfolioDist = join(process.cwd(), 'dist');
const templatePath = join(portfolioDist, 'index.html');
const template = readFileSync(templatePath, 'utf8');
const ogImage = `${SITE_URL}/images/profile_picture.jfif`;

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function withRouteMeta(html, { path, title, description }) {
  const url = `${SITE_URL}/${path}`;
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);

  let out = html
    .replace(/<title>[^<]*<\/title>/, `<title>${safeTitle}</title>`)
    .replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${safeDescription}" />`,
    );

  out = out.replace(
    '</head>',
    [
      `<link rel="canonical" href="${url}" />`,
      `<meta property="og:type" content="website" />`,
      `<meta property="og:title" content="${safeTitle}" />`,
      `<meta property="og:description" content="${safeDescription}" />`,
      `<meta property="og:url" content="${url}" />`,
      `<meta property="og:image" content="${ogImage}" />`,
      `<meta property="og:site_name" content="Portfolio" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${safeTitle}" />`,
      `<meta name="twitter:description" content="${safeDescription}" />`,
      `<meta name="twitter:image" content="${ogImage}" />`,
    ].join('\n    ') + '\n  </head>',
  );

  return out;
}

for (const route of PORTFOLIO_SPA_ROUTES) {
  const outPath = join(portfolioDist, route.path, 'index.html');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, withRouteMeta(template, route));
  console.log(`Created /portfolio/${route.path}/index.html`);
}

console.log(`Generated ${PORTFOLIO_SPA_ROUTES.length} portfolio route shells`);

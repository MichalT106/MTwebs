import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { BASE_PATH } from './siteConfig.mjs';

const portfolioDist = join(process.cwd(), 'dist', 'Portfolio');
const indexPath = join(portfolioDist, 'index.html');

/** Restore client-side routes from GitHub Pages ?/path query URLs. */
const spaRestoreScript = `<script>(function(l){var b=${JSON.stringify(BASE_PATH)};if(l.search.length>1&&l.search.charAt(1)==="/"){var d=l.search.slice(2).split("&").map(function(s){return s.replace(/~and~/g,"&")}).join("?");window.history.replaceState(null,"",b+"/"+d+l.hash)}}(window.location))</script>`;

function injectSpaRestoreScript(html) {
  if (html.includes('window.history.replaceState(null,"",b+"/"+d')) {
    return html;
  }
  return html.replace('<head>', `<head>${spaRestoreScript}`);
}

let indexHtml = readFileSync(indexPath, 'utf8');
indexHtml = injectSpaRestoreScript(indexHtml);
writeFileSync(indexPath, indexHtml);

console.log(`Injected SPA restore script into dist/Portfolio/index.html`);

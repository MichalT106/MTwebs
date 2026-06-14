import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { BASE_PATH } from './siteConfig.mjs';

const dist = join(process.cwd(), 'dist');
const indexPath = join(dist, 'index.html');
const notFoundPath = join(dist, '404.html');

/** Restore client-side routes from GitHub Pages ?/path query URLs. */
const spaRestoreScript = `<script>(function(l){var b=${JSON.stringify(BASE_PATH)};if(l.search.length>1&&l.search.charAt(1)==="/"){var d=l.search.slice(2).split("&").map(function(s){return s.replace(/~and~/g,"&")}).join("?");window.history.replaceState(null,"",b+"/"+d+l.hash)}}(window.location))</script>`;

/** Redirect deep links to the SPA entry with a recoverable query path. */
const spaRedirectPage = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>MTweb</title>
    <script type="text/javascript">
      var segmentPrefix = ${JSON.stringify(BASE_PATH)};
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        segmentPrefix + '/?/' +
        l.pathname.slice(segmentPrefix.length + 1).replace(/^\\//, '').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body></body>
</html>
`;

function injectSpaRestoreScript(html) {
  if (html.includes('window.history.replaceState(null,"",b+"/"+d')) {
    return html;
  }
  return html.replace('<head>', `<head>${spaRestoreScript}`);
}

let indexHtml = readFileSync(indexPath, 'utf8');
indexHtml = injectSpaRestoreScript(indexHtml);
writeFileSync(indexPath, indexHtml);

writeFileSync(notFoundPath, spaRedirectPage);

console.log(`Created dist/404.html SPA redirect for ${BASE_PATH}/`);

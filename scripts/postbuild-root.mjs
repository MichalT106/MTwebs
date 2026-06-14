import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { BASE_PATH } from './siteConfig.mjs';

const dist = join(process.cwd(), 'dist');
const notFoundPath = join(dist, '404.html');

/** Site-wide 404: route /MTweb/* to portfolio SPA, everything else to root landing. */
const root404Page = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Redirecting…</title>
    <script type="text/javascript">
      (function () {
        var segmentPrefix = ${JSON.stringify(BASE_PATH)};
        var l = window.location;

        if (l.pathname === segmentPrefix || l.pathname.indexOf(segmentPrefix + '/') === 0) {
          var rest = l.pathname.slice(segmentPrefix.length).replace(/^\\//, '');
          var target =
            l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
            segmentPrefix + '/?/' +
            rest.replace(/&/g, '~and~') +
            (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
            l.hash;
          l.replace(target);
          return;
        }

        l.replace(l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') + '/');
      })();
    </script>
  </head>
  <body></body>
</html>
`;

writeFileSync(notFoundPath, root404Page);

console.log(`Created dist/404.html (routes ${BASE_PATH}/* to portfolio SPA)`);

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
const dist = join(process.cwd(), 'dist');
const notFoundPath = join(dist, '404.html');

/** Site-wide 404: keep old /Portfolio/* links working, otherwise return to root. */
const root404Page = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Redirecting…</title>
    <script type="text/javascript">
      (function () {
        var oldPortfolioPrefix = '/Portfolio';
        var l = window.location;

        if (l.pathname === oldPortfolioPrefix || l.pathname.indexOf(oldPortfolioPrefix + '/') === 0) {
          var rest = l.pathname.slice(oldPortfolioPrefix.length);
          var target =
            l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
            '/portfolio' +
            rest +
            l.search +
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

console.log('Created dist/404.html (redirects /Portfolio/* to /portfolio/*)');

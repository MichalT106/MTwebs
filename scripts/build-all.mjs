import { spawnSync } from 'node:child_process';

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit', shell: true });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log('Building root landing page…');
run('vite', ['build', '--config', 'vite.config.landing.ts']);

console.log('Building portfolio application…');
run('tsc', ['-b']);
run('vite', ['build']);

console.log('Running postbuild scripts…');
run('node', ['scripts/postbuild.mjs']);
run('node', ['scripts/postbuild-root.mjs']);

console.log('Build complete: dist/ (landing) + dist/Portfolio/ (portfolio)');

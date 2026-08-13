import { spawnSync } from 'node:child_process';

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit', shell: true });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log('Generating landing metadata…');
run('node', ['scripts/generate-landing-metadata.mjs']);

console.log('Building root landing page…');
run('vite', ['build', '--config', 'vite.config.landing.ts']);

console.log('Building discovered projects…');
run('node', ['scripts/build-projects.mjs']);

console.log('Running postbuild scripts…');
run('node', ['scripts/generate-sitemap.mjs']);
run('node', ['scripts/postbuild-root.mjs']);

console.log('Build complete: dist/ (landing + discovered projects)');

#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { discoverProjects, getDefaultProjectsDir } from './project-config.mjs';

const SITE_URL = 'https://michaltkac.com';

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function projectUrls(project) {
  const urls = [`/${project.slug}/`];
  for (const route of project.routes) {
    urls.push(`/${project.slug}/${route.replace(/^\/+/, '')}`);
  }
  return urls;
}

function createSitemap(urls) {
  const entries = urls
    .map((path) => {
      const loc = `${SITE_URL}${path}`;
      return [
        '  <url>',
        `    <loc>${escapeXml(loc)}</loc>`,
        '    <changefreq>monthly</changefreq>',
        path === '/' ? '    <priority>1.0</priority>' : '    <priority>0.8</priority>',
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries,
    '</urlset>',
    '',
  ].join('\n');
}

const result = discoverProjects({ projectsDir: getDefaultProjectsDir() });

for (const warning of result.warnings) {
  console.warn(`Warning: ${warning}`);
}

if (result.errors.length > 0) {
  for (const error of result.errors) {
    console.error(`Error: ${error}`);
  }
  process.exit(1);
}

const urls = ['/', ...result.projects.flatMap(projectUrls)];
const outPath = resolve(join('dist', 'sitemap.xml'));
writeFileSync(outPath, createSitemap(urls));
console.log(`Generated sitemap with ${urls.length} URL(s): ${outPath}`);

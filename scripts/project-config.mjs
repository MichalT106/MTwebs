import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, resolve } from 'node:path';

export const PROJECT_TYPES = new Set(['static', 'vite', 'custom']);

export const RESERVED_SLUGS = new Set([
  '404',
  'api',
  'assets',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
]);

export const PROJECT_CONFIG_CONTRACT = {
  required: ['name', 'slug', 'description', 'type', 'outputDir'],
  optional: [
    'buildCommand',
    'installCommand',
    'sourceDir',
    'image',
    'category',
    'featured',
    'routes',
    'env',
  ],
  types: Array.from(PROJECT_TYPES),
};

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isRelativeSafePath(value) {
  if (!isNonEmptyString(value)) return false;
  const normalized = value.replace(/\\/g, '/');
  return (
    !normalized.startsWith('/') &&
    !normalized.includes('://') &&
    !normalized.split('/').includes('..')
  );
}

function validateSlug(slug) {
  if (!isNonEmptyString(slug)) return 'slug must be a non-empty string';
  if (!/^[a-z0-9_](?:[a-z0-9_-]*[a-z0-9_])?$/.test(slug)) {
    return 'slug must use lowercase letters, numbers, underscores, and hyphens only';
  }
  if (RESERVED_SLUGS.has(slug)) return `slug "${slug}" is reserved`;
  return null;
}

function validateStringArray(config, key, errors, { paths = false } = {}) {
  if (config[key] === undefined) return;
  if (!Array.isArray(config[key])) {
    errors.push(`${key} must be an array`);
    return;
  }
  for (const item of config[key]) {
    if (!isNonEmptyString(item)) {
      errors.push(`${key} entries must be non-empty strings`);
      continue;
    }
    if (paths && !isRelativeSafePath(item)) {
      errors.push(`${key} entry "${item}" must be a safe relative path`);
    }
  }
}

export function validateProjectConfig(config, { configPath = 'project.json' } = {}) {
  const errors = [];

  if (!isPlainObject(config)) {
    return { valid: false, errors: [`${configPath} must contain a JSON object`] };
  }

  for (const field of PROJECT_CONFIG_CONTRACT.required) {
    if (!isNonEmptyString(config[field])) {
      errors.push(`${field} is required and must be a non-empty string`);
    }
  }

  const slugError = validateSlug(config.slug);
  if (slugError) errors.push(slugError);

  if (config.type !== undefined && !PROJECT_TYPES.has(config.type)) {
    errors.push(`type must be one of: ${Array.from(PROJECT_TYPES).join(', ')}`);
  }

  if (config.outputDir !== undefined && !isRelativeSafePath(config.outputDir)) {
    errors.push('outputDir must be a safe relative path');
  }

  if (config.sourceDir !== undefined && !isRelativeSafePath(config.sourceDir)) {
    errors.push('sourceDir must be a safe relative path');
  }

  if ((config.type === 'vite' || config.type === 'custom') && !isNonEmptyString(config.buildCommand)) {
    errors.push('buildCommand is required for vite and custom projects');
  }

  if (config.installCommand !== undefined && !isNonEmptyString(config.installCommand)) {
    errors.push('installCommand must be a non-empty string when provided');
  }

  if (config.image !== undefined && !isRelativeSafePath(config.image)) {
    errors.push('image must be a safe relative path');
  }

  if (config.category !== undefined && !isNonEmptyString(config.category)) {
    errors.push('category must be a non-empty string when provided');
  }

  if (config.featured !== undefined && typeof config.featured !== 'boolean') {
    errors.push('featured must be a boolean when provided');
  }

  validateStringArray(config, 'routes', errors, { paths: true });
  validateStringArray(config, 'env', errors);

  return { valid: errors.length === 0, errors };
}

function normalizeProjectConfig(config, projectDir) {
  return {
    name: config.name.trim(),
    slug: config.slug.trim(),
    description: config.description.trim(),
    type: config.type,
    buildCommand: config.buildCommand?.trim(),
    installCommand: config.installCommand?.trim(),
    outputDir: config.outputDir.trim(),
    sourceDir: config.sourceDir?.trim() ?? '.',
    image: config.image?.trim(),
    category: config.category?.trim(),
    featured: config.featured ?? false,
    routes: config.routes ?? [],
    env: config.env ?? [],
    projectDir,
  };
}

function readProjectConfig(configPath) {
  try {
    return JSON.parse(readFileSync(configPath, 'utf8'));
  } catch (error) {
    return {
      parseError: error instanceof Error ? error.message : String(error),
    };
  }
}

export function discoverProjects({ projectsDir = resolve(process.cwd(), 'projects') } = {}) {
  const root = resolve(projectsDir);

  if (!existsSync(root)) {
    return {
      projectsDir: root,
      projects: [],
      errors: [],
      warnings: [`Projects directory not found: ${root}`],
    };
  }

  const projects = [];
  const errors = [];
  const warnings = [];
  const seenSlugs = new Map();

  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const projectDir = resolve(root, entry.name);
    const configPath = resolve(projectDir, 'project.json');

    if (!existsSync(configPath)) {
      warnings.push(`Skipping ${entry.name}: missing project.json`);
      continue;
    }

    const rawConfig = readProjectConfig(configPath);
    if ('parseError' in rawConfig) {
      errors.push(`${configPath}: invalid JSON (${rawConfig.parseError})`);
      continue;
    }

    const result = validateProjectConfig(rawConfig, { configPath });
    if (!result.valid) {
      errors.push(...result.errors.map((message) => `${configPath}: ${message}`));
      continue;
    }

    if (seenSlugs.has(rawConfig.slug)) {
      errors.push(`${configPath}: duplicate slug "${rawConfig.slug}" also used by ${seenSlugs.get(rawConfig.slug)}`);
      continue;
    }

    seenSlugs.set(rawConfig.slug, configPath);
    projects.push(normalizeProjectConfig(rawConfig, projectDir));
  }

  projects.sort((a, b) => a.slug.localeCompare(b.slug));

  return { projectsDir: root, projects, errors, warnings };
}

export function getDefaultProjectsDir() {
  return resolve(process.env.PROJECTS_DIR ?? 'projects');
}

export function isDirectory(path) {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

export function getProjectConfigFileName() {
  return basename('project.json');
}

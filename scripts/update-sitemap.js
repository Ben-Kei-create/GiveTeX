#!/usr/bin/env node
/**
 * sitemap.xml auto-updater
 * Usage: node scripts/update-sitemap.js
 *
 * Scans articles/ directory and regenerates sitemap.xml
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://www.givetex.org';
const ROOT = path.resolve(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT, 'articles');
const SITEMAP_PATH = path.join(ROOT, 'sitemap.xml');

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function getArticleFiles() {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs.readdirSync(ARTICLES_DIR)
    .filter(f => f.endsWith('.html') && !f.startsWith('_'))
    .sort();
}

function buildSitemap(articleFiles) {
  const today = getToday();

  const staticPages = [
    { loc: '/', priority: '1.0' },
    { loc: '/about.html', priority: '0.5' },
    { loc: '/privacy.html', priority: '0.3' },
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const page of staticPages) {
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}${page.loc}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  for (const file of articleFiles) {
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}/articles/${file}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += '</urlset>\n';
  return xml;
}

const articles = getArticleFiles();
const sitemap = buildSitemap(articles);
fs.writeFileSync(SITEMAP_PATH, sitemap, 'utf-8');

console.log(`sitemap.xml updated with ${articles.length} article(s):`);
articles.forEach(f => console.log(`  - ${f}`));

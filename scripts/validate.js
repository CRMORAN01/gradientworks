'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const requiredFiles = [
  'public/index.html',
  'public/privacidad.html',
  'public/terminos.html',
  'public/cookies.html',
  'public/eliminar-datos.html',
  'public/404.html',
  'public/thanks.html',
  'public/css/style.css',
  'public/js/main.js',
  'public/img/fondo_pagina_60fps.mp4'
];

const errors = [];

for (const relativePath of requiredFiles) {
  if (!fs.existsSync(path.join(root, relativePath))) {
    errors.push(`Missing required file: ${relativePath}`);
  }
}

const htmlFiles = requiredFiles.filter((file) => file.endsWith('.html'));
for (const relativePath of htmlFiles) {
  const html = fs.readFileSync(path.join(root, relativePath), 'utf8');
  if (!html.includes('<html lang="es">')) errors.push(`${relativePath}: missing Spanish language declaration`);
  if (!html.includes('name="viewport"')) errors.push(`${relativePath}: missing viewport metadata`);
  if (/\b(?:href|src)="\//.test(html)) errors.push(`${relativePath}: root-relative asset breaks project hosting`);
}

const home = fs.readFileSync(path.join(root, 'public/index.html'), 'utf8');
if (!home.includes('https://formsubmit.co/crsaravia1@gmail.com')) {
  errors.push('Contact form destination is not configured');
}

const rights = fs.readFileSync(path.join(root, 'public/eliminar-datos.html'), 'utf8');
if (!rights.includes('https://formsubmit.co/crsaravia1@gmail.com')) {
  errors.push('Rights form destination is not configured');
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validation passed: ${requiredFiles.length} required files checked.`);

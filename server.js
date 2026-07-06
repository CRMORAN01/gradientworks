'use strict';

const express = require('express');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, 'public');
const PORT = Number.parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

function setSecurityHeaders(_req, res, next) {
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src https://fonts.gstatic.com",
    "img-src 'self' data: https://images.unsplash.com",
    "media-src 'self'",
    "connect-src 'self' https://formsubmit.co",
    "form-action 'self' https://formsubmit.co",
    "base-uri 'self'",
    "frame-ancestors 'none'"
  ].join('; '));
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
}

function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(setSecurityHeaders);
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb' }));
  app.use(express.static(PUBLIC_DIR, {
    setHeaders(res, filePath) {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=86400');
      }
    }
  }));

  const pages = new Map([
    ['/', 'index.html'],
    ['/privacidad', 'privacidad.html'],
    ['/terminos', 'terminos.html'],
    ['/cookies', 'cookies.html'],
    ['/eliminar-datos', 'eliminar-datos.html']
  ]);

  for (const [route, file] of pages) {
    app.get(route, (_req, res) => res.sendFile(path.join(PUBLIC_DIR, file)));
  }

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use((_req, res) => res.status(404).sendFile(path.join(PUBLIC_DIR, '404.html')));

  return app;
}

if (require.main === module) {
  createApp().listen(PORT, HOST, () => {
    console.log(`GradientWorks available at http://${HOST}:${PORT}`);
  });
}

module.exports = { createApp };

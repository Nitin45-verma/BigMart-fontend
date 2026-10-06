# BigMart Frontend Deployment Guide

This document outlines the steps and requirements for deploying the BigMart frontend application to a production environment.

## 1. Install Dependencies

Before building or running the frontend, install the necessary dependencies using npm:

```bash
npm install
```

## 2. Environment Variables

Create a `.env` file in the `frontend` root directory. For production, ensure the appropriate variables are set based on `.env.example`.

Do **not** commit actual `.env` files containing secrets or live configuration to version control.

### Required Environment Variables
- `VITE_API_BASE_URL`: The base URL for the backend API (e.g., `https://api.bigmart.com`). This must not be localhost in production.
- `VITE_RAZORPAY_KEY_ID`: Your public Razorpay key for checkout (if required by your frontend configuration).
- `VITE_IMAGEKIT_URL_ENDPOINT`: Your ImageKit URL endpoint for fetching optimized images (if applicable).

## 3. Development Command

To run the application locally for development:

```bash
npm run dev
```

## 4. Production Build

To build the application for production:

```bash
npm run build
```

This will create an optimized build inside the `dist` folder.

## 5. Preview Command

To locally preview the production build before deployment:

```bash
npm run preview
```

## 6. Deployment Requirements

- **Node.js**: Ensure your build environment supports the Node version specified in package.json or a recent LTS version.
- **Static Hosting**: The `dist` folder can be hosted on any static hosting service like Vercel, Netlify, AWS S3 + CloudFront, or Nginx.
- **HTTPS**: Your production domain must be served over HTTPS for secure cookie and session handling.

## 7. SPA Fallback Configuration

Because BigMart uses React Router for client-side routing, you must configure your web server to redirect all requests to `index.html`.

### Nginx Example:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Apache Example (.htaccess):
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## 8. Backend API URL Configuration

Ensure that `VITE_API_BASE_URL` in your production environment accurately points to your production backend.

## 9. Razorpay Public Key Configuration

If your frontend uses Razorpay directly (e.g., loading the Razorpay script), ensure the `VITE_RAZORPAY_KEY_ID` (public key) is provided. Never expose the `RAZORPAY_KEY_SECRET` in the frontend environment.

## 10. ImageKit Public Configuration

Ensure any ImageKit configurations use only the public URL endpoints or public keys. Do not expose `IMAGEKIT_PRIVATE_KEY` on the frontend.

## 11. Post-Deployment Smoke Tests

After deploying, run through the `PRODUCTION_SMOKE_TEST_CHECKLIST.md` to verify all primary flows (authentication, checkout, seller dashboard, admin moderation) are functional in the live environment.

# BigMart Frontend

This is the frontend application for BigMart, India's premier marketplace.

## Technology Stack
- React
- Vite
- JavaScript
- Tailwind CSS
- Redux Toolkit
- React Redux
- React Router DOM
- Axios

## Installation

```bash
cd frontend
npm install
```

## Environment Setup
Create a `.env` file in the `frontend/` directory based on `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

> **WARNING**: Frontend environment variables are public. NEVER commit secrets like JWT keys, Stripe/Razorpay private keys, database passwords, or ImageKit secrets.

## Development

To start the development server:
```bash
npm run dev
```

## Build

To create a production build:
```bash
npm run build
```

## Project Structure
- `src/app/` - Redux store and React Router configurations
- `src/components/` - Reusable UI, layout, and feature components
- `src/pages/` - Page components mapping to routes
- `src/services/` - Axios API client configuration
- `src/features/` - Redux slices and feature-specific logic

## Backend Dependency
This frontend connects to the BigMart Node.js backend. The backend must be running for features to work correctly. Ensure the `VITE_API_BASE_URL` points to the correct backend location (e.g. `http://localhost:5000/api/v1`).

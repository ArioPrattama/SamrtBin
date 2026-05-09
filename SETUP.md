# SmartBin — Setup Guide

## Tech Stack
- Next.js 16.2.6 (App Router)
- Tailwind CSS v4.2
- React Three Fiber v9 (3D model)
- Better Auth v1 (authentication)
- Firebase v12 Firestore (database)

## 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

## 2. Setup Firebase
1. Buka https://console.firebase.google.com
2. Buat project baru → nama: `smartbin-app`
3. Aktifkan Firestore Database (mode test untuk development)
4. Project Settings → General → Your apps → Web app
5. Copy config ke `.env.local`

## 3. Setup Google OAuth (untuk login Google)
1. Buka https://console.cloud.google.com
2. APIs & Services → Credentials → Create OAuth 2.0 Client ID
3. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID & Secret ke `.env.local`

## 4. Isi .env.local
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

BETTER_AUTH_SECRET=ganti_dengan_random_string_panjang
BETTER_AUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

## 5. Jalankan Development Server
```bash
npm run dev
```
Buka http://localhost:3000

## 6. Deploy ke Vercel
```bash
npm install -g vercel
vercel
```
Tambahkan semua env variables di Vercel Dashboard → Settings → Environment Variables

## Akun Demo Admin
- URL: http://localhost:3000/admin
- Email: admin@smartbin.com
- Password: admin1234

## Halaman
- `/` — Landing page (3D SmartBin hero)
- `/login` — Login user
- `/register` — Register user
- `/dashboard` — User home
- `/dashboard/scan` — Simulasi scan QR
- `/dashboard/rewards` — Tukar eco-points
- `/dashboard/profile` — Profil user
- `/admin` — Login admin (hidden)
- `/admin/dashboard` — Dashboard admin
- `/admin/bins` — Manajemen SmartBins
- `/admin/routes` — Rute penjemputan DSS
- `/admin/analytics` — Analitik & metrik

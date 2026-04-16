# Prithvix

Prithvix is a premium AgriTech dealer management platform built as one cohesive Next.js product with:

- A marketing website at `/`
- A protected ERP dashboard at `/dashboard`
- JWT cookie auth, Prisma schema, and API route scaffolding
- Premium earthy branding with Tailwind, Framer Motion, GSAP, Recharts, Leaflet, and React Three Fiber

## Stack

- Next.js App Router
- Tailwind CSS
- Framer Motion + GSAP ScrollTrigger
- React Three Fiber + Drei
- Prisma ORM
- MySQL-compatible schema
- Custom JWT auth
- Recharts
- Leaflet

## Environment

Copy `.env.example` into `.env.local` and provide:

- `DATABASE_URL`
- `JWT_SECRET`
- `OPENAI_API_KEY`

## Demo Login

- Dealer: `dealer@prithvix.com`
- Staff: `fieldstaff`
- Password: `demo1234`

## Scripts

- `npm run dev`
- `npm run build`
- `npm run prisma:generate`
- `npm run prisma:push`

## Notes

- The current UI uses structured mock data for dashboard modules so the experience is immediately usable.
- Prisma models are included for production database wiring.
- The AI agronomist route calls OpenAI when `OPENAI_API_KEY` is present and falls back to a deterministic advisory response during local setup.

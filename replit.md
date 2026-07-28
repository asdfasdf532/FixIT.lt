# FixIt.lt

Kompiuterių remonto serviso ir elektroninės parduotuvės svetainė. Lietuviškai ir angliškai. Kai klientas užsako, meistras gauna el. laišką į neilas1747@gmail.com.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — API serveris (port 8080)
- `pnpm --filter @workspace/fixit-website run dev` — Svetainė (port 23201)
- `pnpm run typecheck` — pilnas typecheck
- `pnpm run build` — typecheck + build
- `pnpm --filter @workspace/api-spec run codegen` — regeneruoti API hooks ir Zod schemas
- `pnpm --filter @workspace/db run push` — push DB schema pakeitimų

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, wouter, framer-motion, Tailwind CSS
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Email: Nodemailer (Gmail SMTP)
- Validation: Zod (zod/v4), drizzle-zod
- API codegen: Orval (from OpenAPI spec)

## Where things live

- `artifacts/fixit-website/src/` — React frontend (puslapiai, komponentai, kalbos kontekstas)
- `artifacts/api-server/src/routes/` — API route handlers
- `artifacts/api-server/src/lib/email.ts` — el. laiško siuntimas
- `lib/db/src/schema/` — DB schemos (orders, products, services)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (šaltinis)

## Email setup (el. laiškų siuntimas)

El. laiškai siunčiami į **neilas1747@gmail.com** kai ateina naujas užsakymas.

Reikia nustatyti 2 environment variables:
- `GMAIL_USER` — tavo Gmail adresas (pvz. neilas1747@gmail.com)
- `GMAIL_APP_PASSWORD` — Gmail App Password (ne paprastas slaptažodis!)

Kaip gauti Gmail App Password:
1. Eik į myaccount.google.com → Security → 2-Step Verification (įjungti)
2. Tada myaccount.google.com → Security → App passwords
3. Sukurk naują app password → nukopijuok 16 simbolių kodą

Jei `GMAIL_USER`/`GMAIL_APP_PASSWORD` nenustatyti, užsakymai vis tiek išsaugomi DB, bet laiškas nesiunčiamas (tik užrašoma į log).

## Pages

- `/` — Pagrindinis puslapis (hero su animacijomis)
- `/paslaugos` — Remonto paslaugos su kainomis
- `/parduotuve` — Elektroninė parduotuvė
- `/pc-builder` — PC konfigūratorius su suderinamumo tikrinimas
- `/uzsakyti` — Užsakymo forma
- `/kontaktai` — Kontaktai

## User preferences

- Kalba: Lietuviskai + anglų (kalbos keitiklis)
- Spalva: geltona (#F5C500) + tamsus fonas
- El. laiškų gavėjas: neilas1747@gmail.com

## Gotchas

- Po DB schema pakeitimų: `pnpm --filter @workspace/db run push`
- Po OpenAPI spec pakeitimų: `pnpm --filter @workspace/api-spec run codegen`
- Gmail reikia App Password, ne paprastas slaptažodis

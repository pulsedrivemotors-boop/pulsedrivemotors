This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

Production runs on a Hetzner VPS (`89.167.60.131`) under Docker, fronted by Traefik (TLS via Let's Encrypt). The site is served at https://pulsedrivemotors.ca.

### Layout on the server

- App checkout: `/opt/pulse-drive/pulsedrivemotors/` (clone of this repo, same `origin`)
- Traefik: `/opt/traefik/` (separate `docker-compose.yml`, provides the external `traefik` network)
- SQLite DB: `/opt/pulse-drive/pulsedrivemotors/data/prod.db` (bind-mounted into the container at `/app/data/`)
- User uploads: `/opt/pulse-drive/pulsedrivemotors/uploads/` (bind-mounted at `/app/public/uploads/`)
- Env vars: `/opt/pulse-drive/pulsedrivemotors/.env` (read by `docker compose` for `${...}` substitution in `docker-compose.yml`)

### Server-local files that diverge from the repo

The server's `docker-compose.yml` has extra env vars and an uploads volume that aren't committed (intentional — they're infra config). The file shows as modified in `git status` on the server. **Do not `git checkout` it during a deploy** — preserve it.

### Deploy procedure

GitHub SSH access on the server uses a non-default key at `/root/.ssh/github`, so `git pull` must be invoked with `GIT_SSH_COMMAND` pointing at it.

1. From your dev machine, push to `main`:
   ```bash
   git push origin main
   ```
2. SSH to the server and pull + rebuild:
   ```bash
   ssh root@89.167.60.131
   cd /opt/pulse-drive/pulsedrivemotors

   # Drop any leftover WIP that's been superseded by commits — but
   # NEVER touch docker-compose.yml (server-only config lives there).
   git checkout -- Dockerfile package.json src/

   GIT_SSH_COMMAND='ssh -i /root/.ssh/github -o IdentitiesOnly=yes' \
     git pull origin main

   docker compose up --build -d
   ```
3. Verify:
   ```bash
   curl -sI https://pulsedrivemotors.ca/ | head -1   # expect HTTP/2 200
   docker logs --tail 30 pulsedrivemotors-pulse-drive-1
   ```

### Migrations

Run automatically on container start via `start.sh` → `migrate.js`. No manual step needed.

### Rollback

```bash
ssh root@89.167.60.131
cd /opt/pulse-drive/pulsedrivemotors
git reset --hard <previous-good-sha>
docker compose up --build -d
```

The `data/` and `uploads/` directories are not in git and survive rebuilds. If a migration breaks the DB, restore `data/prod.db` from a snapshot before rolling code back.

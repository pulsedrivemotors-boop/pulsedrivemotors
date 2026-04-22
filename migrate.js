/**
 * Migration runner using better-sqlite3 directly.
 * No Prisma CLI needed — works in standalone Docker output.
 */
// Use absolute path to bypass package exports restriction
const Database = require(
  require.resolve('better-sqlite3', {
    paths: [require.resolve('@prisma/adapter-better-sqlite3').replace(/\/dist.*/, '')]
  })
);
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rawUrl = process.env.DATABASE_URL || 'file:/app/data/prod.db';
const dbPath = rawUrl.replace(/^file:/, '');

// Ensure directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Create Prisma-compatible migrations table
db.exec(`
  CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    id                    TEXT     NOT NULL PRIMARY KEY,
    checksum              TEXT     NOT NULL,
    migration_name        TEXT     NOT NULL,
    started_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    finished_at           DATETIME,
    applied_steps_count   INTEGER  NOT NULL DEFAULT 0,
    logs                  TEXT,
    rolled_back_at        DATETIME
  )
`);

const applied = new Set(
  db.prepare(`SELECT migration_name FROM "_prisma_migrations" WHERE finished_at IS NOT NULL`).all().map(r => r.migration_name)
);

const migrationsDir = path.join(__dirname, 'prisma', 'migrations');
if (!fs.existsSync(migrationsDir)) {
  console.log('No migrations directory found, skipping.');
  db.close();
  process.exit(0);
}

const dirs = fs.readdirSync(migrationsDir)
  .filter(d => fs.statSync(path.join(migrationsDir, d)).isDirectory())
  .sort();

let count = 0;
for (const dir of dirs) {
  if (applied.has(dir)) {
    console.log(`  ✓ ${dir}`);
    continue;
  }

  const sqlFile = path.join(migrationsDir, dir, 'migration.sql');
  if (!fs.existsSync(sqlFile)) continue;

  const sql = fs.readFileSync(sqlFile, 'utf8');
  const checksum = crypto.createHash('sha256').update(sql).digest('hex');

  console.log(`  → Applying ${dir}...`);

  db.exec(sql);

  db.prepare(
    `INSERT INTO "_prisma_migrations" (id, checksum, migration_name, finished_at, applied_steps_count)
     VALUES (?, ?, ?, datetime('now'), 1)`
  ).run(crypto.randomUUID(), checksum, dir);

  console.log(`  ✓ ${dir} applied`);
  count++;
}

db.close();
console.log(`Migrations complete. ${count} applied.`);

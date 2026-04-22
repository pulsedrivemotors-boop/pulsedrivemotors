/**
 * Lightweight migration runner — no Prisma CLI needed.
 * Uses @prisma/client (already in standalone) + raw SQL files.
 */
const { PrismaClient } = require('/app/node_modules/@prisma/client');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function run() {
  // Ensure migrations tracking table exists
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
      id                TEXT    NOT NULL PRIMARY KEY,
      checksum          TEXT    NOT NULL,
      migration_name    TEXT    NOT NULL,
      started_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      finished_at       DATETIME,
      applied_steps_count INTEGER NOT NULL DEFAULT 0,
      logs              TEXT,
      rolled_back_at    DATETIME
    )
  `);

  // Get already-applied migration names
  const rows = await prisma.$queryRawUnsafe(
    `SELECT migration_name FROM "_prisma_migrations" WHERE finished_at IS NOT NULL`
  );
  const applied = new Set(rows.map(r => r.migration_name));

  // Read migration directories sorted alphabetically
  const migrationsDir = path.join(__dirname, 'prisma', 'migrations');
  if (!fs.existsSync(migrationsDir)) {
    console.log('No migrations directory found, skipping.');
    return;
  }

  const dirs = fs.readdirSync(migrationsDir)
    .filter(d => fs.statSync(path.join(migrationsDir, d)).isDirectory())
    .sort();

  for (const dir of dirs) {
    if (applied.has(dir)) {
      console.log(`  ✓ ${dir} (already applied)`);
      continue;
    }

    const sqlFile = path.join(migrationsDir, dir, 'migration.sql');
    if (!fs.existsSync(sqlFile)) continue;

    const sql = fs.readFileSync(sqlFile, 'utf8');
    const checksum = crypto.createHash('sha256').update(sql).digest('hex');

    console.log(`  → Applying ${dir}...`);

    // Split into individual statements and run each
    const statements = sql
      .split(/;\s*\n/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const stmt of statements) {
      await prisma.$executeRawUnsafe(stmt);
    }

    await prisma.$executeRawUnsafe(
      `INSERT INTO "_prisma_migrations" (id, checksum, migration_name, finished_at, applied_steps_count)
       VALUES (?, ?, ?, datetime('now'), 1)`,
      crypto.randomUUID(), checksum, dir
    );

    console.log(`  ✓ ${dir} applied`);
  }

  await prisma.$disconnect();
}

run().catch(err => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});

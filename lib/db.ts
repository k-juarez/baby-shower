import { neon } from '@neondatabase/serverless';

let _sql: ReturnType<typeof neon> | undefined;

function getDb() {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    _sql = neon(url);
  }
  return _sql;
}

export function sql(
  strings: TemplateStringsArray,
  ...values: unknown[]
) {
  return getDb()(strings, ...values);
}

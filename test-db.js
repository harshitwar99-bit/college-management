const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres:HARSHITWAR99@db.bekysmhrauwfkpmbbpgj.supabase.co:5432/postgres?pgbouncer=true',
  connectionTimeoutMillis: 5000
});
client.connect()
  .then(() => {
    console.log('Connected!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection failed:', err.message);
    process.exit(1);
  });

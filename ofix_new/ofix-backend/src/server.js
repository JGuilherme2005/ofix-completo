import 'dotenv/config';
import './lib/startup-guards.js'; // M1-SEC-01: fail-fast on missing env vars
import dns from 'node:dns';
import app from './app.js';

// Prefer IPv4 first. This avoids long hangs in environments with broken/absent IPv6 routing.
dns.setDefaultResultOrder('ipv4first');

const port = process.env.PORT || 10000;

app.listen(port, () => {
  console.log(`🚀 OFIX Backend rodando na porta ${port}`);
});

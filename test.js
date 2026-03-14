'use strict';

const http = require('http');
const app = require('./server');

const PORT = 3099;
let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    console.log(`PASS: ${label}`);
    passed++;
  } else {
    console.error(`FAIL: ${label}`);
    failed++;
  }
}

function request(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${PORT}${path}`, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, body });
        }
      });
    }).on('error', reject);
  });
}

async function runTests(server) {
  console.log('\n Running tests against http://127.0.0.1:' + PORT + '\n');

  console.log('Test 1 — GET /health');
  const health = await request('/health');
  assert(health.status === 200, 'Status code is 200');
  assert(health.body.status === 'ok', 'Body.status equals "ok"');
  assert(typeof health.body.uptime === 'number', 'Body.uptime is a number');
  assert(typeof health.body.timestamp === 'string', 'Body.timestamp is a string');

  console.log('\nTest 2 — GET /unknown-route');
  const notFound = await request('/unknown-route');
  assert(notFound.status === 404, 'Status code is 404');


  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  server.close();
  process.exit(failed > 0 ? 1 : 0);
}

const server = app.listen(PORT, '127.0.0.1', () => runTests(server));

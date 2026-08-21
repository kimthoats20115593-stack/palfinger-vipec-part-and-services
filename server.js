/**
 * Custom Node.js entry point for hosting environments (like Hostinger's
 * Passenger-based Node.js App Manager) that require a startup .js file
 * instead of running `npm run start` directly.
 *
 * Locally and on hosts that support npm scripts, prefer `npm run start`
 * (see package.json) — this file exists only for hosts that need a
 * direct entry point.
 */
/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS entry point required by Passenger-style hosts */
const { createServer } = require("http");
const next = require("next");

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(port, () => {
    console.log(`> PALFINGER VIPEC ready on port ${port}`);
  });
});

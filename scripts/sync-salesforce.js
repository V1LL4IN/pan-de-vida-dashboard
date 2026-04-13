/**
 * Pan de Vida Dashboard — Salesforce Sync Script
 *
 * Fetches all configured Salesforce reports and writes the results to
 * dashboard-app/public/data/dashboard.json. Run this script via the
 * Plesk Scheduled Tasks cron (twice a day).
 *
 * Usage:
 *   cd scripts && node sync-salesforce.js
 *
 * Environment variables: copy ../.env.example to ../.env and fill in values.
 */

import { writeFileSync, readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createSign } from "crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Load .env ────────────────────────────────────────────────────────────────
// Try loading dotenv; if the package isn't installed yet, fall back to reading
// the .env file manually so the script still works before `npm install`.
try {
  const { default: dotenv } = await import("dotenv");
  dotenv.config({ path: resolve(__dirname, ".env") });
} catch {
  try {
    const raw = readFileSync(resolve(__dirname, ".env"), "utf8");
    for (const line of raw.split("\n")) {
      const [key, ...rest] = line.split("=");
      if (key && !key.startsWith("#") && rest.length) {
        process.env[key.trim()] = rest.join("=").trim();
      }
    }
  } catch {
    // .env not found — rely on shell environment variables
  }
}

// ─── Config ───────────────────────────────────────────────────────────────────
const {
  SF_LOGIN_URL  = "https://login.salesforce.com",
  SF_USERNAME,
  SF_CLIENT_ID,
  SF_PRIVATE_KEY_PATH = "./server.key",
  OUTPUT_PATH   = "../dashboard-app/public/data/dashboard.json",
} = process.env;

const API_VERSION = "v59.0";
const OUTPUT_FILE = OUTPUT_PATH.startsWith("/") ? OUTPUT_PATH : resolve(__dirname, OUTPUT_PATH);

// ─── JWT helpers ──────────────────────────────────────────────────────────────
function base64url(str) {
  return Buffer.from(str).toString("base64")
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function buildJWT(clientId, username, loginUrl, privateKey) {
  const header  = base64url(JSON.stringify({ alg: "RS256" }));
  const now     = Math.floor(Date.now() / 1000);
  const payload = base64url(JSON.stringify({
    iss: clientId,
    sub: username,
    aud: loginUrl,
    exp: now + 300,   // 5-minute window
  }));

  const signingInput = `${header}.${payload}`;
  const sign = createSign("RSA-SHA256");
  sign.update(signingInput);
  const signature = sign.sign(privateKey, "base64")
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");

  return `${signingInput}.${signature}`;
}

// ─── Salesforce Auth (JWT Bearer Flow — works with MFA-enforced orgs) ─────────
async function authenticate() {
  const required = { SF_USERNAME, SF_CLIENT_ID };
  const missing = Object.entries(required).filter(([, v]) => !v).map(([k]) => k);
  if (missing.length) throw new Error(`Missing env vars: ${missing.join(", ")}`);

  const keyPath = resolve(__dirname, SF_PRIVATE_KEY_PATH);
  let privateKey;
  try {
    privateKey = readFileSync(keyPath, "utf8");
  } catch {
    throw new Error(`Private key not found at ${keyPath}. Run: openssl genrsa -out server.key 2048`);
  }

  const jwt = buildJWT(SF_CLIENT_ID, SF_USERNAME, SF_LOGIN_URL, privateKey);

  const res = await fetch(`${SF_LOGIN_URL}/services/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion:  jwt,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Salesforce auth failed (${res.status}): ${body}`);
  }

  const { access_token, instance_url } = await res.json();
  console.log(`✓ Authenticated via JWT. Instance: ${instance_url}`);
  return { accessToken: access_token, instanceUrl: instance_url };
}

// ─── Fetch a single report ────────────────────────────────────────────────────
async function fetchReport(instanceUrl, accessToken, reportId) {
  const url = `${instanceUrl}/services/data/${API_VERSION}/analytics/reports/${reportId}?includeDetails=true`;
  const res = await fetch(url, {
    headers: {
      Authorization:  `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Report ${reportId} fetch failed (${res.status}): ${body}`);
  }

  return res.json();
}

// ─── Safe fetch (logs errors but doesn't abort the whole sync) ─────────────────
async function safeReport(instanceUrl, accessToken, reportId, reportName) {
  try {
    const data = await fetchReport(instanceUrl, accessToken, reportId);
    console.log(`  ✓ ${reportName} (${reportId})`);
    return data;
  } catch (err) {
    console.warn(`  ✗ ${reportName} (${reportId}): ${err.message}`);
    return null;
  }
}

// ─── Import report map ────────────────────────────────────────────────────────
const { REPORT_IDS, transformAll } = await import("./report-map.js");

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("Pan de Vida — Salesforce Sync");
  console.log("─".repeat(40));

  const { accessToken, instanceUrl } = await authenticate();

  // Fetch all reports in parallel
  console.log(`\nFetching ${Object.keys(REPORT_IDS).length} reports...`);
  const rawReports = {};
  await Promise.all(
    Object.entries(REPORT_IDS).map(async ([key, id]) => {
      rawReports[key] = await safeReport(instanceUrl, accessToken, id, key);
    })
  );


  // Transform raw Salesforce responses into our dashboard schema
  console.log("\nTransforming data...");
  const dashboardData = transformAll(rawReports);
  dashboardData.lastUpdated = new Date().toISOString();

  // Write output
  writeFileSync(OUTPUT_FILE, JSON.stringify(dashboardData, null, 2), "utf8");
  console.log(`\n✓ Written to ${OUTPUT_FILE}`);
  console.log(`  Last updated: ${dashboardData.lastUpdated}`);
}

main().catch((err) => {
  console.error("\n✗ Sync failed:", err.message);
  process.exit(1);
});

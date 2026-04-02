/**
 * Pan de Vida Dashboard — Report Inspector
 *
 * Run this to understand the structure of any Salesforce report before
 * writing its transform() function in report-map.js.
 *
 * Usage:
 *   cd scripts
 *   node inspect-report.js <REPORT_ID>
 *
 * Output: prints columns, groupings, aggregates, and the first 5 rows.
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createSign } from "crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Load .env ────────────────────────────────────────────────────────────────
try {
  const { default: dotenv } = await import("dotenv");
  dotenv.config({ path: resolve(__dirname, "../.env") });
} catch {
  try {
    const raw = readFileSync(resolve(__dirname, "../.env"), "utf8");
    for (const line of raw.split("\n")) {
      const [key, ...rest] = line.split("=");
      if (key && !key.startsWith("#") && rest.length)
        process.env[key.trim()] = rest.join("=").trim();
    }
  } catch { /* no .env */ }
}

const {
  SF_LOGIN_URL        = "https://login.salesforce.com",
  SF_USERNAME,
  SF_CLIENT_ID,
  SF_PRIVATE_KEY_PATH = "./server.key",
} = process.env;

function base64url(str) {
  return Buffer.from(str).toString("base64")
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function buildJWT(clientId, username, loginUrl, privateKey) {
  const header  = base64url(JSON.stringify({ alg: "RS256" }));
  const now     = Math.floor(Date.now() / 1000);
  const payload = base64url(JSON.stringify({ iss: clientId, sub: username, aud: loginUrl, exp: now + 300 }));
  const signingInput = `${header}.${payload}`;
  const sign = createSign("RSA-SHA256");
  sign.update(signingInput);
  const sig = sign.sign(privateKey, "base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  return `${signingInput}.${sig}`;
}

const REPORT_ID = process.argv[2];

if (!REPORT_ID) {
  console.error("Usage: node inspect-report.js <REPORT_ID>");
  process.exit(1);
}

// ─── Auth (JWT Bearer Flow) ───────────────────────────────────────────────────
async function authenticate() {
  const keyPath = resolve(__dirname, SF_PRIVATE_KEY_PATH);
  const privateKey = readFileSync(keyPath, "utf8");
  const jwt = buildJWT(SF_CLIENT_ID, SF_USERNAME, SF_LOGIN_URL, privateKey);

  const res = await fetch(`${SF_LOGIN_URL}/services/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion:  jwt,
    }),
  });
  if (!res.ok) throw new Error(`Auth failed: ${await res.text()}`);
  const { access_token, instance_url } = await res.json();
  return { accessToken: access_token, instanceUrl: instance_url };
}

// ─── Inspect ──────────────────────────────────────────────────────────────────
async function inspect() {
  console.log(`Inspecting report: ${REPORT_ID}\n`);
  const { accessToken, instanceUrl } = await authenticate();

  const res = await fetch(
    `${instanceUrl}/services/data/v59.0/analytics/reports/${REPORT_ID}?includeDetails=true`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) throw new Error(`Fetch failed: ${await res.text()}`);
  const report = await res.json();

  const meta = report.reportMetadata;
  console.log("═".repeat(60));
  console.log(`Report name  : ${meta?.name}`);
  console.log(`Report format: ${meta?.reportFormat}`);
  console.log("═".repeat(60));

  // Columns
  const colInfo = report.reportExtendedMetadata?.detailColumnInfo ?? {};
  const cols = Object.entries(colInfo);
  console.log(`\n📋 COLUMNS (${cols.length})`);
  cols.forEach(([apiName, info], i) => {
    console.log(`  [${i}] ${apiName.padEnd(40)} ${info.label}`);
  });

  // Aggregates
  const aggInfo = report.reportExtendedMetadata?.aggregateColumnInfo ?? {};
  const aggs = Object.entries(aggInfo);
  if (aggs.length) {
    console.log(`\n📊 AGGREGATES (${aggs.length})`);
    aggs.forEach(([apiName, info], i) => {
      console.log(`  [${i}] ${apiName.padEnd(40)} ${info.label}`);
    });
  }

  // Groupings
  const groupingsDown = report.groupingsDown?.groupings ?? [];
  if (groupingsDown.length) {
    console.log(`\n📁 GROUPINGS (row)`);
    groupingsDown.forEach((g, i) => {
      console.log(`  [${i}] key="${i}!T"  label="${g.label}"  value="${g.value}"`);
    });
  }

  // Grand total
  const grandTotal = report.factMap?.["T!T"];
  if (grandTotal) {
    console.log(`\n🔢 GRAND TOTAL aggregates`);
    (grandTotal.aggregates ?? []).forEach((a, i) => {
      console.log(`  [${i}] label="${a.label}"  value=${JSON.stringify(a.value)}`);
    });
  }

  // First 5 data rows
  const rows = report.factMap?.["T!T"]?.rows ?? [];
  if (rows.length) {
    console.log(`\n📄 FIRST ${Math.min(rows.length, 5)} ROWS (of ${rows.length} total)`);
    rows.slice(0, 5).forEach((row, ri) => {
      console.log(`  Row ${ri}:`);
      row.dataCells.forEach((cell, ci) => {
        const colName = cols[ci]?.[0] ?? `col${ci}`;
        console.log(`    [${ci}] ${colName.padEnd(38)} ${JSON.stringify(cell.value)}`);
      });
    });
  }

  // Summary grouping fact map keys
  const factKeys = Object.keys(report.factMap ?? {}).filter(k => k !== "T!T");
  if (factKeys.length) {
    console.log(`\n🗂  FACT MAP KEYS (summary groups): ${factKeys.join(", ")}`);
    factKeys.forEach(key => {
      const entry = report.factMap[key];
      const aggs = (entry.aggregates ?? []).map((a, i) => `[${i}]=${JSON.stringify(a.value)}`).join("  ");
      console.log(`  ${key.padEnd(8)} aggregates: ${aggs}`);
    });
  }

  console.log("\n" + "═".repeat(60));
  console.log("Use the column API names and fact map keys above in report-map.js");
}

inspect().catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});

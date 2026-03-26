/**
 * Verificación genérica de informes v2 (datos embebidos en #report-data-json).
 * Uso: node reports/verifySyntheticReport_v2.mjs [ruta/al/informe.html]
 * Por defecto: reports/2026-03-23_chatbot-vtex-finalonboarding.html
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const defaultHtml = path.join(__dirname, "2026-03-23_chatbot-vtex-finalonboarding.html");
const htmlPath = path.resolve(process.argv[2] || defaultHtml);

const html = fs.readFileSync(htmlPath, "utf8");
const m = html.match(/<script type="application\/json" id="report-data-json">([\s\S]*?)<\/script>/);
if (!m) {
  console.error("[FAIL] No se encontró #report-data-json en:", htmlPath);
  process.exit(1);
}

let d;
try {
  d = JSON.parse(m[1]);
} catch (e) {
  console.error("[FAIL] JSON inválido en report-data-json:", e.message);
  process.exit(1);
}

function severityCounts(findings) {
  const o = { CRITICO: 0, ALTO: 0, MEDIO: 0, BAJO: 0 };
  for (const f of findings) {
    if (o[f.severity] !== undefined) o[f.severity]++;
  }
  return o;
}

const meta = d.meta || {};
const charts = d.charts || {};
const findings = d.findings || [];
const cohort = d.cohort || [];

const comp = charts.completaron || [];
const aband = charts.abandonaron || [];
const roles = charts.roles || [];
const n = meta.cohortSize;

const sumComp = comp.reduce((a, b) => a + b, 0);
const sumAband = aband.reduce((a, b) => a + b, 0);
const sc = severityCounts(findings);
const donutSum = sc.CRITICO + sc.ALTO + sc.MEDIO + sc.BAJO;

const checks = [
  ["Archivo", true, htmlPath],
  ["meta.cohortSize definido", typeof n === "number" && n > 0, String(n)],
  ["Σ completaron + Σ abandonaron = cohorte", sumComp + sumAband === n, `${sumComp}+${sumAband} vs ${n}`],
  ["charts.roles alineado con arrays", roles.length === comp.length && comp.length === aband.length, `${roles.length} roles`],
  ["findings.length", findings.length > 0, String(findings.length)],
  ["Donut Σ severidades = findings.length", donutSum === findings.length, `${donutSum} vs ${findings.length}`],
  ["Cohorte: filas = cohortSize (si hay tabla)", cohort.length === 0 || cohort.length === n, `${cohort.length} filas`],
];

let failed = false;
for (const [name, ok, detail] of checks) {
  const status = ok ? "OK" : "FAIL";
  console.log(`[${status}] ${name}${!ok ? ` → ${detail}` : ok && detail && name === "Archivo" ? ` → ${detail}` : ""}`);
  if (!ok) failed = true;
}

process.exit(failed ? 1 : 0);

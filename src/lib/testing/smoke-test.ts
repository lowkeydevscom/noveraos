import { env } from "../env";
import { logger } from "../logger";
import { sentryServerConfig } from "../../../sentry.server.config";

export async function runSmokeTests() {
  console.log("=========================================");
  console.log("  NOVERAOS STAGING INFRASTRUCTURE SMOKE TEST");
  console.log("=========================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}${detail ? ` - ${detail}` : ""}`);
      failed++;
    }
  }

  // 1. Environment Variable Validation Test
  try {
    assert(typeof env.DATABASE_URL === "string" && env.DATABASE_URL.length > 0, "Env Var: DATABASE_URL exists");
    assert(typeof env.AUTH_SECRET === "string" && env.AUTH_SECRET.length > 0, "Env Var: AUTH_SECRET exists");
    assert(typeof env.ALLOWED_BETA_EMAILS === "string", "Env Var: ALLOWED_BETA_EMAILS exists");
  } catch (err) {
    assert(false, "Env Var Validation", String(err));
  }

  // 2. Structured JSON Logger Test
  try {
    logger.info("SMOKE_TEST_LOG_EVENT", { status: "OK", component: "smoke-test" });
    assert(true, "Structured Logging Engine");
  } catch (err) {
    assert(false, "Structured Logging Engine", String(err));
  }

  // 3. Sentry Monitoring Config Test
  try {
    assert(typeof sentryServerConfig === "object", "Sentry Monitoring: Server Config Object");
    assert(sentryServerConfig.tracesSampleRate === 1.0, "Sentry Monitoring: Tracing Sample Rate");
  } catch (err) {
    assert(false, "Sentry Monitoring Config", String(err));
  }

  // 4. Private Beta Cohort Whitelist Check
  try {
    const allowedEmails = env.ALLOWED_BETA_EMAILS.split(",").map((e) => e.trim().toLowerCase());
    const isDemoAllowed = allowedEmails.includes("demo@noveraos.local") || allowedEmails.includes("*");
    const isRandomBlocked = !allowedEmails.includes("unauthorized_stranger_99@gmail.com") && !allowedEmails.includes("*");

    assert(isDemoAllowed, "Beta Cohort Auth: Whitelisted Email Access Granted");
    assert(isRandomBlocked, "Beta Cohort Auth: Non-Whitelisted Access Blocked");
  } catch (err) {
    assert(false, "Beta Cohort Authorization Check", String(err));
  }

  console.log("\n-----------------------------------------");
  console.log(`SMOKE TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("-----------------------------------------\n");

  if (failed > 0) {
    process.exit(1);
  }
}

// Execute directly when run as script
if (require.main === module) {
  runSmokeTests();
}

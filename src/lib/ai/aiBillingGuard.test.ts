import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

/**
 * Guard: Backfeed's AI triage is Posture C (AI included in the tier up to an
 * allowance the Synapse gateway enforces under appId "backfeed"). Cost to
 * credits, the allowance, and the ledger all live in the gateway and Aether,
 * so Backfeed must carry none of them, must expose no credit wallet, and must
 * never reach a model with a shared, static, or raw provider key
 */

const SRC = join(import.meta.dir, "..", "..");

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      return name === "generated" ? [] : sourceFiles(path);
    }
    return path.endsWith(".ts") && !path.endsWith(".test.ts") ? [path] : [];
  });

const files = sourceFiles(SRC).map((path) => ({
  path: relative(SRC, path),
  text: readFileSync(path, "utf8"),
}));

const offenders = (pattern: RegExp) =>
  files.filter((f) => pattern.test(f.text)).map((f) => f.path);

describe("AI billing guard (Posture C)", () => {
  test("no shared, static, or raw provider key", () => {
    expect(
      offenders(
        /EMBEDDING_API_KEY|EMBEDDING_API_URL|SYNAPSE_API_KEY|OPENAI_API_KEY|ANTHROPIC_API_KEY|api\.openai\.com/,
      ),
    ).toEqual([]);
  });

  test("no local markup, credit math, or per-model rate table", () => {
    expect(
      offenders(
        /creditsFromCostCents|estimateSynapseCostCents|DEFAULT_CREDIT_COGS_MARKUP|CENTS_PER_CREDIT|CentsPerMTok|costCents/,
      ),
    ).toEqual([]);
  });

  test("no local AI credit ledger or exposed wallet", () => {
    expect(
      offenders(
        /getCreditBalance|creditsFromBalanceUsd|deductCredits|addCredits|aiCredit|ai_credit|creditLedger|creditBalance/,
      ),
    ).toEqual([]);
  });

  test("the only provisioner is product-scoped to backfeed", () => {
    const provisioners = files.filter((f) =>
      /createSynapseProvisioner\(/.test(f.text),
    );
    expect(provisioners.map((f) => f.path)).toEqual(["lib/ai/synapse.ts"]);

    const [synapse] = provisioners;
    expect(synapse?.text).toContain("appId: BACKFEED_APP_ID");
    expect(synapse?.text).toContain('const BACKFEED_APP_ID = "backfeed";');
  });

  test("the embedding model is reached through the gateway", () => {
    const [embedding] = files.filter(
      (f) => f.path === "lib/feedback/embedding.ts",
    );
    expect(embedding?.text).toContain("/v1/embeddings");
    expect(embedding?.text).toContain('"openai/text-embedding-3-small"');
  });
});

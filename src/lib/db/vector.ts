/**
 * Embedding vector configuration shared by the schema and the feedback brain.
 *
 * The dimension must match whatever embedding provider is configured (see
 * `lib/feedback/embedding`). 1536 is the common hosted-embedding size (e.g. an
 * OpenAI-compatible model); changing it is a deliberate one-line edit plus a
 * migration. Columns are nullable, so this default is cheap until a provider is
 * actually wired.
 */
export const EMBEDDING_DIMENSIONS = 1536;

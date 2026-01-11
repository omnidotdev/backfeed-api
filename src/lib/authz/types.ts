/**
 * Authorization types for Backfeed.
 */

/** Role types matching the member table */
export type Role = "owner" | "admin" | "member";

/** Tuple key for authorization store */
export interface TupleKey {
  user: string;
  relation: string;
  object: string;
}

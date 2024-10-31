import { pgTable, uuid } from "drizzle-orm/pg-core";
import { users } from "./user.table";
import { organizations } from "./organization.table";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";

/**
 * Users to organizations join table.
 */
export const usersToOrganizations = pgTable("user_organization", {
  userId: uuid()
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  organizationId: uuid()
    .notNull()
    .references(() => organizations.id, {
      onDelete: "cascade",
    }),
});

export const usersToOrganizationsRelations = relations(
  usersToOrganizations,
  ({ one }) => ({
    user: one(users, {
      fields: [usersToOrganizations.userId],
      references: [users.id],
    }),
    organization: one(organizations, {
      fields: [usersToOrganizations.organizationId],
      references: [organizations.id],
    }),
  }),
);

/**
 * Type helpers related to the users to organizations join table.
 */
export type InsertUserToOrganization = InferInsertModel<
  typeof usersToOrganizations
>;
export type SelectUserToOrganization = InferSelectModel<
  typeof usersToOrganizations
>;

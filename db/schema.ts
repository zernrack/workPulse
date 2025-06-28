import {
  pgTable,
  boolean,
  text,
  varchar,
  timestamp,
  uuid,
  pgEnum,
  pgSchema,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

// Use a more descriptive enum name and add more roles for future scalability
export const userRoleEnum = pgEnum("user_role", [
  "user",
  "admin",
  "superadmin",
]);

const authSchema = pgSchema("auth");

export const users = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const tasks = pgTable("tasks", {
  id: uuid("taskId").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => accounts.id).notNull(),
  task_name: varchar("task_name", { length: 50 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isComplete: boolean().default(false).notNull(),
}).enableRLS();

export const accounts = pgTable("profiles", {
  id: uuid("user_id").primaryKey().references(() => users.id).notNull(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  userName: varchar("user_name", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  role: userRoleEnum().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isActive: boolean("is_active").default(true).notNull(),
}).enableRLS();

/* ---------- one‑to‑many helpers ---------- */
export const usersRelations = relations(accounts, ({ many }) => ({
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(accounts, {
    fields:      [tasks.userId],
    references:  [accounts.id],
  }),
}));

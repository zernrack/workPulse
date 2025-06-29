import {
  pgTable,
  boolean,
  text,
  varchar,
  timestamp,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

// Use a more descriptive enum name and add more roles for future scalability
export const userRoleEnum = pgEnum("user_role", [
  "user",
  "admin",
  "superadmin",
]);


export const tasks = pgTable("tasks", {
  id: uuid("taskId").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => accounts.id).notNull(),
  task_name: varchar("task_name", { length: 50 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isComplete: boolean("is_complete").default(false).notNull(),
}).enableRLS();

export const accounts = pgTable("profiles", {
  id: uuid("user_id").primaryKey(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  userName: varchar("user_name", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  role: userRoleEnum().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isActive: boolean("is_active").default(true).notNull(),
}).enableRLS();

export const checkIns = pgTable("check_ins", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => accounts.id).notNull(),
  clockIn: timestamp("clock_in").notNull(),
  clockOut: timestamp("clock_out"),
  date: timestamp("date_today").defaultNow().notNull(),
}).enableRLS();


/* Relationship Queries  */

/* ---------- one‑to‑many helpers ---------- */
export const usersRelations = relations(accounts, ({ many }) => ({
  tasks: many(tasks),
  // checkIns: many(checkIns),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(accounts, {
    fields:      [tasks.userId],
    references:  [accounts.id],
  }),
}));

export const checkInsRelations = relations(checkIns, ({ one }) => ({
  user: one(accounts, {
    fields:      [checkIns.userId],
    references:  [accounts.id],
  }),
}));


import { pgTable, boolean, text, varchar, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";

// Use a more descriptive enum name and add more roles for future scalability
export const userRoleEnum =  pgEnum("user_role", ["user", "admin", "superadmin"]);

export const tasks = pgTable("tasks", {
  id: uuid("taskId").primaryKey().defaultRandom(),
  task_name: varchar("task_name", { length: 50 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isComplete: boolean().default(false).notNull(),
});

export const users = pgTable("users", {
  id: uuid("userId").primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  userName: varchar("user_name", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: userRoleEnum().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isActive: boolean("is_active").default(true).notNull(),
});
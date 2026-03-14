import { pgTable, boolean, text, varchar, timestamp, uuid } from "drizzle-orm/pg-core";
import { accounts } from "./accounts";

export const tasks = pgTable("tasks", {
  id: uuid("taskId").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => accounts.id).notNull(),
  task_name: varchar("task_name", { length: 50 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isComplete: boolean("is_complete").default(false).notNull(),
}).enableRLS();
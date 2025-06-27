import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const tasks = pgTable("users", {
  id: serial("id").primaryKey(),
  task_name: varchar("task_name", { length: 50 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

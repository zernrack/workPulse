import { relations } from "drizzle-orm";
import { accounts } from "./accounts";
import { tasks } from "./tasks";
import { checkIns } from "./check-ins";

export const usersRelations = relations(accounts, ({ many }) => ({
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(accounts, {
    fields: [tasks.userId],
    references: [accounts.id],
  }),
}));

export const checkInsRelations = relations(checkIns, ({ one }) => ({
  user: one(accounts, {
    fields: [checkIns.userId],
    references: [accounts.id],
  }),
}));
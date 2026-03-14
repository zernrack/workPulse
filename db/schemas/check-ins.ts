import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { accounts } from "./accounts";

export const checkIns = pgTable("check_ins", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => accounts.id).notNull(),
  clockIn: timestamp("clock_in").notNull(),
  clockOut: timestamp("clock_out"),
  date: timestamp("date_today").defaultNow().notNull(),
}).enableRLS();
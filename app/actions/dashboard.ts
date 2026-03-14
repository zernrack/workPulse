"use server";

import { actionClient } from "@/lib/safe-actions";
import { db } from "@/lib/db";
import { accounts, checkIns, tasks } from "@/db/schemas";
import { createClient } from "@/utils/supabase/server";
import { and, desc, eq, isNull } from "drizzle-orm";

async function getCurrentUserId() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || !userId) {
    throw new Error("You must be logged in to perform this action");
  }

  return userId;
}

export const getDashboardBootstrapAction = actionClient.action(async () => {
  const userId = await getCurrentUserId();

  const [userProfile] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.id, userId))
    .limit(1);

  if (!userProfile) {
    throw new Error("User profile not found");
  }

  const [activeCheckIn] = await db
    .select()
    .from(checkIns)
    .where(and(eq(checkIns.userId, userId), isNull(checkIns.clockOut)))
    .orderBy(desc(checkIns.clockIn))
    .limit(1);

  const userTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, userId))
    .orderBy(tasks.createdAt);

  return {
    success: true,
    user: userProfile,
    tasks: userTasks,
    activeCheckIn: activeCheckIn ?? null,
  };
});
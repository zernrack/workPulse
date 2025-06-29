"use server"

import { actionClient } from "@/lib/safe-actions";
import { db } from "@/lib/db";
import { checkIns } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";
import { log } from "console";
import { eq, and, isNull, desc, gte, lt } from "drizzle-orm";


// Helper function to get current user
async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error("You must be logged in to perform this action");
  }
  
  return user;
}

export const timeInAction = actionClient
    .action(async () => {
        try {
            const user = await getCurrentUser()

            const [newRecord] = await db.insert(checkIns).values({
                userId: user.id,
                clockIn: new Date(),
            }).returning();

            return {success: true, record: newRecord}
        } catch (error) {
            log("Error Clock in: ", error)
            const message = error instanceof Error ? error.message : "Failed to clock in";
            throw new Error(message);
        }
    })

export const timeOutAction = actionClient
    .action(async () => {
        try {
            const user = await getCurrentUser();

            // Get the most recent check-in record that hasn't been clocked out
            const [latestCheckIn] = await db
                .select()
                .from(checkIns)
                .where(and(eq(checkIns.userId, user.id), isNull(checkIns.clockOut)))
                .orderBy(desc(checkIns.clockIn))
                .limit(1);

            if (!latestCheckIn) {
                throw new Error("No active clock-in found. Please clock in first.");
            }

            // Update the record with clock-out time
            const [updatedRecord] = await db
                .update(checkIns)
                .set({
                    clockOut: new Date(),
                })
                .where(eq(checkIns.id, latestCheckIn.id))
                .returning();

            return { success: true, record: updatedRecord };
        } catch (error) {
            log("Error Clock out: ", error);
            const message = error instanceof Error ? error.message : "Failed to clock out";
            throw new Error(message);
        }
    })

export const getTodayTimeRecords = actionClient
    .action(async () => {
        try {
            const user = await getCurrentUser();
            
            // Get today's date range
            const today = new Date();
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

            const records = await db
                .select()
                .from(checkIns)
                .where(
                    and(
                        eq(checkIns.userId, user.id),
                        gte(checkIns.date, startOfDay),
                        lt(checkIns.date, endOfDay)
                    )
                )
                .orderBy(desc(checkIns.clockIn));

            return { success: true, records };
        } catch (error) {
            log("Error getting today's records: ", error);
            const message = error instanceof Error ? error.message : "Failed to get time records";
            throw new Error(message);
        }
    })
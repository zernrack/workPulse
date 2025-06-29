import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkIns } from "@/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json(
        { error: "You must be logged in to access this resource" }, 
        { status: 401 }
      );
    }
    
    // Get the most recent check-in record that hasn't been clocked out
    const [activeCheckIn] = await db
      .select()
      .from(checkIns)
      .where(and(eq(checkIns.userId, user.id), isNull(checkIns.clockOut)))
      .orderBy(desc(checkIns.clockIn))
      .limit(1);

    return NextResponse.json({
      isActive: !!activeCheckIn,
      checkIn: activeCheckIn ? {
        id: activeCheckIn.id,
        clockIn: activeCheckIn.clockIn,
        date: activeCheckIn.date,
      } : null
    });
  } catch (error) {
    console.error("Error checking clock-in status:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

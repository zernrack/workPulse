import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { accounts } from "@/db/schema";
import { eq } from "drizzle-orm";
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
    
    // Get user profile from database
    const [userProfile] = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, user.id));

    if (!userProfile) {
      return NextResponse.json(
        { error: "User profile not found" }, 
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: userProfile.id,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      userName: userProfile.userName,
      email: userProfile.email,
      role: userProfile.role,
      createdAt: userProfile.createdAt,
      isActive: userProfile.isActive,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

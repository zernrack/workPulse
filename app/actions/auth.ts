"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { actionClient } from "@/lib/safe-actions";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain a special character"),
});

const registerSchema = authSchema
  .extend({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    userName: z.string().min(1, "Username is required"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match!",
    path: ["confirmPassword"], // This will attach the error to confirmPassword field
  });



  // TODO: MAKE A FILE FOR ERROR HANDLING AND ADD IT TO MIDDLEWARE
/**
 * Handles user login using Supabase authentication.
 *
 * This action validates the input using `authSchema`, attempts to sign in the user
 * with the provided email and password, and handles various authentication errors
 * with user-friendly messages. On successful login, it revalidates the root layout
 * and redirects to the home page.
 *
 * Error handling includes:
 * - Invalid credentials
 * - Unconfirmed email
 * - Too many login attempts
 * - Disabled signups
 * - Other generic authentication failures
 *
 * @throws {Error} If authentication fails, throws an error with a descriptive message.
 */
export const loginAction = actionClient
  .inputSchema(authSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    console.log("[LOGIN] Attempting login for:", parsedInput.email);

    const { error } = await supabase.auth.signInWithPassword({
      email: parsedInput.email,
      password: parsedInput.password,
    });

    if (error) {
      console.error("[LOGIN] Supabase signInWithPassword error:", error);
      
      // Handle specific auth errors using error codes
      switch (error.code) {
        case 'invalid_credentials':
          throw new Error("Invalid email or password. Please check your credentials and try again.");
        
        case 'email_not_confirmed':
          throw new Error("Please check your email and click the confirmation link before logging in.");
        
        case 'too_many_requests':
          throw new Error("Too many login attempts. Please wait a moment before trying again.");
        
        case 'signups_disabled':
          throw new Error("New signups are currently disabled. Please contact support.");
        
        default:
          // Fallback to message-based matching for other cases
          if (error.message?.includes('Invalid login credentials')) {
            throw new Error("Invalid email or password. Please check your credentials and try again.");
          }
          
          if (error.message?.includes('Email not confirmed')) {
            throw new Error("Please check your email and click the confirmation link before logging in.");
          }
          
          // Default fallback
          throw new Error("Login failed. Please try again or contact support if the problem persists.");
      }
    }

    console.log("[LOGIN] Login successful for:", parsedInput.email);

    revalidatePath("/", "layout");
    redirect("/home");
  });

/**
 * Handles user signup by creating a new authentication user in Supabase and inserting a corresponding profile record.
 *
 * - Validates input using `registerSchema`.
 * - Attempts to create a new user in Supabase Auth with the provided email, password, and user metadata.
 * - Handles and throws descriptive errors for common signup issues (e.g., duplicate email, database errors).
 * - If authentication succeeds, inserts a new profile record into the `profiles` table.
 * - Logs relevant information and errors for debugging purposes.
 * - On success, revalidates the root layout and redirects to the home page.
 *
 * @throws {Error} If signup fails due to duplicate email, database issues, or other authentication errors.
 */
export const signupAction = actionClient
  .inputSchema(registerSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    console.log("[SIGNUP] Received signup data for:", parsedInput.email);

    // Create the auth user - Supabase will handle duplicates detection
    const { data: signUpData, error: authError } = await supabase.auth.signUp({
      email: parsedInput.email,
      password: parsedInput.password,
      options: {
        data: {
          first_name: parsedInput.firstName,
          last_name: parsedInput.lastName,
          user_name: parsedInput.userName,
        },
      },
    });

    console.log("[SIGNUP] Supabase Auth user metadata:", {
      first_name: parsedInput.firstName,
      last_name: parsedInput.lastName,
      user_name: parsedInput.userName,
    });

    if (authError) {
      console.error("[SIGNUP] Supabase signUp error:", authError);
      
      // Handle specific auth errors
      if (authError.message?.includes('already registered') || authError.message?.includes('User already registered')) {
        throw new Error("An account with this email already exists");
      }
      
      if (authError.message?.includes('Database error saving new user')) {
        throw new Error("There was an issue creating your account. Please try again or contact support.");
      }
      
      throw new Error(authError.message || "Signup failed");
    }

    if (!signUpData.user) {
      throw new Error("Failed to create user account");
    }

    console.log("[SIGNUP] Supabase Auth signup successful for:", signUpData.user.email);

    revalidatePath("/", "layout");
    redirect("/home");
  });

export async function logout() {
  const supabase = await createClient();
  console.log("[LOGOUT] Logging out user");
  await supabase.auth.signOut();
  redirect("/login");
}
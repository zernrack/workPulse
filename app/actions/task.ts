"use server";

import { z } from "zod";
import { actionClient } from "@/lib/safe-actions";
import { db } from "@/lib/db";
import { tasks } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const createTaskSchema = z.object({
  task_name: z.string().min(1, "Task name is required"),
  description: z.string().optional(),
});

const editTaskSchema = z.object({
  taskId: z.string().uuid(),
  task_name: z.string().min(1, "Task name is required").optional(),
  description: z.string().optional(),
});

const deleteTaskSchema = z.object({
  taskId: z.string().uuid(),
});

const toggleTaskSchema = z.object({
  taskId: z.string().uuid(),
});

// Helper function to get current user
async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error("You must be logged in to perform this action");
  }
  
  return user;
}

export const createTaskAction = actionClient
  .inputSchema(createTaskSchema)
  .action(async ({ parsedInput: { task_name, description } }) => {
    try {
      const user = await getCurrentUser();
      
      const [newTask] = await db.insert(tasks).values({
        userId: user.id,
        task_name,
        description: description || "",
        createdAt: new Date(),
        updatedAt: new Date(),
        isComplete: false,
      }).returning();

      revalidatePath("/home");
      return { success: true, task: newTask };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create task";
      throw new Error(message);
    }
  });

export const getAllTasksAction = actionClient.action(async () => {
  try {
    const user = await getCurrentUser();
    
    const userTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, user.id))
      .orderBy(tasks.createdAt);

    return { success: true, tasks: userTasks };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch tasks";
    throw new Error(message);
  }
});

export const editTaskAction = actionClient
  .inputSchema(editTaskSchema)
  .action(async ({ parsedInput: { taskId, task_name, description } }) => {
    try {
      const user = await getCurrentUser();
      
      const updateData: {
        updatedAt: Date;
        task_name?: string;
        description?: string;
      } = {
        updatedAt: new Date(),
      };
      
      if (task_name !== undefined) updateData.task_name = task_name;
      if (description !== undefined) updateData.description = description;

      const [updatedTask] = await db
        .update(tasks)
        .set(updateData)
        .where(and(eq(tasks.id, taskId), eq(tasks.userId, user.id)))
        .returning();

      if (!updatedTask) {
        throw new Error("Task not found or you don't have permission to edit it");
      }

      revalidatePath("/home");
      return { success: true, task: updatedTask };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update task";
      throw new Error(message);
    }
  });

export const deleteTaskAction = actionClient
  .inputSchema(deleteTaskSchema)
  .action(async ({ parsedInput: { taskId } }) => {
    try {
      const user = await getCurrentUser();
      
      const [deletedTask] = await db
        .delete(tasks)
        .where(and(eq(tasks.id, taskId), eq(tasks.userId, user.id)))
        .returning();

      if (!deletedTask) {
        throw new Error("Task not found or you don't have permission to delete it");
      }

      revalidatePath("/home");
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete task";
      throw new Error(message);
    }
  });

export const toggleTaskAction = actionClient
  .inputSchema(toggleTaskSchema)
  .action(async ({ parsedInput: { taskId } }) => {
    try {
      const user = await getCurrentUser();
      
      // First get the current task to toggle its completion status
      const [currentTask] = await db
        .select()
        .from(tasks)
        .where(and(eq(tasks.id, taskId), eq(tasks.userId, user.id)));

      if (!currentTask) {
        throw new Error("Task not found or you don't have permission to modify it");
      }

      const [updatedTask] = await db
        .update(tasks)
        .set({
          isComplete: !currentTask.isComplete,
          updatedAt: new Date(),
        })
        .where(and(eq(tasks.id, taskId), eq(tasks.userId, user.id)))
        .returning();

      revalidatePath("/home");
      return { success: true, task: updatedTask };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to toggle task";
      throw new Error(message);
    }
  });

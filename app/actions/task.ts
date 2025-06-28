"use server";

import { object, z } from "zod";
import { actionClient } from "@/lib/safe-actions";
import { db } from "@/lib/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";

const taskSchema = z.object({
  taskId: z.string().uuid().readonly(),
  task_name: z.string().min(2),
  description: z.string().min(10),
  createdAt: z.string().datetime(),
});

const editTaskSchema = z.object({
  taskId: z.string().uuid(),
  task_name: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  updatedAt: z.string().datetime(),
});

export const createTask = actionClient
  .inputSchema(taskSchema)
  .action(async ({ parsedInput: { task_name, description, createdAt } }) => {
    try {
      await db.insert(tasks).values({
        task_name,
        description,
        createdAt: new Date(createdAt),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(message);
    }
  });

export const getAllTasks = actionClient.action(async () => {
  await db.select().from(tasks);
});

export const editTask = actionClient
  .inputSchema(editTaskSchema)
  .action(
    async ({ parsedInput: { taskId, task_name, description, updatedAt } }) => {
      try {
        await db
          .update(tasks)
          .set({
            task_name,
            description,
            updatedAt: new Date(updatedAt),
          })
          .where(eq(tasks.id, taskId));
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(message);
      }
    }
  );

export const deleteTask = actionClient
  .inputSchema(
    object({
      taskId: z.string().uuid(),
    })
  )
  .action(async ({ parsedInput: { taskId } }) => {
    try {
      await db.delete(tasks).where(eq(tasks.id, taskId));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(message);
    }
  });

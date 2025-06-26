'use server'

import { z } from "zod";
import { actionClient } from "@/lib/safe-actions";

const taskSchema = z.object({
    title: z.string().min(2),
    description: z.string().min(10),
    createdAt: z.string().datetime(),

})

export const createTask = actionClient
    .inputSchema(taskSchema)
    .action(async ( {clientInput: {title, description, createdAt}}) => {
        return null
    })
}
export interface DbTask {
  id: string;
  userId: string;
  task_name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  isComplete: boolean;
}
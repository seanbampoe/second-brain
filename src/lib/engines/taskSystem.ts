import { Task, TaskStatus } from "../types";

export function createTask(
  title: string,
  moduleId: string | null = null,
  deadline: string | null = null,
  estimatedMinutes: number | null = null
): Task {
  return {
    id: crypto.randomUUID(),
    moduleId,
    title,
    deadline,
    status: "todo",
    estimatedMinutes,
  };
}

export function markTaskStatus(tasks: Task[], taskId: string, status: TaskStatus): Task[] {
  return tasks.map((t) => (t.id === taskId ? { ...t, status } : t));
}

export function getOpenTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => t.status !== "done");
}

export function getOverdueTasks(tasks: Task[], today: string): Task[] {
  return getOpenTasks(tasks).filter((t) => t.deadline !== null && t.deadline < today);
}

/**
 * Days until deadline, negative if overdue. Returns null if no deadline set —
 * the Scheduling Engine will need to handle that case (freeform tasks with
 * no deadline shouldn't dominate urgency scoring, but also shouldn't vanish).
 */
export function daysUntilDeadline(task: Task, today: string): number | null {
  if (task.deadline === null) return null;
  const deadlineDate = new Date(task.deadline);
  const todayDate = new Date(today);
  const diffMs = deadlineDate.getTime() - todayDate.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}
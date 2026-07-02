import { Task } from "./types";

export const seedTasks: Task[] = [
  { id: "t1", moduleId: "eai320", title: "Review Bayesian inference methods", deadline: "2026-07-08", status: "todo", estimatedMinutes: 90 },
  { id: "t2", moduleId: "emk310", title: "Finish MARV UART menu debugging", deadline: "2026-07-04", status: "in-progress", estimatedMinutes: null },
  { id: "t3", moduleId: null, title: "Email lecturer about EME 310 grading query", deadline: null, status: "todo", estimatedMinutes: null },
  { id: "t4", moduleId: "ene310", title: "Redo Bode plot analysis practice problems", deadline: "2026-07-15", status: "todo", estimatedMinutes: 60 },
];
import { Assessment } from "./types";

// Realistic-shaped placeholder data — replace with your actual marks as you get them
export const seedAssessments: Assessment[] = [
  { id: "eai320-t1", moduleId: "eai320", name: "Test 1", type: "test", weight: 0.15, currentMark: 68 },
  { id: "eai320-a1", moduleId: "eai320", name: "Practical 4 (RPS)", type: "practical", weight: 0.10, currentMark: 74 },
  { id: "eai320-exam", moduleId: "eai320", name: "Final Exam", type: "exam", weight: 0.50, currentMark: null },

  { id: "emk310-p1", moduleId: "emk310", name: "Practical 1", type: "practical", weight: 0.10, currentMark: 82 },
  { id: "emk310-p2", moduleId: "emk310", name: "Practical 2", type: "practical", weight: 0.10, currentMark: 79 },
  { id: "emk310-p3", moduleId: "emk310", name: "Practical 3 (MARV)", type: "practical", weight: 0.15, currentMark: 71 },
  { id: "emk310-exam", moduleId: "emk310", name: "Final Exam", type: "exam", weight: 0.45, currentMark: null },
];
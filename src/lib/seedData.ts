import { Module } from "./types";

// Flat "balanced" curve as a starting point — you'll tune these per module
// once you know each course's actual assessment schedule.
const balancedCurve = (weeks: number) => Array(weeks).fill(1 / weeks);

export const seedModules: Module[] = [
  {
    id: "bss310",
    code: "BSS 310",
    name: "Engineering Management",
    currentStatus: "On track",
    riskLevel: "Low",
    learningType: "theory-based",
    workload: { totalHoursPerSemester: 90, distributionType: "theory-heavy", workloadCurve: balancedCurve(12) },
    effort: { avgFocusSessionMinutes: 45, fatigueRate: 0.3, recoveryTimeHours: 4, difficultyMultiplier: 0.9 },
  },
  {
    id: "eai320",
    code: "EAI 320",
    name: "Elements of Artificial Intelligence",
    currentStatus: "Exam prep",
    riskLevel: "Medium",
    learningType: "problem-solving",
    workload: { totalHoursPerSemester: 120, distributionType: "exam-heavy", workloadCurve: balancedCurve(12) },
    effort: { avgFocusSessionMinutes: 60, fatigueRate: 0.5, recoveryTimeHours: 6, difficultyMultiplier: 1.2 },
  },
  {
    id: "eme310",
    code: "EME 310",
    name: "Electromagnetics",
    currentStatus: "On track",
    riskLevel: "Medium",
    learningType: "theory-based",
    workload: { totalHoursPerSemester: 100, distributionType: "theory-heavy", workloadCurve: balancedCurve(12) },
    effort: { avgFocusSessionMinutes: 50, fatigueRate: 0.4, recoveryTimeHours: 5, difficultyMultiplier: 1.1 },
  },
  {
    id: "emk310",
    code: "EMK 310",
    name: "Microcontrollers",
    currentStatus: "On track",
    riskLevel: "Low",
    learningType: "coding-project",
    workload: { totalHoursPerSemester: 110, distributionType: "practical-heavy", workloadCurve: balancedCurve(12) },
    effort: { avgFocusSessionMinutes: 75, fatigueRate: 0.35, recoveryTimeHours: 4, difficultyMultiplier: 1.0 },
  },
  {
    id: "ene310",
    code: "ENE 310",
    name: "Analogue Electronics",
    currentStatus: "On track",
    riskLevel: "Medium",
    learningType: "problem-solving",
    workload: { totalHoursPerSemester: 100, distributionType: "balanced", workloadCurve: balancedCurve(12) },
    effort: { avgFocusSessionMinutes: 55, fatigueRate: 0.4, recoveryTimeHours: 5, difficultyMultiplier: 1.05 },
  },
];
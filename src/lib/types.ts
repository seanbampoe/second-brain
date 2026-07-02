export type DistributionType = "theory-heavy" | "practical-heavy" | "exam-heavy" | "balanced";
export type LearningType = "theory-based" | "problem-solving" | "coding-project";
export type RiskLevel = "Low" | "Medium" | "High";

export interface WorkloadFingerprint {
  totalHoursPerSemester: number;
  distributionType: DistributionType;
  // relative effort weight per week of the semester (e.g. 12 weeks), should sum to ~1
  workloadCurve: number[];
}

export interface EffortProfile {
  avgFocusSessionMinutes: number;   // how long a solid session on this module lasts before fatigue hits
  fatigueRate: number;              // 0–1, how fast focus degrades per session (higher = tires faster)
  recoveryTimeHours: number;        // rest needed before this module can be studied effectively again
  difficultyMultiplier: number;     // >1 = harder than average, scales time needed
}

export interface Module {
  id: string;
  code: string;         // e.g. "EMK 310"
  name: string;          // e.g. "Microcontrollers"
  currentStatus: string; // simple UI-level summary, e.g. "On track"
  riskLevel: RiskLevel;
  learningType: LearningType;
  workload: WorkloadFingerprint;
  effort: EffortProfile;
}

// Output of the Module Intelligence System, per your design doc
export interface ModuleEngineOutput {
  moduleId: string;
  currentWeekDemand: number;     // 0-1, how much this module wants attention right now
  difficultyScaling: number;      // multiplier to apply when scheduling time for this module
  recommendedSessionMinutes: number; // time-efficiency parameter
}

export type AssessmentType = "test" | "assignment" | "exam" | "practical";

export interface Assessment {
  id: string;
  moduleId: string;
  name: string;              // e.g. "Test 1", "Practical 3"
  type: AssessmentType;
  weight: number;             // as a fraction of final mark, e.g. 0.15 for 15%
  currentMark: number | null; // percentage, null if not yet written/marked
}

export interface ModulePerformance {
  moduleId: string;
  predictedFinalMark: number;      // weighted projection, 0-100
  requiredImprovementGap: number;  // target - predicted, can be negative (ahead of target)
  riskLevel: RiskLevel;
  weakestAssessmentType: AssessmentType | null;
}


export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: string;
  moduleId: string | null;      // null = general task, not tied to a specific module
  title: string;
  deadline: string | null;      // ISO date string, e.g. "2026-07-10", null = no deadline
  status: TaskStatus;
  estimatedMinutes: number | null; // optional — freeform for now, scheduler falls back to a default if missing
}
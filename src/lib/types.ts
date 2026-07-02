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
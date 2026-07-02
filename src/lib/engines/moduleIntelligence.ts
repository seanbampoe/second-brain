import { Module, ModuleEngineOutput } from "../types";

/**
 * Computes how much a module "wants" attention this week, based on where
 * we are in the semester and that module's workload curve.
 * currentWeek is 1-indexed (week 1 of the semester = 1).
 */
export function computeWeekDemand(module: Module, currentWeek: number): number {
  const curve = module.workload.workloadCurve;
  if (curve.length === 0) return 0;
  const index = Math.min(currentWeek - 1, curve.length - 1);
  return Math.max(0, Math.min(1, curve[index] ?? 0));
}

/**
 * Difficulty scaling combines the module's inherent difficulty with its
 * distribution type — exam-heavy and practical-heavy modules get scaled up
 * because underestimating them is costlier.
 */
export function computeDifficultyScaling(module: Module): number {
  const distributionBoost: Record<string, number> = {
    "exam-heavy": 1.2,
    "practical-heavy": 1.15,
    "theory-heavy": 1.0,
    "balanced": 1.0,
  };
  const boost = distributionBoost[module.workload.distributionType] ?? 1.0;
  return module.effort.difficultyMultiplier * boost;
}

/**
 * Time-efficiency parameter: the recommended single-session length for this
 * module, adjusted for its fatigue rate. High fatigue rate = shorter,
 * more frequent sessions recommended.
 */
export function computeRecommendedSessionMinutes(module: Module): number {
  const base = module.effort.avgFocusSessionMinutes;
  const fatiguePenalty = 1 - module.effort.fatigueRate * 0.4;
  return Math.round(base * Math.max(0.4, fatiguePenalty));
}

/**
 * Full engine output for one module — this is what the Scheduling Engine
 * (Phase 4) will consume later.
 */
export function runModuleEngine(module: Module, currentWeek: number): ModuleEngineOutput {
  return {
    moduleId: module.id,
    currentWeekDemand: computeWeekDemand(module, currentWeek),
    difficultyScaling: computeDifficultyScaling(module),
    recommendedSessionMinutes: computeRecommendedSessionMinutes(module),
  };
}

export function runModuleEngineForAll(modules: Module[], currentWeek: number): ModuleEngineOutput[] {
  return modules.map((m) => runModuleEngine(m, currentWeek));
}
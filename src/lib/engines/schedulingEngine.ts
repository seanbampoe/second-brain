import { Task } from "../types";
import { ModulePerformance } from "../types";
import { ModuleEngineOutput, PrioritizedTask } from "../types";
import { daysUntilDeadline } from "./taskSystem";

const WEIGHT_URGENCY = 0.4;
const WEIGHT_IMPORTANCE = 0.35;
const WEIGHT_EFFORT_PRESSURE = 0.25;

const NO_DEADLINE_BASELINE = 0.3;
const NO_MODULE_BASELINE = 0.3;
const URGENCY_HORIZON_DAYS = 14; // beyond this, urgency flattens toward its floor

function computeUrgencyScore(task: Task, today: string): number {
  const days = daysUntilDeadline(task, today);
  if (days === null) return NO_DEADLINE_BASELINE;
  if (days <= 0) return 1; // overdue or due today = max urgency
  const raw = 1 - days / URGENCY_HORIZON_DAYS;
  return Math.max(0.05, Math.min(1, raw));
}

const RISK_SCORE: Record<string, number> = { Low: 0.3, Medium: 0.6, High: 1.0 };

function computeImportanceScore(
  task: Task,
  performanceByModule: Map<string, ModulePerformance>
): number {
  if (task.moduleId === null) return NO_MODULE_BASELINE;
  const perf = performanceByModule.get(task.moduleId);
  if (!perf) return NO_MODULE_BASELINE;

  const riskComponent = RISK_SCORE[perf.riskLevel] ?? 0.5;
  // positive gap (behind target) pushes importance up; ahead of target pulls it down slightly
  const gapComponent = Math.max(0, Math.min(1, 0.5 + perf.requiredImprovementGap / 40));

  return Math.max(0, Math.min(1, riskComponent * 0.6 + gapComponent * 0.4));
}

function computeEffortPressureScore(
  task: Task,
  engineOutputByModule: Map<string, ModuleEngineOutput>
): number {
  if (task.moduleId === null) return NO_MODULE_BASELINE;
  const engineOut = engineOutputByModule.get(task.moduleId);
  if (!engineOut) return NO_MODULE_BASELINE;

  const raw = engineOut.currentWeekDemand * engineOut.difficultyScaling;
  return Math.max(0, Math.min(1, raw));
}

export function runSchedulingEngine(
  tasks: Task[],
  today: string,
  modulePerformance: ModulePerformance[],
  moduleEngineOutputs: ModuleEngineOutput[]
): PrioritizedTask[] {
  const performanceByModule = new Map(modulePerformance.map((p) => [p.moduleId, p]));
  const engineOutputByModule = new Map(moduleEngineOutputs.map((e) => [e.moduleId, e]));

  const openTasks = tasks.filter((t) => t.status !== "done");

  const scored: PrioritizedTask[] = openTasks.map((task) => {
    const urgency = computeUrgencyScore(task, today);
    const importance = computeImportanceScore(task, performanceByModule);
    const effortPressure = computeEffortPressureScore(task, engineOutputByModule);

    const score =
      urgency * WEIGHT_URGENCY +
      importance * WEIGHT_IMPORTANCE +
      effortPressure * WEIGHT_EFFORT_PRESSURE;

    return {
      taskId: task.id,
      title: task.title,
      score: Math.round(score * 1000) / 1000,
      urgencyScore: Math.round(urgency * 1000) / 1000,
      importanceScore: Math.round(importance * 1000) / 1000,
      effortPressureScore: Math.round(effortPressure * 1000) / 1000,
    };
  });

  return scored.sort((a, b) => b.score - a.score);
}
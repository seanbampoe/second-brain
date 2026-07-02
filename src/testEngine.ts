import { seedAssessments } from "./lib/seedAssessments";
import { runPerformanceEngine } from "./lib/engines/performanceTracking";

console.log(`\n--- Performance Engine Output ---`);
const moduleIds = [...new Set(seedAssessments.map((a) => a.moduleId))];
for (const moduleId of moduleIds) {
  const assessments = seedAssessments.filter((a) => a.moduleId === moduleId);
  const perf = runPerformanceEngine(moduleId, assessments);
  console.log(
    `${moduleId}\n` +
    `  predicted: ${perf.predictedFinalMark}%  gap: ${perf.requiredImprovementGap > 0 ? "+" : ""}${perf.requiredImprovementGap}  ` +
    `risk: ${perf.riskLevel}  weakest: ${perf.weakestAssessmentType ?? "n/a"}\n`
  );
}

import { seedTasks } from "./lib/seedTasks";
import { getOpenTasks, getOverdueTasks, daysUntilDeadline } from "./lib/engines/taskSystem";

const today = "2026-07-02";

console.log(`\n--- Task System Output ---`);
console.log(`Open tasks: ${getOpenTasks(seedTasks).length}`);
console.log(`Overdue tasks: ${getOverdueTasks(seedTasks, today).length}`);
for (const t of seedTasks) {
  const days = daysUntilDeadline(t, today);
  console.log(`  [${t.status}] ${t.title} — ${days === null ? "no deadline" : `${days} day(s)`}`);
}
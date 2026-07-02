import { seedModules } from "./lib/seedData";
import { runModuleEngineForAll } from "./lib/engines/moduleIntelligence";

import { seedAssessments } from "./lib/seedAssessments";
import { runPerformanceEngine } from "./lib/engines/performanceTracking";

import { seedTasks } from "./lib/seedTasks";
import { getOpenTasks, getOverdueTasks, daysUntilDeadline } from "./lib/engines/taskSystem";

import { runSchedulingEngine } from "./lib/engines/schedulingEngine";

// Shared context for this test run
const currentWeek = 6;
const today = "2026-07-02";

// --- Phase 1: Module Intelligence ---
const allModuleEngineOutputs = runModuleEngineForAll(seedModules, currentWeek);

console.log(`--- Module Engine Output (Week ${currentWeek}) ---`);
for (const r of allModuleEngineOutputs) {
  const module = seedModules.find((m) => m.id === r.moduleId);
  console.log(
    `${module?.code} (${module?.name})\n` +
    `  demand: ${r.currentWeekDemand.toFixed(2)}  ` +
    `difficulty: ${r.difficultyScaling.toFixed(2)}  ` +
    `session: ${r.recommendedSessionMinutes} min\n`
  );
}

// --- Phase 2: Performance Tracking ---
const moduleIds = [...new Set(seedAssessments.map((a) => a.moduleId))];
const allModulePerformance = moduleIds.map((id) =>
  runPerformanceEngine(id, seedAssessments.filter((a) => a.moduleId === id))
);

console.log(`\n--- Performance Engine Output ---`);
for (const perf of allModulePerformance) {
  console.log(
    `${perf.moduleId}\n` +
    `  predicted: ${perf.predictedFinalMark}%  gap: ${perf.requiredImprovementGap > 0 ? "+" : ""}${perf.requiredImprovementGap}  ` +
    `risk: ${perf.riskLevel}  weakest: ${perf.weakestAssessmentType ?? "n/a"}\n`
  );
}

// --- Phase 3: Task System ---
console.log(`\n--- Task System Output ---`);
console.log(`Open tasks: ${getOpenTasks(seedTasks).length}`);
console.log(`Overdue tasks: ${getOverdueTasks(seedTasks, today).length}`);
for (const t of seedTasks) {
  const days = daysUntilDeadline(t, today);
  console.log(`  [${t.status}] ${t.title} — ${days === null ? "no deadline" : `${days} day(s)`}`);
}

// --- Phase 4: Scheduling Engine ---
const ranked = runSchedulingEngine(seedTasks, today, allModulePerformance, allModuleEngineOutputs);

console.log(`\n--- Scheduling Engine Output (ranked) ---`);
ranked.forEach((t, i) => {
  console.log(
    `${i + 1}. ${t.title}\n` +
    `   score: ${t.score}  (urgency: ${t.urgencyScore}, importance: ${t.importanceScore}, effort: ${t.effortPressureScore})\n`
  );
});
console.log(`\n>>> NEXT BEST ACTION: ${ranked[0]?.title ?? "nothing to do"}`);
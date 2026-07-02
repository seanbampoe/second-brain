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
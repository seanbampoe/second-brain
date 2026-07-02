import { seedModules } from "./lib/seedData";
import { runModuleEngineForAll } from "./lib/engines/moduleIntelligence";

// Pretend we're in week 6 of a 12-week semester
const currentWeek = 6;

const results = runModuleEngineForAll(seedModules, currentWeek);

console.log(`--- Module Engine Output (Week ${currentWeek}) ---`);
for (const r of results) {
  const module = seedModules.find((m) => m.id === r.moduleId);
  console.log(
    `${module?.code} (${module?.name})\n` +
    `  demand: ${r.currentWeekDemand.toFixed(2)}  ` +
    `difficulty: ${r.difficultyScaling.toFixed(2)}  ` +
    `session: ${r.recommendedSessionMinutes} min\n`
  );
}
import { useEffect, useState } from "react";
import { AppData, loadAppData, getActiveProfileData } from "./lib/storage";
import { runModuleEngineForAll } from "./lib/engines/moduleIntelligence";
import { runPerformanceEngine } from "./lib/engines/performanceTracking";
import { getOpenTasks, getOverdueTasks } from "./lib/engines/taskSystem";
import { runSchedulingEngine } from "./lib/engines/schedulingEngine";
import "./App.css";

const CURRENT_WEEK = 6;
const TODAY = new Date().toISOString().slice(0, 10);

function App() {
  const [appData, setAppData] = useState<AppData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAppData()
      .then(setAppData)
      .catch((e) => setError(String(e)));
  }, []);

  if (error) return <div className="container"><p>Error loading data: {error}</p></div>;
  if (!appData) return <div className="container"><p>Loading...</p></div>;

  const profileData = getActiveProfileData(appData);
  const moduleEngineOutputs = runModuleEngineForAll(profileData.modules, CURRENT_WEEK);
  const moduleIds = [...new Set(profileData.assessments.map((a) => a.moduleId))];
  const modulePerformance = moduleIds.map((id) =>
    runPerformanceEngine(id, profileData.assessments.filter((a) => a.moduleId === id))
  );
  const ranked = runSchedulingEngine(profileData.tasks, TODAY, modulePerformance, moduleEngineOutputs);
  const nextAction = ranked[0];
  const openCount = getOpenTasks(profileData.tasks).length;
  const overdueCount = getOverdueTasks(profileData.tasks, TODAY).length;

  return (
    <div className="container">
      <h1>Second Brain</h1>

      <section style={{ marginTop: "2rem" }}>
        <h2>Next best action</h2>
        {nextAction ? (
          <p style={{ fontSize: "1.4rem", fontWeight: 600 }}>{nextAction.title}</p>
        ) : (
          <p>Nothing pending — you're clear.</p>
        )}
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Today's snapshot</h2>
        <p>{openCount} open task(s), {overdueCount} overdue</p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Full ranking (debug view)</h2>
        <ol>
          {ranked.map((t) => (
            <li key={t.taskId}>{t.title} — score {t.score}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}

export default App;
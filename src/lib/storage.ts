import { exists, mkdir, readTextFile, writeTextFile, BaseDirectory } from "@tauri-apps/plugin-fs";
import { Module, Assessment, Task } from "./types";
import { seedModules } from "./seedData";
import { seedAssessments } from "./seedAssessments";
import { seedTasks } from "./seedTasks";

const DATA_FILE = "second-brain-data.json";

export interface ProfileData {
  modules: Module[];
  assessments: Assessment[];
  tasks: Task[];
}

export interface AppData {
  activeProfileId: string;
  profiles: Record<string, { id: string; name: string; data: ProfileData }>;
}

function defaultAppData(): AppData {
  return {
    activeProfileId: "sean",
    profiles: {
      sean: {
        id: "sean",
        name: "Sean",
        data: { modules: seedModules, assessments: seedAssessments, tasks: seedTasks },
      },
    },
  };
}

export async function loadAppData(): Promise<AppData> {
  const fileExists = await exists(DATA_FILE, { baseDir: BaseDirectory.AppData });
  if (!fileExists) {
    const initial = defaultAppData();
    await saveAppData(initial);
    return initial;
  }
  const raw = await readTextFile(DATA_FILE, { baseDir: BaseDirectory.AppData });
  return JSON.parse(raw) as AppData;
}

export async function saveAppData(data: AppData): Promise<void> {
  await mkdir("", { baseDir: BaseDirectory.AppData, recursive: true }).catch(() => {});
  await writeTextFile(DATA_FILE, JSON.stringify(data, null, 2), { baseDir: BaseDirectory.AppData });
}

export function getActiveProfileData(app: AppData): ProfileData {
  return app.profiles[app.activeProfileId].data;
}

export async function updateActiveProfileData(
  app: AppData,
  updater: (data: ProfileData) => ProfileData
): Promise<AppData> {
  const profile = app.profiles[app.activeProfileId];
  const updated: AppData = {
    ...app,
    profiles: {
      ...app.profiles,
      [app.activeProfileId]: { ...profile, data: updater(profile.data) },
    },
  };
  await saveAppData(updated);
  return updated;
}
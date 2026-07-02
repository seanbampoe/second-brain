import { Assessment, ModulePerformance, RiskLevel, AssessmentType } from "../types";

const DEFAULT_TARGET_MARK = 75; // adjust per your own goals later

/**
 * Weighted average of completed assessments only. Assessments with no mark
 * yet (currentMark === null) don't count toward what's "achieved so far" —
 * but their weight still matters for risk scoring below.
 */
export function computeCurrentMarkPrediction(assessments: Assessment[]): number {
  const completed = assessments.filter((a) => a.currentMark !== null);
  if (completed.length === 0) return 0;

  const totalWeight = completed.reduce((sum, a) => sum + a.weight, 0);
  if (totalWeight === 0) return 0;

  const weightedSum = completed.reduce(
    (sum, a) => sum + (a.currentMark as number) * a.weight,
    0
  );
  return weightedSum / totalWeight;
}

export function computeRequiredImprovementGap(
  predictedMark: number,
  targetMark: number = DEFAULT_TARGET_MARK
): number {
  return targetMark - predictedMark;
}

/**
 * Risk scoring per your design doc: based on low marks in high-weight
 * assessments, missing assessments, and dependency on the final exam.
 */
export function computeRiskLevel(assessments: Assessment[], predictedMark: number): RiskLevel {
  const missingCount = assessments.filter((a) => a.currentMark === null).length;
  const examWeight = assessments
    .filter((a) => a.type === "exam")
    .reduce((sum, a) => sum + a.weight, 0);

  const lowHighWeightHit = assessments.some(
    (a) => a.currentMark !== null && a.currentMark < 50 && a.weight >= 0.2
  );

  let score = 0;
  if (predictedMark < 50) score += 2;
  else if (predictedMark < 60) score += 1;

  if (lowHighWeightHit) score += 2;
  if (examWeight >= 0.4) score += 1;       // heavy final-exam dependency
  if (missingCount >= assessments.length / 2) score += 1; // still mostly unknown

  if (score >= 3) return "High";
  if (score >= 1) return "Medium";
  return "Low";
}

/**
 * Weakest assessment category: the type with the lowest average mark among
 * completed assessments — matches "weakest assessment category" in your doc.
 */
export function computeWeakestAssessmentType(assessments: Assessment[]): AssessmentType | null {
  const completed = assessments.filter((a) => a.currentMark !== null);
  if (completed.length === 0) return null;

  const byType = new Map<AssessmentType, { sum: number; count: number }>();
  for (const a of completed) {
    const entry = byType.get(a.type) ?? { sum: 0, count: 0 };
    entry.sum += a.currentMark as number;
    entry.count += 1;
    byType.set(a.type, entry);
  }

  let weakest: AssessmentType | null = null;
  let lowestAvg = Infinity;
  for (const [type, { sum, count }] of byType) {
    const avg = sum / count;
    if (avg < lowestAvg) {
      lowestAvg = avg;
      weakest = type;
    }
  }
  return weakest;
}

export function runPerformanceEngine(
  moduleId: string,
  assessments: Assessment[],
  targetMark: number = DEFAULT_TARGET_MARK
): ModulePerformance {
  const predicted = computeCurrentMarkPrediction(assessments);
  return {
    moduleId,
    predictedFinalMark: Math.round(predicted * 10) / 10,
    requiredImprovementGap: Math.round(computeRequiredImprovementGap(predicted, targetMark) * 10) / 10,
    riskLevel: computeRiskLevel(assessments, predicted),
    weakestAssessmentType: computeWeakestAssessmentType(assessments),
  };
}
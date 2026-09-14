import { api } from './api';
import { Startup, Pilot } from '../types';

export interface PilotRating {
  id: string;
  pilot_id: string;
  startup_id: string;
  pilot_number?: string;
  startup_name?: string;
  department_name?: string;
  officer_name?: string;
  officer_designation?: string;
  problem_title?: string;
  overall_rating: number; // 1 to 5 stars
  technical_performance: number; // 1 to 5
  solution_effectiveness: number; // 1 to 5
  implementation_support: number; // 1 to 5
  timeliness: number; // 1 to 5
  kpi_achievement: number; // 1 to 5
  feedback: string;
  strengths?: string;
  improvements?: string;
  recommendation?: 'yes' | 'conditional' | 'no';
  evaluated_at: string;
}

export interface StartupPerformanceProfile {
  averageRating: number;
  ratingCount: number;
  successfulPilots: number;
  departmentsCount: number;
  averageKpi: number;
  evaluations: PilotRating[];
  hasEvaluations: boolean;
  dimensionAverages: {
    technical: number;
    effectiveness: number;
    implementation: number;
    timeliness: number;
    kpi: number;
  };
}

const STORAGE_KEY = 'pragati_pilot_ratings_v1';

export function getAllRatings(): PilotRating[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to read pilot ratings from storage', err);
    return [];
  }
}

export function getRatingForPilot(pilotId: string): PilotRating | null {
  const all = getAllRatings();
  return all.find((r) => r.pilot_id === pilotId) || null;
}

export function getRatingsForStartup(startupId: string): PilotRating[] {
  const all = getAllRatings();
  return all.filter((r) => r.startup_id === startupId);
}

export async function savePilotRating(
  ratingData: Omit<PilotRating, 'id' | 'evaluated_at'> & { id?: string }
): Promise<PilotRating> {
  const all = getAllRatings();
  const existingIdx = all.findIndex((r) => r.pilot_id === ratingData.pilot_id);

  const rating: PilotRating = {
    ...ratingData,
    id: ratingData.id || `eval-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    evaluated_at: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    all[existingIdx] = rating;
  } else {
    all.unshift(rating);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (err) {
    console.error('Failed to persist pilot rating', err);
  }

  // Attempt backend persistence if available (non-blocking)
  try {
    await api.post(`/api/pilots/${ratingData.pilot_id}/rating`, rating).catch(() => {});
  } catch {
    // Non-fatal fallback
  }

  return rating;
}

export function getStartupPerformanceSummary(
  startup: Partial<Startup> & { id: string },
  startupPilots: Pilot[] = []
): StartupPerformanceProfile {
  const evals = getRatingsForStartup(startup.id);
  const completedPilots = startupPilots.filter((p) => p.status === 'completed');

  const successfulPilotsCount = Math.max(
    startup.government_pilots || 0,
    completedPilots.length
  );

  // Departments count: unique departments from pilots
  const deptSet = new Set<string>();
  startupPilots.forEach((p) => {
    if (p.department?.name) deptSet.add(p.department.name);
    else if (p.department_id) deptSet.add(p.department_id);
  });
  evals.forEach((e) => {
    if (e.department_name) deptSet.add(e.department_name);
  });
  const departmentsCount = Math.max(deptSet.size, successfulPilotsCount > 0 ? 1 : 0);

  // Average KPI calculation
  let avgKpi = startup.pilot_success_rate || 0;
  if (completedPilots.length > 0) {
    const kpiSum = completedPilots.reduce(
      (acc, p) => acc + (p.progress_percent || p.overall_score || 90),
      0
    );
    avgKpi = Math.round(kpiSum / completedPilots.length);
  }

  if (evals.length > 0) {
    const sumOverall = evals.reduce((acc, e) => acc + e.overall_rating, 0);
    const avgRating = Number((sumOverall / evals.length).toFixed(1));

    const technicalAvg = Number(
      (evals.reduce((acc, e) => acc + (e.technical_performance || 5), 0) / evals.length).toFixed(1)
    );
    const effectivenessAvg = Number(
      (evals.reduce((acc, e) => acc + (e.solution_effectiveness || 5), 0) / evals.length).toFixed(1)
    );
    const implementationAvg = Number(
      (evals.reduce((acc, e) => acc + (e.implementation_support || 5), 0) / evals.length).toFixed(1)
    );
    const timelinessAvg = Number(
      (evals.reduce((acc, e) => acc + (e.timeliness || 5), 0) / evals.length).toFixed(1)
    );
    const kpiAvg = Number(
      (evals.reduce((acc, e) => acc + (e.kpi_achievement || 5), 0) / evals.length).toFixed(1)
    );

    return {
      averageRating: avgRating,
      ratingCount: evals.length,
      successfulPilots: Math.max(successfulPilotsCount, evals.length),
      departmentsCount: Math.max(departmentsCount, evals.length),
      averageKpi: avgKpi || 92,
      evaluations: evals,
      hasEvaluations: true,
      dimensionAverages: {
        technical: technicalAvg,
        effectiveness: effectivenessAvg,
        implementation: implementationAvg,
        timeliness: timelinessAvg,
        kpi: kpiAvg,
      },
    };
  }

  // Baseline performance derived from statutory government pilot history if available
  const hasHistory = (startup.government_pilots || 0) > 0;
  const estimatedRating = hasHistory
    ? Number(Math.min(5, Math.max(3.5, 3.5 + ((startup.trust_score || 80) - 70) * 0.05)).toFixed(1))
    : 0;

  return {
    averageRating: estimatedRating,
    ratingCount: 0,
    successfulPilots: successfulPilotsCount,
    departmentsCount: departmentsCount,
    averageKpi: avgKpi,
    evaluations: [],
    hasEvaluations: false,
    dimensionAverages: {
      technical: estimatedRating ? Math.min(5, estimatedRating + 0.1) : 0,
      effectiveness: estimatedRating || 0,
      implementation: estimatedRating ? Math.max(3.5, estimatedRating - 0.2) : 0,
      timeliness: estimatedRating ? Math.max(3.5, estimatedRating - 0.1) : 0,
      kpi: estimatedRating || 0,
    },
  };
}

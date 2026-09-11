export const RESEARCH_LIFECYCLE_PRIORITY = Object.freeze({
  ready_for_observation: 100,
  source_inspected: 90,
  needs_sources: 70,
  triaged: 55,
  discovered: 35
});

export function lifecyclePriority(state = "discovered") {
  return RESEARCH_LIFECYCLE_PRIORITY[state] ?? 0;
}

export function countLifecycle(states = []) {
  const counts = {};
  for (const state of states) counts[state] = (counts[state] ?? 0) + 1;
  return counts;
}

export function wipPressure({ counts = {}, candidateCount = 0, softLimit = 8, hardLimit = 16, candidateRatioLimit = 2 } = {}) {
  const actionable = Object.keys(RESEARCH_LIFECYCLE_PRIORITY).reduce((sum, state) => sum + Number(counts[state] ?? 0), 0);
  const inspected = Number(counts.source_inspected ?? 0) + Number(counts.ready_for_observation ?? 0);
  const candidateLag = inspected > Math.max(candidateCount * candidateRatioLimit, candidateRatioLimit);
  return {
    actionable,
    candidateCount,
    inspected,
    candidateLag,
    preferProgression: actionable >= softLimit || candidateLag,
    suppressDiscovery: actionable >= hardLimit || candidateLag
  };
}

export function rpsV1({ state = "discovered", evidenceGain = 0, crossDomainValue = 0, freshnessValue = 0, noveltyValue = 0, diversityPenalty = 0, discovery = false, pressure = {} } = {}) {
  const progressionValue = Math.round((lifecyclePriority(state) / 100) * 30);
  const wipPenalty = discovery && pressure.suppressDiscovery ? 30 : discovery && pressure.preferProgression ? 15 : 0;
  const score = progressionValue
    + Math.min(25, Math.max(0, Number(evidenceGain) || 0))
    + Math.min(15, Math.max(0, Number(crossDomainValue) || 0))
    + Math.min(10, Math.max(0, Number(freshnessValue) || 0))
    + Math.min(20, Math.max(0, Number(noveltyValue) || 0))
    - Math.min(20, Math.max(0, Number(diversityPenalty) || 0))
    - wipPenalty;
  return Math.max(0, Math.min(100, score));
}

export function rankResearchIssues(items = [], options = {}) {
  const pressure = options.pressure ?? wipPressure({
    counts: countLifecycle(items.map((item) => item.state ?? "discovered")),
    candidateCount: options.candidateCount ?? 0
  });
  return items.map((item) => ({
    ...item,
    rps: rpsV1({
      state: item.state ?? "discovered",
      evidenceGain: item.evidenceGain ?? 0,
      crossDomainValue: item.crossDomainValue ?? 0,
      freshnessValue: item.freshnessValue ?? 0,
      noveltyValue: item.noveltyValue ?? 0,
      diversityPenalty: item.diversityPenalty ?? 0,
      discovery: (item.state ?? "discovered") === "discovered",
      pressure
    })
  })).sort((a, b) => lifecyclePriority(b.state) - lifecyclePriority(a.state) || b.rps - a.rps || String(a.id).localeCompare(String(b.id)));
}

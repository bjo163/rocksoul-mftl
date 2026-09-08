import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Badge,
  Button,
  MoonWitnessAssetImage,
  MoonWitnessAssetProvider,
  MoonWitnessBrand,
  ThemeToggle,
} from "@rocksoul/ui";
import "@rocksoul/ui/styles.css";
import "./style.css";

type Claim = {
  id: string;
  subject: string | null;
  predicate: string | null;
  object: string | null;
  claim_type: string | null;
  source_basis: string[];
  evidence_ids?: string[];
  epistemic_status?: string | null;
  confidence: number | null;
  notes?: string | null;
};

type Source = {
  id: string;
  title: string;
  source_type: string | null;
  primary_source: boolean;
  locator: string | null;
  author: string | null;
  date: string | null;
  authority?: string | null;
  reliability?: { score?: number | null; notes?: string | null } | null;
};

type Evidence = {
  id: string;
  target_id: string;
  source_id: string;
  stance: string;
  evidence_type: string;
  locator: string | null;
  summary: string | null;
  confidence: number | null;
  status: string | null;
};


type ClaimChallenge = {
  claim_id: string;
  current_epistemic_status: string | null;
  strongest_counterevidence: Evidence | null;
  alternative_explanations: string[];
  what_would_change_this: string[];
  guardrail: string;
};

type CorpusRecord = {
  id: string;
  title: string;
  family: string;
  record_type: string;
  region: string | null;
  status: string;
  confidence: number | null;
  detail: {
    summary: string | null;
    long_description: string | null;
    tradition: string | null;
    earliest_attestation: string | null;
    entities: Array<{ id: string; name: string; entity_type: string | null; roles: string[] }>;
    claims: Claim[];
    sources: Source[];
    evidence: Evidence[];
  };
};



type Observatory = {
  benchmark_slots: Array<{ id:string; status:string; ref:string; failure_mode:string }>;
  drift_records: Array<{
    id:string; title:string; subject_ref:string;
    stages:Array<{id:string;layer:string;ref:string;scope:string}>;
    drift_observations:Array<{from:string;to:string;dimension:string;change:string;risk:string}>;
    guardrails:string[];
  }>;
  research_queue: Array<{id:string;name:string;status:string;region:string;candidate_type:string;source_count:number;authorities:string[];discovered_at:string|null}>;
  coverage_points: Array<{id:string;label:string;kind:"canonical"|"candidate";region:string;lat:number;lon:number;estimated:boolean;status?:string}>;
  freshness_events: Array<{type:string;id:string;label:string;date:string;age_days:number}>;
  research_velocity: Array<{date:string;total:number;types:Record<string,number>}>;
  cross_repo_refs: Array<{ref:string;domain:string;source_record_id:string}>;
  conspiracy: {integrity_code:string;lane_active:boolean;lane:any;staged_candidates:Array<{id:string;name:string;status:string;region:string}>};
  confidence_distribution: Record<string,number>;
};

type CorpusAnalytics = {
  candidate_pipeline: Record<string, number>;
  candidate_types: Record<string, number>;
  claim_epistemic: Record<string, number>;
  claim_types: Record<string, number>;
  claim_confidence: { high: number; medium: number; low: number };
  evidence_stance: Record<string, number>;
  evidence_types: Record<string, number>;
  source_authority: Record<string, number>;
  source_types: Record<string, number>;
  source_reliability_average: number | null;
  provenance_completeness: {
    claims_with_evidence: number;
    claims_total: number;
    sources_with_locators: number;
    sources_total: number;
    canonical_records_with_claims: number;
    canonical_records_total: number;
  };
  benchmark: {
    target: number;
    status: Record<string, number>;
    canonical: number;
    candidate: number;
    research_issue: number;
  };
  drift: { records: number; risks: Record<string, number> };
  automation: {
    steward: string;
    schedule: string;
    parallel_lanes: Array<{ id: string; candidate_type: string }>;
  };
  observatory?: Observatory;
};

type CorpusIndex = {
  generated_at: string;
  counts: {
    canonical_records: number;
    candidates: number;
    merged_candidates: number;
    entities: number;
    claims: number;
    sources: number;
    evidence: number;
    families: number;
    regions: number;
  };
  coverage?: {
    regions: Record<string, number>;
    canonical_regions: Record<string, number>;
  };
  analytics?: CorpusAnalytics;
  records: CorpusRecord[];
};

const ASSET_BASE = "https://raw.githubusercontent.com/bjo163/rocksoul-assets/7d924d5915364b222e1d1287e493f4b742e283a3/moonwitness";

const layers = [
  { code:"01", title:"MYTH", subtitle:"Cultural Narrative", description:"Describe the story, tradition, entities, motifs and claims before judging them.", signal:"DESCRIBE" },
  { code:"02", title:"INTEGRITY", subtitle:"Epistemic Signal", description:"Inspect fabrication, false attribution, manipulation, propaganda and context loss.", signal:"VERIFY" },
  { code:"03", title:"DEVIATION", subtitle:"Reference Drift", description:"Compare a narrative, text, teaching or practice against an explicit baseline.", signal:"COMPARE" },
  { code:"04", title:"MIZAN", subtitle:"Normative Assessment", description:"Keep optional explainable theological assessment downstream of evidence.", signal:"WEIGH" },
];

function pct(value: number | null) {
  return value == null ? "—" : `${Math.round(value * 100)}%`;
}

function confidenceVariant(value: number | null) {
  if (value == null) return "neutral" as const;
  if (value >= .9) return "supported" as const;
  if (value >= .7) return "partial" as const;
  return "unresolved" as const;
}

function EvidenceTrail({ record }: { record: CorpusRecord }) {
  const [selectedClaimId, setSelectedClaimId] = useState(record.detail.claims[0]?.id ?? null);
  const [challenge, setChallenge] = useState<ClaimChallenge | null>(null);

  useEffect(() => {
    setSelectedClaimId(record.detail.claims[0]?.id ?? null);
  }, [record.id]);

  useEffect(() => {
    if (!selectedClaimId) { setChallenge(null); return; }
    let active = true;
    fetch(`/api/v1/claims/${encodeURIComponent(selectedClaimId)}/challenge`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("challenge unavailable")))
      .then((payload) => { if (active) setChallenge(payload.data ?? null); })
      .catch(() => { if (active) setChallenge(null); });
    return () => { active = false; };
  }, [selectedClaimId]);

  const activeEvidence = selectedClaimId
    ? record.detail.evidence.filter((edge) => edge.target_id === selectedClaimId)
    : record.detail.evidence;

  const activeSourceIds = new Set(activeEvidence.map((edge) => edge.source_id));

  return (
    <section className="graph-panel" aria-labelledby="evidence-graph-title">
      <div className="panel-heading">
        <div>
          <p className="mw-eyebrow">PROVENANCE GRAPH</p>
          <h3 id="evidence-graph-title">Story → claim → evidence → source</h3>
        </div>
        <Badge variant="unresolved">description ≠ verdict</Badge>
      </div>

      <div className="trail-grid">
        <div className="trail-column">
          <p className="trail-label">STORY</p>
          <div className="trail-node is-story">
            <MoonWitnessAssetImage pack="correlation-semantics" file="svg/node-story.svg" alt="" aria-hidden="true" />
            <strong>{record.title}</strong>
            <small>{record.id}</small>
          </div>
        </div>

        <div className="trail-column">
          <p className="trail-label">CLAIMS</p>
          <div className="trail-stack">
            {record.detail.claims.length ? record.detail.claims.map((claim) => (
              <button
                key={claim.id}
                type="button"
                className={`trail-node trail-button ${selectedClaimId === claim.id ? "is-active" : ""}`}
                onClick={() => setSelectedClaimId(claim.id)}
                aria-pressed={selectedClaimId === claim.id}
              >
                <MoonWitnessAssetImage pack="correlation-semantics" file="svg/node-claim.svg" alt="" aria-hidden="true" />
                <span><strong>{claim.predicate ?? claim.id}</strong><small>{claim.epistemic_status ?? claim.object ?? claim.claim_type ?? claim.id}</small></span>
              </button>
            )) : <p className="muted">No atomic claims attached.</p>}
          </div>
        </div>

        <div className="trail-column">
          <p className="trail-label">EVIDENCE</p>
          <div className="trail-stack">
            {activeEvidence.length ? activeEvidence.map((edge) => (
              <div className="trail-node" key={edge.id}>
                <MoonWitnessAssetImage pack="correlation-semantics" file="svg/node-evidence.svg" alt="" aria-hidden="true" />
                <span>
                  <strong>{edge.stance} · {pct(edge.confidence)}</strong>
                  <small>{edge.summary ?? edge.locator ?? edge.id}</small>
                </span>
              </div>
            )) : <p className="muted">No evidence edge for this claim yet.</p>}
          </div>
        </div>

        <div className="trail-column">
          <p className="trail-label">SOURCES</p>
          <div className="trail-stack">
            {record.detail.sources.map((source) => (
              <a
                key={source.id}
                className={`trail-node trail-source ${activeSourceIds.has(source.id) ? "is-active" : ""}`}
                href={source.locator ?? undefined}
                target={source.locator ? "_blank" : undefined}
                rel={source.locator ? "noreferrer" : undefined}
              >
                <MoonWitnessAssetImage pack="correlation-semantics" file="svg/node-source.svg" alt="" aria-hidden="true" />
                <span><strong>{source.title}</strong><small>{source.primary_source ? "PRIMARY SOURCE" : source.authority ?? source.source_type ?? source.id}</small></span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="graph-text-equivalent">
        <strong>Text equivalent:</strong>{" "}
        {selectedClaimId
          ? `${selectedClaimId} has ${activeEvidence.length} evidence edge(s) linked to ${activeSourceIds.size} source record(s).`
          : `${record.id} has ${record.detail.claims.length} claims and ${record.detail.evidence.length} evidence edges.`}
      </div>

      {challenge ? (
        <div className="challenge-panel">
          <div>
            <p className="mw-eyebrow">STRONGEST CASE AGAINST</p>
            <strong>{challenge.strongest_counterevidence?.summary ?? "No explicit counterevidence edge recorded yet."}</strong>
          </div>
          <div>
            <p className="mw-eyebrow">ALTERNATIVE EXPLANATIONS</p>
            <ul>{challenge.alternative_explanations.length ? challenge.alternative_explanations.map((item) => <li key={item}>{item}</li>) : <li>None encoded yet.</li>}</ul>
          </div>
          <div>
            <p className="mw-eyebrow">WHAT WOULD CHANGE THIS?</p>
            <ul>{challenge.what_would_change_this.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <p className="challenge-guardrail">{challenge.guardrail}</p>
        </div>
      ) : null}
    </section>
  );
}

function RecordDetail({ record }: { record: CorpusRecord }) {
  return (
    <section className="record-detail" id="record-detail" aria-labelledby="record-detail-title">
      <div className="detail-hero">
        <div>
          <p className="mw-eyebrow">{record.family} / {record.record_type}</p>
          <h2 id="record-detail-title">{record.title}</h2>
          <p className="detail-summary">{record.detail.summary ?? "Canonical record detail."}</p>
        </div>
        <div className="detail-meta">
          <Badge variant={confidenceVariant(record.confidence)}>confidence {pct(record.confidence)}</Badge>
          <Badge variant="neutral">{record.status}</Badge>
          <span>{record.region ?? "GLOBAL / UNKNOWN"}</span>
          {record.detail.earliest_attestation ? <span>{record.detail.earliest_attestation}</span> : null}
        </div>
      </div>

      <div className="detail-stats">
        <div><strong>{record.detail.claims.length}</strong><span>atomic claims</span></div>
        <div><strong>{record.detail.sources.length}</strong><span>sources</span></div>
        <div><strong>{record.detail.evidence.length}</strong><span>evidence edges</span></div>
        <div><strong>{record.detail.entities.length}</strong><span>entities</span></div>
      </div>

      <EvidenceTrail record={record} />

      <div className="detail-columns">
        <section className="detail-card">
          <p className="mw-eyebrow">NARRATIVE CONTEXT</p>
          <p>{record.detail.long_description ?? record.detail.summary ?? "No long-form description yet."}</p>
          {record.detail.tradition ? <p className="muted"><strong>Tradition:</strong> {record.detail.tradition}</p> : null}
        </section>
        <section className="detail-card">
          <p className="mw-eyebrow">ENTITIES</p>
          <div className="chip-list">
            {record.detail.entities.length ? record.detail.entities.map((entity) => (
              <span className="entity-chip" key={entity.id}><strong>{entity.name}</strong><small>{entity.entity_type ?? entity.id}</small></span>
            )) : <span className="muted">No reusable entities linked yet.</span>}
          </div>
        </section>
      </div>
    </section>
  );
}


function ratio(a: number, b: number) {
  return b ? Math.round((a / b) * 100) : 0;
}

function MetricBars({ title, data }: { title: string; data: Record<string, number> }) {
  const rows = Object.entries(data).sort((a,b) => b[1] - a[1]);
  const max = Math.max(1, ...rows.map(([,value]) => value));
  return (
    <section className="intel-card">
      <p className="mw-eyebrow">{title}</p>
      <div className="intel-bars">
        {rows.length ? rows.map(([label,value]) => (
          <div className="intel-row" key={label}>
            <span>{label.replaceAll("_"," ")}</span>
            <i><b style={{width:`${Math.max(6,(value/max)*100)}%`}} /></i>
            <strong>{value}</strong>
          </div>
        )) : <span className="muted">No data yet.</span>}
      </div>
    </section>
  );
}

function IntelligenceDashboard({ analytics }: { analytics: CorpusAnalytics }) {
  const p = analytics.provenance_completeness;
  const completedBenchmark = analytics.benchmark.canonical + analytics.benchmark.candidate + analytics.benchmark.research_issue;
  return (
    <section className="section intelligence" id="intelligence">
      <div className="section-head compact">
        <div><p className="mw-eyebrow">RESEARCH INTELLIGENCE</p><h2>SEE THE<br/>UNCERTAINTY.</h2></div>
        <p className="section-copy">The dashboard exposes corpus strength, disagreement, provenance, research backlog and automation lanes. A larger corpus is not automatically a stronger corpus.</p>
      </div>

      <div className="intel-summary">
        <div><strong>{ratio(p.claims_with_evidence,p.claims_total)}%</strong><span>CLAIMS WITH EVIDENCE</span></div>
        <div><strong>{ratio(p.sources_with_locators,p.sources_total)}%</strong><span>SOURCES WITH LOCATORS</span></div>
        <div><strong>{analytics.source_reliability_average == null ? "—" : Math.round(analytics.source_reliability_average*100)+"%"}</strong><span>AVG SOURCE RELIABILITY</span></div>
        <div><strong>{completedBenchmark}/{analytics.benchmark.target}</strong><span>EPISTEMIC BENCHMARK SLOTS</span></div>
      </div>

      <div className="intel-grid">
        <MetricBars title="CLAIM EPISTEMIC STATUS" data={analytics.claim_epistemic} />
        <MetricBars title="EVIDENCE BALANCE" data={analytics.evidence_stance} />
        <MetricBars title="SOURCE AUTHORITY" data={analytics.source_authority} />
        <MetricBars title="CANDIDATE PIPELINE" data={analytics.candidate_pipeline} />
        <MetricBars title="EVIDENCE TYPES" data={analytics.evidence_types} />
        <MetricBars title="NARRATIVE DRIFT RISKS" data={analytics.drift.risks} />
      </div>

      <div className="automation-panel">
        <div>
          <p className="mw-eyebrow">AUTONOMOUS RESEARCH</p>
          <h3>{analytics.automation.steward}</h3>
          <p>Scheduled {analytics.automation.schedule}. Seven discovery lanes run in parallel; Steward then reviews and stages only vetted leads.</p>
        </div>
        <div className="lane-list">
          {analytics.automation.parallel_lanes.map((lane) => (
            <span className="lane-chip" key={lane.id}><strong>{lane.id}</strong><small>{lane.candidate_type}</small></span>
          ))}
        </div>
      </div>
    </section>
  );
}


function ObservatoryBars({ title, data }: { title:string; data:Record<string,number> }) {
  const rows=Object.entries(data); const max=Math.max(1,...rows.map(([,v])=>v));
  return <div className="obs-bars-card"><p className="mw-eyebrow">{title}</p>{rows.map(([k,v])=>
    <div className="obs-bar-row" key={k}><span>{k}</span><i><b style={{width:`${Math.max(5,v/max*100)}%`}}/></i><strong>{v}</strong></div>
  )}</div>;
}

function NarrativeDriftTimeline({ drift }: { drift:Observatory["drift_records"][number] | undefined }) {
  if(!drift)return <div className="obs-empty">No narrative drift model yet.</div>;
  const riskByTo=new Map(drift.drift_observations.map(o=>[o.to,o.risk]));
  return <section className="obs-card obs-span-2"><div className="obs-title"><p className="mw-eyebrow">P0 / NARRATIVE DRIFT</p><h3>{drift.title}</h3></div>
    <div className="drift-timeline">{drift.stages.map((stage,i)=><React.Fragment key={stage.id}>
      <div className="drift-stage"><span>{String(i+1).padStart(2,"0")}</span><strong>{stage.layer.replaceAll("_"," ")}</strong><small>{stage.ref}</small><p>{stage.scope}</p>{riskByTo.get(stage.id)?<Badge variant="unresolved">{riskByTo.get(stage.id)}</Badge>:null}</div>
      {i<drift.stages.length-1?<div className="drift-arrow">→</div>:null}
    </React.Fragment>)}</div>
    <div className="guardrail-strip">{drift.guardrails.map(g=><span key={g}>{g}</span>)}</div>
  </section>;
}

function ClaimEvidenceMatrix({ records }: { records:CorpusRecord[] }) {
  const rows=records.flatMap(record=>record.detail.claims.map(claim=>{
    const edges=record.detail.evidence.filter(e=>e.target_id===claim.id);
    const count=(stance:string)=>edges.filter(e=>e.stance===stance).length;
    return {record,claim,edges,supports:count("supports"),contradicts:count("contradicts"),context:count("contextualizes"),alternative:count("alternative_explanation")};
  }));
  return <section className="obs-card obs-span-2"><div className="obs-title"><p className="mw-eyebrow">P0 / CLAIM × EVIDENCE MATRIX</p><h3>Coverage and disagreement</h3></div>
    <div className="matrix-scroll"><table className="evidence-matrix"><thead><tr><th>Claim</th><th>Epistemic</th><th>Support</th><th>Counter</th><th>Context</th><th>Alternative</th><th>Sources</th></tr></thead>
    <tbody>{rows.map(r=><tr key={r.claim.id}><td><strong>{r.claim.predicate??r.claim.id}</strong><small>{r.record.title}</small></td><td>{r.claim.epistemic_status??"—"}</td>
      {[r.supports,r.contradicts,r.context,r.alternative].map((v,i)=><td key={i}><span className={`matrix-cell level-${Math.min(3,v)}`}>{v}</span></td>)}
      <td>{new Set(r.edges.map(e=>e.source_id)).size}</td></tr>)}</tbody></table></div>
  </section>;
}

function BenchmarkGrid({ slots }: { slots:Observatory["benchmark_slots"] }) {
  return <section className="obs-card obs-span-2"><div className="obs-title"><p className="mw-eyebrow">P0 / EPISTEMIC BENCHMARK 25</p><h3>Failure-mode coverage</h3></div>
    <div className="benchmark-grid">{slots.map(slot=><div className={`benchmark-slot is-${slot.status.replaceAll("_","-")}`} key={slot.id}><span>{slot.id}</span><strong>{slot.failure_mode.replaceAll("_"," ")}</strong><small>{slot.status} · {slot.ref}</small></div>)}</div>
  </section>;
}

function ResearchPipeline({ obs, pipeline }: { obs:Observatory; pipeline:Record<string,number> }) {
  const stages=[["SCOUT","7 lanes"],["INTAKE","rank + dedup"],["STEWARD","automatic review"],["CANDIDATE","needs_sources"],["CANONICAL","CI gate"]];
  return <section className="obs-card obs-span-2"><div className="obs-title"><p className="mw-eyebrow">P0 / AUTONOMOUS RESEARCH QUEUE</p><h3>Discovery to canonical gate</h3></div>
    <div className="pipeline-flow">{stages.map(([a,b],i)=><React.Fragment key={a}><div><strong>{a}</strong><small>{b}</small></div>{i<stages.length-1?<span>→</span>:null}</React.Fragment>)}</div>
    <div className="pipeline-bottom"><ObservatoryBars title="CANDIDATE STATUS" data={pipeline}/><div className="queue-list">{obs.research_queue.slice(0,8).map(q=><div key={q.id}><span>{q.status}</span><strong>{q.name}</strong><small>{q.candidate_type} · {q.source_count} source(s)</small></div>)}</div></div>
  </section>;
}

function SourceLineage({ record }: { record:CorpusRecord | null }) {
  if(!record)return null;
  const tier=(s:Source)=>s.primary_source||s.authority==="primary"?"01 PRIMARY":s.authority==="academic"||s.authority==="institutional"?"02 SCHOLARLY":"03 CONTEXT";
  return <section className="obs-card"><div className="obs-title"><p className="mw-eyebrow">P1 / SOURCE LINEAGE</p><h3>{record.title}</h3></div>
    <div className="lineage-list">{record.detail.sources.map(s=><div key={s.id}><span>{tier(s)}</span><strong>{s.title}</strong><small>{s.authority??s.source_type??"unknown"} → {record.detail.claims.filter(c=>c.source_basis.includes(s.id)).length} claim(s)</small></div>)}</div>
  </section>;
}

function EvidenceCoverage({ records }: { records:CorpusRecord[] }) {
  const claims=records.flatMap(r=>r.detail.claims.map(c=>({record:r,claim:c,edges:r.detail.evidence.filter(e=>e.target_id===c.id)})));
  return <section className="obs-card"><div className="obs-title"><p className="mw-eyebrow">P1 / EVIDENCE COVERAGE</p><h3>Claim heatmap</h3></div>
    <div className="coverage-heat">{claims.map(x=>{const sources=new Set(x.edges.map(e=>e.source_id)).size;const diversity=new Set(x.edges.map(e=>e.stance)).size;const score=Math.min(4,sources+diversity);return <div key={x.claim.id} className={`heat-row heat-${score}`}><span>{x.claim.id.replace("CLAIM-","")}</span><i/><strong>{x.edges.length} edge · {sources} src</strong></div>})}</div>
  </section>;
}

function WorldEvidenceMap({ points }: { points:Observatory["coverage_points"] }) {
  const xy=(lat:number,lon:number)=>({left:`${((lon+180)/360)*100}%`,top:`${((90-lat)/180)*100}%`});
  return <section className="obs-card obs-span-2"><div className="obs-title"><p className="mw-eyebrow">P1 / WORLD COVERAGE MAP</p><h3>Canonical + candidate geography</h3></div>
    <div className="world-map-canvas"><MoonWitnessAssetImage pack="data-viz" file="charts/geographic-heatmap.svg" alt="" aria-hidden="true"/>
      {points.map(p=><button key={p.id} type="button" className={`map-point is-${p.kind}`} style={xy(p.lat,p.lon)} title={`${p.label} · ${p.region}`}><span/></button>)}
    </div><p className="map-note">Region centroids are used where exact coordinates are unavailable; markers show coverage, not precise archaeological sites.</p>
  </section>;
}

function ConspiracyResearch({ conspiracy }: { conspiracy:Observatory["conspiracy"] }) {
  return <section className="obs-card"><div className="obs-title"><p className="mw-eyebrow">P1 / CONSPIRACY NARRATIVE</p><h3>{conspiracy.integrity_code} research lane</h3></div>
    <div className="conspiracy-flow"><span>ALLEGED CLAIM</span><b>→</b><span>PROVENANCE</span><b>→</b><span>PROPONENT EVIDENCE</span><b>→</b><span>COUNTEREVIDENCE</span><b>→</b><span>ALTERNATIVES</span></div>
    <p className="obs-copy">{conspiracy.lane_active?"Automatic lane is active.":"Lane inactive."} Popularity or repetition never upgrades an alleged conspiracy into fact.</p>
    <div className="mini-list">{conspiracy.staged_candidates.length?conspiracy.staged_candidates.map(c=><div key={c.id}><strong>{c.name}</strong><small>{c.status} · {c.region}</small></div>):<span className="muted">No conspiracy candidate staged yet — the lane remains active and searchable.</span>}</div>
  </section>;
}

function FreshnessTimeline({ events }: { events:Observatory["freshness_events"] }) {
  return <section className="obs-card"><div className="obs-title"><p className="mw-eyebrow">P1 / FRESHNESS</p><h3>Research activity timeline</h3></div>
    <div className="freshness-list">{events.slice(0,12).map((e,i)=><div key={e.type+e.id+e.date+i}><span>{e.date.slice(0,10)}</span><strong>{e.type.replaceAll("_"," ")}</strong><small>{e.label} · {e.age_days}d old</small></div>)}</div>
  </section>;
}

function CrossRocksoul({ refs }: { refs:Observatory["cross_repo_refs"] }) {
  const domains=["mftl","rgbl","legend","superhero","aws"];
  return <section className="obs-card obs-span-2"><div className="obs-title"><p className="mw-eyebrow">P2 / CROSS-ROCKSOUL EXPLORER</p><h3>Owner-qualified references</h3></div>
    <div className="cross-grid">{domains.map(domain=>{const items=refs.filter(r=>r.domain===domain);return <div key={domain}><span>{domain.toUpperCase()}</span><strong>{items.length}</strong>{items.slice(0,5).map(r=><small key={r.ref}>{r.ref}</small>)}{!items.length?<small>no canonical ref yet</small>:null}</div>})}</div>
  </section>;
}

function ResearchVelocity({ velocity }: { velocity:Observatory["research_velocity"] }) {
  const max=Math.max(1,...velocity.map(v=>v.total));
  return <section className="obs-card"><div className="obs-title"><p className="mw-eyebrow">P2 / RESEARCH VELOCITY</p><h3>Corpus change rate</h3></div>
    <div className="velocity-chart">{velocity.slice(-14).map(v=><div key={v.date} title={`${v.date}: ${v.total} research objects`}><i style={{height:`${Math.max(8,v.total/max*100)}%`}}/><span>{v.date.slice(5)}</span><strong>{v.total}</strong></div>)}</div>
  </section>;
}

function ResearchObservatory({ index, selectedRecord }: { index:CorpusIndex; selectedRecord:CorpusRecord | null }) {
  const obs=index.analytics?.observatory;
  if(!obs)return null;
  return <section className="section observatory" id="observatory">
    <div className="section-head compact"><div><p className="mw-eyebrow">P0 → P2 / RESEARCH OBSERVATORY</p><h2>SHOW THE<br/>REASONING SURFACE.</h2></div><p className="section-copy">Drift, disagreement, lineage, geography, conspiracy research, freshness, cross-repository ownership, confidence and research velocity are derived from the same provenance graph.</p></div>
    <div className="observatory-grid">
      <NarrativeDriftTimeline drift={obs.drift_records[0]}/>
      <ClaimEvidenceMatrix records={index.records}/>
      <BenchmarkGrid slots={obs.benchmark_slots}/>
      <ResearchPipeline obs={obs} pipeline={index.analytics?.candidate_pipeline??{}}/>
      <SourceLineage record={selectedRecord}/>
      <EvidenceCoverage records={index.records}/>
      <WorldEvidenceMap points={obs.coverage_points}/>
      <ConspiracyResearch conspiracy={obs.conspiracy}/>
      <FreshnessTimeline events={obs.freshness_events}/>
      <CrossRocksoul refs={obs.cross_repo_refs}/>
      <ObservatoryBars title="P2 / CONFIDENCE DISTRIBUTION" data={obs.confidence_distribution}/>
      <ResearchVelocity velocity={obs.research_velocity}/>
    </div>
  </section>;
}

function App() {
  const [index, setIndex] = useState<CorpusIndex | null>(null);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/corpus-index.json")
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("index unavailable")))
      .then((data: CorpusIndex) => {
        setIndex(data);
        setSelectedId((current) => current ?? data.records[0]?.id ?? null);
      })
      .catch(() => setIndex(null));
  }, []);

  const visibleRecords = useMemo(() => {
    if (!index) return [];
    const needle = query.trim().toLowerCase();
    if (!needle) return index.records;
    return index.records.filter((record) =>
      [record.id, record.title, record.family, record.record_type, record.region ?? "", record.detail.tradition ?? ""]
        .join(" ").toLowerCase().includes(needle)
    );
  }, [index, query]);

  const selectedRecord = index?.records.find((record) => record.id === selectedId) ?? visibleRecords[0] ?? null;
  const coverage = Object.entries(index?.coverage?.regions ?? {}).sort((a,b) => b[1] - a[1]);
  const maxCoverage = Math.max(1, ...coverage.map(([,count]) => count));
  const counts = index?.counts ?? { canonical_records:0,candidates:0,merged_candidates:0,entities:0,claims:0,sources:0,evidence:0,families:18,regions:0 };

  const selectRecord = (id: string) => {
    setSelectedId(id);
    window.setTimeout(() => document.getElementById("record-detail")?.scrollIntoView({ behavior:"smooth", block:"start" }), 0);
  };

  return (
    <main className="site-shell">
      <nav className="top-nav">
        <MoonWitnessBrand ecosystem subtitle="MFTL / STORY CORPUS" />
        <div className="nav-meta">
          <span>WORLD CORPUS</span>
          <span>ASSETS v1.3</span>
          <Badge variant="supported">LIVE</Badge>
          <ThemeToggle />
        </div>
      </nav>

      <section className="hero">
        <MoonWitnessAssetImage className="hero-art" pack="hero-backgrounds" file="svg/evidence-constellation.svg" alt="" aria-hidden="true" />
        <div className="hero-grid">
          <div>
            <p className="mw-eyebrow">FROM MYTH FADES TO LEGEND / STORY INTELLIGENCE</p>
            <h1>TRACE THE<br/><span>STORY.</span><br/>FIND THE<br/><em>SOURCE.</em></h1>
          </div>
          <aside className="hero-aside">
            <div className="hero-rule" />
            <p>A provenance-first intelligence graph for mythology, narrative integrity, reference deviation, evidence, and explainable Mizan.</p>
            <div className="hero-actions">
              <Button onClick={() => document.getElementById("explorer")?.scrollIntoView({behavior:"smooth"})}>Explore corpus</Button>
              <Button variant="secondary" onClick={() => document.getElementById("observatory")?.scrollIntoView({behavior:"smooth"})}>Research observatory</Button>
            </div>
          </aside>
        </div>
        <div className="metrics">
          <div><strong>{String(counts.canonical_records).padStart(2,"0")}</strong><span>CANONICAL RECORDS</span></div>
          <div><strong>{String(counts.claims).padStart(2,"0")}</strong><span>ATOMIC CLAIMS</span></div>
          <div><strong>{String(counts.sources).padStart(2,"0")}</strong><span>SOURCE RECORDS</span></div>
          <div><strong>{String(counts.evidence).padStart(2,"0")}</strong><span>EVIDENCE EDGES</span></div>
        </div>
      </section>

      <section className="section" id="method">
        <div className="section-head">
          <div><p className="mw-eyebrow">MFTL ANALYSIS STACK</p><h2>ONE STORY.<br/>FOUR QUESTIONS.</h2></div>
          <p className="section-copy">Narrative description, integrity, deviation and Mizan remain distinct layers. Evidence moves forward; labels never silently collapse into one verdict.</p>
        </div>
        <div className="layer-grid">
          {layers.map((item) => (
            <article className="layer-card" key={item.code}>
              <div className="layer-top"><span>{item.code}</span><Badge variant="neutral">{item.signal}</Badge></div>
              <p className="overline">{item.subtitle}</p><h3>{item.title}</h3><p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      {index?.analytics ? <IntelligenceDashboard analytics={index.analytics} /> : null}
      {index ? <ResearchObservatory index={index} selectedRecord={selectedRecord} /> : null}

      <section className="section explorer" id="explorer">
        <div className="section-head compact">
          <div><p className="mw-eyebrow">CORPUS EXPLORER</p><h2>SEARCH THE<br/>EVIDENCE GRAPH.</h2></div>
          <div>
            <input className="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="SEARCH ID · NAME · TYPE · REGION · TRADITION" aria-label="Search corpus" />
            <p className="section-copy explorer-note">{counts.canonical_records} canonical · {counts.candidates} active candidates · {counts.entities} entities · {counts.claims} claims</p>
          </div>
        </div>

        <div className="record-list">
          {visibleRecords.map((record) => (
            <button className={`record-row ${selectedId === record.id ? "is-selected" : ""}`} key={record.id} type="button" onClick={() => selectRecord(record.id)}>
              <span className="record-id">{record.id}</span>
              <span className="record-title"><strong>{record.title}</strong><small>{record.family} / {record.record_type}</small></span>
              <span>{record.region ?? "GLOBAL / UNKNOWN"}</span>
              <Badge variant={confidenceVariant(record.confidence)}>{pct(record.confidence)}</Badge>
            </button>
          ))}
          {!visibleRecords.length ? <div className="empty-state">No record matches this search.</div> : null}
        </div>
      </section>

      {selectedRecord ? <RecordDetail record={selectedRecord} /> : null}

      <section className="section world">
        <div className="section-head compact">
          <div><p className="mw-eyebrow">WORLD COVERAGE</p><h2>THE MAP IS<br/>THE QUEUE.</h2></div>
          <p className="section-copy">Coverage is driven by repository provenance. Under-covered traditions remain visible instead of being hidden behind the best-known mythologies.</p>
        </div>
        <div className="world-grid">
          <div className="map-card">
            <MoonWitnessAssetImage pack="data-viz" file="charts/geographic-heatmap.svg" alt="Canonical MoonWitness geographic coverage visualization" />
            <div className="asset-caption"><span>ROCKSOUL-ASSETS / DATA-VIZ</span><strong>Geographic evidence coverage</strong></div>
          </div>
          <div className="coverage-list">
            {coverage.slice(0,12).map(([region,count]) => (
              <div className="coverage-row" key={region}>
                <span>{region}</span>
                <i><b style={{width:`${Math.max(8,(count/maxCoverage)*100)}%`}} /></i>
                <strong>{count}</strong>
              </div>
            ))}
            {!coverage.length ? <p className="muted">Coverage index unavailable.</p> : null}
          </div>
        </div>
      </section>

      <section className="section asset-proof">
        <div>
          <p className="mw-eyebrow">CANONICAL VISUAL CHAIN</p>
          <h2>ASSETS → UI → MFTL.</h2>
        </div>
        <div className="asset-proof-grid">
          {[
            ["node-story","STORY"],
            ["node-claim","CLAIM"],
            ["node-evidence","EVIDENCE"],
            ["node-source","SOURCE"],
          ].map(([asset,label]) => (
            <div className="asset-proof-node" key={asset}>
              <MoonWitnessAssetImage pack="correlation-semantics" file={`svg/${asset}.svg`} alt="" aria-hidden="true" />
              <strong>{label}</strong>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <MoonWitnessBrand compact />
        <span>MFTL / WHERE MYTH FADES TO LEGEND</span>
        <span>TRACE · VERIFY · COMPARE · WEIGH · REVEAL</span>
      </footer>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MoonWitnessAssetProvider baseUrl={ASSET_BASE}>
      <App />
    </MoonWitnessAssetProvider>
  </React.StrictMode>
);

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

  useEffect(() => {
    setSelectedClaimId(record.detail.claims[0]?.id ?? null);
  }, [record.id]);

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
              <Button variant="secondary" onClick={() => document.getElementById("method")?.scrollIntoView({behavior:"smooth"})}>Read method</Button>
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

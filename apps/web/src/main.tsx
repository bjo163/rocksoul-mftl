import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

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
  records: Array<{
    id: string;
    title: string;
    family: string;
    record_type: string;
    region: string | null;
    status: string;
    confidence: number | null;
  }>;
};

const layers = [
  { code: "01", title: "MYTH", subtitle: "Cultural Narrative", description: "Myth, legend, folklore, entities, rituals, motifs, and supernatural claims.", signal: "DESCRIBE" },
  { code: "02", title: "INTEGRITY", subtitle: "Epistemic Signal", description: "Misinformation, disinformation, fabrication, false attribution, propaganda, and manipulated context.", signal: "VERIFY" },
  { code: "03", title: "DEVIATION", subtitle: "Reference Drift", description: "Compare an observed narrative, text, teaching, or practice against an explicit baseline.", signal: "COMPARE" },
  { code: "04", title: "MIZAN", subtitle: "Normative Assessment", description: "Optional explainable theological pattern analysis attached to explicit claims and evidence.", signal: "WEIGH" }
];

const families = [
  ["F01","NARRATIVE","Myth · Legend · Folklore"],
  ["F03","CLAIMS","History · Miracle · Identity"],
  ["F06","TEXT","Variant · Translation · Transmission"],
  ["F07","PREDICTION","Prophecy · Omen · Astrology"],
  ["F08","PARANORMAL","Apparition · Possession · Healing"],
  ["F11","INTEGRITY","Hoax · Disinformation · Deepfake"],
  ["F12","DEVIATION","Semantic · Doctrinal · Ritual drift"],
  ["F13","PSEUDOKNOWLEDGE","Pseudohistory · Pseudoarchaeology"],
  ["F16","EVIDENCE","Source · Counterevidence · Rebuttal"]
];

const regions = [
  ["SEA", "SOUTHEAST ASIA", "Indonesia · Malay · Philippines"],
  ["MEA", "MIDDLE EAST", "Arabia · Mesopotamia · Levant"],
  ["EUR", "EUROPE", "Greek · Roman · Norse · Celtic"],
  ["AFR", "AFRICA", "North · West · East · Southern"],
  ["SAS", "SOUTH ASIA", "India · Himalayan traditions"],
  ["EAS", "EAST ASIA", "China · Japan · Korea"],
  ["AME", "AMERICAS", "Mesoamerica · Andes · North America"],
  ["OCE", "OCEANIA", "Polynesia · Melanesia · Micronesia"]
];

function App() {
  const [index, setIndex] = useState<CorpusIndex | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/data/corpus-index.json")
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("index unavailable")))
      .then(setIndex)
      .catch(() => setIndex(null));
  }, []);

  const visibleRecords = useMemo(() => {
    if (!index) return [];
    const needle = query.trim().toLowerCase();
    if (!needle) return index.records.slice(0, 8);
    return index.records
      .filter((record) => [record.id, record.title, record.family, record.record_type, record.region ?? ""].join(" ").toLowerCase().includes(needle))
      .slice(0, 12);
  }, [index, query]);

  const counts = index?.counts ?? {
    canonical_records: 0,
    candidates: 0,
    merged_candidates: 0,
    entities: 0,
    claims: 0,
    sources: 0,
    evidence: 0,
    families: 18,
    regions: 0
  };

  return (
    <main>
      <nav className="nav">
        <div className="brand"><span className="brand-mark">MFTL</span><span>ROCKSOUL RESEARCH</span></div>
        <div className="nav-meta"><span>WORLD CORPUS</span><span>MAIN ONLY</span><span className="live">LIVE RESEARCH</span></div>
      </nav>

      <section className="hero">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">FROM MYTH FADES TO LEGEND / v0.1</p>
            <h1>TRACE THE<br/><span>STORY.</span><br/>FIND THE<br/><em>SOURCE.</em></h1>
          </div>
          <aside className="hero-aside">
            <div className="hero-rule" />
            <p>A provenance-first intelligence graph for mythology, narrative integrity, reference deviation, evidence, and explainable Mizan.</p>
            <div className="hero-actions">
              <button type="button" onClick={() => document.getElementById("explorer")?.scrollIntoView({ behavior: "smooth" })}>EXPLORE CORPUS ↗</button>
              <button type="button" className="ghost" onClick={() => document.getElementById("method")?.scrollIntoView({ behavior: "smooth" })}>READ METHOD</button>
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
          <div><p className="eyebrow">MFTL ANALYSIS STACK</p><h2>ONE STORY.<br/>FOUR QUESTIONS.</h2></div>
          <p className="section-copy">“Myth”, “false”, “deviant”, and “shirk” are not synonyms. Each conclusion lives in its own evidence-backed layer.</p>
        </div>
        <div className="layer-grid">
          {layers.map((item) => (
            <article className="layer-card" key={item.code}>
              <div className="layer-top"><span className="mono">{item.code}</span><span className="signal">{item.signal}</span></div>
              <p className="overline">{item.subtitle}</p><h3>{item.title}</h3><p>{item.description}</p><div className="scanline" />
            </article>
          ))}
        </div>
      </section>

      <section className="section intelligence">
        <div className="section-head compact">
          <div><p className="eyebrow">INTELLIGENCE OBJECTS</p><h2>MORE THAN<br/>MYTHS.</h2></div>
          <p className="section-copy">MFTL stores the thing being investigated separately from the verdict about it.</p>
        </div>
        <div className="family-grid">
          {families.map(([code,title,desc]) => <div className="family" key={code}><span>{code}</span><strong>{title}</strong><small>{desc}</small></div>)}
        </div>
      </section>

      <section className="section explorer" id="explorer">
        <div className="section-head compact">
          <div><p className="eyebrow">CORPUS EXPLORER</p><h2>SEARCH THE<br/>EVIDENCE GRAPH.</h2></div>
          <div>
            <input className="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="SEARCH ID · NAME · TYPE · REGION" aria-label="Search corpus" />
            <p className="section-copy explorer-note">{counts.canonical_records} canonical · {counts.candidates} active candidates · {counts.merged_candidates} merged · {counts.entities} entities · {counts.claims} claims</p>
          </div>
        </div>
        {visibleRecords.length > 0 ? (
          <div className="record-list">
            {visibleRecords.map((record) => (
              <article className="record-row" key={record.id}>
                <span className="record-id">{record.id}</span>
                <div><strong>{record.title}</strong><small>{record.family} / {record.record_type}</small></div>
                <span>{record.region ?? "GLOBAL / UNKNOWN"}</span>
                <span>{record.status}</span>
                <span>{record.confidence == null ? "—" : Math.round(record.confidence * 100) + "%"}</span>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span>NO CANONICAL RECORDS YET</span>
            <strong>THE QUEUE IS OPEN.</strong>
            <p>Hourly research will populate this view from validated repository data.</p>
          </div>
        )}
      </section>

      <section className="section world">
        <div className="section-head compact">
          <div><p className="eyebrow">WORLD COVERAGE</p><h2>THE MAP IS<br/>THE QUEUE.</h2></div>
          <p className="section-copy">Hourly research prioritizes under-covered regions instead of repeatedly mining the same famous mythologies.</p>
        </div>
        <div className="region-grid">
          {regions.map(([code,name,desc]) => <div className="region" key={code}><span>{code}</span><strong>{name}</strong><small>{desc}</small><i /></div>)}
        </div>
      </section>

      <section className="section terminal">
        <p className="eyebrow">EVIDENCE CONTRACT</p>
        <div className="terminal-line"><span>CLAIM</span><b>→</b><span>SUPPORT</span><b>+</b><span>COUNTEREVIDENCE</span><b>+</b><span>ALTERNATIVE</span><b>+</b><span>UNCERTAINTY</span></div>
        <p>Credibility requires preserving what weakens your own hypothesis.</p>
      </section>

      <footer><span>MFTL</span><span>WHERE MYTH FADES TO LEGEND</span><span>TRACE · VERIFY · WEIGH · REVEAL</span></footer>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);

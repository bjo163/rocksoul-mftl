import React from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const pillars = [
  ["01", "TRACE", "Follow every claim back to a source."],
  ["02", "SEPARATE", "Story, belief, ritual, worship, and verdict are different layers."],
  ["03", "WEIGH", "Evidence first. Confidence is explicit."],
  ["04", "REVEAL", "Turn mythology into a navigable world evidence graph."]
];

function App() {
  return (
    <main>
      <section className="hero">
        <div className="eyebrow">MOONWITNESS / ROCKSOUL RESEARCH</div>
        <h1>FROM MYTH<br/><span>FADES TO LEGEND</span></h1>
        <p className="lead">Expose the myth. Trace the source. Separate story from truth.</p>
        <div className="status"><i /> WORLD MYTH CORPUS — FOUNDATION v0.1</div>
      </section>

      <section className="manifesto">
        <div>
          <p className="kicker">THE METHOD</p>
          <h2>NOT A LIST OF GODS.<br/>AN EVIDENCE GRAPH.</h2>
        </div>
        <p>
          MFTL maps entities, claims, rituals, symbols, sources, historical evidence,
          and optional theological assessments without collapsing them into one label.
        </p>
      </section>

      <section className="grid">
        {pillars.map(([n,t,d]) => (
          <article key={n}>
            <span>{n}</span>
            <h3>{t}</h3>
            <p>{d}</p>
          </article>
        ))}
      </section>

      <section className="pipeline">
        <p className="kicker">CORPUS PIPELINE</p>
        <div>MYTH → CLAIM → PRACTICE → SOURCE → EVIDENCE → MIZAN → LEGEND</div>
      </section>

      <footer>
        <span>MFTL</span>
        <span>WHERE MYTH FADES TO LEGEND</span>
        <span>PROVENANCE FIRST</span>
      </footer>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);

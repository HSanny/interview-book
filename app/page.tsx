"use client";

import { useEffect, useMemo, useState } from "react";

type Pattern = {
  name: string;
  signal: string;
  method: string[];
  questions: string[];
  scenario: string;
  complexity: string;
};

const patterns: Pattern[] = [
  {
    name: "Hash map / set",
    signal: "Fast lookup, duplicates, frequency counts, or matching complements.",
    method: ["Define exactly what must be looked up.", "Scan once while storing only useful state.", "Check before inserting when the same item cannot match itself."],
    questions: ["Two Sum", "Group Anagrams", "Longest Consecutive Sequence"],
    scenario: "Deduplicate crawl results or count events per customer in a stream.",
    complexity: "Usually O(n) time and O(n) space.",
  },
  {
    name: "Two pointers",
    signal: "Sorted input, pair/triplet search, palindrome, or in-place compaction.",
    method: ["Place pointers at meaningful boundaries.", "Use the ordering/invariant to decide which pointer moves.", "Prove that the discarded region cannot contain the answer."],
    questions: ["Valid Palindrome", "3Sum", "Container With Most Water"],
    scenario: "Merge ranked result lists or remove duplicate records in place.",
    complexity: "Usually O(n) time and O(1) auxiliary space.",
  },
  {
    name: "Sliding window",
    signal: "Contiguous subarray/substring with a longest, shortest, or count constraint.",
    method: ["Define the window validity condition.", "Expand the right edge.", "Shrink the left edge until valid; update the answer at the correct moment."],
    questions: ["Longest Substring Without Repeating Characters", "Minimum Window Substring", "Permutation in String"],
    scenario: "Detect a traffic spike or enforce a rolling API-rate limit.",
    complexity: "O(n) when each pointer moves forward at most n times.",
  },
  {
    name: "Stack / monotonic stack",
    signal: "Nested structure, undo order, or next greater/smaller element.",
    method: ["Choose what unresolved item the stack represents.", "Pop while the current item resolves the top.", "Store indices when distance or position matters."],
    questions: ["Valid Parentheses", "Daily Temperatures", "Largest Rectangle in Histogram"],
    scenario: "Parse nested expressions or calculate wait time until a metric threshold changes.",
    complexity: "Typically O(n) time and O(n) space.",
  },
  {
    name: "Binary search",
    signal: "Sorted data or a monotonic yes/no feasibility condition.",
    method: ["State the invariant and search interval.", "Choose exact-match or first/last-valid template.", "Test empty input and boundary convergence."],
    questions: ["Search in Rotated Sorted Array", "Koko Eating Bananas", "Find Minimum in Rotated Sorted Array"],
    scenario: "Find a latency threshold or minimum server capacity that satisfies an SLA.",
    complexity: "O(log n) iterations; feasibility checks may add cost.",
  },
  {
    name: "Heap / priority queue",
    signal: "Repeated minimum/maximum, top-k, scheduling, or merging sorted streams.",
    method: ["Decide whether the heap stores candidates or the current best k.", "Keep only necessary entries.", "Use a tie-breaker when priorities may match."],
    questions: ["Kth Largest Element", "Top K Frequent Elements", "Merge K Sorted Lists"],
    scenario: "Maintain top search results or schedule the next background job.",
    complexity: "Commonly O(n log k) time and O(k) space.",
  },
  {
    name: "Trees: DFS / BFS",
    signal: "Hierarchy, paths, levels, ancestors, or recursive substructure.",
    method: ["Define what one recursive call returns, or what one queue level means.", "Write the base case first.", "Combine child results without leaking global state."],
    questions: ["Binary Tree Level Order Traversal", "Lowest Common Ancestor", "Diameter of Binary Tree"],
    scenario: "Traverse a document hierarchy or evaluate an organization permission tree.",
    complexity: "Usually O(n) time; space is O(height) for DFS or O(width) for BFS.",
  },
  {
    name: "Graphs",
    signal: "Arbitrary relationships, connectivity, dependencies, shortest path, or cycles.",
    method: ["Build/identify the adjacency representation.", "Choose BFS, DFS, topological sort, union-find, or Dijkstra from the goal.", "Mark visited at the right time and handle disconnected components."],
    questions: ["Number of Islands", "Course Schedule", "Clone Graph"],
    scenario: "Resolve service dependencies or crawl links without revisiting pages.",
    complexity: "Traversal is O(V + E) time and O(V) space.",
  },
  {
    name: "Intervals",
    signal: "Overlapping ranges, schedules, bookings, or coverage.",
    method: ["Sort by start time unless the input already has structure.", "Compare with the last merged interval.", "Be explicit about whether touching endpoints overlap."],
    questions: ["Merge Intervals", "Insert Interval", "Meeting Rooms II"],
    scenario: "Merge worker availability or detect conflicting batch windows.",
    complexity: "Usually O(n log n) due to sorting.",
  },
  {
    name: "Backtracking",
    signal: "Enumerate combinations, permutations, partitions, or constrained choices.",
    method: ["Define state, choices, and completion condition.", "Choose → recurse → undo.", "Prune as soon as a partial solution cannot succeed."],
    questions: ["Subsets", "Combination Sum", "Word Search"],
    scenario: "Explore compatible configuration combinations under constraints.",
    complexity: "Often exponential; explain pruning and output-size cost.",
  },
  {
    name: "Dynamic programming",
    signal: "Optimal/counting result with overlapping subproblems and a reusable state.",
    method: ["Write the state in one sentence.", "Derive transition and base cases.", "Choose memoization first, then compress space if useful."],
    questions: ["House Robber", "Coin Change", "Longest Increasing Subsequence"],
    scenario: "Minimize compute cost across staged processing choices.",
    complexity: "Number of states × transition cost.",
  },
];

const chapters = [
  { id: "overview", label: "Campaign overview" },
  { id: "coding", label: "Coding patterns" },
  { id: "system", label: "System design" },
  { id: "ml", label: "ML & research" },
  { id: "resume", label: "Resume defense" },
  { id: "projects", label: "Three projects" },
  { id: "company", label: "Company & leadership" },
  { id: "exa", label: "Exa field study" },
  { id: "risk", label: "Technology & risk" },
  { id: "plan", label: "4–6 week plan" },
];

const tasks = [
  "Create a defense sheet for every substantive resume bullet",
  "Complete representative coding questions before timed sets",
  "Run two 45–60 minute system-design mocks",
  "Make all three projects reproducible and demo-ready",
  "Create a one-page dossier for each scheduled company",
  "Use Exa APIs and record retrieval quality, latency, and failures",
];

function Chapter({ id, kicker, title, children }: { id: string; kicker: string; title: string; children: React.ReactNode }) {
  return <section id={id} className="chapter"><p className="kicker">{kicker}</p><h2>{title}</h2>{children}</section>;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [done, setDone] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setDone(JSON.parse(localStorage.getItem("handbook-progress") || "[]"));
    setNotes(localStorage.getItem("handbook-notes") || "");
  }, []);
  useEffect(() => { localStorage.setItem("handbook-progress", JSON.stringify(done)); }, [done]);
  const filtered = useMemo(() => patterns.filter(p => JSON.stringify(p).toLowerCase().includes(query.toLowerCase())), [query]);
  const toggle = (task: string) => setDone(v => v.includes(task) ? v.filter(x => x !== task) : [...v, task]);

  return (
    <div className="shell">
      <aside>
        <a className="brand" href="#overview"><span>IH</span> Interview Handbook</a>
        <nav>{chapters.map((c, i) => <a key={c.id} href={`#${c.id}`}><b>{String(i + 1).padStart(2, "0")}</b>{c.label}</a>)}</nav>
        <div className="side-note"><strong>{done.length}/{tasks.length} campaign actions</strong><div className="meter"><i style={{ width: `${done.length / tasks.length * 100}%` }} /></div><small>Progress is saved on this device.</small></div>
      </aside>

      <main>
        <header>
          <div><p className="eyebrow">Living technical interview playbook · v0.1</p><h1>Prepare to reason,<br /><em>not recite.</em></h1><p className="lede">An editable, expandable handbook for SWE, ML/AI, Research, ML Systems, and generalist interviews.</p></div>
          <div className="campaign"><span>ACTIVE CAMPAIGN</span><strong>4–6 weeks</strong><p>Patterns → practice → simulation</p></div>
        </header>

        <Chapter id="overview" kicker="01 · Operating system" title="Campaign overview">
          <div className="principle">“No need to know everything. No major technical area where you cannot reason from fundamentals.”</div>
          <div className="track-grid">
            {[['Coding','Recognize structures and communicate solutions.'],['System design','Scale, fail, recover, and explain trade-offs.'],['ML systems','Move from model ideas to reliable production.'],['Evidence','Defend the resume and demonstrate real projects.'],['Company','Understand product, direction, customers, and hard problems.'],['Risk','Prioritize data, security, evaluation, cost, and governance.']].map(x => <div className="track" key={x[0]}><span>●</span><h3>{x[0]}</h3><p>{x[1]}</p></div>)}
          </div>
          <h3 className="subhead">Campaign actions</h3>
          <div className="checklist">{tasks.map(t => <label key={t}><input type="checkbox" checked={done.includes(t)} onChange={() => toggle(t)} /><span>{t}</span></label>)}</div>
        </Chapter>

        <Chapter id="coding" kicker="02 · Core interview skill" title="Coding patterns">
          <p className="intro">Use the same loop every time: clarify → examples → brute force → bottleneck → optimize → complexity → implement → edge cases. Search the library, then expand a pattern.</p>
          <input className="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search patterns, questions, or real-world scenarios…" aria-label="Search coding patterns" />
          <div className="patterns">{filtered.map((p, i) => <details key={p.name} open={i === 0 && query === ""}><summary><span className="pattern-num">{String(i + 1).padStart(2, "0")}</span><span><strong>{p.name}</strong><small>{p.signal}</small></span><i>＋</i></summary><div className="pattern-body"><div><h4>Solution method</h4><ol>{p.method.map(x => <li key={x}>{x}</li>)}</ol><p className="complexity">{p.complexity}</p></div><div><h4>Representative questions</h4><ul>{p.questions.map(x => <li key={x}>{x}</li>)}</ul><h4>Engineering scenario</h4><p>{p.scenario}</p></div></div></details>)}</div>
        </Chapter>

        <Chapter id="system" kicker="03 · Architecture" title="System design">
          <p className="principle">Design the data lifecycle first. The model or agent is one component inside a system that must remain correct, secure, observable, and affordable.</p>

          <h3 className="subhead">The three-path mental model</h3>
          <div className="system-planes">
            <div><b>01 · Live serving path</b><h3>Answer or act now</h3><p>Gateway → identity → retrieval/features → model or agent → tools → response. Budget every hop for latency, reliability, and cost.</p></div>
            <div><b>02 · Data & knowledge path</b><h3>Keep the system fresh</h3><p>Sources → log/queue → validate → transform → store/index → publish. Track versions, lineage, deletions, backfills, and access rules.</p></div>
            <div><b>03 · Evaluation & control path</b><h3>Know when it is wrong</h3><p>Traces + feedback → quality/security evals → dashboards → alert or rollback. Govern prompts, models, tools, and datasets as versioned releases.</p></div>
          </div>

          <details className="lesson" open><summary>Reusable 45–60 minute interview structure</summary><div className="interview-steps"><ol><li><b>Frame (0–5 min).</b> Users, top two use cases, out-of-scope work, traffic shape, data volume, regions, privacy class, and success metrics.</li><li><b>Set targets (5–10).</b> Availability, p95/p99 latency, freshness, durability, quality, recovery time, and cost ceiling. Estimate QPS, storage, and model tokens.</li><li><b>Define contracts (10–15).</b> APIs, events, identifiers, schemas, tenancy, authorization, retention, and idempotency keys.</li><li><b>Draw all three paths (15–25).</b> Separate synchronous serving from asynchronous ingestion/training and evaluation/control.</li><li><b>Deep-dive (25–40).</b> Pick the hardest invariant: permissions, point-in-time features, durable agent actions, index freshness, or global consistency.</li><li><b>Attack the design (40–50).</b> Duplicates, late data, poison events, partial failure, regional loss, stale ACLs, model degradation, and runaway cost.</li><li><b>Evolve (50–60).</b> Explain the simple v1, the first bottleneck, 10×/100× changes, rollout, migration, observability, and explicit trade-offs.</li></ol><aside className="answer-rule"><b>Say this aloud</b><p>“The invariant I refuse to break is …”</p><p>“I am choosing X over Y because …”</p><p>“We will detect failure through … and recover by …”</p></aside></div></details>

          <h3 className="subhead">Five representative systems</h3>
          <div className="case-studies">
            <details open><summary><span>01</span><strong>Enterprise RAG + answer agent</strong><small>Retrieval, permissions, freshness, grounding</small></summary><div className="case-body"><p className="flow"><b>Knowledge:</b> connectors / CDC → durable queue → parse + dedupe → chunk → embed → hybrid index + ACL metadata</p><p className="flow"><b>Query:</b> auth → query rewrite → hybrid retrieve → rerank → context builder → model/tool loop → cited answer</p><p className="flow"><b>Control:</b> trace + feedback → retrieval/grounding evals → canary → rollback</p><div className="trade-grid"><div><h4>Core invariants</h4><ul><li>A user never retrieves a document they cannot open.</li><li>Updates and deletes reach every derived store.</li><li>Every answer is traceable to source, prompt, model, and index versions.</li></ul></div><div><h4>Deep-dive questions</h4><ul><li>Hybrid search or vector-only? Chunking by structure or tokens?</li><li>How do ACL changes invalidate caches and indexes?</li><li>What happens during embedding-model migration?</li></ul></div><div><h4>Measure</h4><p>Recall@K, NDCG, groundedness, citation precision, task success, p95 latency, freshness lag, cost/query.</p></div></div></div></details>
            <details><summary><span>02</span><strong>Real-time recommendation platform</strong><small>Streaming features, training/serving parity, drift</small></summary><div className="case-body"><p className="flow"><b>Online:</b> events → log → stream processor → online feature store → candidate retrieval → ranker → response</p><p className="flow"><b>Offline:</b> immutable lake → point-in-time feature jobs → training → validation → registry → staged deployment</p><div className="trade-grid"><div><h4>Core invariants</h4><ul><li>No future data leaks into historical training examples.</li><li>Online and offline feature definitions agree.</li><li>Every prediction maps to data and model versions.</li></ul></div><div><h4>Failure drills</h4><ul><li>Late/out-of-order events and backfills.</li><li>Feature-store outage: defaults, cached features, or fallback ranker?</li><li>Silent schema change and distribution drift.</li></ul></div><div><h4>Measure</h4><p>CTR/conversion plus calibration, diversity, freshness, drift, feature missingness, p99 serving latency, rollback rate.</p></div></div></div></details>
            <details><summary><span>03</span><strong>Multi-tenant agent execution platform</strong><small>Durable workflows, tools, isolation, budgets</small></summary><div className="case-body"><p className="flow"><b>Execution:</b> API → durable orchestrator/state machine → model gateway → policy-aware tool registry → isolated workers → checkpoint/event log</p><p className="flow"><b>Safety:</b> scoped identity + secrets → input/output guardrails → approval gates → audit trail</p><div className="trade-grid"><div><h4>Core invariants</h4><ul><li>A retry cannot repeat a side effect such as payment or email.</li><li>Tenant data, tools, secrets, and quotas remain isolated.</li><li>Long jobs resume from checkpoints instead of starting over.</li></ul></div><div><h4>Deep-dive questions</h4><ul><li>At-least-once delivery + idempotency, or stronger coordination?</li><li>How are tool permissions bound to user intent?</li><li>When do we require human approval or compensation?</li></ul></div><div><h4>Measure</h4><p>Task success, unsafe-action rate, tool error rate, retries, time-to-complete, tokens/task, queue age, tenant saturation.</p></div></div></div></details>
            <details><summary><span>04</span><strong>Privacy-preserving learning</strong><small>On-device data, federated learning, differential privacy</small></summary><div className="case-body"><p className="flow"><b>Flow:</b> eligible devices → local training/privatization → encrypted upload → secure aggregation → validation → privacy-budget accounting → model release</p><div className="trade-grid"><div><h4>Core invariants</h4><ul><li>Raw personal data is minimized and remains on-device where possible.</li><li>Published aggregates respect an explicit privacy budget.</li><li>Deletion, consent, retention, and audit rules apply to derived data.</li></ul></div><div><h4>Trade-offs</h4><p>Privacy vs utility; device bandwidth/battery vs update frequency; representative sampling vs eligibility; server visibility vs debuggability.</p></div><div><h4>Failure drills</h4><p>Malicious clients, biased device participation, poisoned updates, privacy-budget exhaustion, interrupted rounds, and model regression.</p></div></div></div></details>
            <details><summary><span>05</span><strong>Global metadata and state store</strong><small>Spanner-style correctness vs Dynamo-style availability</small></summary><div className="case-body"><div className="compare"><div><b>Choose strong consistency</b><p>Permissions, billing, job ownership, model release state, and uniqueness constraints. Pay coordination latency to preserve correctness.</p></div><div><b>Choose high availability / eventual consistency</b><p>Shopping carts, presence, caches, and reconstructable metadata. Accept versions, conflict resolution, or stale reads.</p></div></div><p className="flow"><b>Discuss:</b> partition key → replication → quorum/leader → transaction boundary → read mode → conflict policy → multi-region failure → recovery objective.</p></div></details>
          </div>

          <h3 className="subhead">Data-store decision sheet</h3>
          <div className="table-wrap"><table className="decision-table"><thead><tr><th>Store</th><th>Best fit</th><th>Key design question</th></tr></thead><tbody><tr><td>Relational / distributed SQL</td><td>Transactions, constraints, joins, source of truth</td><td>What must commit atomically, and across which regions?</td></tr><tr><td>Key-value / wide-column</td><td>Predictable access at very high scale</td><td>Can the partition key distribute load without losing queryability?</td></tr><tr><td>Object store + lakehouse</td><td>Immutable raw data, training sets, backfills</td><td>How are schema, snapshots, lineage, and retention enforced?</td></tr><tr><td>Search + vector index</td><td>Lexical/semantic retrieval and ranking</td><td>How do freshness, deletion, ACLs, and version migration work?</td></tr><tr><td>Log / stream</td><td>Ordered change history and decoupled consumers</td><td>What are the delivery, ordering, replay, and dedupe guarantees?</td></tr><tr><td>Feature / trace store</td><td>Low-latency ML features or agent observability</td><td>How do online/offline parity, sampling, PII, and TTLs work?</td></tr></tbody></table></div>

          <h3 className="subhead">Architecture lessons from production systems</h3>
          <div className="reference-grid">
            <a href="https://research.google/pubs/spanner-googles-globally-distributed-database-2/" target="_blank" rel="noreferrer"><b>Google · Spanner</b><p>Global transactions and externally consistent reads show when correctness merits coordination and clock/replication complexity.</p><span>Primary paper ↗</span></a>
            <a href="https://research.google/pubs/tfx-a-tensorflow-based-production-scale-machine-learning-platform/" target="_blank" rel="noreferrer"><b>Google · TFX</b><p>Validation, lineage, continuous refresh, and serving belong in the architecture—not as cleanup after model training.</p><span>Primary paper ↗</span></a>
            <a href="https://www.amazon.science/publications/dynamo-amazons-highly-available-key-value-store" target="_blank" rel="noreferrer"><b>Amazon · Dynamo</b><p>An always-on store can deliberately favor availability, using versions, quorums, and conflict resolution when business semantics permit.</p><span>Primary paper ↗</span></a>
            <a href="https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/" target="_blank" rel="noreferrer"><b>Amazon · Builders’ Library</b><p>Retries are safe only when the API makes caller intent explicit and records idempotency with the mutation.</p><span>Engineering article ↗</span></a>
            <a href="https://machinelearning.apple.com/research/learning-with-privacy-at-scale" target="_blank" rel="noreferrer"><b>Apple · Privacy at scale</b><p>Local differential privacy demonstrates how privacy constraints reshape collection, aggregation, identifiers, bandwidth, and utility.</p><span>Research article ↗</span></a>
          </div>

          <details className="lesson"><summary>Failure-injection checklist: use this on every design</summary><div className="failure-grid">{["Duplicate request after a timeout","Late or out-of-order event","Hot tenant or partition","Queue backlog / poison message","Stale cache or access rule","Partial index or backfill","Schema or embedding change","Tool succeeds but reply is lost","Regional dependency outage","Silent model-quality regression","PII enters logs or traces","Traffic or token-cost spike"].map(x => <span key={x}>□ {x}</span>)}</div></details>
          <p className="prompt-line"><b>Practice progression:</b> Start with a notification service → then a web crawler/search index → recommendation platform → enterprise RAG → durable agent platform → privacy-preserving learning system. For each, submit one architecture, one data model, one capacity estimate, three failure drills, and a 10× evolution plan.</p>
        </Chapter>

        <Chapter id="ml" kicker="04 · Models to production" title="ML, AI & research fundamentals">
          <div className="four-col">{[['ML basics','Bias/variance, regularization, leakage, imbalance, metrics, validation.'],['Deep learning','Backprop, optimization, normalization, attention, transformers.'],['Research','Hypothesis, baseline, ablation, error analysis, reproducibility.'],['ML systems','Pipelines, serving, batching, quantization, drift, latency/throughput.'],['Retrieval','BM25, embeddings, ANN/HNSW, hybrid search, reranking.'],['LLM & agents','RAG, tool use, routing, memory, evals, injection, reliability.']].map(x => <div key={x[0]}><h3>{x[0]}</h3><p>{x[1]}</p></div>)}</div>
        </Chapter>

        <Chapter id="resume" kicker="05 · Evidence under pressure" title="Resume defense">
          <p className="intro">Turn every substantive bullet into a 5–10 minute technical conversation.</p>
          <div className="defense">{['Problem & constraints','Data & architecture','Algorithm/model choice','Personal implementation','Alternatives & trade-offs','Evaluation & metrics','Optimization & deployment','Security & failure cases','What I would improve'].map((x,i)=><div key={x}><b>{String(i+1).padStart(2,'0')}</b><span>{x}</span></div>)}</div>
        </Chapter>

        <Chapter id="projects" kicker="06 · Demonstrable work" title="Three personal projects">
          <div className="project-list"><details open><summary>Activity & Demand Forecasting Engine</summary><p>Interactions → recommendation/sequential model → demand forecast → product retrieval → grounded agent.</p><b>Ship:</b> metrics, reproducible run, architecture diagram, README, and demo.</details><details><summary>Motion & Behaviour Analyser</summary><p>Video → detection → tracking → trajectory → behaviour/event logic → output or alert.</p><b>Measure:</b> FPS, latency, occlusion, ID switching, and failure cases.</details><details><summary>Water Surface & Level Reader</summary><p>Image → preprocessing → segmentation/edge fusion → OCR calibration → water-level output.</p><b>Measure:</b> labelled evaluation set, error, runtime, and visual failure examples.</details></div>
        </Chapter>

        <Chapter id="company" kicker="07 · Leadership conversations" title="Company intelligence">
          <div className="four-col"><div><h3>Product</h3><p>Use it. Know the main workflow, strengths, weaknesses, and target user.</p></div><div><h3>Vision</h3><p>Explain what the company is trying to become—not only what it sells today.</p></div><div><h3>Customers</h3><p>Who pays, what pain is urgent, and why the product wins.</p></div><div><h3>Technical problems</h3><p>Infer the hardest architecture, data, quality, reliability, and scaling problems.</p></div></div>
          <p className="prompt-line"><b>Interview output:</b> a one-page dossier + three informed product opinions + five questions for leadership.</p>
        </Chapter>

        <Chapter id="exa" kicker="08 · Company-specific overlay" title="Exa field study">
          <div className="pipeline"><span>Crawl</span><i>→</i><span>Parse</span><i>→</i><span>Index</span><i>→</i><span>Retrieve</span><i>→</i><span>Rank</span><i>→</i><span>Serve</span></div>
          <div className="matrix"><div><h3>Use</h3><p>Test Search and Contents APIs with semantic, exact, long, and fresh-information queries.</p></div><div><h3>Observe</h3><p>Record relevance, latency, duplication, freshness, ranking behaviour, and failures.</p></div><div><h3>Build</h3><p>Create a small research workflow: decompose → search → extract → rerank → synthesize → cite.</p></div></div>
          <div className="lab-note"><b>Lab notebook prompts</b><span>What works extremely well?</span><span>Where does retrieval fail?</span><span>Which engineering stage might cause it?</span><span>What would I investigate next?</span></div>
        </Chapter>

        <Chapter id="risk" kicker="09 · What is at stake" title="Technology direction & production risk">
          <div className="risk-grid">{[['DATA','Quality · provenance · freshness · ownership · leakage · bias'],['SECURITY','Prompt injection · tool abuse · exfiltration · secrets · sandboxing'],['PRIVACY','PII · retention · access control · training-data use'],['RELIABILITY','Hallucination · retrieval errors · nondeterminism · fallback'],['EVALUATION','Offline/online metrics · leakage · adversarial tests'],['COST','Tokens · inference · GPU · caching · model selection'],['OBSERVABILITY','Tracing · logging · monitoring · agent debugging'],['GOVERNANCE','Auditability · regulation · oversight · explainability']].map(x=><div key={x[0]}><b>{x[0]}</b><p>{x[1]}</p></div>)}</div>
        </Chapter>

        <Chapter id="plan" kicker="10 · Execution" title="Aggressive 4–6 week plan">
          <div className="timeline"><div><b>WEEKS 1–2</b><h3>Foundation + defense</h3><p>Core coding patterns, distributed-systems basics, resume walkthroughs, project audit.</p></div><div><b>WEEKS 3–4</b><h3>Systems + depth</h3><p>Graphs/DP, search and streaming design, ML systems/retrieval, first polished demo.</p></div><div><b>WEEKS 5–6</b><h3>Simulation + tailoring</h3><p>Timed mocks, aggressive follow-ups, company dossiers, product use, project demos.</p></div></div>
          <h3 className="subhead">Working notes</h3><textarea value={notes} onChange={e => {setNotes(e.target.value); localStorage.setItem("handbook-notes", e.target.value)}} placeholder="Capture weak areas, mock feedback, company observations, and next actions…" />
        </Chapter>
        <footer><b>INTERVIEW HANDBOOK</b><span>Built to evolve in GitHub · Personal progress stays in your browser</span></footer>
      </main>
    </div>
  );
}

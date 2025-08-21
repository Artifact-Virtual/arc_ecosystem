import React, {useMemo, useState, useEffect} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Clock, Rocket, AlertTriangle, Search, Filter,
  ChevronDown, ChevronRight, ExternalLink, Layers, Calendar,
  Tag, X, Copy, ArrowRight, ListTree, LayoutGrid, Link as LinkIcon
} from "lucide-react";

/**
 * ARCx Phased Roadmap — single-file React component
 * - TailwindCSS styling
 * - Framer Motion animations
 * - Filter by status and tags, search, and view toggle (Cards/Timeline)
 * - Dense, precise, and truthful to the project state (editable DATA below)
 *
 * Drop into any React app with Tailwind & framer-motion & lucide-react installed.
 * Default export <ARCxRoadmap /> renders the full roadmap UI.
 */

// === Constants & Links (edit here if addresses change) ======================
const CONTRACT = "0xA4093669DAFbD123E37d52e0939b3aB3C2272f44";
const LINKS = {
  basescan: `https://basescan.org/address/${CONTRACT}`,
  basescanCode: `https://basescan.org/address/${CONTRACT}#code`,
  sourcify: `https://repo.sourcify.dev/contracts/full_match/8453/${CONTRACT}/`,
  uniswapSwap: `https://app.uniswap.org/swap?inputCurrency=${CONTRACT}&chain=base`,
  uniswapInfo: `https://info.uniswap.org/#/base/tokens`, // search ARCx there
  docs: "https://artifact-virtual.github.io/arcx_ecosystem/documentation.html",
  repo: "https://github.com/Artifact-Virtual/arcx_token",
  site: "https://artifact-virtual.github.io/arcx_token",
  discord: "https://discord.gg/nJkT4JMc",
};

// === Status dictionary ======================================================
const STATUS = {
  done: { label: "Complete", color: "text-emerald-300", bg: "bg-emerald-500/10", icon: CheckCircle2 },
  live: { label: "Live", color: "text-sky-300", bg: "bg-sky-500/10", icon: Rocket },
  next: { label: "Next", color: "text-amber-300", bg: "bg-amber-500/10", icon: Clock },
  planned: { label: "Planned", color: "text-slate-300", bg: "bg-slate-500/10", icon: Layers },
  risk: { label: "Risk / Watch", color: "text-rose-300", bg: "bg-rose-500/10", icon: AlertTriangle },
};

// === Roadmap Data ===========================================================
/**
 * Each phase contains items. Keep copy terse; link out for details.
 * status: "done" | "live" | "next" | "planned" | "risk"
 * tags: choose from: token, liquidity, governance, rwa, security, infra, community, docs, dashboard, treasury, vesting, devops
 */
const PHASES = [
  {
    key: "p0",
    title: "Phase 0 — Foundation & Recovery",
    timeframe: "Q2–Q3 2025",
    summary: "Hardening after incident, deterministic supply controls, verified deployments, and treasury hygiene.",
    items: [
      {
        id: "p0-1",
        title: "ERC‑20 ARCx deployed (Base Mainnet)",
        desc: "Verified on BaseScan & Sourcify. Fixed cap; minting finalized.",
        status: "done",
        tags: ["token", "security"],
        links: [LINKS.basescan, LINKS.sourcify, LINKS.repo],
        date: "2025-07-30",
      },
      {
        id: "p0-2",
        title: "Treasury & Vesting Master Contracts wired",
        desc: "Core team vesting initialized; category allocations staged; Safe control validated.",
        status: "done",
        tags: ["treasury", "vesting", "security"],
        links: [LINKS.docs],
      },
      {
        id: "p0-3",
        title: "Incident containment & rollback",
        desc: "Address hygiene, prompt‑injection fallout contained, supply scars documented, minting lock-in.",
        status: "done",
        tags: ["security", "infra", "devops"],
        links: [LINKS.site],
      },
    ],
  },
  {
    key: "p1",
    title: "Phase 1 — Launch & Liquidity",
    timeframe: "Q3 2025 (live)",
    summary: "Public markets opened; LP live; transparency site and per‑link QR landing shipped.",
    items: [
      {
        id: "p1-1",
        title: "Uniswap V4 pool live",
        desc: "Trading open; LP seeded; additional liquidity added on a schedule.",
        status: "live",
        tags: ["liquidity"],
        links: [LINKS.uniswapSwap, LINKS.uniswapInfo],
      },
      {
        id: "p1-2",
        title: "Dutch auction closed; remainder returned to treasury",
        desc: "Leftover tokens routed back; queued for future LP top‑ups.",
        status: "done",
        tags: ["treasury", "liquidity"],
        links: [LINKS.basescan],
      },
      {
        id: "p1-3",
        title: "Docs & transparency site",
        desc: "Contract addresses, ABI/bytecode verification, allocations, QR swaps.",
        status: "live",
        tags: ["docs", "community"],
        links: [LINKS.docs, LINKS.site, LINKS.repo],
      },
      {
        id: "p1-4",
        title: "Community channel",
        desc: "Discord online for governance prep and technical support.",
        status: "live",
        tags: ["community"],
        links: [LINKS.discord],
      },
    ],
  },
  {
    key: "p2",
    title: "Phase 2 — Governance Bootstrap",
    timeframe: "Q3–Q4 2025",
    summary: "Deterministic eligibility engine, SBT issuance, MACI pilot, and guarded treasuries.",
    items: [
      {
        id: "p2-1",
        title: "Eligibility engine (TOKEN + SBT + RWA masks)",
        desc: "On‑chain gate computes per‑proposal weights with component caps.",
        status: "next",
        tags: ["governance", "security"],
        links: [LINKS.docs],
      },
      {
        id: "p2-2",
        title: "Identity SBT issuance",
        desc: "Soulbound roles for contributors; decay & revocation semantics.",
        status: "next",
        tags: ["governance", "community"],
      },
      {
        id: "p2-3",
        title: "Timelock + Safe Executor wired",
        desc: "Topic‑specific delays; bytecode‑limited emergency brake (dual quorum).",
        status: "planned",
        tags: ["governance", "security"],
      },
      {
        id: "p2-4",
        title: "MACI pilot on test proposal",
        desc: "Anti‑collusion voting with per‑layer delegation adapters.",
        status: "planned",
        tags: ["governance", "security"],
      },
    ],
  },
  {
    key: "p3",
    title: "Phase 3 — RWA Integration (Pilot)",
    timeframe: "Q4 2025",
    summary: "Attestation schemas, operator staking, dispute + slashing, limited governance weight caps.",
    items: [
      {
        id: "p3-1",
        title: "EAS schemas for ENERGY/CARBON",
        desc: "Versioned fields, issuer lists, 2‑of‑N oracle signatures.",
        status: "planned",
        tags: ["rwa", "security"],
      },
      {
        id: "p3-2",
        title: "Operator staking & dispute module",
        desc: "Fraud proofs → slashing; Reality‑style challenges with bonded evidence.",
        status: "planned",
        tags: ["rwa", "security"],
      },
      {
        id: "p3-3",
        title: "RWA weight caps & recency decay",
        desc: "Conservative caps; raise with proven data quality.",
        status: "planned",
        tags: ["rwa", "governance"],
      },
    ],
  },
  {
    key: "p4",
    title: "Phase 4 — Tooling, Subgraph, and Dashboards",
    timeframe: "Q4 2025–Q1 2026",
    summary: "Observability and UX: subgraph, eligibility explorer, proposal drill‑downs, oracle SLAs.",
    items: [
      {
        id: "p4-1",
        title: "Subgraph indexing",
        desc: "Proposals, weights, tallies, executions, oracle updates, disputes.",
        status: "planned",
        tags: ["infra", "dashboard"],
      },
      {
        id: "p4-2",
        title: "Eligibility explorer UI",
        desc: "Per‑address topic breakdown; transparency for weight math.",
        status: "planned",
        tags: ["dashboard", "governance"],
      },
      {
        id: "p4-3",
        title: "Governance portal",
        desc: "Propose → discuss → vote (MACI) → timelock → execute; docs wired in.",
        status: "planned",
        tags: ["governance", "community", "docs"],
      },
    ],
  },
  {
    key: "p5",
    title: "Phase 5 — Perpetual Autonomy",
    timeframe: "Long‑term",
    summary: "Versioned constitution, migration‑ready modules, param markets, programmatic treasury ops.",
    items: [
      {
        id: "p5-1",
        title: "Versioned governance & migration path",
        desc: "One‑way bridge to vNext; extended timelocks and supermajority.",
        status: "planned",
        tags: ["governance", "security", "infra"],
      },
      {
        id: "p5-2",
        title: "Programmatic LP & treasury strategies",
        desc: "Rules‑based refills; risk‑aware swaps and streaming spend.",
        status: "planned",
        tags: ["treasury", "liquidity"],
      },
    ],
  },
];

// === Helpers ================================================================
const classNames = (...xs) => xs.filter(Boolean).join(" ");

function StatusBadge({ s }) {
  const meta = STATUS[s] || STATUS.planned;
  const Icon = meta.icon;
  return (
    <span className={classNames("inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs",
      meta.bg, "border-white/10", meta.color)}>
      <Icon className="h-3.5 w-3.5" /> {meta.label}
    </span>
  );
}

function TagPill({ t, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 text-slate-200 text-xs border border-white/10">
      <Tag className="h-3 w-3" /> {t}
      {onRemove && (
        <button className="ml-1 hover:text-white/80" onClick={onRemove}>
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </span>
  );
}

function LinkOut({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-sky-300 hover:text-sky-200">
      {children} <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}

const ALL_TAGS = [
  "token", "liquidity", "governance", "rwa", "security", "infra",
  "community", "docs", "dashboard", "treasury", "vesting", "devops"
];

const ALL_STATUSES = Object.keys(STATUS);

// === Main Component =========================================================
export default function ARCxRoadmap() {
  const [q, setQ] = useState("");
  const [view, setView] = useState("cards"); // 'cards' | 'timeline'
  const [activeStatuses, setActiveStatuses] = useState(new Set(["done","live","next","planned","risk"]));
  const [activeTags, setActiveTags] = useState(new Set());

  const flatItems = useMemo(() => {
    return PHASES.flatMap((p, idx) => p.items.map(it => ({...it, phaseIndex: idx, phase: p.title, timeframe: p.timeframe})));
  }, []);

  const filtered = useMemo(() => {
    return flatItems.filter(it => {
      if (!activeStatuses.has(it.status)) return false;
      if (activeTags.size > 0) {
        const hit = it.tags?.some(t => activeTags.has(t));
        if (!hit) return false;
      }
      if (q.trim()) {
        const hay = `${it.title} ${it.desc} ${it.tags?.join(" ") ?? ""}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    }).sort((a,b) => a.phaseIndex - b.phaseIndex);
  }, [flatItems, activeStatuses, activeTags, q]);

  const phaseProgress = useMemo(() => {
    return PHASES.map(p => {
      const total = p.items.length;
      const done = p.items.filter(it => it.status === "done").length;
      const live = p.items.filter(it => it.status === "live").length;
      const pct = Math.round(((done + 0.6*live) / total) * 100);
      return { key: p.key, title: p.title, pct, total, done, live };
    });
  }, []);

  function toggleStatus(s) {
    setActiveStatuses(prev => new Set(prev.has(s) ? [...[...prev].filter(x => x !== s)] : [...prev, s]));
  }
  function toggleTag(t) {
    setActiveTags(prev => new Set(prev.has(t) ? [...[...prev].filter(x => x !== t)] : [...prev, t]));
  }

  function copy(text) {
    navigator.clipboard.writeText(text).catch(()=>{});
  }

  return (
    <div className="min-h-screen bg-[#0b0d12] text-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.header
          initial={{opacity:0, y:10}}
          animate={{opacity:1, y:0}}
          className="rounded-2xl border border-white/10 p-6 bg-gradient-to-b from-white/5 to-white/0 relative overflow-hidden"
        >
          <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl"/>
          <div className="text-xs tracking-widest uppercase text-slate-400">Roadmap</div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mt-1">ARCx — Phased Delivery & Governance Trajectory</h1>
          <p className="text-slate-300 max-w-3xl mt-2 text-sm sm:text-base">
            A dense, truthful snapshot of where we are and what we’re building next.
            Live links below. Filters let you slice by status and capability.
          </p>

          {/* Quick facts */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <LinkIcon className="h-4 w-4 text-sky-300"/>
              <a href={LINKS.basescan} target="_blank" rel="noopener" className="hover:underline">BaseScan</a>
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <LinkIcon className="h-4 w-4 text-sky-300"/>
              <a href={LINKS.uniswapSwap} target="_blank" rel="noopener" className="hover:underline">Uniswap V4 Pool</a>
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <LinkIcon className="h-4 w-4 text-sky-300"/>
              <a href={LINKS.docs} target="_blank" rel="noopener" className="hover:underline">Docs</a>
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <LinkIcon className="h-4 w-4 text-sky-300"/>
              <a href={LINKS.discord} target="_blank" rel="noopener" className="hover:underline">Discord</a>
            </span>
          </div>

          {/* Contract */}
          <div className="mt-4 text-xs sm:text-sm text-slate-300 flex items-center gap-2 flex-wrap">
            <span className="font-mono break-all">{CONTRACT}</span>
            <button
              onClick={() => copy(CONTRACT)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-white/10 bg-white/5 hover:bg-white/10"
              title="Copy address"
            >
              <Copy className="h-3.5 w-3.5"/> Copy
            </button>
          </div>
        </motion.header>

        {/* Controls */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
                <input
                  value={q}
                  onChange={e=>setQ(e.target.value)}
                  placeholder="Search titles, details, tags…"
                  className="w-full pl-10 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                />
              </div>
              <button
                onClick={()=>setView(view === "cards" ? "timeline" : "cards")}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 inline-flex items-center gap-2"
                title="Toggle view"
              >
                {view === "cards" ? <><ListTree className="h-4 w-4"/> Timeline</> : <><LayoutGrid className="h-4 w-4"/> Cards</>}
              </button>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2"><Filter className="h-4 w-4"/> Status</span>
              {ALL_STATUSES.map(s => (
                <button key={s} onClick={()=>toggleStatus(s)}
                  className={classNames(
                    "px-2.5 py-1.5 rounded-full border text-xs",
                    activeStatuses.has(s) ? "bg-white/10 border-white/20" : "bg-white/5 border-white/10 text-slate-400"
                  )}
                >
                  <StatusBadge s={s}/>
                </button>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-slate-400">Tags</span>
              {ALL_TAGS.map(t => (
                <button key={t} onClick={()=>toggleTag(t)}
                  className={classNames(
                    "px-2 py-1 rounded-full border text-xs",
                    activeTags.has(t) ? "bg-sky-500/10 border-sky-500/30 text-sky-200" : "bg-white/5 border-white/10 text-slate-300"
                  )}
                >{t}</button>
              ))}
              {activeTags.size > 0 && (
                <button onClick={()=>setActiveTags(new Set())} className="ml-1 text-xs text-slate-300 hover:text-white/90">Clear tags</button>
              )}
            </div>
          </div>
        </div>

        {/* Phase Progress Overview */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          {phaseProgress.map(p => (
            <div key={p.key} className="rounded-2xl p-4 border border-white/10 bg-white/5">
              <div className="text-sm text-slate-300">{p.title}</div>
              <div className="mt-1 flex items-center gap-2">
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400/70 to-sky-400/70" style={{width: `${Math.min(100, Math.max(0, p.pct))}%`}} />
                </div>
                <div className="text-sm tabular-nums text-slate-300">{p.pct}%</div>
              </div>
              <div className="mt-2 text-xs text-slate-400">{p.done} done • {p.live} live • {p.total} total</div>
            </div>
          ))}
        </div>

        {/* Results */}
        {view === "cards" ? (
          <div className="mt-6 space-y-6">
            {PHASES.map((phase, idx) => {
              const items = filtered.filter(it => it.phaseIndex === idx);
              if (items.length === 0) return null;
              return (
                <section key={phase.key} className="rounded-2xl border border-white/10 overflow-hidden">
                  <div className="p-5 bg-white/5">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <h2 className="text-lg md:text-xl font-semibold">{phase.title}</h2>
                        <p className="text-slate-300 text-sm">{phase.timeframe} — {phase.summary}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 p-4">
                    <AnimatePresence>
                      {items.map(it => (
                        <motion.div key={it.id}
                          initial={{opacity:0, y:6}}
                          animate={{opacity:1, y:0}}
                          exit={{opacity:0, y:-6}}
                          className="rounded-xl border border-white/10 bg-[#101522] p-4 flex flex-col gap-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-slate-100 font-medium leading-tight">{it.title}</div>
                              <div className="text-xs text-slate-400 mt-0.5">{it.phase} • {phase.timeframe}</div>
                            </div>
                            <StatusBadge s={it.status} />
                          </div>
                          <p className="text-sm text-slate-300">{it.desc}</p>
                          {it.tags && (
                            <div className="flex flex-wrap gap-1.5">
                              {it.tags.map(t => <TagPill key={t} t={t} />)}
                            </div>
                          )}
                          {it.links && it.links.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-2">
                              {it.links.map((href, i) => (
                                <LinkOut key={href+String(i)} href={href}>Link {i+1}</LinkOut>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          // Timeline View
          <div className="mt-8">
            <div className="relative pl-6 md:pl-10">
              <div className="absolute left-2 md:left-4 top-0 bottom-0 w-px bg-white/10" />
              <div className="space-y-6">
                {filtered.map((it, i) => (
                  <div key={it.id} className="relative">
                    <div className="absolute -left-1 md:-left-0.5 top-1.5 h-3 w-3 rounded-full bg-sky-400 shadow-[0_0_0_4px] shadow-sky-400/20" />
                    <div className="rounded-xl border border-white/10 bg-[#101522] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-slate-100 font-medium">{it.title}</div>
                          <div className="text-xs text-slate-400">{it.phase} • {it.timeframe}</div>
                        </div>
                        <StatusBadge s={it.status} />
                      </div>
                      <p className="text-sm text-slate-300 mt-2">{it.desc}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">{it.tags?.map(t => <TagPill key={t} t={t}/>)}</div>
                      {it.links && it.links.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {it.links.map((href, idx) => <LinkOut key={href+idx} href={href}>Link {idx+1}</LinkOut>)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer note */}
        <div className="mt-10 text-xs text-slate-400">
          * This roadmap is informational; dates reflect best effort targeting and will adjust via governance as we collect real data. Always verify the contract: <span className="font-mono">{CONTRACT}</span>.
        </div>
      </div>
    </div>
  );
}

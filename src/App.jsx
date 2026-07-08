
import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Hammer, LayoutDashboard, RefreshCw, Plus, CheckCircle2 } from "lucide-react";
import { supabase, isConfigured } from "./supabaseClient";
import "./style.css";

const stages = [
  "Veneer Ready",
  "In Mould",
  "Post-Mould",
  "Glued Blank",
  "Machined",
  "Edges / Snare Beds",
  "Ready to Drill",
  "Sealer Coat",
  "Polyurethane Coat 1",
  "Polyurethane Coat 2",
  "Polyurethane Coat 3",
  "Polyurethane Coat 4",
  "Finished Spraying / Curing",
  "Ready to Polish",
  "Ready to Assemble",
  "Finished / Ready to Sell",
  "Sold/Shipped",
];

const money = (value) =>
  "$" + Math.round(Number(value || 0)).toLocaleString();

function nextStage(status) {
  const index = stages.indexOf(status);
  if (index < 0) return status;
  return stages[Math.min(index + 1, stages.length - 1)];
}

function batchType(drum) {
  const status = drum.production_status;
  const build = drum.build_type;

  if (status === "Glued Blank" && (build === "Stave" || build === "Stave Tom")) {
    return "Machine stave blanks";
  }
  if (status === "Machined") return "Cut bearing edges / snare beds";
  if (status === "Post-Mould") return "Sand / prep shells";
  if (status === "In Mould") return "Remove from mould";
  if (status === "Edges / Snare Beds" || status === "Ready to Drill") return "Drill hardware";
  if (["Sealer Coat", "Polyurethane Coat 1", "Polyurethane Coat 2", "Polyurethane Coat 3"].includes(status)) {
    return "Spray session";
  }
  if (["Polyurethane Coat 4", "Finished Spraying / Curing", "Ready to Polish"].includes(status)) {
    return "Polish session";
  }
  if (status === "Ready to Assemble") return "Assembly session";
  if (status === "Finished / Ready to Sell") return "Marketing / photos";
  return null;
}

function App() {
  const [view, setView] = useState("dashboard");
  const [drums, setDrums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadDrums() {
    if (!isConfigured) {
      setMessage("Supabase is not configured yet. Add your environment variables in Vercel.");
      return;
    }

    setLoading(true);
    setMessage("");
    const { data, error } = await supabase
      .from("drums")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
    } else {
      setDrums(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadDrums();
  }, []);

  const active = drums.filter((d) => d.sales_status !== "Sold/Shipped");

  const batches = useMemo(() => {
    const grouped = {};
    active.forEach((drum) => {
      const type = batchType(drum);
      if (!type) return;
      grouped[type] ||= [];
      grouped[type].push(drum);
    });
    return grouped;
  }, [active]);

  async function updateDrum(id, patch) {
    const { error } = await supabase.from("drums").update(patch).eq("id", id);
    if (error) {
      setMessage(error.message);
      return;
    }
    await loadDrums();
  }

  async function completeDrum(drum) {
    const after = nextStage(drum.production_status);
    const note =
      (drum.notes || "") +
      `\n${new Date().toISOString().slice(0, 10)}: progressed ${drum.production_status} → ${after}`;

    await updateDrum(drum.id, {
      production_status: after,
      hours_logged: Number(drum.hours_logged || 0) + 0.5,
      notes: note,
    });
  }

  async function addDrum() {
    const { error } = await supabase.from("drums").insert({
      serial: "Pending",
      timber: "",
      build_type: "Ply",
      size: "14 x 6.5",
      finish: "TBD",
      customer: "Stock",
      production_status: "Glued Blank",
      sales_status: "Stock",
      next_step: "",
      retail_price: 0,
      hours_logged: 0,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setView("production");
    await loadDrums();
  }

  return (
    <main>
      <header className="hero">
        <div>
          <h1>Nowak Workshop OS</h1>
          <p>Cloud version — connected to your Supabase workshop database.</p>
        </div>
        <button onClick={loadDrums}>
          <RefreshCw size={16} /> Refresh
        </button>
      </header>

      {!isConfigured && (
        <section className="panel warning">
          <h2>Setup needed</h2>
          <p>
            This app is ready, but Vercel still needs your Supabase URL and publishable key added as environment variables.
          </p>
        </section>
      )}

      {message && <section className="panel warning">{message}</section>}

      <nav>
        <button className={view === "dashboard" ? "active" : ""} onClick={() => setView("dashboard")}>
          <LayoutDashboard size={16} /> Dashboard
        </button>
        <button className={view === "today" ? "active" : ""} onClick={() => setView("today")}>
          <Hammer size={16} /> Workshop Today
        </button>
        <button className={view === "production" ? "active" : ""} onClick={() => setView("production")}>
          Production
        </button>
        <button onClick={addDrum}>
          <Plus size={16} /> Add Drum
        </button>
      </nav>

      {loading && <section className="panel">Loading drums...</section>}

      {view === "dashboard" && (
        <>
          <section className="stats">
            <div>
              <b>{active.length}</b>
              <span>Active drums</span>
            </div>
            <div>
              <b>{active.filter((d) => d.sales_status === "Custom Order").length}</b>
              <span>Custom orders</span>
            </div>
            <div>
              <b>{money(active.reduce((sum, d) => sum + Number(d.retail_price || 0), 0))}</b>
              <span>Potential retail</span>
            </div>
            <div>
              <b>{Object.keys(batches).length}</b>
              <span>Suggested batches</span>
            </div>
          </section>

          <section className="panel">
            <h2>Priority Jobs</h2>
            {active
              .filter((d) => d.next_step)
              .slice(0, 8)
              .map((d) => (
                <article className="card" key={d.id}>
                  <b>#{d.serial} {d.timber}</b>
                  <span>{d.size} · {d.production_status}</span>
                  <p>{d.next_step}</p>
                </article>
              ))}
          </section>
        </>
      )}

      {view === "today" && (
        <section className="batchGrid">
          {Object.entries(batches).map(([name, items]) => (
            <section className="panel" key={name}>
              <h2>{name}</h2>
              <p>{items.length} drum(s) ready.</p>
              {items.map((drum) => (
                <article className="card" key={drum.id}>
                  <b>#{drum.serial} {drum.timber}</b>
                  <span>{drum.size} · {drum.build_type}</span>
                  <span className="badge">{drum.sales_status}</span>
                  <p>{drum.production_status}</p>
                  <button className="primary" onClick={() => completeDrum(drum)}>
                    <CheckCircle2 size={16} /> Complete this drum
                  </button>
                </article>
              ))}
            </section>
          ))}
        </section>
      )}

      {view === "production" && (
        <section className="board">
          {stages.map((stage) => {
            const items = active.filter((d) => d.production_status === stage);
            if (!items.length) return null;

            return (
              <section className="column" key={stage}>
                <h2>{stage}</h2>
                {items.map((drum) => (
                  <article className="card" key={drum.id}>
                    <b>#{drum.serial} {drum.timber}</b>
                    <span>{drum.size} · {drum.build_type}</span>
                    <span className="badge">{drum.sales_status}</span>
                    <select
                      value={drum.production_status}
                      onChange={(e) => updateDrum(drum.id, { production_status: e.target.value })}
                    >
                      {stages.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </article>
                ))}
              </section>
            );
          })}
        </section>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);

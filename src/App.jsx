
import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Hammer, LayoutDashboard, RefreshCw, Plus, CheckCircle2, Package, DollarSign, Camera, ListChecks, Search, ClipboardList, Clock, Truck, Save } from "lucide-react";
import { supabase, isConfigured } from "./supabaseClient";
import "./style.css";

const stages = ["Veneer Ready","In Mould","Post-Mould","Glued Blank","Machined","Edges / Snare Beds","Ready to Drill","Sealer Coat","Polyurethane Coat 1","Polyurethane Coat 2","Polyurethane Coat 3","Polyurethane Coat 4","Finished Spraying / Curing","Ready to Polish","Ready to Assemble","Finished / Ready to Sell","Sold/Shipped"];

const checklist = [
  "Timber / veneer ready","Glue up complete","Machined","Sanded","Bearing edges cut","Snare beds cut","Drilled","Inside oiled / sealed","Sealer coat","Poly coat 1","Poly coat 2","Poly coat 3","Poly coat 4","Cure complete","Polished","Assembled","Photos taken","Website listing","Facebook / Instagram","YouTube demo","Packed","Shipped"
];

const money = (v) => "$" + Math.round(Number(v || 0)).toLocaleString();
const nextStage = (s) => stages[Math.min(Math.max(stages.indexOf(s),0)+1, stages.length-1)] || s;

function batchType(d){
  const s=d.production_status, b=d.build_type;
  if(s==="Glued Blank" && (b==="Stave" || b==="Stave Tom")) return "Machine stave blanks";
  if(s==="Machined") return "Cut bearing edges / snare beds";
  if(s==="Post-Mould") return "Sand / prep shells";
  if(s==="In Mould") return "Remove from mould";
  if(s==="Edges / Snare Beds" || s==="Ready to Drill") return "Drill hardware";
  if(["Sealer Coat","Polyurethane Coat 1","Polyurethane Coat 2","Polyurethane Coat 3"].includes(s)) return "Spray session";
  if(["Polyurethane Coat 4","Finished Spraying / Curing","Ready to Polish"].includes(s)) return "Polish session";
  if(s==="Ready to Assemble") return "Assembly session";
  if(s==="Finished / Ready to Sell") return "Marketing / photos";
  return null;
}

function stagePercent(s){
  const i=stages.indexOf(s);
  if(i < 0) return 0;
  return Math.round((i/(stages.length-1))*100);
}

function templateCost(t, rate){
  if(!t) return 0;
  return Number(t.hardware_cost||0)+Number(t.timber_cost||0)+Number(t.consumables||0)+Number(t.labour_hours||0)*Number(rate||50);
}

function parseChecked(notes){
  const n = notes || "";
  const found = new Set();
  checklist.forEach(item => {
    if(n.includes(`[x] ${item}`)) found.add(item);
  });
  return found;
}

function setChecklistInNotes(existing, checked){
  const clean = (existing || "")
    .split("\n")
    .filter(line => !line.startsWith("[x] ") && !line.startsWith("[ ] "))
    .join("\n")
    .trim();

  const block = checklist.map(item => `${checked.has(item) ? "[x]" : "[ ]"} ${item}`).join("\n");
  return `${clean ? clean + "\n\n" : ""}${block}`;
}

function marketingText(d){
  return `🔥 New from the workshop

#${d.serial} ${d.timber}
${d.size} ${d.build_type}
${d.finish || ""}

Handmade in Western Australia, built one at a time with care, precision and passion.

Available from Nowak Drum Company.`;
}

function App(){
  const [view,setView]=useState("dashboard");
  const [drums,setDrums]=useState([]);
  const [hardware,setHardware]=useState([]);
  const [templates,setTemplates]=useState([]);
  const [sales,setSales]=useState([]);
  const [selected,setSelected]=useState(null);
  const [jobCard,setJobCard]=useState(null);
  const [loading,setLoading]=useState(false);
  const [message,setMessage]=useState("");
  const [labourRate,setLabourRate]=useState(50);
  const [search,setSearch]=useState("");

  async function loadAll(){
    if(!isConfigured){ setMessage("Supabase is not configured yet."); return; }
    setLoading(true); setMessage("");
    const [d,h,t,s]=await Promise.all([
      supabase.from("drums").select("*").order("created_at",{ascending:false}),
      supabase.from("hardware_parts").select("*").order("category",{ascending:true}),
      supabase.from("cost_templates").select("*").order("name",{ascending:true}),
      supabase.from("sales").select("*").order("sold_at",{ascending:false})
    ]);
    const errors=[d.error,h.error,t.error,s.error].filter(Boolean);
    if(errors.length) setMessage(errors.map(e=>e.message).join(" | "));
    else { setDrums(d.data||[]); setHardware(h.data||[]); setTemplates(t.data||[]); setSales(s.data||[]); }
    setLoading(false);
  }

  useEffect(()=>{ loadAll(); },[]);
  const active=drums.filter(d=>d.sales_status!=="Sold/Shipped");
  const filtered=active.filter(d=>JSON.stringify(d).toLowerCase().includes(search.toLowerCase()));
  const templateMap=useMemo(()=>Object.fromEntries(templates.map(t=>[t.name,t])),[templates]);
  const batches=useMemo(()=>{ const g={}; filtered.forEach(d=>{const b=batchType(d); if(b){g[b]??=[]; g[b].push(d)}}); return g; },[filtered]);
  const inventoryValue=hardware.reduce((s,p)=>s+Number(p.qty_on_hand||0)*Number(p.landed_cost_aud||0),0);
  const lowStock=hardware.filter(p=>Number(p.qty_on_hand||0)<=Number(p.reorder_level||0)).length;
  const retail=active.reduce((s,d)=>s+Number(d.retail_price||0),0);
  const cost=active.reduce((s,d)=>s+templateCost(templateMap[d.template_name],labourRate),0);
  const photoQueue=active.filter(d=>d.production_status==="Finished / Ready to Sell").length;
  const cureQueue=active.filter(d=>["Polyurethane Coat 4","Finished Spraying / Curing"].includes(d.production_status)).length;

  async function updateDrum(id,patch){
    const {error}=await supabase.from("drums").update(patch).eq("id",id);
    if(error) setMessage(error.message); else await loadAll();
  }
  async function updateHardware(id,patch){
    const {error}=await supabase.from("hardware_parts").update(patch).eq("id",id);
    if(error) setMessage(error.message); else await loadAll();
  }
  async function completeDrum(d){
    const after=nextStage(d.production_status);
    const notes=(d.notes||"")+`\n${new Date().toISOString().slice(0,10)}: progressed ${d.production_status} → ${after}`;
    await updateDrum(d.id,{production_status:after,hours_logged:Number(d.hours_logged||0)+0.5,notes});
  }
  async function addTime(d, hours, label){
    const notes=(d.notes||"")+`\n${new Date().toISOString().slice(0,10)}: ${label} ${hours} hr`;
    await updateDrum(d.id,{hours_logged:Number(d.hours_logged||0)+Number(hours),notes});
  }
  async function addDrum(){
    const {error}=await supabase.from("drums").insert({serial:"Pending",timber:"",build_type:"Ply",size:"14 x 6.5",finish:"TBD",customer:"Stock",production_status:"Glued Blank",sales_status:"Stock",next_step:"",retail_price:0,hours_logged:0});
    if(error) setMessage(error.message); else {setView("production"); await loadAll();}
  }
  async function markSold(d){
    const price=Number(prompt("Sale price?",d.retail_price||0)); if(!price) return;
    const c=templateCost(templateMap[d.template_name],labourRate);
    const {error}=await supabase.from("sales").insert({drum_id:d.id,serial:d.serial,timber:d.timber,customer:d.customer,sale_price:price,cost_basis:c,profit:price-c,notes:"Marked sold from Workshop OS"});
    if(error) setMessage(error.message); else await updateDrum(d.id,{sales_status:"Sold/Shipped",production_status:"Sold/Shipped"});
  }
  function copyMarketing(d){ navigator.clipboard?.writeText(marketingText(d)); alert("Marketing copy copied"); }

  function openJobCard(d){ setJobCard(d); setSelected(null); }

  return <main>
    <header className="hero"><div><h1>Nowak Workshop OS</h1><p>v1.2 — job cards, checklist, workflow queues and better workshop visibility.</p></div><button onClick={loadAll}><RefreshCw size={16}/> Refresh</button></header>
    {message && <section className="panel warning">{message}</section>}
    <nav>
      <button className={view==="dashboard"?"active":""} onClick={()=>setView("dashboard")}><LayoutDashboard size={16}/> Dashboard</button>
      <button className={view==="today"?"active":""} onClick={()=>setView("today")}><Hammer size={16}/> Workshop Today</button>
      <button className={view==="production"?"active":""} onClick={()=>setView("production")}><ListChecks size={16}/> Production</button>
      <button className={view==="inventory"?"active":""} onClick={()=>setView("inventory")}><Package size={16}/> Inventory</button>
      <button className={view==="costing"?"active":""} onClick={()=>setView("costing")}><DollarSign size={16}/> Costing</button>
      <button className={view==="marketing"?"active":""} onClick={()=>setView("marketing")}><Camera size={16}/> Marketing</button>
      <button onClick={addDrum}><Plus size={16}/> Add Drum</button>
    </nav>
    <div className="searchBar"><Search size={16}/><input placeholder="Search drums, timber, customer, status..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
    {loading && <section className="panel">Loading...</section>}

    {view==="dashboard" && <>
      <section className="stats">
        <div><b>{active.length}</b><span>Active drums</span></div>
        <div><b>{active.filter(d=>d.sales_status==="Custom Order").length}</b><span>Custom orders</span></div>
        <div><b>{money(retail)}</b><span>Potential retail</span></div>
        <div><b>{Object.keys(batches).length}</b><span>Suggested batches</span></div>
        <div><b>{money(inventoryValue)}</b><span>Hardware stock value</span></div>
        <div><b>{lowStock}</b><span>Low stock alerts</span></div>
        <div><b>{money(retail-cost)}</b><span>Estimated gross profit</span></div>
        <div><b>{active.reduce((s,d)=>s+Number(d.hours_logged||0),0).toFixed(1)}</b><span>Logged hours</span></div>
      </section>

      <section className="quickGrid">
        <article className="panel"><h2>Cure Queue</h2><b className="bigNumber">{cureQueue}</b><p>Drums currently curing or waiting to polish.</p></article>
        <article className="panel"><h2>Photo / Marketing Queue</h2><b className="bigNumber">{photoQueue}</b><p>Finished drums needing photos, website, social or YouTube.</p></article>
        <article className="panel"><h2>Best Batch Today</h2><b className="bigNumber">{Object.keys(batches)[0] || "—"}</b><p>Based on current production stages.</p></article>
      </section>

      <section className="panel"><h2>Priority Jobs</h2>{filtered.filter(d=>d.next_step).slice(0,8).map(d=><article className="card clickable" key={d.id} onClick={()=>openJobCard(d)}><b>#{d.serial} {d.timber}</b><span>{d.size} · {d.production_status}</span><div className="progress"><i style={{width:stagePercent(d.production_status)+"%"}}></i></div><p>{d.next_step}</p></article>)}</section>
    </>}

    {view==="today" && <section className="batchGrid">{Object.entries(batches).map(([name,items])=><section className="panel" key={name}><h2>{name}</h2><p>{items.length} drum(s) ready.</p>{items.map(d=><article className="card" key={d.id}><b>#{d.serial} {d.timber}</b><span>{d.size} · {d.build_type}</span><span className="badge">{d.sales_status}</span><div className="progress"><i style={{width:stagePercent(d.production_status)+"%"}}></i></div><p>{d.production_status}</p><button className="primary" onClick={()=>completeDrum(d)}><CheckCircle2 size={16}/> Complete this drum</button><button onClick={()=>openJobCard(d)}>Open job card</button></article>)}</section>)}</section>}

    {view==="production" && <section className="board">{stages.map(stage=>{ const items=filtered.filter(d=>d.production_status===stage); if(!items.length) return null; return <section className="column" key={stage}><h2>{stage}</h2>{items.map(d=><article className="card" key={d.id}><b>#{d.serial} {d.timber}</b><span>{d.size} · {d.build_type}</span><span className="badge">{d.sales_status}</span><div className="progress"><i style={{width:stagePercent(d.production_status)+"%"}}></i></div><select value={d.production_status} onChange={e=>updateDrum(d.id,{production_status:e.target.value})}>{stages.map(s=><option key={s}>{s}</option>)}</select><button onClick={()=>openJobCard(d)}>Open job card</button></article>)}</section>})}</section>}

    {view==="inventory" && <section className="panel"><h2>Hardware Inventory</h2><p>{hardware.length} parts · {lowStock} low stock alerts · {money(inventoryValue)} stock value</p><div className="tableWrap"><table><thead><tr><th>Part</th><th>Code</th><th>Finish</th><th>Size</th><th>Qty</th><th>Reorder</th><th>Landed AUD</th><th>Status</th></tr></thead><tbody>{hardware.map(p=><tr key={p.id}><td>{p.part_name}<br/><small>{p.category}</small></td><td>{p.code}</td><td>{p.finish}</td><td>{p.size}</td><td><input value={p.qty_on_hand??0} onChange={e=>updateHardware(p.id,{qty_on_hand:Number(e.target.value)})}/></td><td>{p.reorder_level}</td><td>{money(p.landed_cost_aud)}</td><td>{Number(p.qty_on_hand||0)<=Number(p.reorder_level||0)?<span className="dangerText">Order</span>:<span className="okText">OK</span>}</td></tr>)}</tbody></table></div></section>}

    {view==="costing" && <section className="panel"><h2>Costing Templates</h2><label className="inlineLabel">Labour rate <input value={labourRate} onChange={e=>setLabourRate(Number(e.target.value))}/></label><div className="templateGrid">{templates.map(t=>{const total=templateCost(t,labourRate), profit=Number(t.retail_price||0)-total; return <article className="card" key={t.id}><b>{t.name}</b><span>Hardware: {money(t.hardware_cost)}</span><span>Timber: {money(t.timber_cost)}</span><span>Consumables: {money(t.consumables)}</span><span>Labour: {t.labour_hours} hrs × {money(labourRate)}</span><hr/><span>Total cost: {money(total)}</span><span>Retail: {money(t.retail_price)}</span><b>Estimated profit: {money(profit)}</b></article>})}</div></section>}

    {view==="marketing" && <section className="templateGrid">{active.filter(d=>d.production_status==="Finished / Ready to Sell").map(d=><article className="panel" key={d.id}><h2>#{d.serial} {d.timber}</h2><p>{d.size} · {d.build_type} · {d.finish}</p><pre>{marketingText(d)}</pre><button className="primary" onClick={()=>copyMarketing(d)}>Copy marketing copy</button><button onClick={()=>openJobCard(d)}>Open job card</button></article>)}</section>}

    {jobCard && <JobCard drum={jobCard} template={templateMap[jobCard.template_name]} labourRate={labourRate} onClose={()=>setJobCard(null)} updateDrum={updateDrum} completeDrum={completeDrum} addTime={addTime} markSold={markSold} copyMarketing={copyMarketing}/>}
  </main>
}

function JobCard({drum, template, labourRate, onClose, updateDrum, completeDrum, addTime, markSold, copyMarketing}){
  const [checked,setChecked]=useState(parseChecked(drum.notes));
  const [timeAmount,setTimeAmount]=useState(0.5);
  const [timeLabel,setTimeLabel]=useState("Workshop time");
  const totalCost=templateCost(template,labourRate);
  const profit=Number(drum.retail_price||0)-totalCost;

  async function saveChecklist(){
    await updateDrum(drum.id,{notes:setChecklistInNotes(drum.notes, checked)});
    onClose();
  }

  function toggle(item){
    const next=new Set(checked);
    if(next.has(item)) next.delete(item); else next.add(item);
    setChecked(next);
  }

  return <div className="modalBg" onClick={onClose}><div className="modal jobModal" onClick={e=>e.stopPropagation()}>
    <button className="close" onClick={onClose}>×</button>
    <div className="jobHeader">
      <div>
        <h2>Job Card — #{drum.serial} {drum.timber}</h2>
        <p>{drum.size} · {drum.build_type} · {drum.finish}</p>
      </div>
      <div className="statusPill">{drum.production_status}</div>
    </div>

    <div className="progress large"><i style={{width:stagePercent(drum.production_status)+"%"}}></i></div>

    <section className="stats smallStats">
      <div><b>{money(drum.retail_price)}</b><span>Retail</span></div>
      <div><b>{money(totalCost)}</b><span>Est. cost</span></div>
      <div><b>{money(profit)}</b><span>Est. profit</span></div>
      <div><b>{drum.hours_logged || 0}</b><span>Hours logged</span></div>
    </section>

    <section className="jobGrid">
      <div className="panel inner">
        <h2>Build Details</h2>
        <label>Customer</label>
        <input defaultValue={drum.customer||""} onBlur={e=>updateDrum(drum.id,{customer:e.target.value})}/>
        <label>Size</label>
        <input defaultValue={drum.size||""} onBlur={e=>updateDrum(drum.id,{size:e.target.value})}/>
        <label>Finish</label>
        <input defaultValue={drum.finish||""} onBlur={e=>updateDrum(drum.id,{finish:e.target.value})}/>
        <label>Production status</label>
        <select defaultValue={drum.production_status} onChange={e=>updateDrum(drum.id,{production_status:e.target.value})}>{stages.map(s=><option key={s}>{s}</option>)}</select>
        <label>Next step</label>
        <input defaultValue={drum.next_step||""} onBlur={e=>updateDrum(drum.id,{next_step:e.target.value})}/>
      </div>

      <div className="panel inner">
        <h2>Time Log</h2>
        <label>Activity</label>
        <input value={timeLabel} onChange={e=>setTimeLabel(e.target.value)}/>
        <label>Hours</label>
        <input value={timeAmount} onChange={e=>setTimeAmount(e.target.value)}/>
        <button className="primary" onClick={()=>addTime(drum, timeAmount, timeLabel)}><Clock size={16}/> Add time</button>
        <button onClick={()=>completeDrum(drum)}><CheckCircle2 size={16}/> Complete current stage</button>
      </div>
    </section>

    <section className="panel inner">
      <h2>Manufacturing Checklist</h2>
      <div className="checkGrid">
        {checklist.map(item=><label className="checkItem" key={item}><input type="checkbox" checked={checked.has(item)} onChange={()=>toggle(item)}/>{item}</label>)}
      </div>
      <button className="primary" onClick={saveChecklist}><Save size={16}/> Save checklist to notes</button>
    </section>

    <section className="panel inner">
      <h2>Notes</h2>
      <textarea defaultValue={drum.notes||""} onBlur={e=>updateDrum(drum.id,{notes:e.target.value})}/>
    </section>

    <section className="buttonRow">
      <button className="primary" onClick={()=>copyMarketing(drum)}><Camera size={16}/> Copy marketing</button>
      <button onClick={()=>markSold(drum)}><Truck size={16}/> Mark sold / shipped</button>
    </section>
  </div></div>
}

createRoot(document.getElementById("root")).render(<App />);

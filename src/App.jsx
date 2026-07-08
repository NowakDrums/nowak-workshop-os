
import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Hammer, LayoutDashboard, RefreshCw, Plus, CheckCircle2, Package, DollarSign, Camera, ListChecks, Search, Clock, Truck, Save, Ruler, Users } from "lucide-react";
import { supabase, isConfigured } from "./supabaseClient";
import "./style.css";

const stages = ["Veneer Ready","In Mould","Post-Mould","Glued Blank","Machined","Edges / Snare Beds","Ready to Drill","Sealer Coat","Polyurethane Coat 1","Polyurethane Coat 2","Polyurethane Coat 3","Polyurethane Coat 4","Finished Spraying / Curing","Ready to Polish","Ready to Assemble","Finished / Ready to Sell","Sold/Shipped"];
const checklist = ["Timber / veneer ready","Glue up complete","Machined","Sanded","Bearing edges cut","Snare beds cut","Drilled","Inside oiled / sealed","Sealer coat","Poly coat 1","Poly coat 2","Poly coat 3","Poly coat 4","Cure complete","Polished","Assembled","Photos taken","Website listing","Facebook / Instagram","YouTube demo","Packed","Shipped"];
const defaultPlyLengths = [1106,1096,1087.5,1079.5,1069];
const defaultPairThickness = 1.2;
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
function stagePercent(s){ const i=stages.indexOf(s); return i<0?0:Math.round((i/(stages.length-1))*100); }
function templateCost(t, rate){ if(!t) return 0; return Number(t.hardware_cost||0)+Number(t.timber_cost||0)+Number(t.consumables||0)+Number(t.labour_hours||0)*Number(rate||50); }
function parseChecked(notes){ const found=new Set(); checklist.forEach(item=>{ if((notes||"").includes(`[x] ${item}`)) found.add(item); }); return found; }
function setChecklistInNotes(existing, checked){ const clean=(existing||"").split("\n").filter(line=>!line.startsWith("[x] ")&&!line.startsWith("[ ] ")).join("\n").trim(); const block=checklist.map(item=>`${checked.has(item)?"[x]":"[ ]"} ${item}`).join("\n"); return `${clean?clean+"\n\n":""}${block}`; }
function marketingText(d){ return `🔥 New from the workshop\n\n#${d.serial} ${d.timber}\n${d.size} ${d.build_type}\n${d.finish || ""}\n\nHandmade in Western Australia, built one at a time with care, precision and passion.\n\nAvailable from Nowak Drum Company.`; }
function adjustedLengths(thicknesses){
  let cumulativeDifference = 0;
  return thicknesses.map((t,i)=>{
    const diff = Number(t || defaultPairThickness) - defaultPairThickness;
    cumulativeDifference += diff;
    const adjustment = cumulativeDifference * 2 * Math.PI;
    return defaultPlyLengths[i] + adjustment;
  });
}

function App(){
  const [view,setView]=useState("dashboard");
  const [drums,setDrums]=useState([]);
  const [hardware,setHardware]=useState([]);
  const [templates,setTemplates]=useState([]);
  const [sales,setSales]=useState([]);
  const [jobCard,setJobCard]=useState(null);
  const [loading,setLoading]=useState(false);
  const [message,setMessage]=useState("");
  const [labourRate,setLabourRate]=useState(50);
  const [search,setSearch]=useState("");
  const [showAddWizard,setShowAddWizard]=useState(false);

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
  const brady=active.filter(d=>d.build_client==="Brady").length;
  const customTotal=active.reduce((s,d)=>s+Number(d.total_price||d.custom_price||0),0);
  const overdue=active.filter(d=>d.due_date && new Date(d.due_date) < new Date()).length;
  const templateMap=useMemo(()=>Object.fromEntries(templates.map(t=>[t.name,t])),[templates]);
  const batches=useMemo(()=>{ const g={}; filtered.forEach(d=>{const b=batchType(d); if(b){g[b]??=[]; g[b].push(d)}}); return g; },[filtered]);
  const inventoryValue=hardware.reduce((s,p)=>s+Number(p.qty_on_hand||0)*Number(p.landed_cost_aud||0),0);
  const lowStock=hardware.filter(p=>Number(p.qty_on_hand||0)<=Number(p.reorder_level||0)).length;
  const retail=active.reduce((s,d)=>s+Number(d.total_price||d.retail_price||0),0);
  const cost=active.reduce((s,d)=>s+templateCost(templateMap[d.template_name],labourRate),0);
  const photoQueue=active.filter(d=>d.production_status==="Finished / Ready to Sell").length;
  const cureQueue=active.filter(d=>["Polyurethane Coat 4","Finished Spraying / Curing"].includes(d.production_status)).length;

  async function updateDrum(id,patch){
    if("custom_price" in patch || "shipping_cost" in patch){
      const existing = drums.find(d=>d.id===id) || {};
      const customPrice = "custom_price" in patch ? Number(patch.custom_price||0) : Number(existing.custom_price||0);
      const shipping = "shipping_cost" in patch ? Number(patch.shipping_cost||0) : Number(existing.shipping_cost||0);
      patch.total_price = customPrice + shipping;
    }
    const {error}=await supabase.from("drums").update(patch).eq("id",id);
    if(error) setMessage(error.message); else await loadAll();
  }
  async function updateHardware(id,patch){ const {error}=await supabase.from("hardware_parts").update(patch).eq("id",id); if(error) setMessage(error.message); else await loadAll(); }
  async function completeDrum(d){ const after=nextStage(d.production_status); const notes=(d.notes||"")+`\n${new Date().toISOString().slice(0,10)}: progressed ${d.production_status} → ${after}`; await updateDrum(d.id,{production_status:after,hours_logged:Number(d.hours_logged||0)+0.5,notes}); }
  async function addTime(d, hours, label){ const notes=(d.notes||"")+`\n${new Date().toISOString().slice(0,10)}: ${label} ${hours} hr`; await updateDrum(d.id,{hours_logged:Number(d.hours_logged||0)+Number(hours),notes}); }
  async function addDrumFromWizard(form){
    const isPly = form.build_type === "Ply";
    const insertData = {
      serial:"Pending",
      timber:form.timber || "",
      build_type:form.build_type,
      size:form.size || (isPly ? "14 x 6.5" : "14 x 6.5"),
      finish:"TBD",
      customer:"Stock",
      production_status:isPly ? "Veneer Ready" : "Glued Blank",
      sales_status:"Custom Order",
      next_step:isPly ? "Confirm veneer thicknesses and cut lengths" : "Machine shell",
      retail_price:0,
      hours_logged:0,
      build_client:form.build_client || "Nowak",
      cb_number:form.cb_number || "",
      veneer_1_thickness:isPly ? Number(form.veneer[0] || 1.2) : null,
      veneer_2_thickness:isPly ? Number(form.veneer[1] || 1.2) : null,
      veneer_3_thickness:isPly ? Number(form.veneer[2] || 1.2) : null,
      veneer_4_thickness:isPly ? Number(form.veneer[3] || 1.2) : null,
      veneer_5_thickness:isPly ? Number(form.veneer[4] || 1.2) : null,
    };

    const {data,error}=await supabase.from("drums").insert(insertData).select().single();
    if(error) {
      setMessage(error.message);
    } else {
      await loadAll();
      setShowAddWizard(false);
      if(isPly) setView("veneer"); else setView("today");
      setJobCard(data);
    }
  }
  async function markSold(d){
    const price=Number(prompt("Sale price?",d.total_price || d.custom_price || d.retail_price || 0)); if(!price) return;
    const c=templateCost(templateMap[d.template_name],labourRate);
    const {error}=await supabase.from("sales").insert({drum_id:d.id,serial:d.serial,timber:d.timber,customer:d.customer,sale_price:price,cost_basis:c,profit:price-c,notes:"Marked sold from Workshop OS"});
    if(error) setMessage(error.message); else await updateDrum(d.id,{sales_status:"Sold/Shipped",production_status:"Sold/Shipped"});
  }
  function copyMarketing(d){ navigator.clipboard?.writeText(marketingText(d)); alert("Marketing copy copied"); }
  function openJobCard(d){ setJobCard(d); }

  return <main>
    <header className="hero"><div><h1>Nowak Workshop OS</h1><p>v1.3.2 — add-drum wizard, Brady tracking and ply veneer calculator.</p></div><button onClick={loadAll}><RefreshCw size={16}/> Refresh</button></header>
    {message && <section className="panel warning">{message}</section>}
    <nav>
      <button className={view==="dashboard"?"active":""} onClick={()=>setView("dashboard")}><LayoutDashboard size={16}/> Dashboard</button>
      <button className={view==="today"?"active":""} onClick={()=>setView("today")}><Hammer size={16}/> Workshop Today</button>
      <button className={view==="production"?"active":""} onClick={()=>setView("production")}><ListChecks size={16}/> Production</button>
      <button className={view==="customers"?"active":""} onClick={()=>setView("customers")}><Users size={16}/> Orders</button>
      <button className={view==="veneer"?"active":""} onClick={()=>setView("veneer")}><Ruler size={16}/> Veneer Calc</button>
      <button className={view==="inventory"?"active":""} onClick={()=>setView("inventory")}><Package size={16}/> Inventory</button>
      <button className={view==="costing"?"active":""} onClick={()=>setView("costing")}><DollarSign size={16}/> Costing</button>
      <button className={view==="marketing"?"active":""} onClick={()=>setView("marketing")}><Camera size={16}/> Marketing</button>
      <button onClick={()=>setShowAddWizard(true)}><Plus size={16}/> Add Drum</button>
    </nav>
    <div className="searchBar"><Search size={16}/><input placeholder="Search drums, timber, customer, CB number, email, status..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
    {loading && <section className="panel">Loading...</section>}

    {view==="dashboard" && <>
      <section className="stats">
        <div><b>{active.length}</b><span>Active drums</span></div>
        <div><b>{active.filter(d=>d.sales_status==="Custom Order").length}</b><span>Custom orders</span></div>
        <div><b>{brady}</b><span>Brady / CB drums</span></div>
        <div><b>{overdue}</b><span>Overdue jobs</span></div>
        <div><b>{money(retail)}</b><span>Potential retail</span></div>
        <div><b>{money(customTotal)}</b><span>Custom order total</span></div>
        <div><b>{money(retail-cost)}</b><span>Estimated gross profit</span></div>
        <div><b>{Object.keys(batches).length}</b><span>Suggested batches</span></div>
      </section>
      <section className="quickGrid">
        <article className="panel"><h2>Cure Queue</h2><b className="bigNumber">{cureQueue}</b><p>Drums currently curing or waiting to polish.</p></article>
        <article className="panel"><h2>Photo / Marketing Queue</h2><b className="bigNumber">{photoQueue}</b><p>Finished drums needing photos, website, social or YouTube.</p></article>
        <article className="panel bradyPanel"><h2>Brady / CB Queue</h2><b className="bigNumber">{brady}</b><p>Drums being built for Chris Brady / Brady Drums.</p></article>
      </section>
      <section className="panel"><h2>Priority Jobs</h2>{filtered.filter(d=>d.next_step).slice(0,8).map(d=><DrumCard key={d.id} drum={d} openJobCard={openJobCard}/>)}</section>
    </>}

    {view==="today" && <section className="batchGrid">{Object.entries(batches).map(([name,items])=><section className="panel" key={name}><h2>{name}</h2><p>{items.length} drum(s) ready.</p>{items.map(d=><article className={"card " + (d.build_client==="Brady"?"bradyCard":"")} key={d.id}><b>#{d.serial} {d.timber}</b>{d.build_client==="Brady" && <span className="cbBadge">CB {d.cb_number || "No CB #"}</span>}<span>{d.size} · {d.build_type}</span><span className="badge">{d.sales_status}</span><div className="progress"><i style={{width:stagePercent(d.production_status)+"%"}}></i></div><p>{d.production_status}</p><button className="primary" onClick={()=>completeDrum(d)}><CheckCircle2 size={16}/> Complete this drum</button><button onClick={()=>openJobCard(d)}>Open job card</button></article>)}</section>)}</section>}

    {view==="production" && <section className="board">{stages.map(stage=>{ const items=filtered.filter(d=>d.production_status===stage); if(!items.length) return null; return <section className="column" key={stage}><h2>{stage}</h2>{items.map(d=><article className={"card " + (d.build_client==="Brady"?"bradyCard":"")} key={d.id}><b>#{d.serial} {d.timber}</b>{d.build_client==="Brady" && <span className="cbBadge">CB {d.cb_number || "No CB #"}</span>}<span>{d.size} · {d.build_type}</span><span className="badge">{d.sales_status}</span><div className="progress"><i style={{width:stagePercent(d.production_status)+"%"}}></i></div><select value={d.production_status} onChange={e=>updateDrum(d.id,{production_status:e.target.value})}>{stages.map(s=><option key={s}>{s}</option>)}</select><button onClick={()=>openJobCard(d)}>Open job card</button></article>)}</section>})}</section>}

    {view==="customers" && <section className="panel"><h2>Custom Orders / Customers</h2><p>New drums added with the Add Drum button will appear here and open as a job card so you can enter customer, price, shipping, due date and CB details straight away.</p><div className="tableWrap"><table><thead><tr><th>Drum</th><th>Customer</th><th>Email</th><th>Build For</th><th>CB #</th><th>Price</th><th>Shipping</th><th>Total</th><th>Due</th></tr></thead><tbody>{filtered.map(d=><tr key={d.id} className={d.build_client==="Brady"?"bradyRow":""}><td><button onClick={()=>openJobCard(d)}>#{d.serial} {d.timber}</button></td><td>{d.customer}</td><td>{d.customer_email}</td><td>{d.build_client || "Nowak"}</td><td>{d.cb_number}</td><td>{money(d.custom_price)}</td><td>{money(d.shipping_cost)}</td><td>{money(d.total_price)}</td><td>{d.due_date || ""}</td></tr>)}</tbody></table></div></section>}

    {view==="veneer" && <VeneerCalculator drums={filtered.filter(d=>d.build_type==="Ply")} updateDrum={updateDrum} openJobCard={openJobCard}/>}
    {view==="inventory" && <Inventory hardware={hardware} updateHardware={updateHardware} lowStock={lowStock} inventoryValue={inventoryValue}/>}
    {view==="costing" && <Costing templates={templates} labourRate={labourRate} setLabourRate={setLabourRate}/>}
    {view==="marketing" && <section className="templateGrid">{active.filter(d=>d.production_status==="Finished / Ready to Sell").map(d=><article className="panel" key={d.id}><h2>#{d.serial} {d.timber}</h2><p>{d.size} · {d.build_type} · {d.finish}</p><pre>{marketingText(d)}</pre><button className="primary" onClick={()=>copyMarketing(d)}>Copy marketing copy</button><button onClick={()=>openJobCard(d)}>Open job card</button></article>)}</section>}
    {showAddWizard && <AddDrumWizard onClose={()=>setShowAddWizard(false)} onCreate={addDrumFromWizard}/>} 
    {jobCard && <JobCard drum={jobCard} template={templateMap[jobCard.template_name]} labourRate={labourRate} onClose={()=>setJobCard(null)} updateDrum={updateDrum} completeDrum={completeDrum} addTime={addTime} markSold={markSold} copyMarketing={copyMarketing}/>}
  </main>
}

function DrumCard({drum, openJobCard}){
  return <article className={"card clickable " + (drum.build_client==="Brady"?"bradyCard":"")} onClick={()=>openJobCard(drum)}><b>#{drum.serial} {drum.timber}</b>{drum.build_client==="Brady" && <span className="cbBadge">CB {drum.cb_number || "No CB #"}</span>}<span>{drum.size} · {drum.production_status}</span><div className="progress"><i style={{width:stagePercent(drum.production_status)+"%"}}></i></div><p>{drum.next_step}</p></article>
}

function VeneerCalculator({drums, updateDrum, openJobCard}){
  const [manual,setManual]=useState([1.2,1.2,1.2,1.2,1.2]);
  const manualLengths=adjustedLengths(manual);
  return <section>
    <div className="panel"><h2>Ply Veneer Cut Calculator</h2><p>Enter the actual thickness of each glued pair/sheet group. The calculator adjusts your original 14&quot; mould cut list using your 1.2mm baseline.</p></div>
    <section className="panel"><h2>Manual Calculator</h2><div className="veneerGrid">{manual.map((v,i)=><label key={i}>Layer {i+1} thickness mm<input value={v} onChange={e=>{const n=[...manual]; n[i]=e.target.value; setManual(n)}}/></label>)}</div><VeneerResult lengths={manualLengths}/></section>
    <section className="panel"><h2>Ply Drums</h2><div className="templateGrid">{drums.map(d=>{const t=[d.veneer_1_thickness,d.veneer_2_thickness,d.veneer_3_thickness,d.veneer_4_thickness,d.veneer_5_thickness].map(x=>x||1.2); return <article className="card" key={d.id}><b>#{d.serial} {d.timber}</b><span>{d.size} · {d.production_status}</span><div className="veneerGrid small">{t.map((v,i)=><label key={i}>L{i+1}<input value={v} onChange={e=>updateDrum(d.id,{[`veneer_${i+1}_thickness`]:Number(e.target.value)})}/></label>)}</div><VeneerResult lengths={adjustedLengths(t)}/><button onClick={()=>openJobCard(d)}>Open job card</button></article>})}</div></section>
  </section>
}
function VeneerResult({lengths}){ return <div className="resultList">{lengths.map((l,i)=><div key={i}><b>Layer {i+1}</b><span>{l.toFixed(1)} mm</span></div>)}</div> }

function Inventory({hardware, updateHardware, lowStock, inventoryValue}){ return <section className="panel"><h2>Hardware Inventory</h2><p>{hardware.length} parts · {lowStock} low stock alerts · {money(inventoryValue)} stock value</p><div className="tableWrap"><table><thead><tr><th>Part</th><th>Code</th><th>Finish</th><th>Size</th><th>Qty</th><th>Reorder</th><th>Landed AUD</th><th>Status</th></tr></thead><tbody>{hardware.map(p=><tr key={p.id}><td>{p.part_name}<br/><small>{p.category}</small></td><td>{p.code}</td><td>{p.finish}</td><td>{p.size}</td><td><input value={p.qty_on_hand??0} onChange={e=>updateHardware(p.id,{qty_on_hand:Number(e.target.value)})}/></td><td>{p.reorder_level}</td><td>{money(p.landed_cost_aud)}</td><td>{Number(p.qty_on_hand||0)<=Number(p.reorder_level||0)?<span className="dangerText">Order</span>:<span className="okText">OK</span>}</td></tr>)}</tbody></table></div></section> }
function Costing({templates, labourRate, setLabourRate}){ return <section className="panel"><h2>Costing Templates</h2><label className="inlineLabel">Labour rate <input value={labourRate} onChange={e=>setLabourRate(Number(e.target.value))}/></label><div className="templateGrid">{templates.map(t=>{const total=templateCost(t,labourRate), profit=Number(t.retail_price||0)-total; return <article className="card" key={t.id}><b>{t.name}</b><span>Hardware: {money(t.hardware_cost)}</span><span>Timber: {money(t.timber_cost)}</span><span>Consumables: {money(t.consumables)}</span><span>Labour: {t.labour_hours} hrs × {money(labourRate)}</span><hr/><span>Total cost: {money(total)}</span><span>Retail: {money(t.retail_price)}</span><b>Estimated profit: {money(profit)}</b></article>})}</div></section> }


function AddDrumWizard({onClose, onCreate}){
  const [form,setForm]=useState({
    build_type:"Stave",
    timber:"",
    size:"14 x 6.5",
    build_client:"Nowak",
    cb_number:"",
    veneer:[1.2,1.2,1.2,1.2,1.2],
  });

  const lengths = adjustedLengths(form.veneer);
  const isPly = form.build_type === "Ply";

  function setField(key,value){ setForm(f=>({...f,[key]:value})); }
  function setVeneer(index,value){
    setForm(f=>{
      const veneer=[...f.veneer];
      veneer[index]=value;
      return {...f,veneer};
    });
  }

  return <div className="modalBg" onClick={onClose}>
    <div className="modal wizardModal" onClick={e=>e.stopPropagation()}>
      <button className="close" onClick={onClose}>×</button>
      <h2>Add Drum</h2>
      <p>Choose the shell type first. The app will set the correct starting stage and next step.</p>

      <section className="choiceRow">
        <button className={form.build_type==="Stave" ? "primary bigChoice" : "bigChoice"} onClick={()=>setField("build_type","Stave")}>Stave shell</button>
        <button className={form.build_type==="Ply" ? "primary bigChoice" : "bigChoice"} onClick={()=>setField("build_type","Ply")}>Ply shell</button>
      </section>

      <section className="jobGrid two">
        <div className="panel inner">
          <h2>Basic Details</h2>
          <label>Material / timber</label>
          <input placeholder="Jarrah, Marri, Blackwood, Spotted Gum..." value={form.timber} onChange={e=>setField("timber",e.target.value)}/>
          <label>Size</label>
          <input value={form.size} onChange={e=>setField("size",e.target.value)}/>
          <label>Build for</label>
          <select value={form.build_client} onChange={e=>setField("build_client",e.target.value)}>
            <option>Nowak</option>
            <option>Brady</option>
          </select>
          {form.build_client==="Brady" && <>
            <label>CB Number</label>
            <input value={form.cb_number} onChange={e=>setField("cb_number",e.target.value)} placeholder="CB number"/>
          </>}
        </div>

        <div className="panel inner">
          <h2>{isPly ? "Ply setup" : "Stave setup"}</h2>
          {isPly ? <>
            <p>Enter the measured thickness of each glued veneer pair/sheet group. The calculated cut lengths update instantly.</p>
            <div className="veneerGrid">
              {form.veneer.map((v,i)=><label key={i}>Layer {i+1} mm<input value={v} onChange={e=>setVeneer(i,e.target.value)}/></label>)}
            </div>
            <VeneerResult lengths={lengths}/>
          </> : <>
            <p>This will be added as a stave shell and placed into the machining workflow.</p>
            <div className="resultList twoCols">
              <div><b>Starting stage</b><span>Glued Blank</span></div>
              <div><b>Next step</b><span>Machine shell</span></div>
            </div>
          </>}
        </div>
      </section>

      <section className="buttonRow">
        <button onClick={onClose}>Cancel</button>
        <button className="primary" onClick={()=>onCreate(form)}>Create drum</button>
      </section>
    </div>
  </div>
}


function JobCard({drum, template, labourRate, onClose, updateDrum, completeDrum, addTime, markSold, copyMarketing}){
  const [checked,setChecked]=useState(parseChecked(drum.notes));
  const [timeAmount,setTimeAmount]=useState(0.5);
  const [timeLabel,setTimeLabel]=useState("Workshop time");
  const [customPrice,setCustomPrice]=useState(drum.custom_price||0);
  const [shipping,setShipping]=useState(drum.shipping_cost||0);
  const totalCost=templateCost(template,labourRate);
  const totalPrice=Number(customPrice||0)+Number(shipping||0);
  const profit=Number(drum.total_price||drum.retail_price||0)-totalCost;
  const veneer=[drum.veneer_1_thickness,drum.veneer_2_thickness,drum.veneer_3_thickness,drum.veneer_4_thickness,drum.veneer_5_thickness].map(x=>x||1.2);

  async function saveChecklist(){ await updateDrum(drum.id,{notes:setChecklistInNotes(drum.notes, checked)}); onClose(); }
  function toggle(item){ const next=new Set(checked); if(next.has(item)) next.delete(item); else next.add(item); setChecked(next); }

  return <div className="modalBg" onClick={onClose}><div className={"modal jobModal "+(drum.build_client==="Brady"?"bradyModal":"")} onClick={e=>e.stopPropagation()}>
    <button className="close" onClick={onClose}>×</button>
    <div className="jobHeader"><div><h2>Job Card — #{drum.serial} {drum.timber}</h2><p>{drum.size} · {drum.build_type} · {drum.finish}</p>{drum.build_client==="Brady" && <span className="cbBadge">Brady / CB {drum.cb_number || "No CB number"}</span>}</div><div className="statusPill">{drum.production_status}</div></div>
    <div className="progress large"><i style={{width:stagePercent(drum.production_status)+"%"}}></i></div>
    <section className="stats smallStats"><div><b>{money(drum.total_price||drum.retail_price)}</b><span>Total / retail</span></div><div><b>{money(totalCost)}</b><span>Est. cost</span></div><div><b>{money(profit)}</b><span>Est. profit</span></div><div><b>{drum.hours_logged || 0}</b><span>Hours logged</span></div></section>

    <section className="jobGrid">
      <div className="panel inner"><h2>Build / Customer Details</h2>
        <label>Build for</label><select defaultValue={drum.build_client||"Nowak"} onChange={e=>updateDrum(drum.id,{build_client:e.target.value})}><option>Nowak</option><option>Brady</option></select>
        <label>CB Number</label><input defaultValue={drum.cb_number||""} onBlur={e=>updateDrum(drum.id,{cb_number:e.target.value})}/>
        <label>Customer name</label><input defaultValue={drum.customer||""} onBlur={e=>updateDrum(drum.id,{customer:e.target.value})}/>
        <label>Customer email</label><input defaultValue={drum.customer_email||""} onBlur={e=>updateDrum(drum.id,{customer_email:e.target.value})}/>
        <label>Due date</label><input type="date" defaultValue={drum.due_date||""} onBlur={e=>updateDrum(drum.id,{due_date:e.target.value||null})}/>
        <label>Drum price</label><input value={customPrice} onChange={e=>setCustomPrice(e.target.value)} onBlur={e=>updateDrum(drum.id,{custom_price:Number(e.target.value)})}/>
        <label>Shipping cost</label><input value={shipping} onChange={e=>setShipping(e.target.value)} onBlur={e=>updateDrum(drum.id,{shipping_cost:Number(e.target.value)})}/>
        <p><b>Total custom price: {money(totalPrice)}</b></p>
      </div>

      <div className="panel inner"><h2>Build Details</h2>
        <label>Size</label><input defaultValue={drum.size||""} onBlur={e=>updateDrum(drum.id,{size:e.target.value})}/>
        <label>Finish</label><input defaultValue={drum.finish||""} onBlur={e=>updateDrum(drum.id,{finish:e.target.value})}/>
        <label>Production status</label><select defaultValue={drum.production_status} onChange={e=>updateDrum(drum.id,{production_status:e.target.value})}>{stages.map(s=><option key={s}>{s}</option>)}</select>
        <label>Next step</label><input defaultValue={drum.next_step||""} onBlur={e=>updateDrum(drum.id,{next_step:e.target.value})}/>
      </div>

      <div className="panel inner"><h2>Time Log</h2>
        <label>Activity</label><input value={timeLabel} onChange={e=>setTimeLabel(e.target.value)}/>
        <label>Hours</label><input value={timeAmount} onChange={e=>setTimeAmount(e.target.value)}/>
        <button className="primary" onClick={()=>addTime(drum, timeAmount, timeLabel)}><Clock size={16}/> Add time</button>
        <button onClick={()=>completeDrum(drum)}><CheckCircle2 size={16}/> Complete current stage</button>
      </div>
    </section>

    {drum.build_type==="Ply" && <section className="panel inner"><h2>Ply Veneer Calculator</h2><div className="veneerGrid">{veneer.map((v,i)=><label key={i}>Layer {i+1} thickness<input value={v} onChange={e=>updateDrum(drum.id,{[`veneer_${i+1}_thickness`]:Number(e.target.value)})}/></label>)}</div><VeneerResult lengths={adjustedLengths(veneer)}/></section>}

    <section className="panel inner"><h2>Manufacturing Checklist</h2><div className="checkGrid">{checklist.map(item=><label className="checkItem" key={item}><input type="checkbox" checked={checked.has(item)} onChange={()=>toggle(item)}/>{item}</label>)}</div><button className="primary" onClick={saveChecklist}><Save size={16}/> Save checklist to notes</button></section>
    <section className="panel inner"><h2>Notes</h2><textarea defaultValue={drum.notes||""} onBlur={e=>updateDrum(drum.id,{notes:e.target.value})}/></section>
    <section className="buttonRow"><button className="primary" onClick={()=>copyMarketing(drum)}><Camera size={16}/> Copy marketing</button><button onClick={()=>markSold(drum)}><Truck size={16}/> Mark sold / shipped</button></section>
  </div></div>
}

createRoot(document.getElementById("root")).render(<App />);

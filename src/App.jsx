
import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Hammer, LayoutDashboard, RefreshCw, Plus, CheckCircle2, Package, DollarSign, Camera, ListChecks, Search, Clock, Truck, Save, Ruler, Users, Mail, Share2 } from "lucide-react";
import { supabase, isConfigured } from "./supabaseClient";
import "./style.css";

const stages = ["Veneer Ready","In Mould","Post-Mould","Glued Blank","Machined","Edges / Snare Beds","Ready to Drill","Sealer Coat","Polyurethane Coat 1","Polyurethane Coat 2","Polyurethane Coat 3","Polyurethane Coat 4","Finished Spraying / Curing","Ready to Polish","Ready to Assemble","Finished / Ready to Sell","Sold/Shipped"];
const checklist = ["Timber / veneer ready","Glue up complete","Machined","Sanded","Bearing edges cut","Snare beds cut","Drilled","Inside oiled / sealed","Sealer coat","Poly coat 1","Poly coat 2","Poly coat 3","Poly coat 4","Cure complete","Polished","Assembled","Photos taken","Website listing","Facebook / Instagram","YouTube demo","Packed","Shipped"];
const drumDiameters = ["10", "12", "13", "14", "16", "18", "20", "22", "24"];
const drumDepths = ["5", "5 1/2", "6", "6 1/2", "7", "8", "10", "12", "14", "16", "18"];
const timberOptions = ["Jarrah", "Jarrah Staircase", "Marri", "Blackbutt", "Blackwood", "Wandoo", "Sheoak", "Spotted Gum", "River Banksia", "Tri Colour", "Custom / Other"];
const communicationMilestones = [
  {key:"blank", label:"Blank glued", photo:"Glue-up blank, clamps/press, end grain, timber detail"},
  {key:"machined", label:"Machined shell", photo:"Lathe shot, inside shell, outside shell, shell thickness"},
  {key:"snarebed", label:"Snare bed / edges cut", photo:"Bearing edge, snare bed close-up, shell on bench"},
  {key:"sealer", label:"Sealer coat sprayed", photo:"First sealer coat, grain close-up, before/after look"},
  {key:"shellcomplete", label:"Shell completed", photo:"Finished shell, inside shell, edges, badge/vent if fitted"},
  {key:"drumcomplete", label:"Drum completed", photo:"Full drum, detail shots, throw-off, hoops, glamour shot"}
];
function buildSize(diameter, depth){ return `${diameter} x ${depth}`; }
function splitSize(size){
  const text = String(size || "14 x 6.5");
  const parts = text.split("x").map(p=>p.trim());
  const diameter = (parts[0] || "14").replace(/"/g,"");
  let depth = (parts[1] || "6.5").replace(/"/g,"");
  const depthMap = {"5.5":"5 1/2","6.5":"6 1/2"};
  depth = depthMap[depth] || depth;
  return { diameter, depth };
}
const defaultPlyLengths14 = [1106,1096,1087.5,1079.5,1069];
const defaultPairThickness = 1.2;
const mouldDiameters = {
  "14": 13.875 * 25.4,
  "13": 12.875 * 25.4,
  "12": 11.875 * 25.4,
};
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
function shellSizeKey(size){
  const text = String(size || "").trim().toLowerCase();
  const match = text.match(/^(10|11|12|13|14|15|16)/);
  if(match && mouldDiameters[match[1]]) return match[1];
  if(text.includes("12")) return "12";
  if(text.includes("13")) return "13";
  return "14";
}

function baseLengthsForSize(size){
  const key = shellSizeKey(size);
  const targetDiameter = mouldDiameters[key] || mouldDiameters["14"];
  const baseDiameter = mouldDiameters["14"];
  const diameterDifference = targetDiameter - baseDiameter;
  return defaultPlyLengths14.map(length => length + Math.PI * diameterDifference);
}

function sizeAdjustmentLabel(size){
  const key = shellSizeKey(size);
  const diff = Math.PI * ((mouldDiameters[key] || mouldDiameters["14"]) - mouldDiameters["14"]);
  return `${key}" mould adjustment: ${diff.toFixed(1)} mm per layer before thickness fine-tuning`;
}

function adjustedLengths(thicknesses, size="14 x 6.5"){
  const baseLengths = baseLengthsForSize(size);
  let cumulativeDifference = 0;
  return thicknesses.map((t,i)=>{
    const diff = Number(t || defaultPairThickness) - defaultPairThickness;
    cumulativeDifference += diff;
    const adjustment = cumulativeDifference * 2 * Math.PI;
    return baseLengths[i] + adjustment;
  });
}

function autoPrice({build_type="Ply", finish="Satin", build_client="Nowak", order_type="Stock", size="14 x 6.5"}){
  const isPly = build_type === "Ply";
  const highGloss = String(finish).toLowerCase().includes("high");
  let base = isPly ? 1100 : 1300;
  if(highGloss) base += isPly ? 150 : 100;
  if(String(size).includes("13")) base -= 50;
  if(String(size).includes("12")) base -= 100;
  if(build_client === "Brady") return Math.round(base * 0.70);
  if(order_type === "Custom") return Math.round(base * 1.05);
  return base;
}


function emailDraft(d, milestone){
  const name = d.customer && d.customer !== "Stock" ? d.customer : "there";
  const subjectMap = {
    blank:"Your Nowak Drum is underway",
    machined:"Your drum shell is taking shape",
    snarebed:"Your drum has reached an important tone stage",
    sealer:"The timber is coming alive",
    shellcomplete:"Your shell is now complete",
    drumcomplete:"Your Nowak Drum is complete"
  };
  const bodyMap = {
    blank:`Hi ${name},\n\nJust a quick update from the workshop.\n\nWe've now glued the shell for your ${d.timber} ${d.size} drum and it's curing before the next stage.\n\nThis is always an exciting milestone because the individual pieces of timber have now become a single shell.\n\nWe've attached a few photos so you can follow the build.\n\nThanks again for choosing Nowak Drum Company.\n\nKelly & Kyle`,
    machined:`Hi ${name},\n\nYour ${d.timber} shell has now been machined and is really starting to take shape.\n\nThe next stage is bearing edges and snare beds, where the shell starts moving from timberwork into becoming a musical instrument.\n\nWe've attached a few workshop photos from this stage.\n\nThanks again,\n\nKelly & Kyle`,
    snarebed:`Hi ${name},\n\nAnother quick progress update.\n\nThe bearing edges and snare beds have now been cut on your ${d.timber} ${d.size} drum.\n\nThis is one of the most important stages for the response and feel of the drum.\n\nNext we'll keep moving through finishing and sealing.\n\nKelly & Kyle`,
    sealer:`Hi ${name},\n\nThe first sealer coat has now gone onto your ${d.timber} drum.\n\nThis is always one of our favourite stages because the timber really starts to reveal its depth, colour and character.\n\nWe've attached a few photos so you can see how it's coming to life.\n\nKelly & Kyle`,
    shellcomplete:`Hi ${name},\n\nYour shell is now complete and ready for final hardware and assembly.\n\nIt's looking fantastic, and we're really happy with how the ${d.timber} has finished up.\n\nNot long to go now.\n\nKelly & Kyle`,
    drumcomplete:`Hi ${name},\n\nGreat news — your ${d.timber} ${d.size} drum is complete.\n\nWe'll send through final photos and any remaining details shortly.\n\nThank you again for supporting Nowak Drum Company.\n\nKelly & Kyle`
  };
  return { subject: subjectMap[milestone.key] || "Nowak Drum update", body: bodyMap[milestone.key] || "" };
}

function socialPost(d, milestone, platform="facebook"){
  const common = `${d.timber || "Australian hardwood"} · ${d.size || ""} · ${d.build_type || ""}`;
  const stockLine = d.sales_status === "Stock" ? "This one will be available soon." : "A custom build taking shape in the workshop.";
  const isBrady = d.build_client === "Brady";
  const milestoneText = {
    blank:"Freshly glued and curing. Every drum starts here — timber, pressure, glue, and a lot of patience.",
    machined:"Machining complete. The shell is now round, clean and starting to show its voice.",
    snarebed:"Bearing edges and snare beds cut. This is where the shell begins to become an instrument.",
    sealer:"First sealer coat is on. The timber has started to come alive.",
    shellcomplete:"Shell complete and ready for final assembly.",
    drumcomplete:"Completed and ready to play."
  }[milestone.key] || "Workshop update.";

  if(platform==="instagram"){
    return `${milestoneText}\n\n${common}\n${isBrady ? "Built for Brady Drums." : "Handmade by Nowak Drum Company."}\n\n#nowakdrums #customdrums #snaredrum #australianmade #drumbuilding`;
  }
  return `${milestoneText}\n\n${common}\n\n${stockLine}\n\n${isBrady ? "Built for Brady Drums." : "Built in Western Australia by Nowak Drum Company."}\n\nBuilt with precision. Played with passion.`;
}

function mailtoLink(d, draft){
  const to = d.customer_email || "";
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
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
      size:form.size || "14 x 6.5",
      finish:form.finish || "TBD",
      customer:form.order_type === "Stock" ? "Stock" : "",
      production_status:isPly ? "Veneer Ready" : "Glued Blank",
      sales_status:form.order_type === "Stock" ? "Stock" : "Custom Order",
      next_step:isPly ? "Confirm veneer thicknesses and cut lengths" : "Machine shell",
      retail_price:Number(form.custom_price || 0),
      custom_price:Number(form.custom_price || 0),
      shipping_cost:Number(form.shipping_cost || 0),
      total_price:Number(form.total_price || form.custom_price || 0),
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
    <header className="hero"><div><h1>Nowak Workshop OS</h1><p>v1.4 — milestone emails, social posts and photo prompts.</p></div><button onClick={loadAll}><RefreshCw size={16}/> Refresh</button></header>
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
      <button className={view==="comms"?"active":""} onClick={()=>setView("comms")}><Mail size={16}/> Comms</button>
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

    {view==="comms" && <section>
      <div className="panel"><h2>Communication Centre</h2><p>Generate customer emails and Facebook/Instagram posts from production milestones. Emails are signed Kelly & Kyle.</p></div>
      <section className="templateGrid">{filtered.map(d=><CommsCard key={d.id} drum={d} openJobCard={openJobCard}/>)}</section>
    </section>}

        {jobCard && <JobCard drum={jobCard} template={templateMap[jobCard.template_name]} labourRate={labourRate} onClose={()=>setJobCard(null)} updateDrum={updateDrum} completeDrum={completeDrum} addTime={addTime} markSold={markSold} copyMarketing={copyMarketing}/>}
  </main>
}

function DrumCard({drum, openJobCard}){
  return <article className={"card clickable " + (drum.build_client==="Brady"?"bradyCard":"")} onClick={()=>openJobCard(drum)}><b>#{drum.serial} {drum.timber}</b>{drum.build_client==="Brady" && <span className="cbBadge">CB {drum.cb_number || "No CB #"}</span>}<span>{drum.size} · {drum.production_status}</span><div className="progress"><i style={{width:stagePercent(drum.production_status)+"%"}}></i></div><p>{drum.next_step}</p></article>
}

function VeneerCalculator({drums, updateDrum, openJobCard}){
  const [manual,setManual]=useState([1.2,1.2,1.2,1.2,1.2]);
  const [manualSize,setManualSize]=useState("14 x 6.5");
  const manualLengths=adjustedLengths(manual, manualSize);
  return <section>
    <div className="panel"><h2>Ply Veneer Cut Calculator</h2><p>Enter the actual thickness of each glued pair/sheet group. The calculator now shows the mould-size adjustment, so 12&quot;, 13&quot; and 14&quot; cut lists are visibly different.</p></div>
    <section className="panel"><h2>Manual Calculator</h2><label>Shell size</label><select value={manualSize} onChange={e=>setManualSize(e.target.value)}><option>14 x 6.5</option><option>14 x 5.5</option><option>13 x 7</option><option>12 x 7</option></select><p className="calcNote">{sizeAdjustmentLabel(manualSize)}</p><div className="veneerGrid">{manual.map((v,i)=><label key={i}>Layer {i+1} thickness mm<input value={v} onChange={e=>{const n=[...manual]; n[i]=e.target.value; setManual(n)}}/></label>)}</div><VeneerResult lengths={manualLengths}/></section>
    <section className="panel"><h2>Ply Drums</h2><div className="templateGrid">{drums.map(d=>{const t=[d.veneer_1_thickness,d.veneer_2_thickness,d.veneer_3_thickness,d.veneer_4_thickness,d.veneer_5_thickness].map(x=>x||1.2); return <article className="card" key={d.id}><b>#{d.serial} {d.timber}</b><span>{d.size} · {d.production_status}</span><div className="veneerGrid small">{t.map((v,i)=><label key={i}>L{i+1}<input value={v} onChange={e=>updateDrum(d.id,{[`veneer_${i+1}_thickness`]:Number(e.target.value)})}/></label>)}</div><p className="calcNote">{sizeAdjustmentLabel(d.size)}</p><VeneerResult lengths={adjustedLengths(t, d.size)}/><button onClick={()=>openJobCard(d)}>Open job card</button></article>})}</div></section>
  </section>
}
function VeneerResult({lengths}){ return <div className="resultList">{lengths.map((l,i)=><div key={i}><b>Layer {i+1}</b><span>{l.toFixed(1)} mm</span></div>)}</div> }

function Inventory({hardware, updateHardware, lowStock, inventoryValue}){ return <section className="panel"><h2>Hardware Inventory</h2><p>{hardware.length} parts · {lowStock} low stock alerts · {money(inventoryValue)} stock value</p><div className="tableWrap"><table><thead><tr><th>Part</th><th>Code</th><th>Finish</th><th>Size</th><th>Qty</th><th>Reorder</th><th>Landed AUD</th><th>Status</th></tr></thead><tbody>{hardware.map(p=><tr key={p.id}><td>{p.part_name}<br/><small>{p.category}</small></td><td>{p.code}</td><td>{p.finish}</td><td>{p.size}</td><td><input value={p.qty_on_hand??0} onChange={e=>updateHardware(p.id,{qty_on_hand:Number(e.target.value)})}/></td><td>{p.reorder_level}</td><td>{money(p.landed_cost_aud)}</td><td>{Number(p.qty_on_hand||0)<=Number(p.reorder_level||0)?<span className="dangerText">Order</span>:<span className="okText">OK</span>}</td></tr>)}</tbody></table></div></section> }
function Costing({templates, labourRate, setLabourRate}){ return <section className="panel"><h2>Costing Templates</h2><label className="inlineLabel">Labour rate <input value={labourRate} onChange={e=>setLabourRate(Number(e.target.value))}/></label><div className="templateGrid">{templates.map(t=>{const total=templateCost(t,labourRate), profit=Number(t.retail_price||0)-total; return <article className="card" key={t.id}><b>{t.name}</b><span>Hardware: {money(t.hardware_cost)}</span><span>Timber: {money(t.timber_cost)}</span><span>Consumables: {money(t.consumables)}</span><span>Labour: {t.labour_hours} hrs × {money(labourRate)}</span><hr/><span>Total cost: {money(total)}</span><span>Retail: {money(t.retail_price)}</span><b>Estimated profit: {money(profit)}</b></article>})}</div></section> }





function CommsCard({drum, openJobCard}){
  const [milestoneKey,setMilestoneKey]=useState("blank");
  const milestone = communicationMilestones.find(m=>m.key===milestoneKey) || communicationMilestones[0];
  const draft = emailDraft(drum, milestone);
  const fb = socialPost(drum, milestone, "facebook");
  const insta = socialPost(drum, milestone, "instagram");

  function copy(text,label){
    navigator.clipboard?.writeText(text);
    alert(label + " copied");
  }

  return <article className={"panel " + (drum.build_client==="Brady"?"bradyCard":"")}>
    <h2>#{drum.serial} {drum.timber}</h2>
    {drum.build_client==="Brady" && <span className="cbBadge">CB {drum.cb_number || "No CB #"}</span>}
    <p>{drum.size} · {drum.build_type} · {drum.production_status}</p>
    <label>Milestone</label>
    <select value={milestoneKey} onChange={e=>setMilestoneKey(e.target.value)}>
      {communicationMilestones.map(m=><option key={m.key} value={m.key}>{m.label}</option>)}
    </select>
    <p className="calcNote">Photo prompt: {milestone.photo}</p>

    <h3>Customer Email</h3>
    {drum.customer_email ? <p className="okText">Email available: {drum.customer_email}</p> : <p className="dangerText">No customer email saved yet.</p>}
    <pre>Subject: {draft.subject}

{draft.body}</pre>
    <section className="buttonRow">
      <a className="buttonLike primary" href={mailtoLink(drum,draft)}><Mail size={16}/> Open email</a>
      <button onClick={()=>copy(`Subject: ${draft.subject}\n\n${draft.body}`,"Email")}>Copy email</button>
    </section>

    <h3>Facebook</h3>
    <pre>{fb}</pre>
    <button onClick={()=>copy(fb,"Facebook post")}><Share2 size={16}/> Copy Facebook</button>

    <h3>Instagram</h3>
    <pre>{insta}</pre>
    <button onClick={()=>copy(insta,"Instagram caption")}><Share2 size={16}/> Copy Instagram</button>

    <button onClick={()=>openJobCard(drum)}>Open job card</button>
  </article>
}


function AddDrumWizard({onClose, onCreate}){
  const [form,setForm]=useState({
    build_type:"Stave",
    diameter:"14",
    depth:"6 1/2",
    timber:"Jarrah",
    customTimber:"",
    finish:"Satin",
    build_client:"Nowak",
    order_type:"Stock",
    cb_number:"",
    shipping_cost:0,
    veneer:[1.2,1.2,1.2,1.2,1.2],
  });

  const size = buildSize(form.diameter, form.depth);
  const timber = form.timber === "Custom / Other" ? form.customTimber : form.timber;
  const isPly = form.build_type === "Ply";
  const lengths = adjustedLengths(form.veneer, size);
  const calculatedPrice = autoPrice({...form, size});
  const total = Number(calculatedPrice || 0) + Number(form.shipping_cost || 0);

  function setField(key,value){ setForm(f=>({...f,[key]:value})); }
  function setVeneer(index,value){
    setForm(f=>{
      const veneer=[...f.veneer];
      veneer[index]=value;
      return {...f,veneer};
    });
  }

  function create(){
    onCreate({
      ...form,
      timber,
      size,
      custom_price: calculatedPrice,
      total_price: total,
    });
  }

  return <div className="modalBg" onClick={onClose}>
    <div className="modal wizardModal" onClick={e=>e.stopPropagation()}>
      <button className="close" onClick={onClose}>×</button>
      <h2>Add Drum</h2>
      <p>Choose shell type, size, timber, finish and order type. Pricing and veneer cut lengths update automatically.</p>

      <section className="choiceRow">
        <button className={form.build_type==="Stave" ? "primary bigChoice" : "bigChoice"} onClick={()=>setField("build_type","Stave")}>Stave shell</button>
        <button className={form.build_type==="Ply" ? "primary bigChoice" : "bigChoice"} onClick={()=>setField("build_type","Ply")}>Ply shell</button>
      </section>

      <section className="jobGrid two">
        <div className="panel inner">
          <h2>Basic Details</h2>

          <div className="twoInputGrid">
            <label>Diameter
              <select value={form.diameter} onChange={e=>setField("diameter",e.target.value)}>
                {drumDiameters.map(d=><option key={d}>{d}</option>)}
              </select>
            </label>
            <label>Depth
              <select value={form.depth} onChange={e=>setField("depth",e.target.value)}>
                {drumDepths.map(d=><option key={d}>{d}</option>)}
              </select>
            </label>
          </div>

          <p className="calcNote">Selected size: {size}"</p>

          <label>Material / timber</label>
          <select value={form.timber} onChange={e=>setField("timber",e.target.value)}>
            {timberOptions.map(t=><option key={t}>{t}</option>)}
          </select>

          {form.timber === "Custom / Other" && <>
            <label>Custom material</label>
            <input value={form.customTimber} onChange={e=>setField("customTimber",e.target.value)} placeholder="Enter custom timber/material"/>
          </>}

          <label>Finish</label>
          <select value={form.finish} onChange={e=>setField("finish",e.target.value)}>
            <option>Satin</option>
            <option>High Gloss</option>
            <option>Natural / Oil</option>
            <option>TBD</option>
          </select>

          <label>Order type</label>
          <select value={form.order_type} onChange={e=>setField("order_type",e.target.value)}>
            <option>Stock</option>
            <option>Custom</option>
          </select>

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
            <p>The cut lengths automatically adjust for the selected diameter, then fine-tune again based on actual veneer thickness.</p>
            <p className="calcNote">{sizeAdjustmentLabel(size)}</p>
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

          <h2>Auto Pricing</h2>
          <div className="resultList twoCols">
            <div><b>Calculated price</b><span>{money(calculatedPrice)}</span></div>
            <div><b>Shipping</b><span><input value={form.shipping_cost} onChange={e=>setField("shipping_cost",e.target.value)}/></span></div>
            <div><b>Total</b><span>{money(total)}</span></div>
            <div><b>Basis</b><span>{form.build_client==="Brady" ? "CB wholesale" : form.order_type}</span></div>
          </div>
        </div>
      </section>

      <section className="buttonRow">
        <button onClick={onClose}>Cancel</button>
        <button className="primary" onClick={create}>Create drum</button>
      </section>
    </div>
  </div>
}


function SizeEditor({drum, updateDrum}){
  const parsed = splitSize(drum.size);
  const [diameter,setDiameter]=useState(parsed.diameter);
  const [depth,setDepth]=useState(parsed.depth);

  function save(nextDiameter=diameter, nextDepth=depth){
    updateDrum(drum.id,{size:buildSize(nextDiameter,nextDepth)});
  }

  return <div className="twoInputGrid">
    <select value={diameter} onChange={e=>{setDiameter(e.target.value); save(e.target.value, depth);}}>
      {drumDiameters.map(d=><option key={d}>{d}</option>)}
    </select>
    <select value={depth} onChange={e=>{setDepth(e.target.value); save(diameter, e.target.value);}}>
      {drumDepths.map(d=><option key={d}>{d}</option>)}
    </select>
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
        <label>Size</label><SizeEditor drum={drum} updateDrum={updateDrum}/>
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

    {drum.build_type==="Ply" && <section className="panel inner"><h2>Ply Veneer Calculator</h2><div className="veneerGrid">{veneer.map((v,i)=><label key={i}>Layer {i+1} thickness<input value={v} onChange={e=>updateDrum(drum.id,{[`veneer_${i+1}_thickness`]:Number(e.target.value)})}/></label>)}</div><p className="calcNote">{sizeAdjustmentLabel(drum.size)}</p><VeneerResult lengths={adjustedLengths(veneer, drum.size)}/></section>}

    <section className="panel inner"><h2>Manufacturing Checklist</h2><div className="checkGrid">{checklist.map(item=><label className="checkItem" key={item}><input type="checkbox" checked={checked.has(item)} onChange={()=>toggle(item)}/>{item}</label>)}</div><button className="primary" onClick={saveChecklist}><Save size={16}/> Save checklist to notes</button></section>

    <section className="panel inner">
      <h2>Milestone Communications</h2>
      <p>Use the Communication Centre for full posts/emails. Photo prompts for this drum:</p>
      <div className="checkGrid">
        {communicationMilestones.map(m=><div className="checkItem" key={m.key}><b>{m.label}</b><span>{m.photo}</span></div>)}
      </div>
    </section>

    <section className="panel inner"><h2>Notes</h2><textarea defaultValue={drum.notes||""} onBlur={e=>updateDrum(drum.id,{notes:e.target.value})}/></section>
    <section className="buttonRow"><button className="primary" onClick={()=>copyMarketing(drum)}><Camera size={16}/> Copy marketing</button><button onClick={()=>markSold(drum)}><Truck size={16}/> Mark sold / shipped</button></section>
  </div></div>
}

createRoot(document.getElementById("root")).render(<App />);

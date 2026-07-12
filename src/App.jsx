
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Hammer, LayoutDashboard, RefreshCw, Plus, CheckCircle2, Package, DollarSign,
  Camera, ListChecks, Search, Clock, Truck, Save, Ruler, Users, Mail, Share2,
  Settings, Layers3, FolderPlus, BarChart3
} from "lucide-react";
import { supabase, isConfigured } from "./supabaseClient";
import nowakLogo from "./assets/nowak-logo-refined.png";
import "./style.css";

const stages = [
  "Veneer Ready","In Mould","Post-Mould","Glued Blank","Machined",
  "Edges / Snare Beds","Ready to Drill","Sealer Coat","Polyurethane Coat 1",
  "Polyurethane Coat 2","Polyurethane Coat 3","Polyurethane Coat 4",
  "Finished Spraying / Curing","Ready to Polish","Ready to Assemble",
  "Finished / Ready to Sell","Sold/Shipped"
];

const checklist = [
  "Timber / veneer ready","Glue up complete","Machined","Sanded",
  "Bearing edges cut","Snare beds cut","Drilled","Inside oiled / sealed",
  "Sealer coat","Poly coat 1","Poly coat 2","Poly coat 3","Poly coat 4","Satin coat",
  "Danish oil 1","Danish oil 2","Danish oil 3",
  "Cure complete","Polished","Assembled","Photos taken","Website listing",
  "Facebook / Instagram","YouTube demo","Packed","Shipped"
];

const fulfilmentChecklist = ["Photos taken","Packed","Shipped"];
const marketingChecklist = ["Website listing","Facebook / Instagram","YouTube demo"];

function manufacturingChecklist(buildType,finish=""){
  return applicableChecklist(buildType,finish).filter(
    item=>!fulfilmentChecklist.includes(item) && !marketingChecklist.includes(item)
  );
}


const workflowEstimates = {
  Stave: {
    "Timber / veneer ready":1.50,
    "Glue up complete":0.25,
    "Machined":1.00,
    "Sanded":1.00,
    "Bearing edges cut":0.50,
    "Snare beds cut":0.50,
    "Drilled":0.50,
    "Inside oiled / sealed":0.25,
    "Sealer coat":0.20,
    "Poly coat 1":0.20,
    "Poly coat 2":0.20,
    "Poly coat 3":0.20,
    "Poly coat 4":0.20,
    "Satin coat":0.20,
    "Danish oil 1":0.25,
    "Danish oil 2":0.25,
    "Danish oil 3":0.25,
    "Cure complete":0,
    "Polished":1.00,
    "Assembled":0.50,
    "Photos taken":0.50,
    "Website listing":0.25,
    "Facebook / Instagram":0.25,
    "YouTube demo":0.50,
    "Packed":0.50,
    "Shipped":0.25,
  },
  Ply: {
    "Timber / veneer ready":1.25,
    "Glue up complete":0.50,
    "Sanded":0.50,
    "Bearing edges cut":0.25,
    "Snare beds cut":0.25,
    "Drilled":0.50,
    "Inside oiled / sealed":0.25,
    "Sealer coat":0.20,
    "Poly coat 1":0.20,
    "Poly coat 2":0.20,
    "Poly coat 3":0.20,
    "Poly coat 4":0.20,
    "Satin coat":0.20,
    "Danish oil 1":0.25,
    "Danish oil 2":0.25,
    "Danish oil 3":0.25,
    "Cure complete":0,
    "Polished":1.00,
    "Assembled":0.50,
    "Photos taken":0.50,
    "Website listing":0.25,
    "Facebook / Instagram":0.25,
    "YouTube demo":0.50,
    "Packed":0.50,
    "Shipped":0.25,
  }
};

const workflowLabels = {
  "Timber / veneer ready": {status:"Materials Ready", next:"Complete the shell glue-up"},
  "Glue up complete": {status:"Shell Glued", next:"Machine the shell"},
  "Machined": {status:"Machining Complete", next:"Sand the shell"},
  "Sanded": {status:"Sanding Complete", next:"Cut the bearing edges"},
  "Bearing edges cut": {status:"Bearing Edges Complete", next:"Cut the snare beds"},
  "Snare beds cut": {status:"Snare Beds Complete", next:"Drill the hardware holes"},
  "Drilled": {status:"Drilling Complete", next:"Oil or seal the inside"},
  "Inside oiled / sealed": {status:"Inside Sealed", next:"Spray the sealer coat"},
  "Sealer coat": {status:"Sealer Coat Complete", next:"Spray polyurethane coat 1"},
  "Poly coat 1": {status:"Polyurethane Coat 1 Complete", next:"Spray polyurethane coat 2"},
  "Poly coat 2": {status:"Polyurethane Coat 2 Complete", next:"Spray polyurethane coat 3"},
  "Poly coat 3": {status:"Polyurethane Coat 3 Complete", next:"Spray polyurethane coat 4"},
  "Poly coat 4": {status:"Final Gloss Coat Complete", next:"Allow the finish to cure"},
  "Satin coat": {status:"Satin Coat Complete", next:"Allow the finish to cure"},
  "Danish oil 1": {status:"Danish Oil Coat 1 Complete", next:"Apply Danish oil coat 2"},
  "Danish oil 2": {status:"Danish Oil Coat 2 Complete", next:"Apply Danish oil coat 3"},
  "Danish oil 3": {status:"Danish Oil Complete", next:"Allow the finish to cure"},
  "Cure complete": {status:"Finish Cured", next:"Polish the shell"},
  "Polished": {status:"Polishing Complete", next:"Assemble the drum"},
  "Assembled": {status:"Drum Assembled", next:"Take final photographs"},
  "Photos taken": {status:"Photography Complete", next:"Create the website listing"},
  "Website listing": {status:"Website Listed", next:"Create Facebook and Instagram content"},
  "Facebook / Instagram": {status:"Social Media Complete", next:"Record the YouTube demo"},
  "YouTube demo": {status:"Marketing Complete", next:"Pack the drum"},
  "Packed": {status:"Packed", next:"Ship the drum"},
  "Shipped": {status:"Sold / Shipped", next:"Complete"},
};

function applicableChecklist(buildType, finish=""){
  const finishText=String(finish || "").toLowerCase();
  const isNatural=finishText.includes("natural");
  const isSatin=finishText.includes("satin");

  return checklist.filter(item=>{
    if(buildType==="Ply" && item==="Machined") return false;

    if(isNatural){
      if([
        "Sealer coat","Poly coat 1","Poly coat 2","Poly coat 3","Poly coat 4",
        "Satin coat","Cure complete","Polished"
      ].includes(item)) return false;
    }else{
      if(["Danish oil 1","Danish oil 2","Danish oil 3"].includes(item)) return false;

      if(isSatin){
        if(["Poly coat 4","Polished"].includes(item)) return false;
      }else{
        if(item==="Satin coat") return false;
      }
    }

    return true;
  });
}

function hasProductionNumber(drum){
  return /^\s*#?\d+\s*$/.test(String(drum?.serial || ""));
}

function drumLifecycleStatus(drum){
  const explicit=String(drum?.lifecycle_status || "").trim();
  if(explicit) return explicit;

  const legacy=String(drum?.sales_status || "").trim();
  if(legacy==="Shipped") return "Shipped";
  if(legacy==="Sold") return "Sold";
  if(legacy==="Sold/Shipped") return "Shipped";
  if(drum?.production_status==="Manufacturing Complete") return "Completed";
  return "";
}

function isSoldStatus(drum){
  return drumLifecycleStatus(drum)==="Sold";
}

function isShippedStatus(drum){
  return drumLifecycleStatus(drum)==="Shipped";
}

function isManufacturingComplete(drum){
  if(isSoldStatus(drum) || isShippedStatus(drum)) return true;
  if(drum?.production_status==="Manufacturing Complete") return true;
  const checked=parseChecked(drum?.notes);
  return checked.has("Assembled");
}

function productionPriorityCompare(a,b){
  const aNumbered=hasProductionNumber(a);
  const bNumbered=hasProductionNumber(b);

  if(aNumbered!==bNumbered) return aNumbered ? -1 : 1;

  const aAllocated=a.build_client!=="Unallocated";
  const bAllocated=b.build_client!=="Unallocated";
  if(aAllocated!==bAllocated) return aAllocated ? -1 : 1;

  if(aNumbered && bNumbered){
    return extractNumber(a.serial)-extractNumber(b.serial);
  }

  return String(a.timber || "").localeCompare(String(b.timber || ""));
}

function hasWorkflowStarted(drum){
  return parseChecked(drum.notes).size > 0;
}

function checklistDisplayLabel(item,buildType){
  if(item==="Timber / veneer ready"){
    return buildType==="Ply" ? "Veneer ready" : "Timber cut and ready";
  }
  return item;
}

function workflowStatusLabel(item,buildType){
  if(item==="Timber / veneer ready"){
    return buildType==="Ply" ? "Veneer Ready" : "Timber Cut and Ready";
  }
  return workflowLabels[item]?.status || item;
}

function workflowNextInstruction(nextItem,buildType){
  const instructions = {
    "Timber / veneer ready":buildType==="Ply" ? "Prepare veneer" : "Cut and prepare timber",
    "Glue up complete":"Complete the shell glue-up",
    "Machined":"Machine the shell",
    "Sanded":"Sand the shell",
    "Bearing edges cut":"Cut the bearing edges",
    "Snare beds cut":"Cut the snare beds",
    "Drilled":"Drill the hardware holes",
    "Inside oiled / sealed":"Oil or seal the inside",
    "Sealer coat":"Spray the sealer coat",
    "Poly coat 1":"Spray polyurethane coat 1",
    "Poly coat 2":"Spray polyurethane coat 2",
    "Poly coat 3":"Spray polyurethane coat 3",
    "Poly coat 4":"Spray polyurethane coat 4",
    "Satin coat":"Spray the final satin coat",
    "Danish oil 1":"Apply Danish oil coat 1",
    "Danish oil 2":"Apply Danish oil coat 2",
    "Danish oil 3":"Apply Danish oil coat 3",
    "Cure complete":"Allow the finish to cure",
    "Polished":"Polish the shell",
    "Assembled":"Assemble the drum",
    "Photos taken":"Take final photographs",
    "Website listing":"Create the website listing",
    "Facebook / Instagram":"Create Facebook and Instagram content",
    "YouTube demo":"Record the YouTube demo",
    "Packed":"Pack the drum",
    "Shipped":"Ship the drum",
  };
  return instructions[nextItem] || nextItem || "Complete";
}

function workflowState(buildType, checked, finish=""){
  const steps=manufacturingChecklist(buildType,finish);
  let completedCount=0;
  for(const step of steps){
    if(checked.has(step)) completedCount += 1;
    else break;
  }

  const previous=completedCount>0 ? steps[completedCount-1] : null;
  const next=steps[completedCount] || null;
  const status=previous ? workflowStatusLabel(previous,buildType) : "Ready to Start";
  const nextStep=next ? workflowNextInstruction(next,buildType) : "Complete";
  const estimates=workflowEstimates[buildType] || workflowEstimates.Stave;
  const estimatedCompleted=steps.slice(0,completedCount).reduce((sum,item)=>sum+Number(estimates[item]||0),0);
  const estimatedTotal=steps.reduce((sum,item)=>sum+Number(estimates[item]||0),0);
  const percent=steps.length ? Math.round((completedCount/steps.length)*100) : 0;

  return {
    steps, completedCount, status, nextStep, percent,
    estimatedCompleted,
    estimatedRemaining:Math.max(0,estimatedTotal-estimatedCompleted),
    estimatedTotal
  };
}

function historyForItem(stageHistory,item){
  const history=Array.isArray(stageHistory) ? stageHistory : [];
  return history.find(entry=>entry.item===item && entry.completed);
}

function formatStageDate(value){
  if(!value) return "";
  try{
    return new Intl.DateTimeFormat("en-AU",{day:"numeric",month:"short",year:"numeric"}).format(new Date(value));
  }catch{
    return "";
  }
}

const drumDiameters = ["8","10","12","13","14","16","18","20","22","24"];
const drumDepths = ["5","5 1/2","6","6 1/2","7","8","10","12","14","16","18"];
const drumTypeOptions = ["Snare","Tom","Floor Tom","Bass Drum"];
const timberOptions = [
  "Jarrah","Jarrah Staircase","Jarrah Fiddleback",
  "Marri","Marri Fiddleback",
  "Blackbutt","Blackwood","Wandoo",
  "Sheoak","Spotted Gum","River Banksia","Tri Colour","Custom / Other"
];

const communicationMilestones = [
  {key:"blank", label:"Blank glued", photo:"Glue-up blank, clamps/press, end grain, timber detail"},
  {key:"machined", label:"Machined shell", photo:"Lathe shot, inside shell, outside shell, shell thickness"},
  {key:"snarebed", label:"Snare bed / edges cut", photo:"Bearing edge, snare bed close-up, shell on bench"},
  {key:"sealer", label:"Sealer coat sprayed", photo:"First sealer coat, grain close-up, before/after look"},
  {key:"shellcomplete", label:"Shell completed", photo:"Finished shell, inside shell, edges, badge/vent if fitted"},
  {key:"drumcomplete", label:"Drum completed", photo:"Full drum, detail shots, throw-off, hoops, glamour shot"}
];


const photoMilestoneByChecklist = {
  "Timber / veneer ready":"wood",
  "Glue up complete":"blank",
  "Machined":"machined",
  "Sealer coat":"sealer",
  "Assembled":"drumcomplete",
  "Polished":"shellcomplete",
};

const photoMilestones = {
  general:{
    label:"Additional Build Photo",
    prompt:"Take or upload any useful workshop photo for this drum. Add or edit the caption before storing it.",
    social:"Another look behind the scenes at this build in the Nowak workshop. Every stage contributes to the final sound, feel and character of the finished drum.",
  },
  wood:{
    label:"Materials ready",
    prompt:"Take or upload the prepared timber or veneer, grain, colour and provenance photos.",
    social:"A new drum build is underway in the Nowak workshop. We have selected the timber and are preparing the pieces that will become the shell. This stage is where the character of the finished drum begins—grain, colour, figure and the individual story of the timber all start here.",
  },
  blank:{
    label:"Shell blank glued",
    prompt:"Take or upload the glued shell blank, clamps or mould, end grain and timber detail.",
    social:"The shell blank has now been glued and is curing in the workshop. The individual pieces have come together to form the foundation of the drum, with the grain and colour already beginning to show how the finished shell will look.",
  },
  machined:{
    label:"Shell machined",
    prompt:"Take or upload the shell on the lathe, inside and outside of the shell, and shell thickness.",
    social:"The shell has now been machined to its final dimensions. This is one of the most important stages of the build, where the rough blank becomes a precise drum shell and the timber reveals its true character inside and out.",
  },
  sealer:{
    label:"First sealer coat",
    prompt:"Take or upload the first sealer coat, grain close-ups and before/after appearance.",
    social:"The first sealer coat has been applied and the timber is really coming alive. The colour, grain and figure deepen dramatically at this stage, giving the first proper glimpse of how the completed drum will look.",
  },
  shellcomplete:{
    label:"Brady shell complete",
    prompt:"Take or upload several completed-shell photos: outside, inside, bearing edges, snare beds and finish.",
    social:"This shell is now complete. The machining, sanding, edges, snare beds and finish have all been completed, and the shell is ready for the next stage of its journey.",
  },
  drumcomplete:{
    label:"Finished drum",
    prompt:"Take or upload full drum photos, details, throw-off, hoops and a final glamour image.",
    social:"The drum is now complete. From the original timber through every stage of machining, finishing and assembly, it has been built by hand in Western Australia and is now ready to be played.",
  },
};

function photoMilestoneForCompletion(drum,item){
  const key=photoMilestoneByChecklist[item];
  if(!key) return null;

  // Brady receives a photo prompt only when the completed shell is polished.
  if(drum.build_client==="Brady"){
    return item==="Polished" ? "shellcomplete" : null;
  }

  // Stock and custom Nowak drums use the production milestones.
  if(drum.build_client==="Nowak"){
    if(drum.build_type==="Ply" && item==="Machined") return null;
    return key;
  }

  return null;
}

function isCustomCustomerDrum(drum){
  return drum.build_client==="Nowak" && drum.sales_status==="Custom Order";
}

function milestoneMessage(drum,milestoneKey){
  const base=photoMilestones[milestoneKey] || photoMilestones.blank;
  const m={
    ...base,
    label:milestoneKey==="shellcomplete"
      ? drum.build_client==="Brady"
        ? "Brady Shell Complete"
        : drum.build_client==="Nowak"
          ? (isCustomCustomerDrum(drum) ? "Nowak Custom Drum Complete" : "Nowak Drum Complete")
          : "Shell Complete"
      : base.label,
  };
  const customer=allocatedCustomerName(drum);
  const descriptor=`${drum.timber || ""} ${drum.size || ""} ${drum.drum_type || "drum"}`.trim();

  const isComplete=["shellcomplete","drumcomplete","launch_final"].includes(milestoneKey);
  const photoLine=isComplete
    ? "We have included a selection of photos showing the completed drum and its journey through the workshop."
    : "We have included a few photos so you can follow the build as it progresses.";

  return {
    social:`${m.social}\n\n${descriptor}\n\nBuilt in Western Australia by Nowak Drum Company.`,
    instagram:`${m.social}\n\n${descriptor}\n\n#NowakDrums #AustralianHardwoods #HandmadeDrums #MadeInAustralia`,
    emailSubject:`Your ${descriptor} – ${m.label}`,
    emailBody:`Hi ${customer || "there"},\n\nA quick update from the Nowak workshop.\n\n${m.social}\n\n${photoLine}\n\nThanks again for choosing Nowak Drum Company.\n\nKelly & Kyle`,
  };
}


const launchPackStages = [
  {
    key:"launch_timber",
    label:"Timber",
    prompt:"Take 1–3 photos of the timber or veneer before cutting.",
    accept:"image/*",
    recommended:"1–3 photos",
  },
  {
    key:"launch_machined",
    label:"Machined Shell",
    prompt:"Take 2–4 photos of the machined shell: overall, inside, grain and close-up.",
    accept:"image/*",
    recommended:"2–4 photos",
  },
  {
    key:"launch_reveal",
    label:"Finish Reveal",
    prompt:"High Gloss: record a 10–20 second shell reveal video. Satin or Natural: take 2–3 reveal photos.",
    accept:"image/*,video/*",
    recommended:"1 video or 2–3 photos",
  },
  {
    key:"launch_final",
    label:"Completed Drum",
    prompt:"Capture approximately 8–10 final photos: hero, front, side, badge, grain, bearing edge, inside, hardware and lifestyle.",
    accept:"image/*",
    recommended:"8–10 photos",
  },
];

function launchPackFacebook(drum){
  const size=drum.size || "";
  const timber=drum.timber || "";
  const finish=drum.finish || "";
  const type=drum.drum_type || "Snare";
  const construction=drum.build_type || "";
  const production=drum.serial || "";
  return `Introducing Production #${production}

This ${size} ${timber} ${construction.toLowerCase()} ${type.toLowerCase()} began with carefully selected Australian timber before being shaped, finished and assembled by hand in our Western Australian workshop.

Swipe through the photos to follow the journey from the original timber, through the machined shell and finish reveal, to the completed drum.

Specifications
• ${size}
• ${timber}
• ${construction}
• ${finish} finish
• Handmade in Western Australia

For enquiries about a custom Australian hardwood drum, send us a message.

#NowakDrums #AustralianHardwoods #HandmadeDrums #MadeInWesternAustralia`;
}

function launchPackInstagram(drum){
  const size=drum.size || "";
  const timber=drum.timber || "";
  const finish=drum.finish || "";
  const construction=drum.build_type || "";
  return `From timber to finished instrument.

${size} ${timber} ${construction} drum in ${finish} finish, handmade in Western Australia.

Swipe through the build journey.

#NowakDrums #AustralianHardwoods #CustomDrums #DrumBuilder #MadeInAustralia #Handcrafted`;
}

function launchPackCustomerEmail(drum){
  const name=allocatedCustomerName(drum) || "there";
  const descriptor=`${drum.timber || ""} ${drum.size || ""} ${drum.drum_type || "drum"}`.trim();
  return {
    subject:`Your ${descriptor} is complete`,
    body:`Hi ${name},

Your ${descriptor} is now complete.

We have put together a selection of photos showing the journey from the original timber through machining, finishing and final assembly. It has been a pleasure building this drum for you, and we are looking forward to seeing it in your hands.

We will be in touch shortly with the final delivery or shipping details.

Thanks again for choosing Nowak Drum Company.

Kelly & Kyle`,
  };
}

function launchPackWebsite(drum){
  return `${drum.size || ""} ${drum.timber || ""} ${drum.build_type || ""} ${drum.drum_type || "Drum"}

Handcrafted in Western Australia from carefully selected ${drum.timber || "Australian hardwood"}. This ${drum.size || ""} drum features a ${drum.finish || ""} finish and was individually built, machined, finished and assembled in the Nowak workshop.

Each Nowak drum is made in small numbers with a focus on timber character, precision and a distinctive musical voice.`;
}

const diameterSpecs = {
  "8":  { rough:"20.64 cm", finished:"20.00 cm" },
  "10": { rough:"25.72 cm", finished:"25.08 cm" },
  "12": { rough:"30.80 cm", finished:"30.16 cm" },
  "13": { rough:"33.34 cm", finished:"32.70 cm" },
  "14": { rough:"35.88 cm", finished:"35.24 cm" },
  "16": { rough:"40.96 cm", finished:"40.32 cm" },
  "18": { rough:"46.04 cm", finished:"45.40 cm" },
  "20": { rough:"51.12 cm", finished:"50.48 cm" },
  "22": { rough:"56.20 cm", finished:"55.56 cm" },
  "24": { rough:"61.28 cm", finished:"60.64 cm" },
};

const staveSpecs = {
  "8": { triton:"25mm", stave:"21mm", comment:"Tom: 8mm shell, 14mm x 30mm re-ring" },
  "10": { triton:"30.5mm", stave:"27mm", comment:"Tom: 8mm shell, 14mm x 30mm re-ring" },
  "12": { triton:"35.5mm", stave:"32mm", comment:"Tom: 8mm shell, 14mm x 30mm re-ring" },
  "13": { triton:"38.5mm", stave:"35mm", comment:"" },
  "14": { triton:"41mm, possibly 40.5mm", stave:"37mm to 37.5mm", comment:"Tom or floor tom: 8mm shell, 14mm x 30mm re-ring" },
  "16": { triton:"46mm", stave:"43mm", comment:"Floor tom: 8mm shell, 14mm x 40mm re-ring" },
  "18": { triton:"51.5mm", stave:"48mm to 48.5mm", comment:"Floor tom or bass drum" },
  "20": { triton:"57mm", stave:"53.5mm", comment:"Bass drum: 9mm shell, 14mm x 50mm re-ring" },
  "22": { triton:"62.5mm", stave:"59mm", comment:"Bass drum" },
  "24": { triton:"67.5mm", stave:"64.5mm", comment:"Bass drum: 10mm shell, 14mm x 50mm re-ring" },
};

const priceRules = {
  "Nowak Stock": { label:"Nowak Stock", wholesaleFactor:1, customFactor:1 },
  "Nowak Custom": { label:"Nowak Custom", wholesaleFactor:1, customFactor:1.05 },
  "Brady Wholesale": { label:"Brady Wholesale", wholesaleFactor:.70, customFactor:1 },
  "Brady Custom": { label:"Brady Custom", wholesaleFactor:.70, customFactor:1.05 },
};

const defaultPlyLengths14 = [1106,1096,1087.5,1079.5,1069];
const defaultPairThickness = 1.2;
const mouldDiameters = {
  "14": 13.875 * 25.4,
  "13": 12.875 * 25.4,
  "12": 11.875 * 25.4,
};

const money = (v) => "$" + Math.round(Number(v || 0)).toLocaleString();
function buildSize(diameter, depth){ return `${diameter} x ${depth}`; }

function splitSize(size){
  const text = String(size || "14 x 6.5");
  const parts = text.split("x").map(p=>p.trim());
  const diameter = (parts[0] || "14").replace(/"/g,"");
  let depth = (parts[1] || "6.5").replace(/"/g,"");
  const depthMap = {"5.5":"5 1/2","6.5":"6 1/2"};
  return { diameter, depth: depthMap[depth] || depth };
}

function shellSizeKey(size){
  const text = String(size || "").trim().toLowerCase();
  const match = text.match(/^(10|11|12|13|14|15|16|18|20|22|24)/);
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
  let cumulativeOuterDifference = 0;

  return thicknesses.map((t,i)=>{
    // The mould controls the OUTSIDE of the shell.
    // Layer 1 is the largest outer layer, so its own thickness does not change its own cut length.
    // Each inner layer is affected only by the total thickness of the layers already outside it.
    const length = baseLengths[i] - (cumulativeOuterDifference * 2 * Math.PI);
    const diff = Number(t || defaultPairThickness) - defaultPairThickness;
    cumulativeOuterDifference += diff;
    return length;
  });
}

function staveSpecForDiameter(diameter){
  return staveSpecs[String(diameter || "").replace(/"/g,"")] || null;
}

function drumTypeComment(type, diameter){
  const d = String(diameter || "").replace(/"/g,"");
  const spec = staveSpecForDiameter(d);
  if(!spec) return "";
  if(type === "Snare") return "";
  if(type === "Tom") {
    if(["8","10","12","14"].includes(d)) return "Tom: 8mm shell, 14mm x 30mm re-ring";
  }
  if(type === "Floor Tom") {
    if(d === "14") return "Floor tom: 8mm shell, 14mm x 30mm re-ring";
    if(d === "16") return "Floor tom: 8mm shell, 14mm x 40mm re-ring";
    if(d === "18") return "Floor tom / bass drum: use 18 inch floor/bass settings";
  }
  if(type === "Bass Drum") {
    if(d === "20") return "Bass drum: 9mm shell, 14mm x 50mm re-ring";
    if(d === "24") return "Bass drum: 10mm shell, 14mm x 50mm re-ring";
    if(d === "18") return "Bass drum / floor tom: use 18 inch floor/bass settings";
    if(d === "22") return "Bass drum setting";
  }
  return spec.comment || "";
}

function nextStage(s){
  const index = stages.indexOf(s);
  return stages[Math.min(Math.max(index,0)+1, stages.length-1)] || s;
}

function batchType(d){
  const buildType=d.build_type || "Stave";
  const flow=workflowState(
    buildType,
    parseChecked(d.notes),
    d.finish
  );

  if(!flow.nextStep || flow.nextStep==="Complete") return null;

  // Ply and stave shells reach sanding from different parts of the process,
  // so keep them in separate Workshop Today queues.
  if(flow.nextStep==="Sand the shell"){
    return buildType==="Ply"
      ? "Ply Shell Sanding — Fresh from the Mould"
      : "Stave Shell Sanding — After Machining";
  }

  return flow.nextStep;
}


function allocatedCustomerName(d){
  const name=String(d?.customer || "").trim();
  if(!name) return "";
  if(["stock","unallocated","none","n/a"].includes(name.toLowerCase())) return "";
  return name;
}

function displaySalesBadge(d){
  if(d.build_client === "Brady") return "Brady Production";
  if(d.build_client === "Nowak") return "Nowak";
  return "Unallocated";
}

function salesStatusForNewDrum(form){
  if(form.build_client === "Brady") return "Brady Production";
  if(form.build_client === "Nowak") return form.order_type === "Stock" ? "Stock" : "Custom Order";
  return "Unallocated";
}

function stagePercent(s){
  const i=stages.indexOf(s);
  return i<0?0:Math.round((i/(stages.length-1))*100);
}

function templateCost(t, rate){
  if(!t) return 0;
  return Number(t.hardware_cost||0)+Number(t.timber_cost||0)+Number(t.consumables||0)+Number(t.labour_hours||0)*Number(rate||50);
}


const nowakWebsiteSnarePrices = {
  standard: {
    "12x7":1125,
    "13x7":1125,
    "14x5":1210,
    "14x5.5":1240,
    "14x6":1240,
    "14x6.5":1270,
    "14x7":1270,
    "14x8":1300,
  },
  premium: {
    "12x7":1175,
    "13x7":1175,
    "14x5":1260,
    "14x5.5":1290,
    "14x6":1290,
    "14x6.5":1320,
    "14x7":1320,
    "14x8":1355,
  },
  fiddleback: {
    "12x7":1225,
    "13x7":1225,
    "14x5":1310,
    "14x5.5":1340,
    "14x6":1340,
    "14x6.5":1370,
    "14x7":1370,
    "14x8":1400,
  },
};

function normaliseWebsiteSize(size){
  return String(size || "")
    .toLowerCase()
    .replace(/[″"]/g,"")
    .replace(/\s+/g,"")
    .replace("1/2",".5")
    .replace("½",".5");
}

function nowakWebsiteTimberTier(timber){
  const text=String(timber || "").toLowerCase();

  // The public Nowak price guide uses one Fiddleback Timber tier.
  // This applies to both Jarrah Fiddleback and Marri Fiddleback.
  if(text.includes("fiddleback")) return "fiddleback";

  if(text.includes("sheoak") || text.includes("wandoo")) return "premium";
  if(text.includes("blackbutt") || text.includes("jarrah") || text.includes("marri")) return "standard";
  return null;
}

function nowakWebsitePrice({timber,size,finish,build_type,drum_type,build_client}){
  if(build_client!=="Nowak" || build_type!=="Stave" || drum_type!=="Snare") return null;

  const tier=nowakWebsiteTimberTier(timber);
  const sizeKey=normaliseWebsiteSize(size);
  const base=tier ? nowakWebsiteSnarePrices[tier]?.[sizeKey] : null;
  if(base==null) return null;

  const finishText=String(finish || "").toLowerCase();
  if(finishText.includes("high")) return base+100;
  if(finishText.includes("natural") || finishText.includes("satin")) return base;
  return 0;
}

function autoPrice({
  build_type="Ply",
  finish="Satin",
  build_client="Nowak",
  order_type="Stock",
  size="14 x 6.5",
  price_rule="",
  drum_type="Snare",
  timber=""
}){
  const finishText=String(finish || "").toLowerCase();
  const isHighGloss=finishText.includes("high");
  const isSatin=finishText.includes("satin");

  // Brady shell-only wholesale pricing: snare shells only.
  if(build_client==="Brady" && drum_type==="Snare"){
    if(build_type==="Stave"){
      if(isHighGloss) return 650;
      if(isSatin) return 600;
      return 0;
    }

    if(build_type==="Ply"){
      if(isHighGloss) return 450;
      if(isSatin) return 400;
      return 0;
    }
  }

  // Published Nowak website price guide:
  // block-stave snare drums, by timber, size and finish.
  const websitePrice=nowakWebsitePrice({
    timber,size,finish,build_type,drum_type,build_client
  });
  if(websitePrice!==null) return websitePrice;

  // Existing fallback for configurations not listed on the public website guide.
  const isPly = build_type === "Ply";
  let base = isPly ? 1100 : 1300;
  if(isHighGloss) base += isPly ? 150 : 100;
  if(String(size).startsWith("13")) base -= 50;
  if(String(size).startsWith("12")) base -= 100;
  if(["20","22","24"].some(d=>String(size).startsWith(d))) base += 350;

  const ruleKey = price_rule || (
    build_client==="Brady"
      ? "Brady Wholesale"
      : (order_type==="Custom" ? "Nowak Custom" : "Nowak Stock")
  );
  const rule = priceRules[ruleKey] || priceRules["Nowak Stock"];
  return Math.round(base * rule.wholesaleFactor * rule.customFactor);
}

function parseChecked(notes){
  const found=new Set();
  checklist.forEach(item=>{ if((notes||"").includes(`[x] ${item}`)) found.add(item); });
  return found;
}

function setChecklistInNotes(existing, checked){
  const clean=(existing||"").split("\n").filter(line=>!line.startsWith("[x] ")&&!line.startsWith("[ ] ")).join("\n").trim();
  const block=checklist.map(item=>`${checked.has(item)?"[x]":"[ ]"} ${item}`).join("\n");
  return `${clean?clean+"\n\n":""}${block}`;
}

const outstandingWorkOptions = [
  "No outstanding work",
  "Hardware to be fitted",
  "Final assembly required",
  "Heads and tuning required",
  "Final inspection required",
  "Customer collection pending",
  "Other",
];

const assemblyResolvedOutstandingWork = new Set([
  "Hardware to be fitted",
  "Final assembly required",
  "Heads and tuning required",
]);

function outstandingWorkFromNotes(notes){
  const text=String(notes || "");
  const match=text.match(/^\[Outstanding Work:\s*(.+?)\]$/mi);
  const task=match ? match[1].trim() : "";

  // Once the drum is marked Assembled, assembly-related outstanding work
  // is considered resolved. This also corrects existing drums that still
  // contain an older Outstanding Work note.
  if(task && text.includes("[x] Assembled") && assemblyResolvedOutstandingWork.has(task)){
    return "";
  }

  return task;
}

function setOutstandingWorkInNotes(notes,value){
  const clean=String(notes || "")
    .split("\n")
    .filter(line=>!/^\[Outstanding Work:/i.test(line.trim()))
    .join("\n")
    .trim();

  const task=String(value || "").trim();
  if(!task || task==="No outstanding work") return clean;
  return `${clean?clean+"\n":""}[Outstanding Work: ${task}]`;
}

function trackingNumberFromNotes(notes){
  const match=String(notes || "").match(/^\[Tracking Number:\s*(.+?)\]$/mi);
  return match ? match[1].trim() : "";
}

function setTrackingNumberInNotes(notes,value){
  const clean=String(notes || "")
    .split("\n")
    .filter(line=>!/^\[Tracking Number:/i.test(line.trim()))
    .join("\n")
    .trim();

  const tracking=String(value || "").trim();
  if(!tracking) return clean;
  return `${clean?clean+"\n":""}[Tracking Number: ${tracking}]`;
}

function emailDraft(d, milestone){
  const name = d.customer && d.customer !== "Stock" ? d.customer : "there";
  const timberStory = d.timber_story ? `\n\nTimber story: ${d.timber_story}` : "";
  const subjectMap = {
    blank:"Your Nowak Drum is underway",
    machined:"Your drum shell is taking shape",
    snarebed:"Your drum has reached an important tone stage",
    sealer:"The timber is coming alive",
    shellcomplete:"Your shell is now complete",
    drumcomplete:"Your Nowak Drum is complete"
  };
  const bodyMap = {
    blank:`Hi ${name},\n\nJust a quick update from the workshop.\n\nWe've now glued the shell for your ${d.timber} ${d.size} drum and it's curing before the next stage.${timberStory}\n\nWe've attached a few photos so you can follow the build.\n\nThanks again for choosing Nowak Drum Company.\n\nKelly & Kyle`,
    machined:`Hi ${name},\n\nYour ${d.timber} shell has now been machined and is really starting to take shape.\n\nThe next stage is bearing edges and snare beds, where the shell starts moving from timberwork into becoming a musical instrument.\n\nKelly & Kyle`,
    snarebed:`Hi ${name},\n\nThe bearing edges and snare beds have now been cut on your ${d.timber} ${d.size} drum.\n\nThis is one of the most important stages for the response and feel of the drum.\n\nKelly & Kyle`,
    sealer:`Hi ${name},\n\nThe first sealer coat has now gone onto your ${d.timber} drum.\n\nThis is always one of our favourite stages because the timber really starts to reveal its depth, colour and character.\n\nKelly & Kyle`,
    shellcomplete:`Hi ${name},\n\nYour shell is now complete and ready for final hardware and assembly.\n\nIt's looking fantastic, and we're really happy with how the ${d.timber} has finished up.\n\nKelly & Kyle`,
    drumcomplete:`Hi ${name},\n\nGreat news — your ${d.timber} ${d.size} drum is complete.\n\nWe'll send through final photos and any remaining details shortly.\n\nThank you again for supporting Nowak Drum Company.\n\nKelly & Kyle`
  };
  return { subject: subjectMap[milestone.key] || "Nowak Drum update", body: bodyMap[milestone.key] || "" };
}

function socialPost(d, milestone, platform="facebook"){
  const common = `${d.timber || "Australian hardwood"} · ${d.size || ""} · ${d.build_type || ""}`;
  const story = d.timber_story ? `\n\n${d.timber_story}` : "";
  const isBrady = d.build_client === "Brady";
  const milestoneText = {
    blank:"Freshly glued and curing. Every drum starts here — timber, pressure, glue, and patience.",
    machined:"Machining complete. The shell is now round, clean and starting to show its voice.",
    snarebed:"Bearing edges and snare beds cut. This is where the shell begins to become an instrument.",
    sealer:"First sealer coat is on. The timber has started to come alive.",
    shellcomplete:"Shell complete and ready for final assembly.",
    drumcomplete:"Completed and ready to play."
  }[milestone.key] || "Workshop update.";

  if(platform==="instagram"){
    return `${milestoneText}\n\n${common}${story}\n${isBrady ? "Built for Brady Drums." : "Handmade by Nowak Drum Company."}\n\n#nowakdrums #customdrums #snaredrum #australianmade #drumbuilding`;
  }

  return `${milestoneText}\n\n${common}${story}\n\n${isBrady ? "Built for Brady Drums." : "Built in Western Australia by Nowak Drum Company."}\n\nBuilt with precision. Played with passion.`;
}

function mailtoLink(d, draft){
  const to = d.customer_email || "";
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
}


function extractNumber(value){
  const match = String(value || "").match(/\d+/g);
  return match ? Number(match.join("")) : 0;
}

function nextProductionNumber(drums=[]){
  return String(Math.max(0,...drums.map(d=>extractNumber(d.serial)))+1);
}

function nextCbNumber(drums=[]){
  return String(Math.max(0,...drums.filter(d=>d.build_client==="Brady").map(d=>extractNumber(d.cb_number)))+1);
}


function defaultBuildSpecification(drumType){
  if(drumType === "Snare") return "Shell thickness: 12 mm";
  if(drumType === "Tom") return "Shell thickness: 8 mm\nRe-ring: 14 x 30 mm";
  if(drumType === "Floor Tom") return "Shell thickness: 8 mm\nRe-ring: 14 x 40 mm";
  if(drumType === "Bass Drum") return "Shell thickness: 10 mm\nRe-ring: 14 x 50 mm";
  return "";
}

function ownershipLabel(d){
  if(d.build_client === "Brady") return "Brady Production";
  if(d.build_client === "Nowak") return "Nowak";
  return "Unallocated";
}


function workshopSpecForDiameter(diameter){
  return diameterSpecs[String(diameter || "").replace(/"/g,"")] || null;
}

function workshopSpecsText({serial,timber,size,buildType,drumType,diameter}){
  const d = workshopSpecForDiameter(diameter);
  const s = staveSpecForDiameter(diameter);
  const lines = [`Production #${serial || ""}`,"",size || "","",`${timber || ""} ${buildType || ""}`,""];
  if(buildType === "Stave"){
    lines.push("ROUGH OD",d?.rough || "","FINISHED OD",d?.finished || "","TRITON",s?.triton || "","STAVE",s?.stave || "","BUILD SPECIFICATION",defaultBuildSpecification(drumType || "Snare"));
  }else{
    lines.push("FINISHED OD",d?.finished || "","BUILD SPECIFICATION",defaultBuildSpecification(drumType || "Snare"));
  }
  return lines.join("\\n");
}

function App(){
  const [view,setView]=useState("dashboard");
  const [drums,setDrums]=useState([]);
  const [hardware,setHardware]=useState([]);
  const [templates,setTemplates]=useState([]);
  const [sales,setSales]=useState([]);
  const [projects,setProjects]=useState([]);
  const [jobCard,setJobCard]=useState(null);
  const [showAddWizard,setShowAddWizard]=useState(false);
  const [addWizardPreset,setAddWizardPreset]=useState({});
  const [loading,setLoading]=useState(false);
  const [message,setMessage]=useState("");
  const [labourRate,setLabourRate]=useState(50);
  const [search,setSearch]=useState("");
  const [productionFilter,setProductionFilter]=useState("All");
  const [constructionFilter,setConstructionFilter]=useState("All");
  const [globalPhotoPrompt,setGlobalPhotoPrompt]=useState(null);
  const [progressingDrumId,setProgressingDrumId]=useState(null);

  async function loadAll(){
    if(!isConfigured){ setMessage("Supabase is not configured yet."); return; }
    setLoading(true); setMessage("");
    const [d,h,t,s,p]=await Promise.all([
      supabase.from("drums").select("*").order("created_at",{ascending:false}),
      supabase.from("hardware_parts").select("*").order("category",{ascending:true}),
      supabase.from("cost_templates").select("*").order("name",{ascending:true}),
      supabase.from("sales").select("*").order("sold_at",{ascending:false}),
      supabase.from("projects").select("*").order("created_at",{ascending:false})
    ]);
    const loadedDrums=(d.data||[]).map(item=>{
      if(item.lifecycle_status) return item;
      if(item.sales_status==="Shipped") return {...item,lifecycle_status:"Shipped"};
      if(item.sales_status==="Sold") return {...item,lifecycle_status:"Sold"};
      if(item.sales_status==="Sold/Shipped") return {...item,lifecycle_status:"Shipped"};
      if(item.production_status==="Manufacturing Complete") return {...item,lifecycle_status:"Completed"};
      return item;
    });

    setDrums(loadedDrums);
    setHardware(h.data||[]);
    setTemplates(t.data||[]);
    setSales(s.data||[]);
    setProjects(p.data||[]);

    const coreErrors=[d.error,h.error,t.error,s.error].filter(Boolean);
    if(coreErrors.length){
      setMessage(coreErrors.map(e=>e.message).join(" | "));
    }else if(p.error){
      setMessage("Kits / Projects needs the v5.0 Supabase setup: " + p.error.message);
    }else{
      setMessage("");
    }
    setLoading(false);
  }

  useEffect(()=>{ loadAll(); },[]);

  const operationalDrums=drums.filter(d=>!isSoldStatus(d) && !isShippedStatus(d));
  const filtered=drums.filter(d=>JSON.stringify(d).toLowerCase().includes(search.toLowerCase()));
  const active=operationalDrums;
  const templateMap=useMemo(()=>Object.fromEntries(templates.map(t=>[t.name,t])),[templates]);
  const batches=useMemo(()=>{ const g={}; filtered.forEach(d=>{const b=batchType(d); if(b){g[b]??=[]; g[b].push(d)}}); return g; },[filtered]);
  const inventoryValue=hardware.reduce((s,p)=>s+Number(p.qty_on_hand||0)*Number(p.landed_cost_aud||0),0);
  const lowStock=hardware.filter(p=>Number(p.qty_on_hand||0)<=Number(p.reorder_level||0)).length;
  const retail=active.reduce((s,d)=>s+Number(d.total_price||d.retail_price||0),0);
  const cost=active.reduce((s,d)=>s+templateCost(templateMap[d.template_name],labourRate),0);
  const brady=active.filter(d=>d.build_client==="Brady").length;
  const overdue=active.filter(d=>d.due_date && new Date(d.due_date) < new Date()).length;
  const cureQueue=active.filter(d=>["Polyurethane Coat 4","Finished Spraying / Curing"].includes(d.production_status)).length;
  const photoQueue=active.filter(d=>d.production_status==="Finished / Ready to Sell").length;
  const outstandingFinalWork=filtered.filter(d=>outstandingWorkFromNotes(d.notes));
  const staveInProduction=drums.filter(d=>
    d.build_type==="Stave" &&
    !isManufacturingComplete(d) &&
    !isSoldStatus(d) &&
    !isShippedStatus(d)
  ).length;
  const plyInProduction=drums.filter(d=>
    d.build_type==="Ply" &&
    !isManufacturingComplete(d) &&
    !isSoldStatus(d) &&
    !isShippedStatus(d)
  ).length;
  const completedDrums=drums.filter(d=>
    drumLifecycleStatus(d)==="Completed" &&
    !isSoldStatus(d) &&
    !isShippedStatus(d)
  ).length;

  function dueWithinDays(d,days){
    if(!d.due_date) return false;
    const due=new Date(`${d.due_date}T23:59:59`);
    const now=new Date();
    const limit=new Date();
    limit.setDate(limit.getDate()+days);
    return due>=now && due<=limit;
  }

  function attentionReasons(d){
    const reasons=[];
    const due=d.due_date ? new Date(`${d.due_date}T23:59:59`) : null;
    if(due && due<new Date() && !isShippedStatus(d)) reasons.push("Overdue");
    else if(dueWithinDays(d,7) && !isShippedStatus(d)) reasons.push("Due within 7 days");

    if(outstandingWorkFromNotes(d.notes)) reasons.push(outstandingWorkFromNotes(d.notes));
    if(isSoldStatus(d) && !isShippedStatus(d)) reasons.push("Sold — awaiting shipment");

    const isNowakCustom=d.build_client==="Nowak" && d.sales_status==="Custom Order";
    if(isNowakCustom && !String(d.customer || "").trim()) reasons.push("Customer name missing");
    if(isNowakCustom && !String(d.customer_email || "").trim()) reasons.push("Customer email missing");

    return reasons;
  }

  const needsAttention=drums
    .map(d=>({drum:d,reasons:attentionReasons(d)}))
    .filter(item=>item.reasons.length>0)
    .sort((a,b)=>{
      const aOverdue=a.reasons.includes("Overdue");
      const bOverdue=b.reasons.includes("Overdue");
      if(aOverdue!==bOverdue) return aOverdue ? -1 : 1;
      return productionPriorityCompare(a.drum,b.drum);
    });


  async function createProject(nameOverride=""){
    const name=(nameOverride || window.prompt("Kit / project name") || "").trim();
    if(!name) return null;
    const {data,error}=await supabase.from("projects").insert({name}).select().single();
    if(error){
      setMessage("Could not create kit/project: " + error.message);
      return null;
    }
    setProjects(current=>[data,...current.filter(p=>p.id!==data.id)]);
    setMessage("");
    return data;
  }

  async function linkDrumsToProject(drumIds,projectId){
    if(!projectId || !drumIds.length) return false;
    const {error}=await supabase.from("drums").update({project_id:projectId}).in("id",drumIds);
    if(error){
      setMessage("Could not link drums: " + error.message);
      return false;
    }
    await loadAll();
    return true;
  }

  async function unlinkDrumFromProject(drumId){
    const {error}=await supabase.from("drums").update({project_id:null}).eq("id",drumId);
    if(error){
      setMessage("Could not unlink drum: " + error.message);
      return false;
    }
    await loadAll();
    return true;
  }

  async function updateProject(id,patch){
    const cleanPatch={...patch};
    if("due_date" in cleanPatch) cleanPatch.due_date=cleanPatch.due_date || null;
    const {error}=await supabase.from("projects").update(cleanPatch).eq("id",id);
    if(error) setMessage("Could not save project: " + error.message); else await loadAll();
  }

  async function updateDrum(id,patch){
    const nextPatch={...patch};

    if("custom_price" in nextPatch || "shipping_cost" in nextPatch){
      const existing = drums.find(d=>d.id===id) || {};
      const customPrice = "custom_price" in nextPatch ? Number(nextPatch.custom_price||0) : Number(existing.custom_price||0);
      const shipping = "shipping_cost" in nextPatch ? Number(nextPatch.shipping_cost||0) : Number(existing.shipping_cost||0);
      nextPatch.total_price = customPrice + shipping;
    }

    const {data,error}=await supabase
      .from("drums")
      .update(nextPatch)
      .eq("id",id)
      .select("*")
      .single();

    if(error){
      setMessage("Drum update failed: "+error.message);
      return false;
    }

    setDrums(current=>current.map(item=>item.id===id ? {...item,...data} : item));
    setJobCard(current=>current?.id===id ? {...current,...data} : current);
    setMessage("");
    return true;
  }

  async function deleteDrum(id){
    const ok = window.confirm("Are you absolutely sure you want to delete this drum/job card? This cannot be undone.");
    if(!ok) return;
    const {error}=await supabase.from("drums").delete().eq("id",id);
    if(error) setMessage(error.message); else { setJobCard(null); await loadAll(); }
  }

  async function updateHardware(id,patch){
    const {error}=await supabase.from("hardware_parts").update(patch).eq("id",id);
    if(error) setMessage(error.message); else await loadAll();
  }

  async function progressDrumFromCard(d){
    if(!d?.id || progressingDrumId===d.id) return false;
    setProgressingDrumId(d.id);
    setMessage("");

    try{
      const checked=parseChecked(d.notes);
      const flow=workflowState(d.build_type || "Stave",checked,d.finish);
      const nextItem=flow.steps[flow.completedCount];
      if(!nextItem) return false;

      const next=new Set(checked);
      next.add(nextItem);
      const nextFlow=workflowState(d.build_type || "Stave",next,d.finish);
      let history=Array.isArray(d.stage_history) ? [...d.stage_history] : [];
      history=history.filter(entry=>entry.item!==nextItem);
      history.push({item:nextItem,completed:true,completed_at:new Date().toISOString()});

      const baseNotes=nextItem==="Assembled"
        ? setOutstandingWorkInNotes(d.notes,"No outstanding work")
        : d.notes;
      const updatedNotes=setChecklistInNotes(baseNotes,next);
      const {error}=await supabase.from("drums").update({
        notes:updatedNotes,
        production_status:nextFlow.status,
        next_step:nextFlow.nextStep,
        stage_history:history
      }).eq("id",d.id);

      if(error){
        setMessage("Could not progress drum: " + error.message);
        return false;
      }

      const updatedDrum={...d,notes:updatedNotes,production_status:nextFlow.status,next_step:nextFlow.nextStep,stage_history:history};
      setDrums(current=>current.map(item=>item.id===d.id ? updatedDrum : item));

      const milestoneKey=photoMilestoneForCompletion(updatedDrum,nextItem);
      if(milestoneKey){
        setGlobalPhotoPrompt({drum:updatedDrum,milestoneKey});
      }
      return true;
    }catch(error){
      setMessage("Could not progress drum: " + (error?.message || String(error)));
      return false;
    }finally{
      setProgressingDrumId(null);
    }
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

  async function addDrumFromWizard(form){
    const isPly = form.build_type === "Ply";
    const spec = staveSpecForDiameter(form.diameter);
    const construction = !isPly ? drumTypeComment(form.drum_type, form.diameter) : null;

    const insertData = {
      serial:form.serial || suggestedProductionNumber,
      timber:form.timber || "",
      build_type:form.build_type,
      drum_type:form.drum_type || "Snare",
      size:form.size,
      finish:form.finish || "TBD",
      customer:form.order_type === "Stock" ? "Stock" : "",
      production_status:"Not Started",
      sales_status:salesStatusForNewDrum(form),
      next_step:isPly ? "Prepare veneer and confirm cut lengths" : "Prepare timber / staves",
      retail_price:Number(form.custom_price || 0),
      custom_price:Number(form.custom_price || 0),
      wholesale_price:form.build_client==="Brady" ? Number(form.custom_price || 0) : 0,
      shipping_cost:Number(form.shipping_cost || 0),
      total_price:Number(form.total_price || form.custom_price || 0),
      hours_logged:0,
      build_client:form.build_client || "Nowak",
      price_rule:form.price_rule || "",
      cb_number:form.cb_number || "",
      stave_triton_setting:!isPly && spec ? spec.triton : null,
      stave_width:!isPly && spec ? spec.stave : null,
      construction_note:form.construction_note || construction || defaultBuildSpecification(form.drum_type),
      shell_thickness:construction?.match(/(8mm|9mm|10mm)/)?.[1] || "",
      rering_size:construction?.match(/14mm x (30mm|40mm|50mm)/)?.[0] || "",
      timber_story:form.timber_story || "",
      project_id:form.project_id || null,
      veneer_1_thickness:isPly ? Number(form.veneer[0] || 1.2) : null,
      veneer_2_thickness:isPly ? Number(form.veneer[1] || 1.2) : null,
      veneer_3_thickness:isPly ? Number(form.veneer[2] || 1.2) : null,
      veneer_4_thickness:isPly ? Number(form.veneer[3] || 1.2) : null,
      veneer_5_thickness:isPly ? Number(form.veneer[4] || 1.2) : null,
    };

    const {data,error}=await supabase.from("drums").insert(insertData).select().single();
    if(error) setMessage(error.message);
    else {
      await loadAll();
      setShowAddWizard(false);
      setView(isPly ? "veneer" : "today");
      setJobCard(data);
    }
  }

  async function setDrumLifecycle(d,status,extraPatch={}){
    const allowed=["Completed","Sold","Shipped"];
    if(!allowed.includes(status)){
      setMessage("Invalid drum lifecycle status.");
      return false;
    }

    const patch={
      lifecycle_status:status,
      production_status:"Manufacturing Complete",
      next_step:status==="Completed"
        ? "Marketing / launch optional"
        : status==="Sold"
          ? "Prepare for shipping"
          : "Complete",
      ...extraPatch,
    };

    // Preserve compatibility with previous releases.
    if(status==="Sold" || status==="Shipped"){
      patch.sales_status="Sold/Shipped";
    }

    const {data,error}=await supabase
      .from("drums")
      .update(patch)
      .eq("id",d.id)
      .select("*")
      .single();

    if(error){
      setMessage(`Could not mark drum ${status.toLowerCase()}: ${error.message}`);
      return false;
    }

    if(!data || drumLifecycleStatus(data)!==status){
      setMessage(`The database did not confirm the ${status} status. Please run the v6 Supabase migration.`);
      return false;
    }

    setDrums(current=>current.map(item=>item.id===d.id ? {...item,...data} : item));
    setJobCard(current=>current?.id===d.id ? {...current,...data} : current);
    setMessage(
      status==="Completed"
        ? "Saved — drum marked Complete."
        : status==="Sold"
          ? "Saved — drum marked Sold."
          : "Saved — drum marked Shipped."
    );
    return true;
  }

  async function markSold(d){
    const defaultSalePrice=Number(d.custom_price || d.retail_price || 0);
    const saleEntry=prompt("Drum selling price (excluding shipping)?", defaultSalePrice);
    if(saleEntry===null) return false;

    const salePrice=Number(saleEntry);
    if(Number.isNaN(salePrice) || salePrice<0){
      setMessage("Please enter a valid selling price.");
      return false;
    }

    const defaultShippingCharged=Number(d.shipping_cost || 0);
    const shippingChargedEntry=prompt(
      "Shipping charged to customer? Enter 0 for free shipping or local pickup.",
      defaultShippingCharged
    );
    if(shippingChargedEntry===null) return false;

    const shippingCharged=Number(shippingChargedEntry);
    if(Number.isNaN(shippingCharged) || shippingCharged<0){
      setMessage("Please enter a valid shipping amount charged to the customer.");
      return false;
    }

    const actualShippingEntry=prompt(
      "Actual shipping cost to Nowak? Enter 0 for local pickup or if not known yet.",
      0
    );
    if(actualShippingEntry===null) return false;

    const actualShippingCost=Number(actualShippingEntry);
    if(Number.isNaN(actualShippingCost) || actualShippingCost<0){
      setMessage("Please enter a valid actual shipping cost.");
      return false;
    }

    const paymentEntry=prompt(
      "Payment status?\n\nEnter: Paid in Full, Deposit Paid, Invoice Sent, or Awaiting Payment",
      "Paid in Full"
    );
    if(paymentEntry===null) return false;

    const paymentStatus=String(paymentEntry || "Awaiting Payment").trim();
    const costBasis=templateCost(templateMap[d.template_name],labourRate);
    const revenue=salePrice+shippingCharged;
    const shippingProfit=shippingCharged-actualShippingCost;
    const profit=revenue-costBasis-actualShippingCost;

    // IMPORTANT: save the lifecycle first. A sales-table issue must never stop
    // the drum moving into the Sold tab.
    const soldSaved=await setDrumLifecycle(d,"Sold",{
      custom_price:salePrice,
      shipping_cost:shippingCharged,
      total_price:revenue
    });

    if(!soldSaved) return false;

    const fullSaleRecord={
      serial:d.serial,
      timber:d.timber,
      customer:d.customer,
      sale_price:salePrice,
      shipping_charged:shippingCharged,
      actual_shipping_cost:actualShippingCost,
      shipping_profit:shippingProfit,
      payment_status:paymentStatus,
      total_revenue:revenue,
      cost_basis:costBasis,
      profit,
      notes:"Marked sold from Workshop OS v6"
    };

    const basicSaleRecord={
      serial:d.serial,
      timber:d.timber,
      customer:d.customer,
      sale_price:salePrice,
      cost_basis:costBasis,
      profit,
      notes:`Marked sold from Workshop OS v6. Shipping charged: ${shippingCharged}. Actual shipping cost: ${actualShippingCost}. Payment: ${paymentStatus}.`
    };

    let financialWarning="";

    try{
      const {data:existingSale,error:lookupError}=await supabase
        .from("sales")
        .select("id")
        .eq("drum_id",d.id)
        .limit(1);

      if(lookupError) throw lookupError;

      const saveFull=async()=>{
        if(existingSale?.length){
          return await supabase.from("sales").update(fullSaleRecord).eq("drum_id",d.id);
        }
        return await supabase.from("sales").insert({drum_id:d.id,...fullSaleRecord});
      };

      let {error:saleError}=await saveFull();

      // Backwards-compatible fallback for databases that have not yet added
      // the extended shipping/payment columns.
      if(saleError){
        const fallback=existingSale?.length
          ? await supabase.from("sales").update(basicSaleRecord).eq("drum_id",d.id)
          : await supabase.from("sales").insert({drum_id:d.id,...basicSaleRecord});

        if(fallback.error){
          financialWarning=` Sale status was saved, but the financial record could not be saved: ${fallback.error.message}`;
        }else{
          financialWarning=" Sale status was saved. Shipping and payment details were stored in the sales notes; run the v6 migration to enable dedicated fields.";
        }
      }
    }catch(error){
      financialWarning=` Sale status was saved, but the financial record could not be saved: ${error?.message || String(error)}`;
    }

    setMessage(
      `Marked sold. Revenue ${money(revenue)} · Shipping ${money(shippingCharged)} charged / ${money(actualShippingCost)} cost · Estimated profit ${money(profit)} · ${paymentStatus}.${financialWarning}`
    );

    return true;
  }

  async function markShipped(d){
    const existingTracking=trackingNumberFromNotes(d.notes);
    const tracking=window.prompt(
      "Enter the tracking number for this drum.\n\nLeave blank only if the shipment does not have tracking.",
      existingTracking
    );

    if(tracking===null) return false;

    const cleanTracking=String(tracking || "").trim();
    if(!cleanTracking){
      const continueWithout=window.confirm("No tracking number was entered. Mark this drum as shipped anyway?");
      if(!continueWithout) return false;
    }

    const notes=setTrackingNumberInNotes(d.notes,cleanTracking);
    const saved=await setDrumLifecycle(d,"Shipped",{notes});
    if(saved){
      setMessage(cleanTracking
        ? `Marked shipped. Tracking number: ${cleanTracking}`
        : "Marked shipped without a tracking number."
      );
    }
    return Boolean(saved);
  }

  function copyText(text,label){ navigator.clipboard?.writeText(text); alert(label + " copied"); }

  function openProductionView({status="All",construction="All",searchValue=""}={}){
    setProductionFilter(status);
    setConstructionFilter(construction);
    setSearch(searchValue);
    setView("production");
  }

  return <main>
    <header className="hero">
      <div className="heroBrand">
        <img src={nowakLogo} alt="Nowak Drum Company Australia" className="nowakHeaderLogo"/>
        <div><h1>Nowak Workshop OS</h1><p>v6.3.1 — refined transparent Nowak logo and tracking-number prompt.</p></div>
      </div>
      <button onClick={loadAll}><RefreshCw size={16}/> Refresh</button>
    </header>

    {message && <section className="panel warning">{message}</section>}

    <nav>
      <button className={view==="dashboard"?"active":""} onClick={()=>setView("dashboard")}><LayoutDashboard size={16}/> Dashboard</button>
      <button className={view==="today"?"active":""} onClick={()=>setView("today")}><Hammer size={16}/> Workshop Today</button>
      <button className={view==="production"?"active":""} onClick={()=>setView("production")}><ListChecks size={16}/> Production</button>
      <button className={view==="projects"?"active":""} onClick={()=>setView("projects")}><Layers3 size={16}/> Kits / Projects</button>
      <button className={view==="orders"?"active":""} onClick={()=>setView("orders")}><Users size={16}/> Customers & Orders</button>
      <button className={view==="veneer"?"active":""} onClick={()=>setView("veneer")}><Ruler size={16}/> Veneer Calc</button>
      <button className={view==="inventory"?"active":""} onClick={()=>setView("inventory")}><Package size={16}/> Inventory</button>
      <button className={view==="costing"?"active":""} onClick={()=>setView("costing")}><DollarSign size={16}/> Costing</button>
      <button className={view==="summary"?"active":""} onClick={()=>setView("summary")}><BarChart3 size={16}/> Workshop Summary</button>
      <button className={view==="comms"?"active":""} onClick={()=>setView("comms")}><Mail size={16}/> Comms & Marketing</button>
      <button className={view==="settings"?"active":""} onClick={()=>setView("settings")}><Settings size={16}/> Settings</button>
      <button onClick={()=>{setAddWizardPreset({});setShowAddWizard(true);}}><Plus size={16}/> Add Drum</button>
    </nav>

    <div className="searchBar"><Search size={16}/><input placeholder="Search drums, timber, customer, CB number, email, status..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
    {loading && <section className="panel">Loading...</section>}

    {view==="dashboard" && <>
      <section className="panel dashboardIntro">
        <div>
          <span className="launchPackEyebrow">CURRENT WORKSHOP SNAPSHOT</span>
          <h2>Dashboard</h2>
          <p>Live operational figures. Use Workshop Summary for daily, weekly and monthly performance.</p>
        </div>
        <button onClick={()=>setView("summary")}><BarChart3 size={16}/> Open Workshop Summary</button>
      </section>

      <section className="stats dashboardStats">
        <button className="dashboardStatCard" onClick={()=>openProductionView()}>
          <b>{active.length}</b><span>Active drums</span>
        </button>
        <button className="dashboardStatCard" onClick={()=>{setSearch("");setView("orders");}}>
          <b>{active.filter(d=>d.sales_status==="Custom Order").length}</b><span>Custom orders</span>
        </button>
        <button className="dashboardStatCard" onClick={()=>openProductionView({searchValue:"Brady"})}>
          <b>{brady}</b><span>Brady / CB drums</span>
        </button>
        <button className="dashboardStatCard attentionStatCard" onClick={()=>{setSearch("");setView("orders");}}>
          <b>{overdue}</b><span>Overdue jobs</span>
        </button>
        <button className="dashboardStatCard" onClick={()=>openProductionView()}>
          <b>{money(retail)}</b><span>Potential retail</span>
        </button>
        <button className="dashboardStatCard" onClick={()=>setView("inventory")}>
          <b>{money(inventoryValue)}</b><span>Hardware stock value</span>
        </button>
        <button className="dashboardStatCard" onClick={()=>setView("summary")}>
          <b>{money(retail-cost)}</b><span>Estimated gross profit</span>
        </button>
        <button className="dashboardStatCard" onClick={()=>openProductionView({status:"Active",construction:"Stave"})}>
          <b>{staveInProduction}</b><span>Stave drums in production</span>
        </button>
        <button className="dashboardStatCard" onClick={()=>openProductionView({status:"Active",construction:"Ply"})}>
          <b>{plyInProduction}</b><span>Ply drums in production</span>
        </button>
        <button className="dashboardStatCard" onClick={()=>openProductionView({status:"Completed",construction:"All"})}>
          <b>{completedDrums}</b><span>Completed drums</span>
        </button>
      </section>

      <section className="quickGrid dashboardQuickGrid">
        <article className="panel"><h2>Photo / Marketing Queue</h2><b className="bigNumber">{photoQueue}</b><p>Finished drums needing photos, website, social or YouTube.</p></article>
        <article className="panel bradyPanel"><h2>Suggested Work Batches</h2><b className="bigNumber">{Object.keys(batches).length}</b><p>Current Workshop Today task groups.</p></article>
      </section>

      <section className="panel needsAttentionPanel">
        <div className="needsAttentionHeader">
          <div>
            <span className="launchPackEyebrow">ACTION REQUIRED</span>
            <h2>Needs Attention</h2>
            <p>Only drums with a clear operational issue appear here.</p>
          </div>
          <b>{needsAttention.length}</b>
        </div>

        {needsAttention.length===0
          ? <p className="okText">Nothing currently needs attention.</p>
          : <div className="needsAttentionList">
              {needsAttention.map(({drum,reasons})=><article className="attentionJobCard" key={drum.id}>
                <div className="attentionJobHeader">
                  <div>
                    <b>#{drum.serial} {drum.timber}</b>
                    <span>{drum.size} · {drum.build_type} · {allocatedCustomerName(drum) || displaySalesBadge(drum)}</span>
                  </div>
                  <button onClick={()=>setJobCard(drum)}>Open Job Card</button>
                </div>
                <div className="attentionReasonRow">
                  {reasons.map(reason=><span className={"attentionReason "+(reason==="Overdue"?"urgentAttention":"")} key={reason}>{reason}</span>)}
                </div>
              </article>)}
            </div>}
      </section>
    </>}

    {view==="today" && <section className="batchGrid">
      {outstandingFinalWork.length>0 && <section className="panel todayTaskPanel outstandingTodayPanel">
        <h2>Outstanding Final Work <span className="taskCount">({outstandingFinalWork.length})</span></h2>
        <p>These drums can remain Complete while the final practical task stays visible.</p>
        <div className="todayDrumGrid">
          {outstandingFinalWork
            .sort(productionPriorityCompare)
            .map(d=><DrumCard
              key={d.id}
              drum={d}
              openJobCard={setJobCard}
              progressDrum={progressDrumFromCard}
              progressing={progressingDrumId===d.id}
              onAddPhoto={drum=>setGlobalPhotoPrompt({drum,milestoneKey:"general"})}
            />)}
        </div>
      </section>}

      {Object.entries(batches).map(([name,items])=>{
        const projectMap=Object.fromEntries(projects.map(p=>[p.id,p.name]));
        const grouped={};

        items
          .sort((a,b)=>extractNumber(a.serial)-extractNumber(b.serial))
          .forEach(d=>{
            const groupName=d.project_id ? (projectMap[d.project_id] || "Kit / Project") : "Individual Drums";
            grouped[groupName] ??=[];
            grouped[groupName].push(d);
          });

        return <section className="panel todayTaskPanel" key={name}>
          <h2>{name} <span className="taskCount">({items.length})</span></h2>

          {Object.entries(grouped).map(([groupName,groupItems])=>
            <section className={"todayProjectGroup "+(groupName==="Individual Drums"?"individualTodayGroup":"")} key={groupName}>
              <h3>{groupName}</h3>
              <div className="todayDrumGrid">
                {groupItems.map(d=>{
                  const flow=workflowState(d.build_type||"Stave",parseChecked(d.notes),d.finish);
                  return <article className={"card " + (d.build_client==="Brady"?"bradyCard":d.build_client==="Nowak"?"nowakCard":"unallocatedCard")} key={d.id}>
                    <div className="cardHeading">
                      <b>#{d.serial} {d.timber}</b>
                      {allocatedCustomerName(d) && <span className="customerNameBadge">{allocatedCustomerName(d)}</span>}
                    </div>
                    {d.build_client==="Brady" && <span className="cbBadge">CB {d.cb_number || "No CB #"}</span>}
                    <span>{d.size} · {d.drum_type || "Snare"} · {d.build_type}</span>
                    <span className="badge">{displaySalesBadge(d)}</span>
                    <div className="progress"><i style={{width:flow.percent+"%"}}></i></div>
                    <p><b>Status:</b> {flow.status}</p>
                    <p><b>Next:</b> {flow.nextStep}</p>
                    {flow.nextStep!=="Complete" && <button type="button" className="primary" disabled={progressingDrumId===d.id} onClick={()=>progressDrumFromCard(d)}><CheckCircle2 size={15}/> {progressingDrumId===d.id ? "Progressing..." : `Progress: ${flow.nextStep}`}</button>}
                    <button type="button" onClick={()=>setGlobalPhotoPrompt({drum:d,milestoneKey:"general"})}><Camera size={15}/> Add Photo</button>
                    <button type="button" onClick={()=>setJobCard(d)}>Open job card</button>
                  </article>
                })}
              </div>
            </section>
          )}
        </section>
      })}
    </section>}

    {view==="production" && <section>
      <section className="panel productionToolbar">
        <h2>Production</h2>

        <div className="productionFilterGroup">
          <span className="filterLabel">Construction</span>
          <div className="filterRow">
            {["All","Stave","Ply"].map(f=>
              <button key={f} className={constructionFilter===f?"primary":""} onClick={()=>setConstructionFilter(f)}>{f}</button>
            )}
          </div>
        </div>

        <div className="productionFilterGroup">
          <span className="filterLabel">Status</span>
          <div className="filterRow">
            {["All","Pending","Active","Completed","Sold","Shipped"].map(f=>
              <button key={f} className={productionFilter===f?"primary":""} onClick={()=>setProductionFilter(f)}>{f}</button>
            )}
          </div>
        </div>
      </section>

      <ProductionGroups
        drums={[...filtered]
          .sort(productionPriorityCompare)
          .filter(d=>{
            if(constructionFilter!=="All" && d.build_type!==constructionFilter) return false;

            const flow=workflowState(d.build_type||"Stave",parseChecked(d.notes),d.finish);
            const lifecycle=drumLifecycleStatus(d);
            if(productionFilter==="Pending") return !hasWorkflowStarted(d) && !["Completed","Sold","Shipped"].includes(lifecycle);
            if(productionFilter==="Active") return hasWorkflowStarted(d) && !["Completed","Sold","Shipped"].includes(lifecycle);
            if(productionFilter==="Completed") return lifecycle==="Completed" || (isManufacturingComplete(d) && !["Sold","Shipped"].includes(lifecycle));
            if(productionFilter==="Sold") return lifecycle==="Sold";
            if(productionFilter==="Shipped") return lifecycle==="Shipped";
            return true;
          })}
        projects={projects}
        openJobCard={setJobCard}
        updateDrum={updateDrum}
        progressDrum={progressDrumFromCard}
        progressingDrumId={progressingDrumId}
        onAddPhoto={drum=>setGlobalPhotoPrompt({drum,milestoneKey:"general"})}
      />
    </section>}

    {view==="projects" && <ProjectsPage projects={projects} drums={drums} openJobCard={setJobCard} createProject={createProject} updateProject={updateProject} linkDrumsToProject={linkDrumsToProject} unlinkDrumFromProject={unlinkDrumFromProject}/>}

    {view==="orders" && <Orders drums={filtered} openJobCard={setJobCard}/>}
    {view==="veneer" && <VeneerCalculator drums={filtered.filter(d=>d.build_type==="Ply")} updateDrum={updateDrum} openJobCard={setJobCard}/>}
    {view==="inventory" && <Inventory hardware={hardware} updateHardware={updateHardware} lowStock={lowStock} inventoryValue={inventoryValue}/>}
    {view==="costing" && <Costing templates={templates} labourRate={labourRate} setLabourRate={setLabourRate}/>}
    {view==="summary" && <WorkshopSummary drums={drums} sales={sales} labourRate={labourRate}/>}
    {view==="comms" && <CommsMarketingCentre
      filteredDrums={filtered}
      allDrums={drums}
      openJobCard={setJobCard}
      setMessage={setMessage}
      onAddPhoto={(drum,milestoneKey="general")=>setGlobalPhotoPrompt({drum,milestoneKey})}
    />} 
    {view==="settings" && <SettingsPage/>}

    {globalPhotoPrompt && <MilestonePhotoModal
      drum={globalPhotoPrompt.drum}
      milestoneKey={globalPhotoPrompt.milestoneKey}
      onClose={()=>setGlobalPhotoPrompt(null)}
      setMessage={setMessage}
    />}

    {showAddWizard && <AddDrumWizard onClose={()=>{setShowAddWizard(false);setAddWizardPreset({});}} onCreate={addDrumFromWizard} drums={drums} projects={projects} createProject={createProject} preset={addWizardPreset}/>}
    {jobCard && <JobCard drum={jobCard} template={templateMap[jobCard.template_name]} labourRate={labourRate} onClose={()=>setJobCard(null)} updateDrum={updateDrum} completeDrum={completeDrum} addTime={addTime} markSold={markSold} markShipped={markShipped} setDrumLifecycle={setDrumLifecycle} copyText={copyText} deleteDrum={deleteDrum} drums={drums} projects={projects} createProject={createProject} setMessage={setMessage} onAddDrumToProject={(projectId,sourceDrum)=>{setAddWizardPreset({project_id:projectId,build_client:sourceDrum.build_client||"Unallocated",customer:sourceDrum.customer||"",customer_email:sourceDrum.customer_email||"",shipping_address:sourceDrum.shipping_address||"",due_date:sourceDrum.due_date||"",finish:sourceDrum.finish||"To Be Decided"});setJobCard(null);setShowAddWizard(true);}}/>}
  </main>
}


function ProductionGroups({drums,projects,openJobCard,updateDrum,progressDrum,progressingDrumId,onAddPhoto}){
  const projectMap=Object.fromEntries(projects.map(p=>[p.id,p]));
  const linkedGroups={};
  const unlinked=[];

  drums.forEach(d=>{
    if(d.project_id){
      linkedGroups[d.project_id] ??=[];
      linkedGroups[d.project_id].push(d);
    }else{
      unlinked.push(d);
    }
  });

  const groups=Object.entries(linkedGroups)
    .map(([projectId,items])=>({
      project:projectMap[projectId] || {id:projectId,name:"Unnamed Kit / Project"},
      items:[...items].sort(productionPriorityCompare)
    }))
    .sort((a,b)=>{
      const aFirst=a.items[0] || {};
      const bFirst=b.items[0] || {};
      return productionPriorityCompare(aFirst,bFirst);
    });

  return <section className="productionGroups">
    {groups.map(({project,items})=>{
      const overall=items.length
        ? Math.round(items.reduce((sum,d)=>sum+workflowState(d.build_type||"Stave",parseChecked(d.notes),d.finish).percent,0)/items.length)
        : 0;
      const complete=items.filter(d=>workflowState(d.build_type||"Stave",parseChecked(d.notes),d.finish).percent===100).length;

      return <section className="kitProductionGroup" key={project.id}>
        <header className="kitGroupHeader">
          <div>
            <span className="kitEyebrow">KIT / PROJECT</span>
            <h2>{project.name}</h2>
            <p>{items.length} drums · {complete} completed · {overall}% overall</p>
          </div>
          <div className="kitGroupProgress">
            <div className="progress"><i style={{width:overall+"%"}}></i></div>
          </div>
        </header>
        <div className="productionList kitDrumGrid">
          {items.map(d=><DrumCard key={d.id} drum={d} openJobCard={openJobCard} updateDrum={updateDrum} progressDrum={progressDrum} progressing={progressingDrumId===d.id} onAddPhoto={onAddPhoto}/>)}
        </div>
      </section>
    })}

    {unlinked.length>0 && <section className="individualProductionGroup">
      <header className="kitGroupHeader individualHeader">
        <div>
          <span className="kitEyebrow">INDIVIDUAL DRUMS</span>
          <h2>Not Linked to a Kit / Project</h2>
          <p>{unlinked.length} drums</p>
        </div>
      </header>
      <div className="productionList">
        {[...unlinked]
          .sort(productionPriorityCompare)
          .map(d=><DrumCard key={d.id} drum={d} openJobCard={openJobCard} updateDrum={updateDrum} progressDrum={progressDrum} progressing={progressingDrumId===d.id} onAddPhoto={onAddPhoto}/>)}
      </div>
    </section>}
  </section>
}


function DrumCard({drum, openJobCard, updateDrum, progressDrum, progressing=false, onAddPhoto}){
  const checked=parseChecked(drum.notes);
  const flow=workflowState(drum.build_type || "Stave",checked,drum.finish);

  return <article className={"card " + (drum.build_client==="Brady"?"bradyCard":drum.build_client==="Nowak"?"nowakCard":"unallocatedCard")}>
    <div className="cardHeading">
      <b>#{drum.serial} {drum.timber}</b>
      {allocatedCustomerName(drum) && <span className="customerNameBadge">{allocatedCustomerName(drum)}</span>}
    </div>
    {drum.build_client==="Brady" && <span className="cbBadge">CB {drum.cb_number || "No CB #"}</span>}
    <span>{drum.size} · {drum.drum_type || "Snare"} · {drum.build_type}</span>
    <span className="badge">{displaySalesBadge(drum)}</span>
    {drumLifecycleStatus(drum) && <span className={"lifecycleBadge lifecycle"+drumLifecycleStatus(drum)}>{drumLifecycleStatus(drum)}</span>}
    {drum.build_client==="Nowak" && drum.nowak_serial && <span className="nowakSerialBadge">Serial {drum.nowak_serial}</span>}
    {outstandingWorkFromNotes(drum.notes) && <div className="outstandingWorkAlert">
      <b>Outstanding work</b>
      <span>{outstandingWorkFromNotes(drum.notes)}</span>
    </div>}
    <div className="progress"><i style={{width:(isManufacturingComplete(drum)?100:flow.percent)+"%"}}></i></div>
    <p><b>Status:</b> {isShippedStatus(drum) ? "Shipped" : isSoldStatus(drum) ? "Sold" : isManufacturingComplete(drum) ? "Manufacturing Complete" : flow.status}</p>
    <p><b>Next:</b> {isShippedStatus(drum) ? "Complete" : isSoldStatus(drum) ? "Ship the drum" : isManufacturingComplete(drum) ? "Marketing / launch optional" : flow.nextStep}</p>
    <p><b>Estimated:</b> {flow.estimatedTotal.toFixed(2)} hr production · {flow.estimatedRemaining.toFixed(2)} hr remaining</p>
    <p><b>Actual:</b> {Number(drum.hours_logged||0).toFixed(2)} hr</p>
    {trackingNumberFromNotes(drum.notes) && <p className="trackingNumberLine"><b>Tracking:</b> {trackingNumberFromNotes(drum.notes)}</p>}
    <section className="cardActionRow">
      {flow.nextStep!=="Complete" && !isManufacturingComplete(drum) && <button type="button" className="primary" disabled={progressing || !progressDrum} onClick={()=>progressDrum?.(drum)}><CheckCircle2 size={15}/> {progressing ? "Progressing..." : `Progress: ${flow.nextStep}`}</button>}
      {onAddPhoto && <button type="button" onClick={()=>onAddPhoto(drum)}><Camera size={15}/> Add Photo</button>}
      <button type="button" onClick={()=>openJobCard(drum)}>Open job card</button>
    </section>
  </article>
}


function AddDrumWizard({onClose, onCreate, drums=[], projects=[], createProject, preset={}}){
  const suggestedProductionNumber = nextProductionNumber(drums);
  const suggestedCbNumber = nextCbNumber(drums);

  const [form,setForm]=useState({
    serial:suggestedProductionNumber,
    build_client:preset.build_client || "Unallocated",
    cb_number:"",
    build_type:"Stave",
    drum_type:"Snare",
    diameter:"14",
    depth:"6 1/2",
    timber:"Jarrah",
    customTimber:"",
    finish:preset.finish || "To Be Decided",
    order_type:"Stock",
    shipping_cost:0,
    timber_story:"",
    construction_note:defaultBuildSpecification("Snare"),
    veneer:[1.2,1.2,1.2,1.2,1.2],
    project_id:preset.project_id || "",
    customer:preset.customer || "",
    customer_email:preset.customer_email || "",
    shipping_address:preset.shipping_address || "",
    due_date:preset.due_date || "",
  });

  const size = buildSize(form.diameter, form.depth);
  const timber = form.timber === "Custom / Other" ? form.customTimber : form.timber;
  const isPly = form.build_type === "Ply";
  const lengths = adjustedLengths(form.veneer, size);
  const calculatedPrice = autoPrice({...form,size,timber});
  const total = Number(calculatedPrice||0) + Number(form.shipping_cost||0);

  function setField(key,value){
    setForm(current=>{
      const next={...current,[key]:value};

      if(key==="build_client"){
        if(value==="Brady"){
          next.cb_number = current.cb_number || suggestedCbNumber;
        }else{
          next.cb_number = "";
        }
      }

      if(key==="drum_type"){
        const previousDefault = defaultBuildSpecification(current.drum_type);
        if(!current.construction_note || current.construction_note===previousDefault){
          next.construction_note = defaultBuildSpecification(value);
        }
      }

      return next;
    });
  }

  function setVeneer(index,value){
    setForm(current=>{
      const veneer=[...current.veneer];
      veneer[index]=value;
      return {...current,veneer};
    });
  }

  function create(){
    onCreate({
      ...form,
      timber,
      size,
      custom_price:calculatedPrice,
      total_price:total,
    });
  }

  return <div className="modalBg" onClick={onClose}>
    <div className="modal wizardModal" onClick={e=>e.stopPropagation()}>
      <button className="close" onClick={onClose}>×</button>

      <h2>Add Drum</h2>
      <p>This wizard creates a complete production record. Every shell receives the next production number, whether it is Unallocated, Nowak or Brady.</p>

      <section className="wizardSection">
        <h3>1. Ownership</h3>
        <div className="choiceRow threeChoices">
          {["Unallocated","Nowak","Brady"].map(owner=>
            <button
              key={owner}
              className={form.build_client===owner ? "primary bigChoice" : "bigChoice"}
              onClick={()=>setField("build_client",owner)}
            >
              {owner}
            </button>
          )}
        </div>

        <div className="twoInputGrid">
          <label>Production number
            <input value={form.serial} onChange={e=>setField("serial",e.target.value)} />
          </label>

          {form.build_client==="Brady" &&
            <label>CB number
              <input
                autoFocus
                value={form.cb_number}
                onChange={e=>setField("cb_number",e.target.value)}
              />
            </label>
          }
        </div>
      </section>

      <section className="wizardSection">
        <h3>2. Kit / Project</h3>
        {preset.project_id && <p className="successText">This new drum will be added to {projects.find(p=>p.id===preset.project_id)?.name || "the selected kit/project"}.</p>}
        <p>Leave this blank for a single drum, choose an existing kit, or create a new one now.</p>
        <label>Link to kit or project
          <select value={form.project_id} onChange={e=>setField("project_id",e.target.value)}>
            <option value="">No kit / project</option>
            {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>
        <button type="button" onClick={async()=>{
          const name=window.prompt("New kit / project name");
          if(!name) return;
          const created=await createProject(name);
          if(created) setField("project_id",created.id);
        }}><FolderPlus size={16}/> Create New Kit / Project</button>
      </section>

      <section className="wizardSection">
        <h3>3. Construction</h3>
        <div className="choiceRow">
          <button className={form.build_type==="Stave" ? "primary bigChoice" : "bigChoice"} onClick={()=>setField("build_type","Stave")}>Stave</button>
          <button className={form.build_type==="Ply" ? "primary bigChoice" : "bigChoice"} onClick={()=>setField("build_type","Ply")}>Ply</button>
        </div>
      </section>

      <section className="wizardSection">
        <h3>4. Drum type and size</h3>
        <div className="threeInputGrid">
          <label>Drum type
            <select value={form.drum_type} onChange={e=>setField("drum_type",e.target.value)}>
              {drumTypeOptions.map(t=><option key={t}>{t}</option>)}
            </select>
          </label>

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

        <label>Build Specification</label>
        <textarea
          value={form.construction_note}
          onChange={e=>setField("construction_note",e.target.value)}
        />
      </section>

      <section className="wizardSection">
        <h3>5. Timber and finish</h3>
        <div className="twoInputGrid">
          <label>Material / timber
            <select value={form.timber} onChange={e=>setField("timber",e.target.value)}>
              {timberOptions.map(t=><option key={t}>{t}</option>)}
            </select>
          </label>

          <label>Finish
            <select value={form.finish} onChange={e=>setField("finish",e.target.value)}>
              <option>To Be Decided</option>
              <option>Natural</option>
              <option>Satin</option>
              <option>High Gloss</option>
            </select>
          </label>
        </div>

        {form.timber==="Custom / Other" &&
          <label>Custom material
            <input value={form.customTimber} onChange={e=>setField("customTimber",e.target.value)} />
          </label>
        }

        <label>Timber story</label>
        <textarea value={form.timber_story} onChange={e=>setField("timber_story",e.target.value)} />
      </section>

      <section className="wizardSection">
        <h3>6. Manufacturing calculator</h3>

        {isPly ? <>
          <StaveSpecPanel diameter={form.diameter} drumType={form.drum_type} buildType="Ply" serial={form.serial} timber={timber} size={size}/>
          <p className="calcNote">{sizeAdjustmentLabel(size)}. Layer 1 is fixed as the largest outer layer; thickness changes affect inner layers only.</p>
          <div className="veneerGrid">
            {form.veneer.map((value,index)=>
              <label key={index}>Layer {index+1} mm
                <input value={value} onChange={e=>setVeneer(index,e.target.value)} />
              </label>
            )}
          </div>
          <VeneerResult lengths={lengths}/>
        </> : <>
          <StaveSpecPanel diameter={form.diameter} drumType={form.drum_type} buildType="Stave" serial={form.serial} timber={timber} size={size}/>
        </>}
      </section>

      <section className="wizardSection">
        <h3>7. Order and price</h3>

        <div className="twoInputGrid">
          <label>Order type
            <select value={form.order_type} onChange={e=>setField("order_type",e.target.value)}>
              <option>Stock</option>
              <option>Custom</option>
            </select>
          </label>

          <label>Shipping
            <input value={form.shipping_cost} onChange={e=>setField("shipping_cost",e.target.value)} />
          </label>
        </div>

        {form.build_client==="Brady" && form.drum_type==="Snare" && <p className="pricingNote">
          Brady snare shell pricing: Stave Satin $600 · Stave High Gloss $650 · Ply Satin $400 · Ply High Gloss $450.
          Select Satin or High Gloss to calculate the wholesale price.
        </p>}

        {form.build_client==="Nowak" && form.build_type==="Stave" && form.drum_type==="Snare" && <p className="pricingNote">
          Nowak retail price is being calculated from the current published website price guide for recognised timbers and sizes.
          Natural and Satin use the listed base price; High Gloss adds $100.
        </p>}

        <div className="resultList twoCols">
          <div><b>Calculated price</b><span>{money(calculatedPrice)}</span><small>{form.build_client==="Nowak" && form.build_type==="Stave" && form.drum_type==="Snare" && nowakWebsitePrice({...form,size,timber})!==null ? "Website Price Guide" : "Workshop pricing rule"}</small></div>
          <div><b>Total</b><span>{money(total)}</span></div>
        </div>
      </section>

      <section className="buttonRow wizardFooter">
        <button onClick={onClose}>Cancel</button>
        <button className="primary saveDrumButton" onClick={create}>Save & Create Drum</button>
      </section>
    </div>
  </div>
}



function StaveSpecPanel({diameter, drumType, buildType="Stave", serial="", timber="", size=""}){
  const staveSpec = staveSpecForDiameter(diameter);
  const diameterSpec = workshopSpecForDiameter(diameter);
  const text = workshopSpecsText({serial,timber,size,buildType,drumType,diameter});

  function copySpecs(){
    navigator.clipboard?.writeText(text);
    alert("Workshop specifications copied");
  }

  return <section>
    <h2>Workshop Specifications</h2>
    {buildType==="Stave" ? <section className="staveSpec">
      <div><b>Rough Outside Diameter</b><span>{diameterSpec?.rough || "Not set"}</span></div>
      <div><b>Finished Outside Diameter</b><span>{diameterSpec?.finished || "Not set"}</span></div>
      <div><b>Triton Saw Setting</b><span>{staveSpec?.triton || "Not set"}</span></div>
      <div><b>Finished Stave Width</b><span>{staveSpec?.stave || "Not set"}</span></div>
      <div className="wide"><b>Recommended Build Specification</b><span>{defaultBuildSpecification(drumType)}</span></div>
    </section> : <section className="staveSpec">
      <div className="wide"><b>Finished Outside Diameter</b><span>{diameterSpec?.finished || "Not set"}</span></div>
    </section>}
    <button onClick={copySpecs}>Copy Workshop Specs</button>
  </section>
}

function SizeEditor({drum, updateDrum}){
  const parsed = splitSize(drum.size);
  const [diameter,setDiameter]=useState(parsed.diameter);
  const [depth,setDepth]=useState(parsed.depth);
  function save(nextDiameter=diameter, nextDepth=depth){
    updateDrum(drum.id,{size:buildSize(nextDiameter,nextDepth), construction_note:drumTypeComment(drum.drum_type||"Snare", nextDiameter)});
  }
  return <div className="twoInputGrid">
    <select value={diameter} onChange={e=>{setDiameter(e.target.value); save(e.target.value, depth);}}>{drumDiameters.map(d=><option key={d}>{d}</option>)}</select>
    <select value={depth} onChange={e=>{setDepth(e.target.value); save(diameter, e.target.value);}}>{drumDepths.map(d=><option key={d}>{d}</option>)}</select>
  </div>
}

function VeneerCalculator({drums, updateDrum, openJobCard}){
  const [manual,setManual]=useState([1.2,1.2,1.2,1.2,1.2]);
  const [manualSize,setManualSize]=useState("14 x 6.5");
  const manualLengths=adjustedLengths(manual, manualSize);
  return <section>
    <div className="panel"><h2>Ply Veneer Cut Calculator</h2><p>12&quot;, 13&quot; and 14&quot; cut lists are adjusted automatically from the selected shell size, then fine-tuned by actual thickness.</p></div>
    <section className="panel"><h2>Manual Calculator</h2><label>Shell size</label><select value={manualSize} onChange={e=>setManualSize(e.target.value)}><option>14 x 6.5</option><option>14 x 5.5</option><option>13 x 7</option><option>12 x 7</option></select><p className="calcNote">{sizeAdjustmentLabel(manualSize)}. Layer 1 is fixed as the largest outer layer; thickness changes affect the inner layers only.</p><div className="veneerGrid">{manual.map((v,i)=><label key={i}>Layer {i+1} thickness mm<input value={v} onChange={e=>{const n=[...manual]; n[i]=e.target.value; setManual(n)}}/></label>)}</div><VeneerResult lengths={manualLengths}/></section>
    <section className="panel"><h2>Ply Drums</h2><div className="templateGrid">{drums.map(d=>{const t=[d.veneer_1_thickness,d.veneer_2_thickness,d.veneer_3_thickness,d.veneer_4_thickness,d.veneer_5_thickness].map(x=>x||1.2); return <article className="card" key={d.id}><b>#{d.serial} {d.timber}</b><span>{d.size} · {d.production_status}</span><p className="calcNote">{sizeAdjustmentLabel(d.size)}. Layer 1 is fixed as the largest outer layer; thickness changes affect the inner layers only.</p><div className="veneerGrid small">{t.map((v,i)=><label key={i}>L{i+1}<input value={v} onChange={e=>updateDrum(d.id,{[`veneer_${i+1}_thickness`]:Number(e.target.value)})}/></label>)}</div><VeneerResult lengths={adjustedLengths(t, d.size)}/><button onClick={()=>openJobCard(d)}>Open job card</button></article>})}</div></section>
  </section>
}

function VeneerResult({lengths}){ return <div className="resultList">{lengths.map((l,i)=><div key={i}><b>Layer {i+1}</b><span>{l.toFixed(1)} mm</span></div>)}</div> }


function localDateKey(value){
  if(!value) return "";
  const date=value instanceof Date ? value : new Date(value);
  if(Number.isNaN(date.getTime())) return "";
  const year=date.getFullYear();
  const month=String(date.getMonth()+1).padStart(2,"0");
  const day=String(date.getDate()).padStart(2,"0");
  return `${year}-${month}-${day}`;
}

function startOfLocalDay(date){
  const copy=new Date(date);
  copy.setHours(0,0,0,0);
  return copy;
}

function workshopPeriodStart(period){
  const now=startOfLocalDay(new Date());
  if(period==="Today") return now;
  if(period==="This Week"){
    const day=(now.getDay()+6)%7;
    const start=new Date(now);
    start.setDate(now.getDate()-day);
    return start;
  }
  if(period==="This Month") return new Date(now.getFullYear(),now.getMonth(),1);
  return new Date(2000,0,1);
}

function parseActualTimeEntries(drum){
  const rows=[];
  const lines=String(drum.notes || "").split("\n");

  lines.forEach(line=>{
    const match=line.match(/^(\d{4}-\d{2}-\d{2}):\s*(.*?)\s+(-?\d+(?:\.\d+)?)\s*hr\s*$/i);
    if(!match) return;
    const hours=Number(match[3]);
    if(!Number.isFinite(hours)) return;
    rows.push({
      date:match[1],
      hours,
      label:match[2].trim() || "Workshop time",
      drumId:drum.id,
      serial:drum.serial,
      timber:drum.timber,
      buildType:drum.build_type || "Stave",
    });
  });

  return rows;
}

function estimatedStageEvents(drum){
  const estimates=workflowEstimates[drum.build_type || "Stave"] || workflowEstimates.Stave;
  const history=Array.isArray(drum.stage_history) ? drum.stage_history : [];
  const seen=new Set();
  const rows=[];

  history.forEach(entry=>{
    if(!entry?.completed || !entry?.completed_at || !entry?.item || seen.has(entry.item)) return;
    seen.add(entry.item);
    const hours=Number(estimates[entry.item] || 0);
    rows.push({
      date:localDateKey(entry.completed_at),
      hours,
      item:entry.item,
      drumId:drum.id,
      serial:drum.serial,
      timber:drum.timber,
      buildType:drum.build_type || "Stave",
      completedDrum:entry.item==="Assembled",
    });
  });

  return rows;
}

function saleDateKey(sale){
  return localDateKey(sale.sold_at || sale.created_at || sale.updated_at);
}

function WorkshopSummary({drums,sales,labourRate}){
  const [period,setPeriod]=useState("This Month");
  const [dailyRange,setDailyRange]=useState(30);
  const start=workshopPeriodStart(period);
  const end=new Date();
  end.setHours(23,59,59,999);

  const actualEntries=useMemo(()=>drums.flatMap(parseActualTimeEntries),[drums]);
  const stageEvents=useMemo(()=>drums.flatMap(estimatedStageEvents),[drums]);

  const withinPeriod=dateKey=>{
    if(!dateKey) return false;
    const date=new Date(`${dateKey}T00:00:00`);
    return date>=start && date<=end;
  };

  const periodActual=actualEntries.filter(row=>withinPeriod(row.date));
  const periodStages=stageEvents.filter(row=>withinPeriod(row.date));
  const periodSales=sales.filter(sale=>withinPeriod(saleDateKey(sale)));

  const estimatedHours=periodStages.reduce((sum,row)=>sum+row.hours,0);
  const actualHours=periodActual.reduce((sum,row)=>sum+row.hours,0);
  const labourValue=estimatedHours*Number(labourRate||0);
  const actualLabourValue=actualHours*Number(labourRate||0);
  const salesRevenue=periodSales.reduce((sum,sale)=>sum+Number(sale.total_revenue ?? sale.sale_price ?? 0),0);
  const salesProfit=periodSales.reduce((sum,sale)=>sum+Number(sale.profit || 0),0);
  const drumsCompleted=new Set(periodStages.filter(row=>row.completedDrum).map(row=>row.drumId)).size;
  const drumsProgressed=new Set(periodStages.map(row=>row.drumId)).size;

  const constructionBreakdown=["Stave","Ply"].map(type=>{
    const stages=periodStages.filter(row=>row.buildType===type);
    const actual=periodActual.filter(row=>row.buildType===type);
    return {
      type,
      estimated:stages.reduce((sum,row)=>sum+row.hours,0),
      actual:actual.reduce((sum,row)=>sum+row.hours,0),
      drums:new Set(stages.map(row=>row.drumId)).size,
    };
  });

  const taskBreakdown=Object.entries(periodStages.reduce((group,row)=>{
    group[row.item]=(group[row.item] || 0)+row.hours;
    return group;
  },{}))
    .map(([task,hours])=>({task,hours}))
    .sort((a,b)=>b.hours-a.hours);

  const dailyMap={};
  const addDay=date=>{
    if(!dailyMap[date]){
      dailyMap[date]={
        date,
        estimated:0,
        actual:0,
        drums:new Set(),
        completed:new Set(),
        revenue:0,
        profit:0,
      };
    }
    return dailyMap[date];
  };

  stageEvents.forEach(row=>{
    const day=addDay(row.date);
    day.estimated+=row.hours;
    day.drums.add(row.drumId);
    if(row.completedDrum) day.completed.add(row.drumId);
  });

  actualEntries.forEach(row=>{
    addDay(row.date).actual+=row.hours;
  });

  sales.forEach(sale=>{
    const date=saleDateKey(sale);
    if(!date) return;
    const day=addDay(date);
    day.revenue+=Number(sale.total_revenue ?? sale.sale_price ?? 0);
    day.profit+=Number(sale.profit || 0);
  });

  const dailyCutoff=startOfLocalDay(new Date());
  dailyCutoff.setDate(dailyCutoff.getDate()-(dailyRange-1));

  const dailyRows=Object.values(dailyMap)
    .filter(row=>new Date(`${row.date}T00:00:00`)>=dailyCutoff)
    .sort((a,b)=>b.date.localeCompare(a.date));

  function exportCsv(){
    const header=["Date","Estimated Hours Completed","Actual Hours Logged","Labour Value","Drums Progressed","Drums Completed","Sales Revenue","Estimated Profit"];
    const rows=dailyRows.map(row=>[
      row.date,
      row.estimated.toFixed(2),
      row.actual.toFixed(2),
      (row.estimated*Number(labourRate||0)).toFixed(2),
      row.drums.size,
      row.completed.size,
      row.revenue.toFixed(2),
      row.profit.toFixed(2),
    ]);
    const csv=[header,...rows].map(row=>row.map(value=>`"${String(value).replaceAll('"','""')}"`).join(",")).join("\n");
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    const link=document.createElement("a");
    link.href=url;
    link.download=`nowak-workshop-summary-${localDateKey(new Date())}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return <section className="workshopSummary">
    <section className="panel summaryHeader">
      <div>
        <span className="launchPackEyebrow">WORKSHOP PERFORMANCE</span>
        <h2>Workshop Summary</h2>
        <p>Estimated production value, recorded workshop time, completed work and sales in one place.</p>
      </div>
      <div className="summaryHeaderActions">
        <div className="filterRow">
          {["Today","This Week","This Month","All Time"].map(item=>
            <button key={item} className={period===item?"primary":""} onClick={()=>setPeriod(item)}>{item}</button>
          )}
        </div>
        <button onClick={exportCsv}>Export CSV</button>
      </div>
    </section>

    <section className="stats summaryStats">
      <div><b>{estimatedHours.toFixed(2)}</b><span>Estimated hours completed</span></div>
      <div><b>{actualHours.toFixed(2)}</b><span>Actual hours logged</span></div>
      <div><b>{money(labourValue)}</b><span>Estimated labour value</span></div>
      <div><b>{money(actualLabourValue)}</b><span>Actual logged labour value</span></div>
      <div><b>{drumsProgressed}</b><span>Drums progressed</span></div>
      <div><b>{drumsCompleted}</b><span>Drums assembled</span></div>
      <div><b>{money(salesRevenue)}</b><span>Sales revenue</span></div>
      <div><b>{money(salesProfit)}</b><span>Estimated sales profit</span></div>
    </section>

    <section className="summaryGrid">
      <article className="panel">
        <h2>Construction Breakdown</h2>
        <div className="summaryBreakdown">
          {constructionBreakdown.map(row=><div key={row.type}>
            <b>{row.type}</b>
            <span>{row.estimated.toFixed(2)} estimated hr</span>
            <span>{row.actual.toFixed(2)} actual hr</span>
            <span>{row.drums} drum{row.drums===1?"":"s"} progressed</span>
          </div>)}
        </div>
      </article>

      <article className="panel">
        <h2>Work Completed by Task</h2>
        {taskBreakdown.length===0
          ? <p>No dated stage completions in this period.</p>
          : <div className="summaryTaskList">{taskBreakdown.map(row=><div key={row.task}>
              <span>{row.task}</span><b>{row.hours.toFixed(2)} hr</b>
            </div>)}</div>}
      </article>
    </section>

    <section className="panel">
      <div className="summaryTableHeader">
        <div>
          <h2>Daily Summary</h2>
          <p>Based on dated stage history, actual-time notes and sales records.</p>
        </div>
        <select value={dailyRange} onChange={e=>setDailyRange(Number(e.target.value))}>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
          <option value={365}>Last 12 months</option>
        </select>
      </div>

      <div className="tableWrap">
        <table>
          <thead><tr>
            <th>Date</th>
            <th>Est. hours</th>
            <th>Actual hours</th>
            <th>Labour value</th>
            <th>Drums progressed</th>
            <th>Completed</th>
            <th>Sales</th>
            <th>Profit</th>
          </tr></thead>
          <tbody>
            {dailyRows.length===0 && <tr><td colSpan="8">No dated activity found for this range.</td></tr>}
            {dailyRows.map(row=><tr key={row.date}>
              <td>{new Intl.DateTimeFormat("en-AU",{day:"numeric",month:"short",year:"numeric"}).format(new Date(`${row.date}T00:00:00`))}</td>
              <td>{row.estimated.toFixed(2)}</td>
              <td>{row.actual.toFixed(2)}</td>
              <td>{money(row.estimated*Number(labourRate||0))}</td>
              <td>{row.drums.size}</td>
              <td>{row.completed.size}</td>
              <td>{money(row.revenue)}</td>
              <td>{money(row.profit)}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </section>

    <section className="panel summaryMethodNote">
      <h3>How the figures are calculated</h3>
      <p><b>Estimated hours completed</b> come from each production stage’s saved completion date. <b>Actual hours</b> only appear when time is entered with Add actual time. <b>Sales and profit</b> come from saved sales records.</p>
      <p>Older work without dated stage history or actual-time entries cannot be assigned accurately to a specific day, so it may not appear in the daily table.</p>
    </section>
  </section>
}

function Inventory({hardware, updateHardware, lowStock, inventoryValue}){ return <section className="panel"><h2>Hardware Inventory</h2><p>{hardware.length} parts · {lowStock} low stock alerts · {money(inventoryValue)} stock value</p><div className="tableWrap"><table><thead><tr><th>Part</th><th>Code</th><th>Finish</th><th>Size</th><th>Qty</th><th>Reorder</th><th>Landed AUD</th><th>Status</th></tr></thead><tbody>{hardware.map(p=><tr key={p.id}><td>{p.part_name}<br/><small>{p.category}</small></td><td>{p.code}</td><td>{p.finish}</td><td>{p.size}</td><td><input value={p.qty_on_hand??0} onChange={e=>updateHardware(p.id,{qty_on_hand:Number(e.target.value)})}/></td><td>{p.reorder_level}</td><td>{money(p.landed_cost_aud)}</td><td>{Number(p.qty_on_hand||0)<=Number(p.reorder_level||0)?<span className="dangerText">Order</span>:<span className="okText">OK</span>}</td></tr>)}</tbody></table></div></section> }

function Costing({templates, labourRate, setLabourRate}){ return <section className="panel"><h2>Costing Templates</h2><label className="inlineLabel">Labour rate <input value={labourRate} onChange={e=>setLabourRate(Number(e.target.value))}/></label><div className="templateGrid">{templates.map(t=>{const total=templateCost(t,labourRate), profit=Number(t.retail_price||0)-total; return <article className="card" key={t.id}><b>{t.name}</b><span>Hardware: {money(t.hardware_cost)}</span><span>Timber: {money(t.timber_cost)}</span><span>Consumables: {money(t.consumables)}</span><span>Labour: {t.labour_hours} hrs × {money(labourRate)}</span><hr/><span>Total cost: {money(total)}</span><span>Retail: {money(t.retail_price)}</span><b>Estimated profit: {money(profit)}</b></article>})}</div></section> }

function Orders({drums, openJobCard}){
  const customerOrders=drums.filter(d=>{
    const hasCustomer=Boolean(String(d.customer || "").trim()) && String(d.customer || "").trim().toLowerCase()!=="stock";
    const nowakCustom=d.build_client==="Nowak" && d.sales_status==="Custom Order";
    const brady=d.build_client==="Brady";
    const soldCustomer=hasCustomer && (isSoldStatus(d) || isShippedStatus(d));
    return nowakCustom || brady || soldCustomer;
  });

  const activeNowak=customerOrders.filter(d=>
    d.build_client==="Nowak" &&
    d.sales_status==="Custom Order" &&
    !isSoldStatus(d) &&
    !isShippedStatus(d)
  );

  const bradyOrders=customerOrders.filter(d=>
    d.build_client==="Brady" &&
    !isShippedStatus(d)
  );

  const awaitingFulfilment=customerOrders.filter(d=>
    isSoldStatus(d) && !isShippedStatus(d)
  );

  const completedHistory=customerOrders.filter(d=>
    isShippedStatus(d)
  );

  function dueLabel(d){
    if(!d.due_date) return "No due date";
    const date=new Date(`${d.due_date}T00:00:00`);
    if(Number.isNaN(date.getTime())) return d.due_date;
    return new Intl.DateTimeFormat("en-AU",{day:"numeric",month:"short",year:"numeric"}).format(date);
  }

  function orderCard(d){
    const customer=d.build_client==="Brady"
      ? `Brady / CB ${d.cb_number || "No CB number"}`
      : allocatedCustomerName(d) || "Customer not entered";
    const flow=workflowState(d.build_type||"Stave",parseChecked(d.notes),d.finish);
    const total=Number(d.total_price||d.custom_price||d.retail_price||0);

    return <article className={"customerOrderCard "+(d.build_client==="Brady"?"bradyCard":"")} key={d.id}>
      <div className="customerOrderTop">
        <div>
          <span className="launchPackEyebrow">{d.build_client==="Brady" ? "BRADY / CB ORDER" : "CUSTOMER ORDER"}</span>
          <h3>#{d.serial} {d.timber}</h3>
          <p>{d.size} · {d.drum_type||"Snare"} · {d.build_type} · {d.finish}</p>
        </div>
        <button onClick={()=>openJobCard(d)}>Open Job Card</button>
      </div>

      <div className="customerOrderMeta">
        <div><span>Customer</span><b>{customer}</b></div>
        <div><span>Email</span><b>{d.customer_email || "Not entered"}</b></div>
        <div><span>Status</span><b>{isShippedStatus(d) ? "Shipped" : isSoldStatus(d) ? "Sold — awaiting shipment" : flow.status}</b></div>
        <div><span>Next</span><b>{isShippedStatus(d) ? "Complete" : isSoldStatus(d) ? "Ship the drum" : flow.nextStep}</b></div>
        <div><span>Due</span><b>{dueLabel(d)}</b></div>
        <div><span>Order value</span><b>{money(total)}</b></div>
        {trackingNumberFromNotes(d.notes) && <div><span>Tracking</span><b>{trackingNumberFromNotes(d.notes)}</b></div>}
      </div>

      <div className="progress"><i style={{width:flow.percent+"%"}}></i></div>
    </article>;
  }

  function orderSection(title,description,items,emptyText,className=""){
    return <section className={"panel customerOrderSection "+className}>
      <div className="customerOrderSectionHeader">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <b>{items.length}</b>
      </div>
      {items.length
        ? <div className="customerOrderGrid">{items.map(orderCard)}</div>
        : <p className="okText">{emptyText}</p>}
    </section>;
  }

  return <section className="customerOrdersPage">
    <section className="panel customerOrdersIntro">
      <div>
        <span className="launchPackEyebrow">CUSTOMER MANAGEMENT</span>
        <h2>Customers & Orders</h2>
        <p>Customer work, Brady builds and sold drums requiring fulfilment. Unallocated and unsold stock drums are intentionally excluded.</p>
      </div>
      <div className="customerOrderCounts">
        <div><b>{activeNowak.length}</b><span>Active custom</span></div>
        <div><b>{bradyOrders.length}</b><span>Brady / CB</span></div>
        <div><b>{awaitingFulfilment.length}</b><span>Awaiting shipment</span></div>
        <div><b>{completedHistory.length}</b><span>Completed history</span></div>
      </div>
    </section>

    {orderSection(
      "Active Customer Orders",
      "Nowak custom drums currently being built for a named customer.",
      activeNowak,
      "No active customer orders."
    )}

    {orderSection(
      "Brady / CB Orders",
      "Current drums being produced for Chris Brady / Brady Drums.",
      bradyOrders,
      "No active Brady / CB orders.",
      "bradyOrderSection"
    )}

    {orderSection(
      "Awaiting Collection or Shipping",
      "Sold customer drums that have not yet been marked shipped.",
      awaitingFulfilment,
      "No customer orders are awaiting collection or shipping.",
      "fulfilmentOrderSection"
    )}

    {orderSection(
      "Completed Customer History",
      "Customer and Brady orders that have been shipped.",
      completedHistory,
      "No completed customer history yet."
    )}
  </section>
}


function CommsMarketingCentre({filteredDrums,allDrums,openJobCard,setMessage,onAddPhoto}){
  const [section,setSection]=useState("drafts");

  return <section>
    <section className="panel commsMarketingHeader">
      <div>
        <span className="launchPackEyebrow">COMMUNICATIONS</span>
        <h2>Comms & Marketing</h2>
        <p>Review Launch Pack drafts or manually generate milestone communications from one place.</p>
      </div>

      <div className="commsMarketingTabs">
        <button
          className={section==="drafts" ? "primary" : ""}
          onClick={()=>setSection("drafts")}
        >
          <Share2 size={16}/> Launch Pack Drafts
        </button>
        <button
          className={section==="milestones" ? "primary" : ""}
          onClick={()=>setSection("milestones")}
        >
          <Mail size={16}/> Milestone Generator
        </button>
      </div>
    </section>

    {section==="drafts"
      ? <MarketingCentre drums={allDrums} openJobCard={openJobCard} setMessage={setMessage} embedded/>
      : <CommsCentre drums={filteredDrums} openJobCard={openJobCard} embedded onAddPhoto={onAddPhoto}/>
    }
  </section>
}


function CommsCentre({drums, openJobCard, embedded=false, onAddPhoto}){
  return <section>
    {!embedded && <div className="panel"><h2>Communication Centre</h2><p>Generate customer emails and Facebook/Instagram posts from production milestones. Emails are signed Kelly & Kyle.</p></div>}
    {embedded && <div className="panel embeddedSectionIntro"><h3>Milestone Generator</h3><p>Choose a milestone, add photos, then open only the communication you need. Brady builds remain internal-only.</p></div>}
    <section className="templateGrid commsCardGrid">{drums.map(d=><CommsCard key={d.id} drum={d} openJobCard={openJobCard} onAddPhoto={onAddPhoto}/>)}</section>
  </section>
}

function CommsCard({drum, openJobCard, onAddPhoto}){
  const [milestoneKey,setMilestoneKey]=useState("blank");
  const [openSection,setOpenSection]=useState("");
  const milestone = communicationMilestones.find(m=>m.key===milestoneKey) || communicationMilestones[0];
  const draft = emailDraft(drum, milestone);
  const fb = socialPost(drum, milestone, "facebook");
  const insta = socialPost(drum, milestone, "instagram");

  const isBrady=drum.build_client==="Brady";
  const isCustom=drum.build_client==="Nowak" && drum.sales_status==="Custom Order";
  const isSocialOnly=!isBrady && !isCustom;
  const photoMilestoneKey=photoMilestones[milestoneKey] ? milestoneKey : "general";

  function copy(text,label){
    navigator.clipboard?.writeText(text);
    alert(label + " copied");
  }

  function toggleSection(section){
    setOpenSection(current=>current===section ? "" : section);
  }

  return <article className={"panel compactCommsCard " + (isBrady?"bradyCard":"")}>
    <div className="cardHeading">
      <h2>#{drum.serial} {drum.timber}</h2>
      {allocatedCustomerName(drum) && <span className="customerNameBadge">{allocatedCustomerName(drum)}</span>}
    </div>

    {isBrady && <span className="cbBadge">CB {drum.cb_number || "No CB #"}</span>}
    <p>{drum.size} · {drum.build_type} · {drum.production_status}</p>

    <label>Milestone</label>
    <select value={milestoneKey} onChange={e=>{setMilestoneKey(e.target.value);setOpenSection("");}}>
      {communicationMilestones.map(m=><option key={m.key} value={m.key}>{m.label}</option>)}
    </select>

    <section className="commsPhotoPrompt">
      <b>Photo prompt</b>
      <p>{milestone.photo}</p>
      <button type="button" onClick={()=>onAddPhoto?.(drum,photoMilestoneKey)}>
        <Camera size={15}/> Add Photo
      </button>
    </section>

    {isBrady && <section className="internalOnlyNotice">
      <b>Internal documentation only</b>
      <span>No customer email or social-media draft is shown for Brady builds.</span>
    </section>}

    {!isBrady && <section className="compactCommsActions">
      <button className={openSection==="facebook"?"primary":""} onClick={()=>toggleSection("facebook")}><Share2 size={15}/> Facebook</button>
      <button className={openSection==="instagram"?"primary":""} onClick={()=>toggleSection("instagram")}><Share2 size={15}/> Instagram</button>
      {isCustom && <button className={openSection==="email"?"primary":""} onClick={()=>toggleSection("email")}><Mail size={15}/> Customer Email</button>}
    </section>}

    {isSocialOnly && <p className="calcNote">Social media only. No customer email is required for this build.</p>}

    {openSection==="facebook" && <section className="commsExpandable">
      <h3>Facebook Draft</h3>
      <pre>{fb}</pre>
      <button onClick={()=>copy(fb,"Facebook post")}><Share2 size={16}/> Copy Facebook</button>
    </section>}

    {openSection==="instagram" && <section className="commsExpandable">
      <h3>Instagram Draft</h3>
      <pre>{insta}</pre>
      <button onClick={()=>copy(insta,"Instagram caption")}><Share2 size={16}/> Copy Instagram</button>
    </section>}

    {openSection==="email" && isCustom && <section className="commsExpandable">
      <h3>Customer Email</h3>
      {drum.customer_email
        ? <p className="okText">Email available: {drum.customer_email}</p>
        : <p className="dangerText">No customer email saved yet.</p>}
      <pre>Subject: {draft.subject}

{draft.body}</pre>
      <section className="buttonRow">
        <a className={"buttonLike primary "+(!drum.customer_email?"disabledLink":"")} href={drum.customer_email?mailtoLink(drum,draft):undefined}><Mail size={16}/> Open Email</a>
        <button onClick={()=>copy(`Subject: ${draft.subject}\n\n${draft.body}`,"Email")}>Copy Email</button>
      </section>
    </section>}

    <button className="openJobCardButton" onClick={()=>openJobCard(drum)}>Open Job Card</button>
  </article>
}


function LaunchMediaModal({drum,stage,onClose,onUploaded,setMessage}){
  const cameraInputRef=useRef(null);
  const libraryInputRef=useRef(null);
  const [files,setFiles]=useState([]);
  const [status,setStatus]=useState("");

  async function upload(){
    if(!files.length){
      setStatus("Choose or take at least one file first.");
      return;
    }

    setStatus("Uploading...");
    try{
      for(let index=0; index<files.length; index+=1){
        const file=files[index];
        const safeName=String(file.name || `launch-${index+1}`).replace(/[^a-zA-Z0-9._-]/g,"-");
        const uniqueId=globalThis.crypto?.randomUUID?.() || `${Date.now()}-${index}-${Math.random().toString(36).slice(2)}`;
        const path=`${drum.id}/${stage.key}/${uniqueId}-${safeName}`;
        const mediaType=String(file.type || "").startsWith("video/") ? "video" : "image";

        const {error:uploadError}=await supabase.storage
          .from("drum-photos")
          .upload(path,file,{
            upsert:false,
            cacheControl:"3600",
            contentType:file.type || undefined
          });
        if(uploadError) throw new Error(uploadError.message);

        const {data:publicData}=supabase.storage.from("drum-photos").getPublicUrl(path);
        const publicUrl=publicData?.publicUrl || "";

        const {error:rowError}=await supabase.from("drum_photos").insert({
          drum_id:drum.id,
          milestone:stage.key,
          storage_path:path,
          public_url:publicUrl,
          caption:stage.prompt,
          media_type:mediaType,
        });
        if(rowError) throw new Error(rowError.message);
      }

      setStatus(`${files.length} file${files.length===1?"":"s"} uploaded and stored.`);
      setMessage?.("");
      onUploaded?.();
      setTimeout(onClose,700);
    }catch(error){
      const detail="Launch Pack upload failed: " + (error?.message || String(error));
      setStatus(detail);
      setMessage?.(detail);
    }
  }

  return <div className="modalBg launchMediaBg" onClick={onClose}>
    <div className="modal launchMediaModal" onClick={e=>e.stopPropagation()}>
      <button className="close" onClick={onClose}>×</button>
      <h2>{stage.label}</h2>
      <p>{stage.prompt}</p>
      <p className="calcNote">Recommended: {stage.recommended}</p>

      <div className="photoChoiceButtons">
        <button className="primary" onClick={()=>cameraInputRef.current?.click()}><Camera size={16}/> Take Photo / Video</button>
        <button onClick={()=>libraryInputRef.current?.click()}><Plus size={16}/> Choose Existing</button>
      </div>

      <input className="hiddenFileInput" ref={cameraInputRef} type="file" accept={stage.accept} capture="environment" onChange={e=>setFiles(Array.from(e.target.files || []))}/>
      <input className="hiddenFileInput" ref={libraryInputRef} type="file" accept={stage.accept} multiple onChange={e=>setFiles(Array.from(e.target.files || []))}/>

      {files.length>0 && <p className="okText">{files.length} file{files.length===1?"":"s"} selected.</p>}
      <button className="primary uploadPhotosButton" disabled={status==="Uploading..."} onClick={upload}>
        <Camera size={16}/> {status==="Uploading..." ? "Uploading..." : "Upload and Store"}
      </button>
      {status && <p className={status.includes("failed")?"dangerText":"okText"}>{status}</p>}
    </div>
  </div>
}

function LaunchPackSection({drum,setMessage}){
  const [media,setMedia]=useState([]);
  const [drafts,setDrafts]=useState([]);
  const [selectedStage,setSelectedStage]=useState(null);
  const [status,setStatus]=useState("");
  const [expandedStage,setExpandedStage]=useState("launch_final");

  async function load(){
    const [{data:mediaData,error:mediaError},{data:draftData,error:draftError}]=await Promise.all([
      supabase.from("drum_photos").select("*").eq("drum_id",drum.id).in("milestone",launchPackStages.map(s=>s.key)),
      supabase.from("launch_pack_drafts").select("*").eq("drum_id",drum.id).order("created_at",{ascending:false}),
    ]);
    if(mediaError) setMessage?.("Could not load Launch Pack media: "+mediaError.message);
    if(draftError) setMessage?.("Could not load Launch Pack drafts: "+draftError.message);
    setMedia(mediaData || []);
    setDrafts(draftData || []);
  }

  useEffect(()=>{ load(); },[drum.id]);

  const counts=Object.fromEntries(launchPackStages.map(stage=>[
    stage.key,
    media.filter(item=>item.milestone===stage.key).length
  ]));
  const completedStages=launchPackStages.filter(stage=>counts[stage.key]>0).length;
  const generated=drafts.length>0;
  const progress=Math.round(((completedStages + (generated?1:0))/5)*100);

  async function deleteMedia(item){
    const confirmed=window.confirm("Delete this stored media file from the Launch Pack?");
    if(!confirmed) return;

    setStatus("Deleting media...");
    try{
      if(item.storage_path){
        const {error:storageError}=await supabase.storage
          .from("drum-photos")
          .remove([item.storage_path]);
        if(storageError) throw new Error("Storage delete: "+storageError.message);
      }

      const {error:rowError}=await supabase
        .from("drum_photos")
        .delete()
        .eq("id",item.id);
      if(rowError) throw new Error("Photo record delete: "+rowError.message);

      setStatus("Media deleted.");
      await load();
    }catch(error){
      const detail="Could not delete media: "+(error?.message || String(error));
      setStatus(detail);
      setMessage?.(detail);
    }
  }

  async function generate(){
    setStatus("Generating drafts...");
    const email=launchPackCustomerEmail(drum);
    const rows=[
      {drum_id:drum.id,platform:"Facebook",status:"Draft",content:launchPackFacebook(drum),subject:null},
      {drum_id:drum.id,platform:"Instagram",status:"Draft",content:launchPackInstagram(drum),subject:null},
      {drum_id:drum.id,platform:"Website",status:"Draft",content:launchPackWebsite(drum),subject:null},
    ];
    if(drum.sales_status==="Custom Order"){
      rows.push({drum_id:drum.id,platform:"Customer Email",status:"Draft",content:email.body,subject:email.subject});
    }

    const {error}=await supabase.from("launch_pack_drafts").insert(rows);
    if(error){
      const detail="Could not generate Launch Pack: "+error.message;
      setStatus(detail);
      setMessage?.(detail);
      return;
    }

    setStatus("Launch Pack drafts created.");
    await load();
  }

  return <section className="panel inner launchPackPanel">
    <div className="launchPackHeader">
      <div>
        <span className="launchPackEyebrow">NOWAK MARKETING</span>
        <h2>Launch Pack</h2>
      </div>
      <b>{progress}%</b>
    </div>
    <div className="progress large"><i style={{width:progress+"%"}}></i></div>

    <p className="launchPackEmailNote">
      Customer email actions only appear for Nowak custom orders when both a customer name and customer email address have been entered on the Job Card.
    </p>

    <div className="launchStageGrid">
      {launchPackStages.map(stage=>{
        const stageMedia=media.filter(item=>item.milestone===stage.key);
        const expanded=expandedStage===stage.key;

        return <article className={"launchStageCard "+(counts[stage.key]?"complete":"")} key={stage.key}>
          <div className="launchStageTitleRow">
            <h3>{stage.label}</h3>
            {stageMedia.length>0 && <button className="smallToggleButton" onClick={()=>setExpandedStage(expanded?"":stage.key)}>
              {expanded ? "Show fewer" : stageMedia.length>3 ? `View all ${stageMedia.length}` : "Hide previews"}
            </button>}
          </div>
          <p>{stage.prompt}</p>
          <small>{counts[stage.key]} file{counts[stage.key]===1?"":"s"} stored</small>

          {stageMedia.length>0 && <div className={"launchMediaGallery "+(!expanded?"compactMediaGallery":"")}>
            {stageMedia.slice(0,expanded ? stageMedia.length : 3).map(item=>{
              const isVideo=item.media_type==="video" || /\.(mp4|mov|m4v|webm)$/i.test(item.storage_path || item.public_url || "");
              return <div className="launchMediaItem" key={item.id}>
                <div className="launchMediaPreview">
                  {isVideo
                    ? <video src={item.public_url} muted playsInline controls preload="metadata"/>
                    : <a href={item.public_url} target="_blank" rel="noreferrer"><img src={item.public_url} alt={stage.label}/></a>}
                  {isVideo && <span className="videoMediaBadge">VIDEO</span>}
                </div>
                <div className="launchMediaItemActions">
                  <a href={item.public_url} target="_blank" rel="noreferrer">Open</a>
                  <button className="mediaDeleteButton" onClick={()=>deleteMedia(item)}>Delete</button>
                </div>
              </div>
            })}
          </div>}

          {stageMedia.length>0 && (()=> {
            const actions=communicationActionsForDrum(drum,stage.key);
            return <div className="mediaCommunicationActions">
              <button onClick={()=>downloadStoredMedia(stageMedia,drum,stage.label,setMessage)}>Download Media</button>
              {actions.canEmail && <a className={"buttonLike "+(!drum.customer_email?"disabledLink":"")} href={drum.customer_email?actions.mailto:undefined}>
                <Mail size={14}/> Open Customer Email
              </a>}
              {actions.canSocial && <button onClick={()=>{navigator.clipboard?.writeText(actions.message.social);setMessage?.("Facebook caption copied.");}}>Copy Facebook Caption</button>}
              {actions.canSocial && <button onClick={()=>{navigator.clipboard?.writeText(actions.message.instagram);setMessage?.("Instagram caption copied.");}}>Copy Instagram Caption</button>}
              {actions.isBrady && <span className="internalOnlyNotice">Internal documentation only.</span>}
            </div>
          })()}

          <button onClick={()=>setSelectedStage(stage)}><Camera size={15}/> {stageMedia.length ? "Add More Media" : "Add Media"}</button>
        </article>
      })}
    </div>

    <section className="launchChecklist">
      <span>{counts.launch_timber>0?"✓":"□"} Timber</span>
      <span>{counts.launch_machined>0?"✓":"□"} Machined</span>
      <span>{counts.launch_reveal>0?"✓":"□"} Reveal</span>
      <span>{counts.launch_final>0?"✓":"□"} Final photos</span>
      <span>{generated?"✓":"□"} Launch generated</span>
    </section>

    <button className="primary generateLaunchButton" disabled={completedStages<4 || generated} onClick={generate}>
      <Share2 size={16}/> {generated ? "Launch Pack Generated" : completedStages<4 ? "Complete all media stages first" : "Generate Launch Pack"}
    </button>
    {status && <p className={status.includes("Could not")?"dangerText":"okText"}>{status}</p>}

    {drafts.length>0 && <section className="launchDraftPreview">
      <h3>Generated Drafts</h3>
      {drafts.map(draft=><div key={draft.id}><b>{draft.platform}</b><span>{draft.status}</span></div>)}
      <p className="calcNote">Open the Marketing tab to proofread and approve drafts.</p>
    </section>}

    {selectedStage && <LaunchMediaModal drum={drum} stage={selectedStage} onClose={()=>setSelectedStage(null)} onUploaded={load} setMessage={setMessage}/>}
  </section>
}

function MarketingCentre({drums,openJobCard,setMessage,embedded=false}){
  const [drafts,setDrafts]=useState([]);
  const [folder,setFolder]=useState("Draft");
  const [editing,setEditing]=useState(null);

  async function load(){
    const {data,error}=await supabase.from("launch_pack_drafts").select("*").order("created_at",{ascending:false});
    if(error) setMessage?.("Could not load marketing drafts: "+error.message);
    setDrafts(data || []);
  }
  useEffect(()=>{ load(); },[]);

  async function updateDraft(id,patch){
    const {error}=await supabase.from("launch_pack_drafts").update(patch).eq("id",id);
    if(error) setMessage?.("Could not update draft: "+error.message);
    else await load();
  }

  const drumMap=Object.fromEntries(drums.map(d=>[d.id,d]));
  const visible=drafts.filter(d=>d.status===folder);

  return <section>
    <section className="panel productionToolbar">
      <h2>{embedded ? "Launch Pack Drafts" : "Marketing"}</h2>
      <p>Proofread Launch Pack drafts before release. Nothing is published automatically.</p>
      <div className="filterRow">
        {["Draft","Ready","Published","Archived"].map(item=>
          <button key={item} className={folder===item?"primary":""} onClick={()=>setFolder(item)}>{item}</button>
        )}
      </div>
    </section>

    <section className="templateGrid marketingDraftGrid">
      {visible.length===0 && <article className="panel"><p>No {folder.toLowerCase()} items.</p></article>}
      {visible.map(draft=>{
        const drum=drumMap[draft.drum_id] || {};
        return <article className="panel marketingDraftCard" key={draft.id}>
          <div className="cardHeading">
            <h2>{draft.platform}</h2>
            <span className="badge">{draft.status}</span>
          </div>
          <p><b>Production #{drum.serial || "—"}</b> · {drum.timber || ""} {drum.size || ""}</p>
          {draft.subject && <><label>Subject</label><input value={editing?.id===draft.id ? editing.subject : draft.subject} onChange={e=>setEditing({...draft,subject:e.target.value,content:editing?.id===draft.id?editing.content:draft.content})}/></>}
          <label>Content</label>
          <textarea value={editing?.id===draft.id ? editing.content : draft.content} onChange={e=>setEditing({...draft,content:e.target.value,subject:editing?.id===draft.id?editing.subject:draft.subject})}/>
          <section className="buttonRow">
            <button onClick={()=>openJobCard(drum)}>Open Job Card</button>
            <button onClick={()=>navigator.clipboard?.writeText(editing?.id===draft.id ? editing.content : draft.content)}>Copy</button>
            {editing?.id===draft.id && <button onClick={()=>{updateDraft(draft.id,{content:editing.content,subject:editing.subject});setEditing(null);}}>Save Edit</button>}
            {folder==="Draft" && <button className="primary" onClick={()=>updateDraft(draft.id,{status:"Ready"})}>Approve</button>}
            {folder==="Ready" && <button className="primary" onClick={()=>updateDraft(draft.id,{status:"Published",published_at:new Date().toISOString()})}>Mark Published</button>}
            {folder!=="Archived" && <button onClick={()=>updateDraft(draft.id,{status:"Archived"})}>Archive</button>}
          </section>
        </article>
      })}
    </section>
  </section>
}


function ProjectsPage({projects,drums,openJobCard,createProject,updateProject,linkDrumsToProject,unlinkDrumFromProject}){
  const [selectedProject,setSelectedProject]=useState(projects[0]?.id || "");
  const [selectedDrums,setSelectedDrums]=useState([]);

  function toggleDrum(id){
    setSelectedDrums(current=>current.includes(id) ? current.filter(x=>x!==id) : [...current,id]);
  }

  async function linkSelected(){
    if(!selectedProject){
      alert("Choose a kit or project first.");
      return;
    }
    if(!selectedDrums.length){
      alert("Select at least one drum.");
      return;
    }
    const success=await linkDrumsToProject(selectedDrums,selectedProject);
    if(success){
      setSelectedDrums([]);
      alert("Selected drums linked to the kit/project.");
    }
  }

  const projectName=id=>projects.find(p=>p.id===id)?.name || "No kit / project";

  return <section>
    <section className="panel projectToolbar">
      <div>
        <h2>Kits / Projects</h2>
        <p>You can link drums here in bulk, or open any Job Card and use its Kit / Project dropdown. Each drum keeps its own job card and production number.</p>
      </div>
      <button className="primary" onClick={createProject}><FolderPlus size={16}/> New Kit / Project</button>
    </section>

    {projects.length===0 && <section className="panel warning">
      <h2>No kits or projects yet</h2>
      <p>Click New Kit / Project first. If creation fails, run the included v5.0 Supabase setup.</p>
    </section>}

    <section className="panel linkExistingPanel">
      <h2>Link Existing Drums</h2>
      <div className="twoInputGrid">
        <label>Choose kit / project
          <select value={selectedProject} onChange={e=>setSelectedProject(e.target.value)}>
            <option value="">Choose a kit / project</option>
            {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>
        <div className="linkAction">
          <button className="primary" onClick={linkSelected}><Layers3 size={16}/> Link Selected Drums</button>
        </div>
      </div>

      <div className="drumLinkGrid">
        {[...drums].sort((a,b)=>extractNumber(a.serial)-extractNumber(b.serial)).map(d=>
          <label className={"drumLinkItem "+(selectedDrums.includes(d.id)?"selected":"")} key={d.id}>
            <input type="checkbox" checked={selectedDrums.includes(d.id)} onChange={()=>toggleDrum(d.id)}/>
            <span>
              <b>#{d.serial} · {d.size} · {d.drum_type||"Snare"}</b>
              <small>{d.timber} · Currently: {projectName(d.project_id)}</small>
            </span>
          </label>
        )}
      </div>
    </section>

    <section className="templateGrid">
      {projects.map(project=>{
        const linked=drums
          .filter(d=>d.project_id===project.id)
          .sort((a,b)=>extractNumber(a.serial)-extractNumber(b.serial));
        const complete=linked.filter(d=>workflowState(d.build_type||"Stave",parseChecked(d.notes),d.finish).percent===100).length;
        const overall=linked.length ? Math.round(linked.reduce((sum,d)=>sum+workflowState(d.build_type||"Stave",parseChecked(d.notes),d.finish).percent,0)/linked.length) : 0;

        return <article className="panel projectCard" key={project.id}>
          <h2>{project.name}</h2>
          <div className="progress"><i style={{width:overall+"%"}}></i></div>
          <p>{linked.length} drums · {complete} completed · {overall}% overall</p>

          <label>Customer</label>
          <input defaultValue={project.customer||""} onBlur={e=>updateProject(project.id,{customer:e.target.value})}/>

          <label>Due date</label>
          <input type="date" defaultValue={project.due_date||""} onBlur={e=>updateProject(project.id,{due_date:e.target.value||null})}/>

          <div className="projectDrums">
            {linked.length===0 && <p>No drums linked yet.</p>}
            {linked.map(d=><div className="linkedDrumRow" key={d.id}>
              <button onClick={()=>openJobCard(d)}>#{d.serial} · {d.size} · {d.drum_type||"Snare"}</button>
              <button className="unlinkButton" onClick={()=>unlinkDrumFromProject(d.id)}>Unlink</button>
            </div>)}
          </div>
        </article>
      })}
    </section>
  </section>
}

function SettingsPage(){
  return <section className="panel">
    <h2>Settings / Rules</h2>
    <p>v2.0 includes the first rule system. These are currently coded defaults and can become editable database settings in the next version.</p>
    <div className="templateGrid">
      {Object.entries(priceRules).map(([key,rule])=><article className="card" key={key}><b>{key}</b><span>Wholesale factor: {rule.wholesaleFactor}</span><span>Custom factor: {rule.customFactor}</span></article>)}
    </div>
  </section>
}


function communicationMilestoneKey(key){
  const map={
    launch_timber:"wood",
    launch_machined:"machined",
    launch_reveal:"sealer",
    launch_final:"drumcomplete",
  };
  return map[key] || key || "general";
}

function communicationActionsForDrum(drum,key){
  const message=milestoneMessage(drum,communicationMilestoneKey(key));
  const isBrady=drum.build_client==="Brady";
  return {
    message,
    canEmail:!isBrady && isCustomCustomerDrum(drum),
    canSocial:!isBrady,
    isBrady,
    mailto:`mailto:${encodeURIComponent(drum.customer_email || "")}?subject=${encodeURIComponent(message.emailSubject)}&body=${encodeURIComponent(message.emailBody)}`,
  };
}

function downloadStoredMedia(items,drum,label,setMessage){
  if(!items?.length) return;
  items.forEach((item,index)=>{
    const url=item.public_url;
    if(!url) return;
    const extension=(String(item.storage_path || url).match(/\.(mp4|mov|m4v|webm|png|jpe?g|heic)$/i)?.[1] || "jpg").toLowerCase();
    const link=document.createElement("a");
    link.href=url;
    link.download=`${String(drum.serial || "drum").replace(/[^a-zA-Z0-9_-]/g,"-")}-${String(label || "media").replace(/[^a-zA-Z0-9_-]/g,"-")}-${index+1}.${extension}`;
    link.target="_blank";
    link.rel="noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
  });
  setMessage?.(`${items.length} media file${items.length===1?"":"s"} opened for download.`);
}

function DrumPhotoLibrary({drum,setMessage,onAddPhoto}){
  const [photos,setPhotos]=useState([]);
  const [loadingPhotos,setLoadingPhotos]=useState(false);
  const [libraryStatus,setLibraryStatus]=useState("");

  async function loadPhotos(){
    setLoadingPhotos(true);
    const {data,error}=await supabase
      .from("drum_photos")
      .select("*")
      .eq("drum_id",drum.id)
      .order("created_at",{ascending:false});

    if(error){
      setLibraryStatus("Could not load stored media: "+error.message);
      setPhotos([]);
    }else{
      setPhotos(data || []);
      setLibraryStatus("");
    }
    setLoadingPhotos(false);
  }

  useEffect(()=>{ loadPhotos(); },[drum.id]);

  async function deleteStoredMedia(item){
    const confirmed=window.confirm("Delete this stored photo or video?");
    if(!confirmed) return;

    setLibraryStatus("Deleting media...");
    try{
      if(item.storage_path){
        const {error:storageError}=await supabase.storage
          .from("drum-photos")
          .remove([item.storage_path]);
        if(storageError) throw new Error("Storage delete: "+storageError.message);
      }

      const {error:rowError}=await supabase
        .from("drum_photos")
        .delete()
        .eq("id",item.id);
      if(rowError) throw new Error("Photo record delete: "+rowError.message);

      setLibraryStatus("Media deleted.");
      await loadPhotos();
    }catch(error){
      setLibraryStatus("Could not delete media: "+(error?.message || String(error)));
    }
  }

  return <section className="panel inner">
    <div className="photoLibraryHeader">
      <h2>Stored Build Photos & Videos</h2>
      <button onClick={loadPhotos}>{loadingPhotos?"Loading...":"Refresh"}</button>
    </div>

    {photos.length===0 ? <p>No milestone photos or videos stored yet.</p> :
      <div className="photoLibraryGrid">
        {photos.map(photo=>{
          const isVideo=photo.media_type==="video" || /\.(mp4|mov|m4v|webm)$/i.test(photo.storage_path || photo.public_url || "");
          const label=photoMilestones[photo.milestone]?.label || launchPackStages.find(stage=>stage.key===photo.milestone)?.label || photo.milestone;
          const actions=communicationActionsForDrum(drum,photo.milestone);
          return <div className="storedMediaCard" key={photo.id}>
            <a href={photo.public_url} target="_blank" rel="noreferrer">
              {isVideo
                ? <video src={photo.public_url} muted playsInline controls preload="metadata"/>
                : <img src={photo.public_url} alt={photo.milestone}/>}
              {isVideo && <span className="videoMediaBadge">VIDEO</span>}
            </a>
            <span>{label}</span>
            <div className="storedMediaActions">
              <a className="buttonLike" href={photo.public_url} target="_blank" rel="noreferrer">Open Media</a>
              <button onClick={()=>downloadStoredMedia([photo],drum,label,setMessage)}>Download</button>
              {actions.canEmail && <a className={"buttonLike "+(!drum.customer_email?"disabledLink":"")} href={drum.customer_email?actions.mailto:undefined}>
                <Mail size={14}/> Customer Email
              </a>}
              {actions.canSocial && <button onClick={()=>{navigator.clipboard?.writeText(actions.message.social);setMessage?.("Facebook caption copied.");}}>Copy Facebook Caption</button>}
              {actions.canSocial && <button onClick={()=>{navigator.clipboard?.writeText(actions.message.instagram);setMessage?.("Instagram caption copied.");}}>Copy Instagram Caption</button>}
              {onAddPhoto && <button onClick={()=>onAddPhoto(drum,photo.milestone)}>Add More Media</button>}
              <button className="mediaDeleteButton" onClick={()=>deleteStoredMedia(photo)}>Delete</button>
            </div>
            {actions.isBrady && <small className="internalOnlyNotice">Internal documentation only.</small>}
          </div>
        })}
      </div>
    }

    {libraryStatus && <p className={libraryStatus.includes("Could not")?"dangerText":"okText"}>{libraryStatus}</p>}
  </section>
}


function StageCommunications({drum,setMessage,onAddPhoto}){
  const [photos,setPhotos]=useState([]);
  const [expanded,setExpanded]=useState("");
  const [loading,setLoading]=useState(false);

  async function load(){
    setLoading(true);
    const {data,error}=await supabase
      .from("drum_photos")
      .select("*")
      .eq("drum_id",drum.id)
      .order("created_at",{ascending:true});

    if(error){
      setMessage?.("Could not load stage photos: "+error.message);
      setPhotos([]);
    }else{
      setPhotos(data || []);
    }
    setLoading(false);
  }

  useEffect(()=>{ load(); },[drum.id]);

  const grouped=photos.reduce((acc,photo)=>{
    const key=photo.milestone || "general";
    if(!acc[key]) acc[key]=[];
    acc[key].push(photo);
    return acc;
  },{});

  const stageOrder=["wood","blank","machined","sealer","shellcomplete","drumcomplete","general"];
  const stageKeys=[
    ...stageOrder.filter(key=>grouped[key]?.length),
    ...Object.keys(grouped).filter(key=>!stageOrder.includes(key) && !key.startsWith("launch_"))
  ];

  function stageLabel(key){
    if(key==="shellcomplete"){
      if(drum.build_client==="Brady") return "Brady Shell Complete";
      if(drum.build_client==="Nowak") return isCustomCustomerDrum(drum) ? "Nowak Custom Drum Complete" : "Nowak Drum Complete";
      return "Shell Complete";
    }
    return photoMilestones[key]?.label || key.replaceAll("_"," ");
  }

  function copy(text,label){
    navigator.clipboard?.writeText(text);
    setMessage?.(label+" copied.");
  }

  function downloadPhotos(items,label){
    if(!items.length) return;
    items.forEach((photo,index)=>{
      const link=document.createElement("a");
      link.href=photo.public_url;
      link.download=`${String(drum.serial || "drum").replace(/[^a-zA-Z0-9_-]/g,"-")}-${label.replace(/[^a-zA-Z0-9_-]/g,"-")}-${index+1}.jpg`;
      link.target="_blank";
      link.rel="noreferrer";
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
    setMessage?.(`${items.length} photo${items.length===1?"":"s"} opened for download. Attach them manually to the email.`);
  }

  if(stageKeys.length===0){
    return <section className="panel inner stageCommsPanel">
      <div className="stageCommsHeader">
        <div>
          <span className="launchPackEyebrow">STORED CONTENT</span>
          <h2>Stage Communications</h2>
        </div>
        <button onClick={load}>{loading?"Loading...":"Refresh"}</button>
      </div>
      <p>No stored milestone photos yet. Add photos to a stage and its email/social options will appear here.</p>
    </section>
  }

  return <section className="panel inner stageCommsPanel">
    <div className="stageCommsHeader">
      <div>
        <span className="launchPackEyebrow">STORED CONTENT</span>
        <h2>Stage Communications</h2>
        <p>Reopen any photographed stage to email the customer or create social content.</p>
      </div>
      <button onClick={load}>{loading?"Loading...":"Refresh"}</button>
    </div>

    <div className="stageCommsList">
      {stageKeys.map(key=>{
        const items=grouped[key] || [];
        const open=expanded===key;
        const message=milestoneMessage(drum,key);
        const isBrady=drum.build_client==="Brady";
        const canEmail=!isBrady && isCustomCustomerDrum(drum);
        const canSocial=!isBrady;
        const mailto=`mailto:${encodeURIComponent(drum.customer_email || "")}?subject=${encodeURIComponent(message.emailSubject)}&body=${encodeURIComponent(message.emailBody)}`;

        return <article className="stageCommsCard" key={key}>
          <button className="stageCommsSummary" onClick={()=>setExpanded(open?"":key)}>
            <span>
              <b>{stageLabel(key)}</b>
              <small>{items.length} stored photo{items.length===1?"":"s"}</small>
            </span>
            <span>{open?"Hide":"Open"}</span>
          </button>

          {open && <div className="stageCommsBody">
            <div className="stageCommsThumbs">
              {items.map(photo=><a href={photo.public_url} target="_blank" rel="noreferrer" key={photo.id}>
                <img src={photo.public_url} alt={stageLabel(key)}/>
              </a>)}
            </div>

            <div className="stageCommsActions">
              <button onClick={()=>downloadPhotos(items,stageLabel(key))}>Download Photos</button>
              <button onClick={()=>onAddPhoto?.(drum,key)}>Add More Photos</button>
              {canSocial && <button onClick={()=>copy(message.social,"Facebook post")}>Copy Facebook</button>}
              {canSocial && <button onClick={()=>copy(message.instagram,"Instagram caption")}>Copy Instagram</button>}
              {canEmail && <a className={"buttonLike "+(!drum.customer_email?"disabledLink":"")} href={drum.customer_email?mailto:undefined}>
                <Mail size={15}/> Open Customer Email
              </a>}
            </div>

            {isBrady && <p className="internalOnlyNotice"><b>Internal documentation only.</b> No email or social post is generated for Brady builds.</p>}
            {canEmail && !drum.customer_email && <p className="dangerText">No customer email is saved on this Job Card.</p>}
            {canEmail && <p className="calcNote">Email opens with the subject and message prefilled. Download the stored photos first, then attach them manually in Mail.</p>}

            {canSocial && <details className="stageDraftPreview">
              <summary>Preview Facebook / Instagram text</summary>
              <h4>Facebook</h4>
              <pre>{message.social}</pre>
              <h4>Instagram</h4>
              <pre>{message.instagram}</pre>
            </details>}
          </div>}
        </article>
      })}
    </div>
  </section>
}


function MilestonePhotoModal({drum,milestoneKey,onClose,setMessage}){
  const cameraInputRef=useRef(null);
  const libraryInputRef=useRef(null);
  const baseMilestone=photoMilestones[milestoneKey] || photoMilestones.blank;
  const milestone={
    ...baseMilestone,
    label:milestoneKey==="shellcomplete"
      ? drum.build_client==="Brady"
        ? "Brady Shell Complete"
        : drum.build_client==="Nowak"
          ? (isCustomCustomerDrum(drum) ? "Nowak Custom Drum Complete" : "Nowak Drum Complete")
          : "Shell Complete"
      : baseMilestone.label,
  };
  const message=milestoneMessage({...drum},milestoneKey);
  const [files,setFiles]=useState([]);
  const [socialText,setSocialText]=useState(message.social);
  const [emailSubject,setEmailSubject]=useState(message.emailSubject);
  const [emailBody,setEmailBody]=useState(message.emailBody);
  const [customerEmail,setCustomerEmail]=useState(drum.customer_email || "");
  const [status,setStatus]=useState("");
  const [uploaded,setUploaded]=useState([]);

  async function uploadPhotos(){
    if(!drum?.id){
      setStatus("Photo upload failed: this drum does not have a valid database ID.");
      return;
    }
    if(!files.length){
      setStatus("Choose or take at least one photo first.");
      return;
    }

    setStatus("Uploading photos...");
    const saved=[];

    try{
      for(let index=0; index<files.length; index+=1){
        const file=files[index];
        const safeName=String(file.name || `photo-${index+1}.jpg`).replace(/[^a-zA-Z0-9._-]/g,"-");
        const uniqueId=(globalThis.crypto?.randomUUID?.() || `${Date.now()}-${index}-${Math.random().toString(36).slice(2)}`);
        const path=`${drum.id}/${milestoneKey}/${uniqueId}-${safeName}`;

        const {error:uploadError}=await supabase.storage
          .from("drum-photos")
          .upload(path,file,{
            upsert:false,
            cacheControl:"3600",
            contentType:file.type || "image/jpeg"
          });

        if(uploadError) throw new Error("Storage upload: " + uploadError.message);

        const {data:publicData}=supabase.storage.from("drum-photos").getPublicUrl(path);
        const publicUrl=publicData?.publicUrl || "";

        const {error:rowError}=await supabase
          .from("drum_photos")
          .insert({
            drum_id:drum.id,
            milestone:milestoneKey,
            storage_path:path,
            public_url:publicUrl,
            caption:socialText,
          });

        if(rowError) throw new Error("Photo record: " + rowError.message);

        saved.push({
          id:uniqueId,
          drum_id:drum.id,
          milestone:milestoneKey,
          storage_path:path,
          public_url:publicUrl,
          caption:socialText,
        });
      }

      setUploaded(saved);
      setFiles([]);
      setStatus(`${saved.length} photo${saved.length===1?"":"s"} uploaded and stored successfully.`);
      setMessage?.("");
    }catch(error){
      const detail="Photo upload failed: " + (error?.message || String(error));
      setStatus(detail);
      setMessage?.(detail);
    }
  }

  function copy(text,label){
    navigator.clipboard?.writeText(text);
    setStatus(label + " copied.");
  }

  const mailto=`mailto:${encodeURIComponent(customerEmail || "")}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  return <div className="modalBg milestonePhotoBg" onClick={onClose}>
    <div className="modal milestonePhotoModal" onClick={e=>e.stopPropagation()}>
      <button className="close" onClick={onClose}>×</button>
      <h2>{milestone.label}</h2>
      <p>{milestone.prompt}</p>

      <div className="photoChoiceButtons">
        <button className="primary" type="button" onClick={()=>cameraInputRef.current?.click()}><Camera size={16}/> Take Photo</button>
        <button type="button" onClick={()=>libraryInputRef.current?.click()}><Plus size={16}/> Choose Existing Photos</button>
      </div>
      <input className="hiddenFileInput" ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={e=>setFiles(Array.from(e.target.files || []))}/>
      <input className="hiddenFileInput" ref={libraryInputRef} type="file" accept="image/*" multiple onChange={e=>setFiles(Array.from(e.target.files || []))}/>
      {files.length>0 && <p className="okText">{files.length} photo{files.length===1?"":"s"} selected and ready to upload.</p>}

      <button type="button" className="primary uploadPhotosButton" disabled={status==="Uploading photos..."} onClick={uploadPhotos}><Camera size={16}/> {status==="Uploading photos..." ? "Uploading..." : "Upload and Store Photos"}</button>
      {status && <p className={(status.toLowerCase().includes("failed") || status.toLowerCase().includes("error")) ? "dangerText" : "okText"}>{status}</p>}

      {drum.build_client!=="Brady" && <>
        <h3>Prepopulated social message</h3>
        <textarea value={socialText} onChange={e=>setSocialText(e.target.value)}/>
        <button onClick={()=>copy(socialText,"Social message")}>Copy social message</button>
      </>}

      {drum.build_client!=="Brady" && isCustomCustomerDrum(drum) && <>
        <h3>Customer update email</h3>
        {!customerEmail && <p className="dangerText">No customer email is saved yet. Enter it below before opening the email.</p>}
        <label>Customer email address</label>
        <input value={customerEmail} onChange={e=>setCustomerEmail(e.target.value)} onBlur={async e=>{
          const email=e.target.value.trim();
          if(email){
            const {error}=await supabase.from("drums").update({customer_email:email}).eq("id",drum.id);
            if(error) setStatus("Could not save customer email: "+error.message);
            else setStatus("Customer email saved.");
          }
        }}/>
        <label>Subject</label>
        <input value={emailSubject} onChange={e=>setEmailSubject(e.target.value)}/>
        <label>Email message</label>
        <textarea value={emailBody} onChange={e=>setEmailBody(e.target.value)}/>
        <section className="buttonRow">
          <a className={"buttonLike primary "+(!customerEmail?"disabledLink":"")} href={customerEmail?mailto:undefined}><Mail size={16}/> Open Customer Email</a>
          <button onClick={()=>copy(`Subject: ${emailSubject}

${emailBody}`,"Customer email")}>Copy Email</button>
        </section>
      </>}

      {uploaded.length>0 && <section className="uploadedPhotoList">
        <h3>Stored photos</h3>
        {uploaded.map(photo=><a key={photo.id} href={photo.public_url} target="_blank" rel="noreferrer">Open photo</a>)}
      </section>}
    </div>
  </div>
}


function JobCard({drum, template, labourRate, onClose, updateDrum, completeDrum, addTime, markSold, markShipped, setDrumLifecycle, copyText, deleteDrum, drums=[], projects=[], createProject, setMessage, onAddDrumToProject}){
  const [localBuildType,setLocalBuildType]=useState(drum.build_type || "Stave");
  const [localOwnership,setLocalOwnership]=useState(drum.build_client || "Unallocated");
  const [localCbNumber,setLocalCbNumber]=useState(drum.cb_number || "");
  const [localBuildSpec,setLocalBuildSpec]=useState(drum.construction_note || defaultBuildSpecification(drum.drum_type || "Snare"));
  const [checked,setChecked]=useState(parseChecked(drum.notes));
  const [timeAmount,setTimeAmount]=useState(0.5);
  const [timeLabel,setTimeLabel]=useState("Workshop time");
  const [customPrice,setCustomPrice]=useState(drum.custom_price||drum.retail_price||0);
  const [shipping,setShipping]=useState(drum.shipping_cost||0);
  const [veneer,setVeneer]=useState([drum.veneer_1_thickness,drum.veneer_2_thickness,drum.veneer_3_thickness,drum.veneer_4_thickness,drum.veneer_5_thickness].map(x=>x||1.2));
  const [draft,setDraft]=useState({
    serial:drum.serial||"",
    timber:drum.timber||"",
    customer:drum.customer||"",
    customer_email:drum.customer_email||"",
    shipping_address:drum.shipping_address||"",
    due_date:drum.due_date||"",
    finish:drum.finish||"To Be Decided",
    next_step:drum.next_step||"",
    notes:drum.notes||"",
    project_id:drum.project_id||"",
    nowak_serial:drum.nowak_serial||"",
    outstanding_work:outstandingWorkOptions.includes(outstandingWorkFromNotes(drum.notes))
      ? (outstandingWorkFromNotes(drum.notes) || "No outstanding work")
      : (outstandingWorkFromNotes(drum.notes) ? "Other" : "No outstanding work"),
    outstanding_work_custom:outstandingWorkOptions.includes(outstandingWorkFromNotes(drum.notes))
      ? ""
      : outstandingWorkFromNotes(drum.notes),
    order_type:drum.sales_status==="Custom Order" ? "Custom" : "Stock",
  });
  const [savedMessage,setSavedMessage]=useState("");
  const [isSaving,setIsSaving]=useState(false);
  const [projectMessage,setProjectMessage]=useState("");
  const [photoPrompt,setPhotoPrompt]=useState(null);
  const flow=workflowState(localBuildType,checked,draft.finish);
  const totalCost=templateCost(template,labourRate);
  const totalPrice=Number(customPrice||0)+Number(shipping||0);
  const profit=Number(drum.total_price||drum.retail_price||0)-totalCost;

  function changeVeneer(index,value){
    const next=[...veneer];
    next[index]=value;
    setVeneer(next);
  }

  async function saveVeneer(index,value){
    await updateDrum(drum.id,{[`veneer_${index+1}_thickness`]:Number(value || 0)});
  }

  async function assignProject(value){
    if(value==="__create__"){
      const name=window.prompt("New kit / project name");
      if(!name) return;
      const created=await createProject(name);
      if(!created) return;
      value=created.id;
    }

    setDraft(current=>({...current,project_id:value}));
    setProjectMessage("Saving project link...");

    const {error}=await supabase.from("drums").update({project_id:value || null}).eq("id",drum.id);
    if(error){
      const detail="Could not link project: " + error.message;
      setProjectMessage(detail);
      return;
    }

    const label=value ? (projects.find(p=>p.id===value)?.name || "project") : "No kit / project";
    setProjectMessage(value ? "Linked to " + label : "Removed from kit/project");
    setTimeout(()=>setProjectMessage(""),2500);
  }

  async function saveAllChanges(){
    if(isSaving) return false;
    setIsSaving(true);
    const nextFlow=workflowState(localBuildType,checked,draft.finish);
    setSavedMessage("Saving...");

    const {data:currentStatusRow,error:statusError}=await supabase
      .from("drums")
      .select("sales_status,lifecycle_status")
      .eq("id",drum.id)
      .single();

    if(statusError){
      const detail="Save failed: "+statusError.message;
      setSavedMessage(detail);
      setMessage(detail);
      setIsSaving(false);
      return false;
    }

    const currentSalesStatus=currentStatusRow?.sales_status || drum.sales_status;
    const currentLifecycleStatus=currentStatusRow?.lifecycle_status || drum.lifecycle_status || "";

    const derivedLifecycle=checked.has("Shipped")
      ? "Shipped"
      : currentLifecycleStatus==="Sold"
        ? "Sold"
        : checked.has("Assembled")
          ? "Completed"
          : (currentLifecycleStatus || null);

    const patch={
      serial:draft.serial,
      timber:draft.timber,
      customer:draft.customer,
      customer_email:draft.customer_email,
      shipping_address:draft.shipping_address,
      due_date:draft.due_date || null,
      finish:draft.finish,
      project_id:draft.project_id || null,
      nowak_serial:draft.nowak_serial || null,
      build_type:localBuildType,
      build_client:localOwnership,
      lifecycle_status:derivedLifecycle,
      sales_status:(currentSalesStatus==="Sold" || currentSalesStatus==="Shipped" || currentSalesStatus==="Sold/Shipped")
        ? currentSalesStatus
        : localOwnership==="Brady"
          ? "Brady Production"
          : localOwnership==="Unallocated"
            ? "Unallocated"
            : (draft.order_type==="Custom" ? "Custom Order" : "Stock"),
      cb_number:localOwnership==="Brady" ? localCbNumber : "",
      construction_note:localBuildSpec,
      custom_price:Number(customPrice||0),
      shipping_cost:Number(shipping||0),
      total_price:Number(customPrice||0)+Number(shipping||0),
      production_status:["Completed","Sold","Shipped"].includes(derivedLifecycle)
        ? "Manufacturing Complete"
        : nextFlow.status,
      next_step:derivedLifecycle==="Shipped"
        ? "Complete"
        : derivedLifecycle==="Sold"
          ? "Prepare for shipping"
          : derivedLifecycle==="Completed"
            ? "Marketing / launch optional"
            : nextFlow.nextStep,
      notes:setChecklistInNotes(
        setOutstandingWorkInNotes(
          draft.notes,
          draft.outstanding_work==="Other" ? draft.outstanding_work_custom : draft.outstanding_work
        ),
        checked
      ),
      veneer_1_thickness:Number(veneer[0]||0),
      veneer_2_thickness:Number(veneer[1]||0),
      veneer_3_thickness:Number(veneer[2]||0),
      veneer_4_thickness:Number(veneer[3]||0),
      veneer_5_thickness:Number(veneer[4]||0),
    };

    // Use the shared update helper so the database, Production list and
    // currently open Job Card all receive the same updated values.
    const saved=await updateDrum(drum.id,patch);

    if(!saved){
      const detail="Save failed. Check the message at the top of the app for details.";
      setSavedMessage(detail);
      setIsSaving(false);
      return false;
    }

    setDraft(current=>({...current,notes:patch.notes}));
    setChecked(parseChecked(patch.notes));
    setSavedMessage(derivedLifecycle==="Shipped" ? "Saved — moved to Shipped" : "All changes saved");
    setTimeout(()=>setSavedMessage(""),3000);
    setIsSaving(false);
    return true;
  }

  async function saveAndClose(){
    const saved=await saveAllChanges();
    if(saved) onClose();
  }

  async function markManufacturingComplete(){
    const steps=applicableChecklist(localBuildType,draft.finish);
    const assembledIndex=steps.indexOf("Assembled");
    if(assembledIndex<0) return;

    const nextChecked=new Set(checked);
    steps.slice(0,assembledIndex+1).forEach(item=>nextChecked.add(item));

    setSavedMessage("Marking drum complete...");
    const completedNotes=setChecklistInNotes(
      setOutstandingWorkInNotes(draft.notes,"No outstanding work"),
      nextChecked
    );
    const history=Array.isArray(drum.stage_history) ? [...drum.stage_history] : [];
    const now=new Date().toISOString();

    steps.slice(0,assembledIndex+1).forEach(item=>{
      if(!history.some(entry=>entry.item===item && entry.completed)){
        history.push({item,completed:true,completed_at:now});
      }
    });

    const saved=await setDrumLifecycle(drum,"Completed",{
      notes:completedNotes,
      stage_history:history
    });

    if(!saved){
      setSavedMessage("Could not mark drum complete.");
      return;
    }

    setChecked(nextChecked);
    setDraft(current=>({...current,notes:completedNotes}));
    setSavedMessage("Saved — drum marked Complete");
    setTimeout(()=>setSavedMessage(""),3000);
  }

  async function saveWorkflow(nextChecked, changedItem=null, completed=null){
    const nextFlow=workflowState(localBuildType,nextChecked,draft.finish);
    let history=Array.isArray(drum.stage_history) ? [...drum.stage_history] : [];

    if(changedItem){
      history=history.filter(entry=>entry.item!==changedItem);
      if(completed){
        history.push({item:changedItem,completed:true,completed_at:new Date().toISOString()});
      }
    }

    const workflowNotes=changedItem==="Assembled" && completed
      ? setOutstandingWorkInNotes(draft.notes,"No outstanding work")
      : draft.notes;
    const notesValue=setChecklistInNotes(workflowNotes,nextChecked);
    const storedLifecycle=drumLifecycleStatus(drum);
    const lifecycle=storedLifecycle==="Shipped"
      ? "Shipped"
      : storedLifecycle==="Sold"
        ? "Sold"
        : nextChecked.has("Assembled")
          ? "Completed"
          : null;

    setSavedMessage("Saving checklist...");

    const workflowPatch={
      notes:notesValue,
      lifecycle_status:lifecycle,
      production_status:["Completed","Sold","Shipped"].includes(lifecycle)
        ? "Manufacturing Complete"
        : nextFlow.status,
      next_step:lifecycle==="Shipped"
        ? "Complete"
        : lifecycle==="Sold"
          ? "Prepare for shipping"
          : lifecycle==="Completed"
            ? "Marketing / launch optional"
            : nextFlow.nextStep,
      stage_history:history
    };

    // Use the shared update helper so the database, Production view,
    // Dashboard counts and open Job Card all update immediately.
    const saved=await updateDrum(drum.id,workflowPatch);

    if(!saved){
      const detail="Workflow save failed. Check the message at the top of the app for details.";
      setSavedMessage(detail);
      return false;
    }

    setDraft(current=>({...current,notes:notesValue}));
    setChecked(parseChecked(notesValue));
    setMessage("");
    setSavedMessage(lifecycle==="Shipped" ? "Saved — moved to Shipped" : "Checklist saved");
    setTimeout(()=>setSavedMessage(""),2500);
    return true;
  }

  async function saveChecklist(){
    await saveWorkflow(checked);
  }

  async function toggle(item){
    const next=new Set(checked);
    const isCompleting=!next.has(item);
    if(isCompleting) next.add(item); else next.delete(item);
    setChecked(next);
    await saveWorkflow(next,item,isCompleting);

    if(isCompleting){
      const milestoneKey=photoMilestoneForCompletion({
        ...drum,
        ...draft,
        build_client:localOwnership,
        build_type:localBuildType,
        sales_status:localOwnership==="Nowak"
          ? (draft.order_type==="Custom" ? "Custom Order" : "Stock")
          : localOwnership==="Brady"
            ? "Brady Production"
            : "Unallocated"
      },item);
      if(milestoneKey){
        setPhotoPrompt({milestoneKey,item});
      }
    }
  }

  async function progressToNextStage(){
    const nextItem=flow.steps[flow.completedCount];
    if(!nextItem) return;
    await toggle(nextItem);
  }

  return <div className="modalBg" onClick={onClose}><div className={"modal jobModal "+(drum.build_client==="Brady"?"bradyModal":"")} onClick={e=>e.stopPropagation()}>
    <button className="close" onClick={onClose}>×</button>
    <div className="jobHeader"><div><h2>Job Card — #{drum.serial} {drum.timber}</h2>{allocatedCustomerName(drum) && <div className="jobCustomerName">For: {allocatedCustomerName(drum)}</div>}<p>{drum.size} · {drum.drum_type||"Snare"} · {drum.build_type} · {drum.finish}</p>{drum.build_client==="Brady" && <span className="cbBadge">Brady / CB {drum.cb_number || "No CB number"}</span>}</div><div className="statusPill">{flow.status}</div></div>
    <section className="fixedBuildType">
      <span>Construction</span>
      <b>{localBuildType}</b>
      <small>Construction type is locked after the drum is created.</small>
    </section>
    <div className="progress large"><i style={{width:flow.percent+"%"}}></i></div>
    <section className="stats workflowStats">
      <div><b>{flow.percent}%</b><span>Complete</span></div>
      <div><b>{flow.estimatedCompleted.toFixed(2)}</b><span>Estimated hours completed</span></div>
      <div><b>{flow.estimatedRemaining.toFixed(2)}</b><span>Estimated production hours remaining</span></div>
      <div><b>{Number(drum.hours_logged||0).toFixed(2)}</b><span>Actual hours logged</span></div>
    </section>

    <section className="jobGrid">
      <div className="panel inner"><h2>Build / Customer Details</h2>
        <label>Production number</label><input value={draft.serial} onChange={e=>setDraft({...draft,serial:e.target.value})}/>
        <label>Kit / Project</label>
        <select value={draft.project_id} onChange={e=>assignProject(e.target.value)}>
          <option value="">No kit / project</option>
          {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
          <option value="__create__">+ Create New Kit / Project</option>
        </select>
        {projectMessage && <small className="projectMessage">{projectMessage}</small>}
        <label>Ownership</label>
        <select value={localOwnership} onChange={e=>{
          const ownership=e.target.value;
          const suggestedCb = ownership==="Brady" ? (localCbNumber || nextCbNumber(drums)) : "";
          setLocalOwnership(ownership);
          setLocalCbNumber(suggestedCb);
          updateDrum(drum.id,{
            build_client:ownership,
            cb_number:suggestedCb,
            sales_status:ownership==="Brady" ? "Brady Production" : ownership==="Unallocated" ? "Unallocated" : ((drum.sales_status==="Brady Production" || drum.sales_status==="Unallocated") ? "Stock" : drum.sales_status)
          });
        }}>
          <option>Unallocated</option><option>Nowak</option><option>Brady</option>
        </select>
        {localOwnership==="Brady" && <>
          <label>CB Number</label>
          <input autoFocus value={localCbNumber} onChange={e=>setLocalCbNumber(e.target.value)} onBlur={e=>updateDrum(drum.id,{cb_number:e.target.value})}/>
        </>}
        {localOwnership==="Nowak" && <>
          <label>Order type</label>
          <select value={draft.order_type} onChange={e=>{
            const orderType=e.target.value;
            setDraft(current=>({...current,order_type:orderType}));
            updateDrum(drum.id,{sales_status:orderType==="Custom" ? "Custom Order" : "Stock"});
          }}>
            <option value="Stock">Stock drum</option>
            <option value="Custom">Custom order</option>
          </select>
        </>}
        <label>Customer name</label><input value={draft.customer} onChange={e=>setDraft({...draft,customer:e.target.value})}/>
        <label>Customer email</label><input value={draft.customer_email} onChange={e=>setDraft({...draft,customer_email:e.target.value})}/>
        <label>Shipping address</label><textarea value={draft.shipping_address} onChange={e=>setDraft({...draft,shipping_address:e.target.value})}/>
        <label>Due date</label><input type="date" value={draft.due_date} onChange={e=>setDraft({...draft,due_date:e.target.value})}/>
        <label>Drum price</label><input value={customPrice} onChange={e=>setCustomPrice(e.target.value)} onBlur={e=>updateDrum(drum.id,{custom_price:Number(e.target.value)})}/>
        <label>Shipping cost</label><input value={shipping} onChange={e=>setShipping(e.target.value)} onBlur={e=>updateDrum(drum.id,{shipping_cost:Number(e.target.value)})}/>
        <p><b>Total custom price: {money(totalPrice)}</b></p>
      </div>

      <div className="panel inner"><h2>Build Details</h2>
        <label>Size</label><SizeEditor drum={{...drum,timber:draft.timber}} updateDrum={updateDrum}/>
        <label>Timber type</label>
        <select value={draft.timber} onChange={e=>setDraft({...draft,timber:e.target.value})}>
          {!timberOptions.includes(draft.timber) && draft.timber && <option value={draft.timber}>{draft.timber}</option>}
          {timberOptions.map(t=><option key={t} value={t}>{t}</option>)}
        </select>
        <label>Drum type</label><select defaultValue={drum.drum_type||"Snare"} onChange={e=>{
          const newType=e.target.value;
          const previousDefault=defaultBuildSpecification(drum.drum_type||"Snare");
          const nextSpec=(!localBuildSpec || localBuildSpec===previousDefault) ? defaultBuildSpecification(newType) : localBuildSpec;
          setLocalBuildSpec(nextSpec);
          updateDrum(drum.id,{drum_type:newType, construction_note:nextSpec});
        }}>{drumTypeOptions.map(t=><option key={t}>{t}</option>)}</select>
        <label>Finish</label><select value={draft.finish} onChange={e=>setDraft({...draft,finish:e.target.value})}><option>To Be Decided</option><option>Natural</option><option>Satin</option><option>High Gloss</option></select>
        <label>Production status</label><input value={flow.status} readOnly/>
        <label>Next step</label><input value={flow.nextStep} readOnly/>
        <label>Timber story</label><textarea defaultValue={drum.timber_story||""} onBlur={e=>updateDrum(drum.id,{timber_story:e.target.value})}/>
        <label>Build Specification</label><textarea value={localBuildSpec} onChange={e=>setLocalBuildSpec(e.target.value)} onBlur={e=>updateDrum(drum.id,{construction_note:e.target.value})}/>
      </div>

      <div className="panel inner"><h2>Time Log</h2>
        <label>Estimated time to current stage</label><input value={flow.estimatedCompleted.toFixed(2)+" hr"} readOnly/>
        <label>Estimated remaining time</label><input value={flow.estimatedRemaining.toFixed(2)+" hr"} readOnly/>
        <label>Actual time logged</label><input value={Number(drum.hours_logged||0).toFixed(2)+" hr"} readOnly/>
        <small>Actual time remains 0.00 until workshop time is added below.</small>
        <label>Activity</label><input value={timeLabel} onChange={e=>setTimeLabel(e.target.value)}/>
        <label>Hours</label><input value={timeAmount} onChange={e=>setTimeAmount(e.target.value)}/>
        <button className="primary" onClick={()=>addTime(drum, timeAmount, timeLabel)}><Clock size={16}/> Add actual time</button>
      </div>
    </section>

    {localBuildType==="Stave" && <section className="panel inner"><h2>Stave Cutting Calculator</h2><StaveSpecPanel diameter={splitSize(drum.size).diameter} drumType={drum.drum_type||"Snare"} buildType="Stave" serial={drum.serial} timber={draft.timber} size={drum.size}/></section>}
    {localBuildType==="Ply" && <section className="panel inner"><StaveSpecPanel diameter={splitSize(drum.size).diameter} drumType={drum.drum_type||"Snare"} buildType="Ply" serial={drum.serial} timber={draft.timber} size={drum.size}/><h2>Ply Veneer Calculator</h2><p className="calcNote">{sizeAdjustmentLabel(drum.size)}. Layer 1 is fixed as the largest outer layer; thickness changes affect the inner layers only.</p><div className="veneerGrid">{veneer.map((v,i)=><label key={i}>Layer {i+1} thickness<input value={v} onChange={e=>changeVeneer(i,e.target.value)} onBlur={e=>saveVeneer(i,e.target.value)}/></label>)}</div><VeneerResult lengths={adjustedLengths(veneer, drum.size)}/></section>}

    <section className="panel inner"><h2>Manufacturing Checklist</h2>
      {String(draft.finish||"").toLowerCase().includes("natural") && <p className="naturalFinishNote">
        Natural finish workflow: 3 × Danish oil coats. Sealer and polyurethane coats are not required.
      </p>}
      {String(draft.finish||"").toLowerCase().includes("satin") && <p className="satinFinishNote">
        Satin finish workflow: Sealer coat, Poly coats 1–3, then the final Satin coat.
      </p>}
      <p>Use Progress to Next Stage for the normal workflow, or tick a specific stage manually. Save Changes saves the other Job Card details.</p>
      {flow.nextStep!=="Complete" && <button className="primary progressStageButton" onClick={progressToNextStage}>
        <CheckCircle2 size={16}/> Progress to Next Stage: {flow.nextStep}
      </button>}
      {flow.nextStep==="Complete" && <p className="okText"><b>Manufacturing workflow complete.</b></p>}
      <div className="checkGrid">{manufacturingChecklist(localBuildType,draft.finish).map(item=>{
        const history=historyForItem(drum.stage_history,item);
        return <label className="checkItem workflowCheckItem" key={item}>
          <input type="checkbox" checked={checked.has(item)} onChange={()=>toggle(item)}/>
          <span><b>{checklistDisplayLabel(item,localBuildType)}</b>{checked.has(item) && <small>{formatStageDate(history?.completed_at) || "Completed"}</small>}</span>
        </label>
      })}</div>
    </section>

    <section className={"panel inner outstandingWorkPanel "+(
      (draft.outstanding_work!=="No outstanding work" && (draft.outstanding_work!=="Other" || draft.outstanding_work_custom))
        ? "hasOutstandingWork"
        : ""
    )}>
      <div className="outstandingWorkHeader">
        <div>
          <span className="launchPackEyebrow">FINAL TASKS</span>
          <h2>Outstanding Work</h2>
        </div>
        {(draft.outstanding_work!=="No outstanding work" && (draft.outstanding_work!=="Other" || draft.outstanding_work_custom)) &&
          <span className="outstandingWorkBadge">ACTION REQUIRED</span>}
      </div>
      <p>A drum can remain in the Complete folder while this final task stays visible.</p>

      <label>Outstanding work</label>
      <select value={draft.outstanding_work} onChange={e=>setDraft({...draft,outstanding_work:e.target.value})}>
        {outstandingWorkOptions.map(item=><option key={item} value={item}>{item}</option>)}
      </select>

      {draft.outstanding_work==="Other" && <>
        <label>Describe the outstanding work</label>
        <input
          value={draft.outstanding_work_custom}
          onChange={e=>setDraft({...draft,outstanding_work_custom:e.target.value})}
          placeholder="Enter the final task required"
        />
      </>}

      {(draft.outstanding_work!=="No outstanding work" && (draft.outstanding_work!=="Other" || draft.outstanding_work_custom)) &&
        <div className="outstandingWorkPreview">
          <b>Complete — final work required</b>
          <span>{draft.outstanding_work==="Other" ? draft.outstanding_work_custom : draft.outstanding_work}</span>
        </div>}
    </section>

    <section className="panel inner workflowSection fulfilmentSection">
      <div className="workflowSectionHeader">
        <div><span className="launchPackEyebrow">AFTER THE BUILD</span><h2>Fulfilment</h2></div>
        <small>Photos, packing, sale and shipping</small>
      </div>
      <div className="checkGrid">{fulfilmentChecklist.map(item=>{
        const history=historyForItem(drum.stage_history,item);
        return <label className="checkItem workflowCheckItem" key={item}>
          <input type="checkbox" checked={checked.has(item)} onChange={()=>toggle(item)}/>
          <span><b>{item}</b>{checked.has(item) && <small>{formatStageDate(history?.completed_at) || "Completed"}</small>}</span>
        </label>
      })}</div>

      <div className="fulfilmentLifecycle">
        <h3>Drum Status</h3>
        <p>Update the business status here as the drum moves from complete to sold and shipped.</p>

        <div className="completionStatusButtons">
          <button
            className={!isManufacturingComplete({...drum,notes:setChecklistInNotes(draft.notes,checked)}) ? "primary" : ""}
            onClick={markManufacturingComplete}
          >
            <CheckCircle2 size={16}/> Complete
          </button>

          <button
            className={isSoldStatus(drum) ? "primary" : ""}
            onClick={()=>markSold(drum)}
          >
            <DollarSign size={16}/> Sold
          </button>

          <button
            className={isShippedStatus(drum) ? "primary" : ""}
            onClick={()=>markShipped(drum)}
          >
            <Truck size={16}/> Shipped
          </button>
        </div>

        {isShippedStatus(drum)
          ? <p className="okText">This drum is complete, sold and shipped.</p>
          : isSoldStatus(drum)
            ? <p className="okText">This drum is sold and awaiting shipment.</p>
            : isManufacturingComplete({...drum,notes:setChecklistInNotes(draft.notes,checked)})
              ? <p className="okText">Manufacturing is complete. The drum is ready for sale or shipment.</p>
              : null}
      </div>
    </section>

    <section className="panel inner workflowSection optionalMarketingSection">
      <div className="workflowSectionHeader">
        <div><span className="launchPackEyebrow">OPTIONAL</span><h2>Marketing Checklist</h2></div>
        <small>Never affects production completion</small>
      </div>
      <div className="checkGrid">{marketingChecklist.map(item=>{
        const history=historyForItem(drum.stage_history,item);
        return <label className="checkItem workflowCheckItem" key={item}>
          <input type="checkbox" checked={checked.has(item)} onChange={()=>toggle(item)}/>
          <span><b>{item}</b>{checked.has(item) && <small>{formatStageDate(history?.completed_at) || "Completed"}</small>}</span>
        </label>
      })}</div>
    </section>

    {localOwnership==="Nowak" && <LaunchPackSection drum={{
      ...drum,
      ...draft,
      build_client:localOwnership,
      build_type:localBuildType,
      sales_status:draft.order_type==="Custom" ? "Custom Order" : "Stock"
    }} setMessage={setMessage}/>}

    <section className="panel inner anytimePhotoPanel">
      <h2>Photos at Any Stage</h2>
      <p>Take or upload an additional build photo at any time. It will be stored against this Job Card.</p>
      <button type="button" className="primary" onClick={()=>setPhotoPrompt({milestoneKey:"general",item:null})}><Camera size={16}/> Take or Upload a Photo</button>
    </section>
    <StageCommunications
      drum={{
        ...drum,
        ...draft,
        build_client:localOwnership,
        build_type:localBuildType,
        sales_status:localOwnership==="Nowak"
          ? (draft.order_type==="Custom" ? "Custom Order" : "Stock")
          : localOwnership==="Brady"
            ? "Brady Production"
            : "Unallocated"
      }}
      setMessage={setMessage}
      onAddPhoto={(stageDrum,milestoneKey)=>setPhotoPrompt({drum:stageDrum,milestoneKey})}
    />
    <section className="panel inner"><h2>Notes</h2><textarea value={draft.notes} onChange={e=>setDraft({...draft,notes:e.target.value})}/></section>

    {localOwnership==="Nowak" && <section className={"panel inner nowakSerialPanel "+(flow.percent===100?"serialReady":"serialPending")}>
      <div className="serialPanelHeader">
        <div>
          <span className="launchPackEyebrow">DRUM IDENTITY</span>
          <h2>Nowak Drum Serial Number</h2>
        </div>
        <span className="serialStatusBadge">{flow.percent===100 ? "Ready to assign" : "Assign when complete"}</span>
      </div>
      <p>{flow.percent===100
        ? "This drum is complete. Enter the final Nowak serial number."
        : "The field is available now, but normally the final serial number is entered when the drum is completed."}</p>
      <label>Nowak serial number</label>
      <input
        value={draft.nowak_serial}
        onChange={e=>setDraft({...draft,nowak_serial:e.target.value})}
        placeholder="Enter final Nowak serial number"
      />
      <small>Use the main Save Changes button to store the serial number.</small>
    </section>}

    {photoPrompt && <MilestonePhotoModal
      drum={{
        ...drum,
        ...draft,
        build_client:localOwnership,
        build_type:localBuildType,
        sales_status:localOwnership==="Nowak"
          ? (draft.order_type==="Custom" ? "Custom Order" : "Stock")
          : localOwnership==="Brady"
            ? "Brady Production"
            : "Unallocated"
      }}
      milestoneKey={photoPrompt.milestoneKey}
      onClose={()=>setPhotoPrompt(null)}
      setMessage={setMessage}
    />}

    <section className="jobSaveFooter compactJobFooter">
      <div className="jobFooterButtons">
        <button className="saveChangesButton" disabled={isSaving} onClick={saveAllChanges}><Save size={15}/> {isSaving ? "Saving..." : "Save"}</button>
        <button className="primary saveCloseButton" disabled={isSaving} onClick={saveAndClose}><Save size={15}/> Save & Close</button>
        <button className="closeJobButton" disabled={isSaving} onClick={onClose}>Close</button>
      </div>
      {savedMessage && <span className={"saveMessage "+(savedMessage.includes("failed") || savedMessage.includes("Could not") ? "saveMessageError" : "saveMessageSuccess")}>{savedMessage}</span>}
    </section>
    <section className="deleteZone"><button className="dangerButton" onClick={()=>deleteDrum(drum.id)}>Delete this job card</button></section>
  </div></div>
}

function marketingText(d){ return socialPost(d, communicationMilestones[5], "facebook"); }

createRoot(document.getElementById("root")).render(<App />);

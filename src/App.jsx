
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Hammer, LayoutDashboard, RefreshCw, Plus, CheckCircle2, Package, DollarSign,
  Camera, ListChecks, Search, Clock, Truck, Save, Ruler, Users, Mail, Share2,
  Settings, Layers3, FolderPlus, BarChart3, Wrench, Phone, Trash2, CalendarDays, RotateCcw, CircleCheckBig, Archive, ArchiveRestore, ClipboardList, Repeat2, Lightbulb, Pencil, Images, Printer, Download
} from "lucide-react";
import { supabase, isConfigured } from "./supabaseClient";
import QRCode from "qrcode";
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
  "Cure complete","High Gloss preparation","Polished","Final shell preparation",
  "Prepare hardware / heads","Assembled","Photos taken","Website listing",
  "Facebook / Instagram","YouTube demo","Packed","Shipped"
];

const historicalDrumRecords = [{"source_row":2,"serial":"1","nowak_serial":"2037","completion_date":"2021-01-15","timber":"Jarrah","size":"","finish":"To Be Decided","build_type":"Stave","customer":"Stock","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 2\nOriginal material: Jarrah\nOriginal purchased/size field: Demo Stock\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2021-01-15\nPrice was not recorded in the source workbook.","original_purchased":"Demo Stock"},{"source_row":5,"serial":"2","nowak_serial":"4150","completion_date":"2021-02-21","timber":"Jarrah","size":"","finish":"To Be Decided","build_type":"Stave","customer":"Stock","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 5\nOriginal material: Jarrah\nOriginal purchased/size field: Demo Stock\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2021-02-21\nPrice was not recorded in the source workbook.","original_purchased":"Demo Stock"},{"source_row":8,"serial":"120","nowak_serial":"298800","completion_date":"2021-12-15","timber":"Jarrah","size":"","finish":"To Be Decided","build_type":"Stave","customer":"Stock","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 8\nOriginal material: Jarrah\nOriginal purchased/size field: Demo Stock\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2021-12-15\nPrice was not recorded in the source workbook.","original_purchased":"Demo Stock"},{"source_row":11,"serial":"14","nowak_serial":"29330","completion_date":"2021-03-01","timber":"Jarrah","size":"14 x 5.5","finish":"To Be Decided","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 11\nOriginal material: Jarrah\nOriginal purchased/size field: 5.5\" Chrome\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2021-03-01\nPrice was not recorded in the source workbook.","original_purchased":"5.5\" Chrome"},{"source_row":14,"serial":"17","nowak_serial":"35751","completion_date":"2021-03-06","timber":"Jarrah","size":"14 x 5.5","finish":"To Be Decided","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 14\nOriginal material: Jarrah\nOriginal purchased/size field: 5.5\" Chrome\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2021-03-06\nPrice was not recorded in the source workbook.","original_purchased":"5.5\" Chrome"},{"source_row":17,"serial":"22","nowak_serial":"48994","completion_date":"2021-07-03","timber":"Jarrah","size":"","finish":"To Be Decided","build_type":"Stave","customer":"Ali","sales_status":"Custom Order","source_note":"Historical spreadsheet import — source row 17\nOriginal material: Jarrah\nOriginal purchased/size field: Ali\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2021-07-03\nPrice was not recorded in the source workbook.","original_purchased":"Ali"},{"source_row":20,"serial":"30","nowak_serial":"62100","completion_date":"2022-02-22","timber":"American Ash","size":"","finish":"To Be Decided","build_type":"Stave","customer":"James","sales_status":"Custom Order","source_note":"Historical spreadsheet import — source row 20\nOriginal material: American Ash\nOriginal purchased/size field: James\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2022-02-22\nPrice was not recorded in the source workbook.","original_purchased":"James"},{"source_row":23,"serial":"29","nowak_serial":"60088","completion_date":"2022-03-04","timber":"Wandoo","size":"","finish":"To Be Decided","build_type":"Stave","customer":"Rob Garnett","sales_status":"Custom Order","source_note":"Historical spreadsheet import — source row 23\nOriginal material: Wandoo\nOriginal purchased/size field: Rob Garnett\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2022-03-04\nPrice was not recorded in the source workbook.","original_purchased":"Rob Garnett"},{"source_row":26,"serial":"31","nowak_serial":"68045","completion_date":"2022-05-07","timber":"Jarrah","size":"","finish":"To Be Decided","build_type":"Stave","customer":"Jacky Ladbrook","sales_status":"Custom Order","source_note":"Historical spreadsheet import — source row 26\nOriginal material: Jarrah\nOriginal purchased/size field: Jacky Ladbrook\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2022-05-07\nPrice was not recorded in the source workbook.","original_purchased":"Jacky Ladbrook"},{"source_row":29,"serial":"32","nowak_serial":"70272","completion_date":"2022-05-07","timber":"Jarrah","size":"14 x 6.5","finish":"To Be Decided","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 29\nOriginal material: Jarrah\nOriginal purchased/size field: 6.5\" Chrome\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2022-05-07\nPrice was not recorded in the source workbook.","original_purchased":"6.5\" Chrome"},{"source_row":32,"serial":"8","nowak_serial":"17552","completion_date":"2022-11-04","timber":"Jarrah","size":"","finish":"To Be Decided","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 32\nOriginal material: Jarrah\nOriginal purchased/size field: Not Selling\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2022-11-04\nPrice was not recorded in the source workbook.","original_purchased":"Not Selling"},{"source_row":35,"serial":"19","nowak_serial":"41952","completion_date":"2022-09-24","timber":"Black Butt","size":"14 x 5.5","finish":"To Be Decided","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 35\nOriginal material: Black Butt\nOriginal purchased/size field: 5.5\" Chrome\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2022-09-24\nPrice was not recorded in the source workbook.","original_purchased":"5.5\" Chrome"},{"source_row":38,"serial":"18","nowak_serial":"39780","completion_date":"2022-10-02","timber":"Wandoo","size":"14 x 5.5","finish":"To Be Decided","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 38\nOriginal material: Wandoo\nOriginal purchased/size field: 5.5\" Brass\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2022-10-02\nPrice was not recorded in the source workbook.","original_purchased":"5.5\" Brass"},{"source_row":41,"serial":"25","nowak_serial":"55525","completion_date":"2022-10-14","timber":"Marri","size":"","finish":"To Be Decided","build_type":"Stave","customer":"Brett Price","sales_status":"Custom Order","source_note":"Historical spreadsheet import — source row 41\nOriginal material: Marri\nOriginal purchased/size field: Brett Price (5.5\" Chrome)\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2022-10-14\nPrice was not recorded in the source workbook.","original_purchased":"Brett Price (5.5\" Chrome)"},{"source_row":44,"serial":"36","nowak_serial":"80460","completion_date":"2022-10-29","timber":"Wandoo","size":"14 x 5.5","finish":"To Be Decided","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 44\nOriginal material: Wandoo\nOriginal purchased/size field: 5.5\" Chrome\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2022-10-29\nPrice was not recorded in the source workbook.","original_purchased":"5.5\" Chrome"},{"source_row":47,"serial":"33","nowak_serial":"73788","completion_date":"2022-10-29","timber":"Sheoak","size":"14 x 8","finish":"To Be Decided","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 47\nOriginal material: Sheoak\nOriginal purchased/size field: 8\" Chrome\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2022-10-29\nPrice was not recorded in the source workbook.","original_purchased":"8\" Chrome"},{"source_row":50,"serial":"35","nowak_serial":"78435","completion_date":"2022-10-29","timber":"Jarrah/Blackbutt","size":"14 x 6.5","finish":"To Be Decided","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 50\nOriginal material: Jarrah/Blackbutt\nOriginal purchased/size field: 6.5\" Chrome\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2022-10-29\nPrice was not recorded in the source workbook.","original_purchased":"6.5\" Chrome"},{"source_row":53,"serial":"41","nowak_serial":"92291","completion_date":"2022-10-30","timber":"Wandoo","size":"14 x 8","finish":"To Be Decided","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 53\nOriginal material: Wandoo\nOriginal purchased/size field: 8\" Chrome\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2022-10-30\nPrice was not recorded in the source workbook.","original_purchased":"8\" Chrome"},{"source_row":56,"serial":"34","nowak_serial":"76398","completion_date":"2022-11-04","timber":"Jarrah/Sheoak","size":"14 x 6","finish":"To Be Decided","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 56\nOriginal material: Jarrah/Sheoak\nOriginal purchased/size field: 6\" Chrome\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2022-11-04\nPrice was not recorded in the source workbook.","original_purchased":"6\" Chrome"},{"source_row":59,"serial":"24","nowak_serial":"72501","completion_date":"2022-11-04","timber":"Sheoak","size":"14 x 6.5","finish":"To Be Decided","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 59\nOriginal material: Sheoak\nOriginal purchased/size field: 6.5\" Chrome\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2022-11-04\nPrice was not recorded in the source workbook.","original_purchased":"6.5\" Chrome"},{"source_row":62,"serial":"44","nowak_serial":"72501A","completion_date":"2023-03-11","timber":"Marri","size":"14 x 6.5","finish":"To Be Decided","build_type":"Stave","customer":"David Shaw","sales_status":"Custom Order","source_note":"Historical spreadsheet import — source row 62\nOriginal material: Marri\nOriginal purchased/size field: 6.5\" Chrome\nOriginal customer field: David Shaw\nOriginal spreadsheet note: \nOriginal completion date: 2023-03-11\nPrice was not recorded in the source workbook.","original_purchased":"6.5\" Chrome"},{"source_row":65,"serial":"39","nowak_serial":"88179","completion_date":"2023-03-28","timber":"Jarrah (tri Colour","size":"14 x 8","finish":"To Be Decided","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 65\nOriginal material: Jarrah (tri Colour\nOriginal purchased/size field: 8\" chrome\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2023-03-28\nPrice was not recorded in the source workbook.","original_purchased":"8\" chrome"},{"source_row":68,"serial":"46","nowak_serial":"104374","completion_date":"2023-03-29","timber":"Wandoo Black","size":"14 x 8","finish":"To Be Decided","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 68\nOriginal material: Wandoo Black\nOriginal purchased/size field: 8\"\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2023-03-29\nPrice was not recorded in the source workbook.","original_purchased":"8\""},{"source_row":71,"serial":"47","nowak_serial":"106831","completion_date":"2023-06-07","timber":"Jarrah","size":"14\" x 6 /12\" High Gloss","finish":"To Be Decided","build_type":"Stave","customer":"Greg Bero","sales_status":"Custom Order","source_note":"Historical spreadsheet import — source row 71\nOriginal material: Jarrah\nOriginal purchased/size field: 14\" x 6 /12\" High Gloss\nOriginal customer field: Greg Bero\nOriginal spreadsheet note: \nOriginal completion date: 2023-06-07\nPrice was not recorded in the source workbook.","original_purchased":"14\" x 6 /12\" High Gloss"},{"source_row":74,"serial":"55","nowak_serial":"125620","completion_date":"2023-08-02","timber":"Wandoo Black","size":"14\" x 6 /12\" Natural","finish":"To Be Decided","build_type":"Stave","customer":"Dave De Angeli","sales_status":"Custom Order","source_note":"Historical spreadsheet import — source row 74\nOriginal material: Wandoo Black\nOriginal purchased/size field: 14\" x 6 /12\" Natural\nOriginal customer field: Dave De Angeli\nOriginal spreadsheet note: \nOriginal completion date: 2023-08-02\nPrice was not recorded in the source workbook.","original_purchased":"14\" x 6 /12\" Natural"},{"source_row":77,"serial":"56","nowak_serial":"128128","completion_date":"2023-08-09","timber":"Jarrah","size":"14\" x 5 /12\" Natural","finish":"To Be Decided","build_type":"Stave","customer":"Peter","sales_status":"Custom Order","source_note":"Historical spreadsheet import — source row 77\nOriginal material: Jarrah\nOriginal purchased/size field: 14\" x 5 /12\" Natural\nOriginal customer field: Peter\nOriginal spreadsheet note: \nOriginal completion date: 2023-08-09\nPrice was not recorded in the source workbook.","original_purchased":"14\" x 5 /12\" Natural"},{"source_row":80,"serial":"49","nowak_serial":"111916","completion_date":"2023-08-14","timber":"Jarrah","size":"13\" x 6\"","finish":"To Be Decided","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 80\nOriginal material: Jarrah\nOriginal purchased/size field: 13\" x 6\"\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2023-08-14\nPrice was not recorded in the source workbook.","original_purchased":"13\" x 6\""},{"source_row":83,"serial":"48","nowak_serial":"109728","completion_date":"2023-09-06","timber":"Jarrah","size":"14\" x 6 1/2\"","finish":"To Be Decided","build_type":"Stave","customer":"Brett Chassen","sales_status":"Custom Order","source_note":"Historical spreadsheet import — source row 83\nOriginal material: Jarrah\nOriginal purchased/size field: 14\" x 6 1/2\"\nOriginal customer field: Brett Chassen\nOriginal spreadsheet note: \nOriginal completion date: 2023-09-06\nPrice was not recorded in the source workbook.","original_purchased":"14\" x 6 1/2\""},{"source_row":86,"serial":"50","nowak_serial":"114550","completion_date":"2023-09-17","timber":"Curly Marri","size":"14\" x 5 1/2\"","finish":"To Be Decided","build_type":"Stave","customer":"Glen Cahill","sales_status":"Custom Order","source_note":"Historical spreadsheet import — source row 86\nOriginal material: Curly Marri\nOriginal purchased/size field: 14\" x 5 1/2\"\nOriginal customer field: Glen Cahill\nOriginal spreadsheet note: \nOriginal completion date: 2023-09-17\nPrice was not recorded in the source workbook.","original_purchased":"14\" x 5 1/2\""},{"source_row":89,"serial":"57","nowak_serial":"131157","completion_date":"2023-11-07","timber":"Wandoo (High Gloss)","size":"14\" x 5\"","finish":"High Gloss","build_type":"Stave","customer":"Chris Goninon","sales_status":"Custom Order","source_note":"Historical spreadsheet import — source row 89\nOriginal material: Wandoo (High Gloss)\nOriginal purchased/size field: 14\" x 5\"\nOriginal customer field: Chris Goninon\nOriginal spreadsheet note: \nOriginal completion date: 2023-11-07\nPrice was not recorded in the source workbook.","original_purchased":"14\" x 5\""},{"source_row":92,"serial":"61","nowak_serial":"140788","completion_date":"2023-11-07","timber":"Marri (Natural)","size":"14\" x 7\"","finish":"Natural","build_type":"Stave","customer":"Stock","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 92\nOriginal material: Marri (Natural)\nOriginal purchased/size field: 14\" x 7\"\nOriginal customer field: stock\nOriginal spreadsheet note: wrong date entered should be 7 Nov\nOriginal completion date: 2023-11-07\nPrice was not recorded in the source workbook.","original_purchased":"14\" x 7\""},{"source_row":95,"serial":"65","nowak_serial":"150475","completion_date":"2023-11-07","timber":"York Gum Curly(Natural)","size":"13\" x 7\"","finish":"Natural","build_type":"Stave","customer":"Stock","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 95\nOriginal material: York Gum Curly(Natural)\nOriginal purchased/size field: 13\" x 7\"\nOriginal customer field: stock\nOriginal spreadsheet note: wrong date entered should be 7 Nov\nOriginal completion date: 2023-11-07\nPrice was not recorded in the source workbook.","original_purchased":"13\" x 7\""},{"source_row":98,"serial":"45","nowak_serial":"103410","completion_date":"2023-11-07","timber":"Sheoak Black/Red stain","size":"12\" x 7\"","finish":"To Be Decided","build_type":"Stave","customer":"Stock","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 98\nOriginal material: Sheoak Black/Red stain\nOriginal purchased/size field: 12\" x 7\"\nOriginal customer field: stock\nOriginal spreadsheet note: wrong date entered should be 7 Nov\nOriginal completion date: 2023-11-07\nPrice was not recorded in the source workbook.","original_purchased":"12\" x 7\""},{"source_row":101,"serial":"54","nowak_serial":"124740","completion_date":"2023-11-07","timber":"sheoak (MJ band)","size":"14\" x 6 1/2\"","finish":"To Be Decided","build_type":"Stave","customer":"Stock","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 101\nOriginal material: sheoak (MJ band)\nOriginal purchased/size field: 14\" x 6 1/2\"\nOriginal customer field: stock\nOriginal spreadsheet note: wrong date entered should be 7 Nov\nOriginal completion date: 2023-11-07\nPrice was not recorded in the source workbook.","original_purchased":"14\" x 6 1/2\""},{"source_row":104,"serial":"58","nowak_serial":"134386","completion_date":"2023-11-07","timber":"york gum (high gloss)","size":"14 x 6 1/2","finish":"High Gloss","build_type":"Stave","customer":"Stock","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 104\nOriginal material: york gum (high gloss)\nOriginal purchased/size field: 14 x 6 1/2\nOriginal customer field: stock\nOriginal spreadsheet note: wrong date entered should be 7 Nov\nOriginal completion date: 2023-11-07\nPrice was not recorded in the source workbook.","original_purchased":"14 x 6 1/2"},{"source_row":107,"serial":"68","nowak_serial":"158440","completion_date":"2023-11-07","timber":"Marri (high gloss)","size":"13 x 7","finish":"High Gloss","build_type":"Stave","customer":"Stock","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 107\nOriginal material: Marri (high gloss)\nOriginal purchased/size field: 13 x 7\nOriginal customer field: stock\nOriginal spreadsheet note: \nOriginal completion date: 2023-11-07\nPrice was not recorded in the source workbook.","original_purchased":"13 x 7"},{"source_row":110,"serial":"40","nowak_serial":"92200","completion_date":"2023-11-07","timber":"Wando (SM band)","size":"14 x 6 1/2","finish":"To Be Decided","build_type":"Stave","customer":"Stock","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 110\nOriginal material: Wando (SM band)\nOriginal purchased/size field: 14 x 61/2\nOriginal customer field: stock\nOriginal spreadsheet note: \nOriginal completion date: 2023-11-07\nPrice was not recorded in the source workbook.","original_purchased":"14 x 61/2"},{"source_row":113,"serial":"43","nowak_serial":"99373","completion_date":"2023-11-11","timber":"Marri (high gloss)","size":"14 x 5 1/2","finish":"High Gloss","build_type":"Stave","customer":"Stock","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 113\nOriginal material: Marri (high gloss)\nOriginal purchased/size field: 14 x 5 1/2\nOriginal customer field: stock\nOriginal spreadsheet note: \nOriginal completion date: 2023-11-11\nPrice was not recorded in the source workbook.","original_purchased":"14 x 5 1/2"},{"source_row":116,"serial":"60","nowak_serial":"139860","completion_date":"2023-12-04","timber":"Jarrah (high gloss)","size":"14 x 8","finish":"High Gloss","build_type":"Stave","customer":"Paul Kuzub","sales_status":"Custom Order","source_note":"Historical spreadsheet import — source row 116\nOriginal material: Jarrah (high gloss)\nOriginal purchased/size field: 14 x 8\nOriginal customer field: Paul Kuzub\nOriginal spreadsheet note: \nOriginal completion date: 2023-12-04\nPrice was not recorded in the source workbook.","original_purchased":"14 x 8"},{"source_row":119,"serial":"59","nowak_serial":"137647","completion_date":"2023-12-07","timber":"Jarrah (natural)","size":"14 x 8","finish":"Natural","build_type":"Stave","customer":"Torgeir Kinne Solsvik","sales_status":"Custom Order","source_note":"Historical spreadsheet import — source row 119\nOriginal material: Jarrah (natural)\nOriginal purchased/size field: 14 x 8\nOriginal customer field: Torgeir Kinne Solsvik\nOriginal spreadsheet note: \nOriginal completion date: 2023-12-07\nPrice was not recorded in the source workbook.","original_purchased":"14 x 8"},{"source_row":122,"serial":"70","nowak_serial":"164290","completion_date":"2024-01-13","timber":"Jarrah/Blackbutt14 x 5","size":"14 x 8","finish":"To Be Decided","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 122\nOriginal material: Jarrah/Blackbutt14 x 5\nOriginal purchased/size field: 14 x 8\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2024-01-13\nPrice was not recorded in the source workbook.","original_purchased":"14 x 8"},{"source_row":125,"serial":"69","nowak_serial":"162081","completion_date":"2024-01-13","timber":"Wandoo (natural)","size":"12 x 7","finish":"Natural","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 125\nOriginal material: Wandoo (natural)\nOriginal purchased/size field: 12 x 7\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2024-01-13\nPrice was not recorded in the source workbook.","original_purchased":"12 x 7"},{"source_row":128,"serial":"71","nowak_serial":"167205","completion_date":"2024-01-28","timber":"Jarrah (Sheoak.blackbutt band)","size":"14 x 8","finish":"To Be Decided","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 128\nOriginal material: Jarrah (Sheoak.blackbutt band)\nOriginal purchased/size field: 14 x 8\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2024-01-28\nPrice was not recorded in the source workbook.","original_purchased":"14 x 8"},{"source_row":131,"serial":"52","nowak_serial":"121628","completion_date":"2024-02-26","timber":"Curly Marri","size":"14 x 6 1/2","finish":"To Be Decided","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 131\nOriginal material: Curly Marri\nOriginal purchased/size field: 14 x 6 1/2\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2024-02-26\nPrice was not recorded in the source workbook.","original_purchased":"14 x 6 1/2"},{"source_row":134,"serial":"73","nowak_serial":"172499","completion_date":"2024-02-28","timber":"Curly Marri","size":"14 x 6 1/2","finish":"To Be Decided","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 134\nOriginal material: Curly Marri\nOriginal purchased/size field: 14 x 6 1/2\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2024-02-28\nPrice was not recorded in the source workbook.","original_purchased":"14 x 6 1/2"},{"source_row":137,"serial":"74","nowak_serial":"175158","completion_date":"2024-06-24","timber":"Jarrah (door frame)","size":"14 x 6 1/2","finish":"To Be Decided","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 137\nOriginal material: Jarrah (door frame)\nOriginal purchased/size field: 14 x 6 1/2\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2024-06-24\nPrice was not recorded in the source workbook.","original_purchased":"14 x 6 1/2"},{"source_row":140,"serial":"76","nowak_serial":"180272","completion_date":"2024-07-04","timber":"Jarrah Shell Only","size":"12 x 7","finish":"To Be Decided","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 140\nOriginal material: Jarrah Shell Only\nOriginal purchased/size field: 12 x 7\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2024-07-04\nPrice was not recorded in the source workbook.","original_purchased":"12 x 7"},{"source_row":143,"serial":"78","nowak_serial":"185406","completion_date":"2024-07-07","timber":"Jarrah Shell Only - high gloss","size":"14 x 4 & 8\"","finish":"High Gloss","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 143\nOriginal material: Jarrah Shell Only - high gloss\nOriginal purchased/size field: 14 x 4 & 8\"\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2024-07-07\nPrice was not recorded in the source workbook.","original_purchased":"14 x 4 & 8\""},{"source_row":146,"serial":"77","nowak_serial":"183183","completion_date":"2024-07-13","timber":"Marri Wandoo Stripes","size":"14 x 5 1/2","finish":"To Be Decided","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 146\nOriginal material: Marri Wandoo Stripes\nOriginal purchased/size field: 14 x 5 1/2\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2024-07-13\nPrice was not recorded in the source workbook.","original_purchased":"14 x 5 1/2"},{"source_row":149,"serial":"87","nowak_serial":"208104","completion_date":"2024-07-13","timber":"Fiddleback Jarrah","size":"14 x 6 1/2","finish":"To Be Decided","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 149\nOriginal material: Fiddleback Jarrah\nOriginal purchased/size field: 14 x 6 1/2\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2024-07-13\nPrice was not recorded in the source workbook.","original_purchased":"14 x 6 1/2"},{"source_row":152,"serial":"81","nowak_serial":"193509","completion_date":"2024-07-13","timber":"Sheaok Pearl blue high gloss","size":"14 x 5 1/2","finish":"High Gloss","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 152\nOriginal material: Sheaok Pearl blue high gloss\nOriginal purchased/size field: 14 x 5 1/2\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2024-07-13\nPrice was not recorded in the source workbook.","original_purchased":"14 x 5 1/2"},{"source_row":155,"serial":"82","nowak_serial":"196226","completion_date":"2024-07-13","timber":"Jarrah red/black stain high gloss","size":"14 x 5 1/2","finish":"High Gloss","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 155\nOriginal material: Jarrah red/black stain high gloss\nOriginal purchased/size field: 14 x 5 1/2\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2024-07-13\nPrice was not recorded in the source workbook.","original_purchased":"14 x 5 1/2"},{"source_row":158,"serial":"83","nowak_serial":"198951","completion_date":"2024-08-31","timber":"Jarrah/Blackbutt 14 x 7","size":"14 x 5 1/2","finish":"To Be Decided","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 158\nOriginal material: Jarrah/Blackbutt 14 x 7\nOriginal purchased/size field: 14 x 5 1/2\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2024-08-31\nPrice was not recorded in the source workbook.","original_purchased":"14 x 5 1/2"},{"source_row":161,"serial":"85","nowak_serial":"204170","completion_date":"2024-09-15","timber":"Jarrah","size":"14 x 6 1/2","finish":"To Be Decided","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 161\nOriginal material: Jarrah\nOriginal purchased/size field: 14 x 6 1/2\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2024-09-15\nPrice was not recorded in the source workbook.","original_purchased":"14 x 6 1/2"},{"source_row":164,"serial":"91","nowak_serial":"219401","completion_date":"2024-10-24","timber":"Jarrah, gold hardware, high gloss","size":"13 x 7","finish":"High Gloss","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 164\nOriginal material: Jarrah, gold hardware, high gloss\nOriginal purchased/size field: 13 x 7\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2024-10-24\nPrice was not recorded in the source workbook.","original_purchased":"13 x 7"},{"source_row":167,"serial":"99","nowak_serial":"239778","completion_date":"2024-11-23","timber":"Wandoo, natural","size":"14 x 6 1/2","finish":"Natural","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 167\nOriginal material: Wandoo, natural\nOriginal purchased/size field: 14 x 6 1/2\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2024-11-23\nPrice was not recorded in the source workbook.","original_purchased":"14 x 6 1/2"},{"source_row":170,"serial":"103","nowak_serial":"250187","completion_date":"2024-11-23","timber":"Marri","size":"14 x 5","finish":"To Be Decided","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 170\nOriginal material: Marri\nOriginal purchased/size field: 14 x 5\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2024-11-23\nPrice was not recorded in the source workbook.","original_purchased":"14 x 5"},{"source_row":173,"serial":"98","nowak_serial":"237846","completion_date":"2024-11-23","timber":"Jarrah (2 tone)","size":"14 x 8","finish":"To Be Decided","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 173\nOriginal material: Jarrah (2 tone)\nOriginal purchased/size field: 14 x 8\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2024-11-23\nPrice was not recorded in the source workbook.","original_purchased":"14 x 8"},{"source_row":176,"serial":"88","nowak_serial":"212960","completion_date":"2024-11-23","timber":"Sugar Gum","size":"14 x 8","finish":"To Be Decided","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 176\nOriginal material: Sugar Gum\nOriginal purchased/size field: 14 x 8\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2024-11-23\nPrice was not recorded in the source workbook.","original_purchased":"14 x 8"},{"source_row":179,"serial":"93","nowak_serial":"225804","completion_date":"2024-11-29","timber":"Jarrah, Natural","size":"14 x 6","finish":"Natural","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 179\nOriginal material: Jarrah, Natural\nOriginal purchased/size field: 14 x 6\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2024-11-29\nPrice was not recorded in the source workbook.","original_purchased":"14 x 6"},{"source_row":182,"serial":"92","nowak_serial":"223560","completion_date":"2024-12-04","timber":"Jarrah, HIgh Gloss","size":"13 x 3","finish":"High Gloss","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 182\nOriginal material: Jarrah, HIgh Gloss\nOriginal purchased/size field: 13 x 3\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2024-12-04\nPrice was not recorded in the source workbook.","original_purchased":"13 x 3"},{"source_row":185,"serial":"108","nowak_serial":"351108","completion_date":"2025-01-07","timber":"Jarrah, Natural","size":"12 x 7","finish":"Natural","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 185\nOriginal material: Jarrah, Natural\nOriginal purchased/size field: 12 x 7\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2025-01-07\nPrice was not recorded in the source workbook.","original_purchased":"12 x 7"},{"source_row":188,"serial":"107","nowak_serial":"347750","completion_date":"2025-01-07","timber":"Jarrah, Natural","size":"13 x 7","finish":"Natural","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 188\nOriginal material: Jarrah, Natural\nOriginal purchased/size field: 13 x 7\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2025-01-07\nPrice was not recorded in the source workbook.","original_purchased":"13 x 7"},{"source_row":191,"serial":"106","nowak_serial":"344394","completion_date":"2025-01-07","timber":"Jarrah, Natural","size":"14 x 5","finish":"Natural","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 191\nOriginal material: Jarrah, Natural\nOriginal purchased/size field: 14 x 5\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2025-01-07\nPrice was not recorded in the source workbook.","original_purchased":"14 x 5"},{"source_row":194,"serial":"105","nowak_serial":"341040","completion_date":"2025-01-07","timber":"Jarrah, Natural","size":"14 x 6 1/2","finish":"Natural","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 194\nOriginal material: Jarrah, Natural\nOriginal purchased/size field: 14 x 6 1/2\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2025-01-07\nPrice was not recorded in the source workbook.","original_purchased":"14 x 6 1/2"},{"source_row":197,"serial":"104","nowak_serial":"338832","completion_date":"2025-01-18","timber":"Jarrah, Natural","size":"14 x 8","finish":"Natural","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 197\nOriginal material: Jarrah, Natural\nOriginal purchased/size field: 14 x 8\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2025-01-18\nPrice was not recorded in the source workbook.","original_purchased":"14 x 8"},{"source_row":200,"serial":"84","nowak_serial":"275016","completion_date":"2025-02-23","timber":"Salmon Gum, High Gloss","size":"14 x 8","finish":"High Gloss","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 200\nOriginal material: Salmon Gum, High Gloss\nOriginal purchased/size field: 14 x 8\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2025-02-23\nPrice was not recorded in the source workbook.","original_purchased":"14 x 8"},{"source_row":203,"serial":"109","nowak_serial":"363733","completion_date":"2025-04-02","timber":"Jarrah High Gloss, Red Stain","size":"14 x 7","finish":"High Gloss","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 203\nOriginal material: Jarrah High Gloss, Red Stain\nOriginal purchased/size field: 14 x 7\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2025-04-02\nPrice was not recorded in the source workbook.","original_purchased":"14 x 7"},{"source_row":206,"serial":"110","nowak_serial":"370370","completion_date":"2025-05-14","timber":"Jarrah Natural","size":"14 x 5 1/2","finish":"Natural","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 206\nOriginal material: Jarrah Natural\nOriginal purchased/size field: 14 x 5 1/2\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2025-05-14\nPrice was not recorded in the source workbook.","original_purchased":"14 x 5 1/2"},{"source_row":209,"serial":"111","nowak_serial":"374181","completion_date":"2025-05-14","timber":"Sheoak Natural","size":"14 x 8","finish":"Natural","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 209\nOriginal material: Sheoak Natural\nOriginal purchased/size field: 14 x 8\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2025-05-14\nPrice was not recorded in the source workbook.","original_purchased":"14 x 8"},{"source_row":212,"serial":"116","nowak_serial":"391964","completion_date":"2025-06-18","timber":"Jarrah, HIgh Gloss","size":"14 x 6 1/2","finish":"High Gloss","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 212\nOriginal material: Jarrah, HIgh Gloss\nOriginal purchased/size field: 14 x 6 1/2\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2025-06-18\nPrice was not recorded in the source workbook.","original_purchased":"14 x 6 1/2"},{"source_row":215,"serial":"96","nowak_serial":"322752","completion_date":"2025-07-25","timber":"Sheoak, Natural","size":"14 x 5 1/2","finish":"Natural","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 215\nOriginal material: Sheoak, Natural\nOriginal purchased/size field: 14 x 5 1/2\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2025-07-25\nPrice was not recorded in the source workbook.","original_purchased":"14 x 5 1/2"},{"source_row":218,"serial":"119","nowak_serial":"403172","completion_date":"2025-07-25","timber":"Sheoak, Natural","size":"12 x 7","finish":"Natural","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 218\nOriginal material: Sheoak, Natural\nOriginal purchased/size field: 12x7\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2025-07-25\nPrice was not recorded in the source workbook.","original_purchased":"12x7"},{"source_row":221,"serial":"118","nowak_serial":"400020","completion_date":"2025-07-25","timber":"Sheoak, Natural","size":"13 x 7","finish":"Natural","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 221\nOriginal material: Sheoak, Natural\nOriginal purchased/size field: 13x7\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2025-07-25\nPrice was not recorded in the source workbook.","original_purchased":"13x7"},{"source_row":224,"serial":"94","nowak_serial":"316686","completion_date":"2025-07-25","timber":"Jarrah, Natural","size":"13 x 6 1/2","finish":"Natural","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 224\nOriginal material: Jarrah, Natural\nOriginal purchased/size field: 13x6 1/2\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2025-07-25\nPrice was not recorded in the source workbook.","original_purchased":"13x6 1/2"},{"source_row":227,"serial":"117","nowak_serial":"397215","completion_date":"2025-08-02","timber":"Sheoak, Natural","size":"14 x 6 1/2","finish":"Natural","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 227\nOriginal material: Sheoak, Natural\nOriginal purchased/size field: 14x6 1/2\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2025-08-02\nPrice was not recorded in the source workbook.","original_purchased":"14x6 1/2"},{"source_row":230,"serial":"97","nowak_serial":"327666","completion_date":"2025-08-17","timber":"Marri Fiddleback, High Gloss","size":"14 x 6 1/2","finish":"High Gloss","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 230\nOriginal material: Marri Fiddleback, High Gloss\nOriginal purchased/size field: 14x6 1/2\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2025-08-17\nPrice was not recorded in the source workbook.","original_purchased":"14x6 1/2"},{"source_row":233,"serial":"123","nowak_serial":"419061","completion_date":"2025-10-01","timber":"Jarrah, HIgh Gloss (Red Stain). Gold Hardware","size":"14 x 6 1/2","finish":"High Gloss","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 233\nOriginal material: Jarrah, HIgh Gloss (Red Stain). Gold Hardware\nOriginal purchased/size field: 14x6 1/2\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2025-10-01\nPrice was not recorded in the source workbook.","original_purchased":"14x6 1/2"},{"source_row":236,"serial":"134","nowak_serial":"458414","completion_date":"2025-11-01","timber":"Jarrah, HIgh Gloss, Chrome","size":"14 x 7","finish":"High Gloss","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 236\nOriginal material: Jarrah, HIgh Gloss, Chrome\nOriginal purchased/size field: 14x7\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2025-11-01\nPrice was not recorded in the source workbook.","original_purchased":"14x7"},{"source_row":239,"serial":"152","nowak_serial":"523184","completion_date":"2025-11-21","timber":"Marri Fiddleback, High Gloss","size":"14 x 6 1/2","finish":"High Gloss","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 239\nOriginal material: Marri Fiddleback, High Gloss\nOriginal purchased/size field: 14x6 1/2\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2025-11-21\nPrice was not recorded in the source workbook.","original_purchased":"14x6 1/2"},{"source_row":242,"serial":"153","nowak_serial":"527238","completion_date":"2025-11-21","timber":"Tuart, Fiddleback, High Gloss","size":"14 x 6 1/2","finish":"High Gloss","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 242\nOriginal material: Tuart, Fiddleback, High Gloss\nOriginal purchased/size field: 14x6 1/2\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2025-11-21\nPrice was not recorded in the source workbook.","original_purchased":"14x6 1/2"},{"source_row":245,"serial":"150","nowak_serial":"516900","completion_date":"2025-11-21","timber":"Jarrah, HIgh Gloss","size":"12 x 7","finish":"High Gloss","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 245\nOriginal material: Jarrah, HIgh Gloss\nOriginal purchased/size field: 12x7\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2025-11-21\nPrice was not recorded in the source workbook.","original_purchased":"12x7"},{"source_row":248,"serial":"129","nowak_serial":"442212","completion_date":"2025-11-21","timber":"Blackbutt, Natural","size":"14 x 5 1/2","finish":"Natural","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 248\nOriginal material: Blackbutt, Natural\nOriginal purchased/size field: 14X5 1/2\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2025-11-21\nPrice was not recorded in the source workbook.","original_purchased":"14X5 1/2"},{"source_row":251,"serial":"130","nowak_serial":"446160","completion_date":"2025-11-21","timber":"Marri, Natural","size":"14 x 5 1/2","finish":"Natural","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 251\nOriginal material: Marri, Natural\nOriginal purchased/size field: 14X5 1/2\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2025-11-21\nPrice was not recorded in the source workbook.","original_purchased":"14X5 1/2"},{"source_row":254,"serial":"132","nowak_serial":"453684","completion_date":"2025-11-21","timber":"Blackbutt, Natural","size":"14 x 8","finish":"Natural","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 254\nOriginal material: Blackbutt, Natural\nOriginal purchased/size field: 14x8\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2025-11-21\nPrice was not recorded in the source workbook.","original_purchased":"14x8"},{"source_row":257,"serial":"133","nowak_serial":"457653","completion_date":"2025-11-21","timber":"Blackbutt, Natural","size":"12 x 7","finish":"Natural","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 257\nOriginal material: Blackbutt, Natural\nOriginal purchased/size field: 12x7\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2025-11-21\nPrice was not recorded in the source workbook.","original_purchased":"12x7"},{"source_row":260,"serial":"131","nowak_serial":"450902","completion_date":"2025-11-21","timber":"Jarrah Fiddleback, High Gloss","size":"14 x 8","finish":"High Gloss","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 260\nOriginal material: Jarrah Fiddleback, High Gloss\nOriginal purchased/size field: 14x8\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2025-11-21\nPrice was not recorded in the source workbook.","original_purchased":"14x8"},{"source_row":263,"serial":"135","nowak_serial":"465615","completion_date":"2025-11-21","timber":"Marri Fiddleback, High Gloss","size":"14 x 6 1/2","finish":"High Gloss","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 263\nOriginal material: Marri Fiddleback, High Gloss\nOriginal purchased/size field: 14x6 1/2\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2025-11-21\nPrice was not recorded in the source workbook.","original_purchased":"14x6 1/2"},{"source_row":266,"serial":"151","nowak_serial":"523668","completion_date":"2025-11-21","timber":"Marri, Quilted","size":"14 x 6 1/2","finish":"To Be Decided","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 266\nOriginal material: Marri, Quilted\nOriginal purchased/size field: 14x6 1/2\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2025-11-21\nPrice was not recorded in the source workbook.","original_purchased":"14x6 1/2"},{"source_row":269,"serial":"136","nowak_serial":"470152","completion_date":"2026-01-08","timber":"Jarrah, Natural","size":"13\" x 7\"","finish":"Natural","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 269\nOriginal material: Jarrah, Natural\nOriginal purchased/size field: 13\" x 7\"\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2026-01-08\nPrice was not recorded in the source workbook.","original_purchased":"13\" x 7\""},{"source_row":272,"serial":"155","nowak_serial":"539245","completion_date":"2026-02-19","timber":"Wandoo, HG","size":"14 x 6 1/2","finish":"High Gloss","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 272\nOriginal material: Wandoo, HG\nOriginal purchased/size field: 14x6 1/2\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2026-02-19\nPrice was not recorded in the source workbook.","original_purchased":"14x6 1/2"},{"source_row":275,"serial":"137","nowak_serial":"474568","completion_date":"2026-02-19","timber":"Wandoo, HG (Red Stain)","size":"14 x 4 1/2","finish":"High Gloss","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 275\nOriginal material: Wandoo, HG (Red Stain)\nOriginal purchased/size field: 14x4 1/2\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2026-02-19\nPrice was not recorded in the source workbook.","original_purchased":"14x4 1/2"},{"source_row":278,"serial":"43","nowak_serial":"108102","completion_date":"2023-03-06","timber":"Spotted Gum HG (PLY)","size":"14 x 6 1/2","finish":"High Gloss","build_type":"Ply","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 278\nOriginal material: Spotted Gum HG (PLY)\nOriginal purchased/size field: 14x61/2\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2023-03-06\nPrice was not recorded in the source workbook.","original_purchased":"14x61/2"},{"source_row":281,"serial":"142","nowak_serial":"493450","completion_date":"2026-04-24","timber":"Wandoo HG","size":"12 x 7","finish":"High Gloss","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 281\nOriginal material: Wandoo HG\nOriginal purchased/size field: 12x7\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2026-04-24\nPrice was not recorded in the source workbook.","original_purchased":"12x7"},{"source_row":284,"serial":"144","nowak_serial":"501120","completion_date":"2026-04-24","timber":"Jarrah HG (staircase)","size":"13 x 7","finish":"High Gloss","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 284\nOriginal material: Jarrah HG (staircase)\nOriginal purchased/size field: 13X7\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2026-04-24\nPrice was not recorded in the source workbook.","original_purchased":"13X7"},{"source_row":287,"serial":"145","nowak_serial":"505180","completion_date":"2026-04-24","timber":"Jarrah HG (staircase)","size":"12 x 7","finish":"High Gloss","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 287\nOriginal material: Jarrah HG (staircase)\nOriginal purchased/size field: 12X7\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2026-04-24\nPrice was not recorded in the source workbook.","original_purchased":"12X7"},{"source_row":290,"serial":"140","nowak_serial":"487480","completion_date":"2026-04-24","timber":"Blackbutt, Natural","size":"14 x 6 1/2","finish":"Natural","build_type":"Stave","customer":"","sales_status":"Stock","source_note":"Historical spreadsheet import — source row 290\nOriginal material: Blackbutt, Natural\nOriginal purchased/size field: 14x6 1/2\nOriginal customer field: \nOriginal spreadsheet note: \nOriginal completion date: 2026-04-24\nPrice was not recorded in the source workbook.","original_purchased":"14x6 1/2"}];

const fulfilmentChecklist = ["Photos taken","Packed","Shipped"];
const marketingChecklist = ["Website listing","Facebook / Instagram","YouTube demo"];

function manufacturingChecklist(buildType,finish="",buildClient="",drumType="Snare"){
  return applicableChecklist(buildType,finish,drumType).filter(item=>{
    if(fulfilmentChecklist.includes(item) || marketingChecklist.includes(item)) return false;
    // Brady / CB work is normally shell-only. Assembly can still be recorded
    // manually in notes, but it is not required for workflow completion.
    if(buildClient==="Brady" && ["Prepare hardware / heads","Assembled"].includes(item)) return false;
    return true;
  });
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
    "High Gloss preparation":0.50,
    "Polished":1.00,
    "Final shell preparation":0.25,
    "Prepare hardware / heads":0.25,
    "Assembled":0.50,
    "Photos taken":0.50,
    "Website listing":0.25,
    "Facebook / Instagram":0.25,
    "YouTube demo":0.50,
    "Packed":0.50,
    "Shipped":0.25,
  },
  Ply: {
    "Timber / veneer ready":0.75,
    "Glue up complete":0.30,
    "Sanded":0.30,
    "Bearing edges cut":0.25,
    "Snare beds cut":0.15,
    "Drilled":0.75,
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
    "High Gloss preparation":0.50,
    "Polished":1.00,
    "Final shell preparation":0.25,
    "Prepare hardware / heads":0.25,
    "Assembled":0.30,
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
  "Cure complete": {status:"Finish Cured", next:"Prepare the High Gloss shell"},
  "High Gloss preparation": {status:"High Gloss Preparation Complete", next:"Polish the shell"},
  "Polished": {status:"Polishing Complete", next:"Complete final shell preparation"},
  "Final shell preparation": {status:"Final Shell Preparation Complete", next:"Prepare hardware and heads"},
  "Prepare hardware / heads": {status:"Hardware and Heads Ready", next:"Assemble the drum"},
  "Assembled": {status:"Drum Assembled", next:"Take final photographs"},
  "Photos taken": {status:"Photography Complete", next:"Create the website listing"},
  "Website listing": {status:"Website Listed", next:"Create Facebook and Instagram content"},
  "Facebook / Instagram": {status:"Social Media Complete", next:"Record the YouTube demo"},
  "YouTube demo": {status:"Marketing Complete", next:"Pack the drum"},
  "Packed": {status:"Packed", next:"Ship the drum"},
  "Shipped": {status:"Sold / Shipped", next:"Complete"},
};

function applicableChecklist(buildType, finish="", drumType="Snare"){
  const finishText=String(finish || "").toLowerCase();
  const isNatural=finishText.includes("natural");
  const isSatin=finishText.includes("satin");

  const isSnare=String(drumType||"Snare").toLowerCase().includes("snare");

  return checklist.filter(item=>{
    if(buildType==="Ply" && item==="Machined") return false;
    if(!isSnare && item==="Snare beds cut") return false;
    if(item==="High Gloss preparation" && (isNatural || isSatin)) return false;
    if(item==="Final shell preparation" && (isNatural || isSatin)) return false;

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

function isArchivedStatus(drum){
  return drumLifecycleStatus(drum)==="Archived";
}

function isManufacturingComplete(drum){
  if(isSoldStatus(drum) || isShippedStatus(drum) || isArchivedStatus(drum)) return true;
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
    "High Gloss preparation":"Prepare the High Gloss shell",
    "Polished":"Polish the shell",
    "Final shell preparation":"Fine steel wool and final inside oil",
    "Prepare hardware / heads":"Prepare hardware, heads and throw-off",
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

function drumTimingMultiplier(drumType="Snare", size=""){
  const type=String(drumType||"Snare").toLowerCase();
  if(type.includes("snare")) return 1;
  const diameter=Number(String(size||"").match(/\d+(?:\.\d+)?/)?.[0]||0);
  const scale={8:1.10,10:1.25,12:1.50,13:1.65,14:1.85,16:2.30,18:2.90,20:3.20,22:3.60,24:4.00};
  return scale[diameter] || (diameter>=24?4:diameter>=20?3.2:diameter>=16?2.3:diameter>0?1.25:1);
}

function workflowState(buildType, checked, finish="", buildClient="", drumType="Snare", size=""){

  const steps=manufacturingChecklist(buildType,finish,buildClient,drumType);
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
  const multiplier=drumTimingMultiplier(drumType,size);
  const estimatedCompleted=steps.slice(0,completedCount).reduce((sum,item)=>sum+Number(estimates[item]||0)*multiplier,0);
  const estimatedTotal=steps.reduce((sum,item)=>sum+Number(estimates[item]||0)*multiplier,0);
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

function cureStatusForDrum(drum){
  const finishText=String(drum?.finish||"").toLowerCase();
  if(!finishText.includes("gloss") && !finishText.includes("satin")) return null;

  const checked=parseChecked(drum?.notes);
  const history=Array.isArray(drum?.stage_history) ? drum.stage_history : [];
  const now=new Date();
  now.setHours(12,0,0,0);

  function statusFor(item,type,nextInstruction){
    const entry=[...history].reverse().find(record=>record.item===item && record.completed && record.completed_at);
    if(!entry) return null;
    const completedAt=new Date(entry.completed_at);
    const readyAt=new Date(completedAt);
    readyAt.setDate(readyAt.getDate()+7);
    readyAt.setHours(12,0,0,0);
    const milliseconds=readyAt-now;
    const daysRemaining=Math.max(0,Math.ceil(milliseconds/86400000));
    return {
      type,
      item,
      completedAt:entry.completed_at,
      readyAt:readyAt.toISOString(),
      readyDate:readyAt.toISOString().slice(0,10),
      ready:milliseconds<=0,
      daysRemaining,
      nextInstruction,
    };
  }

  // Final coat cure takes priority once the final coat is complete.
  if(finishText.includes("satin") && checked.has("Satin coat") && !checked.has("Cure complete")){
    return statusFor("Satin coat","final","Complete cure inspection and progress to final preparation");
  }
  if(finishText.includes("gloss") && checked.has("Poly coat 4") && !checked.has("Cure complete")){
    return statusFor("Poly coat 4","final","Complete cure inspection and progress to High Gloss preparation");
  }

  // The sealer must cure for seven days before polyurethane coat 1.
  if(checked.has("Sealer coat") && !checked.has("Poly coat 1")){
    return statusFor("Sealer coat","sealer","Spray polyurethane coat 1");
  }

  return null;
}

function cureDisplayText(cure){
  if(!cure) return "";
  if(cure.ready){
    return cure.type==="sealer"
      ? "Seal coat cured — ready for polyurethane coat 1"
      : "Final cure complete — ready to progress";
  }
  const dayLabel=cure.daysRemaining===1 ? "day" : "days";
  return cure.type==="sealer"
    ? `Seal coat curing — ${cure.daysRemaining} ${dayLabel} remaining`
    : `Final coat curing — ${cure.daysRemaining} ${dayLabel} remaining`;
}

function sprayMixForBatch(name,count){
  const batchName=String(name||"").toLowerCase();
  const drums=Math.max(0,Number(count||0));
  let recipe=null;

  if(batchName.includes("sealer")){
    recipe={label:"Sealer coat",product:"Polyurethane",basePerDrum:30,hardenerPerDrum:15,hardener:"Standard hardener",thinnerPercent:20};
  }else if(batchName.includes("satin")){
    recipe={label:"Final satin coat",product:"Satin",basePerDrum:30,hardenerPerDrum:15,hardener:"Rapid hardener",thinnerPercent:10};
  }else if(batchName.includes("polyurethane coat")){
    recipe={label:"High-gloss polyurethane coat",product:"Polyurethane",basePerDrum:40,hardenerPerDrum:20,hardener:"Standard hardener",thinnerPercent:0};
  }

  if(!recipe || !drums) return null;
  const base=recipe.basePerDrum*drums;
  const hardener=recipe.hardenerPerDrum*drums;
  const combined=base+hardener;
  const thinners=combined*(recipe.thinnerPercent/100);
  return {...recipe,drums,base,hardener,combined,thinners,total:combined+thinners};
}

function formatMixMl(value){
  const number=Number(value||0);
  return Number.isInteger(number) ? `${number} ml` : `${number.toFixed(1)} ml`;
}

const drumDiameters = ["8","10","12","13","14","16","18","20","22","24"];
const drumDepths = ["4 1/2","5","5 1/2","6","6 1/2","7","7 1/2","8","10","12","14","16","18"];
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
  "Danish oil 3":"shellcomplete",
  "Cure complete":"shellcomplete",
  "Assembled":"drumcomplete",
  "Polished":"shellcomplete",
};

const projectMediaCategories = [
  {key:"project_progress",label:"Project Progress"},
  {key:"shells_together",label:"Shells Together"},
  {key:"finished_kit",label:"Finished Kit"},
  {key:"final_photos",label:"Final Photos"},
  {key:"video",label:"Video"},
  {key:"general",label:"General"},
];

const photoMilestones = {
  general:{
    label:"Build Photo",
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
    label:"Shell complete",
    prompt:"Take or upload several completed-shell photos: outside, inside, bearing edges, snare beds and finish.",
    social:"This shell is now complete. The machining, sanding, edges, snare beds and finish have all been completed, and the shell is ready for the next stage of its journey.",
  },
  drumcomplete:{
    label:"Finished drum",
    prompt:"Take or upload full drum photos, details, throw-off, hoops and a final glamour image.",
    social:"The drum is now complete. From the original timber through every stage of machining, finishing and assembly, it has been built by hand in Western Australia and is now ready to be played.",
  },
};

function shouldSuggestExtraFiddlebackCoat(drum){
  const timber=String(drum?.timber||"").toLowerCase();
  const finish=String(drum?.finish||"").toLowerCase();
  return timber.includes("fiddleback") && finish.includes("high gloss");
}

function photoMilestoneForCompletion(drum,item){
  const key=photoMilestoneByChecklist[item];
  if(!key) return null;

  const finishText=String(drum.finish||"").toLowerCase();
  const isNatural=finishText.includes("natural");
  const isSatin=finishText.includes("satin");

  // Natural-finish drums prompt after the third Danish oil coat.
  if(item==="Danish oil 3"){
    return isNatural ? "shellcomplete" : null;
  }

  // Satin drums prompt only after the satin finish has cured.
  if(item==="Cure complete"){
    return isSatin ? "shellcomplete" : null;
  }

  // Brady / CB shell work otherwise prompts only after polishing.
  if(drum.build_client==="Brady"){
    return item==="Polished" ? "shellcomplete" : null;
  }

  // Stock and custom Nowak drums use the normal production milestones.
  if(drum.build_client==="Nowak" || drum.build_client==="Unallocated"){
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

// Current agreed pricing guide. Tom and bass-drum prices use the snare as the
// minimum baseline, with a 24-inch drum representing approximately 4x the work.
const nowakTomRetailPrices = {
  "10": 1400,
  "12": 1600,
  "14": 1900,
  "20": 3000,
};

// Brady assists with these builds, so the agreed four-shell kit total is $4,000.
const bradyTomWholesalePrices = {
  "10": 650,
  "12": 750,
  "14": 950,
  "20": 1650,
};

const nowakKitRetailPrice = 8000;
const bradyKitWholesalePrice = 4000;

function drumDiameterFromSize(size=""){
  return String(size).match(/\d+(?:\.\d+)?/)?.[0] || "";
}

const defaultPlyLengths14 = [1106,1096,1087.5,1079.5,1069];
const defaultPairThickness = 1.2;
const mouldDiameters = {
  "14": 13.875 * 25.4,
  "13": 12.875 * 25.4,
  "12": 11.875 * 25.4,
};

const money = (v) => "$" + Math.round(Number(v || 0)).toLocaleString();
function buildSize(diameter, depth){ return `${diameter} x ${depth}`; }

const repairServices = [
  {key:"bearing_edges",label:"Cut bearing edges",price:100},
  {key:"snare_beds",label:"Cut snare beds",price:50},
  {key:"bearing_and_snare",label:"Bearing edges and snare beds",price:150},
  {key:"widen_snare_bed",label:"Widen snare bed",price:50},
  {key:"cut_down_shell",label:"Cut down shell",price:100},
  {key:"miscellaneous",label:"Miscellaneous repair",price:0},
];

const repairStatuses = ["Received","In Progress","Ready for Collection","Collected & Paid"];

function nextRepairNumber(repairs=[]){
  const highest=repairs.reduce((max,repair)=>{
    const match=String(repair.job_number || "").match(/R-(\d+)/i);
    return match ? Math.max(max,Number(match[1])) : max;
  },0);
  return `R-${String(highest+1).padStart(3,"0")}`;
}

function repairServiceTotal(keys=[]){
  return keys.reduce((sum,key)=>{
    const service=repairServices.find(item=>item.key===key);
    return sum+Number(service?.price || 0);
  },0);
}

function repairServiceLabels(keys=[]){
  return keys.map(key=>repairServices.find(item=>item.key===key)?.label || key);
}

function splitSize(size){
  const text = String(size || "14 x 6.5");
  const parts = text.split("x").map(p=>p.trim());
  const diameter = (parts[0] || "14").replace(/"/g,"");
  let depth = (parts[1] || "6.5").replace(/"/g,"");
  const depthMap = {"4.5":"4 1/2","5.5":"5 1/2","6.5":"6 1/2","7.5":"7 1/2"};
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
    d.finish,
    d.build_client,
    d.drum_type,
    d.size
  );
  const cure=cureStatusForDrum(d);

  if(cure){
    if(cure.ready){
      return cure.type==="sealer"
        ? "Seal Coat Cure Complete — Ready for Polyurethane Coat 1"
        : "Final Cure Complete — Ready to Progress";
    }
    return cure.type==="sealer"
      ? `Seal Coat Curing — ${cure.daysRemaining} day${cure.daysRemaining===1?"":"s"} remaining`
      : `Final Coat Curing — ${cure.daysRemaining} day${cure.daysRemaining===1?"":"s"} remaining`;
  }

  if(!flow.nextStep || flow.nextStep==="Complete") return null;

  // Ply and stave shells reach sanding from different parts of the process,
  // so keep them in separate Workshop Today queues.
  if(flow.nextStep==="Sand the shell"){
    return buildType==="Ply"
      ? "Ply Shell Sanding — Fresh from the Mould"
      : "Stave Shell Sanding — After Machining";
  }

  if(buildType==="Stave" && ["Cut and prepare timber","Machine the shell"].includes(flow.nextStep)){
    return "Stave Blanks";
  }

  return flow.nextStep;
}

function workshopBatchPriority(name){
  const text=String(name||"").toLowerCase();
  // Workshop Today is deliberately ordered from closest to completion
  // through to the earliest production work, with Stave Blanks last.
  const order=[
    ["assemble",10],
    ["prepare hardware",15],
    ["final shell",20],
    ["polish",25],
    ["high gloss preparation",30],
    ["final cure complete",35],
    ["allow the finish to cure",38],
    ["final coat curing",40],
    ["satin",45],
    ["polyurethane coat 4",50],
    ["polyurethane coat 3",55],
    ["polyurethane coat 2",60],
    ["seal coat cure complete",65],
    ["seal coat curing",70],
    ["polyurethane coat 1",75],
    ["sealer",80],
    ["inside",85],
    ["drill",90],
    ["snare bed",95],
    ["bearing edge",100],
    ["sand",105],
    ["machine",110],
    ["glue",115],
    ["prepare veneer",120],
    ["stave blanks",999],
  ];
  return order.find(([key])=>text.includes(key))?.[1] ?? 500;
}

function workshopDrumPriorityCompare(a,b){
  const aFlow=workflowState(a.build_type||"Stave",parseChecked(a.notes),a.finish,a.build_client,a.drum_type,a.size);
  const bFlow=workflowState(b.build_type||"Stave",parseChecked(b.notes),b.finish,b.build_client,b.drum_type,b.size);
  if(aFlow.percent!==bFlow.percent) return bFlow.percent-aFlow.percent;
  return extractNumber(a.serial)-extractNumber(b.serial);
}

function localISODate(offsetDays=0){
  const date=new Date();
  date.setHours(12,0,0,0);
  date.setDate(date.getDate()+offsetDays);
  return date.toISOString().slice(0,10);
}

function friendlyPlanDate(dateValue){
  if(!dateValue) return "";
  if(dateValue===localISODate(0)) return "Today";
  if(dateValue===localISODate(1)) return "Tomorrow";
  try{
    return new Intl.DateTimeFormat("en-AU",{day:"numeric",month:"short",year:"numeric"}).format(new Date(`${dateValue}T12:00:00`));
  }catch{
    return dateValue;
  }
}

function planDetailsForDrum(drum){
  const buildType=drum.build_type || "Stave";
  const flow=workflowState(buildType,parseChecked(drum.notes),drum.finish,drum.build_client,drum.drum_type,drum.size);
  const cure=cureStatusForDrum(drum);
  const taskItem=flow.steps[flow.completedCount] || "";
  if(cure && !cure.ready) return null;
  if(!taskItem || isManufacturingComplete(drum) || ["Sold","Shipped"].includes(drumLifecycleStatus(drum))) return null;
  return {
    task_item:taskItem,
    task_label:checklistDisplayLabel(taskItem,buildType),
    estimated_hours:Number(workflowEstimates[buildType]?.[taskItem] || 0) * drumTimingMultiplier(drum.drum_type,drum.size),
    drum_label:`#${drum.serial || "—"} ${drum.timber || "Drum"} · ${drum.size || ""}`.trim(),
  };
}

function formatPlanTime(hours){
  const totalMinutes=Math.round(Number(hours||0)*60);
  const hrs=Math.floor(totalMinutes/60);
  const mins=totalMinutes%60;
  if(!hrs) return `${mins} min`;
  if(!mins) return `${hrs} hr`;
  return `${hrs} hr ${mins} min`;
}

const workshopTaskPresets = [
  {title:"Clean dust extractors",estimated_minutes:30},
  {title:"Empty workshop bins",estimated_minutes:15},
  {title:"Machine maintenance",estimated_minutes:30},
  {title:"Sharpen tools",estimated_minutes:30},
  {title:"Order supplies",estimated_minutes:15},
  {title:"Send customer emails",estimated_minutes:20},
  {title:"Workshop cleanup",estimated_minutes:30},
];

const futureProjectStages = [
  "Idea captured",
  "Researching",
  "External work commissioned",
  "Waiting on supplier",
  "Prototype ready",
  "Ready to schedule",
  "Active project",
  "Completed",
  "Parked",
];

const futureProjectOrders = [
  "Next development project",
  "After current kits",
  "After stock is rebuilt",
  "Someday / no timeframe",
  "Parked",
];

function addDaysISO(dateValue,days){
  const date=new Date(`${dateValue}T12:00:00`);
  date.setDate(date.getDate()+days);
  return date.toISOString().slice(0,10);
}

function addMonthsISO(dateValue,months){
  const date=new Date(`${dateValue}T12:00:00`);
  const originalDay=date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth()+months);
  const maxDay=new Date(date.getFullYear(),date.getMonth()+1,0).getDate();
  date.setDate(Math.min(originalDay,maxDay));
  return date.toISOString().slice(0,10);
}

function nextWorkshopTaskDate(task,fromDate){
  if(task.recurrence==="Weekly") return addDaysISO(fromDate,7);
  if(task.recurrence==="Monthly") return addMonthsISO(fromDate,1);
  return fromDate;
}

function workshopTaskDue(task,date){
  return task.status!=="Done" && String(task.next_due_date||"")<=date;
}

function workshopTaskRecurrenceLabel(task){
  if(task.recurrence==="Weekly") return "Weekly";
  if(task.recurrence==="Monthly") return "Monthly";
  return "One-off";
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

  // Brady shell-only wholesale pricing.
  if(build_client==="Brady"){
    if(drum_type==="Snare"){
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

    const bradyTomPrice=bradyTomWholesalePrices[drumDiameterFromSize(size)];
    if(bradyTomPrice) return bradyTomPrice;
  }

  // Current Nowak retail guide for the standard 10/12/14/20 four-piece kit.
  if(build_client==="Nowak" && drum_type!=="Snare"){
    const tomRetailPrice=nowakTomRetailPrices[drumDiameterFromSize(size)];
    if(tomRetailPrice) return tomRetailPrice;
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

function archiveDetailsFromNotes(notes){
  const reason=String(notes||"").match(/^\[Archive Reason:\s*(.+?)\]$/mi)?.[1]?.trim() || "";
  const date=String(notes||"").match(/^\[Archived At:\s*(.+?)\]$/mi)?.[1]?.trim() || "";
  const previous=String(notes||"").match(/^\[Pre-Archive Status:\s*(.+?)\]$/mi)?.[1]?.trim() || "";
  return {reason,date,previous};
}

function setArchiveDetailsInNotes(notes,{reason,date,previous}){
  const clean=String(notes || "")
    .split("\n")
    .filter(line=>!/^\[(Archive Reason|Archived At|Pre-Archive Status):/i.test(line.trim()))
    .join("\n")
    .trim();
  const lines=[
    `[Archive Reason: ${String(reason||"Job closed").trim()}]`,
    `[Archived At: ${date || new Date().toISOString()}]`,
    `[Pre-Archive Status: ${previous || "Completed"}]`,
  ];
  return `${clean?clean+"\n":""}${lines.join("\n")}`;
}

function clearArchiveDetailsFromNotes(notes){
  return String(notes || "")
    .split("\n")
    .filter(line=>!/^\[(Archive Reason|Archived At|Pre-Archive Status):/i.test(line.trim()))
    .join("\n")
    .trim();
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

function normaliseJobNumber(value){
  return String(value||"").trim().replace(/^#/,"").toLowerCase();
}

function dayOfYear(dateValue=new Date()){
  const date=dateValue instanceof Date ? dateValue : new Date(dateValue);
  const start=new Date(date.getFullYear(),0,0);
  return Math.floor((date-start)/86400000);
}

function calculateEncodedNowakSerial(productionNumber,dateValue=new Date()){
  const drumNumber=extractNumber(productionNumber);
  if(!drumNumber) return "";
  const date=dateValue instanceof Date ? dateValue : new Date(dateValue);
  return String((dayOfYear(date)+drumNumber+date.getFullYear())*drumNumber);
}

function encodedSerialConflict(drums,serial,excludeId=null){
  const value=String(serial||"").trim();
  if(!value) return null;
  return drums.find(d=>d.id!==excludeId && String(d.nowak_serial||"").trim()===value) || null;
}

function duplicateNumberMessage(drums,{id=null,serial="",cbNumber="",buildClient=""}){
  const production=normaliseJobNumber(serial);
  const cb=normaliseJobNumber(cbNumber);

  if(!production) return "";

  const productionDuplicate=drums.find(d=>d.id!==id && normaliseJobNumber(d.serial)===production);
  if(productionDuplicate){
    return `Production number #${serial} is already used by ${productionDuplicate.timber||"another drum"}.`;
  }

  if(buildClient==="Brady"){
    if(!cb) return "A CB number is required for Brady / CB drums.";
    if(cb===production) return "The CB number and production number cannot be the same.";
    const cbDuplicate=drums.find(d=>d.id!==id && d.build_client==="Brady" && normaliseJobNumber(d.cb_number)===cb);
    if(cbDuplicate){
      return `CB number ${cbNumber} is already used by production #${cbDuplicate.serial}.`;
    }
  }

  return "";
}


function defaultBuildSpecification(drumType,buildType="Stave"){
  if(buildType==="Ply") return "10 x ply = 6 mm shell thickness";
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
    lines.push("ROUGH OD",d?.rough || "","FINISHED OD",d?.finished || "","TRITON",s?.triton || "","STAVE",s?.stave || "","BUILD SPECIFICATION",defaultBuildSpecification(drumType || "Snare",buildType));
  }else{
    lines.push("FINISHED OD",d?.finished || "","BUILD SPECIFICATION",defaultBuildSpecification(drumType || "Snare",buildType));
  }
  return lines.join("\\n");
}


function DrumQrPanel({serial}){
  const [dataUrl,setDataUrl]=useState("");
  const publicUrl=serial ? `${window.location.origin}${window.location.pathname}?drumSerial=${encodeURIComponent(serial)}` : "";
  useEffect(()=>{
    if(!publicUrl){ setDataUrl(""); return; }
    QRCode.toDataURL(publicUrl,{width:700,margin:2}).then(setDataUrl).catch(()=>setDataUrl(""));
  },[publicUrl]);
  if(!serial) return null;
  function download(){
    const a=document.createElement("a"); a.href=dataUrl; a.download=`Nowak-QR-${serial}.png`; a.click();
  }
  function print(){
    const w=window.open("","_blank","width=500,height=650");
    if(!w) return;
    w.document.write(`<html><body style="display:grid;place-items:center;margin:0;min-height:100vh"><img src="${dataUrl}" style="width:320px;height:320px" onload="window.print()"></body></html>`);
    w.document.close();
  }
  return <div className="qrPanel">
    {dataUrl && <img src={dataUrl} alt={`QR code for serial ${serial}`}/>} 
    <div><b>QR code ready</b><p>Links to the public drum record. Brady drums are excluded.</p>
      <button type="button" onClick={download}><Download size={15}/> Save QR</button>
      <button type="button" onClick={print}><Printer size={15}/> Print QR</button>
    </div>
  </div>;
}

function PublicDrumPage({serial}){
  const [drum,setDrum]=useState(null); const [photos,setPhotos]=useState([]); const [loading,setLoading]=useState(true);
  useEffect(()=>{(async()=>{
    const {data}=await supabase.from("drums").select("id,nowak_serial,timber,size,build_type,drum_type,finish,completion_date,created_at").eq("nowak_serial",serial).eq("build_client","Nowak").maybeSingle();
    setDrum(data||null);
    if(data){ const result=await supabase.from("drum_photos").select("id,public_url,media_type,milestone,created_at").eq("drum_id",data.id).order("created_at",{ascending:true}); setPhotos(result.data||[]); }
    setLoading(false);
  })()},[serial]);
  if(loading) return <main className="publicDrumPage"><p>Loading drum record…</p></main>;
  if(!drum) return <main className="publicDrumPage"><img src={nowakLogo}/><h1>Drum record not found</h1><p>This serial number is not available as a public Nowak drum record.</p></main>;
  return <main className="publicDrumPage"><img src={nowakLogo}/><h1>Nowak Drum Company</h1><h2>Serial {drum.nowak_serial}</h2><p className="publicDrumSummary">{drum.size} {drum.timber} {drum.build_type} {drum.drum_type}</p><p>{drum.finish} finish · Handmade in Western Australia</p><p>This serial identifies an original instrument handmade by Nowak Drum Company.</p>
    {photos.length>0 && <section><h3>Build and completion photos</h3><div className="publicPhotoGrid">{photos.map(photo=>photo.media_type==="video"?<video key={photo.id} src={photo.public_url} controls/>:<img key={photo.id} src={photo.public_url} alt="Nowak drum build"/>)}</div></section>}
  </main>;
}

function App(){
  const [view,setView]=useState("dashboard");
  const [drums,setDrums]=useState([]);
  const [hardware,setHardware]=useState([]);
  const [templates,setTemplates]=useState([]);
  const [sales,setSales]=useState([]);
  const [projects,setProjects]=useState([]);
  const [repairs,setRepairs]=useState([]);
  const [workPlan,setWorkPlan]=useState([]);
  const [workshopTasks,setWorkshopTasks]=useState([]);
  const [showAddWorkshopTask,setShowAddWorkshopTask]=useState(false);
  const [editingWorkshopTask,setEditingWorkshopTask]=useState(null);
  const [futureProjects,setFutureProjects]=useState([]);
  const [showFutureProjectModal,setShowFutureProjectModal]=useState(false);
  const [editingFutureProject,setEditingFutureProject]=useState(null);
  const [repairJob,setRepairJob]=useState(null);
  const [showAddRepair,setShowAddRepair]=useState(false);
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
    const [d,h,t,s,p,r,w,wt,fp]=await Promise.all([
      supabase.from("drums").select("*").order("created_at",{ascending:false}),
      supabase.from("hardware_parts").select("*").order("category",{ascending:true}),
      supabase.from("cost_templates").select("*").order("name",{ascending:true}),
      supabase.from("sales").select("*").order("sold_at",{ascending:false}),
      supabase.from("projects").select("*").order("created_at",{ascending:false}),
      supabase.from("repair_jobs").select("*").order("created_at",{ascending:false}),
      supabase.from("work_plan_items").select("*").order("planned_date",{ascending:true}).order("created_at",{ascending:true}),
      supabase.from("workshop_tasks").select("*").order("next_due_date",{ascending:true}).order("created_at",{ascending:true}),
      supabase.from("future_projects").select("*").order("created_at",{ascending:false})
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
    setRepairs(r.data||[]);
    setWorkPlan(w.data||[]);
    setWorkshopTasks(wt.data||[]);
    setFutureProjects(fp.data||[]);

    const coreErrors=[d.error,h.error,t.error,s.error].filter(Boolean);
    if(coreErrors.length){
      setMessage(coreErrors.map(e=>e.message).join(" | "));
    }else if(p.error){
      setMessage("Kits / Projects needs the v5.0 Supabase setup: " + p.error.message);
    }else if(r.error){
      setMessage("Repairs & Modifications needs the v6.4.0 Supabase migration.");
    }else if(w.error){
      setMessage("Daily Planning needs the v6.5.0 Supabase migration.");
    }else if(wt.error){
      setMessage("Workshop Tasks needs the v6.7.0 Supabase migration.");
    }else if(fp.error){
      setMessage("Future Projects needs the v6.8.0 Supabase migration.");
    }else{
      setMessage("");
    }
    setLoading(false);
  }

  useEffect(()=>{ loadAll(); },[]);

  const operationalDrums=drums.filter(d=>!isSoldStatus(d) && !isShippedStatus(d) && !isArchivedStatus(d));
  const filtered=drums.filter(d=>JSON.stringify(d).toLowerCase().includes(search.toLowerCase()));
  const active=operationalDrums;
  const templateMap=useMemo(()=>Object.fromEntries(templates.map(t=>[t.name,t])),[templates]);
  const batches=useMemo(()=>{
    const g={};
    filtered
      .filter(d=>!isSoldStatus(d) && !isShippedStatus(d) && !isArchivedStatus(d))
      .forEach(d=>{
        const b=batchType(d);
        if(b){g[b]??=[];g[b].push(d);}
      });
    return g;
  },[filtered]);
  const inventoryValue=hardware.reduce((s,p)=>s+Number(p.qty_on_hand||0)*Number(p.landed_cost_aud||0),0);
  const lowStock=hardware.filter(p=>Number(p.qty_on_hand||0)<=Number(p.reorder_level||0)).length;
  const retail=active.reduce((s,d)=>s+Number(d.total_price||d.retail_price||0),0);
  const cost=active.reduce((s,d)=>s+templateCost(templateMap[d.template_name],labourRate),0);
  const brady=active.filter(d=>d.build_client==="Brady").length;
  const overdue=active.filter(d=>d.due_date && new Date(d.due_date) < new Date()).length;
  const cureQueue=active.filter(d=>["Polyurethane Coat 4","Finished Spraying / Curing"].includes(d.production_status)).length;
  const photoQueue=active.filter(d=>d.production_status==="Finished / Ready to Sell").length;
  const cureReadyDrums=active.filter(d=>cureStatusForDrum(d)?.ready);
  const curingDrums=active.filter(d=>{
    const cure=cureStatusForDrum(d);
    return cure && !cure.ready;
  });
  const outstandingFinalWork=filtered.filter(d=>!isArchivedStatus(d) && !isSoldStatus(d) && !isShippedStatus(d) && outstandingWorkFromNotes(d.notes));
  const activeRepairs=repairs.filter(r=>r.status!=="Collected & Paid");
  const readyRepairs=repairs.filter(r=>r.status==="Ready for Collection");
  const repairIncome=repairs
    .filter(r=>r.status==="Collected & Paid")
    .reduce((sum,r)=>sum+Number(r.agreed_price||0),0);
  const tomorrowPlan=workPlan.filter(item=>item.planned_date===localISODate(1) && item.status!=="Done");
  const tomorrowPlanHours=tomorrowPlan.reduce((sum,item)=>sum+Number(item.estimated_hours||0),0);
  const tomorrowPlannedDrumIds=new Set(tomorrowPlan.map(item=>item.drum_id));
  const tomorrowPlannedTaskByDrum=Object.fromEntries(
    tomorrowPlan.map(item=>[item.drum_id,item.task_label])
  );
  const activePlanByDrum=workPlan
    .filter(item=>item.status!=="Done")
    .reduce((acc,item)=>{
      acc[item.drum_id] ??=[];
      acc[item.drum_id].push(item);
      return acc;
    },{});
  const plannedDatesByDrum=Object.fromEntries(
    Object.entries(activePlanByDrum).map(([drumId,items])=>[
      drumId,
      [...new Set(items.map(item=>item.planned_date))].sort()
    ])
  );

  const todayWorkshopTasks=workshopTasks.filter(task=>workshopTaskDue(task,localISODate(0)));
  const todayWorkshopTaskMinutes=todayWorkshopTasks.reduce((sum,task)=>sum+Number(task.estimated_minutes||0),0);

  const staveInProduction=drums.filter(d=>
    d.build_type==="Stave" &&
    !isManufacturingComplete(d) &&
    !isSoldStatus(d) &&
    !isShippedStatus(d) &&
    !isArchivedStatus(d)
  ).length;
  const plyInProduction=drums.filter(d=>
    d.build_type==="Ply" &&
    !isManufacturingComplete(d) &&
    !isSoldStatus(d) &&
    !isShippedStatus(d) &&
    !isArchivedStatus(d)
  ).length;
  const completedDrums=drums.filter(d=>
    drumLifecycleStatus(d)==="Completed" &&
    !isSoldStatus(d) &&
    !isShippedStatus(d) &&
    !isArchivedStatus(d)
  ).length;
  const archivedDrums=drums.filter(isArchivedStatus);

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
    .filter(d=>!isArchivedStatus(d))
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
    const existing=drums.find(d=>d.id===id) || {};
    if("serial" in nextPatch || "cb_number" in nextPatch || "build_client" in nextPatch){
      const numberError=duplicateNumberMessage(drums,{
        id,
        serial:"serial" in nextPatch ? nextPatch.serial : existing.serial,
        cbNumber:"cb_number" in nextPatch ? nextPatch.cb_number : existing.cb_number,
        buildClient:"build_client" in nextPatch ? nextPatch.build_client : existing.build_client,
      });
      if(numberError){
        setMessage(numberError);
        return false;
      }
    }

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
      const flow=workflowState(d.build_type || "Stave",checked,d.finish,d.build_client,d.drum_type,d.size);
      const nextItem=flow.steps[flow.completedCount];
      if(!nextItem) return false;

      const next=new Set(checked);
      next.add(nextItem);
      const nextFlow=workflowState(d.build_type || "Stave",next,d.finish,d.build_client,d.drum_type,d.size);
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

  async function importHistoricalDrums(recordsToImport){
    const productionNumbers=new Set(drums.map(d=>normaliseJobNumber(d.serial)));
    const nowakSerials=new Set(drums.map(d=>String(d.nowak_serial||"").trim()).filter(Boolean));

    const safeRows=recordsToImport.filter(row=>
      !productionNumbers.has(normaliseJobNumber(row.serial)) &&
      !nowakSerials.has(String(row.nowak_serial||"").trim())
    );

    if(!safeRows.length){
      setMessage("No new historical drums were available to import.");
      return {imported:0,skipped:recordsToImport.length};
    }

    const payloads=safeRows.map(row=>{
      const completedAt=row.completion_date
        ? `${row.completion_date}T12:00:00.000Z`
        : new Date().toISOString();
      const completedSteps=new Set(applicableChecklist(row.build_type||"Stave",row.finish||"To Be Decided"));
      const baseNotes=[
        row.source_note,
        "[Outstanding Work: No outstanding work]",
        "[Archive Reason: Historical spreadsheet import]",
        `[Archived At: ${completedAt}]`,
        "[Pre-Archive Status: Completed]",
      ].filter(Boolean).join("\n");
      const notes=setChecklistInNotes(baseNotes,completedSteps);

      return {
        serial:String(row.serial||"").trim(),
        nowak_serial:String(row.nowak_serial||"").trim(),
        timber:row.timber||"Not recorded",
        build_type:row.build_type||"Stave",
        drum_type:"Snare",
        size:row.size||"",
        finish:row.finish||"To Be Decided",
        customer:row.customer||"",
        customer_phone:"",
        customer_email:"",
        shipping_address:"",
        due_date:null,
        production_status:"Manufacturing Complete",
        lifecycle_status:"Archived",
        sales_status:row.sales_status||"Stock",
        next_step:"Archived",
        retail_price:0,
        custom_price:0,
        wholesale_price:0,
        shipping_cost:0,
        total_price:0,
        hours_logged:0,
        build_client:"Nowak",
        price_rule:"Historical spreadsheet import",
        cb_number:"",
        construction_note:defaultBuildSpecification("Snare",row.build_type||"Stave"),
        timber_story:"",
        notes,
        stage_history:Array.from(completedSteps).map(item=>({
          item,
          completed:true,
          completed_at:completedAt
        })),
      };
    });

    const imported=[];
    for(let index=0;index<payloads.length;index+=20){
      const chunk=payloads.slice(index,index+20);
      const {data,error}=await supabase.from("drums").insert(chunk).select("*");
      if(error){
        setMessage(`Historical import stopped: ${error.message}. ${imported.length} drum${imported.length===1?"":"s"} had already been imported in this run.`);
        if(imported.length) setDrums(current=>[...current,...imported]);
        return {imported:imported.length,skipped:recordsToImport.length-imported.length,error:error.message};
      }
      imported.push(...(data||[]));
    }

    setDrums(current=>{
      const map=new Map(current.map(d=>[d.id,d]));
      imported.forEach(d=>map.set(d.id,d));
      return [...map.values()];
    });
    setMessage(`${imported.length} historical drum${imported.length===1?"":"s"} imported into the Archive.`);
    return {imported:imported.length,skipped:recordsToImport.length-imported.length};
  }

  async function addDrumFromWizard(form){
    const numberError=duplicateNumberMessage(drums,{
      serial:form.serial,
      cbNumber:form.cb_number,
      buildClient:form.build_client,
    });
    if(numberError){
      setMessage(numberError);
      alert(numberError);
      return false;
    }

    const isPly = form.build_type === "Ply";
    const spec = staveSpecForDiameter(form.diameter);
    const construction = !isPly ? drumTypeComment(form.drum_type, form.diameter) : null;

    const insertData = {
      serial:form.pending ? "" : (form.serial || nextProductionNumber(drums)),
      timber:form.timber || "",
      build_type:form.build_type,
      drum_type:form.drum_type || "Snare",
      size:form.size,
      finish:form.finish || "TBD",
      customer:form.order_type === "Stock" ? "Stock" : (form.customer || ""),
      customer_phone:form.customer_phone || "",
      customer_email:form.customer_email || "",
      shipping_address:form.shipping_address || "",
      due_date:form.due_date || null,
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
      construction_note:form.construction_note || construction || defaultBuildSpecification(form.drum_type,form.build_type),
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
    const allowed=["Completed","Sold","Shipped","Archived"];
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
          : status==="Shipped"
            ? "Confirm delivery / archive"
            : "Archived",
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
          : status==="Shipped"
            ? "Saved — drum marked Shipped."
            : "Saved — drum closed and moved to the Drum Archive."
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

  async function createFutureProject(form){
    const payload={
      title:String(form.title||"").trim(),
      stage:form.stage||"Idea captured",
      preferred_order:form.preferred_order||"Someday / no timeframe",
      next_action:String(form.next_action||"").trim(),
      notes:String(form.notes||"").trim(),
    };
    if(!payload.title){
      setMessage("Please enter a future project title.");
      return false;
    }

    const {data,error}=await supabase.from("future_projects").insert(payload).select("*").single();
    if(error){
      setMessage("Could not create future project: "+error.message);
      return false;
    }
    setFutureProjects(current=>[data,...current]);
    setShowFutureProjectModal(false);
    setEditingFutureProject(null);
    setMessage("");
    return true;
  }

  async function updateFutureProject(id,patch){
    const {data,error}=await supabase
      .from("future_projects")
      .update({...patch,updated_at:new Date().toISOString()})
      .eq("id",id)
      .select("*")
      .single();
    if(error){
      setMessage("Could not update future project: "+error.message);
      return false;
    }
    setFutureProjects(current=>current.map(item=>item.id===id?data:item));
    setShowFutureProjectModal(false);
    setEditingFutureProject(null);
    setMessage("");
    return true;
  }

  async function deleteFutureProject(id){
    if(!window.confirm("Delete this future project?")) return;
    const {error}=await supabase.from("future_projects").delete().eq("id",id);
    if(error){
      setMessage("Could not delete future project: "+error.message);
      return;
    }
    setFutureProjects(current=>current.filter(item=>item.id!==id));
  }

  async function createWorkshopTask(form){
    const payload={
      title:String(form.title||"").trim(),
      notes:String(form.notes||"").trim(),
      estimated_minutes:Number(form.estimated_minutes||0),
      recurrence:form.recurrence||"None",
      next_due_date:form.next_due_date||localISODate(0),
      status:"Active",
    };
    if(!payload.title){
      setMessage("Please enter a workshop task.");
      return false;
    }

    const {data,error}=await supabase.from("workshop_tasks").insert(payload).select("*").single();
    if(error){
      setMessage("Could not create workshop task: "+error.message);
      return false;
    }
    setWorkshopTasks(current=>[...current,data].sort((a,b)=>String(a.next_due_date).localeCompare(String(b.next_due_date))));
    setShowAddWorkshopTask(false);
    setEditingWorkshopTask(null);
    setMessage("");
    return true;
  }

  async function updateWorkshopTask(id,patch){
    const {data,error}=await supabase
      .from("workshop_tasks")
      .update({...patch,updated_at:new Date().toISOString()})
      .eq("id",id)
      .select("*")
      .single();

    if(error){
      setMessage("Could not update workshop task: "+error.message);
      return false;
    }
    setWorkshopTasks(current=>current.map(item=>item.id===id?data:item));
    setEditingWorkshopTask(null);
    setMessage("");
    return true;
  }

  async function completeWorkshopTask(task){
    const today=localISODate(0);
    if(task.recurrence==="None"){
      return updateWorkshopTask(task.id,{
        status:"Done",
        last_completed_date:today,
      });
    }

    return updateWorkshopTask(task.id,{
      status:"Active",
      last_completed_date:today,
      next_due_date:nextWorkshopTaskDate(task,task.next_due_date || today),
    });
  }

  async function moveWorkshopTaskToTomorrow(task){
    return updateWorkshopTask(task.id,{
      status:"Active",
      next_due_date:localISODate(1),
    });
  }

  async function deleteWorkshopTask(id){
    if(!window.confirm("Delete this workshop task?")) return;
    const {error}=await supabase.from("workshop_tasks").delete().eq("id",id);
    if(error){
      setMessage("Could not delete workshop task: "+error.message);
      return;
    }
    setWorkshopTasks(current=>current.filter(item=>item.id!==id));
    setEditingWorkshopTask(null);
  }

  async function addDrumsToPlan(drumsToAdd,plannedDate=localISODate(1),batchName=""){
    const rows=drumsToAdd
      .map(drum=>{
        const details=planDetailsForDrum(drum);
        if(!details) return null;
        return {
          drum_id:drum.id,
          planned_date:plannedDate,
          task_item:details.task_item,
          task_label:details.task_label,
          estimated_hours:details.estimated_hours,
          drum_label:details.drum_label,
          batch_name:batchName || batchType(drum) || "",
          status:"Planned",
        };
      })
      .filter(Boolean);

    if(!rows.length){
      setMessage("There are no eligible next-stage tasks to add.");
      return false;
    }

    const {data,error}=await supabase
      .from("work_plan_items")
      .upsert(rows,{onConflict:"drum_id,planned_date,task_item",ignoreDuplicates:true})
      .select("*");

    if(error){
      setMessage("Could not add work to the plan: "+error.message);
      return false;
    }

    setWorkPlan(current=>{
      const map=new Map(current.map(item=>[item.id,item]));
      (data||[]).forEach(item=>map.set(item.id,item));
      return [...map.values()];
    });
    setMessage(`${rows.length} task${rows.length===1?"":"s"} added to ${friendlyPlanDate(plannedDate).toLowerCase()}.`);
    return true;
  }

  async function updatePlanItem(id,patch){
    const {data,error}=await supabase.from("work_plan_items").update(patch).eq("id",id).select("*").single();
    if(error){
      setMessage("Could not update planned work: "+error.message);
      return false;
    }
    setWorkPlan(current=>current.map(item=>item.id===id?data:item));
    setMessage("");
    return true;
  }

  async function completePlannedWork(item){
    if(item.status==="Done"){
      return updatePlanItem(item.id,{status:"Planned"});
    }

    const drum=drums.find(d=>d.id===item.drum_id);
    if(!drum){
      setMessage("The planned drum could not be found.");
      return false;
    }

    const checked=parseChecked(drum.notes);
    const flow=workflowState(drum.build_type || "Stave",checked,drum.finish,drum.build_client,drum.drum_type,drum.size);
    const currentTask=flow.steps[flow.completedCount] || "";

    if(currentTask && item.task_item && currentTask!==item.task_item){
      const proceed=window.confirm(
        `This drum is now at "${checklistDisplayLabel(currentTask,drum.build_type||"Stave")}", but the plan item is "${item.task_label}".\n\nProgress the drum's current workflow stage anyway?`
      );
      if(!proceed) return false;
    }

    const progressed=await progressDrumFromCard(drum);
    if(!progressed) return false;

    return updatePlanItem(item.id,{status:"Done"});
  }

  async function removePlanItem(id){
    const {error}=await supabase.from("work_plan_items").delete().eq("id",id);
    if(error){
      setMessage("Could not remove planned work: "+error.message);
      return;
    }
    setWorkPlan(current=>current.filter(item=>item.id!==id));
  }

  async function rollPlanItems(items,targetDate=localISODate(1)){
    const unfinished=items.filter(item=>item.status!=="Done");
    if(!unfinished.length){
      setMessage("There is no unfinished work to roll forward.");
      return;
    }
    const rows=unfinished.map(item=>({
      drum_id:item.drum_id,
      planned_date:targetDate,
      task_item:item.task_item,
      task_label:item.task_label,
      estimated_hours:item.estimated_hours,
      drum_label:item.drum_label,
      batch_name:item.batch_name,
      status:"Planned",
    }));
    const {data,error}=await supabase
      .from("work_plan_items")
      .upsert(rows,{onConflict:"drum_id,planned_date,task_item",ignoreDuplicates:true})
      .select("*");
    if(error){
      setMessage("Could not roll work forward: "+error.message);
      return;
    }
    setWorkPlan(current=>{
      const map=new Map(current.map(item=>[item.id,item]));
      (data||[]).forEach(item=>map.set(item.id,item));
      return [...map.values()];
    });
    setMessage(`${unfinished.length} unfinished task${unfinished.length===1?"":"s"} moved to tomorrow.`);
  }

  async function createRepair(form){
    const payload={
      job_number:form.job_number || nextRepairNumber(repairs),
      customer_name:form.customer_name || "",
      phone:form.phone || "",
      email:form.email || "",
      drum_brand:form.drum_brand || "",
      drum_description:form.drum_description || "",
      services:form.services || [],
      notes:form.notes || "",
      agreed_price:Number(form.agreed_price || 0),
      status:form.status || "Received",
      date_received:form.date_received || new Date().toISOString().slice(0,10),
      due_date:form.due_date || null,
    };
    const {data,error}=await supabase.from("repair_jobs").insert(payload).select("*").single();
    if(error){
      setMessage("Could not create repair job: "+error.message);
      return false;
    }
    setRepairs(current=>[data,...current]);
    setShowAddRepair(false);
    setRepairJob(data);
    setView("repairs");
    setMessage("");
    return true;
  }

  async function updateRepair(id,patch){
    const clean={...patch,updated_at:new Date().toISOString()};
    if("due_date" in clean) clean.due_date=clean.due_date || null;
    if(clean.status==="Ready for Collection" && !clean.completed_at) clean.completed_at=new Date().toISOString();
    if(clean.status==="Collected & Paid" && !clean.paid_at) clean.paid_at=new Date().toISOString();

    const {data,error}=await supabase.from("repair_jobs").update(clean).eq("id",id).select("*").single();
    if(error){
      setMessage("Could not update repair job: "+error.message);
      return false;
    }
    setRepairs(current=>current.map(item=>item.id===id ? data : item));
    setRepairJob(current=>current?.id===id ? data : current);
    setMessage("");
    return true;
  }

  async function deleteRepair(id){
    if(!window.confirm("Delete this repair job? This cannot be undone.")) return;
    const {error}=await supabase.from("repair_jobs").delete().eq("id",id);
    if(error){
      setMessage("Could not delete repair job: "+error.message);
      return;
    }
    setRepairs(current=>current.filter(item=>item.id!==id));
    setRepairJob(null);
  }

  async function archiveDrum(d){
    const options=d.build_client==="Brady"
      ? "Collected by CB"
      : isShippedStatus(d)
        ? "Delivered to customer"
        : "Collected by customer";

    const reasonEntry=window.prompt(
      "How was this job completed?\n\nExamples: Collected by CB, Collected by customer, Delivered to customer, Other",
      options
    );
    if(reasonEntry===null) return false;

    const reason=String(reasonEntry||"Job closed").trim() || "Job closed";
    const previous=drumLifecycleStatus(d) || "Completed";
    const notes=setArchiveDetailsInNotes(d.notes,{
      reason,
      date:new Date().toISOString(),
      previous
    });
    const saved=await setDrumLifecycle(d,"Archived",{notes});
    if(saved){
      setWorkPlan(current=>current.filter(item=>item.drum_id!==d.id));
      await supabase.from("work_plan_items").delete().eq("drum_id",d.id);
    }
    return Boolean(saved);
  }

  async function restoreArchivedDrum(d){
    const details=archiveDetailsFromNotes(d.notes);
    const restoreTo=["Completed","Sold","Shipped"].includes(details.previous)
      ? details.previous
      : "Completed";
    if(!window.confirm(`Restore this drum from the archive as ${restoreTo}?`)) return false;
    const notes=clearArchiveDetailsFromNotes(d.notes);
    return setDrumLifecycle(d,restoreTo,{notes});
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
        <div><h1>Nowak Workshop OS</h1><p>v7.5.7 — Cleaner stage galleries and sortable archived drums.</p></div>
      </div>
      <button onClick={loadAll}><RefreshCw size={16}/> Refresh</button>
    </header>

    {message && <section className="panel warning">{message}</section>}

    <nav>
      <button className={view==="dashboard"?"active":""} onClick={()=>setView("dashboard")}><LayoutDashboard size={16}/> Dashboard</button>
      <button className={view==="today"?"active":""} onClick={()=>setView("today")}><Hammer size={16}/> Workshop Today</button>
      <button className={view==="production"?"active":""} onClick={()=>setView("production")}><ListChecks size={16}/> Production</button>
      <button className={view==="register"?"active":""} onClick={()=>setView("register")}><ClipboardList size={16}/> Drum Register</button>
      <button className={view==="historical"?"active":""} onClick={()=>setView("historical")}><Archive size={16}/> Historical Import</button>
      <button className={view==="projects"?"active":""} onClick={()=>setView("projects")}><Layers3 size={16}/> Kits / Projects</button>
      <button className={view==="future"?"active":""} onClick={()=>setView("future")}><Lightbulb size={16}/> Future Projects</button>
      <button className={view==="orders"?"active":""} onClick={()=>setView("orders")}><Users size={16}/> Customers & Orders</button>
      <button className={view==="repairs"?"active":""} onClick={()=>setView("repairs")}><Wrench size={16}/> Repairs & Modifications</button>
      <button className={view==="veneer"?"active":""} onClick={()=>setView("veneer")}><Ruler size={16}/> Veneer Calc</button>
      <button className={view==="inventory"?"active":""} onClick={()=>setView("inventory")}><Package size={16}/> Inventory</button>
      <button className={view==="costing"?"active":""} onClick={()=>setView("costing")}><DollarSign size={16}/> Costing</button>
      <button className={view==="summary"?"active":""} onClick={()=>setView("summary")}><BarChart3 size={16}/> Workshop Summary</button>
      <button className={view==="comms"?"active":""} onClick={()=>setView("comms")}><Mail size={16}/> Comms & Marketing</button>
      <button className={view==="settings"?"active":""} onClick={()=>setView("settings")}><Settings size={16}/> Settings</button>
      <button onClick={()=>{setAddWizardPreset({});setShowAddWizard(true);}}><Plus size={16}/> Add Drum</button>
    </nav>

    {view!=="register" && <div className="searchBar"><Search size={16}/><input placeholder="Search drums, timber, customer, CB number, email, status..." value={search} onChange={e=>setSearch(e.target.value)}/></div>}
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
        <button className="dashboardStatCard" onClick={()=>setView("repairs")}>
          <b>{activeRepairs.length}</b><span>Active repair jobs</span>
        </button>
        <button className="dashboardStatCard" onClick={()=>setView("repairs")}>
          <b>{readyRepairs.length}</b><span>Repairs ready for collection</span>
        </button>
        <button className="dashboardStatCard" onClick={()=>setView("repairs")}>
          <b>{money(repairIncome)}</b><span>Repair income</span>
        </button>
        <button className="dashboardStatCard" onClick={()=>setView("today")}>
          <b>{tomorrowPlan.length}</b><span>Tasks planned tomorrow</span>
          <small>{formatPlanTime(tomorrowPlanHours)}</small>
        </button>
        <button className="dashboardStatCard" onClick={()=>openProductionView({status:"Archived",construction:"All"})}>
          <b>{archivedDrums.length}</b><span>Archived drums</span>
        </button>
        <button className="dashboardStatCard" onClick={()=>setView("today")}>
          <b>{todayWorkshopTasks.length}</b><span>Workshop tasks due</span>
          <small>{formatPlanTime(todayWorkshopTaskMinutes/60)}</small>
        </button>
        <button className="dashboardStatCard" onClick={()=>setView("future")}>
          <b>{futureProjects.filter(p=>p.stage!=="Completed" && p.stage!=="Parked").length}</b><span>Future projects</span>
        </button>
      </section>

      <section className="quickGrid dashboardQuickGrid">
        <article className="panel" onClick={()=>setView("comms")}><h2>Comms & Marketing</h2><b className="bigNumber">{photoQueue}</b><p>Open the content queue to review stored milestone media and social posts.</p></article>
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
                    <b>{drum.serial ? `#${drum.serial}` : "Pending"} {drum.timber}</b>
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

    {view==="today" && <>
      <DailyWorkPlan
        workPlan={workPlan}
        drums={operationalDrums}
        openJobCard={setJobCard}
        updatePlanItem={updatePlanItem}
        completePlannedWork={completePlannedWork}
        removePlanItem={removePlanItem}
        rollPlanItems={rollPlanItems}
      />
      <WorkshopTasksPanel
        tasks={workshopTasks}
        addTask={()=>{setEditingWorkshopTask(null);setShowAddWorkshopTask(true);}}
        editTask={task=>{setEditingWorkshopTask(task);setShowAddWorkshopTask(true);}}
        completeTask={completeWorkshopTask}
        moveToTomorrow={moveWorkshopTaskToTomorrow}
        deleteTask={deleteWorkshopTask}
      />
      <section className="batchGrid">
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
              plannedDates={plannedDatesByDrum[d.id]||[]}
              scheduledTask={activePlanByDrum[d.id]?.[0]?.task_label||""}
              scheduleDrum={(drum,date)=>addDrumsToPlan([drum],date,batchType(drum)||"")}
            />)}
        </div>
      </section>}

      {Object.entries(batches).sort(([a],[b])=>workshopBatchPriority(a)-workshopBatchPriority(b)).map(([name,items])=>{
        const projectMap=Object.fromEntries(projects.map(p=>[p.id,p.name]));
        const grouped={};

        items
          .sort(workshopDrumPriorityCompare)
          .forEach(d=>{
            const groupName=d.project_id ? (projectMap[d.project_id] || "Kit / Project") : "Individual Drums";
            grouped[groupName] ??=[];
            grouped[groupName].push(d);
          });

        return <section className="panel todayTaskPanel" key={name}>
          <div className="todayBatchHeader">
            <h2>{name} <span className="taskCount">({items.length})</span></h2>
            {!String(name).toLowerCase().includes("curing") && <ScheduleWorkControl
              label="Schedule Batch"
              onSchedule={date=>addDrumsToPlan(items,date,name)}
              compact
            />}
          </div>

          {Object.entries(grouped).map(([groupName,groupItems])=>
            <section className={"todayProjectGroup "+(groupName==="Individual Drums"?"individualTodayGroup":"")} key={groupName}>
              <h3>{groupName}</h3>
              <div className="todayDrumGrid">
                {groupItems.map(d=>{
                  const flow=workflowState(d.build_type||"Stave",parseChecked(d.notes),d.finish,d.build_client,d.drum_type,d.size);
                  const plannedDates=plannedDatesByDrum[d.id] || [];
                  const scheduled=plannedDates.length>0;
                  const firstPlan=activePlanByDrum[d.id]?.[0];
                  return <article className={"card " + (d.build_client==="Brady"?"bradyCard":d.build_client==="Nowak"?"nowakCard":"unallocatedCard") + (scheduled?" scheduledTomorrowCard":"")} key={d.id}>
                    <div className="cardHeading">
                      <b>{d.serial ? `#${d.serial}` : "Pending"} {d.timber}</b>
                      {allocatedCustomerName(d) && <span className="customerNameBadge">{allocatedCustomerName(d)}</span>}
                    </div>
                    {d.build_client==="Brady" && <span className="cbBadge">CB {d.cb_number || "No CB #"}</span>}
                    <span>{d.size} · {d.drum_type || "Snare"} · {d.build_type}</span>
                    <span className="badge">{displaySalesBadge(d)}</span>
                    <div className="progress"><i style={{width:flow.percent+"%"}}></i></div>
                    <p><b>Status:</b> {flow.status}</p>
                    <p><b>Next:</b> {flow.nextStep}</p>
                    {cureStatusForDrum(d) && <div className={"cureStatusCard "+(cureStatusForDrum(d).ready?"cureReady":"cureWaiting")}>
                      <Clock size={15}/>
                      <div>
                        <b>{cureDisplayText(cureStatusForDrum(d))}</b>
                        <span>Ready date: {formatStageDate(cureStatusForDrum(d).readyAt)}</span>
                      </div>
                    </div>}
                    {scheduled && <div className="scheduledTomorrowBadge"><CalendarDays size={14}/><span>Scheduled: {plannedDates.map(friendlyPlanDate).join(", ")}{firstPlan?.task_label?` · ${firstPlan.task_label}`:""}</span></div>}
                    {flow.nextStep!=="Complete" && (!cureStatusForDrum(d) || cureStatusForDrum(d).ready) && <ScheduleWorkControl
                      label="Schedule Work"
                      onSchedule={date=>addDrumsToPlan([d],date,name)}
                      scheduledDates={plannedDates}
                    />}
                    {flow.nextStep!=="Complete" && <button type="button" className="primary" disabled={progressingDrumId===d.id || Boolean(cureStatusForDrum(d) && !cureStatusForDrum(d).ready)} onClick={()=>progressDrumFromCard(d)}><CheckCircle2 size={15}/> {progressingDrumId===d.id ? "Progressing..." : cureStatusForDrum(d) && !cureStatusForDrum(d).ready ? "Curing — not ready" : `Progress: ${flow.nextStep}`}</button>}
                    <button type="button" onClick={()=>setGlobalPhotoPrompt({drum:d,milestoneKey:"general"})}><Camera size={15}/> Add Photo</button>
                    <button type="button" onClick={()=>setJobCard(d)}>Open job card</button>
                  </article>
                })}
              </div>
            </section>
          )}
        </section>
      })}
      </section>
    </>}

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
            {["All","Pending","Active","Completed","Sold","Shipped","Archived"].map(f=>
              <button key={f} className={productionFilter===f?"primary":""} onClick={()=>setProductionFilter(f)}>{f}</button>
            )}
          </div>
        </div>
      </section>

      {productionFilter==="Archived"
        ? <DrumArchive
            drums={archivedDrums.filter(d=>
              JSON.stringify(d).toLowerCase().includes(search.toLowerCase()) &&
              (constructionFilter==="All" || d.build_type===constructionFilter)
            )}
            openJobCard={setJobCard}
            restoreArchivedDrum={restoreArchivedDrum}
            embedded
          />
        : <ProductionGroups
            drums={[...filtered]
              .sort(productionPriorityCompare)
              .filter(d=>{
                if(isArchivedStatus(d)) return false;
                if(constructionFilter!=="All" && d.build_type!==constructionFilter) return false;

                const lifecycle=drumLifecycleStatus(d);
                if(productionFilter==="Pending") return !hasWorkflowStarted(d) && !["Completed","Sold","Shipped","Archived"].includes(lifecycle);
                if(productionFilter==="Active") return hasWorkflowStarted(d) && !["Completed","Sold","Shipped","Archived"].includes(lifecycle);
                if(productionFilter==="Completed") return lifecycle==="Completed" || (isManufacturingComplete(d) && !["Sold","Shipped","Archived"].includes(lifecycle));
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
            scheduleDrum={(drum,date)=>addDrumsToPlan([drum],date,batchType(drum)||"")}
            scheduleBatch={(items,name,date)=>addDrumsToPlan(items,date,name)}
            plannedDatesByDrum={plannedDatesByDrum}
            activePlanByDrum={activePlanByDrum}
          />}
    </section>}

    {view==="register" && <DrumRegister drums={drums} openJobCard={setJobCard}/>}
    {view==="historical" && <HistoricalDrumImport
      sourceRecords={historicalDrumRecords}
      drums={drums}
      importRecords={importHistoricalDrums}
      openJobCard={setJobCard}
    />}
    {view==="projects" && <ProjectsPage projects={projects} drums={drums} openJobCard={setJobCard} createProject={createProject} updateProject={updateProject} linkDrumsToProject={linkDrumsToProject} unlinkDrumFromProject={unlinkDrumFromProject}/>}
    {view==="future" && <FutureProjectsPage
      projects={futureProjects}
      addProject={()=>{setEditingFutureProject(null);setShowFutureProjectModal(true);}}
      editProject={project=>{setEditingFutureProject(project);setShowFutureProjectModal(true);}}
      deleteProject={deleteFutureProject}
    />}

    {view==="orders" && <Orders drums={filtered} openJobCard={setJobCard}/>}
    {view==="repairs" && <RepairsPage repairs={repairs} openRepair={setRepairJob} addRepair={()=>setShowAddRepair(true)}/>}
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
    {showAddWorkshopTask && <WorkshopTaskModal
      task={editingWorkshopTask}
      onClose={()=>{setShowAddWorkshopTask(false);setEditingWorkshopTask(null);}}
      onCreate={createWorkshopTask}
      onUpdate={updateWorkshopTask}
    />}
    {showFutureProjectModal && <FutureProjectModal
      project={editingFutureProject}
      onClose={()=>{setShowFutureProjectModal(false);setEditingFutureProject(null);}}
      onCreate={createFutureProject}
      onUpdate={updateFutureProject}
    />}
    {showAddRepair && <AddRepairModal repairs={repairs} onClose={()=>setShowAddRepair(false)} onCreate={createRepair}/>}
    {repairJob && <RepairJobModal repair={repairJob} onClose={()=>setRepairJob(null)} updateRepair={updateRepair} deleteRepair={deleteRepair} setMessage={setMessage}/>}
    {jobCard && <JobCard drum={jobCard} template={templateMap[jobCard.template_name]} labourRate={labourRate} onClose={()=>setJobCard(null)} updateDrum={updateDrum} completeDrum={completeDrum} addTime={addTime} markSold={markSold} markShipped={markShipped} archiveDrum={archiveDrum} restoreArchivedDrum={restoreArchivedDrum} setDrumLifecycle={setDrumLifecycle} copyText={copyText} deleteDrum={deleteDrum} drums={drums} projects={projects} createProject={createProject} setMessage={setMessage} onAddDrumToProject={(projectId,sourceDrum)=>{setAddWizardPreset({project_id:projectId,build_client:sourceDrum.build_client||"Unallocated",customer:sourceDrum.customer||"",customer_email:sourceDrum.customer_email||"",shipping_address:sourceDrum.shipping_address||"",due_date:sourceDrum.due_date||"",finish:sourceDrum.finish||"To Be Decided"});setJobCard(null);setShowAddWizard(true);}}/>}
  </main>
}


function WorkshopTasksPanel({tasks,addTask,editTask,completeTask,moveToTomorrow,deleteTask}){
  const today=localISODate(0);
  const tomorrow=localISODate(1);
  const dueToday=tasks.filter(task=>workshopTaskDue(task,today));
  const dueTomorrow=tasks.filter(task=>task.status!=="Done" && task.next_due_date===tomorrow);
  const upcoming=tasks
    .filter(task=>task.status!=="Done" && task.next_due_date>tomorrow)
    .slice(0,6);
  const recentlyCompleted=tasks
    .filter(task=>task.status==="Done")
    .sort((a,b)=>String(b.last_completed_date||b.updated_at||"").localeCompare(String(a.last_completed_date||a.updated_at||"")))
    .slice(0,12);
  const todayMinutes=dueToday.reduce((sum,task)=>sum+Number(task.estimated_minutes||0),0);

  function taskCard(task,showTomorrow=false){
    const overdue=task.next_due_date<today;
    return <article className={"workshopTaskCard "+(overdue?"overdueWorkshopTask":"")} key={task.id}>
      <button className="workshopTaskCheck" onClick={()=>completeTask(task)} title="Mark complete"><CircleCheckBig size={21}/></button>
      <div className="workshopTaskInfo">
        <b>{task.title}</b>
        <div className="workshopTaskMeta">
          <span>{workshopTaskRecurrenceLabel(task)}</span>
          <span>{Number(task.estimated_minutes||0)} min</span>
          {overdue && <span className="overdueLabel">Overdue</span>}
          {showTomorrow && <span>Tomorrow</span>}
        </div>
        {task.notes && <p>{task.notes}</p>}
      </div>
      <div className="workshopTaskActions">
        <button onClick={()=>editTask(task)}>Edit</button>
        {!showTomorrow && <button onClick={()=>moveToTomorrow(task)}><RotateCcw size={14}/> Tomorrow</button>}
        <button className="dangerButton" onClick={()=>deleteTask(task.id)}><Trash2 size={14}/></button>
      </div>
    </article>;
  }

  return <section className="panel workshopTasksPanel">
    <header className="workshopTasksHeader">
      <div>
        <span className="launchPackEyebrow">NON-DRUM WORK</span>
        <h2>Workshop Tasks</h2>
        <p>{dueToday.length} due today · approximately <b>{formatPlanTime(todayMinutes/60)}</b></p>
      </div>
      <button className="primary" onClick={addTask}><Plus size={16}/> Add Workshop Task</button>
    </header>

    {dueToday.length===0
      ? <div className="emptyWorkshopTasks"><ClipboardList size={24}/><p>No workshop tasks are due today.</p></div>
      : <div className="workshopTaskList">{dueToday.map(task=>taskCard(task))}</div>}

    {(dueTomorrow.length>0 || upcoming.length>0) && <details className="upcomingWorkshopTasks">
      <summary>Upcoming workshop tasks ({dueTomorrow.length+upcoming.length})</summary>
      <div className="workshopTaskList">
        {dueTomorrow.map(task=>taskCard(task,true))}
        {upcoming.map(task=><article className="workshopTaskCard upcomingTaskCard" key={task.id}>
          <Repeat2 size={18}/>
          <div className="workshopTaskInfo">
            <b>{task.title}</b>
            <span>{task.next_due_date} · {workshopTaskRecurrenceLabel(task)} · {Number(task.estimated_minutes||0)} min</span>
          </div>
          <div className="workshopTaskActions"><button onClick={()=>editTask(task)}>Edit</button><button className="dangerButton" onClick={()=>deleteTask(task.id)}><Trash2 size={14}/></button></div>
        </article>)}
      </div>
    </details>}

    {recentlyCompleted.length>0 && <details className="upcomingWorkshopTasks completedWorkshopTasks">
      <summary>Recently Completed Tasks ({recentlyCompleted.length})</summary>
      <div className="workshopTaskList">
        {recentlyCompleted.map(task=><article className="workshopTaskCard completedTaskCard" key={task.id}>
          <CircleCheckBig size={19}/>
          <div className="workshopTaskInfo">
            <b>{task.title}</b>
            <span>Completed {task.last_completed_date || "recently"} · {Number(task.estimated_minutes||0)} min</span>
            {task.notes && <p>{task.notes}</p>}
          </div>
          <div className="workshopTaskActions">
            <button onClick={()=>editTask(task)}>Edit</button>
            <button className="dangerButton" onClick={()=>deleteTask(task.id)}><Trash2 size={14}/></button>
          </div>
        </article>)}
      </div>
    </details>}
  </section>;
}

function WorkshopTaskModal({task,onClose,onCreate,onUpdate}){
  const [form,setForm]=useState({
    title:task?.title||"",
    notes:task?.notes||"",
    estimated_minutes:Number(task?.estimated_minutes||15),
    recurrence:task?.recurrence||"None",
    next_due_date:task?.next_due_date||localISODate(0),
  });
  const [saving,setSaving]=useState(false);

  function applyPreset(preset){
    setForm(current=>({...current,title:preset.title,estimated_minutes:preset.estimated_minutes}));
  }

  async function save(){
    if(!form.title.trim()){
      alert("Please enter the task name.");
      return;
    }
    setSaving(true);
    if(task){
      await onUpdate(task.id,{
        title:form.title.trim(),
        notes:form.notes.trim(),
        estimated_minutes:Number(form.estimated_minutes||0),
        recurrence:form.recurrence,
        next_due_date:form.next_due_date,
        status:"Active",
      });
    }else{
      await onCreate(form);
    }
    setSaving(false);
  }

  return <div className="modalBg" onClick={onClose}><div className="modal workshopTaskModal" onClick={e=>e.stopPropagation()}>
    <button className="close" onClick={onClose}>×</button>
    <span className="launchPackEyebrow">{task?"EDIT TASK":"NEW WORKSHOP TASK"}</span>
    <h2>{task?"Edit Workshop Task":"Add Workshop Task"}</h2>

    {!task && <section className="taskPresetSection">
      <p>Quick choices</p>
      <div className="taskPresetGrid">{workshopTaskPresets.map(preset=><button key={preset.title} onClick={()=>applyPreset(preset)}>{preset.title}<small>{preset.estimated_minutes} min</small></button>)}</div>
    </section>}

    <label>Task</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Clean dust extractors"/>
    <label>Notes (optional)</label><textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Any useful detail..."/>

    <section className="workshopTaskFormGrid">
      <label>Estimated time
        <select value={form.estimated_minutes} onChange={e=>setForm({...form,estimated_minutes:Number(e.target.value)})}>
          {[5,10,15,20,30,45,60,90,120].map(minutes=><option key={minutes} value={minutes}>{minutes<60?`${minutes} minutes`:formatPlanTime(minutes/60)}</option>)}
        </select>
      </label>
      <label>Repeat
        <select value={form.recurrence} onChange={e=>setForm({...form,recurrence:e.target.value})}>
          <option value="None">One-off</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
        </select>
      </label>
      <label>{form.recurrence==="None"?"Due date":"Next due date"}
        <input type="date" value={form.next_due_date} onChange={e=>setForm({...form,next_due_date:e.target.value})}/>
      </label>
    </section>

    {form.recurrence!=="None" && <p className="calcNote">Once completed, this task will automatically return on the next {form.recurrence.toLowerCase()} date.</p>}

    <div className="buttonRow">
      <button onClick={onClose}>Cancel</button>
      <button className="primary" disabled={saving} onClick={save}><Save size={16}/> {saving?"Saving...":task?"Save Task":"Add Task"}</button>
    </div>
  </div></div>;
}


function SprayMixCalculator({batchName,count}){
  const [wastage,setWastage]=useState(0);
  const mix=sprayMixForBatch(batchName,count);
  if(!mix) return null;

  const multiplier=1+(Number(wastage||0)/100);
  const base=mix.base*multiplier;
  const hardener=mix.hardener*multiplier;
  const combined=base+hardener;
  const thinners=combined*(mix.thinnerPercent/100);
  const total=combined+thinners;

  return <section className="sprayMixCard">
    <header>
      <div>
        <span className="launchPackEyebrow">BATCH MIX CALCULATOR</span>
        <h3>{mix.label} — {mix.drums} drum{mix.drums===1?"":"s"}</h3>
      </div>
      <label>Extra allowance
        <select value={wastage} onChange={e=>setWastage(Number(e.target.value))}>
          <option value={0}>0%</option>
          <option value={5}>5%</option>
          <option value={10}>10%</option>
        </select>
      </label>
    </header>
    <div className="sprayMixGrid">
      <div><span>{mix.product}</span><b>{formatMixMl(base)}</b></div>
      <div><span>{mix.hardener}</span><b>{formatMixMl(hardener)}</b></div>
      <div><span>Base mixture</span><b>{formatMixMl(combined)}</b></div>
      <div><span>Thinners ({mix.thinnerPercent}%)</span><b>{formatMixMl(thinners)}</b></div>
      <div className="sprayMixTotal"><span>Total mixed volume</span><b>{formatMixMl(total)}</b></div>
    </div>
    <p>
      {formatMixMl(base)} + {formatMixMl(hardener)} = {formatMixMl(combined)}
      {mix.thinnerPercent>0 ? ` + ${mix.thinnerPercent}% (${formatMixMl(thinners)}) = ${formatMixMl(total)}` : ` total = ${formatMixMl(total)}`}
    </p>
  </section>;
}

function ScheduleWorkControl({label="Schedule Work",onSchedule,scheduledDates=[],compact=false}){
  const [choice,setChoice]=useState("");
  const [customDate,setCustomDate]=useState("");

  async function schedule(value){
    let date=value;
    if(value==="today") date=localISODate(0);
    if(value==="tomorrow") date=localISODate(1);
    if(value==="date"){
      setChoice("date");
      return;
    }
    if(!date) return;
    await onSchedule?.(date);
    setChoice("");
    setCustomDate("");
  }

  return <div className={"scheduleWorkControl "+(compact?"compactScheduleControl":"")}>
    <div className="scheduleSelectWrap">
      <CalendarDays size={15}/>
      <select value={choice} onChange={e=>{setChoice(e.target.value);schedule(e.target.value);}}>
        <option value="">{label}</option>
        <option value="today" disabled={scheduledDates.includes(localISODate(0))}>Today{scheduledDates.includes(localISODate(0))?" — scheduled":""}</option>
        <option value="tomorrow" disabled={scheduledDates.includes(localISODate(1))}>Tomorrow{scheduledDates.includes(localISODate(1))?" — scheduled":""}</option>
        <option value="date">Choose date…</option>
      </select>
    </div>
    {choice==="date" && <div className="customScheduleDate">
      <input type="date" min={localISODate(0)} value={customDate} onChange={e=>setCustomDate(e.target.value)}/>
      <button type="button" className="primary" disabled={!customDate || scheduledDates.includes(customDate)} onClick={()=>schedule(customDate)}>
        {scheduledDates.includes(customDate)?"Already Scheduled":"Add"}
      </button>
    </div>}
  </div>;
}

function DailyWorkPlan({workPlan,drums,openJobCard,updatePlanItem,completePlannedWork,removePlanItem,rollPlanItems}){
  const drumMap=Object.fromEntries(drums.map(d=>[d.id,d]));
  const today=localISODate(0);
  const tomorrow=localISODate(1);

  function PlanSection({date,title}){
    const activeDrumIds=new Set(drums.map(drum=>drum.id));
    const items=workPlan.filter(item=>item.planned_date===date && activeDrumIds.has(item.drum_id));
    const unfinished=items.filter(item=>item.status!=="Done");
    const totalHours=unfinished.reduce((sum,item)=>sum+Number(item.estimated_hours||0),0);
    const grouped={};
    items.forEach(item=>{
      const key=item.batch_name || item.task_label || "Planned Work";
      grouped[key] ??=[];
      grouped[key].push(item);
    });

    return <section className="panel dailyPlanPanel">
      <header className="dailyPlanHeader">
        <div>
          <span className="launchPackEyebrow">{date===today?"WORKSHOP PLAN":"NEXT DAY PLAN"}</span>
          <h2>{title}</h2>
          <p>{unfinished.length} unfinished task{unfinished.length===1?"":"s"} · approximately <b>{formatPlanTime(totalHours)}</b></p>
          {date===today && <small className="planProgressNote">Ticking a planned drum task complete also advances its Job Card to the next production stage.</small>}
        </div>
        {date===today && unfinished.length>0 && <button onClick={()=>rollPlanItems(unfinished,tomorrow)}><RotateCcw size={15}/> Move Unfinished to Tomorrow</button>}
      </header>

      {items.length===0
        ? <div className="emptyPlan"><CalendarDays size={24}/><p>No work deliberately planned for this day yet.</p></div>
        : <div className="dailyPlanGroups">{Object.entries(grouped).map(([group,groupItems])=>{
            const groupHours=groupItems.filter(i=>i.status!=="Done").reduce((sum,item)=>sum+Number(item.estimated_hours||0),0);
            const mixCount=groupItems.filter(i=>i.status!=="Done").length;
            const mixRecipe=sprayMixForBatch(group,mixCount);
            return <section className="dailyPlanGroup" key={group}>
              <header><div><h3>{group}</h3><span>{groupItems.length} drum{groupItems.length===1?"":"s"} · {formatPlanTime(groupHours)}</span></div></header>
              {mixRecipe && mixCount>0 && <SprayMixCalculator batchName={group} count={mixCount}/>}
              <div className="planItemList">{groupItems.map(item=>{
                const drum=drumMap[item.drum_id];
                return <article className={"planItem "+(item.status==="Done"?"planItemDone":"")} key={item.id}>
                  <button className="planCheck" title={item.status==="Done"?"Mark unfinished":"Complete task and progress drum"} onClick={()=>completePlannedWork(item)}>
                    <CircleCheckBig size={20}/>
                  </button>
                  <div className="planItemInfo">
                    <b>{item.drum_label}</b>
                    <span>{item.task_label}</span>
                  </div>
                  <strong>{formatPlanTime(item.estimated_hours)}</strong>
                  {drum && <button onClick={()=>openJobCard(drum)}>Open Drum</button>}
                  <button className="dangerButton" onClick={()=>removePlanItem(item.id)}><Trash2 size={14}/></button>
                </article>;
              })}</div>
            </section>;
          })}</div>}
    </section>;
  }

  return <section className="dailyPlanner">
    <PlanSection date={today} title="Today's Plan"/>
    <PlanSection date={tomorrow} title="Tomorrow's Plan"/>
  </section>;
}

function ProductionGroups({drums,projects,openJobCard,updateDrum,progressDrum,progressingDrumId,onAddPhoto,scheduleDrum,scheduleBatch,plannedDatesByDrum={},activePlanByDrum={}}){
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
        ? Math.round(items.reduce((sum,d)=>sum+workflowState(d.build_type||"Stave",parseChecked(d.notes),d.finish,d.build_client,d.drum_type,d.size).percent,0)/items.length)
        : 0;
      const complete=items.filter(d=>workflowState(d.build_type||"Stave",parseChecked(d.notes),d.finish,d.build_client,d.drum_type,d.size).percent===100).length;

      return <section className="kitProductionGroup" key={project.id}>
        <header className="kitGroupHeader">
          <div>
            <span className="kitEyebrow">KIT / PROJECT</span>
            <h2>{project.name}</h2>
            <p>{items.length} drums · {complete} completed · {overall}% overall</p>
          </div>
          <div className="kitGroupProgress">
            <div className="progress"><i style={{width:overall+"%"}}></i></div>
            <ScheduleWorkControl
              label="Schedule Kit"
              onSchedule={date=>scheduleBatch?.(items,project.name,date)}
              compact
            />
          </div>
        </header>
        <div className="productionList kitDrumGrid">
          {items.map(d=><DrumCard key={d.id} drum={d} openJobCard={openJobCard} updateDrum={updateDrum} progressDrum={progressDrum} progressing={progressingDrumId===d.id} onAddPhoto={onAddPhoto} scheduleDrum={scheduleDrum} plannedDates={plannedDatesByDrum[d.id]||[]} scheduledTask={activePlanByDrum[d.id]?.[0]?.task_label||""}/>)}
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
          .map(d=><DrumCard key={d.id} drum={d} openJobCard={openJobCard} updateDrum={updateDrum} progressDrum={progressDrum} progressing={progressingDrumId===d.id} onAddPhoto={onAddPhoto} scheduleDrum={scheduleDrum} plannedDates={plannedDatesByDrum[d.id]||[]} scheduledTask={activePlanByDrum[d.id]?.[0]?.task_label||""}/>)}
      </div>
    </section>}
  </section>
}


function DrumCard({drum, openJobCard, updateDrum, progressDrum, progressing=false, onAddPhoto, scheduleDrum, plannedDates=[], scheduledTask=""}){
  const checked=parseChecked(drum.notes);
  const flow=workflowState(drum.build_type || "Stave",checked,drum.finish,drum.build_client,drum.drum_type,drum.size);
  const cure=cureStatusForDrum(drum);

  const scheduled=plannedDates.length>0;
  return <article className={"card " + (drum.build_client==="Brady"?"bradyCard":drum.build_client==="Nowak"?"nowakCard":"unallocatedCard") + (scheduled?" scheduledTomorrowCard":"")}>
    <div className="cardHeading">
      <b>{drum.serial ? `#${drum.serial}` : "Pending"} {drum.timber}</b>
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
    {cure && <div className={"cureStatusCard "+(cure.ready?"cureReady":"cureWaiting")}>
      <Clock size={15}/>
      <div>
        <b>{cureDisplayText(cure)}</b>
        <span>Ready date: {formatStageDate(cure.readyAt)}</span>
      </div>
    </div>}
    <p><b>Estimated:</b> {flow.estimatedTotal.toFixed(2)} hr production · {flow.estimatedRemaining.toFixed(2)} hr remaining</p>
    <p><b>Actual:</b> {Number(drum.hours_logged||0).toFixed(2)} hr</p>
    {trackingNumberFromNotes(drum.notes) && <p className="trackingNumberLine"><b>Tracking:</b> {trackingNumberFromNotes(drum.notes)}</p>}
    {scheduled && <div className="scheduledTomorrowBadge"><CalendarDays size={14}/><span>Scheduled: {plannedDates.map(friendlyPlanDate).join(", ")}{scheduledTask?` · ${scheduledTask}`:""}</span></div>}
    <section className="cardActionRow">
      {flow.nextStep!=="Complete" && !isManufacturingComplete(drum) && (!cure || cure.ready) && scheduleDrum && <ScheduleWorkControl
        label="Schedule Work"
        onSchedule={date=>scheduleDrum(drum,date)}
        scheduledDates={plannedDates}
      />}
      {flow.nextStep!=="Complete" && !isManufacturingComplete(drum) && <button type="button" className="primary" disabled={progressing || !progressDrum || Boolean(cure && !cure.ready)} onClick={()=>progressDrum?.(drum)}><CheckCircle2 size={15}/> {progressing ? "Progressing..." : cure && !cure.ready ? "Curing — not ready" : `Progress: ${flow.nextStep}`}</button>}
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
    pending:false,
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
    customer_phone:preset.customer_phone || "",
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

      if(key==="pending"){
        next.serial=value ? "" : suggestedProductionNumber;
      }

      if(key==="build_client"){
        if(value==="Brady"){
          next.cb_number = current.cb_number || suggestedCbNumber;
        }else{
          next.cb_number = "";
        }
      }

      if(key==="drum_type"){
        const previousDefault = defaultBuildSpecification(current.drum_type,current.build_type);
        if(!current.construction_note || current.construction_note===previousDefault || current.construction_note==="Shell thickness: 12 mm"){
          next.construction_note = defaultBuildSpecification(value,current.build_type);
        }
      }

      if(key==="build_type"){
        const previousDefault = defaultBuildSpecification(current.drum_type,current.build_type);
        if(!current.construction_note || current.construction_note===previousDefault || current.construction_note==="Shell thickness: 12 mm"){
          next.construction_note = defaultBuildSpecification(current.drum_type,value);
        }
      }

      if(key==="project_id" && value){
        const selectedProject=projects.find(project=>project.id===value);
        const linkedDrums=drums
          .filter(drum=>drum.project_id===value && !isArchivedStatus(drum))
          .sort((a,b)=>extractNumber(a.serial)-extractNumber(b.serial));
        const sourceDrum=linkedDrums.find(drum=>
          drum.customer || drum.customer_phone || drum.customer_email || drum.shipping_address
        ) || linkedDrums[0];

        if(selectedProject?.customer && (!current.customer || current.customer==="Stock")){
          next.customer=selectedProject.customer;
          next.order_type="Custom";
        }
        if(selectedProject?.due_date && !current.due_date){
          next.due_date=selectedProject.due_date;
        }

        if(sourceDrum){
          if(sourceDrum.build_client) next.build_client=sourceDrum.build_client;
          if(sourceDrum.customer && sourceDrum.customer!=="Stock"){
            next.customer=sourceDrum.customer;
            next.order_type="Custom";
          }
          if(sourceDrum.customer_phone) next.customer_phone=sourceDrum.customer_phone;
          if(sourceDrum.customer_email) next.customer_email=sourceDrum.customer_email;
          if(sourceDrum.shipping_address) next.shipping_address=sourceDrum.shipping_address;
          if(sourceDrum.timber){
            if(timberOptions.includes(sourceDrum.timber)){
              next.timber=sourceDrum.timber;
              next.customTimber="";
            }else{
              next.timber="Custom / Other";
              next.customTimber=sourceDrum.timber;
            }
          }
          if(sourceDrum.finish) next.finish=sourceDrum.finish;
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
      <p>Create a numbered production drum or save it as Pending and assign the production number later.</p>

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

        <label className="pendingToggle"><input type="checkbox" checked={form.pending} onChange={e=>setField("pending",e.target.checked)}/> Save as Pending — no production number yet</label>
        <div className="twoInputGrid">
          <label>Production number
            <input disabled={form.pending} placeholder={form.pending?"Pending":suggestedProductionNumber} value={form.serial} onChange={e=>setField("serial",e.target.value)} />
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
        {form.project_id && <p className="projectPrefillNote">
          Customer details, material and finish have been copied from the existing active drums in this kit where available. You can still change them for this drum.
        </p>}
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
          <VeneerResult lengths={lengths} thicknesses={form.veneer}/>
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

        {form.order_type==="Custom" && <div className="twoInputGrid customerOrderFields">
          <label>Customer name
            <input value={form.customer} onChange={e=>setField("customer",e.target.value)} />
          </label>
          <label>Customer phone
            <input value={form.customer_phone} onChange={e=>setField("customer_phone",e.target.value)} />
          </label>
          <label>Customer email
            <input type="email" value={form.customer_email} onChange={e=>setField("customer_email",e.target.value)} />
          </label>
          <label>Due date
            <input type="date" value={form.due_date} onChange={e=>setField("due_date",e.target.value)} />
          </label>
          <label className="wide">Shipping address
            <textarea value={form.shipping_address} onChange={e=>setField("shipping_address",e.target.value)} />
          </label>
        </div>}

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
      <div className="wide"><b>Recommended Build Specification</b><span>{defaultBuildSpecification(drumType,buildType)}</span></div>
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
    <section className="panel"><h2>Manual Calculator</h2><label>Shell size</label><select value={manualSize} onChange={e=>setManualSize(e.target.value)}><option>14 x 6.5</option><option>14 x 5.5</option><option>13 x 7</option><option>12 x 7</option></select><p className="calcNote">{sizeAdjustmentLabel(manualSize)}. Layer 1 is fixed as the largest outer layer; thickness changes affect the inner layers only.</p><div className="veneerGrid">{manual.map((v,i)=><label key={i}>Layer {i+1} thickness mm<input value={v} onChange={e=>{const n=[...manual]; n[i]=e.target.value; setManual(n)}}/></label>)}</div><VeneerResult lengths={manualLengths} thicknesses={manual}/></section>
    <section className="panel"><h2>Ply Drums</h2><div className="templateGrid">{drums.map(d=>{const t=[d.veneer_1_thickness,d.veneer_2_thickness,d.veneer_3_thickness,d.veneer_4_thickness,d.veneer_5_thickness].map(x=>x||1.2); return <article className="card" key={d.id}><b>{d.serial ? `#${d.serial}` : "Pending"} {d.timber}</b><span>{d.size} · {d.production_status}</span><p className="calcNote">{sizeAdjustmentLabel(d.size)}. Layer 1 is fixed as the largest outer layer; thickness changes affect the inner layers only.</p><div className="veneerGrid small">{t.map((v,i)=><label key={i}>L{i+1}<input value={v} onChange={e=>updateDrum(d.id,{[`veneer_${i+1}_thickness`]:Number(e.target.value)})}/></label>)}</div><VeneerResult lengths={adjustedLengths(t, d.size)}/><button onClick={()=>openJobCard(d)}>Open job card</button></article>})}</div></section>
  </section>
}

function VeneerResult({lengths,thicknesses=[]}){
  return <div className="resultList veneerResultList">{lengths.map((l,i)=>{
    const thickness=Number(thicknesses[i] ?? 0);
    const isOneMm=Math.abs(thickness-1)<0.051;
    const isLayer3=i===2;
    const isLayer5=i===4;
    const practicalAdjustment=isOneMm && isLayer3 ? 2 : isOneMm && isLayer5 ? 1 : 0;
    return <div className={(isLayer3||isLayer5)?"veneerSensitiveLayer":""} key={i}>
      <b>Layer {i+1}</b>
      <span>{l.toFixed(1)} mm</span>
      {practicalAdjustment>0
        ? <small className="veneerPracticalHighlight">Observed practical trial: {(l-practicalAdjustment).toFixed(1)} mm ({practicalAdjustment} mm shorter)</small>
        : (isLayer3||isLayer5)
          ? <small className="veneerFitWarning">Check fit before cutting — practical length may vary by about 1 mm.</small>
          : null}
    </div>;
  })}</div>;
}


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

function targetProductionValue(drum){
  const savedPrice=Number(
    drum.build_client==="Brady"
      ? (drum.wholesale_price || drum.custom_price || drum.retail_price || 0)
      : (drum.custom_price || drum.retail_price || drum.wholesale_price || 0)
  );
  if(savedPrice>0) return savedPrice;

  const diameter=drumDiameterFromSize(drum.size);
  if(drum.build_client==="Brady" && bradyTomWholesalePrices[diameter]) return bradyTomWholesalePrices[diameter];
  if(drum.build_client!=="Brady" && nowakTomRetailPrices[diameter]) return nowakTomRetailPrices[diameter];
  return 0;
}

function totalWorkflowHours(drum){
  return workflowState(
    drum.build_type || "Stave",
    new Set(),
    drum.finish,
    drum.build_client,
    drum.drum_type,
    drum.size
  ).estimatedTotal;
}

function estimatedStageEvents(drum){
  const estimates=workflowEstimates[drum.build_type || "Stave"] || workflowEstimates.Stave;
  const history=Array.isArray(drum.stage_history) ? drum.stage_history : [];
  const seen=new Set();
  const rows=[];

  history.forEach(entry=>{
    if(!entry?.completed || !entry?.completed_at || !entry?.item || seen.has(entry.item)) return;
    seen.add(entry.item);
    const hours=Number(estimates[entry.item] || 0) * drumTimingMultiplier(drum.drum_type,drum.size);
    rows.push({
      date:localDateKey(entry.completed_at),
      hours,
      item:entry.item,
      drumId:drum.id,
      serial:drum.serial,
      timber:drum.timber,
      buildType:drum.build_type || "Stave",
      completedDrum:entry.item==="Assembled",
      productionValue: totalWorkflowHours(drum)>0
        ? targetProductionValue(drum) * (hours / totalWorkflowHours(drum))
        : 0,
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
  const productionValue=periodStages.reduce((sum,row)=>sum+Number(row.productionValue || 0),0);
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
        productionValue:0,
      };
    }
    return dailyMap[date];
  };

  stageEvents.forEach(row=>{
    const day=addDay(row.date);
    day.estimated+=row.hours;
    day.productionValue+=Number(row.productionValue || 0);
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
    const header=["Date","Estimated Hours Completed","Actual Hours Logged","Labour Value","Production Value Generated","Drums Progressed","Drums Completed","Sales Revenue","Estimated Profit"];
    const rows=dailyRows.map(row=>[
      row.date,
      row.estimated.toFixed(2),
      row.actual.toFixed(2),
      (row.estimated*Number(labourRate||0)).toFixed(2),
      row.productionValue.toFixed(2),
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
      <div className="productionValueStat"><b>{money(productionValue)}</b><span>Production value generated</span></div>
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


function DrumArchive({drums,openJobCard,restoreArchivedDrum,embedded=false}){
  const [search,setSearch]=useState("");
  const [sortOrder,setSortOrder]=useState("production-desc");
  const filtered=embedded ? drums : drums.filter(d=>JSON.stringify(d).toLowerCase().includes(search.toLowerCase()));

  function productionNumberValue(d){
    const raw=String(d.serial || "").trim();
    const numeric=Number(raw.replace(/[^0-9.-]/g,""));
    return Number.isFinite(numeric) ? numeric : -Infinity;
  }

  function sortedArchivedDrums(){
    return [...filtered].sort((a,b)=>{
      const aNumber=productionNumberValue(a);
      const bNumber=productionNumberValue(b);
      if(sortOrder==="production-asc") return aNumber-bNumber;
      return bNumber-aNumber;
    });
  }

  function archiveDate(d){
    const value=archiveDetailsFromNotes(d.notes).date;
    if(!value) return "Date not recorded";
    try{return new Intl.DateTimeFormat("en-AU",{day:"numeric",month:"short",year:"numeric"}).format(new Date(value));}
    catch{return value;}
  }

  return <section className={"archivePage "+(embedded?"embeddedArchive":"")}>
    <section className="panel archiveIntro">
      <div>
        <span className="launchPackEyebrow">CLOSED WORK</span>
        <h2>Drum Archive</h2>
        <p>Fully completed drums that no longer require production, collection, shipping or customer follow-up.</p>
      </div>
      <b className="archiveCount">{drums.length}</b>
    </section>
    <div className="archiveControls">
      {!embedded && <div className="searchBar"><Search size={16}/><input placeholder="Search production number, CB number, customer, timber, size or serial..." value={search} onChange={e=>setSearch(e.target.value)}/></div>}
      <label className="archiveSortControl">
        <span>Production number order</span>
        <select value={sortOrder} onChange={e=>setSortOrder(e.target.value)}>
          <option value="production-desc">Newest to oldest</option>
          <option value="production-asc">Oldest to newest</option>
        </select>
      </label>
    </div>
    {filtered.length===0
      ? <section className="panel"><p>No archived drums match this search.</p></section>
      : <section className="archiveGrid">{sortedArchivedDrums().map(d=>{
          const details=archiveDetailsFromNotes(d.notes);
          return <article className={"card archiveCard "+(d.build_client==="Brady"?"bradyCard":"")} key={d.id}>
            <div className="cardHeading">
              <b>{d.serial ? `#${d.serial}` : "Pending"} {d.timber}</b>
              <span className="archiveBadge"><Archive size={13}/> Archived</span>
            </div>
            {d.build_client==="Brady" && <span className="cbBadge">CB {d.cb_number||"No CB #"}</span>}
            <span>{d.size} · {d.drum_type||"Snare"} · {d.build_type}</span>
            <p><b>Production number:</b> #{d.serial||"Not recorded"}</p>
            {d.build_client==="Nowak" && <p><b>Nowak serial number:</b> {d.nowak_serial||"Not entered"}</p>}
            {d.build_client==="Brady" && <p><b>CB number:</b> {d.cb_number||"Not entered"}</p>}
            <p><b>Customer:</b> {d.build_client==="Brady" ? "Brady / CB" : allocatedCustomerName(d)||"Not recorded"}</p>
            <p><b>Outcome:</b> {details.reason||"Job closed"}</p>
            <p><b>Archived:</b> {archiveDate(d)}</p>
            {trackingNumberFromNotes(d.notes) && <p><b>Tracking:</b> {trackingNumberFromNotes(d.notes)}</p>}
            <div className="buttonRow">
              <button onClick={()=>openJobCard(d)}>Open Record</button>
              <button onClick={()=>restoreArchivedDrum(d)}><ArchiveRestore size={15}/> Restore</button>
            </div>
          </article>;
        })}</section>}
  </section>;
}

function RepairsPage({repairs,openRepair,addRepair}){
  const [search,setSearch]=useState("");
  const filtered=repairs.filter(repair=>JSON.stringify(repair).toLowerCase().includes(search.toLowerCase()));

  return <section className="repairsPage">
    <section className="panel repairsIntro">
      <div>
        <span className="launchPackEyebrow">CUSTOMER REPAIR WORK</span>
        <h2>Repairs & Modifications</h2>
        <p>Track occasional repair and modification jobs from drop-off through collection and payment.</p>
      </div>
      <button className="primary" onClick={addRepair}><Plus size={16}/> Add Repair Job</button>
    </section>

    <div className="searchBar"><Search size={16}/><input placeholder="Search repair number, customer, phone, brand or work..." value={search} onChange={e=>setSearch(e.target.value)}/></div>

    <section className="repairColumns">
      {repairStatuses.map(status=>{
        const items=filtered.filter(repair=>repair.status===status);
        return <section className={"panel repairColumn repairStatus"+status.replaceAll(" ","").replace("&","")} key={status}>
          <header className="repairColumnHeader">
            <h2>{status}</h2><b>{items.length}</b>
          </header>
          {items.length===0
            ? <p className="repairEmpty">No jobs</p>
            : <div className="repairCardList">{items.map(repair=><article className="repairCard" key={repair.id}>
                <div className="repairCardTop">
                  <div>
                    <span className="repairNumber">{repair.job_number}</span>
                    <h3>{repair.drum_brand || "Drum"} {repair.drum_description || ""}</h3>
                  </div>
                  <b>{money(repair.agreed_price)}</b>
                </div>
                <p><Users size={14}/> {repair.customer_name || "Customer not entered"}</p>
                {repair.phone && <p><Phone size={14}/> {repair.phone}</p>}
                <div className="repairServiceTags">{repairServiceLabels(repair.services||[]).map(label=><span key={label}>{label}</span>)}</div>
                <button onClick={()=>openRepair(repair)}>Open Repair Job</button>
              </article>)}</div>}
        </section>;
      })}
    </section>
  </section>
}

function AddRepairModal({repairs,onClose,onCreate}){
  const [form,setForm]=useState({
    job_number:nextRepairNumber(repairs),
    customer_name:"",
    phone:"",
    email:"",
    drum_brand:"",
    drum_description:"",
    services:[],
    notes:"",
    agreed_price:0,
    status:"Received",
    date_received:new Date().toISOString().slice(0,10),
    due_date:"",
  });
  const [saving,setSaving]=useState(false);

  function toggleService(key){
    setForm(current=>{
      const services=current.services.includes(key)
        ? current.services.filter(item=>item!==key)
        : [...current.services,key];
      const standardTotal=repairServiceTotal(services);
      const oldStandardTotal=repairServiceTotal(current.services);
      const shouldAutoPrice=Number(current.agreed_price||0)===oldStandardTotal || Number(current.agreed_price||0)===0;
      return {...current,services,agreed_price:shouldAutoPrice ? standardTotal : current.agreed_price};
    });
  }

  async function save(){
    if(!form.customer_name.trim()){
      alert("Please enter the customer name.");
      return;
    }
    setSaving(true);
    await onCreate(form);
    setSaving(false);
  }

  return <div className="modalBg" onClick={onClose}><div className="modal repairModal" onClick={e=>e.stopPropagation()}>
    <button className="close" onClick={onClose}>×</button>
    <span className="launchPackEyebrow">NEW REPAIR JOB</span>
    <h2>{form.job_number}</h2>

    <section className="repairFormGrid">
      <div>
        <label>Customer name</label><input value={form.customer_name} onChange={e=>setForm({...form,customer_name:e.target.value})}/>
        <label>Phone</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
        <label>Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
      </div>
      <div>
        <label>Drum brand</label><input placeholder="e.g. Pearl, Ludwig, custom" value={form.drum_brand} onChange={e=>setForm({...form,drum_brand:e.target.value})}/>
        <label>Drum description</label><input placeholder="e.g. 14 x 6.5 snare" value={form.drum_description} onChange={e=>setForm({...form,drum_description:e.target.value})}/>
        <label>Date received</label><input type="date" value={form.date_received} onChange={e=>setForm({...form,date_received:e.target.value})}/>
        <label>Due date (optional)</label><input type="date" value={form.due_date} onChange={e=>setForm({...form,due_date:e.target.value})}/>
      </div>
    </section>

    <section className="panel inner repairServicesPanel">
      <h3>Agreed Work</h3>
      <div className="repairServiceChoices">{repairServices.map(service=><label className={"repairServiceChoice "+(form.services.includes(service.key)?"selected":"")} key={service.key}>
        <input type="checkbox" checked={form.services.includes(service.key)} onChange={()=>toggleService(service.key)}/>
        <span><b>{service.label}</b><small>{service.price ? money(service.price) : "Enter price"}</small></span>
      </label>)}</div>
      <label>Agreed price</label><input type="number" min="0" step="1" value={form.agreed_price} onChange={e=>setForm({...form,agreed_price:Number(e.target.value)})}/>
      <label>Job notes</label><textarea placeholder="Describe the work agreed with the customer..." value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/>
    </section>

    <div className="buttonRow">
      <button onClick={onClose}>Cancel</button>
      <button className="primary" disabled={saving} onClick={save}><Save size={16}/> {saving?"Saving...":"Create Repair Job"}</button>
    </div>
  </div></div>
}

function RepairJobModal({repair,onClose,updateRepair,deleteRepair,setMessage}){
  const [draft,setDraft]=useState({...repair,services:Array.isArray(repair.services)?repair.services:[]});
  const [photos,setPhotos]=useState([]);
  const [photoType,setPhotoType]=useState("Before");
  const [uploading,setUploading]=useState(false);
  const [savedMessage,setSavedMessage]=useState("");

  useEffect(()=>{ setDraft({...repair,services:Array.isArray(repair.services)?repair.services:[]}); },[repair.id]);

  async function loadPhotos(){
    const {data,error}=await supabase.from("repair_photos").select("*").eq("repair_job_id",repair.id).order("created_at",{ascending:true});
    if(error){
      setMessage?.("Could not load repair photos: "+error.message);
      return;
    }
    setPhotos(data||[]);
  }
  useEffect(()=>{ loadPhotos(); },[repair.id]);

  function toggleService(key){
    setDraft(current=>{
      const services=current.services.includes(key)
        ? current.services.filter(item=>item!==key)
        : [...current.services,key];
      return {...current,services};
    });
  }

  async function save(){
    const saved=await updateRepair(repair.id,{
      customer_name:draft.customer_name,
      phone:draft.phone,
      email:draft.email,
      drum_brand:draft.drum_brand,
      drum_description:draft.drum_description,
      services:draft.services,
      notes:draft.notes,
      agreed_price:Number(draft.agreed_price||0),
      status:draft.status,
      date_received:draft.date_received,
      due_date:draft.due_date,
    });
    if(saved){
      setSavedMessage("Repair job saved");
      setTimeout(()=>setSavedMessage(""),2200);
    }
  }

  async function setStatus(status){
    setDraft(current=>({...current,status}));
    const saved=await updateRepair(repair.id,{status});
    if(saved){
      setSavedMessage(`Moved to ${status}`);
      setTimeout(()=>setSavedMessage(""),2200);
    }
  }

  async function uploadPhotos(event){
    const files=Array.from(event.target.files||[]);
    if(!files.length) return;
    setUploading(true);
    try{
      for(let index=0;index<files.length;index+=1){
        const file=files[index];
        const safe=String(file.name||`photo-${index+1}.jpg`).replace(/[^a-zA-Z0-9._-]/g,"-");
        const id=globalThis.crypto?.randomUUID?.() || `${Date.now()}-${index}`;
        const path=`repairs/${repair.id}/${photoType.toLowerCase()}/${id}-${safe}`;
        const {error:uploadError}=await supabase.storage.from("drum-photos").upload(path,file,{upsert:false});
        if(uploadError) throw uploadError;
        const {data:publicData}=supabase.storage.from("drum-photos").getPublicUrl(path);
        const {error:rowError}=await supabase.from("repair_photos").insert({
          repair_job_id:repair.id,
          photo_type:photoType,
          storage_path:path,
          public_url:publicData?.publicUrl||"",
        });
        if(rowError) throw rowError;
      }
      await loadPhotos();
      setSavedMessage("Photos uploaded");
      setTimeout(()=>setSavedMessage(""),2200);
    }catch(error){
      setMessage?.("Repair photo upload failed: "+(error?.message||String(error)));
    }finally{
      setUploading(false);
      event.target.value="";
    }
  }

  async function removePhoto(photo){
    if(!window.confirm("Delete this repair photo?")) return;
    if(photo.storage_path) await supabase.storage.from("drum-photos").remove([photo.storage_path]);
    const {error}=await supabase.from("repair_photos").delete().eq("id",photo.id);
    if(error){
      setMessage?.("Could not delete repair photo: "+error.message);
      return;
    }
    setPhotos(current=>current.filter(item=>item.id!==photo.id));
  }

  return <div className="modalBg" onClick={onClose}><div className="modal repairModal repairJobModal" onClick={e=>e.stopPropagation()}>
    <button className="close" onClick={onClose}>×</button>
    <div className="repairJobHeader">
      <div>
        <span className="launchPackEyebrow">REPAIR / MODIFICATION</span>
        <h2>{draft.job_number}</h2>
        <p>{draft.customer_name} · {draft.drum_brand} {draft.drum_description}</p>
      </div>
      <b className="repairPrice">{money(draft.agreed_price)}</b>
    </div>

    <section className="repairStatusButtons">
      {repairStatuses.map(status=><button key={status} className={draft.status===status?"primary":""} onClick={()=>setStatus(status)}>{status}</button>)}
    </section>

    <section className="repairFormGrid">
      <div>
        <label>Customer name</label><input value={draft.customer_name||""} onChange={e=>setDraft({...draft,customer_name:e.target.value})}/>
        <label>Phone</label><input value={draft.phone||""} onChange={e=>setDraft({...draft,phone:e.target.value})}/>
        <label>Email</label><input type="email" value={draft.email||""} onChange={e=>setDraft({...draft,email:e.target.value})}/>
      </div>
      <div>
        <label>Drum brand</label><input value={draft.drum_brand||""} onChange={e=>setDraft({...draft,drum_brand:e.target.value})}/>
        <label>Drum description</label><input value={draft.drum_description||""} onChange={e=>setDraft({...draft,drum_description:e.target.value})}/>
        <label>Date received</label><input type="date" value={draft.date_received||""} onChange={e=>setDraft({...draft,date_received:e.target.value})}/>
        <label>Due date</label><input type="date" value={draft.due_date||""} onChange={e=>setDraft({...draft,due_date:e.target.value})}/>
      </div>
    </section>

    <section className="panel inner repairServicesPanel">
      <h3>Work & Price</h3>
      <div className="repairServiceChoices">{repairServices.map(service=><label className={"repairServiceChoice "+(draft.services.includes(service.key)?"selected":"")} key={service.key}>
        <input type="checkbox" checked={draft.services.includes(service.key)} onChange={()=>toggleService(service.key)}/>
        <span><b>{service.label}</b><small>{service.price ? money(service.price) : "Custom price"}</small></span>
      </label>)}</div>
      <label>Agreed price</label><input type="number" min="0" step="1" value={draft.agreed_price||0} onChange={e=>setDraft({...draft,agreed_price:Number(e.target.value)})}/>
      <label>Notes</label><textarea value={draft.notes||""} onChange={e=>setDraft({...draft,notes:e.target.value})}/>
    </section>

    <section className="panel inner repairPhotosPanel">
      <div className="repairPhotoHeader">
        <div><h3>Photos</h3><p>Add before, progress or completed photos.</p></div>
        <div className="repairPhotoControls">
          <select value={photoType} onChange={e=>setPhotoType(e.target.value)}>
            <option>Before</option><option>Progress</option><option>Completed</option><option>General</option>
          </select>
          <label className="buttonLike primary"><Camera size={16}/> {uploading?"Uploading...":"Add Photos"}<input className="hiddenFileInput" type="file" accept="image/*" multiple capture="environment" disabled={uploading} onChange={uploadPhotos}/></label>
        </div>
      </div>
      {photos.length===0
        ? <p>No photos stored yet.</p>
        : <div className="repairPhotoGrid">{photos.map(photo=><figure key={photo.id}>
            <img src={photo.public_url} alt={`${photo.photo_type} repair photo`}/>
            <figcaption><span>{photo.photo_type}</span><button onClick={()=>removePhoto(photo)}><Trash2 size={14}/></button></figcaption>
          </figure>)}</div>}
    </section>

    <div className="jobSaveFooter">
      <button onClick={()=>deleteRepair(repair.id)} className="dangerButton"><Trash2 size={16}/> Delete</button>
      {savedMessage && <span className="saveMessage">{savedMessage}</span>}
      <button className="primary saveChangesButton" onClick={save}><Save size={16}/> Save Changes</button>
      <button onClick={onClose}>Close</button>
    </div>
  </div></div>
}

function Inventory({hardware, updateHardware, lowStock, inventoryValue}){ return <section className="panel"><h2>Hardware Inventory</h2><p>{hardware.length} parts · {lowStock} low stock alerts · {money(inventoryValue)} stock value</p><div className="tableWrap"><table><thead><tr><th>Part</th><th>Code</th><th>Finish</th><th>Size</th><th>Qty</th><th>Reorder</th><th>Landed AUD</th><th>Status</th></tr></thead><tbody>{hardware.map(p=><tr key={p.id}><td>{p.part_name}<br/><small>{p.category}</small></td><td>{p.code}</td><td>{p.finish}</td><td>{p.size}</td><td><input value={p.qty_on_hand??0} onChange={e=>updateHardware(p.id,{qty_on_hand:Number(e.target.value)})}/></td><td>{p.reorder_level}</td><td>{money(p.landed_cost_aud)}</td><td>{Number(p.qty_on_hand||0)<=Number(p.reorder_level||0)?<span className="dangerText">Order</span>:<span className="okText">OK</span>}</td></tr>)}</tbody></table></div></section> }

function Costing({templates, labourRate, setLabourRate}){
  const nowakKitTotal=Object.values(nowakTomRetailPrices).reduce((sum,value)=>sum+value,0);
  const bradyKitTotal=Object.values(bradyTomWholesalePrices).reduce((sum,value)=>sum+value,0);
  const tomRows=[
    {label:'10" tom',diameter:"10"},
    {label:'12" tom',diameter:"12"},
    {label:'14" floor tom',diameter:"14"},
    {label:'20" bass drum',diameter:"20"},
  ];

  return <section className="panel">
    <h2>Costing & Price Guide</h2>
    <label className="inlineLabel">Labour rate <input value={labourRate} onChange={e=>setLabourRate(Number(e.target.value))}/></label>

    <h3>Current snare pricing</h3>
    <div className="templateGrid">
      <article className="card"><b>Nowak retail — Stave snare</b><span>Satin / Natural: {money(1300)}</span><span>High Gloss: {money(1400)}</span><small>Timber tier and custom specifications may increase the final price.</small></article>
      <article className="card"><b>Nowak retail — Ply snare</b><span>Satin / Natural: {money(1100)}</span><span>High Gloss: {money(1250)}</span></article>
      <article className="card"><b>Brady wholesale — Stave snare shell</b><span>Satin: {money(600)}</span><span>High Gloss: {money(650)}</span></article>
      <article className="card"><b>Brady wholesale — Ply snare shell</b><span>Satin: {money(400)}</span><span>High Gloss: {money(450)}</span></article>
    </div>

    <h3>Tom and kit pricing</h3>
    <div className="priceGuideTable">
      <div className="priceGuideHeader"><b>Drum</b><b>Nowak retail</b><b>Brady wholesale shell</b></div>
      {tomRows.map(row=><div className="priceGuideRow" key={row.diameter}><span>{row.label}</span><strong>{money(nowakTomRetailPrices[row.diameter])}</strong><strong>{money(bradyTomWholesalePrices[row.diameter])}</strong></div>)}
      <div className="priceGuideRow priceGuideSubtotal"><span>Individual total</span><strong>{money(nowakKitTotal)}</strong><strong>{money(bradyKitTotal)}</strong></div>
      <div className="priceGuideRow priceGuideTotal"><span>Agreed four-piece kit price</span><strong>{money(nowakKitRetailPrice)}</strong><strong>{money(bradyKitWholesalePrice)}</strong></div>
    </div>
    <p className="pricingNote">Brady pricing reflects the current agreement and Brady assisting with the builds. Freight, unusual specifications, premium timber and special finishing can be quoted separately.</p>

    <h3>Production Time Allowances</h3>
    <p className="pricingNote">Snare timings are the minimum baseline. Tom and bass-drum times use the agreed diameter multiplier. Cure waiting time remains unchanged.</p>
    <div className="timeAllowanceGrid">
      {["Stave","Ply"].map(type=>{
        const rows=manufacturingChecklist(type,"High Gloss","Nowak","Snare").filter(item=>!marketingChecklist.includes(item) && !fulfilmentChecklist.includes(item));
        const total=rows.reduce((sum,item)=>sum+Number(workflowEstimates[type][item]||0),0);
        return <article className="card" key={type}><h4>{type} — 14 × 6.5 snare baseline</h4>
          <div className="timeRows">{rows.map(item=><div key={item}><span>{checklistDisplayLabel(item,type)}</span><b>{Math.round(Number(workflowEstimates[type][item]||0)*60)} min</b></div>)}</div>
          <p><b>Total High Gloss production allowance: {total.toFixed(2)} hr</b></p>
        </article>;
      })}
    </div>
    <div className="priceGuideTable"><div className="priceGuideHeader"><b>Drum</b><b>Multiplier</b><b>Example: 1 hr task</b></div>
      {[['10” tom',1.25],['12” tom',1.50],['14” floor tom',1.85],['16” floor tom',2.30],['18” floor tom',2.90],['20” bass drum',3.20],['22” bass drum',3.60],['24” bass drum',4.00]].map(([label,m])=><div className="priceGuideRow" key={label}><span>{label}</span><strong>{m.toFixed(2)}×</strong><strong>{m.toFixed(2)} hr</strong></div>)}
    </div>

    <h3>Costing templates</h3>
    <div className="templateGrid">{templates.map(t=>{const total=templateCost(t,labourRate), profit=Number(t.retail_price||0)-total; return <article className="card" key={t.id}><b>{t.name}</b><span>Hardware: {money(t.hardware_cost)}</span><span>Timber: {money(t.timber_cost)}</span><span>Consumables: {money(t.consumables)}</span><span>Labour: {t.labour_hours} hrs × {money(labourRate)}</span><hr/><span>Total cost: {money(total)}</span><span>Retail: {money(t.retail_price)}</span><b>Estimated profit: {money(profit)}</b></article>})}</div>
  </section>
}

function Orders({drums, openJobCard}){
  const customerOrders=drums.filter(d=>{
    if(isArchivedStatus(d)) return false;
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
    const flow=workflowState(d.build_type||"Stave",parseChecked(d.notes),d.finish,d.build_client,d.drum_type,d.size);
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
        <div><span>Phone</span><b>{d.customer_phone || "Not entered"}</b></div>
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


function marketingMilestoneLabel(key,drum){
  if(key==="shellcomplete"){
    if(drum?.build_client==="Nowak") return isCustomCustomerDrum(drum) ? "Custom Drum Complete" : "Drum Complete";
    return "Shell Complete";
  }
  const launchStage=launchPackStages.find(stage=>stage.key===key);
  return launchStage?.label || photoMilestones[key]?.label || String(key||"General").replaceAll("_"," ");
}

function marketingMilestoneExplanation(key){
  const explanations={
    wood:"Original timber or veneer content ready to review.",
    blank:"Shell blank or early build content ready to review.",
    machined:"Machined shell progress content ready to review.",
    sealer:"Finishing-process content ready to review.",
    shellcomplete:"Completed shell content ready to review.",
    drumcomplete:"Completed drum content ready to review.",
    launch_timber:"Timber-stage content for the build story.",
    launch_machined:"Machined-shell content for the build story.",
    launch_reveal:"Finish reveal content, suitable for a progress post or final release.",
    launch_final:"Final drum photos or video ready for a completed-drum post.",
    general:"Additional workshop media ready to review.",
  };
  return explanations[key] || "New milestone media is available for social-media review.";
}

function CommsMarketingCentre({filteredDrums,allDrums,openJobCard,setMessage,onAddPhoto}){
  const [section,setSection]=useState("queue");

  return <section>
    <section className="panel commsMarketingHeader">
      <div>
        <span className="launchPackEyebrow">COMMUNICATIONS</span>
        <h2>Comms & Marketing</h2>
        <p>Review newly captured media, hold content for a final post, or access the existing launch and milestone tools.</p>
      </div>

      <div className="commsMarketingTabs">
        <button
          className={section==="queue" ? "primary" : ""}
          onClick={()=>setSection("queue")}
        >
          <ClipboardList size={16}/> Content Queue
        </button>
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

    {section==="queue"
      ? <MarketingContentQueue drums={allDrums} openJobCard={openJobCard} setMessage={setMessage}/>
      : section==="drafts"
        ? <MarketingCentre drums={allDrums} openJobCard={openJobCard} setMessage={setMessage} embedded/>
        : <CommsCentre drums={filteredDrums.filter(d=>d.build_client!=="Brady")} openJobCard={openJobCard} embedded onAddPhoto={onAddPhoto}/>
    }
  </section>
}

function MarketingContentQueue({drums,openJobCard,setMessage}){
  const [photos,setPhotos]=useState([]);
  const [statusRows,setStatusRows]=useState([]);
  const [tab,setTab]=useState("To Review");
  const [loading,setLoading]=useState(false);
  const [expanded,setExpanded]=useState("");

  const eligibleDrums=drums.filter(d=>d.build_client!=="Brady");
  const drumMap=Object.fromEntries(eligibleDrums.map(d=>[d.id,d]));
  const statusMap=Object.fromEntries(statusRows.map(row=>[`${row.drum_id}::${row.milestone}`,row]));

  async function load(){
    setLoading(true);
    const [photoResult,statusResult]=await Promise.all([
      supabase.from("drum_photos").select("*").order("created_at",{ascending:false}),
      supabase.from("marketing_queue").select("*").order("updated_at",{ascending:false}),
    ]);

    if(photoResult.error){
      setMessage?.("Could not load marketing media: "+photoResult.error.message);
      setPhotos([]);
    }else{
      setPhotos(photoResult.data||[]);
    }

    if(statusResult.error){
      setMessage?.("Marketing Queue needs the v6.9.0 Supabase migration.");
      setStatusRows([]);
    }else{
      setStatusRows(statusResult.data||[]);
    }
    setLoading(false);
  }

  useEffect(()=>{load();},[]);

  const grouped={};
  photos.forEach(photo=>{
    const drum=drumMap[photo.drum_id];
    if(!drum) return;
    const key=`${photo.drum_id}::${photo.milestone||"general"}`;
    grouped[key] ??={key,drum,milestone:photo.milestone||"general",photos:[]};
    grouped[key].photos.push(photo);
  });

  const items=Object.values(grouped)
    .map(item=>({
      ...item,
      status:statusMap[item.key]?.status || "To Review",
      queueId:statusMap[item.key]?.id || null,
      updatedAt:statusMap[item.key]?.updated_at || item.photos[0]?.created_at || "",
    }))
    .sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt)));

  const tabs=["To Review","Held for Final Post","Completed","Ignored"];
  const filtered=items.filter(item=>item.status===tab);
  const counts=Object.fromEntries(tabs.map(name=>[name,items.filter(item=>item.status===name).length]));

  async function setStatus(item,status){
    const payload={
      drum_id:item.drum.id,
      milestone:item.milestone,
      status,
      updated_at:new Date().toISOString(),
    };
    const {data,error}=await supabase
      .from("marketing_queue")
      .upsert(payload,{onConflict:"drum_id,milestone"})
      .select("*")
      .single();

    if(error){
      setMessage?.("Could not update marketing item: "+error.message);
      return;
    }
    setStatusRows(current=>[data,...current.filter(row=>!(row.drum_id===data.drum_id && row.milestone===data.milestone))]);
    setExpanded("");
    setMessage?.("");
  }

  function mediaSummary(item){
    const videos=item.photos.filter(photo=>photo.media_type==="video").length;
    const images=item.photos.length-videos;
    const parts=[];
    if(images) parts.push(`${images} photo${images===1?"":"s"}`);
    if(videos) parts.push(`${videos} video${videos===1?"":"s"}`);
    return parts.join(" · ") || `${item.photos.length} file${item.photos.length===1?"":"s"}`;
  }

  return <section className="marketingQueue">
    <section className="panel marketingQueueIntro">
      <div>
        <span className="launchPackEyebrow">SOCIAL-MEDIA INBOX</span>
        <h3>Content Queue</h3>
        <p>New milestone photos and videos from Nowak or unallocated drums appear here automatically. Brady / CB drums are excluded.</p>
      </div>
      <button onClick={load}><RefreshCw size={15}/> {loading?"Loading...":"Refresh"}</button>
    </section>

    <div className="marketingQueueTabs">
      {tabs.map(name=><button key={name} className={tab===name?"primary":""} onClick={()=>setTab(name)}>
        {name} <b>{counts[name]||0}</b>
      </button>)}
    </div>

    {filtered.length===0
      ? <section className="panel emptyMarketingQueue"><ClipboardList size={25}/><p>No items in {tab.toLowerCase()}.</p></section>
      : <section className="marketingQueueList">{filtered.map(item=>{
          const open=expanded===item.key;
          const drum=item.drum;
          return <article className="panel marketingQueueCard" key={item.key}>
            <header className="marketingQueueCardHeader">
              <div>
                <span className="futureStageBadge">{marketingMilestoneLabel(item.milestone,drum)}</span>
                <h3>#{drum.serial} {drum.timber}</h3>
                <p>{drum.size} · {drum.build_type} · {displaySalesBadge(drum)}</p>
              </div>
              <b className="mediaCountBadge">{mediaSummary(item)}</b>
            </header>

            <p className="marketingQueueExplanation">{marketingMilestoneExplanation(item.milestone)}</p>

            <div className="marketingQueueActions">
              <button onClick={()=>setExpanded(open?"":item.key)}><Camera size={15}/> {open?"Hide Media":"Open Media"}</button>
              <button onClick={()=>openJobCard(drum)}>Open Drum</button>
              {item.status!=="Held for Final Post" && <button onClick={()=>setStatus(item,"Held for Final Post")}>Hold for Final</button>}
              {item.status!=="Completed" && <button className="primary" onClick={()=>setStatus(item,"Completed")}><CheckCircle2 size={15}/> Complete</button>}
              {item.status!=="Ignored" && <button onClick={()=>setStatus(item,"Ignored")}>Ignore</button>}
              {item.status!=="To Review" && <button onClick={()=>setStatus(item,"To Review")}>Return to Review</button>}
            </div>

            {open && <section className="marketingQueueMedia">
              {item.photos.map(photo=><a href={photo.public_url} target="_blank" rel="noreferrer" key={photo.id} className="marketingMediaItem">
                {photo.media_type==="video"
                  ? <video src={photo.public_url} controls preload="metadata"/>
                  : <img src={photo.public_url} alt={marketingMilestoneLabel(item.milestone,drum)}/>}
              </a>)}
            </section>}
          </article>;
        })}</section>}
  </section>;
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


async function offerSaveToDevice(files,title="Nowak Drum Media"){
  const shareFiles=Array.from(files||[]).filter(Boolean);
  if(!shareFiles.length) return {supported:false,shared:false};

  const shareData={files:shareFiles,title};
  const supported=Boolean(
    navigator.share &&
    (!navigator.canShare || navigator.canShare(shareData))
  );

  if(!supported) return {supported:false,shared:false};

  try{
    await navigator.share(shareData);
    return {supported:true,shared:true};
  }catch(error){
    // Cancelling the share sheet should not prevent the upload.
    if(error?.name==="AbortError") return {supported:true,shared:false,cancelled:true};
    return {supported:true,shared:false,error:error?.message || String(error)};
  }
}

function LaunchMediaModal({drum,stage,onClose,onUploaded,setMessage}){
  const cameraInputRef=useRef(null);
  const libraryInputRef=useRef(null);
  const [files,setFiles]=useState([]);
  const [source,setSource]=useState("");
  const [status,setStatus]=useState("");

  async function upload(){
    if(!files.length){
      setStatus("Choose or take at least one file first.");
      return;
    }

    const shareResult=source==="camera"
      ? await offerSaveToDevice(files,`${drum.timber||"Nowak drum"} — ${stage.label}`)
      : {supported:false,shared:false};
    setStatus(source==="camera" && shareResult.supported
      ? "Saving to the app..."
      : "Uploading...");
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

      window.dispatchEvent(new CustomEvent("drum-media-updated",{detail:{drumId:drum.id}}));
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

      <input className="hiddenFileInput" ref={cameraInputRef} type="file" accept={stage.accept} capture="environment" onChange={e=>{setSource("camera");setFiles(Array.from(e.target.files || []));}}/>
      <input className="hiddenFileInput" ref={libraryInputRef} type="file" accept={stage.accept} multiple onChange={e=>{setSource("library");setFiles(Array.from(e.target.files || []));}}/>

      {files.length>0 && <p className="okText">{files.length} file{files.length===1?"":"s"} selected.</p>}
      <button className="primary uploadPhotosButton" disabled={status==="Uploading..." || status==="Saving to the app..."} onClick={upload}>
        <Camera size={16}/> {(status==="Uploading..." || status==="Saving to the app...") ? "Uploading..." : source==="camera" ? "Upload & Save to iPhone" : "Upload"}
      </button>
      {source==="camera" && <small className="saveToPhoneNote">On iPhone, choose <b>Save Image</b> or <b>Save Video</b> in the share sheet. The app upload continues even if the share sheet is closed.</small>}
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


function HistoricalDrumImport({sourceRecords,drums,importRecords,openJobCard}){
  const [filter,setFilter]=useState("All");
  const [search,setSearch]=useState("");
  const [importing,setImporting]=useState(false);
  const [result,setResult]=useState("");

  const sourceProductionCounts=sourceRecords.reduce((acc,row)=>{
    const key=normaliseJobNumber(row.serial);
    acc[key]=(acc[key]||0)+1;
    return acc;
  },{});
  const sourceSerialCounts=sourceRecords.reduce((acc,row)=>{
    const key=String(row.nowak_serial||"").trim();
    acc[key]=(acc[key]||0)+1;
    return acc;
  },{});

  function classify(row){
    const production=normaliseJobNumber(row.serial);
    const serial=String(row.nowak_serial||"").trim();
    const sameProduction=drums.find(d=>normaliseJobNumber(d.serial)===production);
    const sameSerial=drums.find(d=>String(d.nowak_serial||"").trim()===serial);

    if(sameProduction && sameSerial && sameProduction.id===sameSerial.id){
      return {status:"Already imported",detail:"Matching production and serial numbers are already in the app.",drum:sameProduction};
    }
    if(sourceProductionCounts[production]>1 || sourceSerialCounts[serial]>1){
      return {status:"Source conflict",detail:"The spreadsheet contains this production or serial number more than once."};
    }
    if(sameProduction){
      return {status:"Conflict",detail:`Production #${row.serial} already belongs to serial ${sameProduction.nowak_serial||"not entered"}.`,drum:sameProduction};
    }
    if(sameSerial){
      return {status:"Conflict",detail:`Serial ${serial} already belongs to production #${sameSerial.serial}.`,drum:sameSerial};
    }
    return {status:"Ready",detail:"Safe to import."};
  }

  const rows=sourceRecords.map(row=>({...row,...classify(row)}));
  const counts=rows.reduce((acc,row)=>{
    acc[row.status]=(acc[row.status]||0)+1;
    return acc;
  },{});
  const visible=rows
    .filter(row=>filter==="All" || row.status===filter)
    .filter(row=>JSON.stringify(row).toLowerCase().includes(search.toLowerCase()));
  const readyRows=rows.filter(row=>row.status==="Ready");

  async function runImport(){
    if(!readyRows.length) return;
    const proceed=window.confirm(
      `Import ${readyRows.length} historical drums into the Archive?\\n\\nExisting and conflicting records will not be changed.`
    );
    if(!proceed) return;
    setImporting(true);
    setResult("");
    const response=await importRecords(readyRows);
    setResult(response?.error
      ? `Imported ${response.imported}. Import then stopped: ${response.error}`
      : `Imported ${response?.imported||0} historical drums. ${response?.skipped||0} records were skipped or already present.`
    );
    setImporting(false);
  }

  return <section className="historicalImportPage">
    <section className="panel historicalImportIntro">
      <div>
        <span className="launchPackEyebrow">ONE-TIME CATALOGUE MIGRATION</span>
        <h2>Historical Drum Import</h2>
        <p>Cross-reference the spreadsheet against every current and archived app record before importing.</p>
      </div>
      <button className="primary" disabled={importing || readyRows.length===0} onClick={runImport}>
        <Archive size={16}/> {importing?"Importing...":`Import ${readyRows.length} Ready Drums`}
      </button>
    </section>

    <section className="stats historicalImportStats">
      <button onClick={()=>setFilter("All")} className={filter==="All"?"primary":""}><b>{rows.length}</b><span>Spreadsheet records</span></button>
      <button onClick={()=>setFilter("Ready")} className={filter==="Ready"?"primary":""}><b>{counts.Ready||0}</b><span>Ready to import</span></button>
      <button onClick={()=>setFilter("Already imported")} className={filter==="Already imported"?"primary":""}><b>{counts["Already imported"]||0}</b><span>Already present</span></button>
      <button onClick={()=>setFilter("Conflict")} className={filter==="Conflict"?"primary":""}><b>{counts.Conflict||0}</b><span>App conflicts</span></button>
      <button onClick={()=>setFilter("Source conflict")} className={filter==="Source conflict"?"primary":""}><b>{counts["Source conflict"]||0}</b><span>Spreadsheet conflicts</span></button>
    </section>

    <section className="panel historicalImportNotice">
      <b>Price information</b>
      <p>The uploaded workbook does not contain a price column. Imported prices will therefore be set to $0 and can be entered later from each Job Card. All original spreadsheet fields are preserved in the Job Card notes.</p>
      <p>Customer names and sizes are imported where they can be identified reliably. Each imported drum remains editable and supports photos, customer details, pricing and other Job Card information.</p>
    </section>

    {result && <section className="panel okText">{result}</section>}

    <section className="panel historicalImportToolbar">
      <div className="searchBar"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search production number, serial, timber, size or customer..."/></div>
      <span>{visible.length} record{visible.length===1?"":"s"} shown</span>
    </section>

    <section className="panel historicalImportTable">
      <div className="historicalImportHeader">
        <b>Production</b><b>Serial</b><b>Material</b><b>Size</b><b>Customer</b><b>Status</b>
      </div>
      {visible.map(row=><article className="historicalImportRowWrap" key={`${row.source_row}-${row.serial}-${row.nowak_serial}`}>
        <div className="historicalImportRow">
          <span>#{row.serial}</span>
          <span>{row.nowak_serial}</span>
          <span>{row.timber}</span>
          <span>{row.size||"Not identified"}</span>
          <span>{row.customer||"Not recorded"}</span>
          <span className={"historicalStatus historical"+row.status.replaceAll(" ","")}>{row.status}</span>
        </div>
        <div className="historicalImportDetail">
          <span>{row.detail}</span>
          <span>Completed: {row.completion_date||"Not recorded"}</span>
          {row.drum && <button onClick={()=>openJobCard(row.drum)}>Open Existing Job Card</button>}
        </div>
      </article>)}
    </section>
  </section>;
}

function DrumRegister({drums,openJobCard}){
  const [owner,setOwner]=useState("All");
  const [statusFilter,setStatusFilter]=useState("All");
  const [sortBy,setSortBy]=useState("Newest");
  const [search,setSearch]=useState("");
  const [expanded,setExpanded]=useState("");

  function normaliseRegisterSearch(value){
    return String(value||"")
      .toLowerCase()
      .replace(/[“”"]/g,"")
      .replace(/½/g,".5")
      .replace(/¼/g,".25")
      .replace(/¾/g,".75")
      .replace(/(\d+)\s+1\/2/g,"$1.5")
      .replace(/(\d+)\s+1\/4/g,"$1.25")
      .replace(/(\d+)\s+3\/4/g,"$1.75")
      .replace(/(\d+)1\/2/g,"$1.5")
      .replace(/(\d+)1\/4/g,"$1.25")
      .replace(/(\d+)3\/4/g,"$1.75")
      .replace(/\s*x\s*/g,"x")
      .replace(/[^a-z0-9.]+/g," ")
      .replace(/\s+/g," ")
      .trim();
  }

  function registerState(drum){
    const lifecycle=drumLifecycleStatus(drum);
    if(lifecycle==="Archived") return "Archived";
    if(["Completed","Sold","Shipped"].includes(lifecycle) || isManufacturingComplete(drum)) return "Completed";
    return "In Production";
  }

  function registerSearchText(drum){
    const size=normaliseRegisterSearch(drum.size);
    const sizeCompact=size.replace(/\s+/g,"");
    const decimalAliases=[];
    const halfMatches=size.match(/\d+\.5/g) || [];
    halfMatches.forEach(value=>{
      const whole=value.replace(".5","");
      decimalAliases.push(`${whole} 1/2`,`${whole}1/2`,`${whole}½`);
    });

    return normaliseRegisterSearch([
      drum.serial,
      drum.cb_number,
      drum.nowak_serial,
      drum.timber,
      drum.size,
      sizeCompact,
      ...decimalAliases,
      drum.customer,
      drum.customer_phone,
      drum.customer_email,
      drum.build_type,
      drum.drum_type,
      drum.finish,
      drum.build_client,
      registerState(drum),
      drumLifecycleStatus(drum),
    ].filter(Boolean).join(" "));
  }

  const query=normaliseRegisterSearch(search);
  const filtered=drums
    .filter(d=>owner==="All" || d.build_client===owner)
    .filter(d=>statusFilter==="All" || registerState(d)===statusFilter)
    .filter(d=>!query || registerSearchText(d).includes(query))
    .sort((a,b)=>{
      if(sortBy==="Oldest") return extractNumber(a.serial)-extractNumber(b.serial);
      if(sortBy==="CB"){
        const aCb=a.build_client==="Brady" ? extractNumber(a.cb_number) : Number.MAX_SAFE_INTEGER;
        const bCb=b.build_client==="Brady" ? extractNumber(b.cb_number) : Number.MAX_SAFE_INTEGER;
        return aCb-bCb || extractNumber(b.serial)-extractNumber(a.serial);
      }
      if(sortBy==="Serial"){
        const aSerial=extractNumber(a.nowak_serial);
        const bSerial=extractNumber(b.nowak_serial);
        return bSerial-aSerial || extractNumber(b.serial)-extractNumber(a.serial);
      }
      return extractNumber(b.serial)-extractNumber(a.serial);
    });

  function customerLabel(d){
    if(d.build_client==="Brady") return allocatedCustomerName(d) || "Brady / CB";
    return allocatedCustomerName(d) || (d.sales_status==="Stock" ? "Stock" : "Not entered");
  }
  function stateClass(state){ return state.replaceAll(" ","").toLowerCase(); }

  return <section className="drumRegisterPage">
    <section className="panel drumRegisterIntro">
      <div>
        <span className="launchPackEyebrow">PERMANENT DRUM RECORD</span>
        <h2>Drum Register</h2>
        <p>All drums from production through completion and archive, with the newest records shown first.</p>
      </div>
      <b>{drums.length}</b>
    </section>

    <section className="panel registerControls">
      <div className="searchBar"><Search size={16}/><input placeholder="Search 14x4.5, 14 x 4 1/2, timber, customer, production or serial..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
      <div className="registerControlGroup">
        <span className="filterLabel">Ownership</span>
        <div className="registerFilterRow">
          {["All","Nowak","Brady","Unallocated"].map(value=><button key={value} className={owner===value?"primary":""} onClick={()=>setOwner(value)}>{value==="Brady"?"Brady / CB":value}</button>)}
        </div>
      </div>
      <div className="registerControlGroup">
        <span className="filterLabel">Status</span>
        <div className="registerFilterRow">
          {["All","In Production","Completed","Archived"].map(value=><button key={value} className={statusFilter===value?"primary":""} onClick={()=>setStatusFilter(value)}>{value}</button>)}
        </div>
      </div>
      <div className="registerControlGroup">
        <span className="filterLabel">Sort</span>
        <div className="registerFilterRow">
          <button className={sortBy==="Newest"?"primary":""} onClick={()=>setSortBy("Newest")}>Newest</button>
          <button className={sortBy==="Oldest"?"primary":""} onClick={()=>setSortBy("Oldest")}>Oldest</button>
          <button className={sortBy==="CB"?"primary":""} onClick={()=>setSortBy("CB")}>CB #</button>
          <button className={sortBy==="Serial"?"primary":""} onClick={()=>setSortBy("Serial")}>Serial #</button>
        </div>
      </div>
    </section>

    <section className="panel registerTable">
      <div className="registerHeaderRow">
        <b>Production #</b><b>CB #</b><b>Material</b><b>Size</b><b>Serial #</b><b>Customer</b><b>Status</b>
      </div>
      {filtered.length===0
        ? <p className="registerEmpty">No drums match this view.</p>
        : filtered.map(d=>{
            const open=expanded===d.id;
            const state=registerState(d);
            return <article className={[
              "registerRowWrap",
              open?"expanded":"",
              d.build_client==="Brady"?"registerBradyRow":"",
              `registerState-${stateClass(state)}`
            ].filter(Boolean).join(" ")} key={d.id}>
              <button className="registerRow" onClick={()=>setExpanded(open?"":d.id)}>
                <span>#{d.serial||"—"}</span>
                <span>{d.build_client==="Brady" ? (d.cb_number||"—") : "—"}</span>
                <span>{d.timber||"—"}</span>
                <span>{d.size||"—"}</span>
                <span>{d.build_client==="Nowak" ? (d.nowak_serial||"—") : "—"}</span>
                <span>{customerLabel(d)}</span>
                <span className={`registerStatusBadge ${stateClass(state)}`}>{state}</span>
              </button>
              {open && <section className="registerExpanded">
                <div><span>Owner</span><b>{ownershipLabel(d)}</b></div>
                <div><span>Detailed status</span><b>{drumLifecycleStatus(d)||workflowState(d.build_type||"Stave",parseChecked(d.notes),d.finish,d.build_client,d.drum_type,d.size).status}</b></div>
                <div><span>Construction</span><b>{d.build_type||"—"} · {d.drum_type||"Snare"}</b></div>
                <div><span>Phone</span><b>{d.customer_phone||"Not entered"}</b></div>
                <button onClick={()=>openJobCard(d)}>Open Job Card</button>
              </section>}
            </article>;
          })}
    </section>
  </section>;
}

function FutureProjectsPage({projects,addProject,editProject,deleteProject}){
  const [search,setSearch]=useState("");
  const [stageFilter,setStageFilter]=useState("All");
  const filtered=projects
    .filter(project=>stageFilter==="All" || project.stage===stageFilter)
    .filter(project=>JSON.stringify(project).toLowerCase().includes(search.toLowerCase()));

  return <section className="futureProjectsPage">
    <section className="panel futureProjectsIntro">
      <div>
        <span className="launchPackEyebrow">IDEAS WITHOUT DISTRACTION</span>
        <h2>Future Projects</h2>
        <p>Capture worthwhile ideas, note any progress already made, and keep them separate from current workshop commitments.</p>
      </div>
      <button className="primary" onClick={addProject}><Plus size={16}/> Add Future Project</button>
    </section>

    <section className="panel futureProjectsControls">
      <div className="searchBar"><Search size={16}/><input placeholder="Search titles, notes, next actions or ideas..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
      <div className="filterRow">
        {["All",...futureProjectStages].map(stage=><button key={stage} className={stageFilter===stage?"primary":""} onClick={()=>setStageFilter(stage)}>{stage}</button>)}
      </div>
    </section>

    {filtered.length===0
      ? <section className="panel emptyFutureProjects"><Lightbulb size={28}/><p>No future projects match this view.</p></section>
      : <section className="futureProjectGrid">{filtered.map(project=><article className={"panel futureProjectCard stage-"+String(project.stage||"").replaceAll(" ","-").toLowerCase()} key={project.id}>
          <header>
            <div>
              <span className="futureStageBadge">{project.stage||"Idea captured"}</span>
              <h3>{project.title}</h3>
            </div>
            <div className="futureProjectCardActions">
              <button onClick={()=>editProject(project)}><Pencil size={14}/> Edit</button>
              <button className="dangerButton" onClick={()=>deleteProject(project.id)}><Trash2 size={14}/></button>
            </div>
          </header>
          <div className="futureProjectMeta">
            <div><span>Preferred order</span><b>{project.preferred_order||"Someday / no timeframe"}</b></div>
            <div><span>Next action</span><b>{project.next_action||"No action set"}</b></div>
          </div>
          {project.notes
            ? <section className="futureProjectNotes"><span>Notes</span><p>{project.notes}</p></section>
            : <section className="futureProjectNotes emptyNotes"><span>Notes</span><p>No notes added yet.</p></section>}
        </article>)}</section>}
  </section>;
}

function FutureProjectModal({project,onClose,onCreate,onUpdate}){
  const [form,setForm]=useState({
    title:project?.title||"",
    stage:project?.stage||"Idea captured",
    preferred_order:project?.preferred_order||"Someday / no timeframe",
    next_action:project?.next_action||"",
    notes:project?.notes||"",
  });
  const [saving,setSaving]=useState(false);

  async function save(){
    if(!form.title.trim()){
      alert("Please enter the project title.");
      return;
    }
    setSaving(true);
    if(project){
      await onUpdate(project.id,{
        title:form.title.trim(),
        stage:form.stage,
        preferred_order:form.preferred_order,
        next_action:form.next_action.trim(),
        notes:form.notes.trim(),
      });
    }else{
      await onCreate(form);
    }
    setSaving(false);
  }

  return <div className="modalBg" onClick={onClose}><div className="modal futureProjectModal" onClick={e=>e.stopPropagation()}>
    <button className="close" onClick={onClose}>×</button>
    <span className="launchPackEyebrow">{project?"EDIT FUTURE PROJECT":"NEW FUTURE PROJECT"}</span>
    <h2>{project?"Edit Future Project":"Add Future Project"}</h2>

    <label>Project title</label>
    <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Ply bass drum hoops"/>

    <div className="futureProjectFormGrid">
      <label>Stage
        <select value={form.stage} onChange={e=>setForm({...form,stage:e.target.value})}>
          {futureProjectStages.map(stage=><option key={stage}>{stage}</option>)}
        </select>
      </label>
      <label>Preferred order
        <select value={form.preferred_order} onChange={e=>setForm({...form,preferred_order:e.target.value})}>
          {futureProjectOrders.map(order=><option key={order}>{order}</option>)}
        </select>
      </label>
    </div>

    <label>Next action</label>
    <input value={form.next_action} onChange={e=>setForm({...form,next_action:e.target.value})} placeholder="e.g. Test mould when received"/>

    <label>Notes</label>
    <textarea className="futureProjectNotesInput" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Add dimensions, supplier details, quotes, construction ideas, materials to test, or anything else worth remembering."/>

    <div className="buttonRow">
      <button onClick={onClose}>Cancel</button>
      <button className="primary" disabled={saving} onClick={save}><Save size={16}/> {saving?"Saving...":project?"Save Project":"Add Project"}</button>
    </div>
  </div></div>;
}


function ProjectMediaModal({project,onClose,onUploaded}){
  const cameraInputRef=useRef(null);
  const libraryInputRef=useRef(null);
  const [category,setCategory]=useState("project_progress");
  const [caption,setCaption]=useState("");
  const [files,setFiles]=useState([]);
  const [source,setSource]=useState("");
  const [status,setStatus]=useState("");
  const [uploading,setUploading]=useState(false);

  async function upload(){
    if(!files.length){
      setStatus("Choose or take at least one photo or video first.");
      return;
    }

    setUploading(true);
    const shareResult=source==="camera"
      ? await offerSaveToDevice(files,`${project.name} project media`)
      : {supported:false,shared:false};
    setStatus(source==="camera" && shareResult.supported
      ? "Saving project media to the app..."
      : "Uploading project media...");
    const saved=[];

    try{
      for(let index=0;index<files.length;index+=1){
        const file=files[index];
        const safeName=String(file.name || `project-media-${index+1}`).replace(/[^a-zA-Z0-9._-]/g,"-");
        const uniqueId=globalThis.crypto?.randomUUID?.() || `${Date.now()}-${index}-${Math.random().toString(36).slice(2)}`;
        const path=`projects/${project.id}/${category}/${uniqueId}-${safeName}`;

        const {error:uploadError}=await supabase.storage
          .from("drum-photos")
          .upload(path,file,{
            upsert:false,
            cacheControl:"3600",
            contentType:file.type || "application/octet-stream"
          });
        if(uploadError) throw new Error("Storage upload: "+uploadError.message);

        const {data:publicData}=supabase.storage.from("drum-photos").getPublicUrl(path);
        const publicUrl=publicData?.publicUrl || "";
        const mediaType=String(file.type||"").startsWith("video/") ? "video" : "image";

        const {data:row,error:rowError}=await supabase
          .from("project_media")
          .insert({
            project_id:project.id,
            category,
            storage_path:path,
            public_url:publicUrl,
            caption:caption.trim(),
            media_type:mediaType,
          })
          .select("*")
          .single();
        if(rowError) throw new Error("Project media record: "+rowError.message);
        saved.push(row);
      }

      setFiles([]);
      setCaption("");
      setStatus(`${saved.length} project media file${saved.length===1?"":"s"} uploaded.`);
      window.dispatchEvent(new CustomEvent("project-media-updated",{detail:{projectId:project.id}}));
      onUploaded?.(saved);
    }catch(error){
      setStatus("Could not upload project media: "+(error?.message || String(error)));
    }finally{
      setUploading(false);
    }
  }

  return <div className="modalBg" onClick={onClose}>
    <div className="modal projectMediaModal" onClick={e=>e.stopPropagation()}>
      <button className="close" onClick={onClose}>×</button>
      <span className="launchPackEyebrow">KIT / PROJECT MEDIA</span>
      <h2>{project.name}</h2>

      <label>Media category
        <select value={category} onChange={e=>setCategory(e.target.value)}>
          {projectMediaCategories.map(item=><option key={item.key} value={item.key}>{item.label}</option>)}
        </select>
      </label>

      <label>Caption or note
        <textarea value={caption} onChange={e=>setCaption(e.target.value)} placeholder="Optional note about this photo or video"/>
      </label>

      <div className="projectMediaChooseRow">
        <button type="button" onClick={()=>cameraInputRef.current?.click()}><Camera size={16}/> Take Photo / Video</button>
        <button type="button" onClick={()=>libraryInputRef.current?.click()}><Images size={16}/> Choose From Device</button>
      </div>

      <input
        ref={cameraInputRef}
        className="hiddenFileInput"
        type="file"
        accept="image/*,video/*"
        capture="environment"
        multiple
        onChange={e=>{setSource("camera");setFiles(Array.from(e.target.files||[]));}}
      />
      <input
        ref={libraryInputRef}
        className="hiddenFileInput"
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={e=>{setSource("library");setFiles(Array.from(e.target.files||[]));}}
      />

      {files.length>0 && <div className="selectedMediaSummary">
        <b>{files.length} file{files.length===1?"":"s"} selected</b>
        <span>{files.map(file=>file.name).join(", ")}</span>
      </div>}

      {status && <p className={status.startsWith("Could not")?"dangerText":"okText"}>{status}</p>}

      <div className="modalActions">
        <button onClick={onClose}>Close</button>
        <button className="primary" disabled={uploading || !files.length} onClick={upload}>
          {uploading?"Uploading...":source==="camera"?"Upload & Save to iPhone":"Upload"}
        </button>
        {source==="camera" && <small className="saveToPhoneNote">On iPhone, choose <b>Save Image</b> or <b>Save Video</b> in the share sheet. The media will also be uploaded to this project.</small>}
      </div>
    </div>
  </div>;
}

function ProjectMediaSection({project}){
  const [media,setMedia]=useState([]);
  const [loading,setLoading]=useState(false);
  const [status,setStatus]=useState("");
  const [showUpload,setShowUpload]=useState(false);
  const [expanded,setExpanded]=useState(false);

  async function load(){
    setLoading(true);
    const {data,error}=await supabase
      .from("project_media")
      .select("*")
      .eq("project_id",project.id)
      .order("created_at",{ascending:false});

    if(error){
      setStatus("Could not load project media: "+error.message);
      setMedia([]);
    }else{
      setMedia(data||[]);
      setStatus("");
    }
    setLoading(false);
  }

  useEffect(()=>{
    load();
    const refresh=event=>{
      if(!event?.detail?.projectId || event.detail.projectId===project.id) load();
    };
    window.addEventListener("project-media-updated",refresh);
    return ()=>window.removeEventListener("project-media-updated",refresh);
  },[project.id]);

  async function remove(item){
    if(!window.confirm("Delete this project photo or video?")) return;
    setStatus("Deleting project media...");
    try{
      if(item.storage_path){
        const {error:storageError}=await supabase.storage.from("drum-photos").remove([item.storage_path]);
        if(storageError) throw new Error(storageError.message);
      }
      const {error}=await supabase.from("project_media").delete().eq("id",item.id);
      if(error) throw new Error(error.message);
      await load();
      setStatus("Project media deleted.");
    }catch(error){
      setStatus("Could not delete project media: "+(error?.message || String(error)));
    }
  }

  const shown=expanded ? media : media.slice(0,4);

  return <section className="projectMediaSection">
    <div className="projectMediaHeader">
      <div>
        <b>Project / Kit Media</b>
        <span>{media.length} stored file{media.length===1?"":"s"}</span>
      </div>
      <div>
        <button onClick={load}>{loading?"Loading...":"Refresh"}</button>
        <button className="primary" onClick={()=>setShowUpload(true)}><Camera size={15}/> Add Media</button>
      </div>
    </div>

    {media.length===0
      ? <p className="projectMediaEmpty">Add photos or videos showing the complete kit, matching shells, progress or final reveal.</p>
      : <div className="projectMediaGrid">{shown.map(item=>{
          const isVideo=item.media_type==="video" || /\.(mp4|mov|m4v|webm)$/i.test(item.storage_path||item.public_url||"");
          const label=projectMediaCategories.find(category=>category.key===item.category)?.label || item.category || "General";
          return <article className="projectMediaCard" key={item.id}>
            <a href={item.public_url} target="_blank" rel="noreferrer">
              {isVideo
                ? <video src={item.public_url} controls muted playsInline preload="metadata"/>
                : <img src={item.public_url} alt={item.caption||label}/>}
              {isVideo && <span className="videoMediaBadge">VIDEO</span>}
            </a>
            <b>{label}</b>
            {item.caption && <p>{item.caption}</p>}
            <div>
              <a className="buttonLike" href={item.public_url} target="_blank" rel="noreferrer">Open</a>
              <button className="mediaDeleteButton" onClick={()=>remove(item)}>Delete</button>
            </div>
          </article>;
        })}</div>}

    {media.length>4 && <button className="projectMediaExpandButton" onClick={()=>setExpanded(!expanded)}>
      {expanded?"Show Less":`View All ${media.length} Files`}
    </button>}

    {status && <p className={status.startsWith("Could not")?"dangerText":"okText"}>{status}</p>}

    {showUpload && <ProjectMediaModal
      project={project}
      onClose={()=>setShowUpload(false)}
      onUploaded={()=>{setShowUpload(false);load();}}
    />}
  </section>;
}

function ProjectsPage({projects,drums,openJobCard,createProject,updateProject,linkDrumsToProject,unlinkDrumFromProject}){
  const activeDrums=drums.filter(d=>!isArchivedStatus(d));
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
        <p>Active kits and projects appear first. Open a linked drum to view its Job Card, or use the section below to link additional active drums.</p>
      </div>
      <button className="primary" onClick={createProject}><FolderPlus size={16}/> New Kit / Project</button>
    </section>

    {projects.length===0 && <section className="panel warning">
      <h2>No kits or projects yet</h2>
      <p>Click New Kit / Project first. If creation fails, run the included v5.0 Supabase setup.</p>
    </section>}

    <section className="templateGrid">
      {projects.map(project=>{
        const linked=activeDrums
          .filter(d=>d.project_id===project.id)
          .sort((a,b)=>extractNumber(a.serial)-extractNumber(b.serial));
        const complete=linked.filter(d=>workflowState(d.build_type||"Stave",parseChecked(d.notes),d.finish,d.build_client,d.drum_type,d.size).percent===100).length;
        const overall=linked.length ? Math.round(linked.reduce((sum,d)=>sum+workflowState(d.build_type||"Stave",parseChecked(d.notes),d.finish,d.build_client,d.drum_type,d.size).percent,0)/linked.length) : 0;

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

          <ProjectMediaSection project={project}/>
        </article>
      })}
    </section>

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
        {[...activeDrums].sort((a,b)=>extractNumber(a.serial)-extractNumber(b.serial)).map(d=>
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

  useEffect(()=>{
    loadPhotos();
    const refresh=(event)=>{
      if(!event?.detail?.drumId || event.detail.drumId===drum.id) loadPhotos();
    };
    window.addEventListener("drum-media-updated",refresh);
    return ()=>window.removeEventListener("drum-media-updated",refresh);
  },[drum.id]);

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
          const baseLabel=photoMilestones[photo.milestone]?.label || launchPackStages.find(stage=>stage.key===photo.milestone)?.label || photo.milestone;
          const label=photo.milestone==="shellcomplete"
            ? drum.build_client==="Brady" ? "Brady shell complete" : "Nowak shell complete"
            : baseLabel;
          const actions=communicationActionsForDrum(drum,photo.milestone);
          return <div className="storedMediaCard" key={photo.id}>
            <a href={photo.public_url} target="_blank" rel="noreferrer">
              {isVideo
                ? <video src={photo.public_url} muted playsInline controls preload="metadata"/>
                : <img src={photo.public_url} alt={photo.milestone}/>}
              {isVideo && <span className="videoMediaBadge">VIDEO</span>}
            </a>
            <span>{label}</span>
            <div className="storedMediaPrimaryActions">
              <a className="buttonLike" href={photo.public_url} target="_blank" rel="noreferrer">Open</a>
              <details className="storedMediaMore">
                <summary>More</summary>
                <div className="storedMediaMoreMenu">
                  <button onClick={()=>downloadStoredMedia([photo],drum,label,setMessage)}>Download</button>
                  {actions.canEmail && <a className={"buttonLike "+(!drum.customer_email?"disabledLink":"")} href={drum.customer_email?actions.mailto:undefined}><Mail size={14}/> Customer email</a>}
                  {actions.canSocial && <button onClick={()=>{navigator.clipboard?.writeText(actions.message.social);setMessage?.("Facebook caption copied.");}}>Copy Facebook caption</button>}
                  {actions.canSocial && <button onClick={()=>{navigator.clipboard?.writeText(actions.message.instagram);setMessage?.("Instagram caption copied.");}}>Copy Instagram caption</button>}
                  {onAddPhoto && <button onClick={()=>onAddPhoto(drum,photo.milestone)}>Add more media</button>}
                  <button className="mediaDeleteButton" onClick={()=>deleteStoredMedia(photo)}>Delete</button>
                </div>
              </details>
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
          <h2>Photos &amp; Videos by Stage</h2>
        </div>
        <button onClick={load}>{loading?"Loading...":"Refresh"}</button>
      </div>
      <p>No milestone photos or videos have been stored yet. Add media from the relevant production stage.</p>
    </section>
  }

  return <section className="panel inner stageCommsPanel">
    <div className="stageCommsHeader">
      <div>
        <span className="launchPackEyebrow">STORED CONTENT</span>
        <h2>Photos &amp; Videos by Stage</h2>
        <p>Each stage keeps its own media together, without duplicating everything in a separate gallery.</p>
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
              <small>{items.length} media file{items.length===1?"":"s"}</small>
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
              <button onClick={()=>downloadPhotos(items,stageLabel(key))}>Download Media</button>
              <button onClick={()=>onAddPhoto?.(drum,key)}>Add Photo or Video</button>
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
  const [source,setSource]=useState("");
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

    const shareResult=source==="camera"
      ? await offerSaveToDevice(files,`${drum.timber||"Nowak drum"} — ${milestone.label}`)
      : {supported:false,shared:false};
    setStatus(source==="camera" && shareResult.supported
      ? "Saving photos to the app..."
      : "Uploading photos...");
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
      window.dispatchEvent(new CustomEvent("drum-media-updated",{detail:{drumId:drum.id}}));
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
      <input className="hiddenFileInput" ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={e=>{setSource("camera");setFiles(Array.from(e.target.files || []));}}/>
      <input className="hiddenFileInput" ref={libraryInputRef} type="file" accept="image/*" multiple onChange={e=>{setSource("library");setFiles(Array.from(e.target.files || []));}}/>
      {files.length>0 && <p className="okText">{files.length} photo{files.length===1?"":"s"} selected and ready to upload.</p>}

      <button type="button" className="primary uploadPhotosButton" disabled={status==="Uploading photos..." || status==="Saving photos to the app..."} onClick={uploadPhotos}><Camera size={16}/> {(status==="Uploading photos..." || status==="Saving photos to the app...") ? "Uploading..." : source==="camera" ? "Upload & Save to iPhone" : "Upload"}</button>
      {source==="camera" && <small className="saveToPhoneNote">On iPhone, choose <b>Save Image</b> in the share sheet. The photo will also be uploaded to this drum.</small>}
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


function JobCard({drum, template, labourRate, onClose, updateDrum, completeDrum, addTime, markSold, markShipped, archiveDrum, restoreArchivedDrum, setDrumLifecycle, copyText, deleteDrum, drums=[], projects=[], createProject, setMessage, onAddDrumToProject}){
  const [localBuildType,setLocalBuildType]=useState(drum.build_type || "Stave");
  const [localOwnership,setLocalOwnership]=useState(drum.build_client || "Unallocated");
  const [localCbNumber,setLocalCbNumber]=useState(drum.cb_number || "");
  const [localBuildSpec,setLocalBuildSpec]=useState(
    drum.build_type==="Ply" && (!drum.construction_note || drum.construction_note==="Shell thickness: 12 mm")
      ? defaultBuildSpecification(drum.drum_type || "Snare","Ply")
      : (drum.construction_note || defaultBuildSpecification(drum.drum_type || "Snare",drum.build_type || "Stave"))
  );
  const [checked,setChecked]=useState(parseChecked(drum.notes));
  const [timeAmount,setTimeAmount]=useState(0.5);
  const [timeLabel,setTimeLabel]=useState("Workshop time");
  const [customPrice,setCustomPrice]=useState(drum.custom_price ?? drum.retail_price ?? 0);
  const [shipping,setShipping]=useState(drum.shipping_cost||0);
  const [veneer,setVeneer]=useState([drum.veneer_1_thickness,drum.veneer_2_thickness,drum.veneer_3_thickness,drum.veneer_4_thickness,drum.veneer_5_thickness].map(x=>x||1.2));
  const [draft,setDraft]=useState({
    serial:drum.serial||"",
    timber:drum.timber||"",
    customer:drum.customer||"",
    customer_phone:drum.customer_phone||"",
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
  const suggestedNowakSerial=calculateEncodedNowakSerial(draft.serial,new Date());
  const serialConflict=encodedSerialConflict(drums,suggestedNowakSerial,drum.id);
  const flow=workflowState(localBuildType,checked,draft.finish,localOwnership,drum.drum_type,drum.size);
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
    const numberError=duplicateNumberMessage(drums,{
      id:drum.id,
      serial:draft.serial,
      cbNumber:localCbNumber,
      buildClient:localOwnership,
    });
    const nowakSerialDuplicate=localOwnership==="Nowak"
      ? encodedSerialConflict(drums,draft.nowak_serial,drum.id)
      : null;
    if(nowakSerialDuplicate){
      const detail=`Nowak serial ${draft.nowak_serial} is already used by production #${nowakSerialDuplicate.serial}.`;
      setSavedMessage(detail);
      setMessage(detail);
      return false;
    }
    if(numberError){
      setSavedMessage(numberError);
      setMessage(numberError);
      return false;
    }
    setIsSaving(true);
    const nextFlow=workflowState(localBuildType,checked,draft.finish,localOwnership,drum.drum_type,drum.size);
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

    const derivedLifecycle=currentLifecycleStatus==="Archived"
      ? "Archived"
      : checked.has("Shipped")
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
      customer_phone:draft.customer_phone,
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
      production_status:["Completed","Sold","Shipped","Archived"].includes(derivedLifecycle)
        ? "Manufacturing Complete"
        : nextFlow.status,
      next_step:derivedLifecycle==="Archived"
        ? "Archived"
        : derivedLifecycle==="Shipped"
          ? "Confirm delivery / archive"
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
    const nextFlow=workflowState(localBuildType,nextChecked,draft.finish,localOwnership,drum.drum_type,drum.size);
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
    const lifecycle=storedLifecycle==="Archived"
      ? "Archived"
      : storedLifecycle==="Shipped"
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
      production_status:["Completed","Sold","Shipped","Archived"].includes(lifecycle)
        ? "Manufacturing Complete"
        : nextFlow.status,
      next_step:lifecycle==="Archived"
        ? "Archived"
        : lifecycle==="Shipped"
          ? "Confirm delivery / archive"
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
        <label>Customer phone</label><input value={draft.customer_phone} onChange={e=>setDraft({...draft,customer_phone:e.target.value})}/>
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
          const previousDefault=defaultBuildSpecification(drum.drum_type||"Snare",localBuildType);
          const nextSpec=(!localBuildSpec || localBuildSpec===previousDefault || (localBuildType==="Ply" && localBuildSpec==="Shell thickness: 12 mm"))
            ? defaultBuildSpecification(newType,localBuildType)
            : localBuildSpec;
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
    {localBuildType==="Ply" && <section className="panel inner"><StaveSpecPanel diameter={splitSize(drum.size).diameter} drumType={drum.drum_type||"Snare"} buildType="Ply" serial={drum.serial} timber={draft.timber} size={drum.size}/><h2>Ply Veneer Calculator</h2><p className="calcNote">{sizeAdjustmentLabel(drum.size)}. Layer 1 is fixed as the largest outer layer; thickness changes affect the inner layers only.</p><div className="veneerGrid">{veneer.map((v,i)=><label key={i}>Layer {i+1} thickness<input value={v} onChange={e=>changeVeneer(i,e.target.value)} onBlur={e=>saveVeneer(i,e.target.value)}/></label>)}</div><VeneerResult lengths={adjustedLengths(veneer, drum.size)} thicknesses={veneer}/></section>}

    <section className="panel inner"><h2>Manufacturing Checklist</h2>
      {shouldSuggestExtraFiddlebackCoat({...drum,...draft,timber:draft.timber,finish:draft.finish}) && <div className="fiddlebackCoatSuggestion">
        <b>Fiddleback High Gloss consideration</b>
        <span>Consider applying an additional fifth polyurethane coat for extra build and depth. This is a workshop suggestion only and is not required to complete the workflow.</span>
      </div>}
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
      <div className="checkGrid">{manufacturingChecklist(localBuildType,draft.finish,localOwnership,drum.drum_type).map(item=>{
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
            className={["Completed","Sold","Shipped","Archived"].includes(drumLifecycleStatus(drum)) ? "primary" : ""}
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

          {!isArchivedStatus(drum) && <button
            className="archiveDrumButton"
            onClick={async()=>{
              const saved=await archiveDrum({...drum,notes:setChecklistInNotes(draft.notes,checked)});
              if(saved) onClose();
            }}
          >
            <Archive size={16}/> Close & Archive
          </button>}

          {isArchivedStatus(drum) && <button
            className="primary"
            onClick={()=>restoreArchivedDrum(drum)}
          >
            <ArchiveRestore size={16}/> Restore from Archive
          </button>}
        </div>

        {isArchivedStatus(drum)
          ? <p className="archiveStatusMessage">This drum is fully closed and stored in the Drum Archive. {archiveDetailsFromNotes(drum.notes).reason && `Outcome: ${archiveDetailsFromNotes(drum.notes).reason}.`}</p>
          : isShippedStatus(drum)
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
        ? "This drum is complete. Use the private encoded suggestion or enter a serial manually."
        : "The calculator is available now, but the final serial is normally assigned when the drum is completed."}</p>
      <section className="serialSuggestionBox">
        <div>
          <span>Encoded suggestion</span>
          <b>{suggestedNowakSerial || "Production number required"}</b>
          <small>Generated from the private production number and today's completion date. It does not show an obvious production sequence.</small>
        </div>
        <button
          type="button"
          disabled={!suggestedNowakSerial || Boolean(serialConflict)}
          onClick={()=>setDraft({...draft,nowak_serial:suggestedNowakSerial})}
        >
          Use Suggested Serial
        </button>
      </section>
      {serialConflict && <p className="dangerText">This suggested serial is already used by production #{serialConflict.serial}.</p>}
      <label>Nowak serial number</label>
      <input
        value={draft.nowak_serial}
        onChange={e=>setDraft({...draft,nowak_serial:e.target.value})}
        placeholder="Enter or generate final Nowak serial number"
      />
      {draft.nowak_serial && encodedSerialConflict(drums,draft.nowak_serial,drum.id)
        ? <small className="dangerText">Duplicate serial number — it will not be saved.</small>
        : <small>Use the main Save Changes button to store the serial number.</small>}
      <DrumQrPanel serial={draft.nowak_serial}/>
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

const publicSerial=new URLSearchParams(window.location.search).get("drumSerial");
createRoot(document.getElementById("root")).render(publicSerial ? <PublicDrumPage serial={publicSerial}/> : <App />);

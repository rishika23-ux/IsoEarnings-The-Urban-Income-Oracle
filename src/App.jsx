import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   ISO EARNINGS v3 — AI Income Protection for Gig Workers
   Unicornstartups-inspired · Pure black · Fluorescent · Editorial
   ═══════════════════════════════════════════════════════════════ */

// ── TOKENS ────────────────────────────────────────────────────────────────────
const T = {
  void:"#000000", ink:"#080808", surface:"#0F0F0F", elevated:"#141414",
  overlay:"#1A1A1A", line:"#1E1E1E", lineHi:"#2A2A2A",
  lime:"#B8FF57", limeDim:"#B8FF5714", limeGlow:"#B8FF5730",
  cyan:"#00F5FF", cyanDim:"#00F5FF12",
  orange:"#FF6B1A", orangeDim:"#FF6B1A12",
  pink:"#FF2D78", pinkDim:"#FF2D7812",
  purple:"#A855F7", purpleDim:"#A855F712",
  yellow:"#FFE14D", yellowDim:"#FFE14D12",
  blue:"#38BFFF", blueDim:"#38BFFF12",
  white:"#FFFFFF", t1:"#F0F0F0", t2:"#999999", t3:"#555555", t4:"#2A2A2A",
};

// ── INDIAN CITIES ─────────────────────────────────────────────────────────────
const CITIES = [
  { name:"Mumbai",     state:"Maharashtra", risk:"high",   zones:["Andheri","Bandra","Dadar","Kurla","Thane"] },
  { name:"Chennai",    state:"Tamil Nadu",  risk:"high",   zones:["T. Nagar","Egmore","Velachery","Adyar","Anna Nagar"] },
  { name:"Delhi",      state:"Delhi",       risk:"high",   zones:["Connaught Place","Dwarka","Rohini","Lajpat Nagar","Saket"] },
  { name:"Bengaluru",  state:"Karnataka",   risk:"medium", zones:["Koramangala","Indiranagar","Whitefield","HSR Layout","Jayanagar"] },
  { name:"Hyderabad",  state:"Telangana",   risk:"medium", zones:["Banjara Hills","HITEC City","Gachibowli","Secunderabad","Ameerpet"] },
  { name:"Kolkata",    state:"West Bengal", risk:"high",   zones:["Park Street","Salt Lake","Howrah","Dum Dum","New Town"] },
  { name:"Pune",       state:"Maharashtra", risk:"medium", zones:["Koregaon Park","Kothrud","Viman Nagar","Hadapsar","Wakad"] },
  { name:"Ahmedabad",  state:"Gujarat",     risk:"low",    zones:["Navrangpura","Vastrapur","Satellite","Prahlad Nagar","Bopal"] },
  { name:"Jaipur",     state:"Rajasthan",   risk:"low",    zones:["C-Scheme","Malviya Nagar","Mansarovar","Vaishali Nagar","Sodala"] },
  { name:"Surat",      state:"Gujarat",     risk:"low",    zones:["Adajan","Vesu","Katargam","Piplod","Althan"] },
];

const PLATFORMS = ["Swiggy","Zomato","Blinkit","BigBasket"];
const ORDER_FREQ = [
  { label:"1–2/hr", value:1.5, color:T.orange },
  { label:"3–4/hr", value:3.5, color:T.yellow },
  { label:"5+/hr",  value:5.5, color:T.lime   },
];
const WORK_HOURS = [
  { label:"2–4 hrs", hours:3,  multiplier:0.5 },
  { label:"4–6 hrs", hours:5,  multiplier:0.8 },
  { label:"6–8 hrs", hours:7,  multiplier:1.0 },
  { label:"8+ hrs",  hours:9,  multiplier:1.2 },
];

// ── SMART INCOME VALIDATION ENGINE ────────────────────────────────────────────
function estimateIncome({ platform, ordersPerHour, workHours, city }) {
  const baseOrderValue = { Swiggy:75, Zomato:72, Blinkit:65, BigBasket:90 }[platform] || 72;
  const cityMultiplier = { Mumbai:1.15, Delhi:1.1, Bengaluru:1.12, Chennai:0.95, Hyderabad:1.0, Kolkata:0.92, Pune:1.0, Ahmedabad:0.88, Jaipur:0.85, Surat:0.87 }[city] || 1.0;
  const daily = ordersPerHour * baseOrderValue * workHours * cityMultiplier;
  const weekly = daily * 6;
  return { daily: Math.round(daily), weekly: Math.round(weekly), hourly: Math.round(ordersPerHour * baseOrderValue * cityMultiplier) };
}

function validateIncome({ userHourly, estimated, city, platform }) {
  const diff = Math.abs(userHourly - estimated.hourly) / estimated.hourly;
  if (diff < 0.15) return { status:"match",    confidence:"HIGH",   score:92, message:null };
  if (diff < 0.35) return { status:"close",    confidence:"MEDIUM", score:74, message:`Adjusted slightly based on ${city} area average` };
  return {              status:"mismatch",  confidence:"LOW",    score:51, message:`Your input differs from typical earnings in ${city}. Adjusted for accuracy.` };
}

function computeTrustScore({ validation, consistency, claimsHistory }) {
  let score = validation.score;
  if (consistency === "daily")   score += 8;
  if (consistency === "random")  score -= 10;
  if (claimsHistory === "none")  score += 5;
  if (claimsHistory === "many")  score -= 12;
  return Math.min(100, Math.max(30, score));
}

// ── PREMIUM ENGINE ─────────────────────────────────────────────────────────────
function computePremium({ plan, city, ordersPerHour, workPattern, cityRisk, claimsHistory, trustScore, coverageLevel }) {
  let base = { basic:20, pro:30, elite:35 }[plan.id] || 30;
  const items = [{ label:"Base premium", val:base, color:T.t2 }];

  const cityAdj = { high:10, medium:5, low:0 }[cityRisk] || 0;
  if (cityAdj > 0) items.push({ label:`${city} risk zone`, val:`+₹${cityAdj}`, color:T.orange });
  base += cityAdj;

  if (ordersPerHour >= 5) { items.push({ label:"Peak activity", val:"+₹4", color:T.yellow }); base += 4; }
  if (workPattern === "peak") { items.push({ label:"Peak hours dependency", val:"+₹4", color:T.yellow }); base += 4; }
  if (workPattern === "random") { items.push({ label:"Inconsistent schedule", val:"+₹2", color:T.orange }); base += 2; }
  if (workPattern === "daily") { items.push({ label:"Consistent worker", val:"-₹2", color:T.lime }); base -= 2; }
  if (claimsHistory === "many") { items.push({ label:"Frequent claims", val:"+₹5", color:T.pink }); base += 5; }
  if (claimsHistory === "none") { items.push({ label:"No prior claims", val:"-₹2", color:T.lime }); base -= 2; }
  if (trustScore >= 85) { items.push({ label:"High trust score", val:"-₹3", color:T.lime }); base -= 3; }
  if (coverageLevel > 70) { items.push({ label:"High coverage level", val:`+₹${Math.round((coverageLevel-50)/10)}`, color:T.yellow }); base += Math.round((coverageLevel-50)/10); }

  return { total: Math.max(15, base), items };
}

// ── PLANS DATA ─────────────────────────────────────────────────────────────────
const PLANS = [
  {
    id:"basic", name:"Basic", color:T.cyan, tagline:"Essential cover",
    coverages:[
      { trigger:"Rain",    max:500, included:true  },
      { trigger:"AQI",     max:300, included:true  },
      { trigger:"Traffic", max:200, included:false },
      { trigger:"Heat",    max:300, included:false },
      { trigger:"Cluster", max:400, included:false },
    ],
    whyAI:["Covers primary weather risks","Good for part-time workers","Low premium zone"]
  },
  {
    id:"pro", name:"Pro", color:T.lime, tagline:"Best value", popular:true,
    coverages:[
      { trigger:"Rain",    max:600, included:true },
      { trigger:"AQI",     max:400, included:true },
      { trigger:"Traffic", max:300, included:true },
      { trigger:"Heat",    max:300, included:false },
      { trigger:"Cluster", max:400, included:true },
    ],
    whyAI:["You work peak hours","Your zone has high rainfall","High income dependency"]
  },
  {
    id:"elite", name:"Elite", color:T.orange, tagline:"Full shield",
    coverages:[
      { trigger:"Rain",    max:700, included:true },
      { trigger:"AQI",     max:500, included:true },
      { trigger:"Traffic", max:400, included:true },
      { trigger:"Heat",    max:350, included:true },
      { trigger:"Cluster", max:500, included:true },
    ],
    whyAI:["Maximum income protection","All disruption types covered","Ideal for full-time riders"]
  },
];

const HISTORY = [
  { id:1, date:"Mar 15", trigger:"Rain",    icon:"🌧️", expected:360, actual:120, loss:240, payout:180 },
  { id:2, date:"Mar 10", trigger:"Heat",    icon:"🌡️", expected:280, actual:90,  loss:190, payout:142 },
  { id:3, date:"Mar 5",  trigger:"Traffic", icon:"🚦", expected:320, actual:200, loss:120, payout:90  },
];

// ── GLOBAL STYLES ──────────────────────────────────────────────────────────────
const GS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:#000;color:#F0F0F0;font-family:'Instrument Sans',sans-serif;-webkit-font-smoothing:antialiased;}
    input,button,select{font-family:inherit;}
    ::selection{background:#B8FF57;color:#000;}
    ::-webkit-scrollbar{width:3px;}
    ::-webkit-scrollbar-track{background:#000;}
    ::-webkit-scrollbar-thumb{background:#222;border-radius:99px;}
    input[type=range]{-webkit-appearance:none;appearance:none;height:4px;border-radius:99px;outline:none;cursor:pointer;}
    input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#B8FF57;cursor:pointer;border:2px solid #000;box-shadow:0 0 8px #B8FF5760;}
    @keyframes up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fade{from{opacity:0}to{opacity:1}}
    @keyframes pop{0%{transform:scale(0);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
    @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
    @keyframes rain{from{transform:translateY(-80px)}to{transform:translateY(260px)}}
    @keyframes bar{from{width:0}}
    @keyframes pulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.6);opacity:0}}
    @keyframes slideup{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
    @keyframes glow{0%,100%{box-shadow:0 0 20px #B8FF5720}50%{box-shadow:0 0 40px #B8FF5740}}
  `}</style>
);

// ── PRIMITIVES ─────────────────────────────────────────────────────────────────
const Pill = ({ children, color=T.lime, dot, size=11 }) => (
  <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:color+"15", color, border:`1px solid ${color}30`, borderRadius:99, padding:"3px 10px", fontSize:size, fontWeight:600, fontFamily:"'JetBrains Mono',monospace", letterSpacing:"0.04em", textTransform:"uppercase" }}>
    {dot && <span style={{ width:5, height:5, borderRadius:"50%", background:color, display:"inline-block", animation:"blink 1.5s infinite" }} />}
    {children}
  </span>
);

const Glass = ({ children, accent, style={}, onClick, delay=0 }) => (
  <div onClick={onClick} style={{ background:"rgba(255,255,255,0.025)", border:`1px solid ${accent?accent+"40":T.line}`, borderRadius:20, position:"relative", overflow:"hidden", boxShadow:accent?`0 0 0 1px ${accent}08 inset`:0, animation:`up .45s ease ${delay}s both`, cursor:onClick?"pointer":"default", transition:"border-color .2s, box-shadow .2s", ...style }}>
    {accent && <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${accent}80,transparent)` }} />}
    {children}
  </div>
);

const Mono = ({ children, size=16, color=T.white, style={} }) => (
  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:size, fontWeight:700, color, letterSpacing:"-0.02em", ...style }}>{children}</span>
);

const Label = ({ children, color=T.t3 }) => (
  <div style={{ fontSize:10, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color, fontFamily:"'JetBrains Mono',monospace", marginBottom:6 }}>{children}</div>
);

const Track = ({ value, max=100, color=T.lime, h=3 }) => (
  <div style={{ background:T.line, borderRadius:99, height:h, overflow:"hidden" }}>
    <div style={{ width:`${Math.min(100,(value/max)*100)}%`, height:"100%", borderRadius:99, background:color, boxShadow:`0 0 6px ${color}60`, animation:"bar 1s ease", transition:"width 1.2s ease" }} />
  </div>
);

const Divider = () => <div style={{ height:1, background:T.line, margin:"14px 0" }} />;
const BackBtn = ({ onClick }) => (
  <button onClick={onClick} style={{ background:T.surface, border:`1px solid ${T.line}`, color:T.t2, borderRadius:12, padding:"8px 16px", cursor:"pointer", fontSize:13, fontWeight:500 }}>← Back</button>
);

function Counter({ to, prefix="", suffix="", dur=1400, color=T.white, size=40 }) {
  const [v,setV]=useState(0);
  useEffect(()=>{
    let t0=null;
    const go=(ts)=>{ if(!t0)t0=ts; const p=Math.min((ts-t0)/dur,1),e=1-Math.pow(1-p,3); setV(Math.round(e*to)); if(p<1)requestAnimationFrame(go); };
    requestAnimationFrame(go);
  },[to]);
  return <Mono size={size} color={color}>{prefix}{v}{suffix}</Mono>;
}

const Wordmark = ({ small }) => (
  <div style={{ display:"flex", alignItems:"baseline", gap:3 }}>
    <span style={{ fontFamily:"'Syne',sans-serif", fontSize:small?18:22, fontWeight:800, color:T.white, letterSpacing:"-0.04em" }}>iso</span>
    <span style={{ fontFamily:"'Syne',sans-serif", fontSize:small?18:22, fontWeight:800, color:T.lime, letterSpacing:"-0.04em" }}>earnings</span>
  </div>
);

const PrimaryBtn = ({ children, onClick, color=T.lime, style={} }) => (
  <button onClick={onClick} style={{ width:"100%", padding:"16px 0", borderRadius:16, border:"none", background:color, color:color===T.lime?T.void:T.white, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'Syne',sans-serif", letterSpacing:"-0.01em", boxShadow:`0 0 32px ${color}28`, transition:"box-shadow .2s", ...style }}>
    {children}
  </button>
);

// ── CONFIDENCE BADGE ───────────────────────────────────────────────────────────
const ConfidenceBadge = ({ level }) => {
  const cfg = { HIGH:{ color:T.lime, icon:"✅" }, MEDIUM:{ color:T.yellow, icon:"⚠️" }, LOW:{ color:T.pink, icon:"⚠️" } }[level] || { color:T.lime, icon:"✅" };
  return <Pill color={cfg.color}>{cfg.icon} {level} confidence</Pill>;
};

const TrustBadge = ({ score }) => {
  const color = score>=80?T.lime:score>=60?T.yellow:T.pink;
  return (
    <div style={{ background:color+"12", border:`1px solid ${color}30`, borderRadius:14, padding:"12px 16px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
        <div style={{ fontSize:13, fontWeight:700, color }}>Trust Score</div>
        <Mono size={20} color={color}>{score}<span style={{ fontSize:12, color:T.t3 }}>/100</span></Mono>
      </div>
      <Track value={score} max={100} color={color} h={4} />
      <div style={{ fontSize:11, color:T.t3, marginTop:6 }}>✔ Verified earning pattern · {score>=80?"High":"Moderate"} reliability</div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// SCREEN 1: ONBOARDING — multi-step with smart validation
// ══════════════════════════════════════════════════════════
function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [city, setCity] = useState(null);
  const [platform, setPlatform] = useState("Swiggy");
  const [orderFreq, setOrderFreq] = useState(1); // index
  const [workHoursIdx, setWorkHoursIdx] = useState(2);
  const [workPattern, setWorkPattern] = useState("daily");
  const [userHourly, setUserHourly] = useState(120);
  const [claimsHistory, setClaimsHistory] = useState("none");
  const [detecting, setDetecting] = useState(false);
  const [detected, setDetected] = useState(false);
  const [citySearch, setCitySearch] = useState("");

  const selectedFreq = ORDER_FREQ[orderFreq];
  const selectedHours = WORK_HOURS[workHoursIdx];
  const estimated = city ? estimateIncome({ platform, ordersPerHour: selectedFreq.value, workHours: selectedHours.hours, city: city.name }) : null;
  const validation = estimated ? validateIncome({ userHourly, estimated, city: city?.name, platform }) : null;
  const trustScore = validation ? computeTrustScore({ validation, consistency: workPattern, claimsHistory }) : null;

  const filteredCities = CITIES.filter(c => c.name.toLowerCase().includes(citySearch.toLowerCase()) || c.state.toLowerCase().includes(citySearch.toLowerCase()));

  const detectLocation = () => {
    setDetecting(true);
    setTimeout(() => { setCity(CITIES[1]); setDetected(true); setDetecting(false); }, 1800);
  };

  const steps = [
    { title:"Hey, welcome 👋", sub:"Let's set up your income shield" },
    { title:"Where do you work?", sub:"Auto-detected or choose your city" },
    { title:"Your delivery profile", sub:"Helps us estimate income accurately" },
    { title:"AI Income Validation", sub:"We calculate what you should earn" },
  ];

  const canNext = [
    name.length > 1,
    !!city,
    true,
    true,
  ][step];

  return (
    <div style={{ minHeight:"100vh", background:T.void, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px 20px" }}>
      <div style={{ position:"fixed", top:"15%", left:"50%", transform:"translateX(-50%)", width:500, height:300, background:`radial-gradient(ellipse,${T.lime}06 0%,transparent 70%)`, pointerEvents:"none" }} />

      <div style={{ width:"100%", maxWidth:400, animation:"fade .6s ease" }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <Wordmark />
          <div style={{ fontSize:11, color:T.t3, marginTop:4, letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:"'JetBrains Mono',monospace" }}>AI Income Protection · India</div>
        </div>

        {/* Step indicators */}
        <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:28 }}>
          {steps.map((_,i) => <div key={i} style={{ width:i===step?28:6, height:6, borderRadius:99, background:i===step?T.lime:i<step?T.lime+"60":T.line, transition:"all .3s ease" }} />)}
        </div>

        <Glass accent={T.lime} style={{ padding:28 }}>
          <Label>{`Step ${step+1} of ${steps.length}`}</Label>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:T.white, letterSpacing:"-0.03em", marginBottom:4 }}>{steps[step].title}</div>
          <div style={{ fontSize:13, color:T.t3, marginBottom:24 }}>{steps[step].sub}</div>

          {/* STEP 0: Name */}
          {step===0 && (
            <div style={{ animation:"up .4s ease" }}>
              <Label color={T.t3}>Your name</Label>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Rajan Kumar"
                style={{ width:"100%", background:T.surface, border:`1px solid ${T.lineHi}`, borderRadius:12, padding:"13px 16px", color:T.white, fontSize:15, outline:"none", marginBottom:20 }}
                onFocus={e=>e.target.style.borderColor=T.lime} onBlur={e=>e.target.style.borderColor=T.lineHi} />

              <Label color={T.t3}>Delivery platform</Label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {PLATFORMS.map(p => (
                  <button key={p} onClick={()=>setPlatform(p)} style={{ padding:"11px 0", borderRadius:12, border:`1px solid ${platform===p?T.lime:T.line}`, background:platform===p?T.limeDim:"transparent", color:platform===p?T.lime:T.t3, fontSize:13, fontWeight:600, cursor:"pointer", transition:"all .2s" }}>{p}</button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1: City */}
          {step===1 && (
            <div style={{ animation:"up .4s ease" }}>
              {/* Auto-detect */}
              <button onClick={detectLocation} disabled={detecting||detected} style={{ width:"100%", padding:"13px 0", borderRadius:12, border:`1px solid ${detected?T.lime+"50":T.lineHi}`, background:detected?T.limeDim:"transparent", color:detected?T.lime:T.t2, fontSize:13, fontWeight:600, cursor:"pointer", marginBottom:16, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                {detecting ? <><span style={{ animation:"spin 1s linear infinite", display:"inline-block" }}>⟳</span> Detecting location...</>
                  : detected ? <>✓ Auto-detected: {city?.name}, {city?.state}</>
                  : <>📍 Auto-detect my location</>}
              </button>

              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                <div style={{ flex:1, height:1, background:T.line }} />
                <span style={{ fontSize:11, color:T.t3 }}>or choose city</span>
                <div style={{ flex:1, height:1, background:T.line }} />
              </div>

              <input value={citySearch} onChange={e=>setCitySearch(e.target.value)} placeholder="Search city or state..."
                style={{ width:"100%", background:T.surface, border:`1px solid ${T.lineHi}`, borderRadius:12, padding:"11px 14px", color:T.white, fontSize:13, outline:"none", marginBottom:10 }} />

              <div style={{ maxHeight:180, overflowY:"auto" }}>
                {filteredCities.map(c => (
                  <div key={c.name} onClick={()=>{ setCity(c); setCitySearch(""); }} style={{ padding:"10px 14px", borderRadius:10, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", background:city?.name===c.name?T.limeDim:"transparent", border:`1px solid ${city?.name===c.name?T.lime+"40":"transparent"}`, marginBottom:4, transition:"all .15s" }}>
                    <div>
                      <div style={{ fontSize:13, color:T.t1, fontWeight:600 }}>{c.name}</div>
                      <div style={{ fontSize:11, color:T.t3 }}>{c.state}</div>
                    </div>
                    <Pill color={{high:T.pink,medium:T.yellow,low:T.lime}[c.risk]} size={9}>{c.risk} risk</Pill>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Work profile */}
          {step===2 && (
            <div style={{ animation:"up .4s ease" }}>
              <Label color={T.t3}>Orders per hour</Label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:18 }}>
                {ORDER_FREQ.map((f,i) => (
                  <button key={f.label} onClick={()=>setOrderFreq(i)} style={{ padding:"12px 0", borderRadius:12, border:`1px solid ${orderFreq===i?f.color:T.line}`, background:orderFreq===i?f.color+"14":"transparent", color:orderFreq===i?f.color:T.t3, fontSize:12, fontWeight:700, cursor:"pointer", transition:"all .2s" }}>{f.label}</button>
                ))}
              </div>

              <Label color={T.t3}>Daily work hours</Label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:18 }}>
                {WORK_HOURS.map((w,i) => (
                  <button key={w.label} onClick={()=>setWorkHoursIdx(i)} style={{ padding:"11px 0", borderRadius:12, border:`1px solid ${workHoursIdx===i?T.cyan:T.line}`, background:workHoursIdx===i?T.cyanDim:"transparent", color:workHoursIdx===i?T.cyan:T.t3, fontSize:12, fontWeight:600, cursor:"pointer", transition:"all .2s" }}>{w.label}</button>
                ))}
              </div>

              <Label color={T.t3}>Work pattern</Label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:18 }}>
                {[{id:"daily",label:"Daily",icon:"📅"},{id:"peak",label:"Peak hrs",icon:"⚡"},{id:"random",label:"Flexible",icon:"🔄"}].map(p => (
                  <button key={p.id} onClick={()=>setWorkPattern(p.id)} style={{ padding:"11px 6px", borderRadius:12, border:`1px solid ${workPattern===p.id?T.lime:T.line}`, background:workPattern===p.id?T.limeDim:"transparent", color:workPattern===p.id?T.lime:T.t3, fontSize:11, fontWeight:600, cursor:"pointer", transition:"all .2s" }}>{p.icon}<br/>{p.label}</button>
                ))}
              </div>

              <Label color={T.t3}>Prior claims this month</Label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                {[{id:"none",label:"None"},{id:"some",label:"1–2"},{id:"many",label:"3+"}].map(c => (
                  <button key={c.id} onClick={()=>setClaimsHistory(c.id)} style={{ padding:"10px 0", borderRadius:12, border:`1px solid ${claimsHistory===c.id?T.yellow:T.line}`, background:claimsHistory===c.id?T.yellowDim:"transparent", color:claimsHistory===c.id?T.yellow:T.t3, fontSize:12, fontWeight:600, cursor:"pointer" }}>{c.label}</button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: AI Validation */}
          {step===3 && estimated && (
            <div style={{ animation:"up .4s ease" }}>
              {/* System estimate */}
              <div style={{ background:T.surface, border:`1px solid ${T.lineHi}`, borderRadius:14, padding:18, marginBottom:14 }}>
                <Label color={T.t3}>AI estimated weekly income</Label>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginTop:8 }}>
                  <div>
                    <Mono size={36} color={T.lime}>₹{estimated.weekly.toLocaleString()}</Mono>
                    <div style={{ fontSize:12, color:T.t3, marginTop:4 }}>Calculated from your activity</div>
                  </div>
                  <ConfidenceBadge level={validation.confidence} />
                </div>
                <Divider />
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginTop:4 }}>
                  {[["Hourly",`₹${estimated.hourly}`],["Daily",`₹${estimated.daily}`],["Weekly",`₹${estimated.weekly.toLocaleString()}`]].map(([l,v])=>(
                    <div key={l} style={{ textAlign:"center" }}>
                      <Mono size={14} color={T.t1}>{v}</Mono>
                      <div style={{ fontSize:10, color:T.t3, marginTop:3 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* User input vs system */}
              <div style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <Label color={T.t3}>Your stated hourly: you can adjust</Label>
                  <Mono size={12} color={T.yellow}>₹{userHourly}/hr</Mono>
                </div>
                <input type="range" min={60} max={300} step={5} value={userHourly} onChange={e=>setUserHourly(+e.target.value)}
                  style={{ width:"100%", accentColor:T.lime, background:T.line, borderRadius:99 }} />
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:T.t3, marginTop:4 }}><span>₹60</span><span>₹300</span></div>
              </div>

              {/* Validation message */}
              {validation.message && (
                <div style={{ background:T.orange+"12", border:`1px solid ${T.orange}30`, borderRadius:12, padding:"10px 14px", fontSize:12, color:T.orange, marginBottom:14 }}>
                  ⚠️ {validation.message}
                </div>
              )}

              {/* Trust score */}
              <TrustBadge score={trustScore} />

              <div style={{ marginTop:14, fontSize:11, color:T.lime }}>✓ System uses its own estimate for fair payout calculation</div>
            </div>
          )}

          <button onClick={()=>{ if(!canNext)return; if(step<3)setStep(step+1); else onDone({ name, city, platform, orderFreq:selectedFreq, workHours:selectedHours, workPattern, userHourly, estimated, validation, trustScore, claimsHistory }); }}
            style={{ width:"100%", marginTop:24, padding:"16px 0", borderRadius:16, border:"none", background:canNext?T.lime:"#1A1A1A", color:canNext?T.void:T.t3, fontSize:15, fontWeight:700, cursor:canNext?"pointer":"not-allowed", fontFamily:"'Syne',sans-serif", boxShadow:canNext?`0 0 32px ${T.lime}28`:0, transition:"all .2s" }}>
            {step<3?"Continue →":"View my plan →"}
          </button>
        </Glass>
      </div>
      <GS />
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// SCREEN 2: PLANS with coverage breakdown + AI recommendation
// ══════════════════════════════════════════════════════════
function Plans({ user, onSelect }) {
  const [sel, setSel] = useState("pro");
  const [coverageLevel, setCoverageLevel] = useState(60);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const cityRisk = user.city?.risk || "medium";
  const chosen = PLANS.find(p=>p.id===sel);

  const premium = computePremium({
    plan: chosen, city: user.city?.name, ordersPerHour: user.orderFreq?.value || 3.5,
    workPattern: user.workPattern, cityRisk, claimsHistory: user.claimsHistory,
    trustScore: user.trustScore, coverageLevel,
  });

  return (
    <div style={{ minHeight:"100vh", background:T.void, padding:"28px 20px 60px" }}>
      <div style={{ maxWidth:420, margin:"0 auto" }}>
        <div style={{ marginBottom:32, animation:"up .4s ease" }}>
          <Wordmark />
          <div style={{ marginTop:24 }}>
            <Label color={T.t3}>Your shield</Label>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:30, fontWeight:800, color:T.white, letterSpacing:"-0.04em", lineHeight:1.1, marginBottom:6 }}>
              Choose your<br /><span style={{ color:T.lime }}>coverage.</span>
            </h1>
            <div style={{ fontSize:13, color:T.t3 }}>Hi {user.name?.split(" ")[0]} · {user.city?.name}, {user.city?.state}</div>
          </div>
        </div>

        {/* Weekly Adaptive Recommendation */}
        <Glass accent={T.lime} style={{ padding:18, marginBottom:16 }} delay={0.1}>
          <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ fontSize:22 }}>🧠</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, fontWeight:700, color:T.lime, marginBottom:4 }}>AI-Recommended Plan</div>
              <div style={{ fontSize:13, color:T.t1, marginBottom:10 }}>Based on this week's risk in {user.city?.name}:</div>
              <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                {[["🌧️","Rain risk",user.city?.risk==="high"?"HIGH":"MEDIUM",user.city?.risk==="high"?T.pink:T.yellow],
                  ["🌫️","AQI risk",user.city?.risk==="high"?"MEDIUM":"LOW",T.yellow],
                  ["🚦","Traffic risk","MEDIUM",T.yellow]].map(([ic,l,v,c])=>(
                  <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:12, color:T.t2 }}>{ic} {l}</span>
                    <Pill color={c} size={9}>{v}</Pill>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:12, fontSize:12, color:T.lime }}>→ Recommended: <strong>Shield Pro</strong></div>
            </div>
          </div>
        </Glass>

        {/* Coverage control slider */}
        <Glass style={{ padding:18, marginBottom:16 }} delay={0.15}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
            <div>
              <Label color={T.t3}>Coverage level</Label>
              <div style={{ fontSize:13, color:T.t1, fontWeight:600 }}>Adjust your protection</div>
            </div>
            <Mono size={14} color={T.lime}>{coverageLevel}%</Mono>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
            <span style={{ fontSize:11, color:T.t3 }}>Low</span>
            <input type="range" min={30} max={100} step={5} value={coverageLevel} onChange={e=>setCoverageLevel(+e.target.value)} style={{ flex:1, accentColor:T.lime }} />
            <span style={{ fontSize:11, color:T.t3 }}>High</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:T.t3 }}>
            <span>Premium: <span style={{ color:T.lime }}>₹{premium.total}/week</span></span>
            <span>Max payout: <span style={{ color:T.lime }}>₹{Math.round(300+coverageLevel*7)}</span></span>
          </div>
        </Glass>

        {/* Plan cards */}
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
          {PLANS.map((plan,i) => (
            <div key={plan.id} style={{ animation:`up ${.3+i*.1}s ease` }}>
              {plan.popular && <div style={{ background:plan.color, color:T.void, fontSize:10, fontWeight:800, padding:"3px 14px", borderRadius:99, display:"inline-block", marginBottom:6, letterSpacing:"0.06em", fontFamily:"'JetBrains Mono',monospace" }}>MOST POPULAR</div>}
              <Glass accent={sel===plan.id?plan.color:null} onClick={()=>setSel(plan.id)} style={{ padding:20, cursor:"pointer", border:`1px solid ${sel===plan.id?plan.color+"50":T.line}`, background:sel===plan.id?plan.color+"06":"rgba(255,255,255,0.02)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                  <div>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:sel===plan.id?plan.color:T.white }}>{plan.name}</div>
                    <div style={{ fontSize:12, color:T.t3, marginTop:1 }}>{plan.tagline}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <Mono size={24} color={T.white}>₹{sel===plan.id?premium.total:({basic:20,pro:30,elite:35}[plan.id]+10)}</Mono>
                    <div style={{ fontSize:11, color:T.t3 }}>/week</div>
                  </div>
                </div>

                {/* Coverage breakdown */}
                <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:12 }}>
                  {plan.coverages.map(c => (
                    <div key={c.trigger} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:12, color:c.included?T.t2:T.t4 }}>{c.included?"✔":"❌"} {c.trigger}</span>
                      {c.included ? <Pill color={plan.color} size={9}>₹{c.max} max</Pill> : <span style={{ fontSize:10, color:T.t4 }}>not included</span>}
                    </div>
                  ))}
                </div>

                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <button onClick={e=>{ e.stopPropagation(); setExpandedPlan(expandedPlan===plan.id?null:plan.id); }} style={{ background:"none", border:`1px solid ${T.line}`, color:T.t3, borderRadius:8, padding:"4px 10px", fontSize:11, cursor:"pointer" }}>
                    {expandedPlan===plan.id?"Hide details":"View details"}
                  </button>
                  {sel===plan.id && <div style={{ width:22, height:22, borderRadius:"50%", background:plan.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, color:T.void, animation:"pop .3s ease" }}>✓</div>}
                </div>

                {/* Expanded: Why AI + Premium breakdown */}
                {expandedPlan===plan.id && (
                  <div style={{ marginTop:14, animation:"up .3s ease" }}>
                    <Divider />
                    <div style={{ marginBottom:10 }}>
                      <Label color={T.t3}>Why this plan?</Label>
                      {plan.whyAI.map(r=>(
                        <div key={r} style={{ fontSize:12, color:T.t2, marginBottom:4 }}>✔ {r}</div>
                      ))}
                    </div>
                    {sel===plan.id && (
                      <>
                        <Divider />
                        <Label color={T.t3}>Premium breakdown</Label>
                        {premium.items.map(it=>(
                          <div key={it.label} style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:5 }}>
                            <span style={{ color:T.t3 }}>{it.label}</span>
                            <Mono size={12} color={it.color||T.t1}>₹{it.val}</Mono>
                          </div>
                        ))}
                        <Divider />
                        <div style={{ display:"flex", justifyContent:"space-between" }}>
                          <span style={{ fontSize:13, fontWeight:700, color:T.t1 }}>Total</span>
                          <Mono size={14} color={plan.color}>₹{premium.total}/week</Mono>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </Glass>
            </div>
          ))}
        </div>

        {/* Active policy summary card */}
        <Glass accent={chosen.color} style={{ padding:20, marginBottom:16 }} delay={0.4}>
          <Label color={T.t3}>Your Policy Summary</Label>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:T.white, marginBottom:14 }}>Plan: {chosen.name} · {user.city?.name}</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[["Premium",`₹${premium.total}/wk`],["Coverage",`₹${Math.round(300+coverageLevel*7)}`],["Triggers",chosen.coverages.filter(c=>c.included).length+" events"],["Trust score",`${user.trustScore}/100`]].map(([l,v])=>(
              <div key={l} style={{ background:T.surface, borderRadius:10, padding:"10px 12px" }}>
                <div style={{ fontSize:10, color:T.t3, marginBottom:3 }}>{l}</div>
                <Mono size={13} color={chosen.color}>{v}</Mono>
              </div>
            ))}
          </div>
          <div style={{ marginTop:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:11, color:T.t3 }}>Valid: Mon–Sun · Renews in 7 days</div>
            <Pill color={T.lime} dot>Active</Pill>
          </div>
        </Glass>

        <PrimaryBtn onClick={()=>onSelect({ ...chosen, premium:premium.total })} color={chosen.color}>
          Activate {chosen.name} → ₹{premium.total}/week
        </PrimaryBtn>
      </div>
      <GS />
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// SCREEN 3: DASHBOARD
// ══════════════════════════════════════════════════════════
function Dashboard({ user, plan, onMap, onAlert, onDisruption, onClaims, onPolicy }) {
  const [env, setEnv] = useState({ rain:14, heat:37, aqi:185, traffic:26, cluster:18 });
  const [orders, setOrders] = useState(user.orderFreq?.value||3.5);
  const [opp, setOpp] = useState(14);
  const [clock, setClock] = useState(new Date());
  const [hoursToday, setHoursToday] = useState(3.5);

  useEffect(()=>{
    const iv = setInterval(()=>{
      setClock(new Date());
      setEnv(e=>({ rain:Math.max(0,e.rain+(Math.random()-.5)*3), heat:Math.max(30,e.heat+(Math.random()-.5)*.8), aqi:Math.max(50,e.aqi+(Math.random()-.5)*14), traffic:Math.max(5,e.traffic+(Math.random()-.5)*3.5), cluster:Math.max(5,e.cluster+(Math.random()-.5)*2) }));
      setOrders(o=>Math.max(0.5,o+(Math.random()-.5)*.3));
      setOpp(o=>Math.max(0,o+(Math.random()-.5)*3));
      setHoursToday(h=>Math.min(12,h+0.01));
    },2400);
    return ()=>clearInterval(iv);
  },[]);

  const estimated = user.estimated;
  const todayEarned = Math.round(orders * (estimated?.hourly||120) * hoursToday * 0.85);
  const sensors = [
    {label:"Rainfall",val:env.rain,    unit:"mm/hr",thr:50,  max:100,color:T.cyan,  inv:false,icon:"🌧️"},
    {label:"Heat",    val:env.heat,    unit:"°C",   thr:45,  max:55, color:T.orange,inv:false,icon:"🌡️"},
    {label:"AQI",     val:env.aqi,     unit:"",     thr:400, max:500,color:T.purple,inv:false,icon:"😷"},
    {label:"Traffic", val:env.traffic, unit:"km/h", thr:10,  max:60, color:T.yellow,inv:true, icon:"🚦"},
    {label:"Cluster", val:env.cluster, unit:"%",    thr:60,  max:100,color:T.pink,  inv:false,icon:"👥"},
  ];

  return (
    <div style={{ minHeight:"100vh", background:T.void, paddingBottom:32 }}>
      <div style={{ borderBottom:`1px solid ${T.line}`, padding:"14px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:T.void+"EE", backdropFilter:"blur(20px)", zIndex:50 }}>
        <Wordmark small />
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <Pill color={plan.color} dot>{plan.name}</Pill>
          <Mono size={11} color={T.t3}>{clock.toLocaleTimeString()}</Mono>
        </div>
      </div>

      <div style={{ maxWidth:440, margin:"0 auto", padding:"22px 18px" }}>
        {/* Hero */}
        <div style={{ marginBottom:22, animation:"up .4s ease" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
            <div>
              <Label color={T.t3}>{user.city?.name} · {user.platform}</Label>
              <Mono size={42} color={T.white} style={{ lineHeight:1.1 }}>₹{todayEarned.toLocaleString()}</Mono>
              <div style={{ fontSize:13, color:T.t3, marginTop:4 }}>earned today · baseline ₹{estimated?.hourly||120}/hr</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <Mono size={20} color={T.lime}>+₹312</Mono>
              <div style={{ fontSize:11, color:T.t3, marginTop:2 }}>payouts this week</div>
            </div>
          </div>
        </div>

        {/* Daily work hours tracker */}
        <Glass accent={T.cyan} style={{ padding:18, marginBottom:14 }} delay={0.1}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
            <div><Label color={T.t3}>Daily hours tracker</Label><div style={{ fontSize:13, fontWeight:600, color:T.t1 }}>Today's work session</div></div>
            <Mono size={24} color={T.cyan}>{hoursToday.toFixed(1)}h</Mono>
          </div>
          <Track value={hoursToday} max={user.workHours?.hours||8} color={T.cyan} h={5} />
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:6, fontSize:11, color:T.t3 }}>
            <span>0h</span><span>Target: {user.workHours?.hours||8}h</span>
          </div>
        </Glass>

        {/* Trust + validation row */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14, animation:"up .5s ease" }}>
          <Glass style={{ padding:14 }}>
            <div style={{ fontSize:10, color:T.t3, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.1em", fontFamily:"'JetBrains Mono',monospace" }}>Trust Score</div>
            <Mono size={22} color={user.trustScore>=80?T.lime:user.trustScore>=60?T.yellow:T.pink}>{user.trustScore}<span style={{ fontSize:12 }}>/100</span></Mono>
            <Track value={user.trustScore} max={100} color={user.trustScore>=80?T.lime:T.yellow} h={3} />
          </Glass>
          <Glass style={{ padding:14 }}>
            <div style={{ fontSize:10, color:T.t3, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.1em", fontFamily:"'JetBrains Mono',monospace" }}>Income Baseline</div>
            <Mono size={14} color={T.lime}>₹{estimated?.weekly?.toLocaleString()||"—"}/wk</Mono>
            <ConfidenceBadge level={user.validation?.confidence||"HIGH"} />
          </Glass>
        </div>

        {/* Live activity */}
        <Glass accent={opp>50?T.pink:T.lime} style={{ padding:20, marginBottom:14 }} delay={0.15}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
            <div><Label>Live activity</Label><div style={{ fontSize:13, color:T.t2, fontWeight:500 }}>Real-time monitoring</div></div>
            <Pill color={T.lime} dot>Live</Pill>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}><span style={{ fontSize:12, color:T.t3 }}>Orders/hr</span><Mono size={12} color={T.lime}>{orders.toFixed(1)}</Mono></div>
              <Track value={orders} max={6} color={T.lime} h={4} />
              <div style={{ fontSize:11, color:T.t4, marginTop:5 }}>baseline {user.orderFreq?.value||3.5}</div>
            </div>
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}><span style={{ fontSize:12, color:T.t3 }}>Opp. Loss</span><Mono size={12} color={opp>50?T.pink:T.yellow}>{opp.toFixed(0)}%</Mono></div>
              <Track value={opp} max={100} color={opp>50?T.pink:T.yellow} h={4} />
              <div style={{ fontSize:11, color:T.t4, marginTop:5 }}>trigger at 50%</div>
            </div>
          </div>
        </Glass>

        {/* What you get estimate */}
        <Glass accent={T.yellow} style={{ padding:18, marginBottom:14 }} delay={0.2}>
          <div style={{ fontSize:12, fontWeight:700, color:T.yellow, marginBottom:10 }}>💡 If disruption happens now</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div style={{ background:T.surface, borderRadius:10, padding:"10px 12px" }}>
              <div style={{ fontSize:11, color:T.t3 }}>Expected loss</div>
              <Mono size={18} color={T.pink}>₹{Math.round((estimated?.hourly||120)*2.5)}</Mono>
            </div>
            <div style={{ background:T.surface, borderRadius:10, padding:"10px 12px" }}>
              <div style={{ fontSize:11, color:T.t3 }}>You'd receive</div>
              <Mono size={18} color={T.lime}>₹{Math.round((estimated?.hourly||120)*2.5*0.75)}</Mono>
            </div>
          </div>
          <div style={{ fontSize:11, color:T.t3, marginTop:10 }}>Based on validated income baseline · 75% payout ratio</div>
        </Glass>

        {/* Sensors */}
        <div style={{ marginBottom:14, animation:"up .6s ease" }}>
          <Label color={T.t3}>Environment sensors</Label>
          <div style={{ border:`1px solid ${T.line}`, borderRadius:16, overflow:"hidden", marginTop:8 }}>
            {sensors.map((s,i)=>{
              const pct=s.inv?Math.min(100,(1-s.val/s.thr)*100):Math.min(100,(s.val/s.thr)*100);
              const alert=pct>80;
              return (
                <div key={s.label} style={{ background:i%2===0?T.surface:T.ink, padding:"11px 16px", display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ fontSize:15, width:22 }}>{s.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontSize:12, color:T.t2 }}>{s.label}</span>
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        {alert&&<Pill color={T.pink} size={9}>Alert</Pill>}
                        <Mono size={12} color={alert?T.pink:s.color}>{s.val.toFixed(0)}{s.unit}</Mono>
                      </div>
                    </div>
                    <Track value={pct} max={100} color={alert?T.pink:s.color} h={3} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active policy pill */}
        <Glass style={{ padding:14, marginBottom:14, display:"flex", justifyContent:"space-between", alignItems:"center" }} delay={0.25}>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:T.t1 }}>🛡️ Your Plan: {plan.name}</div>
            <div style={{ fontSize:11, color:T.t3, marginTop:2 }}>Cap ₹{plan.cap||750} · Valid till Sunday · Renews in 3 days</div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:6, alignItems:"flex-end" }}>
            <Pill color={T.lime} dot>Active</Pill>
            <button onClick={onPolicy} style={{ background:"none", border:`1px solid ${T.line}`, color:T.t3, borderRadius:8, padding:"3px 10px", fontSize:10, cursor:"pointer" }}>Upgrade →</button>
          </div>
        </Glass>

        {/* Live coverage indicators */}
        <Glass style={{ padding:14, marginBottom:14 }} delay={0.3}>
          <Label color={T.t3}>Live coverage status</Label>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:6 }}>
            {plan.coverages?.filter(c=>c.included).map(c=>(
              <div key={c.trigger} style={{ display:"flex", alignItems:"center", gap:8, background:T.surface, borderRadius:10, padding:"8px 12px" }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:T.lime, animation:"blink 2s infinite" }} />
                <span style={{ fontSize:12, color:T.t2 }}>{c.trigger}</span>
                <span style={{ fontSize:11, color:T.lime, marginLeft:"auto" }}>Active</span>
              </div>
            ))||[]}
          </div>
        </Glass>

        {/* Actions */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10, animation:"up .7s ease" }}>
          <button onClick={onMap} style={{ padding:"14px 0", borderRadius:14, border:`1px solid ${T.line}`, background:"transparent", color:T.t1, fontSize:13, fontWeight:600, cursor:"pointer", transition:"border-color .2s" }} onMouseEnter={e=>e.target.style.borderColor=T.cyan} onMouseLeave={e=>e.target.style.borderColor=T.line}>📍 Risk Map</button>
          <button onClick={onAlert} style={{ padding:"14px 0", borderRadius:14, border:`1px solid ${T.orange}40`, background:T.orangeDim, color:T.orange, fontSize:13, fontWeight:600, cursor:"pointer" }}>🚨 AI Alerts</button>
        </div>
        <PrimaryBtn onClick={onDisruption} color={T.pink} style={{ marginBottom:10 }}>🌧️ Simulate disruption →</PrimaryBtn>
        <button onClick={onClaims} style={{ width:"100%", padding:"13px 0", borderRadius:14, border:`1px solid ${T.line}`, background:"transparent", color:T.t3, fontSize:13, fontWeight:500, cursor:"pointer" }}>View claims history</button>
      </div>
      <GS />
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// SCREEN 4: RISK MAP
// ══════════════════════════════════════════════════════════
function RiskMap({ user, onBack, onAlert }) {
  const [active, setActive] = useState(null);
  const [tick, setTick] = useState(0);
  const city = user?.city || CITIES[1];

  // Build zones from city data
  const ZONE_POSITIONS = [
    {cx:210,cy:310,r:44},{cx:170,cy:195,r:38},{cx:300,cy:355,r:36},
    {cx:255,cy:392,r:30},{cx:120,cy:298,r:32},{cx:195,cy:432,r:28},
    {cx:240,cy:155,r:34},{cx:228,cy:248,r:30},{cx:358,cy:380,r:26},{cx:138,cy:155,r:30},
  ];
  const RISK_ASSIGN = ["high","medium","high","medium","safe","safe","medium","high","safe","medium"];
  const zones = (city.zones||[]).slice(0,10).map((name,i)=>({
    id:`z${i}`, name, risk:RISK_ASSIGN[i]||"medium",
    ...ZONE_POSITIONS[i]||{cx:200,cy:250,r:30},
    aqi:RISK_ASSIGN[i]==="high"?320+Math.random()*80:RISK_ASSIGN[i]==="medium"?150+Math.random()*80:80+Math.random()*40,
    rain:RISK_ASSIGN[i]==="high"?55+Math.random()*20:RISK_ASSIGN[i]==="medium"?20+Math.random()*25:5+Math.random()*15,
    loss:RISK_ASSIGN[i]==="high"?170+Math.random()*60:RISK_ASSIGN[i]==="medium"?70+Math.random()*60:25+Math.random()*30,
    orders:RISK_ASSIGN[i]==="high"?1.5+Math.random()*1:RISK_ASSIGN[i]==="medium"?2.5+Math.random()*1.5:3.5+Math.random()*1.5,
  }));

  useEffect(()=>{ const iv=setInterval(()=>setTick(t=>t+1),1000); return()=>clearInterval(iv); },[]);
  const zone = active?zones.find(z=>z.id===active):null;
  const RCOLOR = {high:T.pink,medium:T.yellow,safe:T.lime};

  return (
    <div style={{ minHeight:"100vh", background:T.void, display:"flex", flexDirection:"column" }}>
      <div style={{ borderBottom:`1px solid ${T.line}`, padding:"14px 18px", display:"flex", alignItems:"center", gap:14, background:T.void, position:"sticky", top:0, zIndex:50, backdropFilter:"blur(20px)" }}>
        <BackBtn onClick={onBack} />
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:700, color:T.white }}>Live Risk Map</div>
          <div style={{ fontSize:11, color:T.t3, fontFamily:"'JetBrains Mono',monospace" }}>{city.name}, {city.state}</div>
        </div>
        <div style={{ marginLeft:"auto" }}><Pill color={T.pink} dot>Live</Pill></div>
      </div>

      <div style={{ borderBottom:`1px solid ${T.line}`, padding:"10px 18px", display:"flex", gap:14, background:T.surface }}>
        {[["high",T.pink,"🔴 High Risk"],["medium",T.yellow,"🟡 Medium"],["safe",T.lime,"🟢 Safe"]].map(([k,c,l])=>(
          <div key={k} style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:c, boxShadow:`0 0 5px ${c}` }} />
            <span style={{ fontSize:11, color:T.t2, fontFamily:"'JetBrains Mono',monospace" }}>{l}</span>
          </div>
        ))}
      </div>

      <div style={{ position:"relative", flex:1 }}>
        <svg viewBox="0 0 480 500" style={{ width:"100%", maxHeight:"54vh", display:"block" }}>
          <defs>
            <radialGradient id="mbg" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#0B1520"/><stop offset="100%" stopColor="#040810"/></radialGradient>
            <pattern id="dot" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r=".7" fill="#1A2D40"/></pattern>
            {zones.map(z=><radialGradient key={z.id} id={`rg-${z.id}`} cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={RCOLOR[z.risk]} stopOpacity=".3"/><stop offset="100%" stopColor={RCOLOR[z.risk]} stopOpacity="0"/></radialGradient>)}
          </defs>
          <rect width="480" height="500" fill="url(#mbg)"/>
          <rect width="480" height="500" fill="url(#dot)" opacity=".7"/>
          {["M 60 120 L 420 120","M 60 240 L 430 240","M 60 360 L 410 360","M 160 50 L 160 470","M 270 50 L 270 470","M 380 50 L 380 470"].map((d,i)=><path key={i} d={d} stroke="#0D2040" strokeWidth="1.5" fill="none"/>)}
          {["M 60 185 L 430 185","M 215 50 L 215 470"].map((d,i)=><path key={i} d={d} stroke="#142840" strokeWidth="3" fill="none"/>)}
          <path d="M 390 60 Q 440 180 430 320 Q 425 400 410 470" stroke="#00F5FF14" strokeWidth="2.5" fill="none" strokeDasharray="8 5"/>
          {zones.map((z,i)=>{
            const rc=RCOLOR[z.risk]; const isActive=active===z.id;
            const pr=z.r*(1+Math.sin(tick*.9+i*1.1)*(z.risk==="high"?.22:z.risk==="medium"?.12:.05));
            return(
              <g key={z.id} onClick={()=>setActive(isActive?null:z.id)} style={{cursor:"pointer"}}>
                <circle cx={z.cx} cy={z.cy} r={z.r*2.2} fill={`url(#rg-${z.id})`} opacity={isActive?.8:.45}/>
                {z.risk!=="safe"&&<circle cx={z.cx} cy={z.cy} r={pr*1.35} fill="none" stroke={rc} strokeWidth="1" opacity=".25"/>}
                <circle cx={z.cx} cy={z.cy} r={z.r} fill={rc+(isActive?"28":"14")} stroke={rc} strokeWidth={isActive?2:1} opacity=".95"/>
                <circle cx={z.cx} cy={z.cy} r={4} fill={rc}/>
                {z.risk==="high"&&<text x={z.cx-6} y={z.cy+4} fontSize="11">⚠️</text>}
                <text x={z.cx} y={z.cy+z.r+13} textAnchor="middle" fill={rc+"CC"} fontSize="9" fontWeight="600" fontFamily="'Instrument Sans',sans-serif">{z.name}</text>
              </g>
            );
          })}
          <g><circle cx={zones[0]?.cx||210} cy={zones[0]?.cy||310} r={14} fill={T.cyan+"20"} stroke={T.cyan} strokeWidth="1.5"/><circle cx={zones[0]?.cx||210} cy={zones[0]?.cy||310} r={5} fill={T.cyan}/><text x={(zones[0]?.cx||210)+16} y={(zones[0]?.cy||310)+4} fill={T.cyan} fontSize="9.5" fontWeight="700" fontFamily="'JetBrains Mono',monospace">YOU</text></g>
        </svg>

        {!active&&<div style={{ position:"absolute", bottom:16, left:"50%", transform:"translateX(-50%)", background:"rgba(0,0,0,.75)", backdropFilter:"blur(10px)", border:`1px solid ${T.line}`, borderRadius:99, padding:"8px 18px", fontSize:12, color:T.t2, whiteSpace:"nowrap" }}>Tap a zone for details</div>}

        {zone&&(
          <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"rgba(8,8,8,.96)", backdropFilter:"blur(20px)", borderTop:`1px solid ${RCOLOR[zone.risk]}50`, borderRadius:"24px 24px 0 0", padding:"22px 20px 28px", animation:"slideup .3s ease" }}>
            <div style={{ position:"absolute", top:0, left:"30%", right:"30%", height:1, background:`linear-gradient(90deg,transparent,${RCOLOR[zone.risk]},transparent)` }}/>
            <div style={{ width:36, height:4, background:T.lineHi, borderRadius:99, margin:"0 auto 18px" }}/>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
              <div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:T.white }}>{zone.name}</div>
                <Pill color={RCOLOR[zone.risk]}>{zone.risk} risk</Pill>
              </div>
              <button onClick={()=>setActive(null)} style={{ background:T.surface, border:`1px solid ${T.line}`, color:T.t2, borderRadius:10, padding:"6px 10px", cursor:"pointer" }}>✕</button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8, marginBottom:16 }}>
              {[["💧","Rain",`${Math.round(zone.rain)}mm`,zone.rain>50?T.pink:T.cyan],["😷","AQI",Math.round(zone.aqi),zone.aqi>300?T.pink:zone.aqi>200?T.yellow:T.lime],["📦","Orders",`${zone.orders.toFixed(1)}/hr`,zone.orders<2.5?T.pink:T.lime],["💸","Est.Loss",`₹${Math.round(zone.loss)}`,zone.loss>150?T.pink:T.yellow]].map(([ic,l,v,c])=>(
                <div key={l} style={{ background:T.surface, border:`1px solid ${T.line}`, borderRadius:12, padding:"10px 6px", textAlign:"center" }}>
                  <div style={{ fontSize:18, marginBottom:3 }}>{ic}</div>
                  <Mono size={12} color={c}>{v}</Mono>
                  <div style={{ fontSize:10, color:T.t3, marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>
            {zone.risk==="high"&&<button onClick={onAlert} style={{ width:"100%", padding:"13px 0", borderRadius:13, border:"none", background:T.pink, color:T.white, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"'Syne',sans-serif" }}>🚨 View AI Alert for {zone.name} →</button>}
          </div>
        )}
      </div>
      <GS/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// SCREEN 5: ALERT
// ══════════════════════════════════════════════════════════
function Alert({ user, onBack, onDisruption }) {
  const [open, setOpen] = useState(false);
  const city = user?.city?.name||"Chennai";

  return (
    <div style={{ minHeight:"100vh", background:T.void, paddingBottom:40 }}>
      <div style={{ borderBottom:`1px solid ${T.line}`, padding:"14px 18px", display:"flex", alignItems:"center", gap:14, background:T.void, position:"sticky", top:0, zIndex:50, backdropFilter:"blur(20px)" }}>
        <BackBtn onClick={onBack}/>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:700, color:T.white }}>Predictive Alerts</div>
        <div style={{ marginLeft:"auto" }}><Pill color={T.orange}>AI Powered</Pill></div>
      </div>

      <div style={{ maxWidth:440, margin:"0 auto", padding:"22px 18px" }}>
        <Glass accent={T.pink} style={{ padding:0, overflow:"hidden", marginBottom:14 }} delay={0.1}>
          <div style={{ background:T.pink+"14", borderBottom:`1px solid ${T.pink}20`, padding:"20px 22px", display:"flex", gap:14 }}>
            <div style={{ fontSize:36 }}>🚨</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:10, color:T.pink, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:"'JetBrains Mono',monospace", marginBottom:4 }}>Incoming · 3 hrs away</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:T.white, letterSpacing:"-0.02em" }}>Heavy Rain Expected</div>
              <div style={{ fontSize:12, color:T.t2, marginTop:2 }}>{city} · 7:00–10:00 PM tonight</div>
            </div>
          </div>
          <div style={{ padding:22 }}>
            <Label color={T.t3}>AI income impact estimate</Label>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:1, background:T.line, borderRadius:12, overflow:"hidden", marginBottom:18, marginTop:10 }}>
              {[["Expected","₹360",T.t1],["Projected","₹140",T.orange],["Est. Loss","₹220",T.pink]].map(([l,v,c])=>(
                <div key={l} style={{ background:T.surface, padding:"14px 10px", textAlign:"center" }}>
                  <Mono size={20} color={c}>{v}</Mono>
                  <div style={{ fontSize:10, color:T.t3, marginTop:4 }}>{l}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}><span style={{ fontSize:12, color:T.t3 }}>AI confidence</span><Mono size={12} color={T.lime}>87%</Mono></div>
              <Track value={87} max={100} color={T.lime} h={4}/>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
              {[["🌧️","Rainfall","~75 mm/hr",T.cyan],["💨","Wind","42 km/h",T.blue],["😷","Post AQI","~340",T.orange],["🚦","Traffic","Severe",T.pink]].map(([ic,l,v,c])=>(
                <div key={l} style={{ background:T.surface, border:`1px solid ${T.line}`, borderRadius:12, padding:"11px 12px", display:"flex", gap:10, alignItems:"center" }}>
                  <span style={{ fontSize:18 }}>{ic}</span>
                  <div><div style={{ fontSize:10, color:T.t3 }}>{l}</div><Mono size={12} color={c}>{v}</Mono></div>
                </div>
              ))}
            </div>

            <button onClick={()=>setOpen(!open)} style={{ width:"100%", padding:"11px 0", borderRadius:12, border:`1px solid ${T.line}`, background:"transparent", color:T.t2, fontSize:13, fontWeight:500, cursor:"pointer", marginBottom:10 }}>
              {open?"Hide AI details ↑":"View AI details ↓"}
            </button>
            {open&&(
              <div style={{ background:T.surface, border:`1px solid ${T.line}`, borderRadius:14, padding:16, marginBottom:12, animation:"up .3s ease" }}>
                {[["IMD forecast","Rain >60mm/hr, 7–10 PM"],["Historical match","Mar 12 → ₹210 loss"],["Cluster predict","70% workers halt likely"],["Surge status","No platform surge"],["Validated baseline","₹"+((user?.estimated?.hourly||120))+" /hr used"],["Coverage",`Your plan covers this ✓`]].map(([l,v])=>(
                  <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:9, fontSize:12 }}>
                    <span style={{ color:T.t3 }}>{l}</span><span style={{ color:T.t2, textAlign:"right", maxWidth:"55%" }}>{v}</span>
                  </div>
                ))}
                <div style={{ fontSize:12, color:T.lime, marginTop:8 }}>✓ Auto-payout will trigger if loss &gt;50% baseline.</div>
              </div>
            )}
            <PrimaryBtn onClick={onDisruption} color={T.pink}>⚡ Simulate disruption now</PrimaryBtn>
          </div>
        </Glass>

        <Glass accent={T.yellow} style={{ padding:18 }} delay={0.3}>
          <div style={{ display:"flex", gap:14 }}>
            <div style={{ fontSize:26 }}>🌡️</div>
            <div><div style={{ fontSize:13, fontWeight:700, color:T.yellow, marginBottom:3 }}>Heat Advisory · Tomorrow 11 AM–3 PM</div><div style={{ fontSize:12, color:T.t3, lineHeight:1.6 }}>Heat index may reach 46°C. Est. loss ₹90. Your plan covers this automatically.</div></div>
          </div>
        </Glass>
      </div>
      <GS/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// SCREEN 6: DISRUPTION DETECTED
// ══════════════════════════════════════════════════════════
function Disruption({ user, plan, onClose, onConfirm }) {
  const [step, setStep] = useState(0);
  const [revealed, setRevealed] = useState([]);
  const estimated = user?.estimated;
  const expected = Math.round((estimated?.hourly||120)*2);
  const actual = Math.round(expected*0.33);
  const loss = expected-actual;
  const payout = Math.min(Math.round(loss*.75), plan?.cap||750);

  const CHECKS=[
    {label:"GPS consistency",   sub:`Active 1.2km from zone · ${user?.city?.name||"Chennai"}`},
    {label:"Motion sensor",     sub:"Delivery pattern confirmed"},
    {label:"Cluster validation",sub:"71% nearby workers offline"},
    {label:"Opportunity loss",  sub:"67% drop vs 7-day baseline"},
    {label:"Surge status",      sub:"No platform surge active"},
    {label:"Fraud score",       sub:"0.03/1.0 — Clear"},
  ];

  const runChecks=()=>{
    setStep(1); setRevealed([]);
    CHECKS.forEach((_,i)=>setTimeout(()=>{ setRevealed(p=>[...p,i]); if(i===CHECKS.length-1)setTimeout(()=>setStep(2),700); },i*480));
  };

  return (
    <div style={{ minHeight:"100vh", background:T.void, paddingBottom:40 }}>
      <div style={{ borderBottom:`1px solid ${T.line}`, padding:"14px 18px", display:"flex", alignItems:"center", gap:14, background:T.void, position:"sticky", top:0, zIndex:50, backdropFilter:"blur(20px)" }}>
        <BackBtn onClick={onClose}/>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:T.white }}>Disruption Detected</div>
        <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
          {["Detected","Validating","Payout"].map((l,i)=>(
            <div key={l} style={{ display:"flex", alignItems:"center", gap:3 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:i<=step?T.lime:T.t4 }}/>
              <span style={{ fontSize:10, color:i<=step?T.lime:T.t4, fontFamily:"'JetBrains Mono',monospace" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:440, margin:"0 auto", padding:"22px 18px" }}>

        {/* STEP 0 */}
        {step===0&&(
          <div style={{ animation:"up .4s ease" }}>
            <Glass accent={T.cyan} style={{ padding:0, overflow:"hidden", marginBottom:16 }}>
              <div style={{ background:`linear-gradient(160deg,${T.cyan}16,${T.void})`, padding:"26px 22px 22px", position:"relative", overflow:"hidden" }}>
                <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }} viewBox="0 0 400 180">
                  {Array.from({length:14},(_,i)=><line key={i} x1={i*30+(i%3)*5} y1={-20} x2={i*30+(i%3)*5-8} y2={200} stroke={T.cyan} strokeWidth="1" opacity=".1" style={{ animation:`rain ${.7+(i%4)*.15}s linear infinite`, animationDelay:`${i*.1}s` }}/>)}
                </svg>
                <div style={{ position:"relative" }}>
                  <Pill color={T.pink} dot>Active disruption</Pill>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:30, fontWeight:800, color:T.white, letterSpacing:"-0.04em", margin:"10px 0 4px" }}>🌧️ Rain detected</div>
                  <div style={{ fontSize:13, color:T.t2 }}>{user?.city?.name||"Chennai"} · Ongoing right now</div>
                </div>
              </div>
              <div style={{ padding:"0 22px 22px" }}>
                <div style={{ background:T.surface, borderRadius:14, padding:16, margin:"16px 0" }}>
                  <Label color={T.t3}>Disruption window</Label>
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginTop:10 }}>
                    <div style={{ textAlign:"center" }}><Mono size={26} color={T.white}>8:00</Mono><div style={{ fontSize:10, color:T.t3, marginTop:2 }}>Start</div></div>
                    <div style={{ flex:1, position:"relative" }}>
                      <div style={{ height:4, background:T.lineHi, borderRadius:99 }}>
                        <div style={{ width:"42%", height:"100%", background:`linear-gradient(90deg,${T.cyan},${T.pink})`, borderRadius:99 }}/>
                      </div>
                      <div style={{ position:"absolute", left:"42%", top:"50%", transform:"translate(-50%,-50%)", width:14, height:14, borderRadius:"50%", background:T.pink, border:`2px solid ${T.void}`, boxShadow:`0 0 10px ${T.pink}` }}/>
                      <div style={{ textAlign:"center", marginTop:8, fontSize:11, color:T.cyan, fontFamily:"'JetBrains Mono',monospace" }}>~2 hr peak window</div>
                    </div>
                    <div style={{ textAlign:"center" }}><Mono size={26} color={T.t2}>10:00</Mono><div style={{ fontSize:10, color:T.t3, marginTop:2 }}>Est. end</div></div>
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {[["💧","Rainfall","73.2 mm/hr","⬆ above threshold",T.pink],["😷","AQI","312","Elevated — watch",T.orange],["🌡️","Heat","38.4°C","Within safe range",T.lime],["🚦","Traffic","7 km/h","⬇ below threshold",T.pink]].map(([ic,l,v,note,c])=>(
                    <div key={l} style={{ background:T.surface, border:`1px solid ${T.line}`, borderRadius:12, padding:12 }}>
                      <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:5 }}><span style={{ fontSize:17 }}>{ic}</span><span style={{ fontSize:11, color:T.t3 }}>{l}</span></div>
                      <Mono size={18} color={c}>{v}</Mono>
                      <div style={{ fontSize:10, color:c+"80", marginTop:3 }}>{note}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Glass>
            <PrimaryBtn onClick={runChecks} color={T.lime}>Validate &amp; calculate payout →</PrimaryBtn>
          </div>
        )}

        {/* STEP 1 */}
        {step===1&&(
          <div style={{ animation:"up .4s ease" }}>
            <div style={{ textAlign:"center", marginBottom:28, paddingTop:8 }}>
              <div style={{ width:56, height:56, borderRadius:"50%", border:`2px solid ${T.lime}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", animation:"spin 2s linear infinite" }}>🔍</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:T.white }}>Running fraud checks</div>
              <div style={{ fontSize:13, color:T.t3, marginTop:4 }}>Multi-signal verification · AI-powered</div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {CHECKS.map((c,i)=>{
                const done=revealed.includes(i);
                return(
                  <div key={c.label} style={{ background:done?T.limeDim:T.surface, border:`1px solid ${done?T.lime+"40":T.line}`, borderRadius:14, padding:"13px 18px", display:"flex", justifyContent:"space-between", alignItems:"center", opacity:done?1:.25, transition:"all .4s ease" }}>
                    <div><div style={{ fontSize:13, fontWeight:600, color:T.t1 }}>{c.label}</div><div style={{ fontSize:11, color:T.t3, marginTop:2 }}>{c.sub}</div></div>
                    {done&&<div style={{ width:24, height:24, borderRadius:"50%", background:T.lime, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, color:T.void, fontWeight:800, animation:"pop .3s ease" }}>✓</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2 — THE KEY SCREEN */}
        {step===2&&(
          <div style={{ animation:"up .4s ease" }}>
            <div style={{ marginBottom:8 }}><Pill color={T.lime} dot>All checks passed</Pill></div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, color:T.white, letterSpacing:"-0.03em", margin:"10px 0 4px" }}>Income Breakdown</div>
            <div style={{ fontSize:13, color:T.t3, marginBottom:22 }}>8:00 PM – 10:00 PM · Validated baseline: ₹{estimated?.hourly||120}/hr</div>

            <Glass accent={T.lime} style={{ padding:24, marginBottom:14 }}>
              {/* Visual bar comparison */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:22 }}>
                <div style={{ textAlign:"center" }}>
                  <Label color={T.t3}>Expected</Label>
                  <div style={{ height:96, background:T.surface, borderRadius:12, overflow:"hidden", marginTop:8 }}>
                    <div style={{ width:"100%", height:"100%", background:`linear-gradient(180deg,${T.lime}18,${T.lime}45)`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Mono size={28} color={T.lime}>₹{expected}</Mono>
                    </div>
                  </div>
                  <div style={{ fontSize:11, color:T.t3, marginTop:6 }}>₹{estimated?.hourly||120}/hr × 2h</div>
                </div>
                <div style={{ textAlign:"center" }}>
                  <Label color={T.t3}>Actual</Label>
                  <div style={{ height:96, background:T.surface, borderRadius:12, overflow:"hidden", marginTop:8, display:"flex", alignItems:"flex-end" }}>
                    <div style={{ width:"100%", height:`${(actual/expected)*100}%`, background:`linear-gradient(180deg,${T.pink}18,${T.pink}55)`, display:"flex", alignItems:"center", justifyContent:"center", animation:"bar 1.2s ease" }}>
                      <Mono size={28} color={T.pink}>₹{actual}</Mono>
                    </div>
                  </div>
                  <div style={{ fontSize:11, color:T.pink+"80", marginTop:6 }}>During disruption</div>
                </div>
              </div>

              <Divider/>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0" }}>
                <div><div style={{ fontSize:14, fontWeight:700, color:T.t1 }}>Income Loss</div><div style={{ fontSize:12, color:T.t3, marginTop:2 }}>Expected − Actual</div></div>
                <Mono size={30} color={T.pink}>−₹{loss}</Mono>
              </div>
              <Divider/>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 0 6px" }}>
                <div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:800, color:T.lime }}>Your Payout</div>
                  <div style={{ fontSize:12, color:T.t3, marginTop:3 }}>75% of loss · cap ₹{plan?.cap||750}</div>
                  <div style={{ fontSize:11, color:T.lime+"60", marginTop:2 }}>⚡ Auto-credited · No claim required</div>
                </div>
                <Mono size={42} color={T.lime}>₹{payout}</Mono>
              </div>

              <div style={{ background:T.lime+"10", border:`1px solid ${T.lime}25`, borderRadius:10, padding:"10px 14px", marginTop:8, fontSize:12, color:T.lime }}>
                Payout calculated using validated income baseline — not self-reported figure
              </div>
            </Glass>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
              {[["Expected",`₹${expected}`,T.t2],["Actual",`₹${actual}`,T.pink],["Loss",`₹${loss}`,T.yellow]].map(([l,v,c])=>(
                <div key={l} style={{ background:T.surface, border:`1px solid ${T.line}`, borderRadius:12, padding:"12px 8px", textAlign:"center" }}>
                  <Mono size={15} color={c}>{v}</Mono>
                  <div style={{ fontSize:10, color:T.t3, marginTop:4 }}>{l}</div>
                </div>
              ))}
            </div>

            <PrimaryBtn onClick={()=>onConfirm(payout)} color={T.lime}>Confirm ₹{payout} payout →</PrimaryBtn>
          </div>
        )}
      </div>
      <GS/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// SCREEN 7: PAYOUT SUCCESS
// ══════════════════════════════════════════════════════════
function PayoutSuccess({ amount, onDone }) {
  const [show, setShow] = useState(false);
  useEffect(()=>{ setTimeout(()=>setShow(true),80); },[]);
  return (
    <div style={{ minHeight:"100vh", background:T.void, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ position:"fixed", top:"30%", left:"50%", transform:"translate(-50%,-50%)", width:500, height:500, background:`radial-gradient(ellipse,${T.lime}08 0%,transparent 70%)`, pointerEvents:"none", borderRadius:"50%" }}/>
      <div style={{ textAlign:"center", maxWidth:360, position:"relative", zIndex:1 }}>
        <div style={{ fontSize:72, transform:show?"scale(1)":"scale(0)", transition:"transform .6s cubic-bezier(0.34,1.56,0.64,1)", marginBottom:12 }}>🎉</div>
        <div style={{ opacity:show?1:0, transition:"opacity .5s .3s", marginBottom:4 }}><Label color={T.t3}>Payout confirmed · No claim needed</Label></div>
        <div style={{ opacity:show?1:0, transition:"opacity .5s .4s", marginBottom:8 }}><Counter to={amount} prefix="₹" size={64} color={T.lime}/></div>
        <div style={{ opacity:show?1:0, transition:"opacity .5s .5s", fontSize:14, color:T.t3, marginBottom:32 }}>Credited to UPI · within 2 minutes</div>

        <Glass accent={T.lime} style={{ padding:20, marginBottom:20, opacity:show?1:0, transition:"opacity .5s .7s", textAlign:"left" }}>
          {[["Transaction",`IE-${Date.now().toString().slice(-8)}`],["Method","UPI · Instant"],["Trigger","🌧️ Rain / Flood"],["Validated baseline",`₹${amount*4}/wk (AI estimated)`],["Cap remaining",`₹${780-amount} this week`]].map(([l,v])=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
              <span style={{ fontSize:12, color:T.t3 }}>{l}</span><Mono size={12} color={T.t2}>{v}</Mono>
            </div>
          ))}
          <Divider/>
          <div style={{ fontSize:12, color:T.lime }}>Payout calculated using validated income baseline</div>
        </Glass>

        <button onClick={onDone} style={{ width:"100%", padding:"15px 0", borderRadius:14, border:"none", background:T.lime, color:T.void, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'Syne',sans-serif", opacity:show?1:0, transition:"opacity .5s .9s" }}>Back to dashboard</button>
      </div>
      <GS/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// SCREEN 8: CLAIMS HISTORY
// ══════════════════════════════════════════════════════════
function Claims({ onBack }) {
  const total=HISTORY.reduce((s,c)=>s+c.payout,0);
  const TCOLOR={Rain:T.cyan,Heat:T.orange,Traffic:T.yellow};
  return (
    <div style={{ minHeight:"100vh", background:T.void, paddingBottom:40 }}>
      <div style={{ borderBottom:`1px solid ${T.line}`, padding:"14px 18px", display:"flex", alignItems:"center", gap:14, background:T.void, position:"sticky", top:0, backdropFilter:"blur(20px)", zIndex:50 }}>
        <BackBtn onClick={onBack}/>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:700, color:T.white }}>Claims History</div>
      </div>
      <div style={{ maxWidth:440, margin:"0 auto", padding:"22px 18px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:22 }}>
          {[["Claims",HISTORY.length,T.lime],["Total paid",`₹${total}`,T.yellow],["Success rate","100%",T.lime]].map(([l,v,c])=>(
            <Glass key={l} accent={c} style={{ padding:"16px 12px", textAlign:"center" }} delay={0.1}>
              <Mono size={20} color={c}>{v}</Mono>
              <div style={{ fontSize:10, color:T.t3, marginTop:5 }}>{l}</div>
            </Glass>
          ))}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {HISTORY.map((c,i)=>{
            const col=TCOLOR[c.trigger]||T.lime;
            return(
              <Glass key={c.id} accent={col} style={{ padding:20 }} delay={.1+i*.1}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                  <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                    <div style={{ fontSize:28 }}>{c.icon}</div>
                    <div><div style={{ fontSize:14, fontWeight:700, color:T.white }}>{c.trigger}</div><Mono size={11} color={T.t3}>{c.date}, 2025</Mono></div>
                  </div>
                  <div style={{ textAlign:"right" }}><Mono size={20} color={T.lime}>+₹{c.payout}</Mono><br/><Pill color={T.lime} size={9}>Paid</Pill></div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
                  {[["Expected",c.expected,T.t2],["Actual",c.actual,T.pink],["Loss",c.loss,T.yellow]].map(([l,v,col2])=>(
                    <div key={l}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}><span style={{ fontSize:10, color:T.t3 }}>{l}</span><Mono size={11} color={col2}>₹{v}</Mono></div>
                      <Track value={v} max={c.expected} color={col2} h={3}/>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:12, fontSize:11, color:T.t3, borderTop:`1px solid ${T.line}`, paddingTop:10 }}>
                  Payout calculated using validated income baseline
                </div>
              </Glass>
            );
          })}
        </div>
      </div>
      <GS/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState("onboard");
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState(null);
  const [payout, setPayout] = useState(0);

  return (
    <>
      {screen==="onboard"    && <Onboarding onDone={u=>{ setUser(u); setScreen("plans"); }}/>}
      {screen==="plans"      && <Plans user={user} onSelect={p=>{ setPlan(p); setScreen("dashboard"); }}/>}
      {screen==="dashboard"  && <Dashboard user={user} plan={plan} onMap={()=>setScreen("map")} onAlert={()=>setScreen("alert")} onDisruption={()=>setScreen("disruption")} onClaims={()=>setScreen("claims")} onPolicy={()=>setScreen("plans")}/>}
      {screen==="map"        && <RiskMap user={user} onBack={()=>setScreen("dashboard")} onAlert={()=>setScreen("alert")}/>}
      {screen==="alert"      && <Alert user={user} onBack={()=>setScreen("dashboard")} onDisruption={()=>setScreen("disruption")}/>}
      {screen==="disruption" && <Disruption user={user} plan={plan} onClose={()=>setScreen("dashboard")} onConfirm={amt=>{ setPayout(amt); setScreen("payout"); }}/>}
      {screen==="payout"     && <PayoutSuccess amount={payout} onDone={()=>setScreen("dashboard")}/>}
      {screen==="claims"     && <Claims onBack={()=>setScreen("dashboard")}/>}
    </>
  );
}

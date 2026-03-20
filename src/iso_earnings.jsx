import { useState, useEffect, useRef } from "react";

/*
  ██╗███████╗ ██████╗     ███████╗ █████╗ ██████╗ ███╗   ██╗██╗███╗   ██╗ ██████╗ ███████╗
  ██║██╔════╝██╔═══██╗    ██╔════╝██╔══██╗██╔══██╗████╗  ██║██║████╗  ██║██╔════╝ ██╔════╝
  ██║███████╗██║   ██║    █████╗  ███████║██████╔╝██╔██╗ ██║██║██╔██╗ ██║██║  ███╗███████╗
  ██║╚════██║██║   ██║    ██╔══╝  ██╔══██║██╔══██╗██║╚██╗██║██║██║╚██╗██║██║   ██║╚════██║
  ██║███████║╚██████╔╝    ███████╗██║  ██║██║  ██║██║ ╚████║██║██║ ╚████║╚██████╔╝███████║
  ╚═╝╚══════╝ ╚═════╝     ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝
  Unicornstartups-inspired design system
  — Pure black canvas · Fluorescent accents · Editorial grotesque · Glass cards
*/

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  // Canvas
  void:     "#000000",
  ink:      "#080808",
  surface:  "#0F0F0F",
  elevated: "#141414",
  overlay:  "#1A1A1A",
  line:     "#222222",
  lineHi:   "#2E2E2E",

  // Fluorescents (the unicorn palette)
  lime:     "#B8FF57",
  limeDim:  "#B8FF5714",
  cyan:     "#00F5FF",
  cyanDim:  "#00F5FF12",
  orange:   "#FF6B1A",
  orangeDim:"#FF6B1A12",
  pink:     "#FF2D78",
  pinkDim:  "#FF2D7812",
  purple:   "#A855F7",
  purpleDim:"#A855F712",
  yellow:   "#FFE14D",
  yellowDim:"#FFE14D12",

  // Text
  white:    "#FFFFFF",
  t1:       "#F5F5F5",
  t2:       "#999999",
  t3:       "#555555",
  t4:       "#333333",
};

// ─── GLOBAL STYLES ─────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #000; color: #F5F5F5; font-family: 'Instrument Sans', sans-serif; -webkit-font-smoothing: antialiased; }
    input, button, select { font-family: inherit; }

    ::selection { background: #B8FF57; color: #000; }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #000; }
    ::-webkit-scrollbar-thumb { background: #222; border-radius: 99px; }

    @keyframes float-up {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes slide-up {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse-ring {
      0%, 100% { transform: scale(1); opacity: 0.6; }
      50%       { transform: scale(1.5); opacity: 0; }
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.3; }
    }
    @keyframes rain-fall {
      from { transform: translateY(-100px); }
      to   { transform: translateY(280px); }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes number-up {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes check-pop {
      0% { transform: scale(0); opacity: 0; }
      70% { transform: scale(1.2); }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes bar-grow {
      from { width: 0%; }
    }
    @keyframes glow-pulse {
      0%, 100% { box-shadow: 0 0 20px var(--glow); }
      50%       { box-shadow: 0 0 40px var(--glow), 0 0 80px var(--glow-far); }
    }
  `}</style>
);

// ─── PRIMITIVE COMPONENTS ─────────────────────────────────────────────────────

// Pill badge
const Pill = ({ children, color = T.lime, dot }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 5,
    background: color + "15", color, border: `1px solid ${color}30`,
    borderRadius: 99, padding: "3px 10px",
    fontSize: 11, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "0.04em", textTransform: "uppercase",
  }}>
    {dot && <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, display: "inline-block", animation: "blink 1.5s infinite" }} />}
    {children}
  </span>
);

// Glass card
const Glass = ({ children, accent, style = {}, onClick, animate }) => (
  <div onClick={onClick} style={{
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${accent ? accent + "40" : T.line}`,
    borderRadius: 20,
    backdropFilter: "blur(12px)",
    position: "relative", overflow: "hidden",
    boxShadow: accent ? `0 0 0 1px ${accent}10 inset, 0 8px 32px ${accent}08` : "none",
    animation: animate ? "float-up 0.5s ease forwards" : "none",
    cursor: onClick ? "pointer" : "default",
    transition: "border-color 0.2s, box-shadow 0.2s",
    ...style,
  }}>
    {accent && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${accent}80, transparent)` }} />}
    {children}
  </div>
);

// Mono number display
const Mono = ({ children, size = 16, color = T.white, style = {} }) => (
  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: size, fontWeight: 700, color, letterSpacing: "-0.02em", ...style }}>
    {children}
  </span>
);

// Section label
const Label = ({ children, color = T.t3 }) => (
  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color, fontFamily: "'JetBrains Mono', monospace", marginBottom: 6 }}>
    {children}
  </div>
);

// Thin progress bar
const Track = ({ value, max = 100, color = T.lime, h = 3, animate = true }) => {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ background: T.line, borderRadius: 99, height: h, overflow: "hidden" }}>
      <div style={{
        width: `${pct}%`, height: "100%", borderRadius: 99,
        background: color,
        boxShadow: `0 0 8px ${color}60`,
        animation: animate ? "bar-grow 1s ease" : "none",
        transition: "width 1s ease",
      }} />
    </div>
  );
};

// Animated counter
function Counter({ to, prefix = "", suffix = "", dur = 1400, color = T.white, size = 40 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let t0 = null;
    const go = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setV(Math.round(ease * to));
      if (p < 1) requestAnimationFrame(go);
    };
    requestAnimationFrame(go);
  }, [to]);
  return <Mono size={size} color={color}>{prefix}{v}{suffix}</Mono>;
}

// Divider
const Divider = () => <div style={{ height: 1, background: T.line, margin: "16px 0" }} />;

// Back button
const BackBtn = ({ onClick }) => (
  <button onClick={onClick} style={{
    background: T.surface, border: `1px solid ${T.line}`, color: T.t2,
    borderRadius: 12, padding: "8px 16px", cursor: "pointer", fontSize: 13,
    fontWeight: 500, display: "flex", alignItems: "center", gap: 6,
    transition: "border-color 0.2s, color 0.2s",
  }}>← Back</button>
);

// ─── DATA ─────────────────────────────────────────────────────────────────────
const PLANS = [
  { id: "basic",  name: "Basic",  price: 20, cap: 500,  color: T.cyan,   triggers: ["Rain","Heat"],                         tagline: "Essential cover" },
  { id: "pro",    name: "Pro",    price: 30, cap: 750,  color: T.lime,   triggers: ["Rain","Heat","AQI","Traffic"],         tagline: "Best value", popular: true },
  { id: "elite",  name: "Elite",  price: 35, cap: 1000, color: T.orange, triggers: ["Rain","Heat","AQI","Traffic","Cluster"],tagline: "Maximum shield" },
];

const ZONES = [
  { id:"tnagar",   name:"T. Nagar",        cx:210, cy:310, r:44, risk:"high",   aqi:312, rain:68, loss:220, orders:2.1 },
  { id:"anna",     name:"Anna Nagar",      cx:170, cy:195, r:38, risk:"medium", aqi:195, rain:32, loss:110, orders:3.4 },
  { id:"velachery",name:"Velachery",       cx:300, cy:355, r:36, risk:"high",   aqi:380, rain:72, loss:195, orders:1.8 },
  { id:"adyar",    name:"Adyar",           cx:255, cy:392, r:30, risk:"medium", aqi:210, rain:45, loss:130, orders:2.9 },
  { id:"porur",    name:"Porur",           cx:120, cy:298, r:32, risk:"safe",   aqi:98,  rain:12, loss:40,  orders:4.2 },
  { id:"chromepet",name:"Chromepet",       cx:195, cy:432, r:28, risk:"safe",   aqi:120, rain:18, loss:55,  orders:3.9 },
  { id:"perambur", name:"Perambur",        cx:240, cy:155, r:34, risk:"medium", aqi:240, rain:28, loss:90,  orders:3.1 },
  { id:"egmore",   name:"Egmore",          cx:228, cy:248, r:30, risk:"high",   aqi:340, rain:55, loss:175, orders:2.3 },
  { id:"sholi",    name:"Sholinganallur",  cx:358, cy:380, r:26, risk:"safe",   aqi:88,  rain:10, loss:30,  orders:4.5 },
  { id:"ambattur", name:"Ambattur",        cx:138, cy:155, r:30, risk:"medium", aqi:220, rain:22, loss:80,  orders:3.3 },
];

const RISK = {
  high:   { color: T.pink,   label: "High Risk",  dot: "🔴" },
  medium: { color: T.yellow, label: "Medium",      dot: "🟡" },
  safe:   { color: T.lime,   label: "Safe",        dot: "🟢" },
};

const HISTORY = [
  { id:1, date:"Mar 15", trigger:"Rain",    icon:"🌧️", expected:360, actual:120, loss:240, payout:180 },
  { id:2, date:"Mar 10", trigger:"Heat",    icon:"🌡️", expected:280, actual:90,  loss:190, payout:142 },
  { id:3, date:"Mar 5",  trigger:"Traffic", icon:"🚦", expected:320, actual:200, loss:120, payout:90  },
];

// ═══════════════════════════════════════════════════════════
// SCREEN: ONBOARDING
// ═══════════════════════════════════════════════════════════
function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("Rajan Kumar");
  const [platform, setPlatform] = useState("Swiggy");
  const [avg, setAvg] = useState(120);

  return (
    <div style={{ minHeight: "100vh", background: T.void, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 20px" }}>
      
      {/* Ambient glow */}
      <div style={{ position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 300, background: `radial-gradient(ellipse, ${T.lime}08 0%, transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 400, animation: "fade-in 0.6s ease" }}>
        {/* Wordmark */}
        <div style={{ marginBottom: 48, textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "baseline", gap: 4 }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: T.white, letterSpacing: "-0.04em" }}>iso</span>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: T.lime, letterSpacing: "-0.04em" }}>earnings</span>
          </div>
          <div style={{ fontSize: 12, color: T.t3, marginTop: 4, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Income Protection · Chennai</div>
        </div>

        {/* Step dots */}
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 32 }}>
          {[0, 1].map(i => (
            <div key={i} style={{ width: i === step ? 24 : 6, height: 6, borderRadius: 99, background: i === step ? T.lime : T.line, transition: "all 0.3s ease" }} />
          ))}
        </div>

        {step === 0 && (
          <div style={{ animation: "float-up 0.4s ease" }}>
            <Glass accent={T.lime} style={{ padding: 32 }}>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>₹</div>
                <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: T.white, letterSpacing: "-0.03em", marginBottom: 10 }}>
                  Protect your income.<br />Automatically.
                </h1>
                <p style={{ fontSize: 14, color: T.t2, lineHeight: 1.7 }}>
                  Rain. Heat. AQI. Traffic. When disruptions hit, we detect and pay — zero paperwork.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 8 }}>
                {[
                  { icon: "⚡", head: "Zero-touch", sub: "Auto payout" },
                  { icon: "📍", head: "Zone AI",    sub: "Live tracking" },
                  { icon: "💰", head: "Real loss",  sub: "Income-based" },
                ].map(f => (
                  <div key={f.head} style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: 14, padding: "14px 10px", textAlign: "center" }}>
                    <div style={{ fontSize: 22, marginBottom: 6 }}>{f.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.t1, marginBottom: 2 }}>{f.head}</div>
                    <div style={{ fontSize: 11, color: T.t3 }}>{f.sub}</div>
                  </div>
                ))}
              </div>
            </Glass>
          </div>
        )}

        {step === 1 && (
          <div style={{ animation: "float-up 0.4s ease" }}>
            <Glass accent={T.lime} style={{ padding: 28 }}>
              <Label>About you</Label>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: T.white, letterSpacing: "-0.02em", marginBottom: 24 }}>Quick setup</h2>

              <div style={{ marginBottom: 20 }}>
                <Label color={T.t3}>Your name</Label>
                <input value={name} onChange={e => setName(e.target.value)} style={{
                  width: "100%", background: T.surface, border: `1px solid ${T.lineHi}`,
                  borderRadius: 12, padding: "12px 16px", color: T.white, fontSize: 15, outline: "none",
                  transition: "border-color 0.2s",
                }} onFocus={e => e.target.style.borderColor = T.lime} onBlur={e => e.target.style.borderColor = T.lineHi} />
              </div>

              <div style={{ marginBottom: 20 }}>
                <Label color={T.t3}>Delivery platform</Label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {["Swiggy","Zomato","Blinkit","Dunzo"].map(p => (
                    <button key={p} onClick={() => setPlatform(p)} style={{
                      padding: "11px 0", borderRadius: 12,
                      border: `1px solid ${platform === p ? T.lime : T.line}`,
                      background: platform === p ? T.limeDim : "transparent",
                      color: platform === p ? T.lime : T.t3,
                      fontSize: 13, fontWeight: 600, cursor: "pointer",
                      transition: "all 0.2s",
                    }}>{p}</button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label color={T.t3}>Avg. hourly earnings</Label>
                  <Mono size={14} color={T.lime}>₹{avg}/hr</Mono>
                </div>
                <input type="range" min={60} max={250} step={10} value={avg} onChange={e => setAvg(+e.target.value)}
                  style={{ width: "100%", accentColor: T.lime, cursor: "pointer" }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: T.t3 }}>₹60</span>
                  <span style={{ fontSize: 11, color: T.t3 }}>₹250</span>
                </div>
              </div>
            </Glass>
          </div>
        )}

        <button onClick={() => step === 0 ? setStep(1) : onDone({ name, platform, avg, city: "Chennai" })} style={{
          width: "100%", marginTop: 16, padding: "16px 0", borderRadius: 16, border: "none",
          background: T.lime, color: T.void, fontSize: 15, fontWeight: 700,
          cursor: "pointer", fontFamily: "'Syne', sans-serif", letterSpacing: "-0.01em",
          boxShadow: `0 0 40px ${T.lime}30`,
          transition: "box-shadow 0.2s, transform 0.1s",
        }} onMouseEnter={e => { e.target.style.boxShadow = `0 0 60px ${T.lime}50`; }}
           onMouseLeave={e => { e.target.style.boxShadow = `0 0 40px ${T.lime}30`; }}>
          {step === 0 ? "Let's go →" : "Choose plan →"}
        </button>
      </div>
      <GlobalStyles />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SCREEN: PLAN SELECTION
// ═══════════════════════════════════════════════════════════
function Plans({ user, onSelect }) {
  const [sel, setSel] = useState("pro");
  const chosen = PLANS.find(p => p.id === sel);

  return (
    <div style={{ minHeight: "100vh", background: T.void, padding: "32px 20px 60px" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 1, background: T.line }} />

      <div style={{ maxWidth: 400, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 40, animation: "float-up 0.5s ease" }}>
          <Wordmark />
          <div style={{ marginTop: 28 }}>
            <Label color={T.t3}>Weekly plans</Label>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: T.white, letterSpacing: "-0.04em", lineHeight: 1.1 }}>
              Choose your<br /><span style={{ color: T.lime }}>shield.</span>
            </h1>
            <p style={{ color: T.t3, fontSize: 13, marginTop: 10 }}>
              Hi {user.name.split(" ")[0]} — Chennai risk zone surcharge +₹10 applies
            </p>
          </div>
        </div>

        {/* Plans */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {PLANS.map((plan, i) => (
            <div key={plan.id} onClick={() => setSel(plan.id)} style={{
              position: "relative",
              animation: `float-up ${0.3 + i * 0.1}s ease`,
            }}>
              {plan.popular && (
                <div style={{ position: "absolute", top: -10, left: 20, zIndex: 10, background: plan.color, color: T.void, fontSize: 10, fontWeight: 800, padding: "3px 12px", borderRadius: 99, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>
                  Most popular
                </div>
              )}
              <Glass accent={sel === plan.id ? plan.color : null} onClick={() => setSel(plan.id)} style={{ padding: 22, cursor: "pointer", border: `1px solid ${sel === plan.id ? plan.color + "50" : T.line}`, background: sel === plan.id ? plan.color + "06" : "rgba(255,255,255,0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: sel === plan.id ? plan.color : T.white, marginBottom: 2 }}>{plan.name}</div>
                    <div style={{ fontSize: 12, color: T.t3 }}>{plan.tagline}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <Mono size={26} color={T.white}>₹{plan.price}</Mono>
                    <div style={{ fontSize: 11, color: T.t3, marginTop: 1 }}>+₹10 / week</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                  {plan.triggers.map(t => (
                    <span key={t} style={{ background: plan.color + "14", color: plan.color, border: `1px solid ${plan.color}25`, borderRadius: 99, padding: "2px 10px", fontSize: 11, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{t}</span>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: T.t3 }}>Weekly cap</span>
                  <Mono size={13} color={plan.color}>₹{plan.cap}</Mono>
                </div>
                {sel === plan.id && (
                  <div style={{ position: "absolute", top: 20, right: 20, width: 22, height: 22, borderRadius: "50%", background: plan.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, animation: "check-pop 0.3s ease" }}>✓</div>
                )}
              </Glass>
            </div>
          ))}
        </div>

        <button onClick={() => onSelect(chosen)} style={{
          width: "100%", padding: "16px 0", borderRadius: 16, border: "none",
          background: chosen.color, color: T.void,
          fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne', sans-serif",
          letterSpacing: "-0.01em", boxShadow: `0 0 40px ${chosen.color}30`,
        }}>
          Activate {chosen.name} → ₹{chosen.price + 10}/week
        </button>
      </div>
      <GlobalStyles />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SCREEN: DASHBOARD
// ═══════════════════════════════════════════════════════════
function Dashboard({ user, plan, onMap, onAlert, onDisruption, onClaims }) {
  const [env, setEnv] = useState({ rain: 14, heat: 37, aqi: 185, traffic: 26, cluster: 18 });
  const [orders, setOrders] = useState(3.7);
  const [opp, setOpp] = useState(14);
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const iv = setInterval(() => {
      setClock(new Date());
      setEnv(e => ({
        rain:    Math.max(0,  e.rain    + (Math.random()-.5)*3),
        heat:    Math.max(30, e.heat    + (Math.random()-.5)*1),
        aqi:     Math.max(50, e.aqi     + (Math.random()-.5)*15),
        traffic: Math.max(5,  e.traffic + (Math.random()-.5)*4),
        cluster: Math.max(5,  e.cluster + (Math.random()-.5)*2.5),
      }));
      setOrders(o => Math.max(0.5, o + (Math.random()-.5)*.35));
      setOpp(o => Math.max(0, o + (Math.random()-.5)*3.5));
    }, 2400);
    return () => clearInterval(iv);
  }, []);

  const sensors = [
    { label:"Rainfall", val:env.rain,    unit:"mm/hr", thr:50,  max:100, color:T.cyan,   inv:false, icon:"🌧️" },
    { label:"Heat",     val:env.heat,    unit:"°C",    thr:45,  max:55,  color:T.orange, inv:false, icon:"🌡️" },
    { label:"AQI",      val:env.aqi,     unit:"",      thr:400, max:500, color:T.purple, inv:false, icon:"😷" },
    { label:"Traffic",  val:env.traffic, unit:"km/h",  thr:10,  max:60,  color:T.yellow, inv:true,  icon:"🚦" },
    { label:"Cluster",  val:env.cluster, unit:"%",     thr:60,  max:100, color:T.pink,   inv:false, icon:"👥" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.void, paddingBottom: 32 }}>
      {/* Top bar */}
      <div style={{ borderBottom: `1px solid ${T.line}`, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: T.void + "EE", backdropFilter: "blur(20px)", zIndex: 50 }}>
        <Wordmark small />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Pill color={plan.color} dot>{plan.name}</Pill>
          <Mono size={11} color={T.t3}>{clock.toLocaleTimeString()}</Mono>
        </div>
      </div>

      <div style={{ maxWidth: 440, margin: "0 auto", padding: "24px 20px" }}>
        {/* Hero earnings row */}
        <div style={{ marginBottom: 24, animation: "float-up 0.4s ease" }}>
          <Label color={T.t3}>This week · {user.city}</Label>
          <div style={{ display: "flex", gap: 0, marginTop: 4 }}>
            <div style={{ flex: 1 }}>
              <Mono size={44} color={T.white}>₹1,240</Mono>
              <div style={{ fontSize: 13, color: T.t3, marginTop: 4 }}>earned · baseline ₹{user.avg}/hr</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <Mono size={22} color={T.lime}>+₹312</Mono>
              <div style={{ fontSize: 12, color: T.t3, marginTop: 2 }}>payouts received</div>
            </div>
          </div>
        </div>

        {/* Live activity */}
        <Glass accent={opp > 50 ? T.pink : T.lime} style={{ padding: 22, marginBottom: 16, animation: "float-up 0.5s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <Label>Live activity</Label>
              <div style={{ fontSize: 13, color: T.t2, fontWeight: 500 }}>Real-time order monitoring</div>
            </div>
            <Pill color={T.lime} dot>Live</Pill>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: T.t3 }}>Orders/hr</span>
                <Mono size={12} color={T.lime}>{orders.toFixed(1)}</Mono>
              </div>
              <Track value={orders} max={6} color={T.lime} h={4} />
              <div style={{ fontSize: 11, color: T.t4, marginTop: 6 }}>baseline 4.2</div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: T.t3 }}>Opp. Loss</span>
                <Mono size={12} color={opp > 50 ? T.pink : T.yellow}>{opp.toFixed(0)}%</Mono>
              </div>
              <Track value={opp} max={100} color={opp > 50 ? T.pink : T.yellow} h={4} />
              <div style={{ fontSize: 11, color: T.t4, marginTop: 6 }}>trigger at 50%</div>
            </div>
          </div>
        </Glass>

        {/* Sensor grid */}
        <div style={{ marginBottom: 16, animation: "float-up 0.6s ease" }}>
          <Label color={T.t3}>Environment sensors</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 1, border: `1px solid ${T.line}`, borderRadius: 16, overflow: "hidden", marginTop: 8 }}>
            {sensors.map((s, i) => {
              const pct = s.inv
                ? Math.min(100, (1 - s.val / s.thr) * 100)
                : Math.min(100, (s.val / s.thr) * 100);
              const alert = pct > 80;
              return (
                <div key={s.label} style={{ background: i % 2 === 0 ? T.surface : T.ink, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 16, width: 24 }}>{s.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: T.t2, fontWeight: 500 }}>{s.label}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {alert && <Pill color={T.pink} size={9}>Alert</Pill>}
                        <Mono size={12} color={alert ? T.pink : s.color}>{s.val.toFixed(0)}{s.unit}</Mono>
                      </div>
                    </div>
                    <Track value={pct} max={100} color={alert ? T.pink : s.color} h={3} animate={false} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10, animation: "float-up 0.7s ease" }}>
          <button onClick={onMap} style={{ padding: "14px 0", borderRadius: 14, border: `1px solid ${T.line}`, background: "transparent", color: T.t1, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "border-color 0.2s" }}
            onMouseEnter={e => e.target.style.borderColor = T.cyan} onMouseLeave={e => e.target.style.borderColor = T.line}>
            📍 Risk Map
          </button>
          <button onClick={onAlert} style={{ padding: "14px 0", borderRadius: 14, border: `1px solid ${T.orange}40`, background: T.orangeDim, color: T.orange, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            🚨 AI Alerts
          </button>
        </div>

        <button onClick={onDisruption} style={{
          width: "100%", padding: "16px 0", borderRadius: 16, border: "none",
          background: T.pink, color: T.white,
          fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne', sans-serif",
          letterSpacing: "-0.01em", boxShadow: `0 0 40px ${T.pink}25`,
          marginBottom: 10, animation: "float-up 0.8s ease",
        }}>🌧️ Simulate disruption →</button>

        <button onClick={onClaims} style={{ width: "100%", padding: "13px 0", borderRadius: 14, border: `1px solid ${T.line}`, background: "transparent", color: T.t3, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
          View claims history
        </button>
      </div>
      <GlobalStyles />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SCREEN: RISK MAP
// ═══════════════════════════════════════════════════════════
function RiskMap({ onBack, onAlert }) {
  const [active, setActive] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  const zone = active ? ZONES.find(z => z.id === active) : null;
  const riskData = zone ? RISK[zone.risk] : null;

  return (
    <div style={{ minHeight: "100vh", background: T.void, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${T.line}`, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, background: T.void, position: "sticky", top: 0, zIndex: 50 }}>
        <BackBtn onClick={onBack} />
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: T.white }}>Live Risk Map</div>
          <div style={{ fontSize: 11, color: T.t3, fontFamily: "'JetBrains Mono', monospace" }}>Chennai · real-time</div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <Pill color={T.pink} dot>Live</Pill>
        </div>
      </div>

      {/* Legend bar */}
      <div style={{ borderBottom: `1px solid ${T.line}`, padding: "10px 20px", display: "flex", gap: 16, background: T.surface }}>
        {Object.entries(RISK).map(([k, v]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: v.color, boxShadow: `0 0 6px ${v.color}` }} />
            <span style={{ fontSize: 11, color: T.t2, fontFamily: "'JetBrains Mono', monospace" }}>{v.label}</span>
          </div>
        ))}
      </div>

      {/* Map SVG */}
      <div style={{ position: "relative", flex: 1 }}>
        <svg viewBox="0 0 480 500" style={{ width: "100%", maxHeight: "52vh", display: "block" }}>
          <defs>
            <radialGradient id="mapbg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0C1420" />
              <stop offset="100%" stopColor="#050810" />
            </radialGradient>
            <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="12" r="0.8" fill="#1E2D44" />
            </pattern>
            {ZONES.map(z => (
              <radialGradient key={z.id} id={`g-${z.id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={RISK[z.risk].color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={RISK[z.risk].color} stopOpacity="0" />
              </radialGradient>
            ))}
          </defs>

          <rect width="480" height="500" fill="url(#mapbg)" />
          <rect width="480" height="500" fill="url(#dots)" opacity="0.7" />

          {/* Roads - major */}
          {[
            "M 60 120 L 420 120", "M 60 240 L 430 240", "M 60 360 L 410 360",
            "M 160 50 L 160 470", "M 270 50 L 270 470", "M 380 50 L 380 470",
          ].map((d, i) => <path key={i} d={d} stroke="#0F2040" strokeWidth="1.5" fill="none" />)}

          {/* Roads - express */}
          {["M 60 185 L 430 185", "M 215 50 L 215 470"].map((d, i) => (
            <path key={i} d={d} stroke="#152840" strokeWidth="3" fill="none" />
          ))}

          {/* Bay of bengal coastline */}
          <path d="M 390 60 Q 440 180 430 320 Q 425 400 410 470" stroke="#00F5FF18" strokeWidth="2.5" fill="none" strokeDasharray="8 5" />
          <text x="402" y="260" fill="#00F5FF20" fontSize="8.5" fontFamily="'JetBrains Mono', monospace" transform="rotate(92, 402, 260)">BAY OF BENGAL</text>

          {/* Zone glows + circles */}
          {ZONES.map((z, i) => {
            const rc = RISK[z.risk].color;
            const isActive = active === z.id;
            const pulseR = z.r * (1 + Math.sin(tick * 0.9 + i * 1.1) * (z.risk === "high" ? 0.22 : z.risk === "medium" ? 0.12 : 0.06));

            return (
              <g key={z.id} onClick={() => setActive(isActive ? null : z.id)} style={{ cursor: "pointer" }}>
                {/* Outer glow spread */}
                <circle cx={z.cx} cy={z.cy} r={z.r * 2.2} fill={`url(#g-${z.id})`} opacity={isActive ? 0.8 : 0.5} />
                {/* Pulse ring */}
                {z.risk !== "safe" && (
                  <circle cx={z.cx} cy={z.cy} r={pulseR * 1.3} fill="none" stroke={rc} strokeWidth="1" opacity="0.3" />
                )}
                {/* Main fill */}
                <circle cx={z.cx} cy={z.cy} r={z.r} fill={rc + (isActive ? "28" : "15")} stroke={rc} strokeWidth={isActive ? 2 : 1} opacity="0.95" />
                {/* Inner bright dot */}
                <circle cx={z.cx} cy={z.cy} r={4} fill={rc} />
                {/* High risk warning */}
                {z.risk === "high" && <text x={z.cx - 6} y={z.cy + 4} fontSize="11">⚠️</text>}
                {/* Label */}
                <text x={z.cx} y={z.cy + z.r + 13} textAnchor="middle" fill={rc + "DD"} fontSize="9" fontWeight="600" fontFamily="'Instrument Sans', sans-serif">{z.name}</text>
              </g>
            );
          })}

          {/* YOU marker */}
          <g>
            <circle cx={210} cy={310} r={14} fill={T.cyan + "20"} stroke={T.cyan} strokeWidth="1.5" />
            <circle cx={210} cy={310} r={5} fill={T.cyan} />
            <text x={228} y={307} fill={T.cyan} fontSize="9.5" fontWeight="700" fontFamily="'JetBrains Mono', monospace">YOU</text>
          </g>
        </svg>

        {/* Tap hint */}
        {!active && (
          <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)", border: `1px solid ${T.line}`, borderRadius: 99, padding: "8px 18px", fontSize: 12, color: T.t2, whiteSpace: "nowrap" }}>
            Tap a zone for details
          </div>
        )}

        {/* Zone info panel */}
        {zone && (
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "rgba(8,8,8,0.95)", backdropFilter: "blur(20px)",
            borderTop: `1px solid ${riskData.color}50`,
            borderRadius: "24px 24px 0 0", padding: "24px 20px 28px",
            animation: "slide-up 0.3s ease",
          }}>
            {/* Top accent line */}
            <div style={{ position: "absolute", top: 0, left: "30%", right: "30%", height: 1, background: `linear-gradient(90deg, transparent, ${riskData.color}, transparent)` }} />

            {/* Handle */}
            <div style={{ width: 36, height: 4, background: T.lineHi, borderRadius: 99, margin: "0 auto 20px" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: T.white, letterSpacing: "-0.02em" }}>{zone.name}</div>
                <Pill color={riskData.color}>{riskData.label}</Pill>
              </div>
              <button onClick={() => setActive(null)} style={{ background: T.surface, border: `1px solid ${T.line}`, color: T.t2, borderRadius: 10, padding: "6px 10px", cursor: "pointer", fontSize: 14 }}>✕</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[
                { icon: "💧", label: "Rain", val: `${zone.rain}mm`, color: zone.rain > 50 ? T.pink : T.cyan },
                { icon: "😷", label: "AQI",  val: zone.aqi,         color: zone.aqi > 300 ? T.pink : zone.aqi > 200 ? T.yellow : T.lime },
                { icon: "📦", label: "Orders",val:`${zone.orders}/hr`, color: zone.orders < 2.5 ? T.pink : T.lime },
                { icon: "💸", label: "Est. Loss", val: `₹${zone.loss}`, color: zone.loss > 150 ? T.pink : T.yellow },
              ].map(d => (
                <div key={d.label} style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: 12, padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{d.icon}</div>
                  <Mono size={13} color={d.color}>{d.val}</Mono>
                  <div style={{ fontSize: 10, color: T.t3, marginTop: 3 }}>{d.label}</div>
                </div>
              ))}
            </div>

            {zone.risk === "high" && (
              <button onClick={onAlert} style={{ width: "100%", padding: "14px 0", borderRadius: 14, border: "none", background: T.pink, color: T.white, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne', sans-serif" }}>
                🚨 View AI Alert for {zone.name} →
              </button>
            )}
          </div>
        )}
      </div>
      <GlobalStyles />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SCREEN: ALERT (Pre-disruption AI)
// ═══════════════════════════════════════════════════════════
function Alert({ onBack, onDisruption }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: T.void, paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${T.line}`, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, background: T.void, position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(20px)" }}>
        <BackBtn onClick={onBack} />
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: T.white }}>Predictive Alerts</div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <Pill color={T.orange}>AI Powered</Pill>
        </div>
      </div>

      <div style={{ maxWidth: 440, margin: "0 auto", padding: "24px 20px" }}>
        {/* Main alert */}
        <div style={{ animation: "float-up 0.4s ease", marginBottom: 16 }}>
          <Glass accent={T.pink} style={{ padding: 0, overflow: "hidden" }}>
            {/* Alert header strip */}
            <div style={{ background: T.pink + "18", borderBottom: `1px solid ${T.pink}25`, padding: "16px 22px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 36 }}>🚨</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: T.pink, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 3 }}>
                  Incoming · 3 hrs away
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: T.white, letterSpacing: "-0.02em" }}>
                  Heavy Rain Expected
                </div>
                <div style={{ fontSize: 12, color: T.t2, marginTop: 2 }}>T. Nagar, Egmore, Velachery · 7:00–10:00 PM</div>
              </div>
            </div>

            <div style={{ padding: 22 }}>
              {/* Loss estimate - THE key numbers */}
              <Label color={T.t3}>AI income impact estimate</Label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: T.line, borderRadius: 14, overflow: "hidden", marginBottom: 20, marginTop: 10 }}>
                {[
                  { label: "Expected",     val: "₹360", color: T.t1, bg: T.surface },
                  { label: "Projected",    val: "₹140", color: T.orange, bg: T.elevated },
                  { label: "Est. Loss",    val: "₹220", color: T.pink, bg: T.surface },
                ].map(s => (
                  <div key={s.label} style={{ background: s.bg, padding: "16px 12px", textAlign: "center" }}>
                    <Mono size={22} color={s.color}>{s.val}</Mono>
                    <div style={{ fontSize: 11, color: T.t3, marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Confidence bar */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: T.t3 }}>AI confidence</span>
                  <Mono size={12} color={T.lime}>87%</Mono>
                </div>
                <Track value={87} max={100} color={T.lime} h={4} />
              </div>

              {/* Conditions grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 18 }}>
                {[
                  { icon:"🌧️", label:"Rainfall",   val:"~75 mm/hr",  color:T.cyan   },
                  { icon:"💨", label:"Wind speed",  val:"42 km/h",   color:T.blue   },
                  { icon:"😷", label:"Post AQI",    val:"~340",      color:T.orange },
                  { icon:"🚦", label:"Traffic",     val:"Severe",    color:T.pink   },
                ].map(c => (
                  <div key={c.label} style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{c.icon}</span>
                    <div>
                      <div style={{ fontSize: 10, color: T.t3 }}>{c.label}</div>
                      <Mono size={13} color={c.color}>{c.val}</Mono>
                    </div>
                  </div>
                ))}
              </div>

              {/* Expandable details */}
              <button onClick={() => setOpen(!open)} style={{ width: "100%", padding: "12px 0", borderRadius: 12, border: `1px solid ${T.line}`, background: "transparent", color: T.t2, fontSize: 13, fontWeight: 500, cursor: "pointer", marginBottom: 10 }}>
                {open ? "Hide details ↑" : "View AI details ↓"}
              </button>

              {open && (
                <div style={{ marginBottom: 16, animation: "float-up 0.3s ease" }}>
                  <div style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: 14, padding: 16 }}>
                    {[
                      ["IMD forecast",        "Rain >60mm/hr, 7–10 PM"],
                      ["Historical match",    "Mar 12 → ₹210 loss"],
                      ["Cluster prediction",  "70% workers likely halt"],
                      ["Surge status",        "No platform surge active"],
                      ["Your coverage",       "Shield Pro covers this ✓"],
                    ].map(([l, v]) => (
                      <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 12 }}>
                        <span style={{ color: T.t3 }}>{l}</span>
                        <span style={{ color: T.t2, fontWeight: 500, textAlign: "right", maxWidth: "55%" }}>{v}</span>
                      </div>
                    ))}
                    <Divider />
                    <div style={{ fontSize: 12, color: T.lime }}>✓ Your plan auto-triggers if loss &gt;50% of baseline.</div>
                  </div>
                </div>
              )}

              <button onClick={onDisruption} style={{ width: "100%", padding: "15px 0", borderRadius: 14, border: "none", background: T.pink, color: T.white, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne', sans-serif", letterSpacing: "-0.01em", boxShadow: `0 0 32px ${T.pink}30` }}>
                ⚡ Simulate disruption now
              </button>
            </div>
          </Glass>
        </div>

        {/* Secondary alert */}
        <Glass accent={T.yellow} style={{ padding: 18, animation: "float-up 0.6s ease" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ fontSize: 28 }}>🌡️</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.yellow, marginBottom: 3 }}>Heat Advisory · Tomorrow 11 AM–3 PM</div>
              <div style={{ fontSize: 12, color: T.t3, lineHeight: 1.6 }}>Heat index may reach 46°C. Est. loss ₹90. Your plan covers this automatically.</div>
            </div>
          </div>
        </Glass>
      </div>
      <GlobalStyles />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SCREEN: DISRUPTION DETECTED
// ═══════════════════════════════════════════════════════════
function Disruption({ user, plan, onClose, onConfirm }) {
  const [step, setStep] = useState(0); // 0 detected · 1 validating · 2 payout
  const [revealed, setRevealed] = useState([]);

  const expected = 240;
  const actual = 80;
  const loss = 160;
  const payout = Math.min(Math.round(loss * 0.75), plan.cap);

  const CHECKS = [
    { label:"GPS consistency",   sub:"Active 1.2km from zone · 3h" },
    { label:"Motion sensor",     sub:"Delivery pattern confirmed"   },
    { label:"Cluster validation",sub:"71% nearby workers offline"   },
    { label:"Opportunity loss",  sub:"67% drop vs 7-day baseline"   },
    { label:"Surge status",      sub:"No platform surge active"     },
    { label:"Fraud score",       sub:"0.03/1.0 — Clear"             },
  ];

  const runChecks = () => {
    setStep(1);
    setRevealed([]);
    CHECKS.forEach((_, i) => {
      setTimeout(() => {
        setRevealed(prev => [...prev, i]);
        if (i === CHECKS.length - 1) setTimeout(() => setStep(2), 700);
      }, i * 480);
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: T.void, paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${T.line}`, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, background: T.void, position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(20px)" }}>
        <BackBtn onClick={onClose} />
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, color: T.white }}>Disruption Detected</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          {["Detected","Validating","Payout"].map((l, i) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: i <= step ? T.lime : T.t4 }} />
              <span style={{ fontSize: 10, color: i <= step ? T.lime : T.t4, fontFamily: "'JetBrains Mono', monospace" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 440, margin: "0 auto", padding: "24px 20px" }}>

        {/* ── STEP 0: EVENT CARD ─────────────────── */}
        {step === 0 && (
          <div style={{ animation: "float-up 0.4s ease" }}>
            <Glass accent={T.cyan} style={{ padding: 0, overflow: "hidden", marginBottom: 16 }}>
              {/* Animated rain header */}
              <div style={{ background: `linear-gradient(160deg, ${T.cyan}18, ${T.void})`, padding: "28px 24px 24px", position: "relative", overflow: "hidden" }}>
                {/* Rain lines */}
                <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 400 180">
                  {Array.from({ length: 14 }, (_, i) => (
                    <line key={i} x1={i * 30 + (i%3)*5} y1={-20} x2={i * 30 + (i%3)*5 - 8} y2={200}
                      stroke={T.cyan} strokeWidth="1" opacity="0.12"
                      style={{ animation: `rain-fall ${0.7 + (i%4)*0.15}s linear infinite`, animationDelay: `${i * 0.1}s` }} />
                  ))}
                </svg>
                <div style={{ position: "relative" }}>
                  <Pill color={T.pink} dot>Active disruption</Pill>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: T.white, letterSpacing: "-0.04em", margin: "12px 0 4px" }}>
                    🌧️ Rain detected
                  </div>
                  <div style={{ fontSize: 13, color: T.t2 }}>T. Nagar zone · Ongoing right now</div>
                </div>
              </div>

              <div style={{ padding: "0 24px 24px" }}>
                {/* Time window */}
                <div style={{ background: T.surface, borderRadius: 14, padding: 18, margin: "18px 0" }}>
                  <Label color={T.t3}>Disruption window</Label>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
                    <div style={{ textAlign: "center" }}>
                      <Mono size={28} color={T.white}>8:00</Mono>
                      <div style={{ fontSize: 10, color: T.t3, marginTop: 2 }}>Start</div>
                    </div>
                    <div style={{ flex: 1, position: "relative" }}>
                      <div style={{ height: 4, background: T.lineHi, borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ width: "42%", height: "100%", background: `linear-gradient(90deg, ${T.cyan}, ${T.pink})`, borderRadius: 99 }} />
                      </div>
                      <div style={{ position: "absolute", left: "42%", top: "50%", transform: "translate(-50%,-50%)", width: 14, height: 14, borderRadius: "50%", background: T.pink, border: `2px solid ${T.void}`, boxShadow: `0 0 10px ${T.pink}` }} />
                      <div style={{ textAlign: "center", marginTop: 6, fontSize: 11, color: T.cyan, fontFamily: "'JetBrains Mono', monospace" }}>~ 2 hrs peak window</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <Mono size={28} color={T.t2}>10:00</Mono>
                      <div style={{ fontSize: 10, color: T.t3, marginTop: 2 }}>Est. end</div>
                    </div>
                  </div>
                </div>

                {/* Sensor readings grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { icon:"💧", label:"Rainfall",   val:"73.2",   unit:"mm/hr",   note:"⬆ above threshold", color:T.pink  },
                    { icon:"😷", label:"AQI",         val:"312",    unit:"",        note:"Elevated — watch",  color:T.orange},
                    { icon:"🌡️", label:"Heat Index", val:"38.4",   unit:"°C",      note:"Within safe range", color:T.lime  },
                    { icon:"🚦", label:"Traffic",     val:"7",      unit:"km/h",    note:"⬇ below threshold", color:T.pink  },
                  ].map(s => (
                    <div key={s.label} style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: 12, padding: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 18 }}>{s.icon}</span>
                        <span style={{ fontSize: 11, color: T.t3 }}>{s.label}</span>
                      </div>
                      <Mono size={20} color={s.color}>{s.val}<span style={{ fontSize: 12 }}>{s.unit}</span></Mono>
                      <div style={{ fontSize: 10, color: s.color + "80", marginTop: 4 }}>{s.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Glass>

            <button onClick={runChecks} style={{ width: "100%", padding: "16px 0", borderRadius: 16, border: "none", background: T.lime, color: T.void, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne', sans-serif", letterSpacing: "-0.01em", boxShadow: `0 0 40px ${T.lime}30` }}>
              Validate &amp; calculate payout →
            </button>
          </div>
        )}

        {/* ── STEP 1: VALIDATION ─────────────────── */}
        {step === 1 && (
          <div style={{ animation: "float-up 0.4s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 28, paddingTop: 8 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", border: `2px solid ${T.lime}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", animation: "spin 2s linear infinite" }}>
                <div style={{ fontSize: 24 }}>🔍</div>
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: T.white }}>Running fraud checks</div>
              <div style={{ fontSize: 13, color: T.t3, marginTop: 4 }}>Multi-signal verification</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {CHECKS.map((c, i) => {
                const done = revealed.includes(i);
                return (
                  <div key={c.label} style={{ background: done ? T.limeDim : T.surface, border: `1px solid ${done ? T.lime + "40" : T.line}`, borderRadius: 14, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: done ? 1 : 0.3, transition: "all 0.4s ease" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.t1 }}>{c.label}</div>
                      <div style={{ fontSize: 11, color: T.t3, marginTop: 2 }}>{c.sub}</div>
                    </div>
                    {done && <div style={{ width: 24, height: 24, borderRadius: "50%", background: T.lime, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: T.void, fontWeight: 800, animation: "check-pop 0.3s ease" }}>✓</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STEP 2: INCOME COMPARISON ─────────────────── */}
        {step === 2 && (
          <div style={{ animation: "float-up 0.4s ease" }}>
            <div style={{ marginBottom: 6 }}>
              <Pill color={T.lime} dot>All checks passed</Pill>
            </div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: T.white, letterSpacing: "-0.03em", margin: "12px 0 4px" }}>Income Breakdown</h2>
            <div style={{ fontSize: 13, color: T.t3, marginBottom: 24 }}>8:00 PM – 10:00 PM · Peak window</div>

            {/* THE KEY COMPARISON — clean visual */}
            <Glass accent={T.lime} style={{ padding: 24, marginBottom: 16 }}>
              {/* Bar chart comparison */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                {/* Expected col */}
                <div style={{ textAlign: "center" }}>
                  <Label color={T.t3}>Expected</Label>
                  <div style={{ height: 100, background: T.surface, borderRadius: 12, overflow: "hidden", display: "flex", alignItems: "flex-end", marginTop: 8 }}>
                    <div style={{ width: "100%", height: "100%", background: `linear-gradient(180deg, ${T.lime}20, ${T.lime}50)`, display: "flex", alignItems: "center", justifyContent: "center", animation: "bar-grow 1s ease" }}>
                      <Mono size={28} color={T.lime}>₹{expected}</Mono>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: T.t3, marginTop: 6 }}>₹{user.avg}/hr × 2h</div>
                </div>
                {/* Actual col */}
                <div style={{ textAlign: "center" }}>
                  <Label color={T.t3}>Actual</Label>
                  <div style={{ height: 100, background: T.surface, borderRadius: 12, overflow: "hidden", display: "flex", alignItems: "flex-end", marginTop: 8 }}>
                    <div style={{ width: "100%", height: `${(actual / expected) * 100}%`, background: `linear-gradient(180deg, ${T.pink}20, ${T.pink}60)`, display: "flex", alignItems: "center", justifyContent: "center", animation: "bar-grow 1.2s ease" }}>
                      <Mono size={28} color={T.pink}>₹{actual}</Mono>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: T.pink + "80", marginTop: 6 }}>During disruption</div>
                </div>
              </div>

              <Divider />

              {/* Loss row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.t1 }}>Income Loss</div>
                  <div style={{ fontSize: 12, color: T.t3, marginTop: 2 }}>Expected − Actual</div>
                </div>
                <Mono size={32} color={T.pink}>−₹{loss}</Mono>
              </div>

              <Divider />

              {/* Payout */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0 8px" }}>
                <div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: T.lime }}>Your Payout</div>
                  <div style={{ fontSize: 12, color: T.t3, marginTop: 3 }}>75% of loss · cap ₹{plan.cap}</div>
                  <div style={{ fontSize: 11, color: T.lime + "70", marginTop: 2 }}>⚡ Auto-credited to UPI</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Mono size={44} color={T.lime}>₹{payout}</Mono>
                </div>
              </div>
            </Glass>

            {/* Summary pills */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
              {[
                { label:"Expected", val:`₹${expected}`, c:T.t2  },
                { label:"Actual",   val:`₹${actual}`,   c:T.pink },
                { label:"Loss",     val:`₹${loss}`,     c:T.yellow},
              ].map(s => (
                <div key={s.label} style={{ background: T.surface, border: `1px solid ${T.line}`, borderRadius: 12, padding: "12px 8px", textAlign: "center" }}>
                  <Mono size={16} color={s.c}>{s.val}</Mono>
                  <div style={{ fontSize: 10, color: T.t3, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <button onClick={() => onConfirm(payout)} style={{ width: "100%", padding: "16px 0", borderRadius: 16, border: "none", background: T.lime, color: T.void, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne', sans-serif", letterSpacing: "-0.01em", boxShadow: `0 0 40px ${T.lime}30` }}>
              Confirm ₹{payout} payout →
            </button>
          </div>
        )}
      </div>
      <GlobalStyles />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SCREEN: PAYOUT SUCCESS
// ═══════════════════════════════════════════════════════════
function PayoutSuccess({ amount, onDone }) {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 80); }, []);

  return (
    <div style={{ minHeight: "100vh", background: T.void, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      {/* Ambient */}
      <div style={{ position: "fixed", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 500, background: `radial-gradient(ellipse, ${T.lime}10 0%, transparent 70%)`, pointerEvents: "none", borderRadius: "50%" }} />

      <div style={{ textAlign: "center", maxWidth: 360, position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 72, transform: show ? "scale(1)" : "scale(0)", transition: "transform 0.6s cubic-bezier(0.34,1.56,0.64,1)", marginBottom: 12 }}>🎉</div>

        <div style={{ opacity: show ? 1 : 0, transition: "opacity 0.5s 0.3s", marginBottom: 4 }}>
          <Label color={T.t3}>Payout confirmed</Label>
        </div>

        <div style={{ opacity: show ? 1 : 0, transition: "opacity 0.5s 0.4s", marginBottom: 8 }}>
          <Counter to={amount} prefix="₹" size={64} color={T.lime} />
        </div>

        <div style={{ opacity: show ? 1 : 0, transition: "opacity 0.5s 0.5s", fontSize: 14, color: T.t3, marginBottom: 32 }}>
          Credited to UPI · within 2 minutes
        </div>

        <Glass accent={T.lime} style={{ padding: 20, marginBottom: 20, opacity: show ? 1 : 0, transition: "opacity 0.5s 0.7s", textAlign: "left" }}>
          {[
            ["Transaction", `IE-${Date.now().toString().slice(-8)}`],
            ["Method",      "UPI · Instant"],
            ["Trigger",     "🌧️ Rain / Flood"],
            ["Cap left",    `₹${880 - amount} this week`],
          ].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: T.t3 }}>{l}</span>
              <Mono size={12} color={T.t2}>{v}</Mono>
            </div>
          ))}
        </Glass>

        <button onClick={onDone} style={{ width: "100%", padding: "15px 0", borderRadius: 14, border: "none", background: T.lime, color: T.void, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne', sans-serif", opacity: show ? 1 : 0, transition: "opacity 0.5s 0.9s" }}>
          Back to dashboard
        </button>
      </div>
      <GlobalStyles />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SCREEN: CLAIMS HISTORY
// ═══════════════════════════════════════════════════════════
function Claims({ onBack }) {
  const total = HISTORY.reduce((s, c) => s + c.payout, 0);
  const tColors = { Rain: T.cyan, Heat: T.orange, Traffic: T.yellow };

  return (
    <div style={{ minHeight: "100vh", background: T.void, paddingBottom: 40 }}>
      <div style={{ borderBottom: `1px solid ${T.line}`, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, background: T.void, position: "sticky", top: 0, backdropFilter: "blur(20px)", zIndex: 50 }}>
        <BackBtn onClick={onBack} />
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: T.white }}>Claims History</div>
      </div>

      <div style={{ maxWidth: 440, margin: "0 auto", padding: "24px 20px" }}>
        {/* Totals */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24, animation: "float-up 0.4s ease" }}>
          {[
            { label:"Total claims", val: HISTORY.length,  color: T.lime   },
            { label:"Total paid",   val: `₹${total}`,     color: T.yellow },
            { label:"Success rate", val: "100%",           color: T.lime   },
          ].map(s => (
            <Glass key={s.label} accent={s.color} style={{ padding: "16px 12px", textAlign: "center" }}>
              <Mono size={20} color={s.color}>{s.val}</Mono>
              <div style={{ fontSize: 10, color: T.t3, marginTop: 5 }}>{s.label}</div>
            </Glass>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {HISTORY.map((c, i) => {
            const col = tColors[c.trigger] || T.lime;
            return (
              <Glass key={c.id} accent={col} style={{ padding: 20, animation: `float-up ${0.3 + i * 0.1}s ease` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <div style={{ fontSize: 28 }}>{c.icon}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: T.white }}>{c.trigger}</div>
                      <div style={{ fontSize: 12, color: T.t3, marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>{c.date}, 2025</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <Mono size={22} color={T.lime}>+₹{c.payout}</Mono>
                    <Pill color={T.lime} size={9}>Paid</Pill>
                  </div>
                </div>

                {/* Comparison mini-bars */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  {[
                    { label:"Expected", val:c.expected, color:T.t2  },
                    { label:"Actual",   val:c.actual,   color:T.pink },
                    { label:"Loss",     val:c.loss,     color:T.yellow },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 10, color: T.t3 }}>{s.label}</span>
                        <Mono size={11} color={s.color}>₹{s.val}</Mono>
                      </div>
                      <Track value={s.val} max={c.expected} color={s.color} h={3} animate={false} />
                    </div>
                  ))}
                </div>
              </Glass>
            );
          })}
        </div>
      </div>
      <GlobalStyles />
    </div>
  );
}

// ─── SHARED ───────────────────────────────────────────────────────────────────
function Wordmark({ small }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: small ? 18 : 22, fontWeight: 800, color: T.white, letterSpacing: "-0.04em" }}>iso</span>
      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: small ? 18 : 22, fontWeight: 800, color: T.lime, letterSpacing: "-0.04em" }}>earnings</span>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("onboard");
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState(null);
  const [payout, setPayout] = useState(0);

  return (
    <>
      {screen === "onboard"    && <Onboarding onDone={u => { setUser(u); setScreen("plans"); }} />}
      {screen === "plans"      && <Plans user={user} onSelect={p => { setPlan(p); setScreen("dashboard"); }} />}
      {screen === "dashboard"  && <Dashboard user={user} plan={plan} onMap={() => setScreen("map")} onAlert={() => setScreen("alert")} onDisruption={() => setScreen("disruption")} onClaims={() => setScreen("claims")} />}
      {screen === "map"        && <RiskMap onBack={() => setScreen("dashboard")} onAlert={() => setScreen("alert")} />}
      {screen === "alert"      && <Alert onBack={() => setScreen("dashboard")} onDisruption={() => setScreen("disruption")} />}
      {screen === "disruption" && <Disruption user={user} plan={plan} onClose={() => setScreen("dashboard")} onConfirm={amt => { setPayout(amt); setScreen("payout"); }} />}
      {screen === "payout"     && <PayoutSuccess amount={payout} onDone={() => setScreen("dashboard")} />}
      {screen === "claims"     && <Claims onBack={() => setScreen("dashboard")} />}
    </>
  );
}

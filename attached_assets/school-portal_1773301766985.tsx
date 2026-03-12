import { useState, useEffect } from "react";

// ─── INITIAL DATA ───────────────────────────────────────────────
const INIT = {
  classes: ["6-A","6-B","7-A","7-B","8-A","8-B","9-A","9-B","10-A","10-B"],
  subjects: ["Mathematics","Science","English","Urdu","Islamiat","Computer","Physics","Chemistry","Biology","Pakistan Studies"],
  teachers: [
    { id:"T001", name:"Sana Ahmed", password:"sana123", subject:"Science", joining:"2019-03-15", salary:45000, phone:"0300-1111111", address:"Lahore", classes:["9-A","9-B","10-A"] },
    { id:"T002", name:"Imran Khan", password:"imran123", subject:"Mathematics", joining:"2017-08-01", salary:50000, phone:"0301-2222222", address:"Lahore", classes:["9-A","10-A","10-B"] },
    { id:"T003", name:"Nadia Malik", password:"nadia123", subject:"English", joining:"2020-06-10", salary:42000, phone:"0302-3333333", address:"Lahore", classes:["9-A","9-B","10-A","10-B"] },
  ],
  students: [
    { id:"STU001", name:"Ahmad Ali", password:"ahmad123", class:"10-A", father:"Ali Hassan", phone:"0303-1111111", dob:"2010-03-15", address:"Lahore", rollNo:"01" },
    { id:"STU002", name:"Bilal Ahmed", password:"bilal123", class:"10-A", father:"Ahmed Raza", phone:"0304-2222222", dob:"2010-05-20", address:"Lahore", rollNo:"02" },
    { id:"STU003", name:"Zara Khan", password:"zara123", class:"10-B", father:"Khan Sahib", phone:"0305-3333333", dob:"2010-07-10", address:"Lahore", rollNo:"01" },
    { id:"STU004", name:"Hamza Tariq", password:"hamza123", class:"9-A", father:"Tariq Mehmood", phone:"0306-4444444", dob:"2011-01-05", address:"Lahore", rollNo:"01" },
  ],
  fees: {
    STU001: [
      { month:"January 2026", amount:4500, paid:true, paidDate:"2026-01-03" },
      { month:"February 2026", amount:4500, paid:true, paidDate:"2026-02-05" },
      { month:"March 2026", amount:4500, paid:false, paidDate:null },
      { month:"April 2026", amount:4500, paid:false, paidDate:null },
    ],
    STU002: [
      { month:"January 2026", amount:4500, paid:true, paidDate:"2026-01-04" },
      { month:"February 2026", amount:4500, paid:false, paidDate:null },
      { month:"March 2026", amount:4500, paid:false, paidDate:null },
    ],
    STU003: [
      { month:"January 2026", amount:4200, paid:true, paidDate:"2026-01-06" },
      { month:"February 2026", amount:4200, paid:true, paidDate:"2026-02-08" },
      { month:"March 2026", amount:4200, paid:true, paidDate:"2026-03-02" },
    ],
    STU004: [
      { month:"January 2026", amount:4000, paid:true, paidDate:"2026-01-05" },
      { month:"February 2026", amount:4000, paid:false, paidDate:null },
    ],
  },
  diary: {
    STU001: [
      { date:"2026-03-10", subject:"Mathematics", note:"Chapter 5 revision karo — quadratic equations. Kal test hoga.", teacher:"T002" },
      { date:"2026-03-09", subject:"English", note:"Essay: 'My Country'. 2 pages likhni hain.", teacher:"T003" },
      { date:"2026-03-08", subject:"Science", note:"Lab report submit karo Friday tak. Diagrams zaroor banao.", teacher:"T001" },
    ],
    STU002: [
      { date:"2026-03-10", subject:"Mathematics", note:"Exercises 5.1 to 5.3 complete karo.", teacher:"T002" },
    ],
    STU003: [],
    STU004: [
      { date:"2026-03-09", subject:"Science", note:"Chapter 3 yaad karo. MCQs practice karo.", teacher:"T001" },
    ],
  },
  syllabus: {
    STU001: [
      { subject:"Mathematics", totalChapters:7, doneChapters:5, lastTopic:"Quadratic Equations", teacher:"T002" },
      { subject:"Science", totalChapters:6, doneChapters:3, lastTopic:"Chemical Reactions", teacher:"T001" },
      { subject:"English", totalChapters:10, doneChapters:8, lastTopic:"Essay Writing", teacher:"T003" },
      { subject:"Urdu", totalChapters:10, doneChapters:6, lastTopic:"Ghazal — Iqbal", teacher:"T003" },
      { subject:"Islamiat", totalChapters:10, doneChapters:9, lastTopic:"Seerat-un-Nabi", teacher:"T002" },
    ],
    STU002: [
      { subject:"Mathematics", totalChapters:7, doneChapters:4, lastTopic:"Linear Equations", teacher:"T002" },
      { subject:"English", totalChapters:10, doneChapters:6, lastTopic:"Comprehension", teacher:"T003" },
    ],
    STU003: [
      { subject:"English", totalChapters:10, doneChapters:9, lastTopic:"Grammar", teacher:"T003" },
    ],
    STU004: [
      { subject:"Science", totalChapters:8, doneChapters:5, lastTopic:"Forces & Motion", teacher:"T001" },
    ],
  },
  timetable: {
    "10-A": {
      Monday:    ["Mathematics","English","-","Science","Urdu","Islamiat"],
      Tuesday:   ["Science","Mathematics","-","English","Computer","Urdu"],
      Wednesday: ["English","Urdu","-","Mathematics","Islamiat","Science"],
      Thursday:  ["Islamiat","Science","-","Urdu","Mathematics","English"],
      Friday:    ["Quran","Mathematics","-","Science","English","Sports"],
      Saturday:  ["Computer","English","-","Mathematics","Science","Urdu"],
    },
    "10-B": {
      Monday:    ["Science","Mathematics","-","English","Urdu","Computer"],
      Tuesday:   ["Mathematics","Urdu","-","Science","English","Islamiat"],
      Wednesday: ["English","Science","-","Urdu","Mathematics","Computer"],
      Thursday:  ["Urdu","English","-","Mathematics","Science","Islamiat"],
      Friday:    ["Quran","Science","-","Mathematics","English","Sports"],
      Saturday:  ["Islamiat","Mathematics","-","Science","Urdu","English"],
    },
    "9-A": {
      Monday:    ["Physics","Chemistry","-","Biology","Mathematics","English"],
      Tuesday:   ["Mathematics","Physics","-","Chemistry","English","Urdu"],
      Wednesday: ["Biology","Mathematics","-","Physics","Urdu","Chemistry"],
      Thursday:  ["English","Biology","-","Mathematics","Chemistry","Physics"],
      Friday:    ["Quran","Mathematics","-","Physics","Chemistry","Sports"],
      Saturday:  ["Urdu","English","-","Biology","Mathematics","Physics"],
    },
  },
  progress: {
    STU001: { attendance:92, testAvg:88, rank:1, remarks:"Excellent student. Keep it up!", grade:"A+" },
    STU002: { attendance:85, testAvg:75, rank:4, remarks:"Good effort. Maths improve karo.", grade:"B+" },
    STU003: { attendance:97, testAvg:91, rank:1, remarks:"Outstanding performance!", grade:"A+" },
    STU004: { attendance:80, testAvg:70, rank:3, remarks:"Regular rehain aur mehnat karo.", grade:"B" },
  },
};

// ─── STYLES ──────────────────────────────────────────────────────
const S = {
  app: { fontFamily:"'Segoe UI',sans-serif", background:"#0d1117", minHeight:"100vh", color:"#e6edf3", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" },
  phone: { width:390, minHeight:760, background:"#161b22", borderRadius:44, overflow:"hidden", position:"relative", boxShadow:"0 40px 80px rgba(0,0,0,.7),0 0 0 1px rgba(255,255,255,.07)", border:"2px solid rgba(255,255,255,.06)", display:"flex", flexDirection:"column" },
  screen: { flex:1, overflowY:"auto", overflowX:"hidden", scrollbarWidth:"none" },
  statusBar: { background:"#161b22", padding:"12px 24px 8px", display:"flex", justifyContent:"space-between", fontSize:12, fontWeight:700, position:"sticky", top:0, zIndex:100 },
  // colors
  blue:"#4f8ef7", purple:"#7c3aed", green:"#10b981", gold:"#f59e0b", red:"#ef4444", teal:"#06b6d4",
  surface:"#21262d", surface2:"#2d333b", border:"rgba(79,142,247,.15)",
  muted:"#8b949e",
};

const PERIODS = ["8:00","9:00","10:00","Break","11:30","12:30","1:30"];
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

// ─── HELPERS ─────────────────────────────────────────────────────
const pill = (txt, bg, color) => (
  <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20, background:bg, color }}>{txt}</span>
);
const card = (children, extra={}) => (
  <div style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:16, padding:16, marginBottom:10, ...extra }}>{children}</div>
);
const sectionTitle = (t) => (
  <div style={{ fontWeight:800, fontSize:15, marginBottom:12, color:"#e6edf3" }}>{t}</div>
);
const progressBar = (pct, color=S.blue) => (
  <div style={{ height:6, background:S.surface2, borderRadius:20, overflow:"hidden", margin:"6px 0" }}>
    <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${color},${S.purple})`, borderRadius:20, transition:"width .5s" }}/>
  </div>
);
const input = (props) => (
  <input {...props} style={{ width:"100%", padding:"11px 14px", background:S.surface2, border:`1px solid ${S.border}`, borderRadius:10, color:"#e6edf3", fontSize:14, outline:"none", marginBottom:10, fontFamily:"inherit", boxSizing:"border-box", ...props.style }}/>
);
const select = (props) => (
  <select {...props} style={{ width:"100%", padding:"11px 14px", background:S.surface2, border:`1px solid ${S.border}`, borderRadius:10, color:"#e6edf3", fontSize:14, outline:"none", marginBottom:10, fontFamily:"inherit", cursor:"pointer", boxSizing:"border-box" }}/>
);
const btn = (label, onClick, color=S.blue, extra={}) => (
  <button onClick={onClick} style={{ width:"100%", padding:"13px", background:color, border:"none", borderRadius:12, color:"white", fontWeight:800, fontSize:14, cursor:"pointer", marginTop:4, fontFamily:"inherit", ...extra }}>{label}</button>
);

// ─── MAIN APP ─────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState(INIT);
  const [user, setUser] = useState(null); // { role, id }
  const [tab, setTab] = useState("home");
  const [toast, setToast] = useState("");
  const [loginRole, setLoginRole] = useState("student");
  const [loginId, setLoginId] = useState("");
  const [loginPass, setLoginPass] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(""),2500); };

  const doLogin = () => {
    if (loginRole === "admin") {
      if (loginId === "admin" && loginPass === "admin123") { setUser({ role:"admin", id:"admin" }); setTab("dashboard"); return; }
      return showToast("❌ Admin credentials galat hain");
    }
    if (loginRole === "teacher") {
      const t = data.teachers.find(t => t.id === loginId && t.password === loginPass);
      if (t) { setUser({ role:"teacher", id:t.id }); setTab("home"); return; }
      return showToast("❌ Teacher ID ya password galat hai");
    }
    if (loginRole === "student") {
      const s = data.students.find(s => s.id === loginId && s.password === loginPass);
      if (s) { setUser({ role:"student", id:s.id }); setTab("home"); return; }
      return showToast("❌ Student ID ya password galat hai");
    }
  };

  const logout = () => { setUser(null); setLoginId(""); setLoginPass(""); setTab("home"); };

  const update = (patch) => setData(d => ({ ...d, ...patch }));

  return (
    <div style={S.app}>
      <div style={S.phone}>
        {/* Status Bar */}
        <div style={S.statusBar}>
          <span>9:41</span>
          <span style={{ fontSize:16 }}>🎓</span>
          <span>▲▲▲ 🔋</span>
        </div>

        {/* Toast */}
        {toast && (
          <div style={{ position:"absolute", top:52, left:"50%", transform:"translateX(-50%)", background:toast.startsWith("❌")?S.red:S.green, color:"white", padding:"8px 20px", borderRadius:30, fontSize:12, fontWeight:700, zIndex:200, whiteSpace:"nowrap", boxShadow:"0 4px 20px rgba(0,0,0,.4)" }}>
            {toast}
          </div>
        )}

        <div style={S.screen}>
          {!user && <LoginScreen role={loginRole} setRole={setLoginRole} id={loginId} setId={setLoginId} pass={loginPass} setPass={setLoginPass} onLogin={doLogin} />}
          {user?.role === "student" && <StudentPortal data={data} update={update} user={user} tab={tab} setTab={setTab} logout={logout} showToast={showToast} />}
          {user?.role === "teacher" && <TeacherPortal data={data} update={update} user={user} tab={tab} setTab={setTab} logout={logout} showToast={showToast} />}
          {user?.role === "admin" && <AdminPortal data={data} update={update} user={user} tab={tab} setTab={setTab} logout={logout} showToast={showToast} />}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// LOGIN
// ══════════════════════════════════════════════════════════════
function LoginScreen({ role, setRole, id, setId, pass, setPass, onLogin }) {
  const roles = [{ v:"student", l:"👨‍🎓 Student" },{ v:"teacher", l:"👩‍🏫 Teacher" },{ v:"admin", l:"🛡 Admin" }];
  const demos = { student:["STU001","ahmad123"], teacher:["T001","sana123"], admin:["admin","admin123"] };
  return (
    <div>
      <div style={{ background:"linear-gradient(135deg,#0f1e3d,#1a0a2e)", padding:"50px 28px 40px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-60, left:"50%", transform:"translateX(-50%)", width:240, height:240, background:"radial-gradient(circle,rgba(79,142,247,.25),transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ width:76, height:76, background:"linear-gradient(135deg,#4f8ef7,#7c3aed)", borderRadius:22, margin:"0 auto 18px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:34, boxShadow:"0 16px 40px rgba(79,142,247,.4)" }}>🎓</div>
        <div style={{ fontWeight:900, fontSize:26, letterSpacing:-0.5 }}>School Portal</div>
        <div style={{ color:S.muted, marginTop:6, fontSize:13 }}>Apna role select karein aur login karein</div>
      </div>

      {/* Role tabs */}
      <div style={{ display:"flex", margin:"20px 20px 0", background:S.surface2, borderRadius:14, padding:4, gap:2 }}>
        {roles.map(r => (
          <button key={r.v} onClick={()=>setRole(r.v)} style={{ flex:1, padding:"9px 4px", border:"none", borderRadius:10, background:role===r.v?"linear-gradient(135deg,#4f8ef7,#7c3aed)":"none", color:role===r.v?"white":S.muted, fontWeight:700, fontSize:11, cursor:"pointer", fontFamily:"inherit", transition:"all .2s" }}>{r.l}</button>
        ))}
      </div>

      <div style={{ padding:"20px 20px" }}>
        {input({ placeholder:`${role.charAt(0).toUpperCase()+role.slice(1)} ID`, value:id, onChange:e=>setId(e.target.value) })}
        {input({ placeholder:"Password", type:"password", value:pass, onChange:e=>setPass(e.target.value) })}
        {btn("Login →", onLogin, "linear-gradient(135deg,#4f8ef7,#7c3aed)")}
        <div style={{ textAlign:"center", marginTop:12, fontSize:12, color:S.muted }}>
          Demo:{" "}
          <span onClick={()=>{ setRole("student"); setId("STU001"); setPass("ahmad123"); }} style={{ color:S.blue, cursor:"pointer" }}>Student</span>
          {" | "}
          <span onClick={()=>{ setRole("teacher"); setId("T001"); setPass("sana123"); }} style={{ color:S.green, cursor:"pointer" }}>Teacher</span>
          {" | "}
          <span onClick={()=>{ setRole("admin"); setId("admin"); setPass("admin123"); }} style={{ color:S.gold, cursor:"pointer" }}>Admin</span>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// STUDENT PORTAL
// ══════════════════════════════════════════════════════════════
function StudentPortal({ data, user, tab, setTab, logout, showToast }) {
  const stu = data.students.find(s => s.id === user.id);
  const fees = data.fees[user.id] || [];
  const diary = data.diary[user.id] || [];
  const syllabus = data.syllabus[user.id] || [];
  const progress = data.progress[user.id] || {};
  const tt = data.timetable[stu.class] || {};

  const totalFee = fees.reduce((a,f)=>a+f.amount,0);
  const paidFee = fees.filter(f=>f.paid).reduce((a,f)=>a+f.amount,0);
  const unpaidFee = totalFee - paidFee;

  const tabs = [
    { v:"home", icon:"🏠", label:"Home" },
    { v:"fees", icon:"💰", label:"Fees" },
    { v:"diary", icon:"📓", label:"Diary" },
    { v:"syllabus", icon:"📚", label:"Syllabus" },
    { v:"timetable", icon:"🗓", label:"Time" },
    { v:"progress", icon:"📊", label:"Progress" },
    { v:"profile", icon:"👤", label:"Profile" },
  ];

  return (
    <div style={{ paddingBottom:80 }}>
      {/* Top bar */}
      <div style={{ padding:"16px 20px 12px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontWeight:900, fontSize:20 }}>👋 Hello, {stu.name.split(" ")[0]}!</div>
          <div style={{ fontSize:12, color:S.muted }}>Class {stu.class} · Roll #{stu.rollNo}</div>
        </div>
        <div style={{ width:40, height:40, borderRadius:13, background:"linear-gradient(135deg,#4f8ef7,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, cursor:"pointer" }} onClick={()=>setTab("profile")}>🧑</div>
      </div>

      {/* HOME */}
      {tab === "home" && (
        <div style={{ padding:"0 16px" }}>
          {/* ID Card */}
          <div style={{ background:"linear-gradient(135deg,#1e3a8a,#4f46e5,#7c3aed)", borderRadius:22, padding:22, marginBottom:16, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-30, right:-30, width:100, height:100, background:"rgba(255,255,255,.07)", borderRadius:"50%" }}/>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
              <div style={{ width:48, height:48, borderRadius:14, background:"rgba(255,255,255,.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🧑</div>
              <div>
                <div style={{ fontWeight:800, fontSize:17 }}>{stu.name}</div>
                <div style={{ fontSize:12, opacity:.7 }}>{user.id} · Class {stu.class}</div>
              </div>
            </div>
            <div style={{ display:"flex" }}>
              {[["Attendance",`${progress.attendance||0}%`],["Grade",progress.grade||"-"],["Rank",`#${progress.rank||"-"}`]].map(([l,v])=>(
                <div key={l} style={{ flex:1, textAlign:"center", borderRight:"1px solid rgba(255,255,255,.2)", padding:"0 8px" }}>
                  <div style={{ fontWeight:900, fontSize:19 }}>{v}</div>
                  <div style={{ fontSize:10, opacity:.65 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
            {[
              { icon:"💰", title:"Fee Status", val:`Rs ${unpaidFee.toLocaleString()} due`, color:unpaidFee>0?S.red:S.green, tab:"fees" },
              { icon:"📓", title:"Diary Notes", val:`${diary.length} entries`, color:S.blue, tab:"diary" },
              { icon:"📚", title:"Syllabus", val:`${syllabus.length} subjects`, color:S.purple, tab:"syllabus" },
              { icon:"📊", title:"Avg Score", val:`${progress.testAvg||0}%`, color:S.gold, tab:"progress" },
            ].map(item=>(
              <div key={item.title} onClick={()=>setTab(item.tab)} style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:18, padding:16, cursor:"pointer" }}>
                <div style={{ fontSize:24, marginBottom:8 }}>{item.icon}</div>
                <div style={{ fontSize:12, fontWeight:700 }}>{item.title}</div>
                <div style={{ fontSize:12, color:item.color, fontWeight:700, marginTop:3 }}>{item.val}</div>
              </div>
            ))}
          </div>

          {/* Latest diary */}
          {diary.length > 0 && (
            <>
              {sectionTitle("📓 Latest Diary")}
              {diary.slice(0,2).map((d,i) => (
                <div key={i} style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:14, padding:14, marginBottom:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontWeight:700, fontSize:13 }}>{d.subject}</span>
                    {pill(d.date, "rgba(79,142,247,.15)", S.blue)}
                  </div>
                  <div style={{ fontSize:13, color:"#94a3b8", lineHeight:1.5 }}>{d.note}</div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* FEES */}
      {tab === "fees" && (
        <div style={{ padding:"0 16px" }}>
          {/* Summary */}
          <div style={{ background:"linear-gradient(135deg,#064e3b,#065f46)", borderRadius:20, padding:20, marginBottom:16, border:`1px solid rgba(16,185,129,.2)` }}>
            <div style={{ fontWeight:800, fontSize:15, marginBottom:12 }}>💰 Fee Summary</div>
            <div style={{ display:"flex", gap:12 }}>
              {[["Total",`Rs ${totalFee.toLocaleString()}`,S.teal],["Paid",`Rs ${paidFee.toLocaleString()}`,S.green],["Unpaid",`Rs ${unpaidFee.toLocaleString()}`,unpaidFee>0?S.red:S.green]].map(([l,v,c])=>(
                <div key={l} style={{ flex:1, background:"rgba(0,0,0,.2)", borderRadius:12, padding:"10px 8px", textAlign:"center" }}>
                  <div style={{ fontWeight:900, fontSize:16, color:c }}>{v}</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,.6)", marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                <span style={{ color:"rgba(255,255,255,.6)" }}>Payment Progress</span>
                <span style={{ fontWeight:700, color:S.green }}>{totalFee>0?Math.round(paidFee/totalFee*100):0}%</span>
              </div>
              {progressBar(totalFee>0?paidFee/totalFee*100:0, S.green)}
            </div>
          </div>

          {sectionTitle("Monthly Breakdown")}
          {fees.map((f,i)=>(
            <div key={i} style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:14, padding:14, marginBottom:8, display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:f.paid?S.green:S.red, boxShadow:`0 0 8px ${f.paid?S.green:S.red}50`, flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:14 }}>{f.month}</div>
                <div style={{ fontSize:12, color:S.muted }}>{f.paid?`Paid: ${f.paidDate}`:"Not Paid"}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontWeight:800, fontSize:15 }}>Rs {f.amount.toLocaleString()}</div>
                {pill(f.paid?"Paid ✓":"Unpaid ✗", f.paid?"rgba(16,185,129,.15)":"rgba(239,68,68,.15)", f.paid?S.green:S.red)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DIARY */}
      {tab === "diary" && (
        <div style={{ padding:"0 16px" }}>
          {sectionTitle("📓 Daily Diary")}
          {diary.length===0 ? <div style={{ textAlign:"center", color:S.muted, padding:40 }}>Koi diary entry nahi hai</div> : diary.map((d,i)=>(
            <div key={i} style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:14, padding:14, marginBottom:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontWeight:800, fontSize:14 }}>{d.subject}</span>
                {pill(d.date, "rgba(79,142,247,.15)", S.blue)}
              </div>
              <div style={{ fontSize:13, color:"#94a3b8", lineHeight:1.6 }}>{d.note}</div>
            </div>
          ))}
        </div>
      )}

      {/* SYLLABUS */}
      {tab === "syllabus" && (
        <div style={{ padding:"0 16px" }}>
          {sectionTitle("📚 Syllabus Progress")}
          {syllabus.length===0 ? <div style={{ textAlign:"center", color:S.muted, padding:40 }}>Syllabus data nahi hai</div> : syllabus.map((s,i)=>{
            const pct = Math.round(s.doneChapters/s.totalChapters*100);
            return (
              <div key={i} style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:16, padding:16, marginBottom:10 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                  <div style={{ fontWeight:800, fontSize:14 }}>{s.subject}</div>
                  <span style={{ fontWeight:900, color:pct>=80?S.green:pct>=50?S.gold:S.red, fontSize:14 }}>{pct}%</span>
                </div>
                {progressBar(pct, pct>=80?S.green:pct>=50?S.gold:S.red)}
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:S.muted, marginTop:4 }}>
                  <span>{s.doneChapters}/{s.totalChapters} chapters</span>
                  <span>Last: {s.lastTopic}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TIMETABLE */}
      {tab === "timetable" && (
        <div style={{ padding:"0 16px" }}>
          {sectionTitle(`🗓 Timetable — Class ${stu.class}`)}
          {DAYS.map(day => {
            const periods = tt[day] || [];
            return (
              <div key={day} style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:14, padding:14, marginBottom:8 }}>
                <div style={{ fontWeight:800, fontSize:13, marginBottom:10, color:S.blue }}>{day}</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                  {periods.map((p,i)=>(
                    <div key={i} style={{ flex:"0 0 calc(33.33% - 4px)", background:p==="-"?"rgba(255,255,255,.03)":S.surface2, borderRadius:8, padding:"6px 4px", textAlign:"center" }}>
                      <div style={{ fontSize:9, color:S.muted }}>{PERIODS[i]}</div>
                      <div style={{ fontSize:11, fontWeight:700, marginTop:2, color:p==="-"?S.muted:"#e6edf3" }}>{p==="-"?"Break":p}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PROGRESS */}
      {tab === "progress" && (
        <div style={{ padding:"0 16px" }}>
          <div style={{ background:"linear-gradient(135deg,#1e1b4b,#312e81)", borderRadius:20, padding:20, marginBottom:16, textAlign:"center" }}>
            <div style={{ fontSize:40, fontWeight:900, color:S.gold }}>{progress.grade||"-"}</div>
            <div style={{ fontSize:14, color:"rgba(255,255,255,.7)", marginTop:4 }}>Overall Grade</div>
            <div style={{ marginTop:12, fontSize:13, color:"rgba(255,255,255,.8)", fontStyle:"italic" }}>"{progress.remarks}"</div>
          </div>
          {[["📊 Attendance",progress.attendance||0,S.green],["📝 Test Average",progress.testAvg||0,S.blue]].map(([l,v,c])=>(
            <div key={l} style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:14, padding:14, marginBottom:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontWeight:700, fontSize:14 }}>{l}</span>
                <span style={{ fontWeight:900, color:c, fontSize:16 }}>{v}%</span>
              </div>
              {progressBar(v, c)}
            </div>
          ))}
          <div style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:14, padding:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontWeight:700 }}>Class Rank</span>
              <span style={{ fontWeight:900, color:S.gold, fontSize:18 }}>#{progress.rank||"-"}</span>
            </div>
          </div>
        </div>
      )}

      {/* PROFILE */}
      {tab === "profile" && (
        <div style={{ padding:"0 16px" }}>
          <div style={{ textAlign:"center", padding:"24px 0 16px" }}>
            <div style={{ width:70, height:70, borderRadius:22, background:"linear-gradient(135deg,#4f8ef7,#7c3aed)", margin:"0 auto 12px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, boxShadow:"0 12px 30px rgba(79,142,247,.35)" }}>🧑</div>
            <div style={{ fontWeight:900, fontSize:20 }}>{stu.name}</div>
            <div style={{ color:S.muted, fontSize:13, marginTop:4 }}>Class {stu.class} · {user.id}</div>
          </div>
          {[["Roll No",stu.rollNo],["Father's Name",stu.father],["Phone",stu.phone],["Date of Birth",stu.dob],["Address",stu.address]].map(([k,v])=>(
            <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"13px 0", borderBottom:`1px solid ${S.border}` }}>
              <span style={{ color:S.muted, fontSize:13 }}>{k}</span>
              <span style={{ fontWeight:600, fontSize:14 }}>{v}</span>
            </div>
          ))}
          <div onClick={logout} style={{ display:"flex", justifyContent:"space-between", padding:"14px 0", cursor:"pointer", color:S.red }}>
            <span style={{ fontWeight:700 }}>🚪 Logout</span>
            <span>→</span>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:390, background:"rgba(22,27,34,.97)", backdropFilter:"blur(20px)", borderTop:`1px solid ${S.border}`, display:"flex", zIndex:100, padding:"8px 0 16px" }}>
        {tabs.map(t=>(
          <button key={t.v} onClick={()=>setTab(t.v)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2, border:"none", background:"none", color:tab===t.v?S.blue:S.muted, cursor:"pointer", padding:"4px 0", fontFamily:"inherit" }}>
            <span style={{ fontSize:18 }}>{t.icon}</span>
            <span style={{ fontSize:9, fontWeight:700 }}>{t.label}</span>
            {tab===t.v && <div style={{ width:4, height:4, borderRadius:"50%", background:S.blue }}/>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TEACHER PORTAL
// ══════════════════════════════════════════════════════════════
function TeacherPortal({ data, update, user, tab, setTab, logout, showToast }) {
  const teacher = data.teachers.find(t => t.id === user.id);
  const myStudents = data.students.filter(s => teacher.classes.includes(s.class));
  const [selStu, setSelStu] = useState("");
  const [diaryNote, setDiaryNote] = useState({ subject:"", note:"" });
  const [feeForm, setFeeForm] = useState({ month:"", amount:"", paid:"false" });
  const [sylForm, setSylForm] = useState({ subject:"", done:"", total:"", topic:"" });
  const [progressForm, setProgressForm] = useState({ attendance:"", testAvg:"", grade:"", remarks:"" });

  const addDiary = () => {
    if (!selStu||!diaryNote.subject||!diaryNote.note) return showToast("❌ Sab fields bharein");
    const newDiary = { date:new Date().toISOString().slice(0,10), subject:diaryNote.subject, note:diaryNote.note, teacher:user.id };
    update({ diary: { ...data.diary, [selStu]:[newDiary,...(data.diary[selStu]||[])] } });
    setDiaryNote({ subject:"", note:"" }); showToast("✅ Diary entry add ho gai!");
  };

  const updateFee = () => {
    if (!selStu||!feeForm.month||!feeForm.amount) return showToast("❌ Sab fields bharein");
    const existing = data.fees[selStu]||[];
    const idx = existing.findIndex(f=>f.month===feeForm.month);
    const entry = { month:feeForm.month, amount:parseInt(feeForm.amount), paid:feeForm.paid==="true", paidDate:feeForm.paid==="true"?new Date().toISOString().slice(0,10):null };
    const updated = idx>=0 ? existing.map((f,i)=>i===idx?entry:f) : [...existing, entry];
    update({ fees:{ ...data.fees, [selStu]:updated } });
    setFeeForm({ month:"", amount:"", paid:"false" }); showToast("✅ Fee record update ho gaya!");
  };

  const updateSyllabus = () => {
    if (!selStu||!sylForm.subject||!sylForm.done||!sylForm.total) return showToast("❌ Sab fields bharein");
    const existing = data.syllabus[selStu]||[];
    const idx = existing.findIndex(s=>s.subject===sylForm.subject);
    const entry = { subject:sylForm.subject, doneChapters:parseInt(sylForm.done), totalChapters:parseInt(sylForm.total), lastTopic:sylForm.topic, teacher:user.id };
    const updated = idx>=0 ? existing.map((s,i)=>i===idx?entry:s) : [...existing, entry];
    update({ syllabus:{ ...data.syllabus, [selStu]:updated } });
    setSylForm({ subject:"",done:"",total:"",topic:"" }); showToast("✅ Syllabus update ho gaya!");
  };

  const updateProgress = () => {
    if (!selStu) return showToast("❌ Student select karein");
    const existing = data.progress[selStu]||{};
    const entry = { attendance:parseInt(progressForm.attendance)||existing.attendance, testAvg:parseInt(progressForm.testAvg)||existing.testAvg, rank:existing.rank, grade:progressForm.grade||existing.grade, remarks:progressForm.remarks||existing.remarks };
    update({ progress:{ ...data.progress, [selStu]:entry } });
    setProgressForm({ attendance:"",testAvg:"",grade:"",remarks:"" }); showToast("✅ Progress update ho gai!");
  };

  const tabs = [
    { v:"home", icon:"🏠", label:"Home" },
    { v:"diary", icon:"📓", label:"Diary" },
    { v:"fees", icon:"💰", label:"Fees" },
    { v:"syllabus", icon:"📚", label:"Syllabus" },
    { v:"progress", icon:"📊", label:"Progress" },
    { v:"profile", icon:"👤", label:"Profile" },
  ];

  return (
    <div style={{ paddingBottom:80 }}>
      <div style={{ padding:"16px 20px 12px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontWeight:900, fontSize:20 }}>👩‍🏫 {teacher.name}</div>
          <div style={{ fontSize:12, color:S.muted }}>{teacher.subject} Teacher</div>
        </div>
        <div style={{ width:40, height:40, borderRadius:13, background:"linear-gradient(135deg,#065f46,#10b981)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, cursor:"pointer" }} onClick={()=>setTab("profile")}>👩‍🏫</div>
      </div>

      {/* Student selector (sticky) */}
      {tab !== "home" && tab !== "profile" && (
        <div style={{ padding:"0 16px 8px" }}>
          <select value={selStu} onChange={e=>setSelStu(e.target.value)} style={{ width:"100%", padding:"11px 14px", background:S.surface2, border:`1px solid ${S.blue}`, borderRadius:10, color:"#e6edf3", fontSize:14, outline:"none", fontFamily:"inherit", cursor:"pointer", boxSizing:"border-box" }}>
            <option value="">👨‍🎓 Student Select Karein</option>
            {myStudents.map(s=><option key={s.id} value={s.id}>{s.name} — Class {s.class}</option>)}
          </select>
        </div>
      )}

      {/* HOME */}
      {tab === "home" && (
        <div style={{ padding:"0 16px" }}>
          <div style={{ background:"linear-gradient(135deg,#064e3b,#065f46)", borderRadius:20, padding:20, marginBottom:16, border:`1px solid rgba(16,185,129,.2)` }}>
            <div style={{ fontWeight:800, fontSize:16, marginBottom:4 }}>{teacher.name}</div>
            <div style={{ fontSize:13, opacity:.7, marginBottom:16 }}>{teacher.subject} · {teacher.classes.join(", ")}</div>
            <div style={{ display:"flex", gap:12 }}>
              {[["Students",myStudents.length],["Classes",teacher.classes.length],["Salary",`Rs ${(teacher.salary/1000).toFixed(0)}k`]].map(([l,v])=>(
                <div key={l} style={{ flex:1, background:"rgba(0,0,0,.2)", borderRadius:10, padding:"10px 8px", textAlign:"center" }}>
                  <div style={{ fontWeight:900, fontSize:16, color:S.green }}>{v}</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,.6)" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {sectionTitle("My Students")}
          {myStudents.map(s=>(
            <div key={s.id} style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:14, padding:14, marginBottom:8, display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:S.surface2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🧑</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:14 }}>{s.name}</div>
                <div style={{ fontSize:12, color:S.muted }}>{s.id} · Class {s.class}</div>
              </div>
              {pill(`Grade ${data.progress[s.id]?.grade||"-"}`, "rgba(79,142,247,.15)", S.blue)}
            </div>
          ))}
        </div>
      )}

      {/* DIARY */}
      {tab === "diary" && (
        <div style={{ padding:"0 16px" }}>
          {sectionTitle("📓 Diary Entry Add Karein")}
          <div style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:16, padding:16, marginBottom:16 }}>
            {select({ value:diaryNote.subject, onChange:e=>setDiaryNote({...diaryNote,subject:e.target.value}), children:<><option value="">Subject Select Karein</option>{data.subjects.map(s=><option key={s}>{s}</option>)}</> })}
            <textarea value={diaryNote.note} onChange={e=>setDiaryNote({...diaryNote,note:e.target.value})} placeholder="Diary note likhein..." style={{ width:"100%", padding:"11px 14px", background:S.surface2, border:`1px solid ${S.border}`, borderRadius:10, color:"#e6edf3", fontSize:14, outline:"none", marginBottom:10, fontFamily:"inherit", resize:"none", height:80, boxSizing:"border-box" }}/>
            {btn("+ Diary Entry Add Karein", addDiary, S.blue)}
          </div>

          {selStu && (
            <>
              {sectionTitle(`${data.students.find(s=>s.id===selStu)?.name} ki Diary`)}
              {(data.diary[selStu]||[]).map((d,i)=>(
                <div key={i} style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:14, padding:14, marginBottom:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontWeight:700 }}>{d.subject}</span>
                    {pill(d.date, "rgba(79,142,247,.15)", S.blue)}
                  </div>
                  <div style={{ fontSize:13, color:"#94a3b8" }}>{d.note}</div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* FEES */}
      {tab === "fees" && (
        <div style={{ padding:"0 16px" }}>
          {sectionTitle("💰 Fee Record Update Karein")}
          <div style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:16, padding:16, marginBottom:16 }}>
            {input({ placeholder:"Month (e.g. April 2026)", value:feeForm.month, onChange:e=>setFeeForm({...feeForm,month:e.target.value}) })}
            {input({ placeholder:"Amount (e.g. 4500)", type:"number", value:feeForm.amount, onChange:e=>setFeeForm({...feeForm,amount:e.target.value}) })}
            {select({ value:feeForm.paid, onChange:e=>setFeeForm({...feeForm,paid:e.target.value}), children:<><option value="false">Unpaid</option><option value="true">Paid</option></> })}
            {btn("+ Fee Update Karein", updateFee, S.gold)}
          </div>

          {selStu && (
            <>
              {sectionTitle(`${data.students.find(s=>s.id===selStu)?.name} ki Fees`)}
              {(data.fees[selStu]||[]).map((f,i)=>(
                <div key={i} style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:14, padding:14, marginBottom:8, display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:f.paid?S.green:S.red, flexShrink:0 }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:13 }}>{f.month}</div>
                    <div style={{ fontSize:12, color:S.muted }}>{f.paid?`Paid: ${f.paidDate}`:"Unpaid"}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontWeight:800 }}>Rs {f.amount.toLocaleString()}</div>
                    {pill(f.paid?"Paid":"Unpaid", f.paid?"rgba(16,185,129,.15)":"rgba(239,68,68,.15)", f.paid?S.green:S.red)}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* SYLLABUS */}
      {tab === "syllabus" && (
        <div style={{ padding:"0 16px" }}>
          {sectionTitle("📚 Syllabus Update Karein")}
          <div style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:16, padding:16, marginBottom:16 }}>
            {select({ value:sylForm.subject, onChange:e=>setSylForm({...sylForm,subject:e.target.value}), children:<><option value="">Subject Select Karein</option>{data.subjects.map(s=><option key={s}>{s}</option>)}</> })}
            <div style={{ display:"flex", gap:8 }}>
              {input({ placeholder:"Done Chapters", type:"number", value:sylForm.done, onChange:e=>setSylForm({...sylForm,done:e.target.value}), style:{flex:1} })}
              {input({ placeholder:"Total Chapters", type:"number", value:sylForm.total, onChange:e=>setSylForm({...sylForm,total:e.target.value}), style:{flex:1} })}
            </div>
            {input({ placeholder:"Last Topic (e.g. Quadratic Equations)", value:sylForm.topic, onChange:e=>setSylForm({...sylForm,topic:e.target.value}) })}
            {btn("+ Syllabus Update Karein", updateSyllabus, S.purple)}
          </div>
        </div>
      )}

      {/* PROGRESS */}
      {tab === "progress" && (
        <div style={{ padding:"0 16px" }}>
          {sectionTitle("📊 Student Progress Update")}
          <div style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:16, padding:16, marginBottom:16 }}>
            {input({ placeholder:"Attendance % (e.g. 92)", type:"number", value:progressForm.attendance, onChange:e=>setProgressForm({...progressForm,attendance:e.target.value}) })}
            {input({ placeholder:"Test Average % (e.g. 85)", type:"number", value:progressForm.testAvg, onChange:e=>setProgressForm({...progressForm,testAvg:e.target.value}) })}
            {select({ value:progressForm.grade, onChange:e=>setProgressForm({...progressForm,grade:e.target.value}), children:<><option value="">Grade Select Karein</option>{["A+","A","B+","B","C+","C","D","F"].map(g=><option key={g}>{g}</option>)}</> })}
            <textarea value={progressForm.remarks} onChange={e=>setProgressForm({...progressForm,remarks:e.target.value})} placeholder="Remarks likhein..." style={{ width:"100%", padding:"11px 14px", background:S.surface2, border:`1px solid ${S.border}`, borderRadius:10, color:"#e6edf3", fontSize:14, outline:"none", marginBottom:10, fontFamily:"inherit", resize:"none", height:70, boxSizing:"border-box" }}/>
            {btn("+ Progress Update Karein", updateProgress, S.green)}
          </div>

          {selStu && data.progress[selStu] && (() => {
            const p = data.progress[selStu];
            return (
              <>
                {sectionTitle("Current Progress")}
                {[["Attendance",p.attendance+"%",S.green],["Test Average",p.testAvg+"%",S.blue],["Grade",p.grade,S.gold],["Rank","#"+p.rank,S.purple]].map(([k,v,c])=>(
                  <div key={k} style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:12, padding:14, marginBottom:8, display:"flex", justifyContent:"space-between" }}>
                    <span style={{ color:S.muted }}>{k}</span>
                    <span style={{ fontWeight:800, color:c }}>{v}</span>
                  </div>
                ))}
                <div style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:12, padding:14 }}>
                  <div style={{ color:S.muted, marginBottom:4, fontSize:12 }}>Remarks</div>
                  <div style={{ fontSize:13, fontStyle:"italic", color:"#94a3b8" }}>"{p.remarks}"</div>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* PROFILE */}
      {tab === "profile" && (
        <div style={{ padding:"0 16px" }}>
          <div style={{ textAlign:"center", padding:"24px 0 16px" }}>
            <div style={{ width:70, height:70, borderRadius:22, background:"linear-gradient(135deg,#065f46,#10b981)", margin:"0 auto 12px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32 }}>👩‍🏫</div>
            <div style={{ fontWeight:900, fontSize:20 }}>{teacher.name}</div>
            <div style={{ color:S.muted, fontSize:13, marginTop:4 }}>{teacher.subject} Teacher · {teacher.id}</div>
          </div>
          {[["Joining Date",teacher.joining],["Monthly Salary",`Rs ${teacher.salary.toLocaleString()}`],["Phone",teacher.phone],["Classes",teacher.classes.join(", ")],["Address",teacher.address]].map(([k,v])=>(
            <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"13px 0", borderBottom:`1px solid ${S.border}` }}>
              <span style={{ color:S.muted, fontSize:13 }}>{k}</span>
              <span style={{ fontWeight:600, fontSize:14 }}>{v}</span>
            </div>
          ))}
          <div onClick={logout} style={{ display:"flex", justifyContent:"space-between", padding:"14px 0", cursor:"pointer", color:S.red }}>
            <span style={{ fontWeight:700 }}>🚪 Logout</span><span>→</span>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:390, background:"rgba(22,27,34,.97)", backdropFilter:"blur(20px)", borderTop:`1px solid ${S.border}`, display:"flex", zIndex:100, padding:"8px 0 16px" }}>
        {tabs.map(t=>(
          <button key={t.v} onClick={()=>setTab(t.v)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2, border:"none", background:"none", color:tab===t.v?S.green:S.muted, cursor:"pointer", padding:"4px 0", fontFamily:"inherit" }}>
            <span style={{ fontSize:18 }}>{t.icon}</span>
            <span style={{ fontSize:9, fontWeight:700 }}>{t.label}</span>
            {tab===t.v && <div style={{ width:4, height:4, borderRadius:"50%", background:S.green }}/>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ADMIN PORTAL
// ══════════════════════════════════════════════════════════════
function AdminPortal({ data, update, user, tab, setTab, logout, showToast }) {
  const [aTab, setATab] = useState("dashboard");
  const [newStu, setNewStu] = useState({ id:"",name:"",password:"",class:"",father:"",phone:"",dob:"",address:"",rollNo:"" });
  const [newTch, setNewTch] = useState({ id:"",name:"",password:"",subject:"",joining:"",salary:"",phone:"",address:"",classes:"" });
  const [ttClass, setTtClass] = useState("10-A");
  const [ttDay, setTtDay] = useState("Monday");
  const [ttPeriods, setTtPeriods] = useState(["","","","-","","",""]);

  const totalFeeAll = Object.values(data.fees).flat();
  const totalCollected = totalFeeAll.filter(f=>f.paid).reduce((a,f)=>a+f.amount,0);
  const totalPending = totalFeeAll.filter(f=>!f.paid).reduce((a,f)=>a+f.amount,0);

  const addStudent = () => {
    if (!newStu.id||!newStu.name||!newStu.password||!newStu.class) return showToast("❌ ID, Name, Password & Class zaroor likhein");
    if (data.students.find(s=>s.id===newStu.id)) return showToast("❌ Yeh ID pehle se exist karta hai");
    update({ students:[...data.students, newStu] });
    setNewStu({ id:"",name:"",password:"",class:"",father:"",phone:"",dob:"",address:"",rollNo:"" });
    showToast("✅ Student add ho gaya!");
  };

  const addTeacher = () => {
    if (!newTch.id||!newTch.name||!newTch.password||!newTch.subject) return showToast("❌ ID, Name, Password & Subject zaroor likhein");
    if (data.teachers.find(t=>t.id===newTch.id)) return showToast("❌ Yeh ID pehle se exist karta hai");
    update({ teachers:[...data.teachers, { ...newTch, salary:parseInt(newTch.salary)||0, classes:newTch.classes.split(",").map(c=>c.trim()).filter(Boolean) }] });
    setNewTch({ id:"",name:"",password:"",subject:"",joining:"",salary:"",phone:"",address:"",classes:"" });
    showToast("✅ Teacher add ho gaya!");
  };

  const saveTimetable = () => {
    const existing = data.timetable[ttClass]||{};
    update({ timetable:{ ...data.timetable, [ttClass]:{ ...existing, [ttDay]:ttPeriods } } });
    showToast("✅ Timetable save ho gaya!");
  };

  const deleteStu = (id) => { if (!window.confirm("Delete karein?")) return; update({ students:data.students.filter(s=>s.id!==id) }); showToast("✅ Student delete ho gaya"); };
  const deleteTch = (id) => { if (!window.confirm("Delete karein?")) return; update({ teachers:data.teachers.filter(t=>t.id!==id) }); showToast("✅ Teacher delete ho gaya"); };

  const adminTabs = [
    { v:"dashboard", icon:"📊", label:"Dashboard" },
    { v:"students", icon:"👨‍🎓", label:"Students" },
    { v:"teachers", icon:"👩‍🏫", label:"Teachers" },
    { v:"timetable", icon:"🗓", label:"Timetable" },
    { v:"fees", icon:"💰", label:"Fees" },
  ];

  return (
    <div style={{ paddingBottom:80 }}>
      <div style={{ padding:"16px 20px 12px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontWeight:900, fontSize:20 }}>🛡 Admin Panel</div>
          <div style={{ fontSize:12, color:S.muted }}>Full Access Mode</div>
        </div>
        <div onClick={logout} style={{ background:"rgba(239,68,68,.15)", border:`1px solid ${S.red}`, borderRadius:10, padding:"6px 14px", color:S.red, fontSize:12, fontWeight:700, cursor:"pointer" }}>Logout</div>
      </div>

      {/* DASHBOARD */}
      {aTab === "dashboard" && (
        <div style={{ padding:"0 16px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
            {[
              { icon:"👨‍🎓", label:"Total Students", val:data.students.length, color:S.blue },
              { icon:"👩‍🏫", label:"Total Teachers", val:data.teachers.length, color:S.green },
              { icon:"✅ Rs", label:"Fee Collected", val:`${(totalCollected/1000).toFixed(1)}k`, color:S.gold },
              { icon:"⏳ Rs", label:"Fee Pending", val:`${(totalPending/1000).toFixed(1)}k`, color:S.red },
            ].map(item=>(
              <div key={item.label} style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:18, padding:16 }}>
                <div style={{ fontSize:22, marginBottom:8 }}>{item.icon}</div>
                <div style={{ fontWeight:900, fontSize:20, color:item.color }}>{item.val}</div>
                <div style={{ fontSize:11, color:S.muted, marginTop:3 }}>{item.label}</div>
              </div>
            ))}
          </div>

          {sectionTitle("Classes Overview")}
          {data.classes.slice(0,6).map(cls=>{
            const stus = data.students.filter(s=>s.class===cls);
            return (
              <div key={cls} style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:12, padding:"12px 14px", marginBottom:8, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ fontWeight:700 }}>Class {cls}</span>
                {pill(`${stus.length} Students`, "rgba(79,142,247,.15)", S.blue)}
              </div>
            );
          })}
        </div>
      )}

      {/* STUDENTS */}
      {aTab === "students" && (
        <div style={{ padding:"0 16px" }}>
          {sectionTitle("👨‍🎓 New Student Add Karein")}
          <div style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:16, padding:16, marginBottom:16 }}>
            <div style={{ display:"flex", gap:8 }}>
              {input({ placeholder:"Student ID (e.g. STU005)", value:newStu.id, onChange:e=>setNewStu({...newStu,id:e.target.value}), style:{flex:1} })}
              {input({ placeholder:"Roll No", value:newStu.rollNo, onChange:e=>setNewStu({...newStu,rollNo:e.target.value}), style:{flex:1,width:"auto"} })}
            </div>
            {input({ placeholder:"Full Name", value:newStu.name, onChange:e=>setNewStu({...newStu,name:e.target.value}) })}
            {input({ placeholder:"Password", value:newStu.password, onChange:e=>setNewStu({...newStu,password:e.target.value}) })}
            {select({ value:newStu.class, onChange:e=>setNewStu({...newStu,class:e.target.value}), children:<><option value="">Class Select Karein</option>{data.classes.map(c=><option key={c}>{c}</option>)}</> })}
            {input({ placeholder:"Father's Name", value:newStu.father, onChange:e=>setNewStu({...newStu,father:e.target.value}) })}
            {input({ placeholder:"Phone", value:newStu.phone, onChange:e=>setNewStu({...newStu,phone:e.target.value}) })}
            {input({ placeholder:"Date of Birth (YYYY-MM-DD)", value:newStu.dob, onChange:e=>setNewStu({...newStu,dob:e.target.value}) })}
            {input({ placeholder:"Address", value:newStu.address, onChange:e=>setNewStu({...newStu,address:e.target.value}) })}
            {btn("+ Student Add Karein", addStudent, S.blue)}
          </div>

          {sectionTitle(`All Students (${data.students.length})`)}
          {data.students.map(s=>(
            <div key={s.id} style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:14, padding:14, marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:38, height:38, borderRadius:11, background:S.surface2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>🧑</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14 }}>{s.name}</div>
                  <div style={{ fontSize:12, color:S.muted }}>{s.id} · Class {s.class} · Roll #{s.rollNo}</div>
                </div>
                <button onClick={()=>deleteStu(s.id)} style={{ background:"rgba(239,68,68,.15)", border:`1px solid ${S.red}`, color:S.red, borderRadius:8, padding:"4px 10px", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>Del</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TEACHERS */}
      {aTab === "teachers" && (
        <div style={{ padding:"0 16px" }}>
          {sectionTitle("👩‍🏫 New Teacher Add Karein")}
          <div style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:16, padding:16, marginBottom:16 }}>
            {input({ placeholder:"Teacher ID (e.g. T004)", value:newTch.id, onChange:e=>setNewTch({...newTch,id:e.target.value}) })}
            {input({ placeholder:"Full Name", value:newTch.name, onChange:e=>setNewTch({...newTch,name:e.target.value}) })}
            {input({ placeholder:"Password", value:newTch.password, onChange:e=>setNewTch({...newTch,password:e.target.value}) })}
            {select({ value:newTch.subject, onChange:e=>setNewTch({...newTch,subject:e.target.value}), children:<><option value="">Subject Select Karein</option>{data.subjects.map(s=><option key={s}>{s}</option>)}</> })}
            {input({ placeholder:"Joining Date (YYYY-MM-DD)", value:newTch.joining, onChange:e=>setNewTch({...newTch,joining:e.target.value}) })}
            {input({ placeholder:"Monthly Salary (e.g. 45000)", type:"number", value:newTch.salary, onChange:e=>setNewTch({...newTch,salary:e.target.value}) })}
            {input({ placeholder:"Phone", value:newTch.phone, onChange:e=>setNewTch({...newTch,phone:e.target.value}) })}
            {input({ placeholder:"Address", value:newTch.address, onChange:e=>setNewTch({...newTch,address:e.target.value}) })}
            {input({ placeholder:"Classes (comma separated: 9-A,10-A)", value:newTch.classes, onChange:e=>setNewTch({...newTch,classes:e.target.value}) })}
            {btn("+ Teacher Add Karein", addTeacher, S.green)}
          </div>

          {sectionTitle(`All Teachers (${data.teachers.length})`)}
          {data.teachers.map(t=>(
            <div key={t.id} style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:14, padding:14, marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:38, height:38, borderRadius:11, background:"rgba(16,185,129,.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>👩‍🏫</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14 }}>{t.name}</div>
                  <div style={{ fontSize:12, color:S.muted }}>{t.id} · {t.subject} · Rs {t.salary.toLocaleString()}</div>
                  <div style={{ fontSize:11, color:S.muted, marginTop:2 }}>Classes: {t.classes.join(", ")}</div>
                </div>
                <button onClick={()=>deleteTch(t.id)} style={{ background:"rgba(239,68,68,.15)", border:`1px solid ${S.red}`, color:S.red, borderRadius:8, padding:"4px 10px", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>Del</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TIMETABLE ADMIN */}
      {aTab === "timetable" && (
        <div style={{ padding:"0 16px" }}>
          {sectionTitle("🗓 Timetable Manage Karein")}
          <div style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:16, padding:16, marginBottom:16 }}>
            <div style={{ display:"flex", gap:8, marginBottom:10 }}>
              {select({ value:ttClass, onChange:e=>setTtClass(e.target.value), style:{flex:1,marginBottom:0}, children:<>{data.classes.map(c=><option key={c}>{c}</option>)}</> })}
              {select({ value:ttDay, onChange:e=>setTtDay(e.target.value), style:{flex:1,marginBottom:0}, children:<>{DAYS.map(d=><option key={d}>{d}</option>)}</> })}
            </div>
            <div style={{ marginTop:10 }}>
              {PERIODS.map((p,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <span style={{ fontSize:11, color:S.muted, width:40, flexShrink:0 }}>{p}</span>
                  {p==="-" ? (
                    <div style={{ flex:1, background:S.surface2, borderRadius:8, padding:"8px 12px", fontSize:12, color:S.muted }}>— Break —</div>
                  ) : (
                    select({ value:ttPeriods[i]||"", onChange:e=>{const a=[...ttPeriods]; a[i]=e.target.value; setTtPeriods(a);}, style:{flex:1,marginBottom:0,fontSize:12}, children:<><option value="">— Subject —</option>{data.subjects.map(s=><option key={s}>{s}</option>)}</> })
                  )}
                </div>
              ))}
            </div>
            {btn("💾 Timetable Save Karein", saveTimetable, S.purple)}
          </div>

          {sectionTitle(`Class ${ttClass} — ${ttDay} Preview`)}
          {(data.timetable[ttClass]?.[ttDay]||[]).map((p,i)=>(
            <div key={i} style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:10, padding:"10px 14px", marginBottom:6, display:"flex", gap:12 }}>
              <span style={{ color:S.muted, fontSize:12, width:40 }}>{PERIODS[i]}</span>
              <span style={{ fontSize:13, fontWeight:p==="-"?400:700, color:p==="-"?S.muted:"#e6edf3" }}>{p==="-"?"Break":p}</span>
            </div>
          ))}
        </div>
      )}

      {/* FEES ADMIN */}
      {aTab === "fees" && (
        <div style={{ padding:"0 16px" }}>
          <div style={{ background:"linear-gradient(135deg,#1c1003,#451a03)", borderRadius:20, padding:20, marginBottom:16, border:`1px solid rgba(245,158,11,.2)` }}>
            <div style={{ fontWeight:800, fontSize:15, marginBottom:12 }}>💰 Overall Fee Summary</div>
            <div style={{ display:"flex", gap:10 }}>
              {[["Collected",`Rs ${totalCollected.toLocaleString()}`,S.green],["Pending",`Rs ${totalPending.toLocaleString()}`,S.red]].map(([l,v,c])=>(
                <div key={l} style={{ flex:1, background:"rgba(0,0,0,.3)", borderRadius:12, padding:"12px 8px", textAlign:"center" }}>
                  <div style={{ fontWeight:900, fontSize:16, color:c }}>{v}</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,.5)", marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:12 }}>
              {progressBar(totalCollected+totalPending>0?totalCollected/(totalCollected+totalPending)*100:0, S.green)}
              <div style={{ fontSize:11, color:"rgba(255,255,255,.5)", textAlign:"right", marginTop:4 }}>
                {totalCollected+totalPending>0?Math.round(totalCollected/(totalCollected+totalPending)*100):0}% collected
              </div>
            </div>
          </div>

          {sectionTitle("Student-wise Fee Status")}
          {data.students.map(s=>{
            const fees = data.fees[s.id]||[];
            const paid = fees.filter(f=>f.paid).reduce((a,f)=>a+f.amount,0);
            const total = fees.reduce((a,f)=>a+f.amount,0);
            const unpaid = total-paid;
            return (
              <div key={s.id} style={{ background:S.surface, border:`1px solid ${S.border}`, borderRadius:14, padding:14, marginBottom:8 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:13 }}>{s.name}</div>
                    <div style={{ fontSize:11, color:S.muted }}>Class {s.class}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    {pill(unpaid>0?`Rs ${unpaid.toLocaleString()} due`:"All Clear ✓", unpaid>0?"rgba(239,68,68,.15)":"rgba(16,185,129,.15)", unpaid>0?S.red:S.green)}
                  </div>
                </div>
                {progressBar(total>0?paid/total*100:0, S.green)}
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:S.muted, marginTop:4 }}>
                  <span>Paid: Rs {paid.toLocaleString()}</span>
                  <span>Total: Rs {total.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Nav */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:390, background:"rgba(22,27,34,.97)", backdropFilter:"blur(20px)", borderTop:`1px solid ${S.border}`, display:"flex", zIndex:100, padding:"8px 0 16px" }}>
        {adminTabs.map(t=>(
          <button key={t.v} onClick={()=>setATab(t.v)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2, border:"none", background:"none", color:aTab===t.v?S.gold:S.muted, cursor:"pointer", padding:"4px 0", fontFamily:"inherit" }}>
            <span style={{ fontSize:18 }}>{t.icon}</span>
            <span style={{ fontSize:9, fontWeight:700 }}>{t.label}</span>
            {aTab===t.v && <div style={{ width:4, height:4, borderRadius:"50%", background:S.gold }}/>}
          </button>
        ))}
      </div>
    </div>
  );
}

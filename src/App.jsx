import { useState, useEffect, useCallback } from "react";

// ── PALETTE ──
const P = {
  birch:"#F5EFE6",mist:"#E8E0D5",moss:"#8A9E8C",dusk:"#6B7F8E",
  charcoal:"#2E3338",cream:"#FBF8F4",sage:"#B5C4B1",warm:"#C4A882",
  dustyrose:"#C4A0A0",rose:"#D4A5A0",sky:"#8AAEBE",lavender:"#B0A8C8",peach:"#E8C4A8",
};

// ── STATIC DATA ──
const DEFAULT_HABITS = [
  {id:1,icon:"🌿",title:"Morning stillness",subtitle:"5 min — no phone",category:"mind",lagomNote:"Not too much, not too little."},
  {id:2,icon:"💧",title:"Drink water",subtitle:"First thing, every morning",category:"body",lagomNote:"Simple. Enough."},
  {id:3,icon:"🚶",title:"Slow walk",subtitle:"10–20 min outside",category:"body",lagomNote:"No destination needed."},
  {id:4,icon:"📋",title:"Write 3 priorities",subtitle:"One small list, nothing more",category:"mind",lagomNote:"Clarity over quantity."},
  {id:5,icon:"🕯️",title:"Evening wind-down",subtitle:"Dim lights at 9 PM",category:"rest",lagomNote:"Signal rest to your body."},
  {id:6,icon:"🍽️",title:"Eat without screens",subtitle:"Just one meal a day",category:"body",lagomNote:"Presence as nourishment."},
];
const HABIT_CATEGORIES = ["all","mind","body","rest"];

const ROOMS = [
  {id:"bathroom",label:"Bathroom",icon:"🚿"},
  {id:"kitchen",label:"Kitchen",icon:"🍳"},
  {id:"living",label:"Living room",icon:"🛋️"},
  {id:"bedroom",label:"Bedroom",icon:"🛏️"},
];
const TIDY_PROMPTS = {
  bathroom:[
    {id:"b1",icon:"🧴",task:"Pick up 3 things from the floor",note:"Just 3. That's enough."},
    {id:"b2",icon:"🪥",task:"Clear the sink counter",note:"One surface at a time."},
    {id:"b3",icon:"🪣",task:"Put away anything that doesn't belong here",note:"Each thing has a home."},
    {id:"b4",icon:"🧻",task:"Replace the toilet roll if it's low",note:"Small act, big relief."},
    {id:"b5",icon:"🪞",task:"Wipe down the mirror",note:"Clarity outside, clarity inside."},
    {id:"b6",icon:"🗑️",task:"Empty the bin if it's full",note:"Let go of what's done."},
  ],
  kitchen:[
    {id:"k1",icon:"🍽️",task:"Clear one surface — just one",note:"Not everything. Just one."},
    {id:"k2",icon:"🧽",task:"Wipe the stovetop",note:"Two minutes, total reset."},
    {id:"k3",icon:"🥡",task:"Remove anything expired from the fridge",note:"Make space for what nourishes."},
    {id:"k4",icon:"🫙",task:"Put away 5 items sitting out",note:"Count them. Feel each one."},
    {id:"k5",icon:"🪣",task:"Empty the sink of dishes",note:"A clear sink changes the room."},
    {id:"k6",icon:"🛍️",task:"Deal with bags or clutter by the door",note:"The entrance sets the tone."},
  ],
  living:[
    {id:"l1",icon:"📦",task:"Pick up 3 things from the floor",note:"Just 3. Start there."},
    {id:"l2",icon:"🛋️",task:"Fluff and straighten cushions",note:"Softness needs tending."},
    {id:"l3",icon:"📚",task:"Stack or return any books or magazines",note:"Give them a place to rest."},
    {id:"l4",icon:"🧸",task:"Clear the coffee table completely",note:"One bare surface opens a room."},
    {id:"l5",icon:"🎧",task:"Coil any loose cables or chargers",note:"Order in the small things."},
    {id:"l6",icon:"🗑️",task:"Collect glasses, cups, wrappers to the kitchen",note:"Return what wandered."},
    {id:"l7",icon:"🪴",task:"Water any plants if they need it",note:"Life responds to attention."},
  ],
  bedroom:[
    {id:"bd1",icon:"🛏️",task:"Make the bed — even just pull the covers up",note:"An unmade bed made is a day begun."},
    {id:"bd2",icon:"👕",task:"Pick up clothes from the floor",note:"Fold or hang — just off the floor."},
    {id:"bd3",icon:"💡",task:"Clear your bedside table",note:"The last thing you see matters."},
    {id:"bd4",icon:"🪟",task:"Open the window or curtains for 5 minutes",note:"Let the room breathe."},
    {id:"bd5",icon:"📱",task:"Put chargers and cables away neatly",note:"A calm bedroom is a calm mind."},
    {id:"bd6",icon:"👗",task:"Return anything from the chair or floor to its place",note:"The chair is not a wardrobe."},
  ],
};

const DEFAULT_ADMIN_CATEGORIES = [
  {id:"bills",label:"Bills & Money",icon:"💳",color:P.moss},
  {id:"jobs",label:"Job & Career",icon:"💼",color:P.dusk},
  {id:"health",label:"Health",icon:"🩺",color:P.rose},
  {id:"home",label:"Home & Legal",icon:"🏠",color:P.warm},
  {id:"errands",label:"Errands",icon:"🛒",color:P.sage},
  {id:"other",label:"Other",icon:"📌",color:P.dustyrose},
];
const DEFAULT_ADMIN_TASKS = [
  {id:"a1",title:"Pay electricity bill",category:"bills",priority:"high",due:"",done:false,note:"Check auto-pay is set up."},
  {id:"a2",title:"Review bank statement",category:"bills",priority:"medium",due:"",done:false,note:""},
  {id:"a3",title:"Update CV / résumé",category:"jobs",priority:"high",due:"",done:false,note:"One page. Just enough."},
  {id:"a4",title:"Apply for one job today",category:"jobs",priority:"high",due:"",done:false,note:"One application done is progress."},
  {id:"a5",title:"Book GP / doctor appointment",category:"health",priority:"medium",due:"",done:false,note:""},
  {id:"a6",title:"Renew any prescriptions",category:"health",priority:"medium",due:"",done:false,note:""},
  {id:"a7",title:"Check home insurance renewal",category:"home",priority:"low",due:"",done:false,note:""},
  {id:"a8",title:"Pick up dry cleaning",category:"errands",priority:"low",due:"",done:false,note:""},
];
const PRIORITY_COLORS = {high:"#C4A0A0",medium:P.warm,low:P.sage};
const PRIORITY_LABELS = {high:"Urgent",medium:"Soon",low:"Whenever"};

const DEFAULT_PEOPLE = [
  {id:"p1",name:"Mum",icon:"👩",type:"call",note:"She loves hearing from you.",lastContact:""},
  {id:"p2",name:"Dad",icon:"👨",type:"call",note:"Even 5 minutes matters.",lastContact:""},
  {id:"p3",name:"Best friend",icon:"🤝",type:"text",note:"Return that message.",lastContact:""},
  {id:"p4",name:"Old friend",icon:"💌",type:"text",note:"You've been meaning to reach out.",lastContact:""},
];
const DEFAULT_WELLNESS = [
  {id:"w1",icon:"🧘",title:"5-minute breathing",subtitle:"Box breath — in 4, hold 4, out 4"},
  {id:"w2",icon:"📓",title:"Write one feeling down",subtitle:"Name it to tame it"},
  {id:"w3",icon:"🌤️",title:"Step outside for air",subtitle:"Even the doorstep counts"},
  {id:"w4",icon:"🎵",title:"Play a song you love",subtitle:"Let music move through you"},
  {id:"w5",icon:"🤲",title:"Notice 3 good things",subtitle:"Small joys. They're there."},
  {id:"w6",icon:"📵",title:"Phone-free 20 minutes",subtitle:"Just be. No scrolling."},
];
const CONTACT_TYPES = [
  {id:"call",label:"Call",icon:"📞"},
  {id:"text",label:"Text",icon:"💬"},
  {id:"visit",label:"Visit",icon:"🚗"},
  {id:"voice",label:"Voice note",icon:"🎙️"},
];
const MOOD_OPTIONS = [
  {value:5,label:"Flourishing",emoji:"🌸"},
  {value:4,label:"Good",emoji:"🌿"},
  {value:3,label:"Okay",emoji:"🌤️"},
  {value:2,label:"Low",emoji:"🌧️"},
  {value:1,label:"Struggling",emoji:"🌑"},
];
const LAGOM_QUOTES = [
  "Lagom: just the right amount.",
  "Not too much. Not too little. Just so.",
  "Calm is not the absence of doing — it's the absence of overdoing.",
  "A small habit done consistently is worth more than a perfect habit done once.",
  "The nervous system rests when life becomes predictable and gentle.",
  "A tidy space is not a perfect space — it is a breathing space.",
  "Life admin done quietly is a gift to your future self.",
  "Connection doesn't require the perfect words — just the reaching out.",
];

// ── TIERS ──
// Each tab is unlocked progressively. today+habits are always on.
const ALL_TABS = [
  {id:"today",label:"Today",icon:"☀️",tier:1,desc:"Your daily anchor"},
  {id:"habits",label:"Habits",icon:"🌿",tier:1,desc:"Gentle daily practices"},
  {id:"tidy",label:"Tidy",icon:"🧹",tier:2,desc:"Calm your physical space"},
  {id:"admin",label:"Admin",icon:"📋",tier:2,desc:"Life tasks, one at a time"},
  {id:"connect",label:"Connect",icon:"🤝",tier:3,desc:"People & mental wellness"},
  {id:"reflect",label:"Reflect",icon:"🕯️",tier:3,desc:"End-of-day stillness"},
];

// ── ONBOARDING SCREENS ──
const ONBOARDING = [
  {
    step:1,icon:"🌿",
    title:"Welcome to Lagom",
    body:"A Swedish word for 'just the right amount.' This app helps you build calm, simple routines — without overwhelm.",
    cta:"Let's begin",
  },
  {
    step:2,icon:"☀️",
    title:"Start with one focus",
    body:"You don't have to do everything at once. Pick the area of your life you most want to bring calm to — you can unlock more sections when you're ready.",
    cta:"Choose my focus",
  },
  {
    step:3,icon:"✦",
    title:"You're all set",
    body:"Your app is ready. Start small. Show up gently. The rest will follow.",
    cta:"Open my Lagom",
  },
];

const FOCUS_OPTIONS = [
  {id:"habits",icon:"🌿",label:"Daily habits",desc:"Build gentle morning and evening routines",unlocks:["today","habits"]},
  {id:"space",icon:"🧹",label:"My space",desc:"Declutter and calm your home one room at a time",unlocks:["today","habits","tidy"]},
  {id:"life",icon:"📋",label:"Life admin",desc:"Get on top of bills, health, errands",unlocks:["today","habits","admin"]},
  {id:"all",icon:"✦",label:"All of it",desc:"I need help across the board — give me everything",unlocks:["today","habits","tidy","admin","connect","reflect"]},
];

// ── UTILS ──
function uid(){return Math.random().toString(36).slice(2,8);}
function load(key,fallback){try{const v=localStorage.getItem(key);return v?JSON.parse(v):fallback;}catch{return fallback;}}
function save(key,val){try{localStorage.setItem(key,JSON.stringify(val));}catch{}}
function todayStr(){return new Date().toLocaleDateString("sv-SE");}

// ── WEEK GRID ──
function WeekGrid({habitId,history}){
  const days=[];
  for(let i=6;i>=0;i--){
    const d=new Date();d.setDate(d.getDate()-i);
    const key=d.toLocaleDateString("sv-SE");
    const done=history[habitId]?.[key];
    const isToday=i===0;
    days.push(
      <div key={key} style={{
        width:28,height:28,borderRadius:6,
        background:done?P.moss:P.mist,
        border:`1.5px solid ${isToday?P.dusk:"transparent"}`,
        display:"flex",alignItems:"center",justifyContent:"center",
      }}>
        {done&&<span style={{color:"white",fontSize:10}}>✓</span>}
      </div>
    );
  }
  return(
    <div style={{display:"flex",gap:4,marginTop:8}}>
      {days}
      <div style={{display:"flex",alignItems:"center",marginLeft:4,fontSize:10,color:P.dusk}}>7d</div>
    </div>
  );
}

// ── NUDGE BANNER ──
function NudgeBanner({unlockedTabs,onUnlock,daysActive}){
  const nextTier2=unlockedTabs.length===2&&daysActive>=2;
  const nextTier3=unlockedTabs.length>=4&&daysActive>=5;
  if(!nextTier2&&!nextTier3)return null;

  const isT2=nextTier2;
  const label=isT2?"Ready to tidy & organise?":"Ready to connect & reflect?";
  const sub=isT2?"You've built a daily rhythm. Unlock Tidy + Admin when you're ready.":"You're doing well. Unlock Connect + Reflect to go deeper.";
  const tier=isT2?2:3;

  return(
    <div style={{margin:"0 0 16px",padding:"13px 16px",background:P.birch,border:`1px dashed ${P.moss}`,borderRadius:12,display:"flex",alignItems:"center",gap:12}}>
      <div style={{fontSize:22}}>🌱</div>
      <div style={{flex:1}}>
        <div style={{fontSize:13,fontWeight:500,color:P.charcoal}}>{label}</div>
        <div style={{fontSize:11,color:P.dusk,marginTop:2,lineHeight:1.5}}>{sub}</div>
      </div>
      <button onClick={()=>onUnlock(tier)} style={{padding:"7px 12px",background:P.moss,color:"white",border:"none",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontSize:12,whiteSpace:"nowrap"}}>
        Unlock →
      </button>
    </div>
  );
}

// ════════════════════════════════════════
export default function LagomApp(){
  // ── ONBOARDING & TIER STATE ──
  const [onboardStep,setOnboardStep]     = useState(()=>load("lagom_onboarded",false)?99:1);
  const [focusChoice,setFocusChoice]     = useState(null);
  const [unlockedTabs,setUnlockedTabs]   = useState(()=>load("lagom_unlocked",["today","habits"]));
  const [firstOpenDate]                  = useState(()=>{
    const d=load("lagom_first_open","");
    if(!d){save("lagom_first_open",todayStr());return todayStr();}
    return d;
  });

  const daysActive = Math.max(0,Math.round((new Date()-new Date(firstOpenDate))/(1000*60*60*24)));

  const unlockTier = (tier) => {
    const tabs = ALL_TABS.filter(t=>t.tier<=tier).map(t=>t.id);
    setUnlockedTabs(tabs);
    save("lagom_unlocked",tabs);
  };

  // ── APP STATE (all persisted) ──
  const [quoteIndex,setQuoteIndex]       = useState(0);
  const [view,setView]                   = useState("today");

  // Habits + 7-day history
  const [completed,setCompleted]         = useState(()=>load("lagom_completed_"+todayStr(),{}));
  const [habitHistory,setHabitHistory]   = useState(()=>load("lagom_habit_history",{}));
  const [filter,setFilter]               = useState("all");
  const [streak,setStreak]               = useState(()=>load("lagom_streak",0));

  // Reflect
  const [reflection,setReflection]       = useState("");
  const [savedReflections,setSavedReflections] = useState(()=>load("lagom_reflections",[]));

  // Tidy
  const [activeRoom,setActiveRoom]       = useState("living");
  const [tidyDone,setTidyDone]           = useState(()=>load("lagom_tidy_"+todayStr(),{}));
  const [tidyMode,setTidyMode]           = useState("browse");
  const [sessionTasks,setSessionTasks]   = useState([]);
  const [sessionIndex,setSessionIndex]   = useState(0);
  const [sessionComplete,setSessionComplete] = useState(false);

  // Admin
  const [adminTasks,setAdminTasks]       = useState(()=>load("lagom_admin_tasks",DEFAULT_ADMIN_TASKS));
  const [adminCategories,setAdminCategories] = useState(()=>load("lagom_admin_cats",DEFAULT_ADMIN_CATEGORIES));
  const [adminFilter,setAdminFilter]     = useState("all");
  const [adminSubview,setAdminSubview]   = useState("tasks");
  const [showAddTask,setShowAddTask]     = useState(false);
  const [newTask,setNewTask]             = useState({title:"",category:"bills",priority:"medium",due:"",note:""});
  const [editingTask,setEditingTask]     = useState(null);
  const [newCatLabel,setNewCatLabel]     = useState("");
  const [newCatIcon,setNewCatIcon]       = useState("📌");
  const [editingCat,setEditingCat]       = useState(null);

  // Connect
  const [people,setPeople]               = useState(()=>load("lagom_people",DEFAULT_PEOPLE));
  const [wellnessDone,setWellnessDone]   = useState(()=>load("lagom_wellness_"+todayStr(),{}));
  const [connectSubview,setConnectSubview] = useState("people");
  const [todayMood,setTodayMood]         = useState(()=>load("lagom_mood_"+todayStr(),null));
  const [moodLog,setMoodLog]             = useState(()=>load("lagom_mood_log",[]));
  const [showAddPerson,setShowAddPerson] = useState(false);
  const [newPerson,setNewPerson]         = useState({name:"",icon:"🙂",type:"call",note:""});
  const [editingPerson,setEditingPerson] = useState(null);
  const [contactedToday,setContactedToday] = useState(()=>load("lagom_contacted_"+todayStr(),{}));

  // ── PERSISTENCE EFFECTS ──
  useEffect(()=>{save("lagom_completed_"+todayStr(),completed);},[completed]);
  useEffect(()=>{save("lagom_habit_history",habitHistory);},[habitHistory]);
  useEffect(()=>{save("lagom_tidy_"+todayStr(),tidyDone);},[tidyDone]);
  useEffect(()=>{save("lagom_admin_tasks",adminTasks);},[adminTasks]);
  useEffect(()=>{save("lagom_admin_cats",adminCategories);},[adminCategories]);
  useEffect(()=>{save("lagom_people",people);},[people]);
  useEffect(()=>{save("lagom_wellness_"+todayStr(),wellnessDone);},[wellnessDone]);
  useEffect(()=>{save("lagom_mood_"+todayStr(),todayMood);},[todayMood]);
  useEffect(()=>{save("lagom_mood_log",moodLog);},[moodLog]);
  useEffect(()=>{save("lagom_contacted_"+todayStr(),contactedToday);},[contactedToday]);
  useEffect(()=>{save("lagom_reflections",savedReflections);},[savedReflections]);
  useEffect(()=>{save("lagom_streak",streak);},[streak]);

  // ── QUOTE ROTATION ──
  useEffect(()=>{
    const t=setInterval(()=>setQuoteIndex(i=>(i+1)%LAGOM_QUOTES.length),6000);
    return()=>clearInterval(t);
  },[]);

  // ── HABITS ──
  const toggleHabit=(id)=>{
    const wasOn=!!completed[id];
    const next={...completed,[id]:!wasOn};
    setCompleted(next);
    // update history
    const today=todayStr();
    setHabitHistory(h=>{
      const updated={...h,[id]:{...(h[id]||{}),[today]:!wasOn}};
      return updated;
    });
    // streak: count days all habits were completed
    const allDone=DEFAULT_HABITS.every(h=>next[h.id]);
    if(allDone){
      const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);
      const yStr=yesterday.toLocaleDateString("sv-SE");
      const yCompleted=load("lagom_completed_"+yStr,{});
      const yAllDone=DEFAULT_HABITS.every(h=>yCompleted[h.id]);
      setStreak(s=>yAllDone?s+1:1);
    }
  };
  const filtered  = filter==="all"?DEFAULT_HABITS:DEFAULT_HABITS.filter(h=>h.category===filter);
  const doneCount = DEFAULT_HABITS.filter(h=>completed[h.id]).length;
  const progress  = Math.round((doneCount/DEFAULT_HABITS.length)*100);

  // ── REFLECT ──
  const saveReflection=()=>{
    if(!reflection.trim())return;
    setSavedReflections(r=>[{text:reflection,date:todayStr()},...r]);
    setReflection("");
  };

  // ── TIDY ──
  const startSession=()=>{
    const prompts=TIDY_PROMPTS[activeRoom];
    const undone=prompts.filter(p=>!tidyDone[p.id]);
    const pool=undone.length>=3?undone:prompts;
    const shuffled=[...pool].sort(()=>Math.random()-0.5).slice(0,3);
    setSessionTasks(shuffled);setSessionIndex(0);setSessionComplete(false);setTidyMode("session");
  };
  const advanceSession=(id)=>{
    setTidyDone(c=>({...c,[id]:true}));
    if(sessionIndex+1>=sessionTasks.length)setSessionComplete(true);
    else setSessionIndex(i=>i+1);
  };
  const currentTask=sessionTasks[sessionIndex];
  const roomPrompts=TIDY_PROMPTS[activeRoom]||[];
  const roomDoneCount=roomPrompts.filter(p=>tidyDone[p.id]).length;

  // ── ADMIN ──
  const toggleAdminTask=(id)=>setAdminTasks(ts=>ts.map(t=>t.id===id?{...t,done:!t.done}:t));
  const deleteAdminTask=(id)=>setAdminTasks(ts=>ts.filter(t=>t.id!==id));
  const addAdminTask=()=>{
    if(!newTask.title.trim())return;
    setAdminTasks(ts=>[...ts,{...newTask,id:uid(),done:false}]);
    setNewTask({title:"",category:"bills",priority:"medium",due:"",note:""});
    setShowAddTask(false);
  };
  const saveEditTask=()=>{setAdminTasks(ts=>ts.map(t=>t.id===editingTask.id?editingTask:t));setEditingTask(null);};
  const visibleTasks=adminFilter==="all"?adminTasks:adminFilter==="done"?adminTasks.filter(t=>t.done):adminTasks.filter(t=>t.category===adminFilter&&!t.done);
  const urgentCount=adminTasks.filter(t=>!t.done&&t.priority==="high").length;
  const totalPending=adminTasks.filter(t=>!t.done).length;
  const addCategory=()=>{
    if(!newCatLabel.trim())return;
    setAdminCategories(cs=>[...cs,{id:uid(),label:newCatLabel,icon:newCatIcon,color:P.dusk}]);
    setNewCatLabel("");setNewCatIcon("📌");
  };
  const deleteCategory=(id)=>{setAdminCategories(cs=>cs.filter(c=>c.id!==id));setAdminTasks(ts=>ts.filter(t=>t.category!==id));};
  const saveCatEdit=()=>{setAdminCategories(cs=>cs.map(c=>c.id===editingCat.id?editingCat:c));setEditingCat(null);};
  const getCat=(id)=>adminCategories.find(c=>c.id===id)||{icon:"📌",label:id,color:P.dusk};

  // ── CONNECT ──
  const markContacted=(id)=>{
    setPeople(ps=>ps.map(p=>p.id===id?{...p,lastContact:todayStr()}:p));
    setContactedToday(c=>({...c,[id]:true}));
  };
  const deletePerson=(id)=>setPeople(ps=>ps.filter(p=>p.id!==id));
  const addPerson=()=>{
    if(!newPerson.name.trim())return;
    setPeople(ps=>[...ps,{...newPerson,id:uid(),lastContact:""}]);
    setNewPerson({name:"",icon:"🙂",type:"call",note:""});
    setShowAddPerson(false);
  };
  const savePersonEdit=()=>{setPeople(ps=>ps.map(p=>p.id===editingPerson.id?editingPerson:p));setEditingPerson(null);};
  const toggleWellness=(id)=>setWellnessDone(w=>({...w,[id]:!w[id]}));
  const logMood=(val)=>{
    setTodayMood(val);
    setMoodLog(l=>[{value:val,date:todayStr(),emoji:MOOD_OPTIONS.find(m=>m.value===val)?.emoji},...l.slice(0,6)]);
  };
  const contactedCount=Object.values(contactedToday).filter(Boolean).length;
  const wellnessCount=DEFAULT_WELLNESS.filter(w=>wellnessDone[w.id]).length;

  // ── ONBOARDING COMPLETE ──
  const finishOnboarding=()=>{
    save("lagom_onboarded",true);
    setOnboardStep(99);
  };

  const visibleTabIds=unlockedTabs;
  const visibleTabs=ALL_TABS.filter(t=>visibleTabIds.includes(t.id));

  // ════ ONBOARDING FLOW ════
  if(onboardStep<99){
    const screen=ONBOARDING[onboardStep-1];
    return(
      <div style={{minHeight:"100vh",background:P.cream,fontFamily:"'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif",color:P.charcoal,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 24px"}}>
        {/* Progress dots */}
        <div style={{display:"flex",gap:8,marginBottom:40}}>
          {ONBOARDING.map((_,i)=>(
            <div key={i} style={{width:i+1===onboardStep?24:8,height:8,borderRadius:4,background:i+1<=onboardStep?P.moss:P.mist,transition:"all 0.3s"}}/>
          ))}
        </div>

        <div style={{textAlign:"center",maxWidth:360}}>
          <div style={{fontSize:56,marginBottom:20}}>{screen.icon}</div>
          <h2 style={{fontSize:24,fontWeight:400,margin:"0 0 14px",letterSpacing:"-0.02em"}}>{screen.title}</h2>
          <p style={{fontSize:14,color:P.dusk,lineHeight:1.75,margin:"0 0 32px"}}>{screen.body}</p>

          {/* Step 2: Focus picker */}
          {onboardStep===2&&(
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24,textAlign:"left"}}>
              {FOCUS_OPTIONS.map(f=>(
                <button key={f.id} onClick={()=>setFocusChoice(f.id)} style={{
                  padding:"14px 16px",border:`1.5px solid ${focusChoice===f.id?P.moss:P.mist}`,
                  borderRadius:12,background:focusChoice===f.id?"#EFF4EE":P.birch,
                  cursor:"pointer",fontFamily:"inherit",textAlign:"left",
                  display:"flex",alignItems:"center",gap:12,
                }}>
                  <span style={{fontSize:22}}>{f.icon}</span>
                  <div>
                    <div style={{fontSize:14,fontWeight:500,color:focusChoice===f.id?P.moss:P.charcoal}}>{f.label}</div>
                    <div style={{fontSize:12,color:P.dusk,marginTop:2}}>{f.desc}</div>
                  </div>
                  {focusChoice===f.id&&<span style={{marginLeft:"auto",color:P.moss}}>✓</span>}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={()=>{
              if(onboardStep===2){
                if(!focusChoice)return;
                const chosen=FOCUS_OPTIONS.find(f=>f.id===focusChoice);
                setUnlockedTabs(chosen.unlocks);
                save("lagom_unlocked",chosen.unlocks);
                setOnboardStep(3);
              } else if(onboardStep===3){
                finishOnboarding();
              } else {
                setOnboardStep(s=>s+1);
              }
            }}
            disabled={onboardStep===2&&!focusChoice}
            style={{
              padding:"13px 32px",background:P.moss,color:"white",border:"none",
              borderRadius:10,cursor:onboardStep===2&&!focusChoice?"not-allowed":"pointer",
              fontFamily:"inherit",fontSize:15,opacity:onboardStep===2&&!focusChoice?0.5:1,
              letterSpacing:"0.02em",
            }}
          >
            {screen.cta}
          </button>

          {onboardStep<3&&(
            <div onClick={finishOnboarding} style={{marginTop:16,fontSize:12,color:P.dusk,cursor:"pointer",textDecoration:"underline",textUnderlineOffset:3}}>
              Skip — show me everything
            </div>
          )}
        </div>
      </div>
    );
  }

  // ════ MAIN APP ════
  return(
    <div style={{minHeight:"100vh",background:P.cream,fontFamily:"'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif",color:P.charcoal}}>

      {/* HEADER */}
      <header style={{background:P.birch,borderBottom:`1px solid ${P.mist}`,padding:"18px 20px 12px"}}>
        <div style={{maxWidth:520,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{fontSize:11,letterSpacing:"0.18em",color:P.dusk,textTransform:"uppercase",marginBottom:3}}>Lagom</div>
              <h1 style={{margin:0,fontSize:23,fontWeight:400,letterSpacing:"-0.02em"}}>Just enough.</h1>
            </div>
            <div style={{display:"flex",gap:6}}>
              {urgentCount>0&&(
                <div style={{background:P.rose,color:"white",borderRadius:10,padding:"6px 11px",fontSize:11,lineHeight:1.4,textAlign:"right"}}>
                  <div style={{fontSize:15,fontWeight:600}}>{urgentCount}</div>
                  <div style={{opacity:0.9}}>urgent</div>
                </div>
              )}
              <div style={{background:P.moss,color:"white",borderRadius:10,padding:"6px 11px",fontSize:11,lineHeight:1.4,textAlign:"right"}}>
                <div style={{fontSize:15,fontWeight:600}}>{streak}</div>
                <div style={{opacity:0.85}}>streak</div>
              </div>
            </div>
          </div>
          <div style={{marginTop:10,fontSize:12,color:P.dusk,fontStyle:"italic"}}>{LAGOM_QUOTES[quoteIndex]}</div>
        </div>
      </header>

      {/* NAV */}
      <nav style={{background:P.birch,padding:"0 14px 10px",borderBottom:`1px solid ${P.mist}`}}>
        <div style={{maxWidth:520,margin:"0 auto",display:"flex",gap:3}}>
          {visibleTabs.map(t=>(
            <button key={t.id} onClick={()=>setView(t.id)} style={{
              flex:1,padding:"6px 0",border:"none",borderRadius:7,cursor:"pointer",
              fontSize:10.5,fontFamily:"inherit",
              background:view===t.id?P.moss:"transparent",
              color:view===t.id?"white":P.dusk,transition:"all 0.2s",
            }}>{t.label}</button>
          ))}
          {/* Unlock more button if not all unlocked */}
          {unlockedTabs.length<ALL_TABS.length&&(
            <button onClick={()=>unlockTier(unlockedTabs.length<=2?2:3)} style={{
              padding:"6px 10px",border:`1px dashed ${P.mist}`,borderRadius:7,
              background:"transparent",color:P.dusk,cursor:"pointer",fontSize:10,fontFamily:"inherit",
            }}>＋</button>
          )}
        </div>
      </nav>

      <main style={{maxWidth:520,margin:"0 auto",padding:"20px 16px 60px"}}>

        {/* ── TODAY ── */}
        {view==="today"&&(
          <>
            {/* Nudge banner */}
            <NudgeBanner unlockedTabs={unlockedTabs} onUnlock={unlockTier} daysActive={daysActive}/>

            <div style={{marginBottom:22}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:P.dusk,marginBottom:7}}>
                <span>{doneCount} of {DEFAULT_HABITS.length} habits done</span><span>{progress}%</span>
              </div>
              <div style={{height:5,background:P.mist,borderRadius:4,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${progress}%`,background:P.moss,borderRadius:4,transition:"width 0.5s"}}/>
              </div>
              {progress===100&&<div style={{marginTop:9,fontSize:13,color:P.moss,fontStyle:"italic"}}>✦ Lagom achieved today. Rest now.</div>}
            </div>

            {/* Summary cards */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:18}}>
              {visibleTabIds.includes("admin")&&totalPending>0&&(
                <div onClick={()=>setView("admin")} style={{background:P.birch,border:`1px solid ${P.mist}`,borderRadius:11,padding:"12px 14px",cursor:"pointer"}}>
                  <div style={{fontSize:13,fontWeight:500}}>Life admin</div>
                  <div style={{fontSize:11,color:P.dusk,marginTop:3}}>{totalPending} pending{urgentCount>0&&` · ${urgentCount} urgent`}</div>
                </div>
              )}
              {visibleTabIds.includes("connect")&&people.length>0&&(
                <div onClick={()=>setView("connect")} style={{background:P.birch,border:`1px solid ${P.mist}`,borderRadius:11,padding:"12px 14px",cursor:"pointer"}}>
                  <div style={{fontSize:13,fontWeight:500}}>Connect</div>
                  <div style={{fontSize:11,color:P.dusk,marginTop:3}}>{contactedCount} reached · {people.length} people</div>
                </div>
              )}
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:9}}>
              {DEFAULT_HABITS.map(h=>(
                <HabitCard key={h.id} habit={h} done={!!completed[h.id]} onToggle={()=>toggleHabit(h.id)} history={habitHistory}/>
              ))}
            </div>
            <div style={{marginTop:22,padding:"13px 16px",background:P.mist,borderRadius:12,fontSize:13,color:P.dusk,lineHeight:1.65,fontStyle:"italic"}}>
              You don't have to do everything. Choose what's right for today — that's the Swedish way.
            </div>
          </>
        )}

        {/* ── HABITS ── */}
        {view==="habits"&&(
          <>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:18,fontWeight:400,marginBottom:4}}>Your habit library</div>
              <div style={{fontSize:13,color:P.dusk}}>Balanced, calm, sustainable.</div>
            </div>
            <div style={{display:"flex",gap:7,marginBottom:16,flexWrap:"wrap"}}>
              {HABIT_CATEGORIES.map(c=>(
                <button key={c} onClick={()=>setFilter(c)} style={{padding:"5px 13px",border:`1px solid ${filter===c?P.moss:P.mist}`,borderRadius:20,background:filter===c?P.moss:"transparent",color:filter===c?"white":P.dusk,fontSize:12,cursor:"pointer",fontFamily:"inherit",textTransform:"capitalize"}}>{c}</button>
              ))}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:9}}>
              {filtered.map(h=>(
                <div key={h.id} style={{background:P.birch,border:`1px solid ${P.mist}`,borderRadius:12,padding:"14px 16px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:7}}>
                    <span style={{fontSize:21}}>{h.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:500,fontSize:14}}>{h.title}</div>
                      <div style={{fontSize:12,color:P.dusk,marginTop:2}}>{h.subtitle}</div>
                    </div>
                    <span style={{fontSize:10,background:P.mist,color:P.dusk,padding:"2px 8px",borderRadius:10,textTransform:"capitalize"}}>{h.category}</span>
                  </div>
                  <div style={{fontSize:12,color:P.moss,fontStyle:"italic",paddingLeft:32}}>"{h.lagomNote}"</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── TIDY ── */}
        {view==="tidy"&&(
          <>
            <div style={{marginBottom:18}}>
              <div style={{fontSize:18,fontWeight:400,marginBottom:4}}>Tidy a space</div>
              <div style={{fontSize:13,color:P.dusk,lineHeight:1.6}}>Choose a room. Do one small thing. The room will be <em>better</em>.</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:20}}>
              {ROOMS.map(r=>{
                const prompts=TIDY_PROMPTS[r.id];
                const done=prompts.filter(p=>tidyDone[p.id]).length;
                const isActive=activeRoom===r.id;
                return(
                  <button key={r.id} onClick={()=>{setActiveRoom(r.id);setTidyMode("browse");}} style={{padding:"13px 14px",border:`1.5px solid ${isActive?P.moss:P.mist}`,borderRadius:12,background:isActive?"#EFF4EE":P.birch,cursor:"pointer",fontFamily:"inherit",textAlign:"left",transition:"all 0.2s"}}>
                    <div style={{fontSize:21,marginBottom:4}}>{r.icon}</div>
                    <div style={{fontSize:13,fontWeight:500,color:isActive?P.moss:P.charcoal}}>{r.label}</div>
                    <div style={{fontSize:11,color:P.dusk,marginTop:2}}>{done}/{prompts.length} tidied</div>
                    <div style={{height:3,background:P.mist,borderRadius:2,marginTop:7,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${Math.round(done/prompts.length*100)}%`,background:P.moss,borderRadius:2}}/>
                    </div>
                  </button>
                );
              })}
            </div>
            {tidyMode==="browse"&&(
              <>
                <div style={{background:P.moss,borderRadius:12,padding:"13px 16px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{color:"white",fontWeight:500,fontSize:13}}>Quick tidy session</div>
                    <div style={{color:"rgba(255,255,255,0.8)",fontSize:12,marginTop:2}}>3 tasks, one at a time.</div>
                  </div>
                  <button onClick={startSession} style={{background:"white",color:P.moss,border:"none",borderRadius:8,padding:"7px 13px",cursor:"pointer",fontFamily:"inherit",fontSize:13}}>Start →</button>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {roomPrompts.map(p=><TidyCard key={p.id} prompt={p} done={!!tidyDone[p.id]} onToggle={()=>setTidyDone(c=>({...c,[p.id]:!c[p.id]}))}/>)}
                </div>
                {roomDoneCount===roomPrompts.length&&<div style={{marginTop:18,padding:"13px 16px",background:"#EFF4EE",border:`1px solid ${P.sage}`,borderRadius:12,fontSize:13,color:P.moss,fontStyle:"italic"}}>✦ This room has been tended to. Well done.</div>}
              </>
            )}
            {tidyMode==="session"&&!sessionComplete&&currentTask&&(
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",paddingTop:6}}>
                <div style={{display:"flex",gap:6,marginBottom:22}}>
                  {sessionTasks.map((_,i)=><div key={i} style={{width:26,height:4,borderRadius:2,background:i<sessionIndex?P.moss:i===sessionIndex?P.warm:P.mist,transition:"background 0.3s"}}/>)}
                </div>
                <div style={{width:"100%",background:P.birch,border:`1px solid ${P.mist}`,borderRadius:16,padding:"24px 20px",textAlign:"center",marginBottom:16}}>
                  <div style={{fontSize:42,marginBottom:12}}>{currentTask.icon}</div>
                  <div style={{fontSize:18,fontWeight:400,lineHeight:1.4,marginBottom:9}}>{currentTask.task}</div>
                  <div style={{fontSize:13,color:P.dusk,fontStyle:"italic"}}>"{currentTask.note}"</div>
                </div>
                <div style={{display:"flex",gap:9,width:"100%"}}>
                  <button onClick={()=>setTidyMode("browse")} style={{flex:1,padding:"11px 0",border:`1px solid ${P.mist}`,borderRadius:10,background:"transparent",cursor:"pointer",fontFamily:"inherit",fontSize:13,color:P.dusk}}>← Exit</button>
                  <button onClick={()=>advanceSession(currentTask.id)} style={{flex:2,padding:"11px 0",border:"none",borderRadius:10,background:P.moss,color:"white",cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:500}}>Done ✓</button>
                </div>
                <div style={{marginTop:11,fontSize:12,color:P.dusk}}>Task {sessionIndex+1} of {sessionTasks.length}</div>
              </div>
            )}
            {tidyMode==="session"&&sessionComplete&&(
              <div style={{textAlign:"center",paddingTop:12}}>
                <div style={{fontSize:42,marginBottom:12}}>🌿</div>
                <div style={{fontSize:20,fontWeight:400,marginBottom:7}}>That's enough.</div>
                <div style={{fontSize:13,color:P.dusk,lineHeight:1.7,fontStyle:"italic",marginBottom:22}}>
                  You tidied 3 things in the {ROOMS.find(r=>r.id===activeRoom)?.label.toLowerCase()}.<br/>The space is better. You can rest now.
                </div>
                <button onClick={()=>setTidyMode("browse")} style={{padding:"10px 24px",background:P.moss,color:"white",border:"none",borderRadius:10,cursor:"pointer",fontFamily:"inherit",fontSize:14}}>Back to room →</button>
              </div>
            )}
          </>
        )}

        {/* ── ADMIN ── */}
        {view==="admin"&&(
          <>
            <div style={{display:"flex",gap:5,marginBottom:20}}>
              {[["tasks","📋 Tasks"],["customize","⚙️ Personalise"]].map(([sv,label])=>(
                <button key={sv} onClick={()=>setAdminSubview(sv)} style={{flex:1,padding:"8px 0",border:`1px solid ${adminSubview===sv?P.dusk:P.mist}`,borderRadius:10,background:adminSubview===sv?P.dusk:"transparent",color:adminSubview===sv?"white":P.dusk,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>{label}</button>
              ))}
            </div>
            {adminSubview==="tasks"&&(
              <>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:18}}>
                  {[{label:"Pending",value:totalPending,color:P.dusk},{label:"Urgent",value:urgentCount,color:P.rose},{label:"Done",value:adminTasks.filter(t=>t.done).length,color:P.moss}].map(s=>(
                    <div key={s.label} style={{background:P.birch,border:`1px solid ${P.mist}`,borderRadius:10,padding:"11px 12px",textAlign:"center"}}>
                      <div style={{fontSize:20,fontWeight:600,color:s.color}}>{s.value}</div>
                      <div style={{fontSize:10,color:P.dusk,marginTop:2}}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:16}}>
                  {[{id:"all",label:"All",icon:"🗂️"},...adminCategories,{id:"done",label:"Done",icon:"✓"}].map(c=>(
                    <button key={c.id} onClick={()=>setAdminFilter(c.id)} style={{padding:"4px 11px",border:`1px solid ${adminFilter===c.id?P.dusk:P.mist}`,borderRadius:20,background:adminFilter===c.id?P.dusk:"transparent",color:adminFilter===c.id?"white":P.dusk,fontSize:11,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:3}}>
                      <span>{c.icon}</span><span>{c.label}</span>
                    </button>
                  ))}
                </div>
                <button onClick={()=>setShowAddTask(s=>!s)} style={{width:"100%",padding:"10px 0",border:`1.5px dashed ${P.mist}`,borderRadius:10,background:"transparent",color:P.dusk,fontSize:13,cursor:"pointer",fontFamily:"inherit",marginBottom:12}}>
                  {showAddTask?"✕ Cancel":"+ Add a task"}
                </button>
                {showAddTask&&(
                  <div style={{background:P.birch,border:`1px solid ${P.mist}`,borderRadius:14,padding:"16px 16px 12px",marginBottom:14}}>
                    <div style={{fontSize:13,fontWeight:500,marginBottom:12}}>New task</div>
                    <input placeholder="Task title…" value={newTask.title} onChange={e=>setNewTask(t=>({...t,title:e.target.value}))} style={iS}/>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,margin:"7px 0"}}>
                      <select value={newTask.category} onChange={e=>setNewTask(t=>({...t,category:e.target.value}))} style={sS}>
                        {adminCategories.map(c=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
                      </select>
                      <select value={newTask.priority} onChange={e=>setNewTask(t=>({...t,priority:e.target.value}))} style={sS}>
                        <option value="high">🔴 Urgent</option>
                        <option value="medium">🟡 Soon</option>
                        <option value="low">🟢 Whenever</option>
                      </select>
                    </div>
                    <input type="date" value={newTask.due} onChange={e=>setNewTask(t=>({...t,due:e.target.value}))} style={{...iS,margin:"0 0 7px"}}/>
                    <input placeholder="Note (optional)…" value={newTask.note} onChange={e=>setNewTask(t=>({...t,note:e.target.value}))} style={iS}/>
                    <button onClick={addAdminTask} style={{marginTop:8,padding:"8px 20px",background:P.moss,color:"white",border:"none",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontSize:13}}>Add task</button>
                  </div>
                )}
                {editingTask&&(
                  <div style={{background:"#FFF8F0",border:`1px solid ${P.warm}`,borderRadius:14,padding:"16px 16px 12px",marginBottom:14}}>
                    <div style={{fontSize:13,fontWeight:500,marginBottom:12}}>Edit task</div>
                    <input value={editingTask.title} onChange={e=>setEditingTask(t=>({...t,title:e.target.value}))} style={iS}/>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,margin:"7px 0"}}>
                      <select value={editingTask.category} onChange={e=>setEditingTask(t=>({...t,category:e.target.value}))} style={sS}>
                        {adminCategories.map(c=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
                      </select>
                      <select value={editingTask.priority} onChange={e=>setEditingTask(t=>({...t,priority:e.target.value}))} style={sS}>
                        <option value="high">🔴 Urgent</option>
                        <option value="medium">🟡 Soon</option>
                        <option value="low">🟢 Whenever</option>
                      </select>
                    </div>
                    <input type="date" value={editingTask.due} onChange={e=>setEditingTask(t=>({...t,due:e.target.value}))} style={{...iS,margin:"0 0 7px"}}/>
                    <input placeholder="Note…" value={editingTask.note} onChange={e=>setEditingTask(t=>({...t,note:e.target.value}))} style={iS}/>
                    <div style={{display:"flex",gap:7,marginTop:8}}>
                      <button onClick={()=>setEditingTask(null)} style={{flex:1,padding:"7px 0",border:`1px solid ${P.mist}`,borderRadius:8,background:"transparent",cursor:"pointer",fontFamily:"inherit",fontSize:13,color:P.dusk}}>Cancel</button>
                      <button onClick={saveEditTask} style={{flex:2,padding:"7px 0",background:P.warm,color:"white",border:"none",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontSize:13}}>Save</button>
                    </div>
                  </div>
                )}
                {visibleTasks.length===0&&<div style={{textAlign:"center",fontSize:13,color:P.dusk,fontStyle:"italic",marginTop:26}}>Nothing here. A clear list is a calm mind.</div>}
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {visibleTasks.map(task=>{
                    const cat=getCat(task.category);
                    return(
                      <div key={task.id} style={{background:task.done?"#F4F4F2":P.birch,border:`1px solid ${P.mist}`,borderLeft:`4px solid ${task.done?P.mist:PRIORITY_COLORS[task.priority]}`,borderRadius:12,padding:"12px 13px",opacity:task.done?0.65:1}}>
                        <div style={{display:"flex",alignItems:"flex-start",gap:9}}>
                          <div onClick={()=>toggleAdminTask(task.id)} style={{width:19,height:19,borderRadius:"50%",marginTop:2,flexShrink:0,border:`2px solid ${task.done?P.moss:P.mist}`,background:task.done?P.moss:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                            {task.done&&<span style={{color:"white",fontSize:10}}>✓</span>}
                          </div>
                          <div style={{flex:1}}>
                            <div style={{fontSize:13,fontWeight:500,textDecoration:task.done?"line-through":"none",color:task.done?P.dusk:P.charcoal,lineHeight:1.3}}>{task.title}</div>
                            <div style={{display:"flex",gap:5,marginTop:4,flexWrap:"wrap",alignItems:"center"}}>
                              <span style={{fontSize:10,background:P.mist,color:P.dusk,padding:"2px 7px",borderRadius:8}}>{cat.icon} {cat.label}</span>
                              <span style={{fontSize:10,color:PRIORITY_COLORS[task.priority],background:`${PRIORITY_COLORS[task.priority]}22`,padding:"2px 7px",borderRadius:8}}>{PRIORITY_LABELS[task.priority]}</span>
                              {task.due&&<span style={{fontSize:10,color:P.dusk}}>📅 {task.due}</span>}
                            </div>
                            {task.note&&<div style={{fontSize:11,color:P.dusk,fontStyle:"italic",marginTop:3}}>{task.note}</div>}
                          </div>
                          <div style={{display:"flex",gap:3}}>
                            <button onClick={()=>setEditingTask({...task})} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:13,padding:2}}>✏️</button>
                            <button onClick={()=>deleteAdminTask(task.id)} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:13,padding:2}}>🗑️</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{marginTop:22,padding:"13px 16px",background:P.mist,borderRadius:12,fontSize:13,color:P.dusk,lineHeight:1.65,fontStyle:"italic"}}>
                  You don't have to clear the whole list today. Pick one. Do it. That's lagom.
                </div>
              </>
            )}
            {adminSubview==="customize"&&(
              <>
                <div style={{fontSize:15,fontWeight:400,marginBottom:4}}>Personalise your categories</div>
                <div style={{fontSize:13,color:P.dusk,marginBottom:18,lineHeight:1.6}}>Add, rename, or remove categories to match your life.</div>
                <div style={{background:P.birch,border:`1px solid ${P.mist}`,borderRadius:14,padding:"14px 16px",marginBottom:18}}>
                  <div style={{fontSize:13,fontWeight:500,marginBottom:10}}>Add a category</div>
                  <div style={{display:"flex",gap:7,marginBottom:7}}>
                    <input placeholder="🗂️" value={newCatIcon} onChange={e=>setNewCatIcon(e.target.value)} style={{...iS,width:52,textAlign:"center"}}/>
                    <input placeholder="Category name…" value={newCatLabel} onChange={e=>setNewCatLabel(e.target.value)} style={{...iS,flex:1}}/>
                  </div>
                  <button onClick={addCategory} style={{padding:"7px 18px",background:P.moss,color:"white",border:"none",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontSize:13}}>Add</button>
                </div>
                <div style={{fontSize:12,color:P.dusk,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}}>Your categories</div>
                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  {adminCategories.map(cat=>(
                    <div key={cat.id}>
                      {editingCat?.id===cat.id?(
                        <div style={{background:"#FFF8F0",border:`1px solid ${P.warm}`,borderRadius:11,padding:"13px 14px"}}>
                          <div style={{display:"flex",gap:7,marginBottom:7}}>
                            <input value={editingCat.icon} onChange={e=>setEditingCat(c=>({...c,icon:e.target.value}))} style={{...iS,width:52,textAlign:"center"}}/>
                            <input value={editingCat.label} onChange={e=>setEditingCat(c=>({...c,label:e.target.value}))} style={{...iS,flex:1}}/>
                          </div>
                          <div style={{display:"flex",gap:7}}>
                            <button onClick={()=>setEditingCat(null)} style={{flex:1,padding:"7px 0",border:`1px solid ${P.mist}`,borderRadius:8,background:"transparent",cursor:"pointer",fontFamily:"inherit",fontSize:12,color:P.dusk}}>Cancel</button>
                            <button onClick={saveCatEdit} style={{flex:2,padding:"7px 0",background:P.warm,color:"white",border:"none",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontSize:12}}>Save</button>
                          </div>
                        </div>
                      ):(
                        <div style={{display:"flex",alignItems:"center",gap:11,background:P.birch,border:`1px solid ${P.mist}`,borderRadius:11,padding:"11px 14px"}}>
                          <span style={{fontSize:19}}>{cat.icon}</span>
                          <span style={{flex:1,fontSize:13}}>{cat.label}</span>
                          <span style={{fontSize:10,color:P.dusk,background:P.mist,padding:"2px 7px",borderRadius:8}}>{adminTasks.filter(t=>t.category===cat.id).length} tasks</span>
                          <button onClick={()=>setEditingCat({...cat})} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:13}}>✏️</button>
                          <button onClick={()=>deleteCategory(cat.id)} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:13}}>🗑️</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{marginTop:20,padding:"13px 16px",background:P.mist,borderRadius:12,fontSize:13,color:P.dusk,lineHeight:1.65,fontStyle:"italic"}}>
                  Your life doesn't fit neatly into preset boxes. This section is yours to shape.
                </div>
              </>
            )}
          </>
        )}

        {/* ── CONNECT ── */}
        {view==="connect"&&(
          <>
            <div style={{display:"flex",gap:5,marginBottom:20}}>
              {[["people","👥 People"],["wellness","🌱 Wellness"],["personalise","⚙️ Personalise"]].map(([sv,label])=>(
                <button key={sv} onClick={()=>setConnectSubview(sv)} style={{flex:1,padding:"7px 0",border:`1px solid ${connectSubview===sv?P.lavender:P.mist}`,borderRadius:10,background:connectSubview===sv?P.lavender:"transparent",color:connectSubview===sv?"white":P.dusk,fontSize:11.5,cursor:"pointer",fontFamily:"inherit"}}>{label}</button>
              ))}
            </div>

            {connectSubview==="people"&&(
              <>
                <div style={{background:P.birch,border:`1px solid ${P.mist}`,borderRadius:14,padding:"16px 18px",marginBottom:18}}>
                  <div style={{fontSize:13,fontWeight:500,marginBottom:4}}>How are you feeling today?</div>
                  <div style={{fontSize:12,color:P.dusk,marginBottom:12,fontStyle:"italic"}}>No judgment. Just check in.</div>
                  <div style={{display:"flex",gap:6,justifyContent:"space-between"}}>
                    {MOOD_OPTIONS.map(m=>(
                      <button key={m.value} onClick={()=>logMood(m.value)} style={{flex:1,padding:"10px 4px",border:`1.5px solid ${todayMood===m.value?P.lavender:P.mist}`,borderRadius:10,background:todayMood===m.value?`${P.lavender}33`:"transparent",cursor:"pointer",fontFamily:"inherit",textAlign:"center"}}>
                        <div style={{fontSize:20}}>{m.emoji}</div>
                        <div style={{fontSize:9.5,color:P.dusk,marginTop:4,lineHeight:1.2}}>{m.label}</div>
                      </button>
                    ))}
                  </div>
                  {todayMood&&(
                    <div style={{marginTop:12,fontSize:12,color:P.lavender,fontStyle:"italic",textAlign:"center"}}>
                      {todayMood>=4?"Wonderful. Carry that with you.":todayMood===3?"Okay is enough. You're here.":"Thank you for noticing. Be gentle with yourself today."}
                    </div>
                  )}
                </div>

                {contactedCount>0&&(
                  <div style={{background:"#F0EDF6",border:`1px solid ${P.lavender}`,borderRadius:12,padding:"11px 14px",marginBottom:16,fontSize:13,color:P.charcoal}}>
                    ✦ You've reached out to {contactedCount} {contactedCount===1?"person":"people"} today. That matters.
                  </div>
                )}

                <div style={{fontSize:12,color:P.dusk,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}}>Your people</div>
                <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:14}}>
                  {people.map(person=>{
                    const done=!!contactedToday[person.id];
                    const typeInfo=CONTACT_TYPES.find(t=>t.id===person.type)||CONTACT_TYPES[0];
                    return(
                      <div key={person.id} style={{background:done?"#F0EDF6":P.birch,border:`1px solid ${done?P.lavender:P.mist}`,borderRadius:12,padding:"13px 14px",transition:"all 0.2s"}}>
                        <div style={{display:"flex",alignItems:"center",gap:11}}>
                          <div style={{width:40,height:40,borderRadius:"50%",background:done?P.lavender:P.mist,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{person.icon}</div>
                          <div style={{flex:1}}>
                            <div style={{fontSize:14,fontWeight:500,color:done?P.lavender:P.charcoal}}>{person.name}</div>
                            <div style={{fontSize:11,color:P.dusk,marginTop:2,display:"flex",alignItems:"center",gap:5}}>
                              <span>{typeInfo.icon} {typeInfo.label}</span>
                              {person.lastContact&&<span>· last: {person.lastContact}</span>}
                            </div>
                            {person.note&&<div style={{fontSize:11,color:P.dusk,fontStyle:"italic",marginTop:3}}>{person.note}</div>}
                          </div>
                          <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
                            <button onClick={()=>markContacted(person.id)} style={{padding:"6px 12px",border:"none",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontSize:12,background:done?P.lavender:P.moss,color:"white"}}>
                              {done?"✓ Done":`${typeInfo.icon} Do it`}
                            </button>
                            <div style={{display:"flex",gap:3}}>
                              <button onClick={()=>setEditingPerson({...person})} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:12,padding:1}}>✏️</button>
                              <button onClick={()=>deletePerson(person.id)} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:12,padding:1}}>🗑️</button>
                            </div>
                          </div>
                        </div>
                        {editingPerson?.id===person.id&&(
                          <div style={{marginTop:12,borderTop:`1px solid ${P.mist}`,paddingTop:12}}>
                            <div style={{display:"flex",gap:7,marginBottom:7}}>
                              <input value={editingPerson.icon} onChange={e=>setEditingPerson(p=>({...p,icon:e.target.value}))} style={{...iS,width:52,textAlign:"center"}}/>
                              <input value={editingPerson.name} onChange={e=>setEditingPerson(p=>({...p,name:e.target.value}))} style={{...iS,flex:1}}/>
                            </div>
                            <select value={editingPerson.type} onChange={e=>setEditingPerson(p=>({...p,type:e.target.value}))} style={{...sS,marginBottom:7}}>
                              {CONTACT_TYPES.map(t=><option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
                            </select>
                            <input placeholder="Note…" value={editingPerson.note} onChange={e=>setEditingPerson(p=>({...p,note:e.target.value}))} style={{...iS,marginBottom:9}}/>
                            <div style={{display:"flex",gap:7}}>
                              <button onClick={()=>setEditingPerson(null)} style={{flex:1,padding:"7px 0",border:`1px solid ${P.mist}`,borderRadius:8,background:"transparent",cursor:"pointer",fontFamily:"inherit",fontSize:12,color:P.dusk}}>Cancel</button>
                              <button onClick={savePersonEdit} style={{flex:2,padding:"7px 0",background:P.lavender,color:"white",border:"none",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontSize:12}}>Save</button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <button onClick={()=>setShowAddPerson(s=>!s)} style={{width:"100%",padding:"10px 0",border:`1.5px dashed ${P.mist}`,borderRadius:10,background:"transparent",color:P.dusk,fontSize:13,cursor:"pointer",fontFamily:"inherit",marginBottom:showAddPerson?12:0}}>
                  {showAddPerson?"✕ Cancel":"+ Add someone"}
                </button>
                {showAddPerson&&(
                  <div style={{background:P.birch,border:`1px solid ${P.mist}`,borderRadius:14,padding:"14px 16px"}}>
                    <div style={{fontSize:13,fontWeight:500,marginBottom:11}}>Add a person</div>
                    <div style={{display:"flex",gap:7,marginBottom:7}}>
                      <input placeholder="🙂" value={newPerson.icon} onChange={e=>setNewPerson(p=>({...p,icon:e.target.value}))} style={{...iS,width:52,textAlign:"center"}}/>
                      <input placeholder="Their name…" value={newPerson.name} onChange={e=>setNewPerson(p=>({...p,name:e.target.value}))} style={{...iS,flex:1}}/>
                    </div>
                    <select value={newPerson.type} onChange={e=>setNewPerson(p=>({...p,type:e.target.value}))} style={{...sS,marginBottom:7}}>
                      {CONTACT_TYPES.map(t=><option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
                    </select>
                    <input placeholder="A gentle reminder note… (optional)" value={newPerson.note} onChange={e=>setNewPerson(p=>({...p,note:e.target.value}))} style={{...iS,marginBottom:9}}/>
                    <button onClick={addPerson} style={{padding:"8px 20px",background:P.lavender,color:"white",border:"none",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontSize:13}}>Add person</button>
                  </div>
                )}
                <div style={{marginTop:22,padding:"13px 16px",background:P.mist,borderRadius:12,fontSize:13,color:P.dusk,lineHeight:1.65,fontStyle:"italic"}}>
                  Connection doesn't require the perfect words. A short message still says: I thought of you.
                </div>
              </>
            )}

            {connectSubview==="wellness"&&(
              <>
                <div style={{marginBottom:18}}>
                  <div style={{fontSize:16,fontWeight:400,marginBottom:4}}>Mental wellness</div>
                  <div style={{fontSize:13,color:P.dusk,lineHeight:1.6}}>
                    Small acts of care for your inner world.{wellnessCount>0&&<span style={{color:P.moss}}> You've done {wellnessCount} today.</span>}
                  </div>
                </div>
                {moodLog.length>0&&(
                  <div style={{background:P.birch,border:`1px solid ${P.mist}`,borderRadius:12,padding:"12px 14px",marginBottom:18}}>
                    <div style={{fontSize:11,color:P.dusk,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:9}}>Recent moods</div>
                    <div style={{display:"flex",gap:10}}>
                      {moodLog.map((m,i)=>(
                        <div key={i} style={{textAlign:"center"}}>
                          <div style={{fontSize:18}}>{m.emoji}</div>
                          <div style={{fontSize:9,color:P.dusk,marginTop:2}}>{m.date.slice(5)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{display:"flex",flexDirection:"column",gap:9}}>
                  {DEFAULT_WELLNESS.map(w=>{
                    const done=!!wellnessDone[w.id];
                    return(
                      <div key={w.id} onClick={()=>toggleWellness(w.id)} style={{display:"flex",alignItems:"center",gap:13,background:done?"#F0EDF6":P.birch,border:`1px solid ${done?P.lavender:P.mist}`,borderRadius:12,padding:"13px 14px",cursor:"pointer",transition:"all 0.2s",userSelect:"none"}}>
                        <div style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${done?P.lavender:P.mist}`,background:done?P.lavender:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                          {done&&<span style={{color:"white",fontSize:10}}>✓</span>}
                        </div>
                        <span style={{fontSize:20}}>{w.icon}</span>
                        <div style={{flex:1}}>
                          <div style={{fontSize:14,fontWeight:500,color:done?P.lavender:P.charcoal,textDecoration:done?"line-through":"none"}}>{w.title}</div>
                          <div style={{fontSize:12,color:P.dusk,marginTop:2}}>{w.subtitle}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{marginTop:22,padding:"13px 16px",background:"#F0EDF6",border:`1px solid ${P.lavender}`,borderRadius:12,fontSize:13,color:P.dusk,lineHeight:1.65,fontStyle:"italic"}}>
                  Your mental wellness is not a project to complete. It is a relationship to tend — gently, daily, enough.
                </div>
              </>
            )}

            {connectSubview==="personalise"&&(
              <>
                <div style={{fontSize:15,fontWeight:400,marginBottom:4}}>Personalise your people</div>
                <div style={{fontSize:13,color:P.dusk,marginBottom:18,lineHeight:1.6}}>Add the people who matter most.</div>
                <div style={{fontSize:12,color:P.dusk,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}}>Your people ({people.length})</div>
                <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
                  {people.map(person=>{
                    const typeInfo=CONTACT_TYPES.find(t=>t.id===person.type)||CONTACT_TYPES[0];
                    return(
                      <div key={person.id} style={{background:P.birch,border:`1px solid ${P.mist}`,borderRadius:12,padding:"12px 14px"}}>
                        {editingPerson?.id===person.id?(
                          <>
                            <div style={{display:"flex",gap:7,marginBottom:7}}>
                              <input value={editingPerson.icon} onChange={e=>setEditingPerson(p=>({...p,icon:e.target.value}))} style={{...iS,width:52,textAlign:"center"}}/>
                              <input value={editingPerson.name} onChange={e=>setEditingPerson(p=>({...p,name:e.target.value}))} style={{...iS,flex:1}}/>
                            </div>
                            <select value={editingPerson.type} onChange={e=>setEditingPerson(p=>({...p,type:e.target.value}))} style={{...sS,marginBottom:7}}>
                              {CONTACT_TYPES.map(t=><option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
                            </select>
                            <input placeholder="Note…" value={editingPerson.note} onChange={e=>setEditingPerson(p=>({...p,note:e.target.value}))} style={{...iS,marginBottom:9}}/>
                            <div style={{display:"flex",gap:7}}>
                              <button onClick={()=>setEditingPerson(null)} style={{flex:1,padding:"7px 0",border:`1px solid ${P.mist}`,borderRadius:8,background:"transparent",cursor:"pointer",fontFamily:"inherit",fontSize:12,color:P.dusk}}>Cancel</button>
                              <button onClick={savePersonEdit} style={{flex:2,padding:"7px 0",background:P.lavender,color:"white",border:"none",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontSize:12}}>Save</button>
                            </div>
                          </>
                        ):(
                          <div style={{display:"flex",alignItems:"center",gap:10}}>
                            <span style={{fontSize:22}}>{person.icon}</span>
                            <div style={{flex:1}}>
                              <div style={{fontSize:13,fontWeight:500}}>{person.name}</div>
                              <div style={{fontSize:11,color:P.dusk,marginTop:2}}>{typeInfo.icon} {typeInfo.label}{person.note&&` · ${person.note}`}</div>
                            </div>
                            <button onClick={()=>setEditingPerson({...person})} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:13}}>✏️</button>
                            <button onClick={()=>deletePerson(person.id)} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:13}}>🗑️</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <button onClick={()=>setShowAddPerson(s=>!s)} style={{width:"100%",padding:"10px 0",border:`1.5px dashed ${P.mist}`,borderRadius:10,background:"transparent",color:P.dusk,fontSize:13,cursor:"pointer",fontFamily:"inherit",marginBottom:showAddPerson?12:0}}>
                  {showAddPerson?"✕ Cancel":"+ Add someone"}
                </button>
                {showAddPerson&&(
                  <div style={{background:P.birch,border:`1px solid ${P.mist}`,borderRadius:14,padding:"14px 16px"}}>
                    <div style={{display:"flex",gap:7,marginBottom:7}}>
                      <input placeholder="🙂" value={newPerson.icon} onChange={e=>setNewPerson(p=>({...p,icon:e.target.value}))} style={{...iS,width:52,textAlign:"center"}}/>
                      <input placeholder="Their name…" value={newPerson.name} onChange={e=>setNewPerson(p=>({...p,name:e.target.value}))} style={{...iS,flex:1}}/>
                    </div>
                    <select value={newPerson.type} onChange={e=>setNewPerson(p=>({...p,type:e.target.value}))} style={{...sS,marginBottom:7}}>
                      {CONTACT_TYPES.map(t=><option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
                    </select>
                    <input placeholder="A gentle reminder note… (optional)" value={newPerson.note} onChange={e=>setNewPerson(p=>({...p,note:e.target.value}))} style={{...iS,marginBottom:9}}/>
                    <button onClick={addPerson} style={{padding:"8px 18px",background:P.lavender,color:"white",border:"none",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontSize:13}}>Add person</button>
                  </div>
                )}
                <div style={{marginTop:20,padding:"13px 16px",background:P.mist,borderRadius:12,fontSize:13,color:P.dusk,lineHeight:1.65,fontStyle:"italic"}}>
                  You don't need many. Just the ones who matter most. That's lagom.
                </div>
              </>
            )}
          </>
        )}

        {/* ── REFLECT ── */}
        {view==="reflect"&&(
          <>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:18,fontWeight:400,marginBottom:4}}>End-of-day reflection</div>
              <div style={{fontSize:13,color:P.dusk}}>One thought. No pressure. Just notice.</div>
            </div>
            <div style={{background:P.birch,border:`1px solid ${P.mist}`,borderRadius:14,padding:18,marginBottom:18}}>
              <div style={{fontSize:12,color:P.dusk,marginBottom:9}}>What felt just right today?</div>
              <textarea value={reflection} onChange={e=>setReflection(e.target.value)} placeholder="Write a few words, or a sentence…" style={{width:"100%",minHeight:88,background:"transparent",border:"none",outline:"none",resize:"none",fontFamily:"inherit",fontSize:14,color:P.charcoal,lineHeight:1.7,boxSizing:"border-box"}}/>
              <button onClick={saveReflection} style={{marginTop:9,padding:"7px 18px",background:P.moss,color:"white",border:"none",borderRadius:8,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>Save</button>
            </div>
            {savedReflections.length>0?(
              <>
                <div style={{fontSize:12,color:P.dusk,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}}>Previous</div>
                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  {savedReflections.map((r,i)=>(
                    <div key={i} style={{background:P.birch,border:`1px solid ${P.mist}`,borderRadius:10,padding:"11px 14px"}}>
                      <div style={{fontSize:10,color:P.warm,letterSpacing:"0.08em",marginBottom:4}}>{r.date}</div>
                      <div style={{fontSize:13,lineHeight:1.65,fontStyle:"italic"}}>{r.text}</div>
                    </div>
                  ))}
                </div>
              </>
            ):(
              <div style={{fontSize:13,color:P.dusk,fontStyle:"italic",textAlign:"center",marginTop:28}}>
                Your reflections will appear here. One sentence is enough.
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

// ── STYLE HELPERS ──
const iS={width:"100%",padding:"9px 11px",border:`1px solid #E8E0D5`,borderRadius:8,background:"white",fontFamily:"inherit",fontSize:13,color:"#2E3338",outline:"none",boxSizing:"border-box"};
const sS={width:"100%",padding:"9px 10px",border:`1px solid #E8E0D5`,borderRadius:8,background:"white",fontFamily:"inherit",fontSize:13,color:"#2E3338",outline:"none",cursor:"pointer"};

// ── HABIT CARD (with 7-day grid) ──
function HabitCard({habit,done,onToggle,history}){
  return(
    <div style={{background:done?"#EFF4EE":P.birch,border:`1px solid ${done?P.sage:P.mist}`,borderRadius:12,padding:"12px 14px",transition:"all 0.2s"}}>
      <div onClick={onToggle} style={{display:"flex",alignItems:"center",gap:13,cursor:"pointer",userSelect:"none"}}>
        <div style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${done?P.moss:P.mist}`,background:done?P.moss:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
          {done&&<span style={{color:"white",fontSize:10}}>✓</span>}
        </div>
        <span style={{fontSize:19}}>{habit.icon}</span>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:500,color:done?P.moss:P.charcoal,textDecoration:done?"line-through":"none"}}>{habit.title}</div>
          <div style={{fontSize:11,color:P.dusk,marginTop:2}}>{habit.subtitle}</div>
        </div>
        <span style={{fontSize:10,color:P.dusk,background:P.mist,padding:"2px 7px",borderRadius:8,textTransform:"capitalize"}}>{habit.category}</span>
      </div>
      <WeekGrid habitId={habit.id} history={history||{}}/>
    </div>
  );
}

function TidyCard({prompt,done,onToggle}){
  return(
    <div onClick={onToggle} style={{display:"flex",alignItems:"flex-start",gap:13,background:done?"#EFF4EE":P.birch,border:`1px solid ${done?P.sage:P.mist}`,borderRadius:12,padding:"12px 14px",cursor:"pointer",transition:"all 0.2s",userSelect:"none"}}>
      <div style={{width:20,height:20,borderRadius:"50%",marginTop:2,border:`2px solid ${done?P.moss:P.mist}`,background:done?P.moss:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
        {done&&<span style={{color:"white",fontSize:10}}>✓</span>}
      </div>
      <span style={{fontSize:19,marginTop:1}}>{prompt.icon}</span>
      <div style={{flex:1}}>
        <div style={{fontSize:13,fontWeight:500,color:done?P.moss:P.charcoal,textDecoration:done?"line-through":"none",lineHeight:1.4}}>{prompt.task}</div>
        <div style={{fontSize:11,color:P.dusk,fontStyle:"italic",marginTop:3}}>"{prompt.note}"</div>
      </div>
    </div>
  );
}

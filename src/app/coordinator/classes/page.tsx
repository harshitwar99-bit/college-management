"use client";
import { useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useTimetable } from "@/lib/useTimetable";
import { FACULTY_OPTIONS, SUBJECT_OPTIONS, PERIOD_TIMES, TimetableSlot, WeeklyTimetable, resetTimetable } from "@/lib/timetable-store";
import { useAuth } from "@/lib/auth-context";
import { DAYS, cn } from "@/lib/utils";
import { Plus, Trash2, Edit2, Save, X, RefreshCw, Copy, Undo2, AlertTriangle, CheckCircle2, Wifi } from "lucide-react";

const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Mathematics - III": { bg: "bg-blue-600/30",    text: "text-blue-200",   border: "border-blue-500/40" },
  "OS-Theory":         { bg: "bg-purple-600/30",  text: "text-purple-200", border: "border-purple-500/40" },
  "CGMA-Lab":          { bg: "bg-emerald-600/30", text: "text-emerald-200",border: "border-emerald-500/40" },
  "CGMA-Theory":       { bg: "bg-teal-600/30",    text: "text-teal-200",   border: "border-teal-500/40" },
  "OT-Theory":         { bg: "bg-amber-600/30",   text: "text-amber-200",  border: "border-amber-500/40" },
  "SE-Theory":         { bg: "bg-pink-600/30",    text: "text-pink-200",   border: "border-pink-500/40" },
  "CET-Theory":        { bg: "bg-cyan-600/30",    text: "text-cyan-200",   border: "border-cyan-500/40" },
  "Data Structures":   { bg: "bg-indigo-600/30",  text: "text-indigo-200", border: "border-indigo-500/40" },
  "DBMS":              { bg: "bg-rose-600/30",    text: "text-rose-200",   border: "border-rose-500/40" },
  "Algorithms":        { bg: "bg-violet-600/30",  text: "text-violet-200", border: "border-violet-500/40" },
};
const getC = (s: string) => SUBJECT_COLORS[s] || { bg: "bg-slate-600/30", text: "text-slate-200", border: "border-slate-500/40" };

// ─── Quick Cell Modal ───────────────────────────────────────────────────────
function CellModal({ day, time, end, slot, onSave, onClose, onDelete }: {
  day: string; time: string; end: string;
  slot?: TimetableSlot; onSave: (s: TimetableSlot) => void;
  onClose: () => void; onDelete?: () => void;
}) {
  const [form, setForm] = useState({ subject: slot?.subject || SUBJECT_OPTIONS[0], faculty: slot?.faculty || FACULTY_OPTIONS[0], room: slot?.room || "101" });
  const isEdit = !!slot;
  const save = () => onSave({ id: slot?.id || `${day}_${time}_${Date.now()}`, time, end, ...form, type: form.subject.toLowerCase().includes("lab") ? "lab" : "regular" });
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-emerald-600/10 to-teal-600/10">
          <div>
            <p className="text-white font-bold">{isEdit ? "Edit Period" : "Add Period"}</p>
            <p className="text-slate-400 text-xs mt-0.5">{day} · {time}–{end}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">Subject</label>
            <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50">
              {SUBJECT_OPTIONS.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">Faculty</label>
            <select value={form.faculty} onChange={e => setForm(f => ({ ...f, faculty: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50">
              {FACULTY_OPTIONS.map(f => <option key={f} value={f} className="bg-slate-900">{f}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">Room</label>
            <input value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))} placeholder="101, Lab-1…"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/50 placeholder-slate-600" />
          </div>
        </div>
        <div className="flex gap-2 px-4 pb-4">
          {isEdit && onDelete && <button onClick={onDelete} className="px-3 py-2.5 rounded-xl bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600/20 text-sm transition-colors"><Trash2 className="w-4 h-4" /></button>}
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm">Cancel</button>
          <button onClick={save} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20">
            <Save className="w-3.5 h-3.5" />{isEdit ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Copy Day Modal ─────────────────────────────────────────────────────────
function CopyModal({ fromDay, timetable, onCopy, onClose }: { fromDay: string; timetable: WeeklyTimetable; onCopy: (to: string) => void; onClose: () => void; }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-xs shadow-2xl p-5" onClick={e => e.stopPropagation()}>
        <h3 className="text-white font-bold mb-1">Copy {fromDay} Schedule</h3>
        <p className="text-slate-400 text-sm mb-4">Choose the day to copy all {(timetable[fromDay] || []).length} periods to:</p>
        <div className="space-y-2">
          {DAYS.filter(d => d !== fromDay).map(d => (
            <button key={d} onClick={() => onCopy(d)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-emerald-600/10 hover:border-emerald-500/30 transition-all text-sm">
              <span>{d}</span>
              <span className="text-slate-500 text-xs">{(timetable[d] || []).length} periods currently</span>
            </button>
          ))}
        </div>
        <button onClick={onClose} className="mt-3 w-full py-2 rounded-xl bg-white/5 text-slate-400 text-sm">Cancel</button>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function CoordinatorClassesPage() {
  const { userProfile } = useAuth();
  const { timetable, save, lastUpdated } = useTimetable(userProfile?.branch);
  const [modal, setModal] = useState<{ day: string; time: string; end: string; slot?: TimetableSlot } | null>(null);
  const [copyFrom, setCopyFrom] = useState<string | null>(null);
  const [flash, setFlash] = useState("");
  const [history, setHistory] = useState<WeeklyTimetable[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "day">("grid");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [facultyFilter, setFacultyFilter] = useState("All");

  const flash2 = (msg: string) => { setFlash(msg); setTimeout(() => setFlash(""), 2500); };

  const doSave = useCallback((next: WeeklyTimetable) => {
    setHistory(h => [...h.slice(-9), timetable]);
    save(next);
    flash2("✓ Saved & synced");
  }, [timetable, save]);

  const undo = () => {
    if (!history.length) return;
    const prev = history[history.length - 1];
    save(prev);
    setHistory(h => h.slice(0, -1));
    flash2("↩ Undone");
  };

  const handleSaveSlot = (day: string, slot: TimetableSlot) => {
    const dayData = timetable[day] || [];
    const exists = dayData.find(s => s.id === slot.id);
    doSave({ ...timetable, [day]: exists ? dayData.map(s => s.id === slot.id ? slot : s) : [...dayData, slot] });
    setModal(null);
  };

  const handleDelete = (day: string, id: string) => {
    doSave({ ...timetable, [day]: (timetable[day] || []).filter(s => s.id !== id) });
    setModal(null);
  };

  const handleCopy = (toDay: string) => {
    if (!copyFrom) return;
    const src = (timetable[copyFrom] || []).map(s => ({ ...s, id: `${toDay}_${s.time}_${Date.now()}_${Math.random().toString(36).slice(2)}` }));
    doSave({ ...timetable, [toDay]: src });
    setCopyFrom(null);
    flash2(`Copied ${copyFrom} → ${toDay}`);
  };

  // Conflict detection: same faculty at same time slot across two diff entries
  const conflicts = new Set<string>();
  DAYS.forEach(day => {
    const slots = timetable[day] || [];
    slots.forEach((a, ai) => slots.forEach((b, bi) => {
      if (ai >= bi) return;
      const overlap = parseInt(a.time.replace(":", "")) < parseInt(b.end.replace(":", "")) &&
        parseInt(b.time.replace(":", "")) < parseInt(a.end.replace(":", ""));
      if (overlap && a.faculty === b.faculty) { conflicts.add(a.id); conflicts.add(b.id); }
    }));
  });

  const totalSlots = Object.values(timetable).reduce((s, d) => s + (d?.length || 0), 0);

  // Faculty workload
  const workload: Record<string, number> = {};
  Object.values(timetable).forEach(slots => (slots || []).forEach(s => { workload[s.faculty] = (workload[s.faculty] || 0) + 1; }));

  return (
    <DashboardLayout role="coordinator" title="Classes & Timetables">
      {modal && (
        <CellModal day={modal.day} time={modal.time} end={modal.end} slot={modal.slot}
          onSave={slot => handleSaveSlot(modal.day, slot)}
          onClose={() => setModal(null)}
          onDelete={modal.slot ? () => handleDelete(modal.day, modal.slot!.id) : undefined}
        />
      )}
      {copyFrom && <CopyModal fromDay={copyFrom} timetable={timetable} onCopy={handleCopy} onClose={() => setCopyFrom(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 fade-in">
        <div>
          <h1 className="text-2xl font-bold text-white">Timetable Builder</h1>
          <p className="text-slate-400 text-sm mt-0.5">Click any cell to add or edit · Changes sync instantly</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {flash && <span className="text-emerald-400 text-sm font-medium flex items-center gap-1"><CheckCircle2 className="w-4 h-4" />{flash}</span>}
          {!flash && lastUpdated && <span className="text-xs text-slate-500 flex items-center gap-1"><Wifi className="w-3 h-3 text-emerald-500" />Live</span>}
          <button onClick={undo} disabled={!history.length} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 text-sm transition-colors"><Undo2 className="w-4 h-4" />Undo</button>
          <button onClick={() => { resetTimetable(userProfile?.branch); setTimeout(() => window.location.reload(), 50); }} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white text-sm transition-colors"><RefreshCw className="w-4 h-4" />Reset</button>
          <div className="flex rounded-xl border border-white/10 overflow-hidden">
            {(["grid", "day"] as const).map(m => (
              <button key={m} onClick={() => setViewMode(m)} className={cn("px-3 py-2 text-xs font-medium capitalize transition-colors", viewMode === m ? "bg-emerald-600 text-white" : "bg-white/5 text-slate-400 hover:text-white")}>{m === "grid" ? "⊞ Grid" : "☰ Day"}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 fade-in">
        <div className="glass-card p-3 text-center"><p className="text-xl font-bold text-white">{totalSlots}</p><p className="text-xs text-slate-400">Periods/Week</p></div>
        <div className="glass-card p-3 text-center"><p className="text-xl font-bold text-white">{Object.keys(workload).length}</p><p className="text-xs text-slate-400">Faculty Active</p></div>
        <div className="glass-card p-3 text-center"><p className={cn("text-xl font-bold", conflicts.size ? "text-red-400" : "text-emerald-400")}>{conflicts.size ? `${conflicts.size / 2}` : "0"}</p><p className="text-xs text-slate-400">Conflicts</p></div>
        <div className="glass-card p-3 text-center"><p className="text-xl font-bold text-white">{Math.round(totalSlots / 6)}</p><p className="text-xs text-slate-400">Avg/Day</p></div>
      </div>

      {/* Conflict warning */}
      {conflicts.size > 0 && (
        <div className="mb-4 p-3 rounded-xl border border-red-500/20 bg-red-500/5 flex items-center gap-2 text-sm fade-in">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="text-red-300">⚠ {conflicts.size / 2} scheduling conflict{conflicts.size / 2 > 1 ? "s" : ""} detected — same faculty assigned to overlapping time slots.</span>
        </div>
      )}

      {viewMode === "grid" ? (
        /* ── GRID VIEW ── */
        <div className="overflow-x-auto fade-in">
          <div className="min-w-[700px]">
            {/* Header row */}
            <div className="grid gap-1.5 mb-1.5" style={{ gridTemplateColumns: "80px repeat(6, 1fr)" }}>
              <div className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold p-2">Time</div>
              {DAYS.map(day => (
                <div key={day} className="text-center">
                  <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-white/5">
                    <span className="text-xs font-semibold text-slate-300">{day.slice(0, 3)}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-500">{(timetable[day] || []).length}</span>
                      <button onClick={() => setCopyFrom(day)} title={`Copy ${day}`}
                        className="p-0.5 rounded text-slate-600 hover:text-emerald-400 transition-colors"><Copy className="w-3 h-3" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Period rows */}
            {PERIOD_TIMES.map(({ time, end }) => (
              <div key={time} className="grid gap-1.5 mb-1.5" style={{ gridTemplateColumns: "80px repeat(6, 1fr)" }}>
                {/* Time label */}
                <div className="flex flex-col items-center justify-center py-2 text-center">
                  <span className="text-[10px] font-semibold text-slate-400">{time}</span>
                  <span className="text-[9px] text-slate-600">{end}</span>
                </div>
                {/* Day cells */}
                {DAYS.map(day => {
                  const slot = (timetable[day] || []).find(s => s.time === time);
                  const c = slot ? getC(slot.subject) : null;
                  const hasConflict = slot && conflicts.has(slot.id);
                  return (
                    <button key={day} onClick={() => setModal({ day, time, end, slot })}
                      className={cn(
                        "rounded-xl border text-left p-2 transition-all min-h-[70px] group",
                        slot
                          ? cn(c!.bg, c!.border, "hover:opacity-90", hasConflict && "ring-2 ring-red-500/60")
                          : "bg-white/[0.02] border-white/5 hover:bg-emerald-500/5 hover:border-emerald-500/20"
                      )}>
                      {slot ? (
                        <div>
                          {hasConflict && <span className="text-[9px] text-red-400 font-bold uppercase tracking-wider block mb-0.5">⚠ Conflict</span>}
                          <p className={cn("text-xs font-semibold leading-tight truncate", c!.text)}>{slot.subject}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 truncate">{slot.faculty.split(" ").slice(-1)[0]}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Rm {slot.room}</p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus className="w-4 h-4 text-emerald-500" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}

            {/* Free slot row */}
            <div className="grid gap-1.5 mb-1.5" style={{ gridTemplateColumns: "80px repeat(6, 1fr)" }}>
              <div className="flex flex-col items-center justify-center py-2"><span className="text-[10px] text-slate-600">Custom</span></div>
              {DAYS.map(day => (
                <button key={day} onClick={() => setModal({ day, time: "08:00", end: "09:00" })}
                  className="rounded-xl border border-dashed border-white/10 text-slate-600 hover:text-emerald-400 hover:border-emerald-500/30 transition-all min-h-[44px] flex items-center justify-center gap-1 text-[10px]">
                  <Plus className="w-3 h-3" />custom
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ── DAY VIEW ── */
        <div className="fade-in">
          {/* Day tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {DAYS.map(day => (
              <button key={day} onClick={() => setSelectedDay(day)}
                className={cn("flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  selectedDay === day ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg" : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10")}>
                {day.slice(0, 3)} <span className="opacity-60 text-xs ml-1">{(timetable[day] || []).length}</span>
              </button>
            ))}
          </div>

          {/* Faculty filter */}
          <div className="flex gap-2 mb-4 flex-wrap items-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Faculty:</span>
            {["All", ...FACULTY_OPTIONS].map(f => (
              <button key={f} onClick={() => setFacultyFilter(f)}
                className={cn("px-2.5 py-1 rounded-lg text-xs font-medium border transition-all",
                  facultyFilter === f ? "bg-blue-600/20 border-blue-500/30 text-blue-300" : "bg-white/5 border-white/10 text-slate-400 hover:text-white")}>
                {f === "All" ? "All" : f.split(" ").slice(-1)[0]}
              </button>
            ))}
            <button onClick={() => setCopyFrom(selectedDay)} className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-emerald-400 text-xs transition-colors"><Copy className="w-3 h-3" />Copy day</button>
            <button onClick={() => setModal({ day: selectedDay, time: "09:15", end: "10:10" })} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 text-xs transition-colors hover:bg-emerald-600/30"><Plus className="w-3 h-3" />Add Period</button>
          </div>

          {/* Slots list */}
          <div className="space-y-2">
            {PERIOD_TIMES.map(({ time, end }) => {
              const slot = (timetable[selectedDay] || []).find(s => s.time === time && (facultyFilter === "All" || s.faculty === facultyFilter));
              const c = slot ? getC(slot.subject) : null;
              const hasConflict = slot && conflicts.has(slot.id);
              return (
                <button key={time} onClick={() => setModal({ day: selectedDay, time, end, slot })}
                  className={cn("w-full rounded-2xl border p-4 flex items-center gap-4 text-left transition-all group",
                    slot ? cn(c!.bg, c!.border, "hover:opacity-90") : "bg-white/[0.02] border-white/5 hover:bg-emerald-500/5 hover:border-emerald-500/20")}>
                  <div className="text-center min-w-[50px] flex-shrink-0">
                    <p className="text-xs font-semibold text-slate-300">{time}</p>
                    <div className="w-px h-3 bg-white/10 mx-auto my-0.5" />
                    <p className="text-[10px] text-slate-500">{end}</p>
                  </div>
                  <div className="w-px bg-white/10 self-stretch" />
                  {slot ? (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        {hasConflict && <span className="text-[10px] text-red-400 font-bold">⚠</span>}
                        <p className={cn("font-semibold text-sm truncate", c!.text)}>{slot.subject}</p>
                        {slot.type === "lab" && <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold uppercase flex-shrink-0">Lab</span>}
                      </div>
                      <p className="text-xs text-slate-400">{slot.faculty}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Room {slot.room}</p>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center gap-2 text-slate-600 group-hover:text-emerald-400 transition-colors text-sm">
                      <Plus className="w-4 h-4" /> Click to add period
                    </div>
                  )}
                  <Edit2 className={cn("w-4 h-4 flex-shrink-0 transition-opacity", slot ? "text-slate-400 opacity-0 group-hover:opacity-100" : "opacity-0")} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Faculty Workload */}
      <div className="mt-6 glass-card p-4 fade-in">
        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">Faculty Workload (periods/week)</p>
        <div className="space-y-2">
          {Object.entries(workload).sort((a, b) => b[1] - a[1]).map(([name, count]) => (
            <div key={name} className="flex items-center gap-3">
              <span className="text-xs text-slate-300 w-36 truncate">{name}</span>
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all" style={{ width: `${Math.min(100, (count / Math.max(...Object.values(workload))) * 100)}%` }} />
              </div>
              <span className="text-xs text-slate-400 w-8 text-right font-mono">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sync banner */}
      <div className="mt-4 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-2 text-xs text-slate-400 fade-in">
        <Wifi className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
        Changes sync instantly to faculty and student timetable pages.
        {lastUpdated && <span className="text-slate-600 ml-auto">Last saved {lastUpdated.toLocaleTimeString()}</span>}
      </div>
    </DashboardLayout>
  );
}

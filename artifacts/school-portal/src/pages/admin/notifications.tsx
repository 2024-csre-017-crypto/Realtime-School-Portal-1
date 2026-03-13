import { useState, useEffect } from "react";
import { Card, Button, Input, Modal } from "@/components/ui-elements";
import { Send, Bell, Users, BookOpen, Trash2, CheckCircle, XCircle, Clock, MessageSquare, ChevronDown } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface Recipient { id: string; name: string; phone: string; class: string; father: string; }
interface NotificationRecord {
  id: number; title: string; message: string; targetType: string;
  targetClass: string | null; recipientCount: number; sentAt: string;
  smsStatus: string; smsError: string | null;
}

export default function AdminNotifications() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetType, setTargetType] = useState<"all" | "class">("all");
  const [targetClass, setTargetClass] = useState("");
  const [classes, setClasses] = useState<string[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: boolean; count: number; smsEnabled: boolean } | null>(null);
  const [history, setHistory] = useState<NotificationRecord[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Load classes + recipient count on target change
  useEffect(() => {
    const params = new URLSearchParams({ targetType });
    if (targetType === "class" && targetClass) params.set("targetClass", targetClass);
    fetch(`/api/admin/notifications/preview?${params}`, { credentials: "include" })
      .then(r => r.json())
      .then(d => { setRecipients(d.students || []); setClasses(d.classes || []); });
  }, [targetType, targetClass]);

  // Load notification history
  const loadHistory = () => {
    fetch("/api/admin/notifications", { credentials: "include" })
      .then(r => r.json())
      .then(d => setHistory(Array.isArray(d) ? d : []));
  };
  useEffect(() => { loadHistory(); }, []);

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) return;
    setSending(true);
    setConfirmOpen(false);
    try {
      const res = await fetch("/api/admin/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, message, targetType, targetClass: targetType === "class" ? targetClass : undefined }),
      });
      const data = await res.json();
      setResult({ sent: true, count: data.recipients, smsEnabled: data.smsEnabled });
      setTitle(""); setMessage(""); setTargetClass("");
      loadHistory();
    } catch {
      setResult({ sent: false, count: 0, smsEnabled: false });
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/admin/notifications/${id}`, { method: "DELETE", credentials: "include" });
    loadHistory();
  };

  const smsStatusBadge = (status: string) => {
    if (status === "sent") return <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400"><CheckCircle className="w-3 h-3" />SMS Sent</span>;
    if (status === "partial") return <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400"><Clock className="w-3 h-3" />Partial</span>;
    if (status === "failed") return <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400"><XCircle className="w-3 h-3" />Failed</span>;
    return <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-white/10 text-muted-foreground"><Bell className="w-3 h-3" />Logged Only</span>;
  };

  const charCount = message.length;
  const smsCount = Math.ceil(charCount / 160) || 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Notifications</h1>
        <p className="text-muted-foreground mt-1">Parents ko SMS ya notification bhejein</p>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Compose Panel */}
        <div className="md:col-span-3 space-y-4">
          <Card className="p-6 space-y-5">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <MessageSquare className="w-5 h-5" /> Notification Compose Karein
            </div>

            {/* Target Selector */}
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Kisey Bhejna Hai?</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { setTargetType("all"); setTargetClass(""); }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    targetType === "all"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20"
                  }`}
                >
                  <Users className="w-4 h-4" /> Sab Students ke Parents
                </button>
                <button
                  onClick={() => setTargetType("class")}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    targetType === "class"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20"
                  }`}
                >
                  <BookOpen className="w-4 h-4" /> Specific Class
                </button>
              </div>
            </div>

            {/* Class Dropdown */}
            {targetType === "class" && (
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Class Select Karein</label>
                <div className="relative">
                  <select
                    value={targetClass}
                    onChange={e => setTargetClass(e.target.value)}
                    className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/60 pr-10"
                  >
                    <option value="">-- Class Chunein --</option>
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Title / Subject</label>
              <Input
                placeholder="e.g. Fee Reminder, Exam Schedule, Holiday Notice"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            {/* Message */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-muted-foreground">Message</label>
                <span className="text-xs text-muted-foreground">{charCount} chars · {smsCount} SMS</span>
              </div>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Parents ke liye message likhen..."
                rows={5}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/60 resize-none"
              />
            </div>

            {/* Recipients Preview */}
            <div
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/8 transition-colors"
              onClick={() => setShowPreview(true)}
            >
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-primary" />
                <span className="font-medium text-white">{recipients.length} parents</span>
                <span className="text-muted-foreground">
                  {targetType === "all" ? "— sab classes" : targetClass ? `— Class ${targetClass}` : "— class select karein"}
                </span>
              </div>
              <span className="text-xs text-primary underline">Preview</span>
            </div>

            {/* Send Button */}
            <Button
              onClick={() => setConfirmOpen(true)}
              disabled={!title.trim() || !message.trim() || (targetType === "class" && !targetClass) || recipients.length === 0}
              className="w-full py-3 text-base"
            >
              <Send className="w-5 h-5" />
              {recipients.length} Parents ko Bhejein
            </Button>

            {result && (
              <div className={`flex items-center gap-3 p-4 rounded-xl text-sm ${result.sent ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border border-red-500/20 text-red-400"}`}>
                {result.sent ? <CheckCircle className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
                <div>
                  {result.sent
                    ? <>Notification save ho gayi — <strong>{result.count} parents</strong> ke liye.
                        {result.smsEnabled ? " SMS bhi bhej diye!" : " (SMS ke liye Twilio configure karein)"}</>
                    : "Kuch error aaya. Dobara try karein."}
                </div>
              </div>
            )}
          </Card>

          {/* Trial account notice */}
          <Card className="p-4 border border-amber-500/30 bg-amber-500/5">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0 text-amber-400 text-lg font-bold">!</div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-amber-300">Twilio Trial Account — Important</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Aapka Twilio account <strong className="text-amber-300">Trial</strong> mode mein hai. Trial mein SMS sirf un numbers ko ja sakta hai jo Twilio console mein <strong>verify</strong> hon.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-white">Parents ke numbers verify karne ka tarika:</strong><br />
                  1. <a href="https://console.twilio.com/us1/develop/phone-numbers/manage/verified" target="_blank" rel="noopener noreferrer" className="text-primary underline">console.twilio.com → Verified Caller IDs</a> par jayein<br />
                  2. Har parent ka Pakistani number add karein (e.g. <code className="text-amber-300">+923001234567</code>)<br />
                  3. OTP se verify karein — phir SMS receive honge
                </p>
                <p className="text-xs text-muted-foreground">
                  Ya Twilio paid plan lein to sab numbers par bina verify ke SMS bhej saktay hain.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* History Panel */}
        <div className="md:col-span-2">
          <Card className="p-4">
            <h2 className="font-semibold mb-4 flex items-center gap-2 text-sm">
              <Bell className="w-4 h-4 text-primary" /> Notification History
            </h2>
            {history.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">
                Abhi koi notification nahi bheji gayi
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {history.map(n => (
                  <div key={n.id} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-sm leading-tight">{n.title}</p>
                      <button onClick={() => handleDelete(n.id)} className="text-muted-foreground hover:text-red-400 transition-colors shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                    <div className="flex items-center justify-between flex-wrap gap-1.5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {n.recipientCount} parents ·{" "}
                        {n.targetType === "class" ? `Class ${n.targetClass}` : "Sab"}
                      </span>
                      {smsStatusBadge(n.smsStatus)}
                    </div>
                    <p className="text-[10px] text-muted-foreground/60">
                      {new Date(n.sentAt).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal isOpen={showPreview} onClose={() => setShowPreview(false)} title={`Recipients (${recipients.length})`}>
        <div className="max-h-80 overflow-y-auto space-y-2">
          {recipients.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">Koi recipient nahi mila</p>
          ) : (
            recipients.map(r => (
              <div key={r.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5">
                <div>
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">Father: {r.father} · Class {r.class}</p>
                </div>
                <p className="text-xs text-primary font-mono">{r.phone}</p>
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Confirm Modal */}
      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm Send">
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white/5 space-y-2">
            <p className="text-sm"><span className="text-muted-foreground">Title:</span> <strong>{title}</strong></p>
            <p className="text-sm"><span className="text-muted-foreground">Target:</span> <strong>{targetType === "all" ? "Sab Students" : `Class ${targetClass}`}</strong></p>
            <p className="text-sm"><span className="text-muted-foreground">Recipients:</span> <strong>{recipients.length} parents</strong></p>
          </div>
          <p className="text-sm text-muted-foreground">Kya aap sure hain? Ye notification bhejne ke baad wapas nahi li ja sakti.</p>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setConfirmOpen(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleSend} isLoading={sending} className="flex-1">
              <Send className="w-4 h-4" /> Haan, Bhejo
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

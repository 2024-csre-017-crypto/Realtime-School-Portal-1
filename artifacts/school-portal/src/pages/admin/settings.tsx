import { useState, useRef } from "react";
import { useSeedData } from "@workspace/api-client-react";
import { Card, Button } from "@/components/ui-elements";
import { Database, AlertTriangle, Upload, FileSpreadsheet, Download, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface ImportResult {
  message: string;
  sheetsFound: string[];
  result: {
    students: { imported: number; skipped: number; errors: string[] };
    teachers: { imported: number; skipped: number; errors: string[] };
    fees: { imported: number; skipped: number; errors: string[] };
  };
}

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const { mutate: seed, isPending: isSeeding } = useSeedData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importError, setImportError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleSeed = () => {
    if (confirm("WARNING: This will replace all data with demo data. Continue?")) {
      seed(undefined, {
        onSuccess: () => {
          alert("Data seeded successfully!");
          queryClient.invalidateQueries();
        },
        onError: () => alert("Failed to seed data."),
      });
    }
  };

  const handleImport = async (file: File) => {
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setImportError("Sirf .xlsx ya .xls file upload karein");
      setImportStatus("error");
      return;
    }

    setImportStatus("uploading");
    setImportResult(null);
    setImportError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/import", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setImportError(data.message || "Import failed");
        setImportStatus("error");
        return;
      }
      setImportResult(data);
      setImportStatus("success");
      queryClient.invalidateQueries();
    } catch {
      setImportError("Network error — server se connect nahi ho saka");
      setImportStatus("error");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImport(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImport(file);
  };

  const handleDownloadTemplate = async () => {
    const res = await fetch("/api/admin/import/template", { credentials: "include" });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "school-portal-template.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">System configuration and data management</p>
      </div>

      {/* ── Excel Import ─────────────────────────────────────────── */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 mt-1 shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
              <h3 className="text-lg font-bold">Excel se Data Import Karo</h3>
              <button
                onClick={handleDownloadTemplate}
                className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Template Download
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              Excel file (.xlsx) upload karo jisme <strong className="text-foreground">Students</strong>,{" "}
              <strong className="text-foreground">Teachers</strong>, aur{" "}
              <strong className="text-foreground">Fees</strong> sheets hon. Data automatically database mein save ho
              jayega.
            </p>

            {/* Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                ${dragOver ? "border-emerald-400 bg-emerald-500/10" : "border-border hover:border-emerald-500/50 hover:bg-emerald-500/5"}
                ${importStatus === "uploading" ? "pointer-events-none" : ""}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleFileChange}
              />

              {importStatus === "uploading" ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
                  <p className="text-sm font-medium text-emerald-400">Import ho raha hai...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">File yahan drop karo ya click karke choose karo</p>
                    <p className="text-xs text-muted-foreground mt-1">.xlsx ya .xls — max 10MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sheet Format Guide */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  sheet: "Students",
                  cols: "ID, Name, Password, Class, Father, Phone, DOB, Address, Roll No",
                },
                {
                  sheet: "Teachers",
                  cols: "ID, Name, Password, Subject, Joining, Salary, Phone, Address, Classes",
                },
                {
                  sheet: "Fees",
                  cols: "Student ID, Month, Amount, Paid, Paid Date",
                },
              ].map(({ sheet, cols }) => (
                <div key={sheet} className="rounded-lg bg-card/50 border border-border p-3">
                  <p className="text-xs font-bold text-emerald-400 mb-1">Sheet: {sheet}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{cols}</p>
                </div>
              ))}
            </div>

            {/* Result */}
            {importStatus === "success" && importResult && (
              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Import Complete! Sheets found: {importResult.sheetsFound.join(", ")}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {(["students", "teachers", "fees"] as const).map((key) => {
                    const r = importResult.result[key];
                    return (
                      <div key={key} className="text-center rounded-lg bg-background/50 p-3">
                        <p className="text-xs text-muted-foreground capitalize mb-1">{key}</p>
                        <p className="text-lg font-bold text-emerald-400">{r.imported}</p>
                        <p className="text-xs text-muted-foreground">imported</p>
                        {r.skipped > 0 && (
                          <p className="text-xs text-yellow-500 mt-0.5">{r.skipped} skipped</p>
                        )}
                      </div>
                    );
                  })}
                </div>
                {(["students", "teachers", "fees"] as const).some(
                  (k) => importResult.result[k].errors.length > 0
                ) && (
                  <div className="text-xs text-yellow-500 space-y-0.5">
                    {(["students", "teachers", "fees"] as const).flatMap((k) =>
                      importResult.result[k].errors.map((e, i) => (
                        <p key={`${k}-${i}`}>⚠ {k}: {e}</p>
                      ))
                    )}
                  </div>
                )}
                <button
                  onClick={() => { setImportStatus("idle"); setImportResult(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dusri file import karo
                </button>
              </div>
            )}

            {importStatus === "error" && (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/5 p-4 flex items-start gap-3">
                <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-400 font-medium">{importError}</p>
                  <button
                    onClick={() => { setImportStatus("idle"); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
                  >
                    Dobara try karo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* ── Demo Data Seed ───────────────────────────────────────── */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500/10 rounded-xl text-red-500 mt-1 shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold">Demo Data Initialize Karo</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Database mein sample students, teachers, fees aur schedules bharo. Sirf testing ke liye use karo.
            </p>
            <Button variant="danger" onClick={handleSeed} isLoading={isSeeding}>
              <AlertTriangle className="w-4 h-4" /> Seed Database
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

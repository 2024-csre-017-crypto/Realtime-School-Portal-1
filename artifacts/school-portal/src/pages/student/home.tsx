import { useRef, useState } from "react";
import { useGetMe, useGetStudent } from "@workspace/api-client-react";
import { Card } from "@/components/ui-elements";
import { User, Phone, MapPin, Hash, BookOpen, Camera, Loader2, CheckCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function StudentHome() {
  const { data: me } = useGetMe();
  const { data: student, isLoading } = useGetStudent(me?.id || "", { query: { enabled: !!me?.id } });
  const queryClient = useQueryClient();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handlePhotoUpload = async (file: File) => {
    if (!me?.id) return;
    setUploading(true);
    setUploadDone(false);

    // Instant local preview
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await fetch(`/api/students/${me.id}/photo`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (res.ok) {
        setUploadDone(true);
        queryClient.invalidateQueries({ queryKey: [`/api/students/${me.id}`] });
        setTimeout(() => setUploadDone(false), 3000);
      }
    } catch {
      setPhotoPreview(null);
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-white/10 rounded w-1/2" />
      <div className="h-48 bg-white/10 rounded-2xl" />
    </div>
  );
  if (!student) return <div>Profile not found.</div>;

  const photoSrc = photoPreview || (student as any).photo
    ? photoPreview || `${(student as any).photo}`
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">
          Welcome back, {student.name.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground mt-1">Here's your student profile overview.</p>
      </div>

      <Card className="p-6 md:p-8 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">

          {/* Profile Photo */}
          <div className="relative shrink-0 group">
            <div className="w-28 h-28 rounded-full overflow-hidden shadow-2xl shadow-primary/30 ring-4 ring-primary/20">
              {photoSrc ? (
                <img src={photoSrc} alt={student.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center text-4xl font-bold text-white">
                  {student.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Upload overlay */}
            <button
              onClick={() => photoInputRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 rounded-full flex flex-col items-center justify-center gap-1
                bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              {uploading ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : (
                <>
                  <Camera className="w-6 h-6 text-white" />
                  <span className="text-[10px] text-white font-medium">Photo Change</span>
                </>
              )}
            </button>

            {/* Success tick */}
            {uploadDone && (
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}

            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f); }}
            />
          </div>

          {/* Info Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                <User className="w-4 h-4" /> Full Name
              </p>
              <p className="font-semibold text-lg">{student.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4" /> Class
              </p>
              <p className="font-semibold text-lg">{student.class}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                <Hash className="w-4 h-4" /> Roll No
              </p>
              <p className="font-semibold text-lg">{student.rollNo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                <User className="w-4 h-4" /> Father's Name
              </p>
              <p className="font-semibold text-lg">{student.father}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                <Phone className="w-4 h-4" /> Phone
              </p>
              <p className="font-semibold text-lg">{student.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4" /> Address
              </p>
              <p className="font-semibold text-lg">{student.address}</p>
            </div>
          </div>
        </div>

        {/* Upload hint */}
        <p className="relative z-10 text-xs text-muted-foreground mt-6 flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5" />
          Profile photo change karne ke liye photo par hover karo
        </p>
      </Card>
    </div>
  );
}

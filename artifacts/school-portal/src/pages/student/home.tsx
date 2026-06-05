import { useRef, useState, useCallback } from "react";
import { useGetMe, useGetStudent } from "@workspace/api-client-react";
import { Card, Button } from "@/components/ui-elements";
import { User, Phone, MapPin, Hash, BookOpen, Camera, Loader2, CheckCircle, CalendarRange, ZoomIn, ZoomOut, RotateCw, Check, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";

async function getCroppedBlob(imageSrc: string, croppedAreaPixels: Area): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", reject);
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  const size = Math.min(croppedAreaPixels.width, croppedAreaPixels.height, 512);
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    size,
    size,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas toBlob failed"));
    }, "image/jpeg", 0.92);
  });
}

export default function StudentHome() {
  const { data: me } = useGetMe();
  const { data: student, isLoading } = useGetStudent(me?.id || "", { query: { enabled: !!me?.id } });
  const queryClient = useQueryClient();
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, cap: Area) => {
    setCroppedAreaPixels(cap);
  }, []);

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCropSrc(url);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  const cancelCrop = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  };

  const confirmCrop = async () => {
    if (!cropSrc || !croppedAreaPixels || !me?.id) return;
    setUploading(true);
    setUploadDone(false);

    try {
      const blob = await getCroppedBlob(cropSrc, croppedAreaPixels);
      URL.revokeObjectURL(cropSrc);
      setCropSrc(null);

      const localUrl = URL.createObjectURL(blob);
      setPhotoPreview(localUrl);

      const formData = new FormData();
      formData.append("photo", blob, "photo.jpg");
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

  const photoSrc = photoPreview || (student as any).photo || null;

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
                  <span className="text-[10px] text-white font-medium">Change Photo</span>
                </>
              )}
            </button>

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
              onChange={handleFileSelected}
            />
          </div>

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
            {(student as any).session && (
              <div className="col-span-1 sm:col-span-2">
                <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                  <CalendarRange className="w-4 h-4" /> Session
                </p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold
                  bg-gradient-to-r from-violet-600/30 to-cyan-600/30 text-violet-300 border border-violet-500/30">
                  <CalendarRange className="w-4 h-4" />
                  {(student as any).session}
                </span>
              </div>
            )}
          </div>
        </div>

        <p className="relative z-10 text-xs text-muted-foreground mt-6 flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5" />
          Hover over photo to change it — crop and zoom before saving
        </p>
      </Card>

      {cropSrc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-card/90 border-b border-white/10 flex-shrink-0">
            <h2 className="font-display font-bold text-lg">Edit Photo</h2>
            <button onClick={cancelCrop} className="text-muted-foreground hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative flex-1 min-h-0">
            <Cropper
              image={cropSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              style={{
                containerStyle: { background: "#0a0a0f" },
              }}
            />
          </div>

          <div className="flex-shrink-0 px-6 py-4 bg-card/90 border-t border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <ZoomOut className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={e => setZoom(Number(e.target.value))}
                className="flex-1 accent-primary h-2 cursor-pointer"
              />
              <ZoomIn className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-muted-foreground w-8 text-right">{zoom.toFixed(1)}×</span>
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" onClick={cancelCrop} className="flex-1">
                <X className="w-4 h-4" /> Cancel
              </Button>
              <Button onClick={confirmCrop} className="flex-1" isLoading={uploading}>
                <Check className="w-4 h-4" /> Save Photo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

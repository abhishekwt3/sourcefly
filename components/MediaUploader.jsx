"use client";

import { useRef, useState } from "react";
import { COLORS } from "@/lib/theme";

async function getAuthParams() {
  const res = await fetch("/api/imagekit/auth");
  if (!res.ok) throw new Error("Could not get upload auth");
  return await res.json();
}

async function uploadToImageKit(file) {
  const { token, expire, signature } = await getAuthParams();
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  if (!publicKey) throw new Error("ImageKit public key missing");

  const fd = new FormData();
  fd.append("file", file);
  fd.append("fileName", file.name || "upload");
  fd.append("publicKey", publicKey);
  fd.append("token", token);
  fd.append("expire", String(expire));
  fd.append("signature", signature);
  fd.append("folder", "/kendra");

  const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    body: fd,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Upload failed");
  return data.url;
}

export default function MediaUploader({ kind, urls, onChange, max }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const accept = kind === "video" ? "video/*" : "image/*";

  const onPick = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, max - urls.length);
    if (!files.length) return;
    setBusy(true);
    setError(null);
    try {
      const uploaded = [];
      for (const f of files) {
        const url = await uploadToImageKit(f);
        uploaded.push(url);
      }
      onChange([...urls, ...uploaded]);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (i) => onChange(urls.filter((_, x) => x !== i));

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 mb-2">
        {urls.map((u, i) => (
          <div
            key={u + i}
            className="relative aspect-square rounded-xl overflow-hidden"
            style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}` }}
          >
            {kind === "video" ? (
              <video src={u} className="w-full h-full object-cover" muted playsInline />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={u} alt="" className="w-full h-full object-cover" />
            )}
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-1 right-1 w-6 h-6 rounded-full text-xs font-bold"
              style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}
            >
              ×
            </button>
          </div>
        ))}
        {urls.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="aspect-square rounded-xl flex items-center justify-center text-xs"
            style={{
              background: COLORS.surface,
              border: `1px dashed ${COLORS.border2}`,
              color: COLORS.muted,
            }}
          >
            {busy ? "Uploading…" : "+ Add"}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={max > 1}
        onChange={onPick}
        className="hidden"
      />
      {error && (
        <p className="text-xs" style={{ color: "#C0392B" }}>
          {error}
        </p>
      )}
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { COLORS } from "@/lib/theme";

export default function SupplierMedia({ video, photos = [] }) {
  const ref = useRef(null);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);

  const slides = [
    ...(video?.url ? [{ kind: "video", ...video }] : []),
    ...photos.map((src) => ({ kind: "photo", src })),
  ];

  if (slides.length === 0) return null;

  const handleScroll = () => {
    const el = ref.current;
    if (!el) return;
    const next = Math.round(el.scrollLeft / el.offsetWidth);
    if (next !== idx) {
      setIdx(next);
      // pause the video if user swipes away from slide 0
      if (playing && next !== 0) setPlaying(false);
    }
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{ background: COLORS.surface2 }}
    >
      <div
        ref={ref}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-full snap-center"
            style={{ aspectRatio: "16 / 10" }}
          >
            {slide.kind === "video" ? (
              playing && i === 0 ? (
                <video
                  src={slide.url}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  className="w-full h-full block relative"
                  aria-label="Play factory walkthrough"
                >
                  {slide.thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={slide.thumbnail}
                      alt=""
                      loading="eager"
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  )}
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: "rgba(12,11,9,0.25)" }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                      style={{ background: "rgba(255,255,255,0.95)" }}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill={COLORS.onAccent}>
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  {slide.duration && (
                    <span
                      className="absolute bottom-3 left-3 px-2 py-1 rounded text-xs font-medium"
                      style={{ background: "rgba(12,11,9,0.7)", color: "#fff" }}
                    >
                      ▶ {slide.duration}
                    </span>
                  )}
                </button>
              )
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={slide.src}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover"
                draggable={false}
              />
            )}
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <div
          className="absolute bottom-3 right-3 px-2 py-1 rounded-full text-xs font-medium pointer-events-none"
          style={{
            background: "rgba(12,11,9,0.6)",
            color: "#fff",
            backdropFilter: "blur(6px)",
          }}
        >
          {idx + 1} / {slides.length}
        </div>
      )}
    </div>
  );
}

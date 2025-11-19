import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carrega os vídeos do backend
  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();
        setVideos(data);
      } catch (err) {
        console.error("Erro ao carregar vídeos:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="w-full text-center py-10 text-gray-300 text-lg">
        Carregando vídeos...
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="w-full text-center py-10 text-gray-400">
        Nenhum vídeo encontrado no banco.
        <br />
        <span className="text-sm">
          (Insira via D1 Console ou API)
        </span>
      </div>
    );
  }

  return (
    <div className="grid gap-5 px-3 pb-10
      sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

      {videos.map((v) => (
        <Link
          key={v.id}
          to={`/watch/${v.id}`}
          className="block group"
        >
          {/* Thumbnail */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black/30">
            <img
              src={v.thumbnail_url}
              alt={v.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Duração no canto */}
            {v.duration_seconds && (
              <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-2 py-[2px] rounded">
                {formatDuration(v.duration_seconds)}
              </div>
            )}
          </div>

          {/* Título */}
          <h2 className="mt-2 text-sm font-semibold text-gray-100 line-clamp-2">
            {v.title}
          </h2>

          {/* Canal + views */}
          <p className="text-xs text-gray-400 mt-1">
            {v.channel_name || "Canal desconhecido"} · {formatViews(v.views)}
          </p>
        </Link>
      ))}
    </div>
  );
}

// ------- Utils -------

// Ex: 125 → "2:05"
function formatDuration(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Ex: 12200 → "12K views"
function formatViews(v) {
  if (!v) return "0 views";
  if (v < 1000) return `${v} views`;
  if (v < 1_000_000) return `${(v / 1000).toFixed(1)}K views`;
  return

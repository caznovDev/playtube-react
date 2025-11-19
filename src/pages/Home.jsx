import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchVideos() {
      try {
        const res = await fetch("/api/videos");
        const data = await res.json();
        if (!cancelled) {
          setVideos(data);
        }
      } catch (error) {
        console.error("Erro ao carregar vídeos:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchVideos();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Header />
        <SkeletonGrid />
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="space-y-4">
        <Header />
        <div className="flex justify-center py-10 text-center text-sm text-gray-400">
          <div>
            Nenhum vídeo encontrado.
            <br />
            <span className="text-xs text-gray-500">
              Insira vídeos na tabela <code>videos</code> do D1.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Header />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {videos.map((video) => (
          <Link
            key={video.id}
            to={`/watch/${video.id}`}
            className="group flex flex-col"
          >
            <div className="relative aspect-video overflow-hidden rounded-xl bg-neutral-900">
              {video.thumbnail_url && (
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
              {typeof video.duration_seconds === "number" && (
                <div className="absolute bottom-1 right-1 rounded bg-black/75 px-1.5 py-0.5 text-[0.7rem] font-medium text-gray-100">
                  {formatDuration(video.duration_seconds)}
                </div>
              )}
            </div>
            <div className="mt-2 space-y-1">
              <h2 className="text-sm font-semibold leading-snug text-gray-100">
                {video.title}
              </h2>
              <p className="text-xs text-gray-400">
                {(video.channel_name || "Canal desconhecido") +
                  " · " +
                  formatViews(video.views)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="flex items-center justify-between gap-2">
      <h1 className="text-lg font-semibold">Explorar vídeos</h1>
    </div>
  );
}

function SkeletonGrid() {
  const items = Array.from({ length: 8 });

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {items.map((_, index) => (
        <div key={index} className="flex flex-col">
          <div className="aspect-video rounded-xl bg-neutral-900/80 animate-pulse" />
          <div className="mt-2 space-y-1">
            <div className="h-3 w-4/5 rounded-full bg-neutral-800 animate-pulse" />
            <div className="h-3 w-1/2 rounded-full bg-neutral-900 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDuration(seconds) {
  if (!seconds && seconds !== 0) return "";
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  const padded = rest.toString().padStart(2, "0");
  return `${minutes}:${padded}`;
}

function formatViews(value) {
  if (!value) return "0 views";
  if (value < 1000) return `${value} views`;
  if (value < 1_000_000) return `${(value / 1000).toFixed(1)}K views`;
  return `${(value / 1_000_000).toFixed(1)}M views`;
}

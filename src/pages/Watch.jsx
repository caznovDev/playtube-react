import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Watch() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchVideo() {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await fetch(`/api/videos/${id}`);
        if (res.status === 404) {
          if (!cancelled) {
            setNotFound(true);
            setVideo(null);
          }
          return;
        }
        const data = await res.json();
        if (!cancelled) {
          setVideo(data);
        }
      } catch (error) {
        console.error("Erro ao carregar vídeo:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchVideo();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-3 px-2">
        <div className="aspect-video rounded-xl bg-neutral-900 animate-pulse" />
        <div className="h-4 w-2/3 rounded-full bg-neutral-800 animate-pulse" />
        <div className="h-3 w-1/3 rounded-full bg-neutral-900 animate-pulse" />
      </div>
    );
  }

  if (notFound || !video) {
    return (
      <div className="flex justify-center py-10 text-sm text-gray-400">
        Vídeo não encontrado.
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 px-2">
      <div className="w-full">
        <video
          className="aspect-video w-full rounded-xl bg-black"
          src={video.video_url}
          controls
          autoPlay
        />
      </div>

      <div>
        <h1 className="text-lg font-semibold text-gray-100">
          {video.title}
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          {(video.channel_name || "Canal desconhecido") +
            " · " +
            formatViews(video.views)}
        </p>
        {video.description && (
          <p className="mt-3 whitespace-pre-wrap text-sm text-gray-200">
            {video.description}
          </p>
        )}
      </div>
    </div>
  );
}

function formatViews(value) {
  if (!value) return "0 views";
  if (value < 1000) return `${value} views`;
  if (value < 1_000_000) return `${(value / 1000).toFixed(1)}K views`;
  return `${(value / 1_000_000).toFixed(1)}M views`;
}

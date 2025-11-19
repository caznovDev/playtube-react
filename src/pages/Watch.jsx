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
        if (!cancelled) setVideo(data);
      } catch (err) {
        console.error("Erro ao carregar vídeo:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchVideo();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="watch-container">
        <div className="video-thumb skeleton-thumb" />
        <div className="skeleton-line" style={{ marginTop: "1rem" }} />
        <div className="skeleton-line" style={{ width: "40%" }} />
      </div>
    );
  }

  if (notFound || !video) {
    return (
      <div className="watch-container">
        <p style={{ color: "#9ca3af" }}>Vídeo não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="watch-container">
      <video
        className="watch-player"
        src={video.video_url}
        controls
        autoPlay
      />

      <h1 className="watch-title">{video.title}</h1>

      <div className="watch-meta">
        {video.channel_name || "Canal desconhecido"} ·{" "}
        {formatViews(video.views)}{" "}
      </div>

      {video.description && (
        <div className="watch-description">{video.description}</div>
      )}
    </div>
  );
}

function formatViews(v) {
  if (!v) return "0 views";
  if (v < 1000) return `${v} views`;
  if (v < 1_000_000) return `${(v / 1000).toFixed(1)}K views`;
  return `${(v / 1_000_000).toFixed(1)}M views`;
}

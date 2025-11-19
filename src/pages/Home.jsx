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
    return <SkeletonGrid />;
  }

  if (!videos.length) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "2.5rem 0",
          color: "#9ca3af",
          fontSize: "0.9rem",
        }}
      >
        Nenhum vídeo encontrado.
        <br />
        <span style={{ fontSize: "0.8rem" }}>
          (Insira vídeos na tabela "videos" do D1)
        </span>
      </div>
    );
  }

  return (
    <div>
      <div className="home-header">
        <div className="home-title">Explorar vídeos</div>
      </div>

      <div className="video-grid">
        {videos.map((video) => (
          <Link
            key={video.id}
            to={`/watch/${video.id}`}
            className="video-card"
          >
            <div className="video-thumb">
              {video.thumbnail_url && (
                <img src={video.thumbnail_url} alt={video.title} />
              )}
              {typeof video.duration_seconds === "number" && (
                <div className="video-duration">
                  {formatDuration(video.duration_seconds)}
                </div>
              )}
            </div>

            <div className="video-title">{video.title}</div>

            <div className="video-meta">
              {(video.channel_name || "Canal desconhecido") +
                " · " +
                formatViews(video.views)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* -------- Skeleton ---------- */

function SkeletonGrid() {
  const placeholders = Array.from({ length: 8 });

  return (
    <div className="video-grid">
      {placeholders.map((_, index) => (
        <div key={index} className="video-card">
          <div className="video-thumb skeleton-thumb" />
          <div className="skeleton-line" />
          <div
            className="skeleton-line"
            style={{ width: "60%" }}
          />
        </div>
      ))}
    </div>
  );
}

/* -------- Utils ---------- */

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

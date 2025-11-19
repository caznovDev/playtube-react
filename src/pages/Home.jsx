import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const LIMIT = 12;

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("recent");
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchVideos() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(LIMIT));
        params.set("sort", sort);

        const res = await fetch("/api/videos?" + params.toString());
        const data = await res.json();

        if (cancelled) return;

        setVideos(data);
        setHasMore(data.length === LIMIT);
      } catch (err) {
        console.error("Erro ao carregar vídeos:", err);
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
  }, [page, sort]);

  const handlePrev = () => {
    if (page > 1 && !loading) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setPage(1);
  };

  return (
    <div>
      {/* Cabeçalho / filtros */}
      <div className="home-header">
        <div className="home-title">Explorar vídeos</div>
        <div className="home-filters">
          <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
            Ordenar por:
          </span>
          <select
            className="select"
            value={sort}
            onChange={handleSortChange}
          >
            <option value="recent">Mais recentes</option>
            <option value="popular">Mais vistos</option>
            <option value="random">Aleatório</option>
          </select>

          <button
            className="btn"
            type="button"
            onClick={handlePrev}
            disabled={page === 1 || loading}
          >
            ◀ Anterior
          </button>
          <button
            className="btn"
            type="button"
            onClick={handleNext}
            disabled={!hasMore || loading}
          >
            Próxima ▶
          </button>

          <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
            Página {page}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      {loading ? (
        <SkeletonGrid />
      ) : videos.length === 0 ? (
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
      ) : (
        <div className="video-grid">
          {videos.map((video) => (
            <Link
              key={video.id}
              to={`/watch/${video.id}`}
              className="video-card"
            >
              <div className="video-thumb">
                {video.thumbnail_url && (
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                  />
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
      )}
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
}    fetchVideos();

    return () => {
      cancelled = true;
    };
  }, [page, sort]);

  const handlePrev = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (hasMore) setPage((p) => p + 1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  return (
    <div>
      {/* Cabeçalho / filtros */}
      <div className="home-header">
        <div className="home-title">Explorar vídeos</div>

        <div className="home-filters">
          <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Ordenar por:</span>
          <select
            className="select"
            value={sort}
            onChange={handleSortChange}
          >
            <option value="recent">Mais recentes</option>
            <option value="popular">Mais vistos</option>
            <option value="random">Aleatório</option>
          </select>

          <button
            className="btn"
            onClick={handlePrev}
            disabled={page === 1 || loading}
          >
            ◀ Anterior
          </button>
          <button
            className="btn"
            onClick={handleNext}
            disabled={!hasMore || loading}
          >
            Próxima ▶
          </button>

          <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
            Página {page}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      {loading ? (
        <SkeletonGrid />
      ) : videos.length === 0 ? (
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
            Insira vídeos na tabela <code>videos</code> do D1.
          </span>
        </div>
      ) : (
        <div className="video-grid">
          {videos.map((v) => (
            <Link
              key={v.id}
              to={`/watch/${v.id}`}
              className="video-card"
            >
              <div className="video-thumb">
                {v.thumbnail_url && (
                  <img src={v.thumbnail_url} alt={v.title} />
                )}

                {v.duration_seconds != null && (
                  <div className="video-duration">
                    {formatDuration(v.duration_seconds)}
                  </div>
                )}
              </div>

              <div className="video-title">{v.title}</div>

              <div className="video-meta">
                {v.channel_name || "Canal desconhecido"} ·{" "}
                {formatViews(v.views)}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------- Skeleton ---------- */

function SkeletonGrid() {
  const placeholders = Array.from({ length: 8 });

  return (
    <div className="video-grid">
      {placeholders.map((_, idx) => (
        <div key={idx} className="video-card">
          <div className="video-thumb skeleton-thumb" />
          <div className="skeleton-line" />
          <div className="skeleton-line" style={{ width: "60%" }} />
        </div>
      ))}
    </div>
  );
}

/* -------- Utils ---------- */

function formatDuration(sec) {
  if (!sec && sec !== 0) return "";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatViews(v) {
  if (!v) return "0 views";
  if (v < 1000) return `${v} views`;
  if (v < 1_000_000) return `${(v / 1000).toFixed(1)}K views`;
  return `${(v / 1_000_000).toFixed(1)}M views`;
      }        <span className="text-sm">
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

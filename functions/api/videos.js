export async function onRequest(context) {
  const db = context.env.DB;
  const url = new URL(context.request.url);

  // Pagination segura
  const page = Math.max(parseInt(url.searchParams.get("page") || "1", 10), 1);
  const limitRaw = parseInt(url.searchParams.get("limit") || "20", 10);
  // limite máximo para evitar DOS
  const limit = Math.min(Math.max(limitRaw, 1), 50);
  const offset = (page - 1) * limit;

  // Ordenação: whitelist
  const sortParam = (url.searchParams.get("sort") || "recent").toLowerCase();
  let orderBy;
  switch (sortParam) {
    case "popular":
      orderBy = "v.views DESC";
      break;
    case "oldest":
      orderBy = "v.created_at ASC";
      break;
    case "random":
      orderBy = "RANDOM()";
      break;
    case "recent":
    default:
      orderBy = "v.created_at DESC";
      break;
  }

  // Filtro por model (id ou slug)
  const modelIdParam = url.searchParams.get("model_id");
  const modelSlugParam = url.searchParams.get("model_slug");

  const whereClauses = [];
  const params = [];

  if (modelIdParam) {
    whereClauses.push("v.model_id = ?");
    params.push(parseInt(modelIdParam, 10));
  }

  if (modelSlugParam) {
    whereClauses.push("m.slug = ?");
    params.push(modelSlugParam);
  }

  const whereSql =
    whereClauses.length > 0 ? "WHERE " + whereClauses.join(" AND ") : "";

  const sql = `
    SELECT
      v.id,
      v.slug,
      v.title,
      v.thumbnail_url,
      v.video_url,
      v.views,
      v.duration_seconds,
      v.created_at,
      m.id AS model_id,
      m.slug AS model_slug,
      m.display_name AS model_name,
      m.avatar_url AS model_avatar
    FROM videos v
    LEFT JOIN models m ON v.model_id = m.id
    ${whereSql}
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `;

  params.push(limit, offset);

  try {
    const { results } = await db.prepare(sql).bind(...params).all();

    return Response.json({
      page,
      limit,
      count: results.length,
      items: results,
    });
  } catch (err) {
    console.error("Error in GET /api/videos:", err);
    return new Response("Internal error", { status: 500 });
  }
}

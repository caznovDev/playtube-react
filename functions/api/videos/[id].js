export async function onRequest(context) {
  const db = context.env.DB;
  const { id } = context.params;

  const numericId = parseInt(id, 10);
  if (Number.isNaN(numericId)) {
    return new Response("Invalid id", { status: 400 });
  }

  const sql = `
    SELECT
      v.id,
      v.slug,
      v.title,
      v.description,
      v.thumbnail_url,
      v.video_url,
      v.views,
      v.duration_seconds,
      v.created_at,
      m.id AS model_id,
      m.slug AS model_slug,
      m.display_name AS model_name,
      m.avatar_url AS model_avatar,
      m.banner_url AS model_banner,
      m.bio AS model_bio
    FROM videos v
    LEFT JOIN models m ON v.model_id = m.id
    WHERE v.id = ?
    LIMIT 1
  `;

  try {
    const { results } = await db.prepare(sql).bind(numericId).all();

    if (!results || results.length === 0) {
      return new Response("Not found", { status: 404 });
    }

    return Response.json(results[0]);
  } catch (err) {
    console.error("Error in GET /api/videos/:id", err);
    return new Response("Internal error", { status: 500 });
  }
}

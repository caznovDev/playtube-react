export async function onRequest(context) {
  const db = context.env.DB;
  const url = new URL(context.request.url);

  const limitRaw = parseInt(url.searchParams.get("limit") || "20", 10);
  const limit = Math.min(Math.max(limitRaw, 1), 50);

  const sql = `
    SELECT
      v.id,
      v.slug,
      v.title,
      v.thumbnail_url,
      v.video_url,
      v.channel_name,
      v.views,
      v.duration_seconds,
      v.description,
      v.model_id,
      v.created_at,
      m.slug         AS model_slug,
      m.display_name AS model_name,
      m.avatar_url   AS model_avatar
    FROM videos v
    LEFT JOIN models m ON v.model_id = m.id
    ORDER BY v.views DESC, v.created_at DESC
    LIMIT ?
  `;

  try {
    const { results } = await db.prepare(sql).bind(limit).all();
    return Response.json({
      limit,
      count: results.length,
      items: results
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "DB error in /api/trending", detail: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function onRequest(context) {
  const db = context.env.DB;
  const { id } = context.params;
  const url = new URL(context.request.url);

  const numericId = parseInt(id, 10);
  if (Number.isNaN(numericId)) {
    return new Response("Invalid id", { status: 400 });
  }

  const page = Math.max(parseInt(url.searchParams.get("page") || "1", 10), 1);
  const limitRaw = parseInt(url.searchParams.get("limit") || "20", 10);
  const limit = Math.min(Math.max(limitRaw, 1), 50);
  const offset = (page - 1) * limit;

  try {
    const modelSql = `
      SELECT
        id,
        slug,
        display_name,
        avatar_url,
        banner_url,
        bio,
        created_at
      FROM models
      WHERE id = ?
      LIMIT 1
    `;
    const modelRes = await db.prepare(modelSql).bind(numericId).all();
    if (!modelRes.results || modelRes.results.length === 0) {
      return new Response("Not found", { status: 404 });
    }
    const model = modelRes.results[0];

    const videosSql = `
      SELECT
        id,
        slug,
        title,
        thumbnail_url,
        video_url,
        channel_name,
        views,
        duration_seconds,
        description,
        model_id,
        created_at
      FROM videos
      WHERE model_id = ?
      ORDER BY created_at DESC, id DESC
      LIMIT ? OFFSET ?
    `;
    const videosRes = await db
      .prepare(videosSql)
      .bind(numericId, limit, offset)
      .all();

    return Response.json({
      model,
      videos: {
        page,
        limit,
        count: videosRes.results.length,
        items: videosRes.results,
      },
    });
  } catch (err) {
    console.error("Error in GET /api/models/:id", err);
    return new Response("Internal error", { status: 500 });
  }
}

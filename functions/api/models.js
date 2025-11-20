export async function onRequest(context) {
  const db = context.env.DB;
  const url = new URL(context.request.url);

  const page = Math.max(parseInt(url.searchParams.get("page") || "1", 10), 1);
  const limitRaw = parseInt(url.searchParams.get("limit") || "20", 10);
  const limit = Math.min(Math.max(limitRaw, 1), 50);
  const offset = (page - 1) * limit;

  const sql = `
    SELECT
      id,
      slug,
      display_name,
      avatar_url,
      banner_url,
      bio,
      created_at
    FROM models
    ORDER BY created_at DESC, id DESC
    LIMIT ? OFFSET ?
  `;

  try {
    const { results } = await db.prepare(sql).bind(limit, offset).all();

    return Response.json({
      page,
      limit,
      count: results.length,
      items: results,
    });
  } catch (err) {
    console.error("Error in GET /api/models:", err);
    return new Response("Internal error", { status: 500 });
  }
}

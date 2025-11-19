export async function onRequest(context) {
  const db = context.env.DB;
  const { id } = context.params;

  const query = `
    SELECT
      id,
      title,
      thumbnail_url,
      video_url,
      channel_name,
      views,
      description
    FROM videos
    WHERE id = ?
  `;

  const { results } = await db.prepare(query).bind(id).all();

  if (!results || results.length === 0) {
    return new Response("Not found", { status: 404 });
  }

  return Response.json(results[0]);
}

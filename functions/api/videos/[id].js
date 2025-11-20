export async function onRequest(context) {
  const db = context.env.DB;
  const { id } = context.params;
  const num = parseInt(id, 10);
  if (Number.isNaN(num)) return new Response("Invalid id", { status: 400 });

  const sql = `
    SELECT v.id, v.slug, v.title, v.thumbnail_url, v.video_url,
           v.channel_name, v.views, v.duration_seconds, v.description,
           v.model_id, v.created_at,
           m.id AS model_id_real, m.slug AS model_slug,
           m.display_name AS model_name, m.avatar_url AS model_avatar,
           m.banner_url AS model_banner, m.bio AS model_bio,
           m.created_at AS model_created_at
    FROM videos v
    LEFT JOIN models m ON v.model_id = m.id
    WHERE v.id = ?
    LIMIT 1
  `;
  try {
    const { results } = await db.prepare(sql).bind(num).all();
    if (!results.length) return new Response("Not found", { status:404});
    return Response.json(results[0]);
  } catch (err) {
    return new Response(JSON.stringify({error:"DB error", detail:String(err)}),
                        {status:500,headers:{"Content-Type":"application/json"}});
  }
}
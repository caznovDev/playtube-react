export async function onRequest(context) {
  const db = context.env.DB;
  const url = new URL(context.request.url);

  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = Math.min(
    Math.max(parseInt(url.searchParams.get("limit") || "12", 10), 1),
    50
  );
  const sort = url.searchParams.get("sort") || "recent";

  const offset = (page - 1) * limit;

  let orderBy;
  switch (sort) {
    case "popular":
      orderBy = "views DESC";
      break;
    case "random":
      orderBy = "RANDOM()";
      break;
    case "recent":
    default:
      orderBy = "id DESC";
      break;
  }

  // IMPORTANTE: não selecionar colunas que não existam no seu schema
  const query = `
    SELECT
      id,
      title,
      thumbnail_url,
      video_url,
      channel_name,
      views
    FROM videos
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `;

  const { results } = await db.prepare(query).bind(limit, offset).all();

  return Response.json(results);
}

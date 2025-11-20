export async function onRequest(context) {
  let hasDB = false;
  let error = null;

  try {
    hasDB = !!context.env.DB;
    if (!hasDB) {
      throw new Error("DB binding not found on context.env");
    }

    // tentamos só um SELECT 1 pra ver se conecta
    const { results } = await context.env.DB.prepare("SELECT 1 AS x").all();
    return Response.json({
      ok: true,
      hasDB,
      testQuery: results,
    });
  } catch (err) {
    error = String(err);
    return Response.json(
      {
        ok: false,
        hasDB,
        error,
      },
      { status: 500 }
    );
  }
}

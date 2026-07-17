export const GET = Run.GET((context, next) => {
  // Params come from the URL — always strings. Parse, then decide.
  const idNum = Number(context.params.id);

  if (Number.isNaN(idNum)) {
    return new Response("No such product", { status: 404 });
  }

  return next();
});

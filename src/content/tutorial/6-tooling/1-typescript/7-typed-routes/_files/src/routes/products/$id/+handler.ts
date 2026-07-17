export const GET = Run.GET((context, next) => {
  // Params come from the URL — what type is `id`?
  const idNum: number = context.params.id;

  if (Number.isNaN(idNum)) {
    return new Response("No such product", { status: 404 });
  }

  return next();
});

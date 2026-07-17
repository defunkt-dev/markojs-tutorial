export const GET = Run.GET((context) => {
  return Response.json({
    ok: true,
    method: context.method,
    path: context.url.pathname,
  });
});

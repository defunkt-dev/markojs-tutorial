export default Run.ALL(async (context, next) => {
  const required = context.meta && context.meta.requiresRole;
  if (required && context.url.searchParams.get("role") !== required) {
    return new Response(`Requires role: ${required}`, { status: 403 });
  }
  return next();
});

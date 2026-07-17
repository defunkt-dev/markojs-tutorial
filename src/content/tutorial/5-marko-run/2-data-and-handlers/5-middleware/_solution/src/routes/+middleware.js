export default Run.ALL(async (context, next) => {
  const started = Date.now();
  const response = await next();
  console.log(`${context.method} ${context.url.pathname} — ${Date.now() - started}ms`);
  return response;
});

export default Run.ALL(async (context, next) => {
  // Time the request: note Date.now(), await next(), log method,
  // pathname, and elapsed ms. Return the response.
  return next();
});

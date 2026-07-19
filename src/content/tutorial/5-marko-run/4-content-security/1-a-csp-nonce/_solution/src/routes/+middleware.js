export default Run.ALL((context, next) => {
  context.cspNonce = crypto.randomUUID();
  return next();
});

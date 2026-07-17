export default Run.ALL(async (context, next) => {
  context.tenant = "acme";
  return next();
});

export default Run.ALL(async (context, next) => {
  context.tenant = "acme";
  context.serializedGlobals = ["tenant"];
  return next();
});

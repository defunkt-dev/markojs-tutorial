export default Run.ALL(async (context, next) => {
  // Reject requests without ?key=letmein with a 403 Response.
  return next();
});

export default Run.ALL(async (context, next) => {
  if (context.url.searchParams.get("key") !== "letmein") {
    return new Response("Forbidden", { status: 403 });
  }
  console.log("admin gate passed");
  return next();
});

export default Run.ALL((context, next) => {
  // TODO: give this request a nonce. Set context.cspNonce to a unique,
  // unpredictable value (crypto.randomUUID() is perfect) — Marko reads
  // $global.cspNonce and stamps it onto every script and style it renders.
  return next();
});

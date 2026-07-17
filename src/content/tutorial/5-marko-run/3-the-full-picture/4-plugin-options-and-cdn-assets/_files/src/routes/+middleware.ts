declare global {
  // eslint-disable-next-line no-var
  var __MY_ASSET_BASE_PATH__: string;
}

// Pretend this URL came back from uploading dist/ to your CDN:
// globalThis.__MY_ASSET_BASE_PATH__ = "https://cdn.example.com/uploads/abc123/";

export default async function (context: Run.Context, next: Run.NextFunction) {
  return await next();
}

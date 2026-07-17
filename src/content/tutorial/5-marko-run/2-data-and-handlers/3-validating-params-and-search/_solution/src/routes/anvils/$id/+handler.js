export const GET = Run.GET(
  {
    params(value) {
      return { id: Number(value.id) };
    },
    search(value) {
      return { page: Number(value.page) || 0 };
    },
  },
  (context, next) => {
    return next();
  },
);

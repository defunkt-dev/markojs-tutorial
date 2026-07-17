const subscribers = [];

export const GET = Run.GET((context, next) => {
  return next({ count: subscribers.length });
});

export const POST = Run.POST(
  {
    form(value) {
      return { name: String(value.name || "").trim() };
    },
  },
  async (context, next) => {
    const { name } = await context.body;
    if (!name) return next({ error: "Name required", count: subscribers.length });
    subscribers.push(name);
    return next({ welcomed: name, count: subscribers.length });
  },
);

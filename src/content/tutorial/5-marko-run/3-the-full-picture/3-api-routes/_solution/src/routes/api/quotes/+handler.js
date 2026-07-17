const quotes = [{ text: "Measure twice, forge once." }];

export const GET = Run.GET(() => {
  return Response.json(quotes);
});

export const POST = Run.POST(
  {
    json(value) {
      return { text: String(value.text || "").trim() };
    },
  },
  async (context) => {
    const q = await context.body;
    if (!q.text) return Response.json({ error: "empty" }, { status: 400 });
    quotes.push(q);
    return Response.json(q, { status: 201 });
  },
);

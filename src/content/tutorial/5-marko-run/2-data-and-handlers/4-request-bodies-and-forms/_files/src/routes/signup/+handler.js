const subscribers = [];

export const GET = Run.GET((context, next) => {
  return next({ count: subscribers.length });
});

// Add the POST handler here.

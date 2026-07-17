const TOP_SELLERS = [
  { id: "classic-9", sold: 412 },
  { id: "colossus-88", sold: 87 },
];

export const GET = Run.GET((context, next) => {
  return next({ anvils: TOP_SELLERS });
});

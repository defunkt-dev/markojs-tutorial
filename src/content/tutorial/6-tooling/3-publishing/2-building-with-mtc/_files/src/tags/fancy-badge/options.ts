export type Kind = "new" | "sale";

export function labelFor(kind: Kind): string {
  return kind === "new" ? "NEW" : "SALE";
}

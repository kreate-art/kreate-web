export function toArrayOfReactNode(
  children: React.ReactNode
): React.ReactNode[] {
  if (!children) return [];
  if (!Array.isArray(children)) return [children];
  return children;
}

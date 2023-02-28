export function getPathCommandForClipPath(
  viewBox: [number, number, number, number],
  ratio: number // 0.0 .. 1.0
) {
  const [x, y, w, h] = viewBox;
  const ox = x + 0.5 * w;
  const oy = y + 0.5 * h;

  const arcPoints = [0.0, 0.25, 0.5, 0.75, 1.0] // 0.0 .. 1.0, the parameter
    .map((t) => t * 2 * Math.PI * ratio) // 0.0 .. 2*PI, the angle
    .map((alpha) => [Math.sin(alpha), -Math.cos(alpha)] as const) // (-1.0 .. 1.0, -1.0 .. 1.0), the points in the base square
    .map(([px, py]) => [px * w + ox, py * h + oy] as const); // the absolute points on the arc
  const allPoints = [[ox, oy], ...arcPoints, [ox, oy]] as const; // add two endpoints
  return "M " + allPoints.map(([x, y]) => `${x} ${y}`).join(" L ") + " Z";
}

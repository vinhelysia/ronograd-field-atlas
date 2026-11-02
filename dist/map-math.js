export const HOME = [-80, -90, 1620, 1725];
export function zoomView(view, factor, anchor) {
  const width = Math.max(190, Math.min(HOME[2], view[2] * factor));
  const ratio = width / view[2];
  return [anchor[0] - (anchor[0] - view[0]) * ratio,
    anchor[1] - (anchor[1] - view[1]) * ratio, width, view[3] * ratio];
}

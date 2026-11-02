export const HOME = [-80, -90, 1620, 1725];
export function nativeView(view, viewport, pixelsPerUnit) {
  const width=viewport[0]/pixelsPerUnit, height=viewport[1]/pixelsPerUnit;
  return [view[0]+view[2]/2-width/2,view[1]+view[3]/2-height/2,width,height];
}
export function zoomView(view, factor, anchor) {
  const width = Math.max(20, Math.min(HOME[2], view[2] * factor));
  const ratio = width / view[2];
  return [anchor[0] - (anchor[0] - view[0]) * ratio,
    anchor[1] - (anchor[1] - view[1]) * ratio, width, view[3] * ratio];
}

/**
 * Circle-crop geometry for the profile photo cropper (`PhotoCropper`).
 *
 * The circle has diameter `c` screen px. At zoom 1 the image just covers it
 * (its short side = `c`); `x`/`y` is the image centre's offset from the circle
 * centre, in screen px.
 */
export interface CropView {
  zoom: number;
  x: number;
  y: number;
}

export const MAX_ZOOM = 4;

const scaleOf = (zoom: number, w: number, h: number, c: number) => (c / Math.min(w, h)) * zoom;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Keeps zoom in range and the image covering the whole circle — no empty edge. */
export function clampView(v: CropView, w: number, h: number, c: number): CropView {
  const zoom = clamp(v.zoom, 1, MAX_ZOOM);
  const s = scaleOf(zoom, w, h, c);
  const mx = (w * s - c) / 2;
  const my = (h * s - c) / 2;
  return { zoom, x: clamp(v.x, -mx, mx), y: clamp(v.y, -my, my) };
}

/** The square of the source image, in its own pixels, that the circle shows. */
export function cropRect(v: CropView, w: number, h: number, c: number) {
  const s = scaleOf(v.zoom, w, h, c);
  return { sx: (w * s - c) / 2 / s - v.x / s, sy: (h * s - c) / 2 / s - v.y / s, size: c / s };
}

import assert from "node:assert/strict";
import { clampView, cropRect } from "./crop";

// 1000×500 landscape in a 250px circle: zoom 1 fits the short side exactly.
const W = 1000, H = 500, C = 250;
assert.deepEqual(cropRect({ zoom: 1, x: 0, y: 0 }, W, H, C), { sx: 250, sy: 0, size: 500 }, "centred");
// Dragging the image right shows more of its left side.
assert.deepEqual(cropRect({ zoom: 1, x: 125, y: 0 }, W, H, C), { sx: 0, sy: 0, size: 500 }, "far left");
// …but never past the edge, and not vertically at all at zoom 1.
assert.deepEqual(clampView({ zoom: 1, x: 999, y: 40 }, W, H, C), { zoom: 1, x: 125, y: 0 });
// Zoom 2 halves the crop and allows vertical travel; zoom is held to 1…4.
assert.deepEqual(cropRect({ zoom: 2, x: 0, y: 0 }, W, H, C), { sx: 375, sy: 125, size: 250 });
assert.equal(clampView({ zoom: 9, x: 0, y: 0 }, W, H, C).zoom, 4);
assert.equal(clampView({ zoom: 0.2, x: 0, y: 0 }, W, H, C).zoom, 1);

console.log("crop: ok");

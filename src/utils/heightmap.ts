let _width = 0;
let _height = 0;
let _pixels: Uint8ClampedArray | null = null;
let _worldSize: [number, number] | null = null;
let _origin: [number, number] | null = null;
let _minHeight = 0;
let _maxHeight = 1;
let _ready = false;
const _readyCallbacks: Array<() => void> = [];

export interface HeightmapMetadata {
  worldSize: [number, number]; // meters [width, depth]
  origin: [number, number]; // world center [x,z]
  heightRange: [number, number]; // meters [min, max]
}

export async function loadHeightmap(url: string, meta: HeightmapMetadata) {
  _worldSize = meta.worldSize;
  _origin = meta.origin;
  _minHeight = meta.heightRange[0];
  _maxHeight = meta.heightRange[1];

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = url;
  await new Promise((res, rej) => {
    img.onload = res;
    img.onerror = rej;
  });

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Unable to create canvas context for heightmap");
  ctx.drawImage(img, 0, 0);
  const id = ctx.getImageData(0, 0, img.width, img.height);
  _width = img.width;
  _height = img.height;
  _pixels = id.data;
  _ready = true;
  _readyCallbacks.forEach((c) => c());
}

export function isReady() {
  return _ready;
}

export function onReady(cb: () => void) {
  if (_ready) cb();
  else _readyCallbacks.push(cb);
}

function pixelAt(ix: number, iy: number) {
  if (!_pixels) return 0;
  ix = Math.max(0, Math.min(_width - 1, ix | 0));
  iy = Math.max(0, Math.min(_height - 1, iy | 0));
  const i = (iy * _width + ix) * 4;
  return _pixels[i]; // assume grayscale stored in R
}

function sampleBilinear(u: number, v: number) {
  // u, v in [0,1]
  if (!_pixels || _width === 0 || _height === 0) return null;
  const x = u * (_width - 1);
  const y = v * (_height - 1);
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = Math.min(_width - 1, x0 + 1);
  const y1 = Math.min(_height - 1, y0 + 1);
  const sx = x - x0;
  const sy = y - y0;
  const c00 = pixelAt(x0, y0);
  const c10 = pixelAt(x1, y0);
  const c01 = pixelAt(x0, y1);
  const c11 = pixelAt(x1, y1);
  const a = c00 * (1 - sx) + c10 * sx;
  const b = c01 * (1 - sx) + c11 * sx;
  const c = a * (1 - sy) + b * sy;
  return c / 255;
}

export function getHeightRaw(x: number, z: number): number | null {
  // Map world x,z to uv using origin and worldSize
  if (!_worldSize || !_origin) return null;
  if (!_pixels) return null;
  const [wMeters, dMeters] = _worldSize;
  const [ox, oz] = _origin;
  const u = (x - (ox - wMeters / 2)) / wMeters; // 0..1
  const v = 1 - (z - (oz - dMeters / 2)) / dMeters; // flip v to match image y
  if (u < 0 || u > 1 || v < 0 || v > 1) return null;
  const s = sampleBilinear(u, v);
  if (s === null) return null;
  return _minHeight + s * (_maxHeight - _minHeight);
}

export function getNormalAt(x: number, z: number): [number, number, number] | null {
  const e = 0.2;
  const h = getHeightRaw(x, z);
  if (h === null) return null;
  const hx = getHeightRaw(x + e, z);
  const hz = getHeightRaw(x, z + e);
  if (hx === null || hz === null) return null;
  const dhx = hx - h;
  const dhz = hz - h;
  const nx = -dhx;
  const ny = 1;
  const nz = -dhz;
  const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
  return [nx / len, ny / len, nz / len];
}

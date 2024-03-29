export class Vec {
  x: number;
  y: number;
  static add: (v: Vec, w: Vec) => Vec;
  static sub: (v: Vec, w: Vec) => { x: number; y: number };
  static div: (v: Vec, n: number) => Vec;
  static mul: (v: Vec, n: number) => Vec;
  static mag: (v: Vec) => number;
  static magSqr: (v: Vec) => number;
  static dot: (v: Vec, w: Vec) => number;
  static cross: (v: Vec, w: Vec) => number;
  static normalize: (v: Vec) => Vec;
  static distsqr: (v: Vec, w: Vec) => number;
  static dist: (v: Vec, w: Vec) => number;
  static crossVS: (v: Vec, s: number) => Vec;
  static crossSV: (s: number, v: Vec) => Vec;
  static rotate: (v: Vec, r: number) => Vec;

  /**
   * Creates a vector
   * @param x x-value
   * @param y y-value
   */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

/**
 * returns sum of two vectors
 * @param v vector1
 * @param w vector2
 * @returns sum of two vectors
 */
Vec.add = function (v: Vec, w: Vec) {
  return { x: v.x + w.x, y: v.y + w.y };
};

/**
 * returns difference of two vectors
 * @param v positive vector
 * @param w subtracted vector
 * @returns difference of two vectors
 */
Vec.sub = function (v: Vec, w: Vec) {
  return { x: v.x - w.x, y: v.y - w.y };
};

/**
 * returns product of vector and scalar
 * @param v vector
 * @param n scalar
 * @returns product of vector and scalar
 */
Vec.mul = function (v: Vec, n: number): Vec {
  return { x: v.x * n, y: v.y * n };
};

/**
 * returns division of vector and scalar
 * @param v vector
 * @param n scalar
 * @returns division of vector and scalar
 */
Vec.div = function (v: Vec, n: number): Vec {
  return { x: v.x / n, y: v.y / n };
};

/**
 * Returns the magnitude (length) of a vector.
 * @param v vector
 * @returns {number} magnitude/length of vector
 */
Vec.mag = function (v: Vec): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
};

/**
 * Returns the magnitude squared of a vector.
 * @param v vector
 * @returns {number} magnitude squared of vector
 */
Vec.magSqr = function (v: Vec): number {
  return v.x * v.x + v.y * v.y;
};

/**
 * returns dot product of two vectors
 * @param v vector1
 * @param w vector2
 * @returns dot product of two vectors
 */
Vec.dot = function (v: Vec, w: Vec): number {
  return w.x * v.x + w.y * v.y;
};

/** 2D cross product is weird
 * returns cross product of two 2d vectors (magnitude of the hidden orthoganal vector)
 * @param v vector1
 * @param w vector2
 * @returns cross product of two vectors
 */
Vec.cross = function (v: Vec, w: Vec): number {
  return v.x * w.y - v.y * w.x;
};

/**
 * returns cross product of a vector and scalar
 * @param v vector
 * @param s scalar
 * @returns cross product of a vector and scalar
 */
Vec.crossVS = function (v: Vec, s: number): Vec {
  return { x: s * v.y, y: -s * v.x };
};

/**
 * returns cross product of a scalar and vector
 * @param s scalar
 * @param v vector
 * @returns cross product of a scalar and vector
 */
Vec.crossSV = function (s: number, v: Vec): Vec {
  return { x: -s * v.y, y: s * v.x };
};
/**
 * returns a normalized vector
 * @param v vector
 * @returns vector stretched to magnitude 1
 */
Vec.normalize = function (v: Vec): Vec {
  if (Vec.mag(v) == 0) {
    return { x: 0, y: 0 };
  }
  return { x: v.x / Vec.mag(v), y: v.y / Vec.mag(v) };
};

/**
 * returns distance squared of two vectors
 * @param v vector1
 * @param w vector2
 * @returns distance squared of two vectors
 */
Vec.distsqr = function (v: Vec, w: Vec): number {
  return (w.x - v.x) ^ (2 + (w.y - v.y)) ^ 2;
};

/**
 * returns distance of two vectors
 * @param v vector1
 * @param w vector2
 * @returns distance of two vectors
 */
Vec.dist = function (v: Vec, w: Vec): number {
  return Math.sqrt((w.x - v.x) ^ (2 + (w.y - v.y)) ^ 2);
};

/**
 * returns a vector made by rotating v r radians counterclockwise
 * @param v vector1
 * @param r radians
 * @returns rotated vector by r radians counterclockwise
 */
Vec.rotate = function (v: Vec, r: number): Vec {
  return {
    x: Math.cos(r * v.x) - Math.sin(r * v.y),
    y: Math.cos(r * v.y) + Math.sin(r * v.x),
  };
};

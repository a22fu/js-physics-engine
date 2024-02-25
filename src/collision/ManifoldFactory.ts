import { Vec } from "../geometry/Vector";
import { Circle } from "../geometry/Circle";
import { AABB } from "../geometry/AABB";

import { RigidBody } from "../bodies/RigidBody";
import { Manifold } from "./Manifold";

export class ManifoldFactory {
  A: any;
  B: any;
  pen: number;
  normal: Vec;
  constructor() {}

  static circleCircle(circle1, circle2) {
    var m = new Manifold();
    m.A = circle1;
    m.B = circle2;

    var n = Vec.sub(m.B.position, m.A.position);
    var r = m.A.radius + m.B.radius;
    r *= r;
    if (Vec.magSqr(n) > r) return false;

    var d = Vec.mag(n);
    if (d != 0) {
      m.pen = r - d;
      m.normal = { x: n.x / d, y: n.y / d };
      return true;
    } else {
      m.pen = 0;
      m.normal = { x: 1, y: 1 };
      return true;
    }
  }

  static AABBCircle(aabb, circle) {
    var m = new Manifold();

    m.A = circle;
    m.B = aabb;

    var n = Vec.sub(m.B.position, m.A.position);
    var closest = n;
    var x_extent = (m.A.aabb.max.x - m.A.aabb.min.x) / 2;
    var y_extent = (m.A.aabb.max.y - m.A.aabb.min.y) / 2;
    closest.x = Math.max(-x_extent, Math.min(x_extent, closest.x));
    closest.y = Math.max(-y_extent, Math.min(y_extent, closest.y));

    var inside = false;

    if (n == closest) {
      inside = true;
      if (Math.abs(n.x) > Math.abs(n.y)) {
        if (closest.x > 0) {
          closest.x = x_extent;
        } else {
          closest.x = -x_extent;
        }
      } else {
        if (closest.y > 0) {
          closest.y = y_extent;
        } else {
          closest.y = -y_extent;
        }
      }
    }
    var normal = Vec.sub(n, closest);
    var d = Vec.magSqr(normal);
    var r = m.B.radius;

    if (d > r * r && !inside) return false;
    d = Math.sqrt(d);

    if (inside) {
      m.normal = Vec.sub({ x: 0, y: 0 }, n);
      m.pen = r - d;
    } else {
      m.normal = n;
      m.pen = r - d;
    }
    return true;
  }

  static AABBAABB(aabb1, aabb2) {
    var m = new Manifold();

    m.A = aabb1;
    m.B = aabb2;

    var n = Vec.sub(m.B.position, m.A.position);

    var abox = aabb1;
    var bbox = aabb2;

    var a_extent = (abox.max.x - abox.min.x) / 2;
    var b_extent = (bbox.max.x - bbox.min.x) / 2;

    var x_overlap = a_extent + b_extent - Math.abs(n.x);

    if (x_overlap > 0) {
      a_extent = (abox.max.y - abox.min.y) / 2;
      b_extent = (bbox.max.y - bbox.min.y) / 2;

      var y_overlap = a_extent + b_extent - Math.abs(n.y);

      if (y_overlap > 0) {
        if (x_overlap > y_overlap) {
          if (n.x < 0) {
            m.normal = { x: -1, y: 0 };
          } else {
            m.normal = { x: 0, y: 0 };
            m.pen = x_overlap;
            return true;
          }
        } else {
          if (n.y < 0) m.normal = { x: 0, y: -1 };
          else m.normal = { x: 0, y: 1 };
          m.pen = y_overlap;
          return true;
        }
      }
    }
  }
}

import { Vec } from "../geometry/Vector";
import { Circle } from "../geometry/Circle";
import { AABB } from "../geometry/AABB";

import { RigidBody } from "../bodies/RigidBody";
import { Manifold } from "./Manifold";

export class ManifoldFactory {
  A: any;
  B: any;
  penetration: number;
  normal: Vec;
  constructor() {}

  static circleCircle(circle1: Circle, circle2: Circle): Manifold {
    let m = new Manifold(circle1, circle2);

    const n = Vec.sub(m.B.position, m.A.position);
    const d = Vec.mag(n);
    const r = circle1.radius + circle2.radius;

    if (d != 0) {
      m.penetration = r - d;
      m.normal = { x: n.x / d, y: n.y / d };
      return m;
    } else {
      m.penetration = 0;
      m.normal = { x: 1, y: 1 };
      return m;
    }
  }

  static aabbCircle(aabb: AABB, circle: Circle): Manifold {
    var m = new Manifold(aabb, circle);

    function pointClamp(point, minVal, maxVal) {
      return Math.max(Math.min(point, maxVal), minVal);
    }
    const closestPoint = { x: 0, y: 0 };

    closestPoint.x = pointClamp(circle.position.x, aabb.min.x, aabb.max.x);
    closestPoint.y = pointClamp(circle.position.y, aabb.min.y, aabb.max.y);

    const n = Vec.sub(closestPoint, circle.position);
    const d = Vec.mag(n);
    const r = circle.radius;

    if (d != 0) {
      m.normal = {
        x: n.x / d,
        y: n.y / d,
      };
      m.penetration = r - d;
    }
    return m;
  }

  static circleAABB(circle: Circle, aabb: AABB): Manifold {
    return ManifoldFactory.aabbCircle(aabb, circle);
  }

  static AABBAABB(aabb1, aabb2) {
    var m = new Manifold(aabb1, aabb2);

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
            m.penetration = x_overlap;
            return true;
          }
        } else {
          if (n.y < 0) m.normal = { x: 0, y: -1 };
          else m.normal = { x: 0, y: 1 };
          m.penetration = y_overlap;
          return true;
        }
      }
    }
  }
}

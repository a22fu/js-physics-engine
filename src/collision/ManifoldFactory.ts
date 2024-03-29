import { Vec } from "../geometry/Vector";
import { Circle } from "../geometry/Circle";
import { AABB } from "../geometry/AABB";

import { Manifold } from "./Manifold";
import { Polygon } from "../geometry/Polygon";

export class ManifoldFactory {
  constructor() {}

  static circleCircle(circle1: Circle, circle2: Circle): Manifold {
    let m = new Manifold(circle1, circle2);

    const n = Vec.sub(m.B.position, m.A.position);
    const d = Vec.mag(n);
    const r = circle1.radius + circle2.radius;

    m.contactPoints.push(Vec.div(Vec.add(m.B.position, m.A.position), 2));

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

    const n = Vec.sub(circle.position, closestPoint);
    const d = Vec.mag(n);
    const r = circle.radius;
    m.contactPoints.push(closestPoint);
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
    const manifold = ManifoldFactory.aabbCircle(aabb, circle);
    manifold.normal = Vec.sub({ x: 0, y: 0 }, manifold.normal);
    return manifold;
  }

  static aabbAABB(aabb1: AABB, aabb2: AABB): Manifold {
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
            return m;
          }
        } else {
          if (n.y < 0) m.normal = { x: 0, y: -1 };
          else m.normal = { x: 0, y: 1 };
          m.penetration = y_overlap;
          return m;
        }
      }
    }
    return m;
  }
  static polygonPolygon(polygonA: Polygon, polygonB: Polygon): Manifold {
    let m = new Manifold(polygonA, polygonB);

    return m;
  }
}

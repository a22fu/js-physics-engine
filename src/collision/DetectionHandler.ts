import { Vec } from "../geometry/Vector";
import { Circle } from "../geometry/Circle";
import { AABB } from "../geometry/AABB";
import { Polygon } from "../geometry/Polygon";

export class DetectionHandler {
  static detectCircleCircleCollision(
    circle1: Circle,
    circle2: Circle
  ): Boolean {
    // Implement detection logic for circles
    const r =
      (circle1.radius + circle2.radius) * (circle1.radius + circle2.radius);
    const distX = circle1.position.x - circle2.position.x;
    const distY = circle1.position.y - circle2.position.y;
    return r > distX ** 2 + distY ** 2;
  }

  static detectAABBAABBCollision(aabb1: AABB, aabb2: AABB): Boolean {
    if (aabb1.max.x < aabb2.min.x || aabb1.min.x > aabb2.max.x) return false;
    if (aabb1.max.y < aabb2.min.y || aabb1.min.y > aabb2.max.y) return false;
    return true;
  }

  static detectAABBCircleCollision(aabb: AABB, circle: Circle): Boolean {
    function pointClamp(point, minVal, maxVal) {
      return Math.max(Math.min(point, maxVal), minVal);
    }
    const closestPoint = { x: 0, y: 0 };

    closestPoint.x = pointClamp(circle.position.x, aabb.min.x, aabb.max.x);
    closestPoint.y = pointClamp(circle.position.y, aabb.min.y, aabb.max.y);

    const distanceX = closestPoint.x - circle.position.x;
    const distanceY = closestPoint.y - circle.position.y;

    const distanceSquared = distanceX * distanceX + distanceY * distanceY;

    return distanceSquared <= circle.radius * circle.radius;
  }
  static detectCircleAABBCollision(circle: Circle, aabb: AABB): Boolean {
    return DetectionHandler.detectAABBCircleCollision(aabb, circle);
  }

  static getSupport(dir: Vec, polygon: Polygon): Vec {
    let bestProjection = 0;
    let bestVertex = { x: 0, y: 0 };
    for (let i = 0; i < polygon.vertices.length; i++) {
      const v = polygon.vertices[i];
      const projection = Vec.dot(v, dir);

      if (projection > bestProjection) {
        bestProjection = projection;
        bestVertex = v;
      }
    }
    return bestVertex;
  }

  static queryFaceDirections(polygonA: Polygon, polygonB: Polygon) {
    let bestDistance = -Number.MAX_VALUE;
    let bestIndex = -1;
    for (let i = 0; i < polygonA.edgeLine.length; i++) {
      const vertexB = polygonB.getSupport(
        Vec.rotate(polygonA.edges[i], -Math.PI / 4)
      );
      function distance(line, v: Vec) {
        return (
          Math.abs(line.a * v.x + line.b * v.y + line.c) /
          Math.sqrt(line.a * line.a + line.b * line.b)
        );
      }
      const d = distance(polygonA.edgeLine[i], vertexB);

      if (d > bestDistance) {
        bestDistance = d;
        bestIndex = i;
      }
    }
    return { distance: bestDistance, index: bestIndex };
  }

  static detectPolygonPolygonCollision(polygonA: Polygon, polygonB: Polygon) {
    const A = DetectionHandler.queryFaceDirections(polygonA, polygonB);
    if (A?.distance > 0) {
      return false;
    }
    const B = DetectionHandler.queryFaceDirections(polygonB, polygonA);
    if (B?.distance > 0) {
      return false;
    }

    return true;
  }
}

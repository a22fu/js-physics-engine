import { Vec } from "../geometry/Vector";
import { Circle } from "../geometry/Circle";
import { AABB } from "../geometry/AABB";

import { RigidBody } from "../bodies/RigidBody";

export class DetectionHandler {
  static detectCircleCircleCollision(circle1: Circle, circle2: Circle) {
    // Implement detection logic for circles
    const r =
      (circle1.radius + circle2.radius) * (circle1.radius + circle2.radius);
    const distX = circle1.position.x - circle2.position.x;
    const distY = circle1.position.y - circle2.position.y;
    return r > distX ** 2 + distY ** 2;
  }

  static detectAABBAABBCollision(AABB1, AABB2) {
    if (AABB1.max.x < AABB2.min.x || AABB1.min.x > AABB2.max.x) return false;
    if (AABB1.max.y < AABB2.min.y || AABB1.min.y > AABB2.max.y) return false;
    return true;
  }

  static detectAABBCircleCollision(aabb, circle) {
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
  static detectCircleAABBCollision(circle, aabb) {
    return DetectionHandler.detectAABBCircleCollision(aabb, circle);
  }
}

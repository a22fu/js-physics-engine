import { Vec } from "../geometry/Vector";
import { Circle } from "../geometry/Circle";
import { AABB } from "../geometry/AABB";

import { RigidBody } from "../bodies/RigidBody";

export class DetectionHandler {
  static detectCircleCircleCollision(circle1: Circle, circle2: Circle) {
    // Implement detection logic for circles
    let r = circle1.radius + circle2.radius;
    let distX = circle1.position.x - circle2.position.x;
    let distY = circle1.position.y - circle2.position.y;
    r *= r;
    return r > distX ** 2 + distY ** 2;
  }

  static detectAABBAABBCollision(AABB1, AABB2) {
    if (AABB1.max.x < AABB2.min.x || AABB1.min.x > AABB2.max.x) return false;
    if (AABB1.max.y < AABB2.min.y || AABB1.min.y > AABB2.max.y) return false;
    return true;
  }

  static detectAABBCircleCollision(circle, AABB) {
    // Implement detection logic for circle-AABB
  }
}

import { Vec } from "../geometry/Vector";
import { Circle } from "../geometry/Circle";
import { AABB } from "../geometry/AABB";

import { Manifold } from "./Manifold";
import { DetectionHandler as DH } from "./DetectionHandler";

export class CollisionHandler {
  registerCollisionHandler(body1, body2, detectionHandler, manifoldHandler) {
    const key = `${body1.name}-${body2.name}`;
    this[key] = { detectionHandler, manifoldHandler };
  }
  handleCollision(A: any, B: any) {
    const key = `${A.constructor.name}-${B.constructor.name}`;
    const handlers = this[key];

    if (handlers) {
      const isCollisionDetected = handlers.detectionHandler(A, B);
      if (isCollisionDetected) {
        const manifoldHandler = handlers.manifoldHandler(A, B);
        var m = new Manifold();
        m = manifoldHandler(A, B);
        var rv = Vec.sub(B.velocity, A.velocity);

        // normal vector (change for collision types)
        var normal = m.normal;
        //
        var nv = Vec.dot(rv, normal);
        if (nv > 0) return;

        var e = Math.min(A.restitution, B.restitution);
        // impulse scalar
        var i = (-(1 + e) * nv) / (1 / A.mass + 1 / B.mass);
        var impulse = Vec.mul(normal, i);
        var mass_sum = A.mass + B.mass;
        var ratio = A.mass / mass_sum;
        A.velocity = Vec.sub(A.velocity, Vec.mul(impulse, ratio));
        ratio = B.mass / mass_sum;
        A.velocity = Vec.sub(B.velocity, Vec.mul(impulse, ratio));
      }
    } else {
      // Handle default case or throw an error
      console.error(`Collision handlers not found for ${key}`);
    }
  }
}
var cMap = new CollisionHandler();

cMap.registerCollisionHandler(
  Circle,
  Circle,
  DH.detectCircleCircleCollision,
  Manifold.circleCircle
);
cMap.registerCollisionHandler(
  Circle,
  AABB,
  DH.detectAABBCircleCollision,
  Manifold.AABBCircle
);
cMap.registerCollisionHandler(
  AABB,
  AABB,
  DH.detectAABBAABBCollision,
  Manifold.AABBAABB
);

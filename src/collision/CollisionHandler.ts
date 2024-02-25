import { Vec } from "../geometry/Vector";
import { Circle } from "../geometry/Circle";
import { AABB } from "../geometry/AABB";

import { Manifold } from "./Manifold";
import { DetectionHandler as DH } from "./DetectionHandler";
import { RigidBody } from "../bodies/RigidBody";
import { ManifoldFactory } from "./ManifoldFactory";

export class CollisionHandler {
  collisionMap = new Map<string, Object>();

  registerCollisionHandler(body1, body2, detectionHandler, manifoldHandler) {
    const key = `${body1.name}-${body2.name}`;
    this.collisionMap[key] = { detectionHandler, manifoldHandler };
  }

  handleCollision(A: RigidBody, B: RigidBody) {
    const key = `${A.constructor.name}-${B.constructor.name}`;
    const handlers = this.collisionMap[key];

    if (handlers) {
      const isCollisionDetected = handlers.detectionHandler(A, B);
      if (isCollisionDetected) {
        const manifold = handlers.manifoldHandler(A, B);
        var rv = Vec.sub(B.velocity, A.velocity);

        // normal vector (change for collision types)
        var normal = manifold.normal;
        //
        var nv = Vec.dot(rv, normal);
        if (nv > 0) return;

        var e = Math.min(A.material.restitution, B.material.restitution);
        // impulse scalar
        var i = (-(1 + e) * nv) / (1 / A.massData.mass + 1 / B.massData.mass);
        var impulse = Vec.mul(normal, i);
        var mass_sum = A.massData.mass + B.massData.mass;
        var ratio = A.massData.mass / mass_sum;
        A.velocity = Vec.sub(A.velocity, Vec.mul(impulse, ratio));
        ratio = B.massData.mass / mass_sum;
        A.velocity = Vec.sub(B.velocity, Vec.mul(impulse, ratio));
      }
    } else {
      // Handle default case or throw an error
      console.error(`Collision handlers not found for ${key}`);
    }
  }

  PositionalCorrection(A: RigidBody, B: RigidBody) {
    const percent = 0.2; // usually 20% to 80%
    const slop = 0.01; // usually 0.01 to 0.1
    const key = `${A.constructor.name}-${B.constructor.name}`;
    const handlers = this.collisionMap[key];
    const manifold = handlers.manifoldHandler(A, B);

    let correction = Vec.mul(
      manifold.normal,
      (Math.max(manifold.penetration - slop) /
        (A.massData.iMass + B.massData.iMass)) *
        percent
    );
    A.position = Vec.sub(A.position, Vec.mul(correction, A.massData.iMass));
    B.position = Vec.add(B.position, Vec.mul(correction, A.massData.iMass));
  }
}
var cMap = new CollisionHandler();

cMap.registerCollisionHandler(
  Circle,
  Circle,
  DH.detectCircleCircleCollision,
  ManifoldFactory.circleCircle
);
cMap.registerCollisionHandler(
  Circle,
  AABB,
  DH.detectAABBCircleCollision,
  ManifoldFactory.AABBCircle
);
cMap.registerCollisionHandler(
  AABB,
  AABB,
  DH.detectAABBAABBCollision,
  ManifoldFactory.AABBAABB
);

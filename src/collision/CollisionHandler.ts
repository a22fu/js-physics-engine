import { Vec } from "../geometry/Vector";
import { Circle } from "../geometry/Circle";
import { AABB } from "../geometry/AABB";

import { Manifold } from "./Manifold";
import { DetectionHandler as DH } from "./DetectionHandler";
import { RigidBody } from "../bodies/RigidBody";
import { ManifoldFactory } from "./ManifoldFactory";

export class CollisionHandler {
  collisionMap = {
    "Circle-Circle": {
      manifold: ManifoldFactory.circleCircle,
      detection: DH.detectCircleCircleCollision,
    },
    "AABB-Circle": {
      manifold: ManifoldFactory.aabbCircle,
      detection: DH.detectAABBCircleCollision,
    },
    "Circle-AABB": {
      manifold: ManifoldFactory.circleAABB,
      detection: DH.detectCircleAABBCollision,
    },
    "AABB-AABB": {
      manifold: ManifoldFactory.aabbAABB,
      detection: DH.detectAABBAABBCollision,
    },
  };

  detectCollision(A: RigidBody, B: RigidBody): boolean {
    const key = `${A.constructor.name}-${B.constructor.name}`;
    return this.collisionMap[key].detection(A, B);
  }

  handleCollision(A: RigidBody, B: RigidBody): void {
    const key = `${A.constructor.name}-${B.constructor.name}`;
    const manifold = this.collisionMap[key].manifold(A, B);
    if (manifold) {
      const rv = Vec.sub(B.velocity, A.velocity);

      // normal vector (change for collision types)
      const normal = manifold.normal;

      const nv = Vec.dot(rv, normal);
      if (nv > 0) return;
      const e = 0.8;
      // const e = Math.min(A.material.restitution, B.material.restitution);
      // impulse scalar

      const j = (-(1 + e) * nv) / (A.massData.iMass + B.massData.iMass);
      const impulse = Vec.mul(normal, j);

      A.velocity = Vec.sub(A.velocity, Vec.mul(impulse, A.massData.iMass));
      B.velocity = Vec.add(B.velocity, Vec.mul(impulse, B.massData.iMass));
      console.log(A.velocity);
      console.log(B.velocity);
      this.PositionalCorrection(A, B, manifold);
    }
  }

  PositionalCorrection(A: RigidBody, B: RigidBody, manifold: Manifold) {
    const percent = 1; // usually 20% to 80%

    let correction = Vec.mul(
      manifold.normal,
      (manifold.penetration / (A.massData.iMass + B.massData.iMass)) * percent
    );

    A.position = Vec.sub(A.position, Vec.mul(correction, A.massData.iMass));
    B.position = Vec.add(B.position, Vec.mul(correction, B.massData.iMass));
  }
}

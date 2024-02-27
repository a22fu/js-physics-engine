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
      const e = 1;
      // const e = Math.min(A.material.restitution, B.material.restitution);
      // impulse scalar
      const j = (-(1 + e) * nv) / (1 / A.massData.mass + 1 / B.massData.mass);
      const impulse = Vec.mul(normal, j);
      A.velocity = Vec.sub(A.velocity, Vec.mul(impulse, 1 / A.massData.mass));
      B.velocity = Vec.add(B.velocity, Vec.mul(impulse, 1 / B.massData.mass));
      this.PositionalCorrection(A, B, manifold);
    }
  }

  PositionalCorrection(A: RigidBody, B: RigidBody, manifold: Manifold) {
    const percent = 0.2; // usually 20% to 80%
    const slop = 0.01; // usually 0.01 to 0.1

    let correction = Vec.mul(
      manifold.normal,
      (Math.max(manifold.penetration - slop, 0) /
        (1 / A.massData.mass + 1 / B.massData.mass)) *
        percent
    );
    A.position = Vec.sub(A.position, Vec.mul(correction, 1 / A.massData.mass));
    B.position = Vec.add(B.position, Vec.mul(correction, 1 / B.massData.mass));
  }
}

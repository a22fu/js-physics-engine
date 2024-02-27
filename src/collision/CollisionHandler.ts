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

      const e = Math.min(A.material.restitution, B.material.restitution);
      // impulse scalar
      const i = (-(1 + e) * nv) / (1 / A.massData.mass + 1 / B.massData.mass);
      const impulse = Vec.mul(normal, i);
      const mass_sum = A.massData.mass + B.massData.mass;
      let ratio = A.massData.mass / mass_sum;
      A.velocity = Vec.sub(A.velocity, Vec.mul(impulse, ratio));
      ratio = B.massData.mass / mass_sum;
      B.velocity = Vec.add(B.velocity, Vec.mul(impulse, ratio));
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

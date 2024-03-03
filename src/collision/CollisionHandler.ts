import { Vec } from "../geometry/Vector";

import { Manifold } from "./Manifold";
import { DetectionHandler as DH } from "./DetectionHandler";
import { Shape } from "../bodies/Shape";
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
    "Polygon-Polygon": {
      manifold: ManifoldFactory.polygonPolygon,
      detection: DH.detectPolygonPolygonCollision,
    },
  };

  detectCollision(A: Shape, B: Shape): boolean {
    const key = `${A.constructor.name}-${B.constructor.name}`;
    return this.collisionMap[key].detection(A, B);
  }

  handleCollision(A: Shape, B: Shape): void {
    const key = `${A.constructor.name}-${B.constructor.name}`;
    const manifold = this.collisionMap[key].manifold(A, B);
    if (manifold) {
      for (const i of manifold.contactPoints) {
        const rA = Vec.sub(i, A.position);
        const rB = Vec.sub(i, B.position);

        const rAPerp = { x: -rA.y, y: rA.x };
        const rBPerp = { x: -rB.y, y: rB.x };

        const angularVelocityA = Vec.mul(rAPerp, A.angularVelocity);
        const angularVelocityB = Vec.mul(rBPerp, B.angularVelocity);

        const rv = Vec.add(
          Vec.sub(B.velocity, A.velocity),
          Vec.sub(angularVelocityB, angularVelocityA)
        );

        // normal vector (change for collision types)
        const normal = manifold.normal;

        const nv = Vec.dot(rv, normal);
        if (nv > 0) continue;

        const e = 0.8;
        // const e = Math.min(A.material.restitution, B.material.restitution);

        const rAPerpDotN = Vec.dot(rAPerp, normal);
        const rBPerpDotN = Vec.dot(rBPerp, normal);
        // impulse scalar calcs
        // let j = (-(1 + e) * nv) / (A.massData.iMass + B.massData.iMass);
        let j =
          (-(1 + e) * nv) /
          (A.massData.iMass +
            B.massData.iMass +
            rAPerpDotN ** 2 * A.massData.iInertia +
            rBPerpDotN ** 2 * B.massData.iInertia);
        j = j / manifold.contactPoints.length;
        const impulse = Vec.mul(normal, j);

        const tan = Vec.sub(rv, Vec.mul(normal, Vec.dot(rv, normal)));
        const t = Vec.normalize(tan);

        const jt = -(
          Vec.dot(rv, t) /
          (A.massData.iMass +
            B.massData.iMass +
            rAPerpDotN ** 2 * A.massData.iInertia +
            rBPerpDotN ** 2 * B.massData.iInertia)
        );

        const mu = (A.material.staticFriction + B.material.staticFriction) / 2;

        let frictionImpulse: Vec;
        if (Math.abs(jt) < j * mu) {
          frictionImpulse = Vec.mul(t, jt);
        } else {
          const dynamicFriction =
            (A.material.dynamicFriction + B.material.dynamicFriction) / 2;
          frictionImpulse = Vec.mul(t, -j * dynamicFriction);
        }
        frictionImpulse = Vec.div(
          frictionImpulse,
          manifold.contactPoints.length
        );
        A.velocity = Vec.sub(
          A.velocity,
          Vec.mul(frictionImpulse, A.massData.iMass)
        );
        B.velocity = Vec.add(
          B.velocity,
          Vec.mul(frictionImpulse, B.massData.iMass)
        );

        A.angularVelocity -=
          A.massData.iInertia * Vec.cross(rA, frictionImpulse);
        B.angularVelocity +=
          B.massData.iInertia * Vec.cross(rB, frictionImpulse);

        A.velocity = Vec.sub(A.velocity, Vec.mul(impulse, A.massData.iMass));
        B.velocity = Vec.add(B.velocity, Vec.mul(impulse, B.massData.iMass));

        A.angularVelocity -= A.massData.iInertia * Vec.cross(rA, impulse);
        B.angularVelocity += B.massData.iInertia * Vec.cross(rB, impulse);
      }

      // friction impulse

      this.PositionalCorrection(A, B, manifold);
    }
  }

  PositionalCorrection(A: Shape, B: Shape, manifold: Manifold) {
    const percent = 1; // usually 20% to 80%

    let correction = Vec.mul(
      manifold.normal,
      (manifold.penetration / (A.massData.iMass + B.massData.iMass)) * percent
    );

    A.position = Vec.sub(A.position, Vec.mul(correction, A.massData.iMass));
    B.position = Vec.add(B.position, Vec.mul(correction, B.massData.iMass));
  }
}

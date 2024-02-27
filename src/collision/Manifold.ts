import { Vec } from "../geometry/Vector";

import { RigidBody } from "../bodies/RigidBody";

export class Manifold {
  A: any;
  B: any;
  penetration: number;
  normal: Vec;
  constructor(A: RigidBody, B: RigidBody) {
    this.A = A;
    this.B = B;
  }
}

import { Vec } from "../geometry/Vector";

import { Shape } from "../bodies/Shape";

export class Manifold {
  A: any;
  B: any;
  penetration: number;
  normal: Vec;
  contactPoints: Vec[] = [];
  constructor(A: Shape, B: Shape) {
    this.A = A;
    this.B = B;
  }
}

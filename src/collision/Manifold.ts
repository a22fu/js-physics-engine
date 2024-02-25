import { Vec } from "../geometry/Vector";

import { RigidBody } from "../bodies/RigidBody";

export class Manifold {
  A: any;
  B: any;
  pen: number;
  normal: Vec;
  constructor() {
    //unused constructor create from the factory methods
  }
}

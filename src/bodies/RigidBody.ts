import { Vec } from "../geometry/Vector";
import { Circle } from "../geometry/Circle";
import { AABB } from "../geometry/AABB";

import { MassData } from "./MassData";
import { Material } from "./Material";

export class RigidBody {
  massData: MassData = { mass: 10, iMass: 1 / 10, inertia: 0, iInertia: 0 };
  material: Material = { restitution: 0, density: 0 };
  position: Vec = { x: 0, y: 0 };
  velocity: Vec = { x: 0, y: 0 };
  force: Vec = { x: 0, y: 0 };
  actingForces: Vec[] = [];
  constructor(options: any) {
    this.massData = options.massData || this.massData;
    if (this.massData.mass == 0) {
      this.massData.iMass = Number.MAX_SAFE_INTEGER;
    } else if (this.massData.mass === Number.MAX_SAFE_INTEGER) {
      this.massData.iMass = 0;
    } else {
      this.massData.iMass = 1 / this.massData.mass;
    }
    this.velocity = options.velocity || this.velocity;
    this.force = options.force || this.force;
    this.material = options.material || this.material;
    this.position = options.position || this.position;
  }
  draw(canvas: HTMLCanvasElement) {
    console.log("ERR: Draw not implemented");
  }
  updatePhysics(deltaTime: number) {
    console.log("ERR: Update not implemented");
  }
  applyForce(f: Vec) {
    this.force = Vec.add(this.force, f);
  }
}

import { Vec } from "../geometry/Vector";
import { Circle } from "../geometry/Circle";
import { AABB } from "../geometry/AABB";

import { MassData } from "./MassData";
import { Material } from "./Material";

export class RigidBody {
  massData: MassData;
  material: Material;
  position: Vec;
  velocity: Vec;
  force: Vec;
  defaultOptions = {
    massData: { mass: 10, iMass: 1 / 10, intertia: 0, iInertia: 0 },
    material: { restitution: 0, density: 0 },
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    force: { x: 0, y: 0 },
  };
  constructor(options: any) {
    this.massData = options.massData || this.defaultOptions.massData;
    this.velocity = options.velocity || this.defaultOptions.velocity;
    this.force = options.force || this.defaultOptions.force;
    this.material = options.material || this.defaultOptions.material;
    this.position = options.position || this.defaultOptions.position;
  }
  draw(canvas: HTMLCanvasElement) {
    console.log("ERR: Draw not implemented");
  }
  updatePhysics(deltaTime: number) {
    console.log("ERR: Update not implemented");
  }
}

import { Vec } from "../geometry/Vector";
import { Circle } from "../geometry/Circle";
import { AABB } from "../geometry/AABB";

import { MassData } from "./MassData";
import { Material } from "./Material";

export class Shape {
  massData: MassData = { mass: 10, iMass: 1 / 10, inertia: 0, iInertia: 0 };
  material: Material = {
    restitution: 0,
    density: 0,
    staticFriction: 0,
    dynamicFriction: 0,
  };
  position: Vec = { x: 0, y: 0 };
  velocity: Vec = { x: 0, y: 0 };
  acceleration: Vec = { x: 0, y: 0 };

  force: Vec = { x: 0, y: 0 };
  actingForces: Vec[] = [];

  orientation: number = 0;
  angularVelocity: number = 0;
  torque: number = 0;

  constructor(options: any) {
    this.massData = options.massData || this.massData;
    if (this.massData.mass == 0) {
      this.massData.iMass = Number.MAX_VALUE;
    } else if (this.massData.mass === Number.MAX_VALUE) {
      this.massData.iMass = 0;
    } else {
      this.massData.iMass = 1 / this.massData.mass;
    }
    if (this.massData.inertia == 0) {
      this.massData.iInertia = Number.MAX_VALUE;
    } else if (this.massData.inertia === Number.MAX_VALUE) {
      this.massData.iInertia = 0;
    } else {
      this.massData.iInertia = 1 / this.massData.inertia;
    }
    this.position = options.position || this.position;
    this.velocity = options.velocity || this.velocity;
    this.acceleration = options.acceleration || this.acceleration;

    this.orientation = options.orientation || this.orientation;
    this.angularVelocity = options.angularVelocity || this.angularVelocity;
    this.torque = options.torque || this.torque;

    this.force = options.force || this.force;
    this.material = options.material || this.material;
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

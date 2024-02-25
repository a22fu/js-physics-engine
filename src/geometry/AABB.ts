import { Vec } from "./Vector.ts";
import { RigidBody } from "../bodies/RigidBody";

// Axis Aligned Bounding Box, simple rectangle perpendicular to boh axes
export class AABB extends RigidBody {
  min: Vec;
  max: Vec;
  AABBOptions = {
    max: 0,
    min: 0,
  };
  constructor(options: any) {
    super(options);
    this.min = options.min || this.AABBOptions.min;
    this.max = options.max || this.AABBOptions.max;
    this.position = {
      x: (this.min.x + this.max.x) / 2,
      y: (this.min.y + this.max.y) / 2,
    };
  }
}

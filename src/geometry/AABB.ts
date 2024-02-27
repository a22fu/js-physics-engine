import { Vec } from "./Vector.ts";
import { RigidBody } from "../bodies/RigidBody";

// Axis Aligned Bounding Box, simple rectangle perpendicular to both axes
export class AABB extends RigidBody {
  min: Vec;
  max: Vec;
  length: number;
  height: number;
  AABBOptions = {
    max: 0,
    min: 0,
  };

  constructor(options: any) {
    super(options);
    this.min = options.min || this.AABBOptions.min;
    this.max = options.max || this.AABBOptions.max;
    this.length = this.max.x - this.min.x;
    this.height = this.max.y - this.min.y;
    this.position = {
      x: (this.min.x + this.max.x) / 2,
      y: (this.min.y + this.max.y) / 2,
    };
  }

  draw(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.lineWidth = 0.7;

    ctx?.beginPath();
    ctx?.rect(this.min.x, this.min.y, this.length, this.height);
    ctx?.stroke();
  }
}

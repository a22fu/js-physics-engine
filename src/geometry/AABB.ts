import { Vec } from "./Vector.ts";
import { RigidBody } from "../bodies/RigidBody";

// Axis Aligned Bounding Box, simple rectangle perpendicular to both axes
export class AABB extends RigidBody {
  min: Vec = { x: 0, y: 0 };
  max: Vec = { x: 0, y: 0 };
  length: number;
  height: number;

  constructor(options: any) {
    super(options);
    this.min = options.min || this.min;
    this.max = options.max || this.max;
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
  updatePhysics(deltaTime: number): void {
    if (this.massData.mass && this.massData.mass != 0) {
      this.velocity = Vec.add(
        this.velocity,
        Vec.mul(this.force, deltaTime / this.massData.mass)
      );
    } else {
    }
    this.min = Vec.add(this.min, Vec.mul(this.velocity, deltaTime));
    this.max = Vec.add(this.max, Vec.mul(this.velocity, deltaTime));
    this.position = Vec.add(this.position, Vec.mul(this.velocity, deltaTime));
  }
}

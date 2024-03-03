import { Vec } from "./Vector.ts";
import { Shape } from "../bodies/Shape.ts";

// Axis Aligned Bounding Box, simple rectangle perpendicular to both axes
export class AABB extends Shape {
  min: Vec = { x: 0, y: 0 };
  max: Vec = { x: 0, y: 0 };
  length: number = 0;
  height: number = 0;

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
    if (this.massData.mass == Number.MAX_VALUE) {
      this.massData.inertia = Number.MAX_VALUE;
      this.massData.iInertia = 0;
    } else {
      this.massData.inertia =
        (1 / 12) * this.massData.mass * (this.length ** 2 + this.height ** 2);
    }
    if (this.massData.inertia == 0) {
      this.massData.iInertia = Number.MAX_VALUE;
    } else if (this.massData.inertia === Number.MAX_VALUE) {
      this.massData.iInertia = 0;
    } else {
      this.massData.iInertia = 1 / this.massData.inertia;
    }
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

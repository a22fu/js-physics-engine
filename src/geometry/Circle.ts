import { Vec } from "./Vector.ts";
import { RigidBody } from "../bodies/RigidBody";

export class Circle extends RigidBody {
  radius: number;
  circleOptions = {
    radius: 0,
    x: 0,
    y: 0,
  };

  constructor(options: any) {
    super(options);
    this.radius = options.radius || this.circleOptions.radius;
  }

  draw(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.lineWidth = 0.7;
    ctx?.beginPath();
    ctx?.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      2 * Math.PI,
      false
    );
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

    this.position = Vec.add(this.position, Vec.mul(this.velocity, deltaTime));
  }
}

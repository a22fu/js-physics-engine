import { Vec } from "./Vector.ts";
import { Shape } from "../bodies/Shape.ts";

export class Circle extends Shape {
  radius: number = 0;

  constructor(options: any) {
    super(options);
    this.radius = options.radius || this.radius;
    if (this.massData.mass == Number.MAX_VALUE) {
      this.massData.inertia = Number.MAX_VALUE;
      this.massData.iInertia = 0;
    } else {
      this.massData.inertia =
        (this.massData.mass * this.radius * this.radius) / 2;
      this.massData.iInertia = 1 / this.massData.inertia;
    }
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
    ctx?.moveTo(this.position.x, this.position.y);
    ctx?.lineTo(
      this.position.x + Math.cos(this.orientation) * this.radius,
      this.position.y + Math.sin(this.orientation) * this.radius
    );
    ctx?.stroke();
  }

  updatePhysics(deltaTime: number): void {
    this.velocity = Vec.add(
      this.velocity,
      Vec.mul(this.force, deltaTime * this.massData.iMass)
    );
    this.position = Vec.add(this.position, Vec.mul(this.velocity, deltaTime));

    this.angularVelocity += this.torque * this.massData.iInertia * deltaTime;
    this.orientation += this.angularVelocity * deltaTime;
    console.log(this.orientation);
  }
}

import { RigidBody } from "../bodies/RigidBody";
import { Circle } from "../geometry/Circle";
import { Vec } from "../geometry/Vector";
import { CollisionHandler } from "../collision/CollisionHandler.ts";

export class physicsLoop {
  canvas: HTMLCanvasElement;
  lastTime: number;
  bodies: RigidBody[] = [];
  cHandler: CollisionHandler = new CollisionHandler();

  constructor(canvas: HTMLCanvasElement, bodies: RigidBody[]) {
    this.canvas = canvas;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.lastTime = performance.now();
    this.bodies = bodies;
  }

  updatePhysics(deltaTime) {
    for (const body of this.bodies) {
      // v += (1/m * F) * dt
      // x += v * dt
      if (body.massData.mass && body.massData.mass != 0) {
        body.velocity = Vec.add(
          body.velocity,
          Vec.mul(body.force, deltaTime / body.massData.mass)
        );
      } else {
      }

      body.position = Vec.add(body.position, Vec.mul(body.velocity, deltaTime));
    }

    for (let i = 0; i < this.bodies.length; i++) {
      for (let j = i + 1; j < this.bodies.length; j++) {
        if (this.cHandler.detectCollision(this.bodies[i], this.bodies[j])) {
          // console.log("FOUND");
          // console.log(this.bodies[i].velocity);
          // console.log(this.bodies[j].velocity);
          this.cHandler.handleCollision(this.bodies[i], this.bodies[j]);
          // console.log(this.bodies[i].velocity);
          // console.log(this.bodies[j].velocity);
        }
      }
    }
  }

  renderGraphics() {
    const ctx = this.canvas.getContext("2d");
    ctx!.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const body of this.bodies) {
      body.draw(this.canvas);
    }
  }

  updateLoop() {
    let currentTime = performance.now();
    let deltaTime = (currentTime - this.lastTime) / 1000; // Convert milliseconds to seconds
    // handleInput(); will handle later
    this.lastTime = currentTime;
    this.updatePhysics(deltaTime);
    // // updateGameLogic(deltaTime);
    this.renderGraphics();
    window.requestAnimationFrame(this.updateLoop.bind(this));
  }
}

export const materialMap = {
  Rock: { density: 0.6, restitution: 0.1 },
  Wood: { density: 0.3, restitution: 0.2 },
  Metal: { density: 1.2, restitution: 0.05 },
  BouncyBall: { density: 0.3, restitution: 0.8 },
  SuperBall: { density: 0.3, restitution: 0.95 },
  Pillow: { density: 0.1, restitution: 0.2 },
  Static: { density: 0.0, restitution: 0.4 },
};

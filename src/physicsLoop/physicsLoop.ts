import { RigidBody } from "../bodies/RigidBody";
import { Circle } from "../geometry/Circle";
import { Vec } from "../geometry/Vector";
import { CollisionHandler } from "../collision/CollisionHandler.ts";

export class physicsLoop {
  gravity: Vec = { x: 0, y: 500 };
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

  startLoop() {
    for (const body of this.bodies) {
      if (body.massData.mass != Number.MAX_SAFE_INTEGER) {
        body.applyForce(Vec.mul(this.gravity, body.massData.mass));
      }
    }
    this.updateLoop();
  }

  updatePhysics(deltaTime) {
    for (let i = 0; i < this.bodies.length; i++) {
      for (let j = i + 1; j < this.bodies.length; j++) {
        if (this.cHandler.detectCollision(this.bodies[i], this.bodies[j])) {
          this.cHandler.handleCollision(this.bodies[i], this.bodies[j]);
        }
      }
    }

    for (const body of this.bodies) {
      // v += (1/m * F) * dt
      // x += v * dt
      body.updatePhysics(deltaTime);
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

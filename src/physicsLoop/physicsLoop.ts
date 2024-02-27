import { RigidBody } from "../bodies/RigidBody";
import { Circle } from "../geometry/Circle";
import { Vec } from "../geometry/Vector";
import { CollisionHandler } from "../collision/CollisionHandler.ts";

class physicsLoop {
  canvas: HTMLCanvasElement;
  lastTime: number;
  bodies: RigidBody[] = [];
  frameRate: number = 60; // Frames per second
  frameInterval: number = 1000 / this.frameRate; // Interval between frames in milliseconds
  materialMap = {
    Rock: { density: 0.6, restitution: 0.1 },
    Wood: { density: 0.3, restitution: 0.2 },
    Metal: { density: 1.2, restitution: 0.05 },
    BouncyBall: { density: 0.3, restitution: 0.8 },
    SuperBall: { density: 0.3, restitution: 0.95 },
    Pillow: { density: 0.1, restitution: 0.2 },
    Static: { density: 0.0, restitution: 0.4 },
  };

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
    let cHandler = new CollisionHandler();

    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        if (cHandler.detectCollision(bodies[i], bodies[j])) {
          cHandler.handleCollision(bodies[i], bodies[j]);
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

const materialMap = {
  Rock: { density: 0.6, restitution: 0.1 },
  Wood: { density: 0.3, restitution: 0.2 },
  Metal: { density: 1.2, restitution: 0.05 },
  BouncyBall: { density: 0.3, restitution: 0.8 },
  SuperBall: { density: 0.3, restitution: 0.95 },
  Pillow: { density: 0.1, restitution: 0.2 },
  Static: { density: 0.0, restitution: 0.4 },
};

const canvas = document.getElementById("env") as HTMLCanvasElement;
const circleOptions = {
  position: {
    x: 100,
    y: 100,
  },
  velocity: {
    x: 10,
    y: 0,
  },
  radius: 10,
  material: materialMap.Wood,
  massData: {
    mass: 5,
  },
  force: { x: 0, y: 9.8 },
};
const circle2Options = {
  position: {
    x: 200,
    y: 100,
  },
  velocity: {
    x: -10,
    y: 0,
  },
  radius: 10,
  material: materialMap.Wood,
  massData: {
    mass: 5,
  },
  force: { x: 0, y: 9.8 },
};
const circle = new Circle(circleOptions);

const circle2 = new Circle(circle2Options);
let bodies: RigidBody[] = [circle, circle2];
const p = new physicsLoop(canvas, bodies);

p.updateLoop();

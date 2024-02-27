import { Circle } from "../geometry/Circle";

function initPhysicsLoop() {
  const canvas = document.getElementById("env") as HTMLCanvasElement;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  physicsLoop(canvas);
}

function physicsLoop(canvas: HTMLCanvasElement) {
  const c = new Circle({
    position: { x: 200, y: 200 },
    radius: 100,
  });
  c.draw(canvas);
}

initPhysicsLoop();

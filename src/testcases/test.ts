import { RigidBody } from "../bodies/RigidBody";
import { Circle } from "../geometry/Circle";
import { physicsLoop, materialMap } from "../physicsLoop/physicsLoop";

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
    mass: 10,
  },
};
const circle2Options = {
  position: {
    x: 200,
    y: 95,
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
};
const circle = new Circle(circleOptions);

const circle2 = new Circle(circle2Options);
let bodies: RigidBody[] = [circle, circle2];
const p = new physicsLoop(canvas, bodies);

p.updateLoop();

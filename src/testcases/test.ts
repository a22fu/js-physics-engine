import { RigidBody } from "../bodies/RigidBody";
import { Circle } from "../geometry/Circle";
import { AABB } from "../geometry/AABB";
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
    mass: 10000,
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
const AABBOptions = {
  velocity: {
    x: -2,
    y: -10,
  },
  min: {
    x: 220,
    y: 220,
  },
  max: {
    x: 240,
    y: 240,
  },
  material: materialMap.Wood,
  massData: {
    mass: 5,
  },
};
const circle = new Circle(circleOptions);
const circle2 = new Circle(circle2Options);
const aabb = new AABB(AABBOptions);
let bodies: RigidBody[] = [circle, circle2, aabb];
const p = new physicsLoop(canvas, bodies);

p.updateLoop();

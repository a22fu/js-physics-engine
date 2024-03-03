import { Shape } from "../bodies/Shape";
import { Circle } from "../geometry/Circle";
import { AABB } from "../geometry/AABB";
import { physicsLoop, materialMap } from "../physicsLoop/physicsLoop";
import { Vec } from "../geometry/Vector";
async function play() {
  const canvas = document.getElementById("env") as HTMLCanvasElement;

  const circleOptions = {
    position: {
      x: 100,
      y: 200,
    },
    velocity: {
      x: 100,
      y: 0,
    },
    radius: 10,
    angularVelocity: 0,
    material: materialMap.BouncyBall,
    massData: {
      mass: 5,
    },
  };

  const AABBOptions = {
    min: {
      x: 20,
      y: 220,
    },
    max: {
      x: 700,
      y: 240,
    },
    material: materialMap.BouncyBall,
    massData: {
      mass: Number.MAX_VALUE,
    },
  };
  const AABB2Options = {
    min: {
      x: 20,
      y: 45,
    },
    max: {
      x: 40,
      y: 215,
    },
    material: materialMap.BouncyBall,
    massData: {
      mass: Number.MAX_VALUE,
    },
  };
  const AABB3Options = {
    min: {
      x: 680,
      y: 45,
    },
    max: {
      x: 700,
      y: 215,
    },
    material: materialMap.BouncyBall,
    massData: {
      mass: Number.MAX_VALUE,
    },
  };
  const AABB4Options = {
    min: {
      x: 20,
      y: 20,
    },
    max: {
      x: 700,
      y: 40,
    },
    material: materialMap.BouncyBall,
    massData: {
      mass: Number.MAX_VALUE,
    },
  };
  const wall = new AABB(AABBOptions);
  const wall2 = new AABB(AABB2Options);
  const wall3 = new AABB(AABB3Options);
  const wall4 = new AABB(AABB4Options);

  let bodies: Shape[] = [];

  for (let i = 0; i < 0; i++) {
    let newOptions = JSON.parse(JSON.stringify(circleOptions));

    // Modify the properties of the newOptions object
    newOptions.position.x = (i + 1) * 100;
    newOptions.velocity.x = 200 - 400 * Math.random();
    newOptions.velocity.y = 200 - 400 * Math.random();

    // Create a new circle with the modified options
    let circle = new Circle(newOptions);

    // Push the new circle to the bodies array
    bodies.push(circle);
  }

  await bodies.push(wall, wall2, wall3, wall4);

  canvas.addEventListener(
    "click",
    function (e) {
      let newOptions = JSON.parse(JSON.stringify(circleOptions));
      newOptions.position.x = e.clientX;
      newOptions.position.y = e.clientY;
      newOptions.velocity.x = 250;
      newOptions.velocity.y = 250;

      let circle = new Circle(newOptions);
      circle.applyForce(Vec.mul(p.gravity, circle.massData.mass));

      // Push the new circle to the bodies array
      bodies.push(circle);
    },
    false
  );

  const p = new physicsLoop(canvas, bodies);

  p.startLoop();
}

play();

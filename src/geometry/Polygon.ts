import { Vec } from "./Vector.ts";
import { Shape } from "../bodies/Shape";

export class Polygon extends Shape {
  // convention edgeLine[i] corresponds to the line of the edge between vertices[i] and vertices[i+1]
  vertices: Vec[] = [];
  edgeLine = [{ a: 0, b: 0, c: 0 }];
  edges: Vec[] = [];

  constructor(options: any) {
    super(options);
    let sum = 0;

    this.vertices.push(this.vertices[0]);

    for (let i = 0; i < this.vertices.length - 1; i++) {
      sum +=
        this.vertices[i].x * this.vertices[i + 1].y -
        this.vertices[i + 1].x * this.vertices[i].y;
    }
    const area = Math.abs(sum) / 2;

    let xsum = 0;
    let ysum = 0;
    for (let i = 0; i < this.vertices.length - 1; i++) {
      xsum +=
        (this.vertices[i].x + this.vertices[i + 1].x) *
        (this.vertices[i].x * this.vertices[i + 1].y -
          this.vertices[i + 1].x * this.vertices[i].y);
      ysum +=
        (this.vertices[i].y + this.vertices[i + 1].y) *
        (this.vertices[i].x * this.vertices[i + 1].y -
          this.vertices[i + 1].x * this.vertices[i].y);
    }
    this.position = { x: xsum / (6 * area), y: ysum / (6 * area) };

    // change vertices to be relative to center
    for (let v of this.vertices) {
      Vec.sub(v, this.position);
    }
    for (let i = 0; i < this.vertices.length - 1; i++) {
      const m =
        (this.vertices[i + 1].y - this.vertices[i].y) /
        (this.vertices[i + 1].y - this.vertices[i].y);
      const b = this.vertices[i].y - m * this.vertices[i].x;
      const edge = Vec.sub(this.vertices[i + 1], this.vertices[i]);
      this.edges.push(edge);
      this.edgeLine.push({ a: -m, b: 1, c: -b });
    }
    this.vertices.pop();
  }

  getSupport(dir: Vec): Vec {
    let bestProjection = 0;
    let bestVertex = { x: 0, y: 0 };
    for (let i = 0; i < this.vertices.length; i++) {
      const v = this.vertices[i];
      const projection = Vec.dot(v, dir);

      if (projection > bestProjection) {
        bestProjection = projection;
        bestVertex = v;
      }
    }
    return bestVertex;
  }

  queryFaceDirections(polygonB: Polygon) {
    for (let i = 0; i < this.edgeLine.length; i++) {
      const vertexB = polygonB.getSupport(
        Vec.rotate(this.edges[i], -Math.PI / 4)
      );
      function distance(line, v: Vec) {
        return (
          Math.abs(line.a * v.x + line.b * v.y + line.c) /
          Math.sqrt(line.a * line.a + line.b * line.b)
        );
      }
      const d = distance(this.edgeLine[i], vertexB);
      let bestDistance = -Number.MAX_VALUE;
      let bestIndex = -1;
      if (d > bestDistance) bestDistance = d;
      bestIndex = i;

      return { distance: bestDistance, index: bestIndex };
    }
  }

  ///in progress
  draw(canvas: HTMLCanvasElement) {}

  updatePhysics(deltaTime: number): void {
    this.velocity = Vec.add(
      this.velocity,
      Vec.mul(this.force, deltaTime * this.massData.iMass)
    );

    this.position = Vec.add(this.position, Vec.mul(this.velocity, deltaTime));
  }
}

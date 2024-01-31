import {Vec} from "./Vector.ts"
import {RigidBody} from "../bodies/RigidBody"


export class Circle extends RigidBody{
    radius: number;
    x: number;
    y: number;
    constructor(radius: number, position: Vec, mass:number, velocity = {x: 0, y:0}, acceleration: Vec){
        super("Circle", mass, velocity, acceleration);
        this.radius = radius;
        this.x = position.x;
        this.y = position.y;
    }
}
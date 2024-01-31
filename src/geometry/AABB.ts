import {Vec} from "./Vector.ts"
import {RigidBody} from "../bodies/RigidBody"

// Axis Aligned Bounding Box, simple rectangle perpendicular to boh axes
export class AABB extends RigidBody{
    min: Vec;
    max: Vec;
    constructor(min: Vec, max: Vec, mass:number, velocity:Vec, acceleration:Vec){
        super("AABB", mass, velocity, acceleration);
        this.min = min;
        this.max = max;
    }
}
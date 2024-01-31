import {Vec} from "../geometry/Vector"
import {Circle} from "../geometry/Circle"
import {AABB} from "../geometry/AABB"

export class RigidBody{
    type: string;
    mass: number;
    velocity: Vec;
    acceleration: Vec;
    constructor(type: string, mass: number, velocity: Vec, acceleration: Vec){
        this.type = type;
        this.mass = mass;
        this.velocity = velocity;
        this.acceleration = acceleration;
    }
}
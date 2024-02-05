import {Vec} from "../geometry/Vector"
import {Circle} from "../geometry/Circle"
import {AABB} from "../geometry/AABB"

export class RigidBody{
    mass: number;
    imass: number;
    velocity: Vec;
    acceleration: Vec;
    restitution: number;
    defaultOptions = {
        mass: 0,
        velocity: 0,
        acceleration: 0,
        restitution: 0
    }
    constructor(options: any){
        this.mass = options.mass || this.defaultOptions.mass;
        this.velocity = options.velocity || this.defaultOptions.velocity;
        this.acceleration = options.acceleration || this.defaultOptions.acceleration;
        this.restitution = options.restitution || this.defaultOptions.restitution;
        if(this.mass == 0){
            this.imass = 0;
        }else{
            this.imass = 1/this.mass;
        }
    }
}
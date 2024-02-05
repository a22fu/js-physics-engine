import {Vec} from "./Vector.ts"
import {RigidBody} from "../bodies/RigidBody"


export class Circle extends RigidBody{
    radius: number;
    x: number;
    y: number;
    pos = {x:0, y:0};
    circleOptions = {
        radius: 0,
        x: 0,
        y: 0
    }

    constructor(options:any){
        super(options);
        this.radius = options.radius || this.circleOptions.radius;
        this.x = options.position.x || this.circleOptions.x;
        this.y = options.position.y || this.circleOptions.y;
        this.pos = {x:this.x, y:this.y};
    }
}
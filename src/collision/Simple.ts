import {Vec} from "../geometry/Vector"
import {Circle} from "../geometry/Circle"
import {AABB} from "../geometry/AABB"

import {RigidBody} from "../bodies/RigidBody"


/**
 * returns whether two RigidBodys collided
 * @param A RigidBody
 * @param B RigidBody
 * @returns if A and B collided
 */
function collisionDetectedCC(A: any, B: any) {
  if(A.type =="Circle" && B.type == "Circle"){
    let r = A.radius + B.radius;
    r *= r;
    return r < ((A.x + B.x)^2 + (A.y + B.y)^2);
  }else if(A.type == "AABB" && B.type == "AABB"){
    if(A.max.x < B.min.x || A.min.x > B.max.x) return false;
    if(A.max.y < B.min.y || A.min.y > B.max.y) return false;
    return true;
  }
}

function collision(A: RigidBody, B: RigidBody){
  let rv = Vec.sub(B.velocity, A.velocity)
  let nv = Vec.dot(rv, );

}
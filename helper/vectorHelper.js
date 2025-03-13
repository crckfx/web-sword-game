import { Vector2 } from "../classes/Vector2.js";

export function multiply_2_vectors(vec_a, vec_b) {
    //
    return new Vector2(
        vec_a.x * vec_b.x,
        vec_a.y * vec_b.y,
    )
}

export function add_two_vectors(vec_a, vec_b) {
    //
    return new Vector2(
        vec_a.x + vec_b.x,
        vec_a.y + vec_b.y,
    )
}


// export function vec_a_minus_vec_b() {

// }
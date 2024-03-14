import { Polynomial, Vector } from "../polynomials"
import type { Scene, Shape } from "../shapes"
import { createDynamicPath, lerp, toDynamicPoint, toLine, toPoint } from "./utils"

export class BaseCubicScene implements Scene {
    A!: Vector
    B!: Vector
    C!: Vector
    D!: Vector

    P!: Polynomial
    Q!: Polynomial
    R!: Polynomial
    S!: Polynomial
    T!: Polynomial
    U!: Polynomial
    //Udiff!: Polynomial

    constructor(points: [x: number, y: number][]) {
        this.A = new Vector(points[0])
        this.B = new Vector(points[1])
        this.C = new Vector(points[2])
        this.D = new Vector(points[3])
        this.update();
    }

    update() {
        this.P = lerp(this.A, this.B)
        this.Q = lerp(this.B, this.C)
        this.R = lerp(this.C, this.D)

        this.S = lerp(this.P, this.Q)
        this.T = lerp(this.Q, this.R)

        this.U = lerp(this.S, this.T)

        //this.Udiff = this.U.differentiate();
    }

    get objects(): Shape[] {
        const update = this.update.bind(this);
        return [
            toLine(this.A, this.B),
            toLine(this.B, this.C),
            toLine(this.C, this.D),

            toLine(this.P, this.Q),
            toLine(this.Q, this.R),

            toLine(this.S, this.T),

            createDynamicPath(this.U),
            // { shape: 'path', path: `M ${this.A.x} ${this.A.y} C ${this.B.x} ${this.B.y} ${this.C.x} ${this.C.y} ${this.D.x} ${this.D.y}` },

            //createDynamicPath(this.Udiff),

            toPoint(this.A, 'A', update),
            toPoint(this.B, 'B', update),
            toPoint(this.C, 'C', update),
            toPoint(this.D, 'D', update),

            toDynamicPoint(this.P, 'P'),
            toDynamicPoint(this.Q, 'Q'),
            toDynamicPoint(this.R, 'R'),
            toDynamicPoint(this.S, 'S'),
            toDynamicPoint(this.T, 'T'),
            toDynamicPoint(this.U, 'U'),
        ]
    }
}

export class CubicScene extends BaseCubicScene {
    constructor() {
        super([[10, 10], [45, 60], [130, 70], [180, -35]])
    }
}

export class CssCubicScene extends BaseCubicScene {
    constructor(x1: number, y1: number, x2: number, y2: number) {
        super([[0, 0], [x1 * 100, y1 * 100], [x2 * 100, y2 * 100], [100, 100]])
    }

    get objects(): Shape[] {
        return [{ shape: 'path', path: `M 0 0 L 0 100 L 100 100 L 100 0 Z` } as Shape].concat(super.objects)
    }
}
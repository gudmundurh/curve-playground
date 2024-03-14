import { Vector, type Polynomial } from "../polynomials";
import type { Scene, Shape } from "../shapes";
import { lerp, toLine, createDynamicPath, toPoint, toDynamicPoint } from "./utils";

export class QuadraticScene implements Scene {
    A = new Vector([10, 10])
    B = new Vector([45, 60])
    C = new Vector([100, -35])

    P!: Polynomial;
    Q!: Polynomial
    R!: Polynomial

    constructor() {
        this.update();
    }

    update() {
        this.P = lerp(this.A, this.B)
        this.Q = lerp(this.B, this.C)
        this.R = lerp(this.P, this.Q)
    }

    get objects(): Shape[] {
        return [
            toLine(this.A, this.B),
            toLine(this.B, this.C),

            toLine(this.P, this.Q),

            // { shape: 'path', path: `M ${this.A.toSvg()} Q ${this.B.toSvg()} ${this.C.toSvg()}` },
            createDynamicPath(this.R),

            toPoint(this.A, 'A', this.update.bind(this)),
            toPoint(this.B, 'B', this.update.bind(this)),
            toPoint(this.C, 'C', this.update.bind(this)),
            toDynamicPoint(this.P, 'P'),
            toDynamicPoint(this.Q, 'Q'),
            toDynamicPoint(this.R, 'R')]
    }
}
import type { DynamicLine, DynamicPath, DynamicPoint, Point, Scene, Shape } from "./shapes";
import { Polynomial, Vector } from "./polynomials";

function toPolynomial(p: Polynomial | Vector): Polynomial {
    if (p instanceof Polynomial)
        return p;

    return new Polynomial([p]);
}

function V(n: number) {
    return new Vector([n]);
}

function lerp(p: Polynomial | Vector, q: Polynomial | Vector): Polynomial {
    p = toPolynomial(p);
    q = toPolynomial(q);

    return p.multiply(new Polynomial([V(1), V(-1)]))
        .add(q.multiply(new Polynomial([V(0), V(1)])));
}

function toPoint(v: Vector): Point {
    return {
        shape: "point",
        x: v.values[0],
        y: v.values[1],
    };
}

function toLine(p: Polynomial | Vector, q: Polynomial | Vector): DynamicLine {
    const pp = toPolynomial(p);
    const qq = toPolynomial(q);

    return {
        shape: "dynamicLine",
        start: { shape: 'dynamicPoint', eval: t => toPoint(pp.eval(t)) },
        end: { shape: 'dynamicPoint', eval: t => toPoint(qq.eval(t)) },
    };
}

function toDynamicPoint(p: Polynomial | Vector, label: string): DynamicPoint {
    const pp = toPolynomial(p);
    return {
        shape: "dynamicPoint",
        eval: t => toPoint(pp.eval(t))
    }
}

function createDynamicPath(curvePoint: Polynomial): DynamicPath {
    return {
        shape: "dynamicPath",
        eval: (t: number) => {
            if (t === 0)
                return '';

            // Draw the curve up to t as line segments, using max of 50 segments
            const segments = Math.round(t * 50);
            const parts: string[] = [];

            for (let i = 0; i <= segments; i++) {
                const p = curvePoint.eval(t * i / segments);
                parts.push(`${i === 0 ? 'M' : 'L'} ${p.toSvg()}`);
            }
            return parts.join(' ')
        }
    };
}


export class QuadraticScene implements Scene {
    A = new Vector([10, 10])
    B = new Vector([45, 60])
    C = new Vector([100, -35])

    P = lerp(this.A, this.B)
    Q = lerp(this.B, this.C)

    R = lerp(this.P, this.Q)

    get objects(): Shape[] {
        return [
            toLine(this.A, this.B),
            toLine(this.B, this.C),

            toLine(this.P, this.Q),

            // { shape: 'path', path: `M ${this.A.toSvg()} Q ${this.B.toSvg()} ${this.C.toSvg()}` },
            createDynamicPath(this.R),

            toDynamicPoint(this.A, 'A'),
            toDynamicPoint(this.B, 'B'),
            toDynamicPoint(this.C, 'C'),
            toDynamicPoint(this.P, 'P'),
            toDynamicPoint(this.Q, 'Q'),
            toDynamicPoint(this.R, 'R')]
    }
}


export class CubicScene implements Scene {
    A = new Vector([10, 10])
    B = new Vector([45, 60])
    C = new Vector([130, 70])
    D = new Vector([180, -35])

    P = lerp(this.A, this.B)
    Q = lerp(this.B, this.C)
    R = lerp(this.C, this.D)

    S = lerp(this.P, this.Q)
    T = lerp(this.Q, this.R)

    U = lerp(this.S, this.T)

    get objects(): Shape[] {
        return [
            toLine(this.A, this.B),
            toLine(this.B, this.C),
            toLine(this.C, this.D),

            toLine(this.P, this.Q),
            toLine(this.Q, this.R),

            toLine(this.S, this.T),

            createDynamicPath(this.U),
            // { shape: 'path', path: `M ${this.A.x} ${this.A.y} C ${this.B.x} ${this.B.y} ${this.C.x} ${this.C.y} ${this.D.x} ${this.D.y}` },

            toDynamicPoint(this.A, 'A'),
            toDynamicPoint(this.B, 'B'),
            toDynamicPoint(this.C, 'C'),
            toDynamicPoint(this.D, 'D'),
            toDynamicPoint(this.P, 'P'),
            toDynamicPoint(this.Q, 'Q'),
            toDynamicPoint(this.R, 'R'),
            toDynamicPoint(this.S, 'S'),
            toDynamicPoint(this.T, 'T'),
            toDynamicPoint(this.U, 'U'),
        ]
    }
}
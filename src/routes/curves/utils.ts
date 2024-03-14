import type { DynamicLine, DynamicPath, DynamicPoint, Point, Scene, Shape } from "../shapes";
import { Polynomial, Vector } from "../polynomials";

export function toPolynomial(p: Polynomial | Vector): Polynomial {
    if (p instanceof Polynomial)
        return p;

    return new Polynomial([p]);
}

export function V(n: number) {
    return new Vector([n]);
}

export function lerp(p: Polynomial | Vector, q: Polynomial | Vector): Polynomial {
    p = toPolynomial(p);
    q = toPolynomial(q);

    return p.multiply(new Polynomial([V(1), V(-1)]))
        .add(q.multiply(new Polynomial([V(0), V(1)])));
}

export function toPoint(v: Vector, label?: string, updateCallback?: () => void): Point {
    return {
        shape: "point",
        x: v.values[0],
        y: v.values[1],
        update(x, y) {
            v.values[0] = x
            v.values[1] = y
            updateCallback && updateCallback();
        },
        label
    };
}

export function toLine(p: Polynomial | Vector, q: Polynomial | Vector): DynamicLine {
    const pp = toPolynomial(p);
    const qq = toPolynomial(q);

    return {
        shape: "dynamicLine",
        start: { shape: 'dynamicPoint', eval: t => toPoint(pp.eval(t)) },
        end: { shape: 'dynamicPoint', eval: t => toPoint(qq.eval(t)) },
    };
}

export function toDynamicPoint(p: Polynomial | Vector, label: string): DynamicPoint {
    const pp = toPolynomial(p);
    return {
        shape: "dynamicPoint",
        eval: t => toPoint(pp.eval(t))
    }
}

export function createDynamicPath(curvePoint: Polynomial): DynamicPath {
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


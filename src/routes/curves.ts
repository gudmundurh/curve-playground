
type Point = {
    x: number,
    y: number,
    label?: string
}

function mult(factor: (u: number) => number, p: DynamicPoint): DynamicPoint {
    return t => ({
        x: p(t).x * factor(t),
        y: p(t).y * factor(t),
    })
}

function add(p: DynamicPoint, q: DynamicPoint): DynamicPoint {
    return t => ({
        x: p(t).x + q(t).x,
        y: p(t).y + q(t).y,
    });
}

type DynamicPoint = {
    (t: number): Point,
    label?: string
};


function toDynamicPoint(p: DynamicPoint | Point) {
    return typeof p === 'function' ? p : (t: number) => p;
}

function lerp(p: DynamicPoint | Point, q: DynamicPoint | Point, label: string): DynamicPoint {
    p = toDynamicPoint(p);
    q = toDynamicPoint(q);

    const r = add(mult(t => 1 - t, p), mult(t => t, q));
    r.label = label;
    return r;
}


export class Scene {
    A: Point = { x: 10, y: 10, label: 'A' };
    B: Point = { x: 45, y: 60, label: 'B' };
    C: Point = { x: 100, y: -35, label: 'C' };

    P = lerp(this.A, this.B, 'P')
    Q = lerp(this.B, this.C, 'Q')
    R = lerp(this.P, this.Q, 'R')

    get objects() {
        return [this.A, this.B, this.C, this.P, this.Q, this.R]
    }
}


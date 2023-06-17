
type Point = {
    x: number,
    y: number,
    label?: string,
    shape: 'point'
}

function mult(factor: (u: number) => number, p: DynamicPoint): DynamicPoint {
    return {
        eval: (t) => ({
            x: p.eval(t).x * factor(t),
            y: p.eval(t).y * factor(t),
            shape: 'point'
        }),
        shape: 'dynamicPoint'
    }
}

function add(p: DynamicPoint, q: DynamicPoint): DynamicPoint {
    return {
        eval: t => ({
            x: p.eval(t).x + q.eval(t).x,
            y: p.eval(t).y + q.eval(t).y,
            shape: 'point'
        }),
        shape: 'dynamicPoint'
    };
}

type DynamicPoint = {
    shape: 'dynamicPoint'
    eval(t: number): Point,
    label?: string
};

function toDynamicPoint(p: DynamicPoint | Point): DynamicPoint {
    if (p.shape === 'dynamicPoint')
        return p;

    return {
        eval: () => p,
        shape: 'dynamicPoint',
        label: p.label
    };
}

function lerp(p: DynamicPoint | Point, q: DynamicPoint | Point, label: string): DynamicPoint {
    p = toDynamicPoint(p);
    q = toDynamicPoint(q);

    const r = add(mult(t => 1 - t, p), mult(t => t, q));
    r.label = label;
    return r;
}

type DynamicLine = {
    shape: 'dynamicLine'
    start: DynamicPoint
    end: DynamicPoint
}

type Shape = Point | DynamicPoint | DynamicLine;


export class Scene {
    A: Point = { x: 10, y: 10, label: 'A', shape: 'point' };
    B: Point = { x: 45, y: 60, label: 'B', shape: 'point' };
    C: Point = { x: 100, y: -35, label: 'C', shape: 'point' };

    P = lerp(this.A, this.B, 'P')
    Q = lerp(this.B, this.C, 'Q')
    R = lerp(this.P, this.Q, 'R')

    get objects() {
        return [
            toDynamicPoint(this.A),
            toDynamicPoint(this.B),
            toDynamicPoint(this.C),
            this.P,
            this.Q,
            this.R]
    }
}


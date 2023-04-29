
export type Point = {
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

export type DynamicPoint = {
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

export type DynamicLine = {
    shape: 'dynamicLine'
    start: DynamicPoint
    end: DynamicPoint
}

function toLine(p: DynamicPoint | Point, q: DynamicPoint | Point): DynamicLine {
    return {
        start: toDynamicPoint(p),
        end: toDynamicPoint(q),
        shape: 'dynamicLine'
    }
}

export type Path = {
    path: string,
    shape: 'path'
}

export type Shape = Point | DynamicPoint | DynamicLine | Path;


export interface Scene {
    get objects(): Shape[]
}

export class QScene implements Scene {
    A: Point = { x: 10, y: 10, label: 'A', shape: 'point' };
    B: Point = { x: 45, y: 60, label: 'B', shape: 'point' };
    C: Point = { x: 100, y: -35, label: 'C', shape: 'point' };

    P = lerp(this.A, this.B, 'P')
    Q = lerp(this.B, this.C, 'Q')
    R = lerp(this.P, this.Q, 'R')

    get objects(): Shape[] {
        return [
            toLine(this.A, this.B),
            toLine(this.B, this.C),
            toLine(this.P, this.Q),
            { shape: 'path', path: `M ${this.A.x} ${this.A.y} Q ${this.B.x} ${this.B.y} ${this.C.x} ${this.C.y}` },
            this.A,
            this.B,
            this.C,
            this.P,
            this.Q,
            this.R]
    }
}

export class CubicScene implements Scene{
    A: Point = { x: 10, y: 10, label: 'A', shape: 'point' };
    B: Point = { x: 45, y: 60, label: 'B', shape: 'point' };
    C: Point = { x: 100, y: -35, label: 'C', shape: 'point' };
    D: Point = { x: 180, y: -35, label: 'D', shape: 'point' };

    P = lerp(this.A, this.B, 'P')
    Q = lerp(this.B, this.C, 'Q')
    R = lerp(this.C, this.D, 'R')

    S = lerp(this.P, this.Q, 'S')
    T = lerp(this.Q, this.R, 'S')

    U = lerp(this.S, this.T, 'U')


    get objects(): Shape[] {
        return [
            toLine(this.A, this.B),
            toLine(this.B, this.C),
            toLine(this.C, this.D),

            toLine(this.P, this.Q),
            toLine(this.Q, this.R),

            toLine(this.S, this.T),

            { shape: 'path', path: `M ${this.A.x} ${this.A.y} C ${this.B.x} ${this.B.y} ${this.C.x} ${this.C.y} ${this.D.x} ${this.D.y}` },

            this.A,
            this.B,
            this.C,
            this.P,
            this.Q,
            this.R,
            this.S,
            this.T,
            this.U,
        ]
    }
    

}
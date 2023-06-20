export type Point = {
    update(x: number, y: number): void;
    x: number,
    y: number,
    label?: string,
    shape: 'point'
}

export type DynamicPoint = {
    shape: 'dynamicPoint'
    eval(t: number): Point,
    label?: string
};

export type DynamicLine = {
    shape: 'dynamicLine'
    start: DynamicPoint
    end: DynamicPoint
}

export type Path = {
    path: string,
    shape: 'path'
}

export type DynamicPath = {
    eval: (t: number) => string
    shape: 'dynamicPath'
}

export type Shape = Point | DynamicPoint | DynamicLine | Path | DynamicPath;

export interface Scene {
    get objects(): Shape[]
}

export function getBoundingBoxOfPoints(shapes: Shape[]) {
    let [x1, y1, x2, y2] = [Infinity, Infinity, -Infinity, -Infinity];

    for (let i = 0; i < shapes.length; i++) {
        if (shapes[i].shape !== 'point')
            continue;

        const p = shapes[i] as Point;

        x1 = Math.min(x1, p.x);
        y1 = Math.min(y1, p.y);
        
        x2 = Math.max(x2, p.x);
        y2 = Math.max(y2, p.y);
    }

    return { x1, y1, x2, y2 };
}
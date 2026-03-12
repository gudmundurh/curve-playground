export type MoveablePoint = {
    update(x: number, y: number): void;
    x: number,
    y: number,
    label?: string,
    shape: 'moveablePoint'
}

export type Point = {
    x: number,
    y: number,
    label?: string,
    shape: 'point'
}

export type DynamicPoint = {
    shape: 'dynamicPoint'
    eval(t: number): Point | MoveablePoint,
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

export type Shape = Point | DynamicPoint | MoveablePoint | DynamicLine | Path | DynamicPath;

export interface Scene {
    get objects(): Shape[]
}
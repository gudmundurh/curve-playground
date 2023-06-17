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
export interface Vertex {
    x: number;
    y: number;
}

export enum State {
    DRAWING,
    MOVING,
    TRANSFORM,
    SELECTING,
    COLOR
}

export enum ObjectType {
    POINT,
    LINE,
    SQUARE,
    RECTANGLE,
    POLYGON
}
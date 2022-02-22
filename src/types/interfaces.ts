export interface Vertex {
    x: number;
    y: number;
}

export enum State {
    DRAWING,
    MOVING,
    SELECTING
}

export enum ObjectType {
    POINT,
    LINE,
    SQUARE,
    RECTANGLE,
    POLYGON
}
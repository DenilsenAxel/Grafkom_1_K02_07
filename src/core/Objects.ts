import { ObjectType, Vertex } from '../types/interfaces';
import { IdentityMatrix } from '../utils/Utils';

export class BaseObject {
    protected type!: ObjectType;
    protected projectionMatrix: number[];
    protected color: number[];

    constructor() {
        this.projectionMatrix = IdentityMatrix;
        this.color = [1.0, 0.0, 0.0, 1.0]; // Red
    }

    public getType() {
        return this.type;
    }

    public getColor() {
        return this.color;
    }

    public setColor(newColor: number[]) {
        this.color = newColor;
    }

    public getProjectionMatrix() {
        return this.projectionMatrix;
    }
}

export class PointObject extends BaseObject {
    private vertex: Vertex;

    constructor(x: number, y: number) {
        super();
        this.vertex = {
            x: x,
            y: y,
        };
        this.type = ObjectType.POINT;
    }

    public getVertex() {
        return this.vertex;
    }
}

export class LineObject extends BaseObject {
    private points: Vertex[];

    constructor(points: Vertex[]) {
        super();
        this.points = points;
        this.type = ObjectType.LINE;
    }

    public getPoints() {
        return this.points;
    }
}

export class PolygonObject extends BaseObject {
    private points: Array<Vertex>;

    constructor(points: Array<Vertex>) {
        super();
        this.type = ObjectType.POLYGON;
        this.points = points;
    }

    public getPoints() {
        return this.points;
    }
}

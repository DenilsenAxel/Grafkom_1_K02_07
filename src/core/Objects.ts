import { ObjectType, Vertex } from '../types/interfaces';
import { IdentityMatrix } from '../utils/Utils';

export class BaseObject {
    protected type!: ObjectType;
    protected projectionMatrix: number[];
    protected color: number[];

    constructor(color: number[]) {
        this.projectionMatrix = IdentityMatrix;
        this.color = color
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

    constructor(x: number, y: number, color: number[]) {
        super(color);
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

    constructor(points: Vertex[], color: number[]) {
        super(color);
        this.points = points;
        this.type = ObjectType.LINE;
    }

    public getPoints() {
        return this.points;
    }
}

export class PolygonObject extends BaseObject {
    private points: Array<Vertex>;

    constructor(points: Array<Vertex>, color: number[]) {
        super(color);
        this.type = ObjectType.POLYGON;
        this.points = points;
    }

    public getPoints() {
        return this.points;
    }
}

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

    public setProjectionMatrix(projMat: number[]) {
        this.projectionMatrix = projMat;
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

    public mutatePoints(newPoints: Vertex[]) {
        this.points = newPoints;
    }
}

export class SquareObject extends BaseObject {
    private center: Vertex;
    private size: number;
    private width: number = 800;
    private height: number = 600;

    constructor(points: Array<Vertex>, size : number, color: number[]) {
        super(color);
        this.type = ObjectType.SQUARE
        this.center = points[0]
        this.size = size
    }

    public getCenter() {
        return this.center
    }

    public getSize() {
        return this.size
    }

    public setSize(size: number){
        this.size = size
    }

    public getAllVertex(){
        const x1 = this.center.x + this.size/this.width
        const x2 = this.center.x - this.size/this.width
        const y1 = this.center.y + (this.size + this.size/10)/this.height
        const y2 = this.center.y - (this.size + this.size/10)/this.height

        // const x1 = this.getCenter().x + 0.5 * this.getSize()
        // const x2 = this.getCenter().x - 0.5 * this.getSize()
        // const y1 = this.getCenter().y + 0.5 * this.getSize()
        // const y2 = this.getCenter().y - 0.5 * this.getSize()

        let squareVertex: Array<number> = []
        squareVertex.push(x1, x2, y1, y2)

        return squareVertex;
    }

}

export class RectangleObject extends BaseObject {
    private points: Array<Vertex>;

    constructor(points: Array<Vertex>, color: number[]) {
        super(color)
        this.type = ObjectType.RECTANGLE
        this.points = points
    }

    public getPoints() {
        return this.points
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

    public mutatePoints(newPoints: Array<Vertex>) {
        this.points = newPoints;
    }
}

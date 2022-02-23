import { ObjectType, Vertex } from '../types/interfaces';
import { BaseObject, PointObject, LineObject, PolygonObject } from './Objects';

export class Drawer {
    private canvas!: HTMLCanvasElement;
    private gl!: WebGL2RenderingContext;
    private vertexShader!: WebGLShader;
    private fragmentShader!: WebGLShader;
    private shaderProgram!: WebGLProgram;
    private objects: Array<BaseObject> = [];

    constructor(canvasElement: HTMLCanvasElement, vertexShader: string, fragmentShader: string) {
        this.canvas = canvasElement;
        this.gl = this.canvas.getContext('webgl2') as WebGL2RenderingContext;

        this.gl.clearColor(1, 1, 1, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vertexShader);
        this.fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fragmentShader);
        this.shaderProgram = this.loadProgram();
    }

    private loadProgram() {
        const shaderProgram = this.gl.createProgram() as WebGLProgram;
        this.gl.attachShader(shaderProgram, this.vertexShader);
        this.gl.attachShader(shaderProgram, this.fragmentShader);
        this.gl.linkProgram(shaderProgram);

        return shaderProgram;
    }

    private loadShader(type: number, shaderString: string) {
        const shader = this.gl.createShader(type) as WebGLShader;
        this.gl.shaderSource(shader, shaderString);
        this.gl.compileShader(shader);

        return shader;
    }

    public getObjects(): Array<BaseObject> {
        return this.objects;
    }

    public addObject(obj: BaseObject) {
        this.objects.push(obj);
    }

    public drawScene() {
        for (let i = 0; i < this.objects.length; i++) {
            const obj = this.objects[i];
            this.drawObject(obj);
        }
    }

    public drawObject(obj: BaseObject) {
        if (obj.getType() === ObjectType.POINT) {
            this.drawPoint(obj as PointObject);
        } else if (obj.getType() === ObjectType.LINE) {
            this.drawLine(obj as LineObject);
        } else if (obj.getType() === ObjectType.POLYGON) {
            this.drawPolygon(obj as PolygonObject);
        }
    }

    public drawPoint(obj: PointObject) {
        this.gl.useProgram(this.shaderProgram);
        const points = [obj.getVertex().x, obj.getVertex().y];
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(points), this.gl.STATIC_DRAW);

        const vertexPosition = this.gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
        const uniformCol = this.gl.getUniformLocation(this.shaderProgram, 'uColor');
        const projectionLocation = this.gl.getUniformLocation(
            this.shaderProgram,
            'uProjectionMatrix'
        );

        this.gl.vertexAttribPointer(vertexPosition, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.uniformMatrix3fv(projectionLocation, false, obj.getProjectionMatrix());
        this.gl.uniform4fv(uniformCol, obj.getColor());
        this.gl.enableVertexAttribArray(vertexPosition);
        this.gl.drawArrays(this.gl.POINTS, 0, 1);
    }

    public drawLine(obj: LineObject) {
        this.gl.useProgram(this.shaderProgram);
        const points = [
            obj.getPoints()[0].x,
            obj.getPoints()[0].y,
            obj.getPoints()[1].x,
            obj.getPoints()[1].y,
        ];
        const buffer = this.gl.createBuffer() as WebGLBuffer;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(points), this.gl.STATIC_DRAW);

        const vertexPosition = this.gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
        const uniformCol = this.gl.getUniformLocation(this.shaderProgram, 'uColor');
        const projectionLocation = this.gl.getUniformLocation(
            this.shaderProgram,
            'uProjectionMatrix'
        );

        this.gl.vertexAttribPointer(vertexPosition, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.uniformMatrix3fv(projectionLocation, false, obj.getProjectionMatrix());
        this.gl.uniform4fv(uniformCol, obj.getColor());
        this.gl.enableVertexAttribArray(vertexPosition);

        this.gl.drawArrays(this.gl.LINES, 0, 2);
    }

    public drawTriangle(
        point1: Vertex,
        point2: Vertex,
        point3: Vertex,
        color: number[],
        projectionMatrix: number[]
    ) {
        this.gl.useProgram(this.shaderProgram);

        // Create buffer
        const buffer = this.gl.createBuffer() as WebGLBuffer;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array([point1.x, point1.y, point2.x, point2.y, point3.x, point3.y]),
            this.gl.STATIC_DRAW
        );

        const vertexPosition = this.gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
        const uniformCol = this.gl.getUniformLocation(this.shaderProgram, 'uColor');
        const projectionLocation = this.gl.getUniformLocation(
            this.shaderProgram,
            'uProjectionMatrix'
        );

        this.gl.vertexAttribPointer(vertexPosition, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.uniformMatrix3fv(projectionLocation, false, projectionMatrix);

        this.gl.vertexAttribPointer(vertexPosition, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.uniform4fv(uniformCol, color); // This will produce red color (in RGBA 1,0,0,1 is red)
        this.gl.enableVertexAttribArray(vertexPosition);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
    }

    public drawPolygon(obj: PolygonObject) {
        this.gl.useProgram(this.shaderProgram);

        for (let i = 1; i < obj.getPoints().length - 1; i++) {
            this.drawTriangle(
                { x: obj.getPoints()[0].x, y: obj.getPoints()[0].y },
                { x: obj.getPoints()[i].x, y: obj.getPoints()[i].y },
                { x: obj.getPoints()[i + 1].x, y: obj.getPoints()[i + 1].y },
                obj.getColor(),
                obj.getProjectionMatrix()
            );
        }
    }

    public clearPoints() {
        this.objects = this.objects.filter((obj) => obj.getType() !== ObjectType.POINT);
    }
}

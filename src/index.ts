import './styles.css';
import VertexShader from './shaders/VertexShader.glsl';
import FragmentShader from './shaders/FragmentShader.glsl';
import { Drawer } from './core/Drawer';
import { ObjectType, State, Vertex } from './types/interfaces';
import { convertPosToClip } from './utils/Utils';
import { PointObject, LineObject, PolygonObject, BaseObject } from './core/Objects';

let drawer: Drawer | null = null;
let isDrawing: Boolean = false;
let mousePos: [number, number] = [0, 0];
let isMouseClicked = false;
let state: State = State.SELECTING;
let vertices: Array<Vertex> = [];
let objectType: ObjectType | null = null;
let maxVertex = -1;

function main(): void {
    const canvas = document.querySelector('#glCanvas') as HTMLCanvasElement;
    canvas.width = 800;
    canvas.height = 600;

    drawer = new Drawer(canvas, VertexShader, FragmentShader);

    setupUI();

    canvas.addEventListener('click', (e) => {
        clickEvent(e, canvas);
    });

    canvas.addEventListener(
        'mousemove',
        (e) => {
            dragEvent(e, canvas);
        },
        false
    );

    canvas.addEventListener('mousedown', () => {
        isMouseClicked = true;
    });
    canvas.addEventListener('mouseup', () => {
        isMouseClicked = false;
    });

    const requestAnimationFunction = (time: number) => {
        time *= 0.1;
        if (drawer) {
            drawer.drawScene();
        }
        window.requestAnimationFrame(requestAnimationFunction);
    };
    window.requestAnimationFrame(requestAnimationFunction);
}

function setupUI(): void {
    const lineBtn = document.getElementById('line-btn');
    const squareBtn = document.getElementById('square-btn');
    const rectangleBtn = document.getElementById('rectangle-btn');
    const polyBtn = document.getElementById('polygon-btn');
    const drawBtn = document.getElementById('draw-btn');
    const moveBtn = document.getElementById('move-btn');
    const transformBtn = document.getElementById('transform-btn');

    lineBtn?.addEventListener('click', () => {
        setDrawLine();
    });
    squareBtn?.addEventListener('click', () => {
        setDrawSquare();
    });
    rectangleBtn?.addEventListener('click', () => {
        setDrawRectangle();
    });
    polyBtn?.addEventListener('click', () => {
        setDrawPoly();
    });

    drawBtn?.addEventListener('click', () => {
        setStateDraw();
    });
    moveBtn?.addEventListener('click', () => {
        setStateMove();
    });
    transformBtn?.addEventListener('click', () => {
        setStateTransform();
    });
}

function setDrawLine() {
    setStateDraw();
    objectType = ObjectType.LINE;
    setShapeBtnActive(objectType);
    maxVertex = 2;
}

function setDrawSquare() {
    setStateDraw();
    objectType = ObjectType.SQUARE;
    setShapeBtnActive(objectType);
    maxVertex = 2;
}

function setDrawRectangle() {
    setStateDraw();
    objectType = ObjectType.RECTANGLE;
    setShapeBtnActive(objectType);
    maxVertex = 2;
}

function setDrawPoly() {
    setStateDraw();
    objectType = ObjectType.POLYGON;
    setShapeBtnActive(objectType);
    maxVertex = 5;
}

function setStateDraw() {
    state = State.DRAWING;
    setStateBtnActive(State.DRAWING);
    vertices = [];
}

function setStateMove() {
    state = State.MOVING;
    setStateBtnActive(State.MOVING);
}

function setStateTransform() {
    state = State.TRANSFORM;
    setStateBtnActive(State.TRANSFORM);
}

function setShapeBtnActive(objectType: ObjectType) {
    const lineBtn = document.getElementById('line-btn');
    const squareBtn = document.getElementById('square-btn');
    const rectangleBtn = document.getElementById('rectangle-btn');
    const polyBtn = document.getElementById('polygon-btn');

    lineBtn?.classList.remove('active');
    squareBtn?.classList.remove('active');
    rectangleBtn?.classList.remove('active');
    polyBtn?.classList.remove('active');

    switch (objectType) {
        case ObjectType.LINE:
            lineBtn?.classList.add('active');
            break;
        case ObjectType.SQUARE:
            squareBtn?.classList.add('active');
            break;
        case ObjectType.RECTANGLE:
            rectangleBtn?.classList.add('active');
            break;
        case ObjectType.POLYGON:
            polyBtn?.classList.add('active');
            break;
        default:
            break;
    }
}

function setStateBtnActive(state: State) {
    const drawBtn = document.getElementById('draw-btn');
    const moveBtn = document.getElementById('move-btn');
    const transformBtn = document.getElementById('transform-btn');

    drawBtn?.classList.remove('active');
    moveBtn?.classList.remove('active');
    transformBtn?.classList.remove('active');

    switch (state) {
        case State.DRAWING:
            drawBtn?.classList.add('active');
            break;
        case State.MOVING:
            moveBtn?.classList.add('active');
            break;
        case State.TRANSFORM:
            transformBtn?.classList.add('active');
            break;
        default:
            break;
    }
}

function clickEvent(e: MouseEvent, canvas: HTMLCanvasElement) {
    const bounding = canvas.getBoundingClientRect();
    let { x, y } = convertPosToClip(e.x, e.y, bounding);

    if (state === State.DRAWING) {
        let vertex: Vertex = { x, y };
        vertices.push(vertex);

        let point: PointObject = new PointObject(x, y);
        drawer?.addObject(point);

        if (vertices.length === maxVertex) {
            switch (objectType) {
                case ObjectType.LINE:
                    drawer?.addObject(new LineObject(vertices));
                    break;
                case ObjectType.SQUARE:
                    break;
                case ObjectType.RECTANGLE:
                    break;
                case ObjectType.POLYGON:
                    let newPolygon = new PolygonObject(vertices);
                    drawer?.addObject(newPolygon);

                    break;
            }

            drawer?.clearPoints();
            vertices = [];
        }
    }

    console.log(drawer?.getObjects());
}

// calculate euclidean distance between two points
function getEuclideanDistance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

let closestObjectId = -1;
let closestObjectPointId = -1;

function dragEvent(e: MouseEvent, canvas: HTMLCanvasElement) {
    if (state === State.MOVING && isMouseClicked) {
        // find the object that is closest to mouse position that is still within threshold
        let threshold = 0.01;
        let { x, y } = convertPosToClip(e.x, e.y, canvas.getBoundingClientRect());

        let found = false;

        drawer?.getObjects().forEach((object, id) => {
            let currentId = id;
            if (object.getType() === ObjectType.LINE) {
                let line = object as LineObject;

                line.getPoints().forEach((point, id) => {
                    if (!found) {
                        let distance = getEuclideanDistance(point.x, point.y, x, y);
                        if (distance <= threshold) {
                            closestObjectId = currentId;
                            closestObjectPointId = id;
                            found = true;
                        }
                    }
                });
            } else if (object.getType() === ObjectType.POLYGON) {
                let polygon = object as PolygonObject;

                polygon.getPoints().forEach((point, id) => {
                    if (!found) {
                        let distance = getEuclideanDistance(point.x, point.y, x, y);
                        if (distance <= threshold) {
                            closestObjectId = currentId;
                            closestObjectPointId = id;
                            found = true;
                        }
                    }
                });
            }
        });

        // if found, move the object
        console.log(closestObjectId);
        if (closestObjectId !== -1 && closestObjectPointId !== -1 && found) {
            let object = drawer?.getObjects()[closestObjectId];
            if (object) {
                if (object.getType() === ObjectType.LINE) {
                    let line = object as LineObject;
                    let point = line.getPoints()[closestObjectPointId];
                    point.x = x;
                    point.y = y;

                    drawer?.replaceObjectAt(closestObjectId, line);
                } else if (object.getType() === ObjectType.POLYGON) {
                    let polygon = object as PolygonObject;
                    let point = polygon.getPoints()[closestObjectPointId];
                    point.x = x;
                    point.y = y;

                    drawer?.replaceObjectAt(closestObjectId, polygon);
                }
            }
            closestObjectId = -1;
            closestObjectPointId = -1;
        }
    }
}

window.onload = main;

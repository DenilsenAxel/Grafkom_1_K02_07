import './styles.css';
import VertexShader from './shaders/VertexShader.glsl';
import FragmentShader from './shaders/FragmentShader.glsl';
import { Drawer } from './core/Drawer';
import { ObjectType, State, Vertex } from './types/interfaces';
import { convertColorString, convertPosToClip } from './utils/Utils';
import {
    PointObject,
    PolygonObject,
    LineObject,
    RectangleObject,
    SquareObject,
} from './core/Objects';

let drawer: Drawer | null = null;
let mousePos: [number, number] = [0, 0];
let isMouseClicked = false;
let state: State = State.SELECTING;
let vertices: Array<Vertex> = [];
let color: number[] = [1.0, 0.0, 0.0, 1.0];
let objectType: ObjectType | null = null;
let maxVertex = -1;

function main(): void {
    const canvas = document.querySelector('#glCanvas') as HTMLCanvasElement;
    canvas.width = 800;
    canvas.height = 600;

    drawer = new Drawer(canvas, VertexShader, FragmentShader);

    setupUI();
    setupModal();

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
    const colorBtn = document.getElementById('color-btn');
    const resetBtn = document.getElementById('reset-btn');

    const verticesInput = document.getElementById('poly-vertices') as HTMLInputElement;
    const colorInput = document.getElementById('color-input') as HTMLInputElement;

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
        setDrawPoly(parseInt(verticesInput.value));
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
    colorBtn?.addEventListener('click', () => {
        setStateColor();
    });
    resetBtn?.addEventListener('click', () => {
        drawer?.reset();
    });

    verticesInput.addEventListener('change', () => {
        setDrawPoly(parseInt(verticesInput.value));
    });
    colorInput?.addEventListener('change', () => {
        color = convertColorString(colorInput.value);
    });
}

function setupModal() {
    const modal = document.getElementById('help-modal') as HTMLElement;
    const openModalBtn = document.getElementById('help-btn') as HTMLElement;
    const closeBtn = document.getElementsByClassName('close')[0] as HTMLElement;

    openModalBtn.onclick = function () {
        modal.style.display = 'block';
    };

    closeBtn.onclick = function () {
        modal.style.display = 'none';
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

function setDrawLine() {
    setStateDraw();
    objectType = ObjectType.LINE;
    setShapeBtnActive(objectType);
    resetVertices();
    maxVertex = 2;
}

function setDrawSquare() {
    setStateDraw();
    objectType = ObjectType.SQUARE;
    setShapeBtnActive(objectType);
    resetVertices();
    maxVertex = 1;
}

function setDrawRectangle() {
    setStateDraw();
    objectType = ObjectType.RECTANGLE;
    setShapeBtnActive(objectType);
    resetVertices();
    maxVertex = 2;
}

function setDrawPoly(num: number) {
    setStateDraw();
    objectType = ObjectType.POLYGON;
    setShapeBtnActive(objectType);
    resetVertices();
    maxVertex = num;
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

function setStateColor() {
    state = State.COLOR;
    setStateBtnActive(State.COLOR);
}

function setShapeBtnActive(objectType: ObjectType) {
    const lineBtn = document.getElementById('line-btn');
    const squareBtn = document.getElementById('square-btn');
    const rectangleBtn = document.getElementById('rectangle-btn');
    const polyBtn = document.getElementById('polygon-btn');

    const verticesElement = document.getElementById('poly-input') as HTMLElement;
    const sizeInput = document.getElementById('square-size-input') as HTMLInputElement;

    lineBtn?.classList.remove('active');
    squareBtn?.classList.remove('active');
    rectangleBtn?.classList.remove('active');
    polyBtn?.classList.remove('active');

    switch (objectType) {
        case ObjectType.LINE:
            lineBtn?.classList.add('active');
            verticesElement.style.display = 'none';
            sizeInput.style.display = 'none';
            break;
        case ObjectType.SQUARE:
            squareBtn?.classList.add('active');
            verticesElement.style.display = 'none';
            sizeInput.style.display = 'block';
            break;
        case ObjectType.RECTANGLE:
            rectangleBtn?.classList.add('active');
            verticesElement.style.display = 'none';
            sizeInput.style.display = 'none';
            break;
        case ObjectType.POLYGON:
            polyBtn?.classList.add('active');
            verticesElement.style.display = 'block';
            sizeInput.style.display = 'none';
            break;
        default:
            break;
    }
}

function setStateBtnActive(state: State) {
    const drawBtn = document.getElementById('draw-btn');
    const moveBtn = document.getElementById('move-btn');
    const transformBtn = document.getElementById('transform-btn');
    const colorBtn = document.getElementById('color-btn');

    const sizeInput = document.getElementById('square-size-input') as HTMLInputElement;

    drawBtn?.classList.remove('active');
    moveBtn?.classList.remove('active');
    transformBtn?.classList.remove('active');
    colorBtn?.classList.remove('active');

    switch (state) {
        case State.DRAWING:
            drawBtn?.classList.add('active');
            sizeInput.style.display = 'block';
            break;
        case State.MOVING:
            moveBtn?.classList.add('active');
            sizeInput.style.display = 'none';
            break;
        case State.TRANSFORM:
            transformBtn?.classList.add('active');
            sizeInput.style.display = 'none';
            break;
        case State.COLOR:
            colorBtn?.classList.add('active');
            sizeInput.style.display = 'none'
            break;
        default:
            break;
    }
}

function resetVertices() {
    vertices = [];
    drawer?.clearPoints();
}


function inside(point: Vertex, polygon: PolygonObject) {
    var x = point.x, y = point.y;
    
    var inside = false;
    let polyVertex = polygon.getPoints()
    for (var i = 0, j = polyVertex.length - 1; i < polyVertex.length; j = i++) {
        var xi = polyVertex[i].x, yi = polyVertex[i].y;
        var xj = polyVertex[j].x, yj = polyVertex[j].y;
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};

function clickEvent(e: MouseEvent, canvas: HTMLCanvasElement) {
    const bounding = canvas.getBoundingClientRect();
    let { x, y } = convertPosToClip(e.x, e.y, bounding);

    if (state === State.DRAWING) {
        let vertex: Vertex = { x, y };
        vertices.push(vertex);

        let point: PointObject = new PointObject(x, y, color);
        drawer?.addObject(point);
        const scaleInput = document.getElementById('square-size') as HTMLInputElement;

        if (vertices.length === maxVertex) {
            switch (objectType) {
                case ObjectType.LINE:
                    drawer?.addObject(new LineObject(vertices, color));
                    break;
                case ObjectType.SQUARE:
                    drawer?.addObject(new SquareObject(vertices, Number(scaleInput.value), color));
                    break;
                case ObjectType.RECTANGLE:
                    drawer?.addObject(new RectangleObject(vertices, color));
                    break;
                case ObjectType.POLYGON:
                    drawer?.addObject(new PolygonObject(vertices, color));
                    break;
            }
            resetVertices();
        }
    } else if (state == State.TRANSFORM) {
        let value_scale = document.getElementById('scale-x-input') as HTMLInputElement;

        let objects = drawer!!.getObjects();
        console.log(objects);

        let object;

        for (let i = 0; i <= objects.length; i++) {
            if (i == objects.length) {
                object = null;
                break;
            }
            object = objects[i];
            //If the object is square
            if (object.getType() == ObjectType.SQUARE) {
                const square = object as SquareObject;
                //let squareVertex = square.getAllVertex()
                const x1 = square.getCenter().x + square.getSize() / canvas.width;
                const x2 = square.getCenter().x - square.getSize() / canvas.width;
                const y1 = square.getCenter().y + (square.getSize() + square.getSize() / 10) / canvas.height;
                const y2 = square.getCenter().y - (square.getSize() + square.getSize() / 10) / canvas.height;

                //If point(x,y) inside square
                // if (x >= squareVertex[1] && x <= squareVertex[0] && y >= squareVertex[3] && y <= squareVertex[2]) {
                if (x >= x2 && x <= x1 && y >= y2 && y <= y1) {
                    console.log('poin didalem kotak');
                    break;
                } else {
                    console.log('poin diluar kotak');
                }
                console.log(square.getCenter());
            }
        }
        if (object != null) {
            let scale = Number(value_scale.value);
  
            drawer!!.setScalingSqaure(
              object as SquareObject,
              scale
            );
          }
    } else if (state == State.COLOR) {
        //select poly square
        let objects = drawer!!.getObjects();
        console.log(objects);
        let vertex: Vertex = { x, y };
        const colorInput = document.getElementById('color-input') as HTMLInputElement

        let object;

        for (let i = 0; i <= objects.length; i++) {
          if (i == objects.length) {
            object = null;
            break;
          }
          object = objects[i];
          if (object.getType() == ObjectType.POLYGON) {
            
            if(inside(vertex, object as PolygonObject)){
                console.log('poin di dalam polygon');
                break;
            } else {
                console.log('poin di luar polygon');
            }
          }
          
        }
        if (object != null) {
  
            drawer!!.setColorPolygon(
              object as PolygonObject,
              convertColorString(colorInput.value)
            );
          }
         
    }
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

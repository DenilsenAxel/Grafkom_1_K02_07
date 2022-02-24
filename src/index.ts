import './styles.css';
import VertexShader from './shaders/VertexShader.glsl';
import FragmentShader from './shaders/FragmentShader.glsl';
import { Drawer } from './core/Drawer';
import { ObjectType, State, Vertex } from './types/interfaces';
import { convertColorString, convertPosToClip } from './utils/Utils';
import { PointObject, PolygonObject, LineObject, RectangleObject, SquareObject } from "./core/Objects";

let drawer: Drawer | null = null;
let mousePos: [number, number] = [0, 0];
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

    const requestAnimationFunction = (time: number) => {
        time *= 0.0001;
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
    const resetBtn = document.getElementById('reset-btn')
    

    const verticesInput = document.getElementById('poly-vertices') as HTMLInputElement
    const colorInput = document.getElementById('color-input') as HTMLInputElement

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
    resetBtn?.addEventListener('click', () => {
        drawer?.reset()
    })

    verticesInput.addEventListener('change', () => {
        setDrawPoly(parseInt(verticesInput.value));
    })
    colorInput?.addEventListener('change', () => {
        color = convertColorString(colorInput.value);
    })
}

function setupModal() {
    const modal = document.getElementById('help-modal') as HTMLElement;
    const openModalBtn = document.getElementById('help-btn') as HTMLElement;
    const closeBtn = document.getElementsByClassName('close')[0] as HTMLElement;

    openModalBtn.onclick = function() {
        modal.style.display = "block";
    }

    closeBtn.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function setDrawLine() {
    setStateDraw();
    objectType = ObjectType.LINE;
    setShapeBtnActive(objectType);
    resetVertices()
    maxVertex = 2;
}

function setDrawSquare() {
    setStateDraw();
    objectType = ObjectType.SQUARE;
    setShapeBtnActive(objectType);
    resetVertices()
    maxVertex = 1;
}

function setDrawRectangle() {
    setStateDraw();
    objectType = ObjectType.RECTANGLE;
    setShapeBtnActive(objectType);
    resetVertices()
    maxVertex = 2;
}

function setDrawPoly(num: number) {
    setStateDraw();
    objectType = ObjectType.POLYGON;
    setShapeBtnActive(objectType);
    resetVertices()
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

function setShapeBtnActive(objectType: ObjectType) {
    const lineBtn = document.getElementById('line-btn');
    const squareBtn = document.getElementById('square-btn');
    const rectangleBtn = document.getElementById('rectangle-btn');
    const polyBtn = document.getElementById('polygon-btn');

    const verticesElement = document.getElementById('poly-input') as HTMLElement;

    lineBtn?.classList.remove('active');
    squareBtn?.classList.remove('active');
    rectangleBtn?.classList.remove('active');
    polyBtn?.classList.remove('active');

    switch (objectType) {
        case ObjectType.LINE:
            lineBtn?.classList.add('active');
            verticesElement.style.display = 'none'
            break;
        case ObjectType.SQUARE:
            squareBtn?.classList.add('active');
            verticesElement.style.display = 'none'
            break;
        case ObjectType.RECTANGLE:
            rectangleBtn?.classList.add('active');
            verticesElement.style.display = 'none'
            break;
        case ObjectType.POLYGON:
            polyBtn?.classList.add('active');
            verticesElement.style.display = 'block'
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

function resetVertices() {
    vertices = []
    drawer?.clearPoints()
}

function clickEvent(e: MouseEvent, canvas: HTMLCanvasElement) {
    const bounding = canvas.getBoundingClientRect();
    let { x, y } = convertPosToClip(e.x, e.y, bounding);

    if (state === State.DRAWING) {
        let vertex: Vertex = { x, y };
        vertices.push(vertex);

        let point: PointObject = new PointObject(x, y, color);
        drawer?.addObject(point);

        if (vertices.length === maxVertex) {
            switch (objectType) {
                case ObjectType.LINE:
                    drawer?.addObject(new LineObject(vertices, color));
                    break;
                case ObjectType.SQUARE:
                    drawer?.addObject(new SquareObject(vertices, 100, color));
                    break;
                case ObjectType.RECTANGLE:
                    drawer?.addObject(new RectangleObject(vertices, color));
                    break;
                case ObjectType.POLYGON:
                    drawer?.addObject(new PolygonObject(vertices, color));
                    break;
            }
            resetVertices()
        }
    }
}

window.onload = main;

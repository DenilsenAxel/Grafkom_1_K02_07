import "./styles.css"
import VertexShader from './shaders/VertexShader.glsl'
import FragmentShader from './shaders/FragmentShader.glsl'
import { Drawer } from './core/Drawer'
import { ObjectType, State } from "./types/interfaces";
import { convertPosToClip } from "./utils/Utils";
import { PointObject } from "./core/Objects";

let drawer: Drawer | null = null
let isDrawing: Boolean = false;
let mousePos: [number, number] = [0,0]
let state: State = State.SELECTING
let objectType: ObjectType | null = null
let maxVertex = -1
let countVertex = 0

function main(): void {
    const canvas = document.querySelector('#glCanvas') as HTMLCanvasElement
    canvas.width = 800
    canvas.height = 600

    drawer = new Drawer(canvas, VertexShader, FragmentShader)

    setupUI()

    canvas.addEventListener('click', (e) => {
        clickEvent(e, canvas)
    })

    const requestAnimationFunction = (time: number) => {
        time *= 0.0001;
        if(drawer) {
            drawer.drawScene()
        }
        window.requestAnimationFrame(requestAnimationFunction);
    };
    window.requestAnimationFrame(requestAnimationFunction);
}

function setupUI(): void {
    const lineBtn = document.getElementById("line-btn")
    const squareBtn = document.getElementById("square-btn")
    const rectangleBtn = document.getElementById("rectangle-btn")
    const polyBtn = document.getElementById("polygon-btn")
    const drawBtn = document.getElementById("draw-btn")
    const moveBtn = document.getElementById("move-btn")
    const transformBtn = document.getElementById("transform-btn")

    lineBtn?.addEventListener('click', () => {
        setDrawLine()
    })
    squareBtn?.addEventListener('click', () => {
        setDrawSquare()
    })
    rectangleBtn?.addEventListener('click', () => {
        setDrawRectangle()
    })
    polyBtn?.addEventListener('click', () => {
        setDrawPoly()
    })

    drawBtn?.addEventListener('click', () => {
        setStateDraw()
    })
    moveBtn?.addEventListener('click', () => {
        setStateMove()
    })
    transformBtn?.addEventListener('click', () => {
        setStateTransform()
    })
}

function setDrawLine() {
    setStateDraw()
    objectType = ObjectType.LINE
    setShapeBtnActive(objectType)
    maxVertex = 2
}

function setDrawSquare() {
    setStateDraw()
    objectType = ObjectType.SQUARE
    setShapeBtnActive(objectType)
    maxVertex = 2
}

function setDrawRectangle() {
    setStateDraw()
    objectType = ObjectType.RECTANGLE
    setShapeBtnActive(objectType)
    maxVertex = 2
}

function setDrawPoly() {
    setStateDraw()
    objectType = ObjectType.POLYGON
    setShapeBtnActive(objectType)
    maxVertex = 999
}

function setStateDraw() {
    state = State.DRAWING
    setStateBtnActive(State.DRAWING)
}

function setStateMove() {
    state = State.MOVING
    setStateBtnActive(State.MOVING)
}

function setStateTransform() {
    state = State.TRANSFORM
    setStateBtnActive(State.TRANSFORM)
}

function setShapeBtnActive(objectType: ObjectType) {
    const lineBtn = document.getElementById("line-btn")
    const squareBtn = document.getElementById("square-btn")
    const rectangleBtn = document.getElementById("rectangle-btn")
    const polyBtn = document.getElementById("polygon-btn")

    lineBtn?.classList.remove("active")
    squareBtn?.classList.remove("active")
    rectangleBtn?.classList.remove("active")
    polyBtn?.classList.remove("active")

    switch(objectType) {
        case ObjectType.LINE :
            lineBtn?.classList.add("active")
            break;
        case ObjectType.SQUARE :
            squareBtn?.classList.add("active")
            break;
        case ObjectType.RECTANGLE :
            rectangleBtn?.classList.add("active")
            break;
        case ObjectType.POLYGON :
            polyBtn?.classList.add("active")
            break;    
        default:
            break;
    }
}

function setStateBtnActive(state: State) {
    const drawBtn = document.getElementById("draw-btn")
    const moveBtn = document.getElementById("move-btn")
    const transformBtn = document.getElementById("transform-btn")

    drawBtn?.classList.remove("active")
    moveBtn?.classList.remove("active")
    transformBtn?.classList.remove("active")

    switch(state) {
        case State.DRAWING:
            drawBtn?.classList.add("active")
            break;
        case State.MOVING:
            moveBtn?.classList.add("active")
            break;
        case State.TRANSFORM:
            transformBtn?.classList.add("active")
            break;
        default:
            break;
    }
}

function clickEvent(e: MouseEvent, canvas: HTMLCanvasElement) {
    const bounding = canvas.getBoundingClientRect()
    let {x, y} = convertPosToClip(e.x, e.y, bounding)
    
    switch (objectType) {
        case ObjectType.POLYGON :
            break;
    }
    
    let newPoint = new PointObject(x, y)
    if(drawer) {
        drawer.addObject(newPoint)
    }
}

window.onload = main
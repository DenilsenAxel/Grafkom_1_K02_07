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
let objectType = null
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
}

function setDrawLine() {
    state = State.DRAWING
    objectType = ObjectType.LINE
    maxVertex = 2
}

function setDrawSquare() {
    state = State.DRAWING
    objectType = ObjectType.SQUARE
    maxVertex = 2
}

function setDrawRectangle() {
    state = State.DRAWING
    objectType = ObjectType.RECTANGLE
    maxVertex = 2
}

function setDrawPoly() {
    state = State.DRAWING
    objectType = ObjectType.POLYGON
    maxVertex = 999
}

function clickEvent(e: MouseEvent, canvas: HTMLCanvasElement) {
    const bounding = canvas.getBoundingClientRect()
    let {x, y} = convertPosToClip(e.x, e.y, bounding)
    let newPoint = new PointObject(x, y)
    if(drawer) {
        drawer.addObject(newPoint)
    }
}

window.onload = main
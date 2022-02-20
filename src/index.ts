import VertexShader from './shaders/VertexShader.glsl'
import FragmentShader from './shaders/FragmentShader.glsl'
import { Drawer } from './core/Drawer'

function main() {
    const canvas = document.querySelector('#glCanvas') as HTMLCanvasElement
    
    canvas.width = 800
    canvas.height = 600

    const drawer = new Drawer(canvas, VertexShader, FragmentShader)
    // Create Hello World (Triangle)
    const vertices = [
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0,
    ]

    for (let i = 0; i < vertices.length; i += 6) {
        const drawnVertices = vertices.slice(i, i + 6)
        console.log(drawnVertices);
        drawer.drawTriangle(drawnVertices)
    }
}

window.onload = main
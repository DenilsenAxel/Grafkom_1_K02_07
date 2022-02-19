import VertexShader from './shaders/VertexShader.glsl'
import FragmentShader from './shaders/FragmentShader.glsl'

function main() {
    const canvas = document.querySelector('#glCanvas') as HTMLCanvasElement
    
    canvas.width = 800
    canvas.height = 600
    const gl = canvas.getContext('webgl2') as WebGL2RenderingContext
    if (!gl) {
        alert('Your browser does not support WebGL')
    }
    gl.clearColor(1,1,1,1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // Create Hello World (Triangle)
    const triangleData = [
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0
    ]

    // Create WebGL Shader
    const vertShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader
    gl.shaderSource(vertShader, VertexShader)
    gl.compileShader(vertShader)

    const fragShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader
    gl.shaderSource(fragShader, FragmentShader)
    gl.compileShader(fragShader)

    const shaderProgram = gl.createProgram() as WebGLProgram
    gl.attachShader(shaderProgram, vertShader)
    gl.attachShader(shaderProgram, fragShader)
    gl.linkProgram(shaderProgram)

    // Create Buffer
    const buffer = gl.createBuffer() as WebGLBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleData), gl.STATIC_DRAW)

    // Draw Triangle
    gl.useProgram(shaderProgram) // Always use this in beginning of drawing
    const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition')
    const uniformCol = gl.getUniformLocation(shaderProgram, 'uColor')

    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0)
    gl.uniform4fv(uniformCol, [1.0, 0.0, 0.0, 1.0]) // This will produce red color (in RGBA 1,0,0,1 is red)
    gl.enableVertexAttribArray(vertexPosition)
    gl.drawArrays(gl.TRIANGLES, 0, triangleData.length/2)
}

window.onload = main
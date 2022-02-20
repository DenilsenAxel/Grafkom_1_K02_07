export class Drawer {
    private canvas!: HTMLCanvasElement;
    private gl!: WebGL2RenderingContext;
    private vertexShader!: WebGLShader;
    private fragmentShader!: WebGLShader;
    private shaderProgram!: WebGLProgram;

    constructor(
        canvasElement: HTMLCanvasElement,
        vertexShader: string,
        fragmentShader: string
    ) {
        this.canvas = canvasElement;
        this.gl = this.canvas.getContext('webgl2') as WebGL2RenderingContext

        this.gl.clearColor(1,1,1,1)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)

        this.vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vertexShader)
        this.fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fragmentShader)
        this.shaderProgram = this.loadProgram()
    }

    private loadProgram() {
        const shaderProgram = this.gl.createProgram() as WebGLProgram
        this.gl.attachShader(shaderProgram, this.vertexShader)
        this.gl.attachShader(shaderProgram, this.fragmentShader)
        this.gl.linkProgram(shaderProgram)

        return shaderProgram
    }

    private loadShader(type: number, shaderString: string) {
        const shader = this.gl.createShader(type) as WebGLShader
        this.gl.shaderSource(shader, shaderString)
        this.gl.compileShader(shader)

        return shader
    }

    public drawTriangle(vertices: number[]) {
        this.gl.useProgram(this.shaderProgram)

        // Create buffer
        const buffer = this.gl.createBuffer() as WebGLBuffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW)
    
        const vertexPosition = this.gl.getAttribLocation(
            this.shaderProgram,
            'aVertexPosition'
        )
        const uniformCol = this.gl.getUniformLocation(
            this.shaderProgram, 
            'uColor'
        )

        this.gl.vertexAttribPointer(vertexPosition, 2, this.gl.FLOAT, false, 0, 0)
        this.gl.uniform4fv(uniformCol, [1.0, 0.0, 0.0, .75]) // This will produce red color (in RGBA 1,0,0,1 is red)
        this.gl.enableVertexAttribArray(vertexPosition)
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 3)
    }
}


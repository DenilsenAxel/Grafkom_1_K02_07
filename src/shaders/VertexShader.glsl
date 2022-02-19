attribute vec2 aVertexPosition;
uniform mat3 uProjectionMatrix;

void main() {
  vec2 position = (uProjectionMatrix * vec3(aVertexPosition, 1)).xy;
  gl_Position = vec4(position, 0, 1);
}
attribute vec4 a_position;
attribute vec4 a_color;

varying vec4 v_color;

uniform mat4 u_transformation;
uniform float u_fudgeFactor;

void main() {
  vec4 position = u_transformation * a_position;

  float zToDivideBy = 1.0 - position.z * u_fudgeFactor; 
  gl_Position = vec4(position.xy / zToDivideBy, position.zw);

  v_color = a_color;
}

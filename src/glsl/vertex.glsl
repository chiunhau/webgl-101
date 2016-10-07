attribute vec4 a_position;
attribute vec4 a_color;

varying vec4 v_color;

uniform mat4 u_transformation;

void main() {
  gl_Position = a_position * u_transformation;

  v_color = a_color;
}

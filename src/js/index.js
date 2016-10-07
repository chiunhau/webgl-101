var vertShaderSrc = require('../glsl/vertex.glsl');
var fragShaderSrc = require('../glsl/fragment.glsl');
var tfm = require('./tfm.js');
var canvas = document.getElementById('myCanvas');

var gl = canvas.getContext('webgl');

var vertShader = createShader(gl, gl.VERTEX_SHADER, vertShaderSrc);
var fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSrc);
var program = createProgram(gl, vertShader, fragShader);
var positionAttribLocation = gl.getAttribLocation(program, 'a_position');


var positionBuffer = gl.createBuffer();


gl.useProgram(program);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.enable(gl.CULL_FACE);
gl.enable(gl.DEPTH_TEST);


var params = {
  translateX: 600,
  translateY: 200,
  translateZ: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  scaleX: 1,
  scaleY: 1,
  scaleZ: 1,
  fudgeFactor: 1.0
}

window.onload = function() {
  var gui = new dat.GUI();
  // gui.add(params, 'translateX', 0, 1000).onChange(draw);
  // gui.add(params, 'translateY', 0, 1000).onChange(draw);
  // gui.add(params, 'translateZ', 0, 400).onChange(draw);
  gui.add(params, 'rotateX', 0, 5).onChange(drawScene);
  gui.add(params, 'rotateY', 0, 5).onChange(drawScene);
  gui.add(params, 'rotateZ', 0, 5).onChange(drawScene);
  // gui.add(params, 'scaleX', 0, 5).onChange(draw);
  // gui.add(params, 'scaleY', 0, 5).onChange(draw);
  // gui.add(params, 'scaleZ', 0, 5).onChange(draw);
  // gui.add(params, 'fudgeFactor', 0.0, 2.0).onChange(draw);
}




gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(createCube(100)), gl.STATIC_DRAW);
gl.enableVertexAttribArray(positionAttribLocation);
gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, false, 0, 0);

var transformationUniLocation = gl.getUniformLocation(program, 'u_transformation');



var colorAttribLocation = gl.getAttribLocation(program, 'a_color');
var colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.enableVertexAttribArray(colorAttribLocation);
gl.vertexAttribPointer(colorAttribLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);





function drawScene() {
  var transformationMat = tfm.multiply(tfm.rotateX(params.rotateX), tfm.rotateY(params.rotateY));
  console.log(transformationMat);
  transformationMat = tfm.multiply(transformationMat, tfm.rotateZ(params.rotateZ));
  console.log(transformationMat);
  transformationMat = tfm.multiply(transformationMat, tfm.project(800, 600, 400));
  console.log(transformationMat);
  console.log("end");


  gl.uniformMatrix4fv(transformationUniLocation, false, transformationMat);
  gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(createCubeColors()), gl.STATIC_DRAW);
  gl.drawArrays(gl.TRIANGLES, 0, 36);
}

drawScene();
//tools

function createShader(gl, type, src) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader
  }
  else {
    console.log(gl.getShaderInfo(shader));
    gl.deleteShader(shader);
  }
}

function createProgram(gl, vertShader, fragShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);

  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return program
  }
  else {
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }
}

function createCube(l) {
  var u =  l / 2;
  return [
    //top
    -u, -u, u,
    u, -u, u,
    -u, u, u,
    -u, u, u,
    u, -u, u,
    u, u, u,

    //right
    u, -u, u,
    u, -u, -u,
    u, u, u,
    u, u, u,
    u, -u, -u,
    u, u, -u,

    //back
    u, -u, -u,
    -u, -u, -u,
    u, u, -u,
    u, u, -u,
    -u, -u, -u,
    -u, u, -u,

    //left
    -u, -u, -u,
    -u, -u, u,
    -u, u, -u,
    -u, u, -u,
    -u, -u, u,
    -u, u, u,

    //top
    -u, u, u,
    u, u, u,
    -u, u, -u,
    -u, u, -u,
    u, u, u,
    u, u, -u,

    //bottom
    -u, -u, u,
    -u, -u, -u,
    u, -u, u,
    u, -u, u,
    -u, -u, -u,
    u, -u, -u
  ];
}

function createCubeColors() {
  return [
    //front RED
    255, 0, 0,
    255, 0, 0,
    255, 0, 0,
    255, 0, 0,
    255, 0, 0,
    255, 0, 0,

    //left YELLOW
    255, 255, 0,
    255, 255, 0,
    255, 255, 0,
    255, 255, 0,
    255, 255, 0,
    255, 255, 0,

    //right PINK
    255, 0, 255,
    255, 0, 255,
    255, 0, 255,
    255, 0, 255,
    255, 0, 255,
    255, 0, 255,

    //back BLUE
    0, 0, 255,
    0, 0, 255,
    0, 0, 255,
    0, 0, 255,
    0, 0, 255,
    0, 0, 255,

    //top GREEN
    0, 255, 0,
    0, 255, 0,
    0, 255, 0,
    0, 255, 0,
    0, 255, 0,
    0, 255, 0,

    //bottom LIGHT BLUE
    0, 255, 255,
    0, 255, 255,
    0, 255, 255,
    0, 255, 255,
    0, 255, 255,
    0, 255, 255
  ];
}

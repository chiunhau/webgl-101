var vertShaderSrc = require('../glsl/vertex.glsl');
var fragShaderSrc = require('../glsl/fragment.glsl');
var tfm = require('./tfm.js');
var geometries = require('./geometries.js')
var canvas = document.getElementById('myCanvas');
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
var gl = canvas.getContext('webgl');

var vertShader = createShader(gl, gl.VERTEX_SHADER, vertShaderSrc);
var fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSrc);
var program = createProgram(gl, vertShader, fragShader);
gl.useProgram(program);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clearColor(1, 0.90, 0.99, 1.0);
gl.enable(gl.CULL_FACE);
gl.enable(gl.DEPTH_TEST);

var params = {
  translateX: 0.0,
  translateY: 0.0,
  translateZ: 0.0,
  rotateX: -0.45,
  rotateY: 0.6,
  rotateZ: 0,
  scaleX: 1.0,
  scaleY: 1.0,
  scaleZ: 1.0,
  fudgeFactor: 1.0
}

window.onload = function() {
  var gui = new dat.GUI();
  gui.add(params, 'translateX', -500, 500).onChange(drawScene);
  gui.add(params, 'translateY', -500, 500).onChange(drawScene);
  gui.add(params, 'translateZ', -400, 400).onChange(drawScene);
  gui.add(params, 'rotateX', -4, 4).onChange(drawScene);
  gui.add(params, 'rotateY', -4, 4).onChange(drawScene);
  gui.add(params, 'rotateZ', -4, 4).onChange(drawScene);
  gui.add(params, 'scaleX', 1, 5).onChange(drawScene);
  gui.add(params, 'scaleY', 1, 5).onChange(drawScene);
  gui.add(params, 'scaleZ', 1, 5).onChange(drawScene);
  gui.add(params, 'fudgeFactor', 0.0, 2.0).onChange(drawScene);
}

var positionAttribLocation = gl.getAttribLocation(program, 'a_position');
var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.enableVertexAttribArray(positionAttribLocation);
gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, false, 0, 0);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometries.cube(100)), gl.STATIC_DRAW);

var colorAttribLocation = gl.getAttribLocation(program, 'a_color');
var colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.enableVertexAttribArray(colorAttribLocation);
gl.vertexAttribPointer(colorAttribLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);
gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(geometries.cubeColors()), gl.STATIC_DRAW);


var transformationUniLocation = gl.getUniformLocation(program, 'u_transformation');
var fudgeLocation = gl.getUniformLocation(program, 'u_fudgeFactor');
drawScene()
// var frameCount = 0;
function drawScene() {

  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  var transformationMat = tfm.multiply(tfm.scale(params.scaleX, params.scaleY, params.scaleZ), tfm.rotateX(params.rotateX));

  transformationMat = tfm.multiply(transformationMat, tfm.rotateY(params.rotateY));
  transformationMat = tfm.multiply(transformationMat, tfm.rotateZ(params.rotateZ));
  transformationMat = tfm.multiply(transformationMat, tfm.translate(params.translateX, params.translateY, params.translateZ));
  transformationMat = tfm.multiply(transformationMat, tfm.project(canvas.width, canvas.height, 500));

  gl.uniform1f(fudgeLocation, params.fudgeFactor);
  gl.uniformMatrix4fv(transformationUniLocation, false, transformationMat);
  gl.drawArrays(gl.TRIANGLES, 0, 36);
  // frameCount += 1;
  // requestAnimationFrame(drawScene);
}

// requestAnimationFrame(drawScene);

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

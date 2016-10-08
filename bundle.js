/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var vertShaderSrc = __webpack_require__(1);
	var fragShaderSrc = __webpack_require__(2);
	var tfm = __webpack_require__(3);
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
	  rotateX: -0.36,
	  rotateY: 0.6,
	  rotateZ: 0,
	  scaleX: 1.0,
	  scaleY: 1.0,
	  scaleZ: 1.0,
	  fudgeFactor: 0.5
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
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(createCube(100)), gl.STATIC_DRAW);

	var colorAttribLocation = gl.getAttribLocation(program, 'a_color');
	var colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.enableVertexAttribArray(colorAttribLocation);
	gl.vertexAttribPointer(colorAttribLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);
	gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(createCubeColors()), gl.STATIC_DRAW);


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

	    //right YELLOW
	    255, 255, 0,
	    255, 255, 0,
	    255, 255, 0,
	    255, 255, 0,
	    255, 255, 0,
	    255, 255, 0,

	    //back PINK
	    255, 0, 255,
	    255, 0, 255,
	    255, 0, 255,
	    255, 0, 255,
	    255, 0, 255,
	    255, 0, 255,

	    //left BLUE
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


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = "attribute vec4 a_position;\nattribute vec4 a_color;\n\nvarying vec4 v_color;\n\nuniform mat4 u_transformation;\nuniform float u_fudgeFactor;\n\nvoid main() {\n  vec4 position = u_transformation * a_position;\n\n  float zToDivideBy = 1.0 - position.z * u_fudgeFactor; \n  gl_Position = vec4(position.xy / zToDivideBy, position.zw);\n\n  v_color = a_color;\n}\n"

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = "precision mediump float;\n\nvarying vec4 v_color;\n\nvoid main() {\n  gl_FragColor = v_color;\n}\n"

/***/ },
/* 3 */
/***/ function(module, exports) {

	var tfm = {
	  project: function(w, h, d) {
	    return [
	      2 / w, 0, 0, 0,
	      0, 2 / h, 0, 0,
	      0, 0, 2 / d, 0,
	      0, 0, 0, 1
	    ];
	  },
	  translate: function(tx, ty, tz) {
	    return [
	       1,  0,  0,  0,
	       0,  1,  0,  0,
	       0,  0,  1,  0,
	       tx, ty, tz, 1
	    ];
	  },
	  scale: function(sx, sy, sz) {
	    return [
	      sx, 0,  0,  0,
	      0, sy,  0,  0,
	      0,  0, sz,  0,
	      0,  0,  0,  1,
	    ];
	  },
	  rotateX: function(angleInRadians) {
	    var c = Math.cos(angleInRadians);
	    var s = Math.sin(angleInRadians);

	    return [
	      1, 0, 0, 0,
	      0, c, s, 0,
	      0, -s, c, 0,
	      0, 0, 0, 1
	    ];
	  },
	  rotateY: function(angleInRadians) {
	    var c = Math.cos(angleInRadians);
	    var s = Math.sin(angleInRadians);

	    return [
	      c, 0, -s, 0,
	      0, 1, 0, 0,
	      s, 0, c, 0,
	      0, 0, 0, 1
	    ];
	  },
	  rotateZ: function(angleInRadians) {
	    var c = Math.cos(angleInRadians);
	    var s = Math.sin(angleInRadians);

	    return [
	       c, s, 0, 0,
	       -s, c, 0, 0,
	       0, 0, 1, 0,
	       0, 0, 0, 1,
	    ];
	  },
	  multiply: function(a, b) {
	    var a00 = a[0*4+0];
	    var a01 = a[0*4+1];
	    var a02 = a[0*4+2];
	    var a03 = a[0*4+3];
	    var a10 = a[1*4+0];
	    var a11 = a[1*4+1];
	    var a12 = a[1*4+2];
	    var a13 = a[1*4+3];
	    var a20 = a[2*4+0];
	    var a21 = a[2*4+1];
	    var a22 = a[2*4+2];
	    var a23 = a[2*4+3];
	    var a30 = a[3*4+0];
	    var a31 = a[3*4+1];
	    var a32 = a[3*4+2];
	    var a33 = a[3*4+3];
	    var b00 = b[0*4+0];
	    var b01 = b[0*4+1];
	    var b02 = b[0*4+2];
	    var b03 = b[0*4+3];
	    var b10 = b[1*4+0];
	    var b11 = b[1*4+1];
	    var b12 = b[1*4+2];
	    var b13 = b[1*4+3];
	    var b20 = b[2*4+0];
	    var b21 = b[2*4+1];
	    var b22 = b[2*4+2];
	    var b23 = b[2*4+3];
	    var b30 = b[3*4+0];
	    var b31 = b[3*4+1];
	    var b32 = b[3*4+2];
	    var b33 = b[3*4+3];
	    return [a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30,
	            a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31,
	            a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32,
	            a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33,
	            a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30,
	            a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31,
	            a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32,
	            a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33,
	            a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30,
	            a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31,
	            a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32,
	            a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33,
	            a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30,
	            a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31,
	            a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32,
	            a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33];
	  }
	}

	module.exports = tfm;


/***/ }
/******/ ]);
var geometries = {
  cube: function(l) {
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
  },
  cubeColors: function() {
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
}

module.exports = geometries;

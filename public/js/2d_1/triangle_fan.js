(function(){
// Context
const canvas = document.getElementById('_2Dtriangle_fan');
const gl = canvas.getContext('webgl');

// Geometry

const vertices = [
    -0.75,0.5,0., -0.45,-0.5,0., -0.15,0.5,0.,
    0.15,-0.5,0., 0.45,0.5,0., 0.75,-0.5,0.
];

const colors = [
    0.1,0.9,0.7, 0.1,0.9,0.7, 0.1,0.9,0.7,
    0.1,0.7,0.9, 0.1,0.7,0.9, 0.1,0.7,0.9
];

const indices = [ 0,1,2, 3,4,5];

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

const indicesBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

// Shaders

const vertexCode = `
  attribute vec3 a_position;
  attribute vec3 a_color;
  varying vec3 v_color;

  void main(void) {
    gl_Position = vec4(a_position, 1.);
    v_color = a_color;
    gl_PointSize = 5.;
  } 
`;

const fragmentCode = `
  precision mediump float;
  varying vec3 v_color;

  void main(void) {
    gl_FragColor = vec4(v_color, 1.);
  }
`;

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexCode);
gl.compileShader(vertexShader);

if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error('Compilation vertex shader error:', gl.getShaderInfoLog(vertexShader));
};

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentCode);
gl.compileShader(fragmentShader);

if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error('Compilation fragment shader error:', gl.getShaderInfoLog(fragmentShader));
};

const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error('Shader program linking error:', gl.getProgramInfoLog(shaderProgram));
};

// Associating variables to vertex shader

gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
const position = gl.getAttribLocation(shaderProgram, 'a_position');
gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(position);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
const color = gl.getAttribLocation(shaderProgram, 'a_color');
gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(color);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

// Draw

gl.clearColor(0., 0., 0., 1.);
gl.enable(gl.DEPTH_TEST);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.viewport(0, 0, canvas.width, canvas.height);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
gl.drawElements(gl.TRIANGLE_FAN, indices.length, gl.UNSIGNED_SHORT, 0);
})()

(function(){
// Context
const canvas = document.getElementById('_3Dline_loop');
const gl = canvas.getContext('webgl');

// Geometry
const vertices = [
    -1.,1.,1., 1.,1.,1., 1.,-1.,1., -1.,-1.,1.,
    -1.,1.,-1., 1.,1.,-1., 1.,-1.,-1., -1.,-1.,-1.,
    -1., 1.,1., -1, 1.,-1., -1.,-1.,-1., -1., -1., 1.,
    1.,1.,1., 1.,1.,-1., 1.,-1.,-1, 1.,-1.,1.,
    -1.,1.,1., -1.,1.,-1., 1.,1.,-1., 1.,1.,1.,
    -1.,-1.,1., -1.,-1.,-1., 1.,-1.,-1., 1.,-1.,1.
];

const colors = [
    0.1,0.9,0.7, 0.1,0.9,0.7, 0.1,0.9,0.7, 0.1,0.9,0.7,
    0.1,0.7,0.9, 0.1,0.7,0.9, 0.1,0.7,0.9, 0.1,0.7,0.9,
    0.1,0.9,0.7, 0.1,0.9,0.7, 0.1,0.9,0.7, 0.1,0.9,0.7,
    0.1,0.7,0.9, 0.1,0.7,0.9, 0.1,0.7,0.9, 0.1,0.7,0.9,
    0.1,0.7,0.9, 0.1,0.7,0.9, 0.1,0.7,0.9, 0.1,0.7,0.9,
    0.1,0.9,0.7, 0.1,0.9,0.7, 0.1,0.9,0.7, 0.1,0.9,0.7
];

const indices = [
    0,1,2, 0,2,3,
    4,5,6, 4,6,7,
    8,9,10, 8,10,11,
    12,13,14, 12,14,15,
    16,17,18, 16,18,19,
    20,21,22, 20,22,23
];

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

// Shaders

const vertexCode = `
  uniform mat4 u_Pmatrix;
  uniform mat4 u_Vmatrix;
  uniform mat4 u_Mmatrix;
  attribute vec3 a_position;
  attribute vec3 a_color;
  varying vec3 v_color;

  void main(void) {
    gl_Position = u_Pmatrix * u_Vmatrix * u_Mmatrix * vec4(a_position, 1.);
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
    console.error('Compilation fragment shader error', gl.getShaderInfoLog(fragmentShader));
};

const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

// Associating variables to vertex shader

const Pmatrix = gl.getUniformLocation(shaderProgram, 'u_Pmatrix');
const Vmatrix = gl.getUniformLocation(shaderProgram, 'u_Vmatrix');
const Mmatrix = gl.getUniformLocation(shaderProgram, 'u_Mmatrix');

gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
const position = gl.getAttribLocation(shaderProgram, 'a_position');
gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(position);

gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
const color = gl.getAttribLocation(shaderProgram, 'a_color');
gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(color);

gl.useProgram(shaderProgram);

if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error('Shader program linking error:', gl.getProgramInfoLog(shaderProgram));
};

// Matrices

function getProjection(angle, a, zMin, zMax) {
    const ang = Math.tan((angle * 0.5) * Math.PI/180);

    return [
        0.5/ang, 0, 0, 0,
        0, 0.5*a/ang, 0, 0,
        0, 0, -(zMax + zMin) / (zMax - zMin), -1,
        0, 0, (-2 * zMax * zMin) / (zMax - zMin), 0
    ];
};

const projectionMatrix = getProjection(40, canvas.width/canvas.height, 1, 100);
const modelMatrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
const viewMatrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];

viewMatrix[14] = viewMatrix[14] - 5;

// Rotation

function rotateY(m, angle) {
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);
    let mv0 = m[0], mv4 = m[4], mv8 = m[8];

    m[0] = cos * m[0] + sin * m[2];
    m[4] = cos * m[4] + sin * m[6];
    m[8] = cos * m[8] + sin * m[10];

    m[2] = cos * m[2] - sin * mv0;
    m[6] = cos * m[6] - sin * mv4;
    m[10] = cos * m[10] - sin * mv8;
};

// Draw

let timeOld = 0;

const animate = function(time) {
    let dt = time - timeOld;

    rotateY(modelMatrix, dt*0.0005);
    timeOld = time;

    gl.clearColor(0., 0., 0., 1.);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearDepth(1.);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);
   
    
    gl.uniformMatrix4fv(Pmatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(Vmatrix, false, viewMatrix);
    gl.uniformMatrix4fv(Mmatrix, false, modelMatrix);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.drawElements(gl.LINE_LOOP, indices.length, gl.UNSIGNED_SHORT, 0);

    window.requestAnimationFrame(animate);
};

animate(0);

})()

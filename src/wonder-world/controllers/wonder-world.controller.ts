import { createProgram } from 'typescript';
import { UserAvatar } from '../models/UserAvatar';
import { CircleShape } from '../models/shapes/CircleShape';

export class WonderWorldController {
  private gl?: WebGLRenderingContext;
  private user = new UserAvatar(new CircleShape(200, 200, 25));
  private remoteUsers: Record<string, UserAvatar> = {};

  get getUser(): UserAvatar {
    return this.user;
  }

  getRemoteUser(key: string): UserAvatar {
    return this.remoteUsers[key];
  }

  updateRemoteUser(key: string, coordinates: any) {
    if (this.remoteUsers[key]) {
      this.remoteUsers[key].updateCircles(coordinates.circle, coordinates.directional);
    }
  }

  removeRemoteUser(key: string) {
    delete this.remoteUsers[key];
  }

  addNewRemoteUser(x: number, y: number, userId: string) {
    this.remoteUsers[userId] = new UserAvatar(new CircleShape(x, y, 25));
  }

  render = () => {
    this.clear(1, 1, 1, 1);

    const vertexShader = this.gl?.createShader(this.gl.VERTEX_SHADER) as WebGLShader;
    this.gl?.shaderSource(vertexShader, [
    'uniform vec2 u_resolution;',
    'attribute vec2 a_position;',
    'attribute vec2 a_center;',
    'attribute float a_radius;',
    'varying vec2 center;',
    'varying vec2 resolution;',
   'varying float radius;',
     
    'void main() {',
     ' vec2 clipspace = a_position / u_resolution * 2.0 - 1.0;',
      'gl_Position = vec4(clipspace * vec2(1, -1), 0, 1);',
      'radius = a_radius;',
     'center = a_center;',
     'resolution = u_resolution;',
    '}',
  ].join('\n'));
    this.gl?.compileShader(vertexShader);


    const fragmentShader = this.gl?.createShader(this.gl.FRAGMENT_SHADER) as WebGLShader;
    this.gl?.shaderSource(fragmentShader, [
      'precision mediump float;',
      'varying vec2 center;',
      'varying vec2 resolution;',
     ' varying float radius;',
    '  void main() {',
       ' vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);',
       ' float x = gl_FragCoord.x;',
        'float y = resolution[1] - gl_FragCoord.y;',
       ' float dx = center[0] - x;',
        'float dy = center[1] - y;',
        'float distance = sqrt(dx*dx + dy*dy);',
       ' if ( distance < radius )',
       '   gl_FragColor = vec4(0.123, 0.560, 0.553, 1.0);',
        'else ',
         ' gl_FragColor = color0;',
    '    }'
      ].join('\n'));
    this.gl?.compileShader(fragmentShader);

    this.renderCircle(vertexShader, fragmentShader, this.user.getAllCoordinates().circle);
    this.renderCircle(vertexShader, fragmentShader, this.user.getAllCoordinates().directional);

    Object.keys(this.remoteUsers).forEach((key) => {
      this.renderCircle(vertexShader, fragmentShader, this.remoteUsers[key].getAllCoordinates().circle);
      this.renderCircle(vertexShader, fragmentShader, this.remoteUsers[key].getAllCoordinates().directional);
    })

    window.requestAnimationFrame(this.render);
  }

  init(id: 'canvas') {
    const canvas = document.querySelector(id);

    if (!canvas) {
      alert("Unable to initialize WebGL. Your browser or machine may not support it.");
      return;  
    }
  
    this.gl = canvas.getContext('webgl') as WebGL2RenderingContext;
  
    if (!this.gl) return;
  
    window.requestAnimationFrame(this.render)
  }

  clear(r: number, g: number, b: number, a: number) {
    if(this.gl) {
      this.gl.clearColor(r, g, b, a);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    }
  }

  renderCircle(vertex: WebGLShader, fragment: WebGLShader, circle: CircleShape) {
    const program = this.gl?.createProgram() as WebGLProgram;
    this.gl?.attachShader(program, vertex);
    this.gl?.attachShader(program, fragment);
    this.gl?.linkProgram(program);
    this.gl?.useProgram(program);

    var ATTRIBUTES = 5;
    var j = 0;
    var data = [];

    this.user.move();
    
    data[j++] = (circle.x - circle.r);
    data[j++] = (circle.y - circle.r);
    data[j++] = circle.x;
    data[j++] = circle.y;
    data[j++] = circle.r;

    data[j++] = (circle.x + (1 + Math.sqrt(2)) * circle.r);
    data[j++] = circle.y - circle.r;
    data[j++] = circle.x;
    data[j++] = circle.y;
    data[j++] = circle.r;

    data[j++] = (circle.x - circle.r);
    data[j++] = (circle.y + (1 + Math.sqrt(2)) * circle.r);
    data[j++] = circle.x;
    data[j++] = circle.y;
    data[j++] = circle.r;

    data[j++] = (circle.x - circle.r);
    data[j++] = (circle.y - circle.r);
    data[j++] = circle.x;
    data[j++] = circle.y;
    data[j++] = circle.r;

    data[j++] = (circle.x + (1 + Math.sqrt(2)) * circle.r);
    data[j++] = circle.y - circle.r;
    data[j++] = circle.x;
    data[j++] = circle.y;
    data[j++] = circle.r;

    data[j++] = (circle.x - circle.r);
    data[j++] = (circle.y + (1 + Math.sqrt(2)) * circle.r);
    data[j++] = circle.x;
    data[j++] = circle.y;
    data[j++] = circle.r;

    var dataBuffer = new Float32Array(data);
  
    var buffer = this.gl?.createBuffer() as WebGLBuffer;
    this.gl?.bindBuffer(this.gl?.ARRAY_BUFFER, buffer);
    this.gl?.bufferData(
      this.gl?.ARRAY_BUFFER, 
        dataBuffer,
        this.gl?.STATIC_DRAW);

    
    const resolutionLocation = this.gl?.getUniformLocation(program, "u_resolution") as WebGLUniformLocation;
    this.gl?.uniform2f(resolutionLocation, 400, 400);

    var positionLocation = this.gl?.getAttribLocation(program, "a_position") as number;
    var centerLocation = this.gl?.getAttribLocation(program, "a_center") as number;
    var radiusLocation = this.gl?.getAttribLocation(program, "a_radius") as number;
    
    
    this.gl?.enableVertexAttribArray(positionLocation);
    this.gl?.enableVertexAttribArray(centerLocation);
    this.gl?.enableVertexAttribArray(radiusLocation);

    this.gl?.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0);
    this.gl?.vertexAttribPointer(centerLocation, 2, this.gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8);
    this.gl?.vertexAttribPointer(radiusLocation, 1, this.gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 16);

    this.gl?.drawArrays(this.gl.TRIANGLE_STRIP, 0, data.length/ATTRIBUTES);
  }

  startMovement(x: number, y: number, user: UserAvatar) {
    const xVectorPoint = x - user.getAllCoordinates().circle.x;
    const yVectorPoint = y - user.getAllCoordinates().circle.y;
    const vectorMagnitude = Math.sqrt(Math.pow(xVectorPoint, 2) + Math.pow(yVectorPoint, 2));

    user.setupMovement(xVectorPoint / vectorMagnitude, yVectorPoint / vectorMagnitude, 2);
  }

  updateDirection(x: number, y: number, user: UserAvatar) {
    const xVectorPoint = x - user.getAllCoordinates().circle.x;
    const yVectorPoint = y - user.getAllCoordinates().circle.y;
    const vectorMagnitude = Math.sqrt(Math.pow(xVectorPoint, 2) + Math.pow(yVectorPoint, 2));

    user.updateDirection(xVectorPoint / vectorMagnitude, yVectorPoint / vectorMagnitude);
  }

  stopMovement(user: UserAvatar) {
    user.stopMovement();
  }

}

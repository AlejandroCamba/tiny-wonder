import { CircleShape } from './shapes/CircleShape';

export class UserAvatar {
  private _circle: CircleShape;
  private _directionalShape: CircleShape
  private xMovement = 0;
  private yMovement = 0;
  private speed = 0;
  
  constructor(circle: CircleShape) {
    this._circle = circle;

    const diameter = circle.r * 2;
    this._directionalShape = new CircleShape(circle.x + circle.r*1.2, circle.y + circle.r*1.2, circle.r/4);
  }

  setupMovement(unitVx: number, unitVy: number, speed: number) {
    this.xMovement = unitVx;
    this.yMovement = unitVy;
    this.speed = speed;
  }

  stopMovement() {
    this.xMovement = this.yMovement = this.speed = 0;
  }

  move() {
    this._circle.x += this.speed * this.xMovement;
    this._circle.y += this.speed * this.yMovement;
    if (this.xMovement || this.yMovement) {
      this.updateDirection(this.xMovement, this.yMovement);
    }
  }

  updateDirection(unitVx: number, unitVy: number) {
    this._directionalShape.x = (this._circle.x) + (unitVx * this._circle.r*1.6 );
    this._directionalShape.y = (this._circle.y ) + (unitVy * this._circle.r*1.6 );
  }

  getAllCoordinates() {
    return {
      circle: this._circle,
      directional: this._directionalShape
    }
  }

  updateCircles(circle: any, directional: any) {
    this._circle.setX = circle.x;
    this._circle.setY = circle.y;

    this._directionalShape.setX = directional.x;
    this._directionalShape.setY = directional.y;

  }
}
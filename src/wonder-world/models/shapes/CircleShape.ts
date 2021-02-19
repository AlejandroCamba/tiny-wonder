export class CircleShape {
  public x: number;
  public y: number;
  public r: number;

  constructor(x: number, y: number, r: number) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  set setX(x: number) {
    this.x = x;
  }

  set setY(y: number) {
    this.y = y;
  }
}
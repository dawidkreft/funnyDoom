// Camera — player position, direction, view plane (FOV ~66°)
export class Camera {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;      // radians
    this.fov = Math.PI / 3; // 60°
    this.moveSpeed = 3.5;
    this.rotSpeed = 2.2;
    // Direction vector
    this.dirX = Math.cos(angle);
    this.dirY = Math.sin(angle);
    // Camera plane (perpendicular to dir, length = tan(fov/2))
    this.planeX = -Math.sin(angle) * 0.66;
    this.planeY = Math.cos(angle) * 0.66;
  }

  rotate(delta) {
    const cos = Math.cos(delta);
    const sin = Math.sin(delta);
    const oldDirX = this.dirX;
    this.dirX = this.dirX * cos - this.dirY * sin;
    this.dirY = oldDirX * sin + this.dirY * cos;
    const oldPlaneX = this.planeX;
    this.planeX = this.planeX * cos - this.planeY * sin;
    this.planeY = oldPlaneX * sin + this.planeY * cos;
    this.angle += delta;
  }

  tryMove(dx, dy, map) {
    const r = 0.28; // player collision radius
    // Check two perpendicular edge points in movement direction
    if (dx !== 0) {
      const ex = this.x + dx + (dx > 0 ? r : -r);
      if (!map.isWall(ex, this.y + r) && !map.isWall(ex, this.y - r)) this.x += dx;
    }
    if (dy !== 0) {
      const ey = this.y + dy + (dy > 0 ? r : -r);
      if (!map.isWall(this.x + r, ey) && !map.isWall(this.x - r, ey)) this.y += dy;
    }
  }
}

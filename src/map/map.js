// Map — 2D grid, tile lookup, collision
export class GameMap {
  constructor(data, width, height) {
    this.data = data;   // flat Uint8Array or array of tile IDs
    this.width = width;
    this.height = height;
    this.items = [];    // { x, y, type } – pickups/powerups
    this.enemySpawns = []; // { x, y, type }
    this.playerStart = { x: 1.5, y: 1.5, angle: 0 };
  }

  getTile(x, y) {
    const mx = Math.floor(x);
    const my = Math.floor(y);
    if (mx < 0 || mx >= this.width || my < 0 || my >= this.height) return 1;
    return this.data[my * this.width + mx];
  }

  isWall(x, y) {
    return this.getTile(x, y) > 0;
  }
}

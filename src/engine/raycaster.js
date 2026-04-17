// DDA Raycaster — casts one ray per screen column
export class Raycaster {
  constructor(width) {
    this.width = width;
    this.zBuffer = new Float64Array(width); // for sprite clipping
  }

  // Returns array of RayHit objects, one per column
  castAll(camera, map) {
    const hits = [];
    for (let x = 0; x < this.width; x++) {
      const hit = this.castRay(x, camera, map);
      hits.push(hit);
      this.zBuffer[x] = hit.perpWallDist;
    }
    return hits;
  }

  castRay(screenX, camera, map) {
    // Camera-space x: -1 (left) to 1 (right)
    const cameraX = (2 * screenX) / this.width - 1;
    const rayDirX = camera.dirX + camera.planeX * cameraX;
    const rayDirY = camera.dirY + camera.planeY * cameraX;

    let mapX = Math.floor(camera.x);
    let mapY = Math.floor(camera.y);

    // Length of ray from one x/y-side to next
    const deltaDistX = rayDirX === 0 ? Infinity : Math.abs(1 / rayDirX);
    const deltaDistY = rayDirY === 0 ? Infinity : Math.abs(1 / rayDirY);

    let stepX, stepY;
    let sideDistX, sideDistY;

    if (rayDirX < 0) {
      stepX = -1;
      sideDistX = (camera.x - mapX) * deltaDistX;
    } else {
      stepX = 1;
      sideDistX = (mapX + 1 - camera.x) * deltaDistX;
    }
    if (rayDirY < 0) {
      stepY = -1;
      sideDistY = (camera.y - mapY) * deltaDistY;
    } else {
      stepY = 1;
      sideDistY = (mapY + 1 - camera.y) * deltaDistY;
    }

    let side = 0; // 0 = NS wall, 1 = EW wall
    let hit = false;
    let tileId = 0;

    while (!hit) {
      if (sideDistX < sideDistY) {
        sideDistX += deltaDistX;
        mapX += stepX;
        side = 0;
      } else {
        sideDistY += deltaDistY;
        mapY += stepY;
        side = 1;
      }
      tileId = map.getTile(mapX, mapY);
      if (tileId > 0) hit = true;
    }

    const perpWallDist = side === 0
      ? sideDistX - deltaDistX
      : sideDistY - deltaDistY;

    // Exact position on wall where ray hit (0–1, for texturing)
    let wallX;
    if (side === 0) wallX = camera.y + perpWallDist * rayDirY;
    else wallX = camera.x + perpWallDist * rayDirX;
    wallX -= Math.floor(wallX);

    return { perpWallDist, side, wallX, tileId, mapX, mapY, rayDirX, rayDirY };
  }
}

import { GameMap } from '../map.js';

// Tile legend:
//   0 = floor
//   1 = pink wall
//   2 = yellow wall
//   3 = green wall
//   9 = door (future)
// W = 1 (wall shorthand)
const W = 1, Y = 2, G = 3;

// prettier-ignore
const GRID = [
  W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,
  W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,
  W,0,0,0,0,0,Y,Y,0,0,0,0,0,0,0,W,
  W,0,0,0,0,0,Y,0,0,0,0,0,0,0,0,W,
  W,0,0,W,W,0,0,0,0,0,G,G,G,0,0,W,
  W,0,0,W,0,0,0,0,0,0,G,0,G,0,0,W,
  W,0,0,W,0,0,0,0,0,0,G,0,G,0,0,W,
  W,0,0,0,0,0,0,0,0,0,G,G,G,0,0,W,
  W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,
  W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,
  W,0,Y,Y,Y,0,0,0,0,0,0,0,0,0,0,W,
  W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,
  W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,
];

const MAP_W = 16;
const MAP_H = 13;

export function createLevel1() {
  const map = new GameMap(GRID, MAP_W, MAP_H);

  map.playerStart = { x: 1.5, y: 1.5, angle: 0 };

  map.enemySpawns = [
    { x: 8.5, y: 3.5, type: 'potato' },
    { x: 5.5, y: 8.5, type: 'potato' },
    { x: 13.5, y: 9.5, type: 'donut' },
    { x: 11.5, y: 3.5, type: 'donut' },
    { x: 7.5, y: 10.5, type: 'potato' },
  ];

  map.items = [
    { x: 3.5, y: 3.5, type: 'pizza' },
    { x: 14.5, y: 5.5, type: 'pizza' },
    { x: 9.5, y: 11.5, type: 'ammo' },
    { x: 7.5, y: 7.5, type: 'weapon_icer' },
  ];

  return map;
}

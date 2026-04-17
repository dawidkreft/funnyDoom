import { GameMap } from '../map.js';

const W=1,Y=2,G=3,B=4;
// 24 wide × 18 tall — Kuchnia Chaosu
// prettier-ignore
const GRID=[
  W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,
  W,0,0,0,0,0,Y,0,0,0,0,0,W,0,0,0,0,0,0,0,0,0,0,W,
  W,0,0,0,0,0,Y,0,Y,Y,Y,0,W,0,0,0,0,0,0,0,0,0,0,W,
  W,0,0,G,G,0,0,0,Y,0,0,0,0,0,0,0,0,0,Y,Y,Y,Y,0,W,
  W,0,0,G,0,0,0,0,0,0,0,0,0,0,G,G,G,0,0,0,0,0,0,W,
  W,0,0,G,G,0,0,0,0,0,0,0,0,0,G,0,G,0,0,0,0,0,0,W,
  W,0,0,0,0,0,0,W,W,W,W,0,0,0,G,G,G,0,0,0,Y,0,0,W,
  W,0,0,0,0,0,0,W,0,0,W,0,0,0,0,0,0,0,0,0,Y,0,0,W,
  W,0,Y,Y,0,0,0,W,0,0,W,0,0,0,0,0,0,W,W,W,W,0,0,W,
  W,0,0,Y,0,0,0,0,0,0,0,0,0,0,0,0,0,W,0,0,0,0,0,W,
  W,0,0,0,0,0,0,0,0,0,0,0,B,B,B,0,0,W,0,0,0,0,0,W,
  W,W,W,0,W,W,W,0,0,0,0,0,B,0,B,0,0,W,0,0,0,0,0,W,
  W,0,0,0,0,0,W,0,0,0,0,0,B,B,B,0,0,0,0,0,0,0,0,W,
  W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,G,G,0,0,W,
  W,0,G,G,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,G,0,0,0,W,
  W,0,G,0,0,0,0,0,0,0,Y,Y,Y,0,0,0,0,0,0,G,G,0,0,W,
  W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,
  W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,
];
const MAP_W=24,MAP_H=18;

export function createLevel2(){
  const map=new GameMap(GRID,MAP_W,MAP_H);
  map.playerStart={x:1.5,y:1.5,angle:0};
  map.enemySpawns=[
    // Row 1 open floor (cols 1–5, 7–11, 13–22)
    {x:11.5,y:1.5,type:'potato'},{x:18.5,y:2.5,type:'donut'},
    // Inner rooms
    {x:5.5,y:7.5,type:'donut'},{x:8.5,y:8.5,type:'potato'},
    {x:17.5,y:6.5,type:'cactus'},{x:20.5,y:9.5,type:'donut'},
    // Bottom section open floors
    {x:15.5,y:10.5,type:'cloud'},{x:7.5,y:13.5,type:'potato'},
    {x:14.5,y:14.5,type:'donut'},{x:21.5,y:14.5,type:'cactus'},
    {x:3.5,y:15.5,type:'cloud'},{x:17.5,y:12.5,type:'potato'},
  ];
  map.items=[
    {x:11.5,y:1.5,type:'pizza'},{x:22.5,y:5.5,type:'ammo'},
    {x:1.5,y:12.5,type:'weapon_icer'},{x:13.5,y:16.5,type:'shield'},
    {x:9.5,y:9.5,type:'pizza'},
  ];
  return map;
}

import { GameMap } from '../map.js';

const W=1,Y=2,G=3,B=4;
// 28 wide × 20 tall — Disco Dungeon
// prettier-ignore
const GRID=[
  W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,
  W,0,0,0,0,0,0,0,0,0,0,0,0,0,W,0,0,0,0,0,0,0,0,0,0,0,0,W,
  W,0,0,Y,Y,Y,0,0,0,0,0,0,0,0,W,0,0,B,B,B,B,0,0,0,0,0,0,W,
  W,0,0,Y,0,0,0,0,G,G,G,0,0,0,W,0,0,B,0,0,B,0,0,0,0,0,0,W,
  W,0,0,Y,Y,0,0,0,G,0,G,0,0,0,0,0,0,B,0,0,B,0,0,Y,Y,Y,0,W,
  W,0,0,0,0,0,0,0,G,G,G,0,0,0,0,0,0,0,0,0,0,0,0,Y,0,0,0,W,
  W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,
  W,W,W,W,0,W,W,W,W,W,0,W,W,W,W,W,0,W,W,W,W,W,0,W,W,W,W,W,
  W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,
  W,0,Y,0,0,0,0,0,G,0,0,0,0,0,0,0,B,0,0,0,0,0,Y,0,0,0,0,W,
  W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,
  W,W,W,W,0,W,W,W,W,W,0,W,W,W,W,W,0,W,W,W,W,W,0,W,W,W,W,W,
  W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,
  W,0,0,0,B,B,0,0,0,0,0,0,0,G,G,G,0,0,0,0,0,0,0,Y,Y,0,0,W,
  W,0,0,0,B,0,0,0,0,0,0,0,0,G,0,G,0,0,0,0,0,0,0,Y,0,0,0,W,
  W,0,0,0,0,0,0,0,0,0,0,0,0,G,G,G,0,0,0,0,Y,0,0,0,0,0,0,W,
  W,0,0,0,0,0,W,W,W,0,0,0,0,0,0,0,0,W,W,W,0,0,0,0,0,0,0,W,
  W,0,0,0,0,0,W,0,W,0,0,0,0,0,0,0,0,W,0,W,0,0,0,0,0,0,0,W,
  W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,
  W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,
];
const MAP_W=28,MAP_H=20;

export function createLevel3(){
  const map=new GameMap(GRID,MAP_W,MAP_H);
  map.playerStart={x:1.5,y:1.5,angle:0};
  map.enemySpawns=[
    {x:10.5,y:2.5,type:'donut'},{x:20.5,y:2.5,type:'cloud'},
    {x:5.5,y:4.5,type:'cactus'},{x:15.5,y:3.5,type:'donut'},
    {x:25.5,y:4.5,type:'cactus'},{x:2.5,y:9.5,type:'cloud'},
    {x:8.5,y:9.5,type:'donut'},{x:14.5,y:9.5,type:'cactus'},
    {x:19.5,y:9.5,type:'cloud'},{x:25.5,y:9.5,type:'donut'},
    {x:3.5,y:13.5,type:'cactus'},{x:11.5,y:14.5,type:'cloud'},
    {x:20.5,y:14.5,type:'donut'},{x:26.5,y:13.5,type:'cactus'},
    {x:7.5,y:17.5,type:'cloud'},{x:15.5,y:17.5,type:'donut'},
    {x:22.5,y:17.5,type:'cactus'},{x:13.5,y:6.5,type:'potato'},
  ];
  map.items=[
    {x:13.5,y:1.5,type:'weapon_stinker'},{x:26.5,y:9.5,type:'ammo'},
    {x:1.5,y:17.5,type:'pizza'},{x:26.5,y:17.5,type:'pizza'},
    {x:9.5,y:6.5,type:'megaammo'},{x:22.5,y:6.5,type:'shield'},
    {x:13.5,y:14.5,type:'turbo'},
  ];
  return map;
}

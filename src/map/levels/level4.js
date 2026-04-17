import { GameMap } from '../map.js';

const W=1,Y=2,G=3,B=4;
// 32 wide × 22 tall — Ogród Warzywny (BOSS LEVEL)
// Open arena with pillars + side corridors
// prettier-ignore
const GRID=[
  W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,
  W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,
  W,0,0,Y,Y,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,Y,Y,0,0,0,W,
  W,0,0,Y,0,0,0,0,G,G,0,0,0,0,0,0,0,0,0,0,G,G,0,0,0,0,Y,0,0,0,0,W,
  W,0,0,0,0,0,0,0,G,G,0,0,0,0,0,0,0,0,0,0,G,G,0,0,0,0,0,0,0,0,0,W,
  W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,
  W,0,0,0,0,0,B,B,0,0,0,0,0,0,0,0,0,0,0,0,0,0,B,B,0,0,0,0,0,0,0,W,
  W,0,0,0,0,0,B,B,0,0,0,0,0,0,0,0,0,0,0,0,0,0,B,B,0,0,0,0,0,0,0,W,
  W,W,W,0,W,W,W,W,W,W,W,W,0,0,0,0,0,0,0,W,W,W,W,W,W,W,0,W,W,0,W,W,
  W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,
  W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,
  W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,
  W,W,W,0,W,W,W,W,W,W,W,W,0,0,0,0,0,0,0,W,W,W,W,W,W,W,0,W,W,0,W,W,
  W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,
  W,0,0,0,0,0,B,B,0,0,0,0,0,0,0,0,0,0,0,0,0,0,B,B,0,0,0,0,0,0,0,W,
  W,0,0,0,0,0,B,B,0,0,0,0,0,0,0,0,0,0,0,0,0,0,B,B,0,0,0,0,0,0,0,W,
  W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,
  W,0,0,0,0,0,0,0,G,G,0,0,0,0,0,0,0,0,0,0,G,G,0,0,0,0,0,0,0,0,0,W,
  W,0,0,0,Y,Y,0,0,G,G,0,0,0,0,0,0,0,0,0,0,G,G,0,0,Y,Y,0,0,0,0,0,W,
  W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,
  W,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,W,
  W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,
];
const MAP_W=32,MAP_H=22;

export function createLevel4(){
  const map=new GameMap(GRID,MAP_W,MAP_H);
  map.playerStart={x:1.5,y:1.5,angle:0};
  // BOSS + many enemies
  map.enemySpawns=[
    // Boss frog in center
    {x:16.5,y:10.5,type:'frog'},
    // Ring of cactuses
    {x:4.5,y:4.5,type:'cactus'},{x:12.5,y:4.5,type:'cactus'},
    {x:20.5,y:4.5,type:'cactus'},{x:28.5,y:4.5,type:'cactus'},
    // Clouds patrol
    {x:7.5,y:10.5,type:'cloud'},{x:25.5,y:10.5,type:'cloud'},
    {x:7.5,y:14.5,type:'cloud'},{x:25.5,y:14.5,type:'cloud'},
    // Donuts
    {x:3.5,y:7.5,type:'donut'},{x:16.5,y:7.5,type:'donut'},
    {x:29.5,y:7.5,type:'donut'},{x:3.5,y:14.5,type:'donut'},
    {x:16.5,y:14.5,type:'donut'},{x:29.5,y:14.5,type:'donut'},
    // Potatoes corners
    {x:4.5,y:18.5,type:'potato'},{x:28.5,y:18.5,type:'potato'},
    {x:4.5,y:2.5,type:'potato'},{x:28.5,y:2.5,type:'potato'},
    // Extra cactus waves
    {x:12.5,y:18.5,type:'cactus'},{x:20.5,y:18.5,type:'cactus'},
    {x:10.5,y:10.5,type:'potato'},{x:22.5,y:10.5,type:'potato'},
    // More clouds
    {x:16.5,y:2.5,type:'cloud'},{x:10.5,y:16.5,type:'cloud'},
    {x:22.5,y:16.5,type:'cloud'},
  ];
  map.items=[
    {x:1.5,y:19.5,type:'pizza'},{x:30.5,y:19.5,type:'pizza'},
    {x:1.5,y:9.5,type:'pizza'},{x:30.5,y:9.5,type:'pizza'},
    {x:15.5,y:1.5,type:'megaammo'},{x:17.5,y:1.5,type:'ammo'},
    {x:15.5,y:19.5,type:'shield'},{x:17.5,y:19.5,type:'turbo'},
    {x:5.5,y:10.5,type:'weapon_icer'},{x:27.5,y:10.5,type:'weapon_stinker'},
  ];
  return map;
}

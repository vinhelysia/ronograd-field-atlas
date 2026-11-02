import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {HOME,zoomView,nativeView} from '../dist/map-math.js';
import {anchors,landmarks,basemap,diagrams,roomPhotos} from '../dist/map-data.js';
const root=new URL('../',import.meta.url);
const rooms=JSON.parse(await readFile(new URL('dist/rooms.json',root),'utf8'));
assert.equal(rooms.length,5);
assert.equal(new Set(rooms.map(room=>room.id)).size,5);
assert.equal(rooms.reduce((sum,room)=>sum+room.keySpawns.length,0),18);
for(const room of rooms){
  assert.ok(room.name&&room.key&&room.location&&room.loot.length&&room.sources.length);
  assert.ok(anchors[room.id],`Missing map anchor: ${room.id}`);
  assert.ok(room.sources.every(url=>new URL(url).hostname==='roblox-blackhawk-rescue-mission-5.fandom.com'));
  assert.ok(room.keySpawns.every(spawn=>typeof spawn==='string'&&spawn.length>10));
  assert.ok(room.loot.every(loot=>loot.item&&typeof loot.quantity==='string'));
}
for(const [x,y] of [...Object.values(anchors),...landmarks.map(place=>[place.x,place.y])]) assert.ok(x>=0&&x<=1460&&y>=0&&y<=1500);
const zoomed=zoomView(HOME,.5,[500,500]);
assert.deepEqual(zoomed,[210,205,810,862.5]);
assert.deepEqual(zoomView(zoomed,2,[500,500]),HOME);
assert.equal(zoomView(HOME,100,[500,500])[2],HOME[2]);
assert.equal(zoomView(HOME,.001,[500,500])[2],20);
assert.equal((500-zoomed[0])/zoomed[2],(500-HOME[0])/HOME[2]);
for(const viewport of [[940,640],[375,480]]){
  const native=nativeView(HOME,viewport,basemap.width/basemap.mapWidth);
  assert.ok(Math.abs(viewport[0]/native[2]-basemap.width/basemap.mapWidth)<1e-10);
  assert.ok(Math.abs(viewport[1]/native[3]-basemap.width/basemap.mapWidth)<1e-10);
  assert.ok(Math.abs(native[0]+native[2]/2-HOME[0]-HOME[2]/2)<1e-10);
  assert.ok(Math.abs(native[1]+native[3]/2-HOME[1]-HOME[3]/2)<1e-10);
}
const png=await readFile(new URL(`dist/${basemap.file}`,root));
assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
assert.equal(png.readUInt32BE(16),basemap.width);
assert.equal(png.readUInt32BE(20),basemap.height);
assert.equal(createHash('sha256').update(png).digest('hex'),'d4d2c300734646229ad1254f8def2cf56b8f8d665b0e1474cade9a40cc087b46','Original Wiki PNG must remain unmodified.');
for(const [id,diagram] of Object.entries(diagrams)){
  const image=await readFile(new URL(`dist/${diagram.file}`,root));
  assert.equal(image.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  assert.ok(diagram.source.startsWith('https://roblox-blackhawk-rescue-mission-5.fandom.com/wiki/'));
  const room=rooms.find(room=>room.id===id);
  assert.deepEqual(diagram.points.flatMap(point=>point.spawns).sort((a,b)=>a-b),room.keySpawns.map((_,index)=>index));
  for(const point of diagram.points){
    assert.ok(point.floor&&point.label);
    assert.ok(point.position[0]>0&&point.position[0]<basemap.mapWidth);
    assert.ok(point.position[1]>0&&point.position[1]<basemap.mapWidth*basemap.height/basemap.width);
  }
}
assert.deepEqual(diagrams.kozlovka.points.find(point=>point.spawns.length===3).spawns,[1,2,3]);
assert.ok(diagrams.quarry.points.every(point=>point.floor==='UNDERGROUND'));
assert.deepEqual(anchors.kozlovka,diagrams.kozlovka.points.find(point=>!point.spawns.length).position);
for(const photo of Object.values(roomPhotos)){
  const image=await readFile(new URL(`dist/${photo.file}`,root));
  assert.equal(image.subarray(0,3).toString('hex'),'ffd8ff');
}
console.log('PASS: original 7187×7382 PNG checksum, 1:1 pixel scale, zoom math, 5 rooms / 18 key descriptions, 8 diagram-linked checks, floors, shared callout and reference assets.');

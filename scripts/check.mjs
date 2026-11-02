import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {HOME,zoomView} from '../dist/map-math.js';
import {anchors,landmarks} from '../dist/map-data.js';
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
assert.equal(zoomView(HOME,.001,[500,500])[2],190);
assert.equal((500-zoomed[0])/zoomed[2],(500-HOME[0])/HOME[2]);
const svg=await readFile(new URL('dist/terrain.svg',root),'utf8');
assert.ok(svg.includes('viewBox="0 0 1460 1500"'));
assert.ok(!/<image|<script|NaN|Infinity/.test(svg),'Basemap must contain only finite vector geometry.');
assert.ok((svg.match(/<path /g)||[]).length>=5);
console.log('PASS: 5 rooms, 18 key spots, source links, map anchors, zoom limits/anchor invariance, vector-only terrain.');

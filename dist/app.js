import {HOME, zoomView, nativeView} from './map-math.js?v=20261102-accuracy';
import {anchors, landmarks, basemap, diagrams, roomPhotos} from './map-data.js?v=20261102-accuracy';

const $ = selector => document.querySelector(selector);
const map = $('#map');
const ns = 'http://www.w3.org/2000/svg';
const wiki = 'https://roblox-blackhawk-rescue-mission-5.fandom.com/wiki/';
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const sourceName = url => decodeURIComponent(url.split('/wiki/')[1] || 'BRM5 Wiki').replaceAll('_',' ').replace('#Locked Room',' · Locked Room');
const sourceLink = url => url.startsWith(wiki) ? `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(sourceName(url))} ↗</a>` : '';
let rooms = [];
let view = [...HOME];
let ready = false;
let basemapBlob;

const mapStyle = `
  .map-grid{stroke:#a2b9ae;stroke-width:.65;opacity:.12;pointer-events:none}
  .room-marker,.landmark-marker{cursor:pointer;outline:none}
  .room-marker .halo{fill:#e8b97212;stroke:#e8b97245;stroke-width:1;opacity:0}
  .room-marker.selected .halo,.room-marker:hover .halo,.room-marker:focus .halo{opacity:1}
  .room-marker .pin{fill:#142228;stroke:#e8b972;stroke-width:1.7}
  .room-marker:hover .pin,.room-marker.selected .pin,.room-marker:focus .pin{fill:#80653c}
  .room-marker.selected.has-projections{display:none}
  .room-marker .num{font:600 12px Arial,sans-serif;fill:#f3d7a5;text-anchor:middle;dominant-baseline:central}
  .room-marker .label{font:600 12px Arial,sans-serif;letter-spacing:1.4px;fill:#f1cf92;text-anchor:middle;paint-order:stroke;stroke:#132028;stroke-width:4;stroke-linejoin:round}
  .room-marker .sub{font:9px Arial,sans-serif;fill:#bec9bb;text-anchor:middle;paint-order:stroke;stroke:#132028;stroke-width:3}
  .landmark-marker text{font:10px Arial,sans-serif;letter-spacing:.8px;fill:#b8c9bf;paint-order:stroke;stroke:#132028;stroke-width:3;text-anchor:middle}
  .landmark-marker circle{fill:#17272a;stroke:#a7b9b0;stroke-width:1.2}
  .landmark-marker.friendly circle{fill:#adbe86;stroke:#d9dfbb}
  .landmark-marker.empty circle{stroke:#a7a38c;stroke-dasharray:2 2}
  .landmark-marker:hover circle,.landmark-marker:focus circle{stroke:#e8b972;stroke-width:2}
  .detail-marker{cursor:pointer;outline:none}
  .detail-marker circle{fill:#1a2025;stroke:#f79583;stroke-width:1.8}
  .detail-marker.room circle{stroke:#ecd18a}
  .detail-marker line{stroke:#f79583;stroke-width:.8;opacity:.7}
  .detail-marker text{font:600 9px Arial,sans-serif;fill:#ffb6a7;paint-order:stroke;stroke:#142127;stroke-width:3;text-anchor:middle}
  .detail-marker.room text{fill:#ecd18a}
  .detail-marker.active circle,.detail-marker:hover circle,.detail-marker:focus circle{fill:#d95d48;stroke-width:2.5}
  @media(max-width:600px){.room-marker .sub{display:none}.room-marker .label{letter-spacing:.5px}}
`;

function svgNode(name, attributes = {}) {
  const element = document.createElementNS(ns, name);
  for (const [key,value] of Object.entries(attributes)) element.setAttribute(key, value);
  return element;
}
function setView(next) {
  view = next;
  map.setAttribute('viewBox', view.join(' '));
  const scale = (matchMedia('(max-width:600px)').matches ? .82 : 1) / map.getScreenCTM().a;
  map.querySelectorAll('[data-anchor]').forEach(marker => {
    const [x,y] = marker.dataset.anchor.split(',');
    marker.setAttribute('transform', `translate(${x} ${y}) scale(${scale})`);
  });
  $('#zoom-level').value = `${Math.round(HOME[2] / view[2] * 100)}%`;
}
function centerOn(point, width = 530) {
  setView([point[0] - width/2, point[1] - width*HOME[3]/HOME[2]/2, width, width*HOME[3]/HOME[2]]);
}
function showPage(id) {
  ['overview','detail','guide'].forEach(name => $(`#${name}`).hidden = name !== id);
  $('#sidebar').scrollTop = 0;
  if(matchMedia('(max-width:600px)').matches) $('#sidebar').scrollIntoView({block:'start'});
}
function clearSelection() {
  map.querySelectorAll('.selected').forEach(marker => marker.classList.remove('selected'));
  $('#detail-layer')?.replaceChildren();
}
function showOverview() {
  clearSelection();
  showPage('overview');
  $('#search').focus({preventScroll:true});
}
function showGuide() { showPage('guide'); }

function focusProjection(room, index) {
  const point=diagrams[room.id]?.points[index];
  if(!point) return;
  map.querySelectorAll('.detail-marker').forEach((marker,i)=>marker.classList.toggle('active',i===index));
  $('#detail').querySelectorAll('[data-spawn]').forEach(row=>row.classList.toggle('located',point.spawns.includes(Number(row.dataset.spawn))));
  centerOn(point.position,45);
  $('#room-pins').checked=true;$('#room-layer').setAttribute('display','inline');
  $('#status').textContent=`${room.name} · ${point.label} · ${point.floor} · Wiki diagram projection`;
  if(matchMedia('(max-width:600px)').matches) $('#map-area').scrollIntoView({block:'start'});
}
function drawProjections(room) {
  const layer=$('#detail-layer');
  layer.replaceChildren();
  for(const [index,point] of (diagrams[room.id]?.points || []).entries()) {
    const marker=svgNode('g',{class:`detail-marker${point.spawns.length?'':' room'}`,'data-anchor':point.position,tabindex:0,role:'button','aria-label':`${room.name}: ${point.label}, ${point.floor}, Wiki diagram projection`});
    const label=svgNode('text',{x:point.offset[0],y:point.offset[1]});label.textContent=`${point.label} · ${point.floor}`;
    marker.append(svgNode('line',{x1:0,y1:0,x2:point.offset[0],y2:point.offset[1]}),svgNode('circle',{r:4}),label);
    marker.addEventListener('click',()=>focusProjection(room,index));
    marker.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();focusProjection(room,index);}});
    layer.append(marker);
  }
}

function roomList() {
  const query = $('#search').value.trim().toLowerCase();
  const filtered = rooms.filter(room => [room.name,room.key,room.location,...room.keySpawns,...room.loot.map(loot=>loot.item)].join(' ').toLowerCase().includes(query));
  $('#result-count').textContent = `${filtered.length} location${filtered.length === 1 ? '' : 's'}`;
  $('#room-list').innerHTML = filtered.map(room => `
    <button class="room-row" data-room="${escape(room.id)}">
      <span class="room-number">${String(rooms.indexOf(room)+1).padStart(2,'0')}</span>
      <span><span class="row-name">${escape(room.name)}</span><span class="row-sub">${escape(room.key)} · ${room.keySpawns.length} key spots</span></span>
      <span class="row-arrow">↗</span>
    </button>`).join('') || '<p class="empty">No matching rooms. Try “cash”, “Gate Key” or a location name.</p>';
  map.querySelectorAll('.room-marker').forEach(marker => marker.style.opacity = filtered.some(room => room.id === marker.dataset.room) ? '1' : '.25');
}
function selectRoom(id, focusMap = true) {
  const room = rooms.find(entry => entry.id === id);
  if (!room) return;
  clearSelection();
  const marker=map.querySelector(`[data-room="${id}"]`);
  marker.classList.add('selected');marker.style.opacity='1';
  $('#detail').innerHTML = `<button class="back text-button">← All locked rooms</button>
    <div class="eyebrow">LOCKED ROOM / ${String(rooms.indexOf(room)+1).padStart(2,'0')}</div>
    <h2>${escape(room.name)}</h2><span class="key-name">⚿ ${escape(room.key)}</span>
    <p>${escape(room.location)}</p>
    ${id==='quarry'?'<div class="field-note"><span class="note-icon">!</span><div><strong>Complete all compound objectives first.</strong><p>The Wiki says the Quarry key only appears after every objective is complete.</p></div></div>':''}
    ${diagrams[id]?`<figure class="reference-diagram"><a href="${escape(diagrams[id].file)}" target="_blank" rel="noopener noreferrer"><img src="${escape(diagrams[id].file)}" alt="${escape(room.name)} key spawn reference diagram with floor labels" loading="lazy">Open full-size key diagram ↗</a><figcaption>${escape(diagrams[id].caption)} ${sourceLink(diagrams[id].source)}</figcaption></figure>`:'<div class="reference-note"><strong>Door/key coordinates not established</strong><p>No verified top-down key diagram is available here for this compound. Use the indoor directions below; the area pin is not the door.</p></div>'}
    ${roomPhotos[id]?`<figure class="reference-diagram"><a href="${escape(roomPhotos[id].file)}" target="_blank" rel="noopener noreferrer"><img src="${escape(roomPhotos[id].file)}" alt="${escape(room.name)} locked-room door appearance from the Wiki" loading="lazy">Open original door photo ↗</a><figcaption>Door appearance reference, without a surveyed map coordinate. ${sourceLink(roomPhotos[id].source)}</figcaption></figure>`:''}
    <h3>Possible loot <span class="muted">· Wiki quantities</span></h3>
    <div class="loot-grid">${room.loot.map(loot=>`<div class="loot-item"><strong${loot.quantity.length>8?' class="qualitative"':''}>${escape(loot.quantity)}</strong><span>${escape(loot.item)}</span></div>`).join('')}</div>
    <h3>Key search checklist · ${room.keySpawns.length} spots</h3>
    <p class="small">Possible spawns, not simultaneous keys. “Locate” follows a Wiki diagram callout; floor labels still matter.</p>
    <ol class="key-list">${room.keySpawns.map((spawn,index)=>{
      const projection=diagrams[id]?.points.findIndex(point=>point.spawns.includes(index));
      return `<li data-spawn="${index}"><label><input type="checkbox" aria-label="Checked key spot ${index+1}"><span><b class="spawn-number">${String(index+1).padStart(2,'0')}</b>${escape(spawn)}</span></label>${projection>=0?`<button class="locate" data-point="${projection}" data-room-point="${id}">Locate on map ↗</button>`:''}</li>`;
    }).join('')}</ol>
    <p class="small" style="margin-top:12px">Checks are temporary and reset when you reopen this room.</p>
    <h3>Field notes</h3><ul class="note-list">${room.notes.map(note=>`<li>${escape(note)}</li>`).join('')}</ul>
    <h3>Wiki sources</h3><div class="sources">${room.sources.map(sourceLink).join('')}</div>
    <button class="text-button detail-guide">Key timing & map notes ↗</button>`;
  showPage('detail');
  drawProjections(room);
  if (focusMap) centerOn(anchors[id],diagrams[id]?190:260);
  else setView(view);
}
function drawMarkers() {
  const grid = svgNode('g', {id:'grid-layer',class:'map-grid',display:'none'});
  for(let x=0;x<=1460;x+=200) grid.append(svgNode('path',{d:`M${x} 0V1500`}));
  for(let y=0;y<=1500;y+=200) grid.append(svgNode('path',{d:`M0 ${y}H1460`}));
  map.append(grid);
  const places = svgNode('g', {id:'landmark-layer'});
  for (const place of landmarks) {
    const marker = svgNode('g', {'class':`landmark-marker ${place.type || ''}`,'data-anchor':[place.x,place.y],tabindex:0,role:'button','aria-label':place.name});
    const title = svgNode('title'); title.textContent = place.name === 'Fort Ronograd' ? 'Fort Ronograd: empty room reported by Wiki; see map notes.' : `${place.name} · approximate compound anchor`;
    const text = svgNode('text',{y:-13}); text.textContent = place.type==='friendly' ? 'FOB / AIRBASE' : place.name.toUpperCase();
    if(place.x>1200){text.style.textAnchor='end';text.setAttribute('x',-8);}
    if(place.x<300){text.style.textAnchor='start';text.setAttribute('x',8);}
    marker.append(title,svgNode('circle',{r:4}),text);
    const activate = () => {
      centerOn([place.x,place.y],650);
      if(place.type === 'empty') showGuide();
      else $('#status').textContent = `${place.name} · landmark`;
    };
    marker.addEventListener('click',activate);
    marker.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();activate();}});
    places.append(marker);
  }
  map.append(places);
  const roomLayer = svgNode('g',{id:'room-layer'});
  rooms.forEach((room,index)=>{
    const marker = svgNode('g', {class:`room-marker${diagrams[room.id]?' has-projections':''}`,'data-anchor':anchors[room.id],'data-room':room.id,tabindex:0,role:'button','aria-label':`${room.name}: locked room and ${room.keySpawns.length} possible key spots`});
    const title=svgNode('title'); title.textContent=`${room.name} · ${room.key} · approximate area`;
    const num=svgNode('text',{class:'num',y:0}); num.textContent=index+1;
    const label=svgNode('text',{class:'label',y:-29}); label.textContent=room.name.toUpperCase();
    const sub=svgNode('text',{class:'sub',y:34}); sub.textContent=`${room.keySpawns.length} KEY SPOTS`;
    marker.append(title,svgNode('circle',{class:'halo',r:25}),svgNode('rect',{class:'pin',x:-12,y:-12,width:24,height:24,rx:3,transform:'rotate(45)'}),num,label,sub);
    marker.addEventListener('click',()=>{$('#status').textContent='';selectRoom(room.id);});
    marker.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();selectRoom(room.id);}});
    roomLayer.append(marker);
  });
  roomLayer.append(svgNode('g',{id:'detail-layer'}));map.append(roomLayer);
  setView(view);
}

$('#search').addEventListener('input',roomList);
$('#sidebar').addEventListener('click',event=>{
  const point=event.target.closest('[data-point]');
  if(point) focusProjection(rooms.find(room=>room.id===point.dataset.roomPoint),Number(point.dataset.point));
  const row=event.target.closest('[data-room]');
  if(row) selectRoom(row.dataset.room);
  if(event.target.closest('.back')) showOverview();
  if(event.target.closest('.detail-guide')) showGuide();
});
$('#show-guide').addEventListener('click',showGuide);
$('#map-notes').addEventListener('click',showGuide);
$('#landmarks').addEventListener('change',event=>$('#landmark-layer')?.setAttribute('display',event.target.checked?'inline':'none'));
$('#grid').addEventListener('change',event=>$('#grid-layer')?.setAttribute('display',event.target.checked?'inline':'none'));
$('#room-pins').addEventListener('change',event=>$('#room-layer')?.setAttribute('display',event.target.checked?'inline':'none'));
const zoom = factor => setView(zoomView(view,factor,[view[0]+view[2]/2,view[1]+view[3]/2]));
$('#zoom-in').addEventListener('click',()=>zoom(.75));
$('#zoom-out').addEventListener('click',()=>zoom(1/.75));
$('#reset').addEventListener('click',()=>{setView([...HOME]);$('#status').textContent='';});
$('#native').addEventListener('click',()=>{
  const bounds=map.getBoundingClientRect();
  setView(nativeView(view,[bounds.width,bounds.height],basemap.width/basemap.mapWidth));
  $('#status').textContent='1:1 detail · one original image pixel per CSS pixel';
});
map.addEventListener('wheel',event=>{
  event.preventDefault();
  if(!ready) return;
  const point = new DOMPoint(event.clientX,event.clientY).matrixTransform(map.getScreenCTM().inverse());
  setView(zoomView(view,Math.exp(Math.max(-1,Math.min(1,event.deltaY*.002))),[point.x,point.y]));
},{passive:false});
map.addEventListener('keydown',event=>{
  if(event.target!==map) return;
  const keys=['+','=','-','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'];
  if(!keys.includes(event.key)) return;
  event.preventDefault();
  if(event.key==='+'||event.key==='=') zoom(.75);
  else if(event.key==='-') zoom(1/.75);
  else if(event.key==='Home') setView([...HOME]);
  else {
    const next=[...view], step=view[2]*.08;
    if(event.key==='ArrowLeft') next[0]-=step;
    if(event.key==='ArrowRight') next[0]+=step;
    if(event.key==='ArrowUp') next[1]-=step;
    if(event.key==='ArrowDown') next[1]+=step;
    setView(next);
  }
});
const pointers = new Map();
let gesture;
function beginGesture() {
  const points=[...pointers.values()];
  if(!points.length){gesture=null;map.classList.remove('dragging');return;}
  const middle=points.length>1?[(points[0][0]+points[1][0])/2,(points[0][1]+points[1][1])/2]:points[0];
  gesture={view:[...view],inverse:map.getScreenCTM().inverse(),middle,distance:points.length>1?Math.hypot(points[1][0]-points[0][0],points[1][1]-points[0][1]):0};
  map.classList.add('dragging');
}
map.addEventListener('pointerdown',event=>{
  if(!ready||event.button!==0||event.target.closest('.room-marker,.landmark-marker,.detail-marker')) return;
  pointers.set(event.pointerId,[event.clientX,event.clientY]);
  map.setPointerCapture(event.pointerId);
  beginGesture();
});
map.addEventListener('pointermove',event=>{
  if(!pointers.has(event.pointerId)||!gesture) return;
  pointers.set(event.pointerId,[event.clientX,event.clientY]);
  const points=[...pointers.values()];
  const middle=points.length>1?[(points[0][0]+points[1][0])/2,(points[0][1]+points[1][1])/2]:points[0];
  const start=new DOMPoint(...gesture.middle).matrixTransform(gesture.inverse);
  const end=new DOMPoint(...middle).matrixTransform(gesture.inverse);
  let next=[...gesture.view];
  if(points.length>1&&gesture.distance){
    const distance=Math.hypot(points[1][0]-points[0][0],points[1][1]-points[0][1]);
    if(distance>0) next=zoomView(next,gesture.distance/distance,[start.x,start.y]);
  }
  const ratio=next[2]/gesture.view[2];
  next[0]-=(end.x-start.x)*ratio; next[1]-=(end.y-start.y)*ratio;
  setView(next);
});
for(const type of ['pointerup','pointercancel','lostpointercapture']) map.addEventListener(type,event=>{if(pointers.delete(event.pointerId)) beginGesture();});

$('#export').addEventListener('click',async()=>{
  $('#export').disabled=true;
  try {
  const clone=map.cloneNode(true);
  clone.setAttribute('viewBox',HOME.join(' '));clone.setAttribute('width',HOME[2]);clone.setAttribute('height',HOME[3]);
  clone.querySelectorAll('[data-anchor]').forEach(marker=>{const [x,y]=marker.dataset.anchor.split(',');marker.setAttribute('transform',`translate(${x} ${y})`);marker.style.opacity='1';marker.classList.remove('selected');});
  const imageData=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(basemapBlob);});
  clone.querySelector('#terrain-reference').setAttribute('href',imageData);
  const title=svgNode('title');title.textContent='Ronograd Field Atlas · original Wiki imagery with vector markers · Wiki research 2026-11-02';clone.prepend(title);
  const metadata=svgNode('metadata');metadata.textContent=JSON.stringify({checked:'2026-11-02',precision:'Original raster pixels preserved; compound anchors approximate. Door/key projections only as supported by the linked Wiki diagrams.',sources:[basemap.source,`${wiki}Map:Operation_Phoenix_-_Ronograd_Island`,...rooms.map(room=>room.sources[0])],credit:'Gravity_Defier, AGuyNamedMinh and BRM5 Wiki contributors; original imagery with vector overlay',license:'https://creativecommons.org/licenses/by-sa/3.0/'});clone.append(metadata);
  const credit=svgNode('text',{x:10,y:1526,fill:'#b4c1ba','font-size':10});credit.textContent='BRM5 Wiki / Gravity_Defier · Original imagery + vector markers · CC BY-SA 3.0 · Approximate area pins';clone.append(credit);
  const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)],{type:'image/svg+xml;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download='ronograd-field-atlas.svg';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  } catch(error) {
    $('#status').textContent='Map export failed. Please try again.';
    console.error(error);
  } finally {$('#export').disabled=false;}
});

async function load() {
  try {
    const responses=await Promise.all([fetch('./rooms.json'),fetch(`./${basemap.file}`)]);
    if(responses.some(response=>!response.ok)) throw new Error('Map files could not be loaded.');
    rooms=await responses[0].json();
    basemapBlob=await responses[1].blob();
    const style=svgNode('style');style.textContent=mapStyle;map.append(style);
    map.append(svgNode('rect',{width:basemap.mapWidth,height:basemap.mapWidth*basemap.height/basemap.width,fill:'#101e26'}));
    const image=svgNode('image',{id:'terrain-reference',href:URL.createObjectURL(basemapBlob),x:0,y:0,width:basemap.mapWidth,height:basemap.mapWidth*basemap.height/basemap.width,preserveAspectRatio:'xMinYMin meet'});
    const imageReady=new Promise((resolve,reject)=>{image.addEventListener('load',resolve,{once:true});image.addEventListener('error',()=>reject(new Error('Original map image could not be decoded.')),{once:true});});
    map.append(image);
    await imageReady;
    drawMarkers();roomList();
    $('#guide-links').innerHTML=[`${wiki}Locked_Room`,...rooms.map(room=>room.sources[0]),...Object.values(diagrams).map(diagram=>diagram.source),...Object.values(roomPhotos).map(photo=>photo.source),`${wiki}Items_(Ronograd)`,`${wiki}Map:Operation_Phoenix_-_Ronograd_Island`,`${wiki}File:Ronograd_Island_map.png`].map(sourceLink).join('');
    ready=true;$('#export').disabled=false;$('#status').textContent='';
  } catch(error) {
    $('#status').textContent='Could not load map data. Reload the page or serve this folder over HTTP.';
    $('#room-list').textContent='Field notes unavailable. Please reload.';
    console.error(error);
  }
}
load();
new ResizeObserver(()=>{if(ready) setView(view);}).observe($('#map-area'));

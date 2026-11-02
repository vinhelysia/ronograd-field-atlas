export const basemap = {
  file: 'assets/ronograd.png', width: 7187, height: 7382, mapWidth: 1460,
  source: 'https://static.wikia.nocookie.net/roblox-blackhawk-rescue-mission-5/images/1/19/Rono16k10mb.png/revision/latest?cb=20250124002707&format=original'
};
export const diagrams = {
  kozlovka: {
    file: 'assets/kozlovka-key-spawns.png',
    source: 'https://roblox-blackhawk-rescue-mission-5.fandom.com/wiki/File:Kozlovka_Key_Spawn_Locations.png',
    caption: 'Wiki diagram, Release 9.8.5: six key possibilities and the locked room. Three key descriptions share one building callout across floors 1 and 4; this is not an indoor survey.',
    points: [
      {position:[188.625,1171.808],label:'K1',floor:'F1',spawns:[0],offset:[0,-17]},
      {position:[132.658,1218.430],label:'K2–4',floor:'F1 / F4',spawns:[1,2,3],offset:[31,19]},
      {position:[156.325,1219.953],label:'K5',floor:'F3',spawns:[4],offset:[25,25]},
      {position:[154.293,1218.125],label:'K6',floor:'F3',spawns:[5],offset:[25,-20]},
      {position:[126.970,1215.179],label:'ROOM',floor:'F4',spawns:[],offset:[-35,-21]}
    ]
  },
  quarry: {
    file: 'assets/quarry-key-spawns.png',
    source: 'https://roblox-blackhawk-rescue-mission-5.fandom.com/wiki/File:QuarryKeySpawnLocations.png',
    caption: 'Wiki diagram: both keys are underground. Red boxes are approximate surface projections; the inset photos identify the actual table and chair. The door has no mapped coordinate.',
    points: [
      {position:[661.277,942.940],label:'K1',floor:'UNDERGROUND',spawns:[0],offset:[-25,22]},
      {position:[679.070,914.975],label:'K2',floor:'UNDERGROUND',spawns:[1],offset:[25,-17]}
    ]
  }
};
export const roomPhotos = {
  naval:{file:'assets/naval-door.jpg',source:'https://roblox-blackhawk-rescue-mission-5.fandom.com/wiki/File:NavalBaseLockedRoom.jpg'},
  ronograd:{file:'assets/ronograd-door.jpg',source:'https://roblox-blackhawk-rescue-mission-5.fandom.com/wiki/File:RonogradCityLockedRoom.jpg'},
  sochraina:{file:'assets/sochraina-door.jpg',source:'https://roblox-blackhawk-rescue-mission-5.fandom.com/wiki/File:SochrainaLockedRoom.jpg'}
};
// shortcut: area anchors remain approximate; use the linked source diagrams for floor-specific key callouts.
export const anchors = {
  kozlovka: [126.970, 1215.179], naval: [1260, 875], quarry: [696, 943],
  ronograd: [1030, 747], sochraina: [640, 1128]
};
export const landmarks = [
  {name:'Forward Operating Base',x:265,y:782,type:'friendly'},
  {name:'Department of Utilities',x:730,y:324},
  {name:'Mountain Radar Station',x:548,y:190},
  {name:'Fort Ronograd',x:1355,y:535,type:'empty'},
  {name:'Lesdolina',x:722,y:700},
  {name:'Pushkino',x:418,y:1265},
  {name:'Depot',x:81,y:1390},
  {name:'Bunker',x:812,y:68}
];

// Replace PNGs under assets/ without modifying this file. One image per action.
const AVATARS = ['avatar-1', 'avatar-2', 'avatar-3', 'avatar-4', 'avatar-5'];
const AVATAR_NAMES = {
  'avatar-1': 'Irza',
  'avatar-2': 'Labiba',
  'avatar-3': 'Rabi',
  'avatar-4': 'Gul',
  'avatar-5': 'Latif'
};
const ACTIONS = { punch: 'hit-punch', kick: 'hit-kick', slap: 'hit-slap' };
// Replace these silent placeholders with your own ouch/oof clips:
// assets/sfx/punch.mp3  assets/sfx/kick.mp3  assets/sfx/slap.mp3
const HIT_MS = 510;
let selected = null;
let sceneRef = null;
let busy = false;
let returnTimer = null;
let hitCount = 0;
const $ = id => document.getElementById(id);
function say(message) { $('status').textContent = message; }
function showSelection() {
  if (returnTimer) { returnTimer.remove(false); returnTimer = null; }
  busy = false;
  selected = null;
  $('selection').hidden = false;
  $('hud').hidden = true;
  $('instructions').hidden = true;
  $('touch-controls').hidden = true;
  if (sceneRef) sceneRef.resetFighters();
  say('Choose your avatar to begin.');
}
function selectAvatar(name) {
  if (!AVATARS.includes(name) || !sceneRef) return;
  selected = name;
  busy = false;
  hitCount = 0;
  $('hit-counter').textContent = 'HITS 000';
  sceneRef.resetFighters();
  $('selection').hidden = true;
  $('hud').hidden = false;
  $('instructions').hidden = false;
  $('touch-controls').hidden = false;
  if (sceneRef.sound.locked) sceneRef.sound.unlock();
  say(`${AVATAR_NAMES[name] || name} ready! Press A to punch, W to kick, D to slap.`);
}
function attack(action) {
  if (!selected || !sceneRef || busy || !Object.prototype.hasOwnProperty.call(ACTIONS,action)) return;
  busy = true;
  const scene = sceneRef;
  const attacker = scene.attacker;
  const target = scene.target;
  attacker.setTexture(`${selected}-${action}`);
  target.setTexture(`target-${ACTIONS[action]}`);
  scene.layoutFighters();
  if (scene.cache.audio.exists(`sfx-${action}`)) {
    scene.sound.play(`sfx-${action}`, { volume: 1 });
  }
  scene.cameras.main.shake(95, .0025);
  scene.tweens.add({targets:target,x:target.x+Math.max(8,scene.scale.width*.018),duration:90,yoyo:true,ease:'Quad.easeOut'});
  hitCount++;
  $('hit-counter').textContent = `HITS ${String(hitCount).padStart(3,'0')}`;
  say(`${action.toUpperCase()}! ${hitCount} hits.`);
  returnTimer = scene.time.delayedCall(HIT_MS, () => {
    returnTimer = null;
    if (selected) { scene.resetFighters(); }
    busy = false;
  });
}
class FightScene extends Phaser.Scene {
  constructor(){ super('FightScene'); }
  preload(){
    this.load.image('street','assets/background/street.png');
    for (const avatar of AVATARS) {
      for (const action of ['idle','punch','kick','slap']) {
        this.load.image(`${avatar}-${action}`,`assets/avatars/${avatar}/${action}.png`);
      }
    }
    for (const name of ['idle','hit-punch','hit-kick','hit-slap']) {
      this.load.image(`target-${name}`,`assets/target/${name}.png`);
    }
    for (const action of Object.keys(ACTIONS)) {
      this.load.audio(`sfx-${action}`, `assets/sfx/${action}.mp3`);
    }
  }
  create(){
    sceneRef = this;
    this.background = this.add.image(0,0,'street').setOrigin(.5,.5);
    this.attacker = this.add.image(0,0,'avatar-1-idle').setOrigin(.5,1).setVisible(false);
    this.target = this.add.image(0,0,'target-idle').setOrigin(.5,1).setVisible(false);
    this.scale.on('resize',this.layoutFighters,this);
    this.layoutFighters();
    this.input.keyboard.on('keydown',event => {
      if(event.repeat) return;
      const action = {KeyA:'punch',KeyW:'kick',KeyD:'slap'}[event.code];
      if(action){event.preventDefault();attack(action);}
    });
  }
  resetFighters(){
    this.attacker.setVisible(Boolean(selected));
    this.target.setVisible(Boolean(selected));
    this.attacker.setTexture(`${selected || 'avatar-1'}-idle`);
    this.target.setTexture('target-idle');
    this.layoutFighters();
  }
  layoutFighters(){
    if(!this.background || !this.attacker || !this.target) return;
    const w=this.scale.width,h=this.scale.height;
    // Background fills the viewport, cropping edges instead of showing letterbox bars.
    const tex=this.textures.get('street').getSourceImage();
    const factor=Math.max(w/tex.width,h/tex.height);
    this.background.setPosition(w/2,h/2).setDisplaySize(tex.width*factor,tex.height*factor);
    // The stage / sidewalk is at the lower part of the background artwork.
    const size=Math.min(h*.65,w*.41);
    const baseY=h*.84;
    this.attacker.setPosition(w*.35,baseY).setDisplaySize(size,size);
    this.target.setPosition(w*.67,baseY).setDisplaySize(size,size);
  }
}
const game=new Phaser.Game({
  type:Phaser.AUTO,parent:'game',backgroundColor:'#101726',pixelArt:true,
  render:{antialias:false},
  scale:{mode:Phaser.Scale.RESIZE,width:window.innerWidth,height:window.innerHeight},
  scene:[FightScene]
});
document.querySelectorAll('[data-avatar]').forEach(button=>button.addEventListener('click',()=>selectAvatar(button.dataset.avatar)));
document.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>attack(button.dataset.action)));
$('change-avatar').addEventListener('click',showSelection);

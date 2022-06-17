const W = 512*8;
const H = 512*8;
a.width = W;
a.height = H;

function getRandomInt(dimension, minimalValue = 0) {
  return minimalValue + parseInt(fxrand() * dimension, 10);
}

// init parameter
const elements = getRandomInt(1000, 150);
const border = getRandomInt(200, 100);
const rotation = getRandomInt(12);
const lineWidth = 1 + fxrand();
const MUL = 1 + fxrand();
const ADDMAX = getRandomInt(64);
const colors = ['#FAF038', '#DA0003', '#1101F8', '#F9F9F9', '#33333C'];

// expose settings to fxhash
window.$fxhashFeatures = {
   "Elements": elements,
   "Border": border,
   "Rotation": rotation,
   "Line Width": lineWidth,
   "Noise": ADDMAX,
   "Multiply": MUL,
}
console.table(window.$fxhashFeatures);
console.log(fxhash);

// some helper functions
function drawElement() {
  context.save();
  const shadowSize = getRandomInt(12, 1) * 2;
  context.rotate((fxrand()-0.5) * rotation * Math.PI / 180);
  context.shadowOffsetX = shadowSize;
  context.shadowOffsetY = shadowSize;
  context.shadowBlur = shadowSize;

  const color = getRandomInt(colors.length);
  const color2 = getRandomInt(colors.length);
  context.shadowColor = 'black';//colors[color];

  const x = border + getRandomInt(W - border*2);
  const y = border + getRandomInt(H - border*2);
  const w = getRandomInt(W-x-border*2);
  const h = getRandomInt(H-y-border*2);

  const gradient = context.createLinearGradient(x, y, x+w, y+h);
  gradient.addColorStop(0, colors[color]);
  gradient.addColorStop(1, fxrand() > 0.5 ? colors[color] : colors[color2]);

  const filled = fxrand() > 0.95;
  if (filled) {
    context.fillStyle = gradient;
    context.fillRect(x, y, w, h);
  } else {
    context.strokeStyle = gradient;
    context.lineWidth = shadowSize * lineWidth;
    context.strokeRect(x, y, w, h);
  }

  context.restore();
}


// start drawing
const canvas = a;
context = canvas.getContext("2d");
context.fillStyle = '#000000';
context.fillRect(0, 0, W, H);

// "Main"
const initialAlpha = 0.3;
const endAlpha = 0.75;
const alphaDelta = (endAlpha-initialAlpha) / elements;
let alpha = initialAlpha;
for (let i=0; i<elements; i++) {
  context.globalAlpha = alpha;
  drawElement();
  alpha += alphaDelta;
}

fxpreview();

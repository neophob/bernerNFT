const W = 512*8;
const H = 512*8;
a.width = W;
a.height = H;

function getRandomInt(dimension, minimalValue = 0) {
  return minimalValue + parseInt(fxrand() * dimension, 10);
}

// init parameter
const elements = getRandomInt(300, 75);
const maximalRadius = getRandomInt(200, 400);
const border = getRandomInt(400, 400);
const lineWidth = 1 + fxrand()*4;
const MUL = 1 + fxrand();
const ADDMAX = getRandomInt(64);
const pal = [
  ['#fe4a49', '#2ab7ca', '#fed766', '#e6e6ea', '#f4f4f8'],
  ['#fe4a49', '#feb2a8', '#fec8c1', '#fad9c1', '#f9caa7'],
  ['#ee4035', '#f37736', '#fdf498', '#7bc043', '#0392cf'],
  ['#333333', '#666666', '#999999', '#cccccc', '#ffffff'],
];
const palIdx = getRandomInt(pal.length);
const colors = pal[palIdx];


// expose settings to fxhash
window.$fxhashFeatures = {
   "Elements": elements,
   "Border": border,
   "MaximalRadius": maximalRadius,
   "Line Width": lineWidth,
   "Noise": ADDMAX,
   "Multiply": MUL,
   "Palette": palIdx,
}
console.table(window.$fxhashFeatures);

function min4(a, b, c, d) {
  if (a < 0) a=99999;
  if (b < 0) b=99999;
  if (c < 0) c=99999;
  if (d < 0) d=99999;
  const r1 = Math.min(
    Math.min(a, b),
    Math.min(c, d)
  );
  if (r1 > 500) return 500;
  // introduce "border violations", maximal 10% - it looks less strict
  return r1+r1*1.1*fxrand();
}

// some helper functions
function drawElement() {
  const shadowSize = getRandomInt(12, 1) * 2;
  context.shadowOffsetX = shadowSize;
  context.shadowOffsetY = shadowSize;
  context.shadowBlur = shadowSize;

  const color = getRandomInt(colors.length);
  const color2 = getRandomInt(colors.length);
  context.shadowColor = 'black';

  const x = border + getRandomInt(W - border*2);
  const y = border + getRandomInt(H - border*2);
  const radius = getRandomInt(
    min4(x-border, y-border, H-border-y, W-border-x)
  );

  const filled = fxrand() > 0.95;
  context.beginPath();
  if (filled) {
    context.fillStyle = colors[color];
    context.arc(x, y, radius, 0, Math.PI*2);
    context.fill();
  } else {
    const gradient = context.createConicGradient(0, x, y);
    gradient.addColorStop(0, colors[color]);
    gradient.addColorStop(0.5, colors[color2]);
    gradient.addColorStop(1, colors[color]);

    context.strokeStyle = gradient;
    context.lineWidth = shadowSize * lineWidth;
    context.arc(x, y, radius, 0, Math.PI*2);
    context.stroke();
  }
}

function edgy() {
  const myImageData = context.getImageData(0,0, W, H);
  const pixels = myImageData.data;

  for (let i = 0; i < pixels.length/1; i += 8) {
    const lightnessPre = parseInt(pixels[i-4]*.299 + pixels[i-3]*.587 + pixels[i-2]*.114);
    const lightness = parseInt(pixels[i]*.299 + pixels[i + 1]*.587 + pixels[i + 2]*.114);
    if (lightness > lightnessPre) {
      pixels[i  ] = pixels[i  ] * MUL < 256 ? pixels[i  ] * MUL : 255;
      pixels[i+1] = pixels[i+1] * MUL < 256 ? pixels[i+1] * MUL : 255;
      pixels[i+2] = pixels[i+2] * MUL < 256 ? pixels[i+2] * MUL : 255;
    } else {
      const ADD = getRandomInt(ADDMAX);
      pixels[i  ] = pixels[i  ] + ADD < 256 ? pixels[i  ] + ADD : 255;
      pixels[i+1] = pixels[i+1] + ADD < 256 ? pixels[i+1] + ADD : 255;
      pixels[i+2] = pixels[i+2] + ADD < 256 ? pixels[i+2] + ADD : 255;
    }
  }

  context.putImageData(myImageData, 0, 0);
}

// start drawing
const canvas = a;
context = canvas.getContext("2d");
context.fillStyle = '#000000';
context.fillRect(0, 0, W, H);

// "Main"
context.beginPath();
context.globalAlpha = 0.3;
context.fillStyle = colors[getRandomInt(colors.length)];
const r = (W-border)/2;
context.arc(W/2, H/2, r+r*fxrand()/10, 0, Math.PI*2);
context.fill();

const initialAlpha = 0.3;
const endAlpha = 0.75;
const alphaDelta = (endAlpha-initialAlpha) / elements;
let alpha = initialAlpha;
for (let i=0; i<elements; i++) {
  context.globalAlpha = alpha;
  drawElement();
  alpha += alphaDelta;
}
//edgy();

context.globalAlpha = 1;
context.shadowOffsetX = 0;
context.shadowOffsetY = 0;
context.shadowBlur = 0;

for (let i=0; i<colors.length; i++) {
  context.beginPath();
  context.fillStyle = colors[i];
  context.arc(W - 256 + 128,  H - (colors.length + 0) * 128 + i * 128, 32, 0, Math.PI*2);
  context.fill();
}

fxpreview();

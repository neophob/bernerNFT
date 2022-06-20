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
const pal = [
  ['#fe4a49', '#2ab7ca', '#fed766', '#e6e6ea', '#f4f4f8'],
  ['#fe4a49', '#feb2a8', '#fec8c1', '#fad9c1', '#f9caa7'],
  ['#ee4035', '#f37736', '#fdf498', '#7bc043', '#0392cf'],
];
const palIdx = getRandomInt(pal.length);
const colors = pal[palIdx];


// expose settings to fxhash
window.$fxhashFeatures = {
   "Elements": elements,
   "Border": border,
   "Rotation": rotation,
   "Line Width": lineWidth,
   "Noise": ADDMAX,
   "Multiply": MUL,
   "Palette": palIdx,
}
console.table(window.$fxhashFeatures);

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

  const filled = fxrand() > 0.95;
  const x = border + getRandomInt(W - border*2);
  const y = border + getRandomInt(H - border*2);
  const w = getRandomInt(W-x-border*2);
  const h = getRandomInt(H-y-border*2);

  const gradient = context.createLinearGradient(x, y, x+w, y+h);
  gradient.addColorStop(0, colors[color]);
  gradient.addColorStop(1, fxrand() > 0.5 ? colors[color] : colors[color2]);


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
const initialAlpha = 0.3;
const endAlpha = 0.75;
const alphaDelta = (endAlpha-initialAlpha) / elements;
let alpha = initialAlpha;
for (let i=0; i<elements; i++) {
  context.globalAlpha = alpha;
  drawElement();
  alpha += alphaDelta;
}
edgy();
fxpreview();

const W = 512*8;
const H = 512*8;
a.width = W;
a.height = H;

function getRandomInt(dimension, minimalValue = 0) {
  return minimalValue + parseInt(fxrand() * dimension, 10);
}

const elements = getRandomInt(1000, 150);
const border = getRandomInt(200, 100);
const rotation = getRandomInt(12);
const lineWidth = 1 + fxrand();
const MUL = 1 + fxrand();
const ADDMAX = getRandomInt(64);

window.$fxhashFeatures = {
   "Elements": elements,
   "Border": border,
   "Rotation": rotation,
   "Line Width": lineWidth,
   "Noise": ADDMAX,
   "Multiply": MUL,
}
console.table(window.$fxhashFeatures);

const canvas = a;
context = canvas.getContext("2d");
context.fillStyle = '#0000ff';
context.fillRect(0, 0, W, H);

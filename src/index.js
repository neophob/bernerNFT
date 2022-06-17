const W = 512*8;
const H = 512*8;
a.width = W;
a.height = H;

// expose data to fxhash
window.$fxhashFeatures = {
   "Foo": "Bar",
}
console.table(window.$fxhashFeatures);

const canvas = a;
context = canvas.getContext("2d");
context.fillStyle = '#0000ff';
context.fillRect(0, 0, W, H);

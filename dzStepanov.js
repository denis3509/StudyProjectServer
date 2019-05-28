const x = [3.2, 3.4, 3.6, 3.8, 4.0, 4.2, 4.4, 4.6, 4.8, 5.0];
const r = [1, 5, 4, 18, 86, 62, 14, 6, 2, 2];

let n = 0;
r.forEach((ri) => {
  n = n + ri;
});
console.log("n: ", n);
let xSr = 0;

for (let i = 0; i < 10; i++) {
  xSr = xSr + x[i] * r[i];
}
xSr = xSr / n;
console.log('xSr: ', xSr);
let delta = 0;
let sum = 0;

for (let i = 0; i < 10; i++) {
  sum = sum + (xSr - x[i]) * (xSr - x[i])*r[i];
}
delta = Math.sqrt(1 / (n - 1) * sum );
console.log('delta: ', delta);
let h = 0.2;
const u = [];
for (let i = 0; i < 10; i++) {
  u[i] = (x[i] - xSr) / delta;
}
console.log("u(i): ", u);
let fi = [];
for (let i = 0; i < 10; i++) {
  fi[i] = (Math.exp(-u[i] * u[i] / 2)) / (Math.sqrt(2 * Math.PI));
}
console.log("fi: ", fi)
let rsh = [];
for (let i = 0; i < 10; i++) {
  rsh[i] = n * h / delta * fi[i];
}
console.log('rsh: ', rsh);
const rr = [];

for (let i=0;i<10;i++){
  rr[i]=(r[i]-rsh[i])*(r[i]-rsh[i])/rsh[i];
}
console.log('rr:', rr);
let sumRr =0 ;
for (let i=0;i<10;i++) {
  sumRr += rr[i];
}
console.log("sum rr: ", sumRr);

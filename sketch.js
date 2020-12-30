//specify cell size, padding, spacing, rows, and columns
//or specify width, height, padding, rows, columns, cell size
//width & height vs spacing
var cellSize = 60;
var width = 300;
var height = 200;
var padding = 50;
var spacing = 40;
var rows = 10;
var columns = 5;
var sizeDif = 20;
var primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
var colors = {};
var largestPrime;
var oneColor;
var gp;
var gradient = []
function setup() {
  gp = new Grapick({el: '#gp', width: '100px'});
  gp.addHandler(0, '#E5FFFF');
  gp.addHandler(25, '#3E86E5')
  gp.addHandler(100, '#2D00A8');

  var myCanvas = createCanvas(0,  0);
  myCanvas.parent("frame");
  background(0)
}

function renderWithSpacing (){
  cellSize = parseInt(document.getElementById('cellSize').value);
  padding = parseInt(document.getElementById('padding').value);
  spacing = parseInt(document.getElementById('spacing').value);
  rows = parseInt(document.getElementById('rows').value);
  columns = parseInt(document.getElementById('cols').value);
  sizeDif = parseInt(document.getElementById("dif").value);
  oneColor = color(document.getElementById("one").value);
  let largeColor = color(0);//color(document.getElementById("bigPrime").value);
  
  width = 2 * padding + columns * cellSize + (columns - 1) * spacing;
  height = 2 * padding + rows * cellSize + (rows - 1) * spacing;

  document.getElementById("downloadButton").style.visibility = "visible";
  document.getElementById("downloadButton").innerHTML = "Download as png ("+width + "x" + height +")";
  generateGradient(gp.getColorValue());
  generatePrimes();
  largestPrime = primes[primes.length-1];
  colors = {};

  resizeCanvas(width, height);
  background(color(document.getElementById("bg").value));
  noStroke();
  for(var r = 0; r < rows; r ++){
    for(var c = 0; c < columns; c ++){
      let num = 1 + c + columns * r;
      let addWidth = -sizeDif;
      if(isPrime(num)){
        addWidth = sizeDif;
        let newColor;
        if(num <= largestPrime){
          newColor = lerpColors(num / largestPrime);
          colors[num] = newColor;
        }else{
          //sort of unused because all primes are within this range - could change largest prime to be the largest prime which shows up as a factor
          newColor = largeColor;
        }  
        fill(newColor);
      }else{
        if(num == 1){
          fill(oneColor);
        }else{
          fill(colors[maxPrime(num)]);
        }
      }
      circle(padding + cellSize/2 + c * (cellSize + spacing), padding + cellSize/2 + r * (cellSize + spacing), cellSize + addWidth);
    }
  }
  
}

const primeTest = n => {
  for(let i = 2, s = Math.sqrt(n); i <= s; i++)
      if(n % i === 0) return false; 
  return n > 1;
}

function isPrime(n) {
  return primes.includes(n);
}

function generatePrimes(){
  primes = [];
  for(var i = 1; i <= rows * columns; i ++){
    if(primeTest(i)){
      primes.push(i);
    }
  }
}

function maxPrime(n) {
  var max = 0;
  for (var i = 0; i < primes.length && primes[i] < n; i++) {
    if (n % primes[i] == 0) {
      max = primes[i];
    }
  }
  return max;
}

function lerpColors(t) {
  let c1, c2, t1, t2;
  let i = 0;
  while(t > gradient[i][1]){
    c1 = color(gradient[i][0]);
    t1 = gradient[i][1];
    i++;
  }
  c2 = color(gradient[i][0]);
  t2 = gradient[i][1];
  return lerpColor(c1, c2, (t - t1)/(t2 - t1));
}

function largestShownPrime(){
  for (var i = 0; i < primes.length; i++){
    if(primes[i] > rows * columns){
      return (primes[i-1]);
    }
  }
}

function generateGradient(s){
  gradient = [];
  let pairs = s.substring(0, s.length-1).split("%,");
  for(let x of pairs){
    x = x.trim();
    var i = x.lastIndexOf(" ");
    gradient.push([x.substring(0, i), parseInt(x.substring(i+1))/100.0]);
  }
}
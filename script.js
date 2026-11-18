const simCanvas = document.getElementById('simCanvas');
const ctxSim = simCanvas.getContext('2d');
const speedTxt = document.getElementById('speedTxt');
const speedTxtkm = document.getElementById('speedTxtkm');
const distanceTxt = document.getElementById('distanceTxt');
const timeTxt = document.getElementById('timeTxt');
const surlodasRange = document.getElementById('surlodasRange');
const surlodasVal = document.getElementById('surlodasVal');
const T = 60;

const autoKep = new Image(); autoKep.src = 'auto.png';
const hatterKep = new Image(); hatterKep.src = 'hatter.png';

let v = 0; let a = 0; let ut = 0; let ido = 0; let hatterX = 0; let surlodas = 0.001;
let gazNyomva = false; let fekNyomva = false;
let szimulacioInditva = false; 

let sebessegTortenet = [];
let utTortenet = [];


const vChart = new Chart(document.getElementById('vGraphCanvas'), {
    type: 'line',
    data: { datasets: [{ label: 'Sebesség (m/s)', data: sebessegTortenet, borderColor: 'blue', borderWidth: 2, pointRadius: 0 }] },
    options: {
        responsive: false, animation: false,
        scales: { 
            x: { type: 'linear', min: 0, max: T, title: { display: true, text: 'Idő (s)' } },
            y: { beginAtZero: true } 
        }
    }
});

const sChart = new Chart(document.getElementById('sGraphCanvas'), {
    type: 'line',
    data: { datasets: [{ label: 'Megtett út (m)', data: utTortenet, borderColor: 'orange', borderWidth: 2, pointRadius: 0 }] },
    options: {
        responsive: false, animation: false,
        scales: { 
            x: { type: 'linear', min: 0, max: T, title: { display: true, text: 'Idő (s)' } },
            y: { beginAtZero: true } 
        }
    }
});

surlodasRange.addEventListener('input', (e) => { surlodas = parseFloat(e.target.value); surlodasVal.innerText = surlodas; });
document.getElementById('gazGomb').addEventListener('mousedown', () => { gazNyomva = true; szimulacioInditva = true; }); 
window.addEventListener('mouseup', () => { gazNyomva = false; fekNyomva = false; });
document.getElementById('fekGomb').addEventListener('mousedown', () => fekNyomva = true);

document.getElementById('resetGomb').addEventListener('click', () => {
    v = 0; a = 0; ut = 0; ido = 0; hatterX = 0; szimulacioInditva = false;
    sebessegTortenet.length = 0; utTortenet.length = 0;
    vChart.update(); sChart.update();
});

function frissites() {
    if (gazNyomva) a = 0.01;
    else if (fekNyomva) a = -0.01;
    else { if (v > 0) a = -surlodas; else a = 0; }
    
    v += a;
    if (v < 0) { v = 0; a = 0; }
    if (v > 100) v = 100; 

    ut += v * (1/6); 
    
    
    if (szimulacioInditva && ido < T) {
        ido += 1/60;
    }

    hatterX -= v * 5; 
    if (hatterX <= -simCanvas.width) hatterX = 0;

    
    if (szimulacioInditva && ido <= T) {
        if (Math.floor(ido * 60) % 6 === 0) {
            sebessegTortenet.push({ x: ido, y: parseFloat((v * 10).toFixed(1)) });
            utTortenet.push({ x: ido, y: parseFloat(ut.toFixed(1)) });
            vChart.update();
            sChart.update();
        }
    }

    speedTxt.innerText = (v * 10).toFixed(1);
    speedTxtkm.innerText = (v * 36).toFixed(1);

    distanceTxt.innerText = ut.toFixed(1);
    timeTxt.innerText = ido.toFixed(1);

    ctxSim.clearRect(0, 0, simCanvas.width, simCanvas.height);
    if (hatterKep.complete) {
        ctxSim.drawImage(hatterKep, hatterX, 0, simCanvas.width, simCanvas.height);
        ctxSim.drawImage(hatterKep, hatterX + simCanvas.width, 0, simCanvas.width, simCanvas.height);
    }
    if (autoKep.complete) {
        ctxSim.drawImage(autoKep, 50, 120, 80, 45);
    } else {
        ctxSim.fillStyle = "red"; ctxSim.fillRect(50, 130, 60, 30);
    }

    requestAnimationFrame(frissites);
}

frissites();

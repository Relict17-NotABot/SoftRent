const colores = [
    "#ff0000",
    "#8e4781",
    "#ff6b6b",
    "#c0392b",
    "#9b59b6"
];

function colorRandom() {
    return colores[Math.floor(Math.random() * colores.length)];
}

function lines() {
    let sizek = Math.random() * 22;
    let duration = Math.random() * 5;
    let color = colorRandom();

    let e = document.createElement("div");
    e.setAttribute("class", "circle");
    document.body.appendChild(e);

    e.style.width = 12 + sizek + "px";
    e.style.left = Math.random() * document.documentElement.scrollWidth + "px";
    e.style.animationDuration = 2 + duration + "s";
    e.style.backgroundColor = color;
    e.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}, 0 0 40px ${color}, 0 0 80px ${color}`;

    setTimeout(function () { document.body.removeChild(e); }, 7000);
    e.style.setProperty("--circle-color", color);
}

setInterval(function () { lines(); }, 200);
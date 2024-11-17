const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const options = {
    blocksX: 5,
    blocksY: 5,
    size: 100,
    border: 50,
    backgroundColor: '#ffffff',
    colors: ['#ffffff']
};
let generations = 0;

document.addEventListener('DOMContentLoaded', init);

function init() {
    addRandomColor();
    addRandomColor();
    setInputs();
    document.querySelector('form').addEventListener('submit', genGrid);
    document.querySelector('form').addEventListener('input', handleInput);
    document.querySelector('#save').addEventListener('click', saveImg);
    document.querySelector('#addColor').addEventListener('click', addColor);
    document.querySelector('#addRandomColor').addEventListener('click', addNewRandomColor);
    genGrid();
}

function addNewRandomColor() {
    addRandomColor();
    printColors();
}

function addRandomColor() {
    const randomHex = () => Math.floor(Math.random() * 220).toString(16).padStart(2, '0');
    options.colors.push(`#${randomHex()}${randomHex()}${randomHex()}`);
}

function addColor() {
    const color = document.querySelector('#newColor').value;
    if (options.colors.includes(color)) { return; }
    options.colors.push(color);
    printColors();
}

function deleteColor(e) {
    const color = e.target.closest('li').id.split('-')[1];
    options.colors = options.colors.filter(c => c.slice(1) != color);
    printColors();
}

function handleInput(e) {
    if (options[e.target.id] == undefined) { return; }
    if (e.target.id == 'backgroundColor') {
        options[e.target.id] = e.target.value;
    } else {
        options[e.target.id] = Number(e.target.value);
    }
    genGrid();
}

function setInputs() {
    for (const key in options) {
        if (key != 'colors') {
            document.querySelector(`#${key}`).value = options[key];
        }
    }
    printColors();
}

function printColors() {
    document.querySelector('#colors').innerHTML = options.colors.map(color => `
  <li id="c-${color.slice(1)}">
    <span class="color" style="background-color:${color}"></span>
    <input type="button" value="x" class="delete">
  </li>
    `).join('');
    document.querySelectorAll('#colors .delete').forEach(d => d.addEventListener('click', deleteColor));
}

function saveImg() {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'canvas_image.png';
    link.click();
}

function genGrid(e) {
    if (e) { e.preventDefault(); }
    document.querySelector('#generations').innerText = ++generations;
    canvas.width = options.blocksX * options.size + 2 * options.border;
    canvas.height = options.blocksY * options.size + 2 * options.border;
    ctx.fillStyle = options.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const rows = Math.ceil(options.blocksX / 2);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < options.blocksY; j++) {
            const c = Math.floor(Math.random() * options.colors.length);
            makeRect(i, j, options.colors[c]);
            makeRect(options.blocksX - 1 - i, j, options.colors[c]);
        }
    }
}

function makeRect(i, j, color) {
    const size = 100;
    ctx.fillStyle = color;
    ctx.fillRect(i * options.size + options.border, j * options.size + options.border, size, size);
}
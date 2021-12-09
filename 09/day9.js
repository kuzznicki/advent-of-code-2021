const style = (text, styleId) => `\x1b[${styleId}m${text}\x1b[0m`;
const bold = (text) => style(text, 1);
const black = (text) => style(text, 30);
const white = (text) => style(text, 97);

const fs = require('fs');
const inputString = fs.readFileSync('input.txt').toString();
const input = inputString.split('\n').map(row => row.trim().split('').map(Number));

const result = solve(input);
console.log('part one: ' + result.partOne); // 465
console.log('part two: ' + result.partTwo); // 1269555

function solve(input) {
    let sumOfRiskLevels = 0;
    const largestBasins = [{ size: 1 }, { size: 1 }, { size: 1 }];

    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            let lowPoint = true;

            for ({ x: ax, y: ay } of getAdjacentCoords(x, y)) {
                if (Number.isInteger((input[ay] || {})[ax]) && input[ay][ax] <= input[y][x]) {
                    lowPoint = false;
                    break;
                }
            }
            
            if (lowPoint) {
                sumOfRiskLevels += input[y][x] + 1;
                
                const basin = calcBasin(input, x, y);
                let smallestBasin = largestBasins.reduce((a, b) => a.size > b.size ? b : a);
                let smallestBasinIndex = largestBasins.indexOf(smallestBasin);
                if (basin.size > smallestBasin.size) largestBasins[smallestBasinIndex] = basin;
            }
        }
    }

    printTerrain(input, largestBasins);

    return { 
        partOne: sumOfRiskLevels, 
        partTwo: largestBasins.reduce((s, b) => s * b.size, 1)
    };
}

function getAdjacentCoords(x, y) {
    return [
        { y: y, x: x - 1 }, 
        { y: y, x: x + 1 }, 
        { y: y - 1, x: x }, 
        { y: y + 1, x: x }
    ];
}

function calcBasin(input, x, y, markedFields = { size: 0, positions: {} }) {
    if (input[y][x] >= 9) return;

    if (!markedFields.positions[y]) markedFields.positions[y] = {};
    if (markedFields.positions[y][x] !== true) {
        markedFields.positions[y][x] = true;
        markedFields.size++;
    }

    for ({ x: ax, y: ay } of getAdjacentCoords(x, y)) {
        if (Number.isInteger((input[ay] || {})[ax]) && input[ay][ax] > input[y][x]) {
            calcBasin(input, ax, ay, markedFields);
        }
    }

    return markedFields;
}

function printTerrain(input, basins) {
    const terrainColors = [45, 45, 44, 44, 46, 42, 42, 42, 43, 41];

    for (let y = 0; y < input.length; y++) {
        let rowString = '';

        for (let x = 0; x < input[y].length; x++) {
            const fieldHeight = input[y][x];
            rowString += basins.find(b => b.positions[y] && b.positions[y][x]) 
                ? white(bold(style(fieldHeight, terrainColors[fieldHeight]))) 
                : black(style(fieldHeight, terrainColors[fieldHeight]));
        }

        console.log(rowString);
    }
}

const fs = require('fs');
const input = fs.readFileSync('input.txt').toString();
let inputArray = input.split(',').map(Number);

console.log('part one: ' + JSON.stringify(solve(inputArray, true))); // {"fuel":355521,"position":337}
console.log('part two: ' + JSON.stringify(solve(inputArray, false))); // {"fuel":100148777,"position":493}

function solve(inputArray, constantFuelBurn) {
    const positions = [...inputArray].sort((a, b) => a - b);
    const calcFuelBurn = distance => !constantFuelBurn 
        ? 0.5 * distance * (distance + 1)
        : distance;

    const result = { fuel: Infinity };
    for (let pos = positions[0]; pos <= positions[positions.length - 1]; pos++) {
        const fuelNeeded = positions.reduce((fuel, crabPos) => fuel + calcFuelBurn(Math.abs(pos - crabPos)), 0);
        if (fuelNeeded < result.fuel) Object.assign(result, { position: pos, fuel: fuelNeeded });
    }

    return result;
}

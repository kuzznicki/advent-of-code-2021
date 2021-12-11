const fs = require('fs');
const inputArray = fs.readFileSync('input.txt').toString();
const input = inputArray.split('\n').map(row => row.split('').map(Number));

const result = solve(input, 100);
console.log('part one: ' + result.one); // 1679
console.log('part two: ' + result.two); // 519

function solve(octopuses, partOneSteps) {
    const octopusesCount = octopuses.length * octopuses[0].length;
    const answer = { one: 0, two: 0 };

    for (let stepNumber = 1; answer.two === 0; stepNumber++) {
        const flashes = step(octopuses);
        if (stepNumber <= partOneSteps) answer.one += flashes;
        if (flashes === octopusesCount) answer.two = stepNumber;
    }

    return answer;
}

function step(octopuses) {
    let flashes = 0;
    
    atEachYXIteration(octopuses, (y, x) => octopuses[y][x]++);
    atEachYXIteration(octopuses, (y, x) => {
        if (octopuses[y][x] > 9) flashes += flash(x, y);
    });
    atEachYXIteration(octopuses, (y, x) => { 
        if (octopuses[y][x] === -1) octopuses[y][x] = 0; // set flashed octopuses energy to 0
    });
    
    return flashes;

    function atEachYXIteration(twoDimArray, callback) {
        for (let y = 0; y < twoDimArray.length; y++) {
            for (let x = 0; x < twoDimArray[y].length; x++) {
                callback(y, x);
            }
        }
    }

    function flash(x, y) {
        let flashes = 1;
        octopuses[y][x] = -1; // mark flashed octopus with -1

        getAdjacentCoords(x, y).forEach(a => {
            if (octopuses[a.y][a.x] === -1) return; // don't charge octopuses which flashed
            if (++octopuses[a.y][a.x] > 9) flashes += flash(a.x, a.y);
        });

        return flashes;
    }

    function getAdjacentCoords(x, y) {
        const adjacentCoords = [];
    
        for (let ax = Math.max(0, x - 1); ax <= Math.min(9, x + 1); ax++) {    
            for (let ay = Math.max(0, y - 1); ay <= Math.min(9, y + 1); ay++) {
                if (ax !== x || ay !== y) adjacentCoords.push({ x: ax, y: ay });
            }
        }
    
        return adjacentCoords;
    }
}

const { performance } = require('perf_hooks');

const input = getInput().split(',').map(Number);
console.log('part one: ' + solve(input, 80)); // 346063
console.log('part two: ' + solve(input, 256)); // 1572358335990

for (let i = 0; i < 32; i++) {
    const startTime = performance.now();
    const days = 2 ** i;
    const fishes = solve(input, days);

    let fishesString = fishes.toString();
    if (fishesString.length > 15) {
        fishesString = fishesString.slice(0, 2).split('').join('.') + ' * 10^' + (fishesString.length - 1);
    }
    
    const time = performance.now() - startTime;
    const timeString = time > 100
        ? Math.floor(10 * time / 1000) / 10 + 's'
        : Math.floor(10 * time) / 10 + 'ms';
    
    console.log(`Days: 2^${i} = ${days} -- Fishes: ${fishesString} -- Calc time: ${timeString}`);
}

function solve(fishTimers, days) {
    const cycleLength = 7;
    const newbornCycleLength = 9;
    const fishesByCycleDaysLeft = new Array(newbornCycleLength).fill(0n);
    
    fishTimers.forEach(fishCycleDaysLeft => fishesByCycleDaysLeft[fishCycleDaysLeft]++);

    for (let day = 0; day < days; day++) {
        const fishesToSpawn = fishesByCycleDaysLeft.shift();
        fishesByCycleDaysLeft[cycleLength - 1] += fishesToSpawn;
        fishesByCycleDaysLeft.push(fishesToSpawn);
    }
    
    return fishesByCycleDaysLeft.reduce((sum, fishes) => sum + fishes, 0n);
}

function getInput() {
    return `1,5,5,1,5,1,5,3,1,3,2,4,3,4,1,1,3,5,4,4,2,1,2,1,2,1,2,1,5,2,1,5,1,2,2,1,5,5,5,1,1,1,5,1,3,4,5,1,2,2,5,5,3,4,5,4,4,1,4,5,3,4,4,5,2,4,2,2,1,3,4,3,2,3,4,1,4,4,4,5,1,3,4,2,5,4,5,3,1,4,1,1,1,2,4,2,1,5,1,4,5,3,3,4,1,1,4,3,4,1,1,1,5,4,3,5,2,4,1,1,2,3,2,4,4,3,3,5,3,1,4,5,5,4,3,3,5,1,5,3,5,2,5,1,5,5,2,3,3,1,1,2,2,4,3,1,5,1,1,3,1,4,1,2,3,5,5,1,2,3,4,3,4,1,1,5,5,3,3,4,5,1,1,4,1,4,1,3,5,5,1,4,3,1,3,5,5,5,5,5,2,2,1,2,4,1,5,3,3,5,4,5,4,1,5,1,5,1,2,5,4,5,5,3,2,2,2,5,4,4,3,3,1,4,1,2,3,1,5,4,5,3,4,1,1,2,2,1,2,5,1,1,1,5,4,5,2,1,4,4,1,1,3,3,1,3,2,1,5,2,3,4,5,3,5,4,3,1,3,5,5,5,5,2,1,1,4,2,5,1,5,1,3,4,3,5,5,1,4,3`;
}

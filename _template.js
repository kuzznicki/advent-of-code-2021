const fs = require('fs');
const inputString = fs.readFileSync('input.txt').toString();
const input = inputString.split(',').map(Number);

const answer = solve(input);
console.log('part one: ' + answer.one); // 
console.log('part two: ' + answer.two); // 

function solve(input) {
    
}

const fs = require('fs');
const input = fs.readFileSync('input.txt').toString().split('\n');

const result = solve(input);
console.log('part one: ' + result.one); // 390993
console.log('part two: ' + result.two); // 2391385187

function solve(lines) {
    const BRACKETS = { '(': ')', '[': ']', '{': '}', '<': '>' };
    const OPENERS = Object.keys(BRACKETS);
    const CLOSERS = Object.values(BRACKETS);
    const incompleteLinesScores = [];
    let corruptedLinesScore = 0;

    for (const line of lines) {
        const expectedClosers = [];
        let corrupted = false;

        for (const char of line.split('')) {
            if (OPENERS.includes(char)) {
                expectedClosers.unshift(BRACKETS[char]);
            } else if (CLOSERS.includes(char) && expectedClosers.shift() !== char) {
                corrupted = true;
                corruptedLinesScore += getIllegalCharScore(char);
                break;
            }
        }

        if (!corrupted && expectedClosers.length) {
            incompleteLinesScores.push(getMissingCharsScore(expectedClosers));
        }
    }

    const mid = (incompleteLinesScores.length - 1) / 2;
    const incompleteLinesScore = incompleteLinesScores.sort((a,b) => a - b)[mid];
    return { one: corruptedLinesScore, two: incompleteLinesScore };

    function getIllegalCharScore(char) {
        return { ')' : 3, ']' : 57, '}': 1197, '>': 25137 }[char];
    }
    
    function getMissingCharsScore(chars) {
        const charScore = { ')' : 1, ']' : 2, '}' : 3, '>' : 4 };
        return chars.reduce((score, char) => (score * 5) + charScore[char], 0);
    }
}

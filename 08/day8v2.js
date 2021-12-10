const fs = require('fs');
const input = fs.readFileSync('input.txt').toString();
const inputEntries = input.split('\n').map(line => {
        const lineParts = line.split('|');
        const [log, output] = lineParts.map(part => {
            const patterns = part.trim().split(' ');
            return patterns.map(pattern => pattern.split('').sort().join(''))
        });
        return { log, output };
    });

const SCORE_TO_DIGIT = { // sum of segment usage counts
    42: 0, // abcefg  -> 8, 6, 8, 4, 9, 7
    17: 1, // cf      -> 8, 9
    34: 2, // acdeg   -> 8, 8, 7, 4, 7
    39: 3, // acdfg   -> 8, 8, 7, 9, 7
    30: 4, // bcdf    -> 6, 8, 7, 9
    37: 5, // abdfg   -> 8, 6, 7, 9, 7
    41: 6, // abdefg  -> 8, 6, 7, 4, 9, 7
    25: 7, // acf     -> 8, 8, 9
    49: 8, // abcdefg -> 8, 6, 8, 7, 4, 9, 7
    45: 9, // abcdfg  -> 8, 6, 8, 7, 9, 7
};

const result = solve(inputEntries);
console.log('part one: ' + result.partOneAnswer); // 274
console.log('part two: ' + result.partTwoAnswer); // 1012089

function solve(entries) {
    let partOneAnswer = 0;
    let partTwoAnswer = 0; 

    for (const entry of entries) {
        const signalUseCounts = {};
        for (const pattern of entry.log) {
            for (const signal of pattern.split('')) {
                signalUseCounts[signal] = (signalUseCounts[signal] || 0) + 1;
            }
        }

        const knownPatterns = {};
        for (const pattern of entry.log) {
            const score = pattern.split('').reduce((acc, c) => acc + signalUseCounts[c], 0);
            knownPatterns[pattern] = SCORE_TO_DIGIT[score];
        }

        partTwoAnswer += Number(entry.output.reduce((numString, pattern) => {
            const digit = knownPatterns[pattern];
            if ([1,4,7,8].includes(digit)) partOneAnswer += 1;
            return numString + digit;
        }, ''));
    }

    return { partOneAnswer, partTwoAnswer };
}

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

const DIGIT = [];
DIGIT[0] = 'abcefg';
DIGIT[1] = 'cf';
DIGIT[2] = 'acdeg';
DIGIT[3] = 'acdfg';
DIGIT[4] = 'bcdf';
DIGIT[5] = 'abdfg';
DIGIT[6] = 'abdefg';
DIGIT[7] = 'acf';
DIGIT[8] = 'abcdefg';
DIGIT[9] = 'abcdfg';

const DIGITS_BY_SEGMENTS_COUNT = { 
    2: [1], 
    3: [7], 
    4: [4], 
    5: [2, 3, 5], 
    6: [0, 6, 9],
    7: [8]
};

const result = solve(inputEntries);
console.log('part one: ' + result.partOneAnswer); // 274
console.log('part two: ' + result.partTwoAnswer); // 1012089

function solve(entries) {
    let partOneAnswer = 0;
    let partTwoAnswer = 0; 

    for (const entry of entries) {
        // part 1
        for (const pattern of entry.output) {
            if (DIGITS_BY_SEGMENTS_COUNT[pattern.length].length === 1) partOneAnswer++;
        }

        // part 2
        const knownPatterns = {};
        
        for (const pattern of entry.log) {
            const possibleDigits = DIGITS_BY_SEGMENTS_COUNT[pattern.length];
            if (possibleDigits.length === 1) knownPatterns[possibleDigits[0]] = pattern;
        }

        for (const pattern of entry.log) {
            if (pattern.length === 5) {
                if (patternsDiff(pattern, knownPatterns[1]).length === 3) {
                    knownPatterns[3] = pattern;
                } else if (patternsDiff(pattern, knownPatterns[4]).length === 3) {
                    knownPatterns[2] = pattern;
                } else {
                    knownPatterns[5] = pattern;
                }
            } else if (pattern.length === 6) {
                if (patternsDiff(pattern, knownPatterns[1]).length === 5) {
                    knownPatterns[6] = pattern;
                } else if (patternsDiff(pattern, knownPatterns[4]).length === 2) {
                    knownPatterns[9] = pattern;
                } else {
                    knownPatterns[0] = pattern;
                }
            }
        }

        const digitByPattern = Object.fromEntries(Object.entries(knownPatterns).map(e => e.reverse()));
        partTwoAnswer += Number(entry.output.map(pattern => digitByPattern[pattern]).join(''));

        console.log([entry.log, entry.output].map(arr => {
            return arr.map(p => digitByPattern[p]).join(' ');
        }).join(' | '));
    }

    return { partOneAnswer, partTwoAnswer };
}

function patternsDiff(p1, p2) {
    const [p1Array, p2Array] = [p1, p2].map(pattern => pattern.split(''));
    return p1Array.filter(char => !p2Array.includes(char));
}

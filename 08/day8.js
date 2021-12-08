const fs = require('fs');
const input = fs.readFileSync('input.txt').toString();
const inputEntries = input.split('\n').map(line => {
        const lineParts = line.split('|');
        const [patterns, output] = lineParts.map(part => part.trim().split(' '));
        return { patterns, output };
    });

const ALL_SEGMENTS = 'abcdefg';
const usedSegmentsByDigit = [];
usedSegmentsByDigit[0] = 'abcefg';
usedSegmentsByDigit[1] = 'cf';
usedSegmentsByDigit[2] = 'acdeg';
usedSegmentsByDigit[3] = 'acdfg';
usedSegmentsByDigit[4] = 'bcdf';
usedSegmentsByDigit[5] = 'abdfg';
usedSegmentsByDigit[6] = 'abdefg';
usedSegmentsByDigit[7] = 'acf';
usedSegmentsByDigit[8] = 'abcdefg';
usedSegmentsByDigit[9] = 'abcdfg';

const digitsBySegmentsCount = { 
    2: [1], 
    3: [7], 
    4: [4], 
    5: [2, 3, 5], 
    6: [0, 6, 9],
    7: [8]
};

const result1 = partOne(inputEntries);
const result2 = partTwo(inputEntries);
console.log(`part one: ${result1},\tpart two: ${result2}`); // 274, 1012089

function partOne(entries) {
    let countOf1478 = 0;

    for (const entry of entries) {
        for (const pattern of entry.output) {
            const possibleDigits = digitsBySegmentsCount[pattern.length];
            if (possibleDigits.length === 1) countOf1478++; // 1, 4, 7, 8 use unique number of segments
        }
    }

    return countOf1478;
}

function partTwo(entries) {
    let outputSum = 0; 

    for (const entry of entries) {
        const knownPatterns = {};
        const patternsFor235 = []; // 2, 3, 5 have same segments count
        const candidates = {};
        ALL_SEGMENTS.split('').forEach(segment => candidates[segment] = ALL_SEGMENTS.split(''));

        for (const pattern of entry.patterns) {
            const possibleDigits = digitsBySegmentsCount[pattern.length];

            if (possibleDigits.length === 1) {
                const digit = possibleDigits[0];
                knownPatterns[digit] = pattern.split('');
                
                if (digit !== 8) {
                    const signals = pattern.split('');

                    for (let segment in candidates) {
                        candidates[segment] = usedSegmentsByDigit[digit].includes(segment)
                            ? candidates[segment].filter(candidate => signals.includes(candidate))
                            : candidates[segment].filter(candidate => !signals.includes(candidate));
                    }
                }
            } else if (possibleDigits.includes(2)) {
                patternsFor235.push(pattern);
            }
        }

        // to display 2, 3, 5 digits, segments 'e' & 'b' are used only once. 'e' for 2, 'b' for 5
        const signalCountsFor235 = patternsFor235.join('').split('').reduce((counts, signal) => {
            counts[signal] = (counts[signal] || 0) + 1;
            return counts;
        }, {});

        const signalsForEB = Object.keys(signalCountsFor235).filter(signal => signalCountsFor235[signal] === 1);
        const signalForB = signalsForEB.filter(signal => knownPatterns[4].includes(signal))[0];
        const signalForE = signalsForEB.filter(signal => signal !== signalForB)[0];
        assignSignalToSegment(candidates, 'b', signalForB);
        assignSignalToSegment(candidates, 'e', signalForE);

        knownPatterns[2] = patternsFor235.filter(pattern => pattern.split('').includes(signalForE))[0];
        const signalForC = knownPatterns[1].filter(signal => knownPatterns[2].includes(signal))[0];
        assignSignalToSegment(candidates, 'c', signalForC);

        // here I finally have only one signal candidate for each segment
        const signalToSegment = {};
        Object.entries(candidates).forEach(kv => signalToSegment[kv[1][0]] = kv[0]);

        const decodedPatterns = entry.patterns.map(p => decodePattern(p, signalToSegment));
        const decodedOutput = entry.output.map(p => decodePattern(p, signalToSegment));
        outputSum += Number(decodedOutput.join(''));

        console.log(decodedPatterns.join(' ') + ' | ' + decodedOutput.join(' '));
    }

    return outputSum;
}

function decodePattern(pattern, signalToSegment) {
    const possibleDigits = digitsBySegmentsCount[pattern.length];
    if (possibleDigits.length === 1) return possibleDigits[0];

    const segments = pattern.split('').map(signal => signalToSegment[signal]);

    for (const digit of possibleDigits) {
        const diff = usedSegmentsByDigit[digit].split('').filter(s => !segments.includes(s));
        if (diff.length === 0) return digit;
    }

    throw new Error('failed to decode pattern');
};

function assignSignalToSegment(candidates, segment, signal) {
    for (let seg in candidates) {
        candidates[seg] = seg !== segment
            ? candidates[seg].filter(candidate => candidate !== signal)
            : [signal];
    }
}

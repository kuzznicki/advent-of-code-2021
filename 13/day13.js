const fs = require('fs');
const inputString = fs.readFileSync('input.txt').toString();
const [dotPositions, foldInstructions] = inputString
    .split('\n\n')
    .map(sectionString => sectionString
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length));

const answer = solve(dotPositions, foldInstructions);
console.log('part one: ' + answer.one); // 653
console.log('part two: ' + answer.two); /* LKREBPRK
#    #  # ###  #### ###  ###  ###  #  # 
#    # #  #  # #    #  # #  # #  # # #  
#    ##   #  # ###  ###  #  # #  # ##   
#    # #  ###  #    #  # ###  ###  # #  
#    # #  # #  #    #  # #    # #  # #  
#### #  # #  # #### ###  #    #  # #  # 
*/

function solve(dotPositions, foldInstructions) {
    let answerOne = null;
    let paper = createPaper(dotPositions);
    const parsedFoldInstructions = parseFoldInstructions(foldInstructions);

    for (const fold of parsedFoldInstructions) {
        switch (fold.axis) {
            case 'x': paper = foldX(paper, fold.value); break;
            case 'y': paper = foldY(paper, fold.value); break;
            default: continue;
        }

        if (answerOne === null) {
            answerOne = paper.map(r => r.filter(c => c == '#')).flat().length;
        }
    }

    return { 
        one: answerOne,
        two: ['', ...paper.map(r => r.join('')), ''].join('\n')
    };
}

function createPaper() {
    const { paperWidth, paperHeight, dots } = calcPaperDimsAndDotPositions(dotPositions);
    const paper = [...new Array(paperHeight + 1)].map(() => new Array(paperWidth + 1).fill(' '));
    
    Object.keys(dots).forEach(y => {
        Object.keys(dots[y]).forEach(x => paper[y][x] = '#');
    });

    return paper;
}

function calcPaperDimsAndDotPositions(dotPositions) {
    let paperWidth = 0;
    let paperHeight = 0;
    const dots = {};

    for (const pos of dotPositions) {
        const [x, y] = pos.split(',');
        if (!x || !y) continue;

        dots[y] = (dots[y] || {});
        dots[y][x] = true;

        if (+x > paperWidth) paperWidth = +x;
        if (+y > paperHeight) paperHeight = +y;
    }

    return { paperWidth, paperHeight, dots };
}

function parseFoldInstructions(foldInstructions) {
    const parsed = [];

    for (const instruction of foldInstructions) {
        const syntax = 'fold along ';

        const [, axisValueString] = instruction.split(syntax);
        if (!axisValueString) continue;

        const [axis, value] = axisValueString.split('=');
        if (!axis || !Number.isInteger(+value) || +value < 0) continue;

        parsed.push({ axis, value: +value });
    }

    return parsed;
}

function foldX(paper, x) {
    const left = paper.map(row => row.slice(0, x));
    const right = paper.map(row => row.slice(x + 1)); 
    const [smaller, bigger] = left.length < right.length ? [left, right] : [right, left];

    for (let y = 0; y < smaller.length; y++) {
        for (let x = 0; x < smaller[y].length; x++) {
            if (smaller[y][x] === '#') {
                bigger[y][bigger[y].length - 1 - x] = '#';
            }
        }
    }

    return [...bigger];
}

function foldY(paper, y) {
    const up = paper.slice(0, y);
    const bottom = paper.slice(y + 1);
    const [smaller, bigger] = up.length < bottom.length ? [up, bottom] : [bottom, up];

    for (let y = 0; y < smaller.length; y++) {
        for (let x = 0; x < smaller[y].length; x++) {
            if (smaller[y][x] === '#') {
                bigger[bigger.length - 1 - y][x] = '#';
            }
        }
    }

    return [...bigger];
}

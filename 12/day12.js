const fs = require('fs');
const inputString = fs.readFileSync('input.txt').toString();
const connections = inputString.split('\n')
    .map(str => str.split('-'));

class Cave {
    constructor(id) {
        this.id = id;
        this.small = id.toLowerCase() === id;
        this.connections = new Set();
    }

    getId() { return this.id; }
    isSmall() { return this.small; }
    addConnection(cave) { this.connections.add(cave); }
    getConnections() { return [...this.connections]; }
}

console.log('part one: ' + solve(connections)); // 5457
console.log('part two: ' + solve(connections, true)); // 128506

function solve(connections, partTwo = false) {
    const caves = createCaves(connections);
    if (!caves.start || !caves.end) return 0;
    
    const paths = findAllPaths(caves.start, caves.end, partTwo);
    return paths.length;
}

function createCaves(connections) {
    return connections.reduce((caves, connection) => {
        const [id1, id2] = connection;
        
        if (id1 && id2) {
            if (!caves[id1]) caves[id1] = new Cave(id1);
            if (!caves[id2]) caves[id2] = new Cave(id2);
            caves[id1].addConnection(caves[id2]);
            caves[id2].addConnection(caves[id1]);
        }
        
        return caves;
    }, {});
}

function findAllPaths(startCave, endCave, partTwo, currentPath = [], twiceVisitedSmall = null) {
    const paths = [];

    currentPath.push(startCave);
    const connections = startCave.getConnections();
    
    for (const cave of connections) {
        const isAlreadyVisitedSmallCave = cave.isSmall() && currentPath.includes(cave);
        const notVisitedAnySmallCaveTwiceYet = cave.getId() !== 'start' && !twiceVisitedSmall;
        
        if (cave === endCave) {
            paths.push([...currentPath, endCave]);
        } else if (!isAlreadyVisitedSmallCave) {
            paths.push(...findAllPaths(cave, endCave, partTwo, [...currentPath], twiceVisitedSmall));
        } else if (partTwo && notVisitedAnySmallCaveTwiceYet) {
            paths.push(...findAllPaths(cave, endCave, partTwo, [...currentPath], cave));
        }
    }

    return paths;
}

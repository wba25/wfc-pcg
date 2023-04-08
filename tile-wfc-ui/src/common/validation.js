export function validateTilesNames(tiles) {
    let names = [];
    for (let i = 0; i < tiles.length; i++) {
        if (names.includes(tiles[i].name)) {
            return `${i+1}º tile com nome duplicado`;
        }
        names.push(tiles[i].name);
    }
    return null;
}

export function validateTilesWeights(tiles) {
    for (let i = 0; i < tiles.length; i++) {
        if(tiles[i].weight > 1 || tiles[i].weight < 0) {
            return `${i+1}º tile com peso inválido`;
        }
    }
    return null;
}

export function validateTilesSymmetries(tiles) {
    for (let i = 0; i < tiles.length; i++) {
        if (!["X", "T", "I", "L", "F", "\\"].includes(tiles[i].symmetry)) {
            return `${i+1}º tile com simetria inválido`;
        }
    }
    return null;
}

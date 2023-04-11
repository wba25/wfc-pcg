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

export function validateTileSymmetry(tile, unique = false) {
    if (unique) {
        switch (tile.symmetry) {
            case "X":
                return tile.assets.length === 1;
            case "T":
                return tile.assets.length === 4;
            case "I":
                return tile.assets.length === 2;
            case "L":
                return tile.assets.length === 4;
            case "F":
                return tile.assets.length === 8;
            case "\\":
                return tile.assets.length === 2;
            default:
                return false;
        }
    }
    return tile.assets.length === 1;
}

export function getQuantityOfTileSymmetry(symmetry, unique = false) {
    if (unique) {
        switch (symmetry) {
            case "X":
                return 1;
            case "T":
                return 4;
            case "I":
                return 2;
            case "L":
                return 4;
            case "F":
                return 8;
            case "\\":
                return 2;
            default:
                return 0;
        }
    }
    return 1;
}

export function validateTilesSymmetries(tiles, unique = false) {
    for (let i = 0; i < tiles.length; i++) {
        if (!["X", "T", "I", "L", "F", "\\"].includes(tiles[i].symmetry)) {
            return `${i+1}º tile com simetria inválido`;
        }
        if (!validateTileSymmetry(tiles[i], unique)) {
            return `${i+1}º tile com simetria e assets incompatíveis. Simetria "${tiles[i].symmetry}" deve ter ${getQuantityOfTileSymmetry(tiles[i].symmetry, unique)} asset(s), mas foram inseridos ${tiles[i].assets.length} asset(s)`;
        }
    }
    return null;
}

export function validateTilesAssets(tiles) {
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].assets.length === 0) {
            return `${i+1}º tile sem assets`;
        }
    }
    return null;
}

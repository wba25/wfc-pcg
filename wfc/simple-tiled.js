"use strict";

var wfc = require("wavefunctioncollapse");
const Jimp = require("jimp");
// const lcg = require("./lcg");

function loadTileBitmapData(basePath, tile, number) {
  const unique = number !== null;
  const tilePath = basePath + tile.name + (unique ? " " + number : " 0") + ".png";

  return Jimp.read(tilePath).then(function (result) {
    if (unique) {
      tile.bitmap[number] = new Uint8Array(result.bitmap.data); //add the bitmap data in each tile variant
    } else {
      tile.bitmap = new Uint8Array(result.bitmap.data); //add the bitmap data in each tile
    }

    return true;
  });
}

function addBitmapDataToStructure(structure) {
  const promises = [];
  const path = structure.path;
  const unique = !!structure.unique;

  structure.tiles.map(function (tile) {
    if (unique) {
      if (tile.symmetry === "X") {
        tile.bitmap = new Array(1);
        promises.push(loadTileBitmapData(path, tile, 0));
      } else {
        // TODO: fix - nem todo tile tem 4 variante, depende da simetria
        tile.bitmap = new Array(4);
        promises.push(loadTileBitmapData(path, tile, 0));
        promises.push(loadTileBitmapData(path, tile, 1));
        promises.push(loadTileBitmapData(path, tile, 2));
        promises.push(loadTileBitmapData(path, tile, 3));
      }
    } else {
      promises.push(loadTileBitmapData(path, tile, null));
    }
  });

  return promises;
}

module.exports = {
  generate: async (definition) => {
    const outputPath = "output/simple-tiled-model.png";
    var error = null;

    try {
      const promises = addBitmapDataToStructure(definition);
      for (let i = 0; i < promises.length; i++) {
        await promises[i];
      }
      const destWidth = definition.width || 20;
      const destHeight = definition.height || 20;
      const model = new wfc.SimpleTiledModel(
        definition,
        null,
        destWidth,
        destHeight,
        false
      );
      const finished = model.generate();
      if (finished) {
        const result = model.graphics();

        const image = new Jimp(destWidth * definition.tilesize, destHeight * definition.tilesize);
        image.bitmap.data = Buffer.from(result.buffer);
        await image.writeAsync(outputPath);
      } else {
        throw new Error("The generation ended in a contradiction");
      }
    } catch (e) {
      error = e;
    }
    
    return [ outputPath, error ];
  }
};

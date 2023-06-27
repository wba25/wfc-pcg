"use strict";

var wfc = require("wavefunctioncollapse");
const Jimp = require("jimp");
// const lcg = require("./lcg");
const variant = require("./variant");

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

function getNeighborns(structure) {
  const tiles = structure.tiles;
  const tilesize = structure.tilesize;
  const unique = !!structure.unique;
  
  const tileset = [];
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    const tileVariants = unique ? tile.bitmap : variant.getNotUniqueVariants(tile.bitmap, tile.symmetry, tilesize);
    for (let j = 0; j < tileVariants.length; j++) {
      const tileVariant = tileVariants[j];
      tileset.push({
        label: tile.name + " " + j,
        bitmap: tileVariant
      });
    }
  }

  const neighborns = [];
  for (let i = 0; i < tileset.length; i++) {
    const leftNeighborn = tileset[i];
    for (let j = 0; j < tileset.length; j++) {
      const rightNeighborn = tileset[j];
      if(variant.areNeighborns(leftNeighborn.bitmap, rightNeighborn.bitmap, tilesize)) {
        neighborns.push({
          left: leftNeighborn.label,
          right: rightNeighborn.label
        });
      }
    }
  }

  return neighborns;
}

module.exports = {
  generate: async (definition, destWidth = 20, destHeight = 20) => {
    const outputPath = "output/simple-tiled-model.png";
    var error = null;

    try {
      const promises = addBitmapDataToStructure(definition);
      for (let i = 0; i < promises.length; i++) {
        await promises[i];
      }
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
  },
  neighborns: async (definition) => {
    var neighborns = [];
    var error = null;
    try {
      const promises = addBitmapDataToStructure(definition);
      for (let i = 0; i < promises.length; i++) {
        await promises[i];
      }
      neighborns = getNeighborns(definition);
    } catch (e) {
      error = e;
    }
    return [neighborns, error];
  }
};

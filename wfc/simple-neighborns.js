"use strict";

const Jimp = require("jimp");
const _ = require('lodash');

function getVariantRotationDegree(index) {
  switch (index) {
    case 0:
      return 0;
    case 1:
      return 90;
    case 2:
      return 180;
    case 3:
      return 270;
    default:
      return 360;
  }
}

function getCardinality(symmetry) {
  switch (symmetry) {
    case 'L':
      return 4;
    case 'T':
      return 4;
    case 'I':
      return 2;
    case '\\':
      return 2;
    case 'F':
      return 8;
    default:
      return 1;
  }
}

function getLeftJoinPoints(bitmap, tilesize) {
  const image = new Jimp(tilesize, tilesize);
  image.bitmap.data = Buffer.from(bitmap);
  return [
    image.getPixelColor(tilesize - 1, 0),
    image.getPixelColor(tilesize - 1, Math.ceil(tilesize / 2)),
    image.getPixelColor(tilesize - 1, tilesize - 1)
  ];
}

function getRightJoinPoints(bitmap, tilesize) {
  const image = new Jimp(tilesize, tilesize);
  image.bitmap.data = Buffer.from(bitmap);
  return [
    image.getPixelColor(0, 0),
    image.getPixelColor(0, Math.ceil(tilesize / 2)),
    image.getPixelColor(0, tilesize - 1)
  ];
}

function tilesAreNeighborns(leftBitmap, rightBitmap, tilesize) {
  return _.isEqual(getLeftJoinPoints(leftBitmap, tilesize), getRightJoinPoints(rightBitmap, tilesize));
}

function loadTileBitmapData(basePath, tile, number, unique) {
  const tilePath = basePath + tile.name + (unique ? " " + number : " 0") + ".png";

  return Jimp.read(tilePath).then(function (result) {
    if (unique) {
      tile.bitmap[number] = new Uint8Array(result.bitmap.data);
    } else {
      tile.bitmap[number] = new Uint8Array(
        result.rotate(getVariantRotationDegree(number)).bitmap.data
      );
    }

    return true;
  });
}

function addBitmapDataToStructure(structure) {
  const promises = [];
  const path = structure.path;
  const unique = !!structure.unique;

  structure.tiles.map(function (tile) {
    if (tile.symmetry === "X") {
      tile.bitmap = new Array(1);
      promises.push(loadTileBitmapData(path, tile, 0, unique));
    } else {
      tile.bitmap = new Array(getCardinality(tile.symmetry));
      for (let i = 0; i < tile.bitmap.length; i++) {
        promises.push(loadTileBitmapData(path, tile, i, unique));
      }
    }
  });

  return promises;
}

function addNeighborn(array = [], neighborn) {
  let elementInverted = array.find(e => e.left === neighborn.right && e.right === neighborn.left);
  if (elementInverted === undefined) {
    array.push(neighborn);
  }
}

function getNeighborns(structure) {
  const tiles = structure.tiles;
  const tilesize = structure.tilesize;
  
  const tileset = [];
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    const tileVariants = tile.bitmap;
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
      if(tilesAreNeighborns(leftNeighborn.bitmap, rightNeighborn.bitmap, tilesize)) {
        addNeighborn(neighborns, {
          left: leftNeighborn.label,
          right: rightNeighborn.label
        });
      }
    }
  }

  return neighborns;
}

module.exports = {
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

"use strict";

const _ = require('lodash');

function tile (f, tilesize) {
  const result = new Array(tilesize * tilesize);

  for (let y = 0; y < tilesize; y++) {
    for (let x = 0; x < tilesize; x++) {
      result[x + y * tilesize] = f(x, y);
    }
  }

  return result;
};

function rotate (array, tilesize) {
  return tile(function (x, y) {
    return array[tilesize - 1 - y + x * tilesize];
  }, tilesize);
};

function reflect(array, tilesize) {
  return tile(function (x, y) {
    return array[tilesize - 1 - x + y * tilesize];
  }, tilesize);
};

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
  const tileBitmaps = Array.from({ length: bitmap.length / 4 }, (_, i) => bitmap.slice(i * 4, (i + 1) * 4));
  return [tileBitmaps[tilesize-1], tileBitmaps[tilesize * Math.ceil(tilesize / 2) - 1], tileBitmaps[tilesize * tilesize - 1]];
}

function getRightJoinPoints(bitmap, tilesize) {
  const tileBitmaps = Array.from({ length: bitmap.length / 4 }, (_, i) => bitmap.slice(i * 4, (i + 1) * 4));
  return [tileBitmaps[0], tileBitmaps[tilesize * Math.ceil(tilesize / 2) - tilesize - 1], tileBitmaps[tilesize * tilesize - tilesize]];
}

module.exports = {
  getNotUniqueVariants: (bitmap, symmetry, tilesize) => {
    const variants = [];
    variants.push(bitmap);
    const cardinality = getCardinality(symmetry);
    for (let t = 1; t < cardinality; t++) {
      variants.push(t < 4 ? rotate(variants[t - 1], tilesize) : reflect(variants[t - 4], tilesize));
    }
    return variants;
  },
  areNeighborns: (leftBitmap, rightBitmap, tilesize) => {
    return _.isEqual(getLeftJoinPoints(leftBitmap, tilesize), getRightJoinPoints(rightBitmap, tilesize));
  }
};

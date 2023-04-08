import { createStore } from "vuex";
import { getObjValues } from "../common/util.js";

const store = createStore({
  state() {
    return {
      path: "data/",
      tilesize: 7,
      tiles: {}, // {id: "", name: "", symmetry: "", weight: 0, assets: []} // base64 image
      neighbors: [] // { left: "", right: ""}
    };
  },
  mutations: {
    setPath(state, path) {
      state.path = "data/" + path.replace(/[^a-zA-Z0-9]/g, "_").replace(/\s/g, "_") + "/";
    },
    setTilesize(state, tilesize) {
        state.tilesize = tilesize;
    },
    resetTiles(state, tiles = []) {
        state.tiles = tiles;
    },
    resetNeighbors(state, neighbors = []) {
        state.neighbors = neighbors;
    },
    addTile(state, payload) {
      state.tiles[payload["id"]] = payload["tile"];
    },
    removeTile(state, id) {
      delete state.tiles[id];
    },
    addNeighbor(state, neighbor) {
        state.neighbors.push(neighbor);
    },
    removeNeighborByIndex(state, neighborIndex) {
        state.neighbors.splice(neighborIndex, 1);
    }
  },
  getters: {
    tilemap (state) {
      return {
        path: state.path,
        tilesize: state.tilesize,
        tiles: Object.getOwnPropertyNames(state.tiles).length !== 0 ? getObjValues(state.tiles) : [],
        neighbors: state.neighbors
      }
    }
  }
});

export default store;

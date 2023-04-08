import { createStore } from "vuex";
import { getObjValues } from "../common/util.js";

const store = createStore({
  state() {
    return {
      registerStage: 0,
      path: "data/novo_tilemap/",
      tilesize: 8,
      tiles: {}, // {id: "", name: "", symmetry: "", weight: 0, assets: []} // base64 image
      neighbors: [] // { left: "", right: ""}
    };
  },
  mutations: {
    setRegisterStage(state, stage) {
      state.registerStage = stage;
    },
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
    getRegisterStage(state) {
      return state.registerStage;
    },
    getTiles(state) {
      return state.tiles;
    },
    getTile: (state) => (id) => {
      return state.tiles[id] || null;
    },
    tilemap (state) {
      return {
        path: state.path,
        tilesize: state.tilesize,
        tiles: Object.getOwnPropertyNames(state.tiles).length !== 0 ? getObjValues(state.tiles) : [],
        neighbors: state.neighbors
      }
    },
    getPathName(state) {
      return state.path.split("/")[1];
    },
    getTilesize(state) {
      return state.tilesize;
    }
  }
});

export default store;

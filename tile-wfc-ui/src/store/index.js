import { createStore } from "vuex";
import { getObjValues } from "../common/util.js";

const store = createStore({
  state() {
    return {
      registerStage: 0,
      path: "data/novo_tilemap/",
      tilesize: 8,
      tiles: {}, // {id: "", name: "", symmetry: "", weight: 0, assets: []} // base64 image
      neighbors: {} // { left: "", right: ""}
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
    // Tiles
    resetTiles(state, tiles = []) {
      state.tiles = tiles;
    },
    addTile(state, payload) {
      state.tiles[payload["id"]] = payload["tile"];
    },
    removeTile(state, id) {
      delete state.tiles[id];
    },
    // Neighbors
    resetNeighbors(state, neighbors = []) {
      state.neighbors = neighbors;
    },
    addNeighbor(state, payload) {
      state.neighbors[payload["id"]] = payload["neighbor"];
    },
    removeNeighbor(state, id) {
      delete state.neighbors[id];
    }
  },
  getters: {
    getRegisterStage(state) {
      return state.registerStage;
    },
    tilemap (state) {
      return {
        path: state.path,
        tilesize: state.tilesize,
        tiles: Object.getOwnPropertyNames(state.tiles).length !== 0 ? getObjValues(state.tiles) : [],
        neighbors: Object.getOwnPropertyNames(state.neighbors).length !== 0 ? getObjValues(state.neighbors) : []
      }
    },
    getPathName(state) {
      return state.path.split("/")[1];
    },
    getTilesize(state) {
      return state.tilesize;
    },
    // Tiles
    getTiles(state) {
      return state.tiles;
    },
    getTile: (state) => (id) => {
      return state.tiles[id] || null;
    },
    getTileAsset: (state, getters) => (rawName) => {
      let [name, index] = rawName.split(" ");
      let tile = getters.tilemap.tiles.filter(t => t.name === name)[0] || null;
      if (tile) {
        return tile.assets[parseInt(index)] || null;
      }
      return null;
    },
    // Neighbors
    getNeighbors(state) {
      return state.neighbors;
    },
    getNeighbor: (state) => (id) => {
      return state.neighbors[id] || null;
    },
  }
});

export default store;

import { createStore } from "vuex";
import { getObjValues } from "../common/util.js";
import { api } from "@/services";
import axios from "axios";

const store = createStore({
  state() {
    return {
      registerStage: 0,
      path: "data/novo_tilemap/",
      tilesize: 8,
      unique: false,
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
    setUnique(state, unique) {
        state.unique = unique;
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
        unique: state.unique,
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
    getUnique(state) {
      return state.unique;
    },
    // Tiles
    getTiles(state) {
      return state.tiles;
    },
    getTile: (state) => (id) => {
      return state.tiles[id] || null;
    },
    getTileAsset: (state, getters) => (name, index=0) => {
      let tile = getters.tilemap.tiles.filter(t => t.name === name)[0] || null;
      if (tile) {
        return tile.assets[index] || null;
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
  },
  actions: {
    indexProcess: async function({ state, commit }) {
      // axios.defaults.headers.common['Content-Type'] ='application/json;charset=utf-8';
      // axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
      return axios.get('http://localhost:8080/api/processes');
    },
    storeProcess: async function({ state, commit }, payload) {
      var res = await api.post("processes", payload).catch(function(error) {
        return error.response;
      });
      return res.data;
    },
  }
});

export default store;

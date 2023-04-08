<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center fill-height">
      <v-row class="d-flex align-center justify-center">
        <v-col>
          <v-text-field
            v-model="tilemapName"
            variant="outlined"
            density="comfortable"
            label="Nome do tilemap"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="tileSize"
            :prefix="tileSize + ' X '"
            suffix="px"
            type="number"
            variant="outlined"
            density="comfortable"
            label="Tamanho dos tiles"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="auto" v-for="tile in tiles">
          <TileForm :tile-id="tile.id" :onDelete="() => removeTileWithId(tile.id)"/>
        </v-col>
        <v-col>

          <v-btn
            density="compact"
            icon="mdi-plus"
            @click="tiles.push({ id: generateNewTileId() })"
          ></v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" v-for="erro in errors">
          <v-alert
            type="error"
            variant="tonal"
            icon="$error"
            border="start"
            border-color="error"
            :title="erro.title"
            :text="erro.text"
            elevation="2"
          ></v-alert>
        </v-col>
      </v-row>
      <v-row justify="end">
        <v-col cols="auto">
          <v-btn size="large" color="secondary" @click="$router.go(-1)"
            >Cancelar</v-btn
          >
        </v-col>
        <v-col cols="auto">
          <v-btn size="large" color="primary" @click="next"
            >Definir adjacência</v-btn
          >
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script>
import TileForm from "@/components/TileForm.vue";
import { mapGetters, mapMutations } from "vuex";
import { v4 as uuidv4 } from "uuid";
import {
  validateTilesNames,
  validateTilesWeights,
  validateTilesSymmetries,
  validateTilesAssets,
} from "../common/validation";
export default {
  components: {
    TileForm,
  },
  data() {
    return {
      tilemapName: "",
      tileSize: 0,
      tiles: [],
      errors: [],
    };
  },
  watch: {
    tilemapName(newName, oldName) {
      if (newName !== oldName) {
        this.setPath(newName);
      }
    },
    tileSize(newSize, oldSize) {
      if (newSize !== oldSize) {
        this.setTilesize(this.tileSize);
      }
    },
  },
  mounted() {
    this.tilemapName = this.getPathName;
    this.tileSize = this.getTilesize;
    this.initTiles(this.getTiles);
  },
  computed: {
    ...mapGetters(["tilemap", "getPathName", "getTilesize", "getTiles"]),
  },
  methods: {
    ...mapMutations(["setPath", "setTilesize", "setRegisterStage", "removeTile"]),
    removeTileWithId(tileId) {
      this.tiles = this.tiles.filter((tile) => tile.id !== tileId);
      this.removeTile(tileId);
    },
    initTiles(rawTiles) {
      Object.keys(rawTiles).forEach((tileId) => {
        this.tiles.push({
          id: tileId,
        });
      });
    },
    generateNewTileId() {
      return uuidv4();
    },
    validateTiles() {
      this.errors = [];
      if (this.tilemap.tiles.length < 1) {
        this.errors.push({
          title: "Número de tiles insuficiente",
          text: "É necessário pelo menos um tile para gerar um tilemap",
        });
      }
      let error =
        validateTilesNames(this.tilemap.tiles) ||
        validateTilesWeights(this.tilemap.tiles) ||
        validateTilesSymmetries(this.tilemap.tiles) ||
        validateTilesAssets(this.tilemap.tiles);
      if (error) {
        this.errors.push({
          title: "Tile inválido",
          text: error,
        });
      }
      return this.errors.length === 0;
    },
    next() {
      if (this.validateTiles()) {
        this.setRegisterStage(1);
      }
    },
  },
};
</script>

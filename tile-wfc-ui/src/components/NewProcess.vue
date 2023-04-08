<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center fill-height">
      <v-row class="d-flex align-center justify-center">
        <v-col cols="12">
          <v-text-field
            v-model="tilemapName"
            variant="outlined"
            density="comfortable"
          ></v-text-field>
        </v-col>
        <v-spacer />
      </v-row>
      <v-row>
        <v-col cols="auto" v-for="tile in tiles">
          <TileForm
            :tile-id="tile.id"
          />
        </v-col>
        <v-col>
          <v-btn density="compact" icon="mdi-plus" @click="tiles.push({ id: generateNewTileId() })"></v-btn>
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
          <v-btn size="large" color="secondary" @click="$router.go(-1)">Cancelar</v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn size="large" color="primary" @click="next">Definir adjacência</v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script>
  import TileForm from '@/components/TileForm.vue';
  import { mapGetters, mapMutations } from "vuex";
  import { v4 as uuidv4 } from 'uuid';
  export default {
    components: {
      TileForm
    },
    data () {
      return {
        tilemapName: 'Novo Tilemap',
        tiles: [],
        errors: []
      }
    },
    watch: {
      tilemapName(newName, oldName) {
        if (newName !== oldName) {
          this.setPath(newName);
        }
      },
    },
    mounted () {
      this.setPath(this.tilemapName);
    },
    methods: {
      ...mapMutations(["setPath"]),
      generateNewTileId () {
        return uuidv4();
      },
      validateTiles () {
        // TODO: validar do store diretamente
        this.errors = [];
        if (this.tiles.length < 1) {
          this.errors.push({
            title: 'Número de tiles insuficiente',
            text: 'É necessário pelo menos um tile para gerar um tilemap'
          })
        }
        else {
          for (let i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].name === '') {
              this.errors.push({
                title: 'Nome de tile inválido',
                text: `O nome do tile ${i+1} não pode ser vazio`
              })
            }
            if (this.tiles[i].symmetry === '') {
              this.errors.push({
                title: 'Simetria de tile inválida',
                text: `A simetria do tile ${i+1} não pode ser vazia`
              })
            }
            
          }
        }
        return this.errors.length === 0
      },
      next () {
        if (this.validateTiles()) {
          // commit mutations
          this.$router.push({ name: 'NewAdjacency', params: { tilemapName: this.tilemapName, tiles: this.tiles } })
        } else {
          // show erros
        }
      }
    }
  }
</script>

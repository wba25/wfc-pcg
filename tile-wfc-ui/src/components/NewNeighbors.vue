<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center fill-height">
      <v-row>
        <v-col cols="auto" v-for="neighbor in neighbors">
          <NeighborForm 
            :neighbor-id="neighbor.id"
            :neighbor-options="neighborsOpts"
            :onDelete="() => removeNeighborWithId(neighbor.id)"
          />
        </v-col>
        <v-col>
          <v-btn
            density="compact"
            icon="mdi-plus"
            @click="neighbors.push({ id: generateNewNeighborId() })"
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
          <v-btn size="large" color="secondary" @click="setRegisterStage(0)">Ajustar tiles</v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn size="large" color="primary" @click="()=>{}">Gerar Mapa</v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script>
  import NeighborForm from '@/components/NeighborForm.vue';
  import { mapGetters, mapMutations } from "vuex";
  import { v4 as uuidv4 } from "uuid";
  export default {
    components: {
      NeighborForm
    },
    data () {
      return {
        neighbors: [],
        neighborsOpts: [],
        errors: []
      }
    },
    watch: {},
    mounted () {
      this.initNeighborsOpts();
    },
    computed: {
      ...mapGetters(["tilemap"])
    },
    methods: {
      ...mapMutations(["setRegisterStage", "removeNeighbor"]),
      removeNeighborWithId(neighborId) {
        this.neighbors = this.neighbors.filter((n) => n.id !== neighborId);
        this.removeNeighbor(neighborId);
      },
      generateNewNeighborId() {
        return uuidv4();
      },
      initNeighborsOpts(){
        this.neighborsOpts = [];
        for (let i = 0; i < this.tilemap.tiles.length; i++) {
          for (let j = 0; j < this.tilemap.tiles[i].assets.length; j++) {
            this.neighborsOpts.push(`${this.tilemap.tiles[i].name} ${j}`);
          }
        }
      }
    }
  }
</script>

<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center fill-height">
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
  import TileForm from '@/components/TileForm.vue';
  import { mapGetters, mapMutations } from "vuex";
  import { v4 as uuidv4 } from 'uuid';
  export default {
    components: {
      TileForm
    },
    data () {
      return {
        errors: []
      }
    },
    watch: {},
    mounted () {},
    methods: {
      ...mapMutations(["setRegisterStage"])
    }
  }
</script>

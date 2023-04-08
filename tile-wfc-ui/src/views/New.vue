<template>
  <NewTiles v-if="getRegisterStage == 0"/>
  <NewNeighbors v-else/>
</template>

<script>
  import NewTiles from '@/components/NewTiles.vue';
  import NewNeighbors from '@/components/NewNeighbors.vue';
  import { mapGetters } from "vuex";

  export default {
    components: {
      NewTiles,
      NewNeighbors
    },
    computed: {
    ...mapGetters(["getRegisterStage"])
    }
  }
</script>

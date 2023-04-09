<template>
  <v-card
    width="325px"
    height="325px"
    elevation="6"
    class="overflow-y-auto pa-4 ml-4"
    :image="bgImage"
    color="#bdbdbd"
  >
    <div class="float-btn">
      <v-btn color="error" density="compact" icon="mdi-close-circle" variant="plain" @click="onDelete"></v-btn>
    </div>
    <v-card-text>
      <v-form>
        <v-row>
          <v-col cols="6">
            <v-select
              v-model="left"
              label="Esquerda"
              :items="neighborOptions"
              bg-color="rgba(255, 255, 255, 0.8)"
              variant="plain"
              hide-details
              required
            ></v-select>
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="right"
              label="Direita"
              :items="neighborOptions"
              bg-color="rgba(255, 255, 255, 0.8)"
              variant="plain"
              hide-details
              required
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="5">
            <v-img :src="leftImage"></v-img>
          </v-col>
          <v-col cols="2" align-self="center">
            <v-icon color="white" icon="mdi-close"></v-icon>
          </v-col>
          <v-col cols="5">
            <v-img :src="rightImage"></v-img>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
  import { mapGetters, mapMutations } from "vuex";
  import { readFileAsDataURL } from "../common/util";
  export default {
    props: {
      neighborId: {
        type: String,
        required: true,
      },
      onDelete: {
        type: Function,
        required: true,
      },
      neighborOptions: {
        type: Array,
        required: true,
      }
    },
    data () { 
      return {
        left: '',
        leftImage: '',
        right: '',
        rightImage: '',
        bgImage: '',
        placeholderImg: 'https://t3.ftcdn.net/jpg/03/45/05/92/360_F_345059232_CPieT8RIWOUk4JqBkkWkIETYAkmz2b75.jpg'
      }
    },
    watch: {
      left(newLeft, oldLeft) {
        if (newLeft !== oldLeft) {
          this.loadImage(this.left).then((img) => {
            this.leftImage = img;
          });
          this.commitNeighborData();
        }
      },
      right(newRight, oldRight) {
        if (newRight !== oldRight) {
          this.loadImage(this.right).then((img) => {
            this.rightImage = img;
          });
          this.commitNeighborData();
        }
      }
    },
    mounted: function () {
      const storedNeighbor = this.getNeighbor(this.neighborId);
      if (storedNeighbor) {
        // TODO: load neighbor data
      } else {
        this.commitNeighborData();
      }
      this.leftImage = this.placeholderImg;
      this.rightImage = this.placeholderImg;
    },
    computed: {
      ...mapGetters(["getNeighbor", "getTileAsset"])
    },
    methods: {
      ...mapMutations(["addNeighbor"]),
      async loadImage(position) {
        const loadedImage = await readFileAsDataURL(this.getTileAsset(position));
        console.log("aaa", loadedImage);
        return loadedImage || this.placeholderImg;
      },
      commitNeighborData() {
        this.addNeighbor(
          {
            id: this.neighborId,
            neighbor: {
              left: this.left,
              right: this.right,
            }
          }
        );
      }
    },
  }
</script>
<style scoped>
.float-btn {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
}
</style>
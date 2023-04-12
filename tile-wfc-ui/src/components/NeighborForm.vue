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
              item-title="name"
              item-value="name"
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
              item-title="name"
              item-value="name"
              bg-color="rgba(255, 255, 255, 0.8)"
              variant="plain"
              hide-details
              required
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="5">
            <v-img :src="leftImage" :class="unique ? '' : 'tile-variant-' + leftIndex"></v-img>
          </v-col>
          <v-col cols="2" align-self="center">
            <v-icon color="white" icon="mdi-close"></v-icon>
          </v-col>
          <v-col cols="5">
            <v-img :src="rightImage" :class="unique ? '' : 'tile-variant-' + rightIndex"></v-img>
          </v-col>
        </v-row>
        <v-row align="center" justify="space-between">
          <v-col>
            <v-btn-toggle
              v-model="leftIndex"
              v-if="leftVariants.length > 0"
              color="primary"
              mandatory
              density="compact"
            >
              <v-btn
                v-for="i in leftVariants"
                :value="i"
                :icon="'mdi-numeric-' + i"
                density="compact"
                height="28"
                width="28"
              ></v-btn>
            </v-btn-toggle> 
          </v-col>
          <v-col>
            <v-btn-toggle
              v-model="rightIndex"
              v-if="rightVariants.length > 0"
              color="primary"
              mandatory
              density="compact"
            >
              <v-btn
                v-for="i in rightVariants"
                :value="i"
                :icon="'mdi-numeric-' + i"
                density="compact"
                height="28"
                width="28"
              ></v-btn>
            </v-btn-toggle> 
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
      },
      unique: {
        type: Boolean,
        default: false,
      },
    },
    data () { 
      return {
        left: '',
        leftImage: '',
        leftIndex: 0,
        right: '',
        rightImage: '',
        rightIndex: 0,
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
          this["leftIndex"] = 0;
          this.commitNeighborData();
        }
      },
      right(newRight, oldRight) {
        if (newRight !== oldRight) {
          this.loadImage(this.right).then((img) => {
            this.rightImage = img;
          });
          this["rightIndex"] = 0;
          this.commitNeighborData();
        }
      },
      leftIndex(newIndex, oldIndex) {
        if (newIndex !== oldIndex) {
          this.commitNeighborData();
          if (this.unique) {
            this.loadImage(this.left, newIndex).then((img) => {
              this.leftImage = img;
            });
          }
        }
      },
      rightIndex(newIndex, oldIndex) {
        if (newIndex !== oldIndex) {
          this.commitNeighborData();
          if (this.unique) {
            this.loadImage(this.right, newIndex).then((img) => {
              this.rightImage = img;
            });
          }
        }
      },
    },
    mounted: function () {
      const storedNeighbor = this.getNeighbor(this.neighborId);
      if (storedNeighbor) {
        [this.left, this.leftIndex] = storedNeighbor.left.split(" ");
        [this.right, this.rightIndex] = storedNeighbor.right.split(" ");
        if (!this.leftIndex) {
          this.leftIndex = 0;
        }
        if (!this.rightIndex) {
          this.rightIndex = 0;
        }
      } else {
        this.left = this.neighborOptions[0].name;
        this.right = this.neighborOptions[0].name;
        this.commitNeighborData();
      }
      this.loadImage(this.left, this.leftIndex).then((img) => {
        this.leftImage = img;
      });
      this.loadImage(this.right, this.rightIndex).then((img) => {
        this.rightImage = img;
      });
    },
    computed: {
      ...mapGetters(["getNeighbor", "getTileAsset"]),
      leftVariants() {
        return this.getTileVariants(this.left);
      },
      rightVariants() {
        return this.getTileVariants(this.right);
      },
    },
    methods: {
      ...mapMutations(["addNeighbor"]),
      getTileVariants(tileName) {
        const tile = this.neighborOptions.find((option) => option.name === tileName);
        if (!tile) {
          return [];
        }
        switch (tile.symmetry) {
          case "T":
            return [0, 1, 2, 3];
          case "I":
            return [0, 1];
          case "L":
            return [0, 1, 2, 3];
          case "F":
            return [0, 1, 2, 3, 4, 5, 6, 7];
          case "\\":
            return [0, 1];
          default:
            return [];
        }
      },
      async loadImage(position, index=0) {
        const loadedImage = await readFileAsDataURL(this.getTileAsset(position, index));
        return loadedImage || this.placeholderImg;
      },
      commitNeighborData() {
        this.addNeighbor(
          {
            id: this.neighborId,
            neighbor: {
              left: `${this.left} ${this.leftIndex}`,
              right: `${this.right} ${this.rightIndex}`,
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

.tile-variant-0 {
  /* none*/
}

.tile-variant-1 {
  transform: rotate(-90deg);
}

.tile-variant-2 {
  transform: rotate(-180deg);
}

.tile-variant-3 {
  transform: rotate(-270deg);
}

.tile-variant-4 {
  transform: scale(-1, 1);
}

.tile-variant-5 {
  transform: rotate(-90deg) scale(-1, 1);
}

.tile-variant-6 {
  transform: rotate(-180deg) scale(-1, 1);
}

.tile-variant-7 {
  transform: rotate(-270deg) scale(-1, 1);
}
</style>
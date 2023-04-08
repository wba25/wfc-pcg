<template>
  <v-card
    width="325px"
    height="325px"
    elevation="6"
    class="overflow-y-auto pa-4 ml-4"
    :image="bgImage"
    color="#bdbdbd"
  >
    <v-card-text>
      <v-form>
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="name"
              label="Nome"
              bg-color="rgba(255, 255, 255, 0.8)"
              variant="plain"
              hide-details
              required
            />
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="symmetry"
              label="Simetria"
              :items="symmetryItems"
              item-title="text"
              item-value="value"
              class="tile-form-input mb-2"
              bg-color="rgba(255, 255, 255, 0.8)"
              variant="plain"
              hide-details
              required
            ></v-select>
          </v-col>
        </v-row>
        <v-slider
          v-model="weight"
          label="Peso"
          thumb-label
          max="1"
          min="0"
          class="tile-form-input"
          bg-color="rgba(255, 255, 255, 0.8)"
          variant="plain"
          hide-details
          required
        >
          <template v-slot:append>
            <v-text-field
              v-model="weight"
              type="number"
              style="width: 60px"
              density="compact"
              hide-details
              max="1"
              min="0"
              class="tile-form-input"
              bg-color="rgba(255, 255, 255, 0.8)"
              variant="plain"
            ></v-text-field>
          </template>
        </v-slider>
        <h4 class="headline my-2">Assets</h4>
        <v-row class="mb-2" align="center" justify="space-between" no-gutters v-for="(file, index) in files">
          <v-col cols="10">
            <v-file-input
              v-model="files[index]"
              placeholder="Selecione uma imagem"
              prepend-icon=""
              density="compact"
              accept="image/*"
              @change="previewFile(files[index])"
              class="tile-form-input"
              bg-color="rgba(255, 255, 255, 0.8)"
              variant="plain"
              hide-details
              required
            ></v-file-input>
          </v-col>
          <v-col class="text-right" cols="2">
            <v-btn density="compact" icon="mdi-minus" @click="files.splice(file, 1)"></v-btn>
          </v-col>
        </v-row>
        <v-btn icon="mdi-plus" class="ml-1" density="compact" @click="files.push(1)"></v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
  import { mapGetters, mapMutations } from "vuex";
  export default {
    props: {
      tileId: {
        type: String,
        required: true,
      }
    },
    data () { 
      return {
        name: "tile",
        symmetry: "X",
        weight: 1,
        files: [],
        bgImage: '',
        symmetryItems: [
          { text: 'L', value: 'L' },
          { text: 'T', value: 'T' },
          { text: 'I', value: 'I' },
          { text: '\\', value: '\\' },
          { text: 'F', value: 'F' },
          { text: 'X', value: 'X' },
        ],
        placeholderImg: 'https://t3.ftcdn.net/jpg/03/45/05/92/360_F_345059232_CPieT8RIWOUk4JqBkkWkIETYAkmz2b75.jpg'
      }
    },
    watch: {
      name(newName, oldName) {
        if (newName !== oldName) {
          this.syncTileData();
        }
      },
      symmetry(newSymmetry, oldSymmetry) {
        if (newSymmetry !== oldSymmetry) {
          this.syncTileData();
        }
      },
      weight(newWeight, oldWeight) {
        if (newWeight !== oldWeight) {
          this.syncTileData();
        }
      },
    },
    mounted: function () {
      this.syncTileData();
    },
    methods: {
      ...mapMutations(["addTile"]),
      syncTileData() {
        this.addTile(
          {
            id: this.tileId,
            tile: {
              name: this.name,
              symmetry: this.symmetry,
              weight: this.weight,
              assets: this.files,
            }
          }
        );
      },
      previewFile(files) {
        const reader = new FileReader();
        reader.addEventListener(
          "load",
          () => {this.bgImage = reader.result;},
          false
        );

        if (files && files[0]) {
          reader.readAsDataURL(files[0]);
        }
      }
    },
  }
</script>
<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center fill-height">
      <v-row class="d-flex align-center justify-center pb-14">
        <v-col cols="auto">
          <h1>
            Gerador de tilemaps com <a href="https://github.com/mxgmn/WaveFunctionCollapse" target="_blank">WFC</a>
          </h1>
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-btn size="large" color="blue" role="link" @click="$router.push('/novo')">Novo</v-btn>
        </v-col>
      </v-row>
      <v-table density="comfortable" fixed-header="true">
        <thead>
          <tr>
            <th>Tileset</th>
            <th>Tiles</th>
            <th>Resultado</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in process"
            :key="item.name"
          >
            <td>{{ item.name }}</td>
            <td>{{ item.tilesize }}</td>
            <td v-if="item.status == 'Done'">
              <a :href="item.resultUrl">download</a>
            </td>
            <td v-else>Not done yet</td>
          </tr>
        </tbody>
      </v-table>
    </v-responsive>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        process: [
          {
            name: 'Castle',
            status: 'Done',
            tilesize: 8,
            resultUrl: 'https://i.imgur.com/4Z0ZQ0M.png',
          },
          {
            name: 'Summer',
            status: 'Pending',
            tilesize: 19,
            resultUrl: '',
          }          
        ],
      }
    },
  }
</script>

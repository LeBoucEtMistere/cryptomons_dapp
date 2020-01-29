<template>
  <v-card>
    <div class="d-flex flex-no-wrap justify-space-between">
      <div>
        <v-card-title class="headline">{{ cryptomon.name }} </v-card-title>

        <v-card-subtitle align="left">
          Pokemon n°{{ cryptomon.pokedex_number }} - NFT
          {{ cryptomon.tokenId }}
        </v-card-subtitle>
        <v-list-item align="left">
          <v-list-item-content>
            <v-list-item-title>ATK: {{ cryptomon.atk }}</v-list-item-title>
            <v-list-item-title>DEF: {{ cryptomon.def }}</v-list-item-title>
            <v-list-item-title>HP: {{ cryptomon.hp }}</v-list-item-title>
            <v-list-item-title
              >Breeding time: {{ cryptomon.capture_rate }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </div>

      <v-avatar class="ma-3" size="170" tile>
        <v-img :src="cryptomon.image_url"></v-img>
      </v-avatar>
    </div> </v-card
></template>
<script>
export default {
  props: {
    cryptomon: { type: Object, required: true }
  }
};
</script>

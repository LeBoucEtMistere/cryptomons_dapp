<template>
  <v-card>
    <div class="d-flex flex-no-wrap justify-space-between">
      <div>
        <v-card-title v-text="cryptomon.name"></v-card-title>

        <v-card-subtitle>NFT n°{{ cryptomon.tokenId }}</v-card-subtitle>
      </div>

      <v-avatar class="ma-3" size="70" tile>
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

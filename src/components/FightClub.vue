<template>
  <v-container>
    <v-list subheader>
      <v-subheader>Fight other trainer's Cryptomons</v-subheader>

      <v-list-item two-lines v-for="token in tokensSorted" :key="token.tokenId">
        <v-list-item-avatar>
          <v-img :src="token.image_url"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="token.name"></v-list-item-title>
          <v-list-item-subtitle>Owner: {{ token.owner }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-chip
          v-if="breedingTokens.includes(token)"
          class="ma-2"
          small
          color="deep-purple"
          text-color="white"
        >
          Breeding
        </v-chip>
        <v-list-item-icon
          ><v-icon color="deep-purple" @click="fight(token.tokenId)"
            >mdi-sword-cross</v-icon
          >
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script>
export default {
  data: () => ({}),
  computed: {
    isOwner() {
      return this.$store.getters.isAdmin;
    },
    tokens() {
      return this.$store.getters["fight/getTokens"];
    },
    tokensSorted() {
      const sorted = this.tokens;
      sorted.sort((a, b) => a.pokedex_number - b.pokedex_number);
      return sorted;
    },
    noTokens() {
      return this.tokens.length === 0;
    },
    breedingTokens() {
      const a = this.$store.getters["fight/getBreedingTokens"];
      // eslint-disable-next-line no-console
      console.log(a);
      if (a) {
        return this.tokens.filter(token => a.includes(token.tokenId));
      } else {
        return [];
      }
    }
  },
  watch: {
    isOwner(newValue) {
      if (!newValue) {
        // eslint-disable-next-line no-console
        this.$router.replace("wallet");
      }
    }
  },
  methods: {
    fight(tokenId) {
      alert(tokenId);
    }
  }
};
</script>

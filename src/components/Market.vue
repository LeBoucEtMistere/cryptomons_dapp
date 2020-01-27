<template>
  <v-container>
    <div v-if="marketEmpty">No Cryptomon listed in the market</div>
    <v-container v-else fluid>
      <v-row>
        <v-col v-for="token in marketSorted" :key="token.tokenId" :cols="3">
          <v-card shaped>
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title
                  class="headline"
                  v-text="token.name"
                ></v-card-title>

                <v-card-subtitle>
                  Pokemon n°{{ token.pokedex_number }} - NFT
                  {{ token.tokenId }}
                </v-card-subtitle>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title
                      v-if="token.estimatedFees + token.price < balance"
                      class="green--text"
                      >Price: {{ token.price }} ETH</v-list-item-title
                    >
                    <v-list-item-title v-else class="red--text"
                      >Price: {{ token.price }} ETH</v-list-item-title
                    >
                    <v-list-item-subtitle
                      >ATK: {{ token.atk }}</v-list-item-subtitle
                    >
                    <v-list-item-subtitle
                      >DEF: {{ token.def }}</v-list-item-subtitle
                    >
                    <v-list-item-subtitle
                      >HP: {{ token.hp }}</v-list-item-subtitle
                    >
                    <v-list-item-subtitle
                      >Breeding time:
                      {{ token.capture_rate }}</v-list-item-subtitle
                    >
                  </v-list-item-content>
                </v-list-item>
              </div>

              <v-avatar class="ma-3" size="175" tile>
                <v-img :src="token.image_url"></v-img>
              </v-avatar>
            </div>

            <v-card-actions>
              <v-btn
                @click="buy(token.tokenId)"
                color="rgba(100,115,201)"
                text
                :disabled="$store.getters['isLoading']"
                ><div>Buy</div>
              </v-btn>
              <v-spacer></v-spacer>

              <!-- <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn> -->
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    selectedToken: null
  }),
  computed: {
    balance() {
      return this.$store.getters["w3/balance"];
    },
    market() {
      return this.$store.getters["market/getListedTokens"];
    },
    marketSorted() {
      const sorted = this.market;
      sorted.sort((a, b) => a.pokedex_number - b.pokedex_number);
      return sorted;
    },
    marketEmpty() {
      return this.market.length === 0;
    }
  },
  methods: {
    buy(tokenId) {
      this.$store.dispatch("market/buyToken", tokenId);
    }
  }
};
</script>

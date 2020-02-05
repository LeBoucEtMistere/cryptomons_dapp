<template>
  <v-container>
    <v-alert v-if="newContentAvailable" type="info" dense prominent>
      <v-row align="center">
        <v-col class="grow"
          >New content available in the market, please refresh to see it.</v-col
        >
        <v-col class="shrink">
          <v-btn color="white" text @click="refreshMarket">Refresh</v-btn>
        </v-col>
      </v-row>
    </v-alert>

    <v-container v-if="marketEmpty" fluid fill-height>
      <v-layout flex align-center justify-center>
        <v-alert type="info">
          No Cryptomon listed on the market yet. Come back later.
        </v-alert>
      </v-layout>
    </v-container>

    <v-container v-else fluid>
      <v-row>
        <v-col
          v-for="token in market"
          :key="token.tokenId"
          :xl="3"
          :lg="4"
          :md="4"
          :sm="12"
        >
          <v-card shaped>
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title class="headline"
                  ><v-progress-circular
                    v-if="loadingTokenIds.includes(token.tokenId)"
                    indeterminate
                    color="blue"
                    size="28"
                    class="mr-2"
                  ></v-progress-circular
                  >{{ token.name }}</v-card-title
                >

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

              <v-avatar class="mr-5 mt-5 mb-2" :size="avatarSize" tile>
                <v-img :src="token.image_url"></v-img>
              </v-avatar>
            </div>

            <v-card-actions>
              <v-btn
                @click="buy(token.tokenId)"
                color="blue"
                text
                :disabled="
                  loadingTokenIds.includes(token.tokenId) ||
                    $store.getters['isLoading']
                "
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
    avatarSize() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "120px";
        case "sm":
          return "150px";
        case "md":
          return "120px";
        case "lg":
          return "130px";
        case "xl":
          return "165px";
        default:
          return "100px";
      }
    },
    newContentAvailable() {
      return this.$store.getters["market/newContentAvailable"];
    },
    balance() {
      return this.$store.getters["w3/balance"];
    },
    market() {
      return this.$store.getters["market/getListedTokens"];
    },
    marketEmpty() {
      return this.market.length === 0;
    },
    loadingTokenIds() {
      return this.$store.getters["market/getLoadingTokenIds"];
    }
  },
  methods: {
    buy(tokenId) {
      this.$store.dispatch("market/buyToken", tokenId);
    },
    refreshMarket() {
      this.$store.dispatch("market/refreshMarket");
    }
  }
};
</script>

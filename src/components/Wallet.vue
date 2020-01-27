<template>
  <v-container>
    <DialogTransfer
      v-if="dialogTransfer"
      @close="dialogTransfer = false"
      @validated="transferValidated"
      :selectedToken="selectedToken"
    />
    <DialogSell
      v-if="dialogSell"
      @close="dialogSell = false"
      @validated="sellValidated"
      :selectedToken="selectedToken"
    />
    <div v-if="walletEmpty">No Cryptomon in your wallet</div>
    <v-container v-else fluid>
      <v-row dense>
        <v-col v-for="token in walletSorted" :key="token.tokenId" :cols="3">
          <v-card>
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
                <v-card-text>
                  ATK: {{ token.atk }} DEF: {{ token.def }} HP:
                  {{ token.hp }}
                </v-card-text>
                <v-card-text
                  >Breeding time: {{ token.capture_rate }}</v-card-text
                >
              </div>

              <v-avatar class="ma-3" size="175" tile>
                <v-img :src="token.image_url"></v-img>
              </v-avatar>
            </div>

            <v-card-actions>
              <v-btn
                v-if="!token.isListed"
                @click="sell(token.tokenId)"
                color="rgba(100,115,201)"
                text
                ><div>Sell</div>
              </v-btn>
              <v-btn
                v-else
                @click="unlistToken(token.tokenId)"
                color="rgba(100,115,201)"
                text
                ><div>Reclaim</div>
              </v-btn>
              <v-btn
                @click="transfer(token.tokenId)"
                color="rgba(100,115,201)"
                text
                :disabled="token.isListed"
                >Transfer</v-btn
              >
              <v-btn
                @click="breed(token.tokenId)"
                color="rgba(100,115,201)"
                text
                :disabled="token.isListed"
                >Breed</v-btn
              >
              <v-spacer></v-spacer>

              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import DialogTransfer from "./DialogTransfer";
import DialogSell from "./DialogSell";

export default {
  components: {
    DialogTransfer,
    DialogSell
  },
  data: () => ({
    dialogTransfer: false,
    dialogSell: false,
    selectedToken: null
  }),
  computed: {
    wallet() {
      return this.$store.getters["wallet/getWallet"];
    },
    walletSorted() {
      const sorted = this.wallet;
      sorted.sort((a, b) => a.pokedex_number - b.pokedex_number);
      return sorted;
    },
    walletEmpty() {
      return this.wallet.length === 0;
    }
  },
  methods: {
    sell(tokenId) {
      this.selectedToken = tokenId;
      this.dialogSell = true;
    },
    sellValidated(price) {
      this.$store.dispatch("wallet/listToken", {
        tokenId: this.selectedToken,
        price: price
      });
      this.selectedToken = null;
    },
    unlistToken(tokenId) {
      this.$store.dispatch("wallet/unlistToken", { tokenId: tokenId });
    },
    transfer(tokenId) {
      this.selectedToken = tokenId;
      this.dialogTransfer = true;
    },
    transferValidated(to) {
      this.$store.dispatch("wallet/transferToken", {
        tokenId: this.selectedToken,
        to: to
      });
      this.selectedToken = null;
    },
    breed(tokenId) {
      alert("breed", tokenId);
    }
  }
};
</script>

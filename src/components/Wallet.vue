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
    <div v-if="walletEmpty && !isLoading">
      No Cryptomon in your wallet
    </div>
    <v-container v-else fluid>
      <v-row>
        <v-col v-for="token in walletSorted" :key="token.tokenId" :cols="3">
          <v-card shaped>
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title class="headline">{{ token.name }} </v-card-title>

                <v-card-subtitle>
                  Pokemon n°{{ token.pokedex_number }} - NFT
                  {{ token.tokenId }}
                </v-card-subtitle>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>ATK: {{ token.atk }}</v-list-item-title>
                    <v-list-item-title>DEF: {{ token.def }}</v-list-item-title>
                    <v-list-item-title>HP: {{ token.hp }}</v-list-item-title>
                    <v-list-item-title
                      >Breeding time:
                      {{ token.capture_rate }}</v-list-item-title
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
                v-if="!token.isListed"
                @click="sell(token.tokenId)"
                color="rgba(100,115,201)"
                :disabled="isLoading"
                text
                ><div>Sell</div>
              </v-btn>
              <v-btn
                v-else
                @click="unlistToken(token.tokenId)"
                color="rgba(100,115,201)"
                :disabled="isLoading"
                text
                ><div>Reclaim</div>
              </v-btn>
              <v-btn
                @click="transfer(token.tokenId)"
                color="rgba(100,115,201)"
                text
                :disabled="token.isListed || isLoading"
                >Transfer</v-btn
              >
              <v-btn
                @click="breed(token.tokenId)"
                color="rgba(100,115,201)"
                text
                :disabled="token.isListed || isLoading"
                >Breed</v-btn
              >
              <v-spacer></v-spacer>
              <v-chip
                v-if="token.isListed"
                class="ma-2"
                small
                color="green"
                text-color="white"
              >
                On Sell
              </v-chip>
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
    },
    isLoading() {
      return this.$store.getters["isLoading"];
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

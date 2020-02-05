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
    <HatchedDialog
      v-if="hatchDialog"
      @close="$store.dispatch('breed/resetHatchDialog')"
      :parent1="parent1"
      :parent2="parent2"
      :child="child"
    >
    </HatchedDialog>
    <v-container v-if="walletEmpty && !isLoading" fluid fill-height>
      <v-layout flex align-center justify-center>
        <v-alert type="info">
          No Cryptomon in your wallet yet. Go to the marketplace to buy some.
        </v-alert>
      </v-layout>
    </v-container>

    <v-container v-else fluid>
      <v-row>
        <v-col
          v-for="token in wallet"
          :key="token.tokenId"
          :xl="3"
          :lg="4"
          :md="4"
          :sm="12"
        >
          <v-card
            shaped
            :raised="breedSelectedToken.includes(token.tokenId)"
            :color="
              breedSelectedToken.includes(token.tokenId)
                ? 'rgba(66, 165, 245, 0.15)'
                : 'white'
            "
          >
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
                  >{{ token.name }}
                </v-card-title>

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

              <v-avatar class="mr-5 mt-5 mb-2" :size="avatarSize" tile>
                <v-img :src="token.image_url"></v-img>
              </v-avatar>
            </div>

            <v-card-actions>
              <v-btn
                v-if="!listedTokenIds.includes(token.tokenId)"
                @click="sell(token.tokenId)"
                color="blue"
                :disabled="loadingTokenIds.includes(token.tokenId) || isLoading"
                text
                ><div>Sell</div>
              </v-btn>
              <v-btn
                v-else
                @click="unlistToken(token.tokenId)"
                color="blue"
                :disabled="loadingTokenIds.includes(token.tokenId) || isLoading"
                text
                ><div>Reclaim</div>
              </v-btn>
              <v-btn
                @click="transfer(token.tokenId)"
                color="blue"
                text
                :disabled="
                  loadingTokenIds.includes(token.tokenId) ||
                    listedTokenIds.includes(token.tokenId) ||
                    isLoading
                "
                >Transfer</v-btn
              >
              <v-btn
                v-if="hatchableTokens.includes(token)"
                @click="hatch()"
                color="blue"
                text
                :disabled="
                  loadingTokenIds.includes(token.tokenId) ||
                    listedTokenIds.includes(token.tokenId) ||
                    isLoading
                "
                >Hatch</v-btn
              >
              <div v-else>
                <v-btn
                  v-if="!breedSelectedToken.includes(token.tokenId)"
                  @click="breedSelect(token.tokenId)"
                  color="blue"
                  text
                  :disabled="
                    loadingTokenIds.includes(token.tokenId) ||
                      listedTokenIds.includes(token.tokenId) ||
                      isLoading ||
                      isBreedingAlready
                  "
                  >Select</v-btn
                >

                <v-btn
                  v-else
                  @click="breedUnselect(token.tokenId)"
                  color="blue"
                  text
                  :disabled="
                    loadingTokenIds.includes(token.tokenId) ||
                      listedTokenIds.includes(token.tokenId) ||
                      isLoading
                  "
                  >Unselect</v-btn
                >
              </div>

              <v-spacer></v-spacer>
              <v-chip
                v-if="listedTokenIds.includes(token.tokenId)"
                class="ma-2"
                small
                color="green"
                text-color="white"
              >
                On Sell
              </v-chip>
              <v-chip
                v-if="breedingTokens.includes(token)"
                class="ma-2"
                small
                color="deep-purple"
                text-color="white"
              >
                Breeding
              </v-chip>
              <v-chip
                v-if="hatchableTokens.includes(token)"
                class="ma-2"
                small
                color="orange"
                text-color="white"
              >
                Ready to Hatch
              </v-chip>
              <!-- <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn> -->
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-bottom-sheet v-model="sheet" hide-overlay persistent no-click-animation>
      <v-sheet class="text-center" height="110px">
        <v-row align="center">
          <v-col :cols="5" class="display-1 font-weight-light">
            {{ cryptomonName(breedSelectedToken[0]) }}
          </v-col>
          <v-col :cols="2">
            <v-btn
              x-large
              class="ma-6"
              text
              outlined
              color="blue"
              @click="doBreed()"
              >Breed</v-btn
            >
          </v-col>
          <v-col :cols="5" class="display-1 font-weight-light">
            {{ cryptomonName(breedSelectedToken[1]) }}
          </v-col>
        </v-row>
      </v-sheet>
    </v-bottom-sheet>
  </v-container>
</template>

<script>
/* eslint-disable no-console */

import DialogTransfer from "./DialogTransfer";
import DialogSell from "./DialogSell";
import HatchedDialog from "./HatchedDialog";

export default {
  components: {
    DialogTransfer,
    DialogSell,
    HatchedDialog
  },
  data: () => ({
    dialogTransfer: false,
    dialogSell: false,
    selectedToken: null,
    breedSelectedToken: [],
    sheet: false
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
    wallet() {
      return this.$store.getters["wallet/getWallet"];
    },
    listedTokenIds() {
      return this.$store.getters["wallet/getListedTokenIds"];
    },
    loadingTokenIds() {
      return this.$store.getters["wallet/getLoadingTokenIds"];
    },
    walletEmpty() {
      return this.wallet.length === 0;
    },
    isLoading() {
      return this.$store.getters["isLoading"];
    },
    breedingTokens() {
      const a = this.$store.getters["breed/getBreedingTokens"];
      if (a) {
        return this.wallet.filter(token => a.includes(token.tokenId));
      } else {
        return [];
      }
    },
    isBreedingAlready() {
      return this.breedingTokens.length > 0;
    },
    hatchableTokens() {
      const a = this.$store.getters["breed/getLastHatched"];
      if (a) {
        return this.wallet.filter(token => a.includes(token.tokenId));
      } else {
        return [];
      }
    },
    parent1() {
      const id = this.$store.getters["breed/getParent1"];
      return this.wallet.filter(token => token.tokenId === id)[0];
    },
    parent2() {
      const id = this.$store.getters["breed/getParent2"];
      return this.wallet.filter(token => token.tokenId === id)[0];
    },
    child() {
      const id = this.$store.getters["breed/getChild"];
      return this.wallet.filter(token => token.tokenId === id)[0];
    },
    hatchDialog() {
      return (
        this.$store.getters["breed/showHatchDialog"] && this.child !== undefined
      );
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
    breedSelect(tokenId) {
      this.breedSelectedToken.push(tokenId);
      if (this.breedSelectedToken.length == 3) {
        this.breedSelectedToken.shift();
      }
      if (this.breedSelectedToken.length == 2) {
        this.sheet = true;
      }
    },
    breedUnselect(tokenId) {
      this.breedSelectedToken.splice(
        this.breedSelectedToken.indexOf(tokenId),
        1
      );
      if (this.breedSelectedToken.length < 2) {
        this.sheet = false;
      }
    },
    doBreed() {
      this.$store.dispatch("breed/breed", this.breedSelectedToken);
      this.sheet = false;
      this.breedSelectedToken = [];
    },
    cryptomonName(tokenId) {
      for (const token of this.wallet) {
        if (token.tokenId === tokenId) {
          return token.name;
        }
      }
    },
    hatch() {
      this.$store.dispatch(
        "breed/hatch",
        this.$store.getters["breed/getLastHatched"]
      );
    }
  }
};
</script>

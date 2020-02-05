<template>
  <v-container width="90vw">
    <v-row>
      <v-col cols="5">
        <v-list subheader>
          <v-subheader>Pick your attacker Cryptomon</v-subheader>
          <v-list-item-group
            v-model="attackerIndex"
            value="tokenId"
            color="blue lighten-1"
          >
            <v-list-item
              two-lines
              v-for="token in walletSorted"
              :key="token.tokenId"
            >
              <v-list-item-avatar>
                <v-img :src="token.image_url"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-text="token.name"></v-list-item-title>
                <v-list-item-subtitle
                  >ATK: {{ token.atk }}</v-list-item-subtitle
                >
              </v-list-item-content>
              <v-chip
                v-if="myBreedingTokens.includes(token)"
                class="ma-2"
                small
                color="deep-purple"
                text-color="white"
              >
                Breeding
              </v-chip>
              <v-list-item-icon
                ><v-icon
                  color="blue"
                  :small="attacker !== token.tokenId"
                  :disabled="attacker !== token.tokenId"
                  >mdi-sword-cross</v-icon
                >
              </v-list-item-icon>
            </v-list-item>
          </v-list-item-group>
        </v-list></v-col
      >
      <v-col cols="2"> => </v-col>
      <v-col cols="5"
        ><v-list subheader>
          <v-subheader>And fight other trainer's Cryptomons</v-subheader>
          <v-list-item-group
            v-model="defenderIndex"
            value="tokenId"
            color="blue lighten-1"
          >
            <v-list-item
              two-lines
              v-for="token in tokensSorted"
              :key="token.tokenId"
            >
              <v-list-item-avatar>
                <v-img :src="token.image_url"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-text="token.name"></v-list-item-title>
                <v-list-item-subtitle
                  >DEF: {{ token.def }}</v-list-item-subtitle
                >
                <v-list-item-subtitle
                  >Owner: {{ token.owner }}</v-list-item-subtitle
                >
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
                ><v-icon
                  color="blue"
                  :small="defender !== token.tokenId"
                  :disabled="defender !== token.tokenId"
                  >mdi-sword-cross</v-icon
                >
              </v-list-item-icon>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
    </v-row>
    <v-bottom-sheet v-model="sheet" hide-overlay persistent no-click-animation>
      <v-sheet class="text-center" height="110px">
        <v-row align="center">
          <v-col :cols="5" class="display-1 font-weight-light">
            {{ attackerName(attacker) }}
          </v-col>
          <v-col :cols="2">
            <v-btn
              x-large
              class="ma-6"
              text
              outlined
              color="blue"
              @click="fight(attacker, defender)"
              >Fight!</v-btn
            >
          </v-col>
          <v-col :cols="5" class="display-1 font-weight-light">
            {{ defenderName(defender) }}
          </v-col>
        </v-row>
      </v-sheet>
    </v-bottom-sheet>
    <div class="text-center">
      <v-snackbar v-model="snackbar" :timeout="timeout">
        {{ text }}
        <v-btn color="blue" text @click="snackbar = false">
          Close
        </v-btn>
      </v-snackbar>
    </div>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    attackerIndex: undefined,
    defenderIndex: undefined,
    snackbar: false,
    text: "",
    timeout: 4000
  }),
  computed: {
    tokens() {
      return this.$store.getters["fight/getTokens"];
    },
    tokensSorted() {
      const sorted = this.tokens;
      sorted.sort((a, b) => a.pokedex_number - b.pokedex_number);
      return sorted;
    },
    wallet() {
      return this.$store.getters["wallet/getWallet"].filter(
        token => !this.myBreedingTokens.includes(token.tokenId)
      );
    },
    walletSorted() {
      const sorted = this.wallet;
      sorted.sort((a, b) => a.pokedex_number - b.pokedex_number);
      return sorted;
    },
    walletEmpty() {
      return this.wallet.length === 0;
    },
    myBreedingTokens() {
      const a = this.$store.getters["breed/getBreedingTokens"];
      if (a) {
        return a;
      } else {
        return [];
      }
    },
    noTokens() {
      return this.tokens.length === 0;
    },
    breedingTokens() {
      const a = this.$store.getters["fight/getBreedingTokens"];
      if (a) {
        return this.tokens.filter(token => a.includes(token.tokenId));
      } else {
        return [];
      }
    },
    sheet() {
      return this.attacker !== null && this.defender !== null;
    },
    attacker() {
      if (this.attackerIndex !== undefined && this.walletSorted !== []) {
        return this.walletSorted[this.attackerIndex].tokenId;
      } else {
        return null;
      }
    },
    defender() {
      if (this.defenderIndex !== undefined && this.tokensSorted !== []) {
        return this.tokensSorted[this.defenderIndex].tokenId;
      } else {
        return null;
      }
    },
    fighted() {
      return this.$store.getters["fight/getFighted"];
    },
    lastFight() {
      return this.$store.getters["fight/getLastFight"];
    }
  },
  watch: {
    fighted(newValue) {
      if (newValue) {
        this.text = this.lastFight ? "You winned !" : "You lost ...";
        this.snackbar = true;
      } else {
        this.snackbar = false;
      }
    }
  },

  methods: {
    fight(attacker, defender) {
      this.$store.dispatch("fight/fight", {
        attacker: attacker,
        defender: defender
      });
      this.attackerIndex = undefined;
      this.defenderIndex = undefined;
    },
    attackerName(tokenId) {
      for (const token of this.wallet) {
        if (token.tokenId === tokenId) {
          return token.name;
        }
      }
    },
    defenderName(tokenId) {
      for (const token of this.tokens) {
        if (token.tokenId === tokenId) {
          return token.name;
        }
      }
    }
  }
};
</script>

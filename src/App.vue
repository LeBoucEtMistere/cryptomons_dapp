<template>
  <v-app id="inspire">
    <v-app-bar
      app
      color="primary"
      dark
      shrink-on-scroll
      prominent
      fade-img-on-scroll
      src="@/assets/banner.png"
    >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to bottom, rgba(0,0,0,0), rgba(0,0,0,0.3)"
        ></v-img>
      </template>

      <v-spacer></v-spacer>

      <template v-slot:extension>
        <v-tabs align-with-title background-color="transparent">
          <v-tab to="/wallet">My Cryptomons</v-tab>
          <v-tab to="/market">Marketplace</v-tab>
          <v-tab to="/fightclub">Fight Club</v-tab>
          <v-tab v-if="isAdmin" to="/admin">Admin</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-content>
      <v-dialog v-model="isLoading" overlay persistent width="350">
        <v-card>
          <v-card-text>
            Fetching information from the blockchain...
            <v-progress-linear
              indeterminate
              color="secondary"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
      <router-view />
    </v-content>

    <v-footer color="primary" app>
      <span class="white--text">&copy; 2020 Arthur Depasse</span>
      <v-spacer></v-spacer>
      <span class="white--text"
        >{{ web3.balance }} ETH @ {{ web3.address }}</span
      >
    </v-footer>
  </v-app>
</template>

<script>
export default {
  props: {
    source: String
  },
  data: () => ({}),
  computed: {
    web3() {
      return this.$store.state.w3;
    },
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
    isLoading() {
      return this.$store.getters["isLoading"];
    }
  }
};
</script>

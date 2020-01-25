<template>
  <v-app id="inspire">
    <v-app-bar
      app
      color="#6A76AB"
      dark
      shrink-on-scroll
      prominent
      fade-img-on-scroll
      src="http://images.nintendolife.com/505ca16081ae5/best-pokemon-games.original.jpg"
    >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
        ></v-img>
      </template>

      <v-toolbar-title>Cryptomons</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>

      <template v-slot:extension>
        <v-tabs align-with-title background-color="transparent">
          <v-tab to="/wallet">My Cryptomons</v-tab>
          <v-tab to="/market">Marketplace</v-tab>
          <v-tab v-if="isAdmin" to="/admin">Admin</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-content>
      <router-view />
    </v-content>

    <v-footer color="rgba(100,115,201)" app>
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
    }
  }
};
</script>

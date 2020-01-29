<template>
  <v-container>
    <h1>Admin</h1>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    hatchDialog: true
  }),
  computed: {
    isOwner() {
      return this.$store.getters.isAdmin;
    },
    parent1() {
      return {
        atk: 62,
        def: 63,
        hp: 60,
        name: "Ivysaur",
        capture_rate: 45,
        image_url:
          "https://morning-springs-53559.herokuapp.com/cryptomon/images/2.png",
        pokedex_number: 2,
        tokenId: 1,
        isListed: false
      };
    },
    parent2() {
      return {
        atk: 52,
        def: 43,
        hp: 39,
        name: "Charmander",
        capture_rate: 45,
        image_url:
          "https://morning-springs-53559.herokuapp.com/cryptomon/images/4.png",
        pokedex_number: 4,
        tokenId: 2,
        isListed: false
      };
    },
    child() {
      return {
        atk: 62,
        def: 63,
        hp: 60,
        name: "Ivysaur",
        capture_rate: 45,
        image_url:
          "https://morning-springs-53559.herokuapp.com/cryptomon/images/2.png",
        pokedex_number: 2,
        tokenId: 3,
        isListed: false
      };
    }
  },
  watch: {
    isOwner(newValue) {
      if (!newValue) {
        // eslint-disable-next-line no-console
        this.$router.replace("wallet");
      }
    }
  }
};
</script>

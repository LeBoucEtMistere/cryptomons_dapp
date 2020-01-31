<template>
  <v-container>
    <h1>Admin</h1>
  </v-container>
</template>

<script>
export default {
  data: () => ({}),
  computed: {
    isOwner() {
      return this.$store.getters.isAdmin;
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

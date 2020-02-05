<template>
  <v-container>
    <h1>Mint new tokens out of thin air 😇</h1>

    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="address"
        :rules="addressRules"
        label="Address of receiver"
        required
      ></v-text-field>

      <v-text-field
        v-model="cmNumber"
        :rules="cmNumberRules"
        label="Cryptomon pokedex number"
        type="number"
        required
      ></v-text-field>

      <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">
        Validate
      </v-btn>

      <v-btn color="error" class="mr-4" @click="reset">
        Reset Form
      </v-btn>

      <v-btn color="warning" @click="resetValidation">
        Reset Validation
      </v-btn>
    </v-form>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    valid: true,
    address: "",
    addressRules() {
      return [
        v => !!v || "Address is required",
        v =>
          (v && this.$store.state.w3.instance().utils.isAddress(v)) ||
          "You must input a valid ETH address"
      ];
    },
    cmNumber: "",
    cmNumberRules: [
      v => !!v || "Cryptomon pokedex number is required",
      v =>
        (1 <= v && v <= 151) ||
        "Cryptomon pokedex number must be between 1 and 151"
    ]
  }),

  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("mintToken", {
          to: this.address,
          uri: `https://morning-springs-53559.herokuapp.com/cryptomon/meta/${this.cmNumber}`
        });
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    }
  },
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

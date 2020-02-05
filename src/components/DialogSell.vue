<template>
  <v-dialog value="true" width="40vw" @click:outside="$emit('close')">
    <v-card>
      <v-card-title class="headline"
        >Selling NFT {{ selectedToken }}</v-card-title
      >

      <v-card-text>
        Please enter the price for your NFT (in Ether):

        <v-form
          @submit.prevent="validate"
          ref="form"
          v-model="priceValid"
          lazy-validation
        >
          <v-text-field
            autofocus
            v-model="price"
            :rules="priceRules"
            label="Price"
            color="blue"
            type="number"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="blue" text @click="cancel">
          Cancel
        </v-btn>

        <v-btn :disabled="!priceValid" color="blue" text @click="validate">
          Sell
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["selectedToken"],
  data: () => ({
    priceValid: false,
    price: ""
  }),
  computed: {
    priceRules() {
      return [
        v => !!v || "price is required",
        v => (v && v >= 0.001) || "You must input a price superior to 0.001 ETH"
      ];
    }
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.$emit("validated", this.price);
        this.$emit("close");
        this.$refs.form.resetValidation();
        this.price = "";
      }
    },
    cancel() {
      this.$emit("close");
      this.$refs.form.reset();
      this.price = "";
      this.$refs.form.resetValidation();
    }
  }
};
</script>

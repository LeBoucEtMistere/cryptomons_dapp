<template>
  <v-dialog value="true" width="40vw" @click:outside="$emit('close')">
    <v-card>
      <v-card-title class="headline"
        >Transfering NFT {{ selectedToken }}</v-card-title
      >

      <v-card-text>
        Please enter the account address to which you want to transfer this NFT:

        <v-form ref="form" v-model="addressValid" lazy-validation>
          <v-text-field
            v-model="address"
            :rules="addressRules"
            label="Address"
            color="rgba(100,115,201)"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="rgba(100,115,201)" text @click="cancel">
          Cancel
        </v-btn>

        <v-btn
          :disabled="!addressValid"
          color="rgba(100,115,201)"
          text
          @click="validate"
        >
          Transfer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["selectedToken"],
  data: () => ({
    addressValid: false,
    address: ""
  }),
  computed: {
    addressRules() {
      return [
        v => !!v || "Address is required",
        v =>
          (v && this.$store.state.w3.instance().utils.isAddress(v)) ||
          "You must input a valid ETH address"
      ];
    }
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.$emit("validated", this.address);
        this.$emit("close");
        this.$refs.form.resetValidation();
        this.address = "";
      }
    },
    cancel() {
      this.$emit("close");
      this.$refs.form.reset();
      this.address = "";
      this.$refs.form.resetValidation();
    }
  }
};
</script>

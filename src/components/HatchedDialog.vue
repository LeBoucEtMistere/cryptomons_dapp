<template>
  <v-dialog value="true" width="50vw" @click:outside="$emit('close')">
    <v-card>
      <v-card-title color="blue" class="justify-center"
        >🎉 You cryptomon egg hatched ! 🎉</v-card-title
      >
      <v-container>
        <v-row class=" ml-12 mr-12">
          <v-col cols="5">
            <SmallCryptomonCard :cryptomon="parent1" />
          </v-col>
          <v-col cols="2" align="center" justify="center">
            <v-container class="pt-6 display-1">+</v-container>
          </v-col>
          <v-col cols="5">
            <SmallCryptomonCard :cryptomon="parent2" />
          </v-col>
        </v-row>
        <v-row class="ml-12 mr-12">
          <v-col cols="12" align="center" justify="center">
            <v-container class=""
              ><v-icon x-large>mdi-arrow-down-bold</v-icon></v-container
            >
          </v-col>
        </v-row>
        <v-row class="ml-36 mr-36">
          <v-col cols="3" />
          <v-col cols="6" align="center" justify="center">
            <LargeCryptomonCard :cryptomon="child" />
          </v-col>
          <v-col cols="3" />
        </v-row>
      </v-container>
      <v-card-actions>
        <v-spacer />
        <v-btn x-large color="blue" text @click="$emit('close')">
          Nice !
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import SmallCryptomonCard from "./SmallCryptomonCard";
import LargeCryptomonCard from "./LargeCryptomonCard";

export default {
  components: {
    SmallCryptomonCard,
    LargeCryptomonCard
  },
  props: {
    parent1: {
      type: Object,
      required: true
    },
    parent2: {
      type: Object,
      required: true
    },
    child: {
      type: Object,
      required: true
    }
  }
};
</script>

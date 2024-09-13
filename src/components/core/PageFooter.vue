<template>
           <v-footer dark height="auto" class="mt-auto">
        <v-card class="flex" flat tile :color="$root.themeColorFooter">
          <v-card-actions class="black--text justify-center">
            &copy; copyright 2024 by I.P.One Co., Ltd.
          </v-card-actions>
        </v-card>
           <v-btn 
           v-if="!manualPDF"
          color="primary" 
          fab
          small 
          dark 
          @click="scrollToTop"
          class="scroll-to-top"
        >
        <v-icon>mdi-arrow-up</v-icon>
      </v-btn>
    </v-footer>
</template>

<script>
import { sync } from "vuex-pathify";

export default {
    computed: {
        ...sync("*"),
    },
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
</script>

<style scoped>
.scroll-to-top {
  position: fixed;
  bottom: 5%;
  right: 40px;
  transform: translateY(65%);
  z-index: 1000;
}
.v-btn:hover:before {
  color: transparent !important;
}
</style>

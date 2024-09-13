<template>
  <v-dialog v-model="dialog" fullscreen persistent hide-overlay @click:outside="close" style="z-index: 2000;"> 
    <v-layout>
      <v-flex md12>
        <div style="height: 100vh; overflow-y: auto;">
          <v-toolbar id="toolbar-pdf-preview" color="primary" style="position: fixed; width: 100%; z-index: 1000;">
            <v-layout align-center>
              <v-btn icon @click="close">
                <v-icon color="white">mdi-keyboard-backspace</v-icon>
              </v-btn>
              <v-toolbar-title style="color: white">User Manual</v-toolbar-title>
            </v-layout>
          </v-toolbar>

          <vue-pdf
            v-for="i in numPages"
            :key="i"
            :src="src"
            :page="i"
            style="display: inline-block; width: 100%"
          ></vue-pdf>
        </div>
      </v-flex>
    </v-layout>
  </v-dialog>
</template>

<script>
import vuePdf from "vue-pdf";

export default {
  components: {
    vuePdf,
  },
  name: "PdfPreview",
  data() {
    return {
      dialog: true,
      src: "",
      numPages: undefined,
    };
  },
  async mounted() {
    await this.openPdf();
  },

  methods: {
    async openPdf() {
      this.src = vuePdf.createLoadingTask(
        "https://portal.ip-one.com/payinForm/manualPdf/PayIn.pdf"
      );
      await this.src.promise.then((vuePdf) => {
        this.numPages = vuePdf.numPages;
      });
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.openPdf();
        this.dialog = true;
      });
      this.$emit("btncallback");
    },
  },
};
</script>

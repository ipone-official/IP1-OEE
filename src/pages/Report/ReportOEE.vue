<template>
  <div style="margin: 1rem">

  <v-layout justify-end>
    <v-btn
    color="primary"
    @click="openNewTab"
  >
    <v-icon left>mdi-file-document-edit</v-icon>
    Target OEE
  </v-btn>
  </v-layout>
    <iframe
      v-if="iframeSrc"
      :src="iframeSrc"
      width="100%"
      height="650"
      border="0"
      scrolling="no"
      marginheight="0"
      marginwidth="0"
      frameborder="0"
      style="float: left; margin-left: 0px"
      allowfullscreen="true"
      webkitallowfullscreen="true"
      mozallowfullscreen="true"
    >
    </iframe>
    <v-toolbar xs12 sm8 color="#f8c849" dark tabs v-if="!iframeSrc">
      <v-layout justify-center style="font-size: larger"> Can't get report </v-layout>
    </v-toolbar>
  </div>
</template>

<script>
import axios from "axios";
import { sync } from "vuex-pathify";

export default {
  components: {
  },

  data() {
    return {
    
      iframeSrc: "https://app.powerbi.com/view?r=eyJrIjoiZTAxNTBlZDgtZGZjZC00ODJhLWIxMDQtMWEyZGY5YmU2MDc4IiwidCI6IjQwODIyY2I0LTJmOWEtNDM4ZS1iODAzLWZlZjZhNzJkNGQyZCIsImMiOjEwfQ%3D%3D",
    };
  },
  computed: {
    ...sync("*"),
  },
  async created() {
    this.$store.commit("resetState");
    if (!localStorage.getItem("samAccountOEE")) return false;
    await this.getUser(localStorage.getItem("samAccountOEE"));
  },
  methods: {
    async getUser(username) {
      try {
        const getUserAd = {
          username: username,
        };
        const response = await axios.post(
          ` ${this.Endpoint}/ApiPortal/Ads/v1/ADsGetUser`,
          getUserAd
        );
        if (!response.data.locked) {
          this.infoLogin.name = response.data.name;
          this.infoLogin.firstName = response.data.firstName;
          this.infoLogin.lastName = response.data.lastName;
          this.infoLogin.email = response.data.email;
          this.infoLogin.empId = response.data.empId;
          this.infoLogin.locked = response.data.locked;
          this.infoLogin.samAccount = response.data.samAccount;
        }
      } catch (error) {
        console.error(error);
      }
    },
    openNewTab() {
      window.open('https://iphouses.sharepoint.com/:x:/r/sites/oee/_layouts/15/Doc.aspx?sourcedoc=%7B35684A47-4531-4AED-992D-6318C0826BC5%7D&file=TargetLineProcess.xlsx&action=default&mobileredirect=true', '_blank');
    }
  },
};
</script>

<style scoped>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.5;
  position: absolute;
  width: 100%;
}
</style>

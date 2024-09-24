<template>
  <div style="margin: 1rem">
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

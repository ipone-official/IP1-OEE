<template>
  <div>
    <template v-if="!$route.meta.allowAnonymous">
      <v-app id="inspire">
        <toolbar @toggleNavigationBar="drawer = !drawer" />
        <navigation :toggle="drawer" />
        <!-- @mousemove="resetTimer" @keypress="resetTimer" @click="resetTimer" -->
        <v-content>
          <breadcrumbs />
          <router-view />
        </v-content>
        <page-footer />
      </v-app>
    </template>

    <template v-else>
      <transition>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
    </template>
  </div>
</template>

<script>
import { sync } from "vuex-pathify";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "App",
  data() {
    return {
      inactivityTimer: null,
    };
  },
  computed: {
    ...sync("*"),
  },
  watch: {
    drawer(val) {
      this.toggle = val;
    },
  },
  async mounted() {
    if (!localStorage.getItem("samAccountOEE")) {
      localStorage.removeItem("samAccountOEE");
      localStorage.removeItem("selectedIndexOEE");
      localStorage.removeItem("empIdOEE");
      localStorage.removeItem("routeNameOEE");
      this.$router.push({ name: "Login" });
    } else {
      this.$store.commit("resetState");
      await this.getImageProfile(localStorage.getItem("empIdOEE"));
      await this.getUser(localStorage.getItem("samAccountOEE"));
      this.$router.push({ name: localStorage.getItem("routeNameOEE") });
      this.selectedIndexStr = Number(localStorage.getItem("selectedIndexOEE"));
      // Start the inactivity timer
      this.startInactivityTimer();
      window.addEventListener("mousemove", this.resetTimer);
      window.addEventListener("keypress", this.resetTimer);
      window.addEventListener("click", this.resetTimer);
    }
  },
  beforeDestroy() {
    window.removeEventListener("mousemove", this.resetTimer);
    window.removeEventListener("keypress", this.resetTimer);
    window.addEventListener("click", this.resetTimer);
    clearTimeout(this.inactivityTimer);
  },
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    startInactivityTimer() {
      this.inactivityTimer = setTimeout(this.logoutUser, 3600000); // 3600000 ms = 60 minutes
    },
    resetTimer() {
      clearTimeout(this.inactivityTimer);
      if (localStorage.getItem("samAccountOEE")) {
        this.startInactivityTimer();
      }
    },
    logoutUser() {
      Swal.fire({
        text: "You have been logged out due to inactivity.",
        icon: "warning",
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonColor: "#0c80c4",
        confirmButtonText: "OK",
      }).then(() => {
        this.$store.commit("resetState");
        localStorage.removeItem("samAccountOEE");
        localStorage.removeItem("selectedIndex");
        localStorage.removeItem("empId");
        localStorage.removeItem("routeName");
        this.$router.push({ name: "Login" });
      });
    },
    async getUser(username) {
      try {
        const getUserAd = {
          username: username,
        };
        const response = await axios.post(
          `${this.EndpointPortal}/adsControl/Ads/v1/ADsGetUser`,
          getUserAd
        );
        if (!response.data.locked) {
          this.infoLogin.name = response.data.name;
          this.infoLogin.firstName = response.data.firstName;
          this.infoLogin.lastName = response.data.lastName;
          this.infoLogin.email = response.data.email;
          this.infoLogin.empId = response.data.empId;
          this.infoLogin.locked = response.data.locked;
          this.infoLogin.group = response.data.group;
          this.infoLogin.samAccount = response.data.samAccount;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getImageProfile(empId) {
      try {
        const response = await axios.get(
          `${this.EndpointPortal}/AdsControl/IP1Potal/v1/getUserProfile?empId=${empId}`
        );
        if (response.data.statusCode.statusCode == 200) {
          this.imageProfile = response.data.results[0].pathUrl;
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style>
@import url("./assets/styles/main.css");

.min-vh-100 {
  min-height: 100vh;
}
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.flex-grow-1 {
  flex-grow: 1;
}
/* Table header styling */
.theme--light.v-table thead th {
  background-image: linear-gradient(270deg, rgba(51, 148, 225, 0.18), transparent);
  background-color: #007fc4 !important;
  font-size: 15px !important;
  color: #ffffff !important;
}

.theme--light.v-datatable thead th.column.sortable.active,
.theme--light.v-datatable thead th.column.sortable.active .v-icon,
.theme--light.v-datatable thead th.column.sortable:hover {
  color: #ffffff !important;
}
</style>

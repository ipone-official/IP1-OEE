<template>
  <div>
    <template v-if="$route.meta.allowAnonymous">
      <transition>
        <keep-alive>
          <router-view />
        </keep-alive>
      </transition>
    </template>

    <!-- สำหรับหน้าอื่นๆ ที่ต้องการล็อกอิน -->
    <template v-else>
      <v-app>
        <!-- แสดง loading จนกว่าข้อมูลผู้ใช้พร้อม -->
        <loading v-if="!infoLogin.isLogin" :isLoading="isLoading" />
        <template v-else>
          <toolbar @toggleNavigationBar="drawer = !drawer" />
          <navigation :toggle="drawer" />
          <v-content>
            <page-breadcrumbs />
            <router-view />
          </v-content>
          <page-footer />
        </template>
      </v-app>
    </template>
  </div>
</template>

<script>
import {
  ValidateJwtToken,
  getUser,
  RenewToken,
  isTokenNearExpiration,
} from "@/services/apiService.js";
import { sync } from "vuex-pathify";
import Swal from "sweetalert2";
import loading from "@/components/Loading.vue";

export default {
  components: {
    loading,
  },
  name: "App",
  data() {
    return {
      isDrawerOpen: true,
      isLoading: false,
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
    if (!this.$route.meta.allowAnonymous) {
      // ตรวจสอบว่าหน้านั้นต้องการการล็อกอินหรือไม่
      if (!localStorage.getItem("accessTokenOee")) {
        this.$router.push({ name: "Login" });
      } else {
        await this.ValidateJwtToken();
      }
    }
  },


  methods: {
    async ValidateJwtToken() {
      this.isLoading = true;
      try {
        const response = await ValidateJwtToken();
        const nameClaim = response.claims.find((claim) => claim.type === "name");
        if (nameClaim) {
          if (isTokenNearExpiration()) {
            // หาก Token ใกล้หมดอายุ ให้ Renew Token
            await RenewToken(localStorage.getItem("refreshTokenOee"));
          }
          await this.getUser(nameClaim.value);
        } else {
          Swal.fire({
            html: `Name claim not found`,
            icon: "warning",
            showCancelButton: false,
            allowOutsideClick: false,
            confirmButtonText: "OK",
          }).then(async (result) => {
            if (result.isConfirmed) {
              localStorage.removeItem("accessTokenOee");
              localStorage.removeItem("refreshTokenOee");

              this.$router.push({ name: "Login" });
            }
          });
        }
      } catch (error) {
        // หากเกิดข้อผิดพลาด ให้แสดงผลข้อความ
        Swal.fire({
          html: `Token is invalid or expired.`,
          icon: "warning",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonText: "OK",
        }).then(async (result) => {
          if (result.isConfirmed) {
            localStorage.removeItem("accessTokenOee");
            localStorage.removeItem("refreshTokenOee");
            this.$router.push({ name: "Login" });
          }
        });
        return;
      } finally {
        // ปิดการแสดงผล Loading ในทุกกรณี
        this.isLoading = false;
      }
    },
    async getUser(username) {
      this.isLoading = true;
      try {
        const response = await getUser(username);
        console.log(response, 'response')
        console.log('getUser', this.infoLogin)
        this.infoLogin.isLogin = true
        this.infoLogin.name = response.name;
        this.infoLogin.firstName = response.firstName;
        this.infoLogin.lastName = response.lastName;
        this.infoLogin.email = response.email;
        this.infoLogin.empId = response.empId;
        this.infoLogin.group = response.group;
        this.infoLogin.samAccount = response.samAccount;
        this.infoLogin.pathUrl = response.pathUrl;
      } catch (error) {
        // หากเกิดข้อผิดพลาด ให้แสดงผลข้อความ
        Swal.fire({
          html: `Error fetching user`,
          icon: "error",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonText: "OK",
        }).then(async (result) => {
          if (result.isConfirmed) {
            this.$router.push({ name: "Login" });
          }
        });
      } finally {
        // ปิดการแสดงผล Loading ในทุกกรณี
        this.isLoading = false;
      }
    },
    toggleDrawer() {
      this.isDrawerOpen = !this.isDrawerOpen;
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

<template>
    <v-app id="login">
        <v-content>
            <v-toolbar :color="$root.themeColor" style="padding: 1rem">
                <img src="static/logo-ipone-white.png" width="60vh"></img>
            </v-toolbar>
            <v-card class="flex" flat tile :color="$root.themeColorFooter">
                <v-card-actions></v-card-actions>
            </v-card>
             <v-container fluid grid-list-xl>
            <v-layout justify-center>
                <v-spacer></v-spacer>
                <v-flex d-flex lg3 sm12 xs12>
                    <v-card class="elevation-1 pa-3" :color="$root.themeColor">
                        <v-card-text>
                            <div class="layout column align-center">
                                <h1 class="flex my-4 white--text">{{ headerProject }}</h1>
                            </div>
                            <v-form>
                                <div class="white--text">Username</div>
                                <v-text-field solo append-icon="person"  placeholder="Username" type="text" v-model="username"   />
                                <div class="white--text">Password</div>
                                <v-text-field solo placeholder="Password" @keyup.enter="login" :type="hidePassword ? 'password' : 'text'" :append-icon="hidePassword ? 'visibility_off' : 'visibility'"  id="password" v-model="password" @click:append="hidePassword = !hidePassword"
                                />
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn round class=" white--text" block :color="$root.themeColorFooter" @click="login">
                                <h3>Login</h3>
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
                <v-spacer></v-spacer>
            </v-layout>
            </v-container>
            <v-snackbar
        v-model="showSnackbar"
        :timeout="6000"
        :color="snackbarColor"
        rounded="pill"
        class="text-center"
      >
        {{ msgSnackbar }}
      </v-snackbar>
    
        </v-content>
            <loading :isLoading="isLoading" />
    </v-app>
</template>

<script>
import { sync } from "vuex-pathify";
import loading from "@/components/Loading.vue";
import { loginUser } from "@/services/apiService.js";

export default {
    components: {
    loading,
  },
    name: "PageLogin",
    data() {
        return {
            username: '',
            password: '',
            hidePassword: true,
            showSnackbar: false,
      msgSnackbar: "",
      snackbarColor: this.$root.themeColorFooter,
      isLoading: false,
        }
    },
    computed: {
        ...sync("*"),
    },
    methods: {
        showError(message, color = this.$root.themeColorFooter) {
      this.msgSnackbar = message;
      this.snackbarColor = color;
      this.showSnackbar = true;
    },

    async login() {
      // ตรวจสอบว่ากรอก Username และ Password หรือไม่
      if (!this.username || !this.password) {
        this.showError("Username and Password can't be null.");
        return;
      }
      // เริ่มการแสดงผล Loading
      this.isLoading = true;
      try {
        // เรียกใช้งานฟังก์ชัน loginUser ด้วยข้อมูล Username และ Password
        const response = await loginUser(this.username, this.password);
        if (!response.locked) {
            this.infoLogin.isLogin = true
            this.infoLogin.name = response.name
            this.infoLogin.firstName = response.firstName
            this.infoLogin.lastName = response.lastName
            this.infoLogin.email = response.email
            this.infoLogin.empId = response.empId
            this.infoLogin.group = response.group
            this.infoLogin.samAccount = response.samAccount
            this.infoLogin.pathUrl = response.pathUrl
          // เก็บ accessToken ใน localStorage สำหรับการตรวจสอบสิทธิ์
          localStorage.setItem("accessTokenOee", response.accessToken);
          localStorage.setItem("refreshTokenOee", response.refreshToken);

          // เปลี่ยนเส้นทางไปยังหน้าหลัก
          this.$router.push({ name: "LineProcessOrder" });
        } else {
          this.showError("Login failed. User locked.", " red");
        }
      } catch (error) {
        // หากเกิดข้อผิดพลาด ให้แสดงผลข้อความ
        this.showError("Login failed. Please check your credentials.", "red");
      } finally {
        // ปิดการแสดงผล Loading ในทุกกรณี
        this.isLoading = false;
      }
    },


    }
}
</script>

<style scoped lang="css">
#login {
    height: 50%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    z-index: 0;
}
</style>

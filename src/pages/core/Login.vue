<template>
  <v-app id="login">
    <!-- Toolbar -->
    <v-toolbar :color="$root.themeColor" class="toolbar">
      <img src="static/logo-ipone-white.png" class="logo" />
    </v-toolbar>

    <!-- Main Content -->
    <v-container fill-height class="container">
      <v-layout align-center justify-center fill-height>
        <v-flex xs12 sm8 md6 lg4>
          <v-layout justify-center>
            <div>
              <img
                src="@/assets/images/OEE Logo_IP1.png"
                alt="User Image"
                class="styled-image animated-image"
              />
            </div>
          </v-layout>
          <v-card class="login-card" :color="$root.themeColor">
            <v-card-text>
              <v-form>
                <div class="white--text">Username</div>
                <v-text-field
                  solo
                  append-icon="person"
                  placeholder="Enter username"
                  type="text"
                  v-model="username"
                />
                <div class="white--text">Password</div>
                <v-text-field
                  solo
                  placeholder="Enter password"
                  :type="hidePassword ? 'password' : 'text'"
                  :append-icon="hidePassword ? 'visibility_off' : 'visibility'"
                  id="password"
                  v-model="password"
                  @click:append="hidePassword = !hidePassword"
                  @keyup.enter="login"
                />
              </v-form>
            </v-card-text>
            <v-card-actions class="login-actions">
              <v-btn
                block
                :color="$root.themeColorFooter"
                class="white--text"
                @click="login"
              >
                <h3>Login</h3>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- Footer -->
    <v-card flat tile :color="$root.themeColorFooter" class="footer-card" justify-center>
      <v-card-actions class="footer-text"
        >© copyright 2024 by I.P.One Co., Ltd.</v-card-actions
      >
    </v-card>

    <!-- Snackbar -->
    <v-snackbar
      v-model="showSnackbar"
      :timeout="6000"
      :color="snackbarColor"
      rounded="pill"
      class="text-center"
    >
      {{ msgSnackbar }}
    </v-snackbar>

    <!-- Loading -->
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
      username: "",
      password: "",
      hidePassword: true,
      showSnackbar: false,
      msgSnackbar: "",
      snackbarColor: this.$root.themeColorFooter,
      isLoading: false,
    };
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
          this.infoLogin.isLogin = true;
          this.infoLogin.name = response.name;
          this.infoLogin.firstName = response.firstName;
          this.infoLogin.lastName = response.lastName;
          this.infoLogin.email = response.email;
          this.infoLogin.empId = response.empId;
          this.infoLogin.group = response.group;
          this.infoLogin.samAccount = response.samAccount;
          this.infoLogin.pathUrl = response.pathUrl;
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
  },
};
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
.image-container {
  display: inline-block; /* ใช้เพื่อทำให้จัดวางง่าย */
  text-align: center; /* จัดให้อยู่กลาง */
  padding: 10px; /* เพิ่มระยะรอบๆ ภาพ */
}

.styled-image {
  width: 100%; /* ปรับให้ภาพพอดีกับ Container */
  max-width: 200px; /* กำหนดขนาดสูงสุด */
  height: auto; /* ให้สัดส่วนคงที่ */
  border-radius: 8px; /* มุมโค้งสำหรับภาพ */
  object-fit: cover; /* ครอบคลุมพื้นที่ภาพ */
}

.animated-image {
  animation: smooth-slide 3s ease-in-out infinite;
}

@keyframes smooth-slide {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px); /* จุดสูงสุด */
  }
  100% {
    transform: translateY(0); /* กลับมาที่เดิม */
  }
}

/* ปรับ toolbar */
.toolbar {
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
}

/* Logo */
.logo {
  width: 60px;
}

/* Layout */
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
}

/* Login Card */
.login-card {
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* Login Actions */
.login-actions {
  padding: 1rem;
}

/* Footer */
.footer-card {
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
}

.footer-text {
  color: white;
  text-align: center;
  width: 100%;
  justify-content: center;
}
</style>

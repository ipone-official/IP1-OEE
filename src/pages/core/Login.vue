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
                                <v-text-field solo append-icon="person"  placeholder="Username" type="text" v-model="userName" :error="error" :rules="[rules.required]" />
                                <div class="white--text">Password</div>
                                <v-text-field solo placeholder="Password" @keyup.enter="login" :type="hidePassword ? 'password' : 'text'" :append-icon="hidePassword ? 'visibility_off' : 'visibility'"  id="password" :rules="[rules.required]" v-model="password" :error="error" @click:append="hidePassword = !hidePassword"
                                />
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn round class=" white--text" block :color="$root.themeColorFooter" @click="login" :loading="loading">
                                <h3>Login</h3>
                            </v-btn>
                        </v-card-actions>
                        <v-flex d-flex lg12 sm12 xs12>
                            <!-- <v-spacer></v-spacer>
                            <img src="static/Banner-login.png" width="80%"></img> -->
                            <!-- <v-spacer></v-spacer> -->
                        </v-flex>
                    </v-card>
                </v-flex>
                <v-spacer></v-spacer>
            </v-layout>
            </v-container>
            <v-snackbar color="orange" v-model="showResult" :timeout="3500">
                {{ result }}
            </v-snackbar>
    
        </v-content>
              <v-footer dark height="auto">
                <v-card class="flex" flat tile :color="$root.themeColorFooter">
                    <v-card-actions class="black--text justify-center">
                        &copy;copyright 2024 by I.P.One Co., Ltd.
                    </v-card-actions>
                </v-card>
            </v-footer>
    </v-app>
</template>

<script>
import axios from 'axios';
import { sync } from "vuex-pathify";
import Swal from "sweetalert2";

export default {
    data() {
        return {
            loading: false,
            userName: '',
            password: '',
            hidePassword: true,
            error: false,
            showResult: false,
            result: '',
            rules: {
                required: value => !!value || 'Required.'
            }
        }
    },
    computed: {
        ...sync("*"),
    },
    methods: {
        login() {
            const vm = this;
            if (!vm.userName || !vm.password) {

                vm.result = "Username and Password can't be null.";
                vm.showResult = true;

                return;
            }
            this.ValidateLogin(vm.userName, vm.password)
        },
           async ValidateLogin(usn, pwd) {
            const vm = this;
            vm.loading = true
            try {
                const auth = {
                    username: usn,
                    password: pwd
                }
                localStorage.removeItem('samAccountOEE')
                localStorage.removeItem('empIdOEE')
                const response = await axios.post(`${this.EndpointPortal}/AdsControl/Ads/v1/ADsAuthentication`, auth);
                if (response.data.authentication) {
                    if (!response.data.locked) {
                        vm.loading = false
                        vm.$store.commit('resetState');
                        vm.infoLogin.authentication = response.data.authentication
                        vm.infoLogin.name = response.data.name
                        vm.infoLogin.firstName = response.data.firstName
                        vm.infoLogin.lastName = response.data.lastName
                        vm.infoLogin.email = response.data.email
                        vm.infoLogin.empId = response.data.empId
                        vm.infoLogin.locked = response.data.locked
                        vm.infoLogin.group = response.data.group
                        vm.infoLogin.samAccount = response.data.samAccount
                        localStorage.setItem('samAccountOEE', vm.infoLogin.samAccount)
                        localStorage.setItem('empIdOEE', vm.infoLogin.empId)
                        this.selectedIndexStr = 1
                        vm.$router.push({ name: 'MachineProcessOrder' });
                    } else {
                        vm.loading = false
                        vm.error = true;
                        vm.result = "User is locked.";
                        vm.showResult = true;
                            Swal.fire({
                        text: 'User is locked. Please contact admin',
                        icon: "error",
                        showCancelButton: false,
                        confirmButtonColor: "#0c80c4",
                        confirmButtonText: "OK",
                    });
                    }
                } else {
                    vm.loading = false
                    vm.error = true;
                      Swal.fire({
                        text: 'Username or Password is incorrect.',
                        icon: "error",
                        showCancelButton: false,
                        confirmButtonColor: "#0c80c4",
                        confirmButtonText: "OK",
                    });

                }
            } catch (error) {
                console.error(error);
                vm.error = true;
                vm.loading = false
                     Swal.fire({
                        text: '500 Internal Server Error',
                        icon: "error",
                        showCancelButton: false,
                        confirmButtonColor: "#0c80c4",
                        confirmButtonText: "OK",
                    });
            }
        }
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

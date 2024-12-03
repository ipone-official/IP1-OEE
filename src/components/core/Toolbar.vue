<template>
  <v-toolbar
    dark
    app
    :color="$root.themeColor">
    <v-toolbar-title>
      <v-toolbar-side-icon @click="toggleNavigationBar"></v-toolbar-side-icon>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <div>
      <h3>{{ infoLogin.name }}</h3>
    </div>
    <v-menu class="toolbar-menu-item" offset-y origin="center center" :nudge-bottom="10" transition="scale-transition">
      <v-btn icon large flat slot="activator" :ripple="false">
        <v-avatar size="42px">
        <img :src="avatarUrl" />
        </v-avatar>
      </v-btn>
      <v-list>
        <v-list-tile
          v-for="(item,index) in items"
          :key="index"
          :to="!item.href ? { name: item.name } : null"
          :href="item.href"
          ripple="ripple"
          :disabled="item.disabled"
          :target="item.target"
          @click="item.click">
          <v-list-tile-action v-if="item.icon">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>
<script>
import { sync } from "vuex-pathify";

export default {
  data() {
    return {
      items: [
        {
          icon: 'exit_to_app',
          href: '#',
          title: 'Log Out',
          click: () => {
            this.$store.commit("resetState");
            localStorage.removeItem('accessTokenOee')
            localStorage.removeItem('refreshTokenOee')
            this.$router.push({ name: 'Login' });
          }
        }
      ],
      noImage: "@/assets/images/No-Image.png",
    }
  },

  computed: {
    ...sync("*"),
    avatarUrl() {
      return this.infoLogin.pathUrl || require("@/assets/images/No-Image.png");
    },
  },
  methods: {
    toggleNavigationBar() {
      this.$emit('toggleNavigationBar');
    },
  }
};
</script>
<style scoped>
  .toolbar-menu-item {
    padding-left: 5px;
  }

  .selected-language-flag {
    max-width: 45px;
  }

  .language-flag {
    max-width: 40px;
  }


  .languages-list-item {
    cursor: pointer;
    margin-top: -2px;
    margin-left: 1px;
  }

  .languages-list-item-title {
    font-size: 16px;
  }

  .languages-list-item-title:hover {
    color: #41B883;
    font-weight: bold;
  }
  .language-menu {
    border-radius: 25px;
    width: 235px;
    margin-right: 10px;
  }
  
  
</style>
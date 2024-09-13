<template>
  <v-toolbar
    dark
    app
    :color="$root.themeColor">
    <v-toolbar-title>
      <v-toolbar-side-icon @click="toggleNavigationBar"></v-toolbar-side-icon>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-snackbar
      v-model="showResult"
      :timeout="2000"
      top>
      {{ result }}
    </v-snackbar>
    <div>
      <h3>{{ infoLogin.name }}</h3>
    </div>
    <v-menu class="toolbar-menu-item" offset-y origin="center center" :nudge-bottom="10" transition="scale-transition">
      <v-btn icon large flat slot="activator" :ripple="false">
        <v-avatar size="42px">
        <img :src="computedImageUrl" />
          <!-- <img :src="`${this.Endpoint}/ImagesVendor/${ infoLogin.name }.png`"/> -->
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
      error: false,
      showResult: false,
      result: '',
      items: [
        {
          icon: 'exit_to_app',
          href: '#',
          title: 'Log Out',
          click: () => {
            const vm = this;
            vm.$store.commit("resetState");
            vm.loginInfo.imageProfile = ''
            localStorage.removeItem('samAccountOEE')
            localStorage.removeItem('routeNameOEE')
            localStorage.removeItem('selectedIndexOEE')
            localStorage.removeItem('empIdOEE')
            vm.$router.push({ name: 'Login' });
          }
        }
      ],
     
      languages: [
        { name: 'English', languageCode: 'en', path: require('../../assets/flags/en.png') },
        { name: 'Turkish', languageCode: 'tr', path: require('../../assets/flags/tr.png') },
        { name: 'French', languageCode: 'fr', path: require('../../assets/flags/fr.png') },
        { name: 'German', languageCode: 'de', path: require('../../assets/flags/de.png') },
        { name: 'Japanese', languageCode: 'ja', path: require('../../assets/flags/ja.png') },
        { name: 'Simplified Chinese', languageCode: 'ch', path: require('../../assets/flags/ch.png') }
      ]
    }
  },

  computed: {
    ...sync("*"),
    selectedLanguageFlag() {
      const vm = this;

      switch(vm.$i18n.locale) {
        case 'en': return require('../../assets/flags/en.png');
        case 'tr': return require('../../assets/flags/tr.png');
        case 'fr': return require('../../assets/flags/fr.png');
        case 'de': return require('../../assets/flags/de.png');
        case 'ja': return require('../../assets/flags/ja.png');
        case 'ch': return require('../../assets/flags/ch.png');
      }
    },
    computedImageUrl: function () {
      return this.imageProfile ? this.imageProfile : "../../../static/No-Image.png";
    },
  },
  methods: {
    toggleNavigationBar() {
      const vm = this;

      vm.$emit('toggleNavigationBar');
    },
    selectLanguage(code) {
      const vm = this;
      vm.$root.setLanguage(code);
    }
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
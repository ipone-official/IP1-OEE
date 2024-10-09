<template>
  <v-navigation-drawer
    v-model="toggle"
    class="page-sidebar"
    fixed
    app>
    <v-toolbar class="page-sidebar">
        <img src="static/logo.png" width="100vh"></img>
       <h3>{{ headerProject }}</h3> 
    </v-toolbar>
    <v-list> 
      <v-list-tile @click="changeRoute('ReportOee', 2)" v-if="(['MANAGER', 'ADMIN'].some((i) => infoLogin.group.includes(i)))">
          <v-list-tile-action>
            <v-icon>mdi-monitor-dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-title :class="[{'active': selectedIndex === 2}, 'item-title']">{{ $t('Report OEE') }}</v-list-tile-title>
        </v-list-tile>

            <v-list-tile @click="changeRoute('MachineProcessOrder', 1)">
          <v-list-tile-action>
            <v-icon>mdi-file-sign</v-icon>
          </v-list-tile-action>
          <v-list-tile-title :class="[{'active': selectedIndex === 1}, 'item-title']">{{ $t('Machine Process Order') }}</v-list-tile-title>
        </v-list-tile>


    </v-list>

     <!-- <PdfPreview v-if="manualPDF" @btncallback="manualPDF=false" />
    <footer class="footer">
    <v-divider></v-divider>
      <v-list>
        <v-list-tile @click="manualPDF = true" >
          <v-list-tile-action>
            <v-icon>mdi-book-open-outline</v-icon>
          </v-list-tile-action>
          <v-list-tile-title >{{ $t('User Manual') }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </footer> -->
  </v-navigation-drawer>
</template>

<script>
import { sync } from "vuex-pathify";
import PdfPreview from '../PdfPreview.vue'

export default {
    components: {
    PdfPreview,
  },
  data() {
    return {
      selectedIndex: 1,
      menuOpen: true,
    }
  },
  watch :{
        'selectedIndexStr': function() {
           this.selectedIndex =  Number(localStorage.getItem('selectedIndexOEE'))
        },
        toggle(val){
            this.drawer = val
        }
  },
  computed: {
        ...sync("*"),
    },
  methods: {
    changeRoute(routeName, selectedIndex) {
      const vm = this;

      vm.selectedIndex = selectedIndex;
      localStorage.setItem('selectedIndexOEE', selectedIndex)
      localStorage.setItem('routeNameOEE', routeName)
      return vm.$router.push({ name: routeName });
    },
  }
}
</script>

<style>
  .toolbar {
    font-weight: bold;
    font-size: 18px;
  }

  .toolbar .text {
    padding-left: 15px;
    color: white;
    text-decoration:none;
  }

  .item-title {
    font-size: 17px;
    font-weight: 500;
  }
  .item-sub-title {
    font-size: 15px;
    font-weight: 500;
  }

  .active {
    font-weight: bold;
  }
  .page-logo, .page-sidebar, .bg-brand-gradient {
    background-image: -webkit-gradient(linear, right top, left top, from(rgba(51, 148, 225, 0.18)), to(transparent));
    background-image: linear-gradient(270deg, rgba(51, 148, 225, 0.18), transparent);
    background-color: #584475;
    background-color: #222d32;
    background-color: #007fc4;
    background-color: #000000;
    background-color: #ffffff;
}
.theme--light.v-icon {
    color: #007fc4
}
.footer {
  width: 100%;
  position: absolute;
  bottom: 0;
}
</style>

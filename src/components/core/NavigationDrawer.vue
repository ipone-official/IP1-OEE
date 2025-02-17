<template>
  <v-navigation-drawer
    v-model="toggle"
    class="page-sidebar"
    fixed
    app>
    <!-- <v-toolbar class="page-sidebar">
     

    </v-toolbar> -->
    <v-list>
  <v-layout justify-center>
      <div class="image-container">
        <img src="../../assets/images/OEE Logo_IP1.png" class="styled-image animated-image"></img>
       </div>
  </v-layout>
      <v-list-tile @click="changeRoute('ReportOee', 2)" v-if="(['MANAGER', 'ADMIN'].some((i) => infoLogin.group.includes(i)))">
          <v-list-tile-action>
            <v-icon>mdi-monitor-dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-title :class="[{'active': selectedIndex === 2}, 'item-title']">{{ $t('Report OEE') }}</v-list-tile-title>
        </v-list-tile>

            <v-list-tile @click="changeRoute('LineProcessOrder', 1)">
          <v-list-tile-action>
            <v-icon>mdi-file-sign</v-icon>
          </v-list-tile-action>
          <v-list-tile-title :class="[{'active': selectedIndex === 1}, 'item-title']">{{ $t('Line Process Order') }}</v-list-tile-title>
        </v-list-tile>

        <v-list-tile @click="changeRoute('UploadStd', 3)" v-if="(['MANAGER', 'ADMIN'].some((i) => infoLogin.group.includes(i)))">
          <v-list-tile-action>
            <v-icon>mdi-cloud-upload-outline</v-icon>
          </v-list-tile-action>
          <v-list-tile-title :class="[{'active': selectedIndex === 3}, 'item-title']">{{ $t('Upload Speed') }}</v-list-tile-title>
        </v-list-tile>

        <v-list-tile @click="changeRoute('UploadProblemReason', 4)" v-if="(['MANAGER', 'ADMIN'].some((i) => infoLogin.group.includes(i)))">
          <v-list-tile-action>
            <v-icon>mdi-file-document-arrow-right-outline</v-icon>
          </v-list-tile-action>
          <v-list-tile-title :class="[{'active': selectedIndex === 4}, 'item-title']">{{ $t('Problem & Reason') }}</v-list-tile-title>
        </v-list-tile>

    </v-list>

     <PdfPreview v-if="manualPDF" @btncallback="manualPDF=false" />
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
    </footer>
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
      selectedIndex: 0,
      menuOpen: true,
    }
  },
  watch :{
        toggle(val){
            this.drawer = val
        }
  },
  computed: {
        ...sync("*"),
    },
  methods: {
    changeRoute(routeName, selectedIndex) {
      this.selectedIndex = selectedIndex;
      return this.$router.push({ name: routeName });
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
.styled-image {
  width: 60%; /* ปรับให้ภาพพอดีกับ Container */
  max-width: 200px; /* กำหนดขนาดสูงสุด */
  height: auto; /* ให้สัดส่วนคงที่ */
  border-radius: 8px; /* มุมโค้งสำหรับภาพ */
  object-fit: contain; /* ครอบคลุมพื้นที่ภาพ */
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

.image-container {
  display: inline-block; /* ใช้เพื่อทำให้จัดวางง่าย */
  text-align: center; /* จัดให้อยู่กลาง */
  padding: 10px; /* เพิ่มระยะรอบๆ ภาพ */
}
</style>

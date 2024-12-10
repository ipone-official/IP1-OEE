<template>
    <div style="margin: 1rem">
      <v-tabs v-model="tabs" :color="$root.themeColorFooter" grow>
            <v-tabs-slider  :color="$root.themeColor" class="custom-slider"></v-tabs-slider>

            <v-tab v-for="item in items" :key="item" class="custom-tab">
              {{ item }}
            </v-tab>
          </v-tabs>

          <v-flex v-if="tabs == 0">
            <reason-master/>
          </v-flex>

          <v-flex v-if="tabs == 1">
          <problem-master/>
          </v-flex>
        
    </div>
</template>
<script>
import ReasonMaster from '@/pages/Upload/PageDetail/ReasonMaster.vue';
import ProblemMaster from '@/pages/Upload/PageDetail/ProblemMaster.vue';

export default {
  components: {
    ReasonMaster,
    ProblemMaster,
  },
  data() {
    return {
      tabs: null,
      items: ["Reason", "Problem"],
    }
}
}
</script>
<style scoped>
.custom-tab {
  color: black !important; /* ตัวหนังสือสีขาว */
}

.custom-slider {
  height: 4px !important; /* ปรับความหนาเส้นด้านล่าง */
}
.custom-title {
  color: #007fc4;
  font-weight: bold;
  font-size: 1.1rem;
}

.custom-layout {
  margin-bottom: 0.25rem; /* ลดช่องว่างระหว่าง v-layout */
}
</style>
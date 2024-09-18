<template>
  <v-container fluid grid-list-xs>
    <v-layout row wrap class="custom-layout">
      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Line Process</v-card-title>
          <v-card-text class="small-margin">{{
            machineDetail.selectTransactionTProcess.lineProcessName
          }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Film</v-card-title>
          <v-card-text class="small-margin">{{
            machineDetail.selectTransactionTProcess.filmDescription
          }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Material</v-card-title>
          <v-card-text class="small-margin">{{
            machineDetail.selectTransactionTProcess.materialCode
          }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Description</v-card-title>
          <v-card-text class="small-margin">{{
            machineDetail.selectTransactionTProcess.materialDesc
          }}</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row wrap class="custom-layout">
      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Color</v-card-title>
          <v-card-text class="small-margin">{{
            machineDetail.selectTransactionTProcess.materialColor
          }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Size</v-card-title>
          <v-card-text class="small-margin">{{
            machineDetail.selectTransactionTProcess.materialSize
          }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Category</v-card-title>
          <v-card-text class="small-margin">{{
            machineDetail.selectTransactionTProcess.materialCategory
          }}</v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin"
            >Beginning Qty. (DZ)</v-card-title
          >
          <v-card-text class="small-margin">{{
            machineDetail.selectTransactionTProcess.qtyDozen
          }}</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12 sm2 md2 class="pa-0 mt-3">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Machine STD.</v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12 sm4 md4>
        <v-text-field
          v-model="machineDetail.machineStd"
          :disabled="
            !machineDetail.operatorEdit &&
            !machineDetail.supAndmanagerEdit &&
            !machineDetail.adminEdit
          "
          prefix="*"
          style="color: red"
          label="MachineSTD"
          solo
          @keydown.native="keyFilter($event, 'number')"
        ></v-text-field>
      </v-flex>

      <v-flex xs12 sm2 md2 class="pa-0 mt-3">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Qty. (DZ)</v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12 sm4 md4>
        <v-text-field
          v-model="machineDetail.QtyDz"
          :disabled="
            !machineDetail.operatorEdit &&
            !machineDetail.supAndmanagerEdit &&
            !machineDetail.adminEdit
          "
          prefix="*"
          style="color: red"
          label="Qty. (DZ)"
          solo
          @keydown.native="keyFilter($event, 'number')"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <hr class="custom-hr" />
    <v-layout row wrap class="custom-layout">
      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Qty. (EA)</v-card-title>
          <v-card-text class="small-margin">{{
            machineDetail.selectTransactionTProcess.qtyEA
          }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Std. CycleTime</v-card-title>
          <v-card-text class="small-margin">{{
            machineDetail.selectTransactionTProcess.stdCycleTime
          }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Opeating Time</v-card-title>
          <v-card-text class="small-margin">{{
            machineDetail.selectTransactionTProcess.operatingTime
          }}</v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Speed Lose</v-card-title>
          <v-card-text class="small-margin">{{
            machineDetail.selectTransactionTProcess.speedLose
          }}</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row wrap class="custom-layout">
      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Working Time</v-card-title>
          <v-card-text class="small-margin">{{
            machineDetail.selectTransactionTProcess.workingTime
          }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Working Time(Min)</v-card-title>
          <v-card-text class="small-margin">{{
            machineDetail.selectTransactionTProcess.workingTimeMin
          }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin"
            >Machine Working Time</v-card-title
          >
          <v-card-text class="small-margin">{{
            machineDetail.selectTransactionTProcess.machineWorkingTime
          }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Damage%</v-card-title>
          <v-card-text class="small-margin">{{
            machineDetail.selectTransactionTProcess.damagePercentage
          }}</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row wrap class="custom-layout">
      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Planned Downtime</v-card-title>
          <v-card-text class="small-margin">{{
            machineDetail.selectTransactionTProcess.plannedDowntime
          }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">UnPlan Downtime</v-card-title>
          <v-card-text class="small-margin">{{
            machineDetail.selectTransactionTProcess.unplannedDowntime
          }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Summary Downtime</v-card-title>
          <v-card-text class="small-margin">{{
            machineDetail.selectTransactionTProcess.summaryDowntime
          }}</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { sync } from "vuex-pathify";
import functions from "@/plugins/functions";
import keyFilter from "@/plugins/keyFilter";

export default {
  data() {
    return {
      keyFilter,
      functions,
    };
  },
  computed: {
    ...sync("*"),
  },
  create() {},
  methods: {},
};
</script>

<style scoped>
.custom-tab {
  color: white !important; /* ตัวหนังสือสีขาว */
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

.pa-0 {
  padding: 0 !important; /* เอา padding รอบ ๆ ช่องออก */
}

.small-margin {
  margin-bottom: -1.5rem !important; /* ลดช่องว่างด้านล่างของข้อความ */
  margin-top: -1.5rem !important; /* ลดช่องว่างด้านบนของข้อความ */
}

.small-card {
  padding: 0.5rem !important; /* ลด padding ภายใน card */
  font-size: 0.9rem; /* ลดขนาดฟอนต์ใน card */
}
.custom-hr {
  border: none;
  border-top: 0.2rem solid #007fc4; /* เปลี่ยนสีของเส้น */
  margin: 1rem 0; /* ปรับระยะห่างของเส้น */
}
.custom-autocomplete .v-input__prefix {
  color: red;
}
.custom-autocomplete .v-input__slot {
  color: red;
}
</style>

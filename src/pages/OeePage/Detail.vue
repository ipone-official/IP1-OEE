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
            machineDetail.selectTransactionTProcess.length == 0
              ? ""
              : functions.numberWithCommas(
                  machineDetail.selectTransactionTProcess.qtyDozen
                )
          }}</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12 sm2 md2 class="pa-0 mt-3">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Speed Std.</v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12 sm4 md4>
        <v-text-field
          v-model="formattedMachineStd"
          :disabled="!machineDetail.managerEdit && !machineDetail.adminEdit"
          prefix="*"
          style="color: red"
          label="Speed Std."
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
          v-model="formattedQtyDz"
          :disabled="
            !machineDetail.operatorEdit &&
            !machineDetail.supervisorEdit &&
            !machineDetail.managerEdit &&
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
    <v-layout v-if="this.machineDetail.selectTransactionTProcess.filmID">
      <v-flex xs12 sm2 md2 class="pa-0 mt-3">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Lot Films</v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12 sm10 md10>
        <v-combobox
          v-model="machineDetail.mLotFilms"
          hide-selected
          label="Lot Films"
          :disabled="
            !machineDetail.operatorEdit &&
            !machineDetail.supervisorEdit &&
            !machineDetail.managerEdit &&
            !machineDetail.adminEdit
          "
          multiple
          small-chips
          solo
           @keydown.native="keyFilter($event, 'LotFilms')"
        >
          <template v-slot:selection="{ item, parent, selected }">
            <v-chip
              v-if="item === Object(item)"
              color="#007fc4"
              :selected="selected"
              style="color: white"
              label
              small
            >
              <span class="pr-2">
                {{ item.text }}
              </span>
              <v-icon small style="color: #f8c849" @click="parent.selectItem(item)"
                >close</v-icon
              >
            </v-chip>
          </template>
        </v-combobox>
      </v-flex>
    </v-layout>

    <hr class="custom-hr" />
    <v-layout row wrap class="custom-layout">
      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Qty. (EA)</v-card-title>
          <v-card-text class="small-margin">{{
            machineDetail.selectTransactionTProcess.length == 0
              ? ""
              : functions.numberWithCommas(machineDetail.selectTransactionTProcess.qtyEA)
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
          <v-card-title class="custom-title small-margin">Operating Time</v-card-title>
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
      <!-- <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin"
            >Working Time(Hrs.)</v-card-title
          >
          <v-card-text class="small-margin">{{
            machineDetail.selectTransactionTProcess.workingTime
          }}</v-card-text>
        </v-card>
      </v-flex> -->

      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Working Time(Min)</v-card-title>
          <v-card-text class="small-margin">{{
            machineDetail.selectTransactionTProcess.length == 0
              ? ""
              : functions.numberWithCommas(
                  machineDetail.selectTransactionTProcess.workingTimeMin
                )
          }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin"
            >Machine Working Time(Min)</v-card-title
          >
          <v-card-text class="small-margin">{{
            machineDetail.selectTransactionTProcess.length == 0
              ? ""
              : functions.numberWithCommas(
                  machineDetail.selectTransactionTProcess.machineWorkingTime
                )
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
          <v-card-title class="custom-title small-margin"
            >Planned Downtime(Min)</v-card-title
          >
          <v-card-text class="small-margin">{{
            machineDetail.selectTransactionTProcess.length == 0
              ? ""
              : functions.numberWithCommas(
                  machineDetail.selectTransactionTProcess.plannedDowntime
                )
          }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin"
            >UnPlan Downtime(Min)</v-card-title
          >
          <v-card-text class="small-margin">{{
            machineDetail.selectTransactionTProcess.length == 0
              ? ""
              : functions.numberWithCommas(
                  machineDetail.selectTransactionTProcess.unplannedDowntime
                )
          }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin"
            >Summary Downtime(Min)</v-card-title
          >
          <v-card-text class="small-margin">{{
            machineDetail.selectTransactionTProcess.length == 0
              ? ""
              : functions.numberWithCommas(
                  machineDetail.selectTransactionTProcess.summaryDowntime
                )
          }}</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <hr
      class="custom-hr"
      v-if="
        ['MANAGER'].some((i) => infoLogin.group.includes(i)) ||
        ['ADMIN'].some((i) => infoLogin.group.includes(i))
      "
    />
    <v-layout
      row
      wrap
      class="custom-layout"
      v-if="
        ['MANAGER'].some((i) => infoLogin.group.includes(i)) ||
        ['ADMIN'].some((i) => infoLogin.group.includes(i))
      "
    >
      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Availability (A)</v-card-title>
          <v-card-text class="small-margin">{{
            machineDetail.selectTransactionTProcess.length == 0
              ? ""
              : machineDetail.selectTransactionTProcess.availability
          }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Performance (P)</v-card-title>
          <v-card-text class="small-margin">{{
            machineDetail.selectTransactionTProcess.length == 0
              ? ""
              : machineDetail.selectTransactionTProcess.performance
          }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Quality (Q)</v-card-title>
          <v-card-text class="small-margin">{{
            machineDetail.selectTransactionTProcess.length == 0
              ? ""
              : machineDetail.selectTransactionTProcess.quality
          }}</v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 sm3 md3 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">%OEE</v-card-title>
          <v-card-text class="small-margin">{{
            machineDetail.selectTransactionTProcess.length == 0
              ? ""
              : machineDetail.selectTransactionTProcess.oeePercentage
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
    formattedMachineStd: {
      get() {
        if (!this.machineDetail.machineStd) return 0;
        return this.machineDetail.machineStd
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      set(value) {
        this.machineDetail.machineStd = Number(value.replace(/,/g, "")) || 0;
      },
    },
    formattedQtyDz: {
      get() {
        if (!this.machineDetail.QtyDz) return 0;
        return this.machineDetail.QtyDz.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      set(value) {
        this.machineDetail.QtyDz = Number(value.replace(/,/g, "")) || 0;
      },
    },
  },
  watch: {
    "machineDetail.mLotFilms": {
      handler(newVal, oldVal) {
        // ป้องกัน error เมื่อ newVal หรือ oldVal เป็น undefined
        if (!Array.isArray(newVal) || !Array.isArray(oldVal)) return;

        // ตรวจสอบว่าขนาด array เปลี่ยนแปลงหรือไม่
        if (newVal.length === oldVal.length) return;

        // อัปเดตค่าให้เป็นรูปแบบ { text: "ค่า" }
        this.machineDetail.mLotFilms = newVal.map((v) => {
          if (typeof v === "string") {
            const newItem = { text: v };

            // ตรวจสอบว่า newItem มีอยู่แล้วหรือยัง ก่อนเพิ่มเข้าไป
            if (!this.machineDetail.itemsLotfilms.some((item) => item.text === v)) {
              this.machineDetail.itemsLotfilms.push(newItem);
            }

            return newItem;
          }
          return v;
        });
      },
      deep: true, // ตรวจสอบการเปลี่ยนแปลงของ array/object ภายใน
      immediate: true, // ทำงานทันทีเมื่อ component ถูกโหลด
    },
  },
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

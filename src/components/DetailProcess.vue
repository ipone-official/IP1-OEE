<template>
  <v-container fluid grid-list-xs>

    <v-dialog v-model="dialogTransactionDetail" persistent max-width="1180px">
      <v-card>
        <v-card-title>
          <v-flex xs12 sm5 md4>
            <div class="pa-3 inner-card mt-3">
              <v-layout>
                <div class="font-weight-bold mb-2">Check-In Time :</div>
                <div style="margin-left: 0.7rem">
                  {{ functions.formatDateFormat(selectTransactionTProcess.checkIn) }}
                </div>
              </v-layout>
            </div>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex xs12 sm5 md4>
            <div class="pa-3 inner-card mt-3">
              <v-layout>
                <div class="font-weight-bold mb-2">Operator :</div>
                <div style="margin-left: 0.7rem">{{ `${selectTransactionTProcess.username} (${selectTransactionTProcess.shift})`  }}</div>
              </v-layout>
            </div>
          </v-flex>
          <v-tooltip top color="teal">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                @click="dialogTransactionDetail = false"
                class="ma-2"
                v-bind="attrs"
                v-on="on"
                style="position: absolute; top: -8px; right: -8px"
              >
                <v-icon size="20" style="color: red">mdi-close</v-icon>
              </v-btn>
            </template>
            <span>close</span>
          </v-tooltip>
        </v-card-title>
        <div style="padding: 1.5rem; margin-top: -1.5rem">
          <v-tabs
    v-model="tab"
    color="#007fc4"
    grow
  >
    <v-tabs-slider
      color="#f8c849"
      class="custom-slider"
    ></v-tabs-slider>

    <v-tab
      v-for="item in items"
      :key="item"
      class="custom-tab"
    >
      {{ item }}
    </v-tab>
  </v-tabs>

  <v-flex v-if="tab == 0" style="margin-top: 1rem;">
    <v-layout row wrap class="custom-layout">
      <v-flex xs12 sm5 md4 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Line Process Name</v-card-title>
          <v-card-text class="small-margin">{{ selectTransactionTProcess.lineProcessName }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm5 md2 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Film</v-card-title>
          <v-card-text class="small-margin">{{ selectTransactionTProcess.filmDescription }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm5 md2 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Material</v-card-title>
          <v-card-text class="small-margin">{{ selectTransactionTProcess.materialCode }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm5 md4 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Description</v-card-title>
          <v-card-text class="small-margin">{{ selectTransactionTProcess.materialDesc }}</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row wrap class="custom-layout">
      <v-flex xs12 sm5 md4 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Color</v-card-title>
          <v-card-text class="small-margin">{{ selectTransactionTProcess.materialColor }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm5 md2 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Size</v-card-title>
          <v-card-text class="small-margin">{{ selectTransactionTProcess.materialSize }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm5 md2 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Category</v-card-title>
          <v-card-text class="small-margin">{{ selectTransactionTProcess.materialCategory }}</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
<v-layout>
  <v-flex xs12 sm5 md2 class="pa-0 mt-3">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Machine STD.</v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12 sm5 md4>
  <v-text-field
  v-model="selectTransactionTProcess.machineSTD"
                      prepend-icon=" "
                      prefix="*"
                      style="color: red"
                      label="MachineSTD"
                      solo
                    ></v-text-field>
</v-flex>

<v-flex xs12 sm5 md2 class="pa-0 mt-3">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Qty. (DZ)</v-card-title>
        </v-card>
      </v-flex>
      <v-flex xs12 sm5 md4>
  <v-text-field
  v-model="selectTransactionTProcess.machineSTD"
                      prepend-icon=" "
                      prefix="*"
                      style="color: red"
                      label="MachineSTD"
                      solo
                    ></v-text-field>
</v-flex>

</v-layout>
    <hr class="custom-hr" />
    <v-layout row wrap class="custom-layout">
      <v-flex xs12 sm5 md4 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Qty. (EA)</v-card-title>
          <v-card-text class="small-margin">{{ selectTransactionTProcess.qtyEA }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm5 md2 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Std. CycleTime</v-card-title>
          <v-card-text class="small-margin">{{ selectTransactionTProcess.stdCycleTime }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm5 md2 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Opeating Time</v-card-title>
          <v-card-text class="small-margin">{{ selectTransactionTProcess.operatingTime }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm5 md4 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Working Time</v-card-title>
          <v-card-text class="small-margin">{{ selectTransactionTProcess.workingTime }}</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row wrap class="custom-layout">
      <v-flex xs12 sm5 md4 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Working Time(Min)</v-card-title>
          <v-card-text class="small-margin">{{ selectTransactionTProcess.workingTimeMin }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm5 md2 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Machine Working Time</v-card-title>
          <v-card-text class="small-margin">{{ selectTransactionTProcess.machineWorkingTime }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm5 md2 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Planned Downtime</v-card-title>
          <v-card-text class="small-margin">{{ selectTransactionTProcess.plannedDowntime }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm5 md4 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">UnPlan Downtime</v-card-title>
          <v-card-text class="small-margin">{{ selectTransactionTProcess.unplannedDowntime }}</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row wrap class="custom-layout">
      <v-flex xs12 sm5 md4 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Speed Lose</v-card-title>
          <v-card-text class="small-margin">{{ selectTransactionTProcess.speedLose }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm5 md2 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Summary Downtime</v-card-title>
          <v-card-text class="small-margin">{{ selectTransactionTProcess.summaryDowntime }}</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm5 md2 class="pa-0">
        <v-card flat class="small-card">
          <v-card-title class="custom-title small-margin">Damage%</v-card-title>
          <v-card-text class="small-margin">{{ selectTransactionTProcess.damagePercentage }}</v-card-text>
        </v-card>
      </v-flex>

    </v-layout>
  </v-flex>

  <v-flex v-if="tab == 1">
        666
  </v-flex>
  <v-flex v-if="tab == 2">
        777
  </v-flex>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            flat
            color="#007fc4"
            style="border-radius: 12px"
            @click="dialogTransactionDetail = false"
            >close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>

</template>
<script>
import { sync } from "vuex-pathify";
import Swal from "sweetalert2";
import Loading from "../components/core/Loading";
import functions from "@/plugins/functions";

export default {
  data() {
    return {
      functions,
        tab: null,
      items: [
        'Detail', 'Reason', 'Problem'
      ],
    }
},
computed: {
    ...sync("*"),
    rowsPerPageItem() {
      return [
        { text: "5", value: 5 },
        { text: "20", value: 20 },
        { text: "50", value: 50 },
        { text: "100", value: 100 },
      ];
      
    },
    
  },
}
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
  margin: 1rem 0;               /* ปรับระยะห่างของเส้น */
}
</style>
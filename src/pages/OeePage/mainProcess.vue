<template>
  <v-container fluid grid-list-xs>
    <v-dialog
      v-model="machineDetail.dialogTransactionDetail"
      persistent
      max-width="1180px"
    >
      <v-card>
        <v-card-title>
          <v-flex xs12 sm5 md4>
            <div class="pa-3 inner-card mt-3">
              <v-layout>
                <div class="font-weight-bold mb-2">Check-In Time :</div>
                <div style="margin-left: 0.7rem">
                  {{
                    functions.formatDateFormat(
                      machineDetail.selectTransactionTProcess.checkIn
                    )
                  }}
                </div>
              </v-layout>
            </div>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex xs12 sm5 md4>
            <div class="pa-3 inner-card mt-3">
              <v-layout>
                <div class="font-weight-bold mb-2">Operator :</div>
                <div style="margin-left: 0.7rem">
                  {{
                    `${machineDetail.selectTransactionTProcess.username} (${machineDetail.selectTransactionTProcess.shift})`
                  }}
                </div>
              </v-layout>
            </div>
          </v-flex>
          <v-tooltip top color="teal">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                @click="machineDetail.dialogTransactionDetail = false"
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
        <v-layout justify-end style="margin-top: -1rem" v-if="machineDetail.operatorEdit || machineDetail.supAndmanagerEdit || machineDetail.adminEdit">
         
          <v-tooltip top color="teal">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                fab
                small
                color="#007fc4"
                dark
                 v-if="(['MANAGER'].some((i) => infoLogin.group.includes(i))) ||['ADMIN'].some((i) => infoLogin.group.includes(i))"
                @click="UpdateProcessStatus('WaitApproved')"
                class="ma-2 small-export-button"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon size="20">mdi-check-bold</v-icon>
              </v-btn>
            </template>
            <span>Approve</span>
          </v-tooltip>
         
          <v-tooltip top color="teal">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                fab
                small
                color="#007fc4"
                dark
                @click="UpdateProcessStatus('Completed')"
                v-if="(['SUPERVISOR'].some((i) => infoLogin.group.includes(i))) ||['ADMIN'].some((i) => infoLogin.group.includes(i))"
                class="ma-2 small-export-button"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon size="20">mdi-hand-okay</v-icon>
              </v-btn>
            </template>
            <span>Comfirm</span>
          </v-tooltip>

          <v-tooltip top color="teal">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                fab
                small
                color="green"
                dark
                @click="InsertDetailReasonAndProblem"
                class="ma-2 small-export-button"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon size="20">mdi-content-save-outline</v-icon>
              </v-btn>
            </template>
            <span>Submit</span>
          </v-tooltip>
          
        </v-layout>
        <div style="padding: 1.5rem; margin-top: -1.5rem">
          <v-tabs v-model="tab" color="#007fc4" grow>
            <v-tabs-slider color="#f8c849" class="custom-slider"></v-tabs-slider>

            <v-tab v-for="item in items" :key="item" class="custom-tab">
              {{ item }}
            </v-tab>
          </v-tabs>

          <v-flex v-if="tab == 0">
            <detail />
          </v-flex>

          <v-flex v-if="tab == 1">
            <reason />
          </v-flex>
          <v-flex v-if="tab == 2">
            <problem />
          </v-flex>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            flat
            color="#007fc4"
            style="border-radius: 12px"
            @click="machineDetail.dialogTransactionDetail = false"
            >close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar color="orange" v-model="showResult" :timeout="3500">
      {{ msgResult }}
    </v-snackbar>
    <div v-if="loadingDialog">
      <loading :value="loadingDialog" />
    </div>
  </v-container>
</template>
<script>
import axios from "axios";
import { sync } from "vuex-pathify";
import Swal from "sweetalert2";
import loading from "@/components/core/Loading";
import functions from "@/plugins/functions";
// import { isEmpty } from "lodash";

import Detail from "@/pages/OeePage/Detail.vue";
import Reason from "@/pages/OeePage/Reason.vue";
import Problem from "@/pages/OeePage/Problem.vue";

export default {
  components: {
    loading,
    Detail,
    Reason,
    Problem,
  },
  data() {
    return {
      loadingDialog: false,
      msgResult: "",
      showResult: false,
      functions,
      tab: 0,
      items: ["Detail", "Reason", "Problem"],
    };
  },
  computed: {
    ...sync("*"),
  },
  methods: {
    async InsertDetailReasonAndProblem() {
      Swal.fire({
        html: `Do you want insert to database`,
        icon: "warning",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: "#0c80c4",
        cancelButtonColor: "#C0C0C0",
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result.isConfirmed) {
          let { processID, lineProcessID } = this.machineDetail.selectTransactionTProcess;
          let { empId } = this.infoLogin;
          let {
            machineStd,
            QtyDz,
            itemProblemTable,
            itemDamageTable,
          } = this.machineDetail;

          let initHeadDetail = {
            processID: processID,
            lineProcessID: lineProcessID,
            userID: empId,
            machine_STD: parseInt(machineStd, 10),
            qty_Dozen: parseInt(QtyDz, 10),
            detailProblem: itemProblemTable.map(
              ({ machineID, problemID, problemDescription, downtime }) => ({
                machineID,
                problemID,
                problemDesc: problemDescription,
                downtime,
              })
            ),
            detailReason: itemDamageTable.map(({ reasonID, reasonDescID, QtyEA }) => ({
              reasonID,
              reasonDescID,
              qty: QtyEA,
            })),
          };
          const response = await axios.post(
        `${this.EndpointPortal}/ApiOEE/OEE/v1/InsertDetailReasonAndProblem`,
        initHeadDetail
      );
      if (response.data.status == 200) {
        Swal.fire({
          html: `Successfully`,
          icon: "success",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonColor: "#0c80c4",
          cancelButtonColor: "#C0C0C0",
          confirmButtonText: "OK",
        }).then(async (result) => {
          if (result.isConfirmed) {
            this.machineDetail.dialogTransactionDetail = false
            this.flagGetTProcess = true
            this.tab = 0
          }
        });
      }
        }
      });
    },
  async  UpdateProcessStatus(val) {
    const status = val == 'Completed'? 'Approve': 'Comfirm'
    Swal.fire({
        html: `Do you want "<strong>${status}</strong>" ?`,
        icon: "warning",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: "#0c80c4",
        cancelButtonColor: "#C0C0C0",
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.loadingDialog = true;
          let { processID, lineProcessID, materialCode, filmID } = this.machineDetail.selectTransactionTProcess;
          let { empId } = this.infoLogin;
          const init = {
            processID: processID,
            lineProcessID: lineProcessID,
            userID: empId,
            prodOrderID: "",
            material_Code: materialCode,
            filmID: filmID,
            checkINOut: functions.formatDate(),
            status: val,
          };
          const response = await axios.post(
            `${this.EndpointPortal}/ApiOEE/OEE/v1/InsertProcessList`,
            init
          );
          if (response.data.status == 200) {
            Swal.fire({
              html: `Successfully`,
              icon: "success",
              showCancelButton: false,
              allowOutsideClick: false,
              confirmButtonColor: "#0c80c4",
              cancelButtonColor: "#C0C0C0",
              confirmButtonText: "OK",
            }).then(async (result) => {
              if (result.isConfirmed) {
                this.loadingDialog = false;
                this.flagGetTProcess = true;
              }
            });
          } else {
            this.loadingDialog = false;
            Swal.fire({
              text: `Internal Server Error`,
              icon: "error",
              showCancelButton: false,
              allowOutsideClick: false,
              confirmButtonColor: "#0c80c4",
              cancelButtonColor: "#C0C0C0",
              confirmButtonText: "Ok",
            });
          }
        }
      });
    }
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

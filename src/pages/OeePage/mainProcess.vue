<template>
  <v-container fluid grid-list-xs>
    <v-dialog
      v-model="machineDetail.dialogTransactionDetail"
      persistent
      max-width="1180px"
    >
      <v-card>
        <v-layout wrap>
          <!-- Process ID Section -->
          <v-flex xs12 sm4 md4>
            <div class="pa-3 inner-card mt-4 mr-4 ml-2">
              <v-layout>
                <div class="font-weight-bold mb-2">Process ID :</div>
                <div style="margin-left: 0.7rem">
                  {{ machineDetail.selectTransactionTProcess.processID }}
                </div>
              </v-layout>
            </div>
          </v-flex>
          <v-spacer></v-spacer>
          <!-- Operator Section -->
          <v-flex xs12 sm4 md4>
            <div class="pa-3 inner-card mt-4 mr-4 ml-2">
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
        </v-layout>
        <v-card-title>
          <v-layout
            row
            wrap
            align-center
            justify-space-between
            v-if="
              machineDetail.operatorEdit ||
              machineDetail.supervisorEdit ||
              machineDetail.managerEdit ||
              machineDetail.adminEdit
            "
          >
            <v-flex xs12 sm1 class="pa-sm-2 pa-xs-1">
              <div
                class="font-weight-bold mb-2"
                v-if="
                  machineDetail.operatorEdit ||
                  machineDetail.supervisorEdit ||
                  machineDetail.managerEdit ||
                  machineDetail.adminEdit
                "
              >
                Check-In Time:
              </div>
            </v-flex>
            <v-flex xs12 sm2 class="pa-sm-2 pa-xs-1">
              <calendar
                :value.sync="CheckInDate"
                label="Check Date"
                :readonly="true"
                v-if="
                  machineDetail.operatorEdit ||
                  machineDetail.supervisorEdit ||
                  machineDetail.managerEdit ||
                  machineDetail.adminEdit
                "
              />
            </v-flex>
            <v-flex xs12 sm2 class="pa-sm-2 pa-xs-1">
              <timepicker
                v-model="CheckInTime"
                ref="timeCheckinRef"
                v-if="
                  machineDetail.operatorEdit ||
                  machineDetail.supervisorEdit ||
                  machineDetail.managerEdit ||
                  machineDetail.adminEdit
                "
              />
            </v-flex>
            <v-flex xs12 sm1 class="pa-sm-2 pa-xs-1">
              <div
                class="font-weight-bold mb-2"
                v-show="machineDetail.selectTransactionTProcess.status != 'InProcess'"
                v-if="
                  machineDetail.supervisorEdit ||
                  machineDetail.managerEdit ||
                  machineDetail.adminEdit
                "
              >
                Check-Out Time:
              </div>
            </v-flex>
            <v-flex xs12 sm2 class="pa-sm-2 pa-xs-1">
              <calendar
                :value.sync="CheckOutDate"
                label="Check Out"
                :readonly="true"
                v-show="machineDetail.selectTransactionTProcess.status != 'InProcess'"
                v-if="
                  machineDetail.supervisorEdit ||
                  machineDetail.managerEdit ||
                  machineDetail.adminEdit
                "
              />
            </v-flex>
            <v-flex xs12 sm2 class="pa-sm-2 pa-xs-1">
              <timepicker
                v-model="CheckOutTime"
                ref="timeCheckoutRef"
                v-show="machineDetail.selectTransactionTProcess.status != 'InProcess'"
                v-if="
                  machineDetail.supervisorEdit ||
                  machineDetail.managerEdit ||
                  machineDetail.adminEdit
                "
              />
            </v-flex>
          </v-layout>
          <v-tooltip top color="teal">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                @click="
                  (machineDetail.dialogTransactionDetail = false),
                    (machineDetail.selectProcessID = 0)
                "
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
        <v-layout
          justify-end
          style="margin-top: -1rem"
          v-if="
            machineDetail.operatorEdit ||
            machineDetail.supervisorEdit ||
            machineDetail.managerEdit ||
            machineDetail.adminEdit
          "
        >
          <v-tooltip top color="teal">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                fab
                small
                color="#007fc4"
                dark
                v-if="
                  (machineDetail.supervisorEdit &&
                    machineDetail.selectTransactionTProcess.status == 'WaitConfirm') ||
                  machineDetail.adminEdit
                "
                @click="UpdateProcessStatus('WaitApproved')"
                class="ma-2 small-export-button"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon size="20">mdi-check-bold</v-icon>
              </v-btn>
            </template>
            <span>Comfirm</span>
          </v-tooltip>

          <v-tooltip top color="teal">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                fab
                small
                color="#007fc4"
                dark
                @click="UpdateProcessStatus('Completed')"
                v-if="
                  (machineDetail.managerEdit &&
                    machineDetail.selectTransactionTProcess.status == 'WaitApproved') ||
                  machineDetail.adminEdit
                "
                class="ma-2 small-export-button"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon size="20">mdi-hand-okay</v-icon>
              </v-btn>
            </template>
            <span> Approve </span>
          </v-tooltip>

          <v-tooltip top color="teal">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                fab
                small
                color="green"
                dark
                v-if="
                  machineDetail.operatorEdit ||
                  machineDetail.supervisorEdit ||
                  machineDetail.managerEdit ||
                  machineDetail.adminEdit
                "
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
            @click="
              (machineDetail.dialogTransactionDetail = false),
                (machineDetail.selectProcessID = 0)
            "
            >close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar color="orange" v-model="showResult" :timeout="3500">
      {{ msgResult }}
    </v-snackbar>
    <loading :isLoading="isLoading" />
  </v-container>
</template>
<script>
import axios from "axios";
import { sync } from "vuex-pathify";
import Swal from "sweetalert2";
import loading from "@/components/Loading";
import functions from "@/plugins/functions";
import Detail from "@/pages/OeePage/Detail.vue";
import Reason from "@/pages/OeePage/Reason.vue";
import Problem from "@/pages/OeePage/Problem.vue";
import timepicker from "@/components/TimePicker.vue";
import calendar from "@/components/DatePiker.vue";

export default {
  components: {
    loading,
    Detail,
    Reason,
    Problem,
    timepicker,
    calendar,
  },
  data() {
    return {
      isLoading: false,
      msgResult: "",
      showResult: false,
      functions,
      items: ["Detail", "Reason", "Problem"],
    };
  },
  computed: {
    ...sync("*"),
  },
  methods: {
    async InsertDetailReasonAndProblem() {
      Swal.fire({
        html: `Would you like to save ?`,
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
            mLotFilms,
          } = this.machineDetail;

          let LotFilms = "";
          if (mLotFilms.length > 0) {
            LotFilms = mLotFilms.map((film) => film.text).join(", ");
          }

          let initHeadDetail = {
            processID: processID,
            lineProcessID: lineProcessID,
            userID: empId,
            machine_STD: parseInt(machineStd, 10),
            qty_Dozen: parseInt(QtyDz, 10),
            checkIN: `${this.CheckInDate} ${this.CheckInTime}`,
            checkOut:
              this.machineDetail.selectTransactionTProcess.status == "InProcess"
                ? ""
                : `${this.CheckOutDate} ${this.CheckOutTime}`,
            lotFilms:
              this.machineDetail.selectTransactionTProcess.filmID == "" ? "" : LotFilms,
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
          try {
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
                  // this.machineDetail.dialogTransactionDetail = false;
                  this.flagGetTProcess = true;
                  // this.tab = 0;
                }
              });
            }
          } catch (error) {
            console.error(error);
          }
        }
      });
    },
    async UpdateProcessStatus(val) {
      const status = val == "Completed" ? "Approve" : "Comfirm";
      Swal.fire({
        html: `Would you like to "<strong>${status}</strong>" ?`,
        icon: "warning",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: "#0c80c4",
        cancelButtonColor: "#C0C0C0",
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.isLoading = true;
          let {
            processID,
            lineProcessID,
            materialCode,
            filmID,
            lotFilms
          } = this.machineDetail.selectTransactionTProcess;
          let { empId } = this.infoLogin;
          const init = {
            processID: processID,
            lineProcessID: lineProcessID,
            userID: empId,
            prodOrderID: "",
            material_Code: materialCode,
            filmID: filmID,
            lotFilms: lotFilms,
            checkIN: `${this.CheckInDate} ${this.CheckInTime}`,
            checkOut: `${this.CheckOutDate} ${this.CheckOutTime}`,
            status: val,
          };
          try {
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
                  this.flagGetTProcess = true;
                  this.machineDetail.dialogTransactionDetail = false;
                  this.tab = 0;
                }
              });
            } else {
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
          } finally {
            // ปิดการแสดงผล Loading ในทุกกรณี
            this.isLoading = false;
          }
        }
      });
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

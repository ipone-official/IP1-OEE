<template>
  <div style="margin: 1rem">
    <v-layout>
      <v-flex xs12 sm5 md4>
        <v-text-field
          v-model="mSearch"
          flat
          label="Search"
          prepend-inner-icon="search"
          solo
          dense
          hide-details
          clearable
        ></v-text-field>
      </v-flex>
      <v-flex xs12 sm5 md3>
        <v-autocomplete
          solo
          v-model="mFilterProcess"
          prepend-icon=" "
          :items="lineProcessItem"
          item-value="key"
          item-text="text"
          dense
          label="Line Process"
          return-object
          hide-details
          multiple
        ></v-autocomplete>
      </v-flex>
      <v-spacer></v-spacer>
      <v-tooltip top color="teal">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            small
            color="#007fc4"
            dark
            @click="dialog = true"
            class="ma-2 small-export-button"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon size="20">mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Add Reason</span>
      </v-tooltip>
    </v-layout>
    <v-data-table
      :headers="headers"
      :items="itemProblem"
      item-key="problemID"
      :pagination.sync="pagination"
      :search="mSearch"
    >
      <template v-slot:items="props">
        <tr>
          <td class="text-xs-left">
            {{ props.item.problemID }}
          </td>
          <td class="text-xs-left">{{ props.item.problemDescription }}</td>
          <td class="text-xs-left">{{ props.item.lineProcessName }}</td>
          <td class="text-xs-left">
            {{ props.item.machineDescription }}
          </td>
          <td class="text-xs-left">
            {{ props.item.stdTime }}
          </td>
          <td class="text-xs-left">
            {{ props.item.planStatus }}
          </td>
          <td class="text-xs-left">
            {{ props.item.unControlStatus }}
          </td>
          <td class="text-xs-left">
            {{ props.item.status }}
          </td>
          <v-layout>
            <v-btn
              color="#f8c849"
              fab
              small
              class="extra-small-btn"
              @click="editItemProblem(props.item)"
            >
              <v-icon style="margin-top: 0.1rem; color: white">mdi-pencil-outline</v-icon>
            </v-btn>
            <v-btn
              v-if="props.item.isDeletable == 'Y'"
              color="red"
              fab
              small
              class="extra-small-btn"
              @click="deleteItemProblem(props.item)"
            >
              <v-icon style="margin-top: 0.1rem; color: white">mdi-delete</v-icon>
            </v-btn>
          </v-layout>
        </tr>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" max-width="700px" persistent>
      <v-card class="dialog-card">
        <!-- Header -->
        <v-card-title class="dialog-header">
          <span class="dialog-title">✨ Input Form ✨</span>
        </v-card-title>

        <!-- Close Button -->
        <v-btn icon @click="resetForm" class="close-btn">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-layout row wrap>
              <v-flex xs12 sm8 md8>
                <v-text-field
                  v-model="mProblemDesc"
                  prefix="*"
                  style="color: red"
                  label="Problem Description"
                ></v-text-field>
              </v-flex>
              <v-spacer></v-spacer>
              <v-flex xs12 sm3 md3>
                <v-text-field
                  v-model="mStdTime"
                  prefix="*"
                  style="color: red"
                  label="Std. Time"
                  @keydown.native="keyFilter($event, 'decimal')"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs12 sm5 md5>
                <v-autocomplete
                  v-model="mLineProcess"
                  :items="itemLineProcess"
                  :disabled="editId != 0"
                  item-value="lineProcessID"
                  item-text="lineProcessName"
                  dense
                  label="Line Process Name"
                  return-object
                  hide-details
                ></v-autocomplete>
              </v-flex>
              <v-spacer></v-spacer>
              <v-flex xs12 sm5 md5>
                <v-autocomplete
                  v-model="mMachine"
                  :items="itemMachine"
                  :disabled="editId != 0"
                  item-value="machineID"
                  item-text="machineDescription"
                  dense
                  label="Machine Name"
                  return-object
                  hide-details
                ></v-autocomplete>
              </v-flex>
            </v-layout>
            <v-layout wrap>
              <v-flex xs12 sm4 md4>
                <v-radio-group
                  :disabled="editId != 0"
                  v-model="selectedPlanStatus"
                  row
                  @change="onPlanStatusChange"
                >
                  <v-radio label="Plan" value="Plan" UnControl="false"></v-radio>
                  <v-radio label="UnPlan" value="UnPlan"></v-radio>
                </v-radio-group>
              </v-flex>

              <v-spacer></v-spacer>

              <v-flex xs12 sm3 md3 v-if="selectedPlanStatus == 'Plan'">
                <div>
                  <v-checkbox
                    :disabled="editId != 0"
                    v-model="UnControl"
                    label="UnControl"
                  ></v-checkbox>
                </div>
              </v-flex>
              <v-flex xs12 sm5 md5>
                <v-autocomplete
                  v-model="mStatus"
                  :items="itemStatus"
                  item-value="key"
                  item-text="text"
                  dense
                  label="Status"
                  return-object
                  hide-details
                ></v-autocomplete>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions class="dialog-actions">
          <v-btn color="success" :disabled="!isValid" @click="submitForm"
            >✨ Submit ✨</v-btn
          >
          <v-btn color="error" text @click="resetForm">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <loading :isLoading="isLoading" />
  </div>
</template>
<script>
import { sync } from "vuex-pathify";
import Loading from "@/components/Loading";
import {
  gProblemMaster,
  iProblemMaster,
  dProblemMaster,
  gMachines,
  gLineProcess,
} from "@/services/apiOee.js";
import Swal from "sweetalert2";
import keyFilter from "@/plugins/keyFilter";
import { isEmpty } from "lodash";
import { readonly } from "vue";

export default {
  components: {
    Loading,
  },
  data() {
    return {
      keyFilter,
      dialog: false,
      isLoading: false,
      pagination: {
        sortBy: "",
        descending: false,
        page: 1,
        rowsPerPage: 10,
      },
      mSearch: "",
      headers: [
        {
          text: "Problem ID",
          align: "left",
          sortable: true,
          value: "problemID",
        },
        {
          text: "Problem Desc.",
          align: "left",
          sortable: false,
          value: "problemDescription",
        },
        {
          text: "Process Name",
          align: "left",
          sortable: false,
          value: "lineProcessName",
        },
        {
          text: "Machine Desc.",
          align: "left",
          sortable: false,
          value: "machineDescription",
        },
        {
          text: "Std. Time",
          align: "left",
          sortable: false,
          value: "stdTime",
        },
        {
          text: "Plan Status",
          align: "left",
          sortable: false,
          value: "planStatus",
        },
        {
          text: "Uncontrol Status",
          align: "left",
          sortable: false,
          value: "unControlStatus",
        },
        { text: "Status", align: "left", sortable: true, value: "status" },
        { text: "Action", align: "left", sortable: false, value: "Action" },
      ],
      itemProblem: [],
      rawData: [],
      lineProcessItem: [],
      mFilterProcess: [],
      itemMachine: [],
      itemLineProcess: [],
      mProblemDesc: "",
      mLineProcess: "",
      mMachine: "",
      mStdTime: 0,
      editId: 0,
      selectedPlanStatus: "Plan",
      UnControl: false,
      mStatus: {
        key: "Y",
        text: "Active",
      },
      itemStatus: [
        {
          key: "Y",
          text: "Active",
        },
        {
          key: "N",
          text: "InActive",
        },
      ],
    };
  },
  computed: {
    ...sync("*"),
    isEmplymProblemDesc() {
      return !isEmpty(this.mProblemDesc.trim());
    },
    isEmplymLineProcess() {
      return Object.keys(this.mLineProcess).length > 0;
    },
    isEmplymMachine() {
      return Object.keys(this.mMachine).length > 0;
    },
    isValid() {
      return this.isEmplymProblemDesc && this.isEmplymLineProcess && this.isEmplymMachine;
    },
  },
  watch: {
    mFilterProcess() {
      this.itemProblem = [];
      if (this.lineProcessItem.length == 0) return "unknow";
      if (this.mFilterProcess.length === 0) {
        this.itemProblem = this.rawData;
      }
      let processArray = this.mFilterProcess.map((item) => item.text);
      this.rawData.forEach((item) => {
        if (processArray.includes(item.lineProcessName)) {
          this.itemProblem.push(item);
        }
      });
    },
  },
  async created() {
    this.getProblemMaster();
    this.getMachine();
    this.getLineProcess();
  },
  methods: {
    onPlanStatusChange(value) {
      if (value === "Plan" && this.editId == 0) {
        this.UnControl = false; // รีเซ็ต UnControl เป็น false เมื่อเลือก "Plan"
      }
    },
    async getProblemMaster() {
      this.itemProblem = [];
      this.rawData = [];
      this.isLoading = true;
      try {
        const response = await gProblemMaster();
        this.rawData = response.results;
        this.itemProblem = response.results;

        this.lineProcessItem = [];
        const distinctLineProcess = [
          ...new Set(response.results.map((item) => item.lineProcessName)),
        ];
        const lineProcessItems = distinctLineProcess.map((process, index) => ({
          key: (index + 1).toString(),
          text: process,
        }));
        this.lineProcessItem = this.lineProcessItem.concat(lineProcessItems);
      } catch (error) {
        // หากเกิดข้อผิดพลาด ให้แสดงผลข้อความ
        Swal.fire({
          html: `Error fetching gProblemMaster master`,
          icon: "error",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonText: "OK",
        });
      } finally {
        // ปิดการแสดงผล Loading ในทุกกรณี
        this.isLoading = false;
      }
    },
    async getMachine() {
      this.itemMachine = [];
      this.isLoading = true;
      try {
        const response = await gMachines();
        this.itemMachine = response.results;
      } catch (error) {
        // หากเกิดข้อผิดพลาด ให้แสดงผลข้อความ
        Swal.fire({
          html: `Error fetching gMachines master`,
          icon: "error",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonText: "OK",
        });
      } finally {
        // ปิดการแสดงผล Loading ในทุกกรณี
        this.isLoading = false;
      }
    },
    async getLineProcess() {
      this.itemLineProcess = [];
      this.isLoading = true;
      try {
        const response = await gLineProcess();
        this.itemLineProcess = response.results;
      } catch (error) {
        // หากเกิดข้อผิดพลาด ให้แสดงผลข้อความ
        Swal.fire({
          html: `Error fetching gLineProcess master`,
          icon: "error",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonText: "OK",
        });
      } finally {
        // ปิดการแสดงผล Loading ในทุกกรณี
        this.isLoading = false;
      }
    },
    editItemProblem(val) {
      this.dialog = true;
      this.editId = val.problemID;
      this.mProblemDesc = val.problemDescription;
      this.mLineProcess = {
        lineProcessID: val.lineProcessID,
        lineProcessName: val.lineProcessName,
      };
      this.mMachine = {
        machineID: val.machineID,
        machineDescription: val.machineDescription,
      };
      this.selectedPlanStatus = val.planStatus == "Y" ? "Plan" : "UnPlan";
      this.UnControl = val.unControlStatus == "Y" ? true : false;
      this.mStatus = {
        key: val.status,
        text: val.status == "Y" ? "Active" : "InActive",
      };
    },
    deleteItemProblem(val) {
      Swal.fire({
        html: `Would you like to delete the problem no. "<strong> ${val.problemID}</strong>" ?`,
        icon: "warning",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: "#0c80c4",
        cancelButtonColor: "#C0C0C0",
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.isLoading = true;
          const data = {
            problemID: val.problemID,
            lineProcessID: val.lineProcessID,
            machineID: val.machineID,
          };
          try {
            await dProblemMaster(data);
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
                this.getProblemMaster();
              }
            });
          } catch (error) {
            // หากเกิดข้อผิดพลาด ให้แสดงผลข้อความ
            Swal.fire({
              html: `Error ${error}`,
              icon: "error",
              showCancelButton: false,
              allowOutsideClick: false,
              confirmButtonText: "OK",
            });
          } finally {
            // ปิดการแสดงผล Loading ในทุกกรณี
            this.isLoading = false;
          }
        }
      });
    },
    resetForm() {
      this.dialog = false;
      this.mProblemDesc = "";
      this.mLineProcess = "";
      this.mMachine = "";
      this.editId = 0;
      this.selectedPlanStatus = "Plan";
      this.UnControl = false;
      this.mStatus = {
        key: "Y",
        text: "Active",
      };
    },
    async submitForm() {
      let { empId } = this.infoLogin;
      const data = {
        problemID: this.editId.toString(),
        problemDescription: this.mProblemDesc,
        lineProcessID: this.mLineProcess.lineProcessID,
        machineID: this.mMachine.machineID,
        stdTime: this.mStdTime == "" ? 0 : this.mStdTime,
        planStatus: this.selectedPlanStatus == "Plan" ? "Y" : "N",
        unControlStatus: this.UnControl == true ? "Y" : "N",
        status: this.mStatus.key,
        empBy: empId,
      };
      this.isLoading = true;
      try {
        await iProblemMaster(data);
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
            this.resetForm();
            this.getProblemMaster();
          }
        });
      } catch (error) {
        // หากเกิดข้อผิดพลาด ให้แสดงผลข้อความ
        Swal.fire({
          html: `Error fetching reason master`,
          icon: "error",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonText: "OK",
        });
      } finally {
        // ปิดการแสดงผล Loading ในทุกกรณี
        this.isLoading = false;
      }
    },
  },
};
</script>
<style scoped>
.dialog-card {
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.25);
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  animation: fadeIn 0.5s ease-in-out;
  overflow: hidden; /* ป้องกันส่วนที่เกินจาก Header */
  position: relative; /* สำหรับปุ่ม Close */
}

/* Header */
.dialog-header {
  background: linear-gradient(90deg, #007fc4, #005f9c);
  color: white;
  padding: 16px;
  font-size: 1.5rem;
  font-weight: bold;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
}
/* Close Button */
.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: white;
  color: #007fc4;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  z-index: 10;
}
.close-btn:hover {
  background-color: #f8c849;
  color: white !important;
}
/* Actions */
.dialog-actions {
  justify-content: end;
  padding: 16px;
}
</style>

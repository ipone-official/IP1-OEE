<template>
  <v-container fluid grid-list-xs>
    <v-layout
      row
      wrap
      v-if="
        machineDetail.operatorEdit ||
        machineDetail.supervisorEdit ||
        machineDetail.managerEdit ||
        machineDetail.adminEdit
      "
    >
      <v-flex xs12 sm5 md4>
        <v-autocomplete
          placeholder="  Please select"
          v-model="mMachine"
          prefix="*"
          :items="itemMachine"
          item-value="machineID"
          item-text="machineDescription"
          dense
          label="Machine & Problem"
          return-object
          hide-details
          class="custom-autocomplete"
        ></v-autocomplete>
      </v-flex>

      <v-flex xs12 sm4 md3 ml-4>
        <v-radio-group v-model="selectedPlanStatus" row>
          <v-radio label="Plan" value="Plan"></v-radio>
          <v-radio label="UnPlan" value="UnPlan"></v-radio>
        </v-radio-group>
      </v-flex>
      <v-spacer></v-spacer>

      <v-flex xs12 sm4 md3 v-if="selectedPlanStatus == 'Plan'">
        <div>
          <v-checkbox v-model="UnControl" label="UnControl"></v-checkbox>
        </div>
      </v-flex>
    </v-layout>
    <v-layout
      row
      wrap
      v-if="
        machineDetail.operatorEdit ||
        machineDetail.supervisorEdit ||
        machineDetail.managerEdit ||
        machineDetail.adminEdit
      "
    >
      <v-flex xs12 sm5 md4>
        <v-autocomplete
          placeholder="  Please select"
          v-model="mProblemDesc"
          prefix="*"
          :items="itemProblemDesc"
          item-value="problemID"
          item-text="problemDescription"
          dense
          label="Problem Description"
          return-object
          hide-details
          class="custom-autocomplete"
        ></v-autocomplete>
      </v-flex>
      <v-flex xs12 sm5 md3>
        <v-text-field
          v-model="formattedDowntime"
          prepend-icon=" "
          prefix="*"
          style="color: red"
          label="Downtime (min)"
          @keydown.native="keyFilter($event, 'decimal')"
        ></v-text-field>
      </v-flex>
      <!-- <v-spacer></v-spacer> -->
      <v-layout justify-end style="margin-top: 0rem">
        <v-tooltip top color="teal">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              small
              color="#007fc4"
              dark
              @click="addTransactionProblem(editMode)"
              class="ma-2 small-export-button"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon size="20">
                {{ editMode ? "mdi-pencil-outline" : "mdi-plus" }}</v-icon
              >
            </v-btn>
          </template>
          <span>{{ editMode ? "Edit item damage" : "Add item damage" }}</span>
        </v-tooltip>
      </v-layout>
    </v-layout>
    <v-layout style="margin-top: -1.2rem" v-if="isGreaterThanPB9000">
      <v-flex xs12 sm12 md12>
        <v-textarea
          v-model="fOther"
          prepend-icon="mdi-note-text-outline"
          maxlength="100"
          counter="100"
          prefix="*"
          style="color: red"
          rows="2"
          label="Remark"
        ></v-textarea>
      </v-flex>
    </v-layout>
    <v-data-table
      style="margin-top: 1.2rem"
      :headers="headers"
      :items="machineDetail.itemProblemTable"
      item-key="problemID"
      :pagination.sync="pagination"
      :rows-per-page-items="rowsPerPageItem"
    >
      <template v-slot:items="props">
        <tr>
          <td class="text-xs-left">
            {{ props.item.itemNo }}
          </td>
          <td class="text-xs-left">{{ props.item.machineDescription }}</td>
          <td class="text-xs-left">{{ props.item.problemDescription }}</td>
          <td class="text-xs-left">
            {{ functions.numberWithCommas(props.item.downtime) }}
          </td>
          <v-layout
            v-if="
              machineDetail.operatorEdit ||
              machineDetail.supervisorEdit ||
              machineDetail.managerEdit ||
              machineDetail.adminEdit
            "
          >
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
              v-if="!editMode"
              color="red"
              fab
              small
              class="extra-small-btn"
              @click="deleteItemProblem(props.item)"
            >
              <v-icon style="margin-top: 0.1rem; color: white">mdi-delete</v-icon>
            </v-btn>
          </v-layout>
          <v-layout v-else>
            <v-btn color="green" fab small class="extra-small-btn">
              <v-icon style="margin-top: 0.1rem; color: white">mdi-check</v-icon>
            </v-btn>
          </v-layout>
        </tr>
      </template>
    </v-data-table>
    <v-snackbar color="orange" v-model="showResult" :timeout="3500">
      {{ msgResult }}
    </v-snackbar>
    <loading :isLoading="isLoading" />
  </v-container>
</template>
<script>
import Swal from "sweetalert2";
import axios from "axios";
import { sync } from "vuex-pathify";
import functions from "@/plugins/functions";
import keyFilter from "@/plugins/keyFilter";
import loading from "@/components/Loading";
import { isEmpty } from "lodash";

export default {
  components: {
    loading,
  },
  data() {
    return {
      fOther: "",
      UnControl: false,
      selectedPlanStatus: "",
      keyFilter,
      functions,
      msgResult: "",
      showResult: false,
      isLoading: false,
      itemMachine: [],
      mMachine: "",
      mProblemDesc: "",
      itemProblemDesc: [],
      mDowntime: 0,
      pagination: {
        sortBy: "",
        descending: false,
        page: 1,
        rowsPerPage: 5,
      },
      headers: [
        {
          text: "No",
          align: "left",
          sortable: false,
          value: "itemNo",
        },
        {
          text: "Machine & Problem",
          align: "left",
          sortable: false,
          value: "machineID",
        },
        {
          text: "Problem Description",
          align: "left",
          sortable: false,
          value: "problemDescription",
        },
        { text: "Downtime(Min)", align: "left", sortable: false, value: "downtime" },
        { text: "Action", align: "left", sortable: false, value: "Action" },
      ],
      editMode: false,
      editId: 0,
      editItem: {},
      ThanPB9000: false,
    };
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
    isGreaterThanPB9000() {
      if (this.mProblemDesc == "") return (this.ThanPB9000 = false);
      const problemNumber = parseInt(this.mProblemDesc.problemID.slice(2));
      return (this.ThanPB9000 = problemNumber > 9000);
    },
    formattedDowntime: {
      get() {
        if (!this.mDowntime) return 0;
        return this.mDowntime.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      set(value) {
        this.mDowntime = Number(value.replace(/,/g, "")) || 0;
      },
    },
  },
  watch: {
    mMachine() {
      if (this.editMode) return;
      this.itemProblemDesc = [];
      this.UnControl = false;
      this.mDowntime = 0;
      this.fOther = "";
      const status = this.selectedPlanStatus == "UnPlan" ? "N" : "Y";
      const unControl = this.UnControl == true ? "Y" : "N";
      if (this.mMachine.machineID == "M000") {
        this.selectedPlanStatus = "Plan";
        this.itemProblemDesc = this.itemMachine.filter(
          (result) =>
            result.planStatus == status &&
            result.machineID == this.mMachine.machineID &&
            result.unControlStatus == unControl
        );
      } else {
        this.selectedPlanStatus = "UnPlan";
        this.itemProblemDesc = this.itemMachine.filter(
          (result) =>
            result.planStatus == status &&
            result.machineID == this.mMachine.machineID &&
            result.unControlStatus == unControl
        );
        this.UnControl = false;
      }
      if (this.editMode) return;
      this.mProblemDesc = "";
    },
    selectedPlanStatus(val) {
      this.itemProblemDesc = [];
      this.mDowntime = 0;
      const status = val == "UnPlan" ? "N" : "Y";
      const unControl = this.UnControl == true ? "Y" : "N";
      if (val == "UnPlan") {
        this.itemProblemDesc = this.itemMachine.filter(
          (result) =>
            result.planStatus == status &&
            result.machineID == this.mMachine.machineID &&
            result.unControlStatus == unControl
        );
        this.UnControl = false;
      } else {
        this.itemProblemDesc = this.itemMachine.filter(
          (result) =>
            result.planStatus == status &&
            result.machineID == this.mMachine.machineID &&
            result.unControlStatus == unControl
        );
      }
      if (this.editMode) return;
      this.mProblemDesc = "";
    },
    UnControl(val) {
      if (this.selectedPlanStatus == "") return (this.itemProblemDesc = []);
      this.itemProblemDesc = [];
      this.mDowntime = 0;
      const status = val == "UnPlan" ? "N" : "Y";
      const unControl = val == true ? "Y" : "N";
      this.itemProblemDesc = this.itemMachine.filter(
        (result) =>
          result.planStatus == status &&
          result.unControlStatus == unControl &&
          result.machineID == this.mMachine.machineID
      );
      if (this.editMode) return;
      this.mProblemDesc = "";
    },
    mProblemDesc(val) {
      this.mDowntime = 0;
      if (this.editMode) return;
      this.fOther = "";
      this.mDowntime = val.stdTime;
    },
  },
  created() {
    this.GetProblem();
  },
  methods: {
    async GetProblem() {
      this.isLoading = true;
      this.itemMachine = [];
      try {
        const response = await axios.get(
          `${this.EndpointPortal}/ApiOEE/OEE/v1/GetProblems?lineProcessID=${this.machineDetail.selectTransactionTProcess.lineProcessID}`
        );
        if (response.data.status == 200) {
          this.itemMachine = response.data.results;
          const machineIDs = new Set();
          this.itemMachine.forEach((result) => {
            machineIDs.add(result.machineID);
          });
          if (Array.from(machineIDs).length == 1) {
            this.mMachine = this.itemMachine[0];
          }
          const init = this.itemMachine.filter((problem) => problem.machineID === "M000");
          if (init.length > 0) {
            this.mMachine = init[0];
          }
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
    },
    addTransactionProblem(mode) {
      if (isEmpty(this.mMachine)) {
        this.showResult = true;
        return (this.msgResult = "Machine and problem fields cannot be left blank.");
      }
      if (isEmpty(this.mProblemDesc)) {
        this.showResult = true;
        return (this.msgResult = "Problem description cannot be left blank.");
      }
      if (this.mDowntime == 0) {
        this.showResult = true;
        return (this.msgResult = "Downtime cannot be blank or set to 0.");
      }
      if (this.ThanPB9000 && this.fOther == "") {
        this.showResult = true;
        return (this.msgResult = "Remark cannot be blank or set to 0.");
      }
      if (mode) {
        Swal.fire({
          html: `Would you like to edit the item no. ${this.editId} `,
          icon: "warning",
          showCancelButton: true,
          allowOutsideClick: false,
          confirmButtonColor: "#0c80c4",
          cancelButtonColor: "#C0C0C0",
          confirmButtonText: "OK",
        }).then(async (result) => {
          if (result.isConfirmed) {
            const index = this.machineDetail.itemProblemTable.indexOf(this.editItem);
            this.machineDetail.itemProblemTable.splice(index, 1);
            this.machineDetail.itemProblemTable.push({
              problemID: this.mProblemDesc.problemID,
              problemDescription: this.ThanPB9000
                ? this.fOther
                : this.mProblemDesc.problemDescription,
              lineProcessID: this.mMachine.lineProcessID,
              lineProcessName: this.mMachine.lineProcessName,
              machineID: this.mMachine.machineID,
              machineDescription: this.mMachine.machineDescription,
              planStatus: this.selectedPlanStatus == "UnPlan" ? "N" : "Y",
              unControlStatus: this.UnControl == true ? "Y" : "N",
              downtime: this.mDowntime,
              itemNo: this.editId,
            });
            this.machineDetail.itemProblemTable.sort((a, b) => a.itemNo - b.itemNo);

            this.editMode = false;
            this.editId = 0;
            this.editItem = {};
            this.mDowntime = 0;
            this.mMachine = "";
            this.mProblemDesc = "";
            this.selectedPlanStatus = "";
            this.fOther = "";
            this.itemProblemDesc = [];
            this.UnControl = false;
            const init = this.itemMachine.filter(
              (problem) => problem.machineID === "M000"
            );
            if (init.length > 0) {
              this.mMachine = init[0];
            }
          } else {
            this.editMode = false;
            this.editId = 0;
            this.editItem = {};
            this.mDowntime = 0;
            this.mMachine = "";
            this.fOther = "";
            this.mProblemDesc = "";
            this.selectedPlanStatus = "";
            this.itemProblemDesc = [];
            this.UnControl = false;
            const init = this.itemMachine.filter(
              (problem) => problem.machineID === "M000"
            );
            if (init.length > 0) {
              this.mMachine = init[0];
            }
          }
        });
        return;
      } else {
        this.machineDetail.itemProblemTable.push({
          problemID: this.mProblemDesc.problemID,
          problemDescription: this.ThanPB9000
            ? this.fOther
            : this.mProblemDesc.problemDescription,
          lineProcessID: this.mMachine.lineProcessID,
          lineProcessName: this.mMachine.lineProcessName,
          machineID: this.mMachine.machineID,
          machineDescription: this.mMachine.machineDescription,
          planStatus: this.selectedPlanStatus == "UnPlan" ? "N" : "Y",
          unControlStatus: this.UnControl == true ? "Y" : "N",
          downtime: this.mDowntime,
        });
        this.machineDetail.itemProblemTable.forEach(
          (element, index) =>
            (this.machineDetail.itemProblemTable[index].itemNo = index + 1)
        );
        this.machineDetail.itemProblemTable.sort((a, b) => a.itemNo - b.itemNo);

        const combined = {};

        // ลูปผ่านรายการทั้งหมดใน results
        this.machineDetail.itemProblemTable.forEach((result) => {
          const key = `${result.machineID}-${result.problemID}`;
          // ถ้า key นี้ยังไม่ถูกสร้าง ให้สร้าง key ใหม่และเพิ่มค่า QtyEA
          if (!combined[key]) {
            combined[key] = { ...result, downtime: parseInt(result.downtime) }; // สร้าง key และแปลง QtyEA เป็น integer
          } else {
            // ถ้า key มีอยู่แล้ว ให้บวกค่า QtyEA เข้าไป
            combined[key].downtime += parseInt(result.downtime);
          }
        });
        this.machineDetail.itemProblemTable = Object.values(combined);
        this.editMode = false;
        this.editId = 0;
        this.editItem = {};
        this.mDowntime = 0;
        this.mMachine = "";
        this.mProblemDesc = "";
        this.fOther = "";
        this.selectedPlanStatus = "";
        this.itemProblemDesc = [];
        this.UnControl = false;
        const init = this.itemMachine.filter((problem) => problem.machineID === "M000");
        if (init.length > 0) {
          this.mMachine = init[0];
        }
      }
    },
    editItemProblem(val) {
      this.editMode = true;
      this.editId = val.itemNo;
      this.editItem = val;
      const initEdit = this.itemMachine.filter(
        (result) => result.problemID === val.problemID
      );
      this.mMachine = {
        machineID: initEdit[0].machineID,
        machineDescription: initEdit[0].machineDescription,
      };
      this.mProblemDesc = {
        problemID: initEdit[0].problemID,
        problemDescription: initEdit[0].problemDescription,
      };
      this.mDowntime = val.downtime;
      const statusPlan = initEdit[0].planStatus == "Y" ? "Plan" : "UnPlan";
      this.selectedPlanStatus = statusPlan;
      const statusUncontrol = initEdit[0].unControlStatus == "Y" ? true : false;
      this.UnControl = statusUncontrol;
      const problemNumber = parseInt(this.mProblemDesc.problemID.slice(2));
      this.ThanPB9000 = problemNumber > 9000;
      this.fOther = this.ThanPB9000 ? val.problemDescription : "";
    },
    deleteItemProblem(item) {
      const index = this.machineDetail.itemProblemTable.indexOf(item);
      Swal.fire({
        html: `Would you like to delete the item no. "<strong>${item.itemNo} : ${item.problemDescription}</strong>" ?`,
        icon: "warning",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: "#0c80c4",
        cancelButtonColor: "#C0C0C0",
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.machineDetail.itemProblemTable.splice(index, 1);
          this.machineDetail.itemProblemTable.forEach(
            (element, index) =>
              (this.machineDetail.itemProblemTable[index].itemNo = index + 1)
          );
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

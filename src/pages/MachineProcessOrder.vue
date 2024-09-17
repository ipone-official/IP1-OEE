<template>
  <v-container fluid grid-list-xs>
    <v-layout justify-end>
      <v-tooltip top color="teal">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            small
            color="#007fc4"
            dark
            @click="(dialogTransactionOee = true), (CheckInDate = functions.formatDate())"
            class="ma-2 small-export-button"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon size="20">mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Add Transaction</span>
      </v-tooltip>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs9 sm3 md2>
        <calendar
          :value.sync="formDate"
          label="Start Date"
          :readonly="true"
          :disabled="DateDisibled"
        />
      </v-flex>
      <div style="margin-left: 3rem; margin-top: 1rem; font-weight: bold">TO</div>
      <v-flex xs9 sm3 md2>
        <calendar
          :value.sync="toDate"
          label="Current Date"
          :disabled="DateDisibled"
          :readonly="true"
        />
      </v-flex>
      <v-flex style="margin-left: 2rem">
        <v-tooltip top color="teal" v-if="!DateDisibled">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              small
              color="#007fc4"
              dark
              class="ma-2 small-export-button"
              v-bind="attrs"
              v-on="on"
              @click="GetTProcessList"
            >
              <v-icon size="20">mdi-magnify</v-icon>
            </v-btn>
          </template>
          <span>Search</span>
        </v-tooltip>

        <v-tooltip top color="teal" v-if="DateDisibled">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              small
              color="#007fc4"
              dark
              class="ma-2 small-export-button"
              v-bind="attrs"
              v-on="on"
              @click="clearSearch"
            >
              <v-icon size="20">mdi-close</v-icon>
            </v-btn>
          </template>
          <span>close</span>
        </v-tooltip>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs12 sm5 md4 v-if="DateDisibled">
        <v-text-field
          v-model="search"
          flat
          label="Search"
          prepend-inner-icon="search"
          solo
          dense
          hide-details
          clearable
        ></v-text-field>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex xs12 sm5 md3 v-if="DateDisibled">
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
      <v-flex xs12 sm5 md3 v-if="DateDisibled">
        <v-autocomplete
          solo
          v-model="mFilterStatus"
          prepend-icon=" "
          :items="StatusItem"
          item-value="key"
          item-text="text"
          dense
          label="Status"
          return-object
          hide-details
          multiple
        ></v-autocomplete>
      </v-flex>
    </v-layout>
    <v-toolbar
      style="margin-top: 0.5rem"
      xs12
      sm8
      color="#f8c849"
      dark
      tabs
      v-if="itemTransactionTProcess.length == 0"
    >
      <v-layout justify-center style="font-size: larger"> no data available </v-layout>
    </v-toolbar>
    <v-data-table
      style="margin-top: 0.5rem"
      v-if="itemTransactionTProcess.length > 0"
      :headers="headersTProcess"
      :items="itemTransactionTProcess"
      item-key="processID"
      :search="search"
      :pagination.sync="pagination"
      :rows-per-page-items="rowsPerPageItem"
    >
      <template v-slot:items="props">
        <tr>
          <td class="text-xs-left">
            {{ props.item.processID }}
          </td>
          <td class="text-xs-left">{{ props.item.lineProcessName }}</td>
          <td class="text-xs-left">{{ props.item.username }}</td>
          <td class="text-xs-left">
            {{ props.item.shift }}
          </td>
          <td class="text-xs-left">
            {{ props.item.materialCode }}
          </td>
          <td class="text-xs-left">
            {{ props.item.materialDesc }}
          </td>
          <!-- <td class="text-xs-left">
            {{ props.item.materialColor }}
          </td>
          <td class="text-xs-left">
            {{ props.item.materialSize }}
          </td>
          <td class="text-xs-left">
            {{ props.item.materialCategory }}
          </td> -->
          <td class="text-xs-left">
            {{ props.item.filmDescription }}
          </td>
          <td class="text-xs-left">
            {{ functions.formatDateFormat(props.item.checkIn) }}
          </td>
          <td class="text-xs-left">
            {{ functions.formatDateFormat(props.item.checkOut) }}
          </td>
          <td class="text-xs-left">
            {{ props.item.status }}
          </td>

          <v-btn
            color="#007fc4"
            fab
            small
            class="extra-small-btn"
            @click="
              (machineDetail.dialogTransactionDetail = true), SelectProcesList(props.item)
            "
          >
            <v-icon style="margin-top: 0.1rem; color: white"
              >mdi-washing-machine-alert</v-icon
            >
          </v-btn>
          <v-btn color="red" fab small class="extra-small-btn" @click="">
            <v-icon style="margin-top: 0.1rem; color: white">mdi-door-open</v-icon>
          </v-btn>
        </tr>
      </template>
    </v-data-table>

    <v-dialog v-model="dialogTransactionOee" persistent max-width="1180px">
      <v-card>
        <v-card-title>
          <v-flex xs12 sm5 md4>
            <div class="pa-3 inner-card mt-3">
              <v-layout>
                <div class="font-weight-bold mb-2">Check-In Time :</div>
                <div style="margin-left: 0.7rem">
                  {{ CheckInDate == "" ? " " : functions.formatDateFormat(CheckInDate) }}
                </div>
              </v-layout>
            </div>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex xs12 sm5 md4>
            <div class="pa-3 inner-card mt-3">
              <v-layout>
                <div class="font-weight-bold mb-2">Operator :</div>
                <div style="margin-left: 0.7rem">{{ infoLogin.samAccount }}</div>
              </v-layout>
            </div>
          </v-flex>
          <v-tooltip top color="teal">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                @click="dialogTransactionOee = false"
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
        <div style="margin-top: -1.5rem; padding: 1rem">
          <v-layout style="align-items: baseline">
            <v-chip color="primary" text-color="white" class="mb-2"> Process </v-chip>
            <v-spacer></v-spacer>
            <v-tooltip top color="teal">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  fab
                  small
                  color="green"
                  dark
                  @click="CreateTProcessList"
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
          <v-layout row wrap>
            <v-flex xs12 sm3 md4>
              <v-radio-group v-model="selectedOption" row>
                <v-radio label="Production Order" value="productionOrder"></v-radio>
                <v-radio label="Material Master" value="materialMaster"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs12 sm3 md2>
              <v-autocomplete
                placeholder="  Please select"
                v-model="mLineProcess"
                prepend-icon="mdi-washing-machine"
                :items="itemLineProcess"
                item-value="lineProcessID"
                item-text="lineProcessName"
                dense
                label="Line Process"
                return-object
                hide-details
                class="custom-autocomplete"
              ></v-autocomplete>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs12 sm3 md2>
              <v-autocomplete
                placeholder="  Please select"
                v-model="mFilm"
                prepend-icon="mdi-film"
                :items="itemFilms"
                item-value="filmID"
                item-text="filmDescription"
                dense
                label="Films"
                return-object
                hide-details
                class="custom-autocomplete"
              ></v-autocomplete>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs12 sm3 md3>
              <v-text-field
                v-model="searchMaterial"
                flat
                label="Search"
                prepend-inner-icon="search"
                solo
                dense
                hide-details
                clearable
              ></v-text-field>
            </v-flex>
          </v-layout>

          <v-data-table
            :headers="headers"
            :items="itemMaterialMaster"
            :search="searchMaterial"
            v-model="selected"
            item-key="materialCode"
            :pagination.sync="pagination"
            :rows-per-page-items="rowsPerPageItem"
          >
            <template v-slot:items="props">
              <td style="background: #dbdbdb !important">
                <v-checkbox
                  v-model="props.selected"
                  :disabled="disableCheckbox(props.item.materialCode)"
                  primary
                  hide-details
                ></v-checkbox>
              </td>
              <td class="text-xs-left">{{ props.item.materialCode }}</td>
              <td class="text-xs-left">{{ props.item.materialDescriptionTh }}</td>
              <td class="text-xs-left">{{ props.item.displayHg1_3 }}</td>
              <td class="text-xs-left">{{ props.item.hgLv5 }}</td>
              <td>{{ props.item.hgDescLv7 }}</td>
              <td class="text-xs-left">{{ props.item.speedStd }}</td>
            </template>
            <template v-slot:no-data> </template>
          </v-data-table>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            flat
            color="#007fc4"
            style="border-radius: 12px"
            @click="dialogTransactionOee = false"
            >close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <DetailProcess />
  </v-container>
</template>
<script>
import axios from "axios";
import { sync } from "vuex-pathify";
import Loading from "@/components/core/Loading";
import calendar from "@/components/DatePiker.vue";
import { isEmpty } from "lodash";
import Swal from "sweetalert2";
import functions from "@/plugins/functions";
import DetailProcess from "@/pages/OeePage/mainProcess.vue";

export default {
  components: {
    calendar,
    Loading,
    DetailProcess,
  },
  data() {
    return {
      DateDisibled: false,
      selected: [],
      functions,
      itemOee: [],
      dialogTransactionOee: false,
      itemLineProcess: [],
      loadingDialog: false,
      mLineProcess: "",
      itemFilms: [],
      mFilm: "",
      selectedOption: "productionOrder",
      itemMaterialMaster: [],
      mMaterialMaster: "",
      headers: [
        { text: "", align: "left", sortable: false, value: "materialCode" },
        { text: "Material Code", align: "left", sortable: false, value: "materialCode" },
        {
          text: "Material Description",
          align: "left",
          sortable: false,
          value: "materialDescriptionTh",
        },
        {
          text: "Hg",
          align: "left",
          sortable: false,
          value: "displayHg1_3",
        },
        {
          text: "HgLv5",
          align: "left",
          sortable: false,
          value: "hgLv5",
        },
        {
          text: "HgLv7",
          align: "left",
          sortable: false,
          value: "hgDescLv7",
        },
        { text: "Speed Std.", align: "left", sortable: false, value: "speedStd" },
      ],
      search: "",
      searchMaterial: "",
      pagination: {
        sortBy: "",
        descending: false,
        page: 1,
        rowsPerPage: 5,
      },
      CheckInDate: "",
      itemTransactionTProcess: [],
      headersTProcess: [
        { text: "Process ID", align: "left", sortable: false, value: "processID" },
        {
          text: "Line Process",
          align: "left",
          sortable: false,
          value: "lineProcessName",
        },
        { text: "Operator", align: "left", sortable: false, value: "username" },
        { text: "Shift", align: "left", sortable: false, value: "shift" },
        {
          text: "Material",
          align: "left",
          sortable: false,
          value: "materialCode",
        },
        {
          text: "Description",
          align: "left",
          sortable: false,
          value: "materialDesc",
        },
        // {
        //   text: "Color",
        //   align: "left",
        //   sortable: false,
        //   value: "materialColor",
        // },
        // {
        //   text: "Size",
        //   align: "left",
        //   sortable: false,
        //   value: "materialSize",
        // },
        // { text: "Category", align: "left", sortable: false, value: "materialCategory" },
        { text: "Film", align: "left", sortable: false, value: "filmDescription" },
        { text: "Check-In", align: "left", sortable: false, value: "checkIn" },
        { text: "Check-Out", align: "left", sortable: false, value: "checkOut" },
        { text: "Status", align: "left", sortable: false, value: "status" },
        { text: "Action", align: "left", sortable: false, value: "Action" },
      ],
      mFilterProcess: [],
      lineProcessItem: [],
      mFilterStatus: [],
      StatusItem: [
        {
          key: 1,
          text: "InProcess",
        },
        {
          key: 2,
          text: "WaitConfirm",
        },
        {
          key: 3,
          text: "WaitApproved",
        },
        {
          key: 4,
          text: "Completed",
        },
      ],
      rawData: [],
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
  },
  watch: {
    flagGetTProcess(val) {
      if (val && this.DateDisibled) return this.GetTProcessList();
    },
    mFilterProcess() {
      if (this.lineProcessItem.length == 0) return "unknow";
      this.changeFilter();
    },
    mFilterStatus() {
      if (this.StatusItem.length == 0) return "unknow";
      this.changeFilter();
    },
  },
  created() {
    this.getLineProcess();
    this.getFilm();
    this.GetMaterialMaster();
  },
  methods: {
    changeFilter() {
      this.itemTransactionTProcess = [];

      let processArray = this.mFilterProcess.map((item) => item.text);
      let statusArray = this.mFilterStatus.map((item) => item.text);
      if (this.mFilterProcess.length == 0 && this.mFilterStatus.length == 0) {
        this.itemTransactionTProcess = this.rawData;
      } else if (this.mFilterProcess.length != 0 && this.mFilterStatus.length == 0) {
        this.rawData.forEach((item) => {
          if (processArray.includes(item.lineProcessName)) {
            this.itemTransactionTProcess.push(item);
          }
        });
      } else if (this.mFilterProcess.length == 0 && this.mFilterStatus.length != 0) {
        this.rawData.forEach((item) => {
          if (statusArray.includes(item.status)) {
            this.itemTransactionTProcess.push(item);
          }
        });
      } else if (this.mFilterProcess.length != 0 && this.mFilterStatus.length != 0) {
        this.rawData.forEach((item) => {
          if (
            processArray.includes(item.lineProcessName) &&
            statusArray.includes(item.status)
          ) {
            this.itemTransactionTProcess.push(item);
          }
        });
      }
    },
    disableCheckbox(materialCode) {
      return (
        this.selected.length >= 1 && !this.selected[0].materialCode.includes(materialCode)
      );
    },
    async GetTProcessList() {
      this.loadingDialog = true;
      this.itemTransactionTProcess = [];
      this.flagGetTProcess = false;
      let pProcessDate = {
        startDate: this.formDate,
        endDate: this.toDate,
      };
      const response = await axios.post(
        `${this.EndpointPortal}/ApiOEE/OEE/v1/GetTProcessList`,
        pProcessDate
      );
      if (response.data.status == 200) {
        this.loadingDialog = false;
        this.DateDisibled = true;
        response.data.results.forEach((element, index) =>
          this.rawData.push({
            processID: element.processID,
            lineProcessID: element.lineProcessID,
            lineProcessName: element.lineProcessName,
            userID: element.userID,
            username: element.username,
            shift: element.shift,
            materialCode: element.materialCode,
            materialDesc: element.materialDesc,
            materialColor: element.materialColor,
            materialSize: element.materialSize,
            materialCategory: element.materialCategory,
            filmID: element.filmID,
            filmDescription: element.filmDescription,
            machineSTD: element.machineSTD,
            qtyDozen: element.qtyDozen,
            qtyEA: element.qtyEA,
            stdCycleTime: element.stdCycleTime,
            operatingTime: element.operatingTime,
            workingTime: element.workingTime,
            workingTimeMin: element.workingTimeMin,
            machineWorkingTime: element.machineWorkingTime,
            plannedDowntime: element.plannedDowntime,
            unplannedDowntime: element.unplannedDowntime,
            speedLose: element.speedLose,
            summaryDowntime: element.summaryDowntime,
            damagePercentage: element.damagePercentage,
            checkIn: element.checkIn,
            checkOut: element.checkOut,
            status: element.status,
          })
        );
        this.itemTransactionTProcess = this.rawData;
        this.lineProcessItem = [];
        const distinctLineProcess = [
          ...new Set(this.rawData.map((item) => item.lineProcessName)),
        ];
        const lineProcessItems = distinctLineProcess.map((process, index) => ({
          key: (index + 1).toString(),
          text: process,
        }));
        this.lineProcessItem = this.lineProcessItem.concat(lineProcessItems);
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
    },
    async getFilm() {
      this.loadingDialog = true;
      this.itemFilms = [];
      const response = await axios.get(`${this.EndpointPortal}/ApiOEE/OEE/v1/GetFilms`);
      console.log("response", response);
      if (response.data.status == 200) {
        this.loadingDialog = false;
        response.data.results.forEach((element, index) =>
          this.itemFilms.push({
            filmID: element.filmID,
            filmDescription: element.filmDescription,
          })
        );
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
    },
    async CreateTProcessList() {
      if (isEmpty(this.mLineProcess)) {
        this.showResult = true;
        return (this.msgResult = "line process can't be null.");
      }
      if (isEmpty(this.mFilm)) {
        this.showResult = true;
        return (this.msgResult = "Film can't be null.");
      }
      this.loadingDialog = true;
      let { empId } = this.infoLogin;
      const init = {
        processID: "",
        lineProcessID: this.mLineProcess.lineProcessID,
        userID: empId,
        prodOrderID: "123",
        material_Code: this.selected[0].materialCode,
        filmID: this.mFilm.filmID,
        checkIN: this.CheckInDate,
        status: "InProcess",
      };
      const response = await axios.post(
        `${this.EndpointPortal}/ApiOEE/OEE/v1/InsertProcessList`,
        init
      );
      if (response.data.status == 200) {
        Swal.fire({
          html: `Successfully`,
          icon: "success",
          showCancelButton: true,
          allowOutsideClick: false,
          confirmButtonColor: "#0c80c4",
          cancelButtonColor: "#C0C0C0",
          confirmButtonText: "OK",
        }).then(async (result) => {
          if (result.isConfirmed) {
            this.flagGetTProcess = true;
            this.dialogTransactionOee = false;
            this.selectedOption = "productionOrder";
            this.mMaterialMaster = "";
            this.mFilm = "";
          }
        });
      }
    },
    async getLineProcess() {
      this.loadingDialog = true;
      this.itemLineProcess = [];
      const response = await axios.get(
        `${this.EndpointPortal}/ApiOEE/OEE/v1/GetLineProcess`
      );
      if (response.data.status == 200) {
        this.loadingDialog = false;
        response.data.results.forEach((element, index) =>
          this.itemLineProcess.push({
            lineProcessID: element.lineProcessID,
            lineProcessName: element.lineProcessName,
          })
        );
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
    },
    async GetMaterialMaster() {
      this.loadingDialog = true;
      this.itemMaterialMaster = [];
      const response = await axios.get(
        `${this.EndpointPortal}/ApiOEE/OEE/v1/GetMaterialMaster`
      );
      if (response.data.status == 200) {
        this.loadingDialog = false;
        response.data.results.forEach((element, index) =>
          this.itemMaterialMaster.push({
            hgLv1: element.hgLv1,
            hgLv3: element.hgLv3,
            hgLv5: element.hgLv5,
            hgDescLv7: element.hgDescLv7,
            materialCode: element.materialCode,
            materialDescriptionTh: element.materialDescriptionTh,
            materialDescriptionEn: element.materialDescriptionEn,
            speedStd: element.speedStd,
            displayHg1_3: `${element.hgLv1} ${
              element.hgLv3 == "" ? "" : `- ${element.hgLv3}`
            }`,
          })
        );
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
    },
    async SelectProcesList(val) {
      this.machineDetail.selectTransactionTProcess = val;
      this.machineDetail.machineStd = this.machineDetail.selectTransactionTProcess.machineSTD;
      this.machineDetail.QtyDz = 0;
      this.machineDetail.itemDamageTable = [];
      this.machineDetail.itemProblemTable = [];
      this.getProblemDetail(this.machineDetail.selectTransactionTProcess.processID);
      this.getReasonDetail(this.machineDetail.selectTransactionTProcess.processID);
    },
    clearSearch() {
      this.DateDisibled = false;
      this.itemTransactionTProcess = [];
    },
    async getProblemDetail(processID) {
      const response = await axios.get(
        `${this.EndpointPortal}/ApiOEE/OEE/v1/GetProblemDetailByID?processID=${processID}`
      );
      console.log(response, "getProblemDetail");
      if (response.data.status == 200) {
        for (let i = 0; i < response.data.results.length; i++) {
          this.machineDetail.itemProblemTable.push({
            problemID: response.data.results[i].problemID,
            problemDescription: response.data.results[i].problemDescription,
            lineProcessID: response.data.results[i].lineProcessID,
            lineProcessName: response.data.results[i].lineProcessName,
            machineID: response.data.results[i].machineID,
            machineDescription: response.data.results[i].machineDescription,
            planStatus: response.data.results[i].planStatus == "Y" ? "Plan" : "UnPlan",
            unControlStatus:
              response.data.results[i].unControlStatus == "N" ? true : false,
            downtime: response.data.results[i].downtime,
            itemNo: i + 1,
          });
        }
      }
    },
    async getReasonDetail(processID) {
      const response = await axios.get(
        `${this.EndpointPortal}/ApiOEE/OEE/v1/GetReasonDetailByID?processID=${processID}`
      );
      console.log(response, "getReasonDetail");
      if (response.data.status == 200) {
        for (let i = 0; i < response.data.results.length; i++) {
          this.machineDetail.itemDamageTable.push({
            reasonID: response.data.results[i].reasonID,
            reasonHeader: response.data.results[i].reasonHeader,
            reasonDescID: response.data.results[i].reasonDescID,
            reasonDesc: response.data.results[i].reasonDesc,
            QtyEA: response.data.results[i].qty,
            itemNo: i + 1,
          });
        }
      }
    },
  },
};
</script>

<style>
.custom-autocomplete .v-input__prefix {
  color: red;
}
.custom-autocomplete .v-input__slot {
  color: red;
}
.theme--light.v-table thead th {
  background-image: -webkit-gradient(
    linear,
    right top,
    left top,
    from(rgba(51, 148, 225, 0.18)),
    to(transparent)
  );
  background-image: linear-gradient(270deg, rgba(51, 148, 225, 0.18), transparent);
  background-color: #007fc4 !important;
  font-size: 15px !important;
  color: #ffffff !important;
}

.theme--light.v-datatable thead th.column.sortable.active,
.theme--light.v-datatable thead th.column.sortable.active .v-icon,
.theme--light.v-datatable thead th.column.sortable:hover {
  color: #ffffff !important;
}
.inner-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  height: 3.2rem;
}
.font-weight-bold {
  font-weight: bold;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.mt-1 {
  margin-top: 0.25rem;
}
.responsive-container {
  display: flex;
  flex-wrap: wrap;
}
.responsive-item {
  width: 100%;
  margin-bottom: 0.5rem;
}
.extra-small-btn {
  width: 30px !important;
  height: 30px !important;
  min-width: 30px !important;
  min-height: 30px !important;
}
.theme--light.v-text-field--solo>.v-input__control>.v-input__slot {
    border-radius: 2px;
    background: #f3f3f3;
}
@media (max-width: 600px) {
  .responsive-item {
    width: calc(50% - 1rem);
  }
  .inner-card {
    height: 3rem;
  }
}
</style>

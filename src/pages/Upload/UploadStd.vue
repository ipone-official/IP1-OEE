<template>
  <div style="margin: 1rem">
    <v-layout>
      <input
        type="file"
        ref="fileInput"
        id="fileInput"
        style="display: none"
        @change="handleFileUpload"
      />
      <v-tooltip top color="teal">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            small
            color="#007fc4"
            dark
            @click="openFileInput"
            class="ma-2 small-export-button"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon size="20">mdi-file-excel</v-icon>
          </v-btn>
        </template>
        <span>Choose File Excel</span>
      </v-tooltip>
      <span v-if="fileName" style="margin-top: 1rem">{{ fileName }}</span>
      <button v-if="fileName" style="color: red; margin-left: 1rem" @click="clearFile">
        &#10006;
      </button>
      <v-layout justify-end>
        <v-tooltip top color="teal">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              small
              color="#007fc4"
              dark
              class="ma-2 small-export-button"
              v-bind="attrs"
              v-on="on"
              @click="exportToExcel"
            >
              <v-icon size="20">mdi-microsoft-excel</v-icon>
            </v-btn>
          </template>
          <span>Template Excel</span>
        </v-tooltip>
      </v-layout>
    </v-layout>
    <v-layout justify-end v-if="headers.length > 0">
      <v-tooltip top color="teal">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            small
            color="green"
            dark
            @click="SubmitSpeed"
            class="ma-2 small-export-button"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon size="20">mdi-content-save-outline</v-icon>
          </v-btn>
        </template>
        <span>Save</span>
      </v-tooltip>
    </v-layout>
    <div v-if="activeItem == 0" style="margin-top: 0.5rem">
      <div v-if="headers.length > 0">
        <v-data-table
          :headers="headers"
          :items="DataImport"
          :search="search"
          :pagination.sync="pagination"
          :rows-per-page-items="rowsPerPageItem"
        >
          <template v-slot:items="props">
            <tr
              :style="`
    background: ${getColor(props.item)};`"
            >
              <td>{{ props.item.lineProcessID }}</td>
              <td>{{ props.item.lineProcessName }}</td>

              <td class="text-xs-left">{{ props.item.materialCode }}</td>
              <td class="text-xs-left">{{ props.item.materialDescriptionTH }}</td>
              <td class="text-xs-left">{{ props.item.speedSTD }}</td>
            </tr>
          </template>
        </v-data-table>
      </div>
    </div>

    <div v-if="loadingDialog">
      <Loading :value="loadingDialog" />
    </div>
  </div>
</template>

<script>
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import axios from "axios";
import { sync } from "vuex-pathify";
import Loading from "@/components/core/Loading";

export default {
  components: {
    Loading,
  },
  data() {
    return {
      search: "",
      fileName: "",
      loadingDialog: false,
      activeItem: 1,
      items: [],
      headers: [],
      pagination: {
        rowsPerPage: 10,
      },
      rowsPerPageItem: [
        { text: "10", value: 10 },
        { text: "20", value: 20 },
        { text: "50", value: 50 },
        { text: "100", value: 100 },
      ],
      DataImport: [],
      DataExport: [],
    };
  },
  async created() {
    this.$store.commit("resetState");
    await this.getOeeSpeedStd();
  },
  computed: {
    ...sync("*"),
  },
  methods: {
    getColor(val) {
      return val.RequiredLineProcessID || val.RequiredMaterialCode || val.RequiredSpeedSTD
        ? "#f1948a"
        : "#82e0aa";
    },
    openFileInput() {
      this.$refs.fileInput.click(); // Trigger click on file input
    },
    handleFileUpload(event) {
      this.loadingDialog = true;
      this.activeItem = 1;
      const file = event.target.files[0];
      if (file) {
        this.fileName = file.name;
        const reader = new FileReader();
        reader.onload = async (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" }); // defval: "" to include empty cells
          this.items = [sheetName];

          if (jsonData.length > 0) {
            const headerRows = jsonData.slice(0, 1); // Extract header rows
            const combinedHeaders = this.combineHeaders(headerRows);
            this.headers = combinedHeaders.map((header) => ({
              text: header,
              value: header,
              sortable: false,
            }));

            this.DataImport = this.arrayToObjects(jsonData);
            console.log(this.DataImport, 'DataImport')
            this.DataImport.forEach((item, index) => {
              if (item.lineProcessID === "") {
                this.DataImport[index].RequiredLineProcessID = true;
              } else {
                this.DataImport[index].RequiredLineProcessID = false;
              }
              if (item.materialCode === "") {
                this.DataImport[index].RequiredMaterialCode = true;
              } else {
                this.DataImport[index].RequiredMaterialCode = false;
              }
              if (item.speedSTD === "") {
                this.DataImport[index].RequiredSpeedSTD = true;
              } else {
                this.DataImport[index].RequiredSpeedSTD = false;
              }
              
            });
            console.log(this.DataImport, 'DataImport')
          }
        };
        reader.readAsArrayBuffer(file);
        this.activeItem = 0;
        this.loadingDialog = false;
      } else {
        this.fileName = "";
      }
    },
    combineHeaders(headerRows) {
      const combinedHeaders = [];
      for (let i = 0; i < headerRows[0].length; i++) {
        let combinedHeader = "";
        headerRows.forEach((row) => {
          combinedHeader += (row[i] || "") + " ";
        });
        combinedHeaders.push(combinedHeader.trim());
      }
      return combinedHeaders;
    },
    arrayToObjects(array) {
      const headers = array[0];
      const data = array.slice(1);
      return data.map((row) => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] === undefined ? "" : row[index]; // Ensure undefined values are treated as empty strings
        });
        return obj;
      });
    },

    clearFile() {
      this.$refs.fileInput.value = null;
      this.headers = [];
      this.DataImport = [];
      this.fileName = "";
      this.search = "";
      this.items = [];
      this.activeItem = null;
    },
    SubmitSpeed() {
      Swal.fire({
        text: `Do you want to import data into the system?`,
        icon: "warning",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: "#0c80c4",
        cancelButtonColor: "#C0C0C0",
        confirmButtonText: "Ok",
      }).then(async (result) => {
        if (result.isConfirmed) {
          for (let y = 0; y < this.DataImport.length; y++) {
            if (this.isDataInvalid(this.DataImport[y])) {
              this.showErrorMessage(this.items[0], y + 2);
              return; // หยุดการทำงานของฟังก์ชันทันทีเมื่อพบข้อผิดพลาด
            }
          }
          this.loadingDialog = true;
          let JsonDataImport = [];
          for (let i = 0; i < this.DataImport.length; i++) {
            const elementJson = {
              lineProcessID: this.DataImport[i].lineProcessID.toString(),
              materialCode: this.DataImport[i].materialCode.toString(),
              speedSTD: Number(this.DataImport[i].speedSTD),
            };
            JsonDataImport.push(elementJson);
          }
          const response = await axios.post(
            ` ${this.EndpointPortal}/ApiOEE/OEE/v1/InsertSpeedStd`,
            JsonDataImport
          );
          if (response.data.status == 200) {
            this.loadingDialog = false;
            Swal.fire({
              text: `Successfully`,
              icon: "success",
              showCancelButton: false,
              allowOutsideClick: false,
              confirmButtonColor: "#0c80c4",
              cancelButtonColor: "#C0C0C0",
              confirmButtonText: "Ok",
            }).then(async (result) => {
              if (result.isConfirmed) {
                this.clearFile();
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
    },
    isDataInvalid(data) {
      return data.RequiredLineProcessID || data.RequiredMaterialCode || data.RequiredSpeedSTD;
    },
    showErrorMessage(lineNumber) {
      // แสดงข้อความเตือนเมื่อพบข้อมูลที่ไม่ถูกต้อง
      return Swal.fire({
        text: `There is an error in the data, please check excel file.`,
        icon: "error",
        showCancelButton: false,
        confirmButtonColor: "#0c80c4",
        cancelButtonColor: "#C0C0C0",
        confirmButtonText: "Ok",
      });
    },
    async getOeeSpeedStd() {
      this.loadingDialog = true;
      try {
        const response = await axios.get(
          `${this.EndpointPortal}/ApiOEE/OEE/v1/GetSpeedStd`
        );
        if (response.data.status == 200) {
          this.DataExport = [];
          response.data.results.forEach((element, index) =>
            this.DataExport.push({
              lineProcessID: element.lineProcessID,
              lineProcessName: element.lineProcessName.trim(),
              materialCode: element.materialCode,
              materialDescriptionTH: element.materialDescriptionTH.trim(),
              speedSTD: element.speedSTD,
            })
          );
          this.loadingDialog = false;
        }
      } catch (error) {
        this.loadingDialog = false;
        Swal.fire({
          text: `ไม่สามารถทำการเชื่อมต่อระบบฐานข้อมูลได้ กรุณาลองใหม่อีกครั้ง`,
          icon: "warning",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonColor: "#0c80c4",
          cancelButtonColor: "#C0C0C0",
          confirmButtonText: "Ok",
        });
      }
    },
    async exportToExcel() {
      // Convert dataObjects to worksheet
      const ws = XLSX.utils.json_to_sheet(this.DataExport);
      // Create a new workbook and append the worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "OeeSpeedStd");

      // Apply minimal styling (if needed)
      ws["!cols"] = this.DataExport[0]
        ? Object.keys(this.DataExport[0]).map(() => ({ wpx: 100 }))
        : [];

      XLSX.writeFile(wb, "TemplateOeeSpeedStd.xlsx", { compression: true });
    },
  },
};
</script>

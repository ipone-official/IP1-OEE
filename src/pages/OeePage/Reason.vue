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
      <v-flex xs12 sm5 md3>
        <v-autocomplete
          placeholder="  Please select"
          v-model="mReason"
          prepend-icon=" "
          prefix="*"
          :items="itemReason"
          item-value="reasonID"
          item-text="reasonHeader"
          dense
          label="Reason"
          return-object
          hide-details
          class="custom-autocomplete"
        ></v-autocomplete>
      </v-flex>
      <v-flex xs12 sm5 md3>
        <v-autocomplete
          placeholder="  Please select"
          v-model="mReasonDetail"
          prepend-icon=" "
          prefix="*"
          :items="itemReasonDetail"
          item-value="reasonDescID"
          item-text="reasonDesc"
          dense
          label="Description"
          return-object
          hide-details
          class="custom-autocomplete"
        ></v-autocomplete>
      </v-flex>
      <v-flex xs12 sm5 md2>
        <v-text-field
          v-model="formattedQtyEA"
          prepend-icon=" "
          prefix="*"
          style="color: red"
          label="Qty. (EA)"
          @keydown.native="keyFilter($event, 'number')"
        ></v-text-field>
      </v-flex>
      <v-spacer></v-spacer>
      <v-tooltip top color="teal">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            small
            color="#007fc4"
            dark
            @click="addTransactionDamage(editMode)"
            class="ma-2 small-export-button"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon size="20"> {{ editMode ? "mdi-pencil-outline" : "mdi-plus" }}</v-icon>
          </v-btn>
        </template>
        <span>{{ editMode ? "Edit item damage" : "Add item damage" }}</span>
      </v-tooltip>
    </v-layout>
    <v-data-table
      :headers="headers"
      :items="machineDetail.itemDamageTable"
      item-key="processID"
      :pagination.sync="pagination"
      :rows-per-page-items="rowsPerPageItem"
    >
      <template v-slot:items="props">
        <tr>
          <td class="text-xs-left">
            {{ props.item.itemNo }}
          </td>
          <td class="text-xs-left">{{ props.item.reasonHeader }}</td>
          <td class="text-xs-left">{{ props.item.reasonDesc }}</td>
          <td class="text-xs-left">
            {{ functions.numberWithCommas(props.item.QtyEA) }}
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
              @click="editItemDamage(props.item)"
            >
              <v-icon style="margin-top: 0.1rem; color: white">mdi-pencil-outline</v-icon>
            </v-btn>
            <v-btn
              v-if="!editMode"
              color="red"
              fab
              small
              class="extra-small-btn"
              @click="deleteItemDamage(props.item)"
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
import { isEmpty } from "lodash";
import keyFilter from "@/plugins/keyFilter";
import detail from "@/pages/OeePage/Detail.vue";

export default {
  components: {
    loading,
    detail,
  },
  data() {
    return {
      loadingDialog: false,
      keyFilter,
      msgResult: "",
      showResult: false,
      QtyEA: 0,
      functions,
      mReason: "",
      itemReason: [],
      mReasonDetail: "",
      itemReasonDetail: [],
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
          text: "Reason",
          align: "left",
          sortable: false,
          value: "reasonHeader",
        },
        {
          text: "Description",
          align: "left",
          sortable: false,
          value: "reasonDesc",
        },
        { text: "Qty. (EA)", align: "left", sortable: false, value: "QtyEA" },
        { text: "Action", align: "left", sortable: false, value: "Action" },
      ],
      editMode: false,
      editId: 0,
      editItem: {},
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
    formattedQtyEA: {
      get() {
        if (!this.QtyEA) return 0;
        return this.QtyEA.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      set(value) {
        this.QtyEA = Number(value.replace(/,/g, "")) || 0;
      },
    },
  },
  watch: {
    mReason(val) {
      this.itemReasonDetail = [];
      this.itemReasonDetail = this.itemReason.filter(
        (result) => result.reasonID === val.reasonID
      );
    },
  },
  created() {
    this.GetReason();
  },
  methods: {
    ChangeQtyEA(value) {
      this.QtyEA = Number(value.replace(/,/g, "")); // ลบเครื่องหมายจุลภาคทั้งหมดก่อนบันทึกลง mTransferAmount
    },
    async GetReason() {
      this.loadingDialog = true;
      this.itemReason = [];
      try {
        const response = await axios.get(
          `${this.EndpointPortal}/ApiOEE/OEE/v1/GetReasonDamage`
        );
        if (response.data.status == 200) {
          this.loadingDialog = false;
          this.itemReason = response.data.results;

          const reasonIDs = new Set();
          this.itemReason.forEach((result) => {
            reasonIDs.add(result.reasonID);
          });
          if (Array.from(reasonIDs).length == 1) {
            this.mReason = this.itemReason[0];
          }
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
      } catch (error) {
        this.loadingDialog = false;
      }
    },
    addTransactionDamage(mode) {
      if (isEmpty(this.mReason)) {
        this.showResult = true;
        return (this.msgResult = "The reason cannot be left blank.");
      }
      if (isEmpty(this.mReasonDetail)) {
        this.showResult = true;
        return (this.msgResult = "The description cannot be left blank.");
      }
      if (this.QtyEA == 0) {
        this.showResult = true;
        return (this.msgResult = "Quantity (EA) cannot be blank or set to 0.");
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
            const index = this.machineDetail.itemDamageTable.indexOf(this.editItem);
            this.machineDetail.itemDamageTable.splice(index, 1);
            this.machineDetail.itemDamageTable.push({
              reasonID: this.mReason.reasonID,
              reasonHeader: this.mReason.reasonHeader,
              reasonDescID: this.mReasonDetail.reasonDescID,
              reasonDesc: this.mReasonDetail.reasonDesc,
              QtyEA: this.QtyEA,
              itemNo: this.editId,
            });
            this.machineDetail.itemDamageTable.sort((a, b) => a.itemNo - b.itemNo);

            this.editMode = false;
            this.editId = 0;
            this.editItem = {};
            this.QtyEA = 0;
            this.mReason = "";
            this.mReasonDetail = "";
            const reasonIDs = new Set();
            this.itemReason.forEach((result) => {
              reasonIDs.add(result.reasonID);
            });
            if (Array.from(reasonIDs).length == 1) {
              this.mReason = this.itemReason[0];
            }
          } else {
            this.editMode = false;
            this.editId = 0;
            this.editItem = {};
            this.QtyEA = 0;
            this.mReason = "";
            this.mReasonDetail = "";
            const reasonIDs = new Set();
            this.itemReason.forEach((result) => {
              reasonIDs.add(result.reasonID);
            });
            if (Array.from(reasonIDs).length == 1) {
              this.mReason = this.itemReason[0];
            }
          }
        });
        return;
      } else {
        this.machineDetail.itemDamageTable.push({
          reasonID: this.mReason.reasonID,
          reasonHeader: this.mReason.reasonHeader,
          reasonDescID: this.mReasonDetail.reasonDescID,
          reasonDesc: this.mReasonDetail.reasonDesc,
          QtyEA: this.QtyEA,
        });

        this.machineDetail.itemDamageTable.forEach(
          (element, index) =>
            (this.machineDetail.itemDamageTable[index].itemNo = index + 1)
        );
        this.machineDetail.itemDamageTable.sort((a, b) => a.itemNo - b.itemNo);

        const combined = {};

        // ลูปผ่านรายการทั้งหมดใน results
        this.machineDetail.itemDamageTable.forEach((result) => {
          const key = `${result.reasonID}-${result.reasonDescID}`; // สร้าง key จาก reasonID และ reasonDescID

          // ถ้า key นี้ยังไม่ถูกสร้าง ให้สร้าง key ใหม่และเพิ่มค่า QtyEA
          if (!combined[key]) {
            combined[key] = { ...result, QtyEA: parseInt(result.QtyEA) }; // สร้าง key และแปลง QtyEA เป็น integer
          } else {
            // ถ้า key มีอยู่แล้ว ให้บวกค่า QtyEA เข้าไป
            combined[key].QtyEA += parseInt(result.QtyEA);
          }
        });
        this.machineDetail.itemDamageTable = Object.values(combined);
        this.QtyEA = 0;
        this.mReason = "";
        this.mReasonDetail = "";
        const reasonIDs = new Set();
        this.itemReason.forEach((result) => {
          reasonIDs.add(result.reasonID);
        });
        if (Array.from(reasonIDs).length == 1) {
          this.mReason = this.itemReason[0];
        }
      }
    },
    deleteItemDamage(item) {
      const index = this.machineDetail.itemDamageTable.indexOf(item);
      Swal.fire({
        html: `Would you like to delete the item no. "<strong>${item.itemNo} : ${item.reasonDesc}</strong>" ?`,
        icon: "warning",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: "#0c80c4",
        cancelButtonColor: "#C0C0C0",
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.machineDetail.itemDamageTable.splice(index, 1);
          this.machineDetail.itemDamageTable.forEach(
            (element, index) =>
              (this.machineDetail.itemDamageTable[index].itemNo = index + 1)
          );
          this.QtyEA = 0;
          this.mReason = "";
          this.mReasonDetail = "";
          const reasonIDs = new Set();
          this.itemReason.forEach((result) => {
            reasonIDs.add(result.reasonID);
          });
          if (Array.from(reasonIDs).length == 1) {
            this.mReason = this.itemReason[0];
          }
        }
      });
    },
    editItemDamage(val) {
      this.editMode = true;
      this.editId = val.itemNo;
      this.editItem = val;
      this.mReason = {
        reasonID: val.reasonID,
        reasonHeader: val.reasonHeader,
      };
      this.mReasonDetail = {
        reasonID: val.reasonID,
        reasonHeader: val.reasonHeader,
        reasonDescID: val.reasonDescID,
        reasonDesc: val.reasonDesc,
      };
      this.QtyEA = val.QtyEA;
    },
  },
};
</script>

<style scoped>
.custom-autocomplete .v-input__prefix {
  color: red;
}
.custom-autocomplete .v-input__slot {
  color: red;
}
</style>

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
      :items="itemReason"
      item-key="reasonDescID"
      :pagination.sync="pagination"
      :search="mSearch"
    >
      <template v-slot:items="props">
        <tr>
          <td class="text-xs-left">
            {{ props.item.reasonDescID }}
          </td>
          <td class="text-xs-left">{{ props.item.reasonDesc }}</td>
          <td class="text-xs-left">{{ props.item.damageStatus }}</td>
          <td class="text-xs-left">
            {{ props.item.status }}
          </td>
          <v-layout>
            <v-btn
              color="#f8c849"
              fab
              small
              class="extra-small-btn"
              @click="editItemReason(props.item)"
            >
              <v-icon style="margin-top: 0.1rem; color: white">mdi-pencil-outline</v-icon>
            </v-btn>
            <v-btn
              v-if="props.item.isDeletable == 'Y'"
              color="red"
              fab
              small
              class="extra-small-btn"
              @click="deleteItemReason(props.item)"
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
        <!-- <v-btn icon @click="resetForm" class="close-btn">
          <v-icon>mdi-close</v-icon>
        </v-btn> -->
        <v-card-text>
          <v-form ref="form" lazy-validation>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="mReasonDesc"
                prefix="*"
                style="color: red"
                label="Reason Description"
              ></v-text-field>
            </v-flex>
            <v-layout>
              <v-flex xs12 sm5 md5>
                <v-autocomplete
                  v-model="mDamageStatus"
                  :items="itemDamageStatus"
                  item-value="key"
                  item-text="text"
                  dense
                  label="Damage Status"
                  return-object
                  hide-details
                ></v-autocomplete>
              </v-flex>
              <v-spacer></v-spacer>
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
          <v-btn color="success" :disabled="mReasonDesc.length == 0" @click="submitForm"
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
import { gReasonMaster, iReasonMaster, dReasonMaster } from "@/services/apiOee.js";
import Swal from "sweetalert2";

export default {
  components: {
    Loading,
  },
  data() {
    return {
      mSearch: "",
      dialog: false,
      isLoading: true,
      pagination: {
        sortBy: "",
        descending: false,
        page: 1,
        rowsPerPage: 10,
      },
      headers: [
        {
          text: "Reason ID",
          align: "left",
          sortable: true,
          value: "reasonDescID",
        },
        {
          text: "Reason Desc",
          align: "left",
          sortable: false,
          value: "reasonDesc",
        },
        {
          text: "Damage Status",
          align: "left",
          sortable: false,
          value: "damageStatus",
        },
        { text: "Status", align: "left", sortable: false, value: "status" },
        { text: "Action", align: "left", sortable: false, value: "Action" },
      ],
      itemDamageStatus: [
        {
          key: "Y",
          text: "Active",
        },
        {
          key: "N",
          text: "InActive",
        },
      ],
      itemReason: [],
      mReasonDesc: "",
      mDamageStatus: {
        key: "N",
        text: "InActive",
      },
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
      editId: 0,
    };
  },
  computed: {
    ...sync("*"),
  },
  async created() {
    this.getReasonMaster();
  },
  methods: {
    async getReasonMaster() {
      this.itemReason = [];
      this.isLoading = true;
      try {
        const response = await gReasonMaster();
        this.itemReason = response.results;
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
    editItemReason(val) {
      this.dialog = true;
      this.editId = val.reasonDescID;
      this.mReasonDesc = val.reasonDesc;
      this.mDamageStatus = {
        key: val.damageStatus,
        text: val.damageStatus == "N" ? "InActive" : "Active",
      };
      this.mStatus = {
        key: val.status,
        text: val.status == "N" ? "InActive" : "Active",
      };
    },
    deleteItemReason(val) {
      Swal.fire({
        html: `Would you like to delete the reason no. "<strong> ${val.reasonDescID}</strong>" ?`,
        icon: "warning",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: "#0c80c4",
        cancelButtonColor: "#C0C0C0",
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.isLoading = true;
          try {
            await dReasonMaster(val.reasonDescID.toString());
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
                this.getReasonMaster();
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
    async submitForm() {
      let { empId } = this.infoLogin;
      const data = {
        reasonDescID: this.editId.toString(),
        reasonDesc: this.mReasonDesc,
        damageStatus: this.mDamageStatus.key,
        status: this.mStatus.key,
        empBy: empId,
      };
      this.isLoading = true;
      try {
        await iReasonMaster(data);
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
            this.getReasonMaster();
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
    resetForm() {
      this.dialog = false;
      this.mReasonDesc = "";
      this.editId = 0;
      this.mDamageStatus = {
        key: "N",
        text: "InActive",
      };
      this.mStatus = {
        key: "Y",
        text: "Active",
      };
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
/* Actions */
.dialog-actions {
  justify-content: end;
  padding: 16px;
}
</style>

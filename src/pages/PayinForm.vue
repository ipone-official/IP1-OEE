<template>
  <v-container fluid grid-list-xs>
    <v-layout>
      <v-chip color="primary" text-color="white" class="mb-3"> Transaction </v-chip>
      <v-spacer></v-spacer>
      <v-tooltip top color="teal">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-if="!ownerView"
            fab
            small
            color="#007fc4"
            dark
            @click="clearFormPayin, (dialogTransferPayin = true)"
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
      <v-flex xs12 sm3 md3>
        <v-autocomplete
          placeholder="  Please select"
          v-model="mDepotSearch"
          prepend-icon="mdi-home-silo-outline"
          prefix="*"
          :items="depotItem"
          item-value="depotCode"
          item-text="depotName"
          :disabled="DateDisibled"
          dense
          label="Depot"
          return-object
          hide-details
          class="custom-autocomplete"
        ></v-autocomplete>
      </v-flex>
      <v-flex md2>
        <calendar
          :value.sync="formDate"
          label="Start Date"
          :readonly="true"
          :disabled="DateDisibled"
        />
      </v-flex>
      <div style="margin-left: 3rem; margin-top: 1rem; font-weight: bold">TO</div>
      <v-flex md2>
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
              @click="getTransferPayin(formDate, toDate, mDepotSearch)"
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
    <v-layout>
      <v-flex xs12 sm4 md4 v-if="DateDisibled">
        <v-text-field
          v-model="search"
          flat
          label="Search"
          prepend-inner-icon="search"
          solo
          box
          clearable
        ></v-text-field>
      </v-flex>
      <v-spacer></v-spacer>
      <v-tooltip top color="teal">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-if="selected.length > 0 && !ownerView"
            fab
            small
            color="green"
            dark
            v-bind="attrs"
            v-on="on"
            @click="ConfirmPayin"
          >
            <v-icon size="20">mdi-check-circle-outline</v-icon>
          </v-btn>
        </template>
        <span>Confirm</span>
      </v-tooltip>
      <v-tooltip top color="teal">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-if="selected.length > 0 && !ownerView"
            fab
            small
            color="orange"
            dark
            v-bind="attrs"
            v-on="on"
            @click="ClearingPayin"
          >
            <v-icon size="20">mdi-checkbox-marked-circle-outline</v-icon>
          </v-btn>
        </template>
        <span>Clearing</span>
      </v-tooltip>
      <v-tooltip top color="teal" v-if="itemPayin.length > 0">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            small
            color="#007fc4"
            dark
            v-bind="attrs"
            v-on="on"
            @click="exportToExcel"
          >
            <v-icon size="20">mdi-microsoft-excel</v-icon>
          </v-btn>
        </template>
        <span>Export Excel</span>
      </v-tooltip>
    </v-layout>
    <v-toolbar xs12 sm8 color="#f8c849" dark tabs v-if="itemPayin.length == 0">
      <v-layout justify-center style="font-size: larger"> no data available </v-layout>
    </v-toolbar>
    <v-data-table
      v-if="itemPayin.length > 0"
      v-model="selected"
      :headers="headersPayin"
      :items="itemPayin"
      item-key="formID"
      select-all
      :search="search"
      :pagination.sync="pagination"
      :rows-per-page-items="rowsPerPageItem"
    >
      <template v-slot:headers="props">
        <tr>
          <th style="background: #dbdbdb !important">
            <v-checkbox
              v-if="!ownerView"
              :input-value="props.all"
              :indeterminate="props.indeterminate"
              primary
              hide-details
              @click.stop="toggleAll"
            ></v-checkbox>
          </th>
          <th
            v-for="header in props.headers"
            :key="header.text"
            @click="header.sortable && sort(header.value)"
          >
            {{ header.text }}
            <v-icon
              style="color: white; font-size: 12px"
              v-if="pagination.sortBy === header.value && header.sortable"
            >
              {{ pagination.descending ? "arrow_downward" : "arrow_upward" }}
            </v-icon>
          </th>
        </tr>
      </template>
      <template v-slot:items="props">
        <tr>
          <td
            style="background: #dbdbdb !important"
            v-if="!getDisabled(props.item.flagStatus, props.item.totalDiff)"
          >
            <v-checkbox
              v-if="!ownerView"
              v-model="props.selected"
              primary
              hide-details
            ></v-checkbox>
          </td>
          <td
            style="background: #dbdbdb !important"
            v-else-if="getDisabled(props.item.flagStatus, props.item.totalDiff)"
          ></td>

          <td class="text-xs-left">{{ props.item.formID }}</td>
          <td class="text-xs-left">
            {{ functions.yyyymmddConvertDDMMYYYY(props.item.sellDate) }}
          </td>
          <td class="text-xs-left">{{ props.item.displaySaleCode }}</td>
          <td class="text-xs-left">{{ props.item.saleType }}</td>
          <td class="text-xs-left">
            {{ functions.numberWithCommas(props.item.totalPayin.toFixed(2)) }}
          </td>
          <td class="text-xs-left">
            {{ functions.numberWithCommas(props.item.totalSell.toFixed(2)) }}
          </td>
          <td class="text-xs-left">
            {{ functions.numberWithCommas(props.item.totalFee.toFixed(2)) }}
          </td>
          <td
            :style="`background: ${getColor(props.item.totalDiff.toFixed(2))};`"
            class="text-xs-left"
          >
            {{ functions.numberWithCommas(props.item.totalDiff.toFixed(2)) }}
          </td>
          <v-btn
            v-if="props.item.flagStatus == 'N' && !ownerView"
            :color="$root.themeColorFooter"
            fab
            dark
            small
            class="extra-small-btn"
            @click="editTrasferPayin(props.item)"
          >
            <v-icon style="margin-top: 0.1rem; color: white">mdi-pencil-outline</v-icon>
          </v-btn>
          <v-btn
            v-if="props.item.flagStatus == 'N' && !ownerView"
            color="#FF6969"
            fab
            small
            class="extra-small-btn"
            @click="deleteTransferPayin(props.item)"
          >
            <v-icon style="margin-top: 0.1rem; color: white">mdi-delete-outline</v-icon>
          </v-btn>
          <v-btn
            v-if="props.item.flagStatus == 'Y' && !ownerView"
            color="#00A36C"
            fab
            small
            class="extra-small-btn"
            @click="editTrasferPayin(props.item)"
          >
            <v-icon style="margin-top: 0.1rem; color: white">mdi-check</v-icon>
          </v-btn>
          <v-btn
            v-if="
              props.item.flagStatus == 'Y' &&
              filteredRoles.some((role) => ['Admin'].includes(role.userRoleID)) &&
              !ownerView
            "
            color="#FF6969"
            fab
            small
            class="extra-small-btn"
            @click="deleteTransferPayin(props.item)"
          >
            <v-icon style="margin-top: 0.1rem; color: white">mdi-delete-outline</v-icon>
          </v-btn>
          <v-btn
            v-if="ownerView"
            color="#007fc4"
            fab
            small
            class="extra-small-btn"
            @click="editTrasferPayin(props.item)"
          >
            <v-icon style="margin-top: 0.1rem; color: white">mdi-text-box-search</v-icon>
          </v-btn>
        </tr>
      </template>
      <template v-slot:footer>
        <tr style="background: #f8c849">
          <td colspan="5" class="text-xs-left"><strong>Total</strong></td>
          <td class="text-xs-left">
            <strong>{{ sumTotalTransferAmount }}</strong>
          </td>
          <td class="text-xs-left">
            <strong>{{ sumTotalSell }}</strong>
          </td>
          <td class="text-xs-left">
            <strong>{{ sumTotalFee }}</strong>
          </td>
          <td class="text-xs-left">
            <strong>{{ sumTotalDiff }}</strong>
          </td>
          <td colspan="1"></td>
        </tr>
      </template>
    </v-data-table>
    <v-dialog v-model="dialogTransferPayin" persistent max-width="1180px">
      <v-card>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-tooltip top color="teal">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                @click="clearFormPayin"
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
        <v-container style="margin-top: -1rem">
          <v-layout>
            <v-chip color="primary" text-color="white" class="mb-3">
              {{ FormID == "" ? "Payin Form" : "Payin ID" }} {{ FormID }}
            </v-chip>
            <v-spacer></v-spacer>
            <v-chip v-if="DisplayFormID" color="primary" text-color="white" class="mb-3">
              {{ DisplayFormID }}
            </v-chip>
            <v-tooltip top color="teal">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-if="!viewTransferPayin && !ownerView"
                  fab
                  small
                  color="green"
                  dark
                  @click="submitTransfer"
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
            <v-flex xs12 sm3 md3>
              <v-autocomplete
                placeholder="  Please select"
                v-model="mDepot"
                prepend-icon="mdi-home-silo-outline"
                prefix="*"
                :items="depotItem"
                item-value="depotCode"
                item-text="depotName"
                :disabled="viewTransferPayin || ownerView || FormID != ''"
                dense
                label="Depot"
                return-object
                hide-details
                class="custom-autocomplete"
              ></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm2 md2>
              <v-autocomplete
                placeholder="  Please select"
                v-model="mSaleType"
                prepend-icon=" "
                prefix="*"
                :items="saleTypeItem"
                item-value="index"
                item-text="saletype"
                :disabled="viewTransferPayin || FormID != '' || ownerView"
                dense
                label="Sale Type"
                return-object
                hide-details
                class="custom-autocomplete"
              ></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm3 md3>
              <v-autocomplete
                placeholder="  Please select"
                v-model="mSaleArea"
                prepend-icon=" "
                prefix="*"
                :items="saleAreaItem"
                item-value="salecode"
                item-text="displaySaleName"
                :disabled="viewTransferPayin || FormID != '' || ownerView"
                dense
                label="Sale Code"
                return-object
                hide-details
                class="custom-autocomplete"
              ></v-autocomplete>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs12 sm3 md3>
              <div class="pa-3 inner-card mt-1">
                <v-layout>
                  <div class="font-weight-bold mb-2">GL Customer :</div>
                  <div style="margin-left: 0.7rem">{{ mSaleArea.customerCode }}</div>
                </v-layout>
              </div>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs12 sm3 md3>
              <calendar
                :value.sync="salesDate"
                label="Sales Date"
                :disabled="viewTransferPayin || FormID != '' || ownerView"
                :readonly="true"
              />
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs12 sm9 md9>
              <div
                class="pa-3 inner-card mt-1 small-box"
                :style="`background-color:${$root.themeColorFooter}`"
              >
                <v-layout row wrap>
                  <div class="font-weight-bold mb-2">Sales Revenue :</div>
                  <div style="margin-top: -1.1rem; margin-right: 0.2rem">
                    <!-- :disabled="viewTransferPayin || ownerView" -->
                    <v-text-field
                      v-model="formattedSalesRevenue"
                      prepend-icon=" "
                      prefix="*"
                      style="color: red"
                      solo
                      label="Sales Revenue"
                      :disabled="true"
                      @input="ChangeSalesRevenue"
                      @keydown.native="keyFilter($event, 'value')"
                    ></v-text-field>
                  </div>
                  <v-spacer></v-spacer>
                  <div class="font-weight-bold mb-2">Transfer Amount :</div>
                  <div style="margin-left: 0.7rem">
                    {{ functions.numberWithCommas(sumTransferAmount.toFixed(2)) }}
                  </div>
                  <v-spacer></v-spacer>
                  <div class="font-weight-bold mb-2">Fee :</div>
                  <div style="margin-left: 0.7rem">{{ sumFee.toFixed(2) }}</div>
                  <v-spacer></v-spacer>
                  <div class="font-weight-bold mb-2">Diff :</div>
                  <div style="margin-left: 0.7rem">
                    {{
                      functions.numberWithCommas(
                        (salesRevenue - (sumTransferAmount + sumFee)).toFixed(2)
                      ) == "-0.00"
                        ? "0.00"
                        : functions.numberWithCommas(
                            (salesRevenue - (sumTransferAmount + sumFee)).toFixed(2)
                          )
                    }}
                  </div>
                </v-layout>
              </div>
            </v-flex>
          </v-layout>

          <v-layout v-show="!viewTransferPayin && !ownerView">
            <v-chip color="primary" text-color="white" class="mb-3"> Information </v-chip>
            <v-spacer></v-spacer>
            <v-tooltip top color="teal">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  fab
                  small
                  color="#007fc4"
                  dark
                  @click="addTransfer(editMode)"
                  class="ma-2 small-export-button"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon size="20">
                    {{ editMode ? "mdi-pencil-outline" : "mdi-plus" }}</v-icon
                  >
                </v-btn>
              </template>
              <span>{{ editMode ? "Edit Transaction" : "Add Transaction" }}</span>
            </v-tooltip>
          </v-layout>
          <v-layout row wrap v-show="!viewTransferPayin && !ownerView">
            <v-flex xs12 sm3 md3>
              <v-autocomplete
                placeholder="  Please select"
                v-model="mBank"
                prepend-icon="mdi-bank-transfer-out"
                prefix="*"
                :items="bankItem"
                item-value="bankAccount"
                item-text="displayText"
                dense
                label="Bank"
                return-object
                hide-details
                class="custom-autocomplete"
              ></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm2 md2>
              <calendar :value.sync="depositDate" label="Deposit date" :readonly="true" />
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs12 sm2 md2>
              <v-autocomplete
                placeholder="  Please select"
                v-model="mPayinType"
                prepend-icon="mdi-cash-sync"
                prefix="*"
                :items="payinTypeItem"
                item-value="payinType"
                item-text="payinTypeName"
                dense
                label="Payin Type"
                return-object
                hide-details
                class="custom-autocomplete"
              ></v-autocomplete>
            </v-flex>
            <v-spacer></v-spacer>

            <v-flex xs12 sm2 md2>
              <v-text-field
                v-model="formattedTransferAmount"
                prepend-icon="mdi-cash-multiple"
                prefix="*"
                style="color: red"
                label="Transfer amount"
                @input="ChangeTransferAmount"
                @keydown.native="keyFilter($event, 'value')"
              ></v-text-field>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs12 sm2 md2>
              <v-text-field
                v-model="mFee"
                prepend-icon="mdi-currency-usd"
                prefix="*"
                style="color: red"
                label="Fee"
                @keydown.native="keyFilter($event, 'value')"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row wrap v-show="!viewTransferPayin && !ownerView">
            <v-flex xs12 sm3 md3>
              <div class="pa-3 inner-card mt-1">
                <v-layout>
                  <div class="font-weight-bold mb-2">GL Bank :</div>
                  <div style="margin-left: 0.7rem">{{ mBank.bankGL }}</div>
                </v-layout>
              </div>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs12 sm9 md9>
              <v-textarea
                v-model="mRemark"
                prepend-icon="mdi-file-document-edit-outline"
                label="Remark"
                maxlength="150"
                rows="1"
              ></v-textarea>
            </v-flex>
          </v-layout>
          <v-data-table
            :headers="headers"
            :items="dataTransfer"
            :search="search"
            :pagination.sync="pagination"
            :rows-per-page-items="rowsPerPageItem"
          >
            <template v-slot:items="props">
              <td class="text-xs-left">{{ props.item.itemNo }}</td>
              <td class="text-xs-left">{{ props.item.bankName }}</td>
              <td>{{ functions.yyyymmddConvertDDMMYYYY(props.item.depositDate) }}</td>
              <td class="text-xs-left">{{ props.item.payinTypeName }}</td>
              <td class="text-xs-left">
                {{ functions.numberWithCommas(props.item.transferAmount) }}
              </td>
              <td class="text-xs-left">{{ props.item.fee }}</td>
              <td class="text-xs-left">{{ props.item.glBank }}</td>
              <td class="text-xs-left">{{ props.item.remark }}</td>

              <v-btn
                :color="$root.themeColorFooter"
                fab
                dark
                small
                class="extra-small-btn"
                v-if="!viewTransferPayin && !ownerView"
                @click="editTransfer(props.item)"
              >
                <v-icon style="margin-top: 0.9rem; color: white">edit</v-icon>
              </v-btn>
              <v-btn
                color="#FF6969"
                v-if="!viewTransferPayin && !ownerView"
                fab
                small
                class="extra-small-btn"
                @click="deleteItemTransfer(props.item)"
              >
                <v-icon style="margin-top: 0.9rem; color: white">delete</v-icon>
              </v-btn>
              <v-btn
                v-if="viewTransferPayin"
                color="#00A36C"
                fab
                small
                class="extra-small-btn"
              >
                <v-icon style="margin-top: 0.9rem; color: white">check</v-icon>
              </v-btn>
            </template>
            <template v-slot:no-data> </template>
          </v-data-table>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="#007fc4" style="border-radius: 12px" @click="clearFormPayin"
            >close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar color="orange" v-model="showResult" :timeout="3500">
      {{ msgResult }}
    </v-snackbar>
    <div v-if="loadingDialog">
      <Loading :value="loadingDialog" />
    </div>
  </v-container>
</template>

<script>
import axios from "axios";
import { sync } from "vuex-pathify";
import Swal from "sweetalert2";
import Loading from "../components/core/Loading";
import calendar from "@/components/DatePiker.vue";
import functions from "@/plugins/functions";
import { isEmpty } from "lodash";
import keyFilter from "@/plugins/keyFilter";
import * as XLSX from "xlsx";

export default {
  components: {
    calendar,
    Loading,
  },

  data() {
    return {
      DateDisibled: false,
      dialogTransferPayin: false,
      functions,
      keyFilter,
      editMode: false,
      editId: 0,
      editItem: {},
      mEditTrasferPayin: {},
      msgResult: "",
      showResult: false,
      loadingDialog: false,
      depositDate: functions.getSysDate().format,
      salesDate: functions.getSysDate().format,
      mDepotSearch: "",
      search: "",
      mBank: "",
      bankItem: [],
      mDepot: "",
      depotItem: [],
      mPayinType: "",
      payinTypeItem: [],
      saleCustomerItem: [],
      saleTypeItem: [],
      mSaleType: "",
      saleAreaItem: [],
      mSaleArea: "",
      mTransferAmount: 0,
      mFee: "",
      mRemark: "",
      sumTransferAmount: 0,
      sumFee: 0,
      salesRevenue: "",
      pagination: {
        sortBy: "",
        descending: false,
        page: 1,
        rowsPerPage: 10,
      },
      itemPayin: [],
      headersPayin: [
        {
          text: "Payin ID",
          align: "left",
          sortable: true,
          value: "formID",
        },
        {
          text: "Sell Date",
          align: "left",
          sortable: true,
          value: "sellDate",
        },
        { text: "Sale Code", align: "left", sortable: true, value: "saleCode" },
        { text: "Sale Type", align: "left", sortable: true, value: "saleType" },
        { text: "Total Payin", align: "left", sortable: false, value: "totalPayin" },
        { text: "Total Sell", align: "left", sortable: false, value: "totalSell" },
        { text: "Total Fee", align: "left", sortable: false, value: "totalFee" },
        { text: "Total Diff", align: "left", sortable: false, value: "totalDiff" },
        {
          text: "Action",
          align: "left",
          sortable: false,
          value: "Action",
        },
      ],
      headers: [
        {
          text: "No",
          align: "left",
          sortable: false,
          value: "No",
        },
        {
          text: "Bank",
          align: "left",
          sortable: false,
          value: "bankName",
        },
        {
          text: "Deposit date",
          align: "left",
          sortable: false,
          value: "depositDate",
        },
        { text: "Payin Type", align: "left", sortable: false, value: "payinType" },
        {
          text: "Transfer amount",
          align: "left",
          sortable: false,
          value: "transferAmount",
        },
        { text: "Fee", align: "left", sortable: false, value: "fee" },
        { text: "GL Bank", align: "left", sortable: false, value: "glBank" },
        { text: "Remark", align: "left", sortable: false, value: "ReasonName" },
        { text: "Action", align: "left", sortable: false, value: "Action" },
      ],
      dataTransfer: [],
      selected: [],
      viewTransferPayin: false,
      userRoleItem: [],
      filteredRoles: [],
      ownerView: false,
      tolerance: 0,
      DisplayFormID: "",
      mClearing: false,
    };
  },
  watch: {
    mDepot(val) {
      if (val.length == 0) return;
      this.saleTypeItem = [];
      this.mSaleType = "";
      this.saleAreaItem = [];
      this.mSaleArea = "";
      this.salesRevenue = "";
      const distinctSaletypes = [
        ...new Set(
          this.saleCustomerItem
            .filter((item) => item.depotCode === val.depotCode)
            .map((item) => item.saletype)
        ),
      ];

      this.saleTypeItem = distinctSaletypes.map((saletype, index) => ({
        index: index + 1,
        saletype,
        depotCode: val.depotCode,
      }));
      if (Object.keys(this.mEditTrasferPayin).length > 0) {
        const filteredItems = this.saleTypeItem.filter(
          (item) => item.saletype === this.mEditTrasferPayin.saleType
        );
        this.mSaleType = {
          index: filteredItems[0].index,
          saletype: filteredItems[0].saletype,
          depotCode: filteredItems[0].depotCode,
        };
      }
    },
    mSaleType(val) {
      if (val.length == 0) return;
      this.saleAreaItem = [];
      this.mSaleArea = "";
      this.salesRevenue = "";
      for (let i = 0; i < this.saleCustomerItem.length; i++) {
        if (
          this.saleCustomerItem[i].depotCode == val.depotCode &&
          this.saleCustomerItem[i].saletype == val.saletype
        ) {
          this.saleAreaItem.push(this.saleCustomerItem[i]);
        }
      }
      if (Object.keys(this.mEditTrasferPayin).length > 0) {
        const filteredItems = this.saleAreaItem.filter(
          (item) => item.salecode === this.mEditTrasferPayin.saleCode
        );
        this.mSaleArea = {
          salecode: filteredItems[0].salecode,
          salename: filteredItems[0].salename,
          customerCode: filteredItems[0].customerCode,
          depotCode: filteredItems[0].depotCode,
          saletype: filteredItems[0].saletype,
          displaySaleName: filteredItems[0].displaySaleName,
        };
      }
    },
    async mSaleArea(val) {
      if (val.length == 0) return;
      let init = {
        saleCode: val.salecode,
        custCode: val.customerCode,
        salesDate: this.salesDate,
        depotCode: val.depotCode,
      };
      const response = await axios.post(
        `${this.EndpointPortal}/ApiPayin/Payin/v1/GetSalesRevenue`,
        init
      );
      if (response.data.statusCode.statusCode == 200) {
        if (response.data.results == null) {
          this.salesRevenue = "";
        } else {
          this.salesRevenue = response.data.results[0].salesRevenue;
        }
      }
    },
    async salesDate(val) {
      if (
        this.mDepot.length == 0 &&
        this.mSaleType.length == 0 &&
        this.mSaleArea.length == 0
      )
        return;
      let init = {
        saleCode: this.mSaleArea.salecode,
        custCode: this.mSaleArea.customerCode,
        salesDate: val,
        depotCode: this.mSaleArea.depotCode,
      };
      const response = await axios.post(
        `${this.EndpointPortal}/ApiPayin/Payin/v1/GetSalesRevenue`,
        init
      );
      if (response.data.statusCode.statusCode == 200) {
        if (response.data.results == null) {
          this.salesRevenue = "";
        } else {
          this.salesRevenue = response.data.results[0].salesRevenue;
        }
      }
    },
  },
  computed: {
    ...sync("*"),
    formattedTransferAmount() {
      if (!this.mTransferAmount) return "";
      return this.mTransferAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    formattedSalesRevenue() {
      if (!this.salesRevenue) return "";
      return this.salesRevenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    rowsPerPageItem() {
      return [
        // { text: "ALL", value: this.itemPayin ? this.itemPayin.length : 0 },
        { text: "10", value: 10 },
        { text: "20", value: 20 },
        { text: "50", value: 50 },
        { text: "100", value: 100 },
      ];
    },
    sumTotalTransferAmount() {
      return Number(
        this.itemPayin.reduce((sum, item) => sum + Number(item.totalPayin), 0).toFixed(2)
      ).toLocaleString("en-US", { minimumFractionDigits: 2 });
    },
    sumTotalSell() {
      return Number(
        this.itemPayin.reduce((sum, item) => sum + Number(item.totalSell), 0).toFixed(2)
      ).toLocaleString("en-US", { minimumFractionDigits: 2 });
    },
    sumTotalFee() {
      return Number(
        this.itemPayin.reduce((sum, item) => sum + Number(item.totalFee), 0).toFixed(2)
      ).toLocaleString("en-US", { minimumFractionDigits: 2 });
    },
    sumTotalDiff() {
      return Number(
        this.itemPayin.reduce((sum, item) => sum + Number(item.totalDiff), 0).toFixed(2)
      ).toLocaleString("en-US", { minimumFractionDigits: 2 });
    },
  },
  async created() {
    this.$store.commit("resetState");
    await this.getBank();
    await this.getPayinType();
    await this.getSaleCutomer();
    await this.GetTolerance();
    if (!localStorage.getItem("samAccountOEE")) return false;
    await this.getUser(localStorage.getItem("samAccountOEE"));
  },
  methods: {
    sort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },
    async GetTolerance() {
      const response = await axios.get(
        `${this.EndpointPortal}/ApiPayin/Payin/v1/GetTolerance`
      );
      if (response.data.statusCode.statusCode == 200) {
        this.tolerance = response.data.results.tolerance;
      }
    },
    async getUserRole() {
      const response = await axios.get(
        `${this.EndpointPortal}/ApiPayin/Payin/v1/GetUserRole`
      );
      if (response.data.statusCode.statusCode == 200) {
        this.userRoleItem = [];
        this.userRoleItem = response.data.results;
        this.filteredRoles = this.userRoleItem.filter((role) =>
          this.infoLogin.group.includes(role.groupAD)
        );
        const updatedRoles = this.filteredRoles.some(
          (role) => role.userRoleID === "Owner"
        );
        this.ownerView = updatedRoles;
      }
    },
    getColor(val) {
      if (val == 0) {
        return "#ABEBC6";
      }
      if (val < 0) {
        return "#FFA07A";
      }
      if (val > 0) {
        return "#FFFAC";
      }
      return "";
    },
    getDisabled(val, diff) {
      if (!["N"].includes(val)) {
        return true;
      }
      var role = this.filteredRoles.some((role) => ["Admin"].includes(role.userRoleID));
      // this.mClearing = Math.abs(diff) >= this.tolerance && role;
      if (Math.abs(diff) >= this.tolerance && !role) {
        return true;
      }
    },
    toggleAll() {
      if (this.selected.length) return (this.selected = []);
      else
        var role = this.filteredRoles.some((role) => ["Admin"].includes(role.userRoleID));
      if (role) {
        this.itemPayin.forEach((item) => {
          if (["N"].includes(item.flagStatus)) {
            this.selected.push(item);
          }
        });
      } else {
        this.itemPayin.forEach((item) => {
          if (
            ["N"].includes(item.flagStatus) &&
            Math.abs(item.totalDiff) <= this.tolerance
          ) {
            this.selected.push(item);
          }
        });
      }
    },
    ChangeTransferAmount(value) {
      this.mTransferAmount = value.replace(/,/g, ""); // ลบเครื่องหมายจุลภาคทั้งหมดก่อนบันทึกลง mTransferAmount
    },
    ChangeSalesRevenue(value) {
      this.salesRevenue = value.replace(/,/g, ""); // ลบเครื่องหมายจุลภาคทั้งหมดก่อนบันทึกลง mTransferAmount
    },
    async getUser(username) {
      try {
        const getUserAd = {
          username: username,
        };
        const response = await axios.post(
          ` ${this.EndpointPortal}/adsControl/Ads/v1/ADsGetUser`,
          getUserAd
        );
        if (!response.data.locked) {
          this.infoLogin.name = response.data.name;
          this.infoLogin.firstName = response.data.firstName;
          this.infoLogin.lastName = response.data.lastName;
          this.infoLogin.email = response.data.email;
          this.infoLogin.empId = response.data.empId;
          this.infoLogin.locked = response.data.locked;
          this.infoLogin.group = response.data.group;
          this.infoLogin.samAccount = response.data.samAccount;
          await this.getUserRole();
          await this.getDepot();
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getBank() {
      const response = await axios.get(
        `${this.EndpointPortal}/ApiPayin/Payin/v1/GetBank`
      );
      if (response.data.statusCode.statusCode == 200) {
        this.bankItem = [];
        response.data.results.forEach((element, index) =>
          this.bankItem.push({
            displayText: `${element.bankName} - ${element.bankAccount}`,
            bankAccount: element.bankAccount,
            bankName: element.bankName,
            bankGL: element.bankGL,
          })
        );
      }
    },
    async getDepot() {
      const response = await axios.get(
        `${this.EndpointPortal}/ApiPayin/Payin/v1/GetDepot`
      );
      if (response.data.statusCode.statusCode == 200) {
        this.depotItem = [];

        // ทำการเช็คสิทธิ์ เพื่อให้เห็นแค่ไหน
        const updatedRoles = this.filteredRoles.some(
          (role) => role.userRoleID === "Admin" || role.userRoleID === "Owner"
        );
        if (updatedRoles) {
          response.data.results.forEach((element, index) =>
            this.depotItem.push({
              depotCode: element.depotCode,
              depotName: element.depotName,
              businessplace: element.businessplace,
              costcenter: element.costcenter,
              companyCode: element.companyCode,
            })
          );
        } else {
          response.data.results.forEach((element, index) => {
            const matchingRole = this.filteredRoles.find(
              (role) => role.userRoleID == element.depotCode
            );
            if (matchingRole) {
              const ItemMatchingRole = {
                depotCode: element.depotCode,
                depotName: element.depotName,
                businessplace: element.businessplace,
                costcenter: element.costcenter,
                companyCode: element.companyCode,
              };
              this.depotItem.push(ItemMatchingRole);
            }
          });
          if (this.depotItem.length == 1) {
            this.mDepotSearch = this.depotItem[0];
            this.mDepot = this.depotItem[0];
          }
        }
      }
    },
    async getPayinType() {
      const response = await axios.get(
        `${this.EndpointPortal}/ApiPayin/Payin/v1/GetPayinType`
      );
      if (response.data.statusCode.statusCode == 200) {
        this.payinTypeItem = [];
        response.data.results.forEach((element, index) =>
          this.payinTypeItem.push({
            payinType: element.payinType,
            payinTypeName: element.payinTypeName,
          })
        );
      }
    },
    async getSaleCutomer() {
      const response = await axios.get(
        `${this.EndpointPortal}/ApiPayin/Payin/v1/GetSaleCustomer`
      );
      if (response.data.statusCode.statusCode == 200) {
        this.saleCustomerItem = [];
        response.data.results.forEach((element, index) =>
          this.saleCustomerItem.push({
            salecode: element.salecode,
            salename: element.salename,
            customerCode: element.customerCode,
            depotCode: element.depotCode,
            saletype: element.saletype,
            displaySaleName: `${element.salecode} - ${element.salename} `,
          })
        );
      }
    },
    editTransfer(val) {
      this.editMode = true;
      this.editId = val.itemNo;
      this.editItem = val;
      this.mBank = {
        bankAccount: val.bankAccount,
        bankGL: val.glBank,
        bankName: val.bankName,
      };
      this.mPayinType = {
        payinType: val.payinType,
        payinTypeName: val.payinTypeName,
      };
      this.depositDate = val.depositDate;
      this.mTransferAmount = val.transferAmount;
      this.mFee = val.fee;
      this.mRemark = val.remark;
    },
    addTransfer(mode) {
      if (isEmpty(this.mBank)) {
        this.showResult = true;
        return (this.msgResult = "Bank can't be null.");
      }
      if (isEmpty(this.mPayinType)) {
        this.showResult = true;
        return (this.msgResult = "Payin Type can't be null.");
      }
      if (this.mTransferAmount == "") {
        this.showResult = true;
        return (this.msgResult = "Transfer Amount can't be null.");
      }
      if (this.mFee == "") {
        this.showResult = true;
        return (this.msgResult = "Fee can't be null.");
      }
      if (mode) {
        Swal.fire({
          html: `Do you want edit item no ${this.editId} `,
          icon: "warning",
          showCancelButton: true,
          allowOutsideClick: false,
          confirmButtonColor: "#0c80c4",
          cancelButtonColor: "#C0C0C0",
          confirmButtonText: "OK",
        }).then(async (result) => {
          if (result.isConfirmed) {
            const index = this.dataTransfer.indexOf(this.editItem);
            this.dataTransfer.splice(index, 1);
            this.dataTransfer.push({
              bankName: this.mBank.bankName,
              bankAccount: this.mBank.bankAccount,
              depositDate: this.depositDate,
              payinType: this.mPayinType.payinType,
              payinTypeName: this.mPayinType.payinTypeName,
              transferAmount: Number(this.mTransferAmount).toFixed(2),
              fee: Number(this.mFee).toFixed(2),
              glBank: this.mBank.bankGL,
              remark: this.mRemark,
              itemNo: this.editId,
            });
            this.dataTransfer.sort((a, b) => a.itemNo - b.itemNo);
            this.sumTransferAmount = 0;
            this.sumFee = 0;
            this.dataTransfer.forEach(
              (element, index) => (
                (this.sumTransferAmount += parseFloat(element.transferAmount)),
                (this.sumFee += parseFloat(element.fee))
              )
            );
            this.editMode = false;
            this.editId = 0;
            this.editItem = {};
            this.mBank = "";
            this.mPayinType = "";
            this.mTransferAmount = "";
            this.mFee = "";
            this.mRemark = "";
          } else {
            this.editMode = false;
            this.editId = 0;
            this.editItem = {};
            this.mBank = "";
            this.mPayinType = "";
            this.mTransferAmount = "";
            this.mFee = "";
            this.mRemark = "";
          }
        });
        return;
      } else {
        this.dataTransfer.push({
          bankName: this.mBank.bankName,
          bankAccount: this.mBank.bankAccount,
          depositDate: this.depositDate,
          payinType: this.mPayinType.payinType,
          payinTypeName: this.mPayinType.payinTypeName,
          transferAmount: Number(this.mTransferAmount).toFixed(2),
          fee: Number(this.mFee).toFixed(2),
          glBank: this.mBank.bankGL,
          remark: this.mRemark,
        });
        this.dataTransfer.forEach(
          (element, index) => (this.dataTransfer[index].itemNo = index + 1)
        );
      }
      this.sumTransferAmount = 0;
      this.sumFee = 0;
      this.dataTransfer.forEach(
        (element, index) => (
          (this.sumTransferAmount += parseFloat(element.transferAmount)),
          (this.sumFee += parseFloat(element.fee))
        )
      );
      this.mBank = "";
      this.mPayinType = "";
      this.mTransferAmount = "";
      this.mFee = "";
      this.mRemark = "";
    },
    deleteItemTransfer(item) {
      const index = this.dataTransfer.indexOf(item);
      Swal.fire({
        html: `Do you want delete item no "<strong>${item.itemNo}</strong>" ?`,
        icon: "warning",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: "#0c80c4",
        cancelButtonColor: "#C0C0C0",
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.dataTransfer.splice(index, 1);
          this.sumTransferAmount = 0;
          this.sumFee = 0;
          this.dataTransfer.forEach(
            (element, index) => (
              (this.dataTransfer[index].itemNo = index + 1),
              (this.sumTransferAmount += parseFloat(element.transferAmount)),
              (this.sumFee += parseFloat(element.fee))
            )
          );
        }
      });
    },
    async submitTransfer() {
      if (isEmpty(this.mDepot)) {
        this.showResult = true;
        return (this.msgResult = "Depot can't be null.");
      }
      if (isEmpty(this.mSaleType)) {
        this.showResult = true;
        return (this.msgResult = "Sale Type can't be null.");
      }
      if (isEmpty(this.mSaleArea)) {
        this.showResult = true;
        return (this.msgResult = "Sale Code can't be null.");
      }
      if (this.salesRevenue == "" || this.salesRevenue == 0) {
        this.showResult = true;
        return (this.msgResult = "Sales Revenue can't be null.");
      }
      if (isEmpty(this.dataTransfer)) {
        this.showResult = true;
        return (this.msgResult = "Transaction information can't be null.");
      }

      let TransferData = {
        FormID: this.FormID,
        SellDate: this.salesDate,
        DepotCode: this.mDepot.depotCode,
        DepotName: this.mDepot.depotName,
        CostCenter: this.mDepot.costcenter,
        SaleCode: this.mSaleArea.salecode,
        SaleName: this.mSaleArea.salename,
        CustomerCode: this.mSaleArea.customerCode,
        TotalPayin: this.sumTransferAmount,
        TotalSell: this.salesRevenue,
        TotalFee: this.sumFee,
        TotalDiff: this.salesRevenue - (this.sumTransferAmount + this.sumFee),
        Detail: this.dataTransfer.map((item) => ({
          ItemNo: item.itemNo,
          PayinDate: item.depositDate,
          BankAccount: item.bankAccount,
          BankName: item.bankName,
          BankGL: item.glBank,
          PayinTypeCode: item.payinType,
          PayinType: item.payinTypeName,
          PayinAmount: parseFloat(item.transferAmount),
          PayinFee: parseFloat(item.fee),
          Remark: item.remark,
        })),
        CreateBy: this.infoLogin.samAccount,
      };
      Swal.fire({
        html: `Do you want submit form ?`,
        icon: "warning",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: "#0c80c4",
        cancelButtonColor: "#C0C0C0",
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.InsertTransferPayin(TransferData);
        }
      });
    },
    async InsertTransferPayin(val) {
      this.loadingDialog = true;
      const response = await axios.post(
        `${this.EndpointPortal}/ApiPayin/Payin/v1/PostTransferPayin`,
        val
      );
      if (response.data.statusCode.statusCode == 200) {
        this.loadingDialog = false;
        Swal.fire({
          html: `Successfully <br/> <strong>Payin ID: ${response.data.formID}</strong>`,
          icon: "success",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonColor: "#0c80c4",
          cancelButtonColor: "#C0C0C0",
          confirmButtonText: "OK",
        }).then(async (result) => {
          if (result.isConfirmed) {
            if (this.FormID) {
              this.getTransferPayin(this.formDate, this.toDate, this.mDepotSearch);
            }
            this.clearFormPayin();
            this.dialogTransferPayin = false;
          }
        });
      } else if (response.data.statusCode.statusCode == 409) {
        this.loadingDialog = false;
        Swal.fire({
          html: `409 Duplicate record`,
          icon: "error",
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonColor: "#0c80c4",
          cancelButtonColor: "#C0C0C0",
          confirmButtonText: "OK",
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
    },
    async getTransferPayin() {
      if (isEmpty(this.mDepotSearch)) {
        this.showResult = true;
        return (this.msgResult = "Depot can't be null.");
      }
      let pPayin = {
        depotCode: this.mDepotSearch.depotCode,
        createDate: this.formDate,
        curentDate: this.toDate,
      };
      this.loadingDialog = true;
      const response = await axios.post(
        `${this.EndpointPortal}/ApiPayin/Payin/v1/GetPayin`,
        pPayin
      );
      if (response.data.statusCode.statusCode == 200) {
        this.loadingDialog = false;
        if (response.data.results == null) {
          Swal.fire({
            text: `Record not found.`,
            icon: "warning",
            showCancelButton: false,
            allowOutsideClick: false,
            confirmButtonColor: "#0c80c4",
            cancelButtonColor: "#C0C0C0",
            confirmButtonText: "Ok",
          });
        } else {
          this.DateDisibled = true;
          this.itemPayin = [];
          response.data.results.forEach((element, index) =>
            this.itemPayin.push({
              formID: element.formID,
              sellDate: element.sellDate,
              displaySaleCode: `${element.saleCode} - ${element.saleName}`,
              saleCode: element.saleCode,
              saleType: element.saleType,
              totalPayin: element.total_Payin,
              totalSell: element.total_Sell,
              totalFee: element.total_Fee,
              totalDiff: element.total_Diff,
              flagStatus: element.flagStatus,
              depotCode: element.depotCode,
              depotName: element.depotName,
              customerCode: element.customerCode,
              costCenter: element.costCenter,
              updateBy: element.updateBy,
              updateDate: element.updateDate,
            })
          );
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
    },
    clearSearch() {
      this.DateDisibled = false;
      this.selected = [];
      this.itemPayin = [];
      this.mDepotSearch = "";
      if (this.depotItem.length == 1) {
        this.mDepotSearch = this.depotItem[0];
        this.mDepot = this.depotItem[0];
      }
    },
    async ConfirmPayin() {
      Swal.fire({
        html: `Do you want Confirm Payin`,
        icon: "warning",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: "#0c80c4",
        cancelButtonColor: "#C0C0C0",
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.loadingDialog = true;
          let dataConfirmPayin = [];
          this.selected.forEach((element, index) =>
            dataConfirmPayin.push({
              formID: element.formID,
              updateBy: this.infoLogin.samAccount,
            })
          );
          const response = await axios.post(
            `${this.EndpointPortal}/ApiPayin/Payin/v1/PostUpdateFlagStatusPayin`,
            dataConfirmPayin
          );
          if (response.data.statusCode.statusCode == 200) {
            this.loadingDialog = false;
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
                this.selected = [];
                this.itemPayin = [];
                this.getTransferPayin(this.formDate, this.toDate, this.mDepotSearch);
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
    async deleteTransferPayin(val) {
      Swal.fire({
        html: `Do you want delete <br/> <strong>Payin ID: ${val.formID}</strong>`,
        icon: "warning",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: "#0c80c4",
        cancelButtonColor: "#C0C0C0",
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.loadingDialog = true;
          const response = await axios.post(
            `${this.EndpointPortal}/ApiPayin/Payin/v1/PostDelTransferPayin?FormID=${val.formID}`
          );
          if (response.data.statusCode.statusCode == 200) {
            this.loadingDialog = false;
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
                this.selected = [];
                this.itemPayin = [];
                this.getTransferPayin(this.formDate, this.toDate, this.mDepotSearch);
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
    async editTrasferPayin(val) {
      this.loadingDialog = true;
      this.mEditTrasferPayin = val;
      this.FormID = val.formID;
      this.DisplayFormID = val.updateBy
        ? `Confirm by : ${val.updateBy} (${functions.DateYYYYMMDD_HHMM(val.updateDate)})`
        : "";
      const response = await axios.get(
        `${this.EndpointPortal}/ApiPayin/Payin/v1/GetPayinDetail?FormID=${val.formID}`
      );
      if (response.data.statusCode.statusCode == 200) {
        this.loadingDialog = false;
        this.dialogTransferPayin = true;
        this.viewTransferPayin = val.flagStatus == "Y" ? true : false;
        this.mDepot = {
          depotCode: val.depotCode,
          depotName: val.depotName,
          costcenter: val.costCenter,
        };
        this.salesDate = val.sellDate;
        this.sumTransferAmount = val.totalPayin;
        this.sumFee = val.totalFee;
        this.dataTransfer = [];
        response.data.results.forEach((element, index) =>
          this.dataTransfer.push({
            itemNo: element.itemno,
            bankName: element.bankName,
            bankAccount: element.bankAccount,
            depositDate: element.payinDate,
            payinType: element.payinTypeCode,
            payinTypeName: element.payinType,
            transferAmount: Number(element.payinAmount).toFixed(2),
            fee: Number(element.payinFee).toFixed(2),
            glBank: element.bankGL,
            remark: element.remark,
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
    async ClearingPayin() {
      Swal.fire({
        html: `Do you want Clearing Payin`,
        icon: "warning",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: "#0c80c4",
        cancelButtonColor: "#C0C0C0",
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result.isConfirmed) {
          let dataClearingPayin = [];
          this.selected.forEach((element, index) =>
            dataClearingPayin.push({
              formID: element.formID,
              updateBy: this.infoLogin.samAccount,
            })
          );
          this.loadingDialog = true;
          const response = await axios.post(
            `${this.EndpointPortal}/ApiPayin/Payin/v1/PostUpdateFlagStatusClearing`,
            dataClearingPayin
          );
          if (response.data.statusCode.statusCode == 200) {
            this.loadingDialog = false;
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
                this.selected = [];
                this.itemPayin = [];
                this.getTransferPayin(this.formDate, this.toDate, this.mDepotSearch);
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
    clearFormPayin() {
      this.dialogTransferPayin = false;
      this.viewTransferPayin = false;
      this.mEditTrasferPayin = {};
      this.dataTransfer = [];
      this.saleAreaItem = [];
      this.saleTypeItem = [];
      this.mDepot = "";
      this.mPayinType = "";
      this.mSaleType = "";
      this.mSaleArea = "";
      this.sumTransferAmount = 0;
      this.sumFee = 0;
      this.salesRevenue = "";
      this.depositDate = functions.getSysDate().format;
      this.salesDate = functions.getSysDate().format;
      this.mBank = "";
      this.mRemark = "";
      this.mTransferAmount = "";
      this.mFee = "";
      this.FormID = "";
      this.editMode = false;
      this.editId = 0;
      this.editItem = {};
      if (this.depotItem.length == 1) {
        this.mDepotSearch = this.depotItem[0];
        this.mDepot = this.depotItem[0];
      }
      this.DisplayFormID = "";
      this.mClearing = false;
    },
    exportToExcel() {
      let dataExcelSheet = this.itemPayin.map((element) => [
        element.formID,
        element.sellDate,
        element.displaySaleCode,
        element.saleType,
        element.totalPayin,
        element.totalSell,
        element.totalFee,
        element.totalDiff,
      ]);

      // Add headers
      const headers = [
        "Payin ID",
        "Sell Date",
        "Display Sale Code",
        "Sale Type",
        "Total Payin",
        "Total Sell",
        "Total Fee",
        "Total Diff",
      ];

      // Combine headers and data
      const wsData = [headers, ...dataExcelSheet];

      // Convert data objects to worksheet with number formatting
      const ws = XLSX.utils.aoa_to_sheet(wsData);

      // Apply number formatting to columns E, F, G, H (which are 4, 5, 6, 7 in 0-indexed)
      const range = XLSX.utils.decode_range(ws["!ref"]);
      for (let col = 4; col <= 7; col++) {
        for (let row = 1; row <= range.e.r; row++) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
          if (ws[cellAddress]) {
            ws[cellAddress].z = "#,##0.00";
          }
        }
      }

      // Minimize metadata
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Transaction Payin");

      // Apply minimal styling (if needed)
      ws["!cols"] = headers.map(() => ({ wpx: 150 }));

      // Generate Excel file and trigger download
      XLSX.writeFile(wb, "Transaction_PayIn.xlsx", { compression: true });
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
/* .inner-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 5px;
  background-color: #f9f9f9;
  height: 3.3rem;
} */
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
  padding: 1rem;
  margin-top: 1rem;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  height: 3.3rem;
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
@media (max-width: 600px) {
  .responsive-item {
    width: calc(50% - 1rem);
  }
  .inner-card {
    height: auto;
  }
}
</style>

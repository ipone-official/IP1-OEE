import Vue from "vue";
import Vuex from "vuex";
import pathify from "vuex-pathify";
import { make } from "vuex-pathify";
import functions from '@/plugins/functions'

pathify.options.mapping = "simple";

const getDefaultState = () => ({
  FormID: '',
  formDate: `${functions.getSysDate().format.substring(0,6)}01`,
  toDate: functions.getSysDate().format,
  manualPDF: false,
  flagGetTProcess: false,
  machineDetail: {
    operatorEdit: false,
    managerEdit: false,
    supervisorEdit: false,
    adminEdit: false,
    dialogTransactionDetail: false,
    selectTransactionTProcess: [],
    machineStd: 0,
    QtyDz: 0,
    itemDamageTable: [],
    itemProblemTable: [],
  }
});
const loginInfo = () => ({
  drawer: false,
  toggle: false,
  headerProject: 'OEE',
  selectedIndexStr: 1,
  imageProfile: "",
  EndpointPortal: 'https://portal.ip-one.com',
  infoLogin: {
    isLogin: false,
    authentication: false,
    name: '',
    firstName: '',
    lastName: '',
    email: '',
    empId: '',
    locked: false,
    group:[],
    samAccount: ''
  },
})
const state = Object.assign(getDefaultState(), loginInfo());

const mutations = make.mutations(state);
const resetMutation = {
  resetState(state) {
    Object.assign(state, getDefaultState());
  },
};

Object.assign(mutations, resetMutation);

const actions = make.actions(state);
const getters = make.getters(state);

Vue.use(Vuex);

// create store
export default new Vuex.Store({
  modules: {},
  plugins: [pathify.plugin],
  state,
  mutations,
  actions,
  getters,
});

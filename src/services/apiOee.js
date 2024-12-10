// src/services/apiService.js
import axios from 'axios';

// สร้าง instance ของ axios เพื่อกำหนดค่า base URL และ config เบื้องต้น
const api = axios.create({
  baseURL: 'https://portal.ip-one.com/ApiOEE/', // เปลี่ยน URL เป็น API ที่คุณต้องการ
  timeout: 0, // ตั้งค่า timeout สำหรับการเชื่อมต่อ (หน่วยเป็นมิลลิวินาที)
  headers: {
    'Content-Type': 'application/json',
  },
});


  export const gReasonMaster = async () => {
    try {
      const response = await api.get('OEE/v1/gReasonMaster');
      return response.data;
    } catch (error) {
      console.error('Error gReasonMaster in:', error);
      throw error;
    }
  };

  export const gProblemMaster = async () => {
    try {
      const response = await api.get('OEE/v1/gProblemMaster');
      return response.data;
    } catch (error) {
      console.error('Error gProblemMaster in:', error);
      throw error;
    }
  };

  export const iReasonMaster = async (data) => {
    try {
      const response = await api.post('OEE/v1/InsertReasonMaster', data);
      return response.data;
    } catch (error) {
      console.error('Error InsertReasonMaster in:', error);
      throw error;
    }
  };

  export const dReasonMaster = async (reasonDescID) => {
    try {
      const response = await api.post(`OEE/v1/DeleteReasonMaster`, {
        reasonDescID: reasonDescID, // ระบุฟิลด์อย่างชัดเจน
      });
  
      return response.data;
    } catch (error) {
      console.error('Error DeleteReasonMaster:', error);
      throw error;
    }
  };
  
  export const iProblemMaster = async (data) => {
    try {
      const response = await api.post(`OEE/v1/InsertProblemMaster`, data);
  
      return response.data;
    } catch (error) {
      console.error('Error InsertProblemMaster:', error);
      throw error;
    }
  };

  export const dProblemMaster = async (data) => {
    try {
      const response = await api.post(`OEE/v1/DeleteProblemMaster`, data);
  
      return response.data;
    } catch (error) {
      console.error('Error DeleteProblemMaster:', error);
      throw error;
    }
  };
  
  export const gMachines= async () => {
    try {
      const response = await api.get('OEE/v1/GetMachines');
      return response.data;
    } catch (error) {
      console.error('Error GetMachines in:', error);
      throw error;
    }
  };

  export const gLineProcess = async () => {
    try {
      const response = await api.get('OEE/v1/GetLineProcessAll');
      return response.data;
    } catch (error) {
      console.error('Error GetLineProcessAll in:', error);
      throw error;
    }
  };
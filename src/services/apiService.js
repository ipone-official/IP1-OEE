// src/services/apiService.js
import axios from 'axios';

// สร้าง instance ของ axios เพื่อกำหนดค่า base URL และ config เบื้องต้น
const api = axios.create({
  baseURL: 'https://portal.ip-one.com/adsControlV2/', // เปลี่ยน URL เป็น API ที่คุณต้องการ
  timeout: 0, // ตั้งค่า timeout สำหรับการเชื่อมต่อ (หน่วยเป็นมิลลิวินาที)
  headers: {
    'Content-Type': 'application/json',
  },
});

export function isTokenNearExpiration() {
    const token = localStorage.getItem('accessTokenOee');
    if (!token) return true; // ไม่มี Token ถือว่าใกล้หมดอายุ
    const { exp } = JSON.parse(atob(token.split('.')[1])); // Decode JWT Payload
    const now = Math.floor(Date.now() / 1000); // เวลาปัจจุบันในหน่วยวินาที
    return exp - now < 300; // หากเหลือเวลาน้อยกว่า 5 นาที
  }
  
  export const loginUser = async (username, password) => {
    try {
      const response = await api.post('Ads/v1/Authentication', {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  export const RenewToken = async (refreshToken) => {
    try {
      const response = await api.post('Ads/v1/RenewToken', 
        refreshToken,
      );
      localStorage.setItem("accessTokenOee", response.data.accessToken);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  };

  export const getUser = async (username) => {
    try {
      const response = await api.post('Ads/v1/GetUser', {
        username,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  };

  export const ValidateJwtToken = async () => {
    try {
      const accessTokenOee = localStorage.getItem("accessTokenOee");
      if (!accessTokenOee) {
        throw new Error("Access token not found in localStorage");
      }
      const response = await api.get(`Jwt/v1/ValidateJwtToken?token=${accessTokenOee}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching token:', error);
      throw error;
    }
  };
import axiosClient from './axiosClient';

const userApi = {
    getInfoUser: ({ token }) => {
        const url = '/user';
        return axiosClient.get(url, { headers: { 'authenticate-jwt': token } });
    },
    sendOtpActiveUser: ({ token }) => {
        const url = '/user/active';
        return axiosClient.post(url, {}, { headers: { 'authenticate-jwt': token } });
    },
    activeUser: ({ otp, token }) => {
        const url = '/user/active';
        return axiosClient.put(url, { otp }, { headers: { 'authenticate-jwt': token } });
    },
    getFieldEquipments: ({ token }) => {
        const url = '/customer/farmstay/equipments';
        return axiosClient.get(url, { headers: { 'authenticate-jwt': token } });
    },
    getLatestDataEquipments: ({ token, field }) => {
        const url = '/customer/farmstay/equipments/fields/latest_data';
        return axiosClient.get(url, { headers: { 'authenticate-jwt': token }, params: { field } });
    },
};

export default userApi;

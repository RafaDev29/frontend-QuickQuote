import axiosInstance from '@/config/http.config';
// import axios from 'axios';

const baseURL = process.env.VUE_APP_BASE_URL;


export function listcotizaciones( token ) {

    return axiosInstance.get(`${baseURL}/cotizacion/listar`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
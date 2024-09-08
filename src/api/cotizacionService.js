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


export function deleteCotizacion( token , id) {

    return axiosInstance.delete(`${baseURL}/cotizacion/eliminar/${id}`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}


export function aproveCotizacion( token, id , payload ) {

    return axiosInstance.put(`${baseURL}/cotizacion/aprobar/${id}`,payload,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}



export function createCotizaciones( token, payload ) {

    return axiosInstance.post(`${baseURL}/cotizacion/crear`,payload,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
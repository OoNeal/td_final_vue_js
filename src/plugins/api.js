import axios from 'axios';
import { useAuthStore } from '@/stores/Auth.js'

export default {
    install: function (app) {
        console.log('api',useAuthStore().apiKey);
        console.log('api',useAuthStore().apiKey !== null);
        app.config.globalProperties.$api = axios.create({
            baseURL : 'https://timely.edu.netlor.fr/api/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "key=" + useAuthStore().apiKey
            }
        })
    }
}
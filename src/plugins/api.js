import axios from 'axios';

export default {
    install: function (app, options) {
        app.config.globalProperties.$api = axios.create({
            baseURL : 'https://donations.edu.netlor.fr/api/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'key=rcMY3y*B,9Vj'
            }
        })
    }
}
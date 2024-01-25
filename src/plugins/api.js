import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://timely.edu.netlor.fr/api/',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'F,psZtX+nVWI'
    }
});

export default instance;

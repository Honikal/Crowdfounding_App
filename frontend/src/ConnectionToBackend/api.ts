import axios from 'axios';

//Acá, conectaremos frontend con backend
const api = axios.create({
    baseURL: 'http://localhost:3001', 
    headers: {
        'Content-Type': 'application/json'
    },
})
export default api;
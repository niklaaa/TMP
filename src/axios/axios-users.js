import axios from "axios";


const instance = (options) => axios.create({
    baseURL: "http://35.246.207.122:8000/", // "http://neurostestsite.ddns.net:8000/users" kada api users bude spreman
    timeout: 15000,
    headers: {
        Authorization: 'Token ' + options.token,
    }
})


export default instance;

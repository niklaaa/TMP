import axios from "axios";


const instance = (options) => axios.create({
    baseURL: "http://35.246.207.122:8000/meetings/",
    timeout: 15000,
    headers: {
        Authorization: 'Token ' + options.token,
    }
})


export default instance;

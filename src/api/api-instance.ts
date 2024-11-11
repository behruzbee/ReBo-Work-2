import axios from "axios";

const instance = axios.create({
    baseURL: "https://rebo-work.uz/api",
    headers: {
        "Content-Type": "application/json"
    }
});

export default instance;